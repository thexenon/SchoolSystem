import React, { useState } from "react";
import AttendanceNav from "./AttendanceNav";
import "./AttendanceRegister.css";
import { INITIAL_STUDENT_ATTENDANCE } from "./attendanceData";
import { STREAMS_LIST } from "../Academic Structure/academicData";
import SpinningWordsBackground from "../components/SpinningWordsBackground";
import MotivationQuoteWidget from "../components/MotivationQuoteWidget";

export default function AttendanceRegister({ onNavigate }) {
  const [selectedStream, setSelectedStream] = useState("Grade 11-A (General Science & STEM)");
  const [selectedDate, setSelectedDate] = useState("2026-11-12");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredRecords = INITIAL_STUDENT_ATTENDANCE.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.studentName.toLowerCase().includes(q) ||
      item.studentId.toLowerCase().includes(q) ||
      item.rollNumber.toLowerCase().includes(q) ||
      item.notes.toLowerCase().includes(q);
    const matchesStatus =
      statusFilter === "ALL" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    const headers = "Student ID,Student Name,Roll Number,Date,Status,Check-In Time,Marked By,Notes\n";
    const rows = filteredRecords
      .map(
        (r) =>
          `"${r.studentId}","${r.studentName}","${r.rollNumber}","${r.date}","${r.status}","${r.checkInTime}","${r.markedBy}","${r.notes}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_register_${selectedDate}.csv`;
    a.click();
    showToast("Downloaded official CSV Attendance Register.");
  };

  const handlePrint = () => {
    window.print();
    showToast("Prepared official attendance register for print.");
  };

  const presentCount = filteredRecords.filter((r) => r.status === "Present").length;
  const absentCount = filteredRecords.filter((r) => r.status === "Absent").length;
  const lateCount = filteredRecords.filter((r) => r.status === "Late").length;
  const excusedCount = filteredRecords.filter((r) => r.status === "Excused").length;
  const ratePct = Math.round((presentCount / (filteredRecords.length || 1)) * 100);

  return (
    <div className="ar-page-wrapper">
      <SpinningWordsBackground speed="slow" showControlBadge={false} />

      {/* Toast Alert */}
      {toastMessage && <div className="ar-toast">✓ {toastMessage}</div>}

      <AttendanceNav
        activePath="/attendance-register"
        title="Attendance Register"
        subtitle="Official roll call records, audit logs, and exportable attendance sheets"
      />

      <MotivationQuoteWidget compact={true} />

      {/* KPI Stats Strip */}
      <div className="ar-kpi-grid">
        <div className="ar-kpi-card">
          <div className="ar-kpi-top">
            <span className="ar-kpi-label">Class Roll Size</span>
            <span className="ar-kpi-icon">📋</span>
          </div>
          <div className="ar-kpi-val">{filteredRecords.length} Records</div>
          <div className="ar-kpi-sub">{selectedStream}</div>
        </div>

        <div className="ar-kpi-card">
          <div className="ar-kpi-top">
            <span className="ar-kpi-label">Attendance Percentage</span>
            <span className="ar-kpi-icon">📊</span>
          </div>
          <div className="ar-kpi-val" style={{ color: "#34d399" }}>
            {ratePct}% Attendance
          </div>
          <div className="ar-kpi-sub">{presentCount} Present • {absentCount} Absent</div>
        </div>

        <div className="ar-kpi-card">
          <div className="ar-kpi-top">
            <span className="ar-kpi-label">Late & Excused</span>
            <span className="ar-kpi-icon">⏱️</span>
          </div>
          <div className="ar-kpi-val" style={{ color: "#fbbf24" }}>
            {lateCount} Late • {excusedCount} Excused
          </div>
          <div className="ar-kpi-sub">Verified Notes Recorded</div>
        </div>

        <div className="ar-kpi-card">
          <div className="ar-kpi-top">
            <span className="ar-kpi-label">Audit Certification</span>
            <span className="ar-kpi-icon">🛡️</span>
          </div>
          <div className="ar-kpi-val" style={{ color: "#38bdf8" }}>
            WAEC Synced
          </div>
          <div className="ar-kpi-sub">Official Academic Record</div>
        </div>
      </div>

      {/* Filter and Export Bar */}
      <div className="ar-action-bar">
        <div className="ar-filters-row">
          <div className="ar-search-box">
            <span className="ar-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search student, roll number, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="ar-clear-btn"
                onClick={() => setSearchQuery("")}
              >
                ×
              </button>
            )}
          </div>

          <select
            className="ar-select"
            value={selectedStream}
            onChange={(e) => setSelectedStream(e.target.value)}
          >
            {STREAMS_LIST.map((str) => (
              <option key={str.id} value={str.name}>
                {str.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            className="ar-date-input"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />

          <select
            className="ar-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Late">Late</option>
            <option value="Excused">Excused</option>
          </select>
        </div>

        <div className="ar-btn-group">
          <button
            type="button"
            className="ar-btn-action"
            onClick={handleExportCSV}
          >
            <span>📥</span> Export CSV
          </button>
          <button
            type="button"
            className="ar-btn-action"
            onClick={handlePrint}
          >
            <span>🖨️</span> Print Register
          </button>
        </div>
      </div>

      {/* Attendance Register Table */}
      <div className="ar-table-card">
        <div className="ar-card-header">
          <div>
            <h3>Official Attendance Register — {selectedDate}</h3>
            <p>Class: <strong>{selectedStream}</strong> • Term 1 Academic Session</p>
          </div>
          <div className="ar-legend">
            <span className="ar-leg-item leg-pres">● Present</span>
            <span className="ar-leg-item leg-abs">● Absent</span>
            <span className="ar-leg-item leg-late">● Late</span>
            <span className="ar-leg-item leg-exc">● Excused</span>
          </div>
        </div>

        <div className="ar-table-scroll">
          <table className="ar-table">
            <thead>
              <tr>
                <th>Student ID & Name</th>
                <th>Roll Code</th>
                <th>Date</th>
                <th>Attendance Status</th>
                <th>Time In</th>
                <th>Marked By</th>
                <th>Teacher Remarks</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div className="ar-stu-cell">
                      <span className="ar-avatar-circle">
                        {r.studentName[0]}
                      </span>
                      <div>
                        <div className="ar-stu-name">{r.studentName}</div>
                        <div className="ar-stu-id">{r.studentId}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="ar-roll-code">{r.rollNumber}</span>
                  </td>
                  <td>{r.date}</td>
                  <td>
                    <span
                      className={`ar-status-badge badge-${r.status.toLowerCase()}`}
                    >
                      ● {r.status}
                    </span>
                  </td>
                  <td>
                    <span className="ar-time-text">{r.checkInTime}</span>
                  </td>
                  <td>
                    <span className="ar-marked-by">👨‍🏫 {r.markedBy}</span>
                  </td>
                  <td style={{ fontSize: "12px", color: "#94a3b8" }}>
                    {r.notes || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredRecords.length === 0 && (
        <div className="ar-empty-state">
          <p>No records found matching current search and filter selections.</p>
          <button
            type="button"
            className="ar-btn-action"
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("ALL");
            }}
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
