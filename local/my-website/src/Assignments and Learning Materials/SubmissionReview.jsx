import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AssignmentNav from "./AssignmentNav";
import { getAssignments, getSubmissions } from "./assignmentData";
import "./SubmissionReview.css";

export default function SubmissionReview() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [assignments] = useState(getAssignments());
  const [submissions] = useState(getSubmissions());

  const initialAsnId = searchParams.get("id") || "All";
  const [selectedAsnFilter, setSelectedAsnFilter] = useState(initialAsnId);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewSub, setPreviewSub] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const idFromUrl = searchParams.get("id");
    if (idFromUrl) setSelectedAsnFilter(idFromUrl);
  }, [searchParams]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  const filteredSubmissions = submissions.filter((sub) => {
    if (selectedAsnFilter !== "All" && sub.assignmentId !== selectedAsnFilter) return false;
    if (statusFilter !== "All" && sub.status !== statusFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = sub.studentName.toLowerCase().includes(q);
      const matchRoll = sub.rollNumber.toLowerCase().includes(q);
      const matchFile = sub.fileUrl.toLowerCase().includes(q);
      if (!matchName && !matchRoll && !matchFile) return false;
    }
    return true;
  });

  const totalSubs = filteredSubmissions.length;
  const needsGradingCount = filteredSubmissions.filter((s) => s.status === "Needs Grading").length;
  const gradedCount = filteredSubmissions.filter((s) => s.status === "Graded").length;

  return (
    <div className="sr-page-container">
      {toast && (
        <div className="sr-toast">
          <span>✓</span> {toast}
        </div>
      )}

      <AssignmentNav
        title="Teacher Coursework Submission Review Desk"
        subtitle="Review uploaded student laboratory papers, inspect punctuality, and transition works to grading"
        badge="Module 13 • Screen 5 of 7"
      />

      {/* Header Banner */}
      <div className="sr-header-strip">
        <div>
          <span className="sr-tag">FACULTY EVALUATION QUEUE</span>
          <h1 className="sr-title">Submission Review Center</h1>
          <p className="sr-sub">
            Monitor, inspect and assess student document submissions across active curriculum courses.
          </p>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="sr-kpi-grid">
        <div className="sr-kpi-card">
          <span className="sr-kpi-label">Submissions Displayed</span>
          <div className="sr-kpi-val text-cyan">{totalSubs}</div>
          <span className="sr-kpi-sub">Filtered roster</span>
        </div>

        <div className="sr-kpi-card">
          <span className="sr-kpi-label">Awaiting Evaluation</span>
          <div className="sr-kpi-val text-amber">{needsGradingCount}</div>
          <span className="sr-kpi-sub">Pending faculty scoring</span>
        </div>

        <div className="sr-kpi-card">
          <span className="sr-kpi-label">Graded & Feedback Sent</span>
          <div className="sr-kpi-val text-emerald">{gradedCount}</div>
          <span className="sr-kpi-sub">Published to student portal</span>
        </div>
      </div>

      {/* Toolbar Strip */}
      <div className="sr-toolbar">
        <div className="sr-search-box">
          <span className="sr-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search scholar name, roll number, or file..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="sr-clear-btn" onClick={() => setSearchQuery("")}>
              ✕
            </button>
          )}
        </div>

        <div className="sr-filters">
          <div className="sr-filter-group">
            <label>Assignment Task:</label>
            <select
              value={selectedAsnFilter}
              onChange={(e) => setSelectedAsnFilter(e.target.value)}
            >
              <option value="All">All Coursework Assignments</option>
              {assignments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.subject}: {a.title}
                </option>
              ))}
            </select>
          </div>

          <div className="sr-filter-group">
            <label>Evaluation State:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All States</option>
              <option value="Needs Grading">⏳ Needs Grading</option>
              <option value="Graded">✅ Graded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submissions Table Card */}
      <div className="sr-card">
        <div className="sr-table-wrapper">
          <table className="sr-table">
            <thead>
              <tr>
                <th>Scholar Information</th>
                <th>Assignment Ref</th>
                <th>Submission Time</th>
                <th>Submitted Document</th>
                <th>Punctuality</th>
                <th>Status</th>
                <th>Score</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                    No submissions matching the active filters found.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub) => {
                  const targetAsn = assignments.find((a) => a.id === sub.assignmentId);
                  return (
                    <tr key={sub.id}>
                      <td>
                        <strong>{sub.studentName}</strong>
                        <div className="sr-roll-sub">
                          Roll: <span className="font-mono text-cyan">{sub.rollNumber}</span> • {sub.grade}
                        </div>
                      </td>
                      <td>
                        <span className="sr-asn-title-cell">
                          {targetAsn ? targetAsn.title : sub.assignmentId}
                        </span>
                        <div className="sr-asn-code font-mono">
                          {targetAsn?.subjectCode || "—"}
                        </div>
                      </td>
                      <td className="font-mono" style={{ fontSize: "0.82rem" }}>
                        {sub.submittedAt}
                      </td>
                      <td>
                        <button
                          className="sr-btn-file-preview"
                          onClick={() => setPreviewSub(sub)}
                          title="Preview student document"
                        >
                          📄 {sub.fileUrl}
                        </button>
                        <div className="sr-file-size font-mono">{sub.fileSize}</div>
                      </td>
                      <td>
                        <span className="sr-badge-on-time">✓ {sub.punctuality}</span>
                      </td>
                      <td>
                        <span
                          className={`sr-status-badge ${
                            sub.status === "Graded" ? "sr-status-graded" : "sr-status-pending"
                          }`}
                        >
                          ● {sub.status}
                        </span>
                      </td>
                      <td>
                        {sub.gradePoints !== null ? (
                          <strong className="sr-score-val text-emerald font-mono">
                            {sub.gradePoints} / {sub.maxPoints}
                          </strong>
                        ) : (
                          <span style={{ color: "#fbbf24", fontSize: "0.84rem" }}>Pending</span>
                        )}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          className="sr-btn-grade-now"
                          onClick={() => navigate(`/grading-feedback?subId=${sub.id}`)}
                        >
                          {sub.status === "Graded" ? "✏️ Edit Grade" : "⭐ Grade Work"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Quick Preview Modal */}
      {previewSub && (
        <div className="sr-modal-backdrop" onClick={() => setPreviewSub(null)}>
          <div className="sr-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="sr-modal-header">
              <div>
                <span className="sr-modal-tag">STUDENT SUBMISSION INSPECTION</span>
                <h3>{previewSub.studentName} — {previewSub.fileUrl}</h3>
              </div>
              <button className="sr-modal-close" onClick={() => setPreviewSub(null)}>
                ✕
              </button>
            </div>

            <div className="sr-preview-content">
              <div className="sr-preview-meta">
                <div>Roll Number: <strong>{previewSub.rollNumber}</strong></div>
                <div>Class: <strong>{previewSub.grade}</strong></div>
                <div>Submitted At: <strong>{previewSub.submittedAt}</strong></div>
                <div>File Size: <strong>{previewSub.fileSize}</strong></div>
              </div>

              {previewSub.studentNote && (
                <div className="sr-note-box">
                  <strong>Scholar's Comment:</strong>
                  <p>"{previewSub.studentNote}"</p>
                </div>
              )}

              <div className="sr-preview-sim">
                <div className="sr-sim-icon">📑</div>
                <h4>Document Content Rendered</h4>
                <p>Simulating full document rendering for <strong>{previewSub.fileUrl}</strong>.</p>
              </div>
            </div>

            <div className="sr-modal-footer">
              <button
                className="sr-btn-modal-close"
                onClick={() => setPreviewSub(null)}
              >
                Close Preview
              </button>
              <button
                className="sr-btn-modal-grade"
                onClick={() => {
                  const id = previewSub.id;
                  setPreviewSub(null);
                  navigate(`/grading-feedback?subId=${id}`);
                }}
              >
                ⭐ Proceed to Grade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
