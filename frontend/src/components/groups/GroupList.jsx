import { Users, Plus } from "lucide-react";
import GroupCard from "./GroupCard";
import Loader from "../common/Loader";

const GroupList = ({ groups, loading, onGroupClick }) => {
  if (loading) {
    return <Loader text="Loading groups..." />;
  }

  if (!groups || groups.length === 0) {
    return (
      <div className="text-center py-14">
        <div className="empty-state-icon">
          <Users className="w-9 h-9 text-indigo-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-700 mb-1.5">
          No groups yet
        </h3>
        <p className="text-slate-400 text-sm font-medium mb-6">
          Create your first group to start splitting expenses
        </p>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-500 bg-indigo-50 px-3.5 py-2 rounded-full">
          <Plus className="w-3.5 h-3.5" />
          Use &ldquo;New Group&rdquo; above to get started
        </div>
      </div>
    );
  }

  return (
    <div className="groups-grid">
      {groups.map((group) => (
        <GroupCard
          key={group.id}
          group={group}
          onClick={() => onGroupClick(group.id)}
        />
      ))}
    </div>
  );
};

export default GroupList;
