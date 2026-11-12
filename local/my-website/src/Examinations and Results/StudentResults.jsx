import React, { useState } from "react";
import "./StudentResults.css";
import ExamNav from "./ExamNav";
import { getMarks } from "./examData";
import SpinningWordsBackground from "../components/SpinningWordsBackground";
import DailyQuotePopupModal from "../components/DailyQuotePopupModal";

const CANDIDATE_STUDENTS = [
  { id: "STU-SMIA-002", name: "Kwame Mensah", roll: "11A-04", class: "Grade 11-A (Science)", gpa: "3.98", rank: "1st in Class", attendance: "99%", conduct: "Exemplary scholar with acute intellectual rigor." },
  { id: "STU-SMIA-001", name: "Elena Rostova", roll: "11A-01", class: "Grade 11-A (Science)", gpa: "3.95", rank: "2nd in Class", attendance: "98%", conduct: "Outstanding analytical discipline and peer leadership." },
  { id: "STU-SMIA-004", name: "Ama Serwaa", roll: "11A-09", class: "Grade 11-A (Science)", gpa: "3.88", rank: "3rd in Class", attendance: "97%", conduct: "Persistent work ethic and brilliant laboratory aptitude." },
  { id: "STU-SMIA-003", name: "Lucas Vance", roll: "11A-07", class: "Grade 11-A (Science)", gpa: "3.75", rank: "4th in Class", attendance: "96%", conduct: "Creative engineer and strong problem solver." },
  { id: "STU-SMIA-005", name: "Liam Carter", roll: "11A-12", class: "Grade 11-A (Science)", gpa: "3.42", rank: "7th in Class", attendance: "94%", conduct: "Promising progress; encouraged to expand independent study." },
];

