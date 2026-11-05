import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SchoolDashboard.css";
import "./CampusManagement.css";
import { getActiveSchoolAdmin } from "../Platform Administration/schoolAdminAuth";

const INITIAL_CAMPUSES = [
  {
    id: "CMP-01",
    name: "Kensington Central Campus (Grades 9-12)",
    code: "KCC-MAIN",
    type: "Main Academic Headquarters",
    head: "Dr. Eleanor Vance",
    headRole: "Principal & Campus Dean",
    phone: "+44 (0) 20 7946 0921",
    address: "142 Queen's Gate, Kensington, London SW7",
    capacity: 2000,
    enrolled: 1840,
    classrooms: 48,
    faculty: 110,
    facilities: ["Science & Biotech Labs", "Olympics-length Pool", "Modern Lecture Hall", "Centennial Library", "Cafeteria"],
    status: "Active",
  },
  {
    id: "CMP-02",
    name: "Chelsea STEM & Innovation Annex",
    code: "CSI-ANNEX",
    type: "Secondary Technology Branch",
    head: "Prof. Arthur Bell",
    headRole: "Head of STEM Operations",
    phone: "+44 (0) 20 7946 0930",
    address: "28 King's Road, Chelsea, London SW3",
    capacity: 900,
    enrolled: 820,
    classrooms: 24,
    faculty: 55,
    facilities: ["Robotics Arena", "AI & Computer Labs", "Design Workshop", "Maker Studios"],
    status: "Active",
  },
  {
    id: "CMP-03",
    name: "Battersea Junior Preparatory Wing",
    code: "BJP-WING",
    type: "Junior & Middle School Branch",
    head: "Mrs. Clara Oswald",
    headRole: "Preparatory Division Head",
    phone: "+44 (0) 20 7946 0944",
    address: "55 Albert Bridge Rd, Battersea, London SW11",
    capacity: 800,
    enrolled: 760,
    classrooms: 22,
    faculty: 55,
    facilities: ["Junior Music Hall", "Early Learning Center", "Playground & Track", "Sensory Lab"],
    status: "Active",
  },
];

