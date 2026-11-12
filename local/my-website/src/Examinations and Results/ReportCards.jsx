import React, { useState } from "react";
import "./ReportCards.css";
import ExamNav from "./ExamNav";
import { getMarks } from "./examData";
import SpinningWordsBackground from "../components/SpinningWordsBackground";
import DailyQuotePopupModal from "../components/DailyQuotePopupModal";

const STUDENTS_FOR_REPORTS = [
  {
    id: "STU-SMIA-002",
    name: "Kwame Mensah",
    roll: "11A-04",
    gender: "Male",
    class: "Grade 11-A (Science Track)",
    house: "Nkrumah House (Gold)",
    attendanceDays: "64 / 65 Days",
    rank: "1st out of 28",
    aggregate: "6 Units (WASSCE Distinction)",
    promotionVerdict: "PROMOTED TO SHS 3 WITH HIGHEST HONOURS",
    teacherRemark: "Kwame exhibits an extraordinary grasp of scientific concepts and mathematics. A natural peer leader and exceptional scholar.",
    principalRemark: "An outstanding term result. Keep up the high intellectual standards and continue to lead with humility.",
  },
  {
    id: "STU-SMIA-001",
    name: "Elena Rostova",
    roll: "11A-01",
    gender: "Female",
    class: "Grade 11-A (Science Track)",
    house: "Mandela House (Blue)",
    attendanceDays: "63 / 65 Days",
    rank: "2nd out of 28",
    aggregate: "6 Units (WASSCE Distinction)",
    promotionVerdict: "PROMOTED TO SHS 3 WITH DISTINCTION",
    teacherRemark: "Elena's dedication and analytical problem solving are a tremendous asset to the class. Superb laboratory performance.",
    principalRemark: "Exemplary academic achievement and admirable leadership in campus academic society.",
  },
  {
    id: "STU-SMIA-004",
    name: "Ama Serwaa",
    roll: "11A-09",
    gender: "Female",
    class: "Grade 11-A (Science Track)",
    house: "Kofi Annan House (Green)",
    attendanceDays: "62 / 65 Days",
    rank: "3rd out of 28",
    aggregate: "7 Units (High Credit)",
    promotionVerdict: "PROMOTED TO SHS 3 WITH HONOURS",
    teacherRemark: "Remarkable dedication across all STEM courses. Consistent accuracy in calculations and chemistry practical experiments.",
    principalRemark: "Well done Ama. A highly commendable terminal performance.",
  },
];

