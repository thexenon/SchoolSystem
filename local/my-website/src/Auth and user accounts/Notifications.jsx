import React, { useState } from "react";
import "./auth.css";

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: "alert",
    category: "Alerts",
    title: "School Closure Alert: Severe Weather Warning",
    message: "Campus will transition to online sessions tomorrow due to inclement weather conditions. Staff and students should log into Google Classroom.",
    time: "25 minutes ago",
    read: false,
  },
  {
    id: 2,
    type: "reminder",
    category: "Reminders",
    title: "Quarterly Grade Submission Deadline",
    message: "Reminder for all faculty members: Term 1 midterm marks must be entered and finalized into the grading portal by Friday at 5:00 PM.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 3,
    type: "update",
    category: "Updates",
    title: "System Maintenance Scheduled",
    message: "The School Management System database will undergo scheduled routine maintenance on Saturday, 11:00 PM - 02:00 AM UTC.",
    time: "1 day ago",
    read: true,
  },
  {
    id: 4,
    type: "reminder",
    category: "Reminders",
    title: "Parent-Teacher Conference Bookings Open",
    message: "Appointments for upcoming fall Parent-Teacher meetings are now open for scheduling through the parent portal.",
    time: "2 days ago",
    read: true,
  },
  {
    id: 5,
    type: "update",
    category: "Updates",
    title: "New Attendance Policy Enacted",
    message: "The revised 2026/2027 academic year student attendance and leave approval guidelines are now available in the document repository.",
    time: "4 days ago",
    read: true,
  },
];

function Notifications({ onNavigate }) {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const toggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "alerts") return n.type === "alert";
    if (filter === "reminders") return n.type === "reminder";
    if (filter === "updates") return n.type === "update";
    return true;
  });

  const getBadgeStyle = (type) => {
    switch (type) {
      case "alert":
        return { bg: "var(--auth-danger-light)", color: "var(--auth-danger)", label: "Alert" };
      case "reminder":
        return { bg: "var(--auth-warning-light)", color: "var(--auth-warning)", label: "Reminder" };
      case "update":
      default:
        return { bg: "var(--auth-primary-light)", color: "var(--auth-primary)", label: "Update" };
    }
  };

  return (
    <div className="sms-page-wrapper">
      <div className="sms-dashboard-card" style={{ maxWidth: "880px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <span className="sms-portal-badge">Communication</span>
            <h1 className="sms-title" style={{ textAlign: "left" }}>Notifications & Alerts</h1>
            <p className="sms-subtitle">
              Stay informed with real-time academic announcements, reminders, and alerts
            </p>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              className="sms-btn sms-btn-secondary sms-btn-sm"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              ✓ Mark All as Read
            </button>
            <button
              type="button"
              className="sms-btn sms-btn-secondary sms-btn-sm"
              onClick={clearAll}
              disabled={notifications.length === 0}
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="sms-tabs">
          <button
            type="button"
            className={`sms-tab ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All ({notifications.length})
          </button>
          <button
            type="button"
            className={`sms-tab ${filter === "unread" ? "active" : ""}`}
            onClick={() => setFilter("unread")}
          >
            Unread ({unreadCount})
          </button>
          <button
            type="button"
            className={`sms-tab ${filter === "alerts" ? "active" : ""}`}
            onClick={() => setFilter("alerts")}
          >
            Alerts
          </button>
          <button
            type="button"
            className={`sms-tab ${filter === "reminders" ? "active" : ""}`}
            onClick={() => setFilter("reminders")}
          >
            Reminders
          </button>
          <button
            type="button"
            className={`sms-tab ${filter === "updates" ? "active" : ""}`}
            onClick={() => setFilter("updates")}
          >
            Updates
          </button>
        </div>

        {/* Notifications List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filteredNotifications.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "48px 20px",
                background: "#f8fafc",
                borderRadius: "10px",
                border: "1px dashed var(--auth-border)",
                color: "var(--auth-text-muted)",
              }}
            >
              <div style={{ fontSize: "28px", marginBottom: "8px" }}>🔔</div>
              <div style={{ fontWeight: 600 }}>No notifications found</div>
              <div style={{ fontSize: "13px", marginTop: "4px" }}>
                You're all caught up with your school alerts and notices!
              </div>
            </div>
          ) : (
            filteredNotifications.map((item) => {
              const badge = getBadgeStyle(item.type);
              return (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "16px",
                    padding: "16px 20px",
                    borderRadius: "10px",
                    border: "1px solid",
                    borderColor: item.read ? "var(--auth-border)" : "var(--auth-primary)",
                    background: item.read ? "#ffffff" : "#fbfbfe",
                    boxShadow: item.read ? "none" : "0 2px 4px rgba(79, 70, 229, 0.06)",
                    transition: "all 0.2s ease",
                  }}
                >
                  {/* Unread indicator */}
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: item.read ? "transparent" : "var(--auth-primary)",
                      marginTop: "7px",
                      flexShrink: 0,
                    }}
                  />

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                      <span
                        style={{
                          background: badge.bg,
                          color: badge.color,
                          fontSize: "11px",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: "9999px",
                          textTransform: "uppercase",
                        }}
                      >
                        {badge.label}
                      </span>
                      <span style={{ fontSize: "12px", color: "var(--auth-text-muted)" }}>
                        {item.time}
                      </span>
                    </div>

                    <div style={{ fontWeight: 700, fontSize: "15px", color: "var(--auth-text-main)", marginBottom: "4px" }}>
                      {item.title}
                    </div>

                    <div style={{ fontSize: "13px", color: "var(--auth-text-muted)", lineHeight: 1.5 }}>
                      {item.message}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                    <button
                      type="button"
                      className="sms-btn sms-btn-secondary sms-btn-sm"
                      onClick={() => toggleRead(item.id)}
                      title={item.read ? "Mark as unread" : "Mark as read"}
                    >
                      {item.read ? "Mark Unread" : "Mark Read"}
                    </button>
                    <button
                      type="button"
                      className="sms-btn sms-btn-secondary sms-btn-sm"
                      onClick={() => removeNotification(item.id)}
                      title="Dismiss notification"
                      style={{ color: "var(--auth-danger)" }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Notifications;
