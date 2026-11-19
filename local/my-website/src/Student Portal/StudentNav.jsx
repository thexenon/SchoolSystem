import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  PORTAL_STUDENTS,
  getActiveStudent,
  saveActiveStudent,
  getStoredNotifications,
} from "./studentPortalData";
import DailyQuotePopupModal from "../components/DailyQuotePopupModal";
import "./StudentNav.css";

const NAV_ITEMS = [
  { path: "/student-dashboard", label: "Dashboard", icon: "🏠" },
  { path: "/student-profile", label: "My Profile", icon: "👤" },
  { path: "/student-timetable", label: "My Timetable", icon: "🗓️" },
  { path: "/student-attendance", label: "My Attendance", icon: "📋" },
  { path: "/student-results", label: "My Results", icon: "📝" },
  { path: "/student-assignments", label: "My Assignments", icon: "📁" },
  { path: "/student-materials", label: "Learning Materials", icon: "📚" },
  { path: "/student-calendar", label: "School Calendar", icon: "📅" },
  { path: "/student-fees", label: "My Fees", icon: "💳" },
  { path: "/student-notifications", label: "Notifications", icon: "🔔" },
];

export default function StudentNav({ title, subtitle, badge }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [student, setStudent] = useState(getActiveStudent());
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [notifications] = useState(getStoredNotifications());
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleUserChanged = (e) => {
      if (e.detail) {
        setStudent(e.detail);
      } else {
        setStudent(getActiveStudent());
      }
    };
    window.addEventListener("studentUserChanged", handleUserChanged);
    return () => window.removeEventListener("studentUserChanged", handleUserChanged);
  }, []);

  const handleStudentSwitch = (e) => {
    const chosenId = e.target.value;
    const found = PORTAL_STUDENTS.find((s) => s.id === chosenId);
    if (found) {
      setStudent(found);
      saveActiveStudent(found);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("student_auth");
    localStorage.removeItem("active_student_user");
    navigate("/login");
  };

  return (
    <div className="sn-wrapper">
      <DailyQuotePopupModal
        forceOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
      />

      {/* Top Banner Navigation Bar */}
      <header className="sn-top-bar">
        <div className="sn-brand-box">
          <div className="sn-brand-avatar">
            {student.firstName[0]}
            {student.lastName[0]}
          </div>
          <div className="sn-brand-info">
            <div className="sn-brand-title">
              Student Workstation Portal <span className="sn-badge-pill">{badge || "Module 12"}</span>
            </div>
            <div className="sn-brand-sub">
              {title || `Welcome, ${student.fullName}`} • {student.grade} - {student.section}
            </div>
          </div>
        </div>

        <div className="sn-top-actions">
          {/* Active Student Selector Dropdown */}
          <div className="sn-student-switcher">
            <span className="sn-switcher-label">Active Student:</span>
            <select
              className="sn-select-input"
              value={student.id}
              onChange={handleStudentSwitch}
              title="Switch Active Student Account"
            >
              {PORTAL_STUDENTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.fullName} ({s.grade})
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="sn-action-btn sn-quote-btn"
            onClick={() => setQuoteModalOpen(true)}
            title="Daily Motivation Quote"
          >
            ✨ Daily Quote
          </button>

          <Link to="/student-notifications" className="sn-action-btn sn-notif-btn" title="View Notifications">
            🔔 {unreadCount > 0 && <span className="sn-notif-badge">{unreadCount}</span>}
          </Link>

          <Link to="/" className="sn-action-btn" title="Return to School Hub">
            ← Hub
          </Link>

          <button
            type="button"
            className="sn-action-btn sn-signout-btn"
            onClick={handleSignOut}
            title="Sign out of student account"
          >
            🔒 Sign Out
          </button>
        </div>
      </header>

      {/* Sub-Header Context Description */}
      {subtitle && (
        <div className="sn-subheader">
          <p className="sn-sub-description">{subtitle}</p>
        </div>
      )}

      {/* Horizontal Nav Bar with All 10 Screens */}
      <nav className="sn-nav-scroll">
        <div className="sn-nav-links">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sn-nav-tab ${isActive ? "active" : ""}`}
              >
                <span className="sn-tab-icon">{item.icon}</span>
                <span className="sn-tab-text">{item.label}</span>
                {item.path === "/student-notifications" && unreadCount > 0 && (
                  <span className="sn-tab-count">{unreadCount}</span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
