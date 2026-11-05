import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SchoolDetails.css";
import { switchActiveSchool } from "./schoolAdminAuth";

const DETAILED_SCHOOLS = [
  {
    id: "SCH-001",
    name: "St. Mary International Academy",
    emblem: "SM",
    code: "SMIA",
    established: 1982,
    principal: "Dame Eleanor Vance, Ph.D.",
    accreditation: "International Baccalaureate (IB) & CIS",
    address: "42 Queen's Gate, Kensington, London SW7 5HR",
    country: "United Kingdom",
    contactEmail: "principal@stmarys.edu",
    phone: "+44 20 7946 0912",
    customDomain: "portal.stmarys.edu",
    status: "Active",
    plan: "Enterprise",
    billingCycle: "Annual ($48,000 / yr)",
    renewalDate: "Jan 14, 2027",
    storageUsed: "3.8 TB / 10 TB",
    licenseSeats: "3,400 / 4,000 Allocated",
    campuses: [
      { name: "Kensington Main Campus", capacity: "2,200 Students", head: "Dr. Arthur Bell", address: "42 Queen's Gate, London" },
      { name: "North London Science Wing", capacity: "800 Students", head: "Prof. Alistair Finch", address: "14 Highbury Grove, London" },
      { name: "Richmond Athletics Complex", capacity: "400 Students", head: "Coach Liam Davies", address: "9 Old Palace Ln, Richmond" },
    ],
    stats: {
      students: 3400,
      faculty: 220,
      admins: 14,
      parents: 2950,
      activeToday: 2840,
    },
  },
  {
    id: "SCH-002",
    name: "Oakridge High School",
    emblem: "OH",
    code: "OHS",
    established: 1994,
    principal: "Dr. Jonathan Hayes",
    accreditation: "Ontario Ministry of Education & AP Capstone",
    address: "1050 Bay Street, Toronto, ON M5S 3A5",
    country: "Canada",
    contactEmail: "admin@oakridge.edu",
    phone: "+1 (416) 555-0199",
    customDomain: "hub.oakridge.edu",
    status: "Active",
    plan: "Enterprise",
    billingCycle: "Annual ($39,500 / yr)",
    renewalDate: "Mar 22, 2027",
    storageUsed: "2.4 TB / 10 TB",
    licenseSeats: "2,850 / 3,000 Allocated",
    campuses: [
      { name: "Bay Street Campus (Grades 9-12)", capacity: "2,000 Students", head: "Dr. Jonathan Hayes", address: "1050 Bay St, Toronto" },
      { name: "Yorkville Creative Arts Center", capacity: "850 Students", head: "Mrs. Clara Oswald", address: "88 Yorkville Ave, Toronto" },
    ],
    stats: {
      students: 2850,
      faculty: 180,
      admins: 10,
      parents: 2400,
      activeToday: 2120,
    },
  },
  {
    id: "SCH-003",
    name: "Greenwood Preparatory",
    emblem: "GW",
    code: "GWP",
    established: 2005,
    principal: "Harrison Sterling, M.Ed.",
    accreditation: "Southern Association of Colleges and Schools (SACS)",
    address: "3200 Barton Springs Rd, Austin, TX 78704",
    country: "United States",
    contactEmail: "headmaster@greenwood.org",
    phone: "+1 (512) 555-8321",
    customDomain: "school.greenwood.org",
    status: "Active",
    plan: "Professional",
    billingCycle: "Monthly ($1,850 / mo)",
    renewalDate: "Nov 05, 2026",
    storageUsed: "1.1 TB / 5 TB",
    licenseSeats: "1,420 / 1,500 Allocated",
    campuses: [
      { name: "Austin Central Campus", capacity: "1,500 Students", head: "Harrison Sterling", address: "3200 Barton Springs Rd" },
    ],
    stats: {
      students: 1420,
      faculty: 95,
      admins: 6,
      parents: 1200,
      activeToday: 1180,
    },
  },
];

