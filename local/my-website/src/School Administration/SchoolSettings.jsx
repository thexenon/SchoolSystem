import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SchoolDashboard.css";
import "./SchoolSettings.css";
import { getActiveSchoolAdmin } from "../Platform Administration/schoolAdminAuth";

const DEFAULT_GRADING_SCALE = [
  { grade: "A+", minScore: 97, maxScore: 100, gpa: "4.00", remark: "Exceptional Mastery" },
  { grade: "A", minScore: 93, maxScore: 96, gpa: "3.90", remark: "Outstanding Achievement" },
  { grade: "A-", minScore: 90, maxScore: 92, gpa: "3.70", remark: "Excellent" },
  { grade: "B+", minScore: 87, maxScore: 89, gpa: "3.30", remark: "Very Good" },
  { grade: "B", minScore: 83, maxScore: 86, gpa: "3.00", remark: "Good / Commendable" },
  { grade: "B-", minScore: 80, maxScore: 82, gpa: "2.70", remark: "Above Average" },
  { grade: "C+", minScore: 77, maxScore: 79, gpa: "2.30", remark: "Average Competency" },
  { grade: "C", minScore: 70, maxScore: 76, gpa: "2.00", remark: "Pass" },
  { grade: "D", minScore: 60, maxScore: 69, gpa: "1.00", remark: "Conditional Pass / Remedial" },
  { grade: "F", minScore: 0, maxScore: 59, gpa: "0.00", remark: "Fail (Must Retake)" },
];

