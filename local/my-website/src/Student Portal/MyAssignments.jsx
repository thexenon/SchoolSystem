import React, { useState } from "react";
import StudentNav from "./StudentNav";
import { getStoredAssignments, saveStoredAssignments } from "./studentPortalData";
import "./MyAssignments.css";

export default function MyAssignments() {
  const [assignments, setAssignments] = useState(getStoredAssignments());
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSubmitModal, setActiveSubmitModal] = useState(null); // holds assignment object
  const [uploadFileName, setUploadFileName] = useState("");
  const [studentComments, setStudentComments] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  const handleOpenSubmit = (asn) => {
    setActiveSubmitModal(asn);
    setUploadFileName("");
    setStudentComments("");
  };

  const handleSubmitWork = (e) => {
    e.preventDefault();
    if (!uploadFileName) {
      showToast("Please choose a file or document to submit.");
      return;
    }

    const updated = assignments.map((item) => {
      if (item.id === activeSubmitModal.id) {
        return {
          ...item,
          status: "Submitted",
          submissionDate: new Date().toISOString().split("T")[0],
          submittedFile: uploadFileName,
        };
      }
      return item;
    });

    setAssignments(updated);
    saveStoredAssignments(updated);
    setActiveSubmitModal(null);
    showToast(`Assignment "${activeSubmitModal.title}" submitted successfully!`);
  };

  // Filter & Search
  const filteredAssignments = assignments.filter((item) => {
    if (filter !== "All" && item.status !== filter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSubject = item.subject.toLowerCase().includes(q);
      const matchTeacher = item.teacher.toLowerCase().includes(q);
      if (!matchTitle && !matchSubject && !matchTeacher) return false;
    }
    return true;
  });

  const totalCount = assignments.length;
  const inProgressCount = assignments.filter((a) => a.status === "In Progress" || a.status === "Pending").length;
  const submittedCount = assignments.filter((a) => a.status === "Submitted").length;
  const gradedCount = assignments.filter((a) => a.status === "Graded").length;

  return (
    <div className="mas-page-container">
      {toast && (
        <div className="mas-toast">
          <span>✓</span> {toast}
        </div>
      )}

      <StudentNav
        title="Student Homework & Coursework Tracker"
        subtitle="Manage upcoming submission deadlines, submit project reports, and review teacher gradings"
        badge="Module 12 • Screen 6 of 10"
      />

      {/* Header Banner */}
      <div className="mas-header-strip">
        <div>
          <span className="mas-tag">ACADEMIC COURSEWORK CENTER</span>
          <h1 className="mas-title">My Assignments & Projects</h1>
          <p className="mas-sub">
            Track terminal research tasks, laboratory reports, and periodic homework deadlines with
            direct teacher feedback.
          </p>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="mas-kpi-grid">
        <div className="mas-kpi-card">
          <span className="mas-kpi-label">Total Assigned</span>
          <div className="mas-kpi-val text-cyan">{totalCount} Tasks</div>
          <span className="mas-kpi-sub">Academic Term 1</span>
        </div>

        <div className="mas-kpi-card">
          <span className="mas-kpi-label">Pending / In Progress</span>
          <div className="mas-kpi-val text-amber">{inProgressCount} Tasks</div>
          <span className="mas-kpi-sub">Attention required</span>
        </div>

        <div className="mas-kpi-card">
          <span className="mas-kpi-label">Submitted & Under Review</span>
          <div className="mas-kpi-val text-purple">{submittedCount} Tasks</div>
          <span className="mas-kpi-sub">Awaiting instructor scoring</span>
        </div>

        <div className="mas-kpi-card">
          <span className="mas-kpi-label">Graded & Completed</span>
          <div className="mas-kpi-val text-emerald">{gradedCount} Tasks</div>
          <span className="mas-kpi-sub">Official feedback released</span>
        </div>
      </div>

      {/* Toolbar Search & Filter Strip */}
      <div className="mas-toolbar">
        <div className="mas-search-box">
          <span className="mas-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search assignments by subject, title, or teacher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="mas-clear-btn" onClick={() => setSearchQuery("")}>
              ✕
            </button>
          )}
        </div>

        <div className="mas-filter-tabs">
          <button
            className={`mas-filter-btn ${filter === "All" ? "active" : ""}`}
            onClick={() => setFilter("All")}
          >
            All Tasks ({totalCount})
          </button>
          <button
            className={`mas-filter-btn ${filter === "In Progress" ? "active" : ""}`}
            onClick={() => setFilter("In Progress")}
          >
            ⏳ In Progress ({inProgressCount})
          </button>
          <button
            className={`mas-filter-btn ${filter === "Submitted" ? "active" : ""}`}
            onClick={() => setFilter("Submitted")}
          >
            📬 Submitted ({submittedCount})
          </button>
          <button
            className={`mas-filter-btn ${filter === "Graded" ? "active" : ""}`}
            onClick={() => setFilter("Graded")}
          >
            ✅ Graded ({gradedCount})
          </button>
        </div>
      </div>

      {/* Assignments List Grid */}
      <div className="mas-grid">
        {filteredAssignments.map((asn) => (
          <div key={asn.id} className="mas-card">
            <div className="mas-card-top">
              <div className="mas-subject-pill">{asn.subject}</div>
              <span
                className={`mas-status-badge ${
                  asn.status === "Graded"
                    ? "status-graded"
                    : asn.status === "Submitted"
                    ? "status-submitted"
                    : "status-pending"
                }`}
              >
                ● {asn.status}
              </span>
            </div>

            <h3 className="mas-card-title">{asn.title}</h3>
            <p className="mas-card-instructions">{asn.instructions}</p>

            <div className="mas-meta-box">
              <div className="mas-meta-row">
                <span className="mas-meta-label">👨‍🏫 Instructor:</span>
                <span className="mas-meta-val">{asn.teacher}</span>
              </div>
              <div className="mas-meta-row">
                <span className="mas-meta-label">📅 Due Date:</span>
                <strong className="mas-meta-val text-amber font-mono">{asn.dueDate}</strong>
              </div>
              <div className="mas-meta-row">
                <span className="mas-meta-label">🎯 Maximum Mark:</span>
                <span className="mas-meta-val font-mono">{asn.maxScore} Pts</span>
              </div>
              {asn.score && (
                <div className="mas-meta-row mas-meta-score">
                  <span className="mas-meta-label">Awarded Score:</span>
                  <strong className="mas-meta-val text-emerald font-mono">{asn.score}</strong>
                </div>
              )}
            </div>

            {asn.submittedFile && (
              <div className="mas-file-badge">
                📎 Submitted: <span>{asn.submittedFile}</span> ({asn.submissionDate})
              </div>
            )}

            <div className="mas-card-footer">
              {asn.status === "In Progress" || asn.status === "Pending" ? (
                <button
                  className="mas-btn-submit"
                  onClick={() => handleOpenSubmit(asn)}
                >
                  📤 Submit Coursework
                </button>
              ) : (
                <button
                  className="mas-btn-view"
                  onClick={() => showToast(`Opening submission view for ${asn.title}`)}
                >
                  👁️ Inspect Submission
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Coursework Upload Modal */}
      {activeSubmitModal && (
        <div className="mas-modal-backdrop" onClick={() => setActiveSubmitModal(null)}>
          <div className="mas-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="mas-modal-header">
              <div>
                <span className="mas-modal-tag">{activeSubmitModal.subject}</span>
                <h3>Submit: {activeSubmitModal.title}</h3>
              </div>
              <button
                className="mas-modal-close"
                onClick={() => setActiveSubmitModal(null)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitWork}>
              <div className="mas-modal-due-banner">
                <span>⏰ Submission Deadline:</span>
                <strong>{activeSubmitModal.dueDate}</strong>
              </div>

              <div className="mas-form-group">
                <label>Select Document File (.PDF, .DOCX, .ZIP):</label>
                <input
                  type="file"
                  id="mas-file-picker"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setUploadFileName(e.target.files[0].name);
                    }
                  }}
                  required
                />
                {uploadFileName && (
                  <div className="mas-file-selected">
                    ✅ Selected: <strong>{uploadFileName}</strong>
                  </div>
                )}
              </div>

              <div className="mas-form-group">
                <label>Optional Note to Faculty Instructor:</label>
                <textarea
                  rows={3}
                  placeholder="e.g., Code repository link, references used, or notes on lab methodology..."
                  value={studentComments}
                  onChange={(e) => setStudentComments(e.target.value)}
                />
              </div>

              <div className="mas-modal-actions">
                <button
                  type="button"
                  className="mas-btn-cancel"
                  onClick={() => setActiveSubmitModal(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="mas-btn-confirm">
                  🚀 Confirm & Submit File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
