import React, { useState } from "react";
import "./auth.css";

function ForgotPassword({ onNavigate }) {
  const [identifier, setIdentifier] = useState("");
  const [recoveryMethod, setRecoveryMethod] = useState("email");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim()) {
      setError("Please enter your registered email or school ID.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 800);
  };

  return (
    <div className="sms-page-wrapper">
      <div className="sms-auth-card">
        <div className="sms-header-section">
          <span className="sms-portal-badge">Account Recovery</span>
          <h1 className="sms-title">Forgot Password</h1>
          <p className="sms-subtitle">
            Recover access to your School Management account
          </p>
        </div>

        {error && (
          <div className="sms-alert sms-alert-danger">
            ⚠ {error}
          </div>
        )}

        {isSubmitted ? (
          <div>
            <div className="sms-alert sms-alert-success" style={{ flexDirection: "column", alignItems: "flex-start" }}>
              <div style={{ fontWeight: 700, marginBottom: "4px" }}>
                ✓ Recovery instructions dispatched!
              </div>
              <div style={{ fontSize: "13px", lineHeight: "1.4" }}>
                We've sent a password reset link to <strong>{identifier}</strong>. Please check your inbox and spam folders.
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "24px" }}>
              <button
                type="button"
                className="sms-btn sms-btn-primary"
                onClick={() => {
                  if (onNavigate) onNavigate("reset-password");
                }}
              >
                Proceed to Reset Password
              </button>

              <button
                type="button"
                className="sms-btn sms-btn-secondary"
                onClick={() => setIsSubmitted(false)}
              >
                Try Another Address
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="sms-form">
            <div style={{ fontSize: "13px", color: "var(--auth-text-muted)", lineHeight: 1.5 }}>
              Enter your registered school email address or student/staff identifier below to receive a secure password reset link.
            </div>

            <div className="sms-form-group">
              <label className="sms-label">Delivery Method</label>
              <div style={{ display: "flex", gap: "12px", marginTop: "2px" }}>
                <label className="sms-checkbox-label">
                  <input
                    type="radio"
                    name="method"
                    value="email"
                    checked={recoveryMethod === "email"}
                    onChange={(e) => setRecoveryMethod(e.target.value)}
                  />
                  School Email
                </label>
                <label className="sms-checkbox-label">
                  <input
                    type="radio"
                    name="method"
                    value="sms"
                    checked={recoveryMethod === "sms"}
                    onChange={(e) => setRecoveryMethod(e.target.value)}
                  />
                  Registered SMS
                </label>
              </div>
            </div>

            <div className="sms-form-group">
              <label className="sms-label">
                {recoveryMethod === "email" ? "School Email Address" : "Registered Mobile Number / Staff ID"}
              </label>
              <div className="sms-input-wrapper">
                <input
                  className="sms-input"
                  type={recoveryMethod === "email" ? "email" : "text"}
                  placeholder={recoveryMethod === "email" ? "teacher@school.edu" : "+1 (555) 000-0000"}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="sms-btn sms-btn-primary"
              style={{ width: "100%", marginTop: "8px" }}
              disabled={isLoading}
            >
              {isLoading ? "Sending link..." : "Send Reset Instructions"}
            </button>
          </form>
        )}

        <div style={{ marginTop: "24px", textAlign: "center", borderTop: "1px solid var(--auth-border)", paddingTop: "16px" }}>
          <a
            href="#login"
            className="sms-link"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate("login");
            }}
          >
            ← Back to Sign In
          </a>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