function SchoolSettings({ onNavigate }) {
  const activeAdmin = getActiveSchoolAdmin();
  const schoolName = activeAdmin?.schoolName || "St. Mary International Academy";

  const [settings, setSettings] = useState({
    minAttendancePct: 85,
    lateToleranceMinutes: 15,
    passScorePercentage: 60,
    maxUnexcusedAbsences: 5,
    lateSubmissionPenaltyPerDay: 5,
    gradingScaleType: "Standard 4.0 GPA Scale",
    honorRollMinGPA: 3.75,
    currencySymbol: "GBP (£)",
    timezone: "Europe/London (GMT+0)",
    dateFormat: "DD/MM/YYYY",
    autoSmsAbsentParents: true,
    autoEmailGradeReports: true,
    studentRealtimeGradesVisible: true,
    twoFactorEnforcedForStaff: true,
  });

  const [gradingScale, setGradingScale] = useState(DEFAULT_GRADING_SCALE);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const navigateTo = (screen) => {
    if (onNavigate) onNavigate(screen);
  };

  const handleSave = (e) => {
    e.preventDefault();
    showToast(`✓ School settings & academic policies saved for "${schoolName}"!`);
  };

  return (
    <div className="sch-page-wrapper">
      {/* Navigation */}
      <nav className="school-nav-bar">
        <div className="school-brand">
          <div className="school-logo-badge">⚙️</div>
          <div>
            <div className="school-brand-title">{schoolName}</div>
            <div className="school-brand-subtitle">School Academic Rules & Institutional Preferences</div>
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
            className="school-menu-item active"
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
          <h1 className="sch-title">School Rules & Institutional Configuration</h1>
          <p className="sch-subtitle">
            Configure attendance thresholds, grading systems, pass criteria, and administrative communication preferences
          </p>
        </div>
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

      <form onSubmit={handleSave}>
        {/* Section 1: Attendance & Academic Policies */}
        <div className="sset-card">
          <h2 className="sset-section-title">
            <span>📏</span> School Attendance & Student Conduct Rules
          </h2>
          <p className="sset-section-desc">
            Define mandatory thresholds for examination eligibility and automated absentee escalation
          </p>

          <div className="sset-grid-2">
            <div className="sp-form-group">
              <label className="sp-form-label">Min Attendance Required for Exams (%)</label>
              <input
                type="number"
                min="50"
                max="100"
                className="sp-form-input"
                value={settings.minAttendancePct}
                onChange={(e) => setSettings({ ...settings, minAttendancePct: e.target.value })}
              />
              <span style={{ fontSize: "11px", color: "#64748b" }}>
                Students below {settings.minAttendancePct}% attendance will trigger invigilation holds.
              </span>
            </div>

            <div className="sp-form-group">
              <label className="sp-form-label">Morning Late Arrival Tolerance (Minutes)</label>
              <input
                type="number"
                min="0"
                max="60"
                className="sp-form-input"
                value={settings.lateToleranceMinutes}
                onChange={(e) => setSettings({ ...settings, lateToleranceMinutes: e.target.value })}
              />
              <span style={{ fontSize: "11px", color: "#64748b" }}>
                Arrivals beyond {settings.lateToleranceMinutes} mins after bell are marked 'Tardy'.
              </span>
            </div>

            <div className="sp-form-group">
              <label className="sp-form-label">Max Allowed Unexcused Absences</label>
              <input
                type="number"
                min="1"
                max="20"
                className="sp-form-input"
                value={settings.maxUnexcusedAbsences}
                onChange={(e) => setSettings({ ...settings, maxUnexcusedAbsences: e.target.value })}
              />
              <span style={{ fontSize: "11px", color: "#64748b" }}>
                Triggers automatic dean consultation ticket at {settings.maxUnexcusedAbsences} days.
              </span>
            </div>

            <div className="sp-form-group">
              <label className="sp-form-label">Late Homework Penalty (% per day)</label>
              <input
                type="number"
                min="0"
                max="25"
                className="sp-form-input"
                value={settings.lateSubmissionPenaltyPerDay}
                onChange={(e) => setSettings({ ...settings, lateSubmissionPenaltyPerDay: e.target.value })}
              />
              <span style={{ fontSize: "11px", color: "#64748b" }}>
                Deducted daily from assignment grade up to 3 days maximum.
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Grading Systems & Assessment Brackets */}
        <div className="sset-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "10px" }}>
            <h2 className="sset-section-title" style={{ margin: 0 }}>
              <span>📊</span> Official Grading System & Grade Point Average (GPA)
            </h2>
            <select
              className="sp-form-input"
              style={{ width: "auto", padding: "8px 14px", fontSize: "13px" }}
              value={settings.gradingScaleType}
              onChange={(e) => setSettings({ ...settings, gradingScaleType: e.target.value })}
            >
              <option value="Standard 4.0 GPA Scale">Standard 4.0 GPA Scale</option>
              <option value="5.0 Weighted Honors Scale">5.0 Weighted Honors Scale</option>
              <option value="International Baccalaureate (1-7)">IB 1 to 7 Scale</option>
              <option value="Pure Percentage Scale (0-100%)">Pure Percentage (0-100%)</option>
            </select>
          </div>
          <p className="sset-section-desc">
            Configured grading intervals applied across teacher gradebooks and final student transcripts
          </p>

          <div style={{ overflowX: "auto" }}>
            <table className="sset-grade-table">
              <thead>
                <tr>
                  <th>Letter Grade</th>
                  <th>Min Score (%)</th>
                  <th>Max Score (%)</th>
                  <th>Grade Point (GPA)</th>
                  <th>Official Academic Remark</th>
                </tr>
              </thead>
              <tbody>
                {gradingScale.map((row, idx) => (
                  <tr key={idx}>
                    <td>
                      <span className="sch-badge sch-badge-info" style={{ fontWeight: 800 }}>
                        {row.grade}
                      </span>
                    </td>
                    <td>{row.minScore}%</td>
                    <td>{row.maxScore}%</td>
                    <td style={{ fontFamily: "JetBrains Mono, monospace", color: "#38bdf8", fontWeight: 700 }}>
                      {row.gpa}
                    </td>
                    <td style={{ color: "#cbd5e1" }}>{row.remark}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Localization & Automated Notifications */}
        <div className="sset-card">
          <h2 className="sset-section-title">
            <span>🌐</span> Institutional Preferences & Parent Notifications
          </h2>
          <p className="sset-section-desc">
            Regional settings, preferred currency for fee billing, and real-time parent alert rules
          </p>

          <div className="sset-grid-2" style={{ marginBottom: "20px" }}>
            <div className="sp-form-group">
              <label className="sp-form-label">Billing Currency</label>
              <select
                className="sp-form-input"
                value={settings.currencySymbol}
                onChange={(e) => setSettings({ ...settings, currencySymbol: e.target.value })}
              >
                <option value="GBP (£)">GBP - British Pound (£)</option>
                <option value="USD ($)">USD - US Dollar ($)</option>
                <option value="EUR (€)">EUR - Euro (€)</option>
                <option value="CAD ($)">CAD - Canadian Dollar ($)</option>
                <option value="AUD ($)">AUD - Australian Dollar ($)</option>
              </select>
            </div>

            <div className="sp-form-group">
              <label className="sp-form-label">Campus Timezone</label>
              <select
                className="sp-form-input"
                value={settings.timezone}
                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
              >
                <option value="Europe/London (GMT+0)">Europe / London (GMT+0 / BST)</option>
                <option value="America/New_York (EST)">America / New York (EST)</option>
                <option value="America/Toronto (EST)">America / Toronto (EST)</option>
                <option value="America/Chicago (CST)">America / Chicago (CST)</option>
                <option value="Australia/Sydney (AEST)">Australia / Sydney (AEST)</option>
              </select>
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="sset-switch-row">
            <div>
              <div className="sset-switch-label">Automated Parent SMS on Unexcused Absence</div>
              <div className="sset-switch-sub">Sends automated SMS to primary guardian at 09:15 AM if student is marked absent without prior notice.</div>
            </div>
            <input
              type="checkbox"
              checked={settings.autoSmsAbsentParents}
              onChange={(e) => setSettings({ ...settings, autoSmsAbsentParents: e.target.checked })}
              style={{ width: "20px", height: "20px", accentColor: "#4f46e5", cursor: "pointer" }}
            />
          </div>

          <div className="sset-switch-row">
            <div>
              <div className="sset-switch-label">Live Gradebook Publishing for Students</div>
              <div className="sset-switch-sub">When enabled, students and parents can view published grades instantly without waiting for end-of-term approvals.</div>
            </div>
            <input
              type="checkbox"
              checked={settings.studentRealtimeGradesVisible}
              onChange={(e) => setSettings({ ...settings, studentRealtimeGradesVisible: e.target.checked })}
              style={{ width: "20px", height: "20px", accentColor: "#4f46e5", cursor: "pointer" }}
            />
          </div>

          <div className="sset-switch-row">
            <div>
              <div className="sset-switch-label">Mandatory Two-Factor Authentication (2FA) for Faculty</div>
              <div className="sset-switch-sub">Enforces TOTP hardware or authenticator app code during teacher and staff login sessions.</div>
            </div>
            <input
              type="checkbox"
              checked={settings.twoFactorEnforcedForStaff}
              onChange={(e) => setSettings({ ...settings, twoFactorEnforcedForStaff: e.target.checked })}
              style={{ width: "20px", height: "20px", accentColor: "#4f46e5", cursor: "pointer" }}
            />
          </div>
        </div>

        {/* Save Bar */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginBottom: "40px" }}>
          <button
            type="button"
            className="school-nav-btn"
            onClick={() => navigateTo("school-dashboard")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="school-nav-btn school-nav-btn-highlight"
            style={{ padding: "12px 24px", fontSize: "14px" }}
          >
            💾 Save Settings & Policies
          </button>
        </div>
      </form>
    </div>
  );
}

export default SchoolSettings;
