import { useState } from "react";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";
import { settlementAPI } from "../../api/settlement.api";

const SettlementModal = ({
  isOpen,
  onClose,
  groupId,
  paidTo,
  amount,
  onSuccess,
}) => {
  const [settlementAmount, setSettlementAmount] = useState(amount.toFixed(2));
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await settlementAPI.createSettlement({
        groupId,
        paidTo,
        amount: parseFloat(settlementAmount),
        notes,
      });

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to record settlement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Settlement">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2.5 p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <span className="text-indigo-600 text-sm font-bold">ℹ</span>
          </div>
          <p className="text-sm text-indigo-800 font-medium">
            You are settling a payment to confirm you&apos;ve paid this amount.
          </p>
        </div>

        <Input
          label="Amount"
          type="number"
          step="0.01"
          value={settlementAmount}
          onChange={(e) => setSettlementAmount(e.target.value)}
          required
        />

        <div>
          <label className="input-label">Notes (Optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="input-field resize-none"
            rows="3"
            placeholder="Add payment method, reference, etc."
          />
        </div>

        {error && (
          <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="flex space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button type="submit" loading={loading} className="flex-1">
            Record Settlement
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SettlementModal;
