import React, { useState } from "react";
import StudentNav from "./StudentNav";
import { WEEKLY_TIMETABLE } from "./studentPortalData";
import "./MyTimetable.css";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function MyTimetable() {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [viewMode, setViewMode] = useState("daily"); // 'daily' or 'weekly'
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportICS = () => {
    showToast("Class timetable schedule exported to iCalendar (.ics) format!");
  };

  return (
    <div className="mt-page-container">
      {toast && (
        <div className="mt-toast">
          <span>✓</span> {toast}
        </div>
      )}

      <StudentNav
        title="Student Class Timetable & Schedule"
        subtitle="Weekly academic routine, period timings, designated halls, and faculty instructors"
        badge="Module 12 • Screen 3 of 10"
      />

      {/* Control Header Strip */}
      <div className="mt-header-bar">
        <div className="mt-view-toggle">
          <button
            className={`mt-toggle-btn ${viewMode === "daily" ? "active" : ""}`}
            onClick={() => setViewMode("daily")}
          >
            📋 Daily Period View
          </button>
          <button
            className={`mt-toggle-btn ${viewMode === "weekly" ? "active" : ""}`}
            onClick={() => setViewMode("weekly")}
          >
            🗓️ 5-Day Weekly Grid
          </button>
        </div>

        <div className="mt-action-buttons">
          <button className="mt-btn-export" onClick={handleExportICS}>
            📅 Sync (.ICS)
          </button>
          <button className="mt-btn-print" onClick={handlePrint}>
            🖨️ Print Timetable
          </button>
        </div>
      </div>

      {/* Day Selector (for Daily View) */}
      {viewMode === "daily" && (
        <div className="mt-days-strip">
          {DAYS.map((day) => (
            <button
              key={day}
              className={`mt-day-tab ${selectedDay === day ? "active" : ""}`}
              onClick={() => setSelectedDay(day)}
            >
              <span>{day.substring(0, 3).toUpperCase()}</span>
              <strong>{day}</strong>
            </button>
          ))}
        </div>
      )}

      {/* DAILY VIEW */}
      {viewMode === "daily" && (
        <div className="mt-daily-container">
          <div className="mt-day-heading">
            <h2>{selectedDay} Schedule</h2>
            <span className="mt-day-badge">Active Academic Session • 2026/2027</span>
          </div>

          <div className="mt-periods-list">
            {WEEKLY_TIMETABLE[selectedDay].map((slot, idx) => {
              const isBreak = slot.period === "Break" || slot.period === "Lunch";
              return (
                <div
                  key={idx}
                  className={`mt-period-card ${isBreak ? "mt-break-card" : ""}`}
                >
                  <div className="mt-period-time">
                    <span className="mt-time-range font-mono">{slot.time}</span>
                    <span className="mt-period-tag">{slot.period}</span>
                  </div>

                  <div className="mt-period-details">
                    <div className="mt-subject-row">
                      <h3 className="mt-subject-name">{slot.subject}</h3>
                      <span className="mt-code-pill font-mono">{slot.code}</span>
                    </div>

                    {!isBreak && (
                      <div className="mt-period-meta">
                        <span className="mt-meta-item">📍 Venue: <strong>{slot.room}</strong></span>
                        <span className="mt-meta-item">👨‍🏫 Faculty: <strong>{slot.teacher}</strong></span>
                      </div>
                    )}
                  </div>

                  <div className="mt-period-status">
                    {isBreak ? (
                      <span className="mt-status-break">☕ Interval</span>
                    ) : (
                      <span className="mt-status-class">● Scheduled</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WEEKLY MATRIX VIEW */}
      {viewMode === "weekly" && (
        <div className="mt-weekly-card">
          <div className="mt-weekly-header">
            <h2>5-Day Comprehensive Academic Master Matrix</h2>
            <span className="mt-day-badge">Term 1 Schedule</span>
          </div>

          <div className="mt-table-wrapper">
            <table className="mt-weekly-table">
              <thead>
                <tr>
                  <th>Period & Time</th>
                  {DAYS.map((d) => (
                    <th key={d}>{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {WEEKLY_TIMETABLE.Monday.map((_, pIdx) => {
                  const samplePeriod = WEEKLY_TIMETABLE.Monday[pIdx];
                  const isBreak =
                    samplePeriod.period === "Break" || samplePeriod.period === "Lunch";
                  return (
                    <tr key={pIdx} className={isBreak ? "mt-row-break" : ""}>
                      <td className="mt-col-time">
                        <div className="font-mono">{samplePeriod.time}</div>
                        <small>{samplePeriod.period}</small>
                      </td>
                      {DAYS.map((d) => {
                        const cell = WEEKLY_TIMETABLE[d][pIdx] || {};
                        return (
                          <td key={d} className="mt-col-content">
                            <div className="mt-matrix-subject">{cell.subject}</div>
                            {!isBreak && (
                              <div className="mt-matrix-room">
                                📍 {cell.room} • {cell.teacher?.split(" ")[0]}
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
      )}
    </div>
  );
}
