import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SubscriptionManagement.css";

const INITIAL_SUBSCRIPTIONS = [
  {
    id: "SUB-101",
    schoolId: "SCH-001",
    schoolName: "St. Mary International Academy",
    plan: "Enterprise",
    amount: "$4,000 / mo",
    studentsUsed: 3400,
    studentLimit: 4000,
    storageUsedGB: 3800,
    storageLimitGB: 10000,
    nextBillingDate: "Jan 14, 2027",
    status: "Paid",
  },
  {
    id: "SUB-102",
    schoolId: "SCH-002",
    schoolName: "Oakridge High School",
    plan: "Enterprise",
    amount: "$3,290 / mo",
    studentsUsed: 2850,
    studentLimit: 3000,
    storageUsedGB: 2400,
    storageLimitGB: 10000,
    nextBillingDate: "Mar 22, 2027",
    status: "Paid",
  },
  {
    id: "SUB-103",
    schoolId: "SCH-003",
    schoolName: "Greenwood Preparatory",
    plan: "Professional",
    amount: "$1,850 / mo",
    studentsUsed: 1420,
    studentLimit: 1500,
    storageUsedGB: 1100,
    storageLimitGB: 5000,
    nextBillingDate: "Nov 05, 2026",
    status: "Paid",
  },
  {
    id: "SUB-104",
    schoolId: "SCH-004",
    schoolName: "Horizon Collegiate Institute",
    plan: "Professional",
    amount: "$1,499 / mo",
    studentsUsed: 980,
    studentLimit: 1200,
    storageUsedGB: 850,
    storageLimitGB: 5000,
    nextBillingDate: "Oct 19, 2026",
    status: "Overdue",
  },
  {
    id: "SUB-105",
    schoolId: "SCH-005",
    schoolName: "Beacon Hill Grammar School",
    plan: "Starter",
    amount: "$499 / mo",
    studentsUsed: 420,
    studentLimit: 500,
    storageUsedGB: 320,
    storageLimitGB: 2000,
    nextBillingDate: "Nov 02, 2026",
    status: "Due Soon",
  },
];

