import { useState, useEffect } from "react";
import { Search, UserPlus, AlertCircle, CheckCircle } from "lucide-react";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";
import { authAPI } from "../../api/auth.api";
import { groupAPI } from "../../api/group.api";
import Loader from "../common/Loader";

const AddMemberModal = ({ isOpen, onClose, groupId, onSuccess }) => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addingUser, setAddingUser] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setSearchResults([]);
      setError("");
      setSuccess("");
    }
  }, [isOpen]);

  useEffect(() => {
    const searchTimer = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setLoading(true);
        setError("");
        try {
          const response = await authAPI.searchUsers(query.trim());
          setSearchResults(response.data.users || []);
        } catch (err) {
          setError(err.message || "Failed to search users");
        } finally {
          setLoading(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(searchTimer);
  }, [query]);

  const handleAddMember = async (userId) => {
    setAddingUser(userId);
    setError("");
    setSuccess("");

    try {
      await groupAPI.addMember(groupId, { userId });
      setSuccess("Member added successfully!");
      onSuccess();
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to add member");
    } finally {
      setAddingUser(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Member">
      <div className="space-y-4">
        <Input
          name="search"
          placeholder="Search by name or email..."
          icon={Search}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
        />

        {error && (
          <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-2.5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-600 text-sm">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        <div className="mt-4 max-h-60 overflow-y-auto space-y-2">
          {loading ? (
            <div className="py-4 flex justify-center">
              <Loader />
            </div>
          ) : searchResults.length > 0 ? (
            searchResults.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors"
              >
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                <Button
                  size="xs"
                  onClick={() => handleAddMember(user.id)}
                  loading={addingUser === user.id}
                  disabled={addingUser !== null}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))
          ) : query.trim().length >= 2 ? (
            <p className="text-center text-sm text-slate-500 py-4">
              No users found matching "{query}"
            </p>
          ) : (
            <p className="text-center text-sm text-slate-400 py-4">
              Type at least 2 characters to search
            </p>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="w-full"
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddMemberModal;
