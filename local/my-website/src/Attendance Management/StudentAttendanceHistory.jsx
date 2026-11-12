import React, { useState } from "react";
import { Link } from "react-router-dom";
import AttendanceNav from "./AttendanceNav";
import "./StudentAttendanceHistory.css";
import { ATTENDANCE_HISTORY_SAMPLE } from "./attendanceData";
import { getStudents } from "../Student Management/studentData";
import SpinningWordsBackground from "../components/SpinningWordsBackground";
import MotivationQuoteWidget from "../components/MotivationQuoteWidget";

export default function StudentAttendanceHistory({ onNavigate }) {
  const allStudents = getStudents("ALL");
  const [selectedStudentId, setSelectedStudentId] = useState(
    allStudents[0]?.id || "STU-SMIA-002"
  );
  const [historyList, setHistoryList] = useState(ATTENDANCE_HISTORY_SAMPLE);
  const [monthFilter, setMonthFilter] = useState("November 2026");
  const [toastMessage, setToastMessage] = useState(null);

  const selectedStudent =
    allStudents.find((s) => s.id === selectedStudentId) || allStudents[0];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handlePrintRecord = () => {
    window.print();
    showToast(`Prepared attendance transcript for ${selectedStudent.fullName}.`);
  };

  const presentDays = historyList.filter((h) => h.status === "Present").length;
  const absentDays = historyList.filter((h) => h.status === "Absent").length;
  const lateDays = historyList.filter((h) => h.status === "Late").length;
  const excusedDays = historyList.filter((h) => h.status === "Excused").length;
  const totalDays = historyList.length || 1;
  const attendanceRate = Math.round(((presentDays + excusedDays) / totalDays) * 100);

  return (
    <div className="sah-page-wrapper">
      <SpinningWordsBackground speed="slow" showControlBadge={false} />

      {/* Toast Alert */}
      {toastMessage && <div className="sah-toast">✓ {toastMessage}</div>}

      <AttendanceNav
        activePath="/student-attendance-history"
        title="Student Attendance History"
        subtitle="Individual student attendance records, monthly calendar heatmap, and tardiness audit"
      />

      <MotivationQuoteWidget compact={true} />

      {/* Student Selector Card */}
      <div className="sah-profile-card">
        <div className="sah-profile-left">
          <div className="sah-avatar-big">
            {selectedStudent.firstName ? selectedStudent.firstName[0] : "S"}
            {selectedStudent.lastName ? selectedStudent.lastName[0] : "T"}
          </div>
          <div>
            <div className="sah-student-picker-row">
              <h2 className="sah-name">{selectedStudent.fullName}</h2>
              <select
                className="sah-picker-select"
                value={selectedStudentId}
                onChange={(e) => {
                  setSelectedStudentId(e.target.value);
                  showToast(`Viewing attendance for ${e.target.value}`);
                }}
              >
                {allStudents.slice(0, 10).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.fullName} ({s.id})
                  </option>
                ))}
              </select>
            </div>
            <div className="sah-meta-row">
              <span>🆔 <strong>{selectedStudent.id}</strong></span>
              <span>•</span>
              <span>Class: <strong>{selectedStudent.grade} - {selectedStudent.section}</strong></span>
              <span>•</span>
              <span>Roll: <strong>{selectedStudent.rollNumber}</strong></span>
              <span>•</span>
              <span>Campus: <strong>{selectedStudent.campus}</strong></span>
            </div>
          </div>
        </div>

        <div className="sah-profile-actions">
          <Link to="/attendance-correction" className="sah-btn-outline">
            🛠️ Request Correction
          </Link>
          <button
            type="button"
            className="sah-btn-print"
            onClick={handlePrintRecord}
          >
            🖨️ Print Transcript
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="sah-kpi-grid">
        <div className="sah-kpi-card">
          <div className="sah-kpi-top">
            <span className="sah-kpi-label">Overall Attendance Rate</span>
            <span className="sah-kpi-icon">📈</span>
          </div>
          <div className="sah-kpi-val" style={{ color: "#34d399" }}>
            {attendanceRate}%
          </div>
          <div className="sah-kpi-sub">Meets Excellence Requirement (&gt; 90%)</div>
        </div>

        <div className="sah-kpi-card">
          <div className="sah-kpi-top">
            <span className="sah-kpi-label">Days Present</span>
            <span className="sah-kpi-icon">🟢</span>
          </div>
          <div className="sah-kpi-val">{presentDays} Days</div>
          <div className="sah-kpi-sub">On-Time Roll Call</div>
        </div>

        <div className="sah-kpi-card">
          <div className="sah-kpi-top">
            <span className="sah-kpi-label">Excused & Late</span>
            <span className="sah-kpi-icon">⏱️</span>
          </div>
          <div className="sah-kpi-val" style={{ color: "#fbbf24" }}>
            {excusedDays} Excused • {lateDays} Tardy
          </div>
          <div className="sah-kpi-sub">Documented Official Reasons</div>
        </div>

        <div className="sah-kpi-card">
          <div className="sah-kpi-top">
            <span className="sah-kpi-label">Unexcused Absences</span>
            <span className="sah-kpi-icon">🚨</span>
          </div>
          <div className="sah-kpi-val" style={{ color: absentDays > 0 ? "#f87171" : "#94a3b8" }}>
            {absentDays} Absent
          </div>
          <div className="sah-kpi-sub">Medical Certificate on File</div>
        </div>
      </div>

      {/* Monthly Attendance Calendar Heatmap Strip */}
      <div className="sah-calendar-card">
        <div className="sah-cal-header">
          <div>
            <h3>Monthly Attendance Grid — {monthFilter}</h3>
            <p>Visual day-by-day record of student participation</p>
          </div>
          <select
            className="sah-month-select"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
          >
            <option value="November 2026">November 2026</option>
            <option value="October 2026">October 2026</option>
            <option value="September 2026">September 2026</option>
          </select>
        </div>

        <div className="sah-days-grid">
          {historyList.map((item, idx) => (
            <div
              key={idx}
              className={`sah-day-cell cell-${item.status.toLowerCase()}`}
              title={`${item.date}: ${item.status} (${item.notes})`}
            >
              <div className="sah-day-num">{item.date.split("-")[2]}</div>
              <div className="sah-day-status">{item.status}</div>
              <div className="sah-day-time">{item.checkIn}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Chronological Table Log */}
      <div className="sah-history-card">
        <div className="sah-history-header">
          <h3>Chronological Attendance Register Entries</h3>
          <p>Audited records signed off by class tutor and biometric gate</p>
        </div>

        <div className="sah-table-scroll">
          <table className="sah-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
                <th>Session / Period</th>
                <th>Check-In Time</th>
                <th>Audited Remarks & Notes</th>
              </tr>
            </thead>
            <tbody>
              {historyList.map((entry, idx) => (
                <tr key={idx}>
                  <td>
                    <strong style={{ color: "#f8fafc" }}>{entry.date}</strong>
                  </td>
                  <td>
                    <span
                      className={`sah-badge badge-${entry.status.toLowerCase()}`}
                    >
                      ● {entry.status}
                    </span>
                  </td>
                  <td>{entry.period}</td>
                  <td>
                    <span className="sah-time-code">{entry.checkIn}</span>
                  </td>
                  <td style={{ color: "#94a3b8" }}>{entry.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
