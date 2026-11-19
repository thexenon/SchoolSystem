import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AssignmentNav from "./AssignmentNav";
import { getAssignments, saveAssignments } from "./assignmentData";
import "./CreateAssignment.css";

const SUBJECTS = [
  { name: "Advanced Physics", code: "PHY-302" },
  { name: "Core Mathematics", code: "MTH-401" },
  { name: "Computer Science", code: "CSC-310" },
  { name: "Chemistry", code: "CHM-301" },
  { name: "English Literature", code: "ENG-204" },
  { name: "Economics & Commerce", code: "ECN-201" },
  { name: "French Language", code: "FRE-202" },
];

const CLASSES = [
  "Grade 11-A (Advanced Science)",
  "Grade 11-B (General Arts & Business)",
  "Grade 12-A (WASSCE Finalists)",
  "Grade 10-A (Secondary Science)",
  "Grade 8-B (Middle School)",
];

export default function CreateAssignment() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState(SUBJECTS[0].name);
  const [subjectCode, setSubjectCode] = useState(SUBJECTS[0].code);
  const [targetClass, setTargetClass] = useState(CLASSES[0]);
  const [teacher, setTeacher] = useState("Mr. Kofi Annan");
  const [maxPoints, setMaxPoints] = useState(100);
  const [passingScore, setPassingScore] = useState(60);
  const [dueDate, setDueDate] = useState("2026-11-30");
  const [dueTime, setDueTime] = useState("11:59 PM");
  const [submissionType, setSubmissionType] = useState("File Upload (.PDF / .ZIP)");
  const [instructions, setInstructions] = useState("");
  const [attachmentName, setAttachmentName] = useState("");
  const [rubricItems, setRubricItems] = useState([
    { criteria: "Methodology & Derivations", points: 30 },
    { criteria: "Accuracy & Results", points: 40 },
    { criteria: "Discussion & Conclusions", points: 30 },
  ]);
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubjectChange = (e) => {
    const selected = e.target.value;
    setSubject(selected);
    const found = SUBJECTS.find((s) => s.name === selected);
    if (found) setSubjectCode(found.code);
  };

  const handleAddRubricItem = () => {
    setRubricItems([...rubricItems, { criteria: "New Assessment Criterion", points: 10 }]);
  };

  const handleRemoveRubricItem = (idx) => {
    setRubricItems(rubricItems.filter((_, i) => i !== idx));
  };

  const handleRubricChange = (idx, field, value) => {
    const updated = [...rubricItems];
    updated[idx][field] = field === "points" ? Number(value) : value;
    setRubricItems(updated);
  };

  const handlePublish = (e, status = "Published") => {
    e.preventDefault();
    if (!title.trim() || !instructions.trim()) {
      showToast("Please provide both an assignment title and detailed instructions.");
      return;
    }

    const newId = `ASN-2026-${String(Math.floor(Math.random() * 900 + 100))}`;
    const newAssignment = {
      id: newId,
      title: title.trim(),
      subject,
      subjectCode,
      targetClass,
      teacher,
      teacherEmail: "faculty.author@school.edu",
      maxPoints: Number(maxPoints),
      passingScore: Number(passingScore),
      dueDate,
      dueTime,
      status,
      createdAt: new Date().toISOString().split("T")[0],
      submissionType,
      instructions: instructions.trim(),
      attachments: attachmentName
        ? [{ name: attachmentName, size: "1.8 MB" }]
        : [{ name: "Assignment_Guidelines.pdf", size: "1.2 MB" }],
      rubric: rubricItems,
      totalEnrolled: 38,
      submittedCount: 0,
      gradedCount: 0,
    };

    const currentList = getAssignments();
    const updatedList = [newAssignment, ...currentList];
    saveAssignments(updatedList);

    showToast(`Assignment "${title}" ${status.toLowerCase()} successfully!`);
    setTimeout(() => {
      navigate("/assignment-list");
    }, 1200);
  };

  const totalRubricPoints = rubricItems.reduce((acc, curr) => acc + (Number(curr.points) || 0), 0);

  return (
    <div className="ca-page-container">
      {toast && (
        <div className="ca-toast">
          <span>✓</span> {toast}
        </div>
      )}

      <AssignmentNav
        title="Author & Publish Academic Assignment"
        subtitle="Create curriculum-aligned coursework, configure assessment rubrics, set deadlines, and attach reference files"
        badge="Module 13 • Screen 2 of 7"
      />

      {/* Header Banner */}
      <div className="ca-header-strip">
        <div>
          <span className="ca-tag">FACULTY COURSEWORK BUILDER</span>
          <h1 className="ca-title">Create New Assignment</h1>
          <p className="ca-sub">
            Deploy homework assessments and term project specifications directly to student portal dashboards.
          </p>
        </div>
      </div>

      <form onSubmit={(e) => handlePublish(e, "Published")} className="ca-form-card">
        {/* Basic Details Grid */}
        <div className="ca-section-title">
          <span>📝</span> General Assignment Information
        </div>

        <div className="ca-form-group">
          <label>Assignment Title *</label>
          <input
            type="text"
            placeholder="e.g., Electromagnetic Induction & Faraday's Law Experiment Report"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="ca-form-row">
          <div className="ca-form-group">
            <label>Subject Discipline *</label>
            <select value={subject} onChange={handleSubjectChange}>
              {SUBJECTS.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>

          <div className="ca-form-group">
            <label>Target Academic Class *</label>
            <select
              value={targetClass}
              onChange={(e) => setTargetClass(e.target.value)}
            >
              {CLASSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="ca-form-row">
          <div className="ca-form-group">
            <label>Assigning Teacher / Master</label>
            <input
              type="text"
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
              required
            />
          </div>

          <div className="ca-form-group">
            <label>Submission Format Type</label>
            <select
              value={submissionType}
              onChange={(e) => setSubmissionType(e.target.value)}
            >
              <option value="File Upload (.PDF / .ZIP)">File Upload (.PDF / .ZIP)</option>
              <option value="Formal Laboratory Report (.PDF)">Formal Laboratory Report (.PDF)</option>
              <option value="Scanned Handwritten Homework / PDF">Scanned Handwritten Homework / PDF</option>
              <option value="Python Source Code (.PY / .ZIP)">Python Source Code (.PY / .ZIP)</option>
              <option value="Comparative Essay (.DOCX / .PDF)">Comparative Essay (.DOCX / .PDF)</option>
            </select>
          </div>
        </div>

        {/* Scoring & Deadline Grid */}
        <div className="ca-section-title">
          <span>⏰</span> Deadlines & Scoring Configuration
        </div>

        <div className="ca-form-row">
          <div className="ca-form-group">
            <label>Submission Due Date *</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>

          <div className="ca-form-group">
            <label>Cut-Off Time</label>
            <input
              type="text"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              placeholder="e.g. 11:59 PM"
              required
            />
          </div>

          <div className="ca-form-group">
            <label>Total Maximum Marks</label>
            <input
              type="number"
              value={maxPoints}
              onChange={(e) => setMaxPoints(e.target.value)}
              required
            />
          </div>

          <div className="ca-form-group">
            <label>Pass Mark Threshold</label>
            <input
              type="number"
              value={passingScore}
              onChange={(e) => setPassingScore(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Problem Description & Instructions */}
        <div className="ca-section-title">
          <span>📖</span> Problem Statement & Detailed Instructions
        </div>

        <div className="ca-form-group">
          <label>Detailed Instructions, Guidelines & References *</label>
          <textarea
            rows={5}
            placeholder="State the analytical questions, lab protocols, formatting standards, and citation expectations..."
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            required
          />
        </div>

        {/* Rubric Criteria Builder */}
        <div className="ca-section-title">
          <span>🎯</span> Assessment Grading Rubric (Total: {totalRubricPoints} Pts)
        </div>

        <div className="ca-rubric-builder">
          {rubricItems.map((item, idx) => (
            <div key={idx} className="ca-rubric-row">
              <input
                type="text"
                placeholder="Rubric criterion title..."
                value={item.criteria}
                onChange={(e) => handleRubricChange(idx, "criteria", e.target.value)}
                className="ca-rubric-name"
                required
              />
              <div className="ca-rubric-pts-wrap">
                <input
                  type="number"
                  value={item.points}
                  onChange={(e) => handleRubricChange(idx, "points", e.target.value)}
                  className="ca-rubric-pts"
                  required
                />
                <span className="ca-pts-label">Points</span>
              </div>
              <button
                type="button"
                className="ca-btn-remove-rubric"
                onClick={() => handleRemoveRubricItem(idx)}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            className="ca-btn-add-rubric"
            onClick={handleAddRubricItem}
          >
            ➕ Add Rubric Criterion
          </button>
        </div>

        {/* Attachments Upload */}
        <div className="ca-section-title">
          <span>📎</span> Teacher Reference Attachments (Optional)
        </div>

        <div className="ca-form-group">
          <label>Select Guide Document or Formula Sheet:</label>
          <div className="ca-file-box">
            <input
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setAttachmentName(e.target.files[0].name);
                }
              }}
            />
            {attachmentName && (
              <span className="ca-chosen-file">✅ Attached: {attachmentName}</span>
            )}
          </div>
        </div>

        {/* Form Actions Footer */}
        <div className="ca-footer-actions">
          <button
            type="button"
            className="ca-btn-cancel"
            onClick={() => navigate("/assignment-list")}
          >
            Cancel
          </button>
          <button
            type="button"
            className="ca-btn-draft"
            onClick={(e) => handlePublish(e, "Draft")}
          >
            💾 Save as Draft
          </button>
          <button type="submit" className="ca-btn-publish">
            🚀 Publish to Students
          </button>
        </div>
      </form>
    </div>
  );
}
