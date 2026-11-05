import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SchoolDashboard.css";
import "./SchoolProfile.css";
import { getActiveSchoolAdmin } from "../Platform Administration/schoolAdminAuth";

function SchoolProfile({ onNavigate }) {
  const activeAdmin = getActiveSchoolAdmin();
  const initialName = activeAdmin?.schoolName || "St. Mary International Academy";
  const initialCode = activeAdmin?.schoolCode || "SMIA";

  const [formData, setFormData] = useState({
    name: initialName,
    code: initialCode,
    motto: "Excellence in Education, Character, and Innovation",
    establishedYear: "1994",
    accreditation: "International Baccalaureate (IB World) & Cambridge Assessment",
    schoolType: "Co-educational Day & Boarding School",
    email: activeAdmin?.email || "office@stmarys.edu",
    phone: "+44 (0) 20 7946 0921",
    admissionsPhone: "+44 (0) 20 7946 0925",
    website: "https://stmarys-international.edu",
    streetAddress: "142 Queen's Gate, Kensington",
    city: "London",
    state: "Greater London",
    postalCode: "SW7 5HR",
    country: "United Kingdom",
    principalName: activeAdmin?.adminName || "Dr. Eleanor Vance",
    principalEmail: activeAdmin?.email || "principal@stmarys.edu",
    taxId: "GB-EDU-88920194",
  });

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const navigateTo = (screen) => {
    if (onNavigate) onNavigate(screen);
  };

  const handleSave = (e) => {
    e.preventDefault();
    showToast(`✓ School profile for "${formData.name}" successfully updated!`);
  };

  return (
    <div className="sch-page-wrapper">
      {/* Navigation */}
      <nav className="school-nav-bar">
        <div className="school-brand">
          <div className="school-logo-badge">{formData.code.substring(0, 2)}</div>
          <div>
            <div className="school-brand-title">{formData.name}</div>
            <div className="school-brand-subtitle">School Profile & Institutional Directory</div>
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
            className="school-menu-item active"
            onClick={() => navigateTo("school-profile")}
          >
            🏫 School Profile
          </button>
          <button
            type="button"
            className="school-menu-item"
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
          <h1 className="sch-title">Institutional School Profile</h1>
          <p className="sch-subtitle">
            Manage your school's name, visual branding, official credentials, contact details, and registered address
          </p>
        </div>
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

      {/* Visual Logo Banner */}
      <div className="sp-banner">
        <div className="sp-logo-preview">
          {formData.code.substring(0, 3)}
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: "22px", fontWeight: 800, margin: "0 0 6px 0", color: "#ffffff" }}>
            {formData.name}
          </h2>
          <p style={{ margin: "0 0 10px 0", color: "#c7d2fe", fontSize: "14px", fontStyle: "italic" }}>
            "{formData.motto}"
          </p>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <span className="sch-badge sch-badge-info">Code: {formData.code}</span>
            <span className="sch-badge sch-badge-success">Est. {formData.establishedYear}</span>
            <span className="sch-badge sch-badge-warning">{formData.accreditation.split("&")[0]}</span>
          </div>
          <div>
            <label className="sp-logo-upload-btn">
              📷 Upload New Institution Logo / Crest
              <input type="file" accept="image/*" style={{ display: "none" }} onChange={() => showToast("✓ Logo updated in preview!")} />
            </label>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave}>
        {/* Core Identity */}
        <div className="sp-card">
          <h3 className="sp-section-heading">
            <span>🏛️</span> Institution Identity & Accreditation
          </h3>
          <div className="sp-form-grid">
            <div className="sp-form-group">
              <label className="sp-form-label">School Official Name *</label>
              <input
                type="text"
                className="sp-form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="sp-form-group">
              <label className="sp-form-label">School Code (Acronym) *</label>
              <input
                type="text"
                className="sp-form-input"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
              />
            </div>

            <div className="sp-form-group">
              <label className="sp-form-label">School Motto / Vision</label>
              <input
                type="text"
                className="sp-form-input"
                value={formData.motto}
                onChange={(e) => setFormData({ ...formData, motto: e.target.value })}
              />
            </div>

            <div className="sp-form-group">
              <label className="sp-form-label">Established Year</label>
              <input
                type="text"
                className="sp-form-input"
                value={formData.establishedYear}
                onChange={(e) => setFormData({ ...formData, establishedYear: e.target.value })}
              />
            </div>

            <div className="sp-form-group">
              <label className="sp-form-label">Accreditation Body</label>
              <input
                type="text"
                className="sp-form-input"
                value={formData.accreditation}
                onChange={(e) => setFormData({ ...formData, accreditation: e.target.value })}
              />
            </div>

            <div className="sp-form-group">
              <label className="sp-form-label">Institution Category</label>
              <input
                type="text"
                className="sp-form-input"
                value={formData.schoolType}
                onChange={(e) => setFormData({ ...formData, schoolType: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="sp-card">
          <h3 className="sp-section-heading">
            <span>📞</span> Official Contact & Digital Channels
          </h3>
          <div className="sp-form-grid">
            <div className="sp-form-group">
              <label className="sp-form-label">General Administrative Email *</label>
              <input
                type="email"
                className="sp-form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="sp-form-group">
              <label className="sp-form-label">Official Website URL</label>
              <input
                type="url"
                className="sp-form-input"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </div>

            <div className="sp-form-group">
              <label className="sp-form-label">Main Switchboard Phone *</label>
              <input
                type="text"
                className="sp-form-input"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div className="sp-form-group">
              <label className="sp-form-label">Admissions Hotline</label>
              <input
                type="text"
                className="sp-form-input"
                value={formData.admissionsPhone}
                onChange={(e) => setFormData({ ...formData, admissionsPhone: e.target.value })}
              />
            </div>

            <div className="sp-form-group">
              <label className="sp-form-label">Head Principal / Director</label>
              <input
                type="text"
                className="sp-form-input"
                value={formData.principalName}
                onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
              />
            </div>

            <div className="sp-form-group">
              <label className="sp-form-label">Institutional Tax / Registry ID</label>
              <input
                type="text"
                className="sp-form-input"
                value={formData.taxId}
                onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Physical Address */}
        <div className="sp-card">
          <h3 className="sp-section-heading">
            <span>📍</span> Physical Headquarters & Campus Address
          </h3>
          <div className="sp-form-grid">
            <div className="sp-form-group" style={{ gridColumn: "span 2" }}>
              <label className="sp-form-label">Street Address *</label>
              <input
                type="text"
                className="sp-form-input"
                value={formData.streetAddress}
                onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                required
              />
            </div>

            <div className="sp-form-group">
              <label className="sp-form-label">City / Town *</label>
              <input
                type="text"
                className="sp-form-input"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>

            <div className="sp-form-group">
              <label className="sp-form-label">State / Province / County</label>
              <input
                type="text"
                className="sp-form-input"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
            </div>

            <div className="sp-form-group">
              <label className="sp-form-label">Postal / ZIP Code</label>
              <input
                type="text"
                className="sp-form-input"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              />
            </div>

            <div className="sp-form-group">
              <label className="sp-form-label">Country *</label>
              <input
                type="text"
                className="sp-form-input"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                required
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginBottom: "40px" }}>
          <button
            type="button"
            className="school-nav-btn"
            onClick={() => navigateTo("school-dashboard")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="school-nav-btn school-nav-btn-highlight"
            style={{ padding: "12px 24px", fontSize: "14px" }}
          >
            💾 Save Profile Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default SchoolProfile;
