import { Users } from "lucide-react";
import GroupCard from "./GroupCard";
import Loader from "../common/Loader";

const GroupList = ({ groups, loading, onGroupClick }) => {
  if (loading) {
    return <Loader text="Loading groups..." />;
  }

  if (!groups || groups.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          No groups yet
        </h3>
        <p className="text-gray-500">Create your first group to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
