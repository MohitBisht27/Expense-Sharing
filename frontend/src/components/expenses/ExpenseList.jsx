import { Receipt, Plus } from "lucide-react";
import ExpenseCard from "./ExpenseCard";
import Loader from "../common/Loader";

const ExpenseList = ({ expenses, loading, onExpenseClick }) => {
  if (loading) {
    return <Loader text="Loading expenses..." />;
  }

  if (!expenses || expenses.length === 0) {
    return (
      <div className="text-center py-14">
        <div className="empty-state-icon">
          <Receipt className="w-9 h-9 text-indigo-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-700 mb-1.5">
          No expenses yet
        </h3>
        <p className="text-slate-400 text-sm font-medium mb-6">
          Add your first expense to start tracking
        </p>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-500 bg-indigo-50 px-3.5 py-2 rounded-full">
          <Plus className="w-3.5 h-3.5" />
          Use &ldquo;Add Expense&rdquo; above to get started
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {expenses.map((expense) => (
        <ExpenseCard
          key={expense.id}
          expense={expense}
          onClick={() => onExpenseClick(expense.id)}
        />
      ))}
    </div>
  );
};

export default ExpenseList;
