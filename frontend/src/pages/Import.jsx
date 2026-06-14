import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Users, ArrowRight } from "lucide-react";
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
      <div className="bg-page">
        <Navbar />
        <Loader text="Loading..." />
      </div>
    );
  }

  const selectedGroup = groups.find((g) => g.id === selectedGroupId);

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

        {/* Header */}
        <div className="animate-slide-up">
          <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-1">Import</p>
          <h1 className="page-title">Import Expenses</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">
            Upload a CSV file to bulk import expenses into a group
          </p>
        </div>

        {!selectedGroupId ? (
          <div className="card-elevated rounded-2xl overflow-hidden">
            <div className="px-5 sm:px-7 py-4 sm:py-5 border-b border-slate-100">
              <h2 className="section-title">Select a Group</h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Choose which group to import expenses into
              </p>
            </div>
            <div className="p-4 sm:p-6">
              {groups.length === 0 ? (
                <div className="text-center py-10">
                  <div className="empty-state-icon">
                    <Users className="w-9 h-9 text-indigo-500" />
                  </div>
                  <p className="text-slate-500 font-medium text-sm mb-4">
                    No groups found. Create a group first.
                  </p>
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="btn-base btn-primary px-5 py-2.5 text-sm"
                  >
                    Go to Dashboard
                  </button>
                </div>
              ) : (
                <div className="groups-grid">
                  {groups.map((group) => {
                    const gradients = [
                      "from-indigo-500 to-violet-600",
                      "from-emerald-500 to-teal-600",
                      "from-amber-500 to-orange-600",
                      "from-rose-500 to-pink-600",
                      "from-sky-500 to-blue-600",
                      "from-purple-500 to-fuchsia-600",
                    ];
                    const gradient = gradients[group.name.charCodeAt(0) % gradients.length];
                    const initials = group.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

                    return (
                      <button
                        key={group.id}
                        onClick={() => setSelectedGroupId(group.id)}
                        className="text-left p-4 rounded-2xl border-2 border-slate-100 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all duration-200 group card-hover"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-sm`}>
                            {initials}
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-200 group-hover:text-indigo-400 ml-auto transition-colors" />
                        </div>
                        <h3 className="font-bold text-slate-800 text-sm mb-0.5 group-hover:text-indigo-700 transition-colors truncate">
                          {group.name}
                        </h3>
                        {group.description && (
                          <p className="text-xs text-slate-500 line-clamp-1 mb-1.5">
                            {group.description}
                          </p>
                        )}
                        <p className="text-xs text-slate-400 font-medium">
                          {group.members?.filter((m) => m.isActive).length} members
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {/* Selected group banner */}
            <div className="card-elevated rounded-2xl p-4 sm:p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                    Importing to
                  </p>
                  <p className="text-sm sm:text-base font-bold text-slate-800 truncate">
                    {selectedGroup?.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedGroupId("")}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 bg-white px-4 py-2 rounded-xl border border-indigo-200 hover:border-indigo-400 transition-all self-start sm:self-center"
              >
                Change
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
