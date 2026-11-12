import React, { useState } from "react";
import AttendanceNav from "./AttendanceNav";
import "./StaffAttendanceRegister.css";
import { STAFF_ATTENDANCE } from "./attendanceData";
import { DEPARTMENTS_LIST } from "../Academic Structure/academicData";
import SpinningWordsBackground from "../components/SpinningWordsBackground";
import MotivationQuoteWidget from "../components/MotivationQuoteWidget";

export default function StaffAttendanceRegister({ onNavigate }) {
  const [staffRecords, setStaffRecords] = useState(STAFF_ATTENDANCE);
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Manual Clock In form
  const [formData, setFormData] = useState({
    name: "Dr. Jonathan Miller",
    staffId: "TCH-2026-104",
    role: "Mathematics Master",
    department: "Department of Sciences & Mathematics",
    terminal: "Biometric Terminal #01 (Main Gate)",
    status: "On Duty",
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleManualClockIn = (e) => {
    e.preventDefault();
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newRecord = {
      id: `STF-ATT-00${staffRecords.length + 1}`,
      staffId: formData.staffId,
      name: formData.name,
      role: formData.role,
      department: formData.department,
      date: "2026-11-12",
      clockIn: now,
      clockOut: "— (Active)",
      hoursWorked: "Just Clocked In",
      status: formData.status,
      terminal: formData.terminal,
    };

    setStaffRecords((prev) => [newRecord, ...prev]);
    showToast(`Clock-in timestamp recorded for ${formData.name} at ${now}!`);
    setIsModalOpen(false);
  };

  const handleExportStaffCSV = () => {
    const headers = "Staff ID,Name,Role,Department,Date,Clock-In,Clock-Out,Hours Worked,Status,Terminal\n";
    const rows = filteredRecords
      .map(
        (r) =>
          `"${r.staffId}","${r.name}","${r.role}","${r.department}","${r.date}","${r.clockIn}","${r.clockOut}","${r.hoursWorked}","${r.status}","${r.terminal}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `staff_attendance_register_2026-11-12.csv`;
    a.click();
    showToast("Downloaded Staff Attendance Register CSV.");
  };

  const filteredRecords = staffRecords.filter((r) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      r.name.toLowerCase().includes(q) ||
      r.staffId.toLowerCase().includes(q) ||
      r.role.toLowerCase().includes(q) ||
      r.terminal.toLowerCase().includes(q);
    const matchesDept = deptFilter === "ALL" || r.department === deptFilter;
    const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const onDutyCount = staffRecords.filter((s) => s.status === "On Duty").length;
  const lateCount = staffRecords.filter((s) => s.status === "Late Arrival").length;
  const onLeaveCount = staffRecords.filter((s) => s.status === "Approved Leave").length;

  return (
    <div className="sar-page-wrapper">
      <SpinningWordsBackground speed="slow" showControlBadge={false} />

      {/* Toast Alert */}
      {toastMessage && <div className="sar-toast">✓ {toastMessage}</div>}

      <AttendanceNav
        activePath="/staff-attendance-register"
        title="Staff & Faculty Attendance Register"
        subtitle="Biometric terminal logs, clock-in timestamps, duty status, and department rosters"
      />

      <MotivationQuoteWidget compact={true} />

      {/* KPI Stats Strip */}
      <div className="sar-kpi-grid">
        <div className="sar-kpi-card">
          <div className="sar-kpi-top">
            <span className="sar-kpi-label">Staff on Duty</span>
            <span className="sar-kpi-icon">👨‍🏫</span>
          </div>
          <div className="sar-kpi-val" style={{ color: "#34d399" }}>
            {onDutyCount} Faculty Active
          </div>
          <div className="sar-kpi-sub">Across Academic Departments</div>
        </div>

        <div className="sar-kpi-card">
          <div className="sar-kpi-top">
            <span className="sar-kpi-label">Late Arrivals</span>
            <span className="sar-kpi-icon">⏱️</span>
          </div>
          <div className="sar-kpi-val" style={{ color: lateCount > 0 ? "#fbbf24" : "#94a3b8" }}>
            {lateCount} Late
          </div>
          <div className="sar-kpi-sub">Clocked in post 08:00 AM</div>
        </div>

        <div className="sar-kpi-card">
          <div className="sar-kpi-top">
            <span className="sar-kpi-label">Approved Leave</span>
            <span className="sar-kpi-icon">📑</span>
          </div>
          <div className="sar-kpi-val" style={{ color: "#38bdf8" }}>
            {onLeaveCount} On Leave
          </div>
          <div className="sar-kpi-sub">Conference & Sabbatical Leave</div>
        </div>

        <div className="sar-kpi-card">
          <div className="sar-kpi-top">
            <span className="sar-kpi-label">Biometric Terminals</span>
            <span className="sar-kpi-icon">📶</span>
          </div>
          <div className="sar-kpi-val" style={{ color: "#34d399" }}>
            Online (4/4)
          </div>
          <div className="sar-kpi-sub">Encrypted Synchronization</div>
        </div>
      </div>

      {/* Action / Search Bar */}
      <div className="sar-action-bar">
        <div className="sar-filters-row">
          <div className="sar-search-box">
            <span className="sar-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search faculty name, staff ID, role, or terminal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="sar-clear-btn"
                onClick={() => setSearchQuery("")}
              >
                ×
              </button>
            )}
          </div>

          <select
            className="sar-select"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            <option value="ALL">All Departments</option>
            {DEPARTMENTS_LIST.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
            <option value="Central Administration">Central Administration</option>
          </select>

          <select
            className="sar-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="On Duty">On Duty</option>
            <option value="Late Arrival">Late Arrival</option>
            <option value="Approved Leave">Approved Leave</option>
          </select>
        </div>

        <div className="sar-btn-group">
          <button
            type="button"
            className="sar-btn-secondary"
            onClick={handleExportStaffCSV}
          >
            <span>📥</span> Export CSV
          </button>
          <button
            type="button"
            className="sar-btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            <span>＋</span> Manual Clock-In Entry
          </button>
        </div>
      </div>

      {/* Staff Attendance Table */}
      <div className="sar-table-card">
        <div className="sar-card-header">
          <div>
            <h3>Faculty & Staff Biometric Roll Call Register</h3>
            <p>Session: <strong>Thursday, November 12, 2026</strong> • Real-time terminal synchronization</p>
          </div>
          <div className="sar-header-sync">
            <span className="sar-sync-dot">●</span> Live Biometric Stream
          </div>
        </div>

        <div className="sar-table-scroll">
          <table className="sar-table">
            <thead>
              <tr>
                <th>Staff ID & Name</th>
                <th>Academic Role</th>
                <th>Department</th>
                <th>Clock In</th>
                <th>Clock Out</th>
                <th>Hours Worked</th>
                <th>Attendance Status</th>
                <th>Capture Terminal</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div className="sar-staff-cell">
                      <span className="sar-avatar-dot">
                        {s.name[0]}
                      </span>
                      <div>
                        <div className="sar-staff-name">{s.name}</div>
                        <div className="sar-staff-id">{s.staffId}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <strong style={{ color: "#f8fafc" }}>{s.role}</strong>
                  </td>
                  <td>
                    <span className="sar-dept-text">{s.department}</span>
                  </td>
                  <td>
                    <span className="sar-time-chip">{s.clockIn}</span>
                  </td>
                  <td>
                    <span className="sar-time-sub">{s.clockOut}</span>
                  </td>
                  <td>
                    <strong style={{ color: "#38bdf8" }}>{s.hoursWorked}</strong>
                  </td>
                  <td>
                    <span
                      className={`sar-status-pill ${
                        s.status === "On Duty"
                          ? "pill-onduty"
                          : s.status === "Late Arrival"
                          ? "pill-late"
                          : "pill-leave"
                      }`}
                    >
                      ● {s.status}
                    </span>
                  </td>
                  <td>
                    <span className="sar-terminal-badge">{s.terminal}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredRecords.length === 0 && (
        <div className="sar-empty-state">
          <p>No staff records match your search criteria.</p>
          <button
            type="button"
            className="sar-btn-primary"
            onClick={() => {
              setSearchQuery("");
              setDeptFilter("ALL");
              setStatusFilter("ALL");
            }}
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Manual Clock In Modal */}
      {isModalOpen && (
        <div className="sar-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="sar-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="sar-modal-header">
              <h2>Record Manual Staff Clock-In</h2>
              <button
                type="button"
                className="sar-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleManualClockIn} className="sar-modal-form">
              <div className="sar-form-row">
                <div className="sar-form-group">
                  <label>Staff ID</label>
                  <input
                    type="text"
                    required
                    value={formData.staffId}
                    onChange={(e) =>
                      setFormData({ ...formData, staffId: e.target.value })
                    }
                  />
                </div>
                <div className="sar-form-group">
                  <label>Faculty Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="sar-form-group">
                <label>Academic Role / Title</label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                />
              </div>

              <div className="sar-form-group">
                <label>Department</label>
                <select
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                >
                  {DEPARTMENTS_LIST.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                  <option value="Central Administration">Central Administration</option>
                </select>
              </div>

              <div className="sar-form-row">
                <div className="sar-form-group">
                  <label>Capture Terminal</label>
                  <select
                    value={formData.terminal}
                    onChange={(e) =>
                      setFormData({ ...formData, terminal: e.target.value })
                    }
                  >
                    <option value="Biometric Terminal #01 (Main Gate)">
                      Biometric Terminal #01 (Main Gate)
                    </option>
                    <option value="Biometric Terminal #02 (Faculty Lounge)">
                      Biometric Terminal #02 (Faculty Lounge)
                    </option>
                    <option value="Biometric Terminal #03 (Math Wing)">
                      Biometric Terminal #03 (Math Wing)
                    </option>
                    <option value="Executive Terminal #01">
                      Executive Terminal #01
                    </option>
                  </select>
                </div>
                <div className="sar-form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option value="On Duty">On Duty</option>
                    <option value="Late Arrival">Late Arrival</option>
                    <option value="Approved Leave">Approved Leave</option>
                  </select>
                </div>
              </div>

              <div className="sar-modal-footer">
                <button
                  type="button"
                  className="sar-btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="sar-btn-primary">
                  Confirm Clock-In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
