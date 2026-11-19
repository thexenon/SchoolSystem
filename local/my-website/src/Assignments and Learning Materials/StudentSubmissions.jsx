import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AssignmentNav from "./AssignmentNav";
import {
  getAssignments,
  getSubmissions,
  saveSubmissions,
  saveAssignments,
} from "./assignmentData";
import "./StudentSubmissions.css";

const STUDENTS = [
  { id: "STU-SMIA-002", name: "Kwame Mensah", grade: "Grade 11-A", roll: "11A-04" },
  { id: "STU-SMIA-001", name: "Elena Rostova", grade: "Grade 11-A", roll: "11A-01" },
  { id: "STU-SMIA-005", name: "Nana Osei Bonsu", grade: "Grade 11-A", roll: "11A-12" },
  { id: "STU-SMIA-015", name: "Dmitri Rostov Jr.", grade: "Grade 8-B", roll: "8B-09" },
];

export default function StudentSubmissions() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState(getAssignments());
  const [submissions, setSubmissions] = useState(getSubmissions());

  const initialAssignmentId = searchParams.get("id") || assignments[0]?.id || "";
  const [selectedAsnId, setSelectedAsnId] = useState(initialAssignmentId);
  const [selectedStudentId, setSelectedStudentId] = useState(STUDENTS[0].id);

  const [uploadedFile, setUploadedFile] = useState("");
  const [studentNote, setStudentNote] = useState("");
  const [honorPledge, setHonorPledge] = useState(false);
  const [toast, setToast] = useState(null);

  const activeAssignment = assignments.find((a) => a.id === selectedAsnId) || assignments[0];
  const activeStudent = STUDENTS.find((s) => s.id === selectedStudentId) || STUDENTS[0];

  // Find existing submission if any
  const existingSubmission = submissions.find(
    (s) => s.assignmentId === activeAssignment?.id && s.studentId === activeStudent?.id
  );

  useEffect(() => {
    const idFromUrl = searchParams.get("id");
    if (idFromUrl && idFromUrl !== selectedAsnId) {
      setSelectedAsnId(idFromUrl);
    }
  }, [searchParams]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!uploadedFile) {
      showToast("Please choose a file to submit.");
      return;
    }
    if (!honorPledge) {
      showToast("Please certify the academic honor pledge.");
      return;
    }

    const newSub = {
      id: existingSubmission ? existingSubmission.id : `SUB-${Math.floor(Math.random() * 800 + 100)}`,
      assignmentId: activeAssignment.id,
      studentId: activeStudent.id,
      studentName: activeStudent.name,
      grade: activeStudent.grade,
      rollNumber: activeStudent.roll,
      submittedAt: new Date().toLocaleString(),
      status: "Needs Grading",
      fileUrl: uploadedFile,
      fileSize: "2.6 MB",
      punctuality: "On Time",
      studentNote: studentNote.trim(),
      gradePoints: null,
      maxPoints: activeAssignment.maxPoints,
      gradedBy: null,
      gradedAt: null,
      feedback: "",
    };

    let updatedSubmissions;
    if (existingSubmission) {
      updatedSubmissions = submissions.map((s) => (s.id === existingSubmission.id ? newSub : s));
    } else {
      updatedSubmissions = [newSub, ...submissions];
      // Increment submitted count on assignment
      const updatedAssignments = assignments.map((a) => {
        if (a.id === activeAssignment.id) {
          return { ...a, submittedCount: a.submittedCount + 1 };
        }
        return a;
      });
      setAssignments(updatedAssignments);
      saveAssignments(updatedAssignments);
    }

    setSubmissions(updatedSubmissions);
    saveSubmissions(updatedSubmissions);

    setUploadedFile("");
    setStudentNote("");
    setHonorPledge(false);
    showToast(`Assignment submission successfully transmitted for ${activeStudent.name}!`);
  };

  return (
    <div className="ss-page-container">
      {toast && (
        <div className="ss-toast">
          <span>✓</span> {toast}
        </div>
      )}

      <AssignmentNav
        title="Student Work Submission Terminal"
        subtitle="Upload coursework documents, view submission receipts, and monitor evaluation progress"
        badge="Module 13 • Screen 4 of 7"
      />

      {/* Selectors Bar */}
      <div className="ss-top-bar">
        <div className="ss-select-group">
          <label>Target Assignment:</label>
          <select
            value={activeAssignment?.id}
            onChange={(e) => {
              setSelectedAsnId(e.target.value);
              navigate(`/student-submissions?id=${e.target.value}`);
            }}
          >
            {assignments.map((a) => (
              <option key={a.id} value={a.id}>
                {a.subject}: {a.title} ({a.targetClass})
              </option>
            ))}
          </select>
        </div>

        <div className="ss-select-group">
          <label>Submitting Scholar:</label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
          >
            {STUDENTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.roll} • {s.grade})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="ss-content-grid">
        {/* Left Column: Assignment Context Card */}
        <div className="ss-context-card">
          <div className="ss-context-header">
            <span className="ss-tag-subject">{activeAssignment.subject}</span>
            <span className="ss-tag-points font-mono">{activeAssignment.maxPoints} Points</span>
          </div>

          <h2 className="ss-context-title">{activeAssignment.title}</h2>
          <p className="ss-context-desc">{activeAssignment.instructions}</p>

          <div className="ss-context-meta">
            <div className="ss-cm-row">
              <span>📅 Due Date:</span>
              <strong className="text-amber font-mono">
                {activeAssignment.dueDate} ({activeAssignment.dueTime})
              </strong>
            </div>
            <div className="ss-cm-row">
              <span>👨‍🏫 Evaluating Teacher:</span>
              <strong>{activeAssignment.teacher}</strong>
            </div>
            <div className="ss-cm-row">
              <span>📎 Permitted Format:</span>
              <strong className="text-emerald">{activeAssignment.submissionType}</strong>
            </div>
          </div>

          {/* Reference Attachments */}
          <div className="ss-attachments-box">
            <h4>Teacher Guide Documents:</h4>
            {activeAssignment.attachments.map((att, idx) => (
              <div key={idx} className="ss-att-item">
                <span>📄 {att.name}</span>
                <span className="font-mono text-cyan">{att.size}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Submission Form / Status Box */}
        <div className="ss-submission-card">
          <h2 className="ss-sub-card-title">
            <span>📤</span> Document Submission Console
          </h2>

          {/* If already submitted, display status banner */}
          {existingSubmission && (
            <div className="ss-existing-banner">
              <div className="ss-eb-top">
                <span className="ss-eb-badge">
                  ● Status: {existingSubmission.status.toUpperCase()}
                </span>
                <span className="ss-eb-date">{existingSubmission.submittedAt}</span>
              </div>
              <div className="ss-eb-file">
                📎 Submitted File: <strong>{existingSubmission.fileUrl}</strong> (
                {existingSubmission.fileSize})
              </div>
              {existingSubmission.gradePoints !== null && (
                <div className="ss-eb-grade">
                  Score:{" "}
                  <strong>
                    {existingSubmission.gradePoints} / {existingSubmission.maxPoints} Points
                  </strong>
                </div>
              )}
              {existingSubmission.feedback && (
                <div className="ss-eb-feedback">
                  Teacher Feedback: "{existingSubmission.feedback}"
                </div>
              )}
              <div className="ss-eb-resubmit-hint">
                ⚠️ You can upload a revised file below to replace your previous submission.
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="ss-form">
            <div className="ss-form-group">
              <label>Select Work Document File (.PDF, .DOCX, .ZIP, .PY) *</label>
              <div className="ss-file-picker">
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setUploadedFile(e.target.files[0].name);
                    }
                  }}
                  required={!existingSubmission}
                />
                {uploadedFile && (
                  <div className="ss-picked-display">
                    ✅ File Ready: <strong>{uploadedFile}</strong>
                  </div>
                )}
              </div>
            </div>

            <div className="ss-form-group">
              <label>Submission Commentary & Abstract (Optional):</label>
              <textarea
                rows={3}
                placeholder="Include any methodology notes, external library versions, or specific questions for the instructor..."
                value={studentNote}
                onChange={(e) => setStudentNote(e.target.value)}
              />
            </div>

            <div className="ss-pledge-group">
              <label className="ss-pledge-label">
                <input
                  type="checkbox"
                  checked={honorPledge}
                  onChange={(e) => setHonorPledge(e.target.checked)}
                />
                <span>
                  <strong>Academic Honor Pledge:</strong> I certify that this submission represents
                  my own original intellectual work and adheres to St. Mary International Academy
                  academic integrity policies.
                </span>
              </label>
            </div>

            <div className="ss-form-actions">
              <button
                type="button"
                className="ss-btn-cancel"
                onClick={() => navigate("/assignment-list")}
              >
                Cancel
              </button>
              <button type="submit" className="ss-btn-submit">
                🚀 {existingSubmission ? "Upload Revised Submission" : "Transmit Submission"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
