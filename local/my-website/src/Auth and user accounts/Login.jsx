import React, { useState, useEffect } from "react";
import profile from "../assets/Screenshot From 2026-09-19 18-38-18.png";
import "./header.css";
import SpinningWordsBackground from "../components/SpinningWordsBackground";
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

export const SAMPLE_STUDENTS = [
  { id: "STU-SMIA-002", name: "Kwame Mensah", email: "k.mensah@student.school.edu", password: "Student@2026", grade: "Grade 11-A (Science)", rollNumber: "11A-04", feesBalance: "GH₵0.00" },
  { id: "STU-SMIA-001", name: "Elena Rostova", email: "e.rostova@student.school.edu", password: "Student@2026", grade: "Grade 11-A (Advanced)", rollNumber: "11A-01", feesBalance: "GH₵0.00" },
  { id: "STU-SMIA-004", name: "Ama Serwaa", email: "a.serwaa@student.school.edu", password: "Student@2026", grade: "Grade 10-A (General)", rollNumber: "10A-09", feesBalance: "GH₵850.00" },
  { id: "STU-SMIA-003", name: "Lucas Vance", email: "l.vance@student.school.edu", password: "Student@2026", grade: "Grade 10-B (Robotics)", rollNumber: "10B-14", feesBalance: "GH₵0.00" },
];

export const SAMPLE_TEACHERS = [
  { id: "TCH-2026-102", name: "Mrs. Sarah Jenkins", email: "s.jenkins@faculty.school.edu", password: "Teacher@2026", dept: "Science & Chemistry", title: "Senior Chemistry Faculty" },
  { id: "TCH-GH-101", name: "Mr. Kofi Annan", email: "k.annan@faculty.school.edu", password: "Teacher@2026", dept: "Physics & Robotics", title: "Head of Physics & Robotics" },
  { id: "TCH-2026-103", name: "Marcus Brody", email: "m.brody@faculty.school.edu", password: "Teacher@2026", dept: "History & Arts", title: "Senior History Master" },
];

