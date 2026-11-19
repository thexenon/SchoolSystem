import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import AssignmentNav from "./AssignmentNav";
import { getAssignments } from "./assignmentData";
import "./AssignmentDetails.css";

export default function AssignmentDetails() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [assignments] = useState(getAssignments());
  const initialId = searchParams.get("id") || assignments[0]?.id || "";
  const [selectedId, setSelectedId] = useState(initialId);
  const [toast, setToast] = useState(null);

  const currentAssignment = assignments.find((a) => a.id === selectedId) || assignments[0];

  useEffect(() => {
    const idFromUrl = searchParams.get("id");
    if (idFromUrl && idFromUrl !== selectedId) {
      setSelectedId(idFromUrl);
    }
  }, [searchParams]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  const handleDownloadAttachment = (attName) => {
    showToast(`Downloading attachment "${attName}"...`);
  };

  if (!currentAssignment) {
    return (
      <div className="ad-page-container">
        <AssignmentNav />
        <div className="ad-empty">No assignments found.</div>
      </div>
    );
  }

  const submissionPct = Math.round(
    (currentAssignment.submittedCount / currentAssignment.totalEnrolled) * 100
  );

  return (
    <div className="ad-page-container">
      {toast && (
        <div className="ad-toast">
          <span>✓</span> {toast}
        </div>
      )}

      <AssignmentNav
        title="Coursework Specification & Instructions"
        subtitle="Detailed problem statement, evaluation criteria, attachments, and turn-in milestones"
        badge="Module 13 • Screen 3 of 7"
      />

      {/* Top Selector & Back Button */}
      <div className="ad-top-strip">
        <Link to="/assignment-list" className="ad-back-link">
          ← Back to Assignment Catalog
        </Link>

        <div className="ad-switcher">
          <label>Inspecting Assignment:</label>
          <select
            value={currentAssignment.id}
            onChange={(e) => {
              setSelectedId(e.target.value);
              navigate(`/assignment-details?id=${e.target.value}`);
            }}
          >
            {assignments.map((a) => (
              <option key={a.id} value={a.id}>
                {a.subject}: {a.title} ({a.id})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Details Card */}
      <div className="ad-main-card">
        {/* Banner Section */}
        <div className="ad-header-banner">
          <div className="ad-tags-row">
            <span className="ad-subject-tag">
              {currentAssignment.subject} • {currentAssignment.subjectCode}
            </span>
            <span className="ad-class-tag">🏛️ {currentAssignment.targetClass}</span>
            <span className="ad-status-tag">● {currentAssignment.status}</span>
            <span className="ad-id-tag font-mono">{currentAssignment.id}</span>
          </div>

          <h1 className="ad-title">{currentAssignment.title}</h1>
          <p className="ad-author">
            Assigned by: <strong>{currentAssignment.teacher}</strong> • Posted on:{" "}
            <strong>{currentAssignment.createdAt}</strong>
          </p>
        </div>

        {/* Key Metrics Strip */}
        <div className="ad-stats-strip">
          <div className="ad-stat-box">
            <span className="ad-stat-label">Submission Deadline</span>
            <strong className="ad-stat-val text-amber font-mono">
              {currentAssignment.dueDate}
            </strong>
            <small className="ad-stat-sub">Cut-off: {currentAssignment.dueTime}</small>
          </div>

          <div className="ad-stat-box">
            <span className="ad-stat-label">Maximum Assessment Score</span>
            <strong className="ad-stat-val text-cyan font-mono">
              {currentAssignment.maxPoints} Points
            </strong>
            <small className="ad-stat-sub">Pass threshold: {currentAssignment.passingScore} Pts</small>
          </div>

          <div className="ad-stat-box">
            <span className="ad-stat-label">Accepted Format</span>
            <strong className="ad-stat-val text-emerald">
              {currentAssignment.submissionType}
            </strong>
            <small className="ad-stat-sub">Online digital turn-in</small>
          </div>

          <div className="ad-stat-box">
            <span className="ad-stat-label">Class Submission Rate</span>
            <strong className="ad-stat-val text-purple font-mono">
              {currentAssignment.submittedCount} / {currentAssignment.totalEnrolled}
            </strong>
            <small className="ad-stat-sub">{submissionPct}% Turnout</small>
          </div>
        </div>

        {/* Detailed Instructions Body */}
        <div className="ad-section">
          <h2 className="ad-section-heading">
            <span>📖</span> Detailed Instructions & Problem Statement
          </h2>
          <div className="ad-instructions-box">
            <p>{currentAssignment.instructions}</p>
          </div>
        </div>

        {/* Assessment Rubric Table */}
        <div className="ad-section">
          <h2 className="ad-section-heading">
            <span>🎯</span> Evaluation Rubric & Point Distribution
          </h2>
          <div className="ad-rubric-table-wrapper">
            <table className="ad-rubric-table">
              <thead>
                <tr>
                  <th>Assessment Criteria</th>
                  <th style={{ width: "160px", textAlign: "right" }}>Maximum Points</th>
                </tr>
              </thead>
              <tbody>
                {currentAssignment.rubric.map((r, idx) => (
                  <tr key={idx}>
                    <td>
                      <strong>{r.criteria}</strong>
                    </td>
                    <td style={{ textAlign: "right" }} className="font-mono text-cyan">
                      {r.points} Pts
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th>Total Maximum Points:</th>
                  <th style={{ textAlign: "right", color: "#34d399" }} className="font-mono">
                    {currentAssignment.maxPoints} Pts
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Reference Attachments */}
        <div className="ad-section">
          <h2 className="ad-section-heading">
            <span>📎</span> Teacher Reference Attachments
          </h2>
          <div className="ad-attachments-list">
            {currentAssignment.attachments.map((att, idx) => (
              <div key={idx} className="ad-attachment-card">
                <div className="ad-att-icon">📄</div>
                <div className="ad-att-info">
                  <div className="ad-att-name">{att.name}</div>
                  <div className="ad-att-size font-mono">{att.size}</div>
                </div>
                <button
                  className="ad-btn-download-att"
                  onClick={() => handleDownloadAttachment(att.name)}
                >
                  📥 Download File
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Progress & Quick Links Bar */}
        <div className="ad-footer-bar">
          <div className="ad-progress-summary">
            <span>
              Graded Submissions: <strong>{currentAssignment.gradedCount}</strong> of{" "}
              <strong>{currentAssignment.submittedCount}</strong> submitted
            </span>
          </div>

          <div className="ad-action-btns">
            <button
              className="ad-btn-action ad-btn-submit-work"
              onClick={() => navigate(`/student-submissions?id=${currentAssignment.id}`)}
            >
              📤 Submit Work as Student
            </button>
            <button
              className="ad-btn-action ad-btn-review-work"
              onClick={() => navigate(`/submission-review?id=${currentAssignment.id}`)}
            >
              📝 Review Submissions ({currentAssignment.submittedCount})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
