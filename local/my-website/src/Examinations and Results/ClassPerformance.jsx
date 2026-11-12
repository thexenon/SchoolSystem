import React, { useState } from "react";
import "./ClassPerformance.css";
import ExamNav from "./ExamNav";
import { getMarks } from "./examData";
import SpinningWordsBackground from "../components/SpinningWordsBackground";
import DailyQuotePopupModal from "../components/DailyQuotePopupModal";

export default function ClassPerformance() {
  const [selectedClass, setSelectedClass] = useState("Grade 11-A");
  const [selectedTerm, setSelectedTerm] = useState("Term 1");
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const subjectAverages = [
    { subject: "Chemistry", code: "CHM-301", teacher: "Mrs. Sarah Jenkins", avg: 94.2, passRate: 100, highest: 99.5, lowest: 82.0, color: "#10b981" },
    { subject: "Elective Mathematics", code: "MTH-401", teacher: "Dr. Jonathan Miller", avg: 91.5, passRate: 100, highest: 98.0, lowest: 78.0, color: "#38bdf8" },
    { subject: "Physics", code: "PHY-302", teacher: "Mr. Kofi Annan", avg: 88.6, passRate: 96.4, highest: 97.0, lowest: 72.5, color: "#f59e0b" },
    { subject: "Computer Science", code: "CSC-310", teacher: "Dr. Margaret Hamilton", avg: 86.4, passRate: 92.8, highest: 96.0, lowest: 68.0, color: "#a855f7" },
    { subject: "English Language", code: "ENG-204", teacher: "Mrs. Clara Oswald", avg: 83.2, passRate: 96.0, highest: 92.0, lowest: 65.0, color: "#ec4899" },
  ];

  const gradeDistribution = [
    { grade: "A1 (80-100%)", count: 18, pct: 64, color: "#10b981" },
    { grade: "B2 (75-79%)", count: 6, pct: 21, color: "#38bdf8" },
    { grade: "B3 (70-74%)", count: 3, pct: 11, color: "#f59e0b" },
    { grade: "C4 (65-69%)", count: 1, pct: 4, color: "#a855f7" },
    { grade: "Below 65%", count: 0, pct: 0, color: "#ef4444" },
  ];

  const topScholars = [
    { rank: 1, name: "Kwame Mensah", roll: "11A-04", avgScore: 98.2, gpa: "3.98", badges: "🥇 DUX SCHOLAR" },
    { rank: 2, name: "Elena Rostova", roll: "11A-01", avgScore: 95.8, gpa: "3.95", badges: "🥈 HIGH HONOURS" },
    { rank: 3, name: "Sophia Martinez", roll: "11A-15", avgScore: 95.0, gpa: "3.92", badges: "🥉 HONOURS" },
    { rank: 4, name: "Ama Serwaa", roll: "11A-09", avgScore: 92.4, gpa: "3.88", badges: "DISTINCTION" },
    { rank: 5, name: "Lucas Vance", roll: "11A-07", avgScore: 84.8, gpa: "3.75", badges: "CREDIT PLUS" },
  ];

  const interventionWatchlist = [
    { name: "David Osei", roll: "11A-22", subject: "Physics", currentScore: 58.5, status: "Needs Tutorial Support", recommendedAction: "Schedule Wednesday 1-on-1 Physics Lab Clinic" },
    { name: "Grace Addo", roll: "11A-25", subject: "Elective Maths", currentScore: 61.0, status: "Borderline Credit", recommendedAction: "Assign peer study mentor (Kwame Mensah)" },
  ];

  return (
    <div className="cp-page-wrapper">
      <SpinningWordsBackground speed="slow" />
      <DailyQuotePopupModal />

      {toastMessage && <div className="cp-toast">✓ {toastMessage}</div>}

      <ExamNav
        title="Class Performance"
        subtitle="Analytical overview of cohort academic progress, subject pass rates, grade distribution curves, and intervention tracking"
        badge="Screen 10 of 12"
      />

      {/* Selector & Actions */}
      <div className="cp-filter-bar">
        <div className="cp-filter-left">
          <div className="cp-field">
            <label>Academic Class Cohort</label>
            <select
              className="cp-select"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="Grade 11-A">Grade 11-A (Science Specialization Track)</option>
              <option value="Grade 11-B">Grade 11-B (General Arts & Business)</option>
              <option value="Grade 12-A">Grade 12-A (WASSCE Final Candidates)</option>
            </select>
          </div>

          <div className="cp-field">
            <label>Term / Assessment Cycle</label>
            <select
              className="cp-select"
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
            >
              <option value="Term 1">Term 1 (Midterm & Final Examination Aggregate)</option>
              <option value="Term 2">Term 2 (Ongoing Session)</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          className="cp-btn-export"
          onClick={() => showToast("Exporting comprehensive class performance analytics report (PDF)...")}
        >
          📊 Export Class Analytics Report
        </button>
      </div>

      {/* Aggregate KPI Strip */}
      <div className="cp-kpi-grid">
        <div className="cp-kpi-card">
          <div className="cp-kpi-label">Cohort Overall Average</div>
          <div className="cp-kpi-val" style={{ color: "#38bdf8" }}>89.8%</div>
          <div className="cp-kpi-sub">Across 5 WASSCE examined subjects</div>
        </div>
        <div className="cp-kpi-card">
          <div className="cp-kpi-label">Pass Rate Percentage</div>
          <div className="cp-kpi-val" style={{ color: "#10b981" }}>98.4%</div>
          <div className="cp-kpi-sub">27 of 28 students meeting WASSCE criteria</div>
        </div>
        <div className="cp-kpi-card">
          <div className="cp-kpi-label">Top Subject Performance</div>
          <div className="cp-kpi-val" style={{ color: "#f59e0b" }}>Chemistry</div>
          <div className="cp-kpi-sub">Class Average: 94.2% (HOD: Sarah Jenkins)</div>
        </div>
        <div className="cp-kpi-card">
          <div className="cp-kpi-label">Intervention Watchlist</div>
          <div className="cp-kpi-val" style={{ color: "#ec4899" }}>2 Students</div>
          <div className="cp-kpi-sub">Assigned to peer tutoring & faculty clinic</div>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="cp-charts-grid">
        {/* Subject Comparison Performance Bars */}
        <div className="cp-card">
          <h3 className="cp-card-title">Subject Average Mark Comparison</h3>
          <p className="cp-card-sub">Class average benchmarked against the 70% school target line</p>

          <div className="cp-bars-list">
            {subjectAverages.map((s) => (
              <div key={s.code} className="cp-bar-item">
                <div className="cp-bar-header">
                  <div>
                    <strong>{s.subject}</strong> <span style={{ color: "#94a3b8" }}>({s.code})</span>
                  </div>
                  <div className="cp-bar-stats">
                    <span>Avg: <strong style={{ color: s.color }}>{s.avg}%</strong></span>
                    <span>• High: {s.highest}%</span>
                  </div>
                </div>

                <div className="cp-bar-track">
                  <div
                    className="cp-bar-fill"
                    style={{ width: `${s.avg}%`, backgroundColor: s.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grade Distribution Curve */}
        <div className="cp-card">
          <h3 className="cp-card-title">WASSCE Grade Boundary Distribution</h3>
          <p className="cp-card-sub">Proportion of student cohort across grade bands</p>

          <div className="cp-dist-list">
            {gradeDistribution.map((d, i) => (
              <div key={i} className="cp-dist-item">
                <div className="cp-dist-header">
                  <span>{d.grade}</span>
                  <strong>{d.count} Students ({d.pct}%)</strong>
                </div>
                <div className="cp-bar-track">
                  <div
                    className="cp-bar-fill"
                    style={{ width: `${d.pct}%`, backgroundColor: d.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performers Leaderboard & Intervention Roster */}
      <div className="cp-bottom-grid">
        {/* Leaderboard */}
        <div className="cp-card">
          <h3 className="cp-card-title">🏆 Top Performing Scholars • Academic Honours</h3>
          <p className="cp-card-sub">Highest cumulative term aggregates across all papers</p>

          <div className="cp-scholar-list">
            {topScholars.map((sch) => (
              <div key={sch.roll} className="cp-scholar-row">
                <div className="cp-scholar-left">
                  <div className="cp-rank-badge">#{sch.rank}</div>
                  <div>
                    <div className="cp-scholar-name">{sch.name}</div>
                    <div className="cp-scholar-roll">Roll: {sch.roll} • GPA: {sch.gpa}</div>
                  </div>
                </div>
                <div className="cp-scholar-right">
                  <div className="cp-scholar-avg">{sch.avgScore}%</div>
                  <span className="cp-scholar-badge">{sch.badges}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Intervention Watchlist */}
        <div className="cp-card">
          <h3 className="cp-card-title">⚠️ Targeted Academic Intervention Watchlist</h3>
          <p className="cp-card-sub">Students identified for proactive tutoring clinics & peer mentoring</p>

          <div className="cp-watch-list">
            {interventionWatchlist.map((w, idx) => (
              <div key={idx} className="cp-watch-item">
                <div className="cp-watch-top">
                  <strong>{w.name} ({w.roll})</strong>
                  <span className="cp-watch-pill">{w.status}</span>
                </div>
                <div className="cp-watch-sub">Subject: <strong>{w.subject}</strong> (Score: {w.currentScore}%)</div>
                <div className="cp-watch-action">
                  <span>💡 Plan:</span> {w.recommendedAction}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
