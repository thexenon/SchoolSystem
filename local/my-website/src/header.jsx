import React, { useState } from "react";
import profile from "./assets/Screenshot From 2026-09-19 18-38-18.png";
import "./header.css";

const THEMES = [
  { id: "indigo", name: "Midnight Indigo", bg: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)", isDark: true },
  { id: "slate", name: "Modern Dark", bg: "linear-gradient(135deg, #18181b 0%, #27272a 50%, #09090b 100%)", isDark: true },
  { id: "emerald", name: "Emerald Forest", bg: "linear-gradient(135deg, #022c22 0%, #064e3b 50%, #0f172a 100%)", isDark: true },
  { id: "light", name: "Soft Cloud", bg: "linear-gradient(135deg, #e0e7ff 0%, #f1f5f9 50%, #e2e8f0 100%)", isDark: false },
];

function Header() {
  const [activeTheme, setActiveTheme] = useState(THEMES[0]);
  const [isRegister, setIsRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
      const username = email.split("@")[0];
      if (isRegister) {
        setAlert({
          message: `Account created successfully! Welcome aboard, ${username}.`,
          type: "success",
        });
        setIsRegister(false);
      } else {
        setAlert({
          message: `Welcome back, ${username}! Login successful.`,
          type: "success",
        });
      }
      setPassword("");
      setConfirmPassword("");
    }, 600);
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setAlert({ message: "Please enter your email address.", type: "error" });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAlert({
        message: `Password reset link sent to ${email}! Check your inbox.`,
        type: "success",
      });
      setShowForgotPassword(false);
    }, 600);
  };

  return (
    <div className={`header-page-container ${activeTheme.isDark ? "theme-dark" : "theme-light"}`}>
      <header className="header-card">
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
              setShowForgotPassword(false);
              setAlert(null);
            }}
          >
            {isRegister ? "ALREADY HAVE AN ACCOUNT? LOGIN" : "REGISTER HERE"}
          </a>
        </div>

        <h1 className="h1">My Website</h1>

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

        <div className="header-content">
          <div className="image-wrapper">
            <img className="img" src={profile} alt="Profile" />
          </div>

          <nav className="login-nav">
            {showForgotPassword ? (
              <form onSubmit={handleForgotPasswordSubmit} className="login-form">
                <h2 className="form-heading">RESET PASSWORD</h2>
                <p className="form-subtext">Enter your email to receive recovery instructions</p>

                <div className="form-field">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <button className="submit" type="submit" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </button>

                <div className="form-footer">
                  <a
                    href="#login"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowForgotPassword(false);
                      setAlert(null);
                    }}
                  >
                    ← Back to Login
                  </a>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="login-form">
                <h2 className="form-heading">{isRegister ? "CREATE ACCOUNT" : "LOGIN"}</h2>

                <div className="form-field">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                    required
                  />
                </div>

                <div className="form-field password-field">
                  <input
                    className="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
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

                {isRegister && (
                  <div className="form-field">
                    <input
                      className="password"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      required
                    />
                  </div>
                )}

                <button className="submit" type="submit" disabled={isLoading}>
                  {isLoading ? "Processing..." : isRegister ? "Sign Up" : "Submit"}
                </button>

                {!isRegister && (
                  <div className="form-footer">
                    <a
                      href="#forgot"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowForgotPassword(true);
                        setAlert(null);
                      }}
                    >
                      FORGET PASSWORD?
                    </a>
                  </div>
                )}
              </form>
            )}
          </nav>
        </div>
      </header>
    </div>
  );
}

export default Header;