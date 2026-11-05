import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./SchoolDashboard.css";
import {
  getActiveSchoolAdmin,
  getSchoolAdmins,
  switchActiveSchool,
  isPlatformAdminAuthenticated,
  logoutSchoolAdmin,
} from "../Platform Administration/schoolAdminAuth";
import { getStudents } from "../Student Management/studentData";

const RECENT_FEE_COLLECTIONS = [
  { id: "TX-9021", student: "Elena Rostova", grade: "Grade 11-A", amount: "GH₵3,450.00", feeType: "Term 1 Tuition", method: "MTN Mobile Money", date: "Today, 10:24 AM", status: "Paid" },
  { id: "TX-9020", student: "Lucas Vance", grade: "Grade 10-B", amount: "GH₵1,200.00", feeType: "Lab & Tech Fee", method: "Telecel Cash", date: "Today, 09:15 AM", status: "Paid" },
  { id: "TX-9019", student: "Liam Carter", grade: "Grade 10-A", amount: "GH₵4,200.00", feeType: "Full Academic Year", method: "GCB Bank Direct Deposit", date: "Yesterday", status: "Pending Clearance" },
  { id: "TX-9018", student: "Sophia Martinez", grade: "Grade 11-B", amount: "GH₵850.00", feeType: "Athletics & Uniform", method: "Online Card Portal", date: "Nov 03, 2026", status: "Paid" },
  { id: "TX-9017", student: "Noah Williams", grade: "Grade 10-B", amount: "GH₵3,450.00", feeType: "Term 1 Tuition", method: "Bank Standing Order", date: "Nov 02, 2026", status: "Overdue Notice Sent" },
];

const UPCOMING_ACTIVITIES = [
  { id: 1, title: "All-Campus Morning Assembly", desc: "Principal address & semester academic awards presentation", time: "Today • 08:30 AM", category: "Assembly", icon: "🏛️" },
  { id: 2, title: "Mid-Term Examination Week", desc: "Grade 9-12 standardized assessment schedules published", time: "Next Mon • 09:00 AM", category: "Exam", icon: "📝" },
  { id: 3, title: "STEM Science & Robotics Fair", desc: "Inter-campus showcase at Main Auditorium", time: "Nov 14, 2026", category: "Event", icon: "🤖" },
  { id: 4, title: "Parent-Teacher Advisory Conference", desc: "Online booking opens for Term 1 progress reviews", time: "Nov 18, 2026", category: "Meeting", icon: "👥" },
];

