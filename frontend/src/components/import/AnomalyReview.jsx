import { useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";

const anomalyColorMap = {
  DUPLICATE: { bg: '#fef9c3', text: '#854d0e' },
  NEGATIVE_AMOUNT: { bg: '#ffedd5', text: '#9a3412' },
  INVALID_SPLIT: { bg: '#fef2f2', text: '#991b1b' },
  CURRENCY_MISMATCH: { bg: '#dbeafe', text: '#1e40af' },
  MEMBER_NOT_IN_GROUP: { bg: '#fef2f2', text: '#991b1b' },
  SETTLEMENT_AS_EXPENSE: { bg: '#f3e8ff', text: '#6b21a8' },
  INVALID_DATE: { bg: '#fef2f2', text: '#991b1b' },
  MISSING_FIELDS: { bg: '#fef2f2', text: '#991b1b' },
  AMOUNT_MISMATCH: { bg: '#ffedd5', text: '#9a3412' },
  INVALID_PERCENTAGE: { bg: '#ffedd5', text: '#9a3412' },
  MEMBER_LEFT_BEFORE_EXPENSE: { bg: '#fef9c3', text: '#854d0e' },
  INCONSISTENT_FORMAT: { bg: '#dbeafe', text: '#1e40af' },
};

const getColor = (type) => anomalyColorMap[type] || { bg: '#f3f4f6', text: '#374151' };

const AnomalyReview = ({ anomalies }) => {
  const [expandedRows, setExpandedRows] = useState(new Set());

  const toggleRow = (rowNumber) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(rowNumber)) {
      newExpanded.delete(rowNumber);
    } else {
      newExpanded.add(rowNumber);
    }
    setExpandedRows(newExpanded);
  };

  return (
    <div className="card-elevated rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle style={{ width: '1.5rem', height: '1.5rem', color: '#ca8a04' }} />
        <h3 className="text-lg font-bold text-slate-800">
          Anomalies Detected ({anomalies.length})
        </h3>
      </div>

      <p className="text-sm text-slate-500 font-medium mb-4">
        The following issues were found and handled according to our policies:
      </p>

      <div className="flex flex-col gap-3">
        {anomalies.map((anomaly) => {
          const isExpanded = expandedRows.has(anomaly.rowNumber);

          return (
            <div
              key={anomaly.rowNumber}
              className="rounded-xl overflow-hidden"
              style={{ border: '1px solid #e2e8f0' }}
            >
              <div
                className="flex items-center justify-between p-4 cursor-pointer"
                style={{ transition: 'background 0.15s' }}
                onClick={() => toggleRow(anomaly.rowNumber)}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span
                      className="text-sm font-mono rounded-lg"
                      style={{ padding: '0.25rem 0.5rem', background: '#f1f5f9', color: '#334155' }}
                    >
                      Row {anomaly.rowNumber}
                    </span>
                    <span className="font-semibold text-slate-800 text-sm">
                      {anomaly.data.Description || "No description"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {anomaly.anomalies.map((a, idx) => {
                      const color = getColor(a.type);
                      return (
                        <span
                          key={idx}
                          className="text-xs font-semibold rounded-full"
                          style={{ padding: '0.25rem 0.5rem', background: color.bg, color: color.text }}
                        >
                          {a.type.replace(/_/g, " ")}
                        </span>
                      );
                    })}
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp style={{ width: '1.25rem', height: '1.25rem', color: '#94a3b8' }} />
                ) : (
                  <ChevronDown style={{ width: '1.25rem', height: '1.25rem', color: '#94a3b8' }} />
                )}
              </div>

              {isExpanded && (
                <div className="p-4 space-y-4" style={{ borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
                  {/* Row Data */}
                  <div>
                    <h4 className="font-semibold text-sm text-slate-600 mb-2">
                      Row Data:
                    </h4>
                    <div className="rounded-xl" style={{ background: '#ffffff', padding: '0.75rem', border: '1px solid #e2e8f0' }}>
                      <pre className="text-xs text-slate-600" style={{ overflowX: 'auto' }}>
                        {JSON.stringify(anomaly.data, null, 2)}
                      </pre>
                    </div>
                  </div>

                  {/* Anomaly Details */}
                  <div>
                    <h4 className="font-semibold text-sm text-slate-600 mb-2">
                      Issues Found:
                    </h4>
                    <div className="space-y-2">
                      {anomaly.anomalies.map((a, idx) => {
                        const color = getColor(a.type);
                        return (
                          <div
                            key={idx}
                            className="rounded-xl p-3"
                            style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-semibold text-slate-800 text-sm">
                                  {a.type.replace(/_/g, " ")}
                                </p>
                                <p className="text-sm text-slate-500 mt-1">
                                  {a.message}
                                </p>
                              </div>
                              <span
                                className="text-xs font-semibold rounded-lg"
                                style={{ padding: '0.25rem 0.5rem', background: color.bg, color: color.text }}
                              >
                                {a.action}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnomalyReview;
