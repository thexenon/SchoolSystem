import React, { useState, useEffect } from "react";
import ParentNav from "./ParentNav";
import {
  getActiveParent,
  LINKED_CHILDREN,
  getActiveChildId,
  CHILD_RESULTS_DATA,
} from "./parentData";
import "./ChildResults.css";

export default function ChildResults() {
  const parent = getActiveParent();
  const [activeChildId, setActiveChildId] = useState(getActiveChildId());

  useEffect(() => {
    const handleChildChanged = () => {
      setActiveChildId(getActiveChildId());
    };
    window.addEventListener("childChanged", handleChildChanged);
    return () => window.removeEventListener("childChanged", handleChildChanged);
  }, []);

  const parentChildren = LINKED_CHILDREN.filter((c) =>
    parent.linkedStudentIds.includes(c.id)
  );

  const child =
    parentChildren.find((c) => c.id === activeChildId) || parentChildren[0];

  const results = CHILD_RESULTS_DATA[child.id] || null;

  return (
    <div className="cr-container">
      <ParentNav
        title="Terminal Examination Results & Report Cards"
        subtitle="Review approved grades, subject master evaluations, and official verified terminal transcripts"
        badge="Module 11 • Screen 5 of 10"
      />

      {/* Header Banner */}
      <div className="cr-header no-print">
        <div className="cr-title-box">
          <span className="cr-tag">ACADEMIC ASSESSMENT REGISTRY</span>
          <h1 className="cr-title">{child.fullName}'s Report Card</h1>
          <p className="cr-subtitle">
            Authenticated terminal examination transcripts certified by the Academic Board of Examiners.
            Includes continuous assessment marks, final paper scores, class rank, and Head Principal's seal.
          </p>
        </div>

        <div className="cr-actions">
          <button className="cr-btn-print" onClick={() => window.print()}>
            🖨️ Print Terminal Report Card
          </button>
        </div>
      </div>

      {results ? (
        /* Printable Report Card Sheet */
        <div className="cr-report-sheet" id="printable-report-card">
          {/* Header Letterhead */}
          <div className="cr-sheet-header">
            <div className="cr-crest-wrap">
              <div className="cr-crest-circle">SMIA</div>
              <div>
                <h2 className="cr-school-name">ST. MICHAEL'S INTERNATIONAL ACADEMY</h2>
                <p className="cr-school-motto">"Excellence, Integrity & Leadership" • Founded 1988</p>
                <p className="cr-school-loc">Ridge Residential Area, Accra, Ghana • Tel: +233 30 200 4488</p>
              </div>
            </div>

            <div className="cr-sheet-meta-box">
              <span className="cr-terminal-badge">OFFICIAL TERMINAL TRANSCRIPT</span>
              <div className="cr-term-name">{results.term}</div>
              <div className="cr-cohort-name">Cohort: <strong>{results.cohort}</strong></div>
              <div className="cr-publish-date">Published: <strong>November 15, 2026</strong></div>
            </div>
          </div>

          {/* Student Particulars Bar */}
          <div className="cr-student-particulars">
            <div className="cr-part-col">
              <span className="cr-part-label">STUDENT NAME:</span>
              <strong className="cr-part-val">{child.fullName}</strong>
              <small>Student ID: {child.id}</small>
            </div>
            <div className="cr-part-col">
              <span className="cr-part-label">ROLL & DIVISION:</span>
              <strong className="cr-part-val">Roll No: {child.rollNumber}</strong>
              <small>{child.campus} • {child.residentialStatus}</small>
            </div>
            <div className="cr-part-col">
              <span className="cr-part-label">PARENT / GUARDIAN:</span>
              <strong className="cr-part-val">{parent.fullName}</strong>
              <small>Tel: {parent.phone}</small>
            </div>
            <div className="cr-part-col highlight">
              <span className="cr-part-label">OVERALL CLASS RANK:</span>
              <strong className="cr-rank-val">{results.classRank}</strong>
              <small>Cumulative GPA: {results.gpa} / 4.00</small>
            </div>
          </div>

          {/* Academic Standing Cards */}
          <div className="cr-kpi-summary-strip">
            <div className="cr-kpi-pill">
              <span>Cumulative GPA</span>
              <strong>{results.gpa}</strong>
            </div>
            <div className="cr-kpi-pill">
              <span>Overall Letter Grade</span>
              <strong style={{ color: "#047857" }}>{results.overallGrade}</strong>
            </div>
            <div className="cr-kpi-pill">
              <span>Total Composite Marks</span>
              <strong>{results.totalMarks}</strong>
            </div>
            <div className="cr-kpi-pill">
              <span>Presence Rate</span>
              <strong style={{ color: "#047857" }}>{child.attendanceRate}%</strong>
            </div>
          </div>

          {/* Subject Marks Table */}
          <table className="cr-marks-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Subject Name</th>
                <th>Class Assessment (30%)</th>
                <th>Terminal Exam (70%)</th>
                <th>Composite (100%)</th>
                <th>Grade</th>
                <th>Grade Point</th>
                <th>Subject Master Remarks</th>
              </tr>
            </thead>
            <tbody>
              {results.subjects.map((sub, idx) => (
                <tr key={idx}>
                  <td><code>{sub.code}</code></td>
                  <td><strong>{sub.name}</strong></td>
                  <td className="cr-num">{sub.classScore}</td>
                  <td className="cr-num">{sub.examScore}</td>
                  <td className="cr-num" style={{ fontWeight: 800, color: "#0f172a" }}>{sub.total}</td>
                  <td>
                    <span className={`cr-grade-tag grade-${sub.grade[0]}`}>{sub.grade}</span>
                  </td>
                  <td className="cr-num">{sub.points.toFixed(2)}</td>
                  <td className="cr-remarks-cell">{sub.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Remarks & Signatures */}
          <div className="cr-remarks-section">
            <div className="cr-remark-box">
              <h4>FORM TUTOR'S EVALUATIVE ATTESTATION:</h4>
              <p>
                "{child.fullName} has exhibited outstanding dedication to curriculum mastery and peer collaboration this term.
                Recommended for Advanced Honors Track next academic term."
              </p>
              <div className="cr-tutor-sign">
                <strong>{child.formTutor}</strong>
                <small>Senior Form Master</small>
              </div>
            </div>

            <div className="cr-remark-box">
              <h4>HEAD PRINCIPAL'S EXECUTIVE COMMENDATION:</h4>
              <p>"{results.conductReport}"</p>
              <div className="cr-tutor-sign">
                <strong>Dame Eleanor Vance, Ph.D.</strong>
                <small>Head Principal & Board Trustee</small>
              </div>
            </div>
          </div>

          {/* Official Seal Footer */}
          <div className="cr-sheet-footer">
            <div className="cr-grading-scale">
              <small>Grading Standard: A+ (90-100% / 4.00) • A (85-89% / 4.00) • A- (80-84% / 3.70) • B+ (75-79% / 3.50) • B (70-74% / 3.00)</small>
            </div>
            <div className="cr-seal-wrap">
              <div className="cr-seal-stamp">
                <span>ACADEMIC BOARD</span>
                <span>AUTHENTICATED</span>
                <span>TERM 1 • 2026</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="cr-empty-card">
          <p>No published examination transcripts found for {child.fullName}.</p>
        </div>
      )}
    </div>
  );
}
