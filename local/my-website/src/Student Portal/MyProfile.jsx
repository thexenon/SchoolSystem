import React, { useState, useEffect } from "react";
import StudentNav from "./StudentNav";
import { getActiveStudent } from "./studentPortalData";
import "./MyProfile.css";

export default function MyProfile() {
  const [student, setStudent] = useState(getActiveStudent());
  const [toast, setToast] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [correctionNote, setCorrectionNote] = useState("");

  useEffect(() => {
    const handleStudentChanged = (e) => {
      if (e.detail) setStudent(e.detail);
      else setStudent(getActiveStudent());
    };
    window.addEventListener("studentUserChanged", handleStudentChanged);
    return () => window.removeEventListener("studentUserChanged", handleStudentChanged);
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  const handlePrintDossier = () => {
    window.print();
  };

  const handleSubmitCorrection = (e) => {
    e.preventDefault();
    if (!correctionNote.trim()) return;
    setShowUpdateModal(false);
    setCorrectionNote("");
    showToast("Profile amendment ticket submitted to the Campus Registrar.");
  };

  return (
    <div className="mp-page-container">
      {toast && (
        <div className="mp-toast">
          <span>✓</span> {toast}
        </div>
      )}

      <StudentNav
        title="Student Personal & Enrollment Profile"
        subtitle="Official student demographic, academic enrollment, medical clearance, and guardian information"
        badge="Module 12 • Screen 2 of 10"
      />

      {/* Main Profile Header Card */}
      <div className="mp-header-card">
        <div className="mp-avatar-large">
          {student.firstName[0]}
          {student.lastName[0]}
        </div>

        <div className="mp-header-main">
          <div className="mp-tags-row">
            <span className="mp-tag-status">● Enrolled Active</span>
            <span className="mp-tag-house">🏛️ {student.house}</span>
            <span className="mp-tag-id">{student.id}</span>
          </div>
          <h1 className="mp-title-name">{student.fullName}</h1>
          <p className="mp-title-sub">
            {student.grade} • {student.section} • Roll #{student.rollNumber} • {student.campus}
          </p>
        </div>

        <div className="mp-header-actions">
          <button className="mp-btn-print" onClick={handlePrintDossier}>
            🖨️ Print Student Dossier
          </button>
          <button className="mp-btn-edit" onClick={() => setShowUpdateModal(true)}>
            ✏️ Request Update
          </button>
        </div>
      </div>

      {/* Profile Sections Grid */}
      <div className="mp-sections-grid">
        {/* Card 1: Academic & Enrollment Information */}
        <div className="mp-card">
          <div className="mp-card-title">
            <span>🎓</span> Academic & Enrollment Record
          </div>
          <div className="mp-info-list">
            <div className="mp-info-item">
              <span className="mp-info-label">Student Identification:</span>
              <strong className="mp-info-val font-mono">{student.id}</strong>
            </div>
            <div className="mp-info-item">
              <span className="mp-info-label">Academic Division:</span>
              <span className="mp-info-val">Senior High (Advanced Science)</span>
            </div>
            <div className="mp-info-item">
              <span className="mp-info-label">Current Grade & Stream:</span>
              <span className="mp-info-val">{student.grade} - {student.section}</span>
            </div>
            <div className="mp-info-item">
              <span className="mp-info-label">Class Roll Number:</span>
              <span className="mp-info-val">{student.rollNumber}</span>
            </div>
            <div className="mp-info-item">
              <span className="mp-info-label">Campus Facility:</span>
              <span className="mp-info-val">{student.campus}</span>
            </div>
            <div className="mp-info-item">
              <span className="mp-info-label">Academic Year:</span>
              <span className="mp-info-val">{student.academicYear}</span>
            </div>
            <div className="mp-info-item">
              <span className="mp-info-label">Form Tutor / Advisor:</span>
              <span className="mp-info-val">{student.classTutor}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Personal & Identity Information */}
        <div className="mp-card">
          <div className="mp-card-title">
            <span>👤</span> Personal & Demographic Identity
          </div>
          <div className="mp-info-list">
            <div className="mp-info-item">
              <span className="mp-info-label">Full Legal Name:</span>
              <strong className="mp-info-val">{student.fullName}</strong>
            </div>
            <div className="mp-info-item">
              <span className="mp-info-label">Date of Birth:</span>
              <span className="mp-info-val">{student.dob}</span>
            </div>
            <div className="mp-info-item">
              <span className="mp-info-label">Gender:</span>
              <span className="mp-info-val">{student.gender}</span>
            </div>
            <div className="mp-info-item">
              <span className="mp-info-label">National ID (Ghana Card):</span>
              <span className="mp-info-val font-mono">{student.nationalId}</span>
            </div>
            <div className="mp-info-item">
              <span className="mp-info-label">House Affiliation:</span>
              <span className="mp-info-val">{student.house}</span>
            </div>
            <div className="mp-info-item">
              <span className="mp-info-label">Primary Language:</span>
              <span className="mp-info-val">English / French (Bilingual)</span>
            </div>
          </div>
        </div>

        {/* Card 3: Contact & Residential Details */}
        <div className="mp-card">
          <div className="mp-card-title">
            <span>📍</span> Contact & Residency Records
          </div>
          <div className="mp-info-list">
            <div className="mp-info-item">
              <span className="mp-info-label">Institutional Email:</span>
              <span className="mp-info-val text-cyan">{student.email}</span>
            </div>
            <div className="mp-info-item">
              <span className="mp-info-label">Mobile Contact:</span>
              <span className="mp-info-val">{student.phone}</span>
            </div>
            <div className="mp-info-item">
              <span className="mp-info-label">Residential Address:</span>
              <span className="mp-info-val">{student.address}</span>
            </div>
            <div className="mp-info-item">
              <span className="mp-info-label">Campus Boarding Status:</span>
              <span className="mp-info-val">Day Student (Permitted Bus Route 3)</span>
            </div>
          </div>
        </div>

        {/* Card 4: Medical & Wellbeing Dossier */}
        <div className="mp-card">
          <div className="mp-card-title">
            <span>🩺</span> Health & Infirmary Clearance
          </div>
          <div className="mp-info-list">
            <div className="mp-info-item">
              <span className="mp-info-label">Blood Group:</span>
              <strong className="mp-info-val text-emerald">{student.bloodGroup}</strong>
            </div>
            <div className="mp-info-item">
              <span className="mp-info-label">Known Allergies:</span>
              <span className="mp-info-val">{student.allergies}</span>
            </div>
            <div className="mp-info-item">
              <span className="mp-info-label">Infirmary Clearance:</span>
              <span className="mp-info-val text-emerald">✓ Fully Certified for Sports</span>
            </div>
            <div className="mp-info-item">
              <span className="mp-info-label">Campus Medical Officer:</span>
              <span className="mp-info-val">Dr. Matilda Quarshie (Ridge Clinic)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card 5: Authorized Guardians List */}
      <div className="mp-guardian-card">
        <div className="mp-card-title">
          <span>👨‍👩‍👧</span> Permitted Parent & Guardian Information
        </div>
        <div className="mp-guardians-grid">
          {student.guardians.map((g, idx) => (
            <div key={idx} className="mp-guardian-box">
              <div className="mp-guardian-header">
                <span className="mp-guardian-name">{g.name}</span>
                {g.isPrimary && <span className="mp-tag-primary">Primary Contact</span>}
              </div>
              <div className="mp-guardian-details">
                <div>Relationship: <strong>{g.relation}</strong></div>
                <div>Phone: <strong>{g.phone}</strong></div>
                <div>Email: <strong>{g.email}</strong></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Request Correction Modal */}
      {showUpdateModal && (
        <div className="mp-modal-backdrop" onClick={() => setShowUpdateModal(false)}>
          <div className="mp-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="mp-modal-header">
              <h3>Submit Profile Update Request</h3>
              <button className="mp-modal-close" onClick={() => setShowUpdateModal(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmitCorrection}>
              <p className="mp-modal-desc">
                For security reasons, official record changes (such as legal name, date of birth, or
                residential change) require review and supporting documentation verified by the Registrar.
              </p>
              <div className="mp-form-group">
                <label>Requested Corrections & Reason:</label>
                <textarea
                  rows={4}
                  placeholder="e.g., Please update guardian phone number or emergency residence..."
                  value={correctionNote}
                  onChange={(e) => setCorrectionNote(e.target.value)}
                  required
                />
              </div>
              <div className="mp-modal-footer">
                <button
                  type="button"
                  className="mp-btn-cancel"
                  onClick={() => setShowUpdateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="mp-btn-submit">
                  Submit Update Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
