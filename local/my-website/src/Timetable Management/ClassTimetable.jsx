import React, { useState, useEffect } from "react";
import TimetableNav from "./TimetableNav";
import { getTimetableSlots, getPeriods } from "./timetableData";
import "./ClassTimetable.css";

export default function ClassTimetable() {
  const [slots, setSlots] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [selectedCohort, setSelectedCohort] = useState("Grade 11-A");
  const [viewMode, setViewMode] = useState("week"); // 'week' or 'today'
  const [activeDay, setActiveDay] = useState("Monday");

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  useEffect(() => {
    setSlots(getTimetableSlots());
    setPeriods(getPeriods());
  }, []);

  const cohortSlots = slots.filter((s) => s.classCohort === selectedCohort);

  const cohortDetails = {
    "Grade 11-A": {
      name: "Grade 11-A (Pure Science Track)",
      tutor: "Dame Eleanor Vance",
      homeRoom: "Classroom 101 (Academic Block A)",
      studentsCount: 34,
      department: "Science & Applied Mathematics",
      academicTerm: "Term 1, 2026/2027 Academic Year",
    },
    "Grade 11-B": {
      name: "Grade 11-B (General Arts & Business)",
      tutor: "Mr. Harrison Sterling",
      homeRoom: "Classroom 102 (Academic Block A)",
      studentsCount: 32,
      department: "Humanities & Economics",
      academicTerm: "Term 1, 2026/2027 Academic Year",
    },
    "Grade 12-A": {
      name: "Grade 12-A (WASSCE Finalists)",
      tutor: "Dr. Jonathan Miller",
      homeRoom: "Lecture Theatre 204",
      studentsCount: 38,
      department: "Advanced Sciences",
      academicTerm: "Term 1, 2026/2027 Academic Year",
    },
  }[selectedCohort] || {
    name: selectedCohort,
    tutor: "Faculty Tutor",
    homeRoom: "Classroom 101",
    studentsCount: 30,
    department: "Secondary Division",
    academicTerm: "Term 1, 2026/2027 Academic Year",
  };

  return (
    <div className="ct-container">
      <TimetableNav
        title="Class Academic Timetable"
        subtitle="Official student class routine, daily bell schedules, room locations, and printable curriculum calendars"
        badge="Module 9 • Screen 3 of 7"
      />

      {/* Header Banner */}
      <div className="ct-header">
        <div className="ct-title-box">
          <span className="ct-tag">STUDENT ROUTINE VIEW</span>
          <h1 className="ct-title">Classroom Schedule: {cohortDetails.name}</h1>
          <p className="ct-subtitle">
            Form Tutor: <strong>{cohortDetails.tutor}</strong> • Home Room: <strong>{cohortDetails.homeRoom}</strong> • {cohortDetails.academicTerm}
          </p>
        </div>

        <div className="ct-actions">
          <div className="ct-cohort-picker">
            <label>Select Class:</label>
            <select
              value={selectedCohort}
              onChange={(e) => setSelectedCohort(e.target.value)}
              className="ct-select"
            >
              <option value="Grade 11-A">Grade 11-A (Science)</option>
              <option value="Grade 11-B">Grade 11-B (General Arts)</option>
              <option value="Grade 12-A">Grade 12-A (Final Year)</option>
            </select>
          </div>

          <div className="ct-view-toggle">
            <button
              className={`ct-toggle-btn ${viewMode === "week" ? "active" : ""}`}
              onClick={() => setViewMode("week")}
            >
              Weekly Grid
            </button>
            <button
              className={`ct-toggle-btn ${viewMode === "today" ? "active" : ""}`}
              onClick={() => setViewMode("today")}
            >
              Day Agenda
            </button>
          </div>

          <button className="ct-btn-print" onClick={() => window.print()}>
            🖨️ Print Timetable
          </button>
        </div>
      </div>

      {/* Class Meta Cards */}
      <div className="ct-meta-strip">
        <div className="ct-meta-item">
          <span>Enrolled Scholars:</span>
          <strong>{cohortDetails.studentsCount} Students</strong>
        </div>
        <div className="ct-meta-item">
          <span>Weekly Instructional Load:</span>
          <strong>{cohortSlots.length} Lesson Periods</strong>
        </div>
        <div className="ct-meta-item">
          <span>Division:</span>
          <strong>{cohortDetails.department}</strong>
        </div>
        <div className="ct-meta-item">
          <span>Attendance Bell:</span>
          <strong>07:30 AM (Daily)</strong>
        </div>
      </div>

      {/* Print Document Header */}
      <div className="ct-print-header">
        <div className="ct-print-crest">ST. MICHAEL'S INTERNATIONAL ACADEMY</div>
        <div className="ct-print-title">OFFICIAL CLASS TIMETABLE — {cohortDetails.name}</div>
        <div className="ct-print-sub">
          Form Tutor: {cohortDetails.tutor} | Room: {cohortDetails.homeRoom} | {cohortDetails.academicTerm}
        </div>
      </div>

      {/* VIEW MODE 1: WEEKLY GRID */}
      {viewMode === "week" && (
        <div className="ct-card-wrap">
          <div className="ct-table-responsive">
            <table className="ct-table">
              <thead>
                <tr>
                  <th className="ct-th-time">Time & Period</th>
                  {daysOfWeek.map((day) => (
                    <th key={day} className="ct-th-day">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {periods.map((p) => {
                  if (p.isBreak) {
                    return (
                      <tr key={p.id} className="ct-row-break">
                        <td className="ct-break-time">
                          {p.startTime} - {p.endTime}
                        </td>
                        <td colSpan={5} className="ct-break-cell">
                          <span className="ct-break-title">
                            {p.type === "Assembly" ? "🔔 " : "🥪 "}
                            {p.name} ({p.duration} mins)
                          </span>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={p.id}>
                      <td className="ct-cell-time-info">
                        <div className="ct-period-label">{p.name}</div>
                        <div className="ct-period-time">{p.startTime} - {p.endTime}</div>
                      </td>

                      {daysOfWeek.map((day) => {
                        const slot = cohortSlots.find(
                          (s) => s.day === day && s.periodId === p.id
                        );
                        return (
                          <td key={day} className="ct-cell-content">
                            {slot ? (
                              <div
                                className="ct-slot-box"
                                style={{ borderLeftColor: slot.color || "#06b6d4" }}
                              >
                                <div className="ct-subj-name">{slot.subject}</div>
                                <div className="ct-teacher-name">👨‍🏫 {slot.teacherName}</div>
                                <div className="ct-room-badge">📍 {slot.roomName}</div>
                              </div>
                            ) : (
                              <div className="ct-free-period">Study / Free</div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: DAY AGENDA */}
      {viewMode === "today" && (
        <div className="ct-agenda-wrap">
          <div className="ct-day-selector-bar">
            {daysOfWeek.map((day) => (
              <button
                key={day}
                className={`ct-day-pill ${activeDay === day ? "active" : ""}`}
                onClick={() => setActiveDay(day)}
              >
                {day}
              </button>
            ))}
          </div>

          <div className="ct-timeline">
            {periods.map((p) => {
              const slot = cohortSlots.find(
                (s) => s.day === activeDay && s.periodId === p.id
              );

              if (p.isBreak) {
                return (
                  <div key={p.id} className="ct-timeline-break">
                    <span className="ct-timeline-time">{p.startTime} - {p.endTime}</span>
                    <div className="ct-timeline-break-body">
                      {p.name} ({p.duration} mins)
                    </div>
                  </div>
                );
              }

              return (
                <div key={p.id} className="ct-timeline-item">
                  <div className="ct-timeline-time-col">
                    <div className="ct-timeline-time">{p.startTime} - {p.endTime}</div>
                    <div className="ct-timeline-pnum">{p.name}</div>
                  </div>
                  <div className="ct-timeline-card" style={{ borderLeftColor: slot?.color || "#64748b" }}>
                    {slot ? (
                      <>
                        <div className="ct-timeline-subj">{slot.subject} ({slot.subjectCode})</div>
                        <div className="ct-timeline-meta">
                          <span>👨‍🏫 Faculty: <strong>{slot.teacherName}</strong></span>
                          <span>📍 Location: <strong>{slot.roomName}</strong></span>
                        </div>
                      </>
                    ) : (
                      <div className="ct-timeline-free">
                        Open Study Period & Academic Mentorship
                      </div>
                    )}
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
