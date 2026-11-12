import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./StudentList.css";
import "./RegisterStudent.css";
import "../School Administration/SchoolDashboard.css";
import { getStudents, saveStudents } from "./studentData";
import { getActiveSchoolAdmin } from "../Platform Administration/schoolAdminAuth";

function RegisterStudent({ onNavigate }) {
  const activeAdmin = getActiveSchoolAdmin();
  const schoolName = activeAdmin?.schoolName || "St. Mary International Academy";

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dob: "2010-05-15",
    gender: "Female",
    bloodGroup: "O+",
    allergies: "None",
    grade: "Grade 10",
    section: "10-A (General Academic)",
    campus: "Kensington Central Campus",
    rollNumber: "10A-35",
    guardianName: "",
    guardianRelation: "Mother",
    guardianPhone: "",
    guardianEmail: "",
    address: "",
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName) return;

    const currentList = getStudents();
    const newId = `STU-2026-${String(currentList.length + 1).padStart(3, "0")}`;
    const generatedEmail = `${form.firstName[0].toLowerCase()}.${form.lastName.toLowerCase()}@student.school.edu`;

    const newStudent = {
      id: newId,
      firstName: form.firstName,
      lastName: form.lastName,
      fullName: `${form.firstName} ${form.lastName}`,
      gender: form.gender,
      dob: form.dob,
      grade: form.grade,
      section: form.section,
      campus: form.campus,
      status: "Enrolled",
      rollNumber: form.rollNumber,
      academicYear: "2026 - 2027",
      gpa: "0.00 (New)",
      attendancePct: 100,
      feesStatus: "Pending",
      feesBalance: "GH₵3,450.00",
      email: generatedEmail,
      phone: form.guardianPhone || "+44 7700 900000",
      address: form.address || "London, United Kingdom",
      guardians: [
        {
          name: form.guardianName || `Guardian of ${form.firstName}`,
          relation: form.guardianRelation,
          phone: form.guardianPhone || "+44 7700 900000",
          email: form.guardianEmail || "parent@family.com",
          isPrimary: true,
        },
      ],
      enrolledDate: "Today",
      bloodGroup: form.bloodGroup,
      allergies: form.allergies,
    };

    saveStudents([newStudent, ...currentList]);
    localStorage.setItem("selected_student_id", newId);
    showToast(`✓ Registered ${newStudent.fullName} (${newStudent.id}) successfully!`);

    setTimeout(() => {
      navigateTo("student-profile", newId);
    }, 1200);
  };

  return (
    <div className="stm-page-wrapper">
      {/* Student Management Nav */}
      <nav className="student-nav-bar">
        <div className="student-brand">
          <div className="student-logo-badge">➕</div>
          <div>
            <div style={{ fontSize: "15px", fontWeight: 700, color: "#ffffff" }}>{schoolName}</div>
            <div style={{ fontSize: "11px", color: "#94a3b8" }}>New Student Onboarding & Admissions</div>
          </div>
        </div>

        <div className="student-menu-links">
          <button type="button" className="student-menu-item" onClick={() => navigateTo("student-list")}>
            📋 Student List
          </button>
          <button type="button" className="student-menu-item active" onClick={() => navigateTo("register-student")}>
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
          <button type="button" className="school-nav-btn school-nav-btn-highlight" onClick={() => navigateTo("school-dashboard")}>
            🏫 School Admin
          </button>
          <Link to="/" className="school-nav-btn">
            ← Hub
          </Link>
        </div>
      </nav>

      {/* Header */}
      <div className="sch-header">
        <div>
          <h1 className="sch-title">New Student Admission & Registration</h1>
          <p className="sch-subtitle">
            Record a new student's personal background, academic placement, guardian contact, and medical records
          </p>
        </div>
      </div>

      {toastMessage && (
        <div style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.4)", color: "#10b981", padding: "12px 18px", borderRadius: "10px", marginBottom: "20px", fontWeight: 600 }}>
          {toastMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Section 1: Personal Details */}
        <div className="rs-card">
          <h2 className="rs-section-title">
            <span>👤</span> 1. Personal & Identity Information
          </h2>
          <div className="rs-grid-3">
            <div>
              <label className="sp-form-label">First Name *</label>
              <input
                type="text"
                required
                className="sp-form-input"
                placeholder="e.g. Amelia"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              />
            </div>

            <div>
              <label className="sp-form-label">Last Name *</label>
              <input
                type="text"
                required
                className="sp-form-input"
                placeholder="e.g. Watson"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
            </div>

            <div>
              <label className="sp-form-label">Date of Birth *</label>
              <input
                type="date"
                required
                className="sp-form-input"
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
              />
            </div>

            <div>
              <label className="sp-form-label">Gender</label>
              <select
                className="sp-form-input"
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Non-Binary">Non-Binary</option>
              </select>
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
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div>
              <label className="sp-form-label">Medical / Allergies Note</label>
              <input
                type="text"
                className="sp-form-input"
                placeholder="e.g. Asthma, Penicillin allergy"
                value={form.allergies}
                onChange={(e) => setForm({ ...form, allergies: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Academic Placement */}
        <div className="rs-card">
          <h2 className="rs-section-title">
            <span>🎓</span> 2. Academic Placement & Campus Selection
          </h2>
          <div className="rs-grid-3">
            <div>
              <label className="sp-form-label">Assigned Grade *</label>
              <select
                className="sp-form-input"
                value={form.grade}
                onChange={(e) => setForm({ ...form, grade: e.target.value })}
              >
                <option value="Grade 9">Grade 9 (Freshman)</option>
                <option value="Grade 10">Grade 10 (Sophomore)</option>
                <option value="Grade 11">Grade 11 (Junior High)</option>
                <option value="Grade 12">Grade 12 (Senior High)</option>
              </select>
            </div>

            <div>
              <label className="sp-form-label">Class Section / Stream *</label>
              <input
                type="text"
                required
                className="sp-form-input"
                placeholder="e.g. 10-A (General Academic)"
                value={form.section}
                onChange={(e) => setForm({ ...form, section: e.target.value })}
              />
            </div>

            <div>
              <label className="sp-form-label">Branch / Campus *</label>
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
          </div>
        </div>

        {/* Section 3: Guardian & Address */}
        <div className="rs-card">
          <h2 className="rs-section-title">
            <span>👨‍👩‍👧</span> 3. Primary Parent / Guardian Contact
          </h2>
          <div className="rs-grid-3">
            <div>
              <label className="sp-form-label">Guardian Full Name *</label>
              <input
                type="text"
                required
                className="sp-form-input"
                placeholder="e.g. Eleanor Watson"
                value={form.guardianName}
                onChange={(e) => setForm({ ...form, guardianName: e.target.value })}
              />
            </div>

            <div>
              <label className="sp-form-label">Relationship to Student</label>
              <select
                className="sp-form-input"
                value={form.guardianRelation}
                onChange={(e) => setForm({ ...form, guardianRelation: e.target.value })}
              >
                <option value="Mother">Mother</option>
                <option value="Father">Father</option>
                <option value="Legal Guardian">Legal Guardian</option>
                <option value="Grandparent">Grandparent</option>
              </select>
            </div>

            <div>
              <label className="sp-form-label">Guardian Mobile Phone *</label>
              <input
                type="tel"
                required
                className="sp-form-input"
                placeholder="e.g. +44 7700 900888"
                value={form.guardianPhone}
                onChange={(e) => setForm({ ...form, guardianPhone: e.target.value })}
              />
            </div>

            <div>
              <label className="sp-form-label">Guardian Email *</label>
              <input
                type="email"
                required
                className="sp-form-input"
                placeholder="e.g. parent@family.com"
                value={form.guardianEmail}
                onChange={(e) => setForm({ ...form, guardianEmail: e.target.value })}
              />
            </div>

            <div style={{ gridColumn: "span 2" }}>
              <label className="sp-form-label">Residential Address</label>
              <input
                type="text"
                className="sp-form-input"
                placeholder="e.g. 24 Kensington High St, London W8"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginBottom: "40px" }}>
          <button type="button" className="school-nav-btn" onClick={() => navigateTo("student-list")}>
            Cancel
          </button>
          <button type="submit" className="school-nav-btn school-nav-btn-highlight" style={{ padding: "12px 28px", fontSize: "14px" }}>
            ✓ Register Student & Issue ID
          </button>
        </div>
      </form>
    </div>
  );
}

export default RegisterStudent;
