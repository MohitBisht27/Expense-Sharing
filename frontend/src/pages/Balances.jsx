import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Scale,
  ArrowRight,
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import { settlementAPI } from "../api/settlement.api";
import Loader from "../components/common/Loader";

const Balances = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await settlementAPI.getUserSummaryBalances();
        setData(res.data);
      } catch (e) {
        console.error("Failed to fetch balance summary:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="bg-page">
        <Navbar />
        <Loader text="Loading balances..." />
      </div>
    );
  }

  const overallNetBalance = data?.overallNetBalance || 0;
  const groupsSummary = data?.summary || [];
  const totalOwes = groupsSummary.reduce((s, g) => s + g.userOwes, 0);
  const totalOwed = groupsSummary.reduce((s, g) => s + g.userOwed, 0);

  const summaryCards = [
    {
      label: "You Owe",
      value: totalOwes,
      bg: "from-red-50 to-rose-50",
      border: "border-red-100/60",
      iconGrad: "from-red-500 to-rose-600",
      textColor: "text-red-600",
      labelColor: "text-red-500",
      sub: "across all groups",
      icon: TrendingDown,
    },
    {
      label: "You Are Owed",
      value: totalOwed,
      bg: "from-emerald-50 to-teal-50",
      border: "border-emerald-100/60",
      iconGrad: "from-emerald-500 to-teal-600",
      textColor: "text-emerald-600",
      labelColor: "text-emerald-600",
      sub: "across all groups",
      icon: TrendingUp,
    },
    {
      label: "Net Balance",
      value: overallNetBalance,
      bg:
        overallNetBalance >= 0
          ? "from-indigo-50 to-violet-50"
          : "from-red-50 to-rose-50",
      border:
        overallNetBalance >= 0 ? "border-indigo-100/60" : "border-red-100/60",
      iconGrad:
        overallNetBalance >= 0
          ? "from-indigo-500 to-violet-600"
          : "from-red-500 to-rose-600",
      textColor: overallNetBalance >= 0 ? "text-indigo-600" : "text-red-600",
      labelColor: overallNetBalance >= 0 ? "text-indigo-500" : "text-red-500",
      sub: "overall position",
      icon: Scale,
      prefix: overallNetBalance >= 0 ? "+" : "",
    },
  ];

  return (
    <div className="bg-page">
      <Navbar />

      <div className="page-container py-6 sm:py-8 lg:py-10 flex flex-col gap-6 sm:gap-8">
        {/* Back */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors duration-200 group w-fit"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="animate-slide-up">
          <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-2">
            Balances
          </p>
          <h1 className="page-title">Consolidated Overview</h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">
            All debts and credits across your groups
          </p>
        </div>

        {/* Summary Cards */}
        <div className="stats-grid">
          {summaryCards.map(
            ({
              label,
              value,
              bg,
              border,
              iconGrad,
              textColor,
              labelColor,
              sub,
              icon: Icon,
              prefix = "",
            }) => (
              <div
                key={label}
                className={`stat-card bg-gradient-to-br ${bg} border ${border} card-interactive`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <p
                    className={`text-[10px] font-bold uppercase tracking-widest ${labelColor}`}
                  >
                    {label}
                  </p>
                  <div
                    className={`stat-icon-wrap w-8 h-8 rounded-lg bg-gradient-to-br ${iconGrad} flex-shrink-0 transform transition-transform duration-300`}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                </div>
                <p
                  className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${textColor} leading-tight`}
                >
                  {prefix}₹{value.toFixed(2)}
                </p>
                <p
                  className={`text-xs mt-2 font-medium opacity-70 ${textColor}`}
                >
                  {sub}
                </p>
              </div>
            ),
          )}
        </div>

        {/* Group Breakdown */}
        <div className="card-elevated rounded-2xl overflow-hidden">
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between px-5 sm:px-7 py-4 sm:py-5 border-b border-slate-100">
            <div>
              <h2 className="section-title">Group Breakdown</h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Tap a group to view details
              </p>
            </div>
            {groupsSummary.length > 0 && (
              <span className="badge badge-blue w-fit">
                {groupsSummary.length} groups
              </span>
            )}
          </div>

          <div className="p-4 sm:p-6">
            {groupsSummary.length === 0 ? (
              <div className="text-center py-12">
                <div className="empty-state-icon">
                  <Scale className="w-9 h-9 text-indigo-500" />
                </div>
                <h3 className="text-base font-bold text-slate-700 mb-1.5">
                  No groups yet
                </h3>
                <p className="text-slate-400 text-sm font-medium mb-5">
                  You&apos;re not a member of any groups
                </p>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="btn-base btn-primary px-5 py-2.5 text-sm"
                >
                  Go to Dashboard
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {groupsSummary.map((group) => {
                  const net = group.netBalance;
                  return (
                    <div
                      key={group.groupId}
                      onClick={() => navigate(`/groups/${group.groupId}`)}
                      className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 cursor-pointer transition-all duration-200 group"
                    >
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm sm:text-base font-bold text-slate-800 mb-0.5 group-hover:text-indigo-700 transition-colors truncate">
                          {group.groupName}
                        </h3>
                        {group.description && (
                          <p className="text-xs text-slate-400 font-medium line-clamp-1 hidden sm:block">
                            {group.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="text-right">
                          <p
                            className={`text-lg sm:text-xl font-extrabold tracking-tight ${
                              net > 0
                                ? "text-emerald-600"
                                : net < 0
                                  ? "text-red-600"
                                  : "text-slate-400"
                            }`}
                          >
                            {net > 0 ? "+" : ""}₹{net.toFixed(2)}
                          </p>
                          <div className="text-[10px] text-slate-400 font-medium mt-0.5 space-x-1">
                            <span className="text-emerald-500">
                              ↑₹{group.userOwed.toFixed(2)}
                            </span>
                            <span>·</span>
                            <span className="text-red-500">
                              ↓₹{group.userOwes.toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all duration-200" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Balances;
