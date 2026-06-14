import { Calendar, User, Users, IndianRupee, DollarSign, Tag } from "lucide-react";

const categoryColors = {
  Food:          "badge-amber",
  Transport:     "badge-blue",
  Accommodation: "badge-purple",
  Entertainment: "badge-red",
  Shopping:      "badge-green",
  Utilities:     "badge-blue",
  Other:         "badge-blue",
};

const ExpenseCard = ({ expense, onClick }) => {
  const CurrencyIcon = expense.currency === "USD" ? DollarSign : IndianRupee;
  const categoryClass = categoryColors[expense.category] || "badge-blue";

  return (
    <div
      onClick={onClick}
      className="card-elevated card-hover rounded-2xl overflow-hidden cursor-pointer group"
    >
      {/* Left accent */}
      <div className="flex">
        <div className="w-1 bg-gradient-to-b from-indigo-500 to-violet-600 rounded-l-2xl flex-shrink-0" />
        <div className="flex-1 p-5">
          <div className="flex items-start justify-between gap-4">
            {/* Left: Description + meta */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {expense.category && (
                  <span className={`badge ${categoryClass}`}>
                    {expense.category}
                  </span>
                )}
                <span className="badge badge-blue text-[10px] uppercase">
                  {expense.splitType}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-3 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                {expense.description}
              </h3>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-medium text-slate-400">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-300" />
                  {expense.payer.name}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-300" />
                  {expense.splits?.length || 0} people
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-300" />
                  {new Date(expense.expenseDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* Right: Amount */}
            <div className="text-right flex-shrink-0">
              <div className="flex items-center justify-end gap-1 text-xl font-extrabold text-slate-800">
                <CurrencyIcon className="w-4 h-4 text-slate-500" />
                {parseFloat(expense.amount).toFixed(2)}
              </div>
              {expense.currency === "USD" && (
                <p className="text-xs text-slate-400 mt-0.5">
                  ≈ ₹{parseFloat(expense.amountInINR).toFixed(2)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard;
