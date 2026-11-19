import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./StudentPortal.css";
import { getStudents, getStudentById } from "../Student Management/studentData";
import SpinningWordsBackground from "../components/SpinningWordsBackground";
import MotivationQuoteWidget from "../components/MotivationQuoteWidget";
import DailyQuotePopupModal from "../components/DailyQuotePopupModal";

const STUDENT_COURSES = [
  { code: "MTH-401", name: "Core Mathematics & Calculus", teacher: "Dr. Jonathan Miller", room: "Hall B-12", attendance: "98%", grade: "A+", credits: 4 },
  { code: "PHY-302", name: "Advanced Physics & Robotics", teacher: "Mr. Kofi Annan", room: "Lab 3 (Physics Wing)", attendance: "96%", grade: "A", credits: 4 },
  { code: "CHM-301", name: "Organic & Inorganic Chemistry", teacher: "Mrs. Sarah Jenkins", room: "Science Lab 1", attendance: "100%", grade: "A+", credits: 4 },
  { code: "ENG-204", name: "English Language & Literature", teacher: "Mrs. Clara Oswald", room: "Room 104", attendance: "97%", grade: "A-", credits: 3 },
  { code: "CSC-310", name: "Computer Science & Python AI", teacher: "Dr. Margaret Hamilton", room: "Innovation Lab", attendance: "100%", grade: "A+", credits: 3 },
  { code: "ECN-201", name: "Economics & Global Commerce", teacher: "Mr. Harrison Sterling", room: "Room 202", attendance: "95%", grade: "B+", credits: 3 },
];

const TODAY_SCHEDULE = [
  { time: "08:00 AM - 08:30 AM", period: "Homeroom & Assembly", subject: "Principal Address & Daily Briefing", room: "Main Auditorium", teacher: "Dame Eleanor Vance" },
  { time: "08:35 AM - 09:50 AM", period: "Period 1", subject: "Core Mathematics & Calculus", room: "Hall B-12", teacher: "Dr. Jonathan Miller" },
  { time: "09:55 AM - 11:10 AM", period: "Period 2", subject: "Advanced Physics & Robotics", room: "Lab 3", teacher: "Mr. Kofi Annan" },
  { time: "11:10 AM - 11:55 AM", period: "Midday Break", subject: "Lunch & Campus Recreation", room: "Dining Hall", teacher: "Campus Staff" },
  { time: "12:00 PM - 01:15 PM", period: "Period 3", subject: "Computer Science & Python AI", room: "Innovation Lab", teacher: "Dr. Margaret Hamilton" },
  { time: "01:20 PM - 02:35 PM", period: "Period 4", subject: "Organic & Inorganic Chemistry", room: "Science Lab 1", teacher: "Mrs. Sarah Jenkins" },
];

const STUDENT_ASSIGNMENTS = [
  { id: "ASN-01", subject: "Physics", title: "Newtonian Mechanics Lab Experiment", dueDate: "Tomorrow, 11:59 PM", status: "Submitted", grade: "98/100" },
  { id: "ASN-02", subject: "Mathematics", title: "Calculus Derivatives & Integrals Problem Set", dueDate: "Nov 15, 2026", status: "In Progress", grade: "Pending" },
  { id: "ASN-03", subject: "Computer Science", title: "Sorting Algorithm Performance Benchmark", dueDate: "Nov 18, 2026", status: "Pending", grade: "Pending" },
  { id: "ASN-04", subject: "Chemistry", title: "Volumetric Titration Analysis Report", dueDate: "Nov 21, 2026", status: "Pending", grade: "Pending" },
];

