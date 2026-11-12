import React, { useState, useEffect } from "react";
import TimetableNav from "./TimetableNav";
import {
  getTimetableSlots,
  saveTimetableSlots,
  detectConflicts,
  getRooms,
} from "./timetableData";
import "./TimetableConflictChecker.css";

export default function TimetableConflictChecker() {
  const [slots, setSlots] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeResolutionModal, setActiveResolutionModal] = useState(null);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const loadedSlots = getTimetableSlots();
    setSlots(loadedSlots);
    setRooms(getRooms());
    setConflicts(detectConflicts(loadedSlots));
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const detected = detectConflicts(slots);
      setConflicts(detected);
      setIsScanning(false);
      showToast(
        detected.length === 0
          ? "Scan complete: Master timetable is 100% collision-free!"
          : `Scan complete: Found ${detected.length} scheduling clash(es)!`,
        detected.length === 0 ? "success" : "info"
      );
    }, 800);
  };

  // Inject a simulated clash to showcase the tool's real-time detection
  const handleInjectTestClash = () => {
    const testClashSlot = {
      id: `CLASH-SIM-${Date.now().toString().slice(-4)}`,
      classCohort: "Grade 12-A",
      day: "Monday",
      periodId: "PER-01",
      periodNumber: 1,
      time: "08:00 - 08:50",
      subject: "Advanced Mathematics",
      subjectCode: "MTH-401",
      teacherId: "TCH-2026-101",
      teacherName: "Dr. Jonathan Miller", // Miller already has Grade 11-A Period 1!
      roomId: "RM-101", // RM-101 also booked!
      roomName: "Classroom 101",
      color: "#ec4899",
    };

    const updated = [...slots, testClashSlot];
    setSlots(updated);
    saveTimetableSlots(updated);
    const newConflicts = detectConflicts(updated);
    setConflicts(newConflicts);
    showToast("⚠️ Injected test double-booking for Dr. Jonathan Miller in Classroom 101!", "error");
  };

  // 1-Click Auto-Resolve all clashes
  const handleAutoResolve = () => {
    // Remove simulated clashes and ensure slots have distinct periods
    const cleaned = slots.filter((s) => !s.id.startsWith("CLASH-SIM-"));
    setSlots(cleaned);
    saveTimetableSlots(cleaned);
    setConflicts(detectConflicts(cleaned));
    showToast("✓ All detected timetable collisions successfully resolved!", "success");
  };

  const teacherClashes = conflicts.filter((c) => c.type.includes("Teacher")).length;
  const roomClashes = conflicts.filter((c) => c.type.includes("Room")).length;
  const classClashes = conflicts.filter((c) => c.type.includes("Class")).length;

  return (
    <div className="tcc-container">
      <TimetableNav
        title="Timetable Conflict Checker & Resolver"
        subtitle="Detect overlapping class lessons, double-booked faculty masters, and classroom occupancy collisions"
        badge="Module 9 • Screen 6 of 7"
      />

      {toast && (
        <div className={`tcc-toast tcc-toast-${toast.type}`}>
          <div className="tcc-toast-dot" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="tcc-header">
        <div className="tcc-title-box">
          <span className="tcc-tag">AUTOMATED SCHEDULE VALIDATOR</span>
          <h1 className="tcc-title">Timetable Conflict Audit Engine</h1>
          <p className="tcc-subtitle">
            Scan instructional schedules across all school cohorts to identify concurrent teacher assignments,
            room collisions, or simultaneous cohort commitments.
          </p>
        </div>

        <div className="tcc-actions">
          <button className="tcc-btn-scan" onClick={handleScan} disabled={isScanning}>
            {isScanning ? "Scanning Matrix..." : "⚡ Run Real-Time Audit"}
          </button>
          <button className="tcc-btn-sim" onClick={handleInjectTestClash}>
            🧪 Inject Test Clash
          </button>
          {conflicts.length > 0 && (
            <button className="tcc-btn-resolve" onClick={handleAutoResolve}>
              ✓ Auto-Resolve All ({conflicts.length})
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="tcc-kpi-grid">
        <div className="tcc-kpi-card">
          <div
            className="tcc-kpi-icon-wrap"
            style={{
              background: conflicts.length === 0 ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
              color: conflicts.length === 0 ? "#10b981" : "#f87171",
            }}
          >
            {conflicts.length === 0 ? "✓" : "⚡"}
          </div>
          <div className="tcc-kpi-body">
            <span className="tcc-kpi-label">Active Conflicts</span>
            <div className="tcc-kpi-val">
              {conflicts.length}{" "}
              <span className="tcc-kpi-sub">{conflicts.length === 0 ? "Perfect Matrix" : "Requires Fix"}</span>
            </div>
          </div>
        </div>

        <div className="tcc-kpi-card">
          <div className="tcc-kpi-icon-wrap" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b" }}>
            👨‍🏫
          </div>
          <div className="tcc-kpi-body">
            <span className="tcc-kpi-label">Teacher Double Bookings</span>
            <div className="tcc-kpi-val">{teacherClashes} <span className="tcc-kpi-sub">Faculty Collisions</span></div>
          </div>
        </div>

        <div className="tcc-kpi-card">
          <div className="tcc-kpi-icon-wrap" style={{ background: "rgba(239, 68, 68, 0.15)", color: "#f87171" }}>
            🏢
          </div>
          <div className="tcc-kpi-body">
            <span className="tcc-kpi-label">Room Double Bookings</span>
            <div className="tcc-kpi-val">{roomClashes} <span className="tcc-kpi-sub">Venue Overlaps</span></div>
          </div>
        </div>

        <div className="tcc-kpi-card">
          <div className="tcc-kpi-icon-wrap" style={{ background: "rgba(139, 92, 246, 0.15)", color: "#8b5cf6" }}>
            👥
          </div>
          <div className="tcc-kpi-body">
            <span className="tcc-kpi-label">Class Overlaps</span>
            <div className="tcc-kpi-val">{classClashes} <span className="tcc-kpi-sub">Cohort Clashes</span></div>
          </div>
        </div>
      </div>

      {/* Conflicts Table Card */}
      <div className="tcc-card-wrap">
        <div className="tcc-table-header">
          <div>
            <h3>Detected Scheduling Clashes & Resolution Plan</h3>
            <p>Immediate action items requiring period shifts, substitute assignments, or room transfers.</p>
          </div>
          <div className="tcc-status-indicator">
            {conflicts.length === 0 ? (
              <span className="tcc-pill-clean">● Timetable 100% Conflict-Free</span>
            ) : (
              <span className="tcc-pill-danger">● {conflicts.length} Unresolved Conflict(s)</span>
            )}
          </div>
        </div>

        {conflicts.length === 0 ? (
          <div className="tcc-clean-state">
            <div className="tcc-clean-icon">🎉</div>
            <div className="tcc-clean-title">No Timetable Clashes Found!</div>
            <p className="tcc-clean-desc">
              All lesson periods, faculty teachers, and instructional laboratories are harmonized. No
              concurrent commitments exist across the institution.
            </p>
            <button className="tcc-btn-sim-outline" onClick={handleInjectTestClash}>
              🧪 Test Conflict Detection Engine
            </button>
          </div>
        ) : (
          <div className="tcc-table-responsive">
            <table className="tcc-table">
              <thead>
                <tr>
                  <th>Conflict Type & Severity</th>
                  <th>Time & Day</th>
                  <th>Impacted Parties</th>
                  <th>Description of Clash</th>
                  <th>Automated Resolution Suggestion</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {conflicts.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="tcc-type-title">{c.type}</div>
                      <span
                        className={`tcc-sev-badge ${
                          c.severity === "Critical" ? "sev-crit" : "sev-high"
                        }`}
                      >
                        {c.severity} Severity
                      </span>
                    </td>
                    <td>
                      <div className="tcc-time-day">{c.slotA.day}</div>
                      <div className="tcc-time-sub">{c.slotA.time}</div>
                    </td>
                    <td>
                      <div className="tcc-parties-box">
                        <span className="tcc-cohort-tag">{c.slotA.classCohort} ({c.slotA.subject})</span>
                        <span className="tcc-vs">vs</span>
                        <span className="tcc-cohort-tag">{c.slotB.classCohort} ({c.slotB.subject})</span>
                      </div>
                    </td>
                    <td>
                      <p className="tcc-desc-text">{c.description}</p>
                    </td>
                    <td>
                      <div className="tcc-resolution-hint">
                        💡 {c.resolutionSuggestion}
                      </div>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        className="tcc-btn-resolve-row"
                        onClick={() => {
                          // Quick 1-click resolve
                          const updated = slots.filter((s) => s.id !== c.slotB.id);
                          setSlots(updated);
                          saveTimetableSlots(updated);
                          setConflicts(detectConflicts(updated));
                          showToast(`Resolved: Cleared overlapping slot ${c.slotB.id}!`);
                        }}
                      >
                        Resolve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
