import csv from "csv-parser";
import streamifier from "streamifier";
import { Expense, ExpenseSplit, User, GroupMember } from "../model/index.js";
import {
  ANOMALY_TYPES,
  ANOMALY_ACTIONS,
  SPLIT_TYPES,
  CURRENCIES,
  EXCHANGE_RATES,
} from "../config/constants.js";
import sequelize from "../config/db.js";

class ImportService {
  constructor() {
    this.anomalies = [];
    this.rowCount = 0;
    this.successCount = 0;
    this.failCount = 0;
  }

  async parseCSV(buffer) {
    const rows = [];

    return new Promise((resolve, reject) => {
      streamifier
        .createReadStream(buffer)
        .pipe(csv({
          mapHeaders: ({ header }) => {
            const map = {
              'date': 'Date',
              'description': 'Description',
              'paid_by': 'PaidBy',
              'amount': 'Amount',
              'currency': 'Currency',
              'split_type': 'SplitType',
              'split_with': 'SplitWith',
              'split_details': 'SplitDetails',
              'notes': 'Notes'
            };
            return map[header.trim().toLowerCase()] || header.trim();
          }
        }))
        .on("data", (row) => {
          this.rowCount++;
          rows.push({ ...row, rowNumber: this.rowCount });
        })
        .on("end", () => resolve(rows))
        .on("error", reject);
    });
  }

  async processImport(groupId, buffer, userId) {
    this.anomalies = [];
    this.rowCount = 0;
    this.successCount = 0;
    this.failCount = 0;

    try {
      const rows = await this.parseCSV(buffer);

      // Get group members
      const members = await GroupMember.findAll({
        where: { groupId },
        include: [{ model: User, as: "user" }],
      });

      const memberMap = {};
      members.forEach((m) => {
        memberMap[m.user.name.toLowerCase()] = {
          userId: m.user.id,
          joinedAt: m.joinedAt,
          leftAt: m.leftAt,
        };
      });

      // Detect anomalies
      const processedRows = await this.detectAnomalies(rows, memberMap);

      // Import valid rows
      const importResults = await this.importRows(
        groupId,
        processedRows,
        memberMap,
      );

      return {
        totalRows: this.rowCount,
        successfulRows: this.successCount,
        failedRows: this.failCount,
        anomalies: this.anomalies,
        importedExpenses: importResults,
      };
    } catch (error) {
      throw error;
    }
  }

