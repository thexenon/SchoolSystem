import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AssignmentNav from "./AssignmentNav";
import { getAssignments, getUserRoleMode } from "./assignmentData";
import SpinningWordsBackground from "../components/SpinningWordsBackground";
import "./AssignmentList.css";

export default function AssignmentList() {
  const navigate = useNavigate();
  const [assignments] = useState(getAssignments());
  const [classFilter, setClassFilter] = useState("All");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleMode] = useState(getUserRoleMode());

  // Distinct filters
  const classesList = ["All", ...Array.from(new Set(assignments.map((a) => a.targetClass)))];
  const subjectsList = ["All", ...Array.from(new Set(assignments.map((a) => a.subject)))];

  // Filtering
  const filtered = assignments.filter((a) => {
    if (classFilter !== "All" && a.targetClass !== classFilter) return false;
    if (subjectFilter !== "All" && a.subject !== subjectFilter) return false;
    if (statusFilter !== "All" && a.status !== statusFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = a.title.toLowerCase().includes(q);
      const matchSubject = a.subject.toLowerCase().includes(q);
      const matchTeacher = a.teacher.toLowerCase().includes(q);
      if (!matchTitle && !matchSubject && !matchTeacher) return false;
    }
    return true;
  });

  const totalActive = assignments.length;
  const totalSubmissions = assignments.reduce((acc, curr) => acc + curr.submittedCount, 0);
  const pendingGrading = assignments.reduce((acc, curr) => acc + (curr.submittedCount - curr.gradedCount), 0);

  return (
    <div className="al-page-container">
      <SpinningWordsBackground speed="slow" />

      <AssignmentNav
        title="Class Academic Assignment Catalog"
        subtitle="Comprehensive register of coursework projects, homework assessments, and submission deadlines across all classes"
        badge="Module 13 • Screen 1 of 7"
      />

      {/* Header Banner */}
      <div className="al-header-strip">
        <div>
          <span className="al-tag">CURRICULUM ASSESSMENT WORKSTATION</span>
          <h1 className="al-title">Academic Assignments</h1>
          <p className="al-sub">
            Filter, monitor and inspect homework assignments, term projects, and laboratory papers by
            class section and discipline.
          </p>
        </div>

        <div className="al-header-actions">
          <Link to="/create-assignment" className="al-btn-create">
            ➕ Create Assignment
          </Link>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="al-kpi-grid">
        <div className="al-kpi-card">
          <span className="al-kpi-label">Active Assignments</span>
          <div className="al-kpi-val text-cyan">{totalActive} Tasks</div>
          <span className="al-kpi-sub">Across 5 academic departments</span>
        </div>

        <div className="al-kpi-card">
          <span className="al-kpi-label">Total Student Submissions</span>
          <div className="al-kpi-val text-emerald">{totalSubmissions} Works</div>
          <span className="al-kpi-sub">Received across all streams</span>
        </div>

        <div className="al-kpi-card">
          <span className="al-kpi-label">Submissions Awaiting Grading</span>
          <div className="al-kpi-val text-amber">{pendingGrading} Submissions</div>
          <span className="al-kpi-sub">Faculty review queue</span>
        </div>

        <div className="al-kpi-card">
          <span className="al-kpi-label">Overall Turnout Rate</span>
          <div className="al-kpi-val text-purple">
            {Math.round((totalSubmissions / (assignments.reduce((a, c) => a + c.totalEnrolled, 0) || 1)) * 100)}%
          </div>
          <span className="al-kpi-sub">On-time student compliance</span>
        </div>
      </div>

      {/* Filter and Search Strip */}
      <div className="al-toolbar">
        <div className="al-search-box">
          <span className="al-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by title, subject, or instructor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="al-clear-btn" onClick={() => setSearchQuery("")}>
              ✕
            </button>
          )}
        </div>

        <div className="al-filter-groups">
          <div className="al-filter-item">
            <label>Target Class:</label>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
            >
              {classesList.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="al-filter-item">
            <label>Subject:</label>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
            >
              {subjectsList.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Assignments Cards Grid */}
      <div className="al-grid">
        {filtered.map((item) => {
          const submissionPct = Math.round((item.submittedCount / item.totalEnrolled) * 100);
          return (
            <div key={item.id} className="al-card">
              <div className="al-card-top">
                <div className="al-subject-badge">
                  <span>{item.subject}</span>
                  <small className="font-mono">({item.subjectCode})</small>
                </div>
                <span className="al-class-pill">🏛️ {item.targetClass}</span>
              </div>

              <h2 className="al-card-title">{item.title}</h2>
              <p className="al-card-desc">{item.instructions}</p>

              <div className="al-meta-box">
                <div className="al-meta-row">
                  <span className="al-meta-label">👨‍🏫 Instructor:</span>
                  <strong className="al-meta-val">{item.teacher}</strong>
                </div>
                <div className="al-meta-row">
                  <span className="al-meta-label">📅 Due Date:</span>
                  <span className="al-meta-val text-amber font-mono">
                    {item.dueDate} at {item.dueTime}
                  </span>
                </div>
                <div className="al-meta-row">
                  <span className="al-meta-label">🎯 Maximum Mark:</span>
                  <span className="al-meta-val font-mono">{item.maxPoints} Points</span>
                </div>
                <div className="al-meta-row">
                  <span className="al-meta-label">📎 Attachments:</span>
                  <span className="al-meta-val">{item.attachments.length} reference files</span>
                </div>
              </div>

              {/* Submission Progress Bar */}
              <div className="al-progress-container">
                <div className="al-progress-header">
                  <span>Submissions Progress</span>
                  <strong>
                    {item.submittedCount} / {item.totalEnrolled} ({submissionPct}%)
                  </strong>
                </div>
                <div className="al-progress-track">
                  <div
                    className="al-progress-fill"
                    style={{ width: `${submissionPct}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="al-card-actions">
                <button
                  className="al-btn-action al-btn-details"
                  onClick={() => navigate(`/assignment-details?id=${item.id}`)}
                >
                  🔍 View Details
                </button>
                <button
                  className="al-btn-action al-btn-review"
                  onClick={() => navigate(`/submission-review?id=${item.id}`)}
                >
                  📝 Submissions ({item.submittedCount})
                </button>
                <button
                  className="al-btn-action al-btn-submit"
                  onClick={() => navigate(`/student-submissions?id=${item.id}`)}
                >
                  📤 Submit Work
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
