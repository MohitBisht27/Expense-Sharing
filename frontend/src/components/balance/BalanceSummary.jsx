import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Scale, ArrowRight, Sparkles } from "lucide-react";
import BalanceCard from "./BalanceCard";
import Button from "../common/Button";
import { settlementAPI } from "../../api/settlement.api";
import Loader from "../common/Loader";

const BalanceSummary = ({ groupId, currentUserId, members = [] }) => {
  const getUserName = (id) => {
    const member = members.find((m) => m.userId === id);
    return member?.user?.name || `User #${id.substring(0, 8)}`;
  };
  const [balances, setBalances] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (groupId) {
      fetchBalances();
    }
  }, [groupId]);

  const fetchBalances = async () => {
    try {
      setLoading(true);
      const response = await settlementAPI.getGroupBalance(groupId);
      setBalances(response.data.balances);
    } catch (error) {
      console.error("Failed to fetch balances:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const response = await settlementAPI.getSuggestedSettlements(groupId);
      setSuggestions(response.data.suggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
    }
  };

  if (loading) return <Loader />;

  const userOwes = {};
  const userIsOwed = {};

  Object.keys(balances).forEach((owerId) => {
    Object.keys(balances[owerId]).forEach((ownerId) => {
      const amount = balances[owerId][ownerId];
      if (owerId === currentUserId) {
        userOwes[ownerId] = (userOwes[ownerId] || 0) + amount;
      }
      if (ownerId === currentUserId) {
        userIsOwed[owerId] = (userIsOwed[owerId] || 0) + amount;
      }
    });
  });

  const totalOwed = Object.values(userOwes).reduce((sum, amt) => sum + amt, 0);
  const totalIsOwed = Object.values(userIsOwed).reduce((sum, amt) => sum + amt, 0);
  const netBalance = totalIsOwed - totalOwed;

  const allSettled =
    Object.keys(userOwes).length === 0 && Object.keys(userIsOwed).length === 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="rounded-2xl p-5 bg-gradient-to-br from-red-50 to-rose-50 border border-red-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold uppercase tracking-widest text-red-500">You Owe</p>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-white" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-red-600 tracking-tight">
            ₹{totalOwed.toFixed(2)}
          </p>
        </div>

        <div className="rounded-2xl p-5 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">Owed to You</p>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-emerald-600 tracking-tight">
            ₹{totalIsOwed.toFixed(2)}
          </p>
        </div>

        <div
          className={`rounded-2xl p-5 border ${
            netBalance >= 0
              ? "bg-gradient-to-br from-indigo-50 to-violet-50 border-indigo-100"
              : "bg-gradient-to-br from-red-50 to-rose-50 border-red-100"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <p className={`text-xs font-bold uppercase tracking-widest ${netBalance >= 0 ? "text-indigo-500" : "text-red-500"}`}>
              Net Balance
            </p>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${netBalance >= 0 ? "from-indigo-500 to-violet-600" : "from-red-500 to-rose-600"}`}>
              <Scale className="w-4 h-4 text-white" />
            </div>
          </div>
          <p className={`text-2xl font-extrabold tracking-tight ${netBalance >= 0 ? "text-indigo-600" : "text-red-600"}`}>
            {netBalance >= 0 ? "+" : ""}₹{netBalance.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Suggest Settlements */}
      {!allSettled && (
        <div className="flex">
          <Button variant="outline" onClick={fetchSuggestions}>
            <Sparkles className="w-4 h-4" />
            Suggest Optimal Settlements
          </Button>
        </div>
      )}

      {/* Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="rounded-2xl p-5 bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100">
          <h3 className="text-sm font-bold text-indigo-800 uppercase tracking-widest mb-4">
            Suggested Settlements
          </h3>
          <div className="flex flex-col gap-3">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-xl flex items-center justify-between border border-indigo-100/60"
              >
                <div className="flex items-center gap-3">
                  <div className="avatar">{suggestion.from.name[0]}</div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">
                      {suggestion.from.name}
                    </p>
                    <p className="text-xs text-slate-400">{suggestion.from.email}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-indigo-300" />
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-lg font-extrabold text-indigo-600">
                      ₹{suggestion.amount.toFixed(2)}
                    </p>
                  </div>
                  <div className="avatar">{suggestion.to.name[0]}</div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">
                      {suggestion.to.name}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Balances */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="section-title text-base">Your Balances</h3>
        </div>

        {allSettled ? (
          <div className="text-center py-10">
            <div className="empty-state-icon">
              <Scale className="w-9 h-9 text-indigo-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-1.5">All settled up! 🎉</h3>
            <p className="text-slate-400 text-sm font-medium">
              No outstanding balances in this group
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {Object.keys(userOwes).map((ownerId) => (
              <BalanceCard
                key={ownerId}
                type="owe"
                userId={ownerId}
                userName={getUserName(ownerId)}
                amount={userOwes[ownerId]}
                groupId={groupId}
              />
            ))}
            {Object.keys(userIsOwed).map((owerId) => (
              <BalanceCard
                key={owerId}
                type="owed"
                userId={owerId}
                userName={getUserName(owerId)}
                amount={userIsOwed[owerId]}
                groupId={groupId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BalanceSummary;
