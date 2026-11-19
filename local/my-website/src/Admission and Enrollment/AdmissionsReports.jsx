import React, { useState, useEffect } from "react";
import AdmissionNav from "./AdmissionNav";
import { getApplicants } from "./admissionData";
import "./AdmissionsReports.css";

export default function AdmissionsReports() {
  const [applicants, setApplicants] = useState([]);
  const [cohortFilter, setCohortFilter] = useState("2026/2027");
  const [gradeFilter, setGradeFilter] = useState("All");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setApplicants(getApplicants());
    const handler = (e) => setApplicants(e.detail || getApplicants());
    window.addEventListener("admissionsDataChanged", handler);
    return () => window.removeEventListener("admissionsDataChanged", handler);
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = applicants.filter((a) => {
    const matchesCohort = cohortFilter === "All" || a.academicYear === cohortFilter;
    const matchesGrade = gradeFilter === "All" || a.targetGrade === gradeFilter;
    return matchesCohort && matchesGrade;
  });

  // Analytics Math
  const totalApps = filtered.length;
  const underReview = filtered.filter((a) => a.status === "Pending Review" || a.status === "Under Review").length;
  const accepted = filtered.filter((a) => a.status === "Accepted").length;
  const waitlisted = filtered.filter((a) => a.status === "Waitlisted").length;
  const enrolled = filtered.filter((a) => a.enrollment && a.enrollment.status === "Enrolled").length;

  const acceptanceRate = totalApps > 0 ? Math.round((accepted / totalApps) * 100) : 0;
  const yieldRate = accepted > 0 ? Math.round((enrolled / accepted) * 100) : 0;

  // Financial Intake in GH₵
  const feeRevenue = filtered.filter((a) => a.applicationFeePaid).length * 250;
  const tuitionDeposits = enrolled * 2500;
  const totalIntake = feeRevenue + tuitionDeposits;

  // Stream Distribution
  const streams = [
    "General Science",
    "Business & Accounting",
    "General Arts & Literature",
    "Visual Arts & Design",
    "Middle School Division",
  ];

  const streamCounts = streams.map((s) => ({
    name: s,
    count: filtered.filter((a) => a.stream === s).length,
  }));

  // Boarding Distribution
  const boardingCount = filtered.filter((a) => a.boardingStatus === "Boarding Student").length;
  const dayCount = filtered.filter((a) => a.boardingStatus === "Day Student").length;

  const handleExportCSV = () => {
    const headers = ["ID", "FullName", "Grade", "Stream", "Status", "BECE_Agg", "FeePaid", "Enrolled"];
    const rows = filtered.map((a) => [
      a.id,
      `"${a.fullName}"`,
      a.targetGrade,
      `"${a.stream}"`,
      a.status,
      a.beceAggregate || "",
      a.applicationFeePaid ? "Yes" : "No",
      a.enrollment?.status === "Enrolled" ? "Yes" : "No",
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Admissions_Report_${cohortFilter.replace("/", "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Admissions dataset exported successfully to CSV!");
  };

  return (
    <div className="rep-page-container">
      {toast && (
        <div className="rep-toast">
          <span>✓</span> {toast}
        </div>
      )}

      {/* Screen Controls & Nav */}
      <div className="rep-no-print">
        <AdmissionNav
          title="Admissions & Enrollment Intelligence"
          subtitle="Cohort intake analytics, conversion funnel metrics, stream distribution, and financial yield in Ghanaian Cedi (GH₵)"
          badge="Admission Module • Screen 9 of 9"
        />

        <div className="rep-filter-bar">
          <div className="rep-filter-group">
            <label>Academic Intake Cohort:</label>
            <select
              value={cohortFilter}
              onChange={(e) => setCohortFilter(e.target.value)}
            >
              <option value="2026/2027">2026/2027 Academic Session</option>
              <option value="2025/2026">2025/2026 Previous Session</option>
              <option value="All">All Historical Cohorts</option>
            </select>

            <label>Target Form / Grade:</label>
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
            >
              <option value="All">All Grades</option>
              <option value="Grade 10">Grade 10 (Secondary 1)</option>
              <option value="Grade 11">Grade 11 (Secondary 2)</option>
              <option value="Grade 12">Grade 12 (Secondary 3)</option>
              <option value="Grade 7">Grade 7 (Middle School)</option>
              <option value="Grade 8">Grade 8 (Middle School)</option>
              <option value="Grade 9">Grade 9 (Middle School)</option>
            </select>
          </div>

          <div className="rep-actions">
            <button className="rep-btn-csv" onClick={handleExportCSV}>
              📥 Export Dataset (CSV)
            </button>
            <button className="rep-btn-print" onClick={() => window.print()}>
              🖨️ Print Executive Report
            </button>
          </div>
        </div>
      </div>

      <div className="rep-content-wrap">
        {/* Executive Header for Print */}
        <div className="rep-print-header">
          <h2>ST. MARY INTERNATIONAL ACADEMY</h2>
          <p>Office of the Academic Registrar • Annual Admissions & Enrollment Statistical Audit</p>
          <div className="rep-print-meta">
            Cohort: {cohortFilter} • Report Generated: {new Date().toLocaleDateString()} • Currency: Ghanaian Cedi (GH₵)
          </div>
        </div>

        {/* Top KPI Cards Grid */}
        <div className="rep-kpi-grid">
          <div className="rep-kpi-card">
            <span className="rep-kpi-icon">📝</span>
            <div className="rep-kpi-val">{totalApps}</div>
            <div className="rep-kpi-label">Total Applications</div>
            <div className="rep-kpi-sub">Received across all streams</div>
          </div>

          <div className="rep-kpi-card">
            <span className="rep-kpi-icon">🎯</span>
            <div className="rep-kpi-val text-cyan">{acceptanceRate}%</div>
            <div className="rep-kpi-label">Acceptance Rate</div>
            <div className="rep-kpi-sub">{accepted} candidates offered admission</div>
          </div>

          <div className="rep-kpi-card">
            <span className="rep-kpi-icon">🎓</span>
            <div className="rep-kpi-val text-emerald">{yieldRate}%</div>
            <div className="rep-kpi-label">Yield / Matriculation Rate</div>
            <div className="rep-kpi-sub">{enrolled} students matriculated</div>
          </div>

          <div className="rep-kpi-card">
            <span className="rep-kpi-icon">💰</span>
            <div className="rep-kpi-val font-mono text-emerald">
              GH₵{totalIntake.toLocaleString()}
            </div>
            <div className="rep-kpi-label">Total Admissions Intake (GH₵)</div>
            <div className="rep-kpi-sub">Fees + Tuition Deposits</div>
          </div>
        </div>

        {/* 2-Column Analytics Layout */}
        <div className="rep-two-col">
          {/* Funnel Progress Section */}
          <div className="rep-section-card">
            <div className="rep-sec-header">
              <span>🔻</span>
              <h4>Candidate Conversion Funnel</h4>
            </div>

            <div className="rep-funnel-list">
              <div className="rep-funnel-step">
                <div className="rep-funnel-meta">
                  <span>1. Applications Submitted</span>
                  <strong>{totalApps} (100%)</strong>
                </div>
                <div className="rep-funnel-bar-bg">
                  <div className="rep-funnel-bar-fill" style={{ width: "100%" }}></div>
                </div>
              </div>

              <div className="rep-funnel-step">
                <div className="rep-funnel-meta">
                  <span>2. Faculty Review Completed</span>
                  <strong>
                    {totalApps - underReview} ({totalApps > 0 ? Math.round(((totalApps - underReview) / totalApps) * 100) : 0}%)
                  </strong>
                </div>
                <div className="rep-funnel-bar-bg">
                  <div
                    className="rep-funnel-bar-fill"
                    style={{
                      width: `${totalApps > 0 ? ((totalApps - underReview) / totalApps) * 100 : 0}%`,
                      background: "#38bdf8",
                    }}
                  ></div>
                </div>
              </div>

              <div className="rep-funnel-step">
                <div className="rep-funnel-meta">
                  <span>3. Provisional Offers Issued</span>
                  <strong>{accepted} ({acceptanceRate}%)</strong>
                </div>
                <div className="rep-funnel-bar-bg">
                  <div
                    className="rep-funnel-bar-fill"
                    style={{ width: `${acceptanceRate}%`, background: "#a855f7" }}
                  ></div>
                </div>
              </div>

              <div className="rep-funnel-step">
                <div className="rep-funnel-meta">
                  <span>4. Fee Cleared & Matriculated</span>
                  <strong>
                    {enrolled} ({totalApps > 0 ? Math.round((enrolled / totalApps) * 100) : 0}%)
                  </strong>
                </div>
                <div className="rep-funnel-bar-bg">
                  <div
                    className="rep-funnel-bar-fill"
                    style={{
                      width: `${totalApps > 0 ? (enrolled / totalApps) * 100 : 0}%`,
                      background: "#10b981",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Stream Distribution Section */}
          <div className="rep-section-card">
            <div className="rep-sec-header">
              <span>🔬</span>
              <h4>Distribution by Academic Stream</h4>
            </div>

            <div className="rep-stream-list">
              {streamCounts.map((s, idx) => {
                const pct = totalApps > 0 ? Math.round((s.count / totalApps) * 100) : 0;
                return (
                  <div key={idx} className="rep-stream-item">
                    <div className="rep-stream-meta">
                      <span>{s.name}</span>
                      <strong>{s.count} candidates ({pct}%)</strong>
                    </div>
                    <div className="rep-stream-bar-bg">
                      <div
                        className="rep-stream-bar-fill"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Financial Reconciliation & Residency Section */}
        <div className="rep-two-col" style={{ marginTop: "1.5rem" }}>
          {/* Financial Ledger in GH₵ */}
          <div className="rep-section-card">
            <div className="rep-sec-header">
              <span>💰</span>
              <h4>Financial Yield Ledger (Ghanaian Cedi • GH₵)</h4>
            </div>

            <div className="rep-financial-table">
              <div className="rep-fin-row">
                <span>Application Screening Fees (GH₵250.00 ea):</span>
                <strong className="font-mono text-cyan">GH₵{feeRevenue.toLocaleString()}</strong>
              </div>
              <div className="rep-fin-row">
                <span>Term 1 Tuition Deposits Cleared (GH₵2,500.00 ea):</span>
                <strong className="font-mono text-emerald">GH₵{tuitionDeposits.toLocaleString()}</strong>
              </div>
              <div className="rep-fin-row">
                <span>Institutional Merit Bursaries Disbursed:</span>
                <strong className="font-mono text-amber">- GH₵500.00</strong>
              </div>
              <div className="rep-fin-row rep-fin-total">
                <span>Net Certified Admissions Intake:</span>
                <strong className="font-mono text-emerald" style={{ fontSize: "1.25rem" }}>
                  GH₵{(totalIntake - 500).toLocaleString()}
                </strong>
              </div>
            </div>
          </div>

          {/* Residency & Demographics */}
          <div className="rep-section-card">
            <div className="rep-sec-header">
              <span>🏠</span>
              <h4>Residency & Boarding Capacity</h4>
            </div>

            <div className="rep-residency-cards">
              <div className="rep-res-box">
                <div className="rep-res-icon">🏠</div>
                <div className="rep-res-val">{boardingCount}</div>
                <div className="rep-res-lbl">Boarding House Residents</div>
                <small>St. Patrick, St. Teresa, St. Augustine</small>
              </div>

              <div className="rep-res-box">
                <div className="rep-res-icon">🚌</div>
                <div className="rep-res-val">{dayCount}</div>
                <div className="rep-res-lbl">Day Commuters</div>
                <small>Accra Metropolitan Area</small>
              </div>
            </div>

            <div className="rep-feeder-summary">
              <strong>Prominent Feeder Schools:</strong>
              <p>Achimota Basic School, Presbyterian Boys' (Legon), Morning Star School, SOS HGIC, Roman Ridge.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
