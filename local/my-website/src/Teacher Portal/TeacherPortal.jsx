import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./TeacherPortal.css";
import { getStudents } from "../Student Management/studentData";
import SpinningWordsBackground from "../components/SpinningWordsBackground";
import MotivationQuoteWidget from "../components/MotivationQuoteWidget";
import DailyQuotePopupModal from "../components/DailyQuotePopupModal";

const INITIAL_TEACHERS = [
  {
    id: "TCH-2026-102",
    name: "Mrs. Sarah Jenkins",
    title: "Senior Chemistry & Science Faculty",
    email: "s.jenkins@faculty.school.edu",
    phone: "+233 24 551 0922",
    dept: "Science & Mathematics Department",
    campus: "Kensington Central Campus",
    classes: ["Grade 11-A (Chemistry)", "Grade 10-B (General Science)", "Grade 12-A (Lab Practical)"],
    totalStudents: 94,
    periodsToday: 4,
  },
  {
    id: "TCH-GH-101",
    name: "Mr. Kofi Annan",
    title: "Head of Physics & Robotics",
    email: "k.annan@faculty.school.edu",
    phone: "+233 20 782 1109",
    dept: "Applied Engineering & Physics",
    campus: "Kensington Central Campus",
    classes: ["Grade 12-A (Advanced Physics)", "Grade 11-A (Robotics & Circuits)", "Grade 10-A (Applied Physics)"],
    totalStudents: 108,
    periodsToday: 5,
  },
  {
    id: "TCH-2026-103",
    name: "Marcus Brody",
    title: "Senior History & Social Studies Master",
    email: "m.brody@faculty.school.edu",
    phone: "+44 7700 900511",
    dept: "Humanities & Classical History",
    campus: "North London Science Wing",
    classes: ["Grade 11-B (World History)", "Grade 10-A (African & World Civilizations)"],
    totalStudents: 68,
    periodsToday: 3,
  },
];

const TEACHER_SCHEDULE = [
  { time: "08:35 AM - 09:50 AM", period: "Period 1", classSection: "Grade 11-A", subject: "Organic & Inorganic Chemistry", room: "Science Lab 1", attendees: "28 Students" },
  { time: "09:55 AM - 11:10 AM", period: "Period 2", classSection: "Grade 10-B", subject: "General Science & Lab Safety", room: "Room 204", attendees: "32 Students" },
  { time: "11:10 AM - 11:55 AM", period: "Faculty Office Hour", classSection: "All Classes", subject: "Student Consultations & Advising", room: "Staff Office 3", attendees: "Drop-in" },
  { time: "12:00 PM - 01:15 PM", period: "Period 3", classSection: "Grade 12-A", subject: "Advanced Lab Practical", room: "Chemistry Lab 2", attendees: "22 Students" },
  { time: "01:20 PM - 02:35 PM", period: "Period 4", classSection: "Grade 11-A", subject: "Tutorial & Exam Prep", room: "Room 102", attendees: "28 Students" },
];

