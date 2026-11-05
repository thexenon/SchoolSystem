import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./PlatformDashboard.css";
import {
  getSchoolAdmins,
  switchActiveSchool,
} from "./schoolAdminAuth";

const ACTIVITY_LOG = [
  {
    id: 1,
    type: "school",
    icon: "🏫",
    message: "St. Mary International Academy added a new North Science Campus.",
    time: "12 minutes ago",
    badge: "Campus Added",
    badgeColor: "rgba(16, 185, 129, 0.2)",
    textColor: "#10b981",
  },
  {
    id: 2,
    type: "subscription",
    icon: "💎",
    message: "Oakridge High School upgraded from Professional to Enterprise Plan (3,000 Seats).",
    time: "48 minutes ago",
    badge: "Plan Upgrade",
    badgeColor: "rgba(99, 102, 241, 0.2)",
    textColor: "#818cf8",
  },
  {
    id: 3,
    type: "user",
    icon: "👥",
    message: "Greenwood Prep batch-provisioned 450 new Grade 9 student accounts.",
    time: "2 hours ago",
    badge: "User Provisioning",
    badgeColor: "rgba(56, 189, 248, 0.2)",
    textColor: "#38bdf8",
  },
  {
    id: 4,
    type: "alert",
    icon: "⚠️",
    message: "Horizon Collegiate subscription billing renewal failed (Card Expired).",
    time: "4 hours ago",
    badge: "Billing Warning",
    badgeColor: "rgba(245, 158, 11, 0.2)",
    textColor: "#fbbf24",
  },
  {
    id: 5,
    type: "staff",
    icon: "🛡️",
    message: "Platform Engineer Marcus Chen deployed Security Patch v2.4.1 across all tenant databases.",
    time: "6 hours ago",
    badge: "System Maintenance",
    badgeColor: "rgba(168, 85, 247, 0.2)",
    textColor: "#c084fc",
  },
];

