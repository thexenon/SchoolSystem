import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AssignmentNav from "./AssignmentNav";
import {
  getAssignments,
  getSubmissions,
  saveSubmissions,
  saveAssignments,
} from "./assignmentData";
import "./GradingAndFeedback.css";

export default function GradingAndFeedback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState(getAssignments());
  const [submissions, setSubmissions] = useState(getSubmissions());

  const initialSubId = searchParams.get("subId") || submissions[0]?.id || "";
  const [selectedSubId, setSelectedSubId] = useState(initialSubId);

  const activeSub = submissions.find((s) => s.id === selectedSubId) || submissions[0];
  const activeAsn = assignments.find((a) => a.id === activeSub?.assignmentId);

  // Grading form state
  const [awardedPoints, setAwardedPoints] = useState(activeSub?.gradePoints ?? 85);
  const [feedback, setFeedback] = useState(activeSub?.feedback || "");
  const [rubricScores, setRubricScores] = useState({});
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const idFromUrl = searchParams.get("subId");
    if (idFromUrl && idFromUrl !== selectedSubId) {
      setSelectedSubId(idFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    if (activeSub) {
      setAwardedPoints(activeSub.gradePoints !== null ? activeSub.gradePoints : 85);
      setFeedback(activeSub.feedback || "");

      // Initialize rubric
      if (activeAsn?.rubric) {
        const init = {};
        activeAsn.rubric.forEach((r, idx) => {
          init[idx] = Math.round(r.points * 0.9);
        });
        setRubricScores(init);
      }
    }
  }, [activeSub, activeAsn]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  const handleRubricScoreChange = (idx, maxVal, val) => {
    const numeric = Math.min(maxVal, Math.max(0, Number(val)));
    const updated = { ...rubricScores, [idx]: numeric };
    setRubricScores(updated);

    // Sum rubric scores into total awarded points
    const sum = Object.values(updated).reduce((a, b) => a + Number(b), 0);
    setAwardedPoints(sum);
  };

  const computeLetterGrade = (pts, max) => {
    if (!max) return "—";
    const pct = (pts / max) * 100;
    if (pct >= 90) return "A+";
    if (pct >= 85) return "A";
    if (pct >= 80) return "A-";
    if (pct >= 75) return "B+";
    if (pct >= 70) return "B";
    if (pct >= 60) return "C";
    return "F";
  };

  const handleSaveGrade = (e) => {
    e.preventDefault();
    if (!feedback.trim()) {
      showToast("Please provide qualitative comments and feedback for the student.");
      return;
    }

    const updatedSubmissions = submissions.map((sub) => {
      if (sub.id === activeSub.id) {
        return {
          ...sub,
          status: "Graded",
          gradePoints: Number(awardedPoints),
          feedback: feedback.trim(),
          gradedBy: activeAsn?.teacher || "Instructor",
          gradedAt: new Date().toLocaleString(),
        };
      }
      return sub;
    });

    setSubmissions(updatedSubmissions);
    saveSubmissions(updatedSubmissions);

    // Update assignment gradedCount
    const targetAsn = assignments.find((a) => a.id === activeSub.assignmentId);
    if (targetAsn && activeSub.status !== "Graded") {
      const updatedAssignments = assignments.map((a) => {
        if (a.id === targetAsn.id) {
          return { ...a, gradedCount: a.gradedCount + 1 };
        }
        return a;
      });
      setAssignments(updatedAssignments);
      saveAssignments(updatedAssignments);
    }

    showToast(`Official grade (${awardedPoints} pts) & feedback published to ${activeSub.studentName}!`);
    setTimeout(() => {
      navigate(`/submission-review?id=${activeSub.assignmentId}`);
    }, 1500);
  };

  if (!activeSub || !activeAsn) {
    return (
      <div className="gf-page-container">
        <AssignmentNav />
        <div className="gf-empty">No submission selected for grading.</div>
      </div>
    );
  }

  const letterGrade = computeLetterGrade(awardedPoints, activeAsn.maxPoints);

  return (
    <div className="gf-page-container">
      {toast && (
        <div className="gf-toast">
          <span>✓</span> {toast}
        </div>
      )}

      <AssignmentNav
        title="Faculty Assessment & Feedback Console"
        subtitle="Evaluate student submissions against analytical rubrics, enter awarded marks, and release detailed qualitative feedback"
        badge="Module 13 • Screen 6 of 7"
      />

      {/* Selectors Bar */}
      <div className="gf-top-bar">
        <div className="gf-sub-selector">
          <label>Selected Student Submission:</label>
          <select
            value={activeSub.id}
            onChange={(e) => {
              setSelectedSubId(e.target.value);
              navigate(`/grading-feedback?subId=${e.target.value}`);
            }}
          >
            {submissions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.studentName} ({s.rollNumber}) — {s.assignmentId} [{s.status}]
              </option>
            ))}
          </select>
        </div>

        <button
          className="gf-btn-back-queue"
          onClick={() => navigate(`/submission-review?id=${activeAsn.id}`)}
        >
          ← Return to Review Queue
        </button>
      </div>

      <div className="gf-layout-grid">
        {/* Left Column: Student Submission Dossier */}
        <div className="gf-panel gf-panel-left">
          <div className="gf-panel-header">
            <span className="gf-tag">SCHOLAR SUBMISSION ARTIFACT</span>
            <span className="gf-id-tag font-mono">{activeSub.id}</span>
          </div>

          <h2 className="gf-student-name">{activeSub.studentName}</h2>
          <div className="gf-student-meta">
            <span>Roll: <strong className="font-mono text-cyan">{activeSub.rollNumber}</strong></span>
            <span>•</span>
            <span>Class: <strong>{activeSub.grade}</strong></span>
            <span>•</span>
            <span>Turn-in: <strong>{activeSub.submittedAt}</strong></span>
          </div>

          {/* Assignment Banner */}
          <div className="gf-asn-banner">
            <span className="gf-asn-code font-mono">{activeAsn.subjectCode}</span>
            <div className="gf-asn-title">{activeAsn.title}</div>
            <div className="gf-asn-due">Deadline: {activeAsn.dueDate} at {activeAsn.dueTime}</div>
          </div>

          {/* Student Uploaded File Display */}
          <div className="gf-file-card">
            <div className="gf-file-icon">📄</div>
            <div className="gf-file-details">
              <div className="gf-file-name">{activeSub.fileUrl}</div>
              <div className="gf-file-size font-mono">{activeSub.fileSize} • {activeSub.punctuality}</div>
            </div>
            <button
              className="gf-btn-download-file"
              onClick={() => showToast(`Opening ${activeSub.fileUrl}...`)}
            >
              📥 Inspect File
            </button>
          </div>

          {/* Student Commentary */}
          {activeSub.studentNote && (
            <div className="gf-note-container">
              <h4>Scholar Commentary & Methodology Note:</h4>
              <p>"{activeSub.studentNote}"</p>
            </div>
          )}

          {/* Rubric Criteria Inspection */}
          <div className="gf-rubric-table-box">
            <h4>Assessment Rubric Criteria ({activeAsn.maxPoints} Total Points):</h4>
            <div className="gf-rubric-list">
              {activeAsn.rubric.map((r, idx) => (
                <div key={idx} className="gf-rubric-entry">
                  <div className="gf-re-left">
                    <strong>{r.criteria}</strong>
                    <small>Maximum: {r.points} Pts</small>
                  </div>
                  <div className="gf-re-right">
                    <input
                      type="number"
                      min={0}
                      max={r.points}
                      value={rubricScores[idx] || 0}
                      onChange={(e) =>
                        handleRubricScoreChange(idx, r.points, e.target.value)
                      }
                      className="gf-rubric-input font-mono"
                    />
                    <span className="font-mono">/ {r.points}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Grading Console & Qualitative Feedback */}
        <div className="gf-panel gf-panel-right">
          <div className="gf-panel-header">
            <span className="gf-tag">FACULTY SCORING & REMARKS</span>
            <span className="gf-status-pill">● {activeSub.status.toUpperCase()}</span>
          </div>

          <form onSubmit={handleSaveGrade} className="gf-grading-form">
            {/* Score Display Card */}
            <div className="gf-score-card">
              <div className="gf-score-input-wrap">
                <label>Total Awarded Score (out of {activeAsn.maxPoints}):</label>
                <div className="gf-score-number-row">
                  <input
                    type="number"
                    min={0}
                    max={activeAsn.maxPoints}
                    value={awardedPoints}
                    onChange={(e) => setAwardedPoints(Number(e.target.value))}
                    className="gf-main-score-input font-mono"
                    required
                  />
                  <span className="gf-max-pts font-mono">/ {activeAsn.maxPoints}</span>
                </div>
              </div>

              <div className="gf-grade-display-box">
                <span className="gf-gdb-label">Calculated Grade:</span>
                <div className="gf-gdb-val font-mono">{letterGrade}</div>
                <small className="gf-gdb-pct">
                  {Math.round((awardedPoints / activeAsn.maxPoints) * 100)}%
                </small>
              </div>
            </div>

            {/* Qualitative Feedback Textarea */}
            <div className="gf-form-group">
              <label>Detailed Teacher Feedback & Qualitative Appraisal *</label>
              <textarea
                rows={6}
                placeholder="Provide constructive academic feedback, highlight derivations, pinpoint areas for improvement, and encourage scholarly growth..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
              />
            </div>

            {/* Predefined Quick Feedback Tags */}
            <div className="gf-quick-tags">
              <span className="gf-quick-tag-label">Insert Quick Feedback:</span>
              <button
                type="button"
                className="gf-tag-btn"
                onClick={() => setFeedback((prev) => prev + " Exceptional clarity in mathematical derivations.")}
              >
                + Exceptional Derivations
              </button>
              <button
                type="button"
                className="gf-tag-btn"
                onClick={() => setFeedback((prev) => prev + " Check vector sign conventions in Step 4.")}
              >
                + Check Vector Signs
              </button>
              <button
                type="button"
                className="gf-tag-btn"
                onClick={() => setFeedback((prev) => prev + " Superb analytical discussion and error analysis.")}
              >
                + Superb Analysis
              </button>
            </div>

            {/* Submission Actions */}
            <div className="gf-form-actions">
              <button
                type="button"
                className="gf-btn-cancel"
                onClick={() => navigate(`/submission-review?id=${activeAsn.id}`)}
              >
                Cancel
              </button>
              <button type="submit" className="gf-btn-publish">
                ⭐ Publish Official Grade & Feedback
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
