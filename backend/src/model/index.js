import User from "./user.model.js";
import Group from "./group.model.js";
import GroupMember from "./groupMember.model.js";
import Expense from "./expense.model.js";
import ExpenseSplit from "./expenseSplit.model.js";
import Settlement from "./settlement.model.js";
import ImportLog from "./importLog.model.js";

User.belongsToMany(Group, { through: GroupMember, foreignKey: "userId" });
Group.belongsToMany(User, { through: GroupMember, foreignKey: "groupId" });

Group.hasMany(GroupMember, { foreignKey: "groupId", as: "members" });
GroupMember.belongsTo(Group, { foreignKey: "groupId" });

User.hasMany(GroupMember, { foreignKey: "userId" });
GroupMember.belongsTo(User, { foreignKey: "userId", as: "user" });

Group.hasMany(Expense, { foreignKey: "groupId", as: "expenses" });
Expense.belongsTo(Group, { foreignKey: "groupId" });

User.hasMany(Expense, { foreignKey: "paidBy", as: "paidExpenses" });
Expense.belongsTo(User, { foreignKey: "paidBy", as: "payer" });

Expense.hasMany(ExpenseSplit, { foreignKey: "expenseId", as: "splits" });
ExpenseSplit.belongsTo(Expense, { foreignKey: "expenseId" });

User.hasMany(ExpenseSplit, { foreignKey: "userId" });
ExpenseSplit.belongsTo(User, { foreignKey: "userId", as: "user" });

Group.hasMany(Settlement, { foreignKey: "groupId", as: "settlements" });
Settlement.belongsTo(Group, { foreignKey: "groupId" });

User.hasMany(Settlement, { foreignKey: "paidBy", as: "settlementsGiven" });
User.hasMany(Settlement, { foreignKey: "paidTo", as: "settlementsReceived" });
Settlement.belongsTo(User, { foreignKey: "paidBy", as: "payer" });
Settlement.belongsTo(User, { foreignKey: "paidTo", as: "receiver" });

Group.hasMany(ImportLog, { foreignKey: "groupId" });
ImportLog.belongsTo(Group, { foreignKey: "groupId" });

User.hasMany(ImportLog, { foreignKey: "importedBy" });
ImportLog.belongsTo(User, { foreignKey: "importedBy", as: "importer" });

export {
  User,
  Group,
  GroupMember,
  Expense,
  ExpenseSplit,
  Settlement,
  ImportLog,
};
