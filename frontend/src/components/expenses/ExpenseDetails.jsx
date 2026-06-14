import { useState, useEffect } from "react";
import { Calendar, User, Users, Trash2, IndianRupee, DollarSign, Tag } from "lucide-react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import { expenseAPI } from "../../api/expense.api";
import Loader from "../common/Loader";

const categoryColors = {
  Food:          "badge-amber",
  Transport:     "badge-blue",
  Accommodation: "badge-purple",
  Entertainment: "badge-red",
  Shopping:      "badge-green",
  Utilities:     "badge-blue",
  Other:         "badge-blue",
};

const avatarGradients = [
  "from-indigo-500 to-violet-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-sky-500 to-blue-600",
];

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
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
      await expenseAPI.deleteExpense(expenseId);
      onDelete();
      onClose();
    } catch (error) {
      alert("Failed to delete expense");
    }
  };

  const CurrencyIcon = expense?.currency === "USD" ? DollarSign : IndianRupee;
  const categoryClass = expense ? (categoryColors[expense.category] || "badge-blue") : "badge-blue";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Expense Details" size="lg">
      {loading ? (
        <Loader />
      ) : expense ? (
        <div className="flex flex-col gap-6">
          {/* Amount Header */}
          <div className="flex items-start justify-between p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {expense.category && (
                  <span className={`badge ${categoryClass}`}>
                    <Tag className="w-2.5 h-2.5 mr-1" />
                    {expense.category}
                  </span>
                )}
                <span className="badge badge-blue">{expense.splitType}</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
                {expense.description}
              </h2>
            </div>
            <div className="text-right flex-shrink-0 ml-4">
              <div className="flex items-center gap-1 text-2xl font-extrabold text-indigo-600">
                <CurrencyIcon className="w-5 h-5" />
                {parseFloat(expense.amount).toFixed(2)}
              </div>
              {expense.currency === "USD" && (
                <p className="text-xs text-slate-400 mt-0.5">
                  ≈ ₹{parseFloat(expense.amountInINR).toFixed(2)}
                </p>
              )}
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: User,     label: "Paid by",      value: expense.payer.name },
              { icon: Calendar, label: "Date",          value: new Date(expense.expenseDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) },
              { icon: Users,    label: "Split Type",    value: expense.splitType },
              { icon: Users,    label: "Split Between", value: `${expense.splits.length} people` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-indigo-500" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
                  <p className="text-sm font-semibold text-slate-700">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Split Breakdown */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-3">
              Split Breakdown
            </h3>
            <div className="flex flex-col gap-2">
              {expense.splits.map((split, idx) => {
                const gradient = avatarGradients[idx % avatarGradients.length];
                const initials = split.user.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();

                return (
                  <div
                    key={split.id}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-white hover:border-indigo-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}>
                        {initials}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{split.user.name}</p>
                        <p className="text-xs text-slate-400">{split.user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-indigo-600">
                        ₹{parseFloat(split.amountOwed).toFixed(2)}
                      </p>
                      {split.percentage && (
                        <p className="text-xs text-slate-400">{split.percentage}%</p>
                      )}
                      {split.shares && (
                        <p className="text-xs text-slate-400">{split.shares} shares</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          {expense.notes && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">
                Notes
              </h3>
              <p className="text-slate-700 p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm leading-relaxed">
                {expense.notes}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <Button variant="danger" onClick={handleDelete} className="flex-1">
              <Trash2 className="w-4 h-4" />
              Delete Expense
            </Button>
            <Button variant="secondary" onClick={onClose} className="flex-1">
              Close
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-center text-slate-400 py-8">Expense not found</p>
      )}
    </Modal>
  );
};

export default ExpenseDetails;
