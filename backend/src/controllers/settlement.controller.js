import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import settlementService from "../services/settlement.service.js";
import balanceService from "../services/balance.service.js";
import { GroupMember } from "../model/index.js";

export const createSettlement = asyncHandler(async (req, res) => {
  const { groupId, paidTo, amount, notes } = req.body;

  // Verify membership
  const isMember = await GroupMember.findOne({
    where: { groupId, userId: req.user.id, isActive: true },
  });

  if (!isMember) {
    throw new ApiError(403, "You are not a member of this group");
  }

  const settlement = await settlementService.createSettlement(
    groupId,
    req.user.id,
    paidTo,
    amount,
    notes,
  );

  res
    .status(201)
    .json(
      new ApiResponse(201, { settlement }, "Settlement recorded successfully"),
    );
});

export const getGroupSettlements = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  // Verify membership
  const isMember = await GroupMember.findOne({
    where: { groupId, userId: req.user.id, isActive: true },
  });

  if (!isMember) {
    throw new ApiError(403, "You are not a member of this group");
  }

  const settlements = await settlementService.getGroupSettlements(groupId);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { settlements },
        "Settlements retrieved successfully",
      ),
    );
});

export const getGroupBalance = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  // Verify membership
  const isMember = await GroupMember.findOne({
    where: { groupId, userId: req.user.id, isActive: true },
  });

  if (!isMember) {
    throw new ApiError(403, "You are not a member of this group");
  }

  const balances = await balanceService.calculateGroupBalances(groupId);

  res
    .status(200)
    .json(
      new ApiResponse(200, { balances }, "Balances calculated successfully"),
    );
});

export const getUserBalanceDetails = asyncHandler(async (req, res) => {
  const { groupId, userId } = req.params;

  // Verify membership
  const isMember = await GroupMember.findOne({
    where: { groupId, userId: req.user.id, isActive: true },
  });

  if (!isMember) {
    throw new ApiError(403, "You are not a member of this group");
  }

  const details = await balanceService.getUserBalanceDetails(groupId, userId);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { details },
        "Balance details retrieved successfully",
      ),
    );
});

export const getSuggestedSettlements = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  // Verify membership
  const isMember = await GroupMember.findOne({
    where: { groupId, userId: req.user.id, isActive: true },
  });

  if (!isMember) {
    throw new ApiError(403, "You are not a member of this group");
  }

  const suggestions = await settlementService.suggestOptimalSettlement(groupId);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { suggestions },
        "Settlement suggestions generated successfully",
      ),
    );
});
