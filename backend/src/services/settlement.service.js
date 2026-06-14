// backend/src/services/settlement.service.js
import { Settlement, User } from "../models/index.js";
import balanceService from "./balance.service.js";

class SettlementService {
  async createSettlement(groupId, paidBy, paidTo, amount, notes = null) {
    const settlement = await Settlement.create({
      groupId,
      paidBy,
      paidTo,
      amount,
      notes,
    });

    return await Settlement.findByPk(settlement.id, {
      include: [
        { model: User, as: "payer", attributes: ["id", "name", "email"] },
        { model: User, as: "receiver", attributes: ["id", "name", "email"] },
      ],
    });
  }

  async getGroupSettlements(groupId) {
    return await Settlement.findAll({
      where: { groupId },
      include: [
        { model: User, as: "payer", attributes: ["id", "name", "email"] },
        { model: User, as: "receiver", attributes: ["id", "name", "email"] },
      ],
      order: [["settledAt", "DESC"]],
    });
  }

  async suggestOptimalSettlement(groupId) {
    return await balanceService.suggestSettlements(groupId);
  }
}

export default new SettlementService();