function SchoolDashboard({ onNavigate, onLogout }) {
  const [activeAdmin, setActiveAdmin] = useState(() => getActiveSchoolAdmin());
  const allSchoolAdmins = getSchoolAdmins();
  const isPlatformBoss = isPlatformAdminAuthenticated();

  const [showAdminDetails, setShowAdminDetails] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [schoolStudents, setSchoolStudents] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const currentAdmin = getActiveSchoolAdmin();
    setActiveAdmin(currentAdmin);
    if (currentAdmin) {
      setSchoolStudents(getStudents(currentAdmin.schoolId));
    }
  }, []);

  const schoolName = activeAdmin?.schoolName || "St. Mary International Academy";
  const schoolCode = activeAdmin?.schoolCode || "SMIA";
  const adminName = activeAdmin?.adminName || "Dame Eleanor Vance, Ph.D.";
  const adminTitle = activeAdmin?.adminTitle || "Head Principal & Executive Trustee";

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const navigateTo = (screen) => {
    if (onNavigate) onNavigate(screen);
  };

  const handleSwitchSchool = (schoolId) => {
    const newAdmin = switchActiveSchool(schoolId);
    if (newAdmin) {
      setActiveAdmin(newAdmin);
      setSchoolStudents(getStudents(newAdmin.schoolId));
      showToast(`Switched active school to ${newAdmin.schoolName}!`);
    }
  };

  const handleSignOut = () => {
    logoutSchoolAdmin();
    if (onLogout) {
      onLogout();
    } else if (onNavigate) {
      onNavigate("school-login");
    }
  };

  return (
    <div className="sch-page-wrapper">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            background: "#10b981",
            color: "#ffffff",
            padding: "12px 18px",
            borderRadius: "10px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
            zIndex: 9999,
            fontWeight: 600,
            fontSize: "13px",
          }}
        >
          ✓ {toastMessage}
        </div>
      )}

      {/* Multi-School Platform Boss Supervision Banner */}
      {isPlatformBoss && (
        <div className="sch-boss-supervision-bar">
          <div className="sch-boss-brand">
            <span className="sch-boss-badge">👑 Platform Super Admin</span>
            <div>
              <div className="sch-boss-title">Multi-School Supervisor Mode (Overall Boss)</div>
              <div style={{ fontSize: "11px", color: "#cbd5e1" }}>
                You have unrestricted administrative authority across all registered tenant schools.
              </div>
            </div>
          </div>

          <div className="sch-boss-controls">
            <label style={{ fontSize: "12px", color: "#fef08a", fontWeight: 700 }}>
              Switch School:
            </label>
            <select
              className="sch-boss-select"
              value={activeAdmin?.schoolId || "SCH-001"}
              onChange={(e) => handleSwitchSchool(e.target.value)}
            >
              {allSchoolAdmins.map((a) => (
                <option key={a.id} value={a.schoolId}>
                  {a.schoolName} ({a.schoolCode})
                </option>
              ))}
            </select>

            <button
              type="button"
              className="sch-boss-btn sch-boss-btn-gold"
              onClick={() => navigateTo("student-list")}
              title="View and manage all students enrolled in this school"
            >
              🎓 View Students ({schoolStudents.length})
            </button>

            <button
              type="button"
              className="sch-boss-btn"
              onClick={() => setShowAdminDetails(!showAdminDetails)}
              title="Inspect or manage this school's administrator details"
            >
              🛡️ {showAdminDetails ? "Hide Admin Info" : "View Admin Info"}
            </button>

            <button
              type="button"
              className="sch-boss-btn"
              onClick={() => navigateTo("platform-dashboard")}
              title="Return to the Multi-School Platform Administration Hub"
            >
              🌐 Platform Hub →
            </button>
          </div>
        </div>
      )}

      {/* School Administration Common Nav */}
      <nav className="school-nav-bar">
        <div className="school-brand">
          <div className="school-logo-badge">{schoolCode.substring(0, 2)}</div>
          <div>
            <div className="school-brand-title">
              <span>{schoolName}</span>
              <span className="sch-badge sch-badge-info" style={{ fontSize: "10px", padding: "2px 8px" }}>
                {schoolCode}
              </span>
            </div>
            <div className="school-brand-subtitle">
              Principal Portal • Head Administrator: {adminName} ({adminTitle})
            </div>
          </div>
        </div>

        <div className="school-menu-links">
          <button
            type="button"
            className="school-menu-item active"
            onClick={() => navigateTo("school-dashboard")}
          >
            📊 Dashboard
          </button>
          <button
            type="button"
            className="school-menu-item"
            onClick={() => navigateTo("student-list")}
          >
            🎓 Students
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
            title="Manage Students, Teachers, and School Staff"
          >
            👥 Users Directory
          </button>
          {isPlatformBoss ? (
            <button
              type="button"
              className="school-nav-btn"
              onClick={() => navigateTo("platform-dashboard")}
              title="Return to Multi-School Platform Super Admin"
            >
              👑 Platform Boss
            </button>
          ) : (
            <button
              type="button"
              className="school-nav-btn"
              onClick={handleSignOut}
              title="Sign out of school administration"
            >
              🔒 Sign Out
            </button>
          )}
          <Link to="/" className="school-nav-btn">
            ← Hub
          </Link>
        </div>
      </nav>

      {/* School Administrator & Leadership Profile Section */}
      {showAdminDetails && activeAdmin && (
        <div className="sch-admin-profile-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                }}
              >
                🛡️
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#ffffff" }}>
                    {activeAdmin.adminName}
                  </h3>
                  <span className={`sch-badge ${activeAdmin.status === "Active" ? "sch-badge-success" : "sch-badge-danger"}`}>
                    {activeAdmin.status}
                  </span>
                  {isPlatformBoss && (
                    <span className="sch-badge sch-badge-warning" style={{ fontSize: "10px" }}>
                      Supervised by Platform Boss
                    </span>
                  )}
                </div>
                <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>
                  {activeAdmin.adminTitle} • {activeAdmin.schoolName}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button
                type="button"
                className="sch-boss-btn"
                onClick={() => {
                  navigator.clipboard?.writeText(`${activeAdmin.email} / ${activeAdmin.password}`);
                  showToast("Admin credentials copied to clipboard!");
                }}
              >
                📋 Copy Admin Login
              </button>
              <button
                type="button"
                className="sch-boss-btn sch-boss-btn-gold"
                onClick={() => navigateTo("student-list")}
              >
                🎓 View School Students ({schoolStudents.length})
              </button>
              <button
                type="button"
                className="sch-boss-btn"
                onClick={() => navigateTo("user-management")}
              >
                👥 All School Accounts
              </button>
            </div>
          </div>

          <div className="sch-admin-grid">
            <div className="sch-admin-field">
              <div className="sch-admin-field-label">Official Email</div>
              <div className="sch-admin-field-val" style={{ color: "#38bdf8" }}>
                {activeAdmin.email}
              </div>
            </div>

            <div className="sch-admin-field">
              <div className="sch-admin-field-label">
                <span>School Password</span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ background: "none", border: "none", color: "#a5b4fc", cursor: "pointer", fontSize: "11px", marginLeft: "6px" }}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <div className="sch-admin-field-val" style={{ fontFamily: "JetBrains Mono, monospace", color: "#34d399" }}>
                {showPassword ? activeAdmin.password : "••••••••••••"}
              </div>
            </div>

            <div className="sch-admin-field">
              <div className="sch-admin-field-label">Direct Phone & Location</div>
              <div className="sch-admin-field-val">
                {activeAdmin.phone || "+1 (555) 019-2831"} ({activeAdmin.city || "Central"}, {activeAdmin.country || "HQ"})
              </div>
            </div>

            <div className="sch-admin-field">
              <div className="sch-admin-field-label">Security & Hierarchy</div>
              <div className="sch-admin-field-val">
                {activeAdmin.securityClearance || "Tier 1 - Trustee Level"}
              </div>
            </div>

            <div className="sch-admin-field">
              <div className="sch-admin-field-label">Deputy / Vice Principal</div>
              <div className="sch-admin-field-val">
                {activeAdmin.deputyName || "Dr. Arthur Bell (Vice Principal)"}
              </div>
            </div>

            <div className="sch-admin-field">
              <div className="sch-admin-field-label">Last Session & Date Appointed</div>
              <div className="sch-admin-field-val" style={{ fontSize: "12px", color: "#cbd5e1" }}>
                Appointed: {activeAdmin.createdAt || "Jan 2024"} • Last: {activeAdmin.lastLogin || "Today"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="sch-header">
        <div>
          <h1 className="sch-title">{schoolName} Operational Dashboard</h1>
          <p className="sch-subtitle">
            Real-time enrollment metrics, daily attendance tracking, fee revenue collection, and campus activities
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            type="button"
            className="school-nav-btn school-nav-btn-highlight"
            onClick={() => navigateTo("student-list")}
          >
            🎓 Student Directory ({schoolStudents.length})
          </button>
          <button
            type="button"
            className="school-nav-btn"
            onClick={() => navigateTo("school-calendar")}
          >
            📅 School Calendar
          </button>
          <button
            type="button"
            className="school-nav-btn"
            onClick={() => navigateTo("school-profile")}
          >
            ✏️ Edit School Profile
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="sch-kpi-grid">
        <div className="sch-kpi-card" onClick={() => navigateTo("student-list")} style={{ cursor: "pointer" }}>
          <div className="sch-kpi-top">
            <span className="sch-kpi-label">Total Student Enrollment</span>
            <span className="sch-kpi-icon">🎓</span>
          </div>
          <div className="sch-kpi-val">{activeAdmin?.studentCount ? activeAdmin.studentCount.toLocaleString() : "3,400"}</div>
          <div className="sch-kpi-sub">
            <span>↑ 8.4%</span>
            <span style={{ color: "#94a3b8" }}>active student records</span>
          </div>
        </div>

        <div className="sch-kpi-card">
          <div className="sch-kpi-top">
            <span className="sch-kpi-label">Today's Attendance Rate</span>
            <span className="sch-kpi-icon">📋</span>
          </div>
          <div className="sch-kpi-val" style={{ color: "#34d399" }}>
            96.8%
          </div>
          <div className="sch-kpi-sub">
            <span>3,310 Present</span>
            <span style={{ color: "#94a3b8" }}>across campuses today</span>
          </div>
        </div>

        <div className="sch-kpi-card">
          <div className="sch-kpi-top">
            <span className="sch-kpi-label">Term Fee Collection</span>
            <span className="sch-kpi-icon">💳</span>
          </div>
          <div className="sch-kpi-val" style={{ color: "#38bdf8" }}>
            GH₵1.42M
          </div>
          <div className="sch-kpi-sub">
            <span>92.4%</span>
            <span style={{ color: "#94a3b8" }}>of expected GH₵1.54M target</span>
          </div>
        </div>

        <div className="sch-kpi-card" onClick={() => navigateTo("campus-management")} style={{ cursor: "pointer" }}>
          <div className="sch-kpi-top">
            <span className="sch-kpi-label">Active Campuses & Faculty</span>
            <span className="sch-kpi-icon">🏢</span>
          </div>
          <div className="sch-kpi-val">{activeAdmin?.campusesCount || 3} Campuses</div>
          <div className="sch-kpi-sub">
            <span>{activeAdmin?.facultyCount || 220} Faculty</span>
            <span style={{ color: "#94a3b8" }}>on active duty today</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Enrollment & Attendance (Left) + Fee Collections & Activities (Right) */}
      <div className="sch-dashboard-grid">
        {/* Left Column: Enrollment Breakdown & Live Attendance */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Daily Attendance Tracker */}
          <div className="sch-card">
            <div className="sch-card-header">
              <h2 className="sch-card-title">
                <span>📋</span> Daily Attendance Breakdown
              </h2>
              <span style={{ fontSize: "12px", color: "#34d399", fontWeight: 700 }}>
                ● Real-time Live Log
              </span>
            </div>

            <div className="sch-attendance-meters">
              <div className="sch-meter-item">
                <div className="sch-meter-number" style={{ color: "#34d399" }}>3,310</div>
                <div className="sch-meter-label">Present</div>
              </div>
              <div className="sch-meter-item">
                <div className="sch-meter-number" style={{ color: "#f87171" }}>68</div>
                <div className="sch-meter-label">Absent (Unexcused)</div>
              </div>
              <div className="sch-meter-item">
                <div className="sch-meter-number" style={{ color: "#fbbf24" }}>28</div>
                <div className="sch-meter-label">Late Arrival</div>
              </div>
              <div className="sch-meter-item">
                <div className="sch-meter-number" style={{ color: "#38bdf8" }}>14</div>
                <div className="sch-meter-label">Medical / Excused</div>
              </div>
            </div>

            <div style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: 1.5 }}>
              Attendance registers submitted across classrooms this morning for <strong>{schoolName}</strong>. 
              Automated notifications dispatched to parents of unexcused absent students at 09:15 AM.
            </div>
          </div>

          {/* Enrolled Students Preview for This School */}
          <div className="sch-card">
            <div className="sch-card-header">
              <h2 className="sch-card-title">
                <span>🎓</span> {schoolName} Enrolled Students
              </h2>
              <button
                type="button"
                className="school-nav-btn school-nav-btn-highlight"
                style={{ fontSize: "12px" }}
                onClick={() => navigateTo("student-list")}
              >
                Open Full Student Directory ({schoolStudents.length}) →
              </button>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table className="sch-table">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Grade & Section</th>
                    <th>Campus</th>
                    <th>GPA</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {schoolStudents.slice(0, 5).map((stu) => (
                    <tr key={stu.id}>
                      <td style={{ fontFamily: "JetBrains Mono, monospace", color: "#818cf8", fontSize: "12px" }}>
                        {stu.id}
                      </td>
                      <td><strong>{stu.fullName}</strong></td>
                      <td style={{ color: "#cbd5e1" }}>{stu.grade} - {stu.section}</td>
                      <td style={{ fontSize: "12px", color: "#94a3b8" }}>{stu.campus}</td>
                      <td><span style={{ color: "#34d399", fontWeight: 700 }}>{stu.gpa}</span></td>
                      <td>
                        <span className="sch-badge sch-badge-success">{stu.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fee Collection Ledger */}
          <div className="sch-card">
            <div className="sch-card-header">
              <h2 className="sch-card-title">
                <span>💳</span> Recent Fee Collections & Receipts
              </h2>
              <button
                type="button"
                className="school-nav-btn"
                style={{ fontSize: "11px" }}
                onClick={() => alert("Downloading Fee Summary Report (PDF)...")}
              >
                📥 Download Ledger
              </button>
            </div>

            <div className="sch-fee-progress-bar">
              <div className="sch-fee-progress-fill" style={{ width: "92.4%" }}></div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table className="sch-table">
                <thead>
                  <tr>
                    <th>Receipt ID</th>
                    <th>Student Name</th>
                    <th>Class / Grade</th>
                    <th>Fee Type</th>
                    <th>Amount</th>
                    <th>Payment Method</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {RECENT_FEE_COLLECTIONS.map((item) => (
                    <tr key={item.id}>
                      <td style={{ fontFamily: "JetBrains Mono, monospace", color: "#818cf8" }}>{item.id}</td>
                      <td><strong>{item.student}</strong></td>
                      <td style={{ color: "#94a3b8" }}>{item.grade}</td>
                      <td>{item.feeType}</td>
                      <td style={{ fontWeight: 700, color: "#34d399" }}>{item.amount}</td>
                      <td style={{ fontSize: "12px", color: "#cbd5e1" }}>{item.method}</td>
                      <td>
                        <span className={`sch-badge ${item.status === "Paid" ? "sch-badge-success" : item.status.includes("Overdue") ? "sch-badge-danger" : "sch-badge-warning"}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: School Activities & Quick Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Upcoming School Activities */}
          <div className="sch-card">
            <div className="sch-card-header">
              <h2 className="sch-card-title">
                <span>⚡</span> Upcoming School Activities
              </h2>
              <button
                type="button"
                className="school-nav-btn"
                style={{ fontSize: "11px" }}
                onClick={() => navigateTo("school-calendar")}
              >
                View Calendar →
              </button>
            </div>

            <div className="sch-activity-list">
              {UPCOMING_ACTIVITIES.map((act) => (
                <div key={act.id} className="sch-activity-item">
                  <div className="sch-activity-icon">{act.icon}</div>
                  <div className="sch-activity-content">
                    <div className="sch-activity-title">{act.title}</div>
                    <div className="sch-activity-desc">{act.desc}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                      <span className="sch-activity-time">{act.time}</span>
                      <span className="sch-badge sch-badge-info" style={{ fontSize: "10px", padding: "1px 6px" }}>
                        {act.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Administration Actions */}
          <div className="sch-card">
            <div className="sch-card-header">
              <h2 className="sch-card-title">
                <span>🚀</span> Quick Admin Actions
              </h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button
                type="button"
                className="school-nav-btn"
                style={{ justifyContent: "space-between", padding: "12px 16px" }}
                onClick={() => navigateTo("student-list")}
              >
                <span>🎓 View & Manage Student Records</span>
                <span>→</span>
              </button>
              <button
                type="button"
                className="school-nav-btn"
                style={{ justifyContent: "space-between", padding: "12px 16px" }}
                onClick={() => navigateTo("school-profile")}
              >
                <span>🏫 Update School Info & Logo</span>
                <span>→</span>
              </button>
              <button
                type="button"
                className="school-nav-btn"
                style={{ justifyContent: "space-between", padding: "12px 16px" }}
                onClick={() => navigateTo("campus-management")}
              >
                <span>🏢 Manage Branches & Campuses</span>
                <span>→</span>
              </button>
              <button
                type="button"
                className="school-nav-btn"
                style={{ justifyContent: "space-between", padding: "12px 16px" }}
                onClick={() => navigateTo("academic-year-management")}
              >
                <span>📅 Configure Academic Calendar</span>
                <span>→</span>
              </button>
              <button
                type="button"
                className="school-nav-btn"
                style={{ justifyContent: "space-between", padding: "12px 16px" }}
                onClick={() => navigateTo("term-semester-management")}
              >
                <span>⏳ Term & Semester Dates</span>
                <span>→</span>
              </button>
              <button
                type="button"
                className="school-nav-btn"
                style={{ justifyContent: "space-between", padding: "12px 16px" }}
                onClick={() => navigateTo("school-settings")}
              >
                <span>⚙️ School Rules & Grading Systems</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SchoolDashboard;
