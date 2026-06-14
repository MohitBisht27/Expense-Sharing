import { useState, useEffect } from "react";
import { UserPlus, UserMinus, Calendar } from "lucide-react";
import Button from "../common/Button";
import { groupAPI } from "../../api/group.api";
import Loader from "../common/Loader";

const GroupMembers = ({ groupId, isAdmin }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, [groupId]);

  const fetchMembers = async () => {
    try {
      const response = await groupAPI.getGroupMembers(groupId);
      setMembers(response.data.members);
    } catch (error) {
      console.error("Failed to fetch members:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;

    try {
      await groupAPI.removeMember(groupId, userId, { leftAt: new Date() });
      fetchMembers();
    } catch (error) {
      alert("Failed to remove member");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Members</h3>
        {isAdmin && (
          <Button size="sm">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div>
              <p className="font-medium">{member.user.name}</p>
              <p className="text-sm text-gray-600">{member.user.email}</p>
              <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                <span className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  Joined: {new Date(member.joinedAt).toLocaleDateString()}
                </span>
                {member.leftAt && (
                  <span className="flex items-center text-red-500">
                    Left: {new Date(member.leftAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            {isAdmin && member.isActive && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleRemoveMember(member.userId)}
              >
                <UserMinus className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupMembers;
