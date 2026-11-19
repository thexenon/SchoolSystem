import React, { useState, useEffect } from "react";
import ParentNav from "./ParentNav";
import {
  getActiveParent,
  LINKED_CHILDREN,
  getActiveChildId,
} from "./parentData";
import "./ChildProfile.css";

export default function ChildProfile() {
  const parent = getActiveParent();
  const [activeChildId, setActiveChildId] = useState(getActiveChildId());

  useEffect(() => {
    const handleChildChanged = () => {
      setActiveChildId(getActiveChildId());
    };
    window.addEventListener("childChanged", handleChildChanged);
    return () => window.removeEventListener("childChanged", handleChildChanged);
  }, []);

  const parentChildren = LINKED_CHILDREN.filter((c) =>
    parent.linkedStudentIds.includes(c.id)
  );

  const child =
    parentChildren.find((c) => c.id === activeChildId) || parentChildren[0];

  return (
    <div className="cp-container">
      <ParentNav
        title="Student Personal & Enrollment Dossier"
        subtitle="Comprehensive institutional records, medical particulars, and academic registration credentials"
        badge="Module 11 • Screen 3 of 10"
      />

      {/* Header Banner */}
      <div className="cp-header no-print">
        <div className="cp-title-box">
          <span className="cp-tag">INSTITUTIONAL ENROLLMENT RECORD</span>
          <h1 className="cp-title">{child.fullName}'s Profile</h1>
          <p className="cp-subtitle">
            Official academy dossier including statutory birth records, residential hostel allotment,
            emergency medical protocols, and form tutor assignment.
          </p>
        </div>

        <div className="cp-actions">
          <button className="cp-btn-print" onClick={() => window.print()}>
            🖨️ Print Student Dossier
          </button>
        </div>
      </div>

      {/* Profile Sheet */}
      <div className="cp-profile-sheet" id="printable-child-profile">
        {/* Header Hero */}
        <div className="cp-sheet-top">
          <div className="cp-avatar-wrap">
            <div className="cp-avatar-big">{child.avatar}</div>
            <div>
              <div className="cp-status-pill">✓ ENROLLED ACTIVE SCHOLAR</div>
              <h2 className="cp-full-name">{child.fullName}</h2>
              <div className="cp-sub-info">
                <span>ID: <strong>{child.id}</strong></span> • 
                <span>Class: <strong>{child.classCohort}</strong></span> • 
                <span>Roll: <strong>{child.rollNumber}</strong></span>
              </div>
            </div>
          </div>

          <div className="cp-crest-badge">
            <div className="cp-crest-icon">SMIA</div>
            <small>St. Michael's Academy</small>
          </div>
        </div>

        {/* Section 1: Academic Enrollment Particulars */}
        <div className="cp-section-title">🎓 Academic & Institutional Enrollment</div>
        <div className="cp-grid">
          <div className="cp-field-box">
            <span className="cp-label">Academic Program Track:</span>
            <strong className="cp-value">{child.academicTrack}</strong>
          </div>
          <div className="cp-field-box">
            <span className="cp-label">Campus Location:</span>
            <strong className="cp-value">{child.campus}</strong>
          </div>
          <div className="cp-field-box">
            <span className="cp-label">Residential Status:</span>
            <strong className="cp-value">{child.residentialStatus}</strong>
          </div>
          <div className="cp-field-box">
            <span className="cp-label">Academic House Allotment:</span>
            <strong className="cp-value">St. George House (Blue Crest)</strong>
          </div>
          <div className="cp-field-box">
            <span className="cp-label">Admission Date:</span>
            <strong className="cp-value">September 01, 2024</strong>
          </div>
          <div className="cp-field-box">
            <span className="cp-label">Academic Standing:</span>
            <strong className="cp-value" style={{ color: "#10b981" }}>Dean's Honor Roll ({child.gpa} GPA)</strong>
          </div>
        </div>

        {/* Section 2: Personal & Identity Particulars */}
        <div className="cp-section-title">👤 Personal Identity & Statutory Details</div>
        <div className="cp-grid">
          <div className="cp-field-box">
            <span className="cp-label">Official Date of Birth:</span>
            <strong className="cp-value">{child.dateOfBirth}</strong>
          </div>
          <div className="cp-field-box">
            <span className="cp-label">Gender:</span>
            <strong className="cp-value">{child.gender}</strong>
          </div>
          <div className="cp-field-box">
            <span className="cp-label">Nationality:</span>
            <strong className="cp-value">Ghanaian / Dual Resident</strong>
          </div>
          <div className="cp-field-box">
            <span className="cp-label">National ID / Ghana Card PIN:</span>
            <strong className="cp-value">GHA-882910481-9</strong>
          </div>
          <div className="cp-field-box">
            <span className="cp-label">Primary Languages:</span>
            <strong className="cp-value">English (Fluent), Twi, French</strong>
          </div>
          <div className="cp-field-box">
            <span className="cp-label">Residential Home Address:</span>
            <strong className="cp-value">{parent.address}</strong>
          </div>
        </div>

        {/* Section 3: Health, Medical & Dietary Protocols */}
        <div className="cp-section-title">🏥 Medical, Allergy & Health Profile</div>
        <div className="cp-grid">
          <div className="cp-field-box">
            <span className="cp-label">Blood Group & Rhesus Factor:</span>
            <strong className="cp-value">{child.bloodGroup}</strong>
          </div>
          <div className="cp-field-box">
            <span className="cp-label">Genotype:</span>
            <strong className="cp-value">AA (Normal)</strong>
          </div>
          <div className="cp-field-box">
            <span className="cp-label">Documented Allergies:</span>
            <strong className="cp-value" style={{ color: child.allergies.includes("None") ? "#cbd5e1" : "#f87171" }}>
              {child.allergies}
            </strong>
          </div>
          <div className="cp-field-box">
            <span className="cp-label">Dining & Dietary Requirements:</span>
            <strong className="cp-value">Standard Nutritious Balanced Diet</strong>
          </div>
          <div className="cp-field-box">
            <span className="cp-label">Campus Infirmary Physician:</span>
            <strong className="cp-value">Dr. Mary Obeng (MD, Ridge Health Clinic)</strong>
          </div>
          <div className="cp-field-box">
            <span className="cp-label">Immunization Status:</span>
            <strong className="cp-value" style={{ color: "#10b981" }}>✓ 100% Up-to-date & Certified</strong>
          </div>
        </div>

        {/* Section 4: Faculty Mentorship & Emergency Contacts */}
        <div className="cp-section-title">👨‍🏫 Faculty Advisor & Guardian Emergency Contacts</div>
        <div className="cp-grid">
          <div className="cp-field-box">
            <span className="cp-label">Assigned Form Tutor:</span>
            <strong className="cp-value">{child.formTutor}</strong>
            <small style={{ color: "#38bdf8" }}>{child.tutorEmail}</small>
          </div>
          <div className="cp-field-box">
            <span className="cp-label">Primary Guardian (Father):</span>
            <strong className="cp-value">{parent.fullName}</strong>
            <small>{parent.phone}</small>
          </div>
          <div className="cp-field-box">
            <span className="cp-label">Guardian Occupation:</span>
            <strong className="cp-value">{parent.occupation}</strong>
          </div>
          <div className="cp-field-box">
            <span className="cp-label">Secondary Emergency Line:</span>
            <strong className="cp-value">{parent.emergencyContact}</strong>
          </div>
        </div>

        {/* Footer Audit Seal */}
        <div className="cp-sheet-footer">
          <div>
            <strong>Registrar & Admissions Directorate</strong>
            <small>St. Michael's International Academy • Accra</small>
          </div>
          <div className="cp-stamp">
            <span>OFFICIAL DOSSIER</span>
            <span>VERIFIED & SEALED</span>
          </div>
          <div>
            <strong>Dame Eleanor Vance</strong>
            <small>Head Principal & Trustee</small>
          </div>
        </div>
      </div>
    </div>
  );
}
