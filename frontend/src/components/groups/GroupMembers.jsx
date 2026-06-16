import { useState, useEffect } from "react";
import { UserPlus, UserMinus, Calendar, Crown } from "lucide-react";
import Button from "../common/Button";
import { groupAPI } from "../../api/group.api";
import Loader from "../common/Loader";
import AddMemberModal from "./AddMemberModal";

const GroupMembers = ({ groupId, isAdmin }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddMember, setShowAddMember] = useState(false);

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

  const avatarColors = [
    "from-indigo-500 to-violet-600",
    "from-emerald-500 to-teal-600",
    "from-amber-500 to-orange-600",
    "from-rose-500 to-pink-600",
    "from-sky-500 to-blue-600",
    "from-purple-500 to-fuchsia-600",
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="section-title text-base">Members</h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            {members.filter((m) => m.isActive).length} active ·{" "}
            {members.length} total
          </p>
        </div>
        {isAdmin && (
          <Button size="sm" onClick={() => setShowAddMember(true)}>
            <UserPlus className="w-4 h-4" />
            Add Member
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-2.5">
        {members.map((member, idx) => {
          const gradient = avatarColors[idx % avatarColors.length];
          const initials = member.user.name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();

          return (
            <div
              key={member.id}
              className={`flex items-center justify-between p-4 rounded-2xl border transition-colors ${
                member.isActive
                  ? "bg-white border-slate-100 hover:border-slate-200"
                  : "bg-slate-50/50 border-slate-100 opacity-60"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
                >
                  {initials}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-slate-800 text-sm">
                      {member.user.name}
                    </p>
                    {isAdmin && idx === 0 && (
                      <span className="badge badge-amber">
                        <Crown className="w-2.5 h-2.5 mr-1" />
                        Admin
                      </span>
                    )}
                    {!member.isActive && (
                      <span className="badge badge-red">Left</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-medium">
                    {member.user.email}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Joined{" "}
                      {new Date(member.joinedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    {member.leftAt && (
                      <span className="text-red-400">
                        Left{" "}
                        {new Date(member.leftAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {isAdmin && member.isActive && idx !== 0 && (
                <Button
                  variant="danger"
                  size="xs"
                  onClick={() => handleRemoveMember(member.userId)}
                >
                  <UserMinus className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          );
        })}
      </div>

      <AddMemberModal
        isOpen={showAddMember}
        onClose={() => setShowAddMember(false)}
        groupId={groupId}
        onSuccess={fetchMembers}
      />
    </div>
  );
};

export default GroupMembers;
