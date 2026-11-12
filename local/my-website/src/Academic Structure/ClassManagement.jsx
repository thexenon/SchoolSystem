import React, { useState } from "react";
import AcademicNav from "./AcademicNav";
import "./ClassManagement.css";
import { CLASSES_LIST, EDUCATION_LEVELS } from "./academicData";
import SpinningWordsBackground from "../components/SpinningWordsBackground";
import MotivationQuoteWidget from "../components/MotivationQuoteWidget";

export default function ClassManagement({ onNavigate }) {
  const [classes, setClasses] = useState(CLASSES_LIST);
  const [selectedLevel, setSelectedLevel] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    levelId: "LVL-004",
    headTeacher: "",
    room: "",
    capacity: 120,
    academicYear: "2026/2027",
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenModal = (cls = null) => {
    if (cls) {
      setEditingClass(cls);
      setFormData({
        code: cls.code,
        name: cls.name,
        levelId: cls.levelId,
        headTeacher: cls.headTeacher,
        room: cls.room,
        capacity: cls.capacity,
        academicYear: cls.academicYear,
      });
    } else {
      setEditingClass(null);
      setFormData({
        code: "",
        name: "",
        levelId: "LVL-004",
        headTeacher: "",
        room: "",
        capacity: 100,
        academicYear: "2026/2027",
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveClass = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      showToast("Please enter Class Code and Name.");
      return;
    }

    const matchedLevel = EDUCATION_LEVELS.find((l) => l.id === formData.levelId);
    const levelName = matchedLevel ? matchedLevel.name : "Senior High School";

    if (editingClass) {
      setClasses((prev) =>
        prev.map((c) =>
          c.id === editingClass.id
            ? {
                ...c,
                ...formData,
                levelName,
                capacity: Number(formData.capacity),
              }
            : c
        )
      );
      showToast(`Updated Class: ${formData.name}`);
    } else {
      const newClass = {
        id: `CLS-${Date.now().toString().slice(-4)}`,
        code: formData.code.toUpperCase(),
        name: formData.name,
        levelId: formData.levelId,
        levelName,
        headTeacher: formData.headTeacher || "Unassigned",
        room: formData.room || "Room TBA",
        capacity: Number(formData.capacity),
        enrolledCount: 0,
        streamsCount: 1,
        academicYear: formData.academicYear,
        status: "Active",
      };
      setClasses((prev) => [...prev, newClass]);
      showToast(`Created new Class: ${formData.name}`);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name}?`)) {
      setClasses((prev) => prev.filter((c) => c.id !== id));
      showToast(`Removed class ${name}`);
    }
  };

  const filteredClasses = classes.filter((cls) => {
    const matchesSearch =
      cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.headTeacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.room.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel =
      selectedLevel === "ALL" || cls.levelId === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  const totalSeats = classes.reduce((sum, c) => sum + c.capacity, 0);
  const totalEnrolled = classes.reduce((sum, c) => sum + c.enrolledCount, 0);

  return (
    <div className="cm-page-wrapper">
      <SpinningWordsBackground speed="slow" showControlBadge={false} />

      {/* Toast Alert */}
      {toastMessage && <div className="cm-toast">✓ {toastMessage}</div>}

      <AcademicNav
        activePath="/class-management"
        title="Class Management"
        subtitle="Manage grades, capacity, form teachers, and classrooms"
      />

      <MotivationQuoteWidget compact={true} />

      {/* KPI Stats */}
      <div className="cm-kpi-grid">
        <div className="cm-kpi-card">
          <div className="cm-kpi-top">
            <span className="cm-kpi-label">Active Grades / Classes</span>
            <span className="cm-kpi-icon">🏫</span>
          </div>
          <div className="cm-kpi-val">{classes.length}</div>
          <div className="cm-kpi-sub">Across All Education Levels</div>
        </div>

        <div className="cm-kpi-card">
          <div className="cm-kpi-top">
            <span className="cm-kpi-label">Total Student Capacity</span>
            <span className="cm-kpi-icon">🪑</span>
          </div>
          <div className="cm-kpi-val" style={{ color: "#38bdf8" }}>
            {totalSeats.toLocaleString()} Seats
          </div>
          <div className="cm-kpi-sub">Allocated Across Classrooms</div>
        </div>

        <div className="cm-kpi-card">
          <div className="cm-kpi-top">
            <span className="cm-kpi-label">Enrolled Enrollment</span>
            <span className="cm-kpi-icon">👥</span>
          </div>
          <div className="cm-kpi-val" style={{ color: "#34d399" }}>
            {totalEnrolled.toLocaleString()}
          </div>
          <div className="cm-kpi-sub">
            {Math.round((totalEnrolled / (totalSeats || 1)) * 100)}% Capacity Utilized
          </div>
        </div>

        <div className="cm-kpi-card">
          <div className="cm-kpi-top">
            <span className="cm-kpi-label">Current Academic Year</span>
            <span className="cm-kpi-icon">📅</span>
          </div>
          <div className="cm-kpi-val" style={{ color: "#fbbf24" }}>
            2026/2027
          </div>
          <div className="cm-kpi-sub">Term 1 Active Session</div>
        </div>
      </div>

      {/* Action / Search Bar */}
      <div className="cm-action-bar">
        <div className="cm-filters-row">
          <div className="cm-search-box">
            <span className="cm-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search class name, teacher, room, or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="cm-clear-btn"
                onClick={() => setSearchQuery("")}
              >
                ×
              </button>
            )}
          </div>

          <select
            className="cm-select"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
          >
            <option value="ALL">All Education Levels</option>
            {EDUCATION_LEVELS.map((lvl) => (
              <option key={lvl.id} value={lvl.id}>
                {lvl.code} - {lvl.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="cm-btn-primary"
          onClick={() => handleOpenModal()}
        >
          <span>＋</span> Create New Class
        </button>
      </div>

      {/* Class Cards Grid */}
      <div className="cm-cards-grid">
        {filteredClasses.map((cls) => {
          const fillPct = Math.min(
            100,
            Math.round((cls.enrolledCount / (cls.capacity || 1)) * 100)
          );
          return (
            <div key={cls.id} className="cm-card">
              <div className="cm-card-top">
                <div className="cm-code-badge">{cls.code}</div>
                <span className="cm-level-pill">{cls.levelName}</span>
              </div>

              <h3 className="cm-class-name">{cls.name}</h3>

              <div className="cm-info-list">
                <div className="cm-info-item">
                  <span className="cm-info-label">Form Master / Head:</span>
                  <span className="cm-info-val cm-bold-teacher">
                    👨‍🏫 {cls.headTeacher}
                  </span>
                </div>
                <div className="cm-info-item">
                  <span className="cm-info-label">Assigned Room:</span>
                  <span className="cm-info-val">📍 {cls.room}</span>
                </div>
                <div className="cm-info-item">
                  <span className="cm-info-label">Stream Divisions:</span>
                  <span className="cm-info-val cm-streams-tag">
                    🔀 {cls.streamsCount} Stream Sections
                  </span>
                </div>
              </div>

              {/* Capacity Progress Bar */}
              <div className="cm-capacity-box">
                <div className="cm-capacity-header">
                  <span>Student Enrollment</span>
                  <span className="cm-capacity-ratio">
                    {cls.enrolledCount} / {cls.capacity} ({fillPct}%)
                  </span>
                </div>
                <div className="cm-progress-track">
                  <div
                    className="cm-progress-fill"
                    style={{
                      width: `${fillPct}%`,
                      backgroundColor:
                        fillPct >= 95 ? "#f59e0b" : fillPct > 70 ? "#38bdf8" : "#10b981",
                    }}
                  />
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="cm-card-footer">
                <span className="cm-academic-year">📅 {cls.academicYear}</span>
                <div className="cm-actions-group">
                  <button
                    type="button"
                    className="cm-btn-sm"
                    onClick={() => handleOpenModal(cls)}
                    title="Edit Class details"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    type="button"
                    className="cm-btn-sm cm-btn-danger"
                    onClick={() => handleDelete(cls.id, cls.name)}
                    title="Delete Class"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredClasses.length === 0 && (
        <div className="cm-empty-state">
          <p>No classes match the current search or level filter.</p>
          <button
            type="button"
            className="cm-btn-primary"
            onClick={() => {
              setSearchQuery("");
              setSelectedLevel("ALL");
            }}
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Add / Edit Class Modal */}
      {isModalOpen && (
        <div className="cm-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="cm-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="cm-modal-header">
              <h2>{editingClass ? "Edit Class Details" : "Create New Class / Grade"}</h2>
              <button
                type="button"
                className="cm-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveClass} className="cm-modal-form">
              <div className="cm-form-row">
                <div className="cm-form-group">
                  <label>Class Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GR-11, JHS-2"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                  />
                </div>
                <div className="cm-form-group">
                  <label>Education Level</label>
                  <select
                    value={formData.levelId}
                    onChange={(e) =>
                      setFormData({ ...formData, levelId: e.target.value })
                    }
                  >
                    {EDUCATION_LEVELS.map((lvl) => (
                      <option key={lvl.id} value={lvl.id}>
                        {lvl.name} ({lvl.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="cm-form-group">
                <label>Class Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grade 11 (Senior High 2)"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="cm-form-row">
                <div className="cm-form-group">
                  <label>Form Master / Head Teacher</label>
                  <input
                    type="text"
                    placeholder="e.g. Mrs. Sarah Jenkins"
                    value={formData.headTeacher}
                    onChange={(e) =>
                      setFormData({ ...formData, headTeacher: e.target.value })
                    }
                  />
                </div>
                <div className="cm-form-group">
                  <label>Classroom / Hall Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Block C, Room 102"
                    value={formData.room}
                    onChange={(e) =>
                      setFormData({ ...formData, room: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="cm-form-row">
                <div className="cm-form-group">
                  <label>Total Student Capacity</label>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    value={formData.capacity}
                    onChange={(e) =>
                      setFormData({ ...formData, capacity: e.target.value })
                    }
                  />
                </div>
                <div className="cm-form-group">
                  <label>Academic Year</label>
                  <input
                    type="text"
                    value={formData.academicYear}
                    onChange={(e) =>
                      setFormData({ ...formData, academicYear: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="cm-modal-footer">
                <button
                  type="button"
                  className="cm-btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="cm-btn-primary">
                  {editingClass ? "Update Class" : "Create Class"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
