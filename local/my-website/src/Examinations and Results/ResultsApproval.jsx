import React, { useState } from "react";
import "./ResultsApproval.css";
import ExamNav from "./ExamNav";
import { getMarks, saveMarks, getAssessments } from "./examData";
import SpinningWordsBackground from "../components/SpinningWordsBackground";
import DailyQuotePopupModal from "../components/DailyQuotePopupModal";

export default function ResultsApproval() {
  const [marks, setMarks] = useState(() => getMarks());
  const assessments = getAssessments();
  const [toastMessage, setToastMessage] = useState(null);
  const [selectedCohort, setSelectedCohort] = useState("Grade 11-A");
  const [principalPin, setPrincipalPin] = useState("Admin@2026");
  const [isSignOffModalOpen, setIsSignOffModalOpen] = useState(false);
  const [activeSubjectSignOff, setActiveSubjectSignOff] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const subjects = [
    { name: "Elective Mathematics", code: "MTH-401", teacher: "Dr. Jonathan Miller", totalScripts: 28, submitted: 28, approved: 28, status: "Fully Approved", sealed: true },
    { name: "Physics", code: "PHY-302", teacher: "Mr. Kofi Annan", totalScripts: 28, submitted: 28, approved: 14, status: "Partially Approved", sealed: false },
    { name: "Chemistry", code: "CHM-301", teacher: "Mrs. Sarah Jenkins", totalScripts: 28, submitted: 28, approved: 28, status: "Fully Approved", sealed: true },
    { name: "English Language", code: "ENG-204", teacher: "Mrs. Clara Oswald", totalScripts: 28, submitted: 28, approved: 0, status: "Awaiting Sign-Off", sealed: false },
    { name: "Computer Science", code: "CSC-310", teacher: "Dr. Margaret Hamilton", totalScripts: 28, submitted: 24, approved: 0, status: "Marks Incomplete", sealed: false },
  ];

  const handleOpenSignOff = (sub) => {
    setActiveSubjectSignOff(sub);
    setIsSignOffModalOpen(true);
  };

  const handleConfirmSignOff = (e) => {
    e.preventDefault();
    if (!principalPin.trim()) {
      alert("Please enter authorized administrative PIN.");
      return;
    }

    // Update marks to Approved & Published
    const updated = marks.map((m) =>
      m.subject === activeSubjectSignOff.name
        ? {
            ...m,
            reviewStatus: "Approved",
            reviewedBy: "Dame Eleanor Vance, Ph.D. (Executive Sign-Off)",
            reviewedAt: new Date().toISOString().slice(0, 10),
            isPublished: true,
          }
        : m
    );

    setMarks(updated);
    saveMarks(updated);
    setIsSignOffModalOpen(false);
    showToast(`Executive approval sealed for ${activeSubjectSignOff.name}! Results released for publication.`);
  };

  const handleSealEntireCohort = () => {
    const updated = marks.map((m) => ({
      ...m,
      reviewStatus: "Approved",
      reviewedBy: "Academic Board & Executive Trustee",
      reviewedAt: new Date().toISOString().slice(0, 10),
      isPublished: true,
    }));
    setMarks(updated);
    saveMarks(updated);
    showToast(`Executive seal executed: All academic marks for ${selectedCohort} approved and authorized for release!`);
  };

  return (
    <div className="ra-page-wrapper">
      <SpinningWordsBackground speed="slow" />
      <DailyQuotePopupModal />

      {toastMessage && <div className="ra-toast">✓ {toastMessage}</div>}

      <ExamNav
        title="Results Approval"
        subtitle="Executive administrative sign-off gate: Headmaster / Principal formal seal and clearance before results publication"
        badge="Screen 6 of 12"
      />

      {/* Principal Authority Card */}
      <div className="ra-authority-card">
        <div className="ra-authority-left">
          <div className="ra-authority-stamp">SEALED</div>
          <div>
            <div className="ra-authority-badge">OFFICIAL EXECUTIVE CLEARANCE GATE</div>
            <h2 className="ra-authority-title">Academic Examination Board Authorization</h2>
            <p className="ra-authority-sub">
              Signatory Trustee: <strong>Dame Eleanor Vance, Ph.D.</strong> • Head Principal & Executive Trustee (St. Mary International Academy)
            </p>
          </div>
        </div>

        <button
          type="button"
          className="ra-btn-seal-all"
          onClick={handleSealEntireCohort}
        >
          🏛️ Seal & Authorize Entire Cohort ({selectedCohort})
        </button>
      </div>

      {/* Cohort Selector & Progress Meter */}
      <div className="ra-progress-card">
        <div className="ra-progress-top">
          <div>
            <span className="ra-progress-label">Academic Cohort</span>
            <select
              className="ra-select"
              value={selectedCohort}
              onChange={(e) => setSelectedCohort(e.target.value)}
            >
              <option value="Grade 11-A">Grade 11-A (Science Specialization Track)</option>
              <option value="Grade 11-B">Grade 11-B (General Arts & Business)</option>
              <option value="Grade 12-A">Grade 12-A (WASSCE Final Candidates)</option>
            </select>
          </div>

          <div className="ra-meter-box">
            <span className="ra-meter-label">Overall Cohort Approval Progress</span>
            <span className="ra-meter-val">82% Cleared</span>
          </div>
        </div>

        <div className="ra-bar-track">
          <div className="ra-bar-fill" style={{ width: "82%" }}></div>
        </div>
      </div>

      {/* Subjects Approval Table */}
      <div className="ra-table-card">
        <div className="ra-table-header">
          <h3 className="ra-table-title">Subject Moderation Sign-Off Roster • Term 1 Examinations</h3>
          <span className="ra-badge-info">5 Core & Elective Subjects</span>
        </div>

        <div className="ra-table-responsive">
          <table className="ra-table">
            <thead>
              <tr>
                <th>Subject Name</th>
                <th>Subject Master</th>
                <th>Total Candidates</th>
                <th>Submitted</th>
                <th>Approved</th>
                <th>Board Status</th>
                <th>Executive Seal</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((s, idx) => (
                <tr key={idx}>
                  <td>
                    <div className="ra-sub-name">{s.name}</div>
                    <div className="ra-sub-code">{s.code}</div>
                  </td>
                  <td><strong>{s.teacher}</strong></td>
                  <td>{s.totalScripts} Students</td>
                  <td>{s.submitted} / {s.totalScripts}</td>
                  <td>
                    <span className="ra-approved-pill">{s.approved} Cleared</span>
                  </td>
                  <td>
                    <span className={`ra-status-badge ${s.status.replace(/\s+/g, "").toLowerCase()}`}>
                      {s.status}
                    </span>
                  </td>
                  <td>
                    {s.sealed ? (
                      <span className="ra-seal-badge">✓ SEALED BY PRINCIPAL</span>
                    ) : (
                      <span className="ra-seal-pending">⏳ PENDING SIGN-OFF</span>
                    )}
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`ra-btn-sign ${s.sealed ? "sealed" : ""}`}
                      onClick={() => handleOpenSignOff(s)}
                    >
                      {s.sealed ? "View Clearance Stamp" : "🖋️ Sign-Off & Seal"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sign-Off Modal */}
      {isSignOffModalOpen && activeSubjectSignOff && (
        <div className="ra-modal-backdrop" onClick={() => setIsSignOffModalOpen(false)}>
          <div className="ra-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="ra-modal-header">
              <h3 className="ra-modal-title">🖋️ Principal Examination Sign-Off & Official Seal</h3>
              <button
                type="button"
                className="ra-modal-close"
                onClick={() => setIsSignOffModalOpen(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleConfirmSignOff} className="ra-modal-form">
              <div className="ra-sign-box">
                <div className="ra-sign-row">
                  <span>Subject:</span>
                  <strong>{activeSubjectSignOff.name} ({activeSubjectSignOff.code})</strong>
                </div>
                <div className="ra-sign-row">
                  <span>Lead Instructor:</span>
                  <strong>{activeSubjectSignOff.teacher}</strong>
                </div>
                <div className="ra-sign-row">
                  <span>Candidate Scripts:</span>
                  <strong>{activeSubjectSignOff.totalScripts} Candidates (Grade 11-A)</strong>
                </div>
                <div className="ra-sign-row">
                  <span>Authorization Authority:</span>
                  <span style={{ color: "#38bdf8" }}>Dame Eleanor Vance, Ph.D. (Head Principal)</span>
                </div>
              </div>

              <div className="ra-pin-field">
                <label>Enter Executive Approval Security Password</label>
                <input
                  type="password"
                  required
                  value={principalPin}
                  onChange={(e) => setPrincipalPin(e.target.value)}
                  placeholder="Enter administrator password..."
                />
                <span className="ra-pin-hint">⚡ Auto-filled for trial: Admin@2026</span>
              </div>

              <div className="ra-modal-actions">
                <button
                  type="button"
                  className="ra-btn-cancel"
                  onClick={() => setIsSignOffModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ra-btn-confirm"
                >
                  🏛️ Affix Executive Seal & Authorize Release
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
