import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./StudentList.css";
import "../School Administration/SchoolDashboard.css";
import { getStudents, saveStudents } from "./studentData";
import {
  getActiveSchoolAdmin,
  getSchoolAdmins,
  switchActiveSchool,
  isPlatformAdminAuthenticated,
} from "../Platform Administration/schoolAdminAuth";

function StudentList({ onNavigate }) {
  const [activeAdmin, setActiveAdmin] = useState(() => getActiveSchoolAdmin());
  const allSchoolAdmins = getSchoolAdmins();
  const isPlatformBoss = isPlatformAdminAuthenticated();

  const [selectedSchoolId, setSelectedSchoolId] = useState(
    () => activeAdmin?.schoolId || "SCH-001"
  );
  const [students, setStudents] = useState(() => getStudents(selectedSchoolId));
  const [searchQuery, setSearchQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const cur = getActiveSchoolAdmin();
    setActiveAdmin(cur);
    if (cur) {
      setSelectedSchoolId(cur.schoolId);
      setStudents(getStudents(cur.schoolId));
    }
  }, []);

  const schoolName = activeAdmin?.schoolName || "St. Mary International Academy";

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSchoolChange = (newSchoolId) => {
    setSelectedSchoolId(newSchoolId);
    if (newSchoolId !== "ALL") {
      const switched = switchActiveSchool(newSchoolId);
      setActiveAdmin(switched);
    }
    setStudents(getStudents(newSchoolId));
    showToast(`Loaded students for ${newSchoolId === "ALL" ? "All Schools (Multi-Tenant)" : newSchoolId}!`);
  };

  const navigateTo = (screen, studentId) => {
    if (studentId) {
      localStorage.setItem("selected_student_id", studentId);
    }
    if (onNavigate) onNavigate(screen);
  };

  const filtered = students.filter((s) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      s.fullName.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.rollNumber.toLowerCase().includes(q) ||
      (s.schoolName && s.schoolName.toLowerCase().includes(q));
    const matchGrade = gradeFilter === "All" || s.grade === gradeFilter;
    const matchStatus = statusFilter === "All" || s.status === statusFilter;
    return matchSearch && matchGrade && matchStatus;
  });

  return (
    <div className="stm-page-wrapper">
      {/* Toast */}
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
        <div className="sch-boss-supervision-bar" style={{ marginBottom: "20px" }}>
          <div className="sch-boss-brand">
            <span className="sch-boss-badge">👑 Platform Super Admin</span>
            <div>
              <div className="sch-boss-title">Multi-School Student Inspection Mode</div>
              <div style={{ fontSize: "11px", color: "#cbd5e1" }}>
                Inspecting student registry across registered schools
              </div>
            </div>
          </div>

          <div className="sch-boss-controls">
            <label style={{ fontSize: "12px", color: "#fef08a", fontWeight: 700 }}>
              Viewing School:
            </label>
            <select
              className="sch-boss-select"
              value={selectedSchoolId}
              onChange={(e) => handleSchoolChange(e.target.value)}
            >
              <option value="ALL">🌐 All Schools (Global Directory)</option>
              {allSchoolAdmins.map((a) => (
                <option key={a.id} value={a.schoolId}>
                  {a.schoolName} ({a.schoolCode})
                </option>
              ))}
            </select>

            <button
              type="button"
              className="sch-boss-btn sch-boss-btn-gold"
              onClick={() => navigateTo("school-dashboard")}
              title="Return to this school's operational dashboard"
            >
              📊 School Dashboard →
            </button>

            <button
              type="button"
              className="sch-boss-btn"
              onClick={() => navigateTo("platform-dashboard")}
              title="Return to the Multi-School Platform Hub"
            >
              🌐 Platform Hub →
            </button>
          </div>
        </div>
      )}

      {/* Student Management Nav */}
      <nav className="student-nav-bar">
        <div className="student-brand">
          <div className="student-logo-badge">🎓</div>
          <div>
            <div style={{ fontSize: "15px", fontWeight: 700, color: "#ffffff" }}>
              {selectedSchoolId === "ALL" ? "All Schools Directory" : schoolName}
            </div>
            <div style={{ fontSize: "11px", color: "#94a3b8" }}>Student Records & Academic Registry</div>
          </div>
        </div>

        <div className="student-menu-links">
          <button type="button" className="student-menu-item active" onClick={() => navigateTo("student-list")}>
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
          <button type="button" className="student-menu-item" onClick={() => navigateTo("student-import")}>
            📥 Import CSV
          </button>
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button
            type="button"
            className="school-nav-btn school-nav-btn-highlight"
            onClick={() => navigateTo("school-dashboard")}
            title="School Administration Hub"
          >
            🏫 School Admin
          </button>
          {isPlatformBoss && (
            <button
              type="button"
              className="school-nav-btn"
              onClick={() => navigateTo("platform-dashboard")}
              title="Platform Super Admin"
            >
              👑 Platform Boss
            </button>
          )}
          <Link to="/" className="school-nav-btn">
            ← Hub
          </Link>
        </div>
      </nav>

      {/* Header */}
      <div className="sch-header">
        <div>
          <h1 className="sch-title">
            {selectedSchoolId === "ALL" ? "All Schools Student Directory" : `${schoolName} Student Directory`}
          </h1>
          <p className="sch-subtitle">
            Displays enrolled students with real-time searching, grade filtering, GPA rankings, and student profile inspection
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="button"
            className="school-nav-btn"
            onClick={() => navigateTo("student-import")}
          >
            📥 Import Students
          </button>
          <button
            type="button"
            className="school-nav-btn school-nav-btn-highlight"
            onClick={() => navigateTo("register-student")}
          >
            ➕ Register New Student
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="stm-filter-bar">
        <input
          type="text"
          className="stm-search-input"
          placeholder="🔍 Search students by name, ID (e.g. STU-SMIA-001), school, email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {isPlatformBoss && (
          <select
            className="stm-select"
            value={selectedSchoolId}
            onChange={(e) => handleSchoolChange(e.target.value)}
            style={{ borderColor: "#eab308" }}
          >
            <option value="ALL">🌐 All Schools</option>
            {allSchoolAdmins.map((a) => (
              <option key={a.id} value={a.schoolId}>
                {a.schoolName}
              </option>
            ))}
          </select>
        )}

        <select
          className="stm-select"
          value={gradeFilter}
          onChange={(e) => setGradeFilter(e.target.value)}
        >
          <option value="All">All Grades</option>
          <option value="Grade 9">Grade 9</option>
          <option value="Grade 10">Grade 10</option>
          <option value="Grade 11">Grade 11</option>
          <option value="Grade 12">Grade 12</option>
        </select>

        <select
          className="stm-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Enrolled">Enrolled</option>
          <option value="Pending Transfer">Pending Transfer</option>
          <option value="Withdrawn">Withdrawn</option>
        </select>

        <div style={{ marginLeft: "auto", fontSize: "13px", color: "#94a3b8" }}>
          Showing <strong>{filtered.length}</strong> of <strong>{students.length}</strong> students
        </div>
      </div>

      {/* Students Table */}
      <div className="stm-table-container">
        <table className="sch-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Student Name</th>
              {selectedSchoolId === "ALL" && <th>School Institution</th>}
              <th>Grade & Section</th>
              <th>Campus</th>
              <th>Attendance</th>
              <th>GPA</th>
              <th>Fee Status</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={selectedSchoolId === "ALL" ? 10 : 9} style={{ textAlign: "center", padding: "30px", color: "#94a3b8" }}>
                  No students found matching your search query.
                </td>
              </tr>
            ) : (
              filtered.map((s) => (
                <tr key={s.id}>
                  <td>
                    <span style={{ fontFamily: "JetBrains Mono, monospace", color: "#818cf8", fontWeight: 700 }}>
                      {s.id}
                    </span>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>Roll: {s.rollNumber}</div>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div className="stm-avatar">
                        {s.firstName ? s.firstName[0] : "S"}{s.lastName ? s.lastName[0] : "T"}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: "#ffffff" }}>{s.fullName}</div>
                        <div style={{ fontSize: "11px", color: "#94a3b8" }}>{s.email}</div>
                      </div>
                    </div>
                  </td>
                  {selectedSchoolId === "ALL" && (
                    <td>
                      <span className="sch-badge sch-badge-info" style={{ fontSize: "11px" }}>
                        {s.schoolName || s.schoolId}
                      </span>
                    </td>
                  )}
                  <td>
                    <div><strong>{s.grade}</strong></div>
                    <div style={{ fontSize: "11px", color: "#94a3b8" }}>{s.section}</div>
                  </td>
                  <td>{s.campus}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div className="stm-progress-track">
                        <div
                          className="stm-progress-fill"
                          style={{
                            width: `${s.attendancePct}%`,
                            background: s.attendancePct >= 95 ? "#10b981" : s.attendancePct >= 90 ? "#38bdf8" : "#f59e0b",
                          }}
                        />
                      </div>
                      <span style={{ fontSize: "12px", fontWeight: 600 }}>{s.attendancePct}%</span>
                    </div>
                  </td>
                  <td>
                    <span className="stm-gpa-badge">{s.gpa}</span>
                  </td>
                  <td>
                    <span
                      className={`sch-badge ${
                        s.feesStatus === "Paid"
                          ? "sch-badge-success"
                          : s.feesStatus === "Partial"
                          ? "sch-badge-warning"
                          : "sch-badge-danger"
                      }`}
                    >
                      {s.feesStatus} ({s.feesBalance})
                    </span>
                  </td>
                  <td>
                    <span
                      className={`sch-badge ${
                        s.status === "Enrolled"
                          ? "sch-badge-success"
                          : s.status === "Withdrawn"
                          ? "sch-badge-danger"
                          : "sch-badge-warning"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: "6px" }}>
                      <button
                        type="button"
                        className="stm-action-btn"
                        onClick={() => navigateTo("student-profile", s.id)}
                        title="View Full Profile"
                      >
                        👁️ View
                      </button>
                      <button
                        type="button"
                        className="stm-action-btn"
                        onClick={() => navigateTo("edit-student", s.id)}
                        title="Edit Student"
                      >
                        ✏️ Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentList;
