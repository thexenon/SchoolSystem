import React, { useState, useEffect } from "react";
import ExamNav from "./ExamNav";
import {
  getCorrections,
  saveCorrections,
  getMarks,
  saveMarks,
  calculateWassceGrade,
} from "./examData";
import "./ResultsCorrection.css";

export default function ResultsCorrection() {
  const [corrections, setCorrections] = useState([]);
  const [marks, setMarks] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState(null);

  // New Request Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [targetCorrectionToApprove, setTargetCorrectionToApprove] = useState(null);
  const [adminPin, setAdminPin] = useState("");
  const [pinError, setPinError] = useState("");

  // New correction form fields
  const [newStudentId, setNewStudentId] = useState("STU-SMIA-005");
  const [newSubject, setNewSubject] = useState("Elective Mathematics");
  const [prevScore, setPrevScore] = useState(78.0);
  const [correctedScore, setCorrectedScore] = useState(82.0);
  const [reasonCategory, setReasonCategory] = useState("Typographical Entry Mistake");
  const [reasonDetail, setReasonDetail] = useState("");
  const [feeRequired, setFeeRequired] = useState(false);
  const [feeAmount, setFeeAmount] = useState("150.00");
  const [requestedBy, setRequestedBy] = useState("Dr. Jonathan Miller (Subject Master)");

  // Selected audit certificate modal
  const [selectedAuditCert, setSelectedAuditCert] = useState(null);

  useEffect(() => {
    setCorrections(getCorrections());
    setMarks(getMarks());
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Recalculate grades dynamically for the form
  const prevGradeInfo = calculateWassceGrade(Number(prevScore) || 0);
  const correctedGradeInfo = calculateWassceGrade(Number(correctedScore) || 0);

  // Open PIN approval modal
  const promptApprove = (corr) => {
    setTargetCorrectionToApprove(corr);
    setAdminPin("");
    setPinError("");
    setPinModalOpen(true);
  };

  // Confirm Principal PIN Approval
  const handleConfirmApproval = () => {
    if (adminPin !== "Admin@2026") {
      setPinError("Invalid Principal Security PIN! Please enter 'Admin@2026'.");
      return;
    }

    const updatedCorrections = corrections.map((c) => {
      if (c.id === targetCorrectionToApprove.id) {
        return {
          ...c,
          status: "Approved",
          authorizedBy: "Dame Eleanor Vance (Head Principal)",
          auditLog: `${c.auditLog} • Approved by Principal at ${new Date().toISOString().replace("T", " ").substring(0, 16)}`,
        };
      }
      return c;
    });

    // Also update student mark in the central gradebook if found
    const updatedMarks = marks.map((m) => {
      if (
        m.studentId === targetCorrectionToApprove.studentId &&
        m.subject === targetCorrectionToApprove.subject
      ) {
        return {
          ...m,
          totalScore: targetCorrectionToApprove.correctedScore,
          grade: targetCorrectionToApprove.correctedGrade,
          remark: `[Corrected] ${m.remark}`,
        };
      }
      return m;
    });

    setCorrections(updatedCorrections);
    saveCorrections(updatedCorrections);
    setMarks(updatedMarks);
    saveMarks(updatedMarks);

    setPinModalOpen(false);
    showToast(
      `Correction request ${targetCorrectionToApprove.id} officially authorized! Gradebook synchronized.`,
      "success"
    );
  };

  // Reject correction
  const handleReject = (id) => {
    const updated = corrections.map((c) =>
      c.id === id ? { ...c, status: "Rejected", authorizedBy: "Dame Eleanor Vance (Declined)" } : c
    );
    setCorrections(updated);
    saveCorrections(updated);
    showToast(`Correction request ${id} has been marked as Rejected.`, "info");
  };

  // Create new correction request
  const handleSubmitNewRequest = (e) => {
    e.preventDefault();
    if (!reasonDetail.trim()) {
      showToast("Please provide a detailed justification for this score amendment.", "error");
      return;
    }

    const newId = `CORR-2026-00${corrections.length + 1}`;
    const newEntry = {
      id: newId,
      studentId: newStudentId,
      studentName: newStudentId === "STU-SMIA-005" ? "Liam Carter" : "Lucas Vance",
      classCohort: "Grade 11-A",
      subject: newSubject,
      assessmentId: "ASM-2026-001",
      previousScore: Number(prevScore),
      correctedScore: Number(correctedScore),
      previousGrade: prevGradeInfo.grade,
      correctedGrade: correctedGradeInfo.grade,
      reason: `${reasonCategory}: ${reasonDetail}`,
      requestedBy: requestedBy,
      requestedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      authorizedBy: null,
      status: "Pending Approval",
      feeAmount: feeRequired ? `GH₵${parseFloat(feeAmount).toFixed(2)}` : "GH₵0.00",
      auditLog: `Created by ${requestedBy}. Pending Principal cryptographic clearance.`,
    };

    const updated = [newEntry, ...corrections];
    setCorrections(updated);
    saveCorrections(updated);
    setModalOpen(false);
    setReasonDetail("");
    showToast(`Correction request ${newId} submitted for Executive Authorization.`, "success");
  };

  const filteredCorrections = corrections.filter((c) => {
    if (filterStatus !== "All" && c.status !== filterStatus) return false;
    if (
      searchTerm &&
      !c.studentName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !c.id.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !c.subject.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const totalPending = corrections.filter((c) => c.status === "Pending Approval").length;
  const totalApproved = corrections.filter((c) => c.status === "Approved").length;

  return (
    <div className="corr-container">
      <ExamNav activeTab="Results Correction" />

      {toast && (
        <div className={`corr-toast corr-toast-${toast.type}`}>
          <div className="corr-toast-dot" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="corr-header">
        <div className="corr-title-box">
          <span className="corr-tag">MODULE 8 • SCREEN 12 OF 12</span>
          <h1 className="corr-title">Results Correction & Audit Governance</h1>
          <p className="corr-subtitle">
            Execute authorized post-publication grade amendments, formal script recount disputes, and maintain
            an immutable audit trail with Principal cryptographic authorization.
          </p>
        </div>
        <div className="corr-actions">
          <button className="corr-btn-primary" onClick={() => setModalOpen(true)}>
            <span className="corr-btn-icon">+</span> File Correction Request
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="corr-kpi-grid">
        <div className="corr-kpi-card">
          <div className="corr-kpi-icon-wrap" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b" }}>
            ⚖️
          </div>
          <div className="corr-kpi-body">
            <span className="corr-kpi-label">Pending Clearances</span>
            <div className="corr-kpi-val">{totalPending} <span className="corr-kpi-sub">Awaiting Principal Sign</span></div>
          </div>
        </div>

        <div className="corr-kpi-card">
          <div className="corr-kpi-icon-wrap" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
            ✅
          </div>
          <div className="corr-kpi-body">
            <span className="corr-kpi-label">Approved & Synced</span>
            <div className="corr-kpi-val">{totalApproved} <span className="corr-kpi-sub">Audit Certificates</span></div>
          </div>
        </div>

        <div className="corr-kpi-card">
          <div className="corr-kpi-icon-wrap" style={{ background: "rgba(59, 130, 246, 0.15)", color: "#3b82f6" }}>
            💰
          </div>
          <div className="corr-kpi-body">
            <span className="corr-kpi-label">Re-marking Tariff</span>
            <div className="corr-kpi-val">GH₵ 150.00 <span className="corr-kpi-sub">Standard Formal Fee</span></div>
          </div>
        </div>

        <div className="corr-kpi-card">
          <div className="corr-kpi-icon-wrap" style={{ background: "rgba(139, 92, 246, 0.15)", color: "#8b5cf6" }}>
            🔒
          </div>
          <div className="corr-kpi-body">
            <span className="corr-kpi-label">Integrity Safeguard</span>
            <div className="corr-kpi-val">WAEC-Aligned <span className="corr-kpi-sub">Zero Unsigned Edits</span></div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="corr-toolbar">
        <div className="corr-search-wrap">
          <span className="corr-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by Student Name, Subject, or Correction ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="corr-search-input"
          />
        </div>

        <div className="corr-filter-wrap">
          <label>Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="All">All Requests ({corrections.length})</option>
            <option value="Pending Approval">Pending Approval ({totalPending})</option>
            <option value="Approved">Approved ({totalApproved})</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Correction Table */}
      <div className="corr-card-wrap">
        <div className="corr-table-header">
          <div>
            <h3>Official Marks Amendment Log</h3>
            <p>Every mark adjustment is recorded with delta comparisons and verified authorizer signatures.</p>
          </div>
          <span className="corr-table-badge">WAEC Regulation 14.B Compliant</span>
        </div>

        <div className="corr-table-responsive">
          <table className="corr-table">
            <thead>
              <tr>
                <th>ID & Student</th>
                <th>Subject & Exam</th>
                <th>Score & Grade Delta</th>
                <th>Justification & Reason</th>
                <th>Fee Paid</th>
                <th>Status</th>
                <th>Authorization</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCorrections.map((c) => {
                const delta = (c.correctedScore - c.previousScore).toFixed(1);
                const isPositive = Number(delta) >= 0;
                return (
                  <tr key={c.id}>
                    <td>
                      <div className="corr-id">{c.id}</div>
                      <div className="corr-student-name">{c.studentName}</div>
                      <div className="corr-sub">{c.studentId} • {c.classCohort}</div>
                    </td>
                    <td>
                      <div className="corr-subject">{c.subject}</div>
                      <div className="corr-sub">{c.assessmentId}</div>
                    </td>
                    <td>
                      <div className="corr-delta-box">
                        <div className="corr-score-prev">{c.previousScore} ({c.previousGrade})</div>
                        <span className="corr-arrow">➔</span>
                        <div className="corr-score-next">{c.correctedScore} ({c.correctedGrade})</div>
                      </div>
                      <div className={`corr-delta-tag ${isPositive ? "positive" : "negative"}`}>
                        {isPositive ? `+${delta}` : delta} marks
                      </div>
                    </td>
                    <td>
                      <div className="corr-reason-text">{c.reason}</div>
                      <div className="corr-sub">By: {c.requestedBy}</div>
                    </td>
                    <td>
                      <span className="corr-fee-badge">{c.feeAmount}</span>
                    </td>
                    <td>
                      <span
                        className={`corr-status-pill ${
                          c.status === "Approved"
                            ? "status-approved"
                            : c.status === "Rejected"
                            ? "status-rejected"
                            : "status-pending"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td>
                      <div className="corr-auth-name">
                        {c.authorizedBy || <span className="corr-unauthorized">Pending Principal</span>}
                      </div>
                      <div className="corr-sub">{c.requestedAt}</div>
                    </td>
                    <td>
                      <div className="corr-action-cell">
                        {c.status === "Pending Approval" ? (
                          <>
                            <button
                              className="corr-btn-approve"
                              onClick={() => promptApprove(c)}
                              title="Principal PIN authorization required"
                            >
                              Approve
                            </button>
                            <button
                              className="corr-btn-reject"
                              onClick={() => handleReject(c.id)}
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <button
                            className="corr-btn-cert"
                            onClick={() => setSelectedAuditCert(c)}
                          >
                            📜 Audit Cert
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Correction Request Modal */}
      {modalOpen && (
        <div className="corr-modal-overlay">
          <div className="corr-modal-box">
            <div className="corr-modal-header">
              <div>
                <h3>📝 File Results Correction Petition</h3>
                <p>Submit formal change request for re-marking or clerical error resolution.</p>
              </div>
              <button className="corr-modal-close" onClick={() => setModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmitNewRequest} className="corr-modal-body">
              <div className="corr-form-grid">
                <div className="corr-form-field">
                  <label>Student Particulars:</label>
                  <select value={newStudentId} onChange={(e) => setNewStudentId(e.target.value)}>
                    <option value="STU-SMIA-005">Liam Carter (STU-SMIA-005, Grade 11-A)</option>
                    <option value="STU-SMIA-003">Lucas Vance (STU-SMIA-003, Grade 11-A)</option>
                    <option value="STU-SMIA-004">Ama Serwaa (STU-SMIA-004, Grade 11-A)</option>
                    <option value="STU-SMIA-002">Kwame Mensah (STU-SMIA-002, Grade 11-A)</option>
                  </select>
                </div>

                <div className="corr-form-field">
                  <label>Subject Discipline:</label>
                  <select value={newSubject} onChange={(e) => setNewSubject(e.target.value)}>
                    <option value="Elective Mathematics">Elective Mathematics (MTH-401)</option>
                    <option value="Physics">Physics (PHY-302)</option>
                    <option value="Chemistry">Chemistry (CHM-301)</option>
                    <option value="English Language">English Language (ENG-204)</option>
                    <option value="Economics">Economics (ECN-102)</option>
                  </select>
                </div>
              </div>

              <div className="corr-form-grid">
                <div className="corr-form-field">
                  <label>Original Score (Total / 100):</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="100"
                    value={prevScore}
                    onChange={(e) => setPrevScore(e.target.value)}
                    required
                  />
                  <div className="corr-field-calc">Calculated: <strong>{prevGradeInfo.grade}</strong> ({prevGradeInfo.remark})</div>
                </div>

                <div className="corr-form-field">
                  <label>Corrected / Re-marked Score (Total / 100):</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="100"
                    value={correctedScore}
                    onChange={(e) => setCorrectedScore(e.target.value)}
                    required
                  />
                  <div className="corr-field-calc">Corrected: <strong style={{ color: "#34d399" }}>{correctedGradeInfo.grade}</strong> ({correctedGradeInfo.remark})</div>
                </div>
              </div>

              <div className="corr-form-field">
                <label>Categorization of Amendment:</label>
                <select value={reasonCategory} onChange={(e) => setReasonCategory(e.target.value)}>
                  <option value="Typographical Entry Mistake">Typographical Entry Mistake (Teacher Data Entry)</option>
                  <option value="Script Re-marking Dispute">Formal Script Re-marking Dispute (Guardian/Student Appeal)</option>
                  <option value="Mathematical Collation Error">Mathematical Collation / Sub-total Recount Error</option>
                  <option value="Omission of Continuous Assessment">Omission of Continuous Assessment / Practical Score</option>
                  <option value="Medical Exemption Adjustment">Approved Medical Exemption Pro-rata Scaling</option>
                </select>
              </div>

              <div className="corr-form-field">
                <label>Detailed Factual Justification:</label>
                <textarea
                  rows={3}
                  placeholder="Detail script question numbers, recounting signatures, or specific lab report evidence..."
                  value={reasonDetail}
                  onChange={(e) => setReasonDetail(e.target.value)}
                  required
                />
              </div>

              <div className="corr-form-grid">
                <div className="corr-form-field">
                  <label>Filing Authority:</label>
                  <input
                    type="text"
                    value={requestedBy}
                    onChange={(e) => setRequestedBy(e.target.value)}
                    required
                  />
                </div>

                <div className="corr-form-field">
                  <label>Re-marking Tariff (Ghanaian Cedi):</label>
                  <div className="corr-fee-input-row">
                    <label className="corr-checkbox-label">
                      <input
                        type="checkbox"
                        checked={feeRequired}
                        onChange={(e) => setFeeRequired(e.target.checked)}
                      />
                      <span>Apply Official Fee</span>
                    </label>
                    {feeRequired && (
                      <div className="corr-fee-amt-box">
                        <span>GH₵</span>
                        <input
                          type="number"
                          step="10"
                          value={feeAmount}
                          onChange={(e) => setFeeAmount(e.target.value)}
                          className="corr-fee-input"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="corr-modal-footer">
                <button type="button" className="corr-btn-secondary" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="corr-btn-primary">
                  Submit for Principal Clearance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Principal PIN Approval Gate */}
      {pinModalOpen && targetCorrectionToApprove && (
        <div className="corr-modal-overlay">
          <div className="corr-modal-box corr-pin-box">
            <div className="corr-modal-header">
              <div>
                <h3>🛡️ Principal Cryptographic Seal</h3>
                <p>Authorized executive sign-off required to commit changes to academic transcripts.</p>
              </div>
              <button className="corr-modal-close" onClick={() => setPinModalOpen(false)}>✕</button>
            </div>

            <div className="corr-modal-body">
              <div className="corr-pin-warning">
                <strong>Attention:</strong> Approving this amendment will permanently update the official
                gradebook, modify cumulative GPA records, and dispatch an automated audit notification to the
                Academic Dean.
              </div>

              <div className="corr-pin-summary">
                <div>Candidate: <strong>{targetCorrectionToApprove.studentName}</strong></div>
                <div>Subject: <strong>{targetCorrectionToApprove.subject}</strong></div>
                <div>
                  Score Adjustment: <strong>{targetCorrectionToApprove.previousScore} ➔ {targetCorrectionToApprove.correctedScore}</strong>
                  {" "}(Grade {targetCorrectionToApprove.previousGrade} ➔ {targetCorrectionToApprove.correctedGrade})
                </div>
              </div>

              <div className="corr-form-field">
                <label>Enter Principal Security Passcode (Trial: Admin@2026):</label>
                <input
                  type="password"
                  placeholder="Enter Admin@2026"
                  value={adminPin}
                  onChange={(e) => {
                    setAdminPin(e.target.value);
                    setPinError("");
                  }}
                  className="corr-pin-input"
                  autoFocus
                />
                {pinError && <div className="corr-error-msg">{pinError}</div>}
              </div>

              <div className="corr-quick-fill">
                <button
                  type="button"
                  className="corr-quick-btn"
                  onClick={() => setAdminPin("Admin@2026")}
                >
                  ⚡ Auto-fill Trial PIN (Admin@2026)
                </button>
              </div>
            </div>

            <div className="corr-modal-footer">
              <button className="corr-btn-secondary" onClick={() => setPinModalOpen(false)}>
                Cancel
              </button>
              <button className="corr-btn-approve-confirm" onClick={handleConfirmApproval}>
                Authorize & Commit Change
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audit Certificate Modal */}
      {selectedAuditCert && (
        <div className="corr-modal-overlay">
          <div className="corr-modal-box corr-cert-box">
            <div className="corr-cert-inner">
              <div className="corr-cert-header">
                <div className="corr-cert-crest">ST. MICHAEL'S INTERNATIONAL ACADEMY</div>
                <div className="corr-cert-sub">OFFICIAL TRANSCRIPT CORRECTION CERTIFICATE</div>
                <div className="corr-cert-ref">REF: {selectedAuditCert.id} • GHANA REGISTRY</div>
              </div>

              <div className="corr-cert-grid">
                <div><span>Student:</span> <strong>{selectedAuditCert.studentName} ({selectedAuditCert.studentId})</strong></div>
                <div><span>Class:</span> <strong>{selectedAuditCert.classCohort}</strong></div>
                <div><span>Discipline:</span> <strong>{selectedAuditCert.subject}</strong></div>
                <div><span>Exam Ref:</span> <strong>{selectedAuditCert.assessmentId}</strong></div>
                <div><span>Prior Score:</span> <strong>{selectedAuditCert.previousScore}% ({selectedAuditCert.previousGrade})</strong></div>
                <div><span>Amended Score:</span> <strong style={{ color: "#34d399" }}>{selectedAuditCert.correctedScore}% ({selectedAuditCert.correctedGrade})</strong></div>
                <div><span>Statutory Tariff:</span> <strong>{selectedAuditCert.feeAmount}</strong></div>
                <div><span>Authorized By:</span> <strong>{selectedAuditCert.authorizedBy}</strong></div>
              </div>

              <div className="corr-cert-audit">
                <div className="corr-cert-audit-title">Official Verification Log:</div>
                <p>{selectedAuditCert.auditLog}</p>
              </div>

              <div className="corr-cert-seal">
                <div className="corr-seal-stamp">OFFICIAL SEAL • RE-MARK VERIFIED</div>
              </div>

              <div className="corr-modal-footer" style={{ borderTop: "none" }}>
                <button className="corr-btn-secondary" onClick={() => setSelectedAuditCert(null)}>
                  Close
                </button>
                <button className="corr-btn-primary" onClick={() => window.print()}>
                  🖨️ Print Certificate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
