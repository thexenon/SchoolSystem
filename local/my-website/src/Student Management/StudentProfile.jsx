import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./StudentList.css";
import "./StudentProfile.css";
import "../School Administration/SchoolDashboard.css";
import { getStudents, getStudentById } from "./studentData";
import { getActiveSchoolAdmin } from "../Platform Administration/schoolAdminAuth";

const SAMPLE_RESULTS = [
  { subject: "Advanced Mathematics", code: "MTH-301", score: 96, grade: "A+", gpa: "4.00", remark: "Outstanding" },
  { subject: "Physics & Lab Work", code: "PHY-301", score: 92, grade: "A-", gpa: "3.70", remark: "Excellent" },
  { subject: "Chemistry & Biotech", code: "CHM-301", score: 94, grade: "A", gpa: "3.90", remark: "Exceptional" },
  { subject: "English Literature", code: "ENG-201", score: 89, grade: "B+", gpa: "3.30", remark: "Very Good" },
  { subject: "World History & Civics", code: "HIS-101", score: 91, grade: "A-", gpa: "3.70", remark: "Excellent" },
];

const SAMPLE_FEES = [
  { id: "INV-2026-081", title: "Academic Year Tuition - Term 1", amount: "GH₵3,450.00", dueDate: "Sep 15, 2026", status: "Paid", paidAt: "Sep 12, 2026 via MTN MoMo" },
  { id: "INV-2026-082", title: "STEM Technology & Lab Pass", amount: "GH₵350.00", dueDate: "Oct 01, 2026", status: "Paid", paidAt: "Sep 28, 2026 via Telecel Cash" },
  { id: "INV-2026-083", title: "Athletics & Campus Facilities", amount: "GH₵200.00", dueDate: "Nov 15, 2026", status: "Paid", paidAt: "Nov 02, 2026 via GCB Bank" },
];