function PlatformDashboard({ onNavigate, onLogout }) {
  const [timeframe, setTimeframe] = useState("30d");
  const [selectedAdminModal, setSelectedAdminModal] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const schoolAdmins = getSchoolAdmins();

  const navigateTo = (screen) => {
    if (onNavigate) {
      onNavigate(screen);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("platform_admin_auth");
    sessionStorage.removeItem("platform_admin_auth");
    if (onLogout) {
      onLogout();
    } else if (onNavigate) {
      onNavigate("platform-login");
    }
  };

  // Direct access handlers for Multi-School Admin
  const handleAccessSchoolDashboard = (schoolId) => {
    switchActiveSchool(schoolId);
    navigateTo("school-dashboard");
  };

  const handleAccessSchoolStudents = (schoolId) => {
    switchActiveSchool(schoolId);
    navigateTo("student-list");
  };

  return (
    <div className="pd-wrapper">
      {/* Platform Top Navigation Bar */}
      <nav className="platform-nav-bar">
        <div className="platform-brand">
          <div className="platform-logo-badge">SMS</div>
          <div>
            <div className="platform-brand-text">Multi-School Platform Administration</div>
            <div className="platform-brand-sub">Tenant Management & Global Operations (Overall Boss)</div>
          </div>
        </div>

        <div className="platform-menu-links">
          <button
            type="button"
            className="platform-menu-item active"
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
            className="platform-menu-item"
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
          <button
            type="button"
            className="platform-menu-item"
            style={{ background: "rgba(234, 179, 8, 0.15)", color: "#fde047", border: "1px solid rgba(234, 179, 8, 0.3)" }}
            onClick={() => handleAccessSchoolDashboard("SCH-001")}
            title="Open School Administration Dashboard directly as Platform Boss"
          >
            🏫 Enter School Dashboard →
          </button>
          <Link to="/" className="platform-back-link">
            ← Hub
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

      {/* Main Header */}
      <div className="pd-header">
        <div>
          <h1 className="pd-title">Platform Overview & Supervision</h1>
          <p className="pd-subtitle">
            Universal authority: Access each individual school's dashboard, enrolled students, and administrator credentials
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div className="pd-live-pill">
            <span className="pd-live-dot" />
            <span>Multi-Tenant Cluster: Healthy (99.98% Uptime)</span>
          </div>

          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            style={{
              background: "rgba(18, 24, 38, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#f1f5f9",
              padding: "7px 12px",
              borderRadius: "8px",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last Quarter</option>
            <option value="1y">Last Year</option>
          </select>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="pd-stats-grid">
        <div className="pd-stat-card" onClick={() => navigateTo("school-management")}>
          <div className="pd-stat-header">
            <span className="pd-stat-label">Registered Schools</span>
            <div className="pd-stat-icon" style={{ background: "rgba(99, 102, 241, 0.15)", color: "#818cf8" }}>
              🏫
            </div>
          </div>
          <div className="pd-stat-val">48</div>
          <div className="pd-stat-sub">
            <span className="pd-trend-up">↑ +4</span> new schools this month (42 Active, 4 Suspended, 2 Pending)
          </div>
        </div>

        <div className="pd-stat-card" onClick={() => navigateTo("school-management")}>
          <div className="pd-stat-header">
            <span className="pd-stat-label">Total Platform Users</span>
            <div className="pd-stat-icon" style={{ background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8" }}>
              👥
            </div>
          </div>
          <div className="pd-stat-val">128,450</div>
          <div className="pd-stat-sub">
            <span className="pd-trend-up">↑ +8.2%</span> 104k Students • 18.5k Teachers • 5.9k Staff
          </div>
        </div>

        <div className="pd-stat-card" onClick={() => navigateTo("subscription-management")}>
          <div className="pd-stat-header">
            <span className="pd-stat-label">Active Subscriptions</span>
            <div className="pd-stat-icon" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
              💎
            </div>
          </div>
          <div className="pd-stat-val">$184,200</div>
          <div className="pd-stat-sub">
            <span className="pd-trend-up">↑ +14.6%</span> Monthly Recurring Revenue (MRR)
          </div>
        </div>

        <div className="pd-stat-card" onClick={() => navigateTo("platform-user-management")}>
          <div className="pd-stat-header">
            <span className="pd-stat-label">Platform Operators</span>
            <div className="pd-stat-icon" style={{ background: "rgba(168, 85, 247, 0.15)", color: "#c084fc" }}>
              🛡️
            </div>
          </div>
          <div className="pd-stat-val">24</div>
          <div className="pd-stat-sub">
            <span>6 Super Admins • 12 Support • 6 DevOps</span>
          </div>
        </div>
      </div>

      {/* MULTI-SCHOOL DIRECT ACCESS & SUPERVISION SECTION */}
      <div className="pd-card" style={{ marginBottom: "28px" }}>
        <div className="pd-card-header">
          <div>
            <div className="pd-card-title">
              <span>🏫</span> Supervised Schools & Direct Portal Access
            </div>
            <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#94a3b8" }}>
              As the Multi-School Admin (Overall Boss), click any school below to instantly enter its dashboard, view its enrolled students, or inspect its administrator details.
            </p>
          </div>
          <button
            type="button"
            className="sm-btn sm-btn-secondary"
            onClick={() => navigateTo("school-management")}
          >
            Manage All 48 Schools →
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="sch-table">
            <thead>
              <tr>
                <th>School Code & Name</th>
                <th>Head Administrator</th>
                <th>Administrator Email</th>
                <th>Campuses & Enrolled</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Direct Boss Access</th>
              </tr>
            </thead>
            <tbody>
              {schoolAdmins.map((admin) => (
                <tr key={admin.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "8px",
                          background: "linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          fontSize: "13px",
                          color: "#ffffff",
                        }}
                      >
                        {admin.schoolCode.substring(0, 2)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: "#ffffff" }}>{admin.schoolName}</div>
                        <div style={{ fontSize: "11px", color: "#818cf8" }}>{admin.schoolId} • {admin.schoolCode}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: "#f8fafc" }}>{admin.adminName}</div>
                    <div style={{ fontSize: "11px", color: "#94a3b8" }}>{admin.adminTitle}</div>
                  </td>
                  <td>
                    <span style={{ fontSize: "13px", color: "#38bdf8" }}>{admin.email}</span>
                  </td>
                  <td>
                    <div><strong>{admin.studentCount?.toLocaleString() || "2,500"}</strong> Students</div>
                    <div style={{ fontSize: "11px", color: "#94a3b8" }}>{admin.campusesCount || 1} Campuses • {admin.facultyCount || 100} Faculty</div>
                  </td>
                  <td>
                    <span className={`sch-badge ${admin.status === "Active" ? "sch-badge-success" : "sch-badge-danger"}`}>
                      {admin.status}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: "6px" }}>
                      <button
                        type="button"
                        className="sm-btn sm-btn-primary"
                        style={{ padding: "6px 12px", fontSize: "12px", background: "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)" }}
                        onClick={() => handleAccessSchoolDashboard(admin.schoolId)}
                        title={`Open ${admin.schoolName} operational dashboard`}
                      >
                        📊 Dashboard
                      </button>
                      <button
                        type="button"
                        className="sm-btn sm-btn-secondary"
                        style={{ padding: "6px 12px", fontSize: "12px" }}
                        onClick={() => handleAccessSchoolStudents(admin.schoolId)}
                        title={`View students enrolled in ${admin.schoolName}`}
                      >
                        🎓 Students
                      </button>
                      <button
                        type="button"
                        className="sm-btn sm-btn-secondary"
                        style={{ padding: "6px 10px", fontSize: "12px" }}
                        onClick={() => setSelectedAdminModal(admin)}
                        title={`Inspect administrator profile and credentials for ${admin.schoolName}`}
                      >
                        🛡️ Admin Info
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Column Grid: Activity Log & Distribution / Quick Actions */}
      <div className="pd-two-col">
        {/* Left: Platform Activity Feed */}
        <div className="pd-card">
          <div className="pd-card-header">
            <div className="pd-card-title">
              <span>⚡</span> Real-time Platform Activity
            </div>
            <button
              type="button"
              className="sm-btn sm-btn-secondary"
              style={{ padding: "4px 10px", fontSize: "12px" }}
              onClick={() => navigateTo("platform-audit-logs")}
            >
              View Full Audit Trail →
            </button>
          </div>

          <div className="pd-activity-list">
            {ACTIVITY_LOG.map((item) => (
              <div key={item.id} className="pd-activity-item">
                <div className="pd-activity-icon">{item.icon}</div>
                <div className="pd-activity-content">
                  <div className="pd-activity-msg">{item.message}</div>
                  <div className="pd-activity-time">{item.time}</div>
                </div>
                <span
                  className="pd-activity-badge"
                  style={{ background: item.badgeColor, color: item.textColor }}
                >
                  {item.badge}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Plan Distribution & Quick Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Subscription Tier Distribution */}
          <div className="pd-card">
            <div className="pd-card-header">
              <div className="pd-card-title">
                <span>📊</span> School Subscriptions
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
                  <span>Enterprise Tier (24 Schools)</span>
                  <span style={{ fontWeight: 700, color: "#818cf8" }}>50%</span>
                </div>
                <div style={{ width: "100%", height: "8px", background: "rgba(255,255,255,0.08)", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ width: "50%", height: "100%", background: "#6366f1", borderRadius: "4px" }} />
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
                  <span>Professional Tier (16 Schools)</span>
                  <span style={{ fontWeight: 700, color: "#38bdf8" }}>33%</span>
                </div>
                <div style={{ width: "100%", height: "8px", background: "rgba(255,255,255,0.08)", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ width: "33%", height: "100%", background: "#38bdf8", borderRadius: "4px" }} />
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
                  <span>Starter / Trial Tier (8 Schools)</span>
                  <span style={{ fontWeight: 700, color: "#10b981" }}>17%</span>
                </div>
                <div style={{ width: "100%", height: "8px", background: "rgba(255,255,255,0.08)", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ width: "17%", height: "100%", background: "#10b981", borderRadius: "4px" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Operations Actions */}
          <div className="pd-card">
            <div className="pd-card-header">
              <div className="pd-card-title">
                <span>🚀</span> Quick Operations
              </div>
            </div>

            <div className="pd-quick-actions">
              <button
                type="button"
                className="pd-action-btn"
                onClick={() => navigateTo("school-management")}
              >
                <span>➕ Register & Onboard New School</span>
                <span>→</span>
              </button>
              <button
                type="button"
                className="pd-action-btn"
                onClick={() => navigateTo("subscription-management")}
              >
                <span>💳 Manage Billing & License Limits</span>
                <span>→</span>
              </button>
              <button
                type="button"
                className="pd-action-btn"
                onClick={() => navigateTo("platform-user-management")}
              >
                <span>🛡️ Platform Staff Access & Security</span>
                <span>→</span>
              </button>
              <button
                type="button"
                className="pd-action-btn"
                onClick={() => navigateTo("school-details")}
              >
                <span>🔍 Deep Inspection of School Campuses</span>
                <span>→</span>
              </button>
              <button
                type="button"
                className="pd-action-btn"
                onClick={() => navigateTo("platform-audit-logs")}
              >
                <span>📜 Review Platform Audit Trail</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ADMINISTRATOR DETAILS MODAL */}
      {selectedAdminModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
            backdropFilter: "blur(6px)",
          }}
          onClick={() => setSelectedAdminModal(null)}
        >
          <div
            style={{
              background: "#0f172a",
              border: "1px solid rgba(99, 102, 241, 0.35)",
              borderRadius: "16px",
              padding: "26px",
              maxWidth: "560px",
              width: "100%",
              boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
              color: "#f8fafc",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                <span className="sch-badge sch-badge-warning" style={{ fontSize: "11px", marginBottom: "6px" }}>
                  👑 Platform Boss Supervision View
                </span>
                <h2 style={{ margin: "4px 0 0", fontSize: "20px", fontWeight: 800 }}>
                  {selectedAdminModal.adminName}
                </h2>
                <div style={{ fontSize: "13px", color: "#94a3b8" }}>
                  {selectedAdminModal.adminTitle} • {selectedAdminModal.schoolName}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAdminModal(null)}
                style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "22px", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
              <div style={{ background: "rgba(255,255,255,0.04)", padding: "10px 14px", borderRadius: "8px" }}>
                <div style={{ fontSize: "11px", color: "#94a3b8" }}>OFFICIAL EMAIL</div>
                <div style={{ fontSize: "13px", color: "#38bdf8", fontWeight: 600 }}>{selectedAdminModal.email}</div>
              </div>

              <div style={{ background: "rgba(255,255,255,0.04)", padding: "10px 14px", borderRadius: "8px" }}>
                <div style={{ fontSize: "11px", color: "#94a3b8", display: "flex", justifyContent: "space-between" }}>
                  <span>SCHOOL PASSWORD</span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ background: "none", border: "none", color: "#a5b4fc", cursor: "pointer", fontSize: "11px" }}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <div style={{ fontSize: "13px", color: "#34d399", fontWeight: 700, fontFamily: "JetBrains Mono, monospace" }}>
                  {showPassword ? selectedAdminModal.password : "••••••••••••"}
                </div>
              </div>

              <div style={{ background: "rgba(255,255,255,0.04)", padding: "10px 14px", borderRadius: "8px" }}>
                <div style={{ fontSize: "11px", color: "#94a3b8" }}>DIRECT PHONE</div>
                <div style={{ fontSize: "13px" }}>{selectedAdminModal.phone || "+1 (555) 019-2831"}</div>
              </div>

              <div style={{ background: "rgba(255,255,255,0.04)", padding: "10px 14px", borderRadius: "8px" }}>
                <div style={{ fontSize: "11px", color: "#94a3b8" }}>STATUS</div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: selectedAdminModal.status === "Active" ? "#34d399" : "#f87171" }}>
                  {selectedAdminModal.status}
                </div>
              </div>
            </div>

            <div style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: 1.5, marginBottom: "20px", background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px" }}>
              <strong>Trustee Bio:</strong> {selectedAdminModal.bio || "School executive administrator."}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                type="button"
                className="sm-btn sm-btn-secondary"
                onClick={() => setSelectedAdminModal(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="sm-btn sm-btn-secondary"
                onClick={() => {
                  handleAccessSchoolStudents(selectedAdminModal.schoolId);
                }}
              >
                🎓 View Students
              </button>
              <button
                type="button"
                className="sm-btn sm-btn-primary"
                onClick={() => {
                  handleAccessSchoolDashboard(selectedAdminModal.schoolId);
                }}
              >
                📊 Enter School Dashboard →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlatformDashboard;