const STUDENT_FEES_CEDI = [
  { id: "INV-GH-001", title: "Term 1 Academic Tuition & Syllabus", amount: "GH₵3,450.00", dueDate: "Sep 15, 2026", status: "Paid", receipt: "RCP-MOMO-91823" },
  { id: "INV-GH-002", title: "STEM Science & Robotics Lab Access", amount: "GH₵450.00", dueDate: "Oct 01, 2026", status: "Paid", receipt: "RCP-CARD-88129" },
  { id: "INV-GH-003", title: "Extracurricular Sports & Athletics Kit", amount: "GH₵250.00", dueDate: "Nov 10, 2026", status: "Paid", receipt: "RCP-CASH-77182" },
  { id: "INV-GH-004", title: "Term 2 Tuition Advance (Optional)", amount: "GH₵3,450.00", dueDate: "Jan 10, 2027", status: "Upcoming", receipt: "—" },
];

function StudentPortal({ onNavigate, onLogout }) {
  const allStudents = getStudents("ALL");
  const defaultStudent = allStudents[0] || {
    id: "STU-SMIA-002",
    fullName: "Kwame Mensah",
    grade: "Grade 11",
    section: "11-A (Advanced Science)",
    rollNumber: "11A-04",
    campus: "Kensington Central Campus",
    gpa: "3.95",
    attendancePct: 99,
    feesStatus: "Paid",
    feesBalance: "GH₵0.00",
    email: "k.mensah@student.school.edu",
    bloodGroup: "A+",
  };

  const [currentStudent, setCurrentStudent] = useState(() => {
    try {
      const stored = localStorage.getItem("active_student_user");
      return stored ? JSON.parse(stored) : defaultStudent;
    } catch {
      return defaultStudent;
    }
  });

  const [activeTab, setActiveTab] = useState("schedule");
  const [toastMessage, setToastMessage] = useState(null);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSwitchStudent = (stuId) => {
    const found = allStudents.find((s) => s.id === stuId);
    if (found) {
      setCurrentStudent(found);
      localStorage.setItem("active_student_user", JSON.stringify(found));
      showToast(`Switched active student view to ${found.fullName}!`);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("student_auth");
    localStorage.removeItem("active_student_user");
    if (onLogout) {
      onLogout();
    } else if (onNavigate) {
      onNavigate("login");
    }
  };

  return (
    <div className="sp-page-wrapper">
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
            background: "#0ea5e9",
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

      {/* Student Portal Navigation Bar */}
      <nav className="sp-nav-bar">
        <div className="sp-brand">
          <div className="sp-logo-badge">🎓</div>
          <div>
            <div className="sp-brand-title">Student Portal Gateway</div>
            <div className="sp-brand-subtitle">
              {currentStudent.schoolName || "School Hub International"} • Academic Term 2026/2027
            </div>
          </div>
        </div>

        <div className="sp-nav-links">
          <span style={{ fontSize: "12px", color: "#94a3b8" }}>Testing Profile:</span>
          <select
            className="sp-switcher-select"
            value={currentStudent.id}
            onChange={(e) => handleSwitchStudent(e.target.value)}
          >
            {allStudents.slice(0, 6).map((s) => (
              <option key={s.id} value={s.id}>
                {s.fullName} ({s.grade} - {s.id})
              </option>
            ))}
          </select>

          <button
            type="button"
            className="sp-nav-btn sp-nav-btn-highlight"
            onClick={() => onNavigate && onNavigate("notifications")}
            title="School Announcements"
          >
            🔔 Notices
          </button>

          <button
            type="button"
            className="sp-nav-btn sp-nav-btn-highlight"
            onClick={() => setQuoteModalOpen(true)}
            title="View Today's Daily Inspiration"
          >
            ✨ Daily Quote
          </button>

          <Link to="/" className="sp-nav-btn">
            ← Hub
          </Link>

          <button
            type="button"
            className="sp-nav-btn"
            onClick={handleSignOut}
            title="Log out of student portal"
          >
            🔒 Sign Out
          </button>
        </div>
      </nav>

      {/* Student Hero Banner */}
      <div className="sp-hero-card">
        <div className="sp-hero-left">
          <div className="sp-avatar-big">
            {currentStudent.firstName ? currentStudent.firstName[0] : "S"}
            {currentStudent.lastName ? currentStudent.lastName[0] : "T"}
          </div>
          <div>
            <h1 className="sp-hero-name">Welcome back, {currentStudent.fullName}!</h1>
            <div className="sp-hero-meta">
              <span>🆔 School ID: <strong style={{ color: "#38bdf8", fontFamily: "JetBrains Mono" }}>{currentStudent.id}</strong></span>
              <span>•</span>
              <span>Class: <strong>{currentStudent.grade} - {currentStudent.section}</strong></span>
              <span>•</span>
              <span>Roll No: <strong>{currentStudent.rollNumber}</strong></span>
              <span>•</span>
              <span>Campus: <strong>{currentStudent.campus}</strong></span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <span className="sp-badge sp-badge-success">
            ✓ Enrolled Active
          </span>
        </div>
      </div>

      {/* Daily Motivation & Inspirations Banner */}
      <MotivationQuoteWidget />

      {/* KPI Stats Strip */}
      <div className="sp-kpi-grid">
        <div className="sp-kpi-card">
          <div className="sp-kpi-top">
            <span className="sp-kpi-label">Cumulative GPA</span>
            <span className="sp-kpi-icon">🌟</span>
          </div>
          <div className="sp-kpi-val" style={{ color: "#38bdf8" }}>
            {currentStudent.gpa} <span style={{ fontSize: "14px", color: "#94a3b8" }}>/ 4.00</span>
          </div>
          <div className="sp-kpi-sub">
            Ranked Top 5% in {currentStudent.grade}
          </div>
        </div>

        <div className="sp-kpi-card">
          <div className="sp-kpi-top">
            <span className="sp-kpi-label">Overall Attendance</span>
            <span className="sp-kpi-icon">📋</span>
          </div>
          <div className="sp-kpi-val" style={{ color: "#34d399" }}>
            {currentStudent.attendancePct}%
          </div>
          <div className="sp-kpi-sub">
            114 days present • 0 unexcused absences
          </div>
        </div>

        <div className="sp-kpi-card">
          <div className="sp-kpi-top">
            <span className="sp-kpi-label">School Fee Balance</span>
            <span className="sp-kpi-icon">💳</span>
          </div>
          <div className="sp-kpi-val" style={{ color: currentStudent.feesBalance === "GH₵0.00" ? "#34d399" : "#fbbf24" }}>
            {currentStudent.feesBalance}
          </div>
          <div className="sp-kpi-sub">
            {currentStudent.feesBalance === "GH₵0.00" ? "✓ Fully Cleared for Term" : "Outstanding Term Balance"}
          </div>
        </div>

        <div className="sp-kpi-card">
          <div className="sp-kpi-top">
            <span className="sp-kpi-label">Enrolled Subjects</span>
            <span className="sp-kpi-icon">📚</span>
          </div>
          <div className="sp-kpi-val">6 Courses</div>
          <div className="sp-kpi-sub">
            21 Weekly Academic Periods
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sp-tabs">
        <button
          type="button"
          className={`sp-tab-btn ${activeTab === "schedule" ? "active" : ""}`}
          onClick={() => setActiveTab("schedule")}
        >
          🗓️ Daily Timetable
        </button>
        <button
          type="button"
          className={`sp-tab-btn ${activeTab === "courses" ? "active" : ""}`}
          onClick={() => setActiveTab("courses")}
        >
          📚 My Subjects ({STUDENT_COURSES.length})
        </button>
        <button
          type="button"
          className={`sp-tab-btn ${activeTab === "results" ? "active" : ""}`}
          onClick={() => setActiveTab("results")}
        >
          📝 Examination Results
        </button>
        <button
          type="button"
          className={`sp-tab-btn ${activeTab === "fees" ? "active" : ""}`}
          onClick={() => setActiveTab("fees")}
        >
          💳 Fees & Payments
        </button>
        <button
          type="button"
          className={`sp-tab-btn ${activeTab === "assignments" ? "active" : ""}`}
          onClick={() => setActiveTab("assignments")}
        >
          📁 Homework & Projects ({STUDENT_ASSIGNMENTS.length})
        </button>
      </div>

      {/* TAB 1: DAILY TIMETABLE */}
      {activeTab === "schedule" && (
        <div className="sp-card">
          <div className="sp-card-header">
            <h2 className="sp-card-title">
              <span>🗓️</span> Today's Class Timetable & Schedule
            </h2>
            <span style={{ fontSize: "12px", color: "#38bdf8", fontWeight: 700 }}>
              ● Term 1 Active Timetable
            </span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="sp-table">
              <thead>
                <tr>
                  <th>Time Slot</th>
                  <th>Period</th>
                  <th>Subject Course</th>
                  <th>Location / Room</th>
                  <th>Faculty Instructor</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {TODAY_SCHEDULE.map((s, idx) => (
                  <tr key={idx}>
                    <td style={{ fontFamily: "JetBrains Mono, monospace", color: "#38bdf8" }}>{s.time}</td>
                    <td><strong>{s.period}</strong></td>
                    <td style={{ color: "#ffffff", fontWeight: 600 }}>{s.subject}</td>
                    <td style={{ color: "#94a3b8" }}>{s.room}</td>
                    <td>{s.teacher}</td>
                    <td>
                      <span className="sp-badge sp-badge-success">Scheduled</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: MY COURSES */}
      {activeTab === "courses" && (
        <div className="sp-card">
          <div className="sp-card-header">
            <h2 className="sp-card-title">
              <span>📚</span> Enrolled Subjects & Academic Faculty
            </h2>
            <button
              type="button"
              className="sp-nav-btn"
              onClick={() => showToast("Downloading Semester Syllabus...")}
            >
              📥 Download Syllabus
            </button>
          </div>

          <div className="sp-courses-grid">
            {STUDENT_COURSES.map((c) => (
              <div key={c.code} className="sp-course-card">
                <div className="sp-course-top">
                  <div>
                    <div className="sp-course-code">{c.code}</div>
                    <div className="sp-course-name">{c.name}</div>
                  </div>
                  <span className="sp-badge sp-badge-success">{c.grade}</span>
                </div>
                <div className="sp-course-teacher">👨‍🏫 Instructor: {c.teacher}</div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#94a3b8", paddingTop: "8px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <span>📍 {c.room}</span>
                  <span>Attendance: <strong style={{ color: "#34d399" }}>{c.attendance}</strong></span>
                  <span>Credits: <strong>{c.credits}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: EXAM RESULTS */}
      {activeTab === "results" && (
        <div className="sp-card">
          <div className="sp-card-header">
            <h2 className="sp-card-title">
              <span>📝</span> Academic Terminal Examination Results
            </h2>
            <button
              type="button"
              className="sp-nav-btn sp-nav-btn-highlight"
              onClick={() => showToast("Generating Official PDF Report Card...")}
            >
              🖨️ Print Report Card
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="sp-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Assessment Score</th>
                  <th>Grade</th>
                  <th>Grade Points</th>
                  <th>Teacher Remark</th>
                </tr>
              </thead>
              <tbody>
                {STUDENT_COURSES.map((c) => (
                  <tr key={c.code}>
                    <td>
                      <strong>{c.name}</strong>
                      <div style={{ fontSize: "11px", color: "#38bdf8" }}>{c.code}</div>
                    </td>
                    <td>
                      <strong style={{ fontSize: "14px", color: "#ffffff" }}>
                        {c.grade === "A+" ? "96%" : c.grade === "A" ? "88%" : c.grade === "A-" ? "83%" : "76%"}
                      </strong>
                    </td>
                    <td>
                      <span className="sp-badge sp-badge-success">{c.grade}</span>
                    </td>
                    <td style={{ fontFamily: "JetBrains Mono", color: "#38bdf8" }}>
                      {c.grade === "A+" ? "4.00" : c.grade === "A" ? "4.00" : c.grade === "A-" ? "3.70" : "3.30"}
                    </td>
                    <td style={{ color: "#cbd5e1" }}>
                      {c.grade === "A+" ? "Outstanding academic mastery and analytical precision." : "Demonstrates solid understanding and strong active participation."}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: FEES & PAYMENTS IN GHANAIAN CEDI */}
      {activeTab === "fees" && (
        <div className="sp-card">
          <div className="sp-card-header">
            <div>
              <h2 className="sp-card-title">
                <span>💳</span> School Fees & Billing Ledger
              </h2>
              <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
                All payments processed securely via Mobile Money (MTN MoMo, Telecel Cash) or Direct Bank Wire.
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                className="sp-nav-btn sp-nav-btn-highlight"
                onClick={() => onNavigate ? onNavigate("online-payment") : (window.location.href = "/online-payment")}
              >
                📱 Pay with Mobile Money (GH₵)
              </button>
              <button
                type="button"
                className="sp-nav-btn"
                onClick={() => onNavigate ? onNavigate("fee-statements") : (window.location.href = "/fee-statements")}
              >
                📥 Fee Statement
              </button>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="sp-table">
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Fee Description</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Payment Receipt</th>
                </tr>
              </thead>
              <tbody>
                {STUDENT_FEES_CEDI.map((fee) => (
                  <tr key={fee.id}>
                    <td style={{ fontFamily: "JetBrains Mono", color: "#38bdf8" }}>{fee.id}</td>
                    <td><strong>{fee.title}</strong></td>
                    <td style={{ fontWeight: 800, color: "#fde047", fontSize: "14px" }}>{fee.amount}</td>
                    <td style={{ color: "#94a3b8" }}>{fee.dueDate}</td>
                    <td>
                      <span className={`sp-badge ${fee.status === "Paid" ? "sp-badge-success" : "sp-badge-cedi"}`}>
                        {fee.status}
                      </span>
                    </td>
                    <td style={{ fontFamily: "JetBrains Mono", fontSize: "12px", color: "#cbd5e1" }}>
                      {fee.receipt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: HOMEWORK & PROJECTS */}
      {activeTab === "assignments" && (
        <div className="sp-card">
          <div className="sp-card-header">
            <h2 className="sp-card-title">
              <span>📁</span> Assignments & Coursework Deadlines
            </h2>
            <button
              type="button"
              className="sp-nav-btn sp-nav-btn-highlight"
              onClick={() => showToast("Opening Homework Submission Portal...")}
            >
              📤 Submit Assignment File
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="sp-table">
              <thead>
                <tr>
                  <th>Assignment ID</th>
                  <th>Subject</th>
                  <th>Assignment Title</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th>Score</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {STUDENT_ASSIGNMENTS.map((asn) => (
                  <tr key={asn.id}>
                    <td style={{ fontFamily: "JetBrains Mono", color: "#38bdf8" }}>{asn.id}</td>
                    <td><strong>{asn.subject}</strong></td>
                    <td>{asn.title}</td>
                    <td style={{ color: "#fbbf24" }}>{asn.dueDate}</td>
                    <td>
                      <span className={`sp-badge ${asn.status === "Submitted" ? "sp-badge-success" : "sp-badge-cedi"}`}>
                        {asn.status}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, color: "#34d399" }}>{asn.grade}</td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        type="button"
                        className="sp-nav-btn"
                        style={{ padding: "4px 8px", fontSize: "11px" }}
                        onClick={() => showToast(`Viewing instructions for ${asn.title}`)}
                      >
                        Details
                      </button>
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

export default StudentPortal;
