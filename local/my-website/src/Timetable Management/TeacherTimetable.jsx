import React, { useState, useEffect } from "react";
import TimetableNav from "./TimetableNav";
import { getTimetableSlots, getPeriods } from "./timetableData";
import "./TeacherTimetable.css";

const TEACHER_PROFILES = [
  {
    id: "TCH-2026-102",
    name: "Mrs. Sarah Jenkins",
    dept: "Science & Chemistry Faculty",
    title: "Senior Faculty & Chemistry Master",
    campus: "Kensington Central Campus",
    office: "Science Staffroom 3",
    email: "s.jenkins@smia.edu.gh",
    phone: "+233 24 551 0922",
  },
  {
    id: "TCH-GH-101",
    name: "Mr. Kofi Annan",
    dept: "Applied Engineering & Physics",
    title: "Head of Physics & Robotics",
    campus: "Kensington Central Campus",
    office: "Innovation Hub Room 12",
    email: "k.annan@smia.edu.gh",
    phone: "+233 20 782 1109",
  },
  {
    id: "TCH-2026-101",
    name: "Dr. Jonathan Miller",
    dept: "Department of Mathematics",
    title: "Senior Elective Mathematics Master",
    campus: "Kensington Central Campus",
    office: "Mathematics Office 201",
    email: "j.miller@smia.edu.gh",
    phone: "+233 24 410 8820",
  },
  {
    id: "TCH-2026-104",
    name: "Dame Eleanor Vance",
    dept: "Humanities & Languages",
    title: "Head Principal & English Faculty",
    campus: "Main Administration Block",
    office: "Executive Principal Suite",
    email: "principal@smia.edu.gh",
    phone: "+233 24 100 2000",
  },
  {
    id: "TCH-2026-103",
    name: "Marcus Brody",
    dept: "Social Studies & History",
    title: "Senior History & Classical Studies Master",
    campus: "North London Science Wing",
    office: "History Room 104",
    email: "m.brody@smia.edu.gh",
    phone: "+44 7700 900511",
  },
];

export default function TeacherTimetable() {
  const [slots, setSlots] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState("TCH-2026-102");

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  useEffect(() => {
    setSlots(getTimetableSlots());
    setPeriods(getPeriods());
  }, []);

  const activeTeacher = TEACHER_PROFILES.find((t) => t.id === selectedTeacherId) || TEACHER_PROFILES[0];
  const teacherSlots = slots.filter((s) => s.teacherName === activeTeacher.name || s.teacherId === activeTeacher.id);

  const lessonPeriods = periods.filter((p) => !p.isBreak);
  const totalWeeklySlots = lessonPeriods.length * 5;
  const teachingHours = teacherSlots.length;
  const freePeriods = Math.max(0, totalWeeklySlots - teachingHours);

  return (
    <div className="tt-page-container">
      <TimetableNav
        title="Faculty & Teacher Teaching Timetable"
        subtitle="Individual teaching routines, free planning periods, classroom allocations, and workload auditing"
        badge="Module 9 • Screen 4 of 7"
      />

      {/* Header Banner */}
      <div className="tt-page-header">
        <div className="tt-header-title-box">
          <span className="tt-header-tag">FACULTY WORKLOAD SCHEDULE</span>
          <h1 className="tt-page-title">{activeTeacher.name}'s Teaching Schedule</h1>
          <p className="tt-page-subtitle">
            {activeTeacher.title} • {activeTeacher.dept} • Office: {activeTeacher.office}
          </p>
        </div>

        <div className="tt-header-actions-wrap">
          <div className="tt-teacher-dropdown-box">
            <label>Select Teacher:</label>
            <select
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="tt-teacher-select"
            >
              {TEACHER_PROFILES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.dept})
                </option>
              ))}
            </select>
          </div>

          <button className="tt-btn-print-action" onClick={() => window.print()}>
            🖨️ Print Faculty Roster
          </button>
        </div>
      </div>

      {/* Teacher Workload KPI Cards */}
      <div className="tt-workload-grid">
        <div className="tt-workload-card">
          <div className="tt-card-icon-box" style={{ background: "rgba(6, 182, 212, 0.15)", color: "#06b6d4" }}>
            📚
          </div>
          <div>
            <div className="tt-card-label">Weekly Teaching Lessons</div>
            <div className="tt-card-val">{teachingHours} <span className="tt-card-sub">Periods / week</span></div>
          </div>
        </div>

        <div className="tt-workload-card">
          <div className="tt-card-icon-box" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
            ☕
          </div>
          <div>
            <div className="tt-card-label">Free / Prep Periods</div>
            <div className="tt-card-val">{freePeriods} <span className="tt-card-sub">Office & Lesson Planning</span></div>
          </div>
        </div>

        <div className="tt-workload-card">
          <div className="tt-card-icon-box" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b" }}>
            👥
          </div>
          <div>
            <div className="tt-card-label">Instructional Cohorts</div>
            <div className="tt-card-val">
              {[...new Set(teacherSlots.map((s) => s.classCohort))].length || 1} Classes
              <span className="tt-card-sub">Active Students</span>
            </div>
          </div>
        </div>

        <div className="tt-workload-card">
          <div className="tt-card-icon-box" style={{ background: "rgba(139, 92, 246, 0.15)", color: "#8b5cf6" }}>
            📍
          </div>
          <div>
            <div className="tt-card-label">Primary Teaching Venue</div>
            <div className="tt-card-val">
              {teacherSlots[0]?.roomName || "Senior Science Lab"}
              <span className="tt-card-sub">{activeTeacher.campus}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Teacher Timetable Grid */}
      <div className="tt-grid-card">
        <div className="tt-grid-responsive">
          <table className="tt-grid-table">
            <thead>
              <tr>
                <th className="tt-th-period">Period & Bell</th>
                {daysOfWeek.map((day) => (
                  <th key={day} className="tt-th-weekday">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periods.map((p) => {
                if (p.isBreak) {
                  return (
                    <tr key={p.id} className="tt-row-recess">
                      <td className="tt-td-recess-time">{p.startTime} - {p.endTime}</td>
                      <td colSpan={5} className="tt-td-recess-label">
                        <span>{p.type === "Assembly" ? "🔔" : "🥪"} {p.name} ({p.duration} mins)</span>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={p.id}>
                    <td className="tt-cell-period-meta">
                      <div className="tt-pm-name">{p.name}</div>
                      <div className="tt-pm-time">{p.startTime} - {p.endTime}</div>
                    </td>

                    {daysOfWeek.map((day) => {
                      const slot = teacherSlots.find(
                        (s) => s.day === day && s.periodId === p.id
                      );

                      return (
                        <td key={day} className="tt-cell-lesson-slot">
                          {slot ? (
                            <div
                              className="tt-teacher-slot-tile"
                              style={{ borderLeftColor: slot.color || "#06b6d4" }}
                            >
                              <div className="tt-tile-cohort">{slot.classCohort}</div>
                              <div className="tt-tile-subj">{slot.subject}</div>
                              <div className="tt-tile-room">📍 {slot.roomName}</div>
                            </div>
                          ) : (
                            <div className="tt-tile-free">
                              <span>Free / Office Prep</span>
                            </div>
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
    </div>
  );
}
