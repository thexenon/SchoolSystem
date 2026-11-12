import React, { useState } from "react";
import "./ExaminationManagement.css";
import ExamNav from "./ExamNav";
import { getExamSchedules, saveExamSchedules } from "./examData";
import SpinningWordsBackground from "../components/SpinningWordsBackground";
import DailyQuotePopupModal from "../components/DailyQuotePopupModal";

export default function ExaminationManagement() {
  const [schedules, setSchedules] = useState(() => getExamSchedules());
  const [filterSession, setFilterSession] = useState("ALL");
  const [filterHall, setFilterHall] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const [formData, setFormData] = useState({
    examTitle: "",
    subject: "Elective Mathematics",
    code: "MTH-401",
    class: "Grade 11-A",
    date: "2026-11-20",
    session: "Morning Session",
    startTime: "09:00 AM",
    endTime: "11:30 AM",
    duration: "2h 30m",
    hall: "Science Hall B",
    seatCount: 32,
    invigilator: "Mr. Kofi Annan",
    reliefInvigilator: "Mrs. Sarah Jenkins",
    status: "Confirmed",
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
        examTitle: "",
        subject: "Physics",
        code: "PHY-302",
        class: "Grade 11-A",
        date: "2026-11-28",
        session: "Morning Session",
        startTime: "09:00 AM",
        endTime: "11:00 AM",
        duration: "2h 00m",
        hall: "Great Assembly Hall",
        seatCount: 50,
        invigilator: "Dr. Jonathan Miller",
        reliefInvigilator: "Marcus Brody",
        status: "Confirmed",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSaveSchedule = (e) => {
    e.preventDefault();
    if (!formData.examTitle.trim()) {
      alert("Please enter the examination paper title.");
      return;
    }

    let updated;
    if (editingItem) {
      updated = schedules.map((s) =>
        s.id === editingItem.id ? { ...s, ...formData } : s
      );
      showToast(`Exam session "${formData.examTitle}" updated successfully!`);
    } else {
      const newItem = {
        id: `EXSCH-${Date.now().toString().slice(-4)}`,
        ...formData,
      };
      updated = [...schedules, newItem];
      showToast(`New examination session "${formData.examTitle}" scheduled!`);
    }

    setSchedules(updated);
    saveExamSchedules(updated);
    handleCloseModal();
  };

  const handleDeleteSchedule = (id) => {
    if (window.confirm("Are you sure you want to cancel this scheduled exam session?")) {
      const updated = schedules.filter((s) => s.id !== id);
      setSchedules(updated);
      saveExamSchedules(updated);
      showToast("Examination schedule cancelled.");
    }
  };

  const filteredSchedules = schedules.filter((s) => {
    const matchesSession = filterSession === "ALL" || s.session === filterSession;
    const matchesHall = filterHall === "ALL" || s.hall === filterHall;
    const matchesSearch =
      s.examTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.invigilator.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSession && matchesHall && matchesSearch;
  });

  const totalSeats = schedules.reduce((acc, curr) => acc + (Number(curr.seatCount) || 0), 0);

  return (
    <div className="em-page-wrapper">
      <SpinningWordsBackground speed="slow" />
      <DailyQuotePopupModal />

      {toastMessage && <div className="em-toast">✓ {toastMessage}</div>}

      <ExamNav
        title="Examination Management"
        subtitle="Manage examination schedules, timetable sessions, examination halls, and invigilator duties"
        badge="Screen 2 of 12"
      />

      {/* KPI Stats Strip */}
      <div className="em-kpi-grid">
        <div className="em-kpi-card">
          <div className="em-kpi-label">Scheduled Papers</div>
          <div className="em-kpi-val" style={{ color: "#38bdf8" }}>{schedules.length}</div>
          <div className="em-kpi-sub">Final & mock papers active</div>
        </div>
        <div className="em-kpi-card">
          <div className="em-kpi-label">Total Candidate Desks</div>
          <div className="em-kpi-val" style={{ color: "#10b981" }}>{totalSeats}</div>
          <div className="em-kpi-sub">Desk allocation configured</div>
        </div>
        <div className="em-kpi-card">
          <div className="em-kpi-label">Examination Venues</div>
          <div className="em-kpi-val" style={{ color: "#f59e0b" }}>4 Halls</div>
          <div className="em-kpi-sub">Equipped with biometric clock-in</div>
        </div>
        <div className="em-kpi-card">
          <div className="em-kpi-label">Invigilation Roster</div>
          <div className="em-kpi-val" style={{ color: "#a855f7" }}>100% Filled</div>
          <div className="em-kpi-sub">Lead & relief invigilators assigned</div>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="em-filter-panel">
        <div className="em-filter-left">
          <input
            type="text"
            className="em-search-input"
            placeholder="Search exam paper, hall, or invigilator..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="em-select"
            value={filterSession}
            onChange={(e) => setFilterSession(e.target.value)}
          >
            <option value="ALL">All Daily Sessions</option>
            <option value="Morning Session">Morning Session (08:30 - 11:30 AM)</option>
            <option value="Afternoon Session">Afternoon Session (01:30 - 04:00 PM)</option>
          </select>

          <select
            className="em-select"
            value={filterHall}
            onChange={(e) => setFilterHall(e.target.value)}
          >
            <option value="ALL">All Exam Halls & Labs</option>
            <option value="Science Hall B">Science Hall B</option>
            <option value="Robotics & Physics Lab 3">Robotics & Physics Lab 3</option>
            <option value="Chemistry Hall 1">Chemistry Hall 1</option>
            <option value="Great Assembly Hall">Great Assembly Hall</option>
          </select>
        </div>

        <button
          type="button"
          className="em-create-btn"
          onClick={() => handleOpenModal()}
        >
          ➕ Schedule Examination Session
        </button>
      </div>

      {/* Schedule Grid Cards */}
      <div className="em-grid">
        {filteredSchedules.map((s) => (
          <div key={s.id} className="em-card">
            <div className="em-card-top">
              <span className={`em-session-pill ${s.session.toLowerCase().includes("morning") ? "morning" : "afternoon"}`}>
                {s.session}
              </span>
              <span className="em-status-pill">{s.status}</span>
            </div>

            <h3 className="em-card-title">{s.examTitle}</h3>
            <div className="em-card-code">{s.subject} • {s.code} • {s.class}</div>

            <div className="em-details-box">
              <div className="em-detail-row">
                <span>📅 Date:</span>
                <strong>{s.date}</strong>
              </div>
              <div className="em-detail-row">
                <span>⏰ Time:</span>
                <strong>{s.startTime} – {s.endTime} ({s.duration})</strong>
              </div>
              <div className="em-detail-row">
                <span>📍 Hall:</span>
                <strong style={{ color: "#38bdf8" }}>{s.hall}</strong>
              </div>
              <div className="em-detail-row">
                <span>💺 Seating:</span>
                <strong>{s.seatCount} Candidates Allocated</strong>
              </div>
              <div className="em-detail-row">
                <span>👨‍🏫 Lead Invigilator:</span>
                <strong>{s.invigilator}</strong>
              </div>
              <div className="em-detail-row">
                <span>🛡️ Relief Invigilator:</span>
                <span>{s.reliefInvigilator}</span>
              </div>
            </div>

            <div className="em-card-actions">
              <button
                type="button"
                className="em-btn-sm em-btn-edit"
                onClick={() => handleOpenModal(s)}
              >
                ✏️ Edit Session
              </button>
              <button
                type="button"
                className="em-btn-sm em-btn-print"
                onClick={() => showToast(`Printing examination hall seating manifest for ${s.hall}...`)}
              >
                🖨️ Seating Manifest
              </button>
              <button
                type="button"
                className="em-btn-sm em-btn-del"
                onClick={() => handleDeleteSchedule(s.id)}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Schedule Modal */}
      {isModalOpen && (
        <div className="em-modal-backdrop" onClick={handleCloseModal}>
          <div className="em-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="em-modal-header">
              <h3 className="em-modal-title">
                {editingItem ? "✏️ Reschedule Exam Paper" : "➕ Schedule New Examination Session"}
              </h3>
              <button
                type="button"
                className="em-modal-close"
                onClick={handleCloseModal}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveSchedule} className="em-modal-form">
              <div className="em-form-row">
                <div className="em-form-group">
                  <label>Examination Paper Title</label>
                  <input
                    type="text"
                    required
                    value={formData.examTitle}
                    onChange={(e) => setFormData({ ...formData, examTitle: e.target.value })}
                    placeholder="e.g. Elective Mathematics Paper 2 (Theory)"
                  />
                </div>
                <div className="em-form-group">
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
              </div>

              <div className="em-form-row">
                <div className="em-form-group">
                  <label>Target Class / Form</label>
                  <select
                    value={formData.class}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  >
                    <option value="Grade 11-A">Grade 11-A</option>
                    <option value="Grade 11-B">Grade 11-B</option>
                    <option value="Grade 12-A">Grade 12-A</option>
                    <option value="Grade 10-A">Grade 10-A</option>
                  </select>
                </div>
                <div className="em-form-group">
                  <label>Session Slot</label>
                  <select
                    value={formData.session}
                    onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                  >
                    <option value="Morning Session">Morning Session (08:30 - 11:30 AM)</option>
                    <option value="Afternoon Session">Afternoon Session (01:30 - 04:00 PM)</option>
                    <option value="Evening Practical">Evening Practical Session</option>
                  </select>
                </div>
              </div>

              <div className="em-form-row">
                <div className="em-form-group">
                  <label>Examination Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div className="em-form-group">
                  <label>Start Time</label>
                  <input
                    type="text"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    placeholder="e.g. 09:00 AM"
                  />
                </div>
                <div className="em-form-group">
                  <label>End Time</label>
                  <input
                    type="text"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    placeholder="e.g. 11:30 AM"
                  />
                </div>
              </div>

              <div className="em-form-row">
                <div className="em-form-group">
                  <label>Examination Hall / Lab</label>
                  <select
                    value={formData.hall}
                    onChange={(e) => setFormData({ ...formData, hall: e.target.value })}
                  >
                    <option value="Science Hall B">Science Hall B</option>
                    <option value="Robotics & Physics Lab 3">Robotics & Physics Lab 3</option>
                    <option value="Chemistry Hall 1">Chemistry Hall 1</option>
                    <option value="Great Assembly Hall">Great Assembly Hall</option>
                  </select>
                </div>
                <div className="em-form-group">
                  <label>Allocated Desk Count</label>
                  <input
                    type="number"
                    min="10"
                    max="150"
                    required
                    value={formData.seatCount}
                    onChange={(e) => setFormData({ ...formData, seatCount: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="em-form-row">
                <div className="em-form-group">
                  <label>Chief / Lead Invigilator</label>
                  <input
                    type="text"
                    required
                    value={formData.invigilator}
                    onChange={(e) => setFormData({ ...formData, invigilator: e.target.value })}
                    placeholder="e.g. Mr. Kofi Annan"
                  />
                </div>
                <div className="em-form-group">
                  <label>Relief Invigilator</label>
                  <input
                    type="text"
                    value={formData.reliefInvigilator}
                    onChange={(e) => setFormData({ ...formData, reliefInvigilator: e.target.value })}
                    placeholder="e.g. Mrs. Sarah Jenkins"
                  />
                </div>
              </div>

              <div className="em-modal-actions">
                <button
                  type="button"
                  className="em-btn-cancel"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="em-btn-submit"
                >
                  {editingItem ? "Update Schedule" : "Confirm Schedule Session"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