function TeacherPortal({ onNavigate, onLogout }) {
  const [currentTeacher, setCurrentTeacher] = useState(() => {
    try {
      const stored = localStorage.getItem("active_teacher_user");
      return stored ? JSON.parse(stored) : INITIAL_TEACHERS[0];
    } catch {
      return INITIAL_TEACHERS[0];
    }
  });

  const studentsList = getStudents("ALL").slice(0, 8);
  const [activeTab, setActiveTab] = useState("attendance");
  const [toastMessage, setToastMessage] = useState(null);

  // Class Attendance Register state
  const [attendanceRecords, setAttendanceRecords] = useState(() => {
    return studentsList.map((s) => ({
      id: s.id,
      name: s.fullName,
      roll: s.rollNumber,
      status: "Present",
    }));
  });

  // Gradebook State
  const [gradesList, setGradesList] = useState([
    { id: "STU-SMIA-001", name: "Elena Rostova", score: 96, grade: "A+" },
    { id: "STU-SMIA-002", name: "Kwame Mensah", score: 98, grade: "A+" },
    { id: "STU-SMIA-003", name: "Lucas Vance", score: 84, grade: "B+" },
    { id: "STU-SMIA-004", name: "Ama Serwaa", score: 92, grade: "A" },
    { id: "STU-SMIA-005", name: "Liam Carter", score: 78, grade: "B" },
    { id: "STU-SMIA-006", name: "Sophia Martinez", score: 95, grade: "A+" },
  ]);

  const [isUnlocked, setIsUnlocked] = useState(() => {
    return (
      sessionStorage.getItem("teacher_portal_unlocked") === "true" ||
      localStorage.getItem("teacher_auth") === "true"
    );
  });
  const [passcodeInput, setPasscodeInput] = useState("Teacher@2026"); // Auto-filled for trial sake
  const [selectedTeacherId, setSelectedTeacherId] = useState(INITIAL_TEACHERS[0].id);
  const [passcodeError, setPasscodeError] = useState(null);
  const [showPasscodeText, setShowPasscodeText] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleVerifyPasscode = (e) => {
    if (e) e.preventDefault();
    setPasscodeError(null);

    const valid = ["Teacher@2026", "2026", "Teacher", "teacher"];
    if (valid.includes(passcodeInput.trim())) {
      sessionStorage.setItem("teacher_portal_unlocked", "true");
      localStorage.setItem("teacher_auth", "true");
      localStorage.setItem("show_daily_quote_popup", "true");

      const matched = INITIAL_TEACHERS.find((t) => t.id === selectedTeacherId) || INITIAL_TEACHERS[0];
      setCurrentTeacher(matched);
      localStorage.setItem("active_teacher_user", JSON.stringify(matched));
      setIsUnlocked(true);
      showToast(`Passcode Verified! Welcome, ${matched.name}.`);
    } else {
      setPasscodeError("Invalid faculty passcode. For trial evaluation, use: Teacher@2026");
    }
  };

  const handleLockPortal = () => {
    sessionStorage.removeItem("teacher_portal_unlocked");
    localStorage.removeItem("teacher_auth");
    setIsUnlocked(false);
    showToast("Teacher portal locked.");
  };

  const handleSwitchTeacher = (teacherId) => {
    const found = INITIAL_TEACHERS.find((t) => t.id === teacherId);
    if (found) {
      setCurrentTeacher(found);
      localStorage.setItem("active_teacher_user", JSON.stringify(found));
      showToast(`Switched active teacher profile to ${found.name}!`);
    }
  };

  const handleToggleAttendance = (studentId, newStatus) => {
    setAttendanceRecords((prev) =>
      prev.map((r) => (r.id === studentId ? { ...r, status: newStatus } : r))
    );
  };

  const handleScoreChange = (id, newScore) => {
    const val = Number(newScore);
    let letter = "F";
    if (val >= 90) letter = "A+";
    else if (val >= 80) letter = "A";
    else if (val >= 70) letter = "B";
    else if (val >= 60) letter = "C";
    else if (val >= 50) letter = "D";

    setGradesList((prev) =>
      prev.map((g) => (g.id === id ? { ...g, score: val, grade: letter } : g))
    );
  };

  const handleSignOut = () => {
    sessionStorage.removeItem("teacher_portal_unlocked");
    localStorage.removeItem("teacher_auth");
    localStorage.removeItem("active_teacher_user");
    if (onLogout) {
      onLogout();
    } else if (onNavigate) {
      onNavigate("login");
    }
  };

  const presentCount = attendanceRecords.filter((r) => r.status === "Present").length;
  const lateCount = attendanceRecords.filter((r) => r.status === "Late").length;
  const absentCount = attendanceRecords.filter((r) => r.status === "Absent").length;

  // Passcode Security Gate if not unlocked
  if (!isUnlocked) {
    return (
      <div className="tp-page-wrapper tp-gate-center">
        {/* Interactive 3D Spinning Words Aura */}
        <SpinningWordsBackground speed="slow" />

        <div className="tp-passcode-card">
          <div className="tp-passcode-badge">
            <span className="tp-passcode-icon">🔐</span>
            <div>
              <h2 className="tp-passcode-title">Faculty Security Passcode Gate</h2>
              <div className="tp-passcode-sub">
                Teacher & instructor credentials required to enter this workstation.
              </div>
            </div>
          </div>

          {/* Trial Mode Notification */}
          <div className="tp-trial-banner">
            <div className="tp-trial-header">
              <span className="tp-trial-chip">⚡ TRIAL EVALUATION MODE</span>
              <span className="tp-trial-hint">Passcode Auto-Filled: <strong>Teacher@2026</strong></span>
            </div>
            <p className="tp-trial-text">
              For trial and evaluation convenience, the faculty security passcode is automatically filled below. Click the button to enter instantly.
            </p>
          </div>

          <form onSubmit={handleVerifyPasscode} className="tp-passcode-form">
            <div className="tp-form-field">
              <label className="tp-field-label">Select Faculty Profile</label>
              <select
                className="tp-field-input"
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
              >
                {INITIAL_TEACHERS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} — {t.title} ({t.id})
                  </option>
                ))}
              </select>
            </div>

            <div className="tp-form-field">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label className="tp-field-label" style={{ margin: 0 }}>Faculty Passcode</label>
                <button
                  type="button"
                  className="tp-toggle-pass-btn"
                  onClick={() => setShowPasscodeText(!showPasscodeText)}
                >
                  {showPasscodeText ? "🙈 Hide" : "👁️ Reveal"}
                </button>
              </div>
              <input
                type={showPasscodeText ? "text" : "password"}
                className="tp-field-input"
                value={passcodeInput}
                onChange={(e) => {
                  setPasscodeInput(e.target.value);
                  setPasscodeError(null);
                }}
                placeholder="Enter passcode (Teacher@2026)"
                required
              />
            </div>

            {passcodeError && (
              <div className="tp-error-box">
                ⚠️ {passcodeError}
              </div>
            )}

            <button type="submit" className="tp-unlock-btn">
              🔓 Verify Passcode & Enter Teacher Portal
            </button>
          </form>

          <div className="tp-gate-footer">
            <button
              type="button"
              className="tp-helper-btn"
              onClick={() => {
                setPasscodeInput("Teacher@2026");
                setPasscodeError(null);
              }}
            >
              Reset Auto-Fill Passcode (Teacher@2026)
            </button>

            <Link to="/" className="tp-helper-link">
              ← Return to Hub
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tp-page-wrapper">
      {/* Interactive 3D Spinning Words Aura */}
      <SpinningWordsBackground speed="normal" />

      {/* Daily Motivational Quote Popup Modal */}
      <DailyQuotePopupModal
        forceOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
      />

      {/* Toast Alert */}
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
            fontWeight: 700,
            fontSize: "13px",
          }}
        >
          ✓ {toastMessage}
        </div>
      )}

      {/* Top Nav Bar */}
      <nav className="tp-nav-bar">
        <div className="tp-brand">
          <div className="tp-logo-badge">👨‍🏫</div>
          <div>
            <div className="tp-brand-title">Teacher & Faculty Portal</div>
            <div className="tp-brand-subtitle">
              School Hub Faculty Workstation • {currentTeacher.dept}
            </div>
          </div>
        </div>

        <div className="tp-nav-links">
          <span style={{ fontSize: "12px", color: "#94a3b8" }}>Testing Profile:</span>
          <select
            className="tp-switcher-select"
            value={currentTeacher.id}
            onChange={(e) => handleSwitchTeacher(e.target.value)}
          >
            {INITIAL_TEACHERS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.id})
              </option>
            ))}
          </select>

          <button
            type="button"
            className="tp-nav-btn tp-nav-btn-highlight"
            onClick={() => setQuoteModalOpen(true)}
            title="Read Today's Daily Inspiration"
          >
            ✨ Daily Quote
          </button>

          <button
            type="button"
            className="tp-nav-btn"
            onClick={handleLockPortal}
            title="Lock session with faculty passcode"
          >
            🔒 Lock Portal
          </button>

          <button
            type="button"
            className="tp-nav-btn tp-nav-btn-highlight"
            onClick={() => onNavigate && onNavigate("notifications")}
            title="School Bulletins"
          >
            🔔 Bulletins
          </button>

          <button
            type="button"
            className="tp-nav-btn"
            onClick={() => setActiveTab("attendance")}
            title="Access Attendance Management"
            style={{ background: activeTab === "attendance" ? "rgba(16, 185, 129, 0.25)" : "rgba(255, 255, 255, 0.05)", color: "#34d399", borderColor: "rgba(16, 185, 129, 0.4)" }}
          >
            📋 Attendance
          </button>

          <button
            type="button"
            className="tp-nav-btn"
            onClick={() => setActiveTab("gradebook")}
            title="Access Examinations & Results"
            style={{ background: activeTab === "gradebook" ? "rgba(99, 102, 241, 0.25)" : "rgba(255, 255, 255, 0.05)", color: "#a5b4fc", borderColor: "rgba(99, 102, 241, 0.4)" }}
          >
            🏆 Examinations
          </button>

          <button
            type="button"
            className="tp-nav-btn"
            onClick={() => setActiveTab("schedule")}
            title="Access Timetable Management"
            style={{ background: activeTab === "schedule" ? "rgba(6, 182, 212, 0.25)" : "rgba(255, 255, 255, 0.05)", color: "#38bdf8", borderColor: "rgba(6, 182, 212, 0.4)" }}
          >
            🗓️ Timetable
          </button>

          <Link to="/" className="tp-nav-btn">
            ← Hub
          </Link>

          <button
            type="button"
            className="tp-nav-btn"
            onClick={handleSignOut}
            title="Log out of faculty portal"
          >
            🚪 Sign Out
          </button>
        </div>
      </nav>

      {/* Teacher Hero Banner */}
      <div className="tp-hero-card">
        <div className="tp-hero-left">
          <div className="tp-avatar-big">
            {currentTeacher.name.split(" ")[1]?.[0] || "T"}
          </div>
          <div>
            <h1 className="tp-hero-name">Welcome, {currentTeacher.name}!</h1>
            <div className="tp-hero-meta">
              <span>🆔 Staff ID: <strong style={{ color: "#34d399", fontFamily: "JetBrains Mono" }}>{currentTeacher.id}</strong></span>
              <span>•</span>
              <span>Designation: <strong>{currentTeacher.title}</strong></span>
              <span>•</span>
              <span>Campus: <strong>{currentTeacher.campus}</strong></span>
              <span>•</span>
              <span>Official Email: <strong>{currentTeacher.email}</strong></span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            type="button"
            className="tp-nav-btn tp-nav-btn-highlight"
            onClick={() => setActiveTab("attendance")}
          >
            📋 Take Morning Attendance
          </button>
          <button
            type="button"
            className="tp-nav-btn"
            onClick={() => setActiveTab("gradebook")}
          >
            📊 Open Gradebook
          </button>
        </div>
      </div>

      {/* Faculty Daily Inspiration & Wisdom */}
      <MotivationQuoteWidget />

      {/* KPI Stats Strip */}
      <div className="tp-kpi-grid">
        <div className="tp-kpi-card">
          <div className="tp-kpi-top">
            <span className="tp-kpi-label">Active Students Taught</span>
            <span className="tp-kpi-icon">👥</span>
          </div>
          <div className="tp-kpi-val" style={{ color: "#34d399" }}>
            {currentTeacher.totalStudents} Students
          </div>
          <div className="tp-kpi-sub">
            Across {currentTeacher.classes.length} Section Rosters
          </div>
        </div>

        <div className="tp-kpi-card">
          <div className="tp-kpi-top">
            <span className="tp-kpi-label">Today's Class Load</span>
            <span className="tp-kpi-icon">⏳</span>
          </div>
          <div className="tp-kpi-val" style={{ color: "#38bdf8" }}>
            {currentTeacher.periodsToday} Periods
          </div>
          <div className="tp-kpi-sub">
            Next: Period 2 (10-B) in 25 mins
          </div>
        </div>

        <div className="tp-kpi-card">
          <div className="tp-kpi-top">
            <span className="tp-kpi-label">Daily Attendance Status</span>
            <span className="tp-kpi-icon">✓</span>
          </div>
          <div className="tp-kpi-val" style={{ color: "#10b981" }}>
            Ready
          </div>
          <div className="tp-kpi-sub">
            Section 11-A Attendance open
          </div>
        </div>

        <div className="tp-kpi-card">
          <div className="tp-kpi-top">
            <span className="tp-kpi-label">Pending Lab Submissions</span>
            <span className="tp-kpi-icon">📝</span>
          </div>
          <div className="tp-kpi-val" style={{ color: "#fbbf24" }}>
            18 Reports
          </div>
          <div className="tp-kpi-sub">
            Due for grading by Friday
          </div>
        </div>
      </div>

      {/* Portal Tabs */}
      <div className="tp-tabs">
        <button
          type="button"
          className={`tp-tab-btn ${activeTab === "attendance" ? "active" : ""}`}
          onClick={() => setActiveTab("attendance")}
        >
          📋 Attendance Register
        </button>
        <button
          type="button"
          className={`tp-tab-btn ${activeTab === "gradebook" ? "active" : ""}`}
          onClick={() => setActiveTab("gradebook")}
        >
          📊 Gradebook & Marks Entry
        </button>
        <button
          type="button"
          className={`tp-tab-btn ${activeTab === "schedule" ? "active" : ""}`}
          onClick={() => setActiveTab("schedule")}
        >
          🗓️ Teaching Timetable
        </button>
        <button
          type="button"
          className={`tp-tab-btn ${activeTab === "roster" ? "active" : ""}`}
          onClick={() => setActiveTab("roster")}
        >
          👥 Class Student Directory
        </button>
      </div>

      {/* TAB 1: ATTENDANCE REGISTER */}
      {activeTab === "attendance" && (
        <div className="tp-card">
          <div className="tp-card-header">
            <div>
              <h2 className="tp-card-title">
                <span>📋</span> Daily Attendance Register - Grade 11-A
              </h2>
              <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
                Class Section: 11-A (Advanced Science) • Chemistry Period 1
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "#34d399", fontWeight: 700 }}>
                {presentCount} Present
              </span>
              <span>•</span>
              <span style={{ fontSize: "12px", color: "#fbbf24", fontWeight: 700 }}>
                {lateCount} Late
              </span>
              <span>•</span>
              <span style={{ fontSize: "12px", color: "#f87171", fontWeight: 700 }}>
                {absentCount} Absent
              </span>
              <button
                type="button"
                className="tp-nav-btn tp-nav-btn-highlight"
                onClick={() => showToast(`✓ Attendance Register successfully submitted to Principal's office!`)}
              >
                💾 Submit Daily Register
              </button>
            </div>
          </div>

          {/* Quick Sub-portal Launchpad for Module 7: Attendance Management */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", padding: "10px 16px", background: "rgba(255, 255, 255, 0.02)", borderBottom: "1px solid rgba(255, 255, 255, 0.07)" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#34d399", display: "flex", alignItems: "center", marginRight: "6px" }}>
              📋 ATTENDANCE PORTAL:
            </span>
            <Link to="/take-attendance" className="tp-status-btn present" style={{ textDecoration: "none" }}>📝 Take Attendance</Link>
            <Link to="/attendance-register" className="tp-status-btn" style={{ textDecoration: "none" }}>📋 Master Register</Link>
            <Link to="/student-attendance-history" className="tp-status-btn" style={{ textDecoration: "none" }}>🕒 Student History</Link>
            <Link to="/attendance-correction" className="tp-status-btn" style={{ textDecoration: "none" }}>✏️ Corrections</Link>
            <Link to="/attendance-reports" className="tp-status-btn" style={{ textDecoration: "none" }}>📊 Reports</Link>
            <Link to="/absence-alerts" className="tp-status-btn" style={{ textDecoration: "none" }}>🚨 Absence Alerts</Link>
            <Link to="/staff-attendance-register" className="tp-status-btn" style={{ textDecoration: "none" }}>👨‍🏫 Staff Register</Link>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="tp-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th>Student ID</th>
                  <th>Current Attendance Status</th>
                  <th style={{ textAlign: "right" }}>Mark Attendance</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontFamily: "JetBrains Mono", color: "#94a3b8" }}>{r.roll}</td>
                    <td><strong>{r.name}</strong></td>
                    <td style={{ fontFamily: "JetBrains Mono", color: "#38bdf8" }}>{r.id}</td>
                    <td>
                      <span
                        className={`tp-status-btn ${
                          r.status === "Present"
                            ? "present"
                            : r.status === "Late"
                            ? "late"
                            : "absent"
                        }`}
                      >
                        ● {r.status}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "6px" }}>
                        <button
                          type="button"
                          className={`tp-status-btn ${r.status === "Present" ? "present" : ""}`}
                          onClick={() => handleToggleAttendance(r.id, "Present")}
                        >
                          Present
                        </button>
                        <button
                          type="button"
                          className={`tp-status-btn ${r.status === "Late" ? "late" : ""}`}
                          onClick={() => handleToggleAttendance(r.id, "Late")}
                        >
                          Late
                        </button>
                        <button
                          type="button"
                          className={`tp-status-btn ${r.status === "Absent" ? "absent" : ""}`}
                          onClick={() => handleToggleAttendance(r.id, "Absent")}
                        >
                          Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: GRADEBOOK & MARKS ENTRY */}
      {activeTab === "gradebook" && (
        <div className="tp-card">
          <div className="tp-card-header">
            <div>
              <h2 className="tp-card-title">
                <span>📊</span> Gradebook & Terminal Examination Marks Entry
              </h2>
              <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
                Assessment: Mid-Term Chemistry & Physics Practical Examination (Max: 100 Marks)
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
              <button
                type="button"
                className="tp-nav-btn tp-nav-btn-highlight"
                onClick={() => showToast("✓ Gradebook changes committed and synced to report cards!")}
              >
                💾 Save All Marks
              </button>
            </div>
          </div>

          {/* Quick Sub-portal Launchpad for Module 8: Examinations and Results */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", padding: "10px 16px", background: "rgba(255, 255, 255, 0.02)", borderBottom: "1px solid rgba(255, 255, 255, 0.07)" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#a5b4fc", display: "flex", alignItems: "center", marginRight: "6px" }}>
              🏆 EXAMINATIONS PORTAL:
            </span>
            <Link to="/marks-entry" className="tp-status-btn present" style={{ textDecoration: "none" }}>✍️ Marks Entry</Link>
            <Link to="/marks-import" className="tp-status-btn" style={{ textDecoration: "none" }}>📥 Import Scores</Link>
            <Link to="/assessment-setup" className="tp-status-btn" style={{ textDecoration: "none" }}>📝 Assessment Setup</Link>
            <Link to="/examination-management" className="tp-status-btn" style={{ textDecoration: "none" }}>🗓️ Exam Schedules</Link>
            <Link to="/results-review" className="tp-status-btn" style={{ textDecoration: "none" }}>🔍 Results Review</Link>
            <Link to="/results-approval" className="tp-status-btn" style={{ textDecoration: "none" }}>✅ Approval</Link>
            <Link to="/grading-system" className="tp-status-btn" style={{ textDecoration: "none" }}>📐 Grading Scales</Link>
            <Link to="/class-performance" className="tp-status-btn" style={{ textDecoration: "none" }}>📊 Performance</Link>
            <Link to="/report-cards" className="tp-status-btn" style={{ textDecoration: "none" }}>📄 Report Cards</Link>
            <Link to="/student-results" className="tp-status-btn" style={{ textDecoration: "none" }}>🎓 Transcripts</Link>
            <Link to="/results-publication" className="tp-status-btn" style={{ textDecoration: "none" }}>📢 Publication</Link>
            <Link to="/results-correction" className="tp-status-btn" style={{ textDecoration: "none" }}>🔄 Corrections</Link>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="tp-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Student Full Name</th>
                  <th>Assessment Score (/ 100)</th>
                  <th>Calculated Letter Grade</th>
                  <th>Performance Tier</th>
                </tr>
              </thead>
              <tbody>
                {gradesList.map((g) => (
                  <tr key={g.id}>
                    <td style={{ fontFamily: "JetBrains Mono", color: "#38bdf8" }}>{g.id}</td>
                    <td><strong>{g.name}</strong></td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        className="tp-score-input"
                        value={g.score}
                        onChange={(e) => handleScoreChange(g.id, e.target.value)}
                      />
                      <span style={{ fontSize: "12px", color: "#94a3b8", marginLeft: "6px" }}>%</span>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: 800,
                          color: g.grade === "A+" || g.grade === "A" ? "#34d399" : g.grade === "B+" || g.grade === "B" ? "#38bdf8" : "#fbbf24",
                        }}
                      >
                        {g.grade}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: "12px", color: "#cbd5e1" }}>
                        {g.score >= 90 ? "Distinction / First Class" : g.score >= 75 ? "Credit / Strong Pass" : "Average"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: TEACHING SCHEDULE */}
      {activeTab === "schedule" && (
        <div className="tp-card">
          <div className="tp-card-header">
            <h2 className="tp-card-title">
              <span>🗓️</span> Teaching Timetable & Classroom Allocations
            </h2>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <Link
                to="/teacher-timetable"
                className="tp-nav-btn"
                style={{ background: "rgba(6, 182, 212, 0.2)", border: "1px solid rgba(6, 182, 212, 0.4)", color: "#38bdf8", fontSize: "12px" }}
              >
                🗓️ Full Faculty Matrix →
              </Link>
              <button
                type="button"
                className="tp-nav-btn"
                onClick={() => showToast("Downloading Weekly Teaching Schedule PDF...")}
              >
                📥 Print Schedule
              </button>
            </div>
          </div>

          {/* Quick Sub-portal Launchpad for Module 9: Timetable Management */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", padding: "10px 16px", background: "rgba(255, 255, 255, 0.02)", borderBottom: "1px solid rgba(255, 255, 255, 0.07)" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#38bdf8", display: "flex", alignItems: "center", marginRight: "6px" }}>
              🗓️ TIMETABLE PORTAL:
            </span>
            <Link to="/period-management" className="tp-status-btn" style={{ textDecoration: "none" }}>⏰ Period Hours</Link>
            <Link to="/timetable-builder" className="tp-status-btn" style={{ textDecoration: "none" }}>🛠️ Timetable Builder</Link>
            <Link to="/class-timetable" className="tp-status-btn" style={{ textDecoration: "none" }}>📚 Class Timetable</Link>
            <Link to="/teacher-timetable" className="tp-status-btn present" style={{ textDecoration: "none" }}>👨‍🏫 Teacher Roster</Link>
            <Link to="/room-management" className="tp-status-btn" style={{ textDecoration: "none" }}>🏢 Rooms & Labs</Link>
            <Link to="/timetable-conflict-checker" className="tp-status-btn" style={{ textDecoration: "none" }}>⚡ Conflict Checker</Link>
            <Link to="/substitute-teacher-management" className="tp-status-btn" style={{ textDecoration: "none" }}>🔄 Substitute Teachers</Link>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="tp-table">
              <thead>
                <tr>
                  <th>Time Slot</th>
                  <th>Period</th>
                  <th>Class & Section</th>
                  <th>Subject Course</th>
                  <th>Classroom / Lab</th>
                  <th>Enrolled Roster</th>
                </tr>
              </thead>
              <tbody>
                {TEACHER_SCHEDULE.map((s, idx) => (
                  <tr key={idx}>
                    <td style={{ fontFamily: "JetBrains Mono", color: "#34d399" }}>{s.time}</td>
                    <td><strong>{s.period}</strong></td>
                    <td style={{ color: "#38bdf8", fontWeight: 700 }}>{s.classSection}</td>
                    <td>{s.subject}</td>
                    <td style={{ color: "#cbd5e1" }}>📍 {s.room}</td>
                    <td style={{ fontSize: "12px", color: "#94a3b8" }}>{s.attendees}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: CLASS ROSTER */}
      {activeTab === "roster" && (
        <div className="tp-card">
          <div className="tp-card-header">
            <h2 className="tp-card-title">
              <span>👥</span> Assigned Class Student Directory
            </h2>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                className="tp-nav-btn tp-nav-btn-highlight"
                onClick={() => onNavigate && onNavigate("student-list")}
              >
                Open Full Student Management →
              </button>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="tp-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Class / Section</th>
                  <th>Term GPA</th>
                  <th>Attendance Rate</th>
                  <th>Fee Status</th>
                  <th>Parent / Emergency Contact</th>
                </tr>
              </thead>
              <tbody>
                {studentsList.map((stu) => (
                  <tr key={stu.id}>
                    <td style={{ fontFamily: "JetBrains Mono", color: "#38bdf8" }}>{stu.id}</td>
                    <td><strong>{stu.fullName}</strong></td>
                    <td>{stu.grade} - {stu.section}</td>
                    <td><strong style={{ color: "#34d399" }}>{stu.gpa}</strong></td>
                    <td>{stu.attendancePct}%</td>
                    <td>
                      <span className="tp-status-btn present" style={{ fontSize: "10px" }}>
                        {stu.feesStatus} ({stu.feesBalance})
                      </span>
                    </td>
                    <td style={{ fontSize: "12px", color: "#cbd5e1" }}>
                      {stu.guardians?.[0]?.name} ({stu.guardians?.[0]?.phone})
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherPortal;
