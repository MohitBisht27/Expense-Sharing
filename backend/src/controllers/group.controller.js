import { Op } from "sequelize";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Group, GroupMember, User, Expense } from "../models/index.js";

export const createGroup = asyncHandler(async (req, res) => {
  const { name, description, memberIds } = req.body;

  if (!name) {
    throw new ApiError(400, "Group name is required");
  }

  const group = await Group.create({
    name,
    description,
    createdBy: req.user.id,
  });

  // Add creator as member
  await GroupMember.create({
    groupId: group.id,
    userId: req.user.id,
  });

  // Add other members if provided
  if (memberIds && Array.isArray(memberIds)) {
    for (const memberId of memberIds) {
      if (memberId !== req.user.id) {
        await GroupMember.create({
          groupId: group.id,
          userId: memberId,
        });
      }
    }
  }

  const groupWithMembers = await Group.findByPk(group.id, {
    include: [
      {
        model: GroupMember,
        as: "members",
        include: [
          { model: User, as: "user", attributes: ["id", "name", "email"] },
        ],
      },
    ],
  });

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { group: groupWithMembers },
        "Group created successfully",
      ),
    );
});

export const getMyGroups = asyncHandler(async (req, res) => {
  const groups = await Group.findAll({
    include: [
      {
        model: GroupMember,
        as: "members",
        where: { userId: req.user.id, isActive: true },
        include: [
          { model: User, as: "user", attributes: ["id", "name", "email"] },
        ],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  res
    .status(200)
    .json(new ApiResponse(200, { groups }, "Groups retrieved successfully"));
});

export const getGroup = asyncHandler(async (req, res) => {
  const group = await Group.findByPk(req.params.id, {
    include: [
      {
        model: GroupMember,
        as: "members",
        include: [
          { model: User, as: "user", attributes: ["id", "name", "email"] },
        ],
      },
    ],
  });

  if (!group) {
    throw new ApiError(404, "Group not found");
  }

  // Check if user is member
  const isMember = group.members.some((m) => m.userId === req.user.id);
  if (!isMember) {
    throw new ApiError(403, "You are not a member of this group");
  }

  res
    .status(200)
    .json(new ApiResponse(200, { group }, "Group retrieved successfully"));
});

export const updateGroup = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const group = await Group.findByPk(req.params.id);

  if (!group) {
    throw new ApiError(404, "Group not found");
  }

  if (group.createdBy !== req.user.id) {
    throw new ApiError(403, "Only group creator can update group");
  }

  if (name) group.name = name;
  if (description !== undefined) group.description = description;

  await group.save();

  res
    .status(200)
    .json(new ApiResponse(200, { group }, "Group updated successfully"));
});

export const addMember = asyncHandler(async (req, res) => {
  const { userId, joinedAt } = req.body;

  const group = await Group.findByPk(req.params.id);

  if (!group) {
    throw new ApiError(404, "Group not found");
  }

  // Check if requester is member
  const isMember = await GroupMember.findOne({
    where: { groupId: group.id, userId: req.user.id, isActive: true },
  });

  if (!isMember) {
    throw new ApiError(403, "You are not a member of this group");
  }

  // Check if user already member
  const existingMember = await GroupMember.findOne({
    where: { groupId: group.id, userId },
  });

  if (existingMember) {
    if (existingMember.isActive) {
      throw new ApiError(400, "User is already a member");
    } else {
      // Reactivate member
      existingMember.isActive = true;
      existingMember.joinedAt = joinedAt || new Date();
      existingMember.leftAt = null;
      await existingMember.save();

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { member: existingMember },
            "Member reactivated",
          ),
        );
    }
  }

  const member = await GroupMember.create({
    groupId: group.id,
    userId,
    joinedAt: joinedAt || new Date(),
  });

  const memberWithUser = await GroupMember.findByPk(member.id, {
    include: [{ model: User, as: "user", attributes: ["id", "name", "email"] }],
  });

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { member: memberWithUser },
        "Member added successfully",
      ),
    );
});

export const removeMember = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { leftAt } = req.body;

  const group = await Group.findByPk(req.params.id);

  if (!group) {
    throw new ApiError(404, "Group not found");
  }

  const member = await GroupMember.findOne({
    where: { groupId: group.id, userId },
  });

  if (!member) {
    throw new ApiError(404, "Member not found in group");
  }

  member.isActive = false;
  member.leftAt = leftAt || new Date();
  await member.save();

  res
    .status(200)
    .json(new ApiResponse(200, { member }, "Member removed successfully"));
});

export const getGroupMembers = asyncHandler(async (req, res) => {
  const members = await GroupMember.findAll({
    where: { groupId: req.params.id },
    include: [{ model: User, as: "user", attributes: ["id", "name", "email"] }],
    order: [["joinedAt", "ASC"]],
  });

  res
    .status(200)
    .json(new ApiResponse(200, { members }, "Members retrieved successfully"));
});
