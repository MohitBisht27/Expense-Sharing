import { Users, Calendar, ArrowRight } from "lucide-react";

const GroupCard = ({ group, onClick }) => {
  const activeMembers = group.members?.filter((m) => m.isActive) || [];

  // Generate a consistent color based on group name
  const colors = [
    "from-indigo-500 to-violet-600",
    "from-emerald-500 to-teal-600",
    "from-amber-500 to-orange-600",
    "from-rose-500 to-pink-600",
    "from-sky-500 to-blue-600",
    "from-purple-500 to-fuchsia-600",
  ];
  const colorIndex = group.name.charCodeAt(0) % colors.length;
  const gradient = colors[colorIndex];

  const initials = group.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      onClick={onClick}
      className="card-elevated card-hover rounded-2xl overflow-hidden cursor-pointer group"
    >
      {/* Top accent bar */}
      <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />

      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          {/* Avatar */}
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0`}
          >
            {initials}
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all duration-200 mt-1" />
        </div>

        <h3 className="text-base font-bold text-slate-800 mb-0.5 line-clamp-1">
          {group.name}
        </h3>
        {group.description && (
          <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed">
            {group.description}
          </p>
        )}

        <div className="divider" />

        <div className="flex items-center justify-between text-xs font-medium text-slate-400">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>{activeMembers.length} members</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(group.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