  async detectAnomalies(rows, memberMap) {
    const processedRows = [];
    const rowHashes = new Map();

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const anomaliesForRow = [];

      // 1. Check for missing fields
      if (!row.Description || !row.Amount || !row.PaidBy || !row.Date) {
        anomaliesForRow.push({
          type: ANOMALY_TYPES.MISSING_FIELDS,
          message: "Missing required fields",
          action: ANOMALY_ACTIONS.SKIP,
        });
      }

      // 2. Check for invalid date
      const date = new Date(row.Date);
      if (isNaN(date.getTime())) {
        anomaliesForRow.push({
          type: ANOMALY_TYPES.INVALID_DATE,
          message: `Invalid date: ${row.Date}`,
          action: ANOMALY_ACTIONS.SKIP,
        });
      }

      // 3. Check for negative amount
      const amount = parseFloat(row.Amount);
      if (amount < 0) {
        anomaliesForRow.push({
          type: ANOMALY_TYPES.NEGATIVE_AMOUNT,
          message: "Negative amount detected - might be a refund",
          action: ANOMALY_ACTIONS.REQUIRE_APPROVAL,
        });
      }

      // 4. Check for settlement disguised as expense
      if (
        row.Description &&
        (row.Description.toLowerCase().includes("settlement") ||
          row.Description.toLowerCase().includes("paid back"))
      ) {
        anomaliesForRow.push({
          type: ANOMALY_TYPES.SETTLEMENT_AS_EXPENSE,
          message: "Appears to be a settlement, not an expense",
          action: ANOMALY_ACTIONS.REQUIRE_APPROVAL,
        });
      }

      // 5. Check if payer is in group
      const payer = memberMap[row.PaidBy?.toLowerCase()];
      if (!payer) {
        anomaliesForRow.push({
          type: ANOMALY_TYPES.MEMBER_NOT_IN_GROUP,
          message: `Payer "${row.PaidBy}" not found in group`,
          action: ANOMALY_ACTIONS.SKIP,
        });
      }

      // 6. Check currency mismatch
      const currency = row.Currency?.toUpperCase() || "INR";
      if (currency === "USD" && amount > 0) {
        anomaliesForRow.push({
          type: ANOMALY_TYPES.CURRENCY_MISMATCH,
          message: `USD amount will be converted to INR at rate ${EXCHANGE_RATES.USD_TO_INR}`,
          action: ANOMALY_ACTIONS.IMPORT_WITH_CORRECTION,
        });
      }

      // 7. Check for duplicates
      const rowHash = `${row.Description}_${row.Amount}_${row.PaidBy}_${row.Date}`;
      if (rowHashes.has(rowHash)) {
        anomaliesForRow.push({
          type: ANOMALY_TYPES.DUPLICATE,
          message: `Duplicate of row ${rowHashes.get(rowHash)}`,
          action: ANOMALY_ACTIONS.REQUIRE_APPROVAL,
        });
      } else {
        rowHashes.set(rowHash, row.rowNumber);
      }

      // 8. Check if member left before expense
      if (payer && payer.leftAt && new Date(payer.leftAt) < date) {
        anomaliesForRow.push({
          type: ANOMALY_TYPES.MEMBER_LEFT_BEFORE_EXPENSE,
          message: `${row.PaidBy} had left the group before this expense`,
          action: ANOMALY_ACTIONS.REQUIRE_APPROVAL,
        });
      }

      // 9. Validate split
      const splitAnomaly = this.validateSplit(row, memberMap);
      if (splitAnomaly) {
        anomaliesForRow.push(splitAnomaly);
      }

      // Check split participants in memberMap
      const participants = this.parseParticipants(row.SplitWith, row.SplitDetails);
      participants.forEach((p) => {
        if (!memberMap[p.name.toLowerCase()]) {
          anomaliesForRow.push({
            type: ANOMALY_TYPES.MEMBER_NOT_IN_GROUP,
            message: `Split participant "${p.name}" not found in group`,
            action: ANOMALY_ACTIONS.SKIP,
          });
        }
      });

      // 10. Check for inconsistent format
      if (
        row.SplitType &&
        !Object.values(SPLIT_TYPES).includes(row.SplitType.toUpperCase())
      ) {
        anomaliesForRow.push({
          type: ANOMALY_TYPES.INCONSISTENT_FORMAT,
          message: `Unknown split type: ${row.SplitType}`,
          action: ANOMALY_ACTIONS.IMPORT_WITH_CORRECTION,
        });
      }

      if (anomaliesForRow.length > 0) {
        this.anomalies.push({
          rowNumber: row.rowNumber,
          data: row,
          anomalies: anomaliesForRow,
        });
      }

      processedRows.push({
        ...row,
        anomalies: anomaliesForRow,
        shouldSkip: anomaliesForRow.some(
          (a) => a.action === ANOMALY_ACTIONS.SKIP,
        ),
      });
    }

