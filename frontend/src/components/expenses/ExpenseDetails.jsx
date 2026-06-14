import { useState, useEffect } from "react";
import { Calendar, User, Users, Edit, Trash2, IndianRupee } from "lucide-react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import { expenseAPI } from "../../api/expense.api";
import Loader from "../common/Loader";

const ExpenseDetails = ({ expenseId, isOpen, onClose, onDelete }) => {
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && expenseId) {
      fetchExpense();
    }
  }, [isOpen, expenseId]);

  const fetchExpense = async () => {
    try {
      setLoading(true);
      const response = await expenseAPI.getExpense(expenseId);
      setExpense(response.data.expense);
    } catch (error) {
      console.error("Failed to fetch expense:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this expense?"))
      return;

    try {
      await expenseAPI.deleteExpense(expenseId);
      onDelete();
      onClose();
    } catch (error) {
      alert("Failed to delete expense");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Expense Details" size="lg">
      {loading ? (
        <Loader />
      ) : expense ? (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {expense.description}
              </h2>
              {expense.category && (
                <span className="inline-block mt-2 px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                  {expense.category}
                </span>
              )}
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-600">
                {expense.currency === "USD" ? "$" : "₹"}
                {parseFloat(expense.amount).toFixed(2)}
              </p>
              {expense.currency === "USD" && (
                <p className="text-sm text-gray-500 mt-1">
                  ≈ ₹{parseFloat(expense.amountInINR).toFixed(2)}
                </p>
              )}
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <User className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-xs text-gray-500">Paid by</p>
                <p className="font-medium">{expense.payer.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="font-medium">
                  {new Date(expense.expenseDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Users className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-xs text-gray-500">Split Type</p>
                <p className="font-medium">{expense.splitType}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Users className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-xs text-gray-500">Split Between</p>
                <p className="font-medium">{expense.splits.length} people</p>
              </div>
            </div>
          </div>

          {/* Split Details */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Split Breakdown</h3>
            <div className="space-y-2">
              {expense.splits.map((split) => (
                <div
                  key={split.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{split.user.name}</p>
                    <p className="text-sm text-gray-600">{split.user.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-600">
                      ₹{parseFloat(split.amountOwed).toFixed(2)}
                    </p>
                    {split.percentage && (
                      <p className="text-xs text-gray-500">
                        {split.percentage}%
                      </p>
                    )}
                    {split.shares && (
                      <p className="text-xs text-gray-500">
                        {split.shares} shares
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {expense.notes && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Notes</h3>
              <p className="text-gray-700 p-3 bg-gray-50 rounded-lg">
                {expense.notes}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4 border-t">
            <Button variant="danger" onClick={handleDelete} className="flex-1">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
            <Button variant="secondary" onClick={onClose} className="flex-1">
              Close
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Expense not found</p>
      )}
    </Modal>
  );
};

export default ExpenseDetails;
