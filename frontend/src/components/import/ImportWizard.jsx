import React, { useState } from "react";
import { Upload, FileText, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";
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
  const [dragOver, setDragOver] = useState(false);

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

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "text/csv") {
      setFile(droppedFile);
      setError("");
    } else {
      setError("Please drop a valid CSV file");
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
    <div className="max-w-3xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center">
          {[
            { num: 1, label: "Upload CSV" },
            { num: 2, label: "Review Results" },
          ].map((s, idx) => (
            <React.Fragment key={s.num}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    step >= s.num
                      ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-200/60"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {step > s.num ? <CheckCircle className="w-5 h-5" /> : s.num}
                </div>
                <span className={`mt-2 text-xs font-semibold ${step >= s.num ? "text-indigo-600" : "text-slate-400"}`}>
                  {s.label}
                </span>
              </div>
              {idx < 1 && (
                <div
                  className={`flex-1 h-1 mx-4 rounded-full transition-all duration-500 ${
                    step > s.num ? "bg-gradient-to-r from-indigo-500 to-violet-600" : "bg-slate-100"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step 1: Upload */}
      {step === 1 && (
        <div className="card-elevated rounded-2xl p-8">
          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-200 cursor-pointer ${
              dragOver
                ? "border-indigo-400 bg-indigo-50/60"
                : file
                ? "border-emerald-300 bg-emerald-50/40"
                : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
            }`}
          >
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload" className="cursor-pointer">
              {file ? (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-4 shadow-lg shadow-emerald-200/60">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-base font-bold text-emerald-700 mb-1">{file.name}</p>
                  <p className="text-sm text-emerald-500 font-medium">
                    {(file.size / 1024).toFixed(2)} KB · Ready to upload
                  </p>
                  <p className="text-xs text-slate-400 mt-2 underline">Click to change file</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-100 flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-indigo-500" />
                  </div>
                  <p className="text-base font-bold text-slate-700 mb-1">
                    Drag & drop your CSV file
                  </p>
                  <p className="text-sm text-slate-400 font-medium">
                    or{" "}
                    <span className="text-indigo-600 font-semibold">browse to upload</span>
                  </p>
                  <p className="text-xs text-slate-300 mt-2">Supports .csv files only</p>
                </div>
              )}
            </label>
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Info box */}
          <div className="mt-5 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
            <h3 className="font-bold text-indigo-800 text-sm mb-2">What happens on upload?</h3>
            <ul className="text-sm text-indigo-700 space-y-1.5 font-medium">
              {[
                "Anomalies and duplicates will be flagged",
                "Currency conversions will be applied automatically",
                "You'll get a detailed per-row import report",
                "Split assignments are matched to group members",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <Button
            onClick={handleUpload}
            disabled={!file}
            loading={uploading}
            size="lg"
            className="w-full mt-6"
          >
            <Upload className="w-5 h-5" />
            {uploading ? "Processing..." : "Upload & Import"}
          </Button>
        </div>
      )}

      {/* Step 2: Results */}
      {step === 2 && importResult && (
        <div className="flex flex-col gap-5">
          {/* Summary Card */}
          <div className="card-elevated rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="section-title">Import Complete 🎉</h2>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Your CSV has been processed
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-2xl p-4 text-center bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100">
                <p className="text-3xl font-extrabold text-indigo-600">
                  {importResult.report.totalRows}
                </p>
                <p className="text-xs font-semibold text-indigo-500 mt-1 uppercase tracking-widest">Total</p>
              </div>
              <div className="rounded-2xl p-4 text-center bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
                <p className="text-3xl font-extrabold text-emerald-600">
                  {importResult.report.successfulRows}
                </p>
                <p className="text-xs font-semibold text-emerald-500 mt-1 uppercase tracking-widest">Imported</p>
              </div>
              <div className="rounded-2xl p-4 text-center bg-gradient-to-br from-red-50 to-rose-50 border border-red-100">
                <p className="text-3xl font-extrabold text-red-600">
                  {importResult.report.failedRows}
                </p>
                <p className="text-xs font-semibold text-red-500 mt-1 uppercase tracking-widest">Skipped</p>
              </div>
            </div>
          </div>

          {importResult.report.anomalies.length > 0 && (
            <AnomalyReview anomalies={importResult.report.anomalies} />
          )}

          <ImportReport report={importResult.report} />

          <div className="flex gap-4">
            <Button variant="secondary" onClick={resetWizard} className="flex-1">
              <RefreshCw className="w-4 h-4" />
              Import Another File
            </Button>
            <Button
              onClick={() => (window.location.href = `/groups/${groupId}`)}
              className="flex-1"
            >
              View Group →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportWizard;
