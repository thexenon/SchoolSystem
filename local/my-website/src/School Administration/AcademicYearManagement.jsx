import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SchoolDashboard.css";
import "./AcademicYearManagement.css";
import { getActiveSchoolAdmin } from "../Platform Administration/schoolAdminAuth";

const INITIAL_ACADEMIC_YEARS = [
  {
    id: "AY-2026-27",
    name: "2026 - 2027 Academic Session",
    code: "AY-26-27",
    startDate: "Sep 01, 2026",
    endDate: "Jun 30, 2027",
    instructionalDays: 188,
    termsCount: 3,
    status: "Active Current",
    isDefault: true,
    totalStudents: 3420,
    locked: false,
  },
  {
    id: "AY-2027-28",
    name: "2027 - 2028 Academic Session",
    code: "AY-27-28",
    startDate: "Sep 01, 2027",
    endDate: "Jun 30, 2028",
    instructionalDays: 190,
    termsCount: 3,
    status: "Upcoming (Enrollment Open)",
    isDefault: false,
    totalStudents: 410,
    locked: false,
  },
  {
    id: "AY-2025-26",
    name: "2025 - 2026 Academic Session",
    code: "AY-25-26",
    startDate: "Sep 01, 2025",
    endDate: "Jun 28, 2026",
    instructionalDays: 186,
    termsCount: 3,
    status: "Completed & Archived",
    isDefault: false,
    totalStudents: 3150,
    locked: true,
  },
  {
    id: "AY-2024-25",
    name: "2024 - 2025 Academic Session",
    code: "AY-24-25",
    startDate: "Sep 02, 2024",
    endDate: "Jun 27, 2025",
    instructionalDays: 185,
    termsCount: 3,
    status: "Completed & Archived",
    isDefault: false,
    totalStudents: 2980,
    locked: true,
  },
];

