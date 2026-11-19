import React, { useState, useEffect } from "react";
import StudentNav from "./StudentNav";
import { getActiveStudent, STUDENT_RESULTS_DATA } from "./studentPortalData";
import "./MyResults.css";

export default function MyResults() {
  const [student, setStudent] = useState(getActiveStudent());
  const [resultsData] = useState(STUDENT_RESULTS_DATA);
  const [selectedTerm, setSelectedTerm] = useState("Term 1 (2026/2027)");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handleStudentChanged = (e) => {
      if (e.detail) setStudent(e.detail);
      else setStudent(getActiveStudent());
    };
    window.addEventListener("studentUserChanged", handleStudentChanged);
    return () => window.removeEventListener("studentUserChanged", handleStudentChanged);
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mr-page-container">
      {toast && (
        <div className="mr-toast">
          <span>✓</span> {toast}
        </div>
      )}

      <StudentNav
        title="Student Academic Results & Terminal Report"
        subtitle="Official certified examination scores, continuous assessments, GPA calculation, and tutor remarks"
        badge="Module 12 • Screen 5 of 10"
      />

      {/* Header Banner */}
      <div className="mr-header-strip">
        <div>
          <span className="mr-tag">OFFICIAL TERMINAL REPORT CARD</span>
          <h1 className="mr-title">Published Academic Results</h1>
          <p className="mr-sub">
            Verified academic report for <strong>{student.fullName}</strong> ({student.id}) •{" "}
            {student.grade} - {student.section}
          </p>
        </div>

        <div className="mr-actions">
          <select
            className="mr-term-select"
            value={selectedTerm}
            onChange={(e) => {
              setSelectedTerm(e.target.value);
              showToast(`Loaded published results for ${e.target.value}`);
            }}
          >
            <option value="Term 1 (2026/2027)">Term 1 (2026/2027) • Current</option>
            <option value="Term 3 (2025/2026)">Term 3 (2025/2026) • Archived</option>
            <option value="Term 2 (2025/2026)">Term 2 (2025/2026) • Archived</option>
          </select>

          <button className="mr-btn-print" onClick={handlePrint}>
            🖨️ Print Report Card
          </button>
        </div>
      </div>

      {/* Summary Performance Metric Cards */}
      <div className="mr-kpi-grid">
        <div className="mr-kpi-card">
          <span className="mr-kpi-label">Terminal GPA</span>
          <div className="mr-kpi-val text-cyan">
            {resultsData.gpa} <small>/ 4.00</small>
          </div>
          <span className="mr-kpi-sub">Dean's Honor Roll Standard</span>
        </div>

        <div className="mr-kpi-card">
          <span className="mr-kpi-label">Cohort Position</span>
          <div className="mr-kpi-val text-emerald">{resultsData.position}</div>
          <span className="mr-kpi-sub">Grade 11 Science Division</span>
        </div>

        <div className="mr-kpi-card">
          <span className="mr-kpi-label">General Conduct</span>
          <div className="mr-kpi-val text-purple">{resultsData.conduct}</div>
          <span className="mr-kpi-sub">Zero disciplinary infractions</span>
        </div>

        <div className="mr-kpi-card">
          <span className="mr-kpi-label">Courses Evaluated</span>
          <div className="mr-kpi-val text-amber">{resultsData.subjects.length} Subjects</div>
          <span className="mr-kpi-sub">21 Total Credit Units</span>
        </div>
      </div>

      {/* Results Table Card */}
      <div className="mr-card">
        <div className="mr-card-header">
          <h2>Continuous Assessment & Examination Breakdown</h2>
          <span className="mr-term-pill">{selectedTerm}</span>
        </div>

        <div className="mr-table-wrapper">
          <table className="mr-table">
            <thead>
              <tr>
                <th>Subject & Code</th>
                <th style={{ textAlign: "center" }}>Class Assessment (30%)</th>
                <th style={{ textAlign: "center" }}>Terminal Exam (70%)</th>
                <th style={{ textAlign: "center" }}>Total Score (100%)</th>
                <th style={{ textAlign: "center" }}>Letter Grade</th>
                <th style={{ textAlign: "center" }}>Points</th>
                <th>Instructor Appraisal</th>
              </tr>
            </thead>
            <tbody>
              {resultsData.subjects.map((sub) => (
                <tr key={sub.code}>
                  <td>
                    <strong>{sub.name}</strong>
                    <div className="mr-code font-mono">{sub.code}</div>
                  </td>
                  <td style={{ textAlign: "center", fontWeight: 600 }}>{sub.classScore} / 30</td>
                  <td style={{ textAlign: "center", fontWeight: 600 }}>{sub.examScore} / 70</td>
                  <td style={{ textAlign: "center" }}>
                    <span className="mr-total-score text-cyan font-mono">{sub.total}%</span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <span className="mr-grade-pill">{sub.grade}</span>
                  </td>
                  <td style={{ textAlign: "center", fontFamily: "JetBrains Mono", color: "#38bdf8" }}>
                    {sub.points.toFixed(2)}
                  </td>
                  <td className="mr-remark-cell">{sub.remark}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Sign-Off Endorsements */}
      <div className="mr-endorsements-grid">
        <div className="mr-endorse-card">
          <div className="mr-endorse-role">Form Tutor's Comprehensive Report</div>
          <p className="mr-endorse-text">
            "Kwame continues to exhibit remarkable dedication in the sciences and advanced calculus.
            He has consistently demonstrated initiative in problem-solving and peer mentoring."
          </p>
          <div className="mr-sign-row">
            <span>Signature: __________________________</span>
            <strong>Dr. Kwabena Asante</strong>
          </div>
        </div>

        <div className="mr-endorse-card">
          <div className="mr-endorse-role">Principal & Headmistress's Endorsement</div>
          <p className="mr-endorse-text">
            "{resultsData.headmasterRemark}"
          </p>
          <div className="mr-sign-row">
            <span>Official Seal: [ Verified ]</span>
            <strong>Dame Eleanor Vance, Ph.D.</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
