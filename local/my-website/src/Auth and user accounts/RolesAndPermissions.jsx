import React, { useState } from "react";
import "./auth.css";

const DEFAULT_ROLES = [
  { id: "admin", name: "Administrator", description: "Unrestricted access across all school records, finances, and system settings.", usersCount: 4 },
  { id: "teacher", name: "Teacher / Faculty", description: "Can manage student grades, take attendance, view student rosters and academic reports.", usersCount: 42 },
  { id: "student", name: "Student", description: "Can view class timetables, attendance history, homework submissions, and personal grade reports.", usersCount: 850 },
  { id: "parent", name: "Parent / Guardian", description: "Can view wards' attendance, academic evaluations, fee receipts, and school notices.", usersCount: 620 },
  { id: "staff", name: "Support Staff / Accountant", description: "Access restricted to billing, inventory, and office administration tasks.", usersCount: 15 },
];

const MODULES = [
  { id: "students", name: "Student Records & Enrollment" },
  { id: "academics", name: "Grades, Exams & Curriculum" },
  { id: "attendance", name: "Daily Attendance Tracking" },
  { id: "finances", name: "Tuition, Invoices & Fee Collection" },
  { id: "timetables", name: "Timetables & Class Schedules" },
  { id: "users", name: "User Management & System Access" },
];

const INITIAL_PERMISSIONS = {
  admin: {
    students: { view: true, create: true, edit: true, delete: true },
    academics: { view: true, create: true, edit: true, delete: true },
    attendance: { view: true, create: true, edit: true, delete: true },
    finances: { view: true, create: true, edit: true, delete: true },
    timetables: { view: true, create: true, edit: true, delete: true },
    users: { view: true, create: true, edit: true, delete: true },
  },
  teacher: {
    students: { view: true, create: false, edit: true, delete: false },
    academics: { view: true, create: true, edit: true, delete: false },
    attendance: { view: true, create: true, edit: true, delete: false },
    finances: { view: false, create: false, edit: false, delete: false },
    timetables: { view: true, create: false, edit: false, delete: false },
    users: { view: false, create: false, edit: false, delete: false },
  },
  student: {
    students: { view: false, create: false, edit: false, delete: false },
    academics: { view: true, create: false, edit: false, delete: false },
    attendance: { view: true, create: false, edit: false, delete: false },
    finances: { view: true, create: false, edit: false, delete: false },
    timetables: { view: true, create: false, edit: false, delete: false },
    users: { view: false, create: false, edit: false, delete: false },
  },
  parent: {
    students: { view: false, create: false, edit: false, delete: false },
    academics: { view: true, create: false, edit: false, delete: false },
    attendance: { view: true, create: false, edit: false, delete: false },
    finances: { view: true, create: false, edit: false, delete: false },
    timetables: { view: true, create: false, edit: false, delete: false },
    users: { view: false, create: false, edit: false, delete: false },
  },
  staff: {
    students: { view: true, create: false, edit: false, delete: false },
    academics: { view: false, create: false, edit: false, delete: false },
    attendance: { view: true, create: false, edit: false, delete: false },
    finances: { view: true, create: true, edit: true, delete: false },
    timetables: { view: true, create: false, edit: false, delete: false },
    users: { view: false, create: false, edit: false, delete: false },
  },
};

