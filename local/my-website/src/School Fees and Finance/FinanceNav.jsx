import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./FinanceNav.css";

const FINANCE_NAV_ITEMS = [
  { path: "/fee-categories", label: "Categories", icon: "🏷️" },
  { path: "/fee-structure", label: "Fee Structure", icon: "📐" },
  { path: "/student-invoices", label: "Invoices", icon: "🧾" },
  { path: "/record-payment", label: "Record Payment", icon: "💵" },
  { path: "/payment-history", label: "History", icon: "📜" },
  { path: "/fee-statements", label: "Statements", icon: "📑" },
  { path: "/outstanding-fees", label: "Unpaid / Debts", icon: "⚠️" },
  { path: "/discounts-and-scholarships", label: "Scholarships", icon: "🎁" },
  { path: "/receipts", label: "Receipts", icon: "🧾" },
  { path: "/refunds-and-reversals", label: "Refunds", icon: "🔄" },
  { path: "/online-payment", label: "Online Pay", icon: "📲" },
  { path: "/payment-reconciliation", label: "Reconciliation", icon: "⚖️" },
  { path: "/financial-reports", label: "Finance Reports", icon: "📊" },
];

export default function FinanceNav({ title, subtitle, badge }) {
  const location = useLocation();

  return (
    <div className="fin-nav-wrapper">
      {/* Top Banner Bar */}
      <div className="fin-nav-header">
        <div className="fin-nav-header-left">
          <div className="fin-nav-logo">💳</div>
          <div>
            <div className="fin-nav-title-row">
              <h1 className="fin-nav-title">{title || "School Fees & Bursar Finance"}</h1>
              {badge && <span className="fin-nav-badge">{badge}</span>}
            </div>
            <p className="fin-nav-subtitle">
              {subtitle ||
                "Module 10: Complete institutional fee schedules, tuition billing, MoMo/Bank reconciliation, scholarships, and bursar ledger"}
            </p>
          </div>
        </div>

        <div className="fin-nav-actions">
          <Link to="/school-dashboard" className="fin-nav-btn fin-nav-btn-highlight" title="School Administration Dashboard">
            🏫 School Admin
          </Link>
          <Link to="/student-portal" className="fin-nav-btn" title="Student & Guardian Portal">
            🎓 Student Portal
          </Link>
          <Link to="/online-payment" className="fin-nav-btn" title="Make Electronic Payment">
            📲 Online MoMo
          </Link>
          <Link to="/" className="fin-nav-btn" title="Return to Main Hub">
            ← Hub
          </Link>
        </div>
      </div>

      {/* 13 Horizontal Navigation Tabs */}
      <nav className="fin-nav-scroller">
        {FINANCE_NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`fin-nav-tab ${isActive ? "active" : ""}`}
            >
              <span className="fin-tab-icon">{item.icon}</span>
              <span className="fin-tab-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
