import React, { useState } from "react";
import "./MarksImport.css";
import ExamNav from "./ExamNav";
import { getMarks, saveMarks, getAssessments } from "./examData";
import SpinningWordsBackground from "../components/SpinningWordsBackground";
import DailyQuotePopupModal from "../components/DailyQuotePopupModal";

const SAMPLE_CSV_ROWS = [
  { id: 1, roll: "11A-01", stuId: "STU-SMIA-001", name: "Elena Rostova", classScore: 28.5, midTermScore: 19.0, examScore: 48.5, total: 96.0, grade: "A1", status: "Valid" },
  { id: 2, roll: "11A-04", stuId: "STU-SMIA-002", name: "Kwame Mensah", classScore: 29.5, midTermScore: 19.5, examScore: 49.0, total: 98.0, grade: "A1", status: "Valid" },
  { id: 3, roll: "11A-07", stuId: "STU-SMIA-003", name: "Lucas Vance", classScore: 24.0, midTermScore: 16.0, examScore: 44.0, total: 84.0, grade: "A1", status: "Valid" },
  { id: 4, roll: "11A-09", stuId: "STU-SMIA-004", name: "Ama Serwaa", classScore: 27.0, midTermScore: 18.0, examScore: 47.0, total: 92.0, grade: "A1", status: "Valid" },
  { id: 5, roll: "11A-12", stuId: "STU-SMIA-005", name: "Liam Carter", classScore: 22.0, midTermScore: 14.5, examScore: 41.5, total: 78.0, grade: "B2", status: "Valid" },
  { id: 6, roll: "11A-15", stuId: "STU-SMIA-006", name: "Sophia Martinez", classScore: 28.0, midTermScore: 19.0, examScore: 48.0, total: 95.0, grade: "A1", status: "Valid" },
  { id: 7, roll: "11A-18", stuId: "STU-SMIA-007", name: "Noah Williams", classScore: 31.0, midTermScore: 12.0, examScore: 38.0, total: 81.0, grade: "A1", status: "Warning: Class score exceeds 30" },
];

export default function MarksImport() {
  const assessments = getAssessments();
  const [selectedAssessment, setSelectedAssessment] = useState(assessments[0]?.id || "ASM-2026-001");
  const [targetClass, setTargetClass] = useState("Grade 11-A");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewRows, setPreviewRows] = useState(SAMPLE_CSV_ROWS);
  const [toastMessage, setToastMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSimulateUpload = (filename) => {
    setUploadedFile(filename || "Grade11A_ElectiveMaths_Term1_Scores.xlsx");
    setPreviewRows(SAMPLE_CSV_ROWS);
    showToast(`Spreadsheet "${filename || "Grade11A_Scores.xlsx"}" parsed successfully! 7 candidate records detected.`);
  };

  const handleCommitImport = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      showToast("7 student examination marks committed to system gradebook!");
    }, 900);
  };

  const validCount = previewRows.filter((r) => r.status === "Valid").length;
  const warningCount = previewRows.filter((r) => r.status !== "Valid").length;

  return (
    <div className="mi-page-wrapper">
      <SpinningWordsBackground speed="slow" />
      <DailyQuotePopupModal />

      {toastMessage && <div className="mi-toast">✓ {toastMessage}</div>}

      <ExamNav
        title="Marks Import"
        subtitle="Batch import student continuous assessments, midterms, and exam results from Excel / CSV files"
        badge="Screen 4 of 12"
      />

      {/* Configuration Strip */}
      <div className="mi-config-card">
        <div className="mi-config-group">
          <label>Target Assessment / Paper</label>
          <select
            value={selectedAssessment}
            onChange={(e) => setSelectedAssessment(e.target.value)}
            className="mi-select"
          >
            {assessments.map((a) => (
              <option key={a.id} value={a.id}>
                {a.title} ({a.subject} • {a.code})
              </option>
            ))}
          </select>
        </div>

        <div className="mi-config-group">
          <label>Target Class / Stream</label>
          <select
            value={targetClass}
            onChange={(e) => setTargetClass(e.target.value)}
            className="mi-select"
          >
            <option value="Grade 11-A">Grade 11-A (Science Track)</option>
            <option value="Grade 11-B">Grade 11-B (Arts & Business)</option>
            <option value="Grade 12-A">Grade 12-A (Final Year)</option>
          </select>
        </div>

        <div className="mi-config-group">
          <label>Spreadsheet Template</label>
          <button
            type="button"
            className="mi-btn-template"
            onClick={() => showToast("Downloading pre-populated CSV template with student IDs...")}
          >
            📥 Download Blank Template (.CSV)
          </button>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div className="mi-dropzone-card">
        <div className="mi-dropzone-inner">
          <div className="mi-drop-icon">📊</div>
          <h3 className="mi-drop-title">Upload Examination Marks Spreadsheet</h3>
          <p className="mi-drop-sub">
            Drag and drop your formatted Excel file (.xlsx, .xls) or Comma Separated Values (.csv).
          </p>

          <div className="mi-drop-buttons">
            <button
              type="button"
              className="mi-btn-upload"
              onClick={() => handleSimulateUpload("Term1_Maths_MasterMarks.xlsx")}
            >
              📁 Choose Excel / CSV File
            </button>
            <button
              type="button"
              className="mi-btn-sample"
              onClick={() => handleSimulateUpload("Sample_Mock_WAEC_Grade11A.csv")}
            >
              ⚡ Load Sample Test Dataset
            </button>
          </div>

          {uploadedFile && (
            <div className="mi-file-badge">
              <span>📄 Active File: <strong>{uploadedFile}</strong></span>
              <span>• Status: Ready for verification</span>
            </div>
          )}
        </div>
      </div>

      {/* Validation & Preview Panel */}
      <div className="mi-preview-card">
        <div className="mi-preview-header">
          <div>
            <h3 className="mi-preview-title">Parsed Records Validation Preview</h3>
            <p className="mi-preview-sub">Review parsed scores before confirming insertion into permanent student records</p>
          </div>

          <div className="mi-preview-actions">
            <span className="mi-badge mi-badge-valid">✓ {validCount} Valid Records</span>
            {warningCount > 0 && (
              <span className="mi-badge mi-badge-warn">⚠ {warningCount} Warnings Flagged</span>
            )}
            <button
              type="button"
              className="mi-btn-commit"
              disabled={isProcessing}
              onClick={handleCommitImport}
            >
              {isProcessing ? "⏳ Importing..." : "🚀 Commit & Import Marks to System"}
            </button>
          </div>
        </div>

        <div className="mi-table-responsive">
          <table className="mi-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student ID</th>
                <th>Student Full Name</th>
                <th>Class Work (30)</th>
                <th>Mid-Term (20)</th>
                <th>Exam Score (50)</th>
                <th>Total (100)</th>
                <th>Grade</th>
                <th>Validation Status</th>
              </tr>
            </thead>
            <tbody>
              {previewRows.map((r) => (
                <tr key={r.id} className={r.status.startsWith("Warning") ? "row-warn" : ""}>
                  <td><span className="mi-roll">{r.roll}</span></td>
                  <td><span className="mi-id">{r.stuId}</span></td>
                  <td><strong>{r.name}</strong></td>
                  <td>{r.classScore}</td>
                  <td>{r.midTermScore}</td>
                  <td>{r.examScore}</td>
                  <td><strong>{r.total}</strong></td>
                  <td><span className="mi-grade">{r.grade}</span></td>
                  <td>
                    <span className={`mi-status-pill ${r.status === "Valid" ? "valid" : "warn"}`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
