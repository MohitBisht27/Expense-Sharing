import { Calendar, User, Users, IndianRupee, DollarSign } from "lucide-react";
import Card from "../common/Card";

const ExpenseCard = ({ expense, onClick }) => {
  const CurrencyIcon = expense.currency === "USD" ? DollarSign : IndianRupee;

  return (
    <Card hover onClick={onClick}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {expense.description}
            </h3>
            <div className="flex items-center text-lg font-bold text-blue-600">
              <CurrencyIcon className="w-5 h-5 mr-1" />
              {parseFloat(expense.amount).toFixed(2)}
            </div>
          </div>

          {expense.category && (
            <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mb-2">
              {expense.category}
            </span>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Paid by: {expense.payer.name}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(expense.expenseDate).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Split: {expense.splitType}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>{expense.splits?.length || 0} people</span>
            </div>
          </div>

          {expense.currency === "USD" && (
            <div className="mt-2 text-xs text-gray-500">
              ≈ ₹{parseFloat(expense.amountInINR).toFixed(2)}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ExpenseCard;
