import { useState, useEffect } from "react";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";
import SplitCalculator from "./SplitCalculator";
import { expenseAPI } from "../../api/expense.api";
import { groupAPI } from "../../api/group.api";

const CreateExpenseModal = ({ isOpen, onClose, groupId, onSuccess }) => {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    currency: "INR",
    paidBy: "",
    expenseDate: new Date().toISOString().split("T")[0],
    splitType: "EQUAL",
    category: "",
    notes: "",
  });
  const [members, setMembers] = useState([]);
  const [splits, setSplits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && groupId) {
      fetchMembers();
    }
  }, [isOpen, groupId]);

  const fetchMembers = async () => {
    try {
      const response = await groupAPI.getGroupMembers(groupId);
      const activeMembers = response.data.members.filter((m) => m.isActive);
      setMembers(activeMembers);

      // Initialize equal splits
      if (activeMembers.length > 0) {
        const equalSplits = activeMembers.map((m) => ({
          userId: m.userId,
          userName: m.user.name,
          amountOwed: 0,
          percentage: 100 / activeMembers.length,
          shares: 1,
        }));
        setSplits(equalSplits);
      }
    } catch (err) {
      console.error("Failed to fetch members:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Recalculate splits when amount or splitType changes
    if (name === "amount" || name === "splitType") {
      recalculateSplits(
        name === "amount" ? parseFloat(value) : parseFloat(formData.amount),
        name === "splitType" ? value : formData.splitType,
      );
    }
  };

  const recalculateSplits = (amount, splitType) => {
    if (!amount || amount <= 0) return;

    const newSplits = [...splits];

    if (splitType === "EQUAL") {
      const perPerson = parseFloat((amount / newSplits.length).toFixed(2));
      let sum = 0;
      newSplits.forEach((split, index) => {
        if (index === newSplits.length - 1) {
          split.amountOwed = parseFloat((amount - sum).toFixed(2));
        } else {
          split.amountOwed = perPerson;
          sum += perPerson;
        }
      });
    } else if (splitType === "PERCENTAGE") {
      newSplits.forEach((split) => {
        split.amountOwed = parseFloat(
          ((amount * split.percentage) / 100).toFixed(2),
        );
      });
    } else if (splitType === "SHARES") {
      const totalShares = newSplits.reduce(
        (sum, s) => sum + (s.shares || 1),
        0,
      );
      let sum = 0;
      newSplits.forEach((split, index) => {
        if (index === newSplits.length - 1) {
          split.amountOwed = parseFloat((amount - sum).toFixed(2));
        } else {
          const shareAmount = parseFloat(
            ((amount * (split.shares || 1)) / totalShares).toFixed(2),
          );
          split.amountOwed = shareAmount;
          sum += shareAmount;
        }
      });
    }

    setSplits(newSplits);
  };

  const handleSplitChange = (updatedSplits) => {
    setSplits(updatedSplits);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate
    const totalSplit = splits.reduce(
      (sum, s) => sum + parseFloat(s.amountOwed || 0),
      0,
    );
    const amount = parseFloat(formData.amount);

    if (Math.abs(totalSplit - amount) > 0.01) {
      setError(
        `Split amounts (${totalSplit.toFixed(2)}) don't match expense amount (${amount.toFixed(2)})`,
      );
      return;
    }

    setLoading(true);

    try {
      await expenseAPI.createExpense({
        ...formData,
        groupId,
        amount: parseFloat(formData.amount),
        splits: splits.map((s) => ({
          userId: s.userId,
          amountOwed: parseFloat(s.amountOwed),
          percentage: formData.splitType === "PERCENTAGE" ? s.percentage : null,
          shares: formData.splitType === "SHARES" ? s.shares : null,
        })),
      });

      onSuccess();
      onClose();

      // Reset form
      setFormData({
        description: "",
        amount: "",
        currency: "INR",
        paidBy: "",
        expenseDate: new Date().toISOString().split("T")[0],
        splitType: "EQUAL",
        category: "",
        notes: "",
      });
    } catch (err) {
      setError(err.message || "Failed to create expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Expense" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="e.g., Dinner at restaurant"
            required
            containerClassName="col-span-2"
          />

          <Input
            label="Amount"
            type="number"
            step="0.01"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            required
          />

          <div>
            <label className="input-label">Currency</label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="input-field"
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
            </select>
          </div>

          <div>
            <label className="input-label">Paid By</label>
            <select
              name="paidBy"
              value={formData.paidBy}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="">Select member</option>
              {members.map((member) => (
                <option key={member.userId} value={member.userId}>
                  {member.user.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Date"
            type="date"
            name="expenseDate"
            value={formData.expenseDate}
            onChange={handleChange}
            required
          />

          <Input
            label="Category (Optional)"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g., Food, Transport"
            containerClassName="col-span-2"
          />
        </div>

        <div>
          <label className="input-label">Split Type</label>
          <div className="grid grid-cols-4 gap-2">
            {["EQUAL", "EXACT", "PERCENTAGE", "SHARES"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() =>
                  handleChange({ target: { name: "splitType", value: type } })
                }
                className={`btn-base px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  formData.splitType === type
                    ? "bg-indigo-50 text-indigo-600 border-2 border-indigo-400"
                    : "bg-slate-50 text-slate-600 border-2 border-slate-200 hover:border-slate-300"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <SplitCalculator
          splits={splits}
          splitType={formData.splitType}
          totalAmount={parseFloat(formData.amount) || 0}
          onSplitChange={handleSplitChange}
        />

        <div>
          <label className="input-label">Notes (Optional)</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="input-field resize-none"
            rows="3"
            placeholder="Add any additional notes"
          />
        </div>

        {error && (
          <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button type="submit" loading={loading} className="flex-1">
            Add Expense
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateExpenseModal;