function SchoolDetails({ onNavigate, onLogout }) {
  const [selectedSchoolId, setSelectedSchoolId] = useState("SCH-001");
  const school = DETAILED_SCHOOLS.find((s) => s.id === selectedSchoolId) || DETAILED_SCHOOLS[0];

  const navigateTo = (screen) => {
    if (onNavigate) onNavigate(screen);
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

  return (
    <div className="sd-wrapper">
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
            className="platform-menu-item active"
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

      {/* School Switcher Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <span style={{ fontSize: "12px", color: "#818cf8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Tenant Deep Inspection
          </span>
          <h1 style={{ margin: "4px 0 0", fontSize: "24px", fontWeight: 800, color: "#ffffff" }}>
            School Profile & Campus Infrastructure
          </h1>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "13px", color: "#94a3b8" }}>Select School:</span>
          <select
            value={selectedSchoolId}
            onChange={(e) => setSelectedSchoolId(e.target.value)}
            style={{
              background: "rgba(18, 24, 38, 0.85)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#ffffff",
              padding: "8px 14px",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {DETAILED_SCHOOLS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.id})
              </option>
            ))}
          </select>

          <button
            type="button"
            className="sm-btn sm-btn-primary"
            style={{ padding: "7px 12px", fontSize: "12px", background: "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)" }}
            onClick={() => {
              switchActiveSchool(school.id);
              navigateTo("school-dashboard");
            }}
            title={`Access ${school.name} Dashboard as Platform Boss`}
          >
            📊 Access Dashboard
          </button>
          <button
            type="button"
            className="sm-btn sm-btn-secondary"
            style={{ padding: "7px 12px", fontSize: "12px" }}
            onClick={() => {
              switchActiveSchool(school.id);
              navigateTo("student-list");
            }}
            title={`View students enrolled in ${school.name}`}
          >
            🎓 View Students
          </button>
          <button
            type="button"
            className="platform-back-link"
            onClick={() => navigateTo("school-management")}
          >
            Back to All Schools
          </button>
        </div>
      </div>

      {/* Main School Banner */}
      <div className="sd-banner">
        <div className="sd-emblem-section">
          <div className="sd-emblem">{school.emblem}</div>
          <div>
            <h2 className="sd-school-name">{school.name}</h2>
            <div className="sd-school-meta">
              <span>📍 {school.address}</span>
              <span>•</span>
              <span>Established {school.established}</span>
              <span>•</span>
              <span style={{ color: "#38bdf8" }}>🌐 {school.customDomain}</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <span
            style={{
              background: "rgba(16, 185, 129, 0.15)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              color: "#10b981",
              fontSize: "12px",
              fontWeight: 700,
              padding: "6px 14px",
              borderRadius: "9999px",
            }}
          >
            ● {school.status}
          </span>
          <span
            style={{
              background: "rgba(99, 102, 241, 0.15)",
              border: "1px solid rgba(99, 102, 241, 0.3)",
              color: "#818cf8",
              fontSize: "12px",
              fontWeight: 700,
              padding: "6px 14px",
              borderRadius: "9999px",
            }}
          >
            {school.plan} Plan
          </span>
        </div>
      </div>

      {/* Row 1: School Information & Subscription Status */}
      <div className="sd-grid-2">
        {/* School Information */}
        <div className="sd-card">
          <div className="sd-card-title">
            <span>🏛️</span> Institutional Information
          </div>

          <div className="sd-info-list">
            <div className="sd-info-row">
              <span className="sd-info-label">Accreditation</span>
              <span className="sd-info-val">{school.accreditation}</span>
            </div>
            <div className="sd-info-row">
              <span className="sd-info-label">Head of School / Principal</span>
              <span className="sd-info-val">{school.principal}</span>
            </div>
            <div className="sd-info-row">
              <span className="sd-info-label">Primary Admin Email</span>
              <span className="sd-info-val">{school.contactEmail}</span>
            </div>
            <div className="sd-info-row">
              <span className="sd-info-label">Direct Phone</span>
              <span className="sd-info-val">{school.phone}</span>
            </div>
            <div className="sd-info-row">
              <span className="sd-info-label">Tenant Identifier Code</span>
              <span className="sd-info-val"><code>{school.id} ({school.code})</code></span>
            </div>
            <div className="sd-info-row">
              <span className="sd-info-label">Custom White-label Portal</span>
              <span className="sd-info-val" style={{ color: "#38bdf8" }}>https://{school.customDomain}</span>
            </div>
          </div>
        </div>

        {/* Subscription & Cloud Quotas */}
        <div className="sd-card">
          <div className="sd-card-title">
            <span>💎</span> Subscription & Cloud License
          </div>

          <div className="sd-info-list">
            <div className="sd-info-row">
              <span className="sd-info-label">Subscription Tier</span>
              <span className="sd-info-val" style={{ color: "#818cf8", fontWeight: 700 }}>
                {school.plan} Multi-Campus Edition
              </span>
            </div>
            <div className="sd-info-row">
              <span className="sd-info-label">Billing Rate & Frequency</span>
              <span className="sd-info-val">{school.billingCycle}</span>
            </div>
            <div className="sd-info-row">
              <span className="sd-info-label">Next Renewal Date</span>
              <span className="sd-info-val" style={{ color: "#10b981" }}>{school.renewalDate}</span>
            </div>
            <div className="sd-info-row">
              <span className="sd-info-label">User License Seats</span>
              <span className="sd-info-val">{school.licenseSeats}</span>
            </div>
            <div className="sd-info-row">
              <span className="sd-info-label">Dedicated Cloud Storage</span>
              <span className="sd-info-val">{school.storageUsed}</span>
            </div>
          </div>

          <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
            <button
              type="button"
              className="platform-back-link"
              onClick={() => navigateTo("subscription-management")}
              style={{ width: "100%", textAlign: "center" }}
            >
              💳 Manage Subscription Plan →
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: Campuses & User Demographics */}
      <div className="sd-grid-2">
        {/* Campuses */}
        <div className="sd-card">
          <div className="sd-card-title">
            <span>📍</span> Campuses & Branches ({school.campuses.length})
          </div>

          <div className="sd-campus-list">
            {school.campuses.map((c, i) => (
              <div key={i} className="sd-campus-item">
                <div>
                  <div className="sd-campus-name">{c.name}</div>
                  <div className="sd-campus-sub">
                    Head: <strong>{c.head}</strong> • Address: {c.address}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "12px", background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", padding: "4px 10px", borderRadius: "8px", fontWeight: 600 }}>
                    {c.capacity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Breakdown */}
        <div className="sd-card">
          <div className="sd-card-title">
            <span>👥</span> Enrolled User Demographics
          </div>

          <p style={{ fontSize: "13px", color: "#94a3b8", margin: "0 0 12px 0" }}>
            Real-time synchronization with this school's internal identity directory.
          </p>

          <div className="sd-stat-chips">
            <div className="sd-stat-chip">
              <div className="sd-chip-num">{school.stats.students.toLocaleString()}</div>
              <div className="sd-chip-label">Enrolled Students</div>
            </div>
            <div className="sd-stat-chip">
              <div className="sd-chip-num">{school.stats.faculty}</div>
              <div className="sd-chip-label">Teaching Faculty</div>
            </div>
            <div className="sd-stat-chip">
              <div className="sd-chip-num">{school.stats.admins}</div>
              <div className="sd-chip-label">School Admins</div>
            </div>
            <div className="sd-stat-chip">
              <div className="sd-chip-num">{school.stats.parents.toLocaleString()}</div>
              <div className="sd-chip-label">Parent Accounts</div>
            </div>
            <div className="sd-stat-chip">
              <div className="sd-chip-num" style={{ color: "#10b981" }}>
                {school.stats.activeToday.toLocaleString()}
              </div>
              <div className="sd-chip-label">Active Today</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SchoolDetails;
