import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./StudentList.css";
import "./RegisterStudent.css";
import "./EditStudent.css";
import "../School Administration/SchoolDashboard.css";
import { getStudents, saveStudents, getStudentById } from "./studentData";
import { getActiveSchoolAdmin } from "../Platform Administration/schoolAdminAuth";

function EditStudent({ onNavigate }) {
  const activeAdmin = getActiveSchoolAdmin();
  const schoolName = activeAdmin?.schoolName || "St. Mary International Academy";

  const allStudents = getStudents();
  const [selectedId, setSelectedId] = useState(
    () => localStorage.getItem("selected_student_id") || allStudents[0]?.id || "STU-2026-001"
  );

  const currentStudent = allStudents.find((s) => s.id === selectedId) || allStudents[0];

  const [form, setForm] = useState({
    firstName: currentStudent.firstName,
    lastName: currentStudent.lastName,
    grade: currentStudent.grade,
    section: currentStudent.section,
    campus: currentStudent.campus,
    rollNumber: currentStudent.rollNumber,
    status: currentStudent.status,
    bloodGroup: currentStudent.bloodGroup,
    allergies: currentStudent.allergies,
    email: currentStudent.email,
    phone: currentStudent.phone,
    address: currentStudent.address,
  });

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleStudentSelect = (id) => {
    setSelectedId(id);
    localStorage.setItem("selected_student_id", id);
    const target = allStudents.find((s) => s.id === id);
    if (target) {
      setForm({
        firstName: target.firstName,
        lastName: target.lastName,
        grade: target.grade,
        section: target.section,
        campus: target.campus,
        rollNumber: target.rollNumber,
        status: target.status,
        bloodGroup: target.bloodGroup,
        allergies: target.allergies,
        email: target.email,
        phone: target.phone,
        address: target.address,
      });
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const updatedList = allStudents.map((s) => {
      if (s.id === selectedId) {
        return {
          ...s,
          firstName: form.firstName,
          lastName: form.lastName,
          fullName: `${form.firstName} ${form.lastName}`,
          grade: form.grade,
          section: form.section,
          campus: form.campus,
          rollNumber: form.rollNumber,
          status: form.status,
          bloodGroup: form.bloodGroup,
          allergies: form.allergies,
          email: form.email,
          phone: form.phone,
          address: form.address,
        };
      }
      return s;
    });

    saveStudents(updatedList);
    showToast(`✓ Updated profile record for ${form.firstName} ${form.lastName} (${selectedId})!`);
  };

  const navigateTo = (screen, studentId) => {
    if (studentId) {
      localStorage.setItem("selected_student_id", studentId);
    }
    if (onNavigate) onNavigate(screen);
  };

  return (
    <div className="stm-page-wrapper">
      {/* Student Nav */}
      <nav className="student-nav-bar">
        <div className="student-brand">
          <div className="student-logo-badge">✏️</div>
          <div>
            <div style={{ fontSize: "15px", fontWeight: 700, color: "#ffffff" }}>{schoolName}</div>
            <div style={{ fontSize: "11px", color: "#94a3b8" }}>Student Record Modification</div>
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

      {/* Header */}
      <div className="sch-header">
        <div>
          <h1 className="sch-title">Edit Student Information</h1>
          <p className="sch-subtitle">
            Modify personal profiles, campus assignments, status, and contact credentials
          </p>
        </div>
      </div>

      {toastMessage && (
        <div style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.4)", color: "#10b981", padding: "12px 18px", borderRadius: "10px", marginBottom: "20px", fontWeight: 600 }}>
          {toastMessage}
        </div>
      )}

      {/* Student Switcher Banner */}
      <div className="es-banner">
        <div>
          <label className="sp-form-label" style={{ marginBottom: "6px", display: "block" }}>
            Select Student Record to Edit:
          </label>
          <select
            className="sp-form-input"
            value={selectedId}
            onChange={(e) => handleStudentSelect(e.target.value)}
            style={{ width: "320px", cursor: "pointer" }}
          >
            {allStudents.map((s) => (
              <option key={s.id} value={s.id}>
                {s.fullName} ({s.id} - {s.grade})
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="school-nav-btn school-nav-btn-highlight"
          onClick={() => navigateTo("student-profile", selectedId)}
        >
          View Full Profile →
        </button>
      </div>

      <form onSubmit={handleSave}>
        <div className="rs-card">
          <h2 className="rs-section-title">
            <span>👤</span> Personal & Medical Information
          </h2>
          <div className="rs-grid-3">
            <div>
              <label className="sp-form-label">First Name</label>
              <input
                type="text"
                required
                className="sp-form-input"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              />
            </div>
            <div>
              <label className="sp-form-label">Last Name</label>
              <input
                type="text"
                required
                className="sp-form-input"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
            </div>
            <div>
              <label className="sp-form-label">Blood Group</label>
              <select
                className="sp-form-input"
                value={form.bloodGroup}
                onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
              >
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
              </select>
            </div>
            <div>
              <label className="sp-form-label">Student Email</label>
              <input
                type="email"
                className="sp-form-input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="sp-form-label">Contact Phone</label>
              <input
                type="tel"
                className="sp-form-input"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="sp-form-label">Allergies / Medical Notes</label>
              <input
                type="text"
                className="sp-form-input"
                value={form.allergies}
                onChange={(e) => setForm({ ...form, allergies: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="rs-card">
          <h2 className="rs-section-title">
            <span>🎓</span> Academic Placement & Enrollment Status
          </h2>
          <div className="rs-grid-3">
            <div>
              <label className="sp-form-label">Grade</label>
              <select
                className="sp-form-input"
                value={form.grade}
                onChange={(e) => setForm({ ...form, grade: e.target.value })}
              >
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
              </select>
            </div>
            <div>
              <label className="sp-form-label">Class Section</label>
              <input
                type="text"
                className="sp-form-input"
                value={form.section}
                onChange={(e) => setForm({ ...form, section: e.target.value })}
              />
            </div>
            <div>
              <label className="sp-form-label">Campus Branch</label>
              <select
                className="sp-form-input"
                value={form.campus}
                onChange={(e) => setForm({ ...form, campus: e.target.value })}
              >
                <option value="Kensington Central Campus">Kensington Central Campus</option>
                <option value="Chelsea STEM & Innovation Annex">Chelsea STEM & Innovation Annex</option>
                <option value="Battersea Junior Preparatory Wing">Battersea Junior Preparatory Wing</option>
              </select>
            </div>
            <div>
              <label className="sp-form-label">Roll Number</label>
              <input
                type="text"
                className="sp-form-input"
                value={form.rollNumber}
                onChange={(e) => setForm({ ...form, rollNumber: e.target.value })}
              />
            </div>
            <div>
              <label className="sp-form-label">Enrollment Status</label>
              <select
                className="sp-form-input"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="Enrolled">Enrolled</option>
                <option value="Pending Transfer">Pending Transfer</option>
                <option value="Withdrawn">Withdrawn</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
            <div>
              <label className="sp-form-label">Residential Address</label>
              <input
                type="text"
                className="sp-form-input"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginBottom: "40px" }}>
          <button type="button" className="school-nav-btn" onClick={() => navigateTo("student-list")}>
            Cancel
          </button>
          <button type="submit" className="school-nav-btn school-nav-btn-highlight" style={{ padding: "12px 28px", fontSize: "14px" }}>
            💾 Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditStudent;