function CampusManagement({ onNavigate }) {
  const activeAdmin = getActiveSchoolAdmin();
  const schoolName = activeAdmin?.schoolName || "St. Mary International Academy";
  const [campuses, setCampuses] = useState(INITIAL_CAMPUSES);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [newCampus, setNewCampus] = useState({
    name: "",
    code: "",
    type: "Secondary Branch",
    head: "",
    headRole: "Branch Director",
    phone: "",
    address: "",
    capacity: 500,
    classrooms: 16,
    facilities: "Digital Library, Science Lab, Gymnasium",
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const navigateTo = (screen) => {
    if (onNavigate) onNavigate(screen);
  };

  const handleAddCampus = (e) => {
    e.preventDefault();
    if (!newCampus.name || !newCampus.code) return;

    const created = {
      id: `CMP-0${campuses.length + 1}`,
      name: newCampus.name,
      code: newCampus.code.toUpperCase(),
      type: newCampus.type,
      head: newCampus.head || "Campus Supervisor",
      headRole: newCampus.headRole,
      phone: newCampus.phone || "+44 (0) 20 7946 0000",
      address: newCampus.address,
      capacity: Number(newCampus.capacity) || 500,
      enrolled: 0,
      classrooms: Number(newCampus.classrooms) || 12,
      faculty: 0,
      facilities: newCampus.facilities.split(",").map((f) => f.trim()),
      status: "Active",
    };

    setCampuses([...campuses, created]);
    setShowAddModal(false);
    setNewCampus({
      name: "",
      code: "",
      type: "Secondary Branch",
      head: "",
      headRole: "Branch Director",
      phone: "",
      address: "",
      capacity: 500,
      classrooms: 16,
      facilities: "Digital Library, Science Lab, Gymnasium",
    });
    showToast(`✓ Registered new campus branch "${created.name}"!`);
  };

  const handleToggleStatus = (id) => {
    setCampuses((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const next = c.status === "Active" ? "Under Renovation" : "Active";
          showToast(`Campus "${c.name}" status set to ${next}.`);
          return { ...c, status: next };
        }
        return c;
      })
    );
  };

  const totalCapacity = campuses.reduce((sum, c) => sum + c.capacity, 0);
  const totalEnrolled = campuses.reduce((sum, c) => sum + c.enrolled, 0);

  return (
    <div className="sch-page-wrapper">
      {/* Navigation */}
      <nav className="school-nav-bar">
        <div className="school-brand">
          <div className="school-logo-badge">🏢</div>
          <div>
            <div className="school-brand-title">{schoolName}</div>
            <div className="school-brand-subtitle">Branch & Campus Facility Management</div>
          </div>
        </div>

        <div className="school-menu-links">
          <button
            type="button"
            className="school-menu-item"
            onClick={() => navigateTo("school-dashboard")}
          >
            📊 Dashboard
          </button>
          <button
            type="button"
            className="school-menu-item"
            onClick={() => navigateTo("school-profile")}
          >
            🏫 School Profile
          </button>
          <button
            type="button"
            className="school-menu-item active"
            onClick={() => navigateTo("campus-management")}
          >
            🏢 Campuses
          </button>
          <button
            type="button"
            className="school-menu-item"
            onClick={() => navigateTo("academic-year-management")}
          >
            📅 Academic Years
          </button>
          <button
            type="button"
            className="school-menu-item"
            onClick={() => navigateTo("term-semester-management")}
          >
            ⏳ Terms & Semesters
          </button>
          <button
            type="button"
            className="school-menu-item"
            onClick={() => navigateTo("school-calendar")}
          >
            🗓️ School Calendar
          </button>
          <button
            type="button"
            className="school-menu-item"
            onClick={() => navigateTo("school-settings")}
          >
            ⚙️ Settings
          </button>
        </div>

        <div className="school-nav-actions">
          <button
            type="button"
            className="school-nav-btn school-nav-btn-highlight"
            onClick={() => navigateTo("user-management")}
          >
            👥 Users Directory
          </button>
          <Link to="/" className="school-nav-btn">
            ← Hub
          </Link>
        </div>
      </nav>

      {/* Header */}
      <div className="sch-header">
        <div>
          <h1 className="sch-title">Multi-Branch Campus Management</h1>
          <p className="sch-subtitle">
            Oversee physical infrastructure, branch directors, classroom quotas, and student capacities across all campuses
          </p>
        </div>
        <button
          type="button"
          className="school-nav-btn school-nav-btn-highlight"
          onClick={() => setShowAddModal(true)}
        >
          ➕ Add New Campus Branch
        </button>
      </div>

      {toastMessage && (
        <div
          style={{
            background: "rgba(16, 185, 129, 0.15)",
            border: "1px solid rgba(16, 185, 129, 0.4)",
            color: "#10b981",
            padding: "14px 20px",
            borderRadius: "12px",
            marginBottom: "24px",
            fontWeight: 600,
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Top Summary Banner */}
      <div className="sch-kpi-grid">
        <div className="sch-kpi-card">
          <div className="sch-kpi-top">
            <span className="sch-kpi-label">Active Campuses</span>
            <span className="sch-kpi-icon">🏢</span>
          </div>
          <div className="sch-kpi-val">{campuses.length} Branches</div>
          <div className="sch-kpi-sub">Operating in Greater London</div>
        </div>

        <div className="sch-kpi-card">
          <div className="sch-kpi-top">
            <span className="sch-kpi-label">Total Student Capacity</span>
            <span className="sch-kpi-icon">🎓</span>
          </div>
          <div className="sch-kpi-val" style={{ color: "#38bdf8" }}>
            {totalCapacity.toLocaleString()} Seats
          </div>
          <div className="sch-kpi-sub">
            <span>{totalEnrolled.toLocaleString()} currently occupied</span>
          </div>
        </div>

        <div className="sch-kpi-card">
          <div className="sch-kpi-top">
            <span className="sch-kpi-label">Capacity Utilization</span>
            <span className="sch-kpi-icon">📊</span>
          </div>
          <div className="sch-kpi-val" style={{ color: "#34d399" }}>
            {Math.round((totalEnrolled / totalCapacity) * 100)}%
          </div>
          <div className="sch-kpi-sub">Optimal operational range</div>
        </div>

        <div className="sch-kpi-card">
          <div className="sch-kpi-top">
            <span className="sch-kpi-label">Total Classrooms</span>
            <span className="sch-kpi-icon">🏫</span>
          </div>
          <div className="sch-kpi-val">94 Classrooms</div>
          <div className="sch-kpi-sub">Smart-board & Wi-Fi equipped</div>
        </div>
      </div>

      {/* Campus Cards Grid */}
      <div className="cm-campus-grid">
        {campuses.map((campus) => {
          const utilPct = Math.round((campus.enrolled / campus.capacity) * 100);
          return (
            <div key={campus.id} className="cm-campus-card">
              <div>
                <div className="cm-campus-header">
                  <div>
                    <h3 className="cm-campus-name">{campus.name}</h3>
                    <span className="cm-campus-code">{campus.code}</span>
                  </div>
                  <span
                    className={`sch-badge ${
                      campus.status === "Active" ? "sch-badge-success" : "sch-badge-warning"
                    }`}
                  >
                    {campus.status}
                  </span>
                </div>

                <div className="cm-campus-info-row">
                  <span>📍</span>
                  <span>{campus.address}</span>
                </div>

                <div className="cm-campus-info-row">
                  <span>👤</span>
                  <span>Head: <strong>{campus.head}</strong> ({campus.headRole})</span>
                </div>

                <div className="cm-campus-info-row">
                  <span>📞</span>
                  <span>{campus.phone}</span>
                </div>

                {/* Capacity Gauge */}
                <div className="cm-capacity-box">
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                    <span style={{ color: "#94a3b8" }}>Student Occupancy</span>
                    <strong>
                      {campus.enrolled} / {campus.capacity} ({utilPct}%)
                    </strong>
                  </div>
                  <div className="cm-capacity-bar">
                    <div className="cm-capacity-fill" style={{ width: `${utilPct}%` }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#64748b", marginTop: "8px" }}>
                    <span>{campus.classrooms} Active Classrooms</span>
                    <span>{campus.faculty} Faculty Staff</span>
                  </div>
                </div>

                {/* Facilities List */}
                <div style={{ marginBottom: "8px", fontSize: "12px", color: "#94a3b8", fontWeight: 700 }}>
                  KEY FACILITIES & AMENITIES:
                </div>
                <div className="cm-tags-wrap">
                  {campus.facilities.map((fac, idx) => (
                    <span key={idx} className="cm-facility-tag">
                      ✓ {fac}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", marginTop: "16px", paddingTop: "14px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <button
                  type="button"
                  className="school-nav-btn"
                  style={{ fontSize: "11px" }}
                  onClick={() => handleToggleStatus(campus.id)}
                >
                  {campus.status === "Active" ? "Set Maintenance" : "Activate Branch"}
                </button>
                <button
                  type="button"
                  className="school-nav-btn school-nav-btn-highlight"
                  style={{ fontSize: "11px" }}
                  onClick={() => showToast(`Viewing detailed facilities report for ${campus.name}...`)}
                >
                  Inspect Campus →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Add Campus */}
      {showAddModal && (
        <div className="cm-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="cm-modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ margin: 0, fontSize: "18px", color: "#ffffff" }}>
                Add New Campus / Branch
              </h2>
              <button
                type="button"
                style={{ background: "transparent", border: "none", color: "#94a3b8", fontSize: "20px", cursor: "pointer" }}
                onClick={() => setShowAddModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCampus}>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label className="sp-form-label">Campus Name *</label>
                  <input
                    type="text"
                    required
                    className="sp-form-input"
                    placeholder="e.g. Richmond Sports & Athletics Complex"
                    value={newCampus.name}
                    onChange={(e) => setNewCampus({ ...newCampus, name: e.target.value })}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label className="sp-form-label">Branch Code *</label>
                    <input
                      type="text"
                      required
                      className="sp-form-input"
                      placeholder="e.g. RSA-COMPLEX"
                      value={newCampus.code}
                      onChange={(e) => setNewCampus({ ...newCampus, code: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="sp-form-label">Branch Type</label>
                    <select
                      className="sp-form-input"
                      value={newCampus.type}
                      onChange={(e) => setNewCampus({ ...newCampus, type: e.target.value })}
                    >
                      <option value="Secondary Academic Branch">Secondary Academic Branch</option>
                      <option value="STEM & Innovation Center">STEM & Innovation Center</option>
                      <option value="Athletics & Sports Complex">Athletics & Sports Complex</option>
                      <option value="Arts & Music Conservatory">Arts & Music Conservatory</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label className="sp-form-label">Campus Director / Head</label>
                    <input
                      type="text"
                      className="sp-form-input"
                      placeholder="e.g. Dr. Jonathan Miller"
                      value={newCampus.head}
                      onChange={(e) => setNewCampus({ ...newCampus, head: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="sp-form-label">Contact Phone</label>
                    <input
                      type="text"
                      className="sp-form-input"
                      placeholder="e.g. +44 (0) 20 7946 0999"
                      value={newCampus.phone}
                      onChange={(e) => setNewCampus({ ...newCampus, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="sp-form-label">Physical Street Address *</label>
                  <input
                    type="text"
                    required
                    className="sp-form-input"
                    placeholder="e.g. 10 Petersham Rd, Richmond, London"
                    value={newCampus.address}
                    onChange={(e) => setNewCampus({ ...newCampus, address: e.target.value })}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label className="sp-form-label">Max Student Capacity</label>
                    <input
                      type="number"
                      className="sp-form-input"
                      value={newCampus.capacity}
                      onChange={(e) => setNewCampus({ ...newCampus, capacity: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="sp-form-label">Classrooms Count</label>
                    <input
                      type="number"
                      className="sp-form-input"
                      value={newCampus.classrooms}
                      onChange={(e) => setNewCampus({ ...newCampus, classrooms: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="sp-form-label">Key Facilities (Comma-separated)</label>
                  <input
                    type="text"
                    className="sp-form-input"
                    placeholder="e.g. Olympic Track, Tennis Courts, Science Labs"
                    value={newCampus.facilities}
                    onChange={(e) => setNewCampus({ ...newCampus, facilities: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "24px" }}>
                <button
                  type="button"
                  className="school-nav-btn"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="school-nav-btn school-nav-btn-highlight"
                >
                  Add Campus Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CampusManagement;
