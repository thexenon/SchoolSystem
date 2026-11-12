import React, { useState } from "react";
import AcademicNav from "./AcademicNav";
import "./EducationLevels.css";
import { EDUCATION_LEVELS } from "./academicData";
import SpinningWordsBackground from "../components/SpinningWordsBackground";
import MotivationQuoteWidget from "../components/MotivationQuoteWidget";

export default function EducationLevels({ onNavigate }) {
  const [levels, setLevels] = useState(EDUCATION_LEVELS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCampus, setSelectedCampus] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    ageRange: "",
    grades: "",
    gradingSystem: "",
    campus: "Kensington Central Campus",
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenModal = (level = null) => {
    if (level) {
      setEditingLevel(level);
      setFormData({
        code: level.code,
        name: level.name,
        description: level.description,
        ageRange: level.ageRange,
        grades: level.grades.join(", "),
        gradingSystem: level.gradingSystem,
        campus: level.campus,
      });
    } else {
      setEditingLevel(null);
      setFormData({
        code: "",
        name: "",
        description: "",
        ageRange: "",
        grades: "",
        gradingSystem: "WASSCE Scale & GPA",
        campus: "Kensington Central Campus",
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveLevel = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      showToast("Please provide Level Code and Title.");
      return;
    }

    const gradesArray = formData.grades
      .split(",")
      .map((g) => g.trim())
      .filter(Boolean);

    if (editingLevel) {
      setLevels((prev) =>
        prev.map((item) =>
          item.id === editingLevel.id
            ? {
                ...item,
                ...formData,
                grades: gradesArray.length > 0 ? gradesArray : item.grades,
              }
            : item
        )
      );
      showToast(`Updated Education Level: ${formData.name}`);
    } else {
      const newLevel = {
        id: `LVL-00${levels.length + 1}`,
        code: formData.code.toUpperCase(),
        name: formData.name,
        description: formData.description,
        ageRange: formData.ageRange || "All Ages",
        grades: gradesArray.length > 0 ? gradesArray : ["Foundation Grade"],
        gradingSystem: formData.gradingSystem,
        activeClassesCount: 1,
        totalStudents: 0,
        status: "Active",
        campus: formData.campus,
      };
      setLevels((prev) => [...prev, newLevel]);
      showToast(`Created new Education Level: ${formData.name}`);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete the level "${name}"?`)) {
      setLevels((prev) => prev.filter((item) => item.id !== id));
      showToast(`Deleted ${name}`);
    }
  };

  const handleToggleStatus = (id) => {
    setLevels((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === "Active" ? "Inactive" : "Active" }
          : item
      )
    );
  };

  const filteredLevels = levels.filter((lvl) => {
    const matchesSearch =
      lvl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lvl.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lvl.gradingSystem.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCampus =
      selectedCampus === "ALL" || lvl.campus === selectedCampus;
    return matchesSearch && matchesCampus;
  });

  const totalStudents = levels.reduce((acc, curr) => acc + curr.totalStudents, 0);
  const totalClasses = levels.reduce((acc, curr) => acc + curr.activeClassesCount, 0);

  return (
    <div className="el-page-wrapper">
      <SpinningWordsBackground speed="slow" showControlBadge={false} />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="el-toast">
          ✓ {toastMessage}
        </div>
      )}

      {/* Academic Sub-navigation */}
      <AcademicNav
        activePath="/education-levels"
        title="Education Levels"
        subtitle="Kindergarten, Primary, Junior High, Senior High & Tertiary"
      />

      {/* Motivational Quote Widget */}
      <MotivationQuoteWidget compact={true} />

      {/* KPI Stats Strip */}
      <div className="el-kpi-grid">
        <div className="el-kpi-card">
          <div className="el-kpi-top">
            <span className="el-kpi-label">Configured Levels</span>
            <span className="el-kpi-icon">🏛️</span>
          </div>
          <div className="el-kpi-val">{levels.length}</div>
          <div className="el-kpi-sub">Across 3 Specialized Campuses</div>
        </div>

        <div className="el-kpi-card">
          <div className="el-kpi-top">
            <span className="el-kpi-label">Active Academic Classes</span>
            <span className="el-kpi-icon">🏫</span>
          </div>
          <div className="el-kpi-val" style={{ color: "#38bdf8" }}>
            {totalClasses}
          </div>
          <div className="el-kpi-sub">Streams & Section Groups</div>
        </div>

        <div className="el-kpi-card">
          <div className="el-kpi-top">
            <span className="el-kpi-label">Total Enrolled Students</span>
            <span className="el-kpi-icon">👥</span>
          </div>
          <div className="el-kpi-val" style={{ color: "#34d399" }}>
            {totalStudents.toLocaleString()}
          </div>
          <div className="el-kpi-sub">Active Student Body</div>
        </div>

        <div className="el-kpi-card">
          <div className="el-kpi-top">
            <span className="el-kpi-label">Accreditation Span</span>
            <span className="el-kpi-icon">📜</span>
          </div>
          <div className="el-kpi-val" style={{ color: "#fbbf24" }}>
            GES / WAEC / GTEC
          </div>
          <div className="el-kpi-sub">Kindergarten to Tertiary Degree</div>
        </div>
      </div>

      {/* Action and Filter Bar */}
      <div className="el-action-bar">
        <div className="el-filters-group">
          <div className="el-search-box">
            <span className="el-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search level name, code, or grading scale..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="el-clear-btn"
                onClick={() => setSearchQuery("")}
              >
                ×
              </button>
            )}
          </div>

          <select
            className="el-select"
            value={selectedCampus}
            onChange={(e) => setSelectedCampus(e.target.value)}
          >
            <option value="ALL">All Campuses</option>
            <option value="Kensington Central Campus">Kensington Central Campus</option>
            <option value="North London Science Wing">North London Science Wing</option>
            <option value="Innovation Technology Campus">Innovation Technology Campus</option>
          </select>
        </div>

        <button
          type="button"
          className="el-btn-primary"
          onClick={() => handleOpenModal()}
        >
          <span>＋</span> Add Education Level
        </button>
      </div>

      {/* Education Levels Cards Grid */}
      <div className="el-cards-grid">
        {filteredLevels.map((lvl) => (
          <div key={lvl.id} className="el-card">
            <div className="el-card-header">
              <div className="el-badge-code">{lvl.code}</div>
              <span
                className={`el-status-pill ${
                  lvl.status === "Active" ? "pill-active" : "pill-inactive"
                }`}
                onClick={() => handleToggleStatus(lvl.id)}
                title="Click to toggle status"
              >
                ● {lvl.status}
              </span>
            </div>

            <h3 className="el-card-title">{lvl.name}</h3>
            <p className="el-card-desc">{lvl.description}</p>

            <div className="el-meta-row">
              <div className="el-meta-item">
                <span className="el-meta-label">Target Age:</span>
                <span className="el-meta-value">{lvl.ageRange}</span>
              </div>
              <div className="el-meta-item">
                <span className="el-meta-label">Campus:</span>
                <span className="el-meta-value">{lvl.campus}</span>
              </div>
            </div>

            <div className="el-meta-row">
              <div className="el-meta-item">
                <span className="el-meta-label">Grading System:</span>
                <span className="el-meta-value el-highlight-text">
                  {lvl.gradingSystem}
                </span>
              </div>
            </div>

            <div className="el-grades-section">
              <div className="el-grades-title">Spanned Grades / Cohorts:</div>
              <div className="el-grades-chips">
                {lvl.grades.map((grade, idx) => (
                  <span key={idx} className="el-grade-chip">
                    {grade}
                  </span>
                ))}
              </div>
            </div>

            <div className="el-card-footer">
              <div className="el-footer-stats">
                <span>🏫 {lvl.activeClassesCount} Classes</span>
                <span>•</span>
                <span>👥 {lvl.totalStudents} Students</span>
              </div>

              <div className="el-card-actions">
                <button
                  type="button"
                  className="el-btn-icon"
                  onClick={() => handleOpenModal(lvl)}
                  title="Edit Level Configuration"
                >
                  ✏️ Edit
                </button>
                <button
                  type="button"
                  className="el-btn-icon el-btn-delete"
                  onClick={() => handleDelete(lvl.id, lvl.name)}
                  title="Delete Level"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredLevels.length === 0 && (
        <div className="el-empty-state">
          <p>No education levels match your search criteria.</p>
          <button
            type="button"
            className="el-btn-primary"
            onClick={() => {
              setSearchQuery("");
              setSelectedCampus("ALL");
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="el-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="el-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="el-modal-header">
              <h2>{editingLevel ? "Edit Education Level" : "Create Education Level"}</h2>
              <button
                type="button"
                className="el-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveLevel} className="el-modal-form">
              <div className="el-form-row">
                <div className="el-form-group">
                  <label>Level Code (Short)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SHS, TER, PRI"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                  />
                </div>

                <div className="el-form-group">
                  <label>Age Range</label>
                  <input
                    type="text"
                    placeholder="e.g. 15 - 18 Years"
                    value={formData.ageRange}
                    onChange={(e) =>
                      setFormData({ ...formData, ageRange: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="el-form-group">
                <label>Education Level Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior High School (SHS)"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="el-form-group">
                <label>Description & Educational Scope</label>
                <textarea
                  rows={2}
                  placeholder="Outline the curriculum and goals for this level..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="el-form-group">
                <label>Grades / Form Classes (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Grade 10, Grade 11, Grade 12"
                  value={formData.grades}
                  onChange={(e) =>
                    setFormData({ ...formData, grades: e.target.value })
                  }
                />
              </div>

              <div className="el-form-row">
                <div className="el-form-group">
                  <label>Grading System</label>
                  <input
                    type="text"
                    placeholder="e.g. WASSCE Scale & GPA 4.0"
                    value={formData.gradingSystem}
                    onChange={(e) =>
                      setFormData({ ...formData, gradingSystem: e.target.value })
                    }
                  />
                </div>

                <div className="el-form-group">
                  <label>Primary Campus</label>
                  <select
                    value={formData.campus}
                    onChange={(e) =>
                      setFormData({ ...formData, campus: e.target.value })
                    }
                  >
                    <option value="Kensington Central Campus">
                      Kensington Central Campus
                    </option>
                    <option value="North London Science Wing">
                      North London Science Wing
                    </option>
                    <option value="Innovation Technology Campus">
                      Innovation Technology Campus
                    </option>
                  </select>
                </div>
              </div>

              <div className="el-modal-footer">
                <button
                  type="button"
                  className="el-btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="el-btn-primary">
                  {editingLevel ? "Save Changes" : "Create Level"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
