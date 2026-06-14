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
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            You are settling a payment to confirm you've paid this amount.
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
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="Add payment method, reference, etc."
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
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
