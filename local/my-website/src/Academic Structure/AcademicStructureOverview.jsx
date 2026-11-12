import React, { useState } from "react";
import AcademicNav from "./AcademicNav";
import "./AcademicStructureOverview.css";
import {
  EDUCATION_LEVELS,
  CLASSES_LIST,
  STREAMS_LIST,
  SUBJECTS_LIST,
  DEPARTMENTS_LIST,
} from "./academicData";
import SpinningWordsBackground from "../components/SpinningWordsBackground";
import MotivationQuoteWidget from "../components/MotivationQuoteWidget";

export default function AcademicStructureOverview({ onNavigate }) {
  const [expandedLevels, setExpandedLevels] = useState({
    "LVL-004": true, // SHS expanded by default
    "LVL-005": true, // Tertiary expanded
  });

  const [activeTab, setActiveTab] = useState("tree"); // "tree", "matrix", "departments"
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const toggleLevel = (id) => {
    setExpandedLevels((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleExportChart = () => {
    window.print();
    showToast("Academic Structure Hierarchy Map prepared for print / export.");
  };

  return (
    <div className="aso-page-wrapper">
      <SpinningWordsBackground speed="slow" showControlBadge={false} />

      {/* Toast Alert */}
      {toastMessage && <div className="aso-toast">✓ {toastMessage}</div>}

      <AcademicNav
        activePath="/academic-structure-overview"
        title="Academic Structure Overview"
        subtitle="Visual relationships between Education Levels, Classes, Streams, Subjects, and Faculty"
      />

      <MotivationQuoteWidget compact={true} />

      {/* KPI Stats Strip */}
      <div className="aso-kpi-grid">
        <div className="aso-kpi-card">
          <div className="aso-kpi-top">
            <span className="aso-kpi-label">Education Levels</span>
            <span className="aso-kpi-icon">🏛️</span>
          </div>
          <div className="aso-kpi-val">{EDUCATION_LEVELS.length} Tiers</div>
          <div className="aso-kpi-sub">KG, Primary, JHS, SHS & Tertiary</div>
        </div>

        <div className="aso-kpi-card">
          <div className="aso-kpi-top">
            <span className="aso-kpi-label">Class Form Cohorts</span>
            <span className="aso-kpi-icon">🏫</span>
          </div>
          <div className="aso-kpi-val" style={{ color: "#38bdf8" }}>
            {CLASSES_LIST.length} Grades
          </div>
          <div className="aso-kpi-sub">{STREAMS_LIST.length} Specialized Stream Sections</div>
        </div>

        <div className="aso-kpi-card">
          <div className="aso-kpi-top">
            <span className="aso-kpi-label">Curriculum Subjects</span>
            <span className="aso-kpi-icon">📚</span>
          </div>
          <div className="aso-kpi-val" style={{ color: "#34d399" }}>
            {SUBJECTS_LIST.length} Subjects
          </div>
          <div className="aso-kpi-sub">Managed by 5 Academic Departments</div>
        </div>

        <div className="aso-kpi-card">
          <div className="aso-kpi-top">
            <span className="aso-kpi-label">Structure Health</span>
            <span className="aso-kpi-icon">✓</span>
          </div>
          <div className="aso-kpi-val" style={{ color: "#fbbf24" }}>
            100% Linked
          </div>
          <div className="aso-kpi-sub">All Classes Have Assigned Teachers</div>
        </div>
      </div>

      {/* View Switcher Bar */}
      <div className="aso-action-bar">
        <div className="aso-view-tabs">
          <button
            type="button"
            className={`aso-tab-btn ${activeTab === "tree" ? "active" : ""}`}
            onClick={() => setActiveTab("tree")}
          >
            🌳 Interactive Hierarchy Tree
          </button>
          <button
            type="button"
            className={`aso-tab-btn ${activeTab === "matrix" ? "active" : ""}`}
            onClick={() => setActiveTab("matrix")}
          >
            📊 Curriculum & Teacher Matrix
          </button>
          <button
            type="button"
            className={`aso-tab-btn ${activeTab === "departments" ? "active" : ""}`}
            onClick={() => setActiveTab("departments")}
          >
            🏢 Departmental Allocations
          </button>
        </div>

        <button
          type="button"
          className="aso-btn-export"
          onClick={handleExportChart}
        >
          <span>🖨️</span> Print / Export Architecture Map
        </button>
      </div>

      {/* 1. HIERARCHY TREE VIEW */}
      {activeTab === "tree" && (
        <div className="aso-tree-container">
          <div className="aso-tree-header">
            <h3>🏫 Multi-Tier Academic Hierarchy & Staffing Map</h3>
            <p>
              Click any Education Level tier to expand or collapse child classes, streams, and faculty allocations.
            </p>
          </div>

          <div className="aso-tree-root">
            {EDUCATION_LEVELS.map((level) => {
              const isExpanded = !!expandedLevels[level.id];
              const levelClasses = CLASSES_LIST.filter((c) => c.levelId === level.id);

              return (
                <div key={level.id} className="aso-level-block">
                  {/* Level Node */}
                  <div
                    className={`aso-level-node ${isExpanded ? "expanded" : ""}`}
                    onClick={() => toggleLevel(level.id)}
                  >
                    <div className="aso-node-left">
                      <span className="aso-toggle-arrow">
                        {isExpanded ? "▼" : "▶"}
                      </span>
                      <span className="aso-level-badge">{level.code}</span>
                      <div>
                        <div className="aso-level-title">{level.name}</div>
                        <div className="aso-level-sub">
                          Campus: {level.campus} • Ages: {level.ageRange} • {level.totalStudents} Students
                        </div>
                      </div>
                    </div>

                    <div className="aso-node-right">
                      <span className="aso-chip aso-chip-grading">
                        Grading: {level.gradingSystem}
                      </span>
                      <span className="aso-chip aso-chip-classes">
                        {levelClasses.length} Grade Form(s)
                      </span>
                    </div>
                  </div>

                  {/* Child Classes */}
                  {isExpanded && (
                    <div className="aso-children-classes">
                      {levelClasses.map((cls) => {
                        const classStreams = STREAMS_LIST.filter(
                          (s) => s.classId === cls.id
                        );

                        return (
                          <div key={cls.id} className="aso-class-card">
                            <div className="aso-class-top">
                              <div>
                                <span className="aso-class-code">{cls.code}</span>
                                <h4 className="aso-class-name">{cls.name}</h4>
                              </div>
                              <div className="aso-class-teacher">
                                <span>Form Master:</span>
                                <strong>👨‍🏫 {cls.headTeacher}</strong>
                              </div>
                            </div>

                            <div className="aso-class-meta">
                              <span>📍 Room: {cls.room}</span>
                              <span>•</span>
                              <span>🪑 Capacity: {cls.enrolledCount} / {cls.capacity} Enrolled</span>
                              <span>•</span>
                              <span>📅 Year: {cls.academicYear}</span>
                            </div>

                            {/* Streams under this Class */}
                            <div className="aso-streams-wrapper">
                              <div className="aso-streams-title">
                                🔀 Stream Sections & Track Specializations:
                              </div>
                              <div className="aso-streams-grid">
                                {classStreams.map((str) => (
                                  <div key={str.id} className="aso-stream-pill-card">
                                    <div className="aso-stream-code-row">
                                      <span className="aso-stream-badge">{str.code}</span>
                                      <span className="aso-stream-room">📍 {str.room}</span>
                                    </div>
                                    <div className="aso-stream-name">{str.name}</div>
                                    <div className="aso-stream-track">
                                      🎯 {str.specialization}
                                    </div>
                                    <div className="aso-stream-teacher">
                                      👨‍🏫 Tutor: <strong>{str.classTeacher}</strong>
                                    </div>
                                    <div className="aso-stream-stats">
                                      👥 {str.enrolledCount}/{str.capacity} Students • 📚 {str.subjectsCount} Subjects
                                    </div>
                                  </div>
                                ))}

                                {classStreams.length === 0 && (
                                  <div className="aso-no-stream">
                                    General cohort set (All students unified in one room).
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {levelClasses.length === 0 && (
                        <div className="aso-no-classes">
                          No classes currently active under this level.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. CURRICULUM & TEACHER MATRIX */}
      {activeTab === "matrix" && (
        <div className="aso-matrix-container">
          <div className="aso-tree-header">
            <h3>📊 Master Subject & Faculty Assignment Matrix</h3>
            <p>
              Complete mapping of academic subjects, assigned faculty leaders, curriculum departments, and credit weighting.
            </p>
          </div>

          <div className="aso-table-wrapper">
            <table className="aso-matrix-table">
              <thead>
                <tr>
                  <th>Subject Code & Title</th>
                  <th>Department</th>
                  <th>Category</th>
                  <th>Weekly Periods</th>
                  <th>Credits</th>
                  <th>Lead Teacher / Faculty</th>
                  <th>Applicable Levels</th>
                  <th>Syllabus Code</th>
                </tr>
              </thead>
              <tbody>
                {SUBJECTS_LIST.map((sub) => (
                  <tr key={sub.id}>
                    <td>
                      <div className="aso-sub-cell">
                        <span className="aso-sub-badge">{sub.code}</span>
                        <strong className="aso-sub-title">{sub.title}</strong>
                      </div>
                    </td>
                    <td>{sub.departmentName}</td>
                    <td>
                      <span
                        className={`aso-cat-pill ${
                          sub.category === "Core" ? "aso-core" : "aso-elec"
                        }`}
                      >
                        {sub.category}
                      </span>
                    </td>
                    <td>{sub.periodsPerWeek} Periods / Wk</td>
                    <td>
                      <strong style={{ color: "#38bdf8" }}>{sub.creditHours} Credits</strong>
                    </td>
                    <td>
                      <span className="aso-teacher-pill">👨‍🏫 {sub.leadTeacher}</span>
                    </td>
                    <td>
                      <div className="aso-chips-row">
                        {sub.levels.map((lvl, idx) => (
                          <span key={idx} className="aso-mini-chip">
                            {lvl}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span className="aso-syllabus-text">{sub.syllabusCode}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. DEPARTMENTAL ALLOCATIONS */}
      {activeTab === "departments" && (
        <div className="aso-departments-container">
          <div className="aso-tree-header">
            <h3>🏢 Academic Department Distribution & Annual Budgets (GH₵)</h3>
            <p>
              Resource allocation, faculty counts, and subject coverage across all 5 school departments.
            </p>
          </div>

          <div className="aso-depts-grid">
            {DEPARTMENTS_LIST.map((dept) => {
              const deptSubjects = SUBJECTS_LIST.filter(
                (s) => s.departmentId === dept.id
              );

              return (
                <div key={dept.id} className="aso-dept-summary-card">
                  <div className="aso-dept-header">
                    <div>
                      <span className="aso-dept-code">{dept.code}</span>
                      <h4 className="aso-dept-name">{dept.name}</h4>
                    </div>
                    <span className="aso-dept-budget">₵ {dept.annualBudget}</span>
                  </div>

                  <div className="aso-hod-row">
                    <span className="aso-hod-label">Head of Department (HOD):</span>
                    <span className="aso-hod-val">👨‍🏫 {dept.hod}</span>
                  </div>

                  <div className="aso-dept-stats-row">
                    <span>👥 {dept.facultyCount} Faculty</span>
                    <span>•</span>
                    <span>📚 {deptSubjects.length} Core & Elective Subjects</span>
                    <span>•</span>
                    <span>📍 {dept.location}</span>
                  </div>

                  <div className="aso-dept-subjects-list">
                    <div className="aso-dept-sub-title">Managed Subjects:</div>
                    <div className="aso-dept-sub-chips">
                      {deptSubjects.map((s) => (
                        <span key={s.id} className="aso-dept-sub-chip">
                          {s.code}: {s.title}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
