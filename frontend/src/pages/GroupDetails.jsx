import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Users as UsersIcon,
  Receipt,
  TrendingUp,
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

const GroupDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("expenses");
  const [showCreateExpense, setShowCreateExpense] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);

  const {
    expenses,
    loading: expensesLoading,
    refetch: refetchExpenses,
  } = useExpenses(id);

  useEffect(() => {
    fetchGroup();
  }, [id]);

  const fetchGroup = async () => {
    try {
      setLoading(true);
      const response = await groupAPI.getGroup(id);
      setGroup(response.data.group);
    } catch (error) {
      console.error("Failed to fetch group:", error);
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = group?.createdBy === user?.id;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Loader text="Loading group..." />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-center text-gray-600">Group not found</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "expenses", label: "Expenses", icon: Receipt },
    { id: "balances", label: "Balances", icon: TrendingUp },
    { id: "members", label: "Members", icon: UsersIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {group.name}
              </h1>
              {group.description && (
                <p className="text-gray-600">{group.description}</p>
              )}
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span>
                  {group.members?.filter((m) => m.isActive).length} active
                  members
                </span>
                <span>•</span>
                <span>
                  Created {new Date(group.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {activeTab === "expenses" && (
              <Button onClick={() => setShowCreateExpense(true)}>
                <Plus className="w-5 h-5 mr-2" />
                Add Expense
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Expenses Tab */}
            {activeTab === "expenses" && (
              <ExpenseList
                expenses={expenses}
                loading={expensesLoading}
                onExpenseClick={setSelectedExpenseId}
              />
            )}

            {/* Balances Tab */}
            {activeTab === "balances" && (
              <BalanceSummary groupId={id} currentUserId={user?.id} />
            )}

            {/* Members Tab */}
            {activeTab === "members" && (
              <GroupMembers groupId={id} isAdmin={isAdmin} />
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateExpenseModal
        isOpen={showCreateExpense}
        onClose={() => setShowCreateExpense(false)}
        groupId={id}
        onSuccess={() => {
          refetchExpenses();
          setShowCreateExpense(false);
        }}
      />

      <ExpenseDetails
        expenseId={selectedExpenseId}
        isOpen={!!selectedExpenseId}
        onClose={() => setSelectedExpenseId(null)}
        onDelete={() => {
          refetchExpenses();
          setSelectedExpenseId(null);
        }}
      />
    </div>
  );
};

export default GroupDetails;
