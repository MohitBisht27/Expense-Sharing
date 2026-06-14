import { useState, useEffect, useCallback } from "react";
import { expenseAPI } from "../api/expense.api";

export const useExpenses = (groupId) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExpenses = useCallback(async () => {
    if (!groupId) return;

    try {
      setLoading(true);
      const response = await expenseAPI.getGroupExpenses(groupId);
      setExpenses(response.data.expenses);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  return { expenses, loading, error, refetch: fetchExpenses };
};
