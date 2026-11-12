import React, { useState } from "react";
import AttendanceNav from "./AttendanceNav";
import "./AttendanceReports.css";
import SpinningWordsBackground from "../components/SpinningWordsBackground";
import MotivationQuoteWidget from "../components/MotivationQuoteWidget";

const CLASS_PERFORMANCE = [
  { rank: 1, classStream: "Grade 11-A (General Science & STEM)", tutor: "Mrs. Sarah Jenkins", totalStudents: 32, rate: 98.2, trend: "+1.2%", status: "Exemplary" },
  { rank: 2, classStream: "Grade 12-A (Advanced Physics & Math)", tutor: "Mr. Kofi Annan", totalStudents: 34, rate: 97.5, trend: "+0.8%", status: "Exemplary" },
  { rank: 3, classStream: "Grade 10-A (Foundation Sciences)", tutor: "Dr. Jonathan Miller", totalStudents: 38, rate: 96.1, trend: "-0.4%", status: "Good" },
  { rank: 4, classStream: "Grade 11-C (Business & Economics)", tutor: "Mr. Harrison Sterling", totalStudents: 30, rate: 94.8, trend: "+0.3%", status: "Good" },
  { rank: 5, classStream: "Grade 11-B (General Arts & Literature)", tutor: "Mr. Marcus Brody", totalStudents: 31, rate: 92.4, trend: "-1.5%", status: "Needs Monitoring" },
];

const PERIOD_METRICS = [
  { period: "Homeroom & Morning Assembly (08:00 AM)", rate: 98.4, lateCount: 3, note: "Punctual Morning Muster" },
  { period: "Period 1: STEM & Core Subjects (08:35 AM)", rate: 97.8, lateCount: 2, note: "High laboratory attendance" },
  { period: "Period 2: Humanities & Languages (09:55 AM)", rate: 96.5, lateCount: 5, note: "Mid-morning stability" },
  { period: "Period 3: Computer Science & AI (12:00 PM)", rate: 99.1, lateCount: 1, note: "Peak student engagement" },
  { period: "Period 4: Afternoon Electives (01:20 PM)", rate: 94.2, lateCount: 6, note: "Mild post-lunch fatigue" },
];

const CHRONIC_WATCHLIST = [
  { id: "STU-SMIA-005", name: "Liam Carter", grade: "Grade 11-B", rate: 82.5, daysMissed: 8, guardian: "Mrs. Evelyn Carter", phone: "+233 24 990 1204", flag: "Medical Monitoring" },
  { id: "STU-SMIA-009", name: "Daniel Acheampong", grade: "Grade 10-B", rate: 84.1, daysMissed: 7, guardian: "Dr. Ernest Acheampong", phone: "+233 20 887 5519", flag: "Tardiness Alert" },
];

