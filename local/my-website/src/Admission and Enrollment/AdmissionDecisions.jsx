import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AdmissionNav from "./AdmissionNav";
import { getApplicants, saveApplicants } from "./admissionData";
import "./AdmissionDecisions.css";

const HOUSES = [
  "St. Patrick (Green House)",
  "St. Teresa (Blue House)",
  "St. Augustine (Gold House)",
  "St. Michael (Red House)",
];

const CLASSES = [
  "Grade 10-A (Secondary Science)",
  "Grade 10-B (Business & Accounting)",
  "Grade 10-C (General Arts)",
  "Grade 11-A (Secondary Science)",
  "Grade 11-B (Business)",
  "Grade 12-A (Advanced Science)",
  "Grade 7-Alpha (Middle School)",
  "Grade 8-Alpha (Middle School)",
  "Grade 9-Alpha (Middle School)",
];

export default function AdmissionDecisions() {
  const location = useLocation();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [toast, setToast] = useState(null);

  // Decision State
  const [decision, setDecision] = useState("Accepted");
  const [assignedClass, setAssignedClass] = useState("Grade 10-A (Secondary Science)");
  const [house, setHouse] = useState("St. Patrick (Green House)");
  const [reportingDate, setReportingDate] = useState("2027-01-12");
  const [tuitionDeposit, setTuitionDeposit] = useState("GH₵2,500.00");
  const [scholarshipAward, setScholarshipAward] = useState("None");
  const [decidedBy, setDecidedBy] = useState("Dame Eleanor Vance (Headmistress)");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const list = getApplicants();
    setApplicants(list);

    const params = new URLSearchParams(location.search);
    const queryId = params.get("id");
    const target = queryId && list.some((a) => a.id === queryId) ? queryId : (list[0]?.id || "");
    setSelectedId(target);

    if (target) {
      loadDecisionData(target, list);
    }
  }, [location.search]);

  const loadDecisionData = (id, list) => {
    const app = list.find((a) => a.id === id);
    if (app && app.admissionDecision) {
      setDecision(app.admissionDecision.decision || "Accepted");
      setAssignedClass(app.admissionDecision.assignedClass || "Grade 10-A (Secondary Science)");
      setHouse(app.admissionDecision.house || "St. Patrick (Green House)");
      setReportingDate(app.admissionDecision.reportingDate || "2027-01-12");
      setTuitionDeposit(app.admissionDecision.tuitionDeposit || "GH₵2,500.00");
      setScholarshipAward(app.admissionDecision.scholarshipAward || "None");
      setDecidedBy(app.admissionDecision.decidedBy || "Dame Eleanor Vance (Headmistress)");
    } else {
      setDecision(app?.status === "Accepted" ? "Accepted" : "Accepted");
      setTuitionDeposit("GH₵2,500.00");
      setScholarshipAward("None");
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSelectApplicant = (id) => {
    setSelectedId(id);
    navigate(`/admission-decisions?id=${id}`);
    loadDecisionData(id, applicants);
  };

  const currentApplicant = applicants.find((a) => a.id === selectedId) || applicants[0];

  const handleSaveDecision = (e) => {
    e.preventDefault();
    if (!currentApplicant) return;

    const newDecisionObj = {
      decision,
      date: new Date().toISOString().split("T")[0],
      decidedBy,
      assignedClass: decision === "Accepted" ? assignedClass : "N/A",
      house: decision === "Accepted" ? house : "Unassigned",
      reportingDate: decision === "Accepted" ? reportingDate : "—",
      tuitionDeposit: decision === "Accepted" ? tuitionDeposit : "—",
      scholarshipAward: decision === "Accepted" ? scholarshipAward : "None",
      letterGenerated: decision === "Accepted",
      notes,
    };

    const updated = applicants.map((a) =>
      a.id === currentApplicant.id
        ? {
            ...a,
            status: decision,
            admissionDecision: newDecisionObj,
          }
        : a
    );

    saveApplicants(updated);
    setApplicants(updated);
    showToast(`Decision [${decision}] recorded for ${currentApplicant.fullName}!`);
  };

  if (!currentApplicant) {
    return (
      <div className="ad-page-container">
        <AdmissionNav
          title="Admissions Selection & Official Decisions"
          subtitle="Record and ratify candidate admission statuses, class placements, and financial clearance terms"
          badge="Admission Module • Screen 6 of 9"
        />
        <div className="ad-content-wrap">
          <p className="ad-loading">No candidates available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ad-page-container">
      {toast && (
        <div className="ad-toast">
          <span>✓</span> {toast}
        </div>
      )}

      <AdmissionNav
        title="Admissions Selection & Official Decisions"
        subtitle="Ratify candidate admission statuses, allocate academic classes and residential houses, and set fee deposits"
        badge="Admission Module • Screen 6 of 9"
      />

      <div className="ad-content-wrap">
        {/* Switcher Bar */}
        <div className="ad-switcher-bar">
          <div className="ad-selector-wrap">
            <label>Selected Candidate:</label>
            <select
              value={currentApplicant.id}
              onChange={(e) => handleSelectApplicant(e.target.value)}
            >
              {applicants.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.fullName} — {a.id} ({a.status})
                </option>
              ))}
            </select>
          </div>

          <div className="ad-bar-actions">
            <button
              className="ad-btn-action ad-btn-profile"
              onClick={() => navigate(`/applicant-profile?id=${currentApplicant.id}`)}
            >
              👤 View Dossier
            </button>
            <button
              className="ad-btn-action ad-btn-review"
              onClick={() => navigate(`/application-review?id=${currentApplicant.id}`)}
            >
              📝 Faculty Review
            </button>
            {currentApplicant.status === "Accepted" && (
              <button
                className="ad-btn-action ad-btn-letter"
                onClick={() => navigate(`/admission-letters?id=${currentApplicant.id}`)}
              >
                📜 Admission Letter
              </button>
            )}
          </div>
        </div>

        {/* Candidate Summary Banner */}
        <div className="ad-hero-summary">
          <div className="ad-summary-left">
            <div className="ad-avatar">{currentApplicant.gender === "Female" ? "👩" : "👨"}</div>
            <div>
              <div className="ad-badge-row">
                <span className="ad-id-badge font-mono">{currentApplicant.id}</span>
                <span className={`ad-status-pill ad-pill-${currentApplicant.status.toLowerCase().replace(/\s+/g, "-")}`}>
                  Current: {currentApplicant.status}
                </span>
              </div>
              <h3>{currentApplicant.fullName}</h3>
              <p>
                Target: <strong>{currentApplicant.targetGrade} ({currentApplicant.stream})</strong> • BECE:{" "}
                <strong>{currentApplicant.beceAggregate || "N/A"}</strong> • Screening Exam:{" "}
                <strong>{currentApplicant.entryExamScore}%</strong>
              </p>
            </div>
          </div>

          <div className="ad-summary-rating">
            <div className="ad-score-lbl">Composite Review</div>
            <div className="ad-score-val font-mono">
              {currentApplicant.reviewScores ? (
                <>
                  {currentApplicant.reviewScores.compositeRating}
                  <span>/100</span>
                </>
              ) : (
                <span className="ad-unscored-text">Pending</span>
              )}
            </div>
          </div>
        </div>

        {/* Decision Entry Form */}
        <form onSubmit={handleSaveDecision} className="ad-decision-form">
          <div className="ad-form-header">
            <h4><span>⚖️</span> Ratify Official Institutional Decision</h4>
            <p>Select decision verdict, assign academic class division, residential house, and financial parameters.</p>
          </div>

          {/* Decision Status Selector */}
          <div className="ad-decision-selector">
            <label
              className={`ad-radio-card ${decision === "Accepted" ? "active-accept" : ""}`}
            >
              <input
                type="radio"
                name="decision"
                value="Accepted"
                checked={decision === "Accepted"}
                onChange={() => setDecision("Accepted")}
              />
              <div className="ad-radio-icon">🎉</div>
              <div className="ad-radio-text">
                <strong>Offer Full Admission</strong>
                <p>Issue certified letter of admission and reserve academic seat</p>
              </div>
            </label>

            <label
              className={`ad-radio-card ${decision === "Waitlisted" ? "active-waitlist" : ""}`}
            >
              <input
                type="radio"
                name="decision"
                value="Waitlisted"
                checked={decision === "Waitlisted"}
                onChange={() => setDecision("Waitlisted")}
              />
              <div className="ad-radio-icon">⏳</div>
              <div className="ad-radio-text">
                <strong>Place on Waitlist</strong>
                <p>Retain in competitive pool subject to vacancies</p>
              </div>
            </label>

            <label
              className={`ad-radio-card ${decision === "Rejected" ? "active-reject" : ""}`}
            >
              <input
                type="radio"
                name="decision"
                value="Rejected"
                checked={decision === "Rejected"}
                onChange={() => setDecision("Rejected")}
              />
              <div className="ad-radio-icon">❌</div>
              <div className="ad-radio-text">
                <strong>Regret / Non-admissible</strong>
                <p>Decline application based on entry threshold or capacity</p>
              </div>
            </label>
          </div>

          {/* Accepted Parameters Section */}
          {decision === "Accepted" && (
            <div className="ad-accepted-params">
              <div className="ad-section-hdr">
                <span>🎓</span> Placement & Financial Parameters (GH₵)
              </div>

              <div className="ad-grid-row">
                <div className="ad-field">
                  <label>Assigned Academic Class *</label>
                  <select
                    value={assignedClass}
                    onChange={(e) => setAssignedClass(e.target.value)}
                  >
                    {CLASSES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="ad-field">
                  <label>Allocated Campus House *</label>
                  <select
                    value={house}
                    onChange={(e) => setHouse(e.target.value)}
                  >
                    {HOUSES.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>

                <div className="ad-field">
                  <label>Official Reporting Date *</label>
                  <input
                    type="date"
                    value={reportingDate}
                    onChange={(e) => setReportingDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="ad-grid-row">
                <div className="ad-field">
                  <label>Tuition Deposit Required (GH₵) *</label>
                  <input
                    type="text"
                    value={tuitionDeposit}
                    onChange={(e) => setTuitionDeposit(e.target.value)}
                    required
                  />
                  <small className="ad-hint">Standard Term 1 Deposit: GH₵2,500.00</small>
                </div>

                <div className="ad-field">
                  <label>Scholarship / Merit Bursary Award</label>
                  <select
                    value={scholarshipAward}
                    onChange={(e) => setScholarshipAward(e.target.value)}
                  >
                    <option value="None">None (Standard Tuition)</option>
                    <option value="GH₵500.00 (Merit Waiver)">GH₵500.00 (Academic Merit Waiver)</option>
                    <option value="GH₵1,000.00 (Governor's Bursary)">GH₵1,000.00 (Governor's Bursary)</option>
                    <option value="Full Tuition Waiver (Headmistress Scholar)">Full Tuition Waiver (Headmistress Scholar)</option>
                  </select>
                </div>

                <div className="ad-field">
                  <label>Authorizing Signatory</label>
                  <input
                    type="text"
                    value={decidedBy}
                    onChange={(e) => setDecidedBy(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <div className="ad-field" style={{ marginTop: "1.2rem" }}>
            <label>Internal Board Deliberation Notes:</label>
            <textarea
              rows={3}
              placeholder="Record any special conditions, boarding house allocations, or interview committee considerations..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="ad-form-actions">
            <button
              type="button"
              className="ad-btn-cancel"
              onClick={() => navigate("/applicant-list")}
            >
              Cancel
            </button>
            <button type="submit" className="ad-btn-submit">
              ⚖️ Ratify & Save Admission Decision
            </button>
            {decision === "Accepted" && (
              <button
                type="button"
                className="ad-btn-generate-letter"
                onClick={() => navigate(`/admission-letters?id=${currentApplicant.id}`)}
              >
                📜 Generate Admission Letter →
              </button>
            )}
          </div>
        </form>

        {/* Decision Register Log */}
        <div className="ad-log-card">
          <h4><span>📋</span> Recent Admissions Decisions Register</h4>
          <table className="ad-log-table">
            <thead>
              <tr>
                <th>Applicant Ref</th>
                <th>Candidate Name</th>
                <th>Target Grade</th>
                <th>Decision Outcome</th>
                <th>Assigned Class</th>
                <th>House</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((a) => (
                <tr key={a.id}>
                  <td className="font-mono text-cyan">{a.id}</td>
                  <td className="font-semibold text-white">{a.fullName}</td>
                  <td>{a.targetGrade}</td>
                  <td>
                    <span className={`ad-status-pill ad-pill-${a.status.toLowerCase().replace(/\s+/g, "-")}`}>
                      {a.status}
                    </span>
                  </td>
                  <td>{a.admissionDecision?.assignedClass || "—"}</td>
                  <td>{a.admissionDecision?.house || "—"}</td>
                  <td>
                    <button
                      className="ad-btn-table-edit"
                      onClick={() => handleSelectApplicant(a.id)}
                    >
                      ✏️ Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
