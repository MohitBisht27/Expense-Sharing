import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import BalanceCard from "./BalanceCard";
import Button from "../common/Button";
import { settlementAPI } from "../../api/settlement.api";
import Loader from "../common/Loader";

const BalanceSummary = ({ groupId, currentUserId }) => {
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

  // Calculate summary for current user
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
  const totalIsOwed = Object.values(userIsOwed).reduce(
    (sum, amt) => sum + amt,
    0,
  );
  const netBalance = totalIsOwed - totalOwed;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-red-800">You Owe</p>
            <TrendingDown className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-red-600">
            ₹{totalOwed.toFixed(2)}
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-green-800">You Are Owed</p>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-600">
            ₹{totalIsOwed.toFixed(2)}
          </p>
        </div>

        <div
          className={`${netBalance >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"} border rounded-lg p-6`}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-800">Net Balance</p>
            <AlertCircle
              className={`w-5 h-5 ${netBalance >= 0 ? "text-green-600" : "text-red-600"}`}
            />
          </div>
          <p
            className={`text-3xl font-bold ${netBalance >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {netBalance >= 0 ? "+" : ""}₹{netBalance.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Simplify Button */}
      <div className="flex justify-center">
        <Button onClick={fetchSuggestions}>Suggest Optimal Settlements</Button>
      </div>

      {/* Suggested Settlements */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-blue-900">
            Suggested Settlements (Minimized Transactions)
          </h3>
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">
                    {suggestion.from.name} → {suggestion.to.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {suggestion.from.email}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">
                    ₹{suggestion.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Balances */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Detailed Balances</h3>

        {Object.keys(userOwes).length === 0 &&
        Object.keys(userIsOwed).length === 0 ? (
          <p className="text-center text-gray-500 py-8">All settled up! 🎉</p>
        ) : (
          <div className="space-y-4">
            {Object.keys(userOwes).map((ownerId) => (
              <BalanceCard
                key={ownerId}
                type="owe"
                userId={ownerId}
                amount={userOwes[ownerId]}
                groupId={groupId}
              />
            ))}

            {Object.keys(userIsOwed).map((owerId) => (
              <BalanceCard
                key={owerId}
                type="owed"
                userId={owerId}
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
