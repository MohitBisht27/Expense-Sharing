import { Receipt } from "lucide-react";
import ExpenseCard from "./ExpenseCard";
import Loader from "../common/Loader";

const ExpenseList = ({ expenses, loading, onExpenseClick }) => {
  if (loading) {
    return <Loader text="Loading expenses..." />;
  }

  if (!expenses || expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <Receipt className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          No expenses yet
        </h3>
        <p className="text-gray-500">Add your first expense to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
