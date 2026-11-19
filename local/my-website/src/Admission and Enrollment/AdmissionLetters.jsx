import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AdmissionNav from "./AdmissionNav";
import { getApplicants } from "./admissionData";
import "./AdmissionLetters.css";

export default function AdmissionLetters() {
  const location = useLocation();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [includeProspectus, setIncludeProspectus] = useState(true);
  const [customClosing, setCustomClosing] = useState(
    "We warmly congratulate you on your distinguished performance during our entrance evaluations and look forward to welcoming you into our scholarly fraternity."
  );

  useEffect(() => {
    const list = getApplicants();
    const acceptedList = list.filter((a) => a.status === "Accepted");
    setApplicants(list);

    const params = new URLSearchParams(location.search);
    const queryId = params.get("id");

    if (queryId && list.some((a) => a.id === queryId)) {
      setSelectedId(queryId);
    } else if (acceptedList.length > 0) {
      setSelectedId(acceptedList[0].id);
    } else if (list.length > 0) {
      setSelectedId(list[0].id);
    }
  }, [location.search]);

  const applicant = applicants.find((a) => a.id === selectedId) || applicants[0];
  const acceptedApplicants = applicants.filter((a) => a.status === "Accepted");

  if (!applicant) {
    return (
      <div className="al-page-container">
        <AdmissionNav
          title="Official Admission Letter Generator"
          subtitle="Generate, personalize, and certify institutional admission letters and enrollment packets"
          badge="Admission Module • Screen 7 of 9"
        />
        <div className="al-content-wrap">
          <p className="al-empty">No candidate records available.</p>
        </div>
      </div>
    );
  }

  const decision = applicant.admissionDecision || {
    decision: "Accepted",
    date: new Date().toISOString().split("T")[0],
    decidedBy: "Dame Eleanor Vance (Headmistress)",
    assignedClass: `${applicant.targetGrade}-A`,
    house: "St. Patrick (Green House)",
    reportingDate: "2027-01-12",
    tuitionDeposit: "GH₵2,500.00",
    scholarshipAward: "None",
  };

  const offerSerial = `SMIA/OFFER/2026/${applicant.id.replace("APP-2026-", "")}`;

  return (
    <div className="altr-page-container">
      {/* Top Navigation for Screen */}
      <div className="altr-no-print">
        <AdmissionNav
          title="Official Admission Letter Generator"
          subtitle="Generate, personalize, preview, and print formal matriculation offer letters and enrollment agreements"
          badge="Admission Module • Screen 7 of 9"
        />

        <div className="altr-controls-bar">
          <div className="altr-select-wrap">
            <label>Select Candidate:</label>
            <select
              value={applicant.id}
              onChange={(e) => {
                setSelectedId(e.target.value);
                navigate(`/admission-letters?id=${e.target.value}`);
              }}
            >
              <optgroup label="Accepted Candidates (Recommended)">
                {acceptedApplicants.map((a) => (
                  <option key={a.id} value={a.id}>
                    ✓ {a.fullName} — {a.id} ({a.targetGrade})
                  </option>
                ))}
              </optgroup>
              <optgroup label="Other Applicants">
                {applicants
                  .filter((a) => a.status !== "Accepted")
                  .map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.fullName} — {a.id} ({a.status})
                    </option>
                  ))}
              </optgroup>
            </select>
          </div>

          <div className="altr-toggles">
            <label className="altr-checkbox-label">
              <input
                type="checkbox"
                checked={includeProspectus}
                onChange={(e) => setIncludeProspectus(e.target.checked)}
              />
              Attach Prospectus & Fee Breakdown
            </label>
          </div>

          <div className="altr-actions">
            <button
              className="altr-btn-profile"
              onClick={() => navigate(`/applicant-profile?id=${applicant.id}`)}
            >
              👤 Profile
            </button>
            <button
              className="altr-btn-enroll"
              onClick={() => navigate(`/enrollment-confirmation?id=${applicant.id}`)}
            >
              🎓 Proceed to Enrollment
            </button>
            <button className="altr-btn-print" onClick={() => window.print()}>
              🖨️ Print / Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Official Certificate Letterhead Document */}
      <div className="altr-letter-sheet">
        {/* Institutional Letterhead */}
        <div className="altr-letterhead">
          <div className="altr-crest">
            <span className="altr-crest-icon">🛡️</span>
          </div>
          <div className="altr-school-details">
            <h1>ST. MARY INTERNATIONAL ACADEMY</h1>
            <p className="altr-motto">EXCELLENCE • INTEGRITY • LEADERSHIP</p>
            <p className="altr-address">
              P.O. Box AC 492, Airport Residential Area, Accra, Ghana • Tel: +233 30 277 8899
            </p>
            <p className="altr-web">admissions@stmary-academy.edu.gh • www.stmary-academy.edu.gh</p>
          </div>
          <div className="altr-serial-box">
            <div className="altr-serial-title">OFFICIAL OFFER NO.</div>
            <div className="altr-serial-val font-mono">{offerSerial}</div>
            <div className="altr-serial-date">Date: {decision.date || new Date().toLocaleDateString()}</div>
          </div>
        </div>

        <div className="altr-divider"></div>

        {/* Recipient Address */}
        <div className="altr-recipient">
          <p><strong>To:</strong> Master/Miss <strong>{applicant.fullName}</strong></p>
          <p><strong>C/O Guardian:</strong> {applicant.guardianName} ({applicant.guardianRelation})</p>
          <p><strong>Address:</strong> {applicant.address || "Airport Residential Area, Accra, Ghana"}</p>
          <p><strong>Ghana Card Ref:</strong> {applicant.nationalId}</p>
        </div>

        {/* Letter Heading */}
        <div className="altr-subject-line">
          PROVISIONAL OFFER OF ADMISSION: ACADEMIC YEAR 2026/2027
        </div>

        {/* Body Paragraphs */}
        <div className="altr-body-text">
          <p>
            Dear {applicant.firstName},
          </p>
          <p>
            On behalf of the Board of Governors, Academic Faculty, and the Admissions Selection Board of St. Mary International Academy, I am delighted to inform you that you have been offered provisional admission into <strong>{applicant.targetGrade} ({applicant.stream})</strong> for the 2026/2027 academic session.
          </p>
          <p>
            This offer follows your commendable academic credentials from <em>{applicant.previousSchool}</em>, your performance in our entrance diagnostic assessments ({applicant.entryExamScore}%), and your panel interview.
          </p>

          {/* Key Particulars Table */}
          <div className="altr-particulars-box">
            <table className="altr-part-table">
              <tbody>
                <tr>
                  <td>Candidate Full Name:</td>
                  <td><strong>{applicant.fullName}</strong></td>
                  <td>Application Ref:</td>
                  <td className="font-mono"><strong>{applicant.id}</strong></td>
                </tr>
                <tr>
                  <td>Assigned Class & Division:</td>
                  <td><strong>{decision.assignedClass}</strong></td>
                  <td>Residency Status:</td>
                  <td><strong>{applicant.boardingStatus}</strong></td>
                </tr>
                <tr>
                  <td>Allocated Residential House:</td>
                  <td><strong>{decision.house}</strong></td>
                  <td>Official Resumption Date:</td>
                  <td><strong>{decision.reportingDate}</strong></td>
                </tr>
                <tr>
                  <td>Standard Term Tuition Deposit:</td>
                  <td><strong className="text-emerald font-mono">{decision.tuitionDeposit}</strong></td>
                  <td>Bursary / Merit Award:</td>
                  <td><strong>{decision.scholarshipAward}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            {customClosing}
          </p>

          <div className="altr-conditions">
            <strong>Mandatory Conditions for Securing Your Placement:</strong>
            <ol>
              <li>
                <strong>Acceptance Deposit:</strong> A minimum commitment deposit of <strong>{decision.tuitionDeposit}</strong> must be paid via MTN Mobile Money or Bank Wire to the school's bursary within 14 calendar days to guarantee seat reservation.
              </li>
              <li>
                <strong>Health & Medical Certificate:</strong> Submission of a certified fitness and immunization docket by an accredited hospital or medical physician.
              </li>
              <li>
                <strong>Code of Conduct Undertaking:</strong> Formal ratification and return of the signed student & guardian code of discipline.
              </li>
            </ol>
          </div>
        </div>

        {/* Signatures & Seal */}
        <div className="altr-signature-section">
          <div className="altr-sign-block">
            <div className="altr-signature-img">Eleanor Vance</div>
            <div className="altr-sign-name">Dame Eleanor Vance, DBE, Ph.D.</div>
            <div className="altr-sign-title">Headmistress & Chair of Admissions</div>
            <div className="altr-sign-school">St. Mary International Academy</div>
          </div>

          <div className="altr-seal-block">
            <div className="altr-official-seal">
              <div className="altr-seal-inner">
                <span>OFFICIAL SEAL</span>
                <strong>ST. MARY</strong>
                <small>ACCRA • GHANA</small>
              </div>
            </div>
          </div>

          <div className="altr-sign-block">
            <div className="altr-signature-img">Gertrude Addo</div>
            <div className="altr-sign-name">Mrs. Gertrude Addo, M.Ed.</div>
            <div className="altr-sign-title">Academic Registrar</div>
            <div className="altr-sign-school">Office of Admissions & Records</div>
          </div>
        </div>

        {/* Optional Prospectus Tear-off Slip */}
        {includeProspectus && (
          <div className="altr-tear-off">
            <div className="altr-tear-line">
              ✂ — — — — — — — — — — — — — — ACCEPTANCE SLIP & BURSARY CONFIRMATION — — — — — — — — — — — — — — ✂
            </div>
            <div className="altr-tear-content">
              <p>
                I, <strong>{applicant.guardianName}</strong>, hereby formally accept the admission offer granted to my ward, <strong>{applicant.fullName}</strong> (Ref: {applicant.id}), and enclose payment receipt of <strong>{decision.tuitionDeposit}</strong>.
              </p>
              <div className="altr-tear-sign-row">
                <div>Guardian Signature: _______________________</div>
                <div>Date: _______________________</div>
                <div>Bank / MoMo Transaction Ref: _______________________</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
