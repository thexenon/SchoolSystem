import React, { useState } from "react";
import "./ResultsReview.css";
import ExamNav from "./ExamNav";
import { getMarks, saveMarks } from "./examData";
import SpinningWordsBackground from "../components/SpinningWordsBackground";
import DailyQuotePopupModal from "../components/DailyQuotePopupModal";

export default function ResultsReview() {
  const [marks, setMarks] = useState(() => getMarks());
  const [selectedSubject, setSelectedSubject] = useState("ALL");
  const [selectedClass, setSelectedClass] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [auditModalItem, setAuditModalItem] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUpdateStatus = (id, newStatus) => {
    const updated = marks.map((m) =>
      m.id === id
        ? {
            ...m,
            reviewStatus: newStatus,
            reviewedBy: "Academic Auditor (Quality Assurance)",
            reviewedAt: new Date().toISOString().slice(0, 10),
          }
        : m
    );
    setMarks(updated);
    saveMarks(updated);
    showToast(`Result record status updated to "${newStatus}"!`);
    if (auditModalItem && auditModalItem.id === id) {
      setAuditModalItem({ ...auditModalItem, reviewStatus: newStatus });
    }
  };

  const handleBatchApprove = () => {
    const updated = marks.map((m) =>
      m.reviewStatus === "Under Review"
        ? {
            ...m,
            reviewStatus: "Approved",
            reviewedBy: "Quality Assurance Committee",
            reviewedAt: new Date().toISOString().slice(0, 10),
          }
        : m
    );
    setMarks(updated);
    saveMarks(updated);
    showToast("Batch approved all pending candidate examination results!");
  };

  const filteredMarks = marks.filter((m) => {
    const matchesSubject = selectedSubject === "ALL" || m.subject === selectedSubject;
    const matchesClass = selectedClass === "ALL" || m.classCohort === selectedClass;
    const matchesStatus = selectedStatus === "ALL" || m.reviewStatus === selectedStatus;
    return matchesSubject && matchesClass && matchesStatus;
  });

  const totalResults = marks.length;
  const pendingReview = marks.filter((m) => m.reviewStatus === "Under Review").length;
  const approvedCount = marks.filter((m) => m.reviewStatus === "Approved").length;
  const flaggedCount = marks.filter((m) => m.reviewStatus === "Flagged" || (m.totalScore < 50 && m.classScore > 20)).length;

  return (
    <div className="rr-page-wrapper">
      <SpinningWordsBackground speed="slow" />
      <DailyQuotePopupModal />

      {toastMessage && <div className="rr-toast">✓ {toastMessage}</div>}

      <ExamNav
        title="Results Review"
        subtitle="Academic quality assurance & auditing gate: inspect submitted grade sheets, verify calculations and flag score variances"
        badge="Screen 5 of 12"
      />

      {/* KPI Stats Strip */}
      <div className="rr-kpi-grid">
        <div className="rr-kpi-card">
          <div className="rr-kpi-label">Total Candidate Scripts</div>
          <div className="rr-kpi-val" style={{ color: "#38bdf8" }}>{totalResults}</div>
          <div className="rr-kpi-sub">Across all examination papers</div>
        </div>
        <div className="rr-kpi-card">
          <div className="rr-kpi-label">Pending Quality Audit</div>
          <div className="rr-kpi-val" style={{ color: "#f59e0b" }}>{pendingReview}</div>
          <div className="rr-kpi-sub">Requires verification before sign-off</div>
        </div>
        <div className="rr-kpi-card">
          <div className="rr-kpi-label">Approved by HOD / Dean</div>
          <div className="rr-kpi-val" style={{ color: "#10b981" }}>{approvedCount}</div>
          <div className="rr-kpi-sub">Ready for final publishing</div>
        </div>
        <div className="rr-kpi-card">
          <div className="rr-kpi-label">Statistical Discrepancies</div>
          <div className="rr-kpi-val" style={{ color: "#f87171" }}>{flaggedCount}</div>
          <div className="rr-kpi-sub">Variance between class & exam marks</div>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="rr-filter-panel">
        <div className="rr-filter-left">
          <select
            className="rr-select"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="ALL">All Subjects</option>
            <option value="Elective Mathematics">Elective Mathematics (MTH-401)</option>
            <option value="Physics">Physics (PHY-302)</option>
            <option value="Chemistry">Chemistry (CHM-301)</option>
          </select>

          <select
            className="rr-select"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="ALL">All Class Cohorts</option>
            <option value="Grade 11-A">Grade 11-A (Science Track)</option>
            <option value="Grade 11-B">Grade 11-B (Arts & Business)</option>
          </select>

          <select
            className="rr-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="ALL">All Audit Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Under Review">Under Review</option>
            <option value="Flagged">Flagged for Clarification</option>
          </select>
        </div>

        <button
          type="button"
          className="rr-batch-btn"
          onClick={handleBatchApprove}
        >
          ✅ Batch Approve All Verified ({pendingReview})
        </button>
      </div>

      {/* Review Table */}
      <div className="rr-table-card">
        <div className="rr-table-header">
          <h2 className="rr-table-title">Academic Result Scripts Awaiting Formal Moderation</h2>
          <span className="rr-count-pill">Showing {filteredMarks.length} Candidates</span>
        </div>

        <div className="rr-table-responsive">
          <table className="rr-table">
            <thead>
              <tr>
                <th>Student & Roll #</th>
                <th>Subject & Master</th>
                <th>Class Work (30)</th>
                <th>Midterm (20)</th>
                <th>Final Exam (50)</th>
                <th>Total (100)</th>
                <th>Grade</th>
                <th>Teacher Remark</th>
                <th>Audit Status</th>
                <th>Moderation Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMarks.map((m) => {
                const hasAnomaly = m.totalScore < 50 && m.classScore > 20;
                return (
                  <tr key={m.id} className={hasAnomaly ? "row-anomaly" : ""}>
                    <td>
                      <div className="rr-stu-name">{m.studentName}</div>
                      <div className="rr-stu-meta">{m.studentId} • Roll: {m.rollNumber}</div>
                    </td>
                    <td>
                      <div className="rr-sub-name">{m.subject}</div>
                      <div className="rr-teacher-name">Instructor: {m.teacherName}</div>
                    </td>
                    <td><span className="rr-score-val">{m.classScore}</span></td>
                    <td><span className="rr-score-val">{m.midTermScore}</span></td>
                    <td><span className="rr-score-val exam">{m.examScore}</span></td>
                    <td><strong className="rr-total-val">{m.totalScore}%</strong></td>
                    <td><span className="rr-grade-badge">{m.grade}</span></td>
                    <td>
                      <div className="rr-remark-text" title={m.remark}>{m.remark}</div>
                    </td>
                    <td>
                      <span className={`rr-status-pill ${m.reviewStatus.replace(/\s+/g, "").toLowerCase()}`}>
                        {m.reviewStatus}
                      </span>
                    </td>
                    <td>
                      <div className="rr-action-group">
                        <button
                          type="button"
                          className="rr-btn-action rr-btn-audit"
                          onClick={() => setAuditModalItem(m)}
                        >
                          🔍 Audit
                        </button>
                        {m.reviewStatus !== "Approved" && (
                          <button
                            type="button"
                            className="rr-btn-action rr-btn-pass"
                            onClick={() => handleUpdateStatus(m.id, "Approved")}
                          >
                            ✓ Approve
                          </button>
                        )}
                        {m.reviewStatus !== "Flagged" && (
                          <button
                            type="button"
                            className="rr-btn-action rr-btn-flag"
                            onClick={() => handleUpdateStatus(m.id, "Flagged")}
                          >
                            🚩 Flag
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Script Audit Detail Modal */}
      {auditModalItem && (
        <div className="rr-modal-backdrop" onClick={() => setAuditModalItem(null)}>
          <div className="rr-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="rr-modal-header">
              <h3 className="rr-modal-title">🔍 Comprehensive Script Audit & Moderation</h3>
              <button
                type="button"
                className="rr-modal-close"
                onClick={() => setAuditModalItem(null)}
              >
                ×
              </button>
            </div>

            <div className="rr-modal-body">
              <div className="rr-audit-hero">
                <div>
                  <h4 className="rr-hero-name">{auditModalItem.studentName} ({auditModalItem.studentId})</h4>
                  <p className="rr-hero-sub">
                    {auditModalItem.subject} • {auditModalItem.classCohort} • Form Instructor: {auditModalItem.teacherName}
                  </p>
                </div>
                <div className="rr-hero-score">
                  <div className="rr-hero-total">{auditModalItem.totalScore}%</div>
                  <div className="rr-hero-grade">Grade {auditModalItem.grade} (WAEC)</div>
                </div>
              </div>

              <div className="rr-score-breakdown-grid">
                <div className="rr-breakdown-box">
                  <div className="rr-box-label">Continuous Assessment</div>
                  <div className="rr-box-val">{auditModalItem.classScore} / 30</div>
                  <div className="rr-box-pct">{((auditModalItem.classScore / 30) * 100).toFixed(0)}% achievement</div>
                </div>
                <div className="rr-breakdown-box">
                  <div className="rr-box-label">Mid-Term Examination</div>
                  <div className="rr-box-val">{auditModalItem.midTermScore} / 20</div>
                  <div className="rr-box-pct">{((auditModalItem.midTermScore / 20) * 100).toFixed(0)}% achievement</div>
                </div>
                <div className="rr-breakdown-box">
                  <div className="rr-box-label">Final Written Exam</div>
                  <div className="rr-box-val">{auditModalItem.examScore} / 50</div>
                  <div className="rr-box-pct">{((auditModalItem.examScore / 50) * 100).toFixed(0)}% achievement</div>
                </div>
              </div>

              <div className="rr-audit-section">
                <label className="rr-audit-label">Instructor's Qualitative Observation</label>
                <div className="rr-audit-quote">
                  "{auditModalItem.remark}"
                </div>
              </div>

              <div className="rr-audit-section">
                <label className="rr-audit-label">Audit Log & Moderation History</label>
                <div className="rr-audit-trail">
                  <span>● Record ID: {auditModalItem.id}</span>
                  <span>● Current Status: <strong>{auditModalItem.reviewStatus}</strong></span>
                  <span>● Reviewed By: {auditModalItem.reviewedBy || "Pending Review"}</span>
                  <span>● Reviewed On: {auditModalItem.reviewedAt || "Not yet audited"}</span>
                </div>
              </div>
            </div>

            <div className="rr-modal-footer">
              <button
                type="button"
                className="rr-btn-flag"
                onClick={() => handleUpdateStatus(auditModalItem.id, "Flagged")}
              >
                🚩 Flag for Head of Dept Query
              </button>
              <button
                type="button"
                className="rr-btn-pass"
                onClick={() => handleUpdateStatus(auditModalItem.id, "Approved")}
              >
                ✅ Sign-Off & Approve Result
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
