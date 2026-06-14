import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const ImportLog = sequelize.define(
  "ImportLog",
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
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    totalRows: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    successfulRows: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    failedRows: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    anomalies: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    importedBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("PENDING", "COMPLETED", "FAILED"),
      defaultValue: "PENDING",
    },
  },
  {
    timestamps: true,
  },
);

export default ImportLog;
