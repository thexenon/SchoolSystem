import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdmissionNav from "./AdmissionNav";
import { getApplicants, saveApplicants } from "./admissionData";
import "./ApplicantList.css";

export default function ApplicantList() {
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [gradeFilter, setGradeFilter] = useState("All");
  const [streamFilter, setStreamFilter] = useState("All");
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

  const handleQuickStatus = (id, newStatus) => {
    const updated = applicants.map((a) => (a.id === id ? { ...a, status: newStatus } : a));
    saveApplicants(updated);
    setApplicants(updated);
    showToast(`Applicant ${id} status updated to: ${newStatus}`);
  };

  const filteredApplicants = applicants.filter((app) => {
    const matchesSearch =
      app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.previousSchool.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.guardianName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Enrolled"
        ? app.enrollment && app.enrollment.status === "Enrolled"
        : app.status === statusFilter);

    const matchesGrade = gradeFilter === "All" || app.targetGrade === gradeFilter;
    const matchesStream = streamFilter === "All" || app.stream === streamFilter;

    return matchesSearch && matchesStatus && matchesGrade && matchesStream;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Accepted":
        return "al-badge-accepted";
      case "Under Review":
        return "al-badge-review";
      case "Waitlisted":
        return "al-badge-waitlist";
      case "Pending Review":
        return "al-badge-pending";
      case "Rejected":
        return "al-badge-rejected";
      default:
        return "al-badge-default";
    }
  };

  const totalFeeCedi = applicants.filter((a) => a.applicationFeePaid).length * 250;

  return (
    <div className="al-page-container">
      {toast && (
        <div className="al-toast">
          <span>✓</span> {toast}
        </div>
      )}

      <AdmissionNav
        title="Official Applicant Register"
        subtitle="Manage prospective candidate applications, verify submissions, monitor screening stages, and route dossiers"
        badge="Admission Module • Screen 3 of 9"
      />

      <div className="al-content-wrap">
        {/* Metric Overview Strip */}
        <div className="al-stats-strip">
          <div className="al-stat-pill">
            <span className="al-stat-icon">📋</span>
            <div>
              <div className="al-stat-val">{applicants.length}</div>
              <div className="al-stat-lbl">Total Applicants</div>
            </div>
          </div>
          <div className="al-stat-pill">
            <span className="al-stat-icon">⏳</span>
            <div>
              <div className="al-stat-val">
                {applicants.filter((a) => a.status === "Pending Review" || a.status === "Under Review").length}
              </div>
              <div className="al-stat-lbl">In Review Pipeline</div>
            </div>
          </div>
          <div className="al-stat-pill">
            <span className="al-stat-icon">🎉</span>
            <div>
              <div className="al-stat-val">{applicants.filter((a) => a.status === "Accepted").length}</div>
              <div className="al-stat-lbl">Accepted Candidates</div>
            </div>
          </div>
          <div className="al-stat-pill">
            <span className="al-stat-icon">💰</span>
            <div>
              <div className="al-stat-val text-emerald font-mono">GH₵{totalFeeCedi.toLocaleString()}</div>
              <div className="al-stat-lbl">Screening Fees (GH₵250 ea)</div>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="al-filter-bar">
          <div className="al-search-box">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search candidate name, ID, school, or guardian..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && <button onClick={() => setSearchTerm("")}>✕</button>}
          </div>

          <div className="al-select-filters">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Under Review">Under Review</option>
              <option value="Accepted">Accepted</option>
              <option value="Waitlisted">Waitlisted</option>
              <option value="Enrolled">Enrolled</option>
            </select>

            <select value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)}>
              <option value="All">All Grades</option>
              <option value="Grade 7">Grade 7</option>
              <option value="Grade 8">Grade 8</option>
              <option value="Grade 9">Grade 9</option>
              <option value="Grade 10">Grade 10</option>
              <option value="Grade 11">Grade 11</option>
              <option value="Grade 12">Grade 12</option>
            </select>

            <select value={streamFilter} onChange={(e) => setStreamFilter(e.target.value)}>
              <option value="All">All Academic Streams</option>
              <option value="General Science">General Science</option>
              <option value="Business & Accounting">Business & Accounting</option>
              <option value="General Arts & Literature">General Arts</option>
              <option value="Visual Arts & Design">Visual Arts</option>
            </select>

            <button
              className="al-btn-new-app"
              onClick={() => navigate("/application-form")}
            >
              ➕ New Application
            </button>
          </div>
        </div>

        {/* Applicants Data Table */}
        <div className="al-table-container">
          <table className="al-table">
            <thead>
              <tr>
                <th>Applicant Ref</th>
                <th>Candidate Name & Details</th>
                <th>Target Class & Stream</th>
                <th>Previous School / BECE</th>
                <th>Fee Status (GH₵)</th>
                <th>Status</th>
                <th>Rating</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplicants.length === 0 ? (
                <tr>
                  <td colSpan="8" className="al-empty">
                    No applicant records match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredApplicants.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <span className="al-ref-badge font-mono">{app.id}</span>
                      <div className="al-sub-date">{app.submissionDate}</div>
                    </td>
                    <td>
                      <div className="al-candidate-cell">
                        <div className="al-avatar">
                          {app.gender === "Female" ? "👩" : "👨"}
                        </div>
                        <div>
                          <div className="al-candidate-name">{app.fullName}</div>
                          <div className="al-guardian-hint">
                            Guardian: {app.guardianName} ({app.guardianPhone})
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="al-grade-pill">{app.targetGrade}</div>
                      <div className="al-stream-hint">{app.stream}</div>
                      <div className="al-boarding-hint">
                        {app.boardingStatus === "Boarding Student" ? "🏠 Boarding" : "🚌 Day Commuter"}
                      </div>
                    </td>
                    <td>
                      <div className="al-school-name">{app.previousSchool}</div>
                      <div className="al-aggregate-hint">
                        {app.beceAggregate ? `BECE Agg: ${app.beceAggregate}` : "Entrance Exam: " + app.entryExamScore + "%"}
                      </div>
                    </td>
                    <td>
                      {app.applicationFeePaid ? (
                        <span className="al-fee-paid">
                          ✓ GH₵250.00 Paid
                        </span>
                      ) : (
                        <span className="al-fee-unpaid">Pending GH₵250.00</span>
                      )}
                      <div className="al-receipt-hint">{app.feeReceipt}</div>
                    </td>
                    <td>
                      <span className={`al-status-badge ${getStatusBadgeClass(app.status)}`}>
                        {app.status}
                      </span>
                      {app.enrollment && app.enrollment.status === "Enrolled" && (
                        <span className="al-enrolled-tag">🎓 Enrolled</span>
                      )}
                    </td>
                    <td>
                      {app.reviewScores ? (
                        <div className="al-score-pill">
                          <span className="al-score-num">{app.reviewScores.compositeRating}</span>/100
                        </div>
                      ) : (
                        <span className="al-not-scored">Unrated</span>
                      )}
                    </td>
                    <td>
                      <div className="al-actions-cell">
                        <button
                          className="al-btn-action al-btn-view"
                          title="View Full Candidate Dossier"
                          onClick={() => navigate(`/applicant-profile?id=${app.id}`)}
                        >
                          👤 Profile
                        </button>
                        <button
                          className="al-btn-action al-btn-review"
                          title="Review & Grade Assessment"
                          onClick={() => navigate(`/application-review?id=${app.id}`)}
                        >
                          📝 Review
                        </button>
                        <button
                          className="al-btn-action al-btn-decide"
                          title="Record Acceptance or Decision"
                          onClick={() => navigate(`/admission-decisions?id=${app.id}`)}
                        >
                          ⚖️ Decide
                        </button>
                        {app.status === "Accepted" && (
                          <button
                            className="al-btn-action al-btn-letter"
                            title="Generate Certified Offer Letter"
                            onClick={() => navigate(`/admission-letters?id=${app.id}`)}
                          >
                            📜 Letter
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
