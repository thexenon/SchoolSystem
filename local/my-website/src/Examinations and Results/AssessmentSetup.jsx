import React, { useState } from "react";
import "./AssessmentSetup.css";
import ExamNav from "./ExamNav";
import { getAssessments, saveAssessments } from "./examData";
import SpinningWordsBackground from "../components/SpinningWordsBackground";
import DailyQuotePopupModal from "../components/DailyQuotePopupModal";

export default function AssessmentSetup() {
  const [assessments, setAssessments] = useState(() => getAssessments());
  const [filterType, setFilterType] = useState("ALL");
  const [filterClass, setFilterClass] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    code: "",
    type: "Examination",
    subject: "Elective Mathematics",
    subjectCode: "MTH-401",
    classCohort: "Grade 11-A (Science Track)",
    gradeLevel: "Senior High School (SHS 2)",
    academicYear: "2026 / 2027",
    term: "Term 1",
    totalMarks: 100,
    weightagePct: 30,
    passMark: 50,
    scheduledDate: "2026-11-20",
    durationMinutes: 120,
    venue: "Main Science Hall B",
    chiefExaminer: "Dr. Jonathan Miller",
    totalExpected: 30,
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({ ...item });
    } else {
      setEditingItem(null);
      setFormData({
        title: "",
        code: `ASM-2026-${String(assessments.length + 1).padStart(3, "0")}`,
        type: "Examination",
        subject: "Elective Mathematics",
        subjectCode: "MTH-401",
        classCohort: "Grade 11-A (Science Track)",
        gradeLevel: "Senior High School (SHS 2)",
        academicYear: "2026 / 2027",
        term: "Term 1",
        totalMarks: 100,
        weightagePct: 30,
        passMark: 50,
        scheduledDate: "2026-11-25",
        durationMinutes: 120,
        venue: "Main Hall A",
        chiefExaminer: "Mrs. Sarah Jenkins",
        totalExpected: 30,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSaveAssessment = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Please specify the assessment title.");
      return;
    }

    let updatedList;
    if (editingItem) {
      updatedList = assessments.map((a) =>
        a.id === editingItem.id ? { ...a, ...formData } : a
      );
      showToast(`Assessment "${formData.title}" updated successfully!`);
    } else {
      const newAssessment = {
        id: `ASM-2026-${Date.now().toString().slice(-4)}`,
        ...formData,
        status: "Scheduled",
        submissionsCount: 0,
        isPublished: false,
      };
      updatedList = [newAssessment, ...assessments];
      showToast(`New assessment "${formData.title}" created successfully!`);
    }

    setAssessments(updatedList);
    saveAssessments(updatedList);
    handleCloseModal();
  };

  const handleDeleteAssessment = (id) => {
    if (window.confirm("Are you sure you want to remove this assessment setup?")) {
      const updatedList = assessments.filter((a) => a.id !== id);
      setAssessments(updatedList);
      saveAssessments(updatedList);
      showToast("Assessment configuration deleted.");
    }
  };

  const filteredAssessments = assessments.filter((a) => {
    const matchesType = filterType === "ALL" || a.type === filterType;
    const matchesClass = filterClass === "ALL" || a.classCohort.includes(filterClass);
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.chiefExaminer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesClass && matchesSearch;
  });

  const totalCount = assessments.length;
  const examCount = assessments.filter((a) => a.type === "Examination" || a.type === "Mock Examination").length;
  const continuousCount = assessments.filter((a) => a.type === "Class Quiz" || a.type === "Assignment" || a.type === "Project Assessment").length;
  const publishedCount = assessments.filter((a) => a.isPublished).length;

  return (
    <div className="as-page-wrapper">
      <SpinningWordsBackground speed="slow" />
      <DailyQuotePopupModal />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="as-toast">✓ {toastMessage}</div>
      )}

      {/* Navigation Sub-bar */}
      <ExamNav
        title="Assessment Setup"
        subtitle="Create, configure and manage quizzes, assignments, midterm tests, and formal examinations"
        badge="Screen 1 of 12"
      />

      {/* Metric Cards Banner */}
      <div className="as-kpi-grid">
        <div className="as-kpi-card">
          <div className="as-kpi-label">Total Assessments Configured</div>
          <div className="as-kpi-val" style={{ color: "#38bdf8" }}>{totalCount}</div>
          <div className="as-kpi-sub">Across all classes & academic terms</div>
        </div>
        <div className="as-kpi-card">
          <div className="as-kpi-label">Formal Examinations & Mocks</div>
          <div className="as-kpi-val" style={{ color: "#f59e0b" }}>{examCount}</div>
          <div className="as-kpi-sub">Summative weighted exams</div>
        </div>
        <div className="as-kpi-card">
          <div className="as-kpi-label">Continuous Assessments</div>
          <div className="as-kpi-val" style={{ color: "#10b981" }}>{continuousCount}</div>
          <div className="as-kpi-sub">Quizzes, labs & group projects (30%)</div>
        </div>
        <div className="as-kpi-card">
          <div className="as-kpi-label">Published to Portals</div>
          <div className="as-kpi-val" style={{ color: "#a855f7" }}>{publishedCount}</div>
          <div className="as-kpi-sub">Visible to students & guardians</div>
        </div>
      </div>

      {/* Action and Filter Header */}
      <div className="as-filter-panel">
        <div className="as-filter-left">
          <input
            type="text"
            className="as-search-input"
            placeholder="Search by assessment, subject, or examiner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="as-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="ALL">All Assessment Types</option>
            <option value="Examination">Formal Examination</option>
            <option value="Class Quiz">Class Quiz</option>
            <option value="Practical Lab Test">Practical Lab Test</option>
            <option value="Mock Examination">Mock Examination</option>
            <option value="Assignment">Take-Home Assignment</option>
            <option value="Project Assessment">Project Assessment</option>
          </select>

          <select
            className="as-select"
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
          >
            <option value="ALL">All Classes & Grades</option>
            <option value="Grade 11-A">Grade 11-A (Science)</option>
            <option value="Grade 11-B">Grade 11-B (Arts & Business)</option>
            <option value="Grade 12-A">Grade 12-A (Final Year)</option>
            <option value="Grade 10">Grade 10 Cohorts</option>
          </select>
        </div>

        <button
          type="button"
          className="as-create-btn"
          onClick={() => handleOpenModal()}
        >
          ➕ Create New Assessment
        </button>
      </div>

      {/* Assessment Table Card */}
      <div className="as-table-card">
        <div className="as-table-header">
          <h2 className="as-table-title">Configured Examination & Assessment Rosters</h2>
          <span className="as-result-pill">Showing {filteredAssessments.length} Records</span>
        </div>

        <div className="as-table-wrapper">
          <table className="as-table">
            <thead>
              <tr>
                <th>Code & Title</th>
                <th>Subject & Class</th>
                <th>Type</th>
                <th>Weighting %</th>
                <th>Total / Pass</th>
                <th>Date & Duration</th>
                <th>Chief Examiner</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssessments.map((a) => (
                <tr key={a.id}>
                  <td>
                    <div className="as-item-title">{a.title}</div>
                    <div className="as-item-code">{a.code} • {a.academicYear}</div>
                  </td>
                  <td>
                    <div className="as-item-subject">{a.subject} ({a.subjectCode})</div>
                    <div className="as-item-class">{a.classCohort}</div>
                  </td>
                  <td>
                    <span className={`as-type-badge as-type-${a.type.replace(/\s+/g, "").toLowerCase()}`}>
                      {a.type}
                    </span>
                  </td>
                  <td>
                    <span className="as-weight-pill">{a.weightagePct}%</span>
                  </td>
                  <td>
                    <div className="as-marks-text">Max: <strong>{a.totalMarks}</strong></div>
                    <div className="as-pass-text">Pass: {a.passMark}</div>
                  </td>
                  <td>
                    <div className="as-date-text">📅 {a.scheduledDate}</div>
                    <div className="as-duration-text">⏳ {a.durationMinutes} mins</div>
                  </td>
                  <td>
                    <div className="as-examiner-name">{a.chiefExaminer}</div>
                    <div className="as-venue-text">📍 {a.venue}</div>
                  </td>
                  <td>
                    <span className={`as-status-badge as-status-${a.status.replace(/\s+/g, "").toLowerCase()}`}>
                      {a.status}
                    </span>
                  </td>
                  <td>
                    <div className="as-action-row">
                      <button
                        type="button"
                        className="as-btn-action as-btn-edit"
                        onClick={() => handleOpenModal(a)}
                        title="Edit Assessment"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        type="button"
                        className="as-btn-action as-btn-delete"
                        onClick={() => handleDeleteAssessment(a.id)}
                        title="Delete Assessment"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Assessment Modal */}
      {isModalOpen && (
        <div className="as-modal-backdrop" onClick={handleCloseModal}>
          <div className="as-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="as-modal-header">
              <h3 className="as-modal-title">
                {editingItem ? "✏️ Edit Assessment Configuration" : "➕ Create New Assessment or Exam"}
              </h3>
              <button
                type="button"
                className="as-modal-close"
                onClick={handleCloseModal}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveAssessment} className="as-modal-form">
              <div className="as-form-row">
                <div className="as-form-group">
                  <label>Assessment Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. End of Term Final Examination in Chemistry"
                  />
                </div>
                <div className="as-form-group">
                  <label>Assessment Code</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="e.g. CHM-END-T1"
                  />
                </div>
              </div>

              <div className="as-form-row">
                <div className="as-form-group">
                  <label>Assessment Category</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="Examination">Formal Examination</option>
                    <option value="Class Quiz">Class Quiz</option>
                    <option value="Practical Lab Test">Practical Lab Test</option>
                    <option value="Mock Examination">Mock Examination</option>
                    <option value="Assignment">Take-Home Assignment</option>
                    <option value="Project Assessment">Project Assessment</option>
                  </select>
                </div>
                <div className="as-form-group">
                  <label>Target Class / Cohort</label>
                  <select
                    value={formData.classCohort}
                    onChange={(e) => setFormData({ ...formData, classCohort: e.target.value })}
                  >
                    <option value="Grade 11-A (Science Track)">Grade 11-A (Science Track)</option>
                    <option value="Grade 11-B (Arts & Business)">Grade 11-B (Arts & Business)</option>
                    <option value="Grade 12-A (Final Year)">Grade 12-A (Final Year)</option>
                    <option value="Grade 10-A (General Core)">Grade 10-A (General Core)</option>
                  </select>
                </div>
              </div>

              <div className="as-form-row">
                <div className="as-form-group">
                  <label>Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  >
                    <option value="Elective Mathematics">Elective Mathematics (MTH-401)</option>
                    <option value="Physics">Physics (PHY-302)</option>
                    <option value="Chemistry">Chemistry (CHM-301)</option>
                    <option value="English Language">English Language (ENG-204)</option>
                    <option value="Computer Science">Computer Science & Python (CSC-310)</option>
                    <option value="Economics">Economics (ECN-201)</option>
                  </select>
                </div>
                <div className="as-form-group">
                  <label>Chief Examiner / Lead Faculty</label>
                  <input
                    type="text"
                    required
                    value={formData.chiefExaminer}
                    onChange={(e) => setFormData({ ...formData, chiefExaminer: e.target.value })}
                    placeholder="e.g. Mrs. Sarah Jenkins"
                  />
                </div>
              </div>

              <div className="as-form-row">
                <div className="as-form-group">
                  <label>Total Maximum Marks</label>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    required
                    value={formData.totalMarks}
                    onChange={(e) => setFormData({ ...formData, totalMarks: Number(e.target.value) })}
                  />
                </div>
                <div className="as-form-group">
                  <label>Pass Mark Threshold</label>
                  <input
                    type="number"
                    min="1"
                    max={formData.totalMarks}
                    required
                    value={formData.passMark}
                    onChange={(e) => setFormData({ ...formData, passMark: Number(e.target.value) })}
                  />
                </div>
                <div className="as-form-group">
                  <label>Weighting Percentage (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={formData.weightagePct}
                    onChange={(e) => setFormData({ ...formData, weightagePct: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="as-form-row">
                <div className="as-form-group">
                  <label>Scheduled Date</label>
                  <input
                    type="date"
                    required
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                  />
                </div>
                <div className="as-form-group">
                  <label>Duration (Minutes)</label>
                  <input
                    type="number"
                    min="15"
                    max="360"
                    required
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                  />
                </div>
                <div className="as-form-group">
                  <label>Exam Venue / Hall</label>
                  <input
                    type="text"
                    required
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    placeholder="e.g. Science Hall B"
                  />
                </div>
              </div>

              <div className="as-modal-actions">
                <button
                  type="button"
                  className="as-btn-cancel"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="as-btn-submit"
                >
                  {editingItem ? "Update Assessment" : "Save Assessment Configuration"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
