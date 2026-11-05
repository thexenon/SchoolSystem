import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./StudentList.css";
import "./StudentEnrollment.css";
import "../School Administration/SchoolDashboard.css";
import { getStudents, saveStudents } from "./studentData";
import { getActiveSchoolAdmin } from "../Platform Administration/schoolAdminAuth";

const PROGRAMMES = [
  { id: "PROG-IB", name: "IB Diploma Programme", code: "IB-DP", targetGrade: "Grade 11 & 12", capacity: 60, enrolled: 52, icon: "🌍" },
  { id: "PROG-STEM", name: "STEM & Robotics Honours Track", code: "STEM-HON", targetGrade: "Grade 10 to 12", capacity: 45, enrolled: 41, icon: "🔬" },
  { id: "PROG-ARTS", name: "Creative Arts & Design Conservatory", code: "ARTS-CON", targetGrade: "Grade 9 to 12", capacity: 40, enrolled: 34, icon: "🎨" },
  { id: "PROG-GEN", name: "Standard College Preparatory", code: "PREP-CORE", targetGrade: "All Grades", capacity: 150, enrolled: 138, icon: "📚" },
];

function StudentEnrollment({ onNavigate }) {
  const activeAdmin = getActiveSchoolAdmin();
  const schoolName = activeAdmin?.schoolName || "St. Mary International Academy";

  const [students, setStudents] = useState(() => getStudents());
  const [selectedProg, setSelectedProg] = useState(PROGRAMMES[0].id);
  const [enrollStudentId, setEnrollStudentId] = useState("");
  const [selectedSection, setSelectedSection] = useState("Section A");
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const navigateTo = (screen) => {
    if (onNavigate) onNavigate(screen);
  };

  const handleEnrollSubmit = (e) => {
    e.preventDefault();
    if (!enrollStudentId) return;

    const progObj = PROGRAMMES.find((p) => p.id === selectedProg);
    const updated = students.map((s) => {
      if (s.id === enrollStudentId) {
        return {
          ...s,
          section: `${s.grade}-${selectedSection.slice(-1)} (${progObj?.name})`,
          status: "Enrolled",
        };
      }
      return s;
    });

    saveStudents(updated);
    setStudents(updated);
    const enrolledStudent = students.find((s) => s.id === enrollStudentId);
    showToast(`✓ Enrolled ${enrolledStudent?.fullName} into ${progObj?.name}!`);
    setEnrollStudentId("");
  };

  return (
    <div className="stm-page-wrapper">
      {/* Student Nav */}
      <nav className="student-nav-bar">
        <div className="student-brand">
          <div className="student-logo-badge">🎓</div>
          <div>
            <div style={{ fontSize: "15px", fontWeight: 700, color: "#ffffff" }}>{schoolName}</div>
            <div style={{ fontSize: "11px", color: "#94a3b8" }}>Class, Stream & Programme Enrollment</div>
          </div>
        </div>

        <div className="student-menu-links">
          <button type="button" className="student-menu-item" onClick={() => navigateTo("student-list")}>
            📋 Student List
          </button>
          <button type="button" className="student-menu-item" onClick={() => navigateTo("register-student")}>
            ➕ Register Student
          </button>
          <button type="button" className="student-menu-item active" onClick={() => navigateTo("student-enrollment")}>
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
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button type="button" className="school-nav-btn" onClick={() => navigateTo("student-list")}>
            ← Student List
          </button>
          <Link to="/" className="school-nav-btn">
            ← Hub
          </Link>
        </div>
      </nav>

      {/* Header */}
      <div className="sch-header">
        <div>
          <h1 className="sch-title">Student Class & Programme Enrollment</h1>
          <p className="sch-subtitle">
            Assign students to academic streams, specialized diploma programmes, and specific classroom sections
          </p>
        </div>
      </div>

      {toastMessage && (
        <div style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.4)", color: "#10b981", padding: "12px 18px", borderRadius: "10px", marginBottom: "20px", fontWeight: 600 }}>
          {toastMessage}
        </div>
      )}

      {/* Available Programmes */}
      <div className="se-prog-grid">
        {PROGRAMMES.map((prog) => {
          const isSel = selectedProg === prog.id;
          const pct = Math.round((prog.enrolled / prog.capacity) * 100);
          return (
            <div
              key={prog.id}
              className={`se-prog-card ${isSel ? "selected" : ""}`}
              onClick={() => setSelectedProg(prog.id)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <span style={{ fontSize: "22px" }}>{prog.icon}</span>
                  <h3 style={{ margin: "6px 0 2px 0", fontSize: "16px", color: "#ffffff" }}>{prog.name}</h3>
                  <span className="cm-campus-code">{prog.code}</span>
                </div>
                <span className={`sch-badge ${pct >= 90 ? "sch-badge-warning" : "sch-badge-success"}`}>
                  {pct}% Full
                </span>
              </div>
              <div style={{ marginTop: "12px", fontSize: "12px", color: "#94a3b8" }}>
                <div>Target: <strong>{prog.targetGrade}</strong></div>
                <div style={{ marginTop: "4px" }}>
                  Enrolled: <strong>{prog.enrolled} / {prog.capacity} students</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enrollment Action Box */}
      <div className="rs-card">
        <h2 className="rs-section-title">
          <span>➕</span> Enroll Student into Selected Programme
        </h2>
        <form onSubmit={handleEnrollSubmit} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: "14px", alignItems: "flex-end" }}>
          <div>
            <label className="sp-form-label">Select Student</label>
            <select
              className="sp-form-input"
              value={enrollStudentId}
              onChange={(e) => setEnrollStudentId(e.target.value)}
              required
            >
              <option value="">-- Choose Student to Enroll --</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.fullName} ({s.id} • {s.grade} • Current: {s.section})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="sp-form-label">Section</label>
            <select
              className="sp-form-input"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
            >
              <option value="Section A">Section A (Morning)</option>
              <option value="Section B">Section B (Afternoon)</option>
              <option value="Section C">Section C (Honours)</option>
            </select>
          </div>

          <div>
            <label className="sp-form-label">Effective Session</label>
            <input
              type="text"
              disabled
              className="sp-form-input"
              value="2026 - 2027 Academic Year"
            />
          </div>

          <button
            type="submit"
            className="school-nav-btn school-nav-btn-highlight"
            style={{ padding: "12px 24px" }}
          >
            ✓ Complete Enrollment
          </button>
        </form>
      </div>

      {/* Roster of Students in Active Programmes */}
      <div className="stm-table-container">
        <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: "15px", color: "#ffffff" }}>
            Current Student Placement & Section Registry
          </h3>
          <span style={{ fontSize: "12px", color: "#94a3b8" }}>{students.length} Total Enrolled</span>
        </div>
        <table className="sch-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Full Name</th>
              <th>Grade</th>
              <th>Current Programme & Section</th>
              <th>Campus</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id}>
                <td style={{ fontFamily: "JetBrains Mono, monospace", color: "#818cf8" }}>{s.id}</td>
                <td><strong>{s.fullName}</strong></td>
                <td>{s.grade}</td>
                <td style={{ color: "#38bdf8", fontWeight: 600 }}>{s.section}</td>
                <td>{s.campus.split(" ")[0]} Branch</td>
                <td>
                  <span className="sch-badge sch-badge-success">{s.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentEnrollment;