export default function ReportCards() {
  const [selectedStudentId, setSelectedStudentId] = useState(STUDENTS_FOR_REPORTS[0].id);
  const [selectedTerm, setSelectedTerm] = useState("Term 1");
  const [academicYear, setAcademicYear] = useState("2026 / 2027");
  const [nextTermBegins, setNextTermBegins] = useState("January 12, 2027");
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const student = STUDENTS_FOR_REPORTS.find((s) => s.id === selectedStudentId) || STUDENTS_FOR_REPORTS[0];
  const allMarks = getMarks();
  const studentMarks = allMarks.filter((m) => m.studentId === student.id && m.isPublished);

  const totalObtained = studentMarks.reduce((acc, curr) => acc + curr.totalScore, 0);
  const maxPossible = studentMarks.length * 100;
  const overallAverage = studentMarks.length ? (totalObtained / studentMarks.length).toFixed(1) : "0.0";

  return (
    <div className="rc-page-wrapper">
      <SpinningWordsBackground speed="slow" />
      <DailyQuotePopupModal />

      {toastMessage && <div className="rc-toast">✓ {toastMessage}</div>}

      <ExamNav
        title="Report Cards"
        subtitle="Generate, preview and print official student terminal academic reports with WAEC grading breakdown"
        badge="Screen 9 of 12"
      />

      {/* Control Action Strip */}
      <div className="rc-control-bar">
        <div className="rc-control-left">
          <div className="rc-field">
            <label>Student Report Card</label>
            <select
              className="rc-select"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
            >
              {STUDENTS_FOR_REPORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.roll} • {s.class})
                </option>
              ))}
            </select>
          </div>

          <div className="rc-field">
            <label>Report Term</label>
            <select
              className="rc-select"
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
            >
              <option value="Term 1">Term 1 (Michaelmas Term)</option>
              <option value="Term 2">Term 2 (Lent Term)</option>
              <option value="Term 3">Term 3 (Trinity Term)</option>
            </select>
          </div>
        </div>

        <div className="rc-control-actions">
          <button
            type="button"
            className="rc-btn rc-btn-print"
            onClick={() => window.print()}
          >
            🖨️ Print Report Card
          </button>
          <button
            type="button"
            className="rc-btn rc-btn-batch"
            onClick={() => showToast(`Batch exporting PDF report cards for all 28 students in ${student.class}...`)}
          >
            📦 Batch PDF Export (Class)
          </button>
          <button
            type="button"
            className="rc-btn rc-btn-email"
            onClick={() => showToast(`Report card emailed to ${student.name}'s guardian!`)}
          >
            📧 Dispatch to Guardian
          </button>
        </div>
      </div>

      {/* Printable Report Card Document */}
      <div className="rc-sheet-container">
        {/* Report Card Header */}
        <div className="rc-doc-header">
          <div className="rc-school-crest">🎓</div>
          <div className="rc-school-info">
            <h1 className="rc-school-name">ST. MARY INTERNATIONAL ACADEMY</h1>
            <p className="rc-school-motto">"Veritas • Scientia • Virtus" — Excellence in Character and Learning</p>
            <p className="rc-school-address">
              Kensington Central Campus, P.O. Box CT 4091, Cantonments • Tel: +233 24 551 0922 • Web: www.stmarys.edu
            </p>
            <div className="rc-report-term-title">
              OFFICIAL TERMINAL STUDENT PROGRESS REPORT • {selectedTerm.toUpperCase()}, {academicYear}
            </div>
          </div>
        </div>

        {/* Student Particulars Matrix */}
        <div className="rc-student-details-grid">
          <div className="rc-info-cell">
            <span className="rc-cell-label">Candidate Name:</span>
            <strong className="rc-cell-val">{student.name}</strong>
          </div>
          <div className="rc-info-cell">
            <span className="rc-cell-label">Student ID:</span>
            <strong className="rc-cell-val rc-font-mono">{student.id}</strong>
          </div>
          <div className="rc-info-cell">
            <span className="rc-cell-label">Class / Form:</span>
            <strong className="rc-cell-val">{student.class}</strong>
          </div>
          <div className="rc-info-cell">
            <span className="rc-cell-label">Roll Number:</span>
            <strong className="rc-cell-val rc-font-mono">{student.roll}</strong>
          </div>
          <div className="rc-info-cell">
            <span className="rc-cell-label">House Affiliation:</span>
            <strong className="rc-cell-val">{student.house}</strong>
          </div>
          <div className="rc-info-cell">
            <span className="rc-cell-label">Term Attendance:</span>
            <strong className="rc-cell-val">{student.attendanceDays}</strong>
          </div>
          <div className="rc-info-cell">
            <span className="rc-cell-label">Class Position:</span>
            <strong className="rc-cell-val" style={{ color: "#f59e0b" }}>{student.rank}</strong>
          </div>
          <div className="rc-info-cell">
            <span className="rc-cell-label">Next Term Resumes:</span>
            <strong className="rc-cell-val">{nextTermBegins}</strong>
          </div>
        </div>

        {/* Academic Marks Table */}
        <div className="rc-marks-section">
          <table className="rc-marks-table">
            <thead>
              <tr>
                <th style={{ width: "28%" }}>Subject & Curriculum Code</th>
                <th>Class Work (30)</th>
                <th>Mid-Term (20)</th>
                <th>Exam (50)</th>
                <th>Total (100)</th>
                <th>Grade</th>
                <th>GPA</th>
                <th>Pos.</th>
                <th>Instructor Remark</th>
              </tr>
            </thead>
            <tbody>
              {studentMarks.map((m) => (
                <tr key={m.id}>
                  <td>
                    <strong>{m.subject}</strong>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>{m.subjectCode}</div>
                  </td>
                  <td>{m.classScore}</td>
                  <td>{m.midTermScore}</td>
                  <td><strong>{m.examScore}</strong></td>
                  <td><strong style={{ color: "#0284c7" }}>{m.totalScore}</strong></td>
                  <td>
                    <span className="rc-grade-tag">{m.grade}</span>
                  </td>
                  <td>{m.gpaPoint.toFixed(2)}</td>
                  <td>#{m.positionInSubject}</td>
                  <td className="rc-remark-cell">"{m.remark}"</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Aggregate & Performance Summary */}
        <div className="rc-summary-strip">
          <div className="rc-summary-box">
            <span>Total Marks:</span>
            <strong>{totalObtained} / {maxPossible}</strong>
          </div>
          <div className="rc-summary-box">
            <span>Overall Average:</span>
            <strong>{overallAverage}%</strong>
          </div>
          <div className="rc-summary-box">
            <span>WASSCE Aggregate:</span>
            <strong style={{ color: "#10b981" }}>{student.aggregate}</strong>
          </div>
          <div className="rc-summary-box">
            <span>Promotion Verdict:</span>
            <strong style={{ color: "#0284c7" }}>{student.promotionVerdict}</strong>
          </div>
        </div>

        {/* Qualitative Remarks & Signatures Section */}
        <div className="rc-remarks-grid">
          <div className="rc-remark-block">
            <div className="rc-block-title">Form Master / Class Tutor's Assessment</div>
            <p className="rc-block-body">"{student.teacherRemark}"</p>
            <div className="rc-sign-line">
              <span>Tutor: <strong>Dr. Jonathan Miller (HOD Science)</strong></span>
              <span>Date: <strong>11 Nov 2026</strong></span>
            </div>
          </div>

          <div className="rc-remark-block">
            <div className="rc-block-title">Head Principal's Signature & Official School Stamp</div>
            <p className="rc-block-body">"{student.principalRemark}"</p>
            <div className="rc-stamp-row">
              <div className="rc-stamp-graphic">
                <span>ACADEMIC BOARD</span>
                <span>SEALED</span>
              </div>
              <div className="rc-sign-line">
                <span>Principal: <strong>Dame Eleanor Vance, Ph.D.</strong></span>
                <span>Cleared: <strong>Term 1 Certified</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
