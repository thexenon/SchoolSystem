import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { getUserRoleMode, saveUserRoleMode } from "./assignmentData";
import DailyQuotePopupModal from "../components/DailyQuotePopupModal";
import "./AssignmentNav.css";

const SCREENS = [
  { path: "/assignment-list", label: "Assignment List", icon: "📋" },
  { path: "/create-assignment", label: "Create Assignment", icon: "➕" },
  { path: "/assignment-details", label: "Assignment Details", icon: "🔍" },
  { path: "/student-submissions", label: "Student Submissions", icon: "📤" },
  { path: "/submission-review", label: "Submission Review", icon: "📝" },
  { path: "/grading-feedback", label: "Grading & Feedback", icon: "⭐" },
  { path: "/learning-resources", label: "Learning Resources", icon: "📚" },
];

export default function AssignmentNav({ title, subtitle, badge }) {
  const location = useLocation();
  const [roleMode, setRoleMode] = useState(getUserRoleMode());
  const [quoteOpen, setQuoteOpen] = useState(false);

  useEffect(() => {
    const handleRoleChanged = (e) => {
      if (e.detail) setRoleMode(e.detail);
      else setRoleMode(getUserRoleMode());
    };
    window.addEventListener("assignmentRoleChanged", handleRoleChanged);
    return () => window.removeEventListener("assignmentRoleChanged", handleRoleChanged);
  }, []);

  const handleRoleToggle = (newRole) => {
    setRoleMode(newRole);
    saveUserRoleMode(newRole);
  };

  return (
    <div className="an-wrapper">
      <DailyQuotePopupModal
        forceOpen={quoteOpen}
        onClose={() => setQuoteOpen(false)}
      />

      {/* Top Banner Navigation Bar */}
      <header className="an-top-bar">
        <div className="an-brand-box">
          <div className="an-brand-icon">📁</div>
          <div className="an-brand-info">
            <div className="an-brand-title">
              Assignments & Learning Materials <span className="an-badge-pill">{badge || "Module 13"}</span>
            </div>
            <div className="an-brand-sub">
              {title || "Coursework Distribution, Digital Submissions & Grading"}
            </div>
          </div>
        </div>

        <div className="an-top-actions">
          {/* Role Switcher Pill */}
          <div className="an-role-switcher">
            <span className="an-role-label">Active Perspective:</span>
            <button
              type="button"
              className={`an-role-btn ${roleMode === "teacher" ? "active" : ""}`}
              onClick={() => handleRoleToggle("teacher")}
            >
              👨‍🏫 Teacher
            </button>
            <button
              type="button"
              className={`an-role-btn ${roleMode === "student" ? "active" : ""}`}
              onClick={() => handleRoleToggle("student")}
            >
              🎓 Student
            </button>
          </div>

          <button
            type="button"
            className="an-action-btn an-quote-btn"
            onClick={() => setQuoteOpen(true)}
            title="Daily Motivation Quote"
          >
            ✨ Daily Quote
          </button>

          <Link to="/" className="an-action-btn" title="Return to School Hub">
            ← Hub
          </Link>
        </div>
      </header>

      {/* Context Subtitle */}
      {subtitle && (
        <div className="an-subheader">
          <p className="an-sub-description">{subtitle}</p>
        </div>
      )}

      {/* Horizontal Nav Bar with 7 Screens */}
      <nav className="an-nav-scroll">
        <div className="an-nav-links">
          {SCREENS.map((screen) => {
            const isActive = location.pathname === screen.path;
            return (
              <Link
                key={screen.path}
                to={screen.path}
                className={`an-nav-tab ${isActive ? "active" : ""}`}
              >
                <span className="an-tab-icon">{screen.icon}</span>
                <span className="an-tab-text">{screen.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
