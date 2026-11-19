import React, { useState, useEffect } from "react";
import ParentNav from "./ParentNav";
import {
  getActiveParent,
  LINKED_CHILDREN,
  getActiveChildId,
  CHILD_ATTENDANCE_LOGS,
} from "./parentData";
import "./ChildAttendance.css";

export default function ChildAttendance() {
  const parent = getActiveParent();
  const [activeChildId, setActiveChildId] = useState(getActiveChildId());
  const [statusFilter, setStatusFilter] = useState("All");
  const [toast, setToast] = useState(null);

  // Excuse notice modal
  const [excuseModalOpen, setExcuseModalOpen] = useState(false);
  const [excuseReason, setExcuseReason] = useState("Medical & Physician Appointment");
  const [excuseStartDate, setExcuseStartDate] = useState(new Date().toISOString().substring(0, 10));
  const [excuseEndDate, setExcuseEndDate] = useState(new Date().toISOString().substring(0, 10));
  const [excuseNotes, setExcuseNotes] = useState("");

  const [attendanceList, setAttendanceList] = useState([]);

  useEffect(() => {
    const handleChildChanged = () => {
      const id = getActiveChildId();
      setActiveChildId(id);
      setAttendanceList(CHILD_ATTENDANCE_LOGS[id] || []);
    };
    window.addEventListener("childChanged", handleChildChanged);
    setAttendanceList(CHILD_ATTENDANCE_LOGS[getActiveChildId()] || []);
    return () => window.removeEventListener("childChanged", handleChildChanged);
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const parentChildren = LINKED_CHILDREN.filter((c) =>
    parent.linkedStudentIds.includes(c.id)
  );

  const child =
    parentChildren.find((c) => c.id === activeChildId) || parentChildren[0];

  const filteredLogs = attendanceList.filter((log) => {
    if (statusFilter !== "All" && !log.status.includes(statusFilter)) return false;
    return true;
  });

  const presentCount = attendanceList.filter((l) => l.status === "Present").length;
  const lateCount = attendanceList.filter((l) => l.status.includes("Late")).length;
  const excusedCount = attendanceList.filter((l) => l.status.includes("Excused")).length;
  const unexcusedCount = attendanceList.filter((l) => l.status.includes("Unexcused")).length;

  const handleSubmitExcuse = (e) => {
    e.preventDefault();
    const newEntry = {
      date: excuseStartDate,
      day: "Upcoming",
      status: "Excused Absence (Parent Notified)",
      checkIn: "—",
      remarks: `${excuseReason}: ${excuseNotes || "Parent notice submitted via portal."}`,
    };

    setAttendanceList([newEntry, ...attendanceList]);
    showToast(`Absence excuse notice logged for ${child.fullName} from ${excuseStartDate} to ${excuseEndDate}!`);
    setExcuseModalOpen(false);
    setExcuseNotes("");
  };

  return (
    <div className="ca-container">
      <ParentNav
        title="Student Attendance & Roll Call Registry"
        subtitle="Monitor daily classroom presence, punctuality timestamps, and submit authorized absence notices"
        badge="Module 11 • Screen 4 of 10"
      />

      {toast && (
        <div className={`ca-toast ca-toast-${toast.type}`}>
          <div className="ca-toast-dot" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="ca-header">
        <div className="ca-title-box">
          <span className="ca-tag">ATTENDANCE AUDIT LOG</span>
          <h1 className="ca-title">{child.fullName}'s Attendance</h1>
          <p className="ca-subtitle">
            Classroom roll calls taken each morning by Form Tutor <strong>{child.formTutor}</strong>.
            Parents receive immediate SMS notification for unexcused morning absences.
          </p>
        </div>

        <div className="ca-actions">
          <button className="ca-btn-excuse" onClick={() => setExcuseModalOpen(true)}>
            📝 Submit Absence Excuse Notice
          </button>
        </div>
      </div>

      {/* KPI Meters */}
      <div className="ca-kpi-grid">
        <div className="ca-kpi-card">
          <div className="ca-kpi-icon-wrap" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
            📈
          </div>
          <div>
            <span className="ca-kpi-label">Cumulative Presence Rate</span>
            <div className="ca-kpi-val" style={{ color: "#34d399" }}>{child.attendanceRate}%</div>
            <span className="ca-kpi-sub">Academic Term 1, 2026/2027</span>
          </div>
        </div>

        <div className="ca-kpi-card">
          <div className="ca-kpi-icon-wrap" style={{ background: "rgba(59, 130, 246, 0.15)", color: "#3b82f6" }}>
            ✓
          </div>
          <div>
            <span className="ca-kpi-label">Present Sessions</span>
            <div className="ca-kpi-val">{presentCount} Days</div>
            <span className="ca-kpi-sub">On-time classroom attendance</span>
          </div>
        </div>

        <div className="ca-kpi-card">
          <div className="ca-kpi-icon-wrap" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b" }}>
            ⏳
          </div>
          <div>
            <span className="ca-kpi-label">Late Arrivals</span>
            <div className="ca-kpi-val" style={{ color: "#fbbf24" }}>{lateCount} Days</div>
            <span className="ca-kpi-sub">Gate arrival after 08:00 AM</span>
          </div>
        </div>

        <div className="ca-kpi-card">
          <div className="ca-kpi-icon-wrap" style={{ background: "rgba(239, 68, 68, 0.15)", color: "#ef4444" }}>
            ⚠️
          </div>
          <div>
            <span className="ca-kpi-label">Unexcused Absences</span>
            <div className="ca-kpi-val" style={{ color: "#f87171" }}>{unexcusedCount} Days</div>
            <span className="ca-kpi-sub">{excusedCount} Excused Leave(s)</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="ca-toolbar">
        <div className="ca-filters">
          <div className="ca-filter-item">
            <label>Filter by Status:</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All Roll Calls ({attendanceList.length})</option>
              <option value="Present">Present Only</option>
              <option value="Late">Late Arrivals</option>
              <option value="Excused">Excused Absences</option>
              <option value="Unexcused">Unexcused Absences</option>
            </select>
          </div>
        </div>
      </div>

      {/* Attendance Log Table */}
      <div className="ca-table-card">
        <div className="ca-table-responsive">
          <table className="ca-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Day of Week</th>
                <th>Attendance Status</th>
                <th>Arrival Timestamp</th>
                <th>Auditor / Form Tutor</th>
                <th>Official Notes & Remarks</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="ca-empty">
                    No attendance logs match the current filter.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, idx) => (
                  <tr key={idx} className="ca-table-row">
                    <td>
                      <strong className="ca-date-text">{log.date}</strong>
                    </td>
                    <td>{log.day}</td>
                    <td>
                      <span
                        className={`ca-status-badge ${
                          log.status === "Present"
                            ? "present"
                            : log.status.includes("Late")
                            ? "late"
                            : log.status.includes("Excused")
                            ? "excused"
                            : "absent"
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td>
                      <code className="ca-time-code">{log.checkIn}</code>
                    </td>
                    <td>
                      <span className="ca-tutor-name">{child.formTutor.split("(")[0]}</span>
                    </td>
                    <td>
                      <span className="ca-remarks-text">{log.remarks}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submit Excuse Notice Modal */}
      {excuseModalOpen && (
        <div className="ca-modal-overlay">
          <div className="ca-modal-box">
            <div className="ca-modal-header">
              <div>
                <h3>📝 Submit Student Absence Notice</h3>
                <p>Notify St. Michael's administration and form tutor of expected absence.</p>
              </div>
              <button className="ca-btn-close" onClick={() => setExcuseModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmitExcuse} className="ca-modal-form">
              <div className="ca-form-field">
                <label>Reason for Absence:</label>
                <select value={excuseReason} onChange={(e) => setExcuseReason(e.target.value)}>
                  <option value="Medical & Physician Appointment">Medical / Physician Appointment</option>
                  <option value="Illness & Bed Rest">Illness & Convalescence</option>
                  <option value="Family Bereavement">Family Bereavement</option>
                  <option value="National Academic Olympiad">External Competition / Olympiad</option>
                  <option value="Travel & Visa Renewal">Official Travel / Visa Appointment</option>
                </select>
              </div>

              <div className="ca-form-row">
                <div className="ca-form-field">
                  <label>Start Date of Absence:</label>
                  <input
                    type="date"
                    value={excuseStartDate}
                    onChange={(e) => setExcuseStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="ca-form-field">
                  <label>Expected Return Date:</label>
                  <input
                    type="date"
                    value={excuseEndDate}
                    onChange={(e) => setExcuseEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="ca-form-field">
                <label>Parent Explanation & Physician Notes:</label>
                <textarea
                  rows="3"
                  placeholder="e.g. Elena has a specialist dental appointment in the morning and will resume afternoon classes by 1:00 PM."
                  value={excuseNotes}
                  onChange={(e) => setExcuseNotes(e.target.value)}
                  required
                />
              </div>

              <div className="ca-modal-footer">
                <button type="button" className="ca-btn-cancel" onClick={() => setExcuseModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="ca-btn-submit">
                  Dispatch Excuse Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
