import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdmissionNav from "./AdmissionNav";
import { getApplicants, saveApplicants } from "./admissionData";
import "./ApplicationForm.css";

const GRADES = [
  "Grade 10",
  "Grade 11",
  "Grade 12",
  "Grade 8",
  "Grade 7",
  "Grade 9",
];

const STREAMS = [
  "General Science",
  "Business & Accounting",
  "General Arts & Literature",
  "Visual Arts & Design",
  "Middle School Division",
];

export default function ApplicationForm() {
  const navigate = useNavigate();

  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("Female");
  const [dob, setDob] = useState("2010-05-12");
  const [nationality, setNationality] = useState("Ghanaian");
  const [nationalId, setNationalId] = useState("GHA-7821094-3");
  const [targetGrade, setTargetGrade] = useState("Grade 10");
  const [stream, setStream] = useState("General Science");
  const [boardingStatus, setBoardingStatus] = useState("Boarding Student");
  const [previousSchool, setPreviousSchool] = useState("");
  const [beceAggregate, setBeceAggregate] = useState("8");
  const [guardianName, setGuardianName] = useState("");
  const [guardianRelation, setGuardianRelation] = useState("Father");
  const [guardianPhone, setGuardianPhone] = useState("+233 24 000 0000");
  const [guardianEmail, setGuardianEmail] = useState("");
  const [address, setAddress] = useState("");
  const [birthCertFile, setBirthCertFile] = useState("");
  const [transcriptFile, setTranscriptFile] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("MTN Mobile Money");
  const [submittedApp, setSubmittedApp] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmitApplication = (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !previousSchool.trim() || !guardianName.trim()) {
      showToast("Please fill in all mandatory candidate and guardian details.");
      return;
    }

    const newId = `APP-2026-${String(Math.floor(Math.random() * 800 + 150))}`;
    const newApplicant = {
      id: newId,
      fullName: `${firstName.trim()} ${lastName.trim()}`,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      gender,
      dob,
      nationality,
      nationalId,
      targetGrade,
      stream,
      academicYear: "2026/2027",
      boardingStatus,
      previousSchool: previousSchool.trim(),
      entryExamScore: Math.floor(Math.random() * 20 + 75),
      beceAggregate: Number(beceAggregate) || null,
      guardianName: guardianName.trim(),
      guardianRelation,
      guardianPhone,
      guardianEmail: guardianEmail || `${firstName.toLowerCase()}@guardian.gh`,
      address: address.trim() || "Accra, Ghana",
      applicationFeePaid: true,
      applicationFeeAmount: "GH₵250.00",
      feeReceipt: `RCP-ADM-${Math.floor(Math.random() * 8000 + 1000)}`,
      submissionDate: new Date().toISOString().split("T")[0],
      status: "Pending Review",
      reviewScores: null,
      admissionDecision: null,
      enrollment: null,
      documents: [
        { name: birthCertFile || "Birth_Certificate_Scan.pdf", size: "1.2 MB", verified: false },
        { name: transcriptFile || "Previous_School_Transcript.pdf", size: "2.1 MB", verified: false },
      ],
    };

    const currentApplicants = getApplicants();
    const updated = [newApplicant, ...currentApplicants];
    saveApplicants(updated);

    setSubmittedApp(newApplicant);
    showToast(`Application ${newApplicant.id} registered and GH₵250.00 fee processed!`);
  };

  return (
    <div className="af-page-container">
      {toast && (
        <div className="af-toast">
          <span>✓</span> {toast}
        </div>
      )}

      <AdmissionNav
        title="Prospective Candidate Enrollment Application"
        subtitle="Submit candidate bio-data, academic records, guardian contacts, and process admission screening fees"
        badge="Admission Module • Screen 2 of 9"
      />

      {/* Confirmation Success Card */}
      {submittedApp ? (
        <div className="af-success-card">
          <div className="af-success-icon">🎉</div>
          <h2>Application Successfully Registered!</h2>
          <p>
            The prospective candidate application has been assigned reference ID:{" "}
            <strong className="font-mono text-cyan">{submittedApp.id}</strong>.
          </p>
          <div className="af-receipt-summary">
            <div>Candidate: <strong>{submittedApp.fullName}</strong></div>
            <div>Target Level: <strong>{submittedApp.targetGrade} — {submittedApp.stream}</strong></div>
            <div>Processing Fee: <strong className="text-emerald">GH₵250.00 (PAID)</strong></div>
            <div>Voucher Ref: <span className="font-mono">{submittedApp.feeReceipt}</span></div>
          </div>
          <div className="af-success-actions">
            <button
              className="af-btn-view-profile"
              onClick={() => navigate(`/applicant-profile?id=${submittedApp.id}`)}
            >
              👤 View Applicant Dossier
            </button>
            <button
              className="af-btn-another"
              onClick={() => {
                setSubmittedApp(null);
                setFirstName("");
                setLastName("");
                setPreviousSchool("");
                setGuardianName("");
              }}
            >
              ➕ Register Another Candidate
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmitApplication} className="af-form-card">
          <div className="af-form-header">
            <span className="af-tag">OFFICIAL ADMISSIONS PORTAL</span>
            <h2>Prospective Student Application Form</h2>
            <p>Academic Year 2026/2027 Intake • St. Mary International Academy</p>
          </div>

          {/* Section 1: Candidate Bio-Data */}
          <div className="af-section-title">
            <span>👤</span> Candidate Personal & Demographic Details
          </div>

          <div className="af-form-row">
            <div className="af-form-group">
              <label>First / Given Name *</label>
              <input
                type="text"
                placeholder="e.g. Abena"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="af-form-group">
              <label>Last / Family Name *</label>
              <input
                type="text"
                placeholder="e.g. Prempeh"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="af-form-row">
            <div className="af-form-group">
              <label>Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>
            <div className="af-form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
              />
            </div>
            <div className="af-form-group">
              <label>Nationality</label>
              <input
                type="text"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                required
              />
            </div>
            <div className="af-form-group">
              <label>Ghana Card / ID</label>
              <input
                type="text"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Section 2: Target Academic Stream */}
          <div className="af-section-title">
            <span>🎓</span> Academic Program & Entry Level Preference
          </div>

          <div className="af-form-row">
            <div className="af-form-group">
              <label>Entry Grade / Form *</label>
              <select
                value={targetGrade}
                onChange={(e) => setTargetGrade(e.target.value)}
              >
                {GRADES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div className="af-form-group">
              <label>Academic Discipline Stream *</label>
              <select
                value={stream}
                onChange={(e) => setStream(e.target.value)}
              >
                {STREAMS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="af-form-group">
              <label>Boarding / Residency Option</label>
              <select
                value={boardingStatus}
                onChange={(e) => setBoardingStatus(e.target.value)}
              >
                <option value="Boarding Student">Boarding Student (Campus House)</option>
                <option value="Day Student">Day Student (Campus Commuter)</option>
              </select>
            </div>
          </div>

          {/* Section 3: Previous Academic History */}
          <div className="af-section-title">
            <span>📚</span> Previous Academic Institution & Transcripts
          </div>

          <div className="af-form-row">
            <div className="af-form-group" style={{ flex: 2 }}>
              <label>Previous School Name & Location *</label>
              <input
                type="text"
                placeholder="e.g. Achimota Basic School, Accra"
                value={previousSchool}
                onChange={(e) => setPreviousSchool(e.target.value)}
                required
              />
            </div>
            <div className="af-form-group">
              <label>BECE / Entrance Aggregate (1-36)</label>
              <input
                type="number"
                min={6}
                max={36}
                value={beceAggregate}
                onChange={(e) => setBeceAggregate(e.target.value)}
              />
            </div>
          </div>

          {/* Section 4: Parent / Guardian Details */}
          <div className="af-section-title">
            <span>👨‍👩‍👧</span> Parent & Guardian Contact Information
          </div>

          <div className="af-form-row">
            <div className="af-form-group">
              <label>Primary Guardian Full Name *</label>
              <input
                type="text"
                placeholder="e.g. Nana Osei Prempeh"
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                required
              />
            </div>
            <div className="af-form-group">
              <label>Relationship to Candidate</label>
              <select
                value={guardianRelation}
                onChange={(e) => setGuardianRelation(e.target.value)}
              >
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Legal Guardian">Legal Guardian</option>
                <option value="Sponsor">Corporate Sponsor</option>
              </select>
            </div>
            <div className="af-form-group">
              <label>Mobile Contact (+233...)</label>
              <input
                type="text"
                value={guardianPhone}
                onChange={(e) => setGuardianPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="af-form-row">
            <div className="af-form-group">
              <label>Guardian Email Address</label>
              <input
                type="email"
                placeholder="guardian@example.com"
                value={guardianEmail}
                onChange={(e) => setGuardianEmail(e.target.value)}
              />
            </div>
            <div className="af-form-group" style={{ flex: 2 }}>
              <label>Residential Physical Address</label>
              <input
                type="text"
                placeholder="Street address, neighborhood, city"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          {/* Section 5: Supporting Documents Simulation */}
          <div className="af-section-title">
            <span>📎</span> Supporting Document Scans (.PDF / .JPG)
          </div>

          <div className="af-form-row">
            <div className="af-form-group">
              <label>Birth Certificate Scan:</label>
              <input
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setBirthCertFile(e.target.files[0].name);
                  }
                }}
              />
              {birthCertFile && <span className="af-file-hint">✅ {birthCertFile}</span>}
            </div>

            <div className="af-form-group">
              <label>Academic Transcript / BECE Slip:</label>
              <input
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setTranscriptFile(e.target.files[0].name);
                  }
                }}
              />
              {transcriptFile && <span className="af-file-hint">✅ {transcriptFile}</span>}
            </div>
          </div>

          {/* Section 6: Application Processing Fee (GH₵250.00) */}
          <div className="af-section-title">
            <span>💳</span> Application Screening Fee (GH₵250.00)
          </div>

          <div className="af-fee-box">
            <div className="af-fee-details">
              <strong>Institutional Assessment Fee:</strong>
              <div className="af-fee-amount font-mono">GH₵250.00</div>
              <small>Non-refundable processing, entrance exam booklet and interview docket</small>
            </div>

            <div className="af-payment-methods">
              <label>Select Mobile Money / Card Rail:</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="MTN Mobile Money">MTN Mobile Money (Merchant: 408819)</option>
                <option value="Telecel Cash">Telecel Cash (*110# Voucher)</option>
                <option value="Bank Visa / Mastercard">Bank Debit Card (GH Direct Pay)</option>
              </select>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="af-form-actions">
            <button
              type="button"
              className="af-btn-cancel"
              onClick={() => navigate("/admissions-dashboard")}
            >
              Cancel
            </button>
            <button type="submit" className="af-btn-submit">
              🚀 Submit Application & Process GH₵250.00
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
