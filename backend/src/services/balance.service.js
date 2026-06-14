// backend/src/services/balance.service.js
import { Expense, ExpenseSplit, Settlement, User } from "../models/index.js";
import { Op } from "sequelize";

class BalanceService {
  async calculateGroupBalances(groupId) {
    // Get all expenses for the group
    const expenses = await Expense.findAll({
      where: { groupId },
      include: [
        {
          model: ExpenseSplit,
          as: "splits",
          include: [
            { model: User, as: "user", attributes: ["id", "name", "email"] },
          ],
        },
        {
          model: User,
          as: "payer",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    // Get all settlements for the group
    const settlements = await Settlement.findAll({
      where: { groupId },
      include: [
        { model: User, as: "payer", attributes: ["id", "name", "email"] },
        { model: User, as: "receiver", attributes: ["id", "name", "email"] },
      ],
    });

    // Initialize balance map
    const balances = {};

    // Process expenses
    expenses.forEach((expense) => {
      const payerId = expense.paidBy;
      const totalAmount = parseFloat(expense.amountInINR);

      // Payer paid the full amount
      if (!balances[payerId]) balances[payerId] = {};

      expense.splits.forEach((split) => {
        const owerId = split.userId;
        const owedAmount = parseFloat(split.amountOwed);

        if (payerId === owerId) return; // Skip self

        // Initialize nested object
        if (!balances[payerId]) balances[payerId] = {};
        if (!balances[owerId]) balances[owerId] = {};
        if (!balances[payerId][owerId]) balances[payerId][owerId] = 0;
        if (!balances[owerId][payerId]) balances[owerId][payerId] = 0;

        // Payer is owed this amount by owerId
        balances[payerId][owerId] += owedAmount;
      });
    });

    // Process settlements
    settlements.forEach((settlement) => {
      const payerId = settlement.paidBy;
      const receiverId = settlement.paidTo;
      const amount = parseFloat(settlement.amount);

      if (!balances[payerId]) balances[payerId] = {};
      if (!balances[receiverId]) balances[receiverId] = {};
      if (!balances[receiverId][payerId]) balances[receiverId][payerId] = 0;

      // Settlement reduces what payer owes to receiver
      balances[receiverId][payerId] -= amount;
    });

    // Simplify balances (net out)
    const simplifiedBalances = {};

    Object.keys(balances).forEach((person1) => {
      Object.keys(balances[person1]).forEach((person2) => {
        const amount1to2 = balances[person1][person2] || 0;
        const amount2to1 = balances[person2]?.[person1] || 0;

        const netAmount = amount1to2 - amount2to1;

        if (netAmount > 0.01) {
          // person2 owes person1
          if (!simplifiedBalances[person2]) simplifiedBalances[person2] = {};
          simplifiedBalances[person2][person1] = parseFloat(
            netAmount.toFixed(2),
          );
        }
      });
    });

    return simplifiedBalances;
  }

  /**
   * Get detailed balance breakdown for a user in a group
   * Shows which expenses contribute to their balance
   */
  async getUserBalanceDetails(groupId, userId) {
    const expenses = await Expense.findAll({
      where: {
        groupId,
        [Op.or]: [{ paidBy: userId }, { "$splits.userId$": userId }],
      },
      include: [
        {
          model: ExpenseSplit,
          as: "splits",
          include: [{ model: User, as: "user", attributes: ["id", "name"] }],
        },
        { model: User, as: "payer", attributes: ["id", "name"] },
      ],
    });

    const settlements = await Settlement.findAll({
      where: {
        groupId,
        [Op.or]: [{ paidBy: userId }, { paidTo: userId }],
      },
      include: [
        { model: User, as: "payer", attributes: ["id", "name"] },
        { model: User, as: "receiver", attributes: ["id", "name"] },
      ],
    });

    const details = {
      expenses: [],
      settlements: [],
      summary: {
        totalPaid: 0,
        totalOwed: 0,
        netBalance: 0,
      },
    };

    expenses.forEach((expense) => {
      const userSplit = expense.splits.find((s) => s.userId === userId);
      const isPayer = expense.paidBy === userId;

      if (isPayer) {
        details.summary.totalPaid += parseFloat(expense.amountInINR);
      }

      if (userSplit) {
        details.summary.totalOwed += parseFloat(userSplit.amountOwed);

        details.expenses.push({
          id: expense.id,
          description: expense.description,
          amount: expense.amountInINR,
          currency: expense.currency,
          date: expense.expenseDate,
          paidBy: expense.payer.name,
          yourShare: userSplit.amountOwed,
          youPaid: isPayer,
        });
      }
    });

    settlements.forEach((settlement) => {
      const isPayer = settlement.paidBy === userId;
      const amount = parseFloat(settlement.amount);

      details.settlements.push({
        id: settlement.id,
        amount,
        date: settlement.settledAt,
        paidBy: settlement.payer.name,
        paidTo: settlement.receiver.name,
        type: isPayer ? "paid" : "received",
      });

      if (isPayer) {
        details.summary.totalPaid += amount;
      } else {
        details.summary.totalOwed -= amount;
      }
    });

    details.summary.netBalance = parseFloat(
      (details.summary.totalPaid - details.summary.totalOwed).toFixed(2),
    );

    return details;
  }

  async suggestSettlements(groupId) {
    const balances = await this.calculateGroupBalances(groupId);

    // Get users data
    const userIds = new Set();
    Object.keys(balances).forEach((id) => {
      userIds.add(id);
      Object.keys(balances[id]).forEach((id2) => userIds.add(id2));
    });

    const users = await User.findAll({
      where: { id: Array.from(userIds) },
      attributes: ["id", "name", "email"],
    });

    const userMap = {};
    users.forEach((u) => {
      userMap[u.id] = u;
    });

    // Calculate net balance for each person
    const netBalances = {};

    Object.keys(balances).forEach((owerId) => {
      if (!netBalances[owerId]) netBalances[owerId] = 0;

      Object.keys(balances[owerId]).forEach((ownerId) => {
        if (!netBalances[ownerId]) netBalances[ownerId] = 0;

        const amount = balances[owerId][ownerId];
        netBalances[owerId] -= amount;
        netBalances[ownerId] += amount;
      });
    });

    const debtors = [];
    const creditors = [];

    Object.keys(netBalances).forEach((userId) => {
      const balance = netBalances[userId];
      if (balance < -0.01) {
        debtors.push({ userId, amount: -balance, user: userMap[userId] });
      } else if (balance > 0.01) {
        creditors.push({ userId, amount: balance, user: userMap[userId] });
      }
    });

    const settlements = [];

    while (debtors.length > 0 && creditors.length > 0) {
      const debtor = debtors[0];
      const creditor = creditors[0];

      const amount = Math.min(debtor.amount, creditor.amount);

      settlements.push({
        from: debtor.user,
        to: creditor.user,
        amount: parseFloat(amount.toFixed(2)),
      });

      debtor.amount -= amount;
      creditor.amount -= amount;

      if (debtor.amount < 0.01) debtors.shift();
      if (creditor.amount < 0.01) creditors.shift();
    }

    return settlements;
  }
}

export default new BalanceService();
