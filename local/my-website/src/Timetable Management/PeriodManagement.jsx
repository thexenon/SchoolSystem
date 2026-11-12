import React, { useState, useEffect } from "react";
import TimetableNav from "./TimetableNav";
import { getPeriods, savePeriods } from "./timetableData";
import "./PeriodManagement.css";

export default function PeriodManagement() {
  const [periods, setPeriods] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState(null);
  const [toast, setToast] = useState(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formStartTime, setFormStartTime] = useState("08:00");
  const [formEndTime, setFormEndTime] = useState("08:50");
  const [formType, setFormType] = useState("Academic Lesson");
  const [formIsBreak, setFormIsBreak] = useState(false);
  const [formDays, setFormDays] = useState(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);

  const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  useEffect(() => {
    setPeriods(getPeriods());
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const calculateDuration = (start, end) => {
    if (!start || !end) return 0;
    const [startH, startM] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);
    const diff = (endH * 60 + endM) - (startH * 60 + startM);
    return diff > 0 ? diff : 0;
  };

  const handleOpenAddModal = () => {
    setEditingPeriod(null);
    setFormName("");
    setFormStartTime("08:00");
    setFormEndTime("08:50");
    setFormType("Academic Lesson");
    setFormIsBreak(false);
    setFormDays(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);
    setModalOpen(true);
  };

  const handleOpenEditModal = (p) => {
    setEditingPeriod(p);
    setFormName(p.name);
    setFormStartTime(p.startTime);
    setFormEndTime(p.endTime);
    setFormType(p.type);
    setFormIsBreak(p.isBreak);
    setFormDays(p.applicableDays || allDays);
    setModalOpen(true);
  };

  const toggleDaySelection = (day) => {
    setFormDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSavePeriod = (e) => {
    e.preventDefault();
    const duration = calculateDuration(formStartTime, formEndTime);

    if (duration <= 0) {
      showToast("End time must be later than start time!", "error");
      return;
    }

    if (editingPeriod) {
      const updated = periods.map((p) =>
        p.id === editingPeriod.id
          ? {
              ...p,
              name: formName,
              startTime: formStartTime,
              endTime: formEndTime,
              duration,
              type: formType,
              isBreak: formIsBreak,
              applicableDays: formDays,
            }
          : p
      );
      setPeriods(updated);
      savePeriods(updated);
      showToast(`Period "${formName}" updated successfully!`);
    } else {
      const newId = `PER-${String(periods.length + 1).padStart(2, "0")}`;
      const newPeriod = {
        id: newId,
        periodNumber: formIsBreak ? null : periods.filter((p) => !p.isBreak).length + 1,
        name: formName,
        startTime: formStartTime,
        endTime: formEndTime,
        duration,
        type: formType,
        isBreak: formIsBreak,
        applicableDays: formDays,
      };
      const updated = [...periods, newPeriod].sort((a, b) => a.startTime.localeCompare(b.startTime));
      setPeriods(updated);
      savePeriods(updated);
      showToast(`New period "${formName}" added to master bell schedule!`);
    }

    setModalOpen(false);
  };

  const handleDeletePeriod = (id) => {
    if (confirm("Are you sure you want to remove this period from the school bell schedule?")) {
      const updated = periods.filter((p) => p.id !== id);
      setPeriods(updated);
      savePeriods(updated);
      showToast("Period removed from timetable schedule.", "info");
    }
  };

  const totalTeachingMinutes = periods
    .filter((p) => !p.isBreak)
    .reduce((acc, curr) => acc + (curr.duration || 0), 0);

  const academicPeriodsCount = periods.filter((p) => !p.isBreak).length;
  const breakPeriodsCount = periods.filter((p) => p.isBreak).length;

  return (
    <div className="pm-container">
      <TimetableNav
        title="Period Management & Bell Schedule"
        subtitle="Configure daily lesson hours, recess breaks, assembly sessions, and school bell schedules"
        badge="Module 9 • Screen 1 of 7"
      />

      {toast && (
        <div className={`pm-toast pm-toast-${toast.type}`}>
          <div className="pm-toast-dot" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="pm-header">
        <div className="pm-title-box">
          <span className="pm-tag">SCHOOL HOURS & BELL SCHEDULE</span>
          <h1 className="pm-title">Instructional Periods & Daily Timings</h1>
          <p className="pm-subtitle">
            Establish official academic time slots, morning assemblies, and recreation intervals applied
            across classrooms and faculty timetables.
          </p>
        </div>

        <div className="pm-header-actions">
          <button className="pm-btn-primary" onClick={handleOpenAddModal}>
            <span className="pm-btn-icon">+</span> Define New Period
          </button>
        </div>
      </div>

      {/* KPI Highlights */}
      <div className="pm-kpi-grid">
        <div className="pm-kpi-card">
          <div className="pm-kpi-icon-wrap" style={{ background: "rgba(6, 182, 212, 0.15)", color: "#06b6d4" }}>
            ⏰
          </div>
          <div className="pm-kpi-body">
            <span className="pm-kpi-label">Lesson Periods</span>
            <div className="pm-kpi-val">{academicPeriodsCount} Slots <span className="pm-kpi-sub">50 min each</span></div>
          </div>
        </div>

        <div className="pm-kpi-card">
          <div className="pm-kpi-icon-wrap" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
            ⏳
          </div>
          <div className="pm-kpi-body">
            <span className="pm-kpi-label">Daily Instructional Time</span>
            <div className="pm-kpi-val">
              {Math.floor(totalTeachingMinutes / 60)}h {totalTeachingMinutes % 60}m
              <span className="pm-kpi-sub">Active Teaching</span>
            </div>
          </div>
        </div>

        <div className="pm-kpi-card">
          <div className="pm-kpi-icon-wrap" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b" }}>
            🥪
          </div>
          <div className="pm-kpi-body">
            <span className="pm-kpi-label">Breaks & Recess</span>
            <div className="pm-kpi-val">{breakPeriodsCount} Intervals <span className="pm-kpi-sub">Snack & Lunch</span></div>
          </div>
        </div>

        <div className="pm-kpi-card">
          <div className="pm-kpi-icon-wrap" style={{ background: "rgba(139, 92, 246, 0.15)", color: "#8b5cf6" }}>
            🔔
          </div>
          <div className="pm-kpi-body">
            <span className="pm-kpi-label">Master School Hours</span>
            <div className="pm-kpi-val">07:30 - 15:10 <span className="pm-kpi-sub">GMT Bell Schedule</span></div>
          </div>
        </div>
      </div>

      {/* Master Periods Table Card */}
      <div className="pm-card-wrap">
        <div className="pm-table-header">
          <div>
            <h3>Official School Bell Schedule</h3>
            <p>Chronological sequence of all instructional periods, assemblies, and recesses.</p>
          </div>
          <div className="pm-badge-shift">Day Shift: Monday - Friday</div>
        </div>

        <div className="pm-table-responsive">
          <table className="pm-table">
            <thead>
              <tr>
                <th>Seq & ID</th>
                <th>Period Title</th>
                <th>Time Window</th>
                <th>Duration</th>
                <th>Classification</th>
                <th>Applicable Days</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {periods.map((p, idx) => (
                <tr key={p.id} className={p.isBreak ? "row-break" : "row-academic"}>
                  <td>
                    <div className="pm-seq-badge">{idx + 1}</div>
                    <div className="pm-id-text">{p.id}</div>
                  </td>
                  <td>
                    <div className="pm-period-name">{p.name}</div>
                    {p.isBreak && <span className="pm-break-indicator">Recess Interval</span>}
                  </td>
                  <td>
                    <div className="pm-time-pill">
                      <span>{p.startTime}</span> ➔ <span>{p.endTime}</span>
                    </div>
                  </td>
                  <td>
                    <div className="pm-duration-text">{p.duration} mins</div>
                  </td>
                  <td>
                    <span
                      className={`pm-type-pill ${
                        p.type === "Assembly"
                          ? "type-assembly"
                          : p.type === "Break" || p.type === "Lunch"
                          ? "type-break"
                          : p.type.includes("Co-Curricular")
                          ? "type-lab"
                          : "type-academic"
                      }`}
                    >
                      {p.type}
                    </span>
                  </td>
                  <td>
                    <div className="pm-days-wrap">
                      {["Mon", "Tue", "Wed", "Thu", "Fri"].map((d, dIdx) => {
                        const fullDay = allDays[dIdx];
                        const isActive = (p.applicableDays || allDays).includes(fullDay);
                        return (
                          <span
                            key={d}
                            className={`pm-day-chip ${isActive ? "active" : "inactive"}`}
                          >
                            {d}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div className="pm-action-btns">
                      <button
                        className="pm-btn-action pm-btn-edit"
                        onClick={() => handleOpenEditModal(p)}
                        title="Edit Period Timings"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="pm-btn-action pm-btn-delete"
                        onClick={() => handleDeletePeriod(p.id)}
                        title="Delete Period"
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

      {/* Period Modal */}
      {modalOpen && (
        <div className="pm-modal-overlay">
          <div className="pm-modal-box">
            <div className="pm-modal-header">
              <div>
                <h3>{editingPeriod ? "✏️ Edit Period Configuration" : "⏰ Define New School Period"}</h3>
                <p>Configure period boundaries, classification, and applicable weekdays.</p>
              </div>
              <button className="pm-modal-close" onClick={() => setModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSavePeriod} className="pm-modal-body">
              <div className="pm-form-field">
                <label>Period Name / Label:</label>
                <input
                  type="text"
                  placeholder="e.g. Period 1, Midday Lunch, Science Club Lab"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                />
              </div>

              <div className="pm-form-grid">
                <div className="pm-form-field">
                  <label>Start Time (HH:MM):</label>
                  <input
                    type="time"
                    value={formStartTime}
                    onChange={(e) => setFormStartTime(e.target.value)}
                    required
                  />
                </div>

                <div className="pm-form-field">
                  <label>End Time (HH:MM):</label>
                  <input
                    type="time"
                    value={formEndTime}
                    onChange={(e) => setFormEndTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="pm-duration-display">
                Calculated Period Duration: <strong>{calculateDuration(formStartTime, formEndTime)} minutes</strong>
              </div>

              <div className="pm-form-grid">
                <div className="pm-form-field">
                  <label>Period Classification:</label>
                  <select value={formType} onChange={(e) => setFormType(e.target.value)}>
                    <option value="Academic Lesson">Academic Lesson (Classroom)</option>
                    <option value="Assembly">Morning Devotion & Assembly</option>
                    <option value="Break">Morning Refreshment Break</option>
                    <option value="Lunch">Midday Lunch & Recreation</option>
                    <option value="Co-Curricular / Practical">Co-Curricular / Science Practical</option>
                  </select>
                </div>

                <div className="pm-form-field">
                  <label>Break / Recess Interval?</label>
                  <div className="pm-checkbox-wrap">
                    <label className="pm-checkbox-label">
                      <input
                        type="checkbox"
                        checked={formIsBreak}
                        onChange={(e) => setFormIsBreak(e.target.checked)}
                      />
                      <span>Mark as Non-teaching Break</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pm-form-field">
                <label>Active Days of the Week:</label>
                <div className="pm-days-toggle-row">
                  {allDays.map((day) => (
                    <button
                      type="button"
                      key={day}
                      className={`pm-day-toggle-btn ${formDays.includes(day) ? "selected" : ""}`}
                      onClick={() => toggleDaySelection(day)}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pm-modal-footer">
                <button type="button" className="pm-btn-cancel" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="pm-btn-save">
                  {editingPeriod ? "Commit Changes" : "Save Period Slot"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
