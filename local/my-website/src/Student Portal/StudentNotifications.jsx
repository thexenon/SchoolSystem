import React, { useState } from "react";
import StudentNav from "./StudentNav";
import { getStoredNotifications, saveStoredNotifications } from "./studentPortalData";
import "./StudentNotifications.css";

export default function StudentNotifications() {
  const [notifications, setNotifications] = useState(getStoredNotifications());
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  const handleMarkAsRead = (id) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    setNotifications(updated);
    saveStoredNotifications(updated);
    showToast("Notification marked as read.");
  };

  const handleMarkAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    saveStoredNotifications(updated);
    showToast("All notifications marked as read!");
  };

  const handleDelete = (id) => {
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    saveStoredNotifications(updated);
    showToast("Notification dismissed.");
  };

  // Filter
  const filteredNotifs = notifications.filter((item) => {
    if (filter === "Unread" && item.read) return false;
    if (filter === "Urgent" && item.priority !== "Urgent" && item.priority !== "High") return false;
    if (filter === "Academic" && item.category !== "Academic Assessment") return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchMsg = item.message.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      if (!matchTitle && !matchMsg && !matchCat) return false;
    }
    return true;
  });

  const totalCount = notifications.length;
  const unreadCount = notifications.filter((n) => !n.read).length;
  const urgentCount = notifications.filter((n) => n.priority === "Urgent" || n.priority === "High").length;

  return (
    <div className="sno-page-container">
      {toast && (
        <div className="sno-toast">
          <span>✓</span> {toast}
        </div>
      )}

      <StudentNav
        title="Student Notices & Campus Announcements"
        subtitle="Official circulars, examination reminders, library deadlines, and co-curricular updates"
        badge="Module 12 • Screen 10 of 10"
      />

      {/* Header Banner */}
      <div className="sno-header-strip">
        <div>
          <span className="sno-tag">STUDENT COMMUNICATIONS INBOX</span>
          <h1 className="sno-title">Announcements & Reminders</h1>
          <p className="sno-sub">
            Real-time feed of institutional circulars, academic assessments, library notices, and
            campus life communications.
          </p>
        </div>

        <div className="sno-header-actions">
          {unreadCount > 0 && (
            <button className="sno-btn-mark-all" onClick={handleMarkAllRead}>
              ✓ Mark All as Read
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="sno-kpi-grid">
        <div className="sno-kpi-card">
          <span className="sno-kpi-label">Total Announcements</span>
          <div className="sno-kpi-val text-cyan">{totalCount}</div>
          <span className="sno-kpi-sub">Active circulars</span>
        </div>

        <div className="sno-kpi-card">
          <span className="sno-kpi-label">Unread Messages</span>
          <div className="sno-kpi-val text-amber">{unreadCount}</div>
          <span className="sno-kpi-sub">Pending review</span>
        </div>

        <div className="sno-kpi-card">
          <span className="sno-kpi-label">High Priority / Urgent</span>
          <div className="sno-kpi-val text-rose">{urgentCount}</div>
          <span className="sno-kpi-sub">Action required</span>
        </div>
      </div>

      {/* Toolbar Search & Filter Strip */}
      <div className="sno-toolbar">
        <div className="sno-search-box">
          <span className="sno-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search announcements, topics, or circulars..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="sno-clear-btn" onClick={() => setSearchQuery("")}>
              ✕
            </button>
          )}
        </div>

        <div className="sno-filter-tabs">
          <button
            className={`sno-filter-btn ${filter === "All" ? "active" : ""}`}
            onClick={() => setFilter("All")}
          >
            All Notices ({totalCount})
          </button>
          <button
            className={`sno-filter-btn ${filter === "Unread" ? "active" : ""}`}
            onClick={() => setFilter("Unread")}
          >
            📬 Unread ({unreadCount})
          </button>
          <button
            className={`sno-filter-btn ${filter === "Urgent" ? "active" : ""}`}
            onClick={() => setFilter("Urgent")}
          >
            ⚡ High Priority ({urgentCount})
          </button>
          <button
            className={`sno-filter-btn ${filter === "Academic" ? "active" : ""}`}
            onClick={() => setFilter("Academic")}
          >
            📝 Academic Assessments
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="sno-list">
        {filteredNotifs.length === 0 ? (
          <div className="sno-empty-box">
            <span className="sno-empty-icon">📭</span>
            <h3>No Announcements Found</h3>
            <p>You are all caught up with the active filters!</p>
          </div>
        ) : (
          filteredNotifs.map((notif) => (
            <div
              key={notif.id}
              className={`sno-card ${!notif.read ? "sno-card-unread" : ""}`}
            >
              <div className="sno-card-header">
                <div className="sno-card-meta">
                  {!notif.read && <span className="sno-unread-dot" />}
                  <span
                    className={`sno-priority-pill ${
                      notif.priority === "Urgent" || notif.priority === "High"
                        ? "priority-high"
                        : "priority-normal"
                    }`}
                  >
                    ● {notif.priority}
                  </span>
                  <span className="sno-cat-pill">{notif.category}</span>
                </div>

                <div className="sno-date-stamp">
                  <span>📅 {notif.date} • {notif.time}</span>
                  <span className="sno-id font-mono">{notif.id}</span>
                </div>
              </div>

              <h3 className="sno-card-title">{notif.title}</h3>
              <p className="sno-card-msg">{notif.message}</p>

              <div className="sno-card-footer">
                {!notif.read ? (
                  <button
                    className="sno-btn-read"
                    onClick={() => handleMarkAsRead(notif.id)}
                  >
                    ✓ Mark as Read
                  </button>
                ) : (
                  <span className="sno-read-label">✓ Seen</span>
                )}
                <button
                  className="sno-btn-delete"
                  onClick={() => handleDelete(notif.id)}
                  title="Dismiss notification"
                >
                  Dismiss ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
