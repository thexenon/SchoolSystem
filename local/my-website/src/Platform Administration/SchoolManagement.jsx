import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./SchoolManagement.css";
import {
  getSchoolAdmins,
  generateSchoolAdminLogin,
  regenerateSchoolAdminPassword,
  setActiveSchoolAdmin,
} from "./schoolAdminAuth";

const INITIAL_SCHOOLS = [
  {
    id: "SCH-001",
    name: "St. Mary International Academy",
    code: "SMIA",
    city: "London",
    country: "United Kingdom",
    plan: "Enterprise",
    campuses: 3,
    students: 3400,
    faculty: 220,
    status: "Active",
    adminContact: "admin@stmarys.edu",
    registeredDate: "Jan 14, 2024",
  },
  {
    id: "SCH-002",
    name: "Oakridge High School",
    code: "OHS",
    city: "Toronto",
    country: "Canada",
    plan: "Enterprise",
    campuses: 2,
    students: 2850,
    faculty: 180,
    status: "Active",
    adminContact: "admin@oakridge.edu",
    registeredDate: "Mar 22, 2024",
  },
  {
    id: "SCH-003",
    name: "Greenwood Preparatory",
    code: "GWP",
    city: "Austin, TX",
    country: "United States",
    plan: "Professional",
    campuses: 1,
    students: 1420,
    faculty: 95,
    status: "Active",
    adminContact: "admin@greenwood.edu",
    registeredDate: "Aug 05, 2024",
  },
  {
    id: "SCH-004",
    name: "Horizon Collegiate Institute",
    code: "HCI",
    city: "Melbourne",
    country: "Australia",
    plan: "Professional",
    campuses: 1,
    students: 980,
    faculty: 68,
    status: "Suspended",
    adminContact: "admin@horizon.edu",
    registeredDate: "Nov 19, 2024",
  },
  {
    id: "SCH-005",
    name: "Beacon Hill Grammar School",
    code: "BHGS",
    city: "Boston, MA",
    country: "United States",
    plan: "Starter",
    campuses: 1,
    students: 420,
    faculty: 32,
    status: "Pending",
    adminContact: "admin@beaconhill.edu",
    registeredDate: "Oct 02, 2026",
  },
  {
    id: "SCH-006",
    name: "St. Jude Technical College",
    code: "SJTC",
    city: "Dublin",
    country: "Ireland",
    plan: "Enterprise",
    campuses: 4,
    students: 4100,
    faculty: 290,
    status: "Active",
    adminContact: "admin@stjude.ie",
    registeredDate: "Feb 10, 2023",
  },
];

