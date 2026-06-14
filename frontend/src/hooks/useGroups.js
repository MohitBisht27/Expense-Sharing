// frontend/src/hooks/useGroups.js
import { useState, useEffect, useCallback } from "react";
import { groupAPI } from "../api/group.api";

export const useGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);
      const response = await groupAPI.getMyGroups();
      setGroups(response.data.groups);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch groups");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  return { groups, loading, error, refetch: fetchGroups };
};
