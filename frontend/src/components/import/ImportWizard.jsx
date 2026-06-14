import React, { useState } from "react";
import { Upload, FileText, AlertTriangle, CheckCircle } from "lucide-react";
import Button from "../common/Button";
import AnomalyReview from "./AnomalyReview";
import ImportReport from "./ImportReport";
import { importAPI } from "../../api/import.api";

const ImportWizard = ({ groupId }) => {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      setError("");
    } else {
      setError("Please select a valid CSV file");
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const response = await importAPI.importCSV(groupId, file);
      setImportResult(response.data);
      setStep(2);
    } catch (err) {
      setError(err.message || "Failed to import CSV");
    } finally {
      setUploading(false);
    }
  };

  const resetWizard = () => {
    setStep(1);
    setFile(null);
    setImportResult(null);
    setError("");
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[
            { num: 1, label: "Upload File" },
            { num: 2, label: "Review Results" },
          ].map((s, idx) => (
            <React.Fragment key={s.num}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= s.num
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {s.num}
                </div>
                <span className="mt-2 text-sm font-medium">{s.label}</span>
              </div>
              {idx < 1 && (
                <div
                  className={`flex-1 h-1 mx-4 ${
                    step > s.num ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step 1: Upload */}
      {step === 1 && (
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-6">
            <Upload className="w-16 h-16 mx-auto text-blue-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Import Expenses from CSV
            </h2>
            <p className="text-gray-600">
              Upload your expense_export.csv file to import all expenses
            </p>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="csv-upload"
            />
            <label
              htmlFor="csv-upload"
              className="cursor-pointer inline-flex flex-col items-center"
            >
              <FileText className="w-12 h-12 text-gray-400 mb-2" />
              <span className="text-blue-600 font-medium">
                Click to select CSV file
              </span>
              <span className="text-sm text-gray-500 mt-1">
                or drag and drop
              </span>
            </label>

            {file && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium">{file.name}</p>
                <p className="text-sm text-green-600">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">
              What happens next?
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✓ We'll detect and report all data anomalies</li>
              <li>✓ You'll review what gets imported</li>
              <li>✓ Duplicates and errors will be flagged</li>
              <li>✓ Currency conversions will be applied</li>
              <li>✓ You'll get a detailed import report</li>
            </ul>
          </div>

          <Button
            onClick={handleUpload}
            disabled={!file}
            loading={uploading}
            className="w-full mt-6"
          >
            Upload and Process
          </Button>
        </div>
      )}

      {/* Step 2: Results */}
      {step === 2 && importResult && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Import Complete
              </h2>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-blue-600">
                  {importResult.report.totalRows}
                </p>
                <p className="text-sm text-blue-800 mt-1">Total Rows</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-green-600">
                  {importResult.report.successfulRows}
                </p>
                <p className="text-sm text-green-800 mt-1">Imported</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-red-600">
                  {importResult.report.failedRows}
                </p>
                <p className="text-sm text-red-800 mt-1">Skipped</p>
              </div>
            </div>
          </div>

          {/* Anomalies */}
          {importResult.report.anomalies.length > 0 && (
            <AnomalyReview anomalies={importResult.report.anomalies} />
          )}

          {/* Full Report */}
          <ImportReport report={importResult.report} />

          <div className="flex space-x-4">
            <Button
              variant="secondary"
              onClick={resetWizard}
              className="flex-1"
            >
              Import Another File
            </Button>
            <Button
              onClick={() => (window.location.href = `/groups/${groupId}`)}
              className="flex-1"
            >
              View Group
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportWizard;
