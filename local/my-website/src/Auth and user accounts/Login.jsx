import React, { useState, useEffect } from "react";
import profile from "../assets/Screenshot From 2026-09-19 18-38-18.png";
import "./header.css";
import {
  getSchoolAdmins,
  authenticateSchoolAdmin,
  setActiveSchoolAdmin,
} from "../Platform Administration/schoolAdminAuth";

const THEMES = [
  { id: "indigo", name: "Midnight Indigo", bg: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)", isDark: true },
  { id: "slate", name: "Modern Dark", bg: "linear-gradient(135deg, #18181b 0%, #27272a 50%, #09090b 100%)", isDark: true },
  { id: "emerald", name: "Emerald Forest", bg: "linear-gradient(135deg, #022c22 0%, #064e3b 50%, #0f172a 100%)", isDark: true },
  { id: "light", name: "Soft Cloud", bg: "linear-gradient(135deg, #e0e7ff 0%, #f1f5f9 50%, #e2e8f0 100%)", isDark: false },
];

function Login({ onNavigate }) {
  const [activeTheme, setActiveTheme] = useState(THEMES[0]);
  const [role, setRole] = useState("Staff / Teacher");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [schoolAdminsList, setSchoolAdminsList] = useState(() => getSchoolAdmins());

  useEffect(() => {
    setSchoolAdminsList(getSchoolAdmins());
  }, []);

  const handleThemeChange = (theme) => {
    setActiveTheme(theme);
    document.body.style.background = theme.bg;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAlert(null);

    if (!email.trim() || !password.trim()) {
      setAlert({ message: "Please fill in all required fields.", type: "error" });
      return;
    }

    if (isRegister && password !== confirmPassword) {
      setAlert({ message: "Passwords do not match!", type: "error" });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const userIdentifier = email.split("@")[0];

      if (isRegister) {
        setAlert({
          message: `Account created successfully for ${email} as ${role}!`,
          type: "success",
        });
        setIsRegister(false);
      } else {
        const isPlatformAdmin =
          email.toLowerCase().includes("platform") ||
          password === "Platform@2026";

        if (isPlatformAdmin) {
          localStorage.setItem("platform_admin_auth", "true");
          setAlert({
            message: `✓ Multi-School Platform Super Admin Authenticated! Redirecting to Platform Management...`,
            type: "success",
          });
          if (onNavigate) {
            setTimeout(() => onNavigate("platform-dashboard"), 800);
          }
          return;
        }

        // Authenticate against school-based admin credentials
        const schoolAuth = authenticateSchoolAdmin(email, password);
        if (schoolAuth.success) {
          const a = schoolAuth.admin;
          setAlert({
            message: `✓ Verified Administrator for ${a.schoolName} (${a.adminName})! Redirecting to School Portal...`,
            type: "success",
          });
          if (onNavigate) {
            setTimeout(() => onNavigate("user-management"), 850);
          }
          return;
        }

        // Check if email belongs to a school admin but password was incorrect
        const allAdmins = getSchoolAdmins();
        const matchedAdmin = allAdmins.find(
          (a) => a.email.toLowerCase() === email.trim().toLowerCase()
        );
        if (matchedAdmin) {
          setAlert({
            message: `Authentication failed: Incorrect password for ${matchedAdmin.schoolName}. Password is: ${matchedAdmin.password}`,
            type: "error",
          });
          return;
        }

        const isAdmin = role === "Administrator" || email.toLowerCase().includes("admin");
        if (isAdmin) {
          setAlert({
            message: `✓ Welcome, System Administrator! Redirecting to Administration Portal...`,
            type: "success",
          });
          if (onNavigate) {
            setTimeout(() => onNavigate("user-management"), 900);
          }
        } else {
          setAlert({
            message: `Welcome back, ${userIdentifier}! Signed in successfully as ${role}.`,
            type: "success",
          });
        }
      }

      setPassword("");
      setConfirmPassword("");
    }, 700);
  };

  const handleForgotPasswordClick = (e) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate("forgot-password");
    } else {
      setAlert({
        message: "Redirecting to password recovery...",
        type: "success",
      });
    }
  };

  return (
    <div className={`header-page-container ${activeTheme.isDark ? "theme-dark" : "theme-light"}`}>
      <header className="header-card">
        {/* Top bar with theme changer & register toggle */}
        <div className="header-top-bar">
          <div className="theme-selector" title="Change Background Colour">
            <span className="theme-label">Theme:</span>
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                type="button"
                className={`theme-dot ${activeTheme.id === theme.id ? "active" : ""}`}
                style={{ background: theme.bg }}
                onClick={() => handleThemeChange(theme)}
                title={`Switch to ${theme.name}`}
              />
            ))}
          </div>

          <a
            className="register"
            href="#register"
            onClick={(e) => {
              e.preventDefault();
              setIsRegister(!isRegister);
              setAlert(null);
            }}
          >
            {isRegister ? "ALREADY HAVE AN ACCOUNT? SIGN IN" : "REGISTER HERE"}
          </a>
        </div>

        {/* Website & Portal Title */}
        <h1 className="h1">School Management System</h1>

        {/* Alert Notification */}
        {alert && (
          <div className={`alert-banner ${alert.type}`}>
            <span>{alert.type === "success" ? "✓ " : "⚠ "}</span>
            <span>{alert.message}</span>
            <button
              type="button"
              className="alert-close"
              onClick={() => setAlert(null)}
            >
              ×
            </button>
          </div>
        )}

        {/* Side-by-side header content: Image at side of login */}
        <div className="header-content">
          <div className="image-wrapper">
            <img className="img" src={profile} alt="School Portal" />
          </div>

          <nav className="login-nav">
            <form onSubmit={handleSubmit} className="login-form">
              <h2 className="form-heading">
                {isRegister ? "CREATE ACCOUNT" : "SIGN IN"}
              </h2>
              <p className="form-subtext">
                {isRegister
                  ? "Register for your school portal account"
                  : "Enter your credentials to access the system"}
              </p>

              {/* Role Selection Tabs */}
              <div className="role-tabs">
                {["Staff / Teacher", "Student", "Administrator"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={`role-tab ${role === r ? "active" : ""}`}
                    onClick={() => setRole(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>

              {/* School Admin Quick-Selector (Each School's Password) */}
              {role === "Administrator" && !isRegister && (
                <div
                  style={{
                    background: "rgba(99, 102, 241, 0.12)",
                    border: "1px solid rgba(99, 102, 241, 0.3)",
                    borderRadius: "10px",
                    padding: "10px 12px",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "6px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "#c7d2fe",
                        textTransform: "uppercase",
                      }}
                    >
                      🏫 Quick-Select School Admin
                    </span>
                    <span style={{ fontSize: "10px", color: "#818cf8" }}>
                      School-based passwords
                    </span>
                  </div>
                  <select
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      background: "rgba(15, 23, 42, 0.9)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "6px",
                      color: "#f1f5f9",
                      fontSize: "12px",
                      cursor: "pointer",
                      outline: "none",
                    }}
                    onChange={(e) => {
                      if (!e.target.value) return;
                      const admin = schoolAdminsList.find((a) => a.id === e.target.value);
                      if (admin) {
                        setEmail(admin.email);
                        setPassword(admin.password);
                        setAlert({
                          type: "success",
                          message: `Selected ${admin.schoolName}: Email '${admin.email}' & Password '${admin.password}' loaded!`,
                        });
                      }
                    }}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      -- Select School Admin to Auto-fill --
                    </option>
                    {schoolAdminsList.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.schoolName} ({a.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Email / Identifier Field */}
              <div className="form-field">
                <label className="form-label">Email or School ID</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@school.edu or STU-1024"
                    required
                  />
                </div>
              </div>

              {/* Password Field with Eye Toggle */}
              <div className="form-field">
                <label className="form-label">Password</label>
                <div className="input-wrapper">
                  <input
                    className="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "👁️" : "🙈"}
                  </button>
                </div>
              </div>

              {/* Confirm Password (only in registration mode) */}
              {isRegister && (
                <div className="form-field">
                  <label className="form-label">Confirm Password</label>
                  <div className="input-wrapper">
                    <input
                      className="password"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Remember Me and Forgot Password row (login mode) */}
              {!isRegister && (
                <div className="checkbox-row">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    Remember my device
                  </label>
                  <a
                    href="#forgot-password"
                    className="forgot-link"
                    onClick={handleForgotPasswordClick}
                  >
                    FORGET PASSWORD?
                  </a>
                </div>
              )}

              {/* Submit Button */}
              <button className="submit" type="submit" disabled={isLoading}>
                {isLoading
                  ? isRegister ? "Creating Account..." : "Signing in..."
                  : isRegister ? "Sign Up" : "Submit"}
              </button>

              {/* IT Helpdesk Contact */}
              <div className="helpdesk-footer">
                Need assistance? Contact{" "}
                <a href="mailto:support@school.edu">IT Helpdesk</a>
                <div style={{ marginTop: "10px", fontSize: "12px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "10px" }}>
                  <a
                    href="#platform"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onNavigate) onNavigate("platform-login");
                    }}
                    style={{ color: "#818cf8", textDecoration: "none", fontWeight: 600 }}
                  >
                    🌐 Multi-School Platform Admin Login →
                  </a>
                </div>
              </div>
            </form>
          </nav>
        </div>
      </header>
    </div>
  );
}

export default Login;
