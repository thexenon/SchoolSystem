import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  getActiveParent,
  LINKED_CHILDREN,
  getActiveChildId,
  saveActiveChildId,
} from "./parentData";
import DailyQuotePopupModal from "../components/DailyQuotePopupModal";
import "./ParentNav.css";

export default function ParentNav({ title, subtitle, badge }) {
  const location = useLocation();
  const parent = getActiveParent();
  const [activeChildId, setActiveChildIdState] = useState(getActiveChildId());
  const [quoteOpen, setQuoteOpen] = useState(false);

  const parentChildren = LINKED_CHILDREN.filter((c) =>
    parent.linkedStudentIds.includes(c.id)
  );

  const handleChildChange = (e) => {
    const newId = e.target.value;
    setActiveChildIdState(newId);
    saveActiveChildId(newId);
    window.dispatchEvent(new Event("childChanged"));
  };

  const navLinks = [
    { name: "Dashboard", path: "/parent-dashboard", icon: "🏠" },
    { name: "My Children", path: "/my-children", icon: "👨‍👩‍👧" },
    { name: "Child Profile", path: "/child-profile", icon: "👤" },
    { name: "Attendance", path: "/child-attendance", icon: "📋" },
    { name: "Academic Results", path: "/child-results", icon: "🏆" },
    { name: "Fee Statements", path: "/parent-fee-statements", icon: "📑" },
    { name: "Pay Fees (MoMo)", path: "/parent-fee-payment", icon: "💳" },
    { name: "Announcements", path: "/school-announcements", icon: "📢" },
    { name: "Calendar", path: "/parent-calendar", icon: "🗓️" },
    { name: "Contact School", path: "/contact-school", icon: "✉️" },
  ];

  return (
    <div className="pn-nav-wrapper">
      {/* Daily Motivational Quote Popup Modal */}
      <DailyQuotePopupModal
        forceOpen={quoteOpen}
        onClose={() => setQuoteOpen(false)}
      />

      {/* Top Header */}
      <div className="pn-top-bar">
        <div className="pn-brand-group">
          <div className="pn-logo-badge">👨‍👩‍👧</div>
          <div>
            <div className="pn-badge-strip">
              <span className="pn-module-badge">{badge || "Module 11 • Parent & Guardian Portal"}</span>
              <span className="pn-school-badge">ST. MICHAEL'S INTERNATIONAL ACADEMY</span>
            </div>
            <h1 className="pn-page-title">{title || "Parent & Guardian Workstation"}</h1>
            {subtitle && <p className="pn-page-sub">{subtitle}</p>}
          </div>
        </div>

        <div className="pn-right-controls">
          {/* Active Child Switcher */}
          <div className="pn-child-selector-box">
            <label>Active Child:</label>
            <select
              value={activeChildId}
              onChange={handleChildChange}
              className="pn-child-select"
            >
              {parentChildren.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName} ({c.classCohort})
                </option>
              ))}
            </select>
          </div>

          {/* User Profile Badge */}
          <div className="pn-user-pill">
            <span className="pn-user-avatar">PR</span>
            <div className="pn-user-info">
              <strong>{parent.fullName}</strong>
              <small>{parent.relationship}</small>
            </div>
          </div>

          <button
            type="button"
            className="pn-quote-btn"
            onClick={() => setQuoteOpen(true)}
            title="Read Daily Inspiration"
          >
            ✨ Daily Quote
          </button>

          <Link to="/" className="pn-hub-btn">
            ← Hub
          </Link>
        </div>
      </div>

      {/* 10-Screen Navigation Tab Strip */}
      <nav className="pn-tabs-strip">
        <div className="pn-tabs-scroll">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`pn-tab-link ${isActive ? "active" : ""}`}
              >
                <span className="pn-tab-icon">{link.icon}</span>
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
