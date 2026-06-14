import { Op } from "sequelize";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  Expense,
  ExpenseSplit,
  User,
  Group,
  GroupMember,
} from "../model/index.js";
import {
  SPLIT_TYPES,
  CURRENCIES,
  EXCHANGE_RATES,
} from "../config/constants.js";
import sequelize from "../config/db.js";

export const createExpense = asyncHandler(async (req, res) => {
  const {
    groupId,
    description,
    amount,
    currency,
    paidBy,
    expenseDate,
    splitType,
    splits,
    category,
    notes,
  } = req.body;

  // Validate group exists and user is member
  const group = await Group.findByPk(groupId);
  if (!group) {
    throw new ApiError(404, "Group not found");
  }

  const isMember = await GroupMember.findOne({
    where: { groupId, userId: req.user.id, isActive: true },
  });

  if (!isMember) {
    throw new ApiError(403, "You are not a member of this group");
  }

  // Calculate amount in INR
  const amountInINR =
    currency === CURRENCIES.USD ? amount * EXCHANGE_RATES.USD_TO_INR : amount;

  const transaction = await sequelize.transaction();

  try {
    // Create expense
    const expense = await Expense.create(
      {
        groupId,
        description,
        amount,
        currency: currency || CURRENCIES.INR,
        amountInINR,
        paidBy: paidBy || req.user.id,
        expenseDate: expenseDate || new Date(),
        splitType: splitType || SPLIT_TYPES.EQUAL,
        category,
        notes,
      },
      { transaction },
    );

    // Create splits
    if (splits && Array.isArray(splits)) {
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
    }

    await transaction.commit();

    const expenseWithDetails = await Expense.findByPk(expense.id, {
      include: [
        { model: User, as: "payer", attributes: ["id", "name", "email"] },
        {
          model: ExpenseSplit,
          as: "splits",
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
          { expense: expenseWithDetails },
          "Expense created successfully",
        ),
      );
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
});

export const getGroupExpenses = asyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const { page = 1, limit = 20, category, startDate, endDate } = req.query;

  // Check membership
  const isMember = await GroupMember.findOne({
    where: { groupId, userId: req.user.id, isActive: true },
  });

  if (!isMember) {
    throw new ApiError(403, "You are not a member of this group");
  }

  const where = { groupId };

  if (category) {
    where.category = category;
  }

  if (startDate || endDate) {
    where.expenseDate = {};
    if (startDate) where.expenseDate[Op.gte] = new Date(startDate);
    if (endDate) where.expenseDate[Op.lte] = new Date(endDate);
  }

  const offset = (page - 1) * limit;

  const { count, rows: expenses } = await Expense.findAndCountAll({
    where,
    include: [
      { model: User, as: "payer", attributes: ["id", "name", "email"] },
      {
        model: ExpenseSplit,
        as: "splits",
        include: [
          { model: User, as: "user", attributes: ["id", "name", "email"] },
        ],
      },
    ],
    order: [["expenseDate", "DESC"]],
    limit: parseInt(limit),
    offset,
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        expenses,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit),
        },
      },
      "Expenses retrieved successfully",
    ),
  );
});

export const getExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findByPk(req.params.id, {
    include: [
      { model: User, as: "payer", attributes: ["id", "name", "email"] },
      {
        model: ExpenseSplit,
        as: "splits",
        include: [
          { model: User, as: "user", attributes: ["id", "name", "email"] },
        ],
      },
      { model: Group },
    ],
  });

  if (!expense) {
    throw new ApiError(404, "Expense not found");
  }

  // Check membership
  const isMember = await GroupMember.findOne({
    where: { groupId: expense.groupId, userId: req.user.id, isActive: true },
  });

  if (!isMember) {
    throw new ApiError(403, "You are not a member of this group");
  }

  res
    .status(200)
    .json(new ApiResponse(200, { expense }, "Expense retrieved successfully"));
});

export const updateExpense = asyncHandler(async (req, res) => {
  const {
    description,
    amount,
    currency,
    paidBy,
    expenseDate,
    splitType,
    splits,
    category,
    notes,
  } = req.body;

  const expense = await Expense.findByPk(req.params.id);

  if (!expense) {
    throw new ApiError(404, "Expense not found");
  }

  // Check if user is payer or group admin
  if (expense.paidBy !== req.user.id) {
    const group = await Group.findByPk(expense.groupId);
    if (group.createdBy !== req.user.id) {
      throw new ApiError(403, "Only expense creator or group admin can update");
    }
  }

  const transaction = await sequelize.transaction();

  try {
    // Update expense
    if (description) expense.description = description;
    if (amount) {
      expense.amount = amount;
      const curr = currency || expense.currency;
      expense.amountInINR =
        curr === CURRENCIES.USD ? amount * EXCHANGE_RATES.USD_TO_INR : amount;
    }
    if (currency) expense.currency = currency;
    if (paidBy) expense.paidBy = paidBy;
    if (expenseDate) expense.expenseDate = expenseDate;
    if (splitType) expense.splitType = splitType;
    if (category !== undefined) expense.category = category;
    if (notes !== undefined) expense.notes = notes;

    await expense.save({ transaction });

    // Update splits if provided
    if (splits && Array.isArray(splits)) {
      // Delete existing splits
      await ExpenseSplit.destroy({
        where: { expenseId: expense.id },
        transaction,
      });

      // Create new splits
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
    }

    await transaction.commit();

    const updatedExpense = await Expense.findByPk(expense.id, {
      include: [
        { model: User, as: "payer", attributes: ["id", "name", "email"] },
        {
          model: ExpenseSplit,
          as: "splits",
          include: [
            { model: User, as: "user", attributes: ["id", "name", "email"] },
          ],
        },
      ],
    });

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { expense: updatedExpense },
          "Expense updated successfully",
        ),
      );
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
});

export const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findByPk(req.params.id);

  if (!expense) {
    throw new ApiError(404, "Expense not found");
  }

  // Check if user is payer or group admin
  if (expense.paidBy !== req.user.id) {
    const group = await Group.findByPk(expense.groupId);
    if (group.createdBy !== req.user.id) {
      throw new ApiError(403, "Only expense creator or group admin can delete");
    }
  }

  await expense.destroy();

  res
    .status(200)
    .json(new ApiResponse(200, null, "Expense deleted successfully"));
});

export const getCategories = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  const categories = await Expense.findAll({
    where: { groupId, category: { [Op.ne]: null } },
    attributes: [
      [sequelize.fn("DISTINCT", sequelize.col("category")), "category"],
    ],
    raw: true,
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { categories: categories.map((c) => c.category) },
        "Categories retrieved successfully",
      ),
    );
});
