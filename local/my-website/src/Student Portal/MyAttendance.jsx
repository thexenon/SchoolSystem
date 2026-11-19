import React, { useState, useEffect } from "react";
import StudentNav from "./StudentNav";
import { getActiveStudent, STUDENT_ATTENDANCE_LOGS } from "./studentPortalData";
import "./MyAttendance.css";

export default function MyAttendance() {
  const [student, setStudent] = useState(getActiveStudent());
  const [logs, setLogs] = useState(STUDENT_ATTENDANCE_LOGS);
  const [filter, setFilter] = useState("All");
  const [showExcuseModal, setShowExcuseModal] = useState(false);
  const [excuseDate, setExcuseDate] = useState("");
  const [excuseReason, setExcuseReason] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handleStudentChanged = (e) => {
      if (e.detail) setStudent(e.detail);
      else setStudent(getActiveStudent());
    };
    window.addEventListener("studentUserChanged", handleStudentChanged);
    return () => window.removeEventListener("studentUserChanged", handleStudentChanged);
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExcuseSubmit = (e) => {
    e.preventDefault();
    if (!excuseDate || !excuseReason.trim()) return;

    const newLog = {
      id: `ATT-${Math.floor(Math.random() * 800 + 200)}`,
      date: excuseDate,
      day: new Date(excuseDate).toLocaleDateString("en-US", { weekday: "long" }),
      status: "Excused",
      timeIn: "—",
      timeOut: "—",
      remarks: `Absence Notice: ${excuseReason.trim()}`,
    };

    setLogs([newLog, ...logs]);
    setShowExcuseModal(false);
    setExcuseDate("");
    setExcuseReason("");
    showToast(`Absence excuse notice logged for ${excuseDate}!`);
  };

  const filteredLogs = logs.filter((item) => {
    if (filter === "All") return true;
    return item.status === filter;
  });

  const presentCount = logs.filter((l) => l.status === "Present").length;
  const lateCount = logs.filter((l) => l.status === "Late").length;
  const excusedCount = logs.filter((l) => l.status === "Excused").length;

  return (
    <div className="ma-page-container">
      {toast && (
        <div className="ma-toast">
          <span>✓</span> {toast}
        </div>
      )}

      <StudentNav
        title="Student Attendance & Roll Register"
        subtitle="Daily biometric roll records, homeroom arrival timings, excuse applications, and term percentage"
        badge="Module 12 • Screen 4 of 10"
      />

      {/* Header Bar */}
      <div className="ma-header-strip">
        <div>
          <span className="ma-tag">OFFICIAL ATTENDANCE DOSSIER</span>
          <h1 className="ma-title">Term Attendance Register</h1>
          <p className="ma-sub">
            Verified attendance tracking for <strong>{student.fullName}</strong> ({student.id}) •{" "}
            {student.grade} - {student.section}
          </p>
        </div>

        <div className="ma-actions">
          <button className="ma-btn-excuse" onClick={() => setShowExcuseModal(true)}>
            📝 Submit Absence Excuse
          </button>
          <button className="ma-btn-print" onClick={handlePrint}>
            🖨️ Print Attendance Log
          </button>
        </div>
      </div>

      {/* Attendance KPI Cards */}
      <div className="ma-kpi-grid">
        <div className="ma-kpi-card">
          <div className="ma-kpi-label">Cumulative Term Rate</div>
          <div className="ma-kpi-val text-emerald">{student.attendancePct}%</div>
          <div className="ma-kpi-foot">Required benchmark: ≥ 85.0%</div>
        </div>

        <div className="ma-kpi-card">
          <div className="ma-kpi-label">Present Sessions</div>
          <div className="ma-kpi-val text-cyan">{presentCount} Days</div>
          <div className="ma-kpi-foot">Punctual biometric check-ins</div>
        </div>

        <div className="ma-kpi-card">
          <div className="ma-kpi-label">Late Arrivals</div>
          <div className="ma-kpi-val text-amber">{lateCount} Days</div>
          <div className="ma-kpi-foot">Morning gate records noted</div>
        </div>

        <div className="ma-kpi-card">
          <div className="ma-kpi-label">Excused / Approved Leaves</div>
          <div className="ma-kpi-val text-purple">{excusedCount} Days</div>
          <div className="ma-kpi-foot">Medical slips & Olympiads</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="ma-filter-bar">
        <button
          className={`ma-filter-btn ${filter === "All" ? "active" : ""}`}
          onClick={() => setFilter("All")}
        >
          All Records ({logs.length})
        </button>
        <button
          className={`ma-filter-btn ${filter === "Present" ? "active" : ""}`}
          onClick={() => setFilter("Present")}
        >
          ✅ Present ({presentCount})
        </button>
        <button
          className={`ma-filter-btn ${filter === "Late" ? "active" : ""}`}
          onClick={() => setFilter("Late")}
        >
          ⏳ Late Arrivals ({lateCount})
        </button>
        <button
          className={`ma-filter-btn ${filter === "Excused" ? "active" : ""}`}
          onClick={() => setFilter("Excused")}
        >
          📄 Excused Leaves ({excusedCount})
        </button>
      </div>

      {/* Attendance Logs Table */}
      <div className="ma-card">
        <div className="ma-table-wrapper">
          <table className="ma-table">
            <thead>
              <tr>
                <th>Log ID</th>
                <th>Calendar Date</th>
                <th>Day</th>
                <th>Roll Status</th>
                <th>Check-In Time</th>
                <th>Check-Out Time</th>
                <th>Supervisor & Master Remarks</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td className="font-mono ma-log-id">{log.id}</td>
                  <td className="font-mono text-cyan"><strong>{log.date}</strong></td>
                  <td>{log.day}</td>
                  <td>
                    <span
                      className={`ma-status-badge ${
                        log.status === "Present"
                          ? "status-present"
                          : log.status === "Late"
                          ? "status-late"
                          : "status-excused"
                      }`}
                    >
                      ● {log.status}
                    </span>
                  </td>
                  <td className="font-mono">{log.timeIn}</td>
                  <td className="font-mono">{log.timeOut}</td>
                  <td className="ma-remarks-col">{log.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Excuse Application Modal */}
      {showExcuseModal && (
        <div className="ma-modal-backdrop" onClick={() => setShowExcuseModal(false)}>
          <div className="ma-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="ma-modal-header">
              <h3>Submit Absence Excuse Note</h3>
              <button className="ma-modal-close" onClick={() => setShowExcuseModal(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleExcuseSubmit}>
              <p className="ma-modal-desc">
                Submit an advance notification or medical explanation for missed academic sessions.
                This will be queued directly to Form Tutor <strong>{student.classTutor}</strong>.
              </p>

              <div className="ma-form-group">
                <label>Date of Absence:</label>
                <input
                  type="date"
                  value={excuseDate}
                  onChange={(e) => setExcuseDate(e.target.value)}
                  required
                />
              </div>

              <div className="ma-form-group">
                <label>Reason / Supporting Explanation:</label>
                <textarea
                  rows={4}
                  placeholder="e.g., Hospital clinic appointment or official inter-school debate fixture..."
                  value={excuseReason}
                  onChange={(e) => setExcuseReason(e.target.value)}
                  required
                />
              </div>

              <div className="ma-modal-footer">
                <button
                  type="button"
                  className="ma-btn-cancel"
                  onClick={() => setShowExcuseModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="ma-btn-submit">
                  Submit Excuse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