function StudentProfile({ onNavigate }) {
  const activeAdmin = getActiveSchoolAdmin();
  const schoolName = activeAdmin?.schoolName || "St. Mary International Academy";

  const selectedId = localStorage.getItem("selected_student_id") || "STU-2026-001";
  const student = getStudentById(selectedId);

  const [activeTab, setActiveTab] = useState("overview");
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const navigateTo = (screen, studentId) => {
    if (studentId) {
      localStorage.setItem("selected_student_id", studentId);
    }
    if (onNavigate) onNavigate(screen);
  };

  return (
    <div className="stm-page-wrapper">
      {/* Student Management Nav */}
      <nav className="student-nav-bar">
        <div className="student-brand">
          <div className="student-logo-badge">🎓</div>
          <div>
            <div style={{ fontSize: "15px", fontWeight: 700, color: "#ffffff" }}>{schoolName}</div>
            <div style={{ fontSize: "11px", color: "#94a3b8" }}>Student 360° Comprehensive Profile</div>
          </div>
        </div>

        <div className="student-menu-links">
          <button type="button" className="student-menu-item" onClick={() => navigateTo("student-list")}>
            📋 Student List
          </button>
          <button type="button" className="student-menu-item" onClick={() => navigateTo("register-student")}>
            ➕ Register Student
          </button>
          <button type="button" className="student-menu-item" onClick={() => navigateTo("student-enrollment")}>
            🎓 Enrollment
          </button>
          <button type="button" className="student-menu-item" onClick={() => navigateTo("student-promotion")}>
            🚀 Promotion
          </button>
          <button type="button" className="student-menu-item" onClick={() => navigateTo("student-transfer")}>
            🔄 Transfer
          </button>
          <button type="button" className="student-menu-item" onClick={() => navigateTo("student-withdrawal")}>
            🚪 Withdrawal
          </button>
          <button type="button" className="student-menu-item" onClick={() => navigateTo("guardian-management")}>
            👨‍👩‍👧 Guardians
          </button>
          <button type="button" className="student-menu-item" onClick={() => navigateTo("student-id-cards")}>
            🪪 ID Cards
          </button>
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button type="button" className="school-nav-btn" onClick={() => navigateTo("student-list")}>
            ← Back to List
          </button>
          <Link to="/" className="school-nav-btn">
            ← Hub
          </Link>
        </div>
      </nav>

      {toastMessage && (
        <div style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.4)", color: "#10b981", padding: "12px 18px", borderRadius: "10px", marginBottom: "20px", fontWeight: 600 }}>
          {toastMessage}
        </div>
      )}

      {/* Top Student Header Banner */}
      <div className="sprof-header-banner">
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div className="sprof-avatar">
            {student.firstName[0]}{student.lastName[0]}
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <h1 style={{ fontSize: "24px", fontWeight: 800, margin: 0, color: "#ffffff" }}>
                {student.fullName}
              </h1>
              <span className="cm-campus-code">{student.id}</span>
              <span className={`sch-badge ${student.status === "Enrolled" ? "sch-badge-success" : "sch-badge-warning"}`}>
                {student.status}
              </span>
            </div>
            <p style={{ margin: "6px 0 0", color: "#94a3b8", fontSize: "14px" }}>
              {student.grade} • {student.section} • Roll: {student.rollNumber} • Campus: <strong>{student.campus}</strong>
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            type="button"
            className="school-nav-btn"
            onClick={() => navigateTo("student-id-cards", student.id)}
          >
            🪪 Print ID Card
          </button>
          <button
            type="button"
            className="school-nav-btn school-nav-btn-highlight"
            onClick={() => navigateTo("edit-student", student.id)}
          >
            ✏️ Edit Student Info
          </button>
        </div>
      </div>

      {/* Profile Section Tabs */}
      <div className="sprof-tabs">
        <button
          type="button"
          className={`sprof-tab ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          👤 Personal & Guardians
        </button>
        <button
          type="button"
          className={`sprof-tab ${activeTab === "attendance" ? "active" : ""}`}
          onClick={() => setActiveTab("attendance")}
        >
          📋 Attendance Logs ({student.attendancePct}%)
        </button>
        <button
          type="button"
          className={`sprof-tab ${activeTab === "results" ? "active" : ""}`}
          onClick={() => setActiveTab("results")}
        >
          📝 Examination Results & GPA ({student.gpa})
        </button>
        <button
          type="button"
          className={`sprof-tab ${activeTab === "fees" ? "active" : ""}`}
          onClick={() => setActiveTab("fees")}
        >
          💳 Fee Statements ({student.feesStatus})
        </button>
      </div>

      {/* Tab 1: Personal & Guardians */}
      {activeTab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          <div className="rs-card">
            <h2 className="rs-section-title">
              <span>👤</span> Personal & Medical Information
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#94a3b8" }}>Date of Birth:</span>
                <strong>{student.dob}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#94a3b8" }}>Gender:</span>
                <strong>{student.gender}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#94a3b8" }}>Blood Group:</span>
                <strong style={{ color: "#f87171" }}>{student.bloodGroup}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#94a3b8" }}>Allergies / Conditions:</span>
                <span>{student.allergies}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#94a3b8" }}>Official Student Email:</span>
                <span style={{ fontFamily: "JetBrains Mono, monospace", color: "#38bdf8" }}>{student.email}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#94a3b8" }}>Home Address:</span>
                <span>{student.address}</span>
              </div>
            </div>
          </div>

          <div className="rs-card">
            <h2 className="rs-section-title">
              <span>👨‍👩‍👧</span> Linked Parents & Guardians
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {student.guardians.map((g, idx) => (
                <div key={idx} style={{ background: "rgba(11, 16, 28, 0.8)", padding: "14px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong style={{ color: "#ffffff", fontSize: "14px" }}>{g.name}</strong>
                    <span className="sch-badge sch-badge-info">{g.relation}</span>
                  </div>
                  <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "6px" }}>
                    📞 {g.phone} • ✉️ {g.email}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Attendance */}
      {activeTab === "attendance" && (
        <div className="rs-card">
          <h2 className="rs-section-title">
            <span>📋</span> Academic Attendance Metrics
          </h2>
          <div className="sch-kpi-grid">
            <div className="sch-kpi-card">
              <div className="sch-kpi-label">Cumulative Attendance</div>
              <div className="sch-kpi-val" style={{ color: "#34d399" }}>{student.attendancePct}%</div>
              <div className="sch-kpi-sub">Exceeds 85% requirement</div>
            </div>
            <div className="sch-kpi-card">
              <div className="sch-kpi-label">Days Present</div>
              <div className="sch-kpi-val">74 Days</div>
              <div className="sch-kpi-sub">Term 1 Autumn session</div>
            </div>
            <div className="sch-kpi-card">
              <div className="sch-kpi-label">Excused Medical Absences</div>
              <div className="sch-kpi-val" style={{ color: "#fbbf24" }}>1 Day</div>
              <div className="sch-kpi-sub">Doctor note submitted</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Results & GPA */}
      {activeTab === "results" && (
        <div className="rs-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 className="rs-section-title" style={{ margin: 0 }}>
              <span>📝</span> Term 1 Assessment Report Card
            </h2>
            <div style={{ fontSize: "14px", color: "#38bdf8", fontWeight: 700 }}>
              Term GPA: {student.gpa} / 4.00
            </div>
          </div>

          <table className="sch-table">
            <thead>
              <tr>
                <th>Subject & Course Code</th>
                <th>Exam Marks (%)</th>
                <th>Letter Grade</th>
                <th>Grade Point (GPA)</th>
                <th>Faculty Remarks</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_RESULTS.map((res, idx) => (
                <tr key={idx}>
                  <td>
                    <strong>{res.subject}</strong>
                    <div style={{ fontSize: "11px", color: "#818cf8" }}>{res.code}</div>
                  </td>
                  <td><strong>{res.score}%</strong></td>
                  <td><span className="sch-badge sch-badge-info">{res.grade}</span></td>
                  <td style={{ fontFamily: "JetBrains Mono, monospace", color: "#38bdf8" }}>{res.gpa}</td>
                  <td style={{ color: "#cbd5e1" }}>{res.remark}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 4: Fees */}
      {activeTab === "fees" && (
        <div className="rs-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 className="rs-section-title" style={{ margin: 0 }}>
              <span>💳</span> Tuition Fees & Billing History
            </h2>
            <div style={{ fontSize: "14px", color: "#34d399", fontWeight: 700 }}>
              Outstanding Balance: {student.feesBalance}
            </div>
          </div>

          <table className="sch-table">
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Fee Description</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Receipt Details</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_FEES.map((fee) => (
                <tr key={fee.id}>
                  <td style={{ fontFamily: "JetBrains Mono, monospace", color: "#818cf8" }}>{fee.id}</td>
                  <td><strong>{fee.title}</strong></td>
                  <td style={{ fontWeight: 700, color: "#34d399" }}>{fee.amount}</td>
                  <td style={{ color: "#94a3b8" }}>{fee.dueDate}</td>
                  <td><span className="sch-badge sch-badge-success">{fee.status}</span></td>
                  <td style={{ fontSize: "12px", color: "#cbd5e1" }}>{fee.paidAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default StudentProfile;
