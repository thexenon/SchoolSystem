import React, { useState } from "react";
import AcademicNav from "./AcademicNav";
import "./SubjectManagement.css";
import { SUBJECTS_LIST, DEPARTMENTS_LIST } from "./academicData";
import SpinningWordsBackground from "../components/SpinningWordsBackground";
import MotivationQuoteWidget from "../components/MotivationQuoteWidget";

export default function SubjectManagement({ onNavigate }) {
  const [subjects, setSubjects] = useState(SUBJECTS_LIST);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    code: "",
    title: "",
    category: "Core",
    departmentId: "DPT-01",
    periodsPerWeek: 5,
    creditHours: 4,
    leadTeacher: "",
    syllabusCode: "WAEC-2026",
    levels: "SHS",
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenModal = (sub = null) => {
    if (sub) {
      setEditingSubject(sub);
      setFormData({
        code: sub.code,
        title: sub.title,
        category: sub.category,
        departmentId: sub.departmentId,
        periodsPerWeek: sub.periodsPerWeek,
        creditHours: sub.creditHours,
        leadTeacher: sub.leadTeacher,
        syllabusCode: sub.syllabusCode,
        levels: sub.levels.join(", "),
      });
    } else {
      setEditingSubject(null);
      setFormData({
        code: "",
        title: "",
        category: "Core",
        departmentId: "DPT-01",
        periodsPerWeek: 5,
        creditHours: 4,
        leadTeacher: "",
        syllabusCode: "WAEC-2026",
        levels: "SHS",
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveSubject = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.code.trim()) {
      showToast("Please provide Subject Code and Title.");
      return;
    }

    const matchedDept = DEPARTMENTS_LIST.find((d) => d.id === formData.departmentId);
    const departmentName = matchedDept ? matchedDept.name : "Department of Sciences & Mathematics";
    const levelsArr = formData.levels.split(",").map((l) => l.trim()).filter(Boolean);

    if (editingSubject) {
      setSubjects((prev) =>
        prev.map((s) =>
          s.id === editingSubject.id
            ? {
                ...s,
                ...formData,
                departmentName,
                periodsPerWeek: Number(formData.periodsPerWeek),
                creditHours: Number(formData.creditHours),
                levels: levelsArr.length > 0 ? levelsArr : s.levels,
              }
            : s
        )
      );
      showToast(`Updated Subject: ${formData.title}`);
    } else {
      const newSubject = {
        id: `SUB-${Date.now().toString().slice(-4)}`,
        code: formData.code.toUpperCase(),
        title: formData.title,
        category: formData.category,
        departmentId: formData.departmentId,
        departmentName,
        periodsPerWeek: Number(formData.periodsPerWeek),
        creditHours: Number(formData.creditHours),
        leadTeacher: formData.leadTeacher || "Faculty Member",
        levels: levelsArr.length > 0 ? levelsArr : ["SHS"],
        syllabusCode: formData.syllabusCode,
        status: "Active",
      };
      setSubjects((prev) => [...prev, newSubject]);
      showToast(`Created new Subject: ${formData.title}`);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete ${title}?`)) {
      setSubjects((prev) => prev.filter((s) => s.id !== id));
      showToast(`Deleted ${title}`);
    }
  };

  const filteredSubjects = subjects.filter((sub) => {
    const matchesSearch =
      sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.leadTeacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.syllabusCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === "ALL" || sub.category === categoryFilter;
    const matchesDept = deptFilter === "ALL" || sub.departmentId === deptFilter;
    return matchesSearch && matchesCat && matchesDept;
  });

  const coreCount = subjects.filter((s) => s.category === "Core").length;
  const electiveCount = subjects.filter((s) => s.category === "Elective").length;

  return (
    <div className="sbm-page-wrapper">
      <SpinningWordsBackground speed="slow" showControlBadge={false} />

      {/* Toast Alert */}
      {toastMessage && <div className="sbm-toast">✓ {toastMessage}</div>}

      <AcademicNav
        activePath="/subject-management"
        title="Subject Management"
        subtitle="School subject catalogue, WAEC syllabus codes, and credit hours"
      />

      <MotivationQuoteWidget compact={true} />

      {/* KPI Stats Strip */}
      <div className="sbm-kpi-grid">
        <div className="sbm-kpi-card">
          <div className="sbm-kpi-top">
            <span className="sbm-kpi-label">Total School Subjects</span>
            <span className="sbm-kpi-icon">📚</span>
          </div>
          <div className="sbm-kpi-val">{subjects.length}</div>
          <div className="sbm-kpi-sub">Accredited WAEC & Cambridge Syllabus</div>
        </div>

        <div className="sbm-kpi-card">
          <div className="sbm-kpi-top">
            <span className="sbm-kpi-label">Core Subjects</span>
            <span className="sbm-kpi-icon">⭐</span>
          </div>
          <div className="sbm-kpi-val" style={{ color: "#38bdf8" }}>
            {coreCount} Core Subjects
          </div>
          <div className="sbm-kpi-sub">Mandatory for all enrolled cohorts</div>
        </div>

        <div className="sbm-kpi-card">
          <div className="sbm-kpi-top">
            <span className="sbm-kpi-label">Elective Subjects</span>
            <span className="sbm-kpi-icon">🔬</span>
          </div>
          <div className="sbm-kpi-val" style={{ color: "#34d399" }}>
            {electiveCount} Electives
          </div>
          <div className="sbm-kpi-sub">STEM, Arts, Business & Computing</div>
        </div>

        <div className="sbm-kpi-card">
          <div className="sbm-kpi-top">
            <span className="sbm-kpi-label">Weekly Periods Taught</span>
            <span className="sbm-kpi-icon">⏱️</span>
          </div>
          <div className="sbm-kpi-val" style={{ color: "#fbbf24" }}>
            {subjects.reduce((sum, s) => sum + s.periodsPerWeek, 0)} Periods
          </div>
          <div className="sbm-kpi-sub">Across Academic Timetable</div>
        </div>
      </div>

      {/* Action / Search Bar */}
      <div className="sbm-action-bar">
        <div className="sbm-filters-row">
          <div className="sbm-search-box">
            <span className="sbm-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search subject title, code, teacher, or syllabus..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="sbm-clear-btn"
                onClick={() => setSearchQuery("")}
              >
                ×
              </button>
            )}
          </div>

          <select
            className="sbm-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="ALL">All Categories</option>
            <option value="Core">Core Subjects</option>
            <option value="Elective">Elective Subjects</option>
          </select>

          <select
            className="sbm-select"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            <option value="ALL">All Departments</option>
            {DEPARTMENTS_LIST.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="sbm-btn-primary"
          onClick={() => handleOpenModal()}
        >
          <span>＋</span> Add New Subject
        </button>
      </div>

      {/* Subjects Cards Grid */}
      <div className="sbm-cards-grid">
        {filteredSubjects.map((sub) => (
          <div key={sub.id} className="sbm-card">
            <div className="sbm-card-top">
              <div className="sbm-code-badge">{sub.code}</div>
              <span
                className={`sbm-cat-pill ${
                  sub.category === "Core" ? "sbm-cat-core" : "sbm-cat-elec"
                }`}
              >
                ★ {sub.category}
              </span>
            </div>

            <h3 className="sbm-title">{sub.title}</h3>
            <div className="sbm-dept-label">🏢 {sub.departmentName}</div>

            <div className="sbm-info-grid">
              <div className="sbm-info-box">
                <span className="sbm-info-tag">Periods / Wk</span>
                <span className="sbm-info-number">{sub.periodsPerWeek} Hrs</span>
              </div>
              <div className="sbm-info-box">
                <span className="sbm-info-tag">Credit Units</span>
                <span className="sbm-info-number">{sub.creditHours} Credits</span>
              </div>
            </div>

            <div className="sbm-meta-row">
              <span className="sbm-meta-label">Lead Instructor:</span>
              <span className="sbm-meta-val sbm-teacher-highlight">
                👨‍🏫 {sub.leadTeacher}
              </span>
            </div>

            <div className="sbm-meta-row">
              <span className="sbm-meta-label">Syllabus Code:</span>
              <span className="sbm-syllabus-chip">{sub.syllabusCode}</span>
            </div>

            <div className="sbm-levels-row">
              <span className="sbm-meta-label">Levels:</span>
              <div className="sbm-level-chips">
                {sub.levels.map((lvl, idx) => (
                  <span key={idx} className="sbm-lvl-badge">
                    {lvl}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="sbm-card-footer">
              <span className="sbm-status-label">● Active Curriculum</span>
              <div className="sbm-actions-group">
                <button
                  type="button"
                  className="sbm-btn-sm"
                  onClick={() => handleOpenModal(sub)}
                  title="Edit Subject"
                >
                  ✏️ Edit
                </button>
                <button
                  type="button"
                  className="sbm-btn-sm sbm-btn-danger"
                  onClick={() => handleDelete(sub.id, sub.title)}
                  title="Delete Subject"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSubjects.length === 0 && (
        <div className="sbm-empty-state">
          <p>No subjects found for current search filters.</p>
          <button
            type="button"
            className="sbm-btn-primary"
            onClick={() => {
              setSearchQuery("");
              setCategoryFilter("ALL");
              setDeptFilter("ALL");
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="sbm-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="sbm-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="sbm-modal-header">
              <h2>{editingSubject ? "Edit School Subject" : "Create New Subject"}</h2>
              <button
                type="button"
                className="sbm-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveSubject} className="sbm-modal-form">
              <div className="sbm-form-row">
                <div className="sbm-form-group">
                  <label>Subject Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MTH-401, PHY-302"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                  />
                </div>
                <div className="sbm-form-group">
                  <label>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    <option value="Core">Core (Mandatory)</option>
                    <option value="Elective">Elective (Specialized)</option>
                  </select>
                </div>
              </div>

              <div className="sbm-form-group">
                <label>Subject Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced Calculus & Mechanics"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div className="sbm-form-group">
                <label>Academic Department</label>
                <select
                  value={formData.departmentId}
                  onChange={(e) =>
                    setFormData({ ...formData, departmentId: e.target.value })
                  }
                >
                  {DEPARTMENTS_LIST.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sbm-form-row">
                <div className="sbm-form-group">
                  <label>Weekly Periods</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={formData.periodsPerWeek}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        periodsPerWeek: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="sbm-form-group">
                  <label>Credit Hours</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={formData.creditHours}
                    onChange={(e) =>
                      setFormData({ ...formData, creditHours: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="sbm-form-row">
                <div className="sbm-form-group">
                  <label>Lead Teacher / Faculty</label>
                  <input
                    type="text"
                    placeholder="e.g. Mr. Kofi Annan"
                    value={formData.leadTeacher}
                    onChange={(e) =>
                      setFormData({ ...formData, leadTeacher: e.target.value })
                    }
                  />
                </div>
                <div className="sbm-form-group">
                  <label>Syllabus Code</label>
                  <input
                    type="text"
                    placeholder="e.g. WAEC-MTH-2026"
                    value={formData.syllabusCode}
                    onChange={(e) =>
                      setFormData({ ...formData, syllabusCode: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="sbm-form-group">
                <label>Applicable Education Levels (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. JHS, SHS, Tertiary"
                  value={formData.levels}
                  onChange={(e) =>
                    setFormData({ ...formData, levels: e.target.value })
                  }
                />
              </div>

              <div className="sbm-modal-footer">
                <button
                  type="button"
                  className="sbm-btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="sbm-btn-primary">
                  {editingSubject ? "Save Subject" : "Create Subject"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
