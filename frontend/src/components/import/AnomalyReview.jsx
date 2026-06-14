import { useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";

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

  const getAnomalyColor = (type) => {
    const colorMap = {
      DUPLICATE: "yellow",
      NEGATIVE_AMOUNT: "orange",
      INVALID_SPLIT: "red",
      CURRENCY_MISMATCH: "blue",
      MEMBER_NOT_IN_GROUP: "red",
      SETTLEMENT_AS_EXPENSE: "purple",
      INVALID_DATE: "red",
      MISSING_FIELDS: "red",
      AMOUNT_MISMATCH: "orange",
      INVALID_PERCENTAGE: "orange",
      MEMBER_LEFT_BEFORE_EXPENSE: "yellow",
      INCONSISTENT_FORMAT: "blue",
    };
    return colorMap[type] || "gray";
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <AlertTriangle className="w-6 h-6 text-yellow-600 mr-2" />
        <h3 className="text-xl font-bold text-gray-900">
          Anomalies Detected ({anomalies.length})
        </h3>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        The following issues were found and handled according to our policies:
      </p>

      <div className="space-y-3">
        {anomalies.map((anomaly) => {
          const isExpanded = expandedRows.has(anomaly.rowNumber);

          return (
            <div
              key={anomaly.rowNumber}
              className="border border-gray-200 rounded-lg"
            >
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleRow(anomaly.rowNumber)}
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-sm font-mono rounded">
                      Row {anomaly.rowNumber}
                    </span>
                    <span className="font-medium text-gray-900">
                      {anomaly.data.Description || "No description"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {anomaly.anomalies.map((a, idx) => {
                      const color = getAnomalyColor(a.type);
                      return (
                        <span
                          key={idx}
                          className={`px-2 py-1 text-xs rounded-full bg-${color}-100 text-${color}-800`}
                        >
                          {a.type.replace(/_/g, " ")}
                        </span>
                      );
                    })}
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>

              {isExpanded && (
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  <div className="space-y-4">
                    {/* Row Data */}
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">
                        Row Data:
                      </h4>
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <pre className="text-xs text-gray-600 overflow-x-auto">
                          {JSON.stringify(anomaly.data, null, 2)}
                        </pre>
                      </div>
                    </div>

                    {/* Anomaly Details */}
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">
                        Issues Found:
                      </h4>
                      <div className="space-y-2">
                        {anomaly.anomalies.map((a, idx) => (
                          <div
                            key={idx}
                            className="bg-white p-3 rounded border border-gray-200"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium text-gray-900">
                                  {a.type.replace(/_/g, " ")}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  {a.message}
                                </p>
                              </div>
                              <span
                                className={`px-2 py-1 text-xs rounded bg-${getAnomalyColor(a.type)}-100 text-${getAnomalyColor(a.type)}-800`}
                              >
                                {a.action}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
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
