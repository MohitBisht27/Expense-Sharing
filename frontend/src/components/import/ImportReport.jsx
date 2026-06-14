import { Download, FileText, CheckCircle } from "lucide-react";
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
    <div className="card-elevated rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <FileText style={{ width: '1.25rem', height: '1.25rem', color: '#4f46e5' }} />
          <h3 className="text-lg font-bold text-slate-800">Import Report</h3>
        </div>
        <Button size="sm" variant="outline" onClick={generateReport}>
          <Download style={{ width: '1rem', height: '1rem' }} />
          Download Report
        </Button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl p-4" style={{ background: '#f8fafc', border: '1px solid #f1f5f9' }}>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Success Rate</p>
            <p className="text-2xl font-extrabold text-slate-800">
              {((report.successfulRows / report.totalRows) * 100).toFixed(2)}%
            </p>
          </div>
          <div className="rounded-xl p-4" style={{ background: '#f8fafc', border: '1px solid #f1f5f9' }}>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Anomalies Detected</p>
            <p className="text-2xl font-extrabold text-slate-800">
              {report.anomalies.length}
            </p>
          </div>
        </div>

        <div className="rounded-xl p-4" style={{ border: '1px solid #e2e8f0' }}>
          <h4 className="font-bold text-slate-800 text-sm mb-3">
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
                <span className="text-sm text-slate-600 font-medium">
                  {type.replace(/_/g, " ")}
                </span>
                <span className="badge badge-blue">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl p-4" style={{ background: '#eef2ff', border: '1px solid #e0e7ff' }}>
          <h4 className="font-bold text-sm mb-2" style={{ color: '#3730a3' }}>
            Import Policies Applied
          </h4>
          <ul className="text-sm space-y-1.5 font-medium" style={{ color: '#4338ca' }}>
            {[
              "Duplicate detection based on description, amount, date, and payer",
              "Currency conversion (USD → INR) at configured exchange rate",
              "Member timeline validation against join/leave dates",
              "Split validation ensuring amounts match total",
              "Settlement detection and flagging",
              "Data type and format validation",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckCircle style={{ width: '0.875rem', height: '0.875rem', color: '#818cf8', flexShrink: 0 }} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ImportReport;
