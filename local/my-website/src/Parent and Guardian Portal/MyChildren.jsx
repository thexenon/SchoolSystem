import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ParentNav from "./ParentNav";
import {
  getActiveParent,
  LINKED_CHILDREN,
  getActiveChildId,
  saveActiveChildId,
} from "./parentData";
import "./MyChildren.css";

export default function MyChildren() {
  const navigate = useNavigate();
  const parent = getActiveParent();
  const [activeChildId, setActiveChildId] = useState(getActiveChildId());
  const [toast, setToast] = useState(null);
  const [linkModalOpen, setLinkModalOpen] = useState(false);

  // Link ward form
  const [wardId, setWardId] = useState("");
  const [wardDob, setWardDob] = useState("");
  const [birthCertNo, setBirthCertNo] = useState("");

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const parentChildren = LINKED_CHILDREN.filter((c) =>
    parent.linkedStudentIds.includes(c.id)
  );

  const handleSelectActive = (id, name) => {
    setActiveChildId(id);
    saveActiveChildId(id);
    window.dispatchEvent(new Event("childChanged"));
    showToast(`${name} set as active child!`);
  };

  const handleLinkWardSubmit = (e) => {
    e.preventDefault();
    showToast(`Verification request for student ID ${wardId} dispatched to Admissions Registry!`);
    setLinkModalOpen(false);
    setWardId("");
    setWardDob("");
    setBirthCertNo("");
  };

  return (
    <div className="mc-container">
      <ParentNav
        title="Registered Children & Wards Directory"
        subtitle="Manage personal records, faculty advisors, and enrollment profiles for all children linked to your parent account"
        badge="Module 11 • Screen 2 of 10"
      />

      {toast && (
        <div className={`mc-toast mc-toast-${toast.type}`}>
          <div className="mc-toast-dot" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="mc-header">
        <div className="mc-title-box">
          <span className="mc-tag">LINKED STUDENTS DIRECTORY</span>
          <h1 className="mc-title">My Enrolled Children</h1>
          <p className="mc-subtitle">
            Overview of all biological and legal wards actively enrolled at St. Michael's International Academy.
            Seamlessly navigate across student profiles, grade sheets, attendance ledgers, and billing records.
          </p>
        </div>

        <div className="mc-actions">
          <button className="mc-btn-primary" onClick={() => setLinkModalOpen(true)}>
            <span className="mc-btn-icon">+</span> Link Additional Ward
          </button>
        </div>
      </div>

      {/* Children Cards List */}
      <div className="mc-cards-grid">
        {parentChildren.map((child) => {
          const isActive = child.id === activeChildId;
          return (
            <div key={child.id} className={`mc-card ${isActive ? "active" : ""}`}>
              <div className="mc-card-top">
                <div className="mc-avatar">{child.avatar}</div>
                <div className="mc-card-title-group">
                  <div className="mc-name-row">
                    <h2>{child.fullName}</h2>
                    {isActive && <span className="mc-active-badge">✓ Active Selected</span>}
                  </div>
                  <span className="mc-id-pill">ID: {child.id} • Roll: {child.rollNumber}</span>
                </div>
              </div>

              <div className="mc-details-grid">
                <div>
                  <small>Class Cohort:</small>
                  <strong>{child.classCohort}</strong>
                </div>
                <div>
                  <small>Academic Track:</small>
                  <strong>{child.academicTrack}</strong>
                </div>
                <div>
                  <small>Campus Residence:</small>
                  <strong>{child.campus} ({child.residentialStatus})</strong>
                </div>
                <div>
                  <small>Assigned Form Tutor:</small>
                  <strong>{child.formTutor}</strong>
                </div>
              </div>

              {/* Performance & Finance Strip */}
              <div className="mc-stats-strip">
                <div className="mc-stat-item">
                  <span>Current GPA</span>
                  <strong style={{ color: "#38bdf8" }}>{child.gpa} / 4.00</strong>
                  <small>{child.classRank}</small>
                </div>
                <div className="mc-stat-item">
                  <span>Presence Rate</span>
                  <strong style={{ color: "#34d399" }}>{child.attendanceRate}%</strong>
                  <small>{child.totalAbsences} absence(s)</small>
                </div>
                <div className="mc-stat-item">
                  <span>Fee Standing</span>
                  <strong style={{ color: child.balanceDue > 0 ? "#f87171" : "#34d399" }}>
                    {child.balanceDue > 0
                      ? `GH₵ ${child.balanceDue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                      : "Cleared (GH₵ 0.00)"}
                  </strong>
                  <small>{child.feeStatus}</small>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mc-card-footer">
                {!isActive ? (
                  <button
                    className="mc-btn-select"
                    onClick={() => handleSelectActive(child.id, child.fullName)}
                  >
                    Set as Active Child
                  </button>
                ) : (
                  <span className="mc-active-label">Currently Inspected</span>
                )}

                <div className="mc-actions-group">
                  <button
                    className="mc-btn-action"
                    onClick={() => {
                      handleSelectActive(child.id, child.fullName);
                      navigate("/child-profile");
                    }}
                  >
                    👤 Profile
                  </button>
                  <button
                    className="mc-btn-action"
                    onClick={() => {
                      handleSelectActive(child.id, child.fullName);
                      navigate("/child-attendance");
                    }}
                  >
                    📋 Attendance
                  </button>
                  <button
                    className="mc-btn-action"
                    onClick={() => {
                      handleSelectActive(child.id, child.fullName);
                      navigate("/child-results");
                    }}
                  >
                    🏆 Results
                  </button>
                  <button
                    className="mc-btn-action highlight"
                    onClick={() => {
                      handleSelectActive(child.id, child.fullName);
                      navigate("/parent-fee-statements");
                    }}
                  >
                    💳 Fees & Billing
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Link Additional Ward Modal */}
      {linkModalOpen && (
        <div className="mc-modal-overlay">
          <div className="mc-modal-box">
            <div className="mc-modal-header">
              <div>
                <h3>➕ Link Additional Child / Ward</h3>
                <p>Submit legal guardianship verification to connect a new student to this portal account.</p>
              </div>
              <button className="mc-btn-close" onClick={() => setLinkModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleLinkWardSubmit} className="mc-modal-form">
              <div className="mc-form-field">
                <label>Student Admission Number / ID:</label>
                <input
                  type="text"
                  placeholder="e.g. STU-SMIA-016"
                  value={wardId}
                  onChange={(e) => setWardId(e.target.value)}
                  required
                />
              </div>

              <div className="mc-form-field">
                <label>Student Official Date of Birth:</label>
                <input
                  type="date"
                  value={wardDob}
                  onChange={(e) => setWardDob(e.target.value)}
                  required
                />
              </div>

              <div className="mc-form-field">
                <label>Birth Certificate / Ghana Card PIN:</label>
                <input
                  type="text"
                  placeholder="e.g. GHA-789012345-1"
                  value={birthCertNo}
                  onChange={(e) => setBirthCertNo(e.target.value)}
                  required
                />
              </div>

              <div className="mc-modal-footer">
                <button type="button" className="mc-btn-cancel" onClick={() => setLinkModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="mc-btn-submit">
                  Submit Verification Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
