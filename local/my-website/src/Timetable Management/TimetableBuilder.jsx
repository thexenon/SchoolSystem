import React, { useState, useEffect } from "react";
import TimetableNav from "./TimetableNav";
import {
  getTimetableSlots,
  saveTimetableSlots,
  getPeriods,
  getRooms,
  detectConflicts,
} from "./timetableData";
import "./TimetableBuilder.css";

const AVAILABLE_SUBJECTS = [
  { name: "Elective Mathematics", code: "MTH-401", color: "#6366f1" },
  { name: "Chemistry", code: "CHM-301", color: "#10b981" },
  { name: "Physics", code: "PHY-302", color: "#3b82f6" },
  { name: "English Language", code: "ENG-204", color: "#f59e0b" },
  { name: "Biology", code: "BIO-303", color: "#ec4899" },
  { name: "Information Technology", code: "ICT-105", color: "#8b5cf6" },
  { name: "Economics", code: "ECN-102", color: "#14b8a6" },
  { name: "World History", code: "HIS-201", color: "#06b6d4" },
];

const FACULTY_TEACHERS = [
  { id: "TCH-2026-101", name: "Dr. Jonathan Miller", dept: "Mathematics" },
  { id: "TCH-2026-102", name: "Mrs. Sarah Jenkins", dept: "Chemistry" },
  { id: "TCH-GH-101", name: "Mr. Kofi Annan", dept: "Physics" },
  { id: "TCH-2026-104", name: "Dame Eleanor Vance", dept: "English" },
  { id: "TCH-2026-105", name: "Dr. Arthur Bell", dept: "Biology" },
  { id: "TCH-2026-103", name: "Marcus Brody", dept: "History" },
  { id: "TCH-2026-106", name: "Eng. Samuel Mensah", dept: "ICT" },
];

