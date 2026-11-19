import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdmissionNav from "./AdmissionNav";
import { getApplicants, getAdmissionsStats } from "./admissionData";
import SpinningWordsBackground from "../components/SpinningWordsBackground";
import "./AdmissionsDashboard.css";

export default function AdmissionsDashboard() {
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState(getApplicants());
  const [stats, setStats] = useState(getAdmissionsStats());

  useEffect(() => {
    const handleUpdate = () => {
      setApplicants(getApplicants());
      setStats(getAdmissionsStats());
    };
    window.addEventListener("admissionsDataChanged", handleUpdate);
    return () => window.removeEventListener("admissionsDataChanged", handleUpdate);
  }, []);

  return (
    <div className="add-page-container">
      <SpinningWordsBackground speed="slow" />

      <AdmissionNav
        title="Institutional Admissions & Enrollment Command Center"
        subtitle="End-to-end recruitment funnel tracking, prospective applicant screening, decision registry, and intake analytics"
        badge="Admission Module • Screen 1 of 9"
      />

      {/* Header Banner */}
      <div className="add-header-strip">
        <div>
          <span className="add-tag">ACADEMIC INTAKE 2026/2027</span>
          <h1 className="add-title">Admissions & Enrollment Hub</h1>
          <p className="add-sub">
            Monitor incoming candidate applications, review entrance exam aggregates, record institutional
            admission decisions, and convert accepted candidates into active students.
          </p>
        </div>

        <div className="add-header-actions">
          <Link to="/application-form" className="add-btn-primary">
            📝 New Candidate Application
          </Link>
          <Link to="/admissions-reports" className="add-btn-secondary">
            📈 Enrollment Reports
          </Link>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="add-kpi-grid">
        <div className="add-kpi-card">
          <div className="add-kpi-top">
            <span className="add-kpi-label">Total Applications</span>
            <span className="add-kpi-icon">📋</span>
          </div>
          <div className="add-kpi-val text-cyan">{stats.total} Applicants</div>
          <div className="add-kpi-foot">Verified candidate registrations</div>
        </div>

        <div className="add-kpi-card">
          <div className="add-kpi-top">
            <span className="add-kpi-label">Accepted Candidates</span>
            <span className="add-kpi-icon">✅</span>
          </div>
          <div className="add-kpi-val text-emerald">{stats.accepted} Candidates</div>
          <div className="add-kpi-foot">Admission offers sanctioned</div>
        </div>

        <div className="add-kpi-card">
          <div className="add-kpi-top">
            <span className="add-kpi-label">Under Faculty Review</span>
            <span className="add-kpi-icon">⏳</span>
          </div>
          <div className="add-kpi-val text-amber">{stats.underReview} Pending</div>
          <div className="add-kpi-foot">Exam & interview assessment queue</div>
        </div>

        <div className="add-kpi-card">
          <div className="add-kpi-top">
            <span className="add-kpi-label">Confirmed Enrolled</span>
            <span className="add-kpi-icon">🎓</span>
          </div>
          <div className="add-kpi-val text-purple">{stats.enrolled} Students</div>
          <div className="add-kpi-foot">Matriculated into student roster</div>
        </div>

        <div className="add-kpi-card">
          <div className="add-kpi-top">
            <span className="add-kpi-label">Application Fees (GH₵)</span>
            <span className="add-kpi-icon">💳</span>
          </div>
          <div className="add-kpi-val text-yellow">GH₵{stats.totalRevenueCedi.toLocaleString()}.00</div>
          <div className="add-kpi-foot">Processed via Mobile Money / Bank</div>
        </div>
      </div>

      {/* Admissions Pipeline Funnel */}
      <div className="add-funnel-card">
        <div className="add-funnel-header">
          <h2>Admissions Conversion Pipeline</h2>
          <span className="add-funnel-badge">Term 1 Enrollment Target: 120 Students</span>
        </div>

        <div className="add-funnel-steps">
          <div className="add-step-box">
            <div className="add-step-num">1</div>
            <div className="add-step-info">
              <strong>Submitted</strong>
              <span>{stats.total} Applicants</span>
            </div>
          </div>
          <div className="add-step-arrow">➔</div>

          <div className="add-step-box">
            <div className="add-step-num">2</div>
            <div className="add-step-info">
              <strong>Review & Screen</strong>
              <span>{stats.underReview} In Progress</span>
            </div>
          </div>
          <div className="add-step-arrow">➔</div>

          <div className="add-step-box">
            <div className="add-step-num">3</div>
            <div className="add-step-info">
              <strong>Offered Admission</strong>
              <span>{stats.accepted} Selected</span>
            </div>
          </div>
          <div className="add-step-arrow">➔</div>

          <div className="add-step-box add-step-final">
            <div className="add-step-num">4</div>
            <div className="add-step-info">
              <strong>Enrolled Scholars</strong>
              <span className="text-emerald">{stats.enrolled} Confirmed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Matrix */}
      <div className="add-actions-grid">
        <Link to="/application-form" className="add-action-tile">
          <span className="add-at-icon">📝</span>
          <div className="add-at-title">Candidate Application Form</div>
          <p className="add-at-desc">Register prospective student and collect bio-data</p>
        </Link>
        <Link to="/applicant-list" className="add-action-tile">
          <span className="add-at-icon">📋</span>
          <div className="add-at-title">Master Applicant Register</div>
          <p className="add-at-desc">Filter submitted applications across all divisions</p>
        </Link>
        <Link to="/application-review" className="add-action-tile">
          <span className="add-at-icon">🔍</span>
          <div className="add-at-title">Academic Review Console</div>
          <p className="add-at-desc">Score entrance assessments & interview notes</p>
        </Link>
        <Link to="/admission-decisions" className="add-action-tile">
          <span className="add-at-icon">⚖️</span>
          <div className="add-at-title">Admission Decisions</div>
          <p className="add-at-desc">Sanction acceptances, waitlists, and merit waivers</p>
        </Link>
        <Link to="/admission-letters" className="add-action-tile">
          <span className="add-at-icon">✉️</span>
          <div className="add-at-title">Official Admission Letters</div>
          <p className="add-at-desc">Generate certified offer letters with school seal</p>
        </Link>
        <Link to="/enrollment-confirmation" className="add-action-tile">
          <span className="add-at-icon">🎓</span>
          <div className="add-at-title">Enrollment Confirmation</div>
          <p className="add-at-desc">Verify fees & matriculate candidates into student roster</p>
        </Link>
      </div>

      {/* Recent Applications Feed */}
      <div className="add-recent-card">
        <div className="add-recent-header">
          <h2>Recent Prospective Candidates</h2>
          <Link to="/applicant-list" className="add-link-all">
            View All ({applicants.length}) →
          </Link>
        </div>

        <div className="add-table-wrapper">
          <table className="add-table">
            <thead>
              <tr>
                <th>App ID</th>
                <th>Candidate Full Name</th>
                <th>Target Grade & Stream</th>
                <th>Previous School</th>
                <th>Entry Aggregate</th>
                <th>Fee Status</th>
                <th>Admissions State</th>
                <th style={{ textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {applicants.slice(0, 5).map((app) => (
                <tr key={app.id}>
                  <td className="font-mono text-cyan">{app.id}</td>
                  <td>
                    <strong>{app.fullName}</strong>
                    <div style={{ fontSize: "0.74rem", color: "#94a3b8" }}>{app.nationality} • {app.gender}</div>
                  </td>
                  <td>
                    <span className="add-badge-grade">{app.targetGrade}</span>
                    <span style={{ fontSize: "0.78rem", color: "#cbd5e1", marginLeft: "6px" }}>{app.stream}</span>
                  </td>
                  <td style={{ fontSize: "0.82rem", color: "#cbd5e1" }}>{app.previousSchool}</td>
                  <td className="font-mono text-emerald">
                    {app.beceAggregate ? `BECE Agg: ${app.beceAggregate}` : `Exam: ${app.entryExamScore}%`}
                  </td>
                  <td>
                    <span className="add-badge-paid">✓ Paid ({app.applicationFeeAmount})</span>
                  </td>
                  <td>
                    <span
                      className={`add-status-badge ${
                        app.status === "Accepted"
                          ? "status-accepted"
                          : app.status === "Under Review"
                          ? "status-review"
                          : app.status === "Waitlisted"
                          ? "status-waitlisted"
                          : "status-pending"
                      }`}
                    >
                      ● {app.status}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      className="add-btn-inspect"
                      onClick={() => navigate(`/applicant-profile?id=${app.id}`)}
                    >
                      👤 Profile
                    </button>
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
