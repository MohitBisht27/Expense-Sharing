import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import ImportWizard from "../components/import/ImportWizard";
import { useGroups } from "../hooks/useGroups";
import Loader from "../components/common/Loader";

const Import = () => {
  const navigate = useNavigate();
  const { groups, loading } = useGroups();
  const [selectedGroupId, setSelectedGroupId] = useState("");

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Loader text="Loading..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Import Expenses
          </h1>
          <p className="text-gray-600">
            Upload your CSV file to import expenses into a group
          </p>
        </div>

        {!selectedGroupId ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Select a Group</h2>
            <p className="text-gray-600 mb-6">
              Choose which group you want to import expenses into:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groups.map((group) => (
                <button
                  key={group.id}
                  onClick={() => setSelectedGroupId(group.id)}
                  className="text-left p-4 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900">{group.name}</h3>
                  {group.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {group.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    {group.members?.filter((m) => m.isActive).length} members
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Importing to:</p>
                <p className="text-lg font-semibold text-gray-900">
                  {groups.find((g) => g.id === selectedGroupId)?.name}
                </p>
              </div>
              <button
                onClick={() => setSelectedGroupId("")}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Change Group
              </button>
            </div>

            <ImportWizard groupId={selectedGroupId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Import;