function SubscriptionManagement({ onNavigate, onLogout }) {
  const [subscriptions, setSubscriptions] = useState(INITIAL_SUBSCRIPTIONS);

  const handleLogout = () => {
    localStorage.removeItem("platform_admin_auth");
    sessionStorage.removeItem("platform_admin_auth");
    if (onLogout) {
      onLogout();
    } else if (onNavigate) {
      onNavigate("platform-login");
    }
  };
  const [selectedSub, setSelectedSub] = useState(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [newStudentLimit, setNewStudentLimit] = useState(4000);
  const [newPlanTier, setNewPlanTier] = useState("Enterprise");
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const navigateTo = (screen) => {
    if (onNavigate) onNavigate(screen);
  };

  const handleOpenLimitModal = (sub) => {
    setSelectedSub(sub);
    setNewStudentLimit(sub.studentLimit);
    setNewPlanTier(sub.plan);
    setShowLimitModal(true);
  };

  const handleSaveLimits = (e) => {
    e.preventDefault();
    if (!selectedSub) return;

    setSubscriptions((prev) =>
      prev.map((s) => {
        if (s.id === selectedSub.id) {
          return {
            ...s,
            studentLimit: Number(newStudentLimit),
            plan: newPlanTier,
          };
        }
        return s;
      })
    );

    showToast(`✓ Updated plan & limits for "${selectedSub.schoolName}" to ${newPlanTier} (${newStudentLimit} seats)!`);
    setShowLimitModal(false);
  };

  return (
    <div className="sub-wrapper">
      {/* Platform Navigation */}
      <nav className="platform-nav-bar">
        <div className="platform-brand">
          <div className="platform-logo-badge">SMS</div>
          <div>
            <div className="platform-brand-text">Multi-School Platform Administration</div>
            <div className="platform-brand-sub">Tenant Management & Global Operations</div>
          </div>
        </div>

        <div className="platform-menu-links">
          <button
            type="button"
            className="platform-menu-item"
            onClick={() => navigateTo("platform-dashboard")}
          >
            📊 Dashboard
          </button>
          <button
            type="button"
            className="platform-menu-item"
            onClick={() => navigateTo("school-management")}
          >
            🏫 School Management
          </button>
          <button
            type="button"
            className="platform-menu-item"
            onClick={() => navigateTo("school-details")}
          >
            🔍 School Details
          </button>
          <button
            type="button"
            className="platform-menu-item active"
            onClick={() => navigateTo("subscription-management")}
          >
            💎 Subscriptions
          </button>
          <button
            type="button"
            className="platform-menu-item"
            onClick={() => navigateTo("platform-user-management")}
          >
            👥 Platform Staff
          </button>
          <button
            type="button"
            className="platform-menu-item"
            onClick={() => navigateTo("platform-audit-logs")}
          >
            📜 Audit Logs
          </button>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Link to="/" className="platform-back-link">
            ← School Hub
          </Link>
          <button
            type="button"
            className="platform-logout-btn"
            onClick={handleLogout}
            title="Log out of Multi-School Platform Administration"
          >
            🔒 Logout
          </button>
        </div>
      </nav>

      {/* Header */}
      <div className="sub-header">
        <div>
          <h1 className="sub-title">Subscription & Billing Management</h1>
          <p className="sub-subtitle">
            Configure multi-tenant licensing tiers, billing cycles, and school seat quotas
          </p>
        </div>
      </div>

      {toastMessage && (
        <div
          style={{
            background: "rgba(16, 185, 129, 0.15)",
            border: "1px solid rgba(16, 185, 129, 0.4)",
            color: "#10b981",
            padding: "12px 18px",
            borderRadius: "10px",
            marginBottom: "20px",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Revenue KPI Strip */}
      <div className="sub-rev-grid">
        <div className="sub-rev-card">
          <div className="sub-rev-label">Monthly Recurring Revenue (MRR)</div>
          <div className="sub-rev-val">$184,200</div>
          <div className="sub-rev-trend">↑ +14.6% vs last quarter</div>
        </div>

        <div className="sub-rev-card">
          <div className="sub-rev-label">Annual Run Rate (ARR)</div>
          <div className="sub-rev-val">$2,210,400</div>
          <div className="sub-rev-trend">↑ 48 Active School Contracts</div>
        </div>

        <div className="sub-rev-card">
          <div className="sub-rev-label">Avg. Revenue Per School (ARPS)</div>
          <div className="sub-rev-val">$3,837 / mo</div>
          <div style={{ fontSize: "12px", color: "#94a3b8" }}>Enterprise-weighted</div>
        </div>

        <div className="sub-rev-card">
          <div className="sub-rev-label">Pending / Overdue Invoices</div>
          <div className="sub-rev-val" style={{ color: "#fbbf24" }}>$3,348</div>
          <div style={{ fontSize: "12px", color: "#ef4444" }}>1 Overdue • 1 Due Soon</div>
        </div>
      </div>

      {/* Available Platform Subscription Plans */}
      <div style={{ marginBottom: "16px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff", margin: "0 0 16px 0" }}>
          Platform Multi-School Tiers
        </h2>

        <div className="sub-plans-grid">
          {/* Starter Plan */}
          <div className="sub-plan-card">
            <h3 className="sub-plan-name">Starter Tier</h3>
            <div className="sub-plan-price">$499 <span className="sub-plan-cycle">/ month</span></div>
            <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>
              Ideal for single-campus prep and elementary schools.
            </p>
            <ul className="sub-plan-features">
              <li><span>✓</span> Up to 500 Enrolled Students</li>
              <li><span>✓</span> 1 Campus Location</li>
              <li><span>✓</span> 2 TB Dedicated Cloud Storage</li>
              <li><span>✓</span> Standard Email Support</li>
            </ul>
          </div>

          {/* Professional Plan */}
          <div className="sub-plan-card">
            <h3 className="sub-plan-name">Professional Tier</h3>
            <div className="sub-plan-price">$1,499 <span className="sub-plan-cycle">/ month</span></div>
            <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>
              For expanding middle and high schools with multiple programs.
            </p>
            <ul className="sub-plan-features">
              <li><span>✓</span> Up to 2,000 Enrolled Students</li>
              <li><span>✓</span> Up to 3 Branch Campuses</li>
              <li><span>✓</span> 5 TB Dedicated Cloud Storage</li>
              <li><span>✓</span> Automated Gradebook & Attendance</li>
              <li><span>✓</span> 24/7 Priority Support Desk</li>
            </ul>
          </div>

          {/* Enterprise Plan */}
          <div className="sub-plan-card featured">
            <span className="sub-plan-badge">Most Popular</span>
            <h3 className="sub-plan-name">Enterprise Edition</h3>
            <div className="sub-plan-price">$3,499+ <span className="sub-plan-cycle">/ month</span></div>
            <p style={{ fontSize: "12px", color: "#c7d2fe", margin: 0 }}>
              Full institutional multi-campus network with custom white-labeling.
            </p>
            <ul className="sub-plan-features">
              <li><span>✓</span> Unlimited Student & Faculty Capacity</li>
              <li><span>✓</span> Unlimited Multi-Campus Sites</li>
              <li><span>✓</span> 10+ TB Storage & Automated Daily Backups</li>
              <li><span>✓</span> Custom Domain & Branded Mobile Apps</li>
              <li><span>✓</span> Dedicated Account Manager & 99.99% SLA</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Subscriptions & Quotas Table */}
      <div style={{ marginBottom: "16px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff", margin: "0 0 16px 0" }}>
          School Licenses & Limit Allocation
        </h2>

        <div className="sub-table-container">
          <table className="sub-table">
            <thead>
              <tr>
                <th>School & Subscription ID</th>
                <th>Current Plan</th>
                <th>Monthly Rate</th>
                <th>Student Seat Quota</th>
                <th>Storage Usage</th>
                <th>Next Invoice Date</th>
                <th>Billing Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((sub) => {
                const percent = Math.min(100, Math.round((sub.studentsUsed / sub.studentLimit) * 100));
                const barColor = percent > 90 ? "#ef4444" : percent > 75 ? "#fbbf24" : "#10b981";

                return (
                  <tr key={sub.id}>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: "14px", color: "#ffffff" }}>
                        {sub.schoolName}
                      </div>
                      <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                        ID: {sub.id} • Tenant: {sub.schoolId}
                      </div>
                    </td>

                    <td>
                      <span
                        style={{
                          background: "rgba(99, 102, 241, 0.15)",
                          color: "#818cf8",
                          border: "1px solid rgba(99, 102, 241, 0.3)",
                          padding: "4px 8px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: 700,
                        }}
                      >
                        {sub.plan}
                      </span>
                    </td>

                    <td><strong>{sub.amount}</strong></td>

                    <td>
                      <div>
                        {sub.studentsUsed.toLocaleString()} / {sub.studentLimit.toLocaleString()} Seats ({percent}%)
                      </div>
                      <div className="sub-limit-bar">
                        <div
                          className="sub-limit-fill"
                          style={{ width: `${percent}%`, background: barColor }}
                        />
                      </div>
                    </td>

                    <td>
                      {(sub.storageUsedGB / 1000).toFixed(1)} TB / {(sub.storageLimitGB / 1000).toFixed(0)} TB
                    </td>

                    <td>{sub.nextBillingDate}</td>

                    <td>
                      <span
                        className={
                          sub.status === "Paid"
                            ? "sub-badge-paid"
                            : "sub-badge-overdue"
                        }
                      >
                        {sub.status}
                      </span>
                    </td>

                    <td style={{ textAlign: "right" }}>
                      <button
                        type="button"
                        className="sm-btn sm-btn-secondary sm-btn-sm"
                        onClick={() => handleOpenLimitModal(sub)}
                      >
                        ⚙️ Adjust Limits
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Subscription Limits Modal */}
      {showLimitModal && selectedSub && (
        <div className="sm-modal-backdrop">
          <div className="sm-modal-card">
            <div className="sm-modal-header">
              <h2 className="sm-modal-title">Adjust School Subscription & Limits</h2>
              <button
                type="button"
                onClick={() => setShowLimitModal(false)}
                style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "20px", cursor: "pointer" }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveLimits}>
              <div style={{ marginBottom: "16px", padding: "12px", background: "rgba(255,255,255,0.03)", borderRadius: "10px" }}>
                <div style={{ fontWeight: 700, fontSize: "14px" }}>{selectedSub.schoolName}</div>
                <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>
                  Current Plan: {selectedSub.plan} • Sub ID: {selectedSub.id}
                </div>
              </div>

              <div className="sm-form-group">
                <label className="sm-form-label">Subscription Tier</label>
                <select
                  className="sm-form-input"
                  value={newPlanTier}
                  onChange={(e) => setNewPlanTier(e.target.value)}
                >
                  <option value="Enterprise">Enterprise ($3,499+/mo)</option>
                  <option value="Professional">Professional ($1,499/mo)</option>
                  <option value="Starter">Starter ($499/mo)</option>
                </select>
              </div>

              <div className="sm-form-group">
                <label className="sm-form-label">Licensed Student Seat Capacity</label>
                <input
                  type="number"
                  min="100"
                  step="100"
                  className="sm-form-input"
                  value={newStudentLimit}
                  onChange={(e) => setNewStudentLimit(e.target.value)}
                />
                <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                  Current utilized seats: {selectedSub.studentsUsed.toLocaleString()}
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "24px" }}>
                <button
                  type="button"
                  className="sm-btn sm-btn-secondary"
                  onClick={() => setShowLimitModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="sm-btn sm-btn-primary">
                  ✓ Save Quotas & Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubscriptionManagement;