function SchoolManagement({ onNavigate, onLogout }) {
  const [schools, setSchools] = useState(INITIAL_SCHOOLS);
  const [activeView, setActiveView] = useState("schools"); // 'schools' or 'admins'
  const [schoolAdmins, setSchoolAdmins] = useState(() => getSchoolAdmins());
  const [searchQuery, setSearchQuery] = useState("");
  const [adminSearchQuery, setAdminSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [planFilter, setPlanFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAdminGenModal, setShowAdminGenModal] = useState(false);
  const [showPasswordMap, setShowPasswordMap] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const [generatedSlip, setGeneratedSlip] = useState(null);

  // New School Form State
  const [newSchool, setNewSchool] = useState({
    name: "",
    code: "",
    city: "",
    country: "United States",
    plan: "Enterprise",
    campuses: 1,
    adminContact: "",
  });

  // Admin Login Generator Form State
  const [adminForm, setAdminForm] = useState({
    schoolId: "SCH-001",
    adminName: "Eleanor Vance",
    adminTitle: "Head Principal",
    customEmail: "",
    customPassword: "",
  });

  useEffect(() => {
    setSchoolAdmins(getSchoolAdmins());
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("platform_admin_auth");
    sessionStorage.removeItem("platform_admin_auth");
    if (onLogout) {
      onLogout();
    } else if (onNavigate) {
      onNavigate("platform-login");
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const navigateTo = (screen) => {
    if (onNavigate) onNavigate(screen);
  };

  const handleTogglePassword = (id) => {
    setShowPasswordMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCopyText = (text, label) => {
    navigator.clipboard?.writeText(text);
    showToast(`📋 Copied ${label} to clipboard!`);
  };

  // Toggle Activate / Suspend School
  const handleToggleStatus = (id) => {
    setSchools((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextStatus = s.status === "Active" ? "Suspended" : "Active";
          showToast(`School "${s.name}" is now ${nextStatus}.`);
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
  };

  // Register New School + Automatically Provision School Admin
  const handleRegisterSchool = (e) => {
    e.preventDefault();
    if (!newSchool.name || !newSchool.adminContact) return;

    const idNumber = schools.length + 1;
    const formattedId = `SCH-${String(idNumber).padStart(3, "0")}`;
    const generatedCode = newSchool.code || newSchool.name.substring(0, 4).toUpperCase();

    const created = {
      id: formattedId,
      name: newSchool.name,
      code: generatedCode,
      city: newSchool.city || "Headquarters",
      country: newSchool.country,
      plan: newSchool.plan,
      campuses: Number(newSchool.campuses) || 1,
      students: 0,
      faculty: 0,
      status: "Active",
      adminContact: newSchool.adminContact,
      registeredDate: "Just now",
    };

    setSchools([created, ...schools]);

    // Automatically generate school-based administrator credentials for this new school
    const cleanPrefix = newSchool.name.split(" ")[0].replace(/[^a-zA-Z]/g, "") || generatedCode;
    const autoPassword = `${cleanPrefix}@Admin2026`;

    generateSchoolAdminLogin({
      schoolId: formattedId,
      schoolName: newSchool.name,
      schoolCode: generatedCode,
      adminName: `Head Administrator (${newSchool.name})`,
      adminTitle: "Executive Director",
      customEmail: newSchool.adminContact,
      customPassword: autoPassword,
    });

    setSchoolAdmins(getSchoolAdmins());
    setShowAddModal(false);
    setNewSchool({
      name: "",
      code: "",
      city: "",
      country: "United States",
      plan: "Enterprise",
      campuses: 1,
      adminContact: "",
    });

    showToast(`✓ Registered "${created.name}" and provisioned Admin login (${autoPassword})!`);
  };

  // Multi-School Admin generates a new School Admin Login
  const handleGenerateAdminSubmit = (e) => {
    e.preventDefault();
    const selectedSchool = schools.find((s) => s.id === adminForm.schoolId) || schools[0];

    const cleanPrefix = selectedSchool.name.split(" ")[0].replace(/[^a-zA-Z]/g, "") || selectedSchool.code;
    const defaultPass = `${cleanPrefix}@Admin2026`;
    const defaultEmail = `admin@${selectedSchool.code.toLowerCase()}.edu`;

    const generated = generateSchoolAdminLogin({
      schoolId: selectedSchool.id,
      schoolName: selectedSchool.name,
      schoolCode: selectedSchool.code,
      adminName: adminForm.adminName || `Admin of ${selectedSchool.name}`,
      adminTitle: adminForm.adminTitle || "School Administrator",
      customEmail: adminForm.customEmail.trim() || defaultEmail,
      customPassword: adminForm.customPassword.trim() || defaultPass,
    });

    setSchoolAdmins(getSchoolAdmins());
    setGeneratedSlip(generated);
    setShowAdminGenModal(false);
    showToast(`✓ Generated School Admin Login for ${selectedSchool.name}!`);
  };

  // Overall Boss re-generates or resets school admin password
  const handleRegeneratePassword = (adminId) => {
    const updated = regenerateSchoolAdminPassword(adminId);
    if (updated) {
      setSchoolAdmins(getSchoolAdmins());
      setGeneratedSlip(updated);
      showToast(`✓ New password generated for ${updated.schoolName}: ${updated.password}`);
    }
  };

  // Launch school portal directly as this school admin
  const handleLaunchSchoolPortal = (admin) => {
    setActiveSchoolAdmin(admin);
    showToast(`🚀 Logging into ${admin.schoolName} Admin Portal...`);
    setTimeout(() => {
      navigateTo("user-management");
    }, 700);
  };

  // Export School Admin Logins as CSV
  const handleExportAdminsCSV = () => {
    const csvContent =
      "School ID,School Name,School Code,Admin Name,Title,Admin Email,Password,Status,Created Date\n" +
      schoolAdmins
        .map(
          (a) =>
            `"${a.schoolId}","${a.schoolName}","${a.schoolCode}","${a.adminName}","${a.adminTitle}","${a.email}","${a.password}","${a.status}","${a.createdAt}"`
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `school_admin_logins_directory_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`✓ Exported ${schoolAdmins.length} school admin logins as CSV file!`);
  };

  // Filtered Schools
  const filteredSchools = schools.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || s.status === statusFilter;
    const matchesPlan = planFilter === "All" || s.plan === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  // Filtered School Admins
  const filteredAdmins = schoolAdmins.filter((a) => {
    const q = adminSearchQuery.toLowerCase();
    return (
      a.schoolName.toLowerCase().includes(q) ||
      a.adminName.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.schoolCode.toLowerCase().includes(q) ||
      a.schoolId.toLowerCase().includes(q)
    );
  });

  return (
    <div className="sm-wrapper">
      {/* Platform Navigation */}
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
            className="platform-menu-item"
            onClick={() => navigateTo("platform-dashboard")}
          >
            📊 Dashboard
          </button>
          <button
            type="button"
            className="platform-menu-item active"
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
      <div className="sm-header">
        <div>
          <h1 className="sm-title">School & Admin Portal Governance</h1>
          <p className="sm-subtitle">
            Overall Boss Hub: Manage multi-school institutions and generate unique, school-based admin portal passwords
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            type="button"
            className="sm-btn sm-btn-secondary"
            onClick={() => {
              setActiveView("admins");
              setShowAdminGenModal(true);
            }}
          >
            ⚡ Generate School Admin Login
          </button>
          <button
            type="button"
            className="sm-btn sm-btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            ➕ Register New School
          </button>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="sm-view-tabs">
        <button
          type="button"
          className={`sm-view-tab ${activeView === "schools" ? "active" : ""}`}
          onClick={() => setActiveView("schools")}
        >
          <span>🏫 Registered Schools</span>
          <span className="sm-tab-badge">{schools.length}</span>
        </button>
        <button
          type="button"
          className={`sm-view-tab ${activeView === "admins" ? "active" : ""}`}
          onClick={() => setActiveView("admins")}
        >
          <span>🔑 School Admin Logins (Boss Control)</span>
          <span className="sm-tab-badge">{schoolAdmins.length}</span>
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

      {/* VIEW 1: REGISTERED SCHOOLS */}
      {activeView === "schools" && (
        <>
          {/* Search & Filters */}
          <div className="sm-filter-bar">
            <input
              type="text"
              className="sm-search-input"
              placeholder="🔍 Search by school name, ID (e.g. SCH-001), code, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <select
              className="sm-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Suspended">Suspended</option>
            </select>

            <select
              className="sm-select"
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
            >
              <option value="All">All Plans</option>
              <option value="Enterprise">Enterprise</option>
              <option value="Professional">Professional</option>
              <option value="Starter">Starter</option>
            </select>
          </div>

          {/* School Table */}
          <div className="sm-table-container">
            <table className="sm-table">
              <thead>
                <tr>
                  <th>School ID</th>
                  <th>Institution Name</th>
                  <th>Location</th>
                  <th>Tier Plan</th>
                  <th>Campuses</th>
                  <th>Total Enrolled</th>
                  <th>Status</th>
                  <th>Admin Contact</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchools.map((school) => (
                  <tr key={school.id}>
                    <td>
                      <span style={{ fontWeight: 700, color: "#818cf8" }}>{school.id}</span>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>{school.code}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: "#f8fafc" }}>{school.name}</div>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>
                        Reg: {school.registeredDate}
                      </div>
                    </td>
                    <td>
                      {school.city}, {school.country}
                    </td>
                    <td>
                      <span className={`sm-badge sm-badge-${school.plan.toLowerCase()}`}>
                        {school.plan}
                      </span>
                    </td>
                    <td>{school.campuses} Campuses</td>
                    <td>
                      <strong>{school.students.toLocaleString()}</strong> Students
                      <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                        {school.faculty} Faculty
                      </div>
                    </td>
                    <td>
                      <span className={`sm-badge sm-badge-${school.status.toLowerCase()}`}>
                        {school.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: "12px", color: "#cbd5e1" }}>{school.adminContact}</div>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "6px" }}>
                        <button
                          type="button"
                          className="sm-btn sm-btn-secondary"
                          onClick={() => {
                            setActiveView("admins");
                            setAdminSearchQuery(school.name);
                          }}
                          title="View Admin Logins for this School"
                        >
                          🔑 Logins
                        </button>
                        <button
                          type="button"
                          className={
                            school.status === "Active"
                              ? "sm-btn sm-btn-danger"
                              : "sm-btn sm-btn-success"
                          }
                          onClick={() => handleToggleStatus(school.id)}
                        >
                          {school.status === "Active" ? "Suspend" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* VIEW 2: SCHOOL ADMIN LOGINS (OVERALL BOSS CONTROL) */}
      {activeView === "admins" && (
        <>
          {/* Boss Hub Callout Banner */}
          <div className="sm-boss-banner">
            <div>
              <div className="sm-boss-title">
                <span>👑</span> Multi-School Admin Master Key Authority
              </div>
              <p className="sm-boss-desc">
                As the overall platform boss, you manage login access for every individual school administrator. Each school has its own custom administrator password based on its institution name.
              </p>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                className="sm-btn sm-btn-secondary"
                onClick={handleExportAdminsCSV}
              >
                📄 Export All Logins (CSV)
              </button>
              <button
                type="button"
                className="sm-btn sm-btn-primary"
                onClick={() => setShowAdminGenModal(true)}
              >
                ⚡ Generate New Admin Login
              </button>
            </div>
          </div>

          {/* Search Admin Logins */}
          <div className="sm-filter-bar">
            <input
              type="text"
              className="sm-search-input"
              placeholder="🔍 Search school admins by school name, admin name, code, or email..."
              value={adminSearchQuery}
              onChange={(e) => setAdminSearchQuery(e.target.value)}
            />
            {adminSearchQuery && (
              <button
                type="button"
                className="sm-btn sm-btn-secondary"
                onClick={() => setAdminSearchQuery("")}
              >
                Clear Search
              </button>
            )}
          </div>

          {/* School Admins Credentials Table */}
          <div className="sm-table-container">
            <table className="sm-table">
              <thead>
                <tr>
                  <th>School ID & Code</th>
                  <th>Institution Name</th>
                  <th>School Administrator</th>
                  <th>Admin Portal Email</th>
                  <th>School-Based Password</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Boss Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdmins.map((admin) => (
                  <tr key={admin.id}>
                    <td>
                      <span style={{ fontWeight: 700, color: "#818cf8" }}>{admin.schoolId}</span>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>Code: {admin.schoolCode}</div>
                    </td>
                    <td>
                      <strong style={{ color: "#f8fafc" }}>{admin.schoolName}</strong>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>ID: {admin.id}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: "#f1f5f9" }}>{admin.adminName}</div>
                      <div style={{ fontSize: "11px", color: "#38bdf8" }}>{admin.adminTitle}</div>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "12px", color: "#cbd5e1" }}>
                          {admin.email}
                        </span>
                        <button
                          type="button"
                          className="sm-icon-btn"
                          onClick={() => handleCopyText(admin.email, "Admin Email")}
                          title="Copy Email"
                        >
                          📋
                        </button>
                      </div>
                    </td>
                    <td>
                      <div className="sm-pass-container">
                        <span className="sm-pass-pill">
                          {showPasswordMap[admin.id] ? admin.password : "••••••••••••"}
                        </span>
                        <button
                          type="button"
                          className="sm-icon-btn"
                          onClick={() => handleTogglePassword(admin.id)}
                          title={showPasswordMap[admin.id] ? "Hide Password" : "Show Password"}
                        >
                          {showPasswordMap[admin.id] ? "🙈" : "👁️"}
                        </button>
                        <button
                          type="button"
                          className="sm-icon-btn"
                          onClick={() => handleCopyText(admin.password, "Admin Password")}
                          title="Copy Password"
                        >
                          📋
                        </button>
                      </div>
                    </td>
                    <td>
                      <span className={`sm-badge sm-badge-${admin.status.toLowerCase()}`}>
                        {admin.status}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "6px" }}>
                        <button
                          type="button"
                          className="sm-btn sm-btn-secondary"
                          style={{ padding: "6px 10px", fontSize: "11px" }}
                          onClick={() => handleRegeneratePassword(admin.id)}
                          title="Generate a new password based on this school"
                        >
                          🔄 Reset Pass
                        </button>
                        <button
                          type="button"
                          className="sm-btn sm-btn-primary"
                          style={{ padding: "6px 12px", fontSize: "11px" }}
                          onClick={() => handleLaunchSchoolPortal(admin)}
                          title="Open School Admin Portal as this Administrator"
                        >
                          🚀 Launch Portal
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* MODAL 1: REGISTER NEW SCHOOL */}
      {showAddModal && (
        <div className="sm-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="sm-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="sm-modal-header">
              <h2 className="sm-modal-title">Register New School Institution</h2>
              <button
                type="button"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94a3b8",
                  fontSize: "20px",
                  cursor: "pointer",
                }}
                onClick={() => setShowAddModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterSchool}>
              <div className="sm-form-group">
                <label className="sm-form-label">School Name *</label>
                <input
                  type="text"
                  required
                  className="sm-form-input"
                  placeholder="e.g. Cambridge Academy of Sciences"
                  value={newSchool.name}
                  onChange={(e) => setNewSchool({ ...newSchool, name: e.target.value })}
                />
              </div>

              <div className="sm-grid-2">
                <div className="sm-form-group">
                  <label className="sm-form-label">School Code</label>
                  <input
                    type="text"
                    className="sm-form-input"
                    placeholder="e.g. CAS"
                    value={newSchool.code}
                    onChange={(e) => setNewSchool({ ...newSchool, code: e.target.value })}
                  />
                </div>

                <div className="sm-form-group">
                  <label className="sm-form-label">City / Region</label>
                  <input
                    type="text"
                    className="sm-form-input"
                    placeholder="e.g. Cambridge, UK"
                    value={newSchool.city}
                    onChange={(e) => setNewSchool({ ...newSchool, city: e.target.value })}
                  />
                </div>
              </div>

              <div className="sm-grid-2">
                <div className="sm-form-group">
                  <label className="sm-form-label">Subscription Tier</label>
                  <select
                    className="sm-form-input"
                    value={newSchool.plan}
                    onChange={(e) => setNewSchool({ ...newSchool, plan: e.target.value })}
                  >
                    <option value="Enterprise">Enterprise Tier</option>
                    <option value="Professional">Professional Tier</option>
                    <option value="Starter">Starter Tier</option>
                  </select>
                </div>

                <div className="sm-form-group">
                  <label className="sm-form-label">Number of Campuses</label>
                  <input
                    type="number"
                    min="1"
                    className="sm-form-input"
                    value={newSchool.campuses}
                    onChange={(e) => setNewSchool({ ...newSchool, campuses: e.target.value })}
                  />
                </div>
              </div>

              <div className="sm-form-group">
                <label className="sm-form-label">Administrator Contact Email *</label>
                <input
                  type="email"
                  required
                  className="sm-form-input"
                  placeholder="e.g. admin@cambridge.edu"
                  value={newSchool.adminContact}
                  onChange={(e) => setNewSchool({ ...newSchool, adminContact: e.target.value })}
                />
                <span style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
                  A dedicated school-based password will automatically be provisioned for this admin!
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "24px" }}>
                <button
                  type="button"
                  className="sm-btn sm-btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="sm-btn sm-btn-primary">
                  Register & Provision Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: GENERATE SCHOOL ADMIN LOGIN (OVERALL BOSS TOOL) */}
      {showAdminGenModal && (
        <div className="sm-modal-backdrop" onClick={() => setShowAdminGenModal(false)}>
          <div className="sm-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="sm-modal-header">
              <h2 className="sm-modal-title">⚡ Generate School Admin Login</h2>
              <button
                type="button"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94a3b8",
                  fontSize: "20px",
                  cursor: "pointer",
                }}
                onClick={() => setShowAdminGenModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGenerateAdminSubmit}>
              <div className="sm-form-group">
                <label className="sm-form-label">Target School *</label>
                <select
                  className="sm-form-input"
                  value={adminForm.schoolId}
                  onChange={(e) => {
                    const sc = schools.find((s) => s.id === e.target.value);
                    const cleanP = sc ? sc.name.split(" ")[0].replace(/[^a-zA-Z]/g, "") : "School";
                    setAdminForm({
                      ...adminForm,
                      schoolId: e.target.value,
                      customPassword: `${cleanP}@Admin2026`,
                      customEmail: sc ? `admin@${sc.code.toLowerCase()}.edu` : "",
                    });
                  }}
                >
                  {schools.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.id} - {s.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm-grid-2">
                <div className="sm-form-group">
                  <label className="sm-form-label">Administrator Full Name</label>
                  <input
                    type="text"
                    required
                    className="sm-form-input"
                    placeholder="e.g. Dr. Eleanor Vance"
                    value={adminForm.adminName}
                    onChange={(e) => setAdminForm({ ...adminForm, adminName: e.target.value })}
                  />
                </div>

                <div className="sm-form-group">
                  <label className="sm-form-label">Administrative Title</label>
                  <input
                    type="text"
                    className="sm-form-input"
                    placeholder="e.g. Head Principal"
                    value={adminForm.adminTitle}
                    onChange={(e) => setAdminForm({ ...adminForm, adminTitle: e.target.value })}
                  />
                </div>
              </div>

              <div className="sm-form-group">
                <label className="sm-form-label">
                  <span>School Admin Email</span>
                  <span style={{ fontSize: "11px", color: "#64748b", textTransform: "none" }}>
                    (Leave empty to auto-generate from school domain)
                  </span>
                </label>
                <input
                  type="email"
                  className="sm-form-input"
                  placeholder="e.g. admin@stmarys.edu"
                  value={adminForm.customEmail}
                  onChange={(e) => setAdminForm({ ...adminForm, customEmail: e.target.value })}
                />
              </div>

              <div className="sm-form-group">
                <label className="sm-form-label">
                  <span>School-Based Password</span>
                  <span style={{ fontSize: "11px", color: "#64748b", textTransform: "none" }}>
                    (Tailored based on school institution)
                  </span>
                </label>
                <input
                  type="text"
                  className="sm-form-input"
                  placeholder="e.g. StMary@Admin2026"
                  value={adminForm.customPassword}
                  onChange={(e) => setAdminForm({ ...adminForm, customPassword: e.target.value })}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "24px" }}>
                <button
                  type="button"
                  className="sm-btn sm-btn-secondary"
                  onClick={() => setShowAdminGenModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="sm-btn sm-btn-primary">
                  ⚡ Generate & Save Admin Login
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CREDENTIAL SLIP PREVIEW */}
      {generatedSlip && (
        <div className="sm-modal-backdrop" onClick={() => setGeneratedSlip(null)}>
          <div className="sm-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="sm-modal-header">
              <h2 className="sm-modal-title">
                <span>🔑</span> Official School Administrator Credential Slip
              </h2>
              <button
                type="button"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94a3b8",
                  fontSize: "20px",
                  cursor: "pointer",
                }}
                onClick={() => setGeneratedSlip(null)}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: "13px", color: "#94a3b8", margin: "0 0 16px" }}>
              Provisioned by Multi-School Platform Administration (Overall Boss):
            </p>

            <div className="sm-slip-preview">
              <pre className="sm-slip-pre">
{`===============================================================
MULTI-SCHOOL SYSTEM - OFFICIAL SCHOOL ADMIN CREDENTIALS
===============================================================
Institution: ${generatedSlip.schoolName} (${generatedSlip.schoolId})
School Code: ${generatedSlip.schoolCode}
Admin Name:  ${generatedSlip.adminName}
Admin Title: ${generatedSlip.adminTitle}
Portal Email: ${generatedSlip.email}
Password:     ${generatedSlip.password}
Portal URL:   http://localhost:5173/login
Status:       ${generatedSlip.status}
Provisioned:  ${generatedSlip.createdAt}
Authority:    Multi-School Platform Super Administrator
===============================================================`}
              </pre>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
              <button
                type="button"
                className="sm-btn sm-btn-secondary"
                onClick={() => {
                  const slipText = `Institution: ${generatedSlip.schoolName}\nEmail: ${generatedSlip.email}\nPassword: ${generatedSlip.password}`;
                  handleCopyText(slipText, "Admin Credentials");
                }}
              >
                📋 Copy Credentials
              </button>
              <button
                type="button"
                className="sm-btn sm-btn-primary"
                onClick={() => {
                  handleLaunchSchoolPortal(generatedSlip);
                  setGeneratedSlip(null);
                }}
              >
                🚀 Login to School Portal Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SchoolManagement;
