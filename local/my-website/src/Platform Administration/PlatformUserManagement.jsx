import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./PlatformUserManagement.css";

const INITIAL_STAFF = [
  {
    id: "OP-001",
    name: "Dr. Arthur Bell",
    email: "a.bell@platform.schoolhub.net",
    role: "Super Admin",
    dept: "Executive Operations",
    status: "Active",
    twoFactor: "Enforced & Active",
    lastIp: "192.168.1.10 (London HQ)",
    lastLogin: "10 mins ago",
  },
  {
    id: "OP-002",
    name: "Marcus Chen",
    email: "m.chen@platform.schoolhub.net",
    role: "Cloud DevOps",
    dept: "Infrastructure & Security",
    status: "Active",
    twoFactor: "Enforced & Active",
    lastIp: "10.0.4.88 (Toronto Office)",
    lastLogin: "24 mins ago",
  },
  {
    id: "OP-003",
    name: "Samantha Wu",
    email: "s.wu@platform.schoolhub.net",
    role: "Security Auditor",
    dept: "Compliance & Data Governance",
    status: "Active",
    twoFactor: "Enforced & Active",
    lastIp: "172.16.0.45 (San Francisco)",
    lastLogin: "2 hours ago",
  },
  {
    id: "OP-004",
    name: "Liam Reynolds",
    email: "l.reynolds@platform.schoolhub.net",
    role: "Support Lead",
    dept: "Tier-2 School Support",
    status: "Active",
    twoFactor: "Enforced & Active",
    lastIp: "192.168.12.4 (Dublin Office)",
    lastLogin: "Today, 08:30 AM",
  },
  {
    id: "OP-005",
    name: "Maya Patel",
    email: "m.patel@platform.schoolhub.net",
    role: "Billing Operations",
    dept: "Finance & Contracts",
    status: "Active",
    twoFactor: "Enforced & Active",
    lastIp: "192.168.8.19 (Austin Office)",
    lastLogin: "Yesterday",
  },
  {
    id: "OP-006",
    name: "David Thorne",
    email: "d.thorne@platform.schoolhub.net",
    role: "Support Agent",
    dept: "Tier-1 Customer Success",
    status: "Suspended",
    twoFactor: "Pending Verification",
    lastIp: "10.14.2.11",
    lastLogin: "5 days ago",
  },
];

