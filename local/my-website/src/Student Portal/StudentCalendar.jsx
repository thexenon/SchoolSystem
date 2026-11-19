import React, { useState } from "react";
import StudentNav from "./StudentNav";
import { STUDENT_CALENDAR_EVENTS } from "./studentPortalData";
import "./StudentCalendar.css";

const CATEGORIES = ["All", "Examination", "Sports", "Ceremony", "Holiday", "Academic"];

export default function StudentCalendar() {
  const [events] = useState(STUDENT_CALENDAR_EVENTS);
  const [activeCategory, setActiveCategory] = useState("All");
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  const handleSetReminder = (eventTitle, date) => {
    showToast(`Personal study reminder scheduled for "${eventTitle}" on ${date}!`);
  };

  const filteredEvents = events.filter((e) => {
    if (activeCategory !== "All" && e.category !== activeCategory) return false;
    return true;
  });

  return (
    <div className="sc-page-container">
      {toast && (
        <div className="sc-toast">
          <span>✓</span> {toast}
        </div>
      )}

      <StudentNav
        title="Official School & Examination Calendar"
        subtitle="Track upcoming mid-term papers, terminal examination dates, inter-house sports, and term holidays"
        badge="Module 12 • Screen 8 of 10"
      />

      {/* Header Banner */}
      <div className="sc-header-strip">
        <div>
          <span className="sc-tag">ACADEMIC YEAR 2026/2027 FIXTURES</span>
          <h1 className="sc-title">School Events & Examination Schedule</h1>
          <p className="sc-sub">
            Synchronized master timeline for student examinations, campus athletic fixtures, speech days,
            and term vacation respites.
          </p>
        </div>

        <div className="sc-header-actions">
          <button
            className="sc-btn-sync"
            onClick={() => showToast("Academic Calendar (.ics) downloaded to device!")}
          >
            📅 Export to Calendar (.ICS)
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="sc-filters-bar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`sc-filter-btn ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat === "All"
              ? `All Dates (${events.length})`
              : cat === "Examination"
              ? "📝 Examinations"
              : cat === "Sports"
              ? "🏆 Sports & Games"
              : cat === "Ceremony"
              ? "🎖️ Ceremonies"
              : cat === "Holiday"
              ? "🏖️ Holidays"
              : "📚 Academic"}
          </button>
        ))}
      </div>

      {/* Events Timeline Grid */}
      <div className="sc-events-grid">
        {filteredEvents.map((evt) => {
          const dateObj = new Date(evt.date);
          const monthStr = dateObj.toLocaleString("default", { month: "short" }).toUpperCase();
          const dayNum = dateObj.getDate();

          return (
            <div key={evt.id} className="sc-event-card">
              <div className="sc-card-left" style={{ borderLeftColor: evt.color }}>
                <div className="sc-date-box">
                  <span className="sc-date-month">{monthStr}</span>
                  <span className="sc-date-day">{dayNum}</span>
                </div>

                <div className="sc-event-body">
                  <div className="sc-event-tags">
                    <span
                      className="sc-type-pill"
                      style={{ color: evt.color, background: `${evt.color}22` }}
                    >
                      ● {evt.category}
                    </span>
                    <span className="sc-id-tag font-mono">{evt.id}</span>
                  </div>

                  <h3 className="sc-event-title">{evt.title}</h3>
                  <div className="sc-event-meta">
                    <span>📅 {evt.date} {evt.endDate !== evt.date && `through ${evt.endDate}`}</span>
                    <span>•</span>
                    <span>📍 {evt.location}</span>
                  </div>
                </div>
              </div>

              <div className="sc-card-right">
                <button
                  className="sc-btn-remind"
                  onClick={() => handleSetReminder(evt.title, evt.date)}
                >
                  ⏰ Set Reminder
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
