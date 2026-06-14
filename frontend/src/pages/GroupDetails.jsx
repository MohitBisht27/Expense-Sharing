import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Plus, Users as UsersIcon, Receipt, TrendingUp, Calendar,
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Button from "../components/common/Button";
import ExpenseList from "../components/expenses/ExpenseList";
import CreateExpenseModal from "../components/expenses/CreateExpenseModal";
import ExpenseDetails from "../components/expenses/ExpenseDetails";
import GroupMembers from "../components/groups/GroupMembers";
import BalanceSummary from "../components/balance/BalanceSummary";
import Loader from "../components/common/Loader";
import { groupAPI } from "../api/group.api";
import { useExpenses } from "../hooks/useExpenses";
import { useAuth } from "../hooks/useAuth";

const GRADIENTS = [
  "from-indigo-500 to-violet-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-sky-500 to-blue-600",
  "from-purple-500 to-fuchsia-600",
];

const GroupDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("expenses");
  const [showCreateExpense, setShowCreateExpense] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);

  const { expenses, loading: expensesLoading, refetch: refetchExpenses } = useExpenses(id);

  const fetchGroup = async () => {
    try {
      setLoading(true);
      const response = await groupAPI.getGroup(id);
      setGroup(response.data.group);
    } catch {
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGroup(); }, [id]);

  if (loading) {
    return (
      <div className="bg-page">
        <Navbar />
        <Loader text="Loading group..." />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="bg-page">
        <Navbar />
        <div className="page-container py-8 text-center text-slate-400">Group not found</div>
      </div>
    );
  }

  const isAdmin   = group?.createdBy === user?.id;
  const gradient  = GRADIENTS[group.name.charCodeAt(0) % GRADIENTS.length];
  const initials  = group.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  const activeMembers = group.members?.filter((m) => m.isActive).length || 0;

  const tabs = [
    { id: "expenses", label: "Expenses", icon: Receipt    },
    { id: "balances", label: "Balances", icon: TrendingUp },
    { id: "members",  label: "Members",  icon: UsersIcon  },
  ];

  return (
    <div className="bg-page">
      <Navbar />

      <div className="page-container py-6 sm:py-8 flex flex-col gap-5">

        {/* Back */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors group w-fit"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Dashboard
        </button>

        {/* Group Header */}
        <div className="card-elevated rounded-2xl overflow-hidden">
          <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />
          <div className="p-4 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              {/* Left: avatar + info */}
              <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg flex-shrink-0`}
                >
                  {initials}
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight leading-tight mb-1 truncate">
                    {group.name}
                  </h1>
                  {group.description && (
                    <p className="text-slate-500 text-sm font-medium mb-2 line-clamp-2">
                      {group.description}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <UsersIcon className="w-3.5 h-3.5" />
                      {activeMembers} members
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(group.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Add Expense button */}
              {activeTab === "expenses" && (
                <div className="flex-shrink-0">
                  <Button onClick={() => setShowCreateExpense(true)} size="sm">
                    <Plus className="w-4 h-4" />
                    Add Expense
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab + Content */}
        <div className="card-elevated rounded-2xl overflow-hidden">
          {/* Tab bar */}
          <div className="px-4 sm:px-6 pt-4 pb-0">
            <div className="tab-nav w-fit">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {activeTab === "expenses" && (
              <ExpenseList
                expenses={expenses}
                loading={expensesLoading}
                onExpenseClick={setSelectedExpenseId}
              />
            )}
            {activeTab === "balances" && (
              <BalanceSummary
                groupId={id}
                currentUserId={user?.id}
                members={group?.members || []}
              />
            )}
            {activeTab === "members" && (
              <GroupMembers groupId={id} isAdmin={isAdmin} />
            )}
          </div>
        </div>

      </div>

      <CreateExpenseModal
        isOpen={showCreateExpense}
        onClose={() => setShowCreateExpense(false)}
        groupId={id}
        onSuccess={() => { refetchExpenses(); setShowCreateExpense(false); }}
      />
      <ExpenseDetails
        expenseId={selectedExpenseId}
        isOpen={!!selectedExpenseId}
        onClose={() => setSelectedExpenseId(null)}
        onDelete={() => { refetchExpenses(); setSelectedExpenseId(null); }}
      />
    </div>
  );
};

export default GroupDetails;
