import React, { useState } from "react";
import AttendanceNav from "./AttendanceNav";
import "./TakeAttendance.css";
import { INITIAL_STUDENT_ATTENDANCE } from "./attendanceData";
import { STREAMS_LIST } from "../Academic Structure/academicData";
import SpinningWordsBackground from "../components/SpinningWordsBackground";
import MotivationQuoteWidget from "../components/MotivationQuoteWidget";

export default function TakeAttendance({ onNavigate }) {
  const [selectedStream, setSelectedStream] = useState("Grade 11-A (General Science & STEM)");
  const [selectedDate, setSelectedDate] = useState("2026-11-12");
  const [sessionPeriod, setSessionPeriod] = useState("Morning Assembly & Roll Call");
  const [attendanceList, setAttendanceList] = useState(INITIAL_STUDENT_ATTENDANCE);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleStatusChange = (id, newStatus) => {
    setAttendanceList((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: newStatus,
              checkInTime:
                newStatus === "Present"
                  ? "07:50 AM"
                  : newStatus === "Late"
                  ? "08:15 AM"
                  : "—",
            }
          : item
      )
    );
  };

  const handleNotesChange = (id, newNotes) => {
    setAttendanceList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, notes: newNotes } : item))
    );
  };

  const handleMarkAllPresent = () => {
    setAttendanceList((prev) =>
      prev.map((item) => ({
        ...item,
        status: "Present",
        checkInTime: "07:45 AM",
      }))
    );
    showToast("Marked all students as Present!");
  };

  const handleClearAll = () => {
    setAttendanceList((prev) =>
      prev.map((item) => ({
        ...item,
        status: "Absent",
        checkInTime: "—",
      }))
    );
    showToast("Cleared all attendance statuses.");
  };

  const handleSaveRegister = (e) => {
    e.preventDefault();
    showToast(`✓ Register for ${selectedStream} on ${selectedDate} saved successfully! Synchronized to Parent Alerts & Principal Dashboard.`);
  };

  const presentCount = attendanceList.filter((s) => s.status === "Present").length;
  const absentCount = attendanceList.filter((s) => s.status === "Absent").length;
  const lateCount = attendanceList.filter((s) => s.status === "Late").length;
  const excusedCount = attendanceList.filter((s) => s.status === "Excused").length;
  const attendanceRate = Math.round((presentCount / (attendanceList.length || 1)) * 100);

  return (
    <div className="ta-page-wrapper">
      <SpinningWordsBackground speed="slow" showControlBadge={false} />

      {/* Toast Alert */}
      {toastMessage && <div className="ta-toast">✓ {toastMessage}</div>}

      <AttendanceNav
        activePath="/take-attendance"
        title="Take Class Attendance"
        subtitle="Mark roll call: Present, Absent, Late, or Excused with real-time guardian sync"
      />

      <MotivationQuoteWidget compact={true} />

      {/* KPI Stats Strip */}
      <div className="ta-kpi-grid">
        <div className="ta-kpi-card">
          <div className="ta-kpi-top">
            <span className="ta-kpi-label">Class Roster</span>
            <span className="ta-kpi-icon">👥</span>
          </div>
          <div className="ta-kpi-val">{attendanceList.length} Students</div>
          <div className="ta-kpi-sub">Grade 11-A Roll Register</div>
        </div>

        <div className="ta-kpi-card">
          <div className="ta-kpi-top">
            <span className="ta-kpi-label">Present</span>
            <span className="ta-kpi-icon">🟢</span>
          </div>
          <div className="ta-kpi-val" style={{ color: "#34d399" }}>
            {presentCount} Students
          </div>
          <div className="ta-kpi-sub">{attendanceRate}% Attendance Rate</div>
        </div>

        <div className="ta-kpi-card">
          <div className="ta-kpi-top">
            <span className="ta-kpi-label">Absent & Late</span>
            <span className="ta-kpi-icon">⚠️</span>
          </div>
          <div className="ta-kpi-val" style={{ color: absentCount > 0 ? "#f87171" : "#94a3b8" }}>
            {absentCount} Absent • {lateCount} Late
          </div>
          <div className="ta-kpi-sub">Triggers Automated Guardian Alerts</div>
        </div>

        <div className="ta-kpi-card">
          <div className="ta-kpi-top">
            <span className="ta-kpi-label">Excused Absences</span>
            <span className="ta-kpi-icon">🔵</span>
          </div>
          <div className="ta-kpi-val" style={{ color: "#38bdf8" }}>
            {excusedCount} Excused
          </div>
          <div className="ta-kpi-sub">Medical Note / Olympiad Verified</div>
        </div>
      </div>

      {/* Control Filter Bar */}
      <div className="ta-control-bar">
        <div className="ta-selectors-row">
          <div className="ta-form-group">
            <label>Select Cohort / Stream</label>
            <select
              className="ta-select"
              value={selectedStream}
              onChange={(e) => setSelectedStream(e.target.value)}
            >
              {STREAMS_LIST.map((str) => (
                <option key={str.id} value={str.name}>
                  {str.name} ({str.room})
                </option>
              ))}
            </select>
          </div>

          <div className="ta-form-group">
            <label>Date of Roll Call</label>
            <input
              type="date"
              className="ta-input-date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div className="ta-form-group">
            <label>Session Period</label>
            <select
              className="ta-select"
              value={sessionPeriod}
              onChange={(e) => setSessionPeriod(e.target.value)}
            >
              <option value="Morning Assembly & Roll Call">Morning Assembly & Roll Call</option>
              <option value="Period 1 (08:35 - 09:50 AM)">Period 1 (08:35 - 09:50 AM)</option>
              <option value="Period 2 (09:55 - 11:10 AM)">Period 2 (09:55 - 11:10 AM)</option>
              <option value="Afternoon Session (01:20 - 02:35 PM)">Afternoon Session</option>
            </select>
          </div>
        </div>

        <div className="ta-batch-actions">
          <button
            type="button"
            className="ta-btn-batch ta-btn-present"
            onClick={handleMarkAllPresent}
          >
            ✓ Mark All Present
          </button>
          <button
            type="button"
            className="ta-btn-batch ta-btn-clear"
            onClick={handleClearAll}
          >
            ↺ Clear
          </button>
        </div>
      </div>

      {/* Student Attendance List Table */}
      <div className="ta-table-card">
        <div className="ta-card-header">
          <div>
            <h3>Mark Student Attendance Register</h3>
            <p>
              Click status pills to mark attendance. Real-time updates automatically compute attendance averages.
            </p>
          </div>
          <button
            type="button"
            className="ta-btn-save"
            onClick={handleSaveRegister}
          >
            💾 Save & Submit Register
          </button>
        </div>

        <div className="ta-table-scroll">
          <table className="ta-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Student ID & Name</th>
                <th>Roll Code</th>
                <th>Attendance Status</th>
                <th>Check-In Time</th>
                <th>Teacher Remarks & Justification</th>
              </tr>
            </thead>
            <tbody>
              {attendanceList.map((stu, idx) => (
                <tr key={stu.id} className={`ta-row-${stu.status.toLowerCase()}`}>
                  <td>{idx + 1}</td>
                  <td>
                    <div className="ta-stu-info">
                      <span className="ta-avatar-dot">
                        {stu.studentName[0]}
                      </span>
                      <div>
                        <div className="ta-stu-name">{stu.studentName}</div>
                        <div className="ta-stu-id">{stu.studentId}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="ta-roll-badge">{stu.rollNumber}</span>
                  </td>
                  <td>
                    <div className="ta-status-pills-group">
                      <button
                        type="button"
                        className={`ta-pill-btn pill-present ${
                          stu.status === "Present" ? "selected" : ""
                        }`}
                        onClick={() => handleStatusChange(stu.id, "Present")}
                      >
                        ✓ Present
                      </button>

                      <button
                        type="button"
                        className={`ta-pill-btn pill-absent ${
                          stu.status === "Absent" ? "selected" : ""
                        }`}
                        onClick={() => handleStatusChange(stu.id, "Absent")}
                      >
                        ✕ Absent
                      </button>

                      <button
                        type="button"
                        className={`ta-pill-btn pill-late ${
                          stu.status === "Late" ? "selected" : ""
                        }`}
                        onClick={() => handleStatusChange(stu.id, "Late")}
                      >
                        ⏱ Late
                      </button>

                      <button
                        type="button"
                        className={`ta-pill-btn pill-excused ${
                          stu.status === "Excused" ? "selected" : ""
                        }`}
                        onClick={() => handleStatusChange(stu.id, "Excused")}
                      >
                        📋 Excused
                      </button>
                    </div>
                  </td>
                  <td>
                    <span className="ta-checkin-time">{stu.checkInTime}</span>
                  </td>
                  <td>
                    <input
                      type="text"
                      className="ta-notes-input"
                      value={stu.notes}
                      placeholder="Add note or arrival reason..."
                      onChange={(e) => handleNotesChange(stu.id, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
