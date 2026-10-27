import React, { useState } from "react";
import "./auth.css";

function ResetPassword({ onNavigate }) {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);

  // Password requirements calculation
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const isMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const isValid = hasMinLength && hasUppercase && hasNumber && hasSpecial && isMatch;

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus(null);

    if (!isValid) {
      setStatus({
        type: "danger",
        text: "Please meet all password security criteria and ensure passwords match.",
      });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStatus({
        type: "success",
        text: "Your password has been successfully reset! You can now log in with your new credentials.",
      });
      setNewPassword("");
      setConfirmPassword("");
      setToken("");
    }, 800);
  };

  return (
    <div className="sms-page-wrapper">
      <div className="sms-auth-card">
        <div className="sms-header-section">
          <span className="sms-portal-badge">Security</span>
          <h1 className="sms-title">Reset Password</h1>
          <p className="sms-subtitle">
            Create a secure new password for your account
          </p>
        </div>

        {status && (
          <div className={`sms-alert sms-alert-${status.type}`}>
            {status.type === "success" ? "✓" : "⚠"} {status.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="sms-form">
          <div className="sms-form-group">
            <label className="sms-label">Security Reset Code / Token</label>
            <div className="sms-input-wrapper">
              <input
                className="sms-input"
                type="text"
                placeholder="Enter 6-digit code sent to email"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="sms-form-group">
            <label className="sms-label">New Password</label>
            <div className="sms-input-wrapper">
              <input
                className="sms-input"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="sms-input-toggle"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "👁️" : "🙈"}
              </button>
            </div>
          </div>

          <div className="sms-form-group">
            <label className="sms-label">Confirm New Password</label>
            <div className="sms-input-wrapper">
              <input
                className="sms-input"
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Criteria Checklist */}
          <div
            style={{
              background: "#f8fafc",
              padding: "12px",
              borderRadius: "8px",
              fontSize: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              border: "1px solid var(--auth-border)",
            }}
          >
            <div style={{ fontWeight: 600, color: "var(--auth-text-main)", marginBottom: "2px" }}>
              Password Requirements:
            </div>
            <div style={{ color: hasMinLength ? "var(--auth-success)" : "var(--auth-text-muted)" }}>
              {hasMinLength ? "✓" : "○"} At least 8 characters
            </div>
            <div style={{ color: hasUppercase ? "var(--auth-success)" : "var(--auth-text-muted)" }}>
              {hasUppercase ? "✓" : "○"} At least 1 uppercase letter (A-Z)
            </div>
            <div style={{ color: hasNumber ? "var(--auth-success)" : "var(--auth-text-muted)" }}>
              {hasNumber ? "✓" : "○"} At least 1 number (0-9)
            </div>
            <div style={{ color: hasSpecial ? "var(--auth-success)" : "var(--auth-text-muted)" }}>
              {hasSpecial ? "✓" : "○"} At least 1 special character (!@#$%^&*)
            </div>
            <div style={{ color: isMatch ? "var(--auth-success)" : "var(--auth-text-muted)" }}>
              {isMatch ? "✓" : "○"} Both passwords match
            </div>
          </div>

          <button
            type="submit"
            className="sms-btn sms-btn-primary"
            style={{ width: "100%", marginTop: "8px" }}
            disabled={isLoading || !isValid}
          >
            {isLoading ? "Updating password..." : "Confirm & Save Password"}
          </button>
        </form>

        <div style={{ marginTop: "24px", textAlign: "center", borderTop: "1px solid var(--auth-border)", paddingTop: "16px" }}>
          <a
            href="#login"
            className="sms-link"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate("login");
            }}
          >
            ← Return to Sign In
          </a>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
