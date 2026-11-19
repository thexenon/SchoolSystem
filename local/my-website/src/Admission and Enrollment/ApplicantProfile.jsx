import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AdmissionNav from "./AdmissionNav";
import { getApplicants, saveApplicants } from "./admissionData";
import "./ApplicantProfile.css";

export default function ApplicantProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [currentId, setCurrentId] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [docModal, setDocModal] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const list = getApplicants();
    setApplicants(list);

    // Parse id from query string ?id=...
    const params = new URLSearchParams(location.search);
    const queryId = params.get("id");
    if (queryId && list.some((a) => a.id === queryId)) {
      setCurrentId(queryId);
    } else if (list.length > 0) {
      setCurrentId(list[0].id);
    }
  }, [location.search]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const applicant = applicants.find((a) => a.id === currentId) || applicants[0];

  const handleToggleDocVerify = (docName) => {
    if (!applicant) return;
    const updatedDocs = applicant.documents.map((d) =>
      d.name === docName ? { ...d, verified: !d.verified } : d
    );
    const updated = applicants.map((a) =>
      a.id === applicant.id ? { ...a, documents: updatedDocs } : a
    );
    saveApplicants(updated);
    setApplicants(updated);
    showToast(`Verification status updated for: ${docName}`);
  };

  const handleSelectApplicant = (id) => {
    setCurrentId(id);
    navigate(`/applicant-profile?id=${id}`);
  };

  if (!applicant) {
    return (
      <div className="ap-page-container">
        <AdmissionNav
          title="Applicant Dossier & Supporting Records"
          subtitle="Detailed prospective candidate dossier, document verification, and screening review tracking"
          badge="Admission Module • Screen 4 of 9"
        />
        <div className="ap-content-wrap">
          <p className="ap-loading">No applicant records found in database.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ap-page-container">
      {toast && (
        <div className="ap-toast">
          <span>✓</span> {toast}
        </div>
      )}

      {/* Printable Institutional Dossier (Visible in Print Mode) */}
      <div className="ap-print-dossier">
        <div className="ap-print-header">
          <h2>ST. MARY INTERNATIONAL ACADEMY</h2>
          <p>Office of the Academic Registrar • Prospective Candidate Official Dossier</p>
          <div className="ap-print-stamp">CONFIDENTIAL • OFFICIAL RECORD</div>
        </div>
        <div className="ap-print-grid">
          <div><strong>Candidate Name:</strong> {applicant.fullName}</div>
          <div><strong>Application Ref:</strong> {applicant.id}</div>
          <div><strong>Target Level:</strong> {applicant.targetGrade} ({applicant.stream})</div>
          <div><strong>Status:</strong> {applicant.status}</div>
          <div><strong>BECE Aggregate / Exam:</strong> {applicant.beceAggregate || applicant.entryExamScore + "%"}</div>
          <div><strong>Guardian:</strong> {applicant.guardianName} ({applicant.guardianPhone})</div>
          <div><strong>Previous School:</strong> {applicant.previousSchool}</div>
          <div><strong>Screening Fee:</strong> {applicant.applicationFeeAmount} (Paid)</div>
        </div>
        <div className="ap-print-footer">
          Printed on: {new Date().toLocaleDateString()} • Authorized by Office of Admissions
        </div>
      </div>

      <div className="ap-screen-content">
        <AdmissionNav
          title="Candidate Dossier & Supporting Records"
          subtitle="Detailed prospective candidate profile, supporting document verification, and screening summary"
          badge="Admission Module • Screen 4 of 9"
        />

        <div className="ap-content-wrap">
          {/* Top Selector & Switcher */}
          <div className="ap-top-bar">
            <div className="ap-selector-group">
              <label>Select Applicant:</label>
              <select
                value={applicant.id}
                onChange={(e) => handleSelectApplicant(e.target.value)}
              >
                {applicants.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.fullName} — {a.id} ({a.targetGrade})
                  </option>
                ))}
              </select>
            </div>

            <div className="ap-top-actions">
              <button
                className="ap-btn-action ap-btn-back"
                onClick={() => navigate("/applicant-list")}
              >
                ← Back to Register
              </button>
              <button
                className="ap-btn-action ap-btn-review"
                onClick={() => navigate(`/application-review?id=${applicant.id}`)}
              >
                📝 Review Candidate
              </button>
              <button
                className="ap-btn-action ap-btn-decide"
                onClick={() => navigate(`/admission-decisions?id=${applicant.id}`)}
              >
                ⚖️ Admission Decision
              </button>
              {applicant.status === "Accepted" && (
                <button
                  className="ap-btn-action ap-btn-letter"
                  onClick={() => navigate(`/admission-letters?id=${applicant.id}`)}
                >
                  📜 Admission Letter
                </button>
              )}
              <button
                className="ap-btn-action ap-btn-print"
                onClick={() => window.print()}
              >
                🖨️ Print Dossier
              </button>
            </div>
          </div>

          {/* Profile Hero Header Card */}
          <div className="ap-hero-card">
            <div className="ap-hero-left">
              <div className="ap-hero-avatar">
                {applicant.gender === "Female" ? "👩" : "👨"}
              </div>
              <div className="ap-hero-info">
                <div className="ap-hero-badges">
                  <span className="ap-badge-id font-mono">{applicant.id}</span>
                  <span className={`ap-badge-status ap-status-${applicant.status.toLowerCase().replace(/\s+/g, "-")}`}>
                    {applicant.status}
                  </span>
                  {applicant.enrollment && applicant.enrollment.status === "Enrolled" && (
                    <span className="ap-badge-enrolled">
                      🎓 Matriculated ({applicant.enrollment.generatedStudentId})
                    </span>
                  )}
                </div>
                <h2>{applicant.fullName}</h2>
                <div className="ap-hero-meta">
                  <span>🎯 {applicant.targetGrade}</span>
                  <span>🔬 {applicant.stream}</span>
                  <span>{applicant.boardingStatus === "Boarding Student" ? "🏠 Boarding" : "🚌 Day Student"}</span>
                  <span>📅 Submitted: {applicant.submissionDate}</span>
                </div>
              </div>
            </div>

            <div className="ap-hero-right">
              <div className="ap-fee-badge-card">
                <div className="ap-fee-title">Application Processing Fee</div>
                <div className="ap-fee-value font-mono">
                  {applicant.applicationFeeAmount || "GH₵250.00"}
                </div>
                <div className="ap-fee-status">
                  ✓ Receipt: {applicant.feeReceipt || "RCP-ADM-8810"}
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="ap-tab-bar">
            <button
              className={`ap-tab-btn ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              📋 Candidate Overview
            </button>
            <button
              className={`ap-tab-btn ${activeTab === "academic" ? "active" : ""}`}
              onClick={() => setActiveTab("academic")}
            >
              📚 Academic & Entrance
            </button>
            <button
              className={`ap-tab-btn ${activeTab === "documents" ? "active" : ""}`}
              onClick={() => setActiveTab("documents")}
            >
              📎 Supporting Documents ({applicant.documents?.length || 0})
            </button>
            <button
              className={`ap-tab-btn ${activeTab === "decision" ? "active" : ""}`}
              onClick={() => setActiveTab("decision")}
            >
              🏛️ Decision & Enrollment
            </button>
          </div>

          {/* Tab 1: Overview */}
          {activeTab === "overview" && (
            <div className="ap-tab-panel">
              <div className="ap-card-grid">
                <div className="ap-detail-card">
                  <div className="ap-card-title">
                    <span>👤</span> Personal & Demographic Profile
                  </div>
                  <div className="ap-info-list">
                    <div className="ap-info-row">
                      <span>Full Legal Name</span>
                      <strong>{applicant.fullName}</strong>
                    </div>
                    <div className="ap-info-row">
                      <span>Gender</span>
                      <strong>{applicant.gender}</strong>
                    </div>
                    <div className="ap-info-row">
                      <span>Date of Birth</span>
                      <strong>{applicant.dob}</strong>
                    </div>
                    <div className="ap-info-row">
                      <span>Nationality</span>
                      <strong>{applicant.nationality}</strong>
                    </div>
                    <div className="ap-info-row">
                      <span>National ID / Ghana Card</span>
                      <strong className="font-mono text-cyan">{applicant.nationalId}</strong>
                    </div>
                    <div className="ap-info-row">
                      <span>Residential Address</span>
                      <strong>{applicant.address}</strong>
                    </div>
                  </div>
                </div>

                <div className="ap-detail-card">
                  <div className="ap-card-title">
                    <span>👨‍👩‍👧</span> Parent & Guardian Information
                  </div>
                  <div className="ap-info-list">
                    <div className="ap-info-row">
                      <span>Primary Guardian</span>
                      <strong>{applicant.guardianName}</strong>
                    </div>
                    <div className="ap-info-row">
                      <span>Relationship</span>
                      <strong>{applicant.guardianRelation}</strong>
                    </div>
                    <div className="ap-info-row">
                      <span>Mobile Phone</span>
                      <strong className="text-emerald">{applicant.guardianPhone}</strong>
                    </div>
                    <div className="ap-info-row">
                      <span>Email Address</span>
                      <strong>{applicant.guardianEmail}</strong>
                    </div>
                    <div className="ap-info-row">
                      <span>Emergency Dispatch</span>
                      <strong>Contact Primary Guardian First</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Academic & Entrance */}
          {activeTab === "academic" && (
            <div className="ap-tab-panel">
              <div className="ap-card-grid">
                <div className="ap-detail-card">
                  <div className="ap-card-title">
                    <span>🏫</span> Previous Institution & History
                  </div>
                  <div className="ap-info-list">
                    <div className="ap-info-row">
                      <span>Previous School</span>
                      <strong>{applicant.previousSchool}</strong>
                    </div>
                    <div className="ap-info-row">
                      <span>BECE / Entrance Aggregate</span>
                      <strong className="text-emerald">
                        {applicant.beceAggregate ? `Aggregate ${applicant.beceAggregate}` : "Exempt / Pending"}
                      </strong>
                    </div>
                    <div className="ap-info-row">
                      <span>Screening Exam Score</span>
                      <strong>{applicant.entryExamScore}%</strong>
                    </div>
                    <div className="ap-info-row">
                      <span>Target Level</span>
                      <strong>{applicant.targetGrade} — {applicant.stream}</strong>
                    </div>
                  </div>
                </div>

                <div className="ap-detail-card">
                  <div className="ap-card-title">
                    <span>📊</span> Faculty Assessment & Screening Scores
                  </div>
                  {applicant.reviewScores ? (
                    <div className="ap-info-list">
                      <div className="ap-info-row">
                        <span>Academic Records (/40)</span>
                        <strong>{applicant.reviewScores.academicScore} / 40</strong>
                      </div>
                      <div className="ap-info-row">
                        <span>Entrance Exam (/40)</span>
                        <strong>{applicant.reviewScores.entranceExam} / 40</strong>
                      </div>
                      <div className="ap-info-row">
                        <span>Interview Rating (/20)</span>
                        <strong>{applicant.reviewScores.interviewScore} / 20</strong>
                      </div>
                      <div className="ap-info-row">
                        <span>Composite Total Score</span>
                        <strong className="text-cyan font-bold" style={{ fontSize: "1.2rem" }}>
                          {applicant.reviewScores.compositeRating} / 100
                        </strong>
                      </div>
                      <div className="ap-info-row">
                        <span>Reviewer</span>
                        <small className="text-muted">{applicant.reviewScores.reviewer}</small>
                      </div>
                      <div className="ap-review-comment-box">
                        "{applicant.reviewScores.comments}"
                      </div>
                    </div>
                  ) : (
                    <div className="ap-unscored-box">
                      <p>This candidate has not yet been reviewed by the admissions committee.</p>
                      <button
                        className="ap-btn-action ap-btn-review"
                        onClick={() => navigate(`/application-review?id=${applicant.id}`)}
                      >
                        📝 Review Candidate Now
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Documents */}
          {activeTab === "documents" && (
            <div className="ap-tab-panel">
              <div className="ap-docs-grid">
                {applicant.documents?.map((doc, idx) => (
                  <div key={idx} className="ap-doc-card">
                    <div className="ap-doc-icon">📄</div>
                    <div className="ap-doc-meta">
                      <div className="ap-doc-name">{doc.name}</div>
                      <div className="ap-doc-size">{doc.size} • PDF Document</div>
                      <div className="ap-doc-status">
                        {doc.verified ? (
                          <span className="ap-doc-verified">✓ Verified Authentic</span>
                        ) : (
                          <span className="ap-doc-unverified">⚠️ Pending Verification</span>
                        )}
                      </div>
                    </div>
                    <div className="ap-doc-actions">
                      <button
                        className="ap-btn-verify"
                        onClick={() => handleToggleDocVerify(doc.name)}
                      >
                        {doc.verified ? "Mark Unverified" : "Mark Verified"}
                      </button>
                      <button
                        className="ap-btn-preview"
                        onClick={() => setDocModal(doc)}
                      >
                        👁️ Preview
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Decision & Enrollment */}
          {activeTab === "decision" && (
            <div className="ap-tab-panel">
              <div className="ap-card-grid">
                <div className="ap-detail-card">
                  <div className="ap-card-title">
                    <span>⚖️</span> Official Admission Decision
                  </div>
                  {applicant.admissionDecision ? (
                    <div className="ap-info-list">
                      <div className="ap-info-row">
                        <span>Decision Outcome</span>
                        <strong className="text-emerald font-bold" style={{ fontSize: "1.1rem" }}>
                          {applicant.admissionDecision.decision}
                        </strong>
                      </div>
                      <div className="ap-info-row">
                        <span>Assigned Class</span>
                        <strong>{applicant.admissionDecision.assignedClass}</strong>
                      </div>
                      <div className="ap-info-row">
                        <span>Allocated House</span>
                        <strong>{applicant.admissionDecision.house}</strong>
                      </div>
                      <div className="ap-info-row">
                        <span>Reporting Date</span>
                        <strong>{applicant.admissionDecision.reportingDate}</strong>
                      </div>
                      <div className="ap-info-row">
                        <span>Tuition Deposit Required</span>
                        <strong className="text-emerald font-mono">
                          {applicant.admissionDecision.tuitionDeposit}
                        </strong>
                      </div>
                      <div className="ap-info-row">
                        <span>Scholarship / Bursary</span>
                        <strong>{applicant.admissionDecision.scholarshipAward}</strong>
                      </div>
                    </div>
                  ) : (
                    <div className="ap-unscored-box">
                      <p>No formal admission decision recorded yet.</p>
                      <button
                        className="ap-btn-action ap-btn-decide"
                        onClick={() => navigate(`/admission-decisions?id=${applicant.id}`)}
                      >
                        ⚖️ Record Decision
                      </button>
                    </div>
                  )}
                </div>

                <div className="ap-detail-card">
                  <div className="ap-card-title">
                    <span>🎓</span> Matriculation & Enrollment Status
                  </div>
                  {applicant.enrollment ? (
                    <div className="ap-info-list">
                      <div className="ap-info-row">
                        <span>Enrollment Status</span>
                        <strong className="text-cyan font-bold">{applicant.enrollment.status}</strong>
                      </div>
                      <div className="ap-info-row">
                        <span>Permanent Student ID</span>
                        <strong className="font-mono text-emerald" style={{ fontSize: "1.1rem" }}>
                          {applicant.enrollment.generatedStudentId}
                        </strong>
                      </div>
                      <div className="ap-info-row">
                        <span>Class Roll Number</span>
                        <strong>{applicant.enrollment.rollNumber}</strong>
                      </div>
                      <div className="ap-info-row">
                        <span>Tuition Deposit Cleared</span>
                        <strong>{applicant.enrollment.tuitionDepositPaid ? "✓ Cleared (GH₵2,500.00)" : "Pending"}</strong>
                      </div>
                      <div className="ap-info-row">
                        <span>Medical Clearance</span>
                        <strong>{applicant.enrollment.medicalClearanceReceived ? "✓ Certified" : "Pending"}</strong>
                      </div>
                    </div>
                  ) : (
                    <div className="ap-unscored-box">
                      <p>Candidate is not yet enrolled into active student rosters.</p>
                      {applicant.status === "Accepted" && (
                        <button
                          className="ap-btn-action ap-btn-letter"
                          onClick={() => navigate(`/enrollment-confirmation?id=${applicant.id}`)}
                        >
                          🎓 Confirm Enrollment
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Document Preview Simulation Modal */}
      {docModal && (
        <div className="ap-modal-backdrop" onClick={() => setDocModal(null)}>
          <div className="ap-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="ap-modal-header">
              <h3>Document Verification Preview</h3>
              <button onClick={() => setDocModal(null)}>✕</button>
            </div>
            <div className="ap-modal-body">
              <div className="ap-mock-doc-preview">
                <div className="ap-doc-header-seal">ST. MARY INTERNATIONAL ACADEMY • VERIFICATION</div>
                <h4>{docModal.name}</h4>
                <p>File Size: {docModal.size} • Security Hash: SHA256-AUTHENTIC-DOCUMENT</p>
                <div className="ap-doc-mock-sheet">
                  <div className="ap-doc-line" style={{ width: "80%" }}></div>
                  <div className="ap-doc-line" style={{ width: "95%" }}></div>
                  <div className="ap-doc-line" style={{ width: "70%" }}></div>
                  <div className="ap-doc-line" style={{ width: "90%" }}></div>
                  <div className="ap-doc-line" style={{ width: "60%" }}></div>
                  <div className="ap-doc-stamp-box">
                    STAMPED & VERIFIED BY ADMISSIONS REGISTRY
                  </div>
                </div>
              </div>
            </div>
            <div className="ap-modal-footer">
              <button
                className="ap-btn-verify"
                onClick={() => {
                  handleToggleDocVerify(docModal.name);
                  setDocModal(null);
                }}
              >
                {docModal.verified ? "Mark as Unverified" : "Approve & Mark Verified"}
              </button>
              <button className="ap-btn-close" onClick={() => setDocModal(null)}>
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
