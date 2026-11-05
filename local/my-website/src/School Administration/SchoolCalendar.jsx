import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SchoolDashboard.css";
import "./SchoolCalendar.css";
import { getActiveSchoolAdmin } from "../Platform Administration/schoolAdminAuth";

const INITIAL_EVENTS = [
  {
    id: "EV-01",
    title: "Mid-Term Examination Week",
    category: "Examinations",
    dateDay: "07",
    dateMonth: "Dec",
    fullDate: "Dec 07 - Dec 16, 2026",
    time: "09:00 AM - 01:00 PM",
    location: "Exam Halls A & B (All Campuses)",
    target: "Grades 9-12 Students & Invigilators",
    description: "Standardized Term 1 assessments across Mathematics, Physics, Literature, and History.",
    icon: "📝",
  },
  {
    id: "EV-02",
    title: "Winter Festival & Holiday Break Begins",
    category: "Holidays",
    dateDay: "19",
    dateMonth: "Dec",
    fullDate: "Dec 19, 2026 - Jan 05, 2027",
    time: "All Day",
    location: "School Closed",
    target: "All Staff, Faculty & Students",
    description: "Official statutory Winter Holiday and New Year recess. Administrative offices reopen on Jan 04.",
    icon: "🏖️",
  },
  {
    id: "EV-03",
    title: "Annual STEM & Robotics Exhibition",
    category: "School Events",
    dateDay: "14",
    dateMonth: "Nov",
    fullDate: "Nov 14, 2026",
    time: "10:00 AM - 04:30 PM",
    location: "Chelsea STEM Center Auditorium",
    target: "Students, Parents & Industry Judges",
    description: "Showcasing student robotics, AI software projects, and clean energy prototypes.",
    icon: "🤖",
  },
  {
    id: "EV-04",
    title: "PTA General Assembly & Advisory Meeting",
    category: "Meetings",
    dateDay: "18",
    dateMonth: "Nov",
    fullDate: "Nov 18, 2026",
    time: "06:30 PM - 08:30 PM",
    location: "Kensington Main Lecture Hall & Zoom",
    target: "Parents, Teachers & Executive Board",
    description: "Discussion on Term 1 progress, digital device policies, and campus sports center upgrades.",
    icon: "👥",
  },
  {
    id: "EV-05",
    title: "Board of Governors Quarterly Strategy Session",
    category: "Meetings",
    dateDay: "24",
    dateMonth: "Nov",
    fullDate: "Nov 24, 2026",
    time: "02:00 PM - 05:00 PM",
    location: "Executive Boardroom",
    target: "Governing Council & Head Principal",
    description: "Review of annual financial budget, multi-school accreditation filings, and campus expansions.",
    icon: "🏛️",
  },
  {
    id: "EV-06",
    title: "National Remembrance Holiday",
    category: "Holidays",
    dateDay: "11",
    dateMonth: "Nov",
    fullDate: "Nov 11, 2026",
    time: "All Day",
    location: "School Closed (Ceremony at 11:00 AM)",
    target: "All School Community",
    description: "School holiday with voluntary wreath-laying ceremony at Kensington Memorial Garden.",
    icon: "🌺",
  },
];

