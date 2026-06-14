import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Users, TrendingUp, Upload, Scale, ArrowRight, Sparkles } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import GroupList from "../components/groups/GroupList";
import CreateGroupModal from "../components/groups/CreateGroupModal";
import Button from "../components/common/Button";
import { useGroups } from "../hooks/useGroups";
import { useAuth } from "../hooks/useAuth";

const Dashboard = () => {
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const { groups, loading, refetch } = useGroups();
  const { user } = useAuth();
  const navigate = useNavigate();

  const totalGroups  = groups.length;
  const activeGroups = groups.filter((g) => g.isActive).length;
  const totalMembers = groups.reduce(
    (s, g) => s + (g.members?.filter((m) => m.isActive).length || 0),
    0
  );

  const stats = [
    {
      label: "Total Groups",
      value: totalGroups,
      icon: Users,
      bg: "from-indigo-50 to-violet-50",
      iconGrad: "from-indigo-500 to-violet-600",
      color: "text-indigo-700",
      shadow: "shadow-indigo-100",
    },
    {
      label: "Active Groups",
      value: activeGroups,
      icon: TrendingUp,
      bg: "from-emerald-50 to-teal-50",
      iconGrad: "from-emerald-500 to-teal-600",
      color: "text-emerald-700",
      shadow: "shadow-emerald-100",
    },
    {
      label: "Total Members",
      value: totalMembers,
      icon: Sparkles,
      bg: "from-amber-50 to-orange-50",
      iconGrad: "from-amber-500 to-orange-600",
      color: "text-amber-700",
      shadow: "shadow-amber-100",
    },
  ];

  return (
    <div className="bg-page">
      <Navbar />

      <div className="page-container py-6 sm:py-8 lg:py-10 flex flex-col gap-6 sm:gap-8">

        {/* ── Page Header ─────────────────────────── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between animate-slide-up">
          <div className="flex-1">
            <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-2">
              Dashboard
            </p>
            <h1 className="page-title">Hey, {user?.name?.split(" ")[0]}! 👋</h1>
            <p className="text-slate-500 mt-2 text-sm font-medium">
              Manage your groups and shared expenses
            </p>
          </div>
          <div className="flex-shrink-0">
            <Button onClick={() => setShowCreateGroup(true)} size="md">
              <Plus className="w-4 h-4" />
              New Group
            </Button>
          </div>
        </div>

        {/* ── Stat Cards ──────────────────────────── */}
        <div className="stats-grid">
          {stats.map(({ label, value, icon: Icon, bg, iconGrad, color, shadow }) => (
            <div
              key={label}
              className={`stat-card bg-gradient-to-br ${bg} ${shadow} card-interactive`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${color} opacity-80 mb-1.5`}>
                    {label}
                  </p>
                  <p className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
                    {value}
                  </p>
                </div>
                <div className={`stat-icon-wrap bg-gradient-to-br ${iconGrad} shadow-lg flex-shrink-0 transform transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Quick Links ──────────────────────────– */}
        <div className="quick-links-grid">
          <button
            className="quick-link-card bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 shadow-[0_8px_30px_rgba(99,102,241,0.30)] border-none w-full text-left cursor-pointer"
            onClick={() => navigate("/import")}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3 transform transition-transform duration-300">
                  <Upload className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-bold mb-1">Import Expenses</h3>
                <p className="text-indigo-200 text-sm font-medium">
                  Bulk import from CSV in seconds
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-indigo-300 mt-1 flex-shrink-0 transform transition-transform duration-300" />
            </div>
          </button>

          <button
            className="quick-link-card bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 shadow-[0_8px_30px_rgba(16,185,129,0.25)] border-none w-full text-left cursor-pointer"
            onClick={() => navigate("/balance")}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3 transform transition-transform duration-300">
                  <Scale className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-bold mb-1">View Balances</h3>
                <p className="text-emerald-200 text-sm font-medium">
                  See all debts across every group
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-300 mt-1 flex-shrink-0 transform transition-transform duration-300" />
            </div>
          </button>
        </div>

        {/* ── Groups Section ───────────────────────– */}
        <div className="card-elevated rounded-2xl p-5 sm:p-6 lg:p-7 card-interactive">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="section-title">Your Groups</h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Manage and track group expenses</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowCreateGroup(true)}>
              <Plus className="w-3.5 h-3.5" />
              Create Group
            </Button>
          </div>

          <GroupList
            groups={groups}
            loading={loading}
            onGroupClick={(id) => navigate(`/groups/${id}`)}
          />
        </div>

      </div>

      <CreateGroupModal
        isOpen={showCreateGroup}
        onClose={() => setShowCreateGroup(false)}
        onSuccess={refetch}
      />
    </div>
  );
};

export default Dashboard;
