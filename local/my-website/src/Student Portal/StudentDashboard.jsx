import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StudentNav from "./StudentNav";
import {
  getActiveStudent,
  WEEKLY_TIMETABLE,
  STUDENT_RESULTS_DATA,
  getStoredAssignments,
  STUDENT_CALENDAR_EVENTS,
} from "./studentPortalData";
import SpinningWordsBackground from "../components/SpinningWordsBackground";
import MotivationQuoteWidget from "../components/MotivationQuoteWidget";
import "./StudentDashboard.css";

export default function StudentDashboard() {
  const [student, setStudent] = useState(getActiveStudent());
  const [assignments] = useState(getStoredAssignments());
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

  // Compute stats
  const pendingAssignments = assignments.filter(
    (a) => a.status === "In Progress" || a.status === "Pending"
  );
  const todaySchedule = WEEKLY_TIMETABLE.Monday || [];
  const nextExam = STUDENT_CALENDAR_EVENTS.find((e) => e.category === "Examination");

  return (
    <div className="sd-page-container">
      <SpinningWordsBackground speed="slow" />

      {toast && (
        <div className="sd-toast">
          <span>✓</span> {toast}
        </div>
      )}

      <StudentNav
        title="Student Academic Command Center"
        subtitle="Complete overview of academic schedules, coursework submissions, GPA metrics, and campus alerts"
        badge="Module 12 • Screen 1 of 10"
      />

      {/* Hero Welcome Banner */}
      <div className="sd-hero-card">
        <div className="sd-hero-avatar">
          {student.firstName[0]}
          {student.lastName[0]}
        </div>
        <div className="sd-hero-details">
          <div className="sd-hero-badges">
            <span className="sd-badge sd-badge-active">● Active Scholar</span>
            <span className="sd-badge sd-badge-house">🏠 {student.house}</span>
          </div>
          <h1 className="sd-hero-name">Welcome back, {student.fullName}!</h1>
          <p className="sd-hero-sub">
            ID: <strong className="font-mono">{student.id}</strong> • Class:{" "}
            <strong>{student.grade} - {student.section}</strong> • Roll No:{" "}
            <strong>{student.rollNumber}</strong> • Tutor: <strong>{student.classTutor}</strong>
          </p>
        </div>
        <div className="sd-hero-actions">
          <Link to="/student-profile" className="sd-hero-btn">
            👤 View Full Dossier
          </Link>
        </div>
      </div>

      {/* Daily Motivation Quote */}
      <MotivationQuoteWidget />

      {/* KPI Stats Strip */}
      <div className="sd-kpi-grid">
        <div className="sd-kpi-card">
          <div className="sd-kpi-top">
            <span className="sd-kpi-label">Cumulative GPA</span>
            <span className="sd-kpi-icon">🌟</span>
          </div>
          <div className="sd-kpi-value text-cyan">
            {student.gpa} <span className="sd-kpi-subval">/ 4.00</span>
          </div>
          <div className="sd-kpi-footer">Ranked Top 5% in {student.grade}</div>
        </div>

        <div className="sd-kpi-card">
          <div className="sd-kpi-top">
            <span className="sd-kpi-label">Term Attendance</span>
            <span className="sd-kpi-icon">📋</span>
          </div>
          <div className="sd-kpi-value text-emerald">{student.attendancePct}%</div>
          <div className="sd-kpi-footer">114 Days Present • 0 Unexcused</div>
        </div>

        <div className="sd-kpi-card">
          <div className="sd-kpi-top">
            <span className="sd-kpi-label">Pending Coursework</span>
            <span className="sd-kpi-icon">📁</span>
          </div>
          <div className="sd-kpi-value text-amber">{pendingAssignments.length} Tasks</div>
          <div className="sd-kpi-footer">
            Next deadline: {pendingAssignments[0]?.dueDate || "None"}
          </div>
        </div>

        <div className="sd-kpi-card">
          <div className="sd-kpi-top">
            <span className="sd-kpi-label">Fee Clearance</span>
            <span className="sd-kpi-icon">💳</span>
          </div>
          <div
            className={`sd-kpi-value ${
              student.feesBalance === "GH₵0.00" ? "text-emerald" : "text-amber"
            }`}
          >
            {student.feesBalance}
          </div>
          <div className="sd-kpi-footer">
            {student.feesBalance === "GH₵0.00"
              ? "✓ Fully Cleared for Term"
              : "Outstanding Tuition Balance"}
          </div>
        </div>
      </div>

      {/* Quick Access Matrix */}
      <div className="sd-shortcuts-grid">
        <Link to="/student-timetable" className="sd-shortcut-card">
          <div className="sd-sc-icon">🗓️</div>
          <div className="sd-sc-title">My Timetable</div>
          <div className="sd-sc-desc">Class routine & room allocations</div>
        </Link>
        <Link to="/student-results" className="sd-shortcut-card">
          <div className="sd-sc-icon">📝</div>
          <div className="sd-sc-title">Exam Results</div>
          <div className="sd-sc-desc">Term grades & official report cards</div>
        </Link>
        <Link to="/student-assignments" className="sd-shortcut-card">
          <div className="sd-sc-icon">📁</div>
          <div className="sd-sc-title">My Assignments</div>
          <div className="sd-sc-desc">Submit projects & check scores</div>
        </Link>
        <Link to="/student-materials" className="sd-shortcut-card">
          <div className="sd-sc-icon">📚</div>
          <div className="sd-sc-title">Learning Materials</div>
          <div className="sd-sc-desc">Teacher slides, notes & past papers</div>
        </Link>
      </div>

      {/* Two Column Layout: Today's Schedule & Academic Highlights */}
      <div className="sd-columns-grid">
        {/* Left Column: Today's Schedule */}
        <div className="sd-panel">
          <div className="sd-panel-header">
            <h2 className="sd-panel-title">
              <span>🗓️</span> Today's Class Timetable
            </h2>
            <Link to="/student-timetable" className="sd-link-more">
              Weekly View →
            </Link>
          </div>

          <div className="sd-schedule-list">
            {todaySchedule.slice(0, 5).map((slot, idx) => (
              <div key={idx} className="sd-schedule-item">
                <div className="sd-time-pill font-mono">{slot.time}</div>
                <div className="sd-schedule-body">
                  <div className="sd-slot-title">{slot.subject}</div>
                  <div className="sd-slot-meta">
                    <span>📍 {slot.room}</span> • <span>👨‍🏫 {slot.teacher}</span>
                  </div>
                </div>
                <span className="sd-period-tag">{slot.period}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Deadlines & Enrolled Subject Highlights */}
        <div className="sd-panel">
          <div className="sd-panel-header">
            <h2 className="sd-panel-title">
              <span>⚡</span> Immediate Deadlines & Examination Alerts
            </h2>
            <Link to="/student-calendar" className="sd-link-more">
              Full Calendar →
            </Link>
          </div>

          {/* Exam Alert Card */}
          {nextExam && (
            <div className="sd-alert-banner">
              <div className="sd-alert-icon">📝</div>
              <div>
                <strong>{nextExam.title}</strong>
                <div className="sd-alert-sub">
                  Date: {nextExam.date} • Venue: {nextExam.location}
                </div>
              </div>
            </div>
          )}

          <div className="sd-assignments-preview">
            <h3 className="sd-sub-heading">Assignments Requiring Attention:</h3>
            {pendingAssignments.slice(0, 3).map((asn) => (
              <div key={asn.id} className="sd-asn-row">
                <div>
                  <div className="sd-asn-title">{asn.title}</div>
                  <div className="sd-asn-sub">
                    {asn.subject} • Due: <strong>{asn.dueDate}</strong>
                  </div>
                </div>
                <Link to="/student-assignments" className="sd-btn-submit-quick">
                  Submit ↗
                </Link>
              </div>
            ))}
          </div>

          {/* Academic Standing */}
          <div className="sd-standing-box">
            <div className="sd-standing-header">
              <span>Official Term Standing</span>
              <strong>{STUDENT_RESULTS_DATA.term}</strong>
            </div>
            <p className="sd-standing-quote">"{STUDENT_RESULTS_DATA.headmasterRemark}"</p>
            <div className="sd-standing-author">
              — Academic Directorate & Headmistress Office
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
