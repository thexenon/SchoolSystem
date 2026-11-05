import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SchoolDashboard.css";
import "./TermSemesterManagement.css";
import { getActiveSchoolAdmin } from "../Platform Administration/schoolAdminAuth";

const INITIAL_TERMS = [
  {
    id: "TERM-01",
    name: "Term 1: Autumn Semester",
    code: "T1-AUTUMN",
    academicYear: "2026 - 2027 Academic Session",
    startDate: "Sep 01, 2026",
    endDate: "Dec 18, 2026",
    daysCount: 75,
    examStartDate: "Dec 07, 2026",
    examEndDate: "Dec 16, 2026",
    breakStartDate: "Oct 26, 2026",
    breakEndDate: "Oct 30, 2026",
    gradeSubmissionDeadline: "Dec 22, 2026",
    status: "In Progress (Active)",
    completionPct: 62,
    isCurrent: true,
  },
  {
    id: "TERM-02",
    name: "Term 2: Spring Semester",
    code: "T2-SPRING",
    academicYear: "2026 - 2027 Academic Session",
    startDate: "Jan 06, 2027",
    endDate: "Apr 08, 2027",
    daysCount: 65,
    examStartDate: "Mar 24, 2027",
    examEndDate: "Apr 02, 2027",
    breakStartDate: "Feb 15, 2027",
    breakEndDate: "Feb 19, 2027",
    gradeSubmissionDeadline: "Apr 14, 2027",
    status: "Upcoming",
    completionPct: 0,
    isCurrent: false,
  },
  {
    id: "TERM-03",
    name: "Term 3: Summer Session",
    code: "T3-SUMMER",
    academicYear: "2026 - 2027 Academic Session",
    startDate: "Apr 26, 2027",
    endDate: "Jun 30, 2027",
    daysCount: 48,
    examStartDate: "Jun 14, 2027",
    examEndDate: "Jun 23, 2027",
    breakStartDate: "May 28, 2027",
    breakEndDate: "May 31, 2027",
    gradeSubmissionDeadline: "Jul 05, 2027",
    status: "Upcoming",
    completionPct: 0,
    isCurrent: false,
  },
];

