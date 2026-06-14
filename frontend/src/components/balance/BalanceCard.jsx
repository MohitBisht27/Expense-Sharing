import { useState } from "react";
import { ArrowRight, Info } from "lucide-react";
import Card from "../common/Card";
import Button from "../common/Button";
import SettlementModal from "./SettlementModal";
import { settlementAPI } from "../../api/settlement.api";

const BalanceCard = ({ type, userId, amount, groupId }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showSettlement, setShowSettlement] = useState(false);
  const [details, setDetails] = useState(null);
  const [userName, setUserName] = useState("User");

  const fetchDetails = async () => {
    try {
      const response = await settlementAPI.getUserBalanceDetails(
        groupId,
        userId,
      );
      setDetails(response.data.details);
      setShowDetails(!showDetails);
    } catch (error) {
      console.error("Failed to fetch details:", error);
    }
  };

  const isOwe = type === "owe";

  return (
    <>
      <Card
        className={`${isOwe ? "border-l-4 border-red-500" : "border-l-4 border-green-500"}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">
              {isOwe ? "You owe" : "owes you"}
            </p>
            <p className="text-xl font-bold text-gray-900">
              User #{userId.substring(0, 8)}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p
                className={`text-2xl font-bold ${isOwe ? "text-red-600" : "text-green-600"}`}
              >
                ₹{amount.toFixed(2)}
              </p>
            </div>

            <div className="flex flex-col space-y-2">
              <Button size="sm" variant="outline" onClick={fetchDetails}>
                <Info className="w-4 h-4 mr-1" />
                Details
              </Button>

              {isOwe && (
                <Button size="sm" onClick={() => setShowSettlement(true)}>
                  Settle Up
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Details Section */}
        {showDetails && details && (
          <div className="mt-4 pt-4 border-t space-y-3">
            <h4 className="font-semibold text-sm text-gray-700">
              Contributing Expenses:
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {details.expenses.map((expense, idx) => (
                <div
                  key={idx}
                  className="flex justify-between text-sm p-2 bg-gray-50 rounded"
                >
                  <div>
                    <p className="font-medium">{expense.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(expense.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      Your share: ₹{parseFloat(expense.yourShare).toFixed(2)}
                    </p>
                    {expense.youPaid && (
                      <p className="text-xs text-green-600">
                        You paid ₹{parseFloat(expense.amount).toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

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