function RolesAndPermissions({ onNavigate }) {
  const [selectedRole, setSelectedRole] = useState("teacher");
  const [permissions, setPermissions] = useState(INITIAL_PERMISSIONS);
  const [saveToast, setSaveToast] = useState(false);

  const currentRoleInfo = DEFAULT_ROLES.find((r) => r.id === selectedRole);

  const togglePermission = (moduleId, action) => {
    setPermissions((prev) => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole],
        [moduleId]: {
          ...prev[selectedRole]?.[moduleId],
          [action]: !prev[selectedRole]?.[moduleId]?.[action],
        },
      },
    }));
  };

  const toggleRowAll = (moduleId) => {
    const row = permissions[selectedRole]?.[moduleId] || {};
    const allChecked = row.view && row.create && row.edit && row.delete;
    const nextVal = !allChecked;

    setPermissions((prev) => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole],
        [moduleId]: {
          view: nextVal,
          create: nextVal,
          edit: nextVal,
          delete: nextVal,
        },
      },
    }));
  };

  const handleSave = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  return (
    <div className="sms-page-wrapper">
      <div className="sms-dashboard-card">
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <span className="sms-portal-badge">Access Control</span>
            <h1 className="sms-title" style={{ textAlign: "left" }}>Roles and Permissions</h1>
            <p className="sms-subtitle">Define what each user role is permitted to view, create, edit, or delete</p>
          </div>
          <button type="button" className="sms-btn sms-btn-primary" onClick={handleSave}>
            Save Permissions
          </button>
        </div>

        {saveToast && (
          <div className="sms-alert sms-alert-success">
            ✓ Permissions for {currentRoleInfo?.name} successfully updated!
          </div>
        )}

        {/* Roles Navigation Pill Tabs */}
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "8px", marginBottom: "20px" }}>
          {DEFAULT_ROLES.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setSelectedRole(r.id)}
              style={{
                padding: "10px 16px",
                borderRadius: "8px",
                border: "1px solid",
                borderColor: selectedRole === r.id ? "var(--auth-primary)" : "var(--auth-border)",
                background: selectedRole === r.id ? "var(--auth-primary-light)" : "#ffffff",
                color: selectedRole === r.id ? "var(--auth-primary)" : "var(--auth-text-main)",
                fontWeight: 600,
                fontSize: "13px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s ease",
              }}
            >
              {r.name}
            </button>
          ))}
        </div>

        {/* Role Overview Box */}
        <div
          style={{
            background: "#f8fafc",
            border: "1px solid var(--auth-border)",
            borderRadius: "10px",
            padding: "16px 20px",
            marginBottom: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <div style={{ fontSize: "16px", fontWeight: 700 }}>
              {currentRoleInfo?.name} Role Access
            </div>
            <div style={{ fontSize: "13px", color: "var(--auth-text-muted)", marginTop: "2px" }}>
              {currentRoleInfo?.description}
            </div>
          </div>
          <div>
            <span className="sms-badge sms-badge-role">
              {currentRoleInfo?.usersCount} Assigned Users
            </span>
          </div>
        </div>

        {/* Permissions Table */}
        <div className="sms-table-wrapper">
          <table className="sms-table">
            <thead>
              <tr>
                <th style={{ width: "38%" }}>System Module</th>
                <th style={{ textAlign: "center", width: "13%" }}>View</th>
                <th style={{ textAlign: "center", width: "13%" }}>Create</th>
                <th style={{ textAlign: "center", width: "13%" }}>Edit</th>
                <th style={{ textAlign: "center", width: "13%" }}>Delete</th>
                <th style={{ textAlign: "right", width: "10%" }}>Row Quick Toggle</th>
              </tr>
            </thead>
            <tbody>
              {MODULES.map((mod) => {
                const perms = permissions[selectedRole]?.[mod.id] || {
                  view: false,
                  create: false,
                  edit: false,
                  delete: false,
                };
                const allSelected = perms.view && perms.create && perms.edit && perms.delete;

                return (
                  <tr key={mod.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{mod.name}</div>
                      <div style={{ fontSize: "11px", color: "var(--auth-text-muted)" }}>
                        Module ID: {mod.id}
                      </div>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={!!perms.view}
                        onChange={() => togglePermission(mod.id, "view")}
                        style={{ cursor: "pointer", width: "16px", height: "16px" }}
                      />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={!!perms.create}
                        onChange={() => togglePermission(mod.id, "create")}
                        style={{ cursor: "pointer", width: "16px", height: "16px" }}
                      />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={!!perms.edit}
                        onChange={() => togglePermission(mod.id, "edit")}
                        style={{ cursor: "pointer", width: "16px", height: "16px" }}
                      />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={!!perms.delete}
                        onChange={() => togglePermission(mod.id, "delete")}
                        style={{ cursor: "pointer", width: "16px", height: "16px" }}
                      />
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        type="button"
                        className="sms-btn sms-btn-secondary sms-btn-sm"
                        onClick={() => toggleRowAll(mod.id)}
                      >
                        {allSelected ? "Deselect" : "Select All"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default RolesAndPermissions;
