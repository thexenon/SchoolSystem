import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import DailyQuotePopupModal from "../components/DailyQuotePopupModal";
import "./AdmissionNav.css";

const SCREENS = [
  { path: "/admissions-dashboard", label: "Admissions Dashboard", icon: "📊" },
  { path: "/application-form", label: "Application Form", icon: "📝" },
  { path: "/applicant-list", label: "Applicant List", icon: "📋" },
  { path: "/applicant-profile", label: "Applicant Profile", icon: "👤" },
  { path: "/application-review", label: "Application Review", icon: "🔍" },
  { path: "/admission-decisions", label: "Admission Decisions", icon: "⚖️" },
  { path: "/admission-letters", label: "Admission Letters", icon: "✉️" },
  { path: "/enrollment-confirmation", label: "Enrollment Confirmation", icon: "🎓" },
  { path: "/admissions-reports", label: "Admissions Reports", icon: "📈" },
];

export default function AdmissionNav({ title, subtitle, badge }) {
  const location = useLocation();
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <div className="adm-nav-wrapper">
      <DailyQuotePopupModal
        forceOpen={quoteOpen}
        onClose={() => setQuoteOpen(false)}
      />

      {/* Top Banner Navigation Bar */}
      <header className="adm-top-bar">
        <div className="adm-brand-box">
          <div className="adm-brand-icon">🎓</div>
          <div className="adm-brand-info">
            <div className="adm-brand-title">
              Admissions & Student Enrollment <span className="adm-badge-pill">{badge || "Enrollment Hub"}</span>
            </div>
            <div className="adm-brand-sub">
              {title || "Prospective Student Applications, Review Pipeline & Enrollment Directorate"}
            </div>
          </div>
        </div>

        <div className="adm-top-actions">
          <button
            type="button"
            className="adm-action-btn adm-quote-btn"
            onClick={() => setQuoteOpen(true)}
            title="Daily Motivation Quote"
          >
            ✨ Daily Quote
          </button>

          <Link to="/" className="adm-action-btn" title="Return to School Hub">
            ← Hub
          </Link>
        </div>
      </header>

      {/* Subtitle context */}
      {subtitle && (
        <div className="adm-subheader">
          <p className="adm-sub-description">{subtitle}</p>
        </div>
      )}

      {/* Horizontal Nav Bar with 9 Screens */}
      <nav className="adm-nav-scroll">
        <div className="adm-nav-links">
          {SCREENS.map((screen) => {
            const isActive = location.pathname === screen.path;
            return (
              <Link
                key={screen.path}
                to={screen.path}
                className={`adm-nav-tab ${isActive ? "active" : ""}`}
              >
                <span className="adm-tab-icon">{screen.icon}</span>
                <span className="adm-tab-text">{screen.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
