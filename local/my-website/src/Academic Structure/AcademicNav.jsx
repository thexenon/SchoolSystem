import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./AcademicNav.css";

const ACADEMIC_ROUTES = [
  { path: "/education-levels", label: "Education Levels", icon: "🏛️" },
  { path: "/class-management", label: "Class Management", icon: "🏫" },
  { path: "/streams-and-sections", label: "Streams & Sections", icon: "🔀" },
  { path: "/subject-management", label: "Subjects", icon: "📚" },
  { path: "/department-management", label: "Departments", icon: "🏢" },
  { path: "/programme-management", label: "Programmes", icon: "🎓" },
  { path: "/course-management", label: "Courses & Modules", icon: "📑" },
  { path: "/class-allocation", label: "Class Allocation", icon: "👥" },
  { path: "/academic-structure-overview", label: "Structure Overview", icon: "🗺️" },
];

export default function AcademicNav({ activePath, title, subtitle }) {
  const location = useLocation();
  const currentPath = activePath || location.pathname;

  return (
    <header className="acad-nav-container">
      {/* Top Brand Banner */}
      <div className="acad-nav-top">
        <div className="acad-nav-brand">
          <div className="acad-brand-badge">📐</div>
          <div>
            <div className="acad-brand-title">Academic Structure & Curriculum Hub</div>
            <div className="acad-brand-sub">
              {title ? `${title} — ${subtitle || "Curriculum & Faculty Configuration"}` : "Module 6: Academic Organization & Classes"}
            </div>
          </div>
        </div>

        <div className="acad-quick-actions">
          <Link to="/attendance-register" className="acad-action-btn acad-action-alt">
            <span>📋</span> Attendance Portal
          </Link>
          <Link to="/school-dashboard" className="acad-action-btn">
            <span>🏫</span> School Admin
          </Link>
          <Link to="/home" className="acad-action-btn acad-action-hub">
            <span>←</span> Hub
          </Link>
        </div>
      </div>

      {/* 9-Screen Sub-Navigation Bar */}
      <nav className="acad-subnav-bar">
        {ACADEMIC_ROUTES.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`acad-nav-link ${isActive ? "active" : ""}`}
            >
              <span className="acad-link-icon">{item.icon}</span>
              <span className="acad-link-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