export default function StudentResults() {
  const [selectedStudentId, setSelectedStudentId] = useState(CANDIDATE_STUDENTS[0].id);
  const [selectedTerm, setSelectedTerm] = useState("Term 1");
  const [academicYear, setAcademicYear] = useState("2026 / 2027");
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const currentStudent = CANDIDATE_STUDENTS.find((s) => s.id === selectedStudentId) || CANDIDATE_STUDENTS[0];
  const allMarks = getMarks();

  // Get marks for this student
  const studentMarks = allMarks.filter((m) => m.studentId === currentStudent.id && m.isPublished);

  const totalScoreSum = studentMarks.reduce((acc, curr) => acc + curr.totalScore, 0);
  const averagePct = studentMarks.length ? (totalScoreSum / studentMarks.length).toFixed(1) : "0.0";

  return (
    <div className="sr-page-wrapper">
      <SpinningWordsBackground speed="slow" />
      <DailyQuotePopupModal />

      {toastMessage && <div className="sr-toast">✓ {toastMessage}</div>}

      <ExamNav
        title="Student Results"
        subtitle="Approved official academic transcripts, semester score sheets, and subject grade records"
        badge="Screen 8 of 12"
      />

      {/* Candidate Profile Selector Bar */}
      <div className="sr-selector-panel">
        <div className="sr-selector-left">
          <div className="sr-field">
            <label>Select Student Candidate</label>
            <select
              className="sr-select"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
            >
              {CANDIDATE_STUDENTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.roll} • {s.id})
                </option>
              ))}
            </select>
          </div>

          <div className="sr-field">
            <label>Academic Session</label>
            <select
              className="sr-select"
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
            >
              <option value="Term 1">Term 1 (Michaelmas 2026)</option>
              <option value="Term 2">Term 2 (Lent 2027)</option>
              <option value="Term 3">Term 3 (Trinity 2027)</option>
            </select>
          </div>
        </div>

        <div className="sr-selector-actions">
          <button
            type="button"
            className="sr-btn sr-btn-print"
            onClick={() => window.print()}
          >
            🖨️ Print Official Transcript
          </button>
          <button
            type="button"
            className="sr-btn sr-btn-download"
            onClick={() => showToast("Downloading encrypted official PDF statement...")}
          >
            📥 Download Signed PDF
          </button>
        </div>
      </div>

      {/* Transcript Hero Card */}
      <div className="sr-hero-card">
        <div className="sr-hero-left">
          <div className="sr-avatar-box">
            {currentStudent.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="sr-verified-tag">✓ OFFICIAL VERIFIED TRANSCRIPT</div>
            <h2 className="sr-hero-name">{currentStudent.name}</h2>
            <div className="sr-hero-meta">
              <span>Candidate ID: <strong>{currentStudent.id}</strong></span>
              <span>•</span>
              <span>Roll: <strong>{currentStudent.roll}</strong></span>
              <span>•</span>
              <span>Cohort: <strong>{currentStudent.class}</strong></span>
              <span>•</span>
              <span>Year: <strong>{academicYear} ({selectedTerm})</strong></span>
            </div>
          </div>
        </div>

        <div className="sr-kpi-summary">
          <div className="sr-kpi-box">
            <div className="sr-kpi-label">Cumulative GPA</div>
            <div className="sr-kpi-val" style={{ color: "#38bdf8" }}>{currentStudent.gpa}</div>
            <div className="sr-kpi-sub">Out of 4.00 Max</div>
          </div>
          <div className="sr-kpi-box">
            <div className="sr-kpi-label">Class Position</div>
            <div className="sr-kpi-val" style={{ color: "#f59e0b" }}>{currentStudent.rank}</div>
            <div className="sr-kpi-sub">Cohort of 28</div>
          </div>
          <div className="sr-kpi-box">
            <div className="sr-kpi-label">Overall Average</div>
            <div className="sr-kpi-val" style={{ color: "#10b981" }}>{averagePct}%</div>
            <div className="sr-kpi-sub">Distinction Range</div>
          </div>
          <div className="sr-kpi-box">
            <div className="sr-kpi-label">Term Attendance</div>
            <div className="sr-kpi-val" style={{ color: "#c084fc" }}>{currentStudent.attendance}</div>
            <div className="sr-kpi-sub">Punctual & Regular</div>
          </div>
        </div>
      </div>

      {/* Approved Results Table */}
      <div className="sr-table-card">
        <div className="sr-table-top">
          <div>
            <h3 className="sr-table-title">Subject-by-Subject Examination Performance</h3>
            <p className="sr-table-sub">Authorized by Academic Examination Board & signed by Head Principal</p>
          </div>
          <span className="sr-published-badge">● RELEASED FOR STUDENT PORTAL</span>
        </div>

        <div className="sr-table-responsive">
          <table className="sr-table">
            <thead>
              <tr>
                <th>Subject & Syllabus Code</th>
                <th>Continuous Assessment (30)</th>
                <th>Mid-Term Exam (20)</th>
                <th>Final Paper (50)</th>
                <th>Total (100)</th>
                <th>WASSCE Grade</th>
                <th>GPA Point</th>
                <th>Subject Position</th>
                <th>Instructor Remark</th>
              </tr>
            </thead>
            <tbody>
              {studentMarks.map((m) => (
                <tr key={m.id}>
                  <td>
                    <div className="sr-sub-title">{m.subject}</div>
                    <div className="sr-sub-code">{m.subjectCode} • {m.teacherName}</div>
                  </td>
                  <td><span className="sr-num">{m.classScore}</span></td>
                  <td><span className="sr-num">{m.midTermScore}</span></td>
                  <td><span className="sr-num sr-exam">{m.examScore}</span></td>
                  <td><strong className="sr-total">{m.totalScore}%</strong></td>
                  <td>
                    <span className="sr-grade-pill">{m.grade}</span>
                  </td>
                  <td><span className="sr-gpa">{m.gpaPoint.toFixed(2)}</span></td>
                  <td>
                    <span className="sr-pos-pill">#{m.positionInSubject} in Class</span>
                  </td>
                  <td>
                    <div className="sr-remark" title={m.remark}>"{m.remark}"</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Conduct & Promotion Footer */}
        <div className="sr-conduct-box">
          <div className="sr-conduct-col">
            <div className="sr-conduct-title">Head Principal's Terminal Remark</div>
            <p className="sr-conduct-text">"{currentStudent.conduct}"</p>
          </div>
          <div className="sr-conduct-seal">
            <div className="sr-stamp-circle">APPROVED</div>
            <div>
              <div className="sr-signatory-name">Dame Eleanor Vance, Ph.D.</div>
              <div className="sr-signatory-role">Head Principal & Executive Trustee</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
