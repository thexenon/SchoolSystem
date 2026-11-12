import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./ExamNav.css";

const EXAM_NAV_ITEMS = [
  { path: "/assessment-setup", label: "Assessment Setup", icon: "📝" },
  { path: "/examination-management", label: "Exam Schedules", icon: "🗓️" },
  { path: "/marks-entry", label: "Marks Entry", icon: "✍️" },
  { path: "/marks-import", label: "Marks Import", icon: "📥" },
  { path: "/results-review", label: "Results Review", icon: "🔍" },
  { path: "/results-approval", label: "Results Approval", icon: "✅" },
  { path: "/grading-system", label: "Grading Scale", icon: "📐" },
  { path: "/student-results", label: "Student Results", icon: "🎓" },
  { path: "/report-cards", label: "Report Cards", icon: "📄" },
  { path: "/class-performance", label: "Performance", icon: "📊" },
  { path: "/results-publication", label: "Publication", icon: "📢" },
  { path: "/results-correction", label: "Corrections", icon: "🔄" },
];

export default function ExamNav({ title, subtitle, badge }) {
  const location = useLocation();

  return (
    <div className="exam-nav-wrapper">
      {/* Top Banner Bar */}
      <div className="exam-nav-header">
        <div className="exam-nav-header-left">
          <div className="exam-nav-logo">🏆</div>
          <div>
            <div className="exam-nav-title-row">
              <h1 className="exam-nav-title">{title || "Examinations & Results Module"}</h1>
              {badge && <span className="exam-nav-badge">{badge}</span>}
            </div>
            <p className="exam-nav-subtitle">
              {subtitle || "Module 8: Complete assessment setup, gradebook marks entry, WAEC grading rules, and printable report cards"}
            </p>
          </div>
        </div>

        <div className="exam-nav-actions">
          <Link to="/teacher-portal" className="exam-nav-btn exam-nav-btn-highlight" title="Enter Teacher Workstation">
            👨‍🏫 Teacher Portal
          </Link>
          <Link to="/school-dashboard" className="exam-nav-btn" title="Return to School Administration">
            🏫 Admin
          </Link>
          <Link to="/" className="exam-nav-btn" title="Return to Main Hub">
            ← Hub
          </Link>
        </div>
      </div>

      {/* Screen Tabs Horizontal Scroller */}
      <nav className="exam-nav-scroller">
        {EXAM_NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`exam-nav-tab ${isActive ? "active" : ""}`}
            >
              <span className="exam-tab-icon">{item.icon}</span>
              <span className="exam-tab-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
