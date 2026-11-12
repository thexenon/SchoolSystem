import React, { useState } from "react";
import AcademicNav from "./AcademicNav";
import "./StreamsAndSections.css";
import { STREAMS_LIST, CLASSES_LIST } from "./academicData";
import SpinningWordsBackground from "../components/SpinningWordsBackground";
import MotivationQuoteWidget from "../components/MotivationQuoteWidget";

export default function StreamsAndSections({ onNavigate }) {
  const [streams, setStreams] = useState(STREAMS_LIST);
  const [selectedClass, setSelectedClass] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStream, setEditingStream] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    classId: "CLS-102",
    specialization: "General Science & STEM",
    classTeacher: "Mrs. Sarah Jenkins",
    room: "Science Wing Lab 1",
    capacity: 35,
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenModal = (str = null) => {
    if (str) {
      setEditingStream(str);
      setFormData({
        code: str.code,
        name: str.name,
        classId: str.classId,
        specialization: str.specialization,
        classTeacher: str.classTeacher,
        room: str.room,
        capacity: str.capacity,
      });
    } else {
      setEditingStream(null);
      setFormData({
        code: "",
        name: "",
        classId: "CLS-102",
        specialization: "General Science & STEM",
        classTeacher: "",
        room: "",
        capacity: 35,
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveStream = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      showToast("Please provide Section Code and Stream Name.");
      return;
    }

    const matchedClass = CLASSES_LIST.find((c) => c.id === formData.classId);
    const className = matchedClass ? matchedClass.name : "Grade 11 (Senior High 2)";

    if (editingStream) {
      setStreams((prev) =>
        prev.map((s) =>
          s.id === editingStream.id
            ? {
                ...s,
                ...formData,
                className,
                capacity: Number(formData.capacity),
              }
            : s
        )
      );
      showToast(`Updated Stream Section: ${formData.name}`);
    } else {
      const newStream = {
        id: `STR-00${streams.length + 1}`,
        code: formData.code.toUpperCase(),
        name: formData.name,
        classId: formData.classId,
        className,
        specialization: formData.specialization,
        classTeacher: formData.classTeacher || "TBA",
        room: formData.room || "Room TBA",
        capacity: Number(formData.capacity),
        enrolledCount: 0,
        subjectsCount: 7,
        status: "Active",
      };
      setStreams((prev) => [...prev, newStream]);
      showToast(`Created new Stream Section: ${formData.name}`);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove stream "${name}"?`)) {
      setStreams((prev) => prev.filter((s) => s.id !== id));
      showToast(`Removed ${name}`);
    }
  };

  const filteredStreams = streams.filter((str) => {
    const matchesSearch =
      str.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      str.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      str.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      str.classTeacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      str.room.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass =
      selectedClass === "ALL" || str.classId === selectedClass;
    return matchesSearch && matchesClass;
  });

  const totalSeats = streams.reduce((sum, s) => sum + s.capacity, 0);
  const totalEnrolled = streams.reduce((sum, s) => sum + s.enrolledCount, 0);

  return (
    <div className="ss-page-wrapper">
      <SpinningWordsBackground speed="slow" showControlBadge={false} />

      {/* Toast Alert */}
      {toastMessage && <div className="ss-toast">✓ {toastMessage}</div>}

      <AcademicNav
        activePath="/streams-and-sections"
        title="Streams & Sections"
        subtitle="Divide classes into specialized cohorts, tracks, and laboratory sets"
      />

      <MotivationQuoteWidget compact={true} />

      {/* KPI Stats Strip */}
      <div className="ss-kpi-grid">
        <div className="ss-kpi-card">
          <div className="ss-kpi-top">
            <span className="ss-kpi-label">Active Streams & Sections</span>
            <span className="ss-kpi-icon">🔀</span>
          </div>
          <div className="ss-kpi-val">{streams.length}</div>
          <div className="ss-kpi-sub">Science, Arts, Business & STEM Sets</div>
        </div>

        <div className="ss-kpi-card">
          <div className="ss-kpi-top">
            <span className="ss-kpi-label">Allocated Stream Seats</span>
            <span className="ss-kpi-icon">🪑</span>
          </div>
          <div className="ss-kpi-val" style={{ color: "#38bdf8" }}>
            {totalSeats} Seats
          </div>
          <div className="ss-kpi-sub">Average 35 Students per Cohort</div>
        </div>

        <div className="ss-kpi-card">
          <div className="ss-kpi-top">
            <span className="ss-kpi-label">Enrolled in Streams</span>
            <span className="ss-kpi-icon">👥</span>
          </div>
          <div className="ss-kpi-val" style={{ color: "#34d399" }}>
            {totalEnrolled}
          </div>
          <div className="ss-kpi-sub">
            {Math.round((totalEnrolled / (totalSeats || 1)) * 100)}% Fill Rate
          </div>
        </div>

        <div className="ss-kpi-card">
          <div className="ss-kpi-top">
            <span className="ss-kpi-label">Specialization Tracks</span>
            <span className="ss-kpi-icon">🎯</span>
          </div>
          <div className="ss-kpi-val" style={{ color: "#fbbf24" }}>
            5 Pathways
          </div>
          <div className="ss-kpi-sub">STEM, Arts, Business & Computing</div>
        </div>
      </div>

      {/* Action / Search Bar */}
      <div className="ss-action-bar">
        <div className="ss-filters-row">
          <div className="ss-search-box">
            <span className="ss-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search stream name, teacher, track, or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="ss-clear-btn"
                onClick={() => setSearchQuery("")}
              >
                ×
              </button>
            )}
          </div>

          <select
            className="ss-select"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="ALL">All Parent Classes</option>
            {CLASSES_LIST.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.code})
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="ss-btn-primary"
          onClick={() => handleOpenModal()}
        >
          <span>＋</span> Split / Create Stream
        </button>
      </div>

      {/* Streams Cards Grid */}
      <div className="ss-cards-grid">
        {filteredStreams.map((str) => {
          const fillPct = Math.min(
            100,
            Math.round((str.enrolledCount / (str.capacity || 1)) * 100)
          );
          return (
            <div key={str.id} className="ss-card">
              <div className="ss-card-top">
                <div className="ss-code-badge">{str.code}</div>
                <span className="ss-parent-tag">Parent: {str.className}</span>
              </div>

              <h3 className="ss-stream-title">{str.name}</h3>

              <div className="ss-spec-pill">
                <span>🎯 Track:</span> <strong>{str.specialization}</strong>
              </div>

              <div className="ss-info-list">
                <div className="ss-info-item">
                  <span className="ss-info-label">Section Tutor:</span>
                  <span className="ss-info-val ss-teacher-highlight">
                    👨‍🏫 {str.classTeacher}
                  </span>
                </div>
                <div className="ss-info-item">
                  <span className="ss-info-label">Room / Lab:</span>
                  <span className="ss-info-val">📍 {str.room}</span>
                </div>
                <div className="ss-info-item">
                  <span className="ss-info-label">Subjects Taught:</span>
                  <span className="ss-info-val">📚 {str.subjectsCount} Subjects</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="ss-capacity-box">
                <div className="ss-capacity-header">
                  <span>Stream Roster</span>
                  <span className="ss-capacity-ratio">
                    {str.enrolledCount} / {str.capacity} ({fillPct}%)
                  </span>
                </div>
                <div className="ss-progress-track">
                  <div
                    className="ss-progress-fill"
                    style={{
                      width: `${fillPct}%`,
                      backgroundColor:
                        fillPct >= 90 ? "#f59e0b" : fillPct > 70 ? "#38bdf8" : "#10b981",
                    }}
                  />
                </div>
              </div>

              {/* Card Footer */}
              <div className="ss-card-footer">
                <span className="ss-status-badge">● Active Cohort</span>
                <div className="ss-actions-group">
                  <button
                    type="button"
                    className="ss-btn-sm"
                    onClick={() => handleOpenModal(str)}
                    title="Edit stream section"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    type="button"
                    className="ss-btn-sm ss-btn-danger"
                    onClick={() => handleDelete(str.id, str.name)}
                    title="Delete stream"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredStreams.length === 0 && (
        <div className="ss-empty-state">
          <p>No streams match your filter or search query.</p>
          <button
            type="button"
            className="ss-btn-primary"
            onClick={() => {
              setSearchQuery("");
              setSelectedClass("ALL");
            }}
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="ss-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="ss-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="ss-modal-header">
              <h2>{editingStream ? "Edit Stream Section" : "Divide Class into Stream"}</h2>
              <button
                type="button"
                className="ss-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveStream} className="ss-modal-form">
              <div className="ss-form-row">
                <div className="ss-form-group">
                  <label>Section Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 11-A, 10-B"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                  />
                </div>
                <div className="ss-form-group">
                  <label>Parent Class</label>
                  <select
                    value={formData.classId}
                    onChange={(e) =>
                      setFormData({ ...formData, classId: e.target.value })
                    }
                  >
                    {CLASSES_LIST.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="ss-form-group">
                <label>Stream / Section Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grade 11-A (General Science & STEM)"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="ss-form-group">
                <label>Track / Specialization Pathway</label>
                <input
                  type="text"
                  placeholder="e.g. General Science, General Arts, Business Studies"
                  value={formData.specialization}
                  onChange={(e) =>
                    setFormData({ ...formData, specialization: e.target.value })
                  }
                />
              </div>

              <div className="ss-form-row">
                <div className="ss-form-group">
                  <label>Section Tutor / Form Master</label>
                  <input
                    type="text"
                    placeholder="e.g. Mrs. Sarah Jenkins"
                    value={formData.classTeacher}
                    onChange={(e) =>
                      setFormData({ ...formData, classTeacher: e.target.value })
                    }
                  />
                </div>
                <div className="ss-form-group">
                  <label>Room / Laboratory</label>
                  <input
                    type="text"
                    placeholder="e.g. Science Wing Lab 1"
                    value={formData.room}
                    onChange={(e) =>
                      setFormData({ ...formData, room: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="ss-form-group">
                <label>Cohort Max Capacity</label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData({ ...formData, capacity: e.target.value })
                  }
                />
              </div>

              <div className="ss-modal-footer">
                <button
                  type="button"
                  className="ss-btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="ss-btn-primary">
                  {editingStream ? "Update Stream" : "Save Stream"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