function PlatformUserManagement({ onNavigate, onLogout }) {
  const [staffList, setStaffList] = useState(INITIAL_STAFF);

  const handleLogout = () => {
    localStorage.removeItem("platform_admin_auth");
    sessionStorage.removeItem("platform_admin_auth");
    if (onLogout) {
      onLogout();
    } else if (onNavigate) {
      onNavigate("platform-login");
    }
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    role: "Support Agent",
    dept: "Customer Success",
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const navigateTo = (screen) => {
    if (onNavigate) onNavigate(screen);
  };

  const handleToggleStatus = (id) => {
    setStaffList((prev) =>
      prev.map((member) => {
        if (member.id === id) {
          const next = member.status === "Active" ? "Suspended" : "Active";
          showToast(`Platform access for ${member.name} is now ${next}.`);
          return { ...member, status: next };
        }
        return member;
      })
    );
  };

  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.email) return;

    const newId = `OP-00${staffList.length + 1}`;
    const created = {
      id: newId,
      name: newStaff.name,
      email: newStaff.email,
      role: newStaff.role,
      dept: newStaff.dept,
      status: "Active",
      twoFactor: "Enforced & Active",
      lastIp: "Initial Setup",
      lastLogin: "Never",
    };

    setStaffList([created, ...staffList]);
    setShowAddModal(false);
    setNewStaff({ name: "", email: "", role: "Support Agent", dept: "Customer Success" });
    showToast(`✓ Registered new platform operator "${created.name}" (${created.role})!`);
  };

  const filteredStaff = staffList.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.dept.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "All" || m.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="pum-wrapper">
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
            className="platform-menu-item"
            onClick={() => navigateTo("subscription-management")}
          >
            💎 Subscriptions
          </button>
          <button
            type="button"
            className="platform-menu-item active"
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
      <div className="pum-header">
        <div>
          <h1 className="pum-title">Platform Operator Management</h1>
          <p className="pum-subtitle">
            Manage global platform personnel, multi-tenant permissions, and operational security
          </p>
        </div>

        <button
          type="button"
          className="sm-btn sm-btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          ➕ Add Platform Staff
        </button>
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

      {/* Stats Cards */}
      <div className="pum-stats">
        <div className="pum-stat-card">
          <div className="pum-stat-label">Total Platform Operators</div>
          <div className="pum-stat-val">{staffList.length}</div>
        </div>
        <div className="pum-stat-card">
          <div className="pum-stat-label">Super Administrators</div>
          <div className="pum-stat-val" style={{ color: "#818cf8" }}>2</div>
        </div>
        <div className="pum-stat-card">
          <div className="pum-stat-label">Cloud Infrastructure & DevOps</div>
          <div className="pum-stat-val" style={{ color: "#c084fc" }}>2</div>
        </div>
        <div className="pum-stat-card">
          <div className="pum-stat-label">Support & Billing Staff</div>
          <div className="pum-stat-val" style={{ color: "#38bdf8" }}>2</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
        <input
          type="text"
          className="sm-search-input"
          placeholder="🔍 Search operators by name, email, ID, or department..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          className="sm-select"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="All">All Platform Roles</option>
          <option value="Super Admin">Super Admin</option>
          <option value="Cloud DevOps">Cloud DevOps</option>
          <option value="Security Auditor">Security Auditor</option>
          <option value="Support Lead">Support Lead</option>
          <option value="Billing Operations">Billing Operations</option>
          <option value="Support Agent">Support Agent</option>
        </select>
      </div>

      {/* Staff Table */}
      <div className="pum-table-container">
        <table className="pum-table">
          <thead>
            <tr>
              <th>Operator</th>
              <th>Platform Role</th>
              <th>Department</th>
              <th>2FA Security</th>
              <th>Last IP Session</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.map((m) => (
              <tr key={m.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div className="pum-avatar">
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: "#ffffff" }}>{m.name}</div>
                      <div style={{ fontSize: "12px", color: "#94a3b8" }}>{m.email} • {m.id}</div>
                    </div>
                  </div>
                </td>

                <td>
                  <span
                    className={`pum-role-badge ${
                      m.role.includes("Admin")
                        ? "pum-role-super"
                        : m.role.includes("DevOps") || m.role.includes("Security")
                        ? "pum-role-devops"
                        : m.role.includes("Billing")
                        ? "pum-role-billing"
                        : "pum-role-support"
                    }`}
                  >
                    {m.role}
                  </span>
                </td>

                <td>{m.dept}</td>

                <td>
                  <span style={{ fontSize: "12px", color: "#10b981", display: "flex", alignItems: "center", gap: "4px" }}>
                    🔒 {m.twoFactor}
                  </span>
                </td>

                <td>
                  <div style={{ fontSize: "12px", color: "#f1f5f9" }}>{m.lastIp}</div>
                  <div style={{ fontSize: "11px", color: "#64748b" }}>{m.lastLogin}</div>
                </td>

                <td>
                  <span className={`sm-badge sm-badge-${m.status.toLowerCase()}`}>
                    {m.status}
                  </span>
                </td>

                <td style={{ textAlign: "right" }}>
                  <div style={{ display: "inline-flex", gap: "6px" }}>
                    <button
                      type="button"
                      className="sm-btn sm-btn-secondary sm-btn-sm"
                      onClick={() => showToast(`2FA security reset link sent to ${m.email}`)}
                    >
                      Reset 2FA
                    </button>
                    <button
                      type="button"
                      className={`sm-btn sm-btn-sm ${m.status === "Active" ? "sm-btn-danger" : "sm-btn-secondary"}`}
                      onClick={() => handleToggleStatus(m.id)}
                    >
                      {m.status === "Active" ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Platform Staff Modal */}
      {showAddModal && (
        <div className="sm-modal-backdrop">
          <div className="sm-modal-card">
            <div className="sm-modal-header">
              <h2 className="sm-modal-title">Provision Platform Staff Member</h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "20px", cursor: "pointer" }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddStaff}>
              <div className="sm-form-group">
                <label className="sm-form-label">Full Name *</label>
                <input
                  className="sm-form-input"
                  required
                  placeholder="e.g. Jordan Hayes"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                />
              </div>

              <div className="sm-form-group">
                <label className="sm-form-label">Platform Corporate Email *</label>
                <input
                  type="email"
                  className="sm-form-input"
                  required
                  placeholder="e.g. j.hayes@platform.schoolhub.net"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                />
              </div>

              <div className="sm-grid-2">
                <div className="sm-form-group">
                  <label className="sm-form-label">Platform Role</label>
                  <select
                    className="sm-form-input"
                    value={newStaff.role}
                    onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                  >
                    <option value="Super Admin">Super Administrator</option>
                    <option value="Cloud DevOps">Cloud DevOps Engineer</option>
                    <option value="Security Auditor">Security Auditor</option>
                    <option value="Support Lead">Support Lead</option>
                    <option value="Billing Operations">Billing Operations</option>
                    <option value="Support Agent">Tier-1 Support Agent</option>
                  </select>
                </div>

                <div className="sm-form-group">
                  <label className="sm-form-label">Department / Unit</label>
                  <input
                    className="sm-form-input"
                    placeholder="e.g. Global Support Operations"
                    value={newStaff.dept}
                    onChange={(e) => setNewStaff({ ...newStaff, dept: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
                <button
                  type="button"
                  className="sm-btn sm-btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="sm-btn sm-btn-primary">
                  ✓ Add Platform Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlatformUserManagement;
