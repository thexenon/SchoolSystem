import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SchoolLogin.css";
import {
  getSchoolAdmins,
  authenticateSchoolAdmin,
  switchActiveSchool,
} from "../Platform Administration/schoolAdminAuth";

function SchoolLogin({ onSuccess, onNavigate }) {
  const schoolAdmins = getSchoolAdmins();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberSession, setRememberSession] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // Quick Select an existing school admin
  const handleSelectSchoolAdmin = (schoolId) => {
    const admin = schoolAdmins.find((a) => a.schoolId === schoolId || a.id === schoolId);
    if (admin) {
      setEmail(admin.email);
      setPassword(admin.password);
      setAlert({
        type: "success",
        message: `Loaded credentials for ${admin.schoolName} (${admin.adminName})! Click 'Authenticate School Session' below.`,
      });
    }
  };

  // Quick Fast-Track for Platform Super Admin
  const handlePlatformBossFastTrack = () => {
    setEmail("admin@platform.schoolhub.net");
    setPassword("Platform@2026");
    setAlert({
      type: "success",
      message: "👑 Multi-School Platform Super Admin credentials loaded! You will have access to all schools.",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAlert(null);

    if (!email.trim()) {
      setAlert({
        type: "error",
        message: "Please enter your School Administrator email address.",
      });
      return;
    }

    if (!password.trim()) {
      setAlert({
        type: "error",
        message: "Please enter your school portal password.",
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const res = authenticateSchoolAdmin(email, password);

      if (res.success) {
        if (rememberSession) {
          localStorage.setItem("school_admin_auth", "true");
        } else {
          sessionStorage.setItem("school_admin_auth", "true");
        }

        const institution = res.admin?.schoolName || "School Administration";
        setAlert({
          type: "success",
          message: res.isPlatformBoss
            ? `👑 Welcome Multi-School Platform Super Admin! Entering ${institution}...`
            : `✓ Verified! Welcome ${res.admin?.adminName} (${res.admin?.adminTitle}) to ${institution}!`,
        });

        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          } else if (onNavigate) {
            onNavigate("school-dashboard");
          }
        }, 700);
      } else {
        // Helpful error hint
        const matched = schoolAdmins.find(
          (a) => a.email.toLowerCase() === email.trim().toLowerCase()
        );
        if (matched) {
          setAlert({
            type: "error",
            message: `Authentication failed: Incorrect password for ${matched.schoolName}. Password is: '${matched.password}'.`,
          });
        } else {
          setAlert({
            type: "error",
            message:
              "Authentication failed: Invalid school credentials. Use a registered school administrator login or Multi-School Super Admin 'Platform@2026'.",
          });
        }
      }
    }, 600);
  };

  return (
    <div className="scl-wrapper">
      <div className="scl-container">
        {/* Brand Header */}
        <div className="scl-brand-header">
          <div className="scl-logo-badge">🏫</div>
          <h1 className="scl-title">School Administration Gateway</h1>
          <p className="scl-subtitle">
            Single-school administration portal for Principals, Campus Deans, and Platform Supervisors
          </p>
        </div>

        {/* Login Box */}
        <div className="scl-card">
          <div className="scl-security-banner">
            <span className="scl-security-icon">🛡️</span>
            <div>
              <strong>Secure Portal Login:</strong> School administrative credentials required. Multi-School Super Admin has universal access.
            </div>
          </div>

          {/* Quick-Select School Admin Demo Helper */}
          <div className="scl-quick-select-card">
            <div className="scl-quick-header">
              <span className="scl-quick-label">⚡ Quick-Select School Admin</span>
              <span style={{ fontSize: "11px", color: "#94a3b8" }}>School-specific passwords</span>
            </div>
            <select
              className="scl-select"
              defaultValue=""
              onChange={(e) => handleSelectSchoolAdmin(e.target.value)}
            >
              <option value="" disabled>
                -- Choose a School Admin to Auto-fill --
              </option>
              {schoolAdmins.map((a) => (
                <option key={a.id} value={a.schoolId}>
                  {a.schoolName} ({a.adminName})
                </option>
              ))}
            </select>

            <button
              type="button"
              className="scl-boss-btn"
              onClick={handlePlatformBossFastTrack}
            >
              👑 Sign in as Multi-School Platform Super Admin (Overall Boss)
            </button>
          </div>

          {/* Alert Message */}
          {alert && (
            <div
              className={`scl-alert ${
                alert.type === "error" ? "scl-alert-error" : "scl-alert-success"
              }`}
            >
              <span>{alert.type === "error" ? "⚠️" : "✓"}</span>
              <span>{alert.message}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="scl-form-group">
              <label className="scl-label">Administrator Official Email</label>
              <div className="scl-input-wrapper">
                <span className="scl-input-icon">✉️</span>
                <input
                  type="email"
                  className="scl-input"
                  placeholder="e.g. admin@stmarys.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="scl-form-group">
              <label className="scl-label">
                <span>School Admin Password</span>
                <span style={{ fontSize: "11px", color: "#818cf8" }}>Required</span>
              </label>
              <div className="scl-input-wrapper">
                <span className="scl-input-icon">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="scl-input"
                  placeholder="Enter administrator password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="scl-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="scl-options-row">
              <label className="scl-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberSession}
                  onChange={(e) => setRememberSession(e.target.checked)}
                />
                <span>Remember session</span>
              </label>
              <span style={{ fontSize: "11px", color: "#64748b" }}>
                Encrypted Auth
              </span>
            </div>

            <button type="submit" className="scl-submit-btn" disabled={isLoading}>
              {isLoading ? "Verifying Credentials..." : "🔐 Authenticate School Session"}
            </button>
          </form>
        </div>

        {/* Footer Navigation */}
        <div className="scl-footer-nav">
          <Link to="/" className="scl-footer-link">
            ← Return to Hub
          </Link>
          <span className="scl-footer-sep">•</span>
          <Link to="/platform-login" className="scl-footer-link">
            🌐 Platform Boss Login
          </Link>
          <span className="scl-footer-sep">•</span>
          <Link to="/login" className="scl-footer-link">
            General Portal
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SchoolLogin;