    return processedRows;
  }

  validateSplit(row, memberMap) {
    const splitType = row.SplitType?.toUpperCase() || "EQUAL";
    const amount = parseFloat(row.Amount);

    if (splitType === "PERCENTAGE") {
      const participants = this.parseParticipants(row.SplitWith, row.SplitDetails);
      let totalPercentage = 0;

      participants.forEach((p) => {
        totalPercentage += p.value || 0;
      });

      if (Math.abs(totalPercentage - 100) > 0.01) {
        return {
          type: ANOMALY_TYPES.INVALID_PERCENTAGE,
          message: `Percentages sum to ${totalPercentage}%, not 100%`,
          action: ANOMALY_ACTIONS.IMPORT_WITH_CORRECTION,
        };
      }
    }

    if (splitType === "EXACT") {
      const participants = this.parseParticipants(row.SplitWith, row.SplitDetails);
      let totalAmount = 0;

      participants.forEach((p) => {
        totalAmount += p.value || 0;
      });

      if (Math.abs(totalAmount - amount) > 0.01) {
        return {
          type: ANOMALY_TYPES.AMOUNT_MISMATCH,
          message: `Split amounts (${totalAmount}) don't match expense (${amount})`,
          action: ANOMALY_ACTIONS.IMPORT_WITH_CORRECTION,
        };
      }
    }

    return null;
  }

  parseParticipants(splitWith, splitDetails) {
    if (!splitWith) return [];

    const participants = [];
    const parts = splitWith.split(/[;,]/);

    parts.forEach((part) => {
      const match = part.match(/([^:]+):?(\d+\.?\d*)?/);
      if (match) {
        const name = match[1].trim();
        let value = match[2] ? parseFloat(match[2]) : null;
        
        if (value === null && splitDetails) {
          const detailParts = splitDetails.split(/[;,]/);
          const detail = detailParts.find(d => d.toLowerCase().includes(name.toLowerCase()));
          if (detail) {
            const detailMatch = detail.match(/(\d+\.?\d*)/);
            if (detailMatch) {
              value = parseFloat(detailMatch[1]);
            }
          }
        }
        
        participants.push({
          name,
          value,
        });
      }
    });

    return participants;
  }

  async importRows(groupId, rows, memberMap) {
    const importedExpenses = [];
    const transaction = await sequelize.transaction();

    try {
      for (const row of rows) {
        if (row.shouldSkip) {
          this.failCount++;
          continue;
        }

        // Handle approvals - for now, skip items requiring approval
        const requiresApproval = row.anomalies.some(
          (a) => a.action === ANOMALY_ACTIONS.REQUIRE_APPROVAL,
        );

        if (requiresApproval) {
          this.failCount++;
          continue;
        }

        const payer = memberMap[row.PaidBy?.toLowerCase()];
        const currency = row.Currency?.toUpperCase() || "INR";
        const amount = Math.abs(parseFloat(row.Amount));
        const amountInINR =
          currency === "USD" ? amount * EXCHANGE_RATES.USD_TO_INR : amount;
        const splitType = row.SplitType?.toUpperCase() || "EQUAL";

        const expense = await Expense.create(
          {
            groupId,
            description: row.Description,
            amount,
            currency,
            amountInINR,
            paidBy: payer.userId,
            expenseDate: new Date(row.Date),
            splitType,
            category: row.Category || null,
            notes: row.Notes || null,
          },
          { transaction },
        );

        // Create splits
        let participants = this.parseParticipants(row.SplitWith, row.SplitDetails);
        if (participants.length === 0 && splitType === "EQUAL") {
          participants = Object.keys(memberMap).map((name) => ({
            name,
            value: null,
          }));
        }
        const splits = await this.calculateSplits(
          expense,
          participants,
          memberMap,
          splitType,
        );

        for (const split of splits) {
          await ExpenseSplit.create(
            {
              expenseId: expense.id,
              userId: split.userId,
              amountOwed: split.amountOwed,
              percentage: split.percentage,
              shares: split.shares,
            },
            { transaction },
          );
        }

        importedExpenses.push(expense.id);
        this.successCount++;
      }

      await transaction.commit();
      return importedExpenses;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async calculateSplits(expense, participants, memberMap, splitType) {
    const splits = [];
    const totalAmount = parseFloat(expense.amountInINR);

    if (splitType === "EQUAL") {
      const perPerson = parseFloat((totalAmount / (participants.length || 1)).toFixed(2));
      let sum = 0;
      participants.forEach((participant, index) => {
        const member = memberMap[participant.name.toLowerCase()];
        if (member) {
          let amountOwed;
          if (index === participants.length - 1) {
            amountOwed = parseFloat((totalAmount - sum).toFixed(2));
          } else {
            amountOwed = perPerson;
            sum += perPerson;
          }
          splits.push({
            userId: member.userId,
            amountOwed,
          });
        }
      });
    } else if (splitType === "EXACT") {
      for (const participant of participants) {
        const member = memberMap[participant.name.toLowerCase()];
        if (member && participant.value) {
          splits.push({
            userId: member.userId,
            amountOwed: parseFloat(participant.value.toFixed(2)),
          });
        }
      }
    } else if (splitType === "PERCENTAGE") {
      for (const participant of participants) {
        const member = memberMap[participant.name.toLowerCase()];
        if (member && participant.value) {
          const amount = (totalAmount * participant.value) / 100;
          splits.push({
            userId: member.userId,
            amountOwed: parseFloat(amount.toFixed(2)),
            percentage: participant.value,
          });
        }
      }
    } else if (splitType === "SHARES") {
      const totalShares = participants.reduce(
        (sum, p) => sum + (p.value || 1),
        0,
      );
      let sum = 0;
      participants.forEach((participant, index) => {
        const member = memberMap[participant.name.toLowerCase()];
        if (member) {
          const shares = participant.value || 1;
          let amountOwed;
          if (index === participants.length - 1) {
            amountOwed = parseFloat((totalAmount - sum).toFixed(2));
          } else {
            const shareAmount = parseFloat(
              ((totalAmount * shares) / totalShares).toFixed(2),
            );
            amountOwed = shareAmount;
            sum += shareAmount;
          }
          splits.push({
            userId: member.userId,
            amountOwed,
            shares,
          });
        }
      });
    }

    return splits;
  }
}

export default ImportService;
