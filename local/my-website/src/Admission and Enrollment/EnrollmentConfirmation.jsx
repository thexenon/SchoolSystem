import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AdmissionNav from "./AdmissionNav";
import { getApplicants, saveApplicants } from "./admissionData";
import "./EnrollmentConfirmation.css";

export default function EnrollmentConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [toast, setToast] = useState(null);

  // Clearance checklist state
  const [tuitionPaid, setTuitionPaid] = useState(true);
  const [medicalClearance, setMedicalClearance] = useState(true);
  const [conductSigned, setConductSigned] = useState(true);
  const [documentsVerified, setDocumentsVerified] = useState(true);
  const [paymentRef, setPaymentRef] = useState("DEP-GH-2026-9041");

  useEffect(() => {
    const list = getApplicants();
    setApplicants(list);

    const params = new URLSearchParams(location.search);
    const queryId = params.get("id");
    const acceptedCandidates = list.filter((a) => a.status === "Accepted");

    if (queryId && list.some((a) => a.id === queryId)) {
      setSelectedId(queryId);
    } else if (acceptedCandidates.length > 0) {
      setSelectedId(acceptedCandidates[0].id);
    } else if (list.length > 0) {
      setSelectedId(list[0].id);
    }
  }, [location.search]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSelectCandidate = (id) => {
    setSelectedId(id);
    navigate(`/enrollment-confirmation?id=${id}`);
  };

  const currentApplicant = applicants.find((a) => a.id === selectedId) || applicants[0];

  const handleConfirmEnrollment = (e) => {
    e.preventDefault();
    if (!currentApplicant) return;

    if (!tuitionPaid || !medicalClearance || !conductSigned) {
      showToast("All clearance conditions must be satisfied prior to student matriculation.");
      return;
    }

    const randomSuffix = Math.floor(Math.random() * 800 + 100);
    const newStudentId = `STU-SMIA-${randomSuffix}`;
    const gradeCode = currentApplicant.targetGrade.replace("Grade ", "");
    const rollNum = `${gradeCode}A-${Math.floor(Math.random() * 25 + 1)}`;

    const enrollmentRecord = {
      status: "Enrolled",
      enrolledDate: new Date().toISOString().split("T")[0],
      generatedStudentId: newStudentId,
      rollNumber: rollNum,
      tuitionDepositPaid: tuitionPaid,
      tuitionDepositRef: paymentRef,
      medicalClearanceReceived: medicalClearance,
      codeOfConductSigned: conductSigned,
    };

    const updated = applicants.map((a) =>
      a.id === currentApplicant.id
        ? {
            ...a,
            status: "Accepted",
            enrollment: enrollmentRecord,
          }
        : a
    );

    saveApplicants(updated);
    setApplicants(updated);
    showToast(`Matriculation complete! Student ID: ${newStudentId} issued to ${currentApplicant.fullName}`);
  };

  const enrolledStudents = applicants.filter((a) => a.enrollment && a.enrollment.status === "Enrolled");
  const pendingMatriculation = applicants.filter((a) => a.status === "Accepted" && (!a.enrollment || a.enrollment.status !== "Enrolled"));

  return (
    <div className="ec-page-container">
      {toast && (
        <div className="ec-toast">
          <span>✓</span> {toast}
        </div>
      )}

      <AdmissionNav
        title="Student Enrollment & Matriculation"
        subtitle="Verify clearance criteria, confirm tuition deposits in Ghanaian Cedi, and issue official Student IDs"
        badge="Admission Module • Screen 8 of 9"
      />

      <div className="ec-content-wrap">
        {/* Metric Badges */}
        <div className="ec-metrics-row">
          <div className="ec-metric-card">
            <span className="ec-metric-icon">🎓</span>
            <div>
              <div className="ec-metric-num">{enrolledStudents.length}</div>
              <div className="ec-metric-lbl">Fully Matriculated Students</div>
            </div>
          </div>

          <div className="ec-metric-card">
            <span className="ec-metric-icon">⏳</span>
            <div>
              <div className="ec-metric-num">{pendingMatriculation.length}</div>
              <div className="ec-metric-lbl">Awaiting Clearance Confirmation</div>
            </div>
          </div>

          <div className="ec-metric-card">
            <span className="ec-metric-icon">💰</span>
            <div>
              <div className="ec-metric-num text-emerald font-mono">
                GH₵{(enrolledStudents.length * 2500).toLocaleString()}
              </div>
              <div className="ec-metric-lbl">Tuition Deposits Cleared (GH₵2,500 ea)</div>
            </div>
          </div>
        </div>

        {/* Selection & Matriculation Workspace */}
        <div className="ec-grid-workspace">
          {/* Column 1: Candidate Verification & Clearance Form */}
          <div className="ec-form-card">
            <div className="ec-card-header">
              <span className="ec-tag">CLEARANCE CONSOLE</span>
              <h3>Matriculate Accepted Candidate</h3>
              <p>Select candidate to confirm compliance and generate permanent Student ID.</p>
            </div>

            <div className="ec-field">
              <label>Select Accepted Candidate:</label>
              <select
                value={currentApplicant?.id || ""}
                onChange={(e) => handleSelectCandidate(e.target.value)}
              >
                {applicants
                  .filter((a) => a.status === "Accepted")
                  .map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.fullName} — {a.id} ({a.enrollment?.status === "Enrolled" ? "✓ Already Enrolled" : "Pending"})
                    </option>
                  ))}
              </select>
            </div>

            {currentApplicant && (
              <>
                <div className="ec-candidate-snippet">
                  <div className="ec-avatar">
                    {currentApplicant.gender === "Female" ? "👩" : "👨"}
                  </div>
                  <div className="ec-cand-info">
                    <strong>{currentApplicant.fullName}</strong>
                    <div className="ec-cand-meta">
                      Ref: <span className="font-mono">{currentApplicant.id}</span> • Class:{" "}
                      {currentApplicant.admissionDecision?.assignedClass || currentApplicant.targetGrade}
                    </div>
                    <div className="ec-cand-house">
                      House: {currentApplicant.admissionDecision?.house || "St. Patrick"}
                    </div>
                  </div>
                </div>

                {/* Checklist Verification */}
                <form onSubmit={handleConfirmEnrollment}>
                  <div className="ec-checklist-title">
                    <span>📋</span> Institutional Clearance Checklist
                  </div>

                  <div className="ec-checklist">
                    <label className="ec-check-item">
                      <input
                        type="checkbox"
                        checked={tuitionPaid}
                        onChange={(e) => setTuitionPaid(e.target.checked)}
                      />
                      <div className="ec-check-text">
                        <strong>Tuition & Boarding Deposit Clearance (GH₵2,500.00)</strong>
                        <p>Paid into school bank account or MoMo merchant (Transaction verified)</p>
                      </div>
                    </label>

                    {tuitionPaid && (
                      <div className="ec-subfield">
                        <label>Bank / MoMo Transaction Receipt Ref:</label>
                        <input
                          type="text"
                          value={paymentRef}
                          onChange={(e) => setPaymentRef(e.target.value)}
                          required
                        />
                      </div>
                    )}

                    <label className="ec-check-item">
                      <input
                        type="checkbox"
                        checked={medicalClearance}
                        onChange={(e) => setMedicalClearance(e.target.checked)}
                      />
                      <div className="ec-check-text">
                        <strong>Medical Examination & Immunization Docket</strong>
                        <p>Certified healthy for academic and sports participation</p>
                      </div>
                    </label>

                    <label className="ec-check-item">
                      <input
                        type="checkbox"
                        checked={conductSigned}
                        onChange={(e) => setConductSigned(e.target.checked)}
                      />
                      <div className="ec-check-text">
                        <strong>Signed Code of Conduct & Honor Undertaking</strong>
                        <p>Duly endorsed by candidate and legal parent/guardian</p>
                      </div>
                    </label>

                    <label className="ec-check-item">
                      <input
                        type="checkbox"
                        checked={documentsVerified}
                        onChange={(e) => setDocumentsVerified(e.target.checked)}
                      />
                      <div className="ec-check-text">
                        <strong>Original Certificates & BECE Slip Inspection</strong>
                        <p>Certified authentic and cross-referenced with records</p>
                      </div>
                    </label>
                  </div>

                  <div className="ec-submit-wrap">
                    {currentApplicant.enrollment?.status === "Enrolled" ? (
                      <div className="ec-enrolled-badge-box">
                        <span className="ec-check-icon">✓</span>
                        <div>
                          <strong>Candidate Already Matriculated</strong>
                          <p>
                            Student ID:{" "}
                            <span className="font-mono text-cyan">
                              {currentApplicant.enrollment.generatedStudentId}
                            </span>{" "}
                            • Roll: {currentApplicant.enrollment.rollNumber}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <button type="submit" className="ec-btn-enroll-action">
                        🎓 Matriculate & Issue Student ID
                      </button>
                    )}
                  </div>
                </form>
              </>
            )}
          </div>

          {/* Column 2: Roster of Matriculated Students */}
          <div className="ec-roster-card">
            <div className="ec-card-header">
              <span className="ec-tag">ACTIVE ROSTER</span>
              <h3>Matriculated Student Registry</h3>
              <p>Candidates admitted and assigned permanent student credentials.</p>
            </div>

            <div className="ec-roster-list">
              {enrolledStudents.length === 0 ? (
                <div className="ec-roster-empty">
                  No candidates have been matriculated yet.
                </div>
              ) : (
                enrolledStudents.map((stu) => (
                  <div key={stu.id} className="ec-stu-card">
                    <div className="ec-stu-header">
                      <div className="ec-stu-avatar">
                        {stu.gender === "Female" ? "👩" : "👨"}
                      </div>
                      <div className="ec-stu-details">
                        <h4>{stu.fullName}</h4>
                        <div className="ec-stu-id-tag font-mono">
                          {stu.enrollment?.generatedStudentId}
                        </div>
                      </div>
                      <span className="ec-roll-badge font-mono">
                        {stu.enrollment?.rollNumber}
                      </span>
                    </div>

                    <div className="ec-stu-info-grid">
                      <div>
                        <span>Class:</span> {stu.admissionDecision?.assignedClass || stu.targetGrade}
                      </div>
                      <div>
                        <span>House:</span> {stu.admissionDecision?.house || "St. Patrick"}
                      </div>
                      <div>
                        <span>Deposit:</span> <strong className="text-emerald">GH₵2,500.00 Paid</strong>
                      </div>
                      <div>
                        <span>Enrolled On:</span> {stu.enrollment?.enrolledDate}
                      </div>
                    </div>

                    <div className="ec-stu-actions">
                      <button
                        className="ec-btn-mini"
                        onClick={() => navigate(`/applicant-profile?id=${stu.id}`)}
                      >
                        👤 Dossier
                      </button>
                      <button
                        className="ec-btn-mini ec-btn-badge"
                        onClick={() => navigate(`/admission-letters?id=${stu.id}`)}
                      >
                        📜 Offer Letter
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
