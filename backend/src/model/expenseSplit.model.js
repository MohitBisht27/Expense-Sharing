import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const ExpenseSplit = sequelize.define(
  "ExpenseSplit",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    expenseId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Expenses",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    amountOwed: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    percentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    shares: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  },
);

export default ExpenseSplit;