export default function TimetableBuilder() {
  const [slots, setSlots] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedCohort, setSelectedCohort] = useState("Grade 11-A");
  const [toast, setToast] = useState(null);

  // Edit / Assign Slot Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [targetDay, setTargetDay] = useState("Monday");
  const [targetPeriod, setTargetPeriod] = useState(null);
  const [existingSlotId, setExistingSlotId] = useState(null);

  const [formSubject, setFormSubject] = useState(AVAILABLE_SUBJECTS[0].name);
  const [formTeacher, setFormTeacher] = useState(FACULTY_TEACHERS[0].name);
  const [formRoom, setFormRoom] = useState("");
  const [conflictWarning, setConflictWarning] = useState(null);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  useEffect(() => {
    const loadedSlots = getTimetableSlots();
    const loadedPeriods = getPeriods();
    const loadedRooms = getRooms();
    setSlots(loadedSlots);
    setPeriods(loadedPeriods.filter((p) => !p.isBreak)); // only lesson periods in builder grid
    setRooms(loadedRooms);
    if (loadedRooms.length > 0) {
      setFormRoom(loadedRooms[0].roomName);
    }
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Check if a potential assignment has conflicts
  const checkLiveConflict = (day, periodId, teacherName, roomName, currentSlotId) => {
    const clashes = slots.filter((s) => {
      if (s.id === currentSlotId) return false;
      if (s.day === day && s.periodId === periodId) {
        if (s.teacherName === teacherName) return true;
        if (s.roomName === roomName) return true;
      }
      return false;
    });

    if (clashes.length > 0) {
      const clash = clashes[0];
      if (clash.teacherName === teacherName) {
        return `⚠️ Conflict Alert: ${teacherName} is already teaching ${clash.classCohort} (${clash.subject}) at this time!`;
      }
      if (clash.roomName === roomName) {
        return `⚠️ Room Conflict: ${roomName} is already reserved by ${clash.classCohort} (${clash.subject})!`;
      }
    }
    return null;
  };

  const handleCellClick = (day, period) => {
    const current = slots.find(
      (s) => s.classCohort === selectedCohort && s.day === day && s.periodId === period.id
    );

    setTargetDay(day);
    setTargetPeriod(period);

    if (current) {
      setExistingSlotId(current.id);
      setFormSubject(current.subject);
      setFormTeacher(current.teacherName);
      setFormRoom(current.roomName);
    } else {
      setExistingSlotId(null);
      setFormSubject(AVAILABLE_SUBJECTS[0].name);
      setFormTeacher(FACULTY_TEACHERS[0].name);
      setFormRoom(rooms[0]?.roomName || "Classroom 101");
    }

    setConflictWarning(null);
    setModalOpen(true);
  };

  // Re-check conflict on field changes
  useEffect(() => {
    if (modalOpen && targetPeriod) {
      const warning = checkLiveConflict(
        targetDay,
        targetPeriod.id,
        formTeacher,
        formRoom,
        existingSlotId
      );
      setConflictWarning(warning);
    }
  }, [formTeacher, formRoom, targetDay, targetPeriod, modalOpen]);

  const handleSaveSlot = (e) => {
    e.preventDefault();
    if (!targetPeriod) return;

    const subjObj = AVAILABLE_SUBJECTS.find((s) => s.name === formSubject) || AVAILABLE_SUBJECTS[0];
    const teacherObj = FACULTY_TEACHERS.find((t) => t.name === formTeacher) || FACULTY_TEACHERS[0];
    const roomObj = rooms.find((r) => r.roomName === formRoom) || rooms[0];

    let updated;
    if (existingSlotId) {
      updated = slots.map((s) =>
        s.id === existingSlotId
          ? {
              ...s,
              subject: subjObj.name,
              subjectCode: subjObj.code,
              teacherId: teacherObj.id,
              teacherName: teacherObj.name,
              roomId: roomObj?.id || "RM-101",
              roomName: formRoom,
              color: subjObj.color,
            }
          : s
      );
      showToast(`Updated slot for ${formSubject} on ${targetDay}!`);
    } else {
      const newSlot = {
        id: `SLOT-${Date.now().toString().slice(-6)}`,
        classCohort: selectedCohort,
        day: targetDay,
        periodId: targetPeriod.id,
        periodNumber: targetPeriod.periodNumber,
        time: `${targetPeriod.startTime} - ${targetPeriod.endTime}`,
        subject: subjObj.name,
        subjectCode: subjObj.code,
        teacherId: teacherObj.id,
        teacherName: teacherObj.name,
        roomId: roomObj?.id || "RM-101",
        roomName: formRoom,
        color: subjObj.color,
      };
      updated = [...slots, newSlot];
      showToast(`Assigned ${formSubject} to ${targetDay} (${targetPeriod.name})!`);
    }

    setSlots(updated);
    saveTimetableSlots(updated);
    setModalOpen(false);
  };

  const handleDeleteSlot = () => {
    if (!existingSlotId) return;
    const updated = slots.filter((s) => s.id !== existingSlotId);
    setSlots(updated);
    saveTimetableSlots(updated);
    setModalOpen(false);
    showToast("Class slot cleared.", "info");
  };

  // Cohort filtered slots
  const cohortSlots = slots.filter((s) => s.classCohort === selectedCohort);
  const allConflicts = detectConflicts(slots);
  const cohortConflicts = allConflicts.filter(
    (c) => c.slotA.classCohort === selectedCohort || c.slotB.classCohort === selectedCohort
  );

  return (
    <div className="tb-container">
      <TimetableNav
        title="Interactive Timetable Builder"
        subtitle="Create, edit, and organize class timetables with real-time teacher and room clash prevention"
        badge="Module 9 • Screen 2 of 7"
      />

      {toast && (
        <div className={`tb-toast tb-toast-${toast.type}`}>
          <div className="tb-toast-dot" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="tb-header">
        <div className="tb-title-box">
          <span className="tb-tag">CLASS SCHEDULE WORKBENCH</span>
          <h1 className="tb-title">Master Timetable Grid & Editor</h1>
          <p className="tb-subtitle">
            Assign curriculum subjects, subject masters, and designated learning laboratories to daily period slots.
          </p>
        </div>

        <div className="tb-controls-bar">
          <div className="tb-cohort-select-wrap">
            <label>Target Cohort:</label>
            <select
              value={selectedCohort}
              onChange={(e) => setSelectedCohort(e.target.value)}
              className="tb-select"
            >
              <option value="Grade 11-A">Grade 11-A (Science Track)</option>
              <option value="Grade 11-B">Grade 11-B (General Arts & Business)</option>
              <option value="Grade 12-A">Grade 12-A (WASSCE Finalists)</option>
            </select>
          </div>

          <div className="tb-audit-badge-wrap">
            {cohortConflicts.length === 0 ? (
              <span className="tb-badge-clean">✓ Zero Clashes Detected</span>
            ) : (
              <span className="tb-badge-warning">⚡ {cohortConflicts.length} Conflict(s) Flagged</span>
            )}
          </div>
        </div>
      </div>

      {/* Builder Statistics Bar */}
      <div className="tb-kpi-bar">
        <div className="tb-kpi-item">
          <span>Active Cohort:</span>
          <strong>{selectedCohort}</strong>
        </div>
        <div className="tb-kpi-item">
          <span>Assigned Lessons:</span>
          <strong>{cohortSlots.length} Slots</strong>
        </div>
        <div className="tb-kpi-item">
          <span>Free Period Slots:</span>
          <strong>{Math.max(0, periods.length * 5 - cohortSlots.length)} Openings</strong>
        </div>
        <div className="tb-kpi-item">
          <span>Instructional Coverage:</span>
          <strong style={{ color: "#34d399" }}>
            {((cohortSlots.length / (periods.length * 5 || 1)) * 100).toFixed(0)}% Complete
          </strong>
        </div>
      </div>

      {/* Timetable Interactive Grid */}
      <div className="tb-grid-card">
        <div className="tb-grid-table-wrap">
          <table className="tb-grid-table">
            <thead>
              <tr>
                <th className="tb-col-period">Period & Time</th>
                {daysOfWeek.map((day) => (
                  <th key={day} className="tb-col-day">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periods.map((p) => (
                <tr key={p.id}>
                  <td className="tb-cell-period-info">
                    <div className="tb-p-name">{p.name}</div>
                    <div className="tb-p-time">{p.startTime} - {p.endTime}</div>
                  </td>

                  {daysOfWeek.map((day) => {
                    const slot = cohortSlots.find((s) => s.day === day && s.periodId === p.id);
                    return (
                      <td
                        key={day}
                        className={`tb-cell-slot ${slot ? "has-slot" : "empty-slot"}`}
                        onClick={() => handleCellClick(day, p)}
                        title="Click to assign or edit lesson"
                      >
                        {slot ? (
                          <div
                            className="tb-slot-card"
                            style={{ borderLeftColor: slot.color || "#06b6d4" }}
                          >
                            <div className="tb-slot-subject">{slot.subject}</div>
                            <div className="tb-slot-teacher">👨‍🏫 {slot.teacherName}</div>
                            <div className="tb-slot-room">📍 {slot.roomName}</div>
                          </div>
                        ) : (
                          <div className="tb-empty-placeholder">
                            <span>+</span> Assign
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slot Assignment Modal */}
      {modalOpen && targetPeriod && (
        <div className="tb-modal-overlay">
          <div className="tb-modal-box">
            <div className="tb-modal-header">
              <div>
                <h3>{existingSlotId ? "✏️ Edit Class Lesson Slot" : "➕ Assign Class Lesson"}</h3>
                <p>
                  {selectedCohort} • {targetDay} • {targetPeriod.name} ({targetPeriod.startTime} - {targetPeriod.endTime})
                </p>
              </div>
              <button className="tb-modal-close" onClick={() => setModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveSlot} className="tb-modal-body">
              {conflictWarning && (
                <div className="tb-conflict-warning-banner">
                  {conflictWarning}
                </div>
              )}

              <div className="tb-form-field">
                <label>Curriculum Subject:</label>
                <select
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="tb-input"
                  required
                >
                  {AVAILABLE_SUBJECTS.map((s) => (
                    <option key={s.code} value={s.name}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="tb-form-field">
                <label>Faculty Subject Master:</label>
                <select
                  value={formTeacher}
                  onChange={(e) => setFormTeacher(e.target.value)}
                  className="tb-input"
                  required
                >
                  {FACULTY_TEACHERS.map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name} — {t.dept}
                    </option>
                  ))}
                </select>
              </div>

              <div className="tb-form-field">
                <label>Designated Classroom or Laboratory:</label>
                <select
                  value={formRoom}
                  onChange={(e) => setFormRoom(e.target.value)}
                  className="tb-input"
                  required
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.roomName}>
                      {r.roomName} ({r.type} • Cap: {r.capacity})
                    </option>
                  ))}
                </select>
              </div>

              <div className="tb-modal-footer">
                {existingSlotId && (
                  <button
                    type="button"
                    className="tb-btn-delete"
                    onClick={handleDeleteSlot}
                  >
                    Clear Slot
                  </button>
                )}
                <div style={{ marginLeft: "auto", display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    className="tb-btn-cancel"
                    onClick={() => setModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="tb-btn-save">
                    {existingSlotId ? "Update Schedule" : "Commit to Timetable"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
