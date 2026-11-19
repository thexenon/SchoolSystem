import React, { useState } from "react";
import ParentNav from "./ParentNav";
import { SCHOOL_CALENDAR_EVENTS } from "./parentData";
import "./ParentSchoolCalendar.css";

export default function ParentSchoolCalendar() {
  const [events, setEvents] = useState(SCHOOL_CALENDAR_EVENTS);
  const [typeFilter, setTypeFilter] = useState("All");
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSetReminder = (eventTitle, date) => {
    showToast(`Reminder scheduled for "${eventTitle}" on ${date}!`);
  };

  const filteredEvents = events.filter((e) => {
    if (typeFilter !== "All" && e.type !== typeFilter) return false;
    return true;
  });

  return (
    <div className="psc-container">
      <ParentNav
        title="Official Academic Calendar & Event Schedule"
        subtitle="Track terminal examinations, parent-teacher meetings, sports fixtures, and school holiday dates"
        badge="Module 11 • Screen 9 of 10"
      />

      {toast && (
        <div className={`psc-toast psc-toast-${toast.type}`}>
          <div className="psc-toast-dot" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="psc-header">
        <div className="psc-title-box">
          <span className="psc-tag">ACADEMIC YEAR 2026/2027 FIXTURES</span>
          <h1 className="psc-title">Institutional School Calendar</h1>
          <p className="psc-subtitle">
            Synchronized calendar of termly milestones, mid-term testing weeks, speech & prize-giving ceremonies,
            and statutory vacation dates for all academic divisions.
          </p>
        </div>

        <div className="psc-actions">
          <button
            className="psc-btn-export"
            onClick={() => showToast("Academic Calendar (.ics) downloaded to device!")}
          >
            📅 Sync Calendar (.ICS)
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="psc-filter-strip">
        <button
          className={`psc-filter-btn ${typeFilter === "All" ? "active" : ""}`}
          onClick={() => setTypeFilter("All")}
        >
          All Fixtures ({events.length})
        </button>
        <button
          className={`psc-filter-btn ${typeFilter === "Examination" ? "active" : ""}`}
          onClick={() => setTypeFilter("Examination")}
        >
          📝 Examinations
        </button>
        <button
          className={`psc-filter-btn ${typeFilter === "Parent Meeting" ? "active" : ""}`}
          onClick={() => setTypeFilter("Parent Meeting")}
        >
          👥 PTA Meetings
        </button>
        <button
          className={`psc-filter-btn ${typeFilter === "Sports" ? "active" : ""}`}
          onClick={() => setTypeFilter("Sports")}
        >
          🏆 Sports & Games
        </button>
        <button
          className={`psc-filter-btn ${typeFilter === "Holiday" ? "active" : ""}`}
          onClick={() => setTypeFilter("Holiday")}
        >
          🏖️ Vacations & Holidays
        </button>
      </div>

      {/* Events Agenda Grid */}
      <div className="psc-events-grid">
        {filteredEvents.map((evt) => (
          <div key={evt.id} className="psc-event-card">
            <div className="psc-card-left" style={{ borderLeftColor: evt.color }}>
              <div className="psc-date-box">
                <span className="psc-month">
                  {new Date(evt.date).toLocaleString("default", { month: "short" }).toUpperCase()}
                </span>
                <span className="psc-day">{new Date(evt.date).getDate()}</span>
              </div>

              <div className="psc-event-body">
                <div className="psc-event-tags">
                  <span className="psc-type-pill" style={{ color: evt.color, background: `${evt.color}22` }}>
                    ● {evt.type}
                  </span>
                  <span className="psc-id-tag">{evt.id}</span>
                </div>
                <h3 className="psc-event-title">{evt.title}</h3>
                <div className="psc-event-date-range">
                  📅 {evt.date} {evt.endDate !== evt.date && `through ${evt.endDate}`}
                </div>
              </div>
            </div>

            <div className="psc-card-right">
              <button
                className="psc-btn-remind"
                onClick={() => handleSetReminder(evt.title, evt.date)}
              >
                ⏰ Set Reminder
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
