import { Download, FileText } from "lucide-react";
import Button from "../common/Button";

const ImportReport = ({ report }) => {
  const generateReport = () => {
    const reportText = `
EXPENSE IMPORT REPORT
=====================
Generated: ${new Date().toLocaleString()}

SUMMARY
-------
Total Rows: ${report.totalRows}
Successfully Imported: ${report.successfulRows}
Failed/Skipped: ${report.failedRows}
Success Rate: ${((report.successfulRows / report.totalRows) * 100).toFixed(2)}%

ANOMALIES DETECTED (${report.anomalies.length})
------------------
${report.anomalies
  .map(
    (anomaly, idx) => `
${idx + 1}. Row ${anomaly.rowNumber}: ${anomaly.data.Description || "No description"}
   Issues:
${anomaly.anomalies.map((a) => `   - ${a.type}: ${a.message} [Action: ${a.action}]`).join("\n")}
`,
  )
  .join("\n")}

DATA QUALITY ISSUES HANDLED
---------------------------
${getAnomalyTypeSummary(report.anomalies)}

POLICIES APPLIED
----------------
- Duplicates: Flagged for approval
- Negative amounts: Treated as potential refunds
- Currency mismatches: USD converted to INR at configured rate
- Invalid splits: Corrected or skipped based on severity
- Member timeline: Expenses validated against join/leave dates
- Settlements: Flagged when detected in expense data

END OF REPORT
    `;

    const blob = new Blob([reportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `import-report-${new Date().getTime()}.txt`;
    a.click();
  };

  const getAnomalyTypeSummary = (anomalies) => {
    const summary = {};
    anomalies.forEach((anomaly) => {
      anomaly.anomalies.forEach((a) => {
        summary[a.type] = (summary[a.type] || 0) + 1;
      });
    });

    return Object.entries(summary)
      .map(
        ([type, count]) =>
          `- ${type.replace(/_/g, " ")}: ${count} occurrence(s)`,
      )
      .join("\n");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FileText className="w-6 h-6 text-blue-600 mr-2" />
          <h3 className="text-xl font-bold text-gray-900">Import Report</h3>
        </div>
        <Button size="sm" variant="outline" onClick={generateReport}>
          <Download className="w-4 h-4 mr-2" />
          Download Report
        </Button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Success Rate</p>
            <p className="text-2xl font-bold text-gray-900">
              {((report.successfulRows / report.totalRows) * 100).toFixed(2)}%
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Anomalies Detected</p>
            <p className="text-2xl font-bold text-gray-900">
              {report.anomalies.length}
            </p>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">
            Anomaly Type Breakdown
          </h4>
          <div className="space-y-2">
            {Object.entries(
              report.anomalies.reduce((acc, anomaly) => {
                anomaly.anomalies.forEach((a) => {
                  acc[a.type] = (acc[a.type] || 0) + 1;
                });
                return acc;
              }, {}),
            ).map(([type, count]) => (
              <div key={type} className="flex justify-between items-center">
                <span className="text-sm text-gray-700">
                  {type.replace(/_/g, " ")}
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">
            Import Policies Applied
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              ✓ Duplicate detection based on description, amount, date, and
              payer
            </li>
            <li>
              ✓ Currency conversion (USD → INR) at configured exchange rate
            </li>
            <li>✓ Member timeline validation against join/leave dates</li>
            <li>✓ Split validation ensuring amounts match total</li>
            <li>✓ Settlement detection and flagging</li>
            <li>✓ Data type and format validation</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ImportReport;
