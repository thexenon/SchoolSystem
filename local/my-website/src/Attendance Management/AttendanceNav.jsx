import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./AttendanceNav.css";

const ATTENDANCE_ROUTES = [
  { path: "/take-attendance", label: "Take Attendance", icon: "✍️" },
  { path: "/attendance-register", label: "Attendance Register", icon: "📋" },
  { path: "/student-attendance-history", label: "Student History", icon: "👤" },
  { path: "/attendance-correction", label: "Corrections & Audit", icon: "🛠️" },
  { path: "/attendance-reports", label: "Attendance Reports", icon: "📊" },
  { path: "/absence-alerts", label: "Absence Alerts", icon: "🚨" },
  { path: "/staff-attendance-register", label: "Staff Register", icon: "👨‍🏫" },
];

export default function AttendanceNav({ activePath, title, subtitle }) {
  const location = useLocation();
  const currentPath = activePath || location.pathname;

  return (
    <header className="att-nav-container">
      {/* Top Banner */}
      <div className="att-nav-top">
        <div className="att-nav-brand">
          <div className="att-brand-badge">📋</div>
          <div>
            <div className="att-brand-title">Attendance Management System</div>
            <div className="att-brand-sub">
              {title ? `${title} — ${subtitle || "Real-Time Campus Roll Call & Registers"}` : "Module 7: Student & Staff Attendance Tracking"}
            </div>
          </div>
        </div>

        <div className="att-quick-actions">
          <Link to="/education-levels" className="att-action-btn att-action-alt">
            <span>📐</span> Academic Structure
          </Link>
          <Link to="/teacher-portal" className="att-action-btn">
            <span>👨‍🏫</span> Faculty Portal
          </Link>
          <Link to="/school-dashboard" className="att-action-btn">
            <span>🏫</span> School Admin
          </Link>
          <Link to="/home" className="att-action-btn att-action-hub">
            <span>←</span> Hub
          </Link>
        </div>
      </div>

      {/* 7-Screen Sub-Navigation Bar */}
      <nav className="att-subnav-bar">
        {ATTENDANCE_ROUTES.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`att-nav-link ${isActive ? "active" : ""}`}
            >
              <span className="att-link-icon">{item.icon}</span>
              <span className="att-link-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