export default function AttendanceReports({ onNavigate }) {
  const [selectedTerm, setSelectedTerm] = useState("Term 1 (Sep - Dec 2026)");
  const [reportView, setReportView] = useState("classes"); // "classes", "periods", "chronic"
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleExportPDF = () => {
    window.print();
    showToast("Prepared comprehensive executive attendance report for print / PDF.");
  };

  return (
    <div className="rep-page-wrapper">
      <SpinningWordsBackground speed="slow" showControlBadge={false} />

      {/* Toast Alert */}
      {toastMessage && <div className="rep-toast">✓ {toastMessage}</div>}

      <AttendanceNav
        activePath="/attendance-reports"
        title="Attendance Analytics & Reports"
        subtitle="Aggregate attendance metrics, cohort rankings, period breakdown, and chronic absenteeism watch"
      />

      <MotivationQuoteWidget compact={true} />

      {/* KPI Stats Strip */}
      <div className="rep-kpi-grid">
        <div className="rep-kpi-card">
          <div className="rep-kpi-top">
            <span className="rep-kpi-label">School-Wide Attendance</span>
            <span className="rep-kpi-icon">📈</span>
          </div>
          <div className="rep-kpi-val" style={{ color: "#34d399" }}>
            96.4%
          </div>
          <div className="rep-kpi-sub">Target Benchmark &gt; 95.0%</div>
        </div>

        <div className="rep-kpi-card">
          <div className="rep-kpi-top">
            <span className="rep-kpi-label">Top Performing Cohort</span>
            <span className="rep-kpi-icon">🏆</span>
          </div>
          <div className="rep-kpi-val" style={{ color: "#38bdf8" }}>
            Grade 11-A (98.2%)
          </div>
          <div className="rep-kpi-sub">Tutor: Mrs. Sarah Jenkins</div>
        </div>

        <div className="rep-kpi-card">
          <div className="rep-kpi-top">
            <span className="rep-kpi-label">Chronic Absenteeism Rate</span>
            <span className="rep-kpi-icon">⚠️</span>
          </div>
          <div className="rep-kpi-val" style={{ color: "#fbbf24" }}>
            1.2% (2 Students)
          </div>
          <div className="rep-kpi-sub">Under active guardian counseling</div>
        </div>

        <div className="rep-kpi-card">
          <div className="rep-kpi-top">
            <span className="rep-kpi-label">Reporting Period</span>
            <span className="rep-kpi-icon">📅</span>
          </div>
          <div className="rep-kpi-val">Term 1 2026</div>
          <div className="rep-kpi-sub">Week 10 of Academic Year</div>
        </div>
      </div>

      {/* Action / View Switcher Bar */}
      <div className="rep-action-bar">
        <div className="rep-tabs-group">
          <button
            type="button"
            className={`rep-tab-btn ${reportView === "classes" ? "active" : ""}`}
            onClick={() => setReportView("classes")}
          >
            🏫 Class Performance Rankings
          </button>
          <button
            type="button"
            className={`rep-tab-btn ${reportView === "periods" ? "active" : ""}`}
            onClick={() => setReportView("periods")}
          >
            ⏱ Period-by-Period Roll Breakdown
          </button>
          <button
            type="button"
            className={`rep-tab-btn ${reportView === "chronic" ? "active" : ""}`}
            onClick={() => setReportView("chronic")}
          >
            🚨 Chronic Absenteeism Watchlist
          </button>
        </div>

        <div className="rep-actions-right">
          <select
            className="rep-select"
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
          >
            <option value="Term 1 (Sep - Dec 2026)">Term 1 (Sep - Dec 2026)</option>
            <option value="Monthly (November 2026)">Monthly (November 2026)</option>
            <option value="Year-to-Date 2026/2027">Year-to-Date 2026/2027</option>
          </select>

          <button
            type="button"
            className="rep-btn-export"
            onClick={handleExportPDF}
          >
            <span>🖨️</span> Export Executive Report
          </button>
        </div>
      </div>

      {/* 1. CLASS PERFORMANCE VIEW */}
      {reportView === "classes" && (
        <div className="rep-table-card">
          <div className="rep-card-header">
            <div>
              <h3>Class & Stream Attendance Performance Leaderboard</h3>
              <p>Comparative attendance ranking for all enrolled class streams during {selectedTerm}.</p>
            </div>
          </div>

          <div className="rep-table-scroll">
            <table className="rep-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Class / Stream</th>
                  <th>Form Master</th>
                  <th>Total Enrolled</th>
                  <th>Attendance Rate</th>
                  <th>Weekly Momentum</th>
                  <th>Performance Band</th>
                </tr>
              </thead>
              <tbody>
                {CLASS_PERFORMANCE.map((c) => (
                  <tr key={c.rank}>
                    <td>
                      <span className={`rep-rank-badge rank-${c.rank}`}>
                        #{c.rank}
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: "#f8fafc" }}>{c.classStream}</strong>
                    </td>
                    <td>👨‍🏫 {c.tutor}</td>
                    <td>👥 {c.totalStudents} Students</td>
                    <td>
                      <div className="rep-rate-cell">
                        <strong style={{ color: c.rate >= 95 ? "#34d399" : "#38bdf8" }}>
                          {c.rate}%
                        </strong>
                        <div className="rep-mini-bar">
                          <div
                            className="rep-mini-fill"
                            style={{
                              width: `${c.rate}%`,
                              backgroundColor: c.rate >= 95 ? "#10b981" : "#0ea5e9",
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={c.trend.startsWith("+") ? "rep-trend-up" : "rep-trend-down"}>
                        {c.trend}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`rep-status-pill ${
                          c.status === "Exemplary"
                            ? "pill-exemplary"
                            : c.status === "Good"
                            ? "pill-good"
                            : "pill-warning"
                        }`}
                      >
                        ● {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. PERIOD BREAKDOWN VIEW */}
      {reportView === "periods" && (
        <div className="rep-table-card">
          <div className="rep-card-header">
            <div>
              <h3>Period-by-Period Roll Call Analytics</h3>
              <p>Granular attendance trends tracking punctuality across daily timetable sessions.</p>
            </div>
          </div>

          <div className="rep-table-scroll">
            <table className="rep-table">
              <thead>
                <tr>
                  <th>Academic Period & Time</th>
                  <th>Attendance Rate</th>
                  <th>Tardy / Late Recorded</th>
                  <th>Operational Notes</th>
                </tr>
              </thead>
              <tbody>
                {PERIOD_METRICS.map((p, idx) => (
                  <tr key={idx}>
                    <td>
                      <strong style={{ color: "#f8fafc" }}>{p.period}</strong>
                    </td>
                    <td>
                      <strong style={{ color: "#38bdf8" }}>{p.rate}%</strong>
                    </td>
                    <td>
                      <span className="rep-late-chip">⏱ {p.lateCount} Students Late</span>
                    </td>
                    <td style={{ color: "#94a3b8" }}>{p.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. CHRONIC WATCHLIST VIEW */}
      {reportView === "chronic" && (
        <div className="rep-table-card">
          <div className="rep-card-header">
            <div>
              <h3>Chronic Absenteeism Watchlist (&lt; 85% Rate)</h3>
              <p>Students flagged for immediate guardian intervention, clinical review, or academic counseling.</p>
            </div>
          </div>

          <div className="rep-table-scroll">
            <table className="rep-table">
              <thead>
                <tr>
                  <th>Student ID & Name</th>
                  <th>Class</th>
                  <th>Attendance Rate</th>
                  <th>Days Missed</th>
                  <th>Guardian & Contact</th>
                  <th>Intervention Flag</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {CHRONIC_WATCHLIST.map((w) => (
                  <tr key={w.id}>
                    <td>
                      <div>
                        <strong>{w.name}</strong>
                        <div style={{ fontFamily: "JetBrains Mono", fontSize: "11px", color: "#38bdf8" }}>
                          {w.id}
                        </div>
                      </div>
                    </td>
                    <td>{w.grade}</td>
                    <td>
                      <strong style={{ color: "#f87171" }}>{w.rate}%</strong>
                    </td>
                    <td>⚠️ {w.daysMissed} Days</td>
                    <td>
                      <div>
                        <div>{w.guardian}</div>
                        <div style={{ fontSize: "11px", color: "#94a3b8" }}>📞 {w.phone}</div>
                      </div>
                    </td>
                    <td>
                      <span className="rep-flag-badge">🚨 {w.flag}</span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="rep-btn-contact"
                        onClick={() =>
                          showToast(`Opened guardian contact card for ${w.guardian} (${w.phone})`)
                        }
                      >
                        ✉ Dispatch Notice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
