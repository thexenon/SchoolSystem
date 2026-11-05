import React, { useState } from "react";
import "./auth.css";
import {
  getActiveSchoolAdmin,
  clearActiveSchoolAdmin,
} from "../Platform Administration/schoolAdminAuth";

const INITIAL_USERS = [
  { id: "ADM-001", name: "System Administrator", email: "admin@school.edu", role: "Administrator", department: "Executive Board", status: "Active", lastLogin: "Today, 08:30 AM" },
  { id: "TCH-2026-102", name: "Sarah Jenkins", email: "s.jenkins@faculty.school.edu", role: "Teacher", department: "Science & Math", status: "Active", lastLogin: "Yesterday, 04:15 PM" },
  { id: "TCH-2026-103", name: "Marcus Brody", email: "m.brody@faculty.school.edu", role: "Teacher", department: "History & Arts", status: "Inactive", lastLogin: "3 days ago" },
  { id: "STU-2026-501", name: "Elena Rostova", email: "e.rostova@student.school.edu", role: "Student", department: "Grade 11-A", status: "Active", lastLogin: "Today, 09:12 AM" },
  { id: "STU-2026-502", name: "Lucas Vance", email: "l.vance@student.school.edu", role: "Student", department: "Grade 10-B", status: "Active", lastLogin: "Today, 10:04 AM" },
  { id: "ADM-2026-002", name: "Dr. Arthur Bell", email: "a.bell@admin.school.edu", role: "Administrator", department: "Academic Senate", status: "Active", lastLogin: "Oct 11, 2026" },
  { id: "USR-006", name: "Claire Redfield", email: "c.redfield@school.edu", role: "Staff", department: "Finance & Accounts", status: "Deactivated", lastLogin: "Sep 22, 2026" },
];

const SAMPLE_NAMES = {
  Student: [
    { first: "Liam", last: "Carter", dept: "Grade 10-A" },
    { first: "Sophia", last: "Martinez", dept: "Grade 11-B" },
    { first: "Ethan", last: "Chen", dept: "Grade 12-A" },
    { first: "Ava", last: "Johnson", dept: "Grade 9-C" },
    { first: "Noah", last: "Williams", dept: "Grade 10-B" },
  ],
  Teacher: [
    { first: "Robert", last: "Langdon", dept: "Literature & Arts" },
    { first: "Dr. Margaret", last: "Hamilton", dept: "Computer Science" },
    { first: "Jonathan", last: "Miller", dept: "Physics & Chemistry" },
    { first: "Diana", last: "Prince", dept: "Physical Education" },
  ],
  Administrator: [
    { first: "Dr. Evelyn", last: "Sterling", dept: "Dean of Academic Affairs" },
    { first: "Victor", last: "Sullivan", dept: "Campus Safety & Ops" },
    { first: "Eleanor", last: "Vance", dept: "Registrar & Admissions" },
  ],
};

function generateRandomPassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let pass = "";
  for (let i = 0; i < 6; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const specials = ["#", "$", "!", "@", "&"];
  const special = specials[Math.floor(Math.random() * specials.length)];
  return `Sch${special}${pass}`;
}