function TermSemesterManagement({ onNavigate }) {
  const activeAdmin = getActiveSchoolAdmin();
  const schoolName = activeAdmin?.schoolName || "St. Mary International Academy";
  const [terms, setTerms] = useState(INITIAL_TERMS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [newTerm, setNewTerm] = useState({
    name: "Special Winter Intensive Term",
    code: "T-WINTER",
    startDate: "2027-01-02",
    endDate: "2027-01-20",
    daysCount: 14,
    examStartDate: "2027-01-18",
    examEndDate: "2027-01-20",
    gradeSubmissionDeadline: "2027-01-25",
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const navigateTo = (screen) => {
    if (onNavigate) onNavigate(screen);
  };

  const handleSetCurrent = (id) => {
    setTerms((prev) =>
      prev.map((t) => ({
        ...t,
        isCurrent: t.id === id,
        status: t.id === id ? "In Progress (Active)" : "Upcoming",
        completionPct: t.id === id ? 15 : 0,
      }))
    );
    const selected = terms.find((t) => t.id === id);
    showToast(`✓ Set "${selected?.name}" as the current active academic term!`);
  };

  const handleAddTerm = (e) => {
    e.preventDefault();
    const created = {
      id: `TERM-0${terms.length + 1}`,
      name: newTerm.name,
      code: newTerm.code,
      academicYear: "2026 - 2027 Academic Session",
      startDate: newTerm.startDate,
      endDate: newTerm.endDate,
      daysCount: Number(newTerm.daysCount) || 30,
      examStartDate: newTerm.examStartDate,
      examEndDate: newTerm.examEndDate,
      gradeSubmissionDeadline: newTerm.gradeSubmissionDeadline,
      status: "Upcoming",
      completionPct: 0,
      isCurrent: false,
    };

    setTerms([...terms, created]);
    setShowAddModal(false);
    showToast(`✓ Created new term schedule "${created.name}"!`);
  };

  return (
    <div className="sch-page-wrapper">
      {/* Navigation */}
      <nav className="school-nav-bar">
        <div className="school-brand">
          <div className="school-logo-badge">⏳</div>
          <div>
            <div className="school-brand-title">{schoolName}</div>
            <div className="school-brand-subtitle">Term & Semester Scheduling Matrix</div>
          </div>
        </div>

        <div className="school-menu-links">
          <button
            type="button"
            className="school-menu-item"
            onClick={() => navigateTo("school-dashboard")}
          >
            📊 Dashboard
          </button>
          <button
            type="button"
            className="school-menu-item"
            onClick={() => navigateTo("school-profile")}
          >
            🏫 School Profile
          </button>
          <button
            type="button"
            className="school-menu-item"
            onClick={() => navigateTo("campus-management")}
          >
            🏢 Campuses
          </button>
          <button
            type="button"
            className="school-menu-item"
            onClick={() => navigateTo("academic-year-management")}
          >
            📅 Academic Years
          </button>
          <button
            type="button"
            className="school-menu-item active"
            onClick={() => navigateTo("term-semester-management")}
          >
            ⏳ Terms & Semesters
          </button>
          <button
            type="button"
            className="school-menu-item"
            onClick={() => navigateTo("school-calendar")}
          >
            🗓️ School Calendar
          </button>
          <button
            type="button"
            className="school-menu-item"
            onClick={() => navigateTo("school-settings")}
          >
            ⚙️ Settings
          </button>
        </div>

        <div className="school-nav-actions">
          <button
            type="button"
            className="school-nav-btn school-nav-btn-highlight"
            onClick={() => navigateTo("user-management")}
          >
            👥 Users Directory
          </button>
          <Link to="/" className="school-nav-btn">
            ← Hub
          </Link>
        </div>
      </nav>

      {/* Header */}
      <div className="sch-header">
        <div>
          <h1 className="sch-title">Term & Semester Management</h1>
          <p className="sch-subtitle">
            Configure terms, semesters, examination weeks, mid-term breaks, and grading deadlines for 2026-2027
          </p>
        </div>
        <button
          type="button"
          className="school-nav-btn school-nav-btn-highlight"
          onClick={() => setShowAddModal(true)}
        >
          ➕ Define New Term
        </button>
      </div>

      {toastMessage && (
        <div
          style={{
            background: "rgba(16, 185, 129, 0.15)",
            border: "1px solid rgba(16, 185, 129, 0.4)",
            color: "#10b981",
            padding: "14px 20px",
            borderRadius: "12px",
            marginBottom: "24px",
            fontWeight: 600,
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Term Cards Grid */}
      <div className="ts-grid">
        {terms.map((term) => (
          <div key={term.id} className={`ts-card ${term.isCurrent ? "active-term" : ""}`}>
            <div>
              <div className="ts-header">
                <div>
                  <h3 className="ts-title">{term.name}</h3>
                  <span className="cm-campus-code">{term.code}</span>
                </div>
                <span
                  className={`sch-badge ${
                    term.isCurrent ? "sch-badge-success" : "sch-badge-info"
                  }`}
                >
                  {term.status}
                </span>
              </div>

              {/* Progress if current */}
              {term.isCurrent && (
                <div style={{ margin: "10px 0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#94a3b8" }}>
                    <span>Term Progress</span>
                    <strong style={{ color: "#34d399" }}>{term.completionPct}% Elapsed</strong>
                  </div>
                  <div className="ts-progress-bar">
                    <div className="ts-progress-fill" style={{ width: `${term.completionPct}%` }} />
                  </div>
                </div>
              )}

              {/* Dates Box */}
              <div className="ts-dates-box">
                <div className="ts-row">
                  <span>Semester Dates:</span>
                  <strong>{term.startDate} – {term.endDate}</strong>
                </div>
                <div className="ts-row">
                  <span>Teaching Days:</span>
                  <strong>{term.daysCount} Instructional Days</strong>
                </div>
                <div className="ts-row">
                  <span>Exam Window:</span>
                  <strong style={{ color: "#fbbf24" }}>{term.examStartDate} – {term.examEndDate}</strong>
                </div>
                {term.breakStartDate && (
                  <div className="ts-row">
                    <span>Mid-Term Break:</span>
                    <span>{term.breakStartDate} – {term.breakEndDate}</span>
                  </div>
                )}
                <div className="ts-row">
                  <span>Grade Submission:</span>
                  <strong style={{ color: "#38bdf8" }}>Deadline: {term.gradeSubmissionDeadline}</strong>
                </div>
              </div>
            </div>

            {/* Bottom Controls */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", marginTop: "16px", paddingTop: "14px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              {!term.isCurrent ? (
                <button
                  type="button"
                  className="school-nav-btn school-nav-btn-highlight"
                  style={{ fontSize: "11px" }}
                  onClick={() => handleSetCurrent(term.id)}
                >
                  Set as Current Term
                </button>
              ) : (
                <span style={{ fontSize: "12px", color: "#34d399", fontWeight: 700 }}>
                  ● Active Semester
                </span>
              )}

              <button
                type="button"
                className="school-nav-btn"
                style={{ fontSize: "11px" }}
                onClick={() => showToast(`Opening examination timetable for ${term.name}...`)}
              >
                📝 Exam Timetable →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Define Term */}
      {showAddModal && (
        <div className="cm-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="cm-modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ margin: 0, fontSize: "18px", color: "#ffffff" }}>
                Define New Term / Semester
              </h2>
              <button
                type="button"
                style={{ background: "transparent", border: "none", color: "#94a3b8", fontSize: "20px", cursor: "pointer" }}
                onClick={() => setShowAddModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTerm}>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label className="sp-form-label">Term / Semester Name *</label>
                  <input
                    type="text"
                    required
                    className="sp-form-input"
                    value={newTerm.name}
                    onChange={(e) => setNewTerm({ ...newTerm, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="sp-form-label">Term Code *</label>
                  <input
                    type="text"
                    required
                    className="sp-form-input"
                    value={newTerm.code}
                    onChange={(e) => setNewTerm({ ...newTerm, code: e.target.value })}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label className="sp-form-label">Start Date *</label>
                    <input
                      type="date"
                      required
                      className="sp-form-input"
                      value={newTerm.startDate}
                      onChange={(e) => setNewTerm({ ...newTerm, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="sp-form-label">End Date *</label>
                    <input
                      type="date"
                      required
                      className="sp-form-input"
                      value={newTerm.endDate}
                      onChange={(e) => setNewTerm({ ...newTerm, endDate: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label className="sp-form-label">Exam Window Starts</label>
                    <input
                      type="date"
                      className="sp-form-input"
                      value={newTerm.examStartDate}
                      onChange={(e) => setNewTerm({ ...newTerm, examStartDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="sp-form-label">Exam Window Ends</label>
                    <input
                      type="date"
                      className="sp-form-input"
                      value={newTerm.examEndDate}
                      onChange={(e) => setNewTerm({ ...newTerm, examEndDate: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="sp-form-label">Grade Submission Deadline</label>
                  <input
                    type="date"
                    className="sp-form-input"
                    value={newTerm.gradeSubmissionDeadline}
                    onChange={(e) => setNewTerm({ ...newTerm, gradeSubmissionDeadline: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "24px" }}>
                <button
                  type="button"
                  className="school-nav-btn"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="school-nav-btn school-nav-btn-highlight"
                >
                  Save Term Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TermSemesterManagement;
