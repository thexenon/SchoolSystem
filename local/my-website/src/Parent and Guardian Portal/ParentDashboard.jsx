import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ParentNav from "./ParentNav";
import {
  getActiveParent,
  LINKED_CHILDREN,
  getActiveChildId,
  saveActiveChildId,
  CHILD_ATTENDANCE_LOGS,
  CHILD_RESULTS_DATA,
  SCHOOL_ANNOUNCEMENTS,
} from "./parentData";
import SpinningWordsBackground from "../components/SpinningWordsBackground";
import MotivationQuoteWidget from "../components/MotivationQuoteWidget";
import "./ParentDashboard.css";

export default function ParentDashboard() {
  const navigate = useNavigate();
  const parent = getActiveParent();
  const [activeChildId, setActiveChildId] = useState(getActiveChildId());
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handleChildChanged = () => {
      setActiveChildId(getActiveChildId());
    };
    window.addEventListener("childChanged", handleChildChanged);
    return () => window.removeEventListener("childChanged", handleChildChanged);
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const parentChildren = LINKED_CHILDREN.filter((c) =>
    parent.linkedStudentIds.includes(c.id)
  );

  const activeChild =
    parentChildren.find((c) => c.id === activeChildId) || parentChildren[0];

  const attendanceLogs = CHILD_ATTENDANCE_LOGS[activeChild.id] || [];
  const results = CHILD_RESULTS_DATA[activeChild.id] || null;

  const handleSelectChild = (id) => {
    setActiveChildId(id);
    saveActiveChildId(id);
    window.dispatchEvent(new Event("childChanged"));
    showToast(`Switched active view to ${LINKED_CHILDREN.find((c) => c.id === id)?.fullName}!`);
  };

  return (
    <div className="pd-container">
      {/* 3D Spinning Words Aura */}
      <SpinningWordsBackground speed="slow" showControlBadge={true} />

      <ParentNav
        title="Parent & Guardian Command Dashboard"
        subtitle="Holistic supervision of academic progress, daily attendance, fee settlements, and campus circulars"
        badge="Module 11 • Screen 1 of 10"
      />

      {toast && (
        <div className={`pd-toast pd-toast-${toast.type}`}>
          <div className="pd-toast-dot" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Hero Welcome Banner */}
      <div className="pd-hero-banner">
        <div className="pd-hero-left">
          <div className="pd-hero-avatar">
            {parent.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
          </div>
          <div>
            <div className="pd-welcome-tag">GUARDIAN PORTAL SESSION</div>
            <h1 className="pd-welcome-title">Welcome, {parent.fullName}</h1>
            <p className="pd-welcome-sub">
              Monitoring {parentChildren.length} registered wards enrolled at St. Michael's International Academy.
              Next PTA General Assembly is scheduled for <strong>November 25, 2026</strong>.
            </p>
          </div>
        </div>

        <div className="pd-hero-actions">
          <button
            className="pd-btn-momo"
            onClick={() => navigate("/parent-fee-payment")}
          >
            📱 Mobile Money Fee Hub (GH₵)
          </button>
          <button
            className="pd-btn-contact"
            onClick={() => navigate("/contact-school")}
          >
            ✉️ Message Form Tutor
          </button>
        </div>
      </div>

      {/* Floating Motivational Quote */}
      <MotivationQuoteWidget />

      {/* Linked Children Selector Cards */}
      <div className="pd-section-header">
        <h2>👨‍👩‍👧 Linked Children ({parentChildren.length})</h2>
        <span>Click any child to switch the active operational dashboard</span>
      </div>

      <div className="pd-children-grid">
        {parentChildren.map((child) => {
          const isSelected = child.id === activeChild.id;
          return (
            <div
              key={child.id}
              className={`pd-child-card ${isSelected ? "selected" : ""}`}
              onClick={() => handleSelectChild(child.id)}
            >
              <div className="pd-child-card-top">
                <div className="pd-child-avatar">{child.avatar}</div>
                <div className="pd-child-meta">
                  <h3>{child.fullName}</h3>
                  <span>{child.classCohort} • Roll: {child.rollNumber}</span>
                  <small>{child.campus} • {child.residentialStatus}</small>
                </div>
                {isSelected && <span className="pd-active-pill">✓ Active View</span>}
              </div>

              <div className="pd-child-quick-stats">
                <div>
                  <small>GPA Score</small>
                  <strong>{child.gpa}</strong>
                </div>
                <div>
                  <small>Attendance</small>
                  <strong style={{ color: "#34d399" }}>{child.attendanceRate}%</strong>
                </div>
                <div>
                  <small>Fee Status</small>
                  <strong style={{ color: child.balanceDue > 0 ? "#f87171" : "#34d399" }}>
                    {child.balanceDue > 0 ? `GH₵ ${child.balanceDue.toLocaleString()}` : "Cleared"}
                  </strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Child Overview KPIs */}
      <div className="pd-section-header" style={{ marginTop: "32px" }}>
        <h2>📊 Real-Time Academic & Administrative Status: {activeChild.fullName}</h2>
        <span>Live synchronized with St. Michael's internal bursary & faculty registers</span>
      </div>

      <div className="pd-kpi-grid">
        <div className="pd-kpi-card">
          <div className="pd-kpi-icon-wrap" style={{ background: "rgba(59, 130, 246, 0.15)", color: "#3b82f6" }}>
            🏆
          </div>
          <div>
            <span className="pd-kpi-label">Cumulative GPA</span>
            <div className="pd-kpi-val">{activeChild.gpa} / 4.00</div>
            <span className="pd-kpi-sub">{activeChild.classRank}</span>
          </div>
        </div>

        <div className="pd-kpi-card">
          <div className="pd-kpi-icon-wrap" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
            📋
          </div>
          <div>
            <span className="pd-kpi-label">Attendance Record</span>
            <div className="pd-kpi-val" style={{ color: "#34d399" }}>{activeChild.attendanceRate}%</div>
            <span className="pd-kpi-sub">{activeChild.totalAbsences} absence(s) this term</span>
          </div>
        </div>

        <div className="pd-kpi-card">
          <div className="pd-kpi-icon-wrap" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b" }}>
            💳
          </div>
          <div>
            <span className="pd-kpi-label">Fee Arrears Balance</span>
            <div className="pd-kpi-val" style={{ color: activeChild.balanceDue > 0 ? "#f87171" : "#34d399" }}>
              GH₵ {activeChild.balanceDue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <span className="pd-kpi-sub">{activeChild.feeStatus}</span>
          </div>
        </div>

        <div className="pd-kpi-card">
          <div className="pd-kpi-icon-wrap" style={{ background: "rgba(139, 92, 246, 0.15)", color: "#8b5cf6" }}>
            👨‍🏫
          </div>
          <div>
            <span className="pd-kpi-label">Assigned Form Tutor</span>
            <div className="pd-kpi-val" style={{ fontSize: "1.1rem" }}>{activeChild.formTutor.split("(")[0]}</div>
            <span className="pd-kpi-sub">{activeChild.tutorEmail}</span>
          </div>
        </div>
      </div>

      {/* Main Split Grid: Results Preview & Recent Attendance */}
      <div className="pd-split-grid">
        {/* Academic Performance Snapshot */}
        <div className="pd-panel-card">
          <div className="pd-panel-head">
            <div>
              <h3>📝 Terminal Examination Results</h3>
              <p>{results ? results.term : "Current Academic Term"}</p>
            </div>
            <button
              className="pd-btn-view-more"
              onClick={() => navigate("/child-results")}
            >
              Full Report Card →
            </button>
          </div>

          {results ? (
            <div>
              <div className="pd-results-summary-strip">
                <div><span>Total Marks:</span> <strong>{results.totalMarks}</strong></div>
                <div><span>Class Rank:</span> <strong>{results.classRank}</strong></div>
                <div><span>Overall Grade:</span> <strong style={{ color: "#34d399" }}>{results.overallGrade}</strong></div>
              </div>

              <div className="pd-subjects-mini-table">
                <table>
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Class (30%)</th>
                      <th>Exam (70%)</th>
                      <th>Total</th>
                      <th>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.subjects.slice(0, 4).map((sub, idx) => (
                      <tr key={idx}>
                        <td><strong>{sub.name}</strong></td>
                        <td>{sub.classScore}</td>
                        <td>{sub.examScore}</td>
                        <td style={{ fontWeight: 700 }}>{sub.total}</td>
                        <td><span className="pd-grade-badge">{sub.grade}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pd-conduct-quote">
                <strong>Head Principal's Remarks:</strong> "{results.conductReport}"
              </div>
            </div>
          ) : (
            <div className="pd-empty-box">No examination results published yet.</div>
          )}
        </div>

        {/* Recent Attendance Stream & Quick Actions */}
        <div className="pd-panel-card">
          <div className="pd-panel-head">
            <div>
              <h3>📋 Daily Attendance Trail</h3>
              <p>Last recorded morning roll calls</p>
            </div>
            <button
              className="pd-btn-view-more"
              onClick={() => navigate("/child-attendance")}
            >
              Full Calendar →
            </button>
          </div>

          <div className="pd-attendance-stream">
            {attendanceLogs.slice(0, 5).map((log, idx) => (
              <div key={idx} className="pd-att-row">
                <div>
                  <strong>{log.day}, {log.date}</strong>
                  <div className="pd-att-sub">{log.remarks}</div>
                </div>
                <div className="pd-att-right">
                  <span
                    className={`pd-att-badge ${
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
                  <small>{log.checkIn}</small>
                </div>
              </div>
            ))}
          </div>

          {/* Urgent Notices Widget */}
          <div className="pd-notice-widget">
            <h4>📢 Urgent Notice from Principal:</h4>
            <p>{SCHOOL_ANNOUNCEMENTS[0].title}</p>
            <Link to="/school-announcements" className="pd-notice-link">
              Read announcement details & download agenda →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