function UserManagement({ onNavigate }) {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [activeAdmin] = useState(() => getActiveSchoolAdmin());
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showGeneratorModal, setShowGeneratorModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Inbuilt Login Generator State
  const [genRole, setGenRole] = useState("Student");
  const [genFirstName, setGenFirstName] = useState("Lucas");
  const [genLastName, setGenLastName] = useState("Vance");
  const [genDept, setGenDept] = useState("Grade 10-B");
  const [generatedSlip, setGeneratedSlip] = useState(null);

  // New user form state
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Teacher",
    department: "",
    status: "Active",
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleStatus = (id) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const newStatus = u.status === "Active" ? "Deactivated" : "Active";
          showToast(`Account for ${u.name} is now ${newStatus}.`);
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    const created = {
      id: `USR-00${users.length + 1}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      department: newUser.department || "General",
      status: newUser.status,
      lastLogin: "Never",
    };

    setUsers([created, ...users]);
    setShowAddModal(false);
    setNewUser({ name: "", email: "", role: "Teacher", department: "", status: "Active" });
    showToast(`Successfully created new account for ${created.name}!`);
  };

  // Login Generator Logic
  const handleGenerateCredentials = () => {
    const fName = genFirstName.trim() || "User";
    const lName = genLastName.trim() || "Account";
    const randNum = Math.floor(1000 + Math.random() * 9000);

    let prefix = "STU";
    let domain = "student.school.edu";

    if (genRole === "Teacher") {
      prefix = "TCH";
      domain = "faculty.school.edu";
    } else if (genRole === "Administrator") {
      prefix = "ADM";
      domain = "admin.school.edu";
    }

    const schoolId = `${prefix}-2026-${randNum}`;
    const cleanFirst = fName.toLowerCase().replace(/[^a-z]/g, "");
    const cleanLast = lName.toLowerCase().replace(/[^a-z]/g, "");
    const email = `${cleanFirst.charAt(0)}.${cleanLast}@${domain}`;
    const tempPassword = generateRandomPassword();

    const slip = {
      name: `${fName} ${lName}`,
      role: genRole,
      id: schoolId,
      email: email,
      tempPassword: tempPassword,
      department: genDept || (genRole === "Student" ? "General Grade" : "General Staff"),
      generatedAt: new Date().toLocaleTimeString(),
    };

    setGeneratedSlip(slip);
  };

  const handleRandomizeName = () => {
    const pool = SAMPLE_NAMES[genRole] || SAMPLE_NAMES.Student;
    const randomPick = pool[Math.floor(Math.random() * pool.length)];
    setGenFirstName(randomPick.first);
    setGenLastName(randomPick.last);
    setGenDept(randomPick.dept);
  };

  const handleSaveGeneratedUser = () => {
    if (!generatedSlip) return;

    const userEntry = {
      id: generatedSlip.id,
      name: generatedSlip.name,
      email: generatedSlip.email,
      role: generatedSlip.role,
      department: generatedSlip.department,
      status: "Active",
      lastLogin: "Never",
    };

    setUsers([userEntry, ...users]);
    showToast(`✓ Account for ${userEntry.name} (${userEntry.role}) added to active directory!`);
    setShowGeneratorModal(false);
  };

  const handleCopySlip = () => {
    if (!generatedSlip) return;

    const text = `=========================================
SCHOOL HUB - OFFICIAL CREDENTIAL SLIP
=========================================
User: ${generatedSlip.name}
Role: ${generatedSlip.role}
Department / Grade: ${generatedSlip.department}
School ID: ${generatedSlip.id}
Official Email: ${generatedSlip.email}
Temporary Password: ${generatedSlip.tempPassword}
Portal URL: http://localhost:5173/login
Security: Must change password upon first sign-in
=========================================`;

    navigator.clipboard.writeText(text).then(() => {
      showToast("📋 Credentials slip copied to clipboard!");
    });
  };

  const handleBulkGenerate = (count = 3) => {
    const pool = SAMPLE_NAMES[genRole] || SAMPLE_NAMES.Student;
    const newBatch = [];

    for (let i = 0; i < count; i++) {
      const pick = pool[i % pool.length];
      const randNum = Math.floor(1000 + Math.random() * 9000);
      let prefix = genRole === "Teacher" ? "TCH" : genRole === "Administrator" ? "ADM" : "STU";
      let domain = genRole === "Teacher" ? "faculty.school.edu" : genRole === "Administrator" ? "admin.school.edu" : "student.school.edu";

      newBatch.push({
        id: `${prefix}-2026-${randNum}`,
        name: `${pick.first} ${pick.last} (${i + 1})`,
        email: `${pick.first[0].toLowerCase()}.${pick.last.toLowerCase()}${randNum % 100}@${domain}`,
        role: genRole,
        department: pick.dept,
        status: "Active",
        lastLogin: "Never",
      });
    }

    setUsers([...newBatch, ...users]);
    showToast(`⚡ Generated batch of ${count} ${genRole} accounts!`);
    setShowGeneratorModal(false);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "All" || u.role === roleFilter;
    const matchesStatus = statusFilter === "All" || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const activeCount = users.filter((u) => u.status === "Active").length;
  const deactivatedCount = users.filter((u) => u.status === "Deactivated").length;

  return (
    <div className="sms-page-wrapper">
      <div className="sms-dashboard-card">
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <span className="sms-portal-badge">
                {activeAdmin ? activeAdmin.schoolName : "Administration Portal"}
              </span>
              {activeAdmin && (
                <span style={{ fontSize: "12px", color: "var(--auth-primary)", fontWeight: 700 }}>
                  👑 {activeAdmin.adminName} ({activeAdmin.adminTitle})
                </span>
              )}
            </div>
            <h1 className="sms-title" style={{ textAlign: "left" }}>
              {activeAdmin ? `${activeAdmin.schoolName} Admin Portal` : "User Management"}
            </h1>
            <p className="sms-subtitle">
              {activeAdmin
                ? `Managing faculty, students, and campus accounts for ${activeAdmin.schoolName}`
                : "Create, monitor, and issue login credentials for students, teachers, and admins"}
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              type="button"
              className="sms-btn sms-btn-primary"
              style={{ background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)", boxShadow: "0 4px 12px rgba(99, 102, 241, 0.35)" }}
              onClick={() => {
                handleGenerateCredentials();
                setShowGeneratorModal(true);
              }}
            >
              ⚡ Inbuilt Login Generator
            </button>
            <button
              type="button"
              className="sms-btn sms-btn-secondary"
              onClick={() => setShowAddModal(true)}
            >
              + Manual User
            </button>
            {activeAdmin && (
              <button
                type="button"
                className="sms-btn sms-btn-secondary"
                onClick={() => {
                  clearActiveSchoolAdmin();
                  if (onNavigate) onNavigate("login");
                }}
                title="Switch to another School Admin account"
              >
                🔄 Switch School Admin
              </button>
            )}
            <button
              type="button"
              className="sms-btn sms-btn-secondary"
              onClick={() => onNavigate && onNavigate("school-dashboard")}
              title="Open School Administration (Dashboard, Campuses, Terms, Calendar)"
            >
              🏫 School Admin Portal →
            </button>
            <button
              type="button"
              className="sms-btn sms-btn-secondary"
              onClick={() => onNavigate && onNavigate("platform-dashboard")}
              title="Open Multi-School Platform Administration (Overall Boss)"
            >
              🌐 Platform Admin (Overall Boss) →
            </button>
          </div>
        </div>

        {/* Administrator Credentials Banner */}
        <div className="admin-credentials-banner">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "18px" }}>🛡️</span>
              <strong style={{ fontSize: "14px", color: "var(--auth-primary)" }}>
                {activeAdmin ? `${activeAdmin.schoolName} Administrator Login` : "Your Administrator Login Credentials"}
              </strong>
              <span className="sms-badge sms-badge-active" style={{ fontSize: "10px" }}>Active School Admin</span>
            </div>
            <div style={{ fontSize: "13px", marginTop: "6px", color: "var(--auth-text-main)", display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <span>School Admin Email: <code className="generator-code">{activeAdmin ? activeAdmin.email : "admin@school.edu"}</code></span>
              <span>School Password: <code className="generator-code">{activeAdmin ? activeAdmin.password : "Admin@2026"}</code></span>
              <span>Institution: <strong>{activeAdmin ? activeAdmin.schoolName : "School Portal"}</strong></span>
            </div>
          </div>
          <button
            type="button"
            className="sms-btn sms-btn-secondary sms-btn-sm"
            onClick={() => {
              const cr = activeAdmin ? `${activeAdmin.email} / ${activeAdmin.password}` : "admin@school.edu / Admin@2026";
              navigator.clipboard?.writeText(cr);
              showToast(`Admin credentials copied: ${cr}`);
            }}
          >
            📋 Copy Admin Login
          </button>
        </div>

        {toastMessage && (
          <div className="sms-alert sms-alert-success">
            {toastMessage}
          </div>
        )}

        {/* Stats Strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "24px" }}>
          <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "10px", border: "1px solid var(--auth-border)" }}>
            <div style={{ fontSize: "12px", color: "var(--auth-text-muted)", fontWeight: 600 }}>TOTAL ACCOUNTS</div>
            <div style={{ fontSize: "24px", fontWeight: 700, marginTop: "4px" }}>{users.length}</div>
          </div>
          <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "10px", border: "1px solid var(--auth-border)" }}>
            <div style={{ fontSize: "12px", color: "var(--auth-success)", fontWeight: 600 }}>ACTIVE</div>
            <div style={{ fontSize: "24px", fontWeight: 700, color: "var(--auth-success)", marginTop: "4px" }}>{activeCount}</div>
          </div>
          <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "10px", border: "1px solid var(--auth-border)" }}>
            <div style={{ fontSize: "12px", color: "var(--auth-danger)", fontWeight: 600 }}>DEACTIVATED</div>
            <div style={{ fontSize: "24px", fontWeight: 700, color: "var(--auth-danger)", marginTop: "4px" }}>{deactivatedCount}</div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "220px" }}>
            <input
              type="text"
              className="sms-input"
              placeholder="🔍 Search by name, email, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="sms-input"
            style={{ width: "auto" }}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="All">All Roles</option>
            <option value="Administrator">Administrator</option>
            <option value="Teacher">Teacher</option>
            <option value="Student">Student</option>
            <option value="Parent">Parent</option>
            <option value="Staff">Staff</option>
          </select>

          <select
            className="sms-input"
            style={{ width: "auto" }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Deactivated">Deactivated</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="sms-table-wrapper">
          <table className="sms-table">
            <thead>
              <tr>
                <th>User Details</th>
                <th>Role</th>
                <th>Department / Grade</th>
                <th>Status</th>
                <th>Last Login</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "32px", color: "var(--auth-text-muted)" }}>
                    No accounts found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
                        {u.name}
                        {u.id === "ADM-001" && (
                          <span style={{ fontSize: "11px", background: "#fef3c7", color: "#92400e", padding: "1px 6px", borderRadius: "4px" }}>
                            Master
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--auth-text-muted)" }}>
                        {u.email} • {u.id}
                      </div>
                    </td>
                    <td>
                      <span className="sms-badge sms-badge-role">{u.role}</span>
                    </td>
                    <td>{u.department}</td>
                    <td>
                      <span className={`sms-badge sms-badge-${u.status.toLowerCase()}`}>
                        {u.status}
                      </span>
                    </td>
                    <td style={{ fontSize: "12px", color: "var(--auth-text-muted)" }}>
                      {u.lastLogin}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "6px" }}>
                        <button
                          type="button"
                          className="sms-btn sms-btn-secondary sms-btn-sm"
                          onClick={() => {
                            if (onNavigate) onNavigate("user-profile");
                          }}
                        >
                          View
                        </button>
                        <button
                          type="button"
                          className={`sms-btn sms-btn-sm ${u.status === "Active" ? "sms-btn-danger" : "sms-btn-secondary"}`}
                          onClick={() => handleToggleStatus(u.id)}
                        >
                          {u.status === "Active" ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* INBUILT LOGIN GENERATOR MODAL */}
        {showGeneratorModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(15, 23, 42, 0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "20px",
              backdropFilter: "blur(4px)",
            }}
          >
            <div className="sms-auth-card" style={{ maxWidth: "600px", maxHeight: "90vh", overflowY: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div>
                  <span className="sms-portal-badge">Automated Provisioning</span>
                  <h2 style={{ margin: "4px 0 0", fontSize: "20px", fontWeight: 700 }}>Inbuilt Login Generator</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowGeneratorModal(false)}
                  style={{ background: "none", border: "none", fontSize: "22px", cursor: "pointer", color: "var(--auth-text-muted)" }}
                >
                  ×
                </button>
              </div>

              {/* Role Selector Tabs */}
              <div style={{ marginBottom: "16px" }}>
                <label className="sms-label" style={{ marginBottom: "6px", display: "block" }}>Select Account Type to Generate:</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {["Student", "Teacher", "Administrator"].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        setGenRole(r);
                        setGeneratedSlip(null);
                      }}
                      style={{
                        flex: 1,
                        padding: "10px 8px",
                        fontSize: "13px",
                        fontWeight: 700,
                        border: "1px solid",
                        borderColor: genRole === r ? "var(--auth-primary)" : "var(--auth-border)",
                        borderRadius: "8px",
                        cursor: "pointer",
                        background: genRole === r ? "var(--auth-primary-light)" : "#ffffff",
                        color: genRole === r ? "var(--auth-primary)" : "var(--auth-text-muted)",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {r === "Student" ? "🎓 Student" : r === "Teacher" ? "👨‍🏫 Teacher" : "🛡️ Administrator"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name and Department Config */}
              <div className="sms-grid-2" style={{ marginBottom: "14px" }}>
                <div className="sms-form-group">
                  <label className="sms-label">First Name</label>
                  <input
                    className="sms-input"
                    value={genFirstName}
                    onChange={(e) => setGenFirstName(e.target.value)}
                    placeholder="e.g. Lucas"
                  />
                </div>
                <div className="sms-form-group">
                  <label className="sms-label">Last Name</label>
                  <input
                    className="sms-input"
                    value={genLastName}
                    onChange={(e) => setGenLastName(e.target.value)}
                    placeholder="e.g. Vance"
                  />
                </div>
              </div>

              <div className="sms-form-group" style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label className="sms-label">Department / Grade</label>
                  <button
                    type="button"
                    onClick={handleRandomizeName}
                    style={{ background: "none", border: "none", color: "var(--auth-primary)", fontSize: "12px", cursor: "pointer", fontWeight: 600 }}
                  >
                    🎲 Randomize Sample Identity
                  </button>
                </div>
                <input
                  className="sms-input"
                  value={genDept}
                  onChange={(e) => setGenDept(e.target.value)}
                  placeholder="e.g. Grade 10-B or Science Department"
                />
              </div>

              <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
                <button
                  type="button"
                  className="sms-btn sms-btn-primary"
                  style={{ flex: 1 }}
                  onClick={handleGenerateCredentials}
                >
                  ⚡ Generate Login Credentials
                </button>
                <button
                  type="button"
                  className="sms-btn sms-btn-secondary"
                  title="Generate 3 accounts immediately"
                  onClick={() => handleBulkGenerate(3)}
                >
                  📦 Bulk Batch (3x)
                </button>
              </div>

              {/* Generated Credential Slip */}
              {generatedSlip && (
                <div className="generator-slip">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed var(--auth-border)", paddingBottom: "8px" }}>
                    <div style={{ fontWeight: 700, fontSize: "14px" }}>
                      🎟️ Generated Login Credential Slip
                    </div>
                    <span
                      className={`sms-badge ${
                        generatedSlip.role === "Administrator"
                          ? "generator-badge-admin"
                          : generatedSlip.role === "Teacher"
                          ? "generator-badge-teacher"
                          : "generator-badge-student"
                      }`}
                    >
                      {generatedSlip.role}
                    </span>
                  </div>

                  <div style={{ fontSize: "13px", lineHeight: "1.7" }}>
                    <div><strong>Full Name:</strong> {generatedSlip.name}</div>
                    <div><strong>Department / Class:</strong> {generatedSlip.department}</div>
                    <div><strong>School ID:</strong> <code className="generator-code">{generatedSlip.id}</code></div>
                    <div><strong>Official Email:</strong> <code className="generator-code">{generatedSlip.email}</code></div>
                    <div><strong>Temporary Password:</strong> <code className="generator-code" style={{ color: "#4ade80" }}>{generatedSlip.tempPassword}</code></div>
                  </div>

                  <div style={{ display: "flex", gap: "10px", marginTop: "12px", flexWrap: "wrap" }}>
                    <button
                      type="button"
                      className="sms-btn sms-btn-secondary sms-btn-sm"
                      onClick={handleCopySlip}
                    >
                      📋 Copy Slip
                    </button>
                    <button
                      type="button"
                      className="sms-btn sms-btn-primary sms-btn-sm"
                      onClick={handleSaveGeneratedUser}
                    >
                      ✓ Save & Add Account to Directory
                    </button>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
                <button
                  type="button"
                  className="sms-btn sms-btn-secondary"
                  onClick={() => setShowGeneratorModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal for manual adding user */}
        {showAddModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(15, 23, 42, 0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "20px",
            }}
          >
            <div className="sms-auth-card" style={{ maxWidth: "520px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>Add Manual User Account</h2>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer" }}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleAddUser} className="sms-form">
                <div className="sms-form-group">
                  <label className="sms-label">Full Name</label>
                  <input
                    className="sms-input"
                    placeholder="e.g. Eleanor Vance"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    required
                  />
                </div>

                <div className="sms-form-group">
                  <label className="sms-label">School Email</label>
                  <input
                    type="email"
                    className="sms-input"
                    placeholder="e.g. e.vance@school.edu"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    required
                  />
                </div>

                <div className="sms-grid-2">
                  <div className="sms-form-group">
                    <label className="sms-label">Role</label>
                    <select
                      className="sms-input"
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    >
                      <option value="Administrator">Administrator</option>
                      <option value="Teacher">Teacher</option>
                      <option value="Student">Student</option>
                      <option value="Parent">Parent</option>
                      <option value="Staff">Staff</option>
                    </select>
                  </div>

                  <div className="sms-form-group">
                    <label className="sms-label">Department / Grade</label>
                    <input
                      className="sms-input"
                      placeholder="e.g. Grade 10"
                      value={newUser.department}
                      onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
                  <button
                    type="button"
                    className="sms-btn sms-btn-secondary"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="sms-btn sms-btn-primary">
                    Create Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserManagement;
