import Input from "../common/Input";

const SplitCalculator = ({ splits, splitType, totalAmount, onSplitChange }) => {
  const handleSplitUpdate = (index, field, value) => {
    const newSplits = [...splits];
    newSplits[index][field] = parseFloat(value) || 0;

    // Recalculate based on split type
    if (splitType === "PERCENTAGE" && field === "percentage") {
      newSplits[index].amountOwed = parseFloat(
        ((totalAmount * newSplits[index].percentage) / 100).toFixed(2),
      );
    } else if (splitType === "SHARES" && field === "shares") {
      const totalShares = newSplits.reduce(
        (sum, s) => sum + (s.shares || 1),
        0,
      );
      let sum = 0;
      newSplits.forEach((split, index) => {
        if (index === newSplits.length - 1) {
          split.amountOwed = parseFloat((totalAmount - sum).toFixed(2));
        } else {
          const shareAmount = parseFloat(
            ((totalAmount * (split.shares || 1)) / totalShares).toFixed(2),
          );
          split.amountOwed = shareAmount;
          sum += shareAmount;
        }
      });
    }

    onSplitChange(newSplits);
  };

  const totalSplit = splits.reduce(
    (sum, s) => sum + parseFloat(s.amountOwed || 0),
    0,
  );
  const difference = totalAmount - totalSplit;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-700">Split Details</h4>
        <div className="text-sm">
          <span
            className={difference === 0 ? "text-green-600" : "text-red-600"}
          >
            {difference === 0
              ? "✓ Balanced"
              : `Difference: ₹${Math.abs(difference).toFixed(2)}`}
          </span>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {splits.map((split, index) => (
          <div
            key={split.userId}
            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {split.userName}
              </p>
            </div>

            {splitType === "EXACT" && (
              <Input
                type="number"
                step="0.01"
                value={split.amountOwed}
                onChange={(e) =>
                  handleSplitUpdate(index, "amountOwed", e.target.value)
                }
                placeholder="0.00"
                className="w-24"
              />
            )}

            {splitType === "PERCENTAGE" && (
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  step="0.01"
                  value={split.percentage}
                  onChange={(e) =>
                    handleSplitUpdate(index, "percentage", e.target.value)
                  }
                  placeholder="0"
                  className="w-20"
                />
                <span className="text-sm text-gray-600">%</span>
              </div>
            )}

            {splitType === "SHARES" && (
              <Input
                type="number"
                step="1"
                value={split.shares}
                onChange={(e) =>
                  handleSplitUpdate(index, "shares", e.target.value)
                }
                placeholder="1"
                className="w-20"
              />
            )}

            <div className="text-right">
              <p className="text-sm font-semibold text-blue-600">
                ₹{parseFloat(split.amountOwed || 0).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-3 border-t">
        <span className="font-medium">Total Split:</span>
        <span className="font-bold text-lg">₹{totalSplit.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default SplitCalculator;