function SchoolCalendar({ onNavigate }) {
  const activeAdmin = getActiveSchoolAdmin();
  const schoolName = activeAdmin?.schoolName || "St. Mary International Academy";
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [activeCategory, setActiveCategory] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [newEvent, setNewEvent] = useState({
    title: "",
    category: "School Events",
    dateDay: "20",
    dateMonth: "Nov",
    fullDate: "Nov 20, 2026",
    time: "10:00 AM",
    location: "Main Auditorium",
    target: "All Students & Faculty",
    description: "",
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const navigateTo = (screen) => {
    if (onNavigate) onNavigate(screen);
  };

  const filteredEvents = events.filter(
    (e) => activeCategory === "All" || e.category === activeCategory
  );

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title) return;

    let icon = "🎪";
    if (newEvent.category === "Holidays") icon = "🏖️";
    if (newEvent.category === "Examinations") icon = "📝";
    if (newEvent.category === "Meetings") icon = "👥";

    const created = {
      id: `EV-0${events.length + 1}`,
      title: newEvent.title,
      category: newEvent.category,
      dateDay: newEvent.dateDay,
      dateMonth: newEvent.dateMonth,
      fullDate: newEvent.fullDate,
      time: newEvent.time,
      location: newEvent.location || "Main Campus",
      target: newEvent.target || "All",
      description: newEvent.description || "School community activity.",
      icon,
    };

    setEvents([created, ...events]);
    setShowAddModal(false);
    showToast(`✓ Calendar event "${created.title}" successfully published!`);
  };

  const handleSyncCalendar = () => {
    showToast("✓ Generated calendar subscription link (.ics)! Compatible with Google Calendar & Outlook.");
  };

  return (
    <div className="sch-page-wrapper">
      {/* Navigation */}
      <nav className="school-nav-bar">
        <div className="school-brand">
          <div className="school-logo-badge">🗓️</div>
          <div>
            <div className="school-brand-title">{schoolName}</div>
            <div className="school-brand-subtitle">Official School Calendar & Events Schedule</div>
          </div>
        </div>

        <div className="school-menu-links">
          <button
            type="button"
            className="school-menu-item"
            onClick={() => navigateTo("school-dashboard")}
          >
            📊 Dashboard
          </button>
          <button
            type="button"
            className="school-menu-item"
            onClick={() => navigateTo("school-profile")}
          >
            🏫 School Profile
          </button>
          <button
            type="button"
            className="school-menu-item"
            onClick={() => navigateTo("campus-management")}
          >
            🏢 Campuses
          </button>
          <button
            type="button"
            className="school-menu-item"
            onClick={() => navigateTo("academic-year-management")}
          >
            📅 Academic Years
          </button>
          <button
            type="button"
            className="school-menu-item"
            onClick={() => navigateTo("term-semester-management")}
          >
            ⏳ Terms & Semesters
          </button>
          <button
            type="button"
            className="school-menu-item active"
            onClick={() => navigateTo("school-calendar")}
          >
            🗓️ School Calendar
          </button>
          <button
            type="button"
            className="school-menu-item"
            onClick={() => navigateTo("school-settings")}
          >
            ⚙️ Settings
          </button>
        </div>

        <div className="school-nav-actions">
          <button
            type="button"
            className="school-nav-btn school-nav-btn-highlight"
            onClick={() => navigateTo("user-management")}
          >
            👥 Users Directory
          </button>
          <Link to="/" className="school-nav-btn">
            ← Hub
          </Link>
        </div>
      </nav>

      {/* Header */}
      <div className="sch-header">
        <div>
          <h1 className="sch-title">School Calendar & Operations Schedule</h1>
          <p className="sch-subtitle">
            Manage institutional holidays, school gatherings, term assessments, and administrative meetings
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="button"
            className="school-nav-btn"
            onClick={handleSyncCalendar}
          >
            📲 Sync iCal / Google
          </button>
          <button
            type="button"
            className="school-nav-btn school-nav-btn-highlight"
            onClick={() => setShowAddModal(true)}
          >
            ➕ Schedule Event
          </button>
        </div>
      </div>

      {toastMessage && (
        <div
          style={{
            background: "rgba(16, 185, 129, 0.15)",
            border: "1px solid rgba(16, 185, 129, 0.4)",
            color: "#10b981",
            padding: "14px 20px",
            borderRadius: "12px",
            marginBottom: "24px",
            fontWeight: 600,
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Filter Tabs by Event Type */}
      <div className="sc-filter-bar">
        {["All", "Holidays", "School Events", "Examinations", "Meetings"].map((cat) => (
          <button
            key={cat}
            type="button"
            className={`school-menu-item ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
            style={{ padding: "8px 16px", borderRadius: "10px" }}
          >
            {cat === "All" && "🌟 All Schedule"}
            {cat === "Holidays" && "🏖️ Holidays & Recesses"}
            {cat === "School Events" && "🎪 School Activities"}
            {cat === "Examinations" && "📝 Examinations"}
            {cat === "Meetings" && "👥 PTA & Board Meetings"}
          </button>
        ))}

        <div style={{ marginLeft: "auto", fontSize: "13px", color: "#94a3b8" }}>
          Displaying <strong>{filteredEvents.length}</strong> scheduled items
        </div>
      </div>

      {/* Events List */}
      <div className="sc-event-list">
        {filteredEvents.map((evt) => (
          <div key={evt.id} className="sc-event-card">
            <div style={{ display: "flex", alignItems: "center", gap: "18px", flex: 1 }}>
              {/* Date Box */}
              <div className="sc-date-badge">
                <div className="sc-date-day">{evt.dateDay}</div>
                <div className="sc-date-month">{evt.dateMonth}</div>
              </div>

              {/* Event Content */}
              <div className="sc-event-main">
                <div className="sc-event-title">
                  <span>{evt.icon}</span>
                  <span>{evt.title}</span>
                  <span
                    className={`sch-badge ${
                      evt.category === "Holidays"
                        ? "sch-badge-warning"
                        : evt.category === "Examinations"
                        ? "sch-badge-danger"
                        : evt.category === "Meetings"
                        ? "sch-badge-info"
                        : "sch-badge-success"
                    }`}
                    style={{ fontSize: "10px", padding: "2px 8px" }}
                  >
                    {evt.category}
                  </span>
                </div>
                <p className="sc-event-desc">{evt.description}</p>
                <div className="sc-event-meta">
                  <span>⏰ {evt.time}</span>
                  <span>📍 {evt.location}</span>
                  <span>👥 Target: {evt.target}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="school-nav-btn"
              style={{ fontSize: "12px" }}
              onClick={() => showToast(`Notified attendees for ${evt.title}!`)}
            >
              🔔 Send Alert
            </button>
          </div>
        ))}
      </div>

      {/* Modal: Add Event */}
      {showAddModal && (
        <div className="cm-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="cm-modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ margin: 0, fontSize: "18px", color: "#ffffff" }}>
                Schedule Calendar Event / Holiday
              </h2>
              <button
                type="button"
                style={{ background: "transparent", border: "none", color: "#94a3b8", fontSize: "20px", cursor: "pointer" }}
                onClick={() => setShowAddModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddEvent}>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label className="sp-form-label">Event / Activity Title *</label>
                  <input
                    type="text"
                    required
                    className="sp-form-input"
                    placeholder="e.g. Winter Music Concert"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label className="sp-form-label">Event Category</label>
                    <select
                      className="sp-form-input"
                      value={newEvent.category}
                      onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                    >
                      <option value="School Events">🎪 School Events</option>
                      <option value="Holidays">🏖️ Holidays & Recesses</option>
                      <option value="Examinations">📝 Examinations</option>
                      <option value="Meetings">👥 PTA & Board Meetings</option>
                    </select>
                  </div>
                  <div>
                    <label className="sp-form-label">Location / Room</label>
                    <input
                      type="text"
                      className="sp-form-input"
                      placeholder="e.g. Main Auditorium"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                  <div>
                    <label className="sp-form-label">Day (e.g. 15)</label>
                    <input
                      type="text"
                      className="sp-form-input"
                      value={newEvent.dateDay}
                      onChange={(e) => setNewEvent({ ...newEvent, dateDay: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="sp-form-label">Month (e.g. Nov)</label>
                    <input
                      type="text"
                      className="sp-form-input"
                      value={newEvent.dateMonth}
                      onChange={(e) => setNewEvent({ ...newEvent, dateMonth: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="sp-form-label">Time</label>
                    <input
                      type="text"
                      className="sp-form-input"
                      placeholder="10:00 AM"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="sp-form-label">Target Audience</label>
                  <input
                    type="text"
                    className="sp-form-input"
                    placeholder="e.g. All Students, Parents, Faculty"
                    value={newEvent.target}
                    onChange={(e) => setNewEvent({ ...newEvent, target: e.target.value })}
                  />
                </div>

                <div>
                  <label className="sp-form-label">Detailed Notes / Summary</label>
                  <textarea
                    rows={3}
                    className="sp-form-input"
                    placeholder="Event brief, requirements, dress code, etc."
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "24px" }}>
                <button
                  type="button"
                  className="school-nav-btn"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="school-nav-btn school-nav-btn-highlight"
                >
                  Publish to Calendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SchoolCalendar;
