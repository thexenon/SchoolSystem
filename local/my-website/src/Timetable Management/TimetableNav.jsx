import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./TimetableNav.css";

const TIMETABLE_NAV_ITEMS = [
  { path: "/period-management", label: "Periods & Hours", icon: "⏰" },
  { path: "/timetable-builder", label: "Timetable Builder", icon: "🛠️" },
  { path: "/class-timetable", label: "Class Timetable", icon: "📚" },
  { path: "/teacher-timetable", label: "Teacher Schedules", icon: "👨‍🏫" },
  { path: "/room-management", label: "Room Allocations", icon: "🏢" },
  { path: "/timetable-conflict-checker", label: "Conflict Checker", icon: "⚡" },
  { path: "/substitute-teacher-management", label: "Substitute Teachers", icon: "🔄" },
];

export default function TimetableNav({ title, subtitle, badge }) {
  const location = useLocation();

  return (
    <div className="tt-nav-wrapper">
      {/* Top Banner Bar */}
      <div className="tt-nav-header">
        <div className="tt-nav-header-left">
          <div className="tt-nav-logo">🗓️</div>
          <div>
            <div className="tt-nav-title-row">
              <h1 className="tt-nav-title">{title || "Timetable & Schedule Management"}</h1>
              {badge && <span className="tt-nav-badge">{badge}</span>}
            </div>
            <p className="tt-nav-subtitle">
              {subtitle ||
                "Module 9: Master class scheduling, lesson period definitions, room capacity tracking, and automated conflict detection"}
            </p>
          </div>
        </div>

        <div className="tt-nav-actions">
          <Link to="/teacher-portal" className="tt-nav-btn tt-nav-btn-highlight" title="Teacher Faculty Portal">
            👨‍🏫 Teacher Portal
          </Link>
          <Link to="/school-dashboard" className="tt-nav-btn" title="School Administration Dashboard">
            🏫 Admin
          </Link>
          <Link to="/assessment-setup" className="tt-nav-btn" title="Examinations Module">
            🏆 Exams
          </Link>
          <Link to="/" className="tt-nav-btn" title="Return to Main Hub">
            ← Hub
          </Link>
        </div>
      </div>

      {/* 7 Horizontal Navigation Tabs */}
      <nav className="tt-nav-scroller">
        {TIMETABLE_NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`tt-nav-tab ${isActive ? "active" : ""}`}
            >
              <span className="tt-tab-icon">{item.icon}</span>
              <span className="tt-tab-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
