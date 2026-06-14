import { useState } from "react";
import { ArrowRight, ChevronDown, ChevronUp, IndianRupee } from "lucide-react";
import Button from "../common/Button";
import SettlementModal from "./SettlementModal";
import { settlementAPI } from "../../api/settlement.api";

const BalanceCard = ({ type, userId, userName, amount, groupId }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showSettlement, setShowSettlement] = useState(false);
  const [details, setDetails] = useState(null);

  const fetchDetails = async () => {
    try {
      if (!details) {
        const response = await settlementAPI.getUserBalanceDetails(groupId, userId);
        setDetails(response.data.details);
      }
      setShowDetails((prev) => !prev);
    } catch (error) {
      console.error("Failed to fetch details:", error);
    }
  };

  const isOwe = type === "owe";

  // Initials from username
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <>
      <div
        className={`rounded-2xl border overflow-hidden transition-all duration-200 ${
          isOwe
            ? "border-red-200 bg-gradient-to-br from-red-50 to-rose-50/50"
            : "border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50/50"
        }`}
      >
        {/* Left accent bar via inline style */}
        <div className="flex">
          <div
            className={`w-1 flex-shrink-0 ${isOwe ? "bg-gradient-to-b from-red-500 to-rose-600" : "bg-gradient-to-b from-emerald-500 to-teal-600"}`}
          />

          <div className="flex-1 p-5">
            {/* Main row */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm text-white flex-shrink-0 ${
                    isOwe ? "bg-gradient-to-br from-red-500 to-rose-600" : "bg-gradient-to-br from-emerald-500 to-teal-600"
                  }`}
                >
                  {initials}
                </div>
                <div>
                  <p className={`text-[11px] font-semibold uppercase tracking-widest ${isOwe ? "text-red-500" : "text-emerald-600"}`}>
                    {isOwe ? "You owe" : "Owes you"}
                  </p>
                  <p className="text-base font-bold text-slate-800">{userName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className={`flex items-center gap-0.5 text-xl font-extrabold ${isOwe ? "text-red-600" : "text-emerald-600"}`}>
                    <IndianRupee className="w-4 h-4" />
                    {amount.toFixed(2)}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={fetchDetails}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                      isOwe
                        ? "text-red-600 border-red-200 hover:bg-red-100"
                        : "text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                    }`}
                  >
                    {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    Details
                  </button>

                  {isOwe && (
                    <Button
                      size="xs"
                      variant="success"
                      onClick={() => setShowSettlement(true)}
                    >
                      Settle Up
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {showDetails && details && (
              <div className="mt-4 pt-4 border-t border-white/60 space-y-4">
                {/* Expenses */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2.5">
                    Contributing Expenses
                  </h4>
                  {details.expenses.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No shared expenses.</p>
                  ) : (
                    <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                      {details.expenses.map((expense, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-start text-xs p-3 bg-white rounded-xl border border-slate-100"
                        >
                          <div>
                            <p className="font-semibold text-slate-700">{expense.description}</p>
                            <p className="text-slate-400 mt-0.5">
                              {new Date(expense.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                            </p>
                          </div>
                          <div className="text-right">
                            {expense.youPaid ? (
                              <>
                                <p className="font-bold text-emerald-600">
                                  You lent ₹{parseFloat(expense.amountOwed).toFixed(2)}
                                </p>
                                <p className="text-slate-400">of ₹{parseFloat(expense.amount).toFixed(2)}</p>
                              </>
                            ) : (
                              <>
                                <p className="font-bold text-red-600">
                                  You owe ₹{parseFloat(expense.amountOwed).toFixed(2)}
                                </p>
                                <p className="text-slate-400">{expense.paidBy} paid ₹{parseFloat(expense.amount).toFixed(2)}</p>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Settlements */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2.5">
                    Recent Settlements
                  </h4>
                  {details.settlements.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No recent settlements.</p>
                  ) : (
                    <div className="flex flex-col gap-2 max-h-36 overflow-y-auto">
                      {details.settlements.map((settlement, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-start text-xs p-3 bg-indigo-50/60 rounded-xl border border-indigo-100/50"
                        >
                          <div>
                            <p className="font-semibold text-slate-700">
                              {settlement.type === "paid" ? "You settled" : `${settlement.paidBy} settled`}
                            </p>
                            <p className="text-slate-400 mt-0.5">
                              {new Date(settlement.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                            </p>
                          </div>
                          <p className="font-bold text-indigo-600">
                            {settlement.type === "paid" ? "−" : "+"}₹{parseFloat(settlement.amount).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <SettlementModal
        isOpen={showSettlement}
        onClose={() => setShowSettlement(false)}
        groupId={groupId}
        paidTo={userId}
        amount={amount}
        onSuccess={() => window.location.reload()}
      />
    </>
  );
};

export default BalanceCard;
