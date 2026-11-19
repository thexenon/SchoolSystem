import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AdmissionNav from "./AdmissionNav";
import { getApplicants, saveApplicants } from "./admissionData";
import "./ApplicationReview.css";

export default function ApplicationReview() {
  const location = useLocation();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [toast, setToast] = useState(null);

  // Scoring rubric state
  const [academicScore, setAcademicScore] = useState(32);
  const [entranceExam, setEntranceExam] = useState(34);
  const [interviewScore, setInterviewScore] = useState(16);
  const [reviewer, setReviewer] = useState("Mrs. Gertrude Addo (Admissions Dean)");
  const [comments, setComments] = useState("");
  const [recommendation, setRecommendation] = useState("Acceptance");

  useEffect(() => {
    const list = getApplicants();
    setApplicants(list);

    const params = new URLSearchParams(location.search);
    const queryId = params.get("id");
    const target = queryId && list.some((a) => a.id === queryId) ? queryId : (list[0]?.id || "");
    setSelectedId(target);

    if (target) {
      loadApplicantData(target, list);
    }
  }, [location.search]);

  const loadApplicantData = (id, list) => {
    const app = list.find((a) => a.id === id);
    if (app && app.reviewScores) {
      setAcademicScore(app.reviewScores.academicScore || 30);
      setEntranceExam(app.reviewScores.entranceExam || 30);
      setInterviewScore(app.reviewScores.interviewScore || 15);
      setReviewer(app.reviewScores.reviewer || "Admissions Committee Member");
      setComments(app.reviewScores.comments || "");
    } else {
      setAcademicScore(30);
      setEntranceExam(app?.entryExamScore ? Math.round((app.entryExamScore / 100) * 40) : 32);
      setInterviewScore(15);
      setComments("");
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSelectApplicant = (id) => {
    setSelectedId(id);
    navigate(`/application-review?id=${id}`);
    loadApplicantData(id, applicants);
  };

  const currentApplicant = applicants.find((a) => a.id === selectedId) || applicants[0];
  const compositeRating = Number(academicScore) + Number(entranceExam) + Number(interviewScore);

  const handleSaveReview = (e) => {
    e.preventDefault();
    if (!currentApplicant) return;

    const updatedScores = {
      academicScore: Number(academicScore),
      entranceExam: Number(entranceExam),
      interviewScore: Number(interviewScore),
      compositeRating,
      reviewer,
      reviewDate: new Date().toISOString().split("T")[0],
      comments: comments.trim() || "Candidate demonstrates solid academic acumen and exemplary character.",
      recommendation,
    };

    const newStatus =
      currentApplicant.status === "Accepted"
        ? "Accepted"
        : recommendation === "Acceptance"
        ? "Under Review"
        : recommendation === "Waitlist"
        ? "Waitlisted"
        : "Under Review";

    const updated = applicants.map((a) =>
      a.id === currentApplicant.id
        ? {
            ...a,
            status: newStatus,
            reviewScores: updatedScores,
          }
        : a
    );

    saveApplicants(updated);
    setApplicants(updated);
    showToast(`Screening evaluation saved for ${currentApplicant.fullName}! Composite: ${compositeRating}/100`);
  };

  if (!currentApplicant) {
    return (
      <div className="ar-page-container">
        <AdmissionNav
          title="Candidate Screening & Faculty Evaluation"
          subtitle="Assess entrance examinations, past academic records, and panel interview scores"
          badge="Admission Module • Screen 5 of 9"
        />
        <div className="ar-content-wrap">
          <p className="ar-loading">No candidate records available for review.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ar-page-container">
      {toast && (
        <div className="ar-toast">
          <span>✓</span> {toast}
        </div>
      )}

      <AdmissionNav
        title="Candidate Screening & Faculty Evaluation"
        subtitle="Evaluate academic dossiers, calculate entrance rating weights, record panel remarks, and route candidates"
        badge="Admission Module • Screen 5 of 9"
      />

      <div className="ar-content-wrap">
        {/* Header Bar with Candidate Switcher */}
        <div className="ar-switcher-bar">
          <div className="ar-selector-wrap">
            <label>Reviewing Candidate:</label>
            <select
              value={currentApplicant.id}
              onChange={(e) => handleSelectApplicant(e.target.value)}
            >
              {applicants.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.fullName} — {a.id} ({a.targetGrade} • {a.status})
                </option>
              ))}
            </select>
          </div>

          <div className="ar-bar-actions">
            <button
              className="ar-btn-action ar-btn-profile"
              onClick={() => navigate(`/applicant-profile?id=${currentApplicant.id}`)}
            >
              👤 View Dossier
            </button>
            <button
              className="ar-btn-action ar-btn-decide"
              onClick={() => navigate(`/admission-decisions?id=${currentApplicant.id}`)}
            >
              ⚖️ Go to Decisions
            </button>
          </div>
        </div>

        {/* Candidate Context Card */}
        <div className="ar-candidate-card">
          <div className="ar-cand-left">
            <div className="ar-avatar">
              {currentApplicant.gender === "Female" ? "👩" : "👨"}
            </div>
            <div>
              <div className="ar-cand-badges">
                <span className="ar-id font-mono">{currentApplicant.id}</span>
                <span className="ar-level">{currentApplicant.targetGrade} • {currentApplicant.stream}</span>
                <span className="ar-status">{currentApplicant.status}</span>
              </div>
              <h3>{currentApplicant.fullName}</h3>
              <p className="ar-cand-sub">
                Previous School: <strong>{currentApplicant.previousSchool}</strong> • BECE Agg:{" "}
                <strong>{currentApplicant.beceAggregate || "N/A"}</strong> • Screening Exam:{" "}
                <strong>{currentApplicant.entryExamScore}%</strong>
              </p>
            </div>
          </div>

          <div className="ar-composite-badge">
            <div className="ar-comp-label">Calculated Score</div>
            <div className="ar-comp-num font-mono">{compositeRating}<span>/100</span></div>
            <div className="ar-comp-tier">
              {compositeRating >= 85
                ? "🌟 Tier 1 (Exemplary)"
                : compositeRating >= 70
                ? "👍 Tier 2 (Competitive)"
                : "⚠️ Tier 3 (Borderline)"}
            </div>
          </div>
        </div>

        {/* Scoring Form Grid */}
        <form onSubmit={handleSaveReview} className="ar-form-grid">
          {/* Column 1: Rubric Sliders & Inputs */}
          <div className="ar-rubric-card">
            <h4><span>📊</span> Standardized Admissions Scoring Rubric</h4>

            {/* Rubric Item 1: Academic Records */}
            <div className="ar-rubric-group">
              <div className="ar-rubric-header">
                <div>
                  <strong>1. Academic Records & Prior Transcript</strong>
                  <p>Quality of past grades, BECE transcript, subject proficiency</p>
                </div>
                <div className="ar-score-display font-mono">
                  {academicScore} <small>/ 40</small>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={academicScore}
                onChange={(e) => setAcademicScore(e.target.value)}
                className="ar-slider"
              />
              <div className="ar-slider-ticks">
                <span>0 (Poor)</span>
                <span>20 (Average)</span>
                <span>30 (Strong)</span>
                <span>40 (Flawless)</span>
              </div>
            </div>

            {/* Rubric Item 2: Entrance Screening Exam */}
            <div className="ar-rubric-group">
              <div className="ar-rubric-header">
                <div>
                  <strong>2. Institutional Screening Examination</strong>
                  <p>Standardized diagnostic test in Math, English, and Logic</p>
                </div>
                <div className="ar-score-display font-mono">
                  {entranceExam} <small>/ 40</small>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={entranceExam}
                onChange={(e) => setEntranceExam(e.target.value)}
                className="ar-slider"
              />
              <div className="ar-slider-ticks">
                <span>0</span>
                <span>20</span>
                <span>30</span>
                <span>40</span>
              </div>
            </div>

            {/* Rubric Item 3: Interview Rating */}
            <div className="ar-rubric-group">
              <div className="ar-rubric-header">
                <div>
                  <strong>3. Admissions Panel Interview</strong>
                  <p>Verbal articulation, discipline, maturity, school alignment</p>
                </div>
                <div className="ar-score-display font-mono">
                  {interviewScore} <small>/ 20</small>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                value={interviewScore}
                onChange={(e) => setInterviewScore(e.target.value)}
                className="ar-slider"
              />
              <div className="ar-slider-ticks">
                <span>0</span>
                <span>10</span>
                <span>15</span>
                <span>20</span>
              </div>
            </div>
          </div>

          {/* Column 2: Reviewer Notes & Recommendation */}
          <div className="ar-notes-card">
            <h4><span>✍️</span> Reviewer Appraisal & Committee Verdict</h4>

            <div className="ar-field">
              <label>Evaluating Staff / Committee Member:</label>
              <input
                type="text"
                value={reviewer}
                onChange={(e) => setReviewer(e.target.value)}
                required
              />
            </div>

            <div className="ar-field">
              <label>Admissions Panel Recommendation:</label>
              <select
                value={recommendation}
                onChange={(e) => setRecommendation(e.target.value)}
              >
                <option value="Acceptance">✅ Highly Recommended for Admission</option>
                <option value="Conditional">⚠️ Conditional Admission (Requires Remedial)</option>
                <option value="Waitlist">⏳ Place on Competitive Waitlist</option>
                <option value="Reject">❌ Not Recommended for Admission</option>
              </select>
            </div>

            <div className="ar-field">
              <label>Comprehensive Qualitative Assessment:</label>
              <textarea
                rows={5}
                placeholder="Enter observations on student's character, academic potential, strengths, and recommended house or stream placement..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                required
              />
            </div>

            <div className="ar-actions-row">
              <button
                type="button"
                className="ar-btn-reset"
                onClick={() => loadApplicantData(currentApplicant.id, applicants)}
              >
                Reset Scores
              </button>
              <button type="submit" className="ar-btn-save">
                💾 Save Faculty Assessment
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
