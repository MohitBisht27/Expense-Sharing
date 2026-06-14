import { Users, Calendar } from "lucide-react";
import Card from "../common/Card";

const GroupCard = ({ group, onClick }) => {
  const activeMembers = group.members?.filter((m) => m.isActive) || [];

  return (
    <Card hover onClick={onClick}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
          {group.description && (
            <p className="text-sm text-gray-600 mt-1">{group.description}</p>
          )}
        </div>
        <Users className="w-6 h-6 text-blue-600" />
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4" />
          <span>{activeMembers.length} members</span>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4" />
          <span>{new Date(group.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </Card>
  );
};

export default GroupCard;
