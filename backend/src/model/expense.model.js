import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import { SPLIT_TYPES, CURRENCIES } from "../config/constants.js";

const Expense = sequelize.define(
  "Expense",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    groupId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Groups",
        key: "id",
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    currency: {
      type: DataTypes.ENUM(...Object.values(CURRENCIES)),
      allowNull: false,
      defaultValue: CURRENCIES.INR,
    },
    amountInINR: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    paidBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    expenseDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    splitType: {
      type: DataTypes.ENUM(...Object.values(SPLIT_TYPES)),
      allowNull: false,
      defaultValue: SPLIT_TYPES.EQUAL,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    importId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  },
);

export default Expense;
