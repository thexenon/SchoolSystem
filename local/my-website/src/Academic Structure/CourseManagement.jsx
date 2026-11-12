import React, { useState } from "react";
import AcademicNav from "./AcademicNav";
import "./CourseManagement.css";
import { COURSES_LIST, PROGRAMMES_LIST } from "./academicData";
import SpinningWordsBackground from "../components/SpinningWordsBackground";
import MotivationQuoteWidget from "../components/MotivationQuoteWidget";

export default function CourseManagement({ onNavigate }) {
  const [courses, setCourses] = useState(COURSES_LIST);
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    code: "",
    title: "",
    programmeName: "B.Sc. Computer Science & Artificial Intelligence",
    level: "Level 100 (Freshman)",
    creditUnits: 3,
    prerequisites: "None",
    lecturer: "",
    semester: "First Semester",
    lectureHours: 3,
    labHours: 2,
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenModal = (crs = null) => {
    if (crs) {
      setEditingCourse(crs);
      setFormData({
        code: crs.code,
        title: crs.title,
        programmeName: crs.programmeName,
        level: crs.level,
        creditUnits: crs.creditUnits,
        prerequisites: crs.prerequisites,
        lecturer: crs.lecturer,
        semester: crs.semester,
        lectureHours: crs.lectureHours,
        labHours: crs.labHours,
      });
    } else {
      setEditingCourse(null);
      setFormData({
        code: "",
        title: "",
        programmeName: "B.Sc. Computer Science & Artificial Intelligence",
        level: "Level 100 (Freshman)",
        creditUnits: 3,
        prerequisites: "None",
        lecturer: "",
        semester: "First Semester",
        lectureHours: 3,
        labHours: 2,
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveCourse = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.code.trim()) {
      showToast("Please provide Course Code and Title.");
      return;
    }

    if (editingCourse) {
      setCourses((prev) =>
        prev.map((c) =>
          c.id === editingCourse.id
            ? {
                ...c,
                ...formData,
                creditUnits: Number(formData.creditUnits),
                lectureHours: Number(formData.lectureHours),
                labHours: Number(formData.labHours),
              }
            : c
        )
      );
      showToast(`Updated Course Module: ${formData.title}`);
    } else {
      const newCourse = {
        id: `CRS-${Date.now().toString().slice(-4)}`,
        code: formData.code.toUpperCase(),
        title: formData.title,
        programmeName: formData.programmeName,
        level: formData.level,
        creditUnits: Number(formData.creditUnits),
        prerequisites: formData.prerequisites || "None",
        lecturer: formData.lecturer || "Faculty Lecturer",
        semester: formData.semester,
        lectureHours: Number(formData.lectureHours),
        labHours: Number(formData.labHours),
        enrolledCount: 0,
        status: "Active",
      };
      setCourses((prev) => [...prev, newCourse]);
      showToast(`Created new Course Module: ${formData.title}`);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to remove ${title}?`)) {
      setCourses((prev) => prev.filter((c) => c.id !== id));
      showToast(`Removed ${title}`);
    }
  };

  const filteredCourses = courses.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      c.title.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.lecturer.toLowerCase().includes(q) ||
      c.programmeName.toLowerCase().includes(q);
    const matchesLevel = levelFilter === "ALL" || c.level.includes(levelFilter);
    return matchesSearch && matchesLevel;
  });

  const totalCredits = courses.reduce((sum, c) => sum + c.creditUnits, 0);

  return (
    <div className="crm-page-wrapper">
      <SpinningWordsBackground speed="slow" showControlBadge={false} />

      {/* Toast Alert */}
      {toastMessage && <div className="crm-toast">✓ {toastMessage}</div>}

      <AcademicNav
        activePath="/course-management"
        title="Course Management"
        subtitle="Tertiary modules, credit weights, lab sessions, and academic prerequisites"
      />

      <MotivationQuoteWidget compact={true} />

      {/* KPI Stats Strip */}
      <div className="crm-kpi-grid">
        <div className="crm-kpi-card">
          <div className="crm-kpi-top">
            <span className="crm-kpi-label">Tertiary Course Modules</span>
            <span className="crm-kpi-icon">📑</span>
          </div>
          <div className="crm-kpi-val">{courses.length} Modules</div>
          <div className="crm-kpi-sub">Curriculum Credit Syllabus</div>
        </div>

        <div className="crm-kpi-card">
          <div className="crm-kpi-top">
            <span className="crm-kpi-label">Total Credit Units</span>
            <span className="crm-kpi-icon">⭐</span>
          </div>
          <div className="crm-kpi-val" style={{ color: "#38bdf8" }}>
            {totalCredits} Credits
          </div>
          <div className="crm-kpi-sub">Weighted Toward Degree Completion</div>
        </div>

        <div className="crm-kpi-card">
          <div className="crm-kpi-top">
            <span className="crm-kpi-label">Hands-On Lab Courses</span>
            <span className="crm-kpi-icon">🔬</span>
          </div>
          <div className="crm-kpi-val" style={{ color: "#34d399" }}>
            {courses.filter((c) => c.labHours > 0).length} Practical Labs
          </div>
          <div className="crm-kpi-sub">Computer Systems & Robotics</div>
        </div>

        <div className="crm-kpi-card">
          <div className="crm-kpi-top">
            <span className="crm-kpi-label">Cohort Level Coverage</span>
            <span className="crm-kpi-icon">🏛️</span>
          </div>
          <div className="crm-kpi-val" style={{ color: "#fbbf24" }}>
            L100 - L400
          </div>
          <div className="crm-kpi-sub">Freshman to Senior Capstone</div>
        </div>
      </div>

      {/* Action / Search Bar */}
      <div className="crm-action-bar">
        <div className="crm-filters-row">
          <div className="crm-search-box">
            <span className="crm-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search module title, code, lecturer, or prerequisite..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="crm-clear-btn"
                onClick={() => setSearchQuery("")}
              >
                ×
              </button>
            )}
          </div>

          <select
            className="crm-select"
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
          >
            <option value="ALL">All Cohort Levels</option>
            <option value="100">Level 100 (Freshman)</option>
            <option value="200">Level 200 (Sophomore)</option>
            <option value="300">Level 300 (Junior)</option>
            <option value="400">Level 400 (Senior)</option>
          </select>
        </div>

        <button
          type="button"
          className="crm-btn-primary"
          onClick={() => handleOpenModal()}
        >
          <span>＋</span> Create Course Module
        </button>
      </div>

      {/* Course Cards Grid */}
      <div className="crm-cards-grid">
        {filteredCourses.map((c) => (
          <div key={c.id} className="crm-card">
            <div className="crm-card-top">
              <div className="crm-code-badge">{c.code}</div>
              <span className="crm-semester-pill">📅 {c.semester}</span>
            </div>

            <h3 className="crm-course-title">{c.title}</h3>
            <div className="crm-prog-tag">🎓 {c.programmeName}</div>

            <div className="crm-meta-pills">
              <span className="crm-pill crm-pill-lvl">{c.level}</span>
              <span className="crm-pill crm-pill-credit">{c.creditUnits} Credits</span>
              <span className="crm-pill crm-pill-hours">
                {c.lectureHours}h Lecture / {c.labHours}h Lab
              </span>
            </div>

            <div className="crm-details-list">
              <div className="crm-detail-item">
                <span className="crm-detail-label">Course Lecturer:</span>
                <span className="crm-detail-val crm-lecturer-text">
                  👨‍🏫 {c.lecturer}
                </span>
              </div>
              <div className="crm-detail-item">
                <span className="crm-detail-label">Prerequisites:</span>
                <span className="crm-detail-val crm-prereq-text">
                  🔑 {c.prerequisites}
                </span>
              </div>
            </div>

            <div className="crm-card-footer">
              <span className="crm-enrolled-tag">
                👥 {c.enrolledCount} Students Enrolled
              </span>
              <div className="crm-actions-group">
                <button
                  type="button"
                  className="crm-btn-sm"
                  onClick={() => handleOpenModal(c)}
                  title="Edit Course"
                >
                  ✏️ Edit
                </button>
                <button
                  type="button"
                  className="crm-btn-sm crm-btn-danger"
                  onClick={() => handleDelete(c.id, c.title)}
                  title="Delete Course"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="crm-empty-state">
          <p>No tertiary modules found matching criteria.</p>
          <button
            type="button"
            className="crm-btn-primary"
            onClick={() => {
              setSearchQuery("");
              setLevelFilter("ALL");
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="crm-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="crm-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="crm-modal-header">
              <h2>{editingCourse ? "Edit Course Module" : "Create Tertiary Course Module"}</h2>
              <button
                type="button"
                className="crm-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="crm-modal-form">
              <div className="crm-form-row">
                <div className="crm-form-group">
                  <label>Course Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CSC-101, MTH-201"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                  />
                </div>
                <div className="crm-form-group">
                  <label>Credit Units</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={formData.creditUnits}
                    onChange={(e) =>
                      setFormData({ ...formData, creditUnits: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="crm-form-group">
                <label>Course / Module Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Introduction to Algorithmic Problem Solving"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div className="crm-form-group">
                <label>Degree Programme</label>
                <select
                  value={formData.programmeName}
                  onChange={(e) =>
                    setFormData({ ...formData, programmeName: e.target.value })
                  }
                >
                  {PROGRAMMES_LIST.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="crm-form-row">
                <div className="crm-form-group">
                  <label>Academic Level</label>
                  <select
                    value={formData.level}
                    onChange={(e) =>
                      setFormData({ ...formData, level: e.target.value })
                    }
                  >
                    <option value="Level 100 (Freshman)">Level 100 (Freshman)</option>
                    <option value="Level 200 (Sophomore)">Level 200 (Sophomore)</option>
                    <option value="Level 300 (Junior)">Level 300 (Junior)</option>
                    <option value="Level 400 (Senior)">Level 400 (Senior)</option>
                  </select>
                </div>
                <div className="crm-form-group">
                  <label>Semester</label>
                  <select
                    value={formData.semester}
                    onChange={(e) =>
                      setFormData({ ...formData, semester: e.target.value })
                    }
                  >
                    <option value="First Semester">First Semester</option>
                    <option value="Second Semester">Second Semester</option>
                  </select>
                </div>
              </div>

              <div className="crm-form-row">
                <div className="crm-form-group">
                  <label>Lecture Hours / Wk</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={formData.lectureHours}
                    onChange={(e) =>
                      setFormData({ ...formData, lectureHours: e.target.value })
                    }
                  />
                </div>
                <div className="crm-form-group">
                  <label>Lab Hours / Wk</label>
                  <input
                    type="number"
                    min="0"
                    max="6"
                    value={formData.labHours}
                    onChange={(e) =>
                      setFormData({ ...formData, labHours: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="crm-form-row">
                <div className="crm-form-group">
                  <label>Course Lecturer</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Margaret Hamilton"
                    value={formData.lecturer}
                    onChange={(e) =>
                      setFormData({ ...formData, lecturer: e.target.value })
                    }
                  />
                </div>
                <div className="crm-form-group">
                  <label>Prerequisites</label>
                  <input
                    type="text"
                    placeholder="e.g. None or CSC-101"
                    value={formData.prerequisites}
                    onChange={(e) =>
                      setFormData({ ...formData, prerequisites: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="crm-modal-footer">
                <button
                  type="button"
                  className="crm-btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="crm-btn-primary">
                  {editingCourse ? "Save Course" : "Create Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