function Login({ onNavigate }) {
  const [activeTheme, setActiveTheme] = useState(THEMES[0]);
  const [role, setRole] = useState("Student");
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
        // 1. Multi-School Platform Super Admin
        const isPlatformAdmin =
          email.toLowerCase().includes("platform") ||
          password === "Platform@2026";

        if (isPlatformAdmin) {
          localStorage.setItem("platform_admin_auth", "true");
          localStorage.setItem("show_daily_quote_popup", "true");
          setAlert({
            message: `✓ Multi-School Platform Super Admin Authenticated! Redirecting to Platform Management...`,
            type: "success",
          });
          if (onNavigate) {
            setTimeout(() => onNavigate("platform-dashboard"), 800);
          }
          return;
        }

        // 2. Student Role Sign In
        if (role === "Student") {
          const matched = SAMPLE_STUDENTS.find(
            (s) => s.email.toLowerCase() === email.trim().toLowerCase()
          );
          const studentObj = matched
            ? {
                id: matched.id,
                fullName: matched.name,
                email: matched.email,
                grade: matched.grade,
                rollNumber: matched.rollNumber,
                campus: "Kensington Central Campus",
                feesBalance: matched.feesBalance,
                attendancePct: 99,
                gpa: "3.95",
                schoolName: "St. Mary International Academy",
              }
            : {
                id: "STU-SMIA-002",
                fullName: userIdentifier.toUpperCase(),
                email: email.trim(),
                grade: "Grade 11-A",
                rollNumber: "11A-04",
                campus: "Central Campus",
                feesBalance: "GH₵0.00",
                attendancePct: 98,
                gpa: "3.90",
                schoolName: "School Hub Academy",
              };

          localStorage.setItem("student_auth", "true");
          localStorage.setItem("active_student_user", JSON.stringify(studentObj));
          localStorage.setItem("show_daily_quote_popup", "true");
          setAlert({
            message: `✓ Verified Student: Welcome ${studentObj.fullName}! Redirecting to Student Portal...`,
            type: "success",
          });
          if (onNavigate) {
            setTimeout(() => onNavigate("student-portal"), 800);
          }
          return;
        }

        // 3. Teacher / Faculty Role Sign In
        if (role === "Staff / Teacher") {
          const matched = SAMPLE_TEACHERS.find(
            (t) => t.email.toLowerCase() === email.trim().toLowerCase()
          );
          const teacherObj = matched
            ? {
                id: matched.id,
                name: matched.name,
                email: matched.email,
                title: matched.title,
                dept: matched.dept,
                campus: "Kensington Central Campus",
                classes: ["Grade 11-A", "Grade 10-B", "Grade 12-A"],
                totalStudents: 94,
                periodsToday: 4,
              }
            : {
                id: "TCH-2026-102",
                name: userIdentifier.toUpperCase(),
                email: email.trim(),
                title: "Senior Faculty Instructor",
                dept: "Academic Faculty",
                campus: "Central Campus",
                classes: ["Grade 11-A", "Grade 10-B"],
                totalStudents: 80,
                periodsToday: 4,
              };

          localStorage.setItem("teacher_auth", "true");
          sessionStorage.setItem("teacher_portal_unlocked", "true");
          localStorage.setItem("active_teacher_user", JSON.stringify(teacherObj));
          localStorage.setItem("show_daily_quote_popup", "true");
          setAlert({
            message: `✓ Verified Faculty: Welcome ${teacherObj.name}! Redirecting to Teacher Portal...`,
            type: "success",
          });
          if (onNavigate) {
            setTimeout(() => onNavigate("teacher-portal"), 800);
          }
          return;
        }

        // 4. Authenticate against school-based admin credentials
        const schoolAuth = authenticateSchoolAdmin(email, password);
        if (schoolAuth.success) {
          const a = schoolAuth.admin;
          localStorage.setItem("show_daily_quote_popup", "true");
          setAlert({
            message: `✓ Verified Administrator for ${a.schoolName} (${a.adminName})! Redirecting to School Portal...`,
            type: "success",
          });
          if (onNavigate) {
            setTimeout(() => onNavigate("school-dashboard"), 850);
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
            setTimeout(() => onNavigate("school-dashboard"), 900);
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
      {/* Interactive 3D Spinning Words Aura */}
      <SpinningWordsBackground speed="slow" />

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

        {/* Side-by-side header content */}
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
                {["Student", "Staff / Teacher", "Administrator"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={`role-tab ${role === r ? "active" : ""}`}
                    onClick={() => {
                      setRole(r);
                      setAlert(null);
                    }}
                  >
                    {r === "Student" ? "🎓 Student" : r === "Staff / Teacher" ? "👨‍🏫 Teacher" : "🛡️ Administrator"}
                  </button>
                ))}
              </div>

              {/* 1. STUDENT QUICK-SELECTOR */}
              {role === "Student" && !isRegister && (
                <div
                  style={{
                    background: "rgba(14, 165, 233, 0.12)",
                    border: "1px solid rgba(14, 165, 233, 0.35)",
                    borderRadius: "10px",
                    padding: "10px 12px",
                    marginBottom: "16px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#38bdf8", textTransform: "uppercase" }}>
                      🎓 Quick-Select Student Account
                    </span>
                    <span style={{ fontSize: "10px", color: "#7dd3fc" }}>
                      Pass: Student@2026
                    </span>
                  </div>
                  <select
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      background: "rgba(15, 23, 42, 0.95)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "6px",
                      color: "#f1f5f9",
                      fontSize: "12px",
                      cursor: "pointer",
                      outline: "none",
                    }}
                    onChange={(e) => {
                      if (!e.target.value) return;
                      const s = SAMPLE_STUDENTS.find((item) => item.id === e.target.value);
                      if (s) {
                        setEmail(s.email);
                        setPassword(s.password);
                        setAlert({
                          type: "success",
                          message: `Loaded Student: ${s.name} (${s.email})! Click 'Submit' below to open Student Portal.`,
                        });
                      }
                    }}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      -- Select Student to Auto-fill --
                    </option>
                    {SAMPLE_STUDENTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} — {s.grade} ({s.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* 2. TEACHER QUICK-SELECTOR */}
              {role === "Staff / Teacher" && !isRegister && (
                <div
                  style={{
                    background: "rgba(16, 185, 129, 0.12)",
                    border: "1px solid rgba(16, 185, 129, 0.35)",
                    borderRadius: "10px",
                    padding: "10px 12px",
                    marginBottom: "16px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#34d399", textTransform: "uppercase" }}>
                      👨‍🏫 Quick-Select Teacher / Faculty
                    </span>
                    <span style={{ fontSize: "10px", color: "#6ee7b7" }}>
                      Pass: Teacher@2026
                    </span>
                  </div>
                  <select
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      background: "rgba(15, 23, 42, 0.95)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "6px",
                      color: "#f1f5f9",
                      fontSize: "12px",
                      cursor: "pointer",
                      outline: "none",
                    }}
                    onChange={(e) => {
                      if (!e.target.value) return;
                      const t = SAMPLE_TEACHERS.find((item) => item.id === e.target.value);
                      if (t) {
                        setEmail(t.email);
                        setPassword(t.password);
                        setAlert({
                          type: "success",
                          message: `Loaded Teacher: ${t.name} (${t.email})! Click 'Submit' below to open Teacher Portal.`,
                        });
                      }
                    }}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      -- Select Teacher to Auto-fill --
                    </option>
                    {SAMPLE_TEACHERS.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} — {t.dept} ({t.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* 3. ADMINISTRATOR QUICK-SELECTOR */}
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
                <label className="form-label">
                  {role === "Student" ? "Student Email or School ID" : role === "Staff / Teacher" ? "Faculty Email or Staff ID" : "Administrator Email"}
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      role === "Student"
                        ? "e.g. k.mensah@student.school.edu"
                        : role === "Staff / Teacher"
                        ? "e.g. s.jenkins@faculty.school.edu"
                        : "e.g. admin@stmarys.edu"
                    }
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

              {/* Remember Me and Forgot Password row */}
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
                  : isRegister ? "Sign Up" : `Sign In to ${role} Portal`}
              </button>

              {/* Direct Portal Quick Jump Links */}
              <div style={{ marginTop: "14px", display: "flex", justifyContent: "space-between", fontSize: "12px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "12px" }}>
                <a
                  href="#student-portal"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onNavigate) onNavigate("student-portal");
                  }}
                  style={{ color: "#38bdf8", textDecoration: "none", fontWeight: 600 }}
                >
                  🎓 Student Portal →
                </a>
                <a
                  href="#teacher-portal"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onNavigate) onNavigate("teacher-portal");
                  }}
                  style={{ color: "#34d399", textDecoration: "none", fontWeight: 600 }}
                >
                  👨‍🏫 Teacher Portal →
                </a>
              </div>

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
