import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Users, Receipt, TrendingUp } from "lucide-react";
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

  const handleGroupClick = (groupId) => {
    navigate(`/groups/${groupId}`);
  };

  // Calculate stats
  const totalGroups = groups.length;
  const activeGroups = groups.filter((g) => g.isActive).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Manage your groups and track shared expenses
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Groups
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {totalGroups}
                </p>
              </div>
              <Users className="w-12 h-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Groups
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {activeGroups}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Quick Actions
                </p>
                <Button
                  size="sm"
                  onClick={() => setShowCreateGroup(true)}
                  className="mt-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Group
                </Button>
              </div>
              <Receipt className="w-12 h-12 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Groups Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Groups</h2>
            <Button onClick={() => setShowCreateGroup(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Create Group
            </Button>
          </div>

          <GroupList
            groups={groups}
            loading={loading}
            onGroupClick={handleGroupClick}
          />
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate("/import")}
          >
            <h3 className="text-xl font-bold mb-2">Import Expenses</h3>
            <p className="text-blue-100">
              Upload your CSV file to bulk import expenses
            </p>
          </div>

          <div
            className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate("/balance")}
          >
            <h3 className="text-xl font-bold mb-2">View Balances</h3>
            <p className="text-green-100">
              Check who owes you and what you owe
            </p>
          </div>
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
