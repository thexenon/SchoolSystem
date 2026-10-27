import React, { useState } from "react";
import "./auth.css";

function UserProfile({ onNavigate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "Sarah",
    lastName: "Jenkins",
    email: "s.jenkins@school.edu",
    phone: "+1 (555) 234-5678",
    role: "Senior Instructor",
    department: "Science & Mathematics",
    idNumber: "STAFF-2024-912",
    dateOfBirth: "1988-06-14",
    gender: "Female",
    address: "742 Evergreen Terrace, Springfield",
    emergencyContact: "David Jenkins (+1 555-987-6543)",
    notificationsEmail: true,
    notificationsSMS: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="sms-page-wrapper">
      <div className="sms-dashboard-card">
        {/* Top bar with back or breadcrumb */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <span className="sms-portal-badge">Account Settings</span>
            <h1 className="sms-title" style={{ textAlign: "left" }}>User Profile</h1>
          </div>
          {onNavigate && (
            <button
              type="button"
              className="sms-btn sms-btn-secondary sms-btn-sm"
              onClick={() => onNavigate("user-management")}
            >
              View User Directory →
            </button>
          )}
        </div>

        {saveSuccess && (
          <div className="sms-alert sms-alert-success">
            ✓ Profile information updated successfully!
          </div>
        )}

        {/* Profile Header Banner */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            background: "#f8fafc",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid var(--auth-border)",
            marginBottom: "24px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--auth-primary) 0%, #818cf8 100%)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              fontWeight: 700,
              boxShadow: "0 4px 10px rgba(79, 70, 229, 0.25)",
            }}
          >
            {formData.firstName[0]}{formData.lastName[0]}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>
                {formData.firstName} {formData.lastName}
              </h2>
              <span className="sms-badge sms-badge-active">Active</span>
              <span className="sms-badge sms-badge-role">{formData.role}</span>
            </div>
            <div style={{ color: "var(--auth-text-muted)", fontSize: "13px", marginTop: "4px" }}>
              ID: <strong>{formData.idNumber}</strong> • {formData.department}
            </div>
          </div>

          <div>
            <button
              type="button"
              className={`sms-btn ${isEditing ? "sms-btn-secondary" : "sms-btn-primary"}`}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel Editing" : "✎ Edit Profile"}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="sms-tabs">
          <button
            type="button"
            className={`sms-tab ${activeTab === "general" ? "active" : ""}`}
            onClick={() => setActiveTab("general")}
          >
            Personal Information
          </button>
          <button
            type="button"
            className={`sms-tab ${activeTab === "academic" ? "active" : ""}`}
            onClick={() => setActiveTab("academic")}
          >
            Academic & Department
          </button>
          <button
            type="button"
            className={`sms-tab ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            Security & Preferences
          </button>
        </div>

        <form onSubmit={handleSave}>
          {activeTab === "general" && (
            <div className="sms-grid-2">
              <div className="sms-form-group">
                <label className="sms-label">First Name</label>
                <input
                  className="sms-input"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="sms-form-group">
                <label className="sms-label">Last Name</label>
                <input
                  className="sms-input"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="sms-form-group">
                <label className="sms-label">Email Address</label>
                <input
                  className="sms-input"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="sms-form-group">
                <label className="sms-label">Phone Number</label>
                <input
                  className="sms-input"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="sms-form-group">
                <label className="sms-label">Date of Birth</label>
                <input
                  className="sms-input"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="sms-form-group">
                <label className="sms-label">Residential Address</label>
                <input
                  className="sms-input"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
          )}

          {activeTab === "academic" && (
            <div className="sms-grid-2">
              <div className="sms-form-group">
                <label className="sms-label">Employee / Student ID</label>
                <input className="sms-input" value={formData.idNumber} disabled />
              </div>

              <div className="sms-form-group">
                <label className="sms-label">Assigned Department</label>
                <input
                  className="sms-input"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="sms-form-group">
                <label className="sms-label">Official Designation</label>
                <input
                  className="sms-input"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="sms-form-group">
                <label className="sms-label">Emergency Contact Info</label>
                <input
                  className="sms-input"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div
                style={{
                  background: "#f8fafc",
                  padding: "16px",
                  borderRadius: "8px",
                  border: "1px solid var(--auth-border)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>Password</div>
                  <div style={{ fontSize: "13px", color: "var(--auth-text-muted)" }}>
                    Last changed 3 months ago
                  </div>
                </div>
                <button
                  type="button"
                  className="sms-btn sms-btn-secondary sms-btn-sm"
                  onClick={() => {
                    if (onNavigate) onNavigate("reset-password");
                  }}
                >
                  Change Password
                </button>
              </div>

              <div
                style={{
                  background: "#f8fafc",
                  padding: "16px",
                  borderRadius: "8px",
                  border: "1px solid var(--auth-border)",
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: "12px" }}>Notification Channels</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <label className="sms-checkbox-label">
                    <input
                      type="checkbox"
                      name="notificationsEmail"
                      checked={formData.notificationsEmail}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    Receive critical alerts & announcements via Email
                  </label>
                  <label className="sms-checkbox-label">
                    <input
                      type="checkbox"
                      name="notificationsSMS"
                      checked={formData.notificationsSMS}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    Receive SMS alerts for emergency closures & reminders
                  </label>
                </div>
              </div>
            </div>
          )}

          {isEditing && (
            <div style={{ display: "flex", gap: "12px", marginTop: "24px", justifyContent: "flex-end" }}>
              <button
                type="button"
                className="sms-btn sms-btn-secondary"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button type="submit" className="sms-btn sms-btn-primary">
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default UserProfile;