function AcademicYearManagement({ onNavigate }) {
  const activeAdmin = getActiveSchoolAdmin();
  const schoolName = activeAdmin?.schoolName || "St. Mary International Academy";
  const [academicYears, setAcademicYears] = useState(INITIAL_ACADEMIC_YEARS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [newAY, setNewAY] = useState({
    name: "2028 - 2029 Academic Session",
    code: "AY-28-29",
    startDate: "2028-09-01",
    endDate: "2029-06-30",
    instructionalDays: 188,
    termsCount: 3,
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const navigateTo = (screen) => {
    if (onNavigate) onNavigate(screen);
  };

  const handleSetActive = (id) => {
    setAcademicYears((prev) =>
      prev.map((ay) => ({
        ...ay,
        isDefault: ay.id === id,
        status: ay.id === id ? "Active Current" : ay.locked ? "Completed & Archived" : "Configured",
      }))
    );
    const selected = academicYears.find((ay) => ay.id === id);
    showToast(`✓ Set "${selected?.name}" as the active academic operational year!`);
  };

  const handleToggleLock = (id) => {
    setAcademicYears((prev) =>
      prev.map((ay) => {
        if (ay.id === id) {
          const nextLock = !ay.locked;
          showToast(`Academic Year "${ay.name}" is now ${nextLock ? "Locked" : "Unlocked"}.`);
          return { ...ay, locked: nextLock };
        }
        return ay;
      })
    );
  };

  const handleAddYear = (e) => {
    e.preventDefault();
    const created = {
      id: `AY-${newAY.code}`,
      name: newAY.name,
      code: newAY.code,
      startDate: newAY.startDate,
      endDate: newAY.endDate,
      instructionalDays: Number(newAY.instructionalDays) || 188,
      termsCount: Number(newAY.termsCount) || 3,
      status: "Upcoming",
      isDefault: false,
      totalStudents: 0,
      locked: false,
    };

    setAcademicYears([created, ...academicYears]);
    setShowAddModal(false);
    showToast(`✓ Academic Year "${created.name}" created successfully!`);
  };

  const activeYear = academicYears.find((ay) => ay.isDefault) || academicYears[0];

  return (
    <div className="sch-page-wrapper">
      {/* Navigation */}
      <nav className="school-nav-bar">
        <div className="school-brand">
          <div className="school-logo-badge">📅</div>
          <div>
            <div className="school-brand-title">{schoolName}</div>
            <div className="school-brand-subtitle">Academic Year Sessions & Policy Calendar</div>
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
            className="school-menu-item active"
            onClick={() => navigateTo("academic-year-management")}
          >
            📅 Academic Years
          </button>
          <button
            type="button"
            className="school-menu-item"
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
          <h1 className="sch-title">Academic Year Management</h1>
          <p className="sch-subtitle">
            Create, schedule, lock, and transition between school academic calendar years
          </p>
        </div>
        <button
          type="button"
          className="school-nav-btn school-nav-btn-highlight"
          onClick={() => setShowAddModal(true)}
        >
          ➕ Create New Academic Year
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

      {/* Active Academic Year Banner */}
      <div className="ay-instructional-box">
        <span style={{ fontSize: "32px" }}>🗓️</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h3 style={{ margin: 0, fontSize: "17px", color: "#ffffff" }}>
              Active Session: {activeYear.name}
            </h3>
            <span className="ay-active-badge">
              <span className="ay-active-dot"></span> CURRENT OPERATING YEAR
            </span>
          </div>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#94a3b8" }}>
            Dates: <strong>{activeYear.startDate} – {activeYear.endDate}</strong> • {activeYear.instructionalDays} Target Teaching Days • {activeYear.termsCount} Semesters configured
          </p>
        </div>
        <button
          type="button"
          className="school-nav-btn"
          onClick={() => navigateTo("term-semester-management")}
        >
          Configure Terms →
        </button>
      </div>

      {/* Academic Years Table */}
      <div className="ay-table-container">
        <table className="sch-table">
          <thead>
            <tr>
              <th>Session ID</th>
              <th>Academic Year Title</th>
              <th>Date Range</th>
              <th>Instructional Days</th>
              <th>Terms / Semesters</th>
              <th>Enrolled Cohort</th>
              <th>Status</th>
              <th>Lock Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {academicYears.map((ay) => (
              <tr key={ay.id} style={ay.isDefault ? { background: "rgba(99, 102, 241, 0.08)" } : {}}>
                <td>
                  <span style={{ fontFamily: "JetBrains Mono, monospace", color: "#818cf8", fontWeight: 700 }}>
                    {ay.code}
                  </span>
                </td>
                <td>
                  <strong style={{ color: "#ffffff" }}>{ay.name}</strong>
                  {ay.isDefault && (
                    <div style={{ fontSize: "11px", color: "#34d399", fontWeight: 700 }}>
                      ✓ Current Active Year
                    </div>
                  )}
                </td>
                <td>
                  <div style={{ fontSize: "13px", color: "#cbd5e1" }}>
                    {ay.startDate} – {ay.endDate}
                  </div>
                </td>
                <td>
                  <strong>{ay.instructionalDays} Days</strong>
                  <div style={{ fontSize: "11px", color: "#64748b" }}>~38 Weeks</div>
                </td>
                <td>{ay.termsCount} Terms</td>
                <td>
                  <strong style={{ color: "#38bdf8" }}>{ay.totalStudents.toLocaleString()}</strong> Students
                </td>
                <td>
                  <span
                    className={`sch-badge ${
                      ay.isDefault
                        ? "sch-badge-success"
                        : ay.locked
                        ? "sch-badge-info"
                        : "sch-badge-warning"
                    }`}
                  >
                    {ay.status}
                  </span>
                </td>
                <td>
                  <span style={{ fontSize: "12px", color: ay.locked ? "#f87171" : "#34d399" }}>
                    {ay.locked ? "🔒 Locked (Read Only)" : "🔓 Unlocked (Editable)"}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <div style={{ display: "inline-flex", gap: "6px" }}>
                    {!ay.isDefault && (
                      <button
                        type="button"
                        className="school-nav-btn school-nav-btn-highlight"
                        style={{ padding: "4px 10px", fontSize: "11px" }}
                        onClick={() => handleSetActive(ay.id)}
                      >
                        Set Active
                      </button>
                    )}
                    <button
                      type="button"
                      className="school-nav-btn"
                      style={{ padding: "4px 10px", fontSize: "11px" }}
                      onClick={() => handleToggleLock(ay.id)}
                      title={ay.locked ? "Unlock to allow grade/attendance updates" : "Lock to archive and prevent tampering"}
                    >
                      {ay.locked ? "Unlock" : "Lock"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal: Create Academic Year */}
      {showAddModal && (
        <div className="cm-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="cm-modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ margin: 0, fontSize: "18px", color: "#ffffff" }}>
                Create Academic Year Session
              </h2>
              <button
                type="button"
                style={{ background: "transparent", border: "none", color: "#94a3b8", fontSize: "20px", cursor: "pointer" }}
                onClick={() => setShowAddModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddYear}>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label className="sp-form-label">Academic Year Name *</label>
                  <input
                    type="text"
                    required
                    className="sp-form-input"
                    value={newAY.name}
                    onChange={(e) => setNewAY({ ...newAY, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="sp-form-label">Year Code / Suffix *</label>
                  <input
                    type="text"
                    required
                    className="sp-form-input"
                    value={newAY.code}
                    onChange={(e) => setNewAY({ ...newAY, code: e.target.value })}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label className="sp-form-label">Start Date *</label>
                    <input
                      type="date"
                      required
                      className="sp-form-input"
                      value={newAY.startDate}
                      onChange={(e) => setNewAY({ ...newAY, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="sp-form-label">End Date *</label>
                    <input
                      type="date"
                      required
                      className="sp-form-input"
                      value={newAY.endDate}
                      onChange={(e) => setNewAY({ ...newAY, endDate: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label className="sp-form-label">Instructional Days</label>
                    <input
                      type="number"
                      className="sp-form-input"
                      value={newAY.instructionalDays}
                      onChange={(e) => setNewAY({ ...newAY, instructionalDays: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="sp-form-label">Terms / Semesters Count</label>
                    <input
                      type="number"
                      min="1"
                      max="4"
                      className="sp-form-input"
                      value={newAY.termsCount}
                      onChange={(e) => setNewAY({ ...newAY, termsCount: e.target.value })}
                    />
                  </div>
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
                  Create Academic Year
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AcademicYearManagement;
