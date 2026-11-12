import React, { useState } from "react";
import "./MarksEntry.css";
import ExamNav from "./ExamNav";
import { getMarks, saveMarks, getAssessments } from "./examData";
import SpinningWordsBackground from "../components/SpinningWordsBackground";
import DailyQuotePopupModal from "../components/DailyQuotePopupModal";

export default function MarksEntry() {
  const [marks, setMarks] = useState(() => getMarks());
  const assessments = getAssessments();
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(assessments[0]?.id || "ASM-2026-001");
  const [selectedClass, setSelectedClass] = useState("Grade 11-A");
  const [toastMessage, setToastMessage] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const calculateGrade = (total) => {
    if (total >= 80) return { grade: "A1", gpa: 4.0, remark: "Distinction" };
    if (total >= 75) return { grade: "B2", gpa: 3.5, remark: "Very Good" };
    if (total >= 70) return { grade: "B3", gpa: 3.0, remark: "Good" };
    if (total >= 65) return { grade: "C4", gpa: 2.5, remark: "Credit" };
    if (total >= 60) return { grade: "C5", gpa: 2.0, remark: "Credit" };
    if (total >= 55) return { grade: "C6", gpa: 1.5, remark: "Credit" };
    if (total >= 50) return { grade: "D7", gpa: 1.0, remark: "Pass" };
    if (total >= 45) return { grade: "E8", gpa: 0.5, remark: "Weak Pass" };
    return { grade: "F9", gpa: 0.0, remark: "Fail" };
  };

  const handleScoreChange = (id, field, value) => {
    const numVal = Math.max(0, Math.min(field === "classScore" ? 30 : field === "midTermScore" ? 20 : 50, Number(value) || 0));

    setMarks((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: numVal };
          const newTotal = (Number(updated.classScore) || 0) + (Number(updated.midTermScore) || 0) + (Number(updated.examScore) || 0);
          const computed = calculateGrade(newTotal);
          return {
            ...updated,
            totalScore: Number(newTotal.toFixed(1)),
            grade: computed.grade,
            gpaPoint: computed.gpa,
          };
        }
        return item;
      })
    );
    setHasUnsavedChanges(true);
  };

  const handleRemarkChange = (id, text) => {
    setMarks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, remark: text } : item))
    );
    setHasUnsavedChanges(true);
  };

  const handleSaveDraft = () => {
    saveMarks(marks);
    setHasUnsavedChanges(false);
    showToast("Teacher gradebook scores saved to draft successfully!");
  };

  const handleSubmitForReview = () => {
    const updated = marks.map((m) => ({
      ...m,
      reviewStatus: "Under Review",
    }));
    setMarks(updated);
    saveMarks(updated);
    setHasUnsavedChanges(false);
    showToast("Grade sheet formally submitted to Head of Department for review!");
  };

  const activeAssessment = assessments.find((a) => a.id === selectedAssessmentId) || assessments[0];
  const activeMarks = marks.filter((m) => m.classCohort === selectedClass);

  const averageScore = activeMarks.length
    ? (activeMarks.reduce((acc, curr) => acc + curr.totalScore, 0) / activeMarks.length).toFixed(1)
    : 0;

  const distinctions = activeMarks.filter((m) => m.grade === "A1").length;

  return (
    <div className="me-page-wrapper">
      <SpinningWordsBackground speed="slow" />
      <DailyQuotePopupModal />

      {toastMessage && <div className="me-toast">✓ {toastMessage}</div>}

      <ExamNav
        title="Marks Entry"
        subtitle="Subject instructor portal for continuous assessment, midterm scores, and final examination entry"
        badge="Screen 3 of 12"
      />

      {/* Control Selector Bar */}
      <div className="me-selector-bar">
        <div className="me-selector-left">
          <div className="me-form-group">
            <label>Select Assessment / Examination</label>
            <select
              value={selectedAssessmentId}
              onChange={(e) => setSelectedAssessmentId(e.target.value)}
              className="me-select"
            >
              {assessments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title} ({a.subject} • Max {a.totalMarks})
                </option>
              ))}
            </select>
          </div>

          <div className="me-form-group">
            <label>Class Roster</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="me-select"
            >
              <option value="Grade 11-A">Grade 11-A (Science Track)</option>
              <option value="Grade 11-B">Grade 11-B (Arts & Business)</option>
              <option value="Grade 12-A">Grade 12-A (SHS 3 Final)</option>
            </select>
          </div>
        </div>

        <div className="me-selector-actions">
          {hasUnsavedChanges && (
            <span className="me-unsaved-badge">● Unsaved Changes</span>
          )}
          <button
            type="button"
            className="me-btn me-btn-draft"
            onClick={handleSaveDraft}
          >
            💾 Save Draft
          </button>
          <button
            type="button"
            className="me-btn me-btn-submit"
            onClick={handleSubmitForReview}
          >
            🚀 Submit for Review
          </button>
        </div>
      </div>

      {/* Score Summary Metrics */}
      <div className="me-stats-grid">
        <div className="me-stat-card">
          <div className="me-stat-label">Subject & Paper</div>
          <div className="me-stat-val" style={{ color: "#38bdf8", fontSize: "16px" }}>
            {activeAssessment?.subject || "Elective Mathematics"}
          </div>
          <div className="me-stat-sub">Code: {activeAssessment?.subjectCode || "MTH-401"}</div>
        </div>
        <div className="me-stat-card">
          <div className="me-stat-label">Students Graded</div>
          <div className="me-stat-val" style={{ color: "#10b981" }}>
            {activeMarks.length} / {activeMarks.length}
          </div>
          <div className="me-stat-sub">100% Score Completion</div>
        </div>
        <div className="me-stat-card">
          <div className="me-stat-label">Class Average Score</div>
          <div className="me-stat-val" style={{ color: "#f59e0b" }}>
            {averageScore}%
          </div>
          <div className="me-stat-sub">Benchmark: 70.0%</div>
        </div>
        <div className="me-stat-card">
          <div className="me-stat-label">Distinctions (A1)</div>
          <div className="me-stat-val" style={{ color: "#a855f7" }}>
            {distinctions} Students
          </div>
          <div className="me-stat-sub">WASSCE Standard 80%+</div>
        </div>
      </div>

      {/* Score Entry Table */}
      <div className="me-table-card">
        <div className="me-table-top">
          <div>
            <h3 className="me-table-title">Student Score Sheet • WAEC Grading Formula</h3>
            <p className="me-table-sub">
              Class Work / Labs (30%) + Mid-Term Test (20%) + Final Examination (50%) = Total Score (100%)
            </p>
          </div>
          <button
            type="button"
            className="me-btn-export"
            onClick={() => showToast("Exporting blank score sheet template...")}
          >
            📥 Download Template
          </button>
        </div>

        <div className="me-table-responsive">
          <table className="me-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Class Work (30)</th>
                <th>Mid-Term (20)</th>
                <th>Final Exam (50)</th>
                <th>Total (100)</th>
                <th>WAEC Grade</th>
                <th>Teacher's Qualitative Remark</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {activeMarks.map((m) => (
                <tr key={m.id}>
                  <td>
                    <span className="me-roll-pill">{m.rollNumber}</span>
                  </td>
                  <td>
                    <div className="me-stu-name">{m.studentName}</div>
                    <div className="me-stu-id">{m.studentId}</div>
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="30"
                      className="me-score-input"
                      value={m.classScore}
                      onChange={(e) => handleScoreChange(m.id, "classScore", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="20"
                      className="me-score-input"
                      value={m.midTermScore}
                      onChange={(e) => handleScoreChange(m.id, "midTermScore", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="50"
                      className="me-score-input me-input-exam"
                      value={m.examScore}
                      onChange={(e) => handleScoreChange(m.id, "examScore", e.target.value)}
                    />
                  </td>
                  <td>
                    <span className="me-total-score">{m.totalScore}</span>
                  </td>
                  <td>
                    <span className={`me-grade-badge me-grade-${m.grade.toLowerCase()}`}>
                      {m.grade}
                    </span>
                  </td>
                  <td>
                    <input
                      type="text"
                      className="me-remark-input"
                      value={m.remark}
                      onChange={(e) => handleRemarkChange(m.id, e.target.value)}
                      placeholder="Enter teacher remark..."
                    />
                  </td>
                  <td>
                    <span className={`me-review-badge me-review-${m.reviewStatus.replace(/\s+/g, "").toLowerCase()}`}>
                      {m.reviewStatus}
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
