import React, { useState } from "react";
import AttendanceNav from "./AttendanceNav";
import "./AttendanceCorrection.css";
import { ATTENDANCE_CORRECTIONS } from "./attendanceData";
import { getStudents } from "../Student Management/studentData";
import SpinningWordsBackground from "../components/SpinningWordsBackground";
import MotivationQuoteWidget from "../components/MotivationQuoteWidget";

export default function AttendanceCorrection({ onNavigate }) {
  const [corrections, setCorrections] = useState(ATTENDANCE_CORRECTIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const allStudents = getStudents("ALL");

  // Form State
  const [formData, setFormData] = useState({
    studentId: "STU-SMIA-002",
    date: "2026-11-12",
    originalStatus: "Absent",
    requestedStatus: "Present",
    reason: "",
    requestedBy: "Mrs. Sarah Jenkins (Form Master)",
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApprove = (id, name) => {
    setCorrections((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: "Approved",
              approvedBy: "Dame Eleanor Vance (Vice Principal)",
            }
          : c
      )
    );
    showToast(`Approved attendance correction for ${name}! Record updated.`);
  };

  const handleReject = (id, name) => {
    setCorrections((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "Rejected" } : c))
    );
    showToast(`Rejected correction request for ${name}.`);
  };

  const handleSaveCorrection = (e) => {
    e.preventDefault();
    if (!formData.reason.trim()) {
      showToast("Please provide a legitimate reason for correction.");
      return;
    }

    const studentObj = allStudents.find((s) => s.id === formData.studentId) || {
      fullName: "Kwame Mensah",
      grade: "Grade 11-A",
    };

    const newCorrection = {
      id: `COR-${Date.now().toString().slice(-4)}`,
      studentId: formData.studentId,
      studentName: studentObj.fullName,
      classGrade: studentObj.grade || "Grade 11-A",
      date: formData.date,
      originalStatus: formData.originalStatus,
      requestedStatus: formData.requestedStatus,
      reason: formData.reason,
      requestedBy: formData.requestedBy,
      approvedBy: "Pending School Admin Sign-off",
      submittedDate: new Date().toISOString().split("T")[0],
      status: "Pending Review",
    };

    setCorrections((prev) => [newCorrection, ...prev]);
    showToast(`Submitted correction request for ${studentObj.fullName}.`);
    setIsModalOpen(false);
    setFormData({
      studentId: "STU-SMIA-002",
      date: "2026-11-12",
      originalStatus: "Absent",
      requestedStatus: "Present",
      reason: "",
      requestedBy: "Mrs. Sarah Jenkins (Form Master)",
    });
  };

  const filteredCorrections = corrections.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      c.studentName.toLowerCase().includes(q) ||
      c.studentId.toLowerCase().includes(q) ||
      c.reason.toLowerCase().includes(q) ||
      c.requestedBy.toLowerCase().includes(q);
    const matchesStatus =
      statusFilter === "ALL" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = corrections.filter((c) => c.status === "Pending Review").length;
  const approvedCount = corrections.filter((c) => c.status === "Approved").length;

  return (
    <div className="ac-page-wrapper">
      <SpinningWordsBackground speed="slow" showControlBadge={false} />

      {/* Toast Alert */}
      {toastMessage && <div className="ac-toast">✓ {toastMessage}</div>}

      <AttendanceNav
        activePath="/attendance-correction"
        title="Attendance Correction & Audit"
        subtitle="Review, approve, and audit retrospective attendance adjustments with full integrity trail"
      />

      <MotivationQuoteWidget compact={true} />

      {/* KPI Stats Strip */}
      <div className="ac-kpi-grid">
        <div className="ac-kpi-card">
          <div className="ac-kpi-top">
            <span className="ac-kpi-label">Pending Requests</span>
            <span className="ac-kpi-icon">⏳</span>
          </div>
          <div className="ac-kpi-val" style={{ color: pendingCount > 0 ? "#f59e0b" : "#38bdf8" }}>
            {pendingCount} Pending
          </div>
          <div className="ac-kpi-sub">Awaiting Administrative Authorization</div>
        </div>

        <div className="ac-kpi-card">
          <div className="ac-kpi-top">
            <span className="ac-kpi-label">Approved Corrections</span>
            <span className="ac-kpi-icon">✓</span>
          </div>
          <div className="ac-kpi-val" style={{ color: "#34d399" }}>
            {approvedCount} Verified
          </div>
          <div className="ac-kpi-sub">Ledger Automatically Adjusted</div>
        </div>

        <div className="ac-kpi-card">
          <div className="ac-kpi-top">
            <span className="ac-kpi-label">Audit Compliance</span>
            <span className="ac-kpi-icon">🛡️</span>
          </div>
          <div className="ac-kpi-val" style={{ color: "#38bdf8" }}>
            100% Traceable
          </div>
          <div className="ac-kpi-sub">Dual-Signoff Required</div>
        </div>

        <div className="ac-kpi-card">
          <div className="ac-kpi-top">
            <span className="ac-kpi-label">Average Resolution Time</span>
            <span className="ac-kpi-icon">⚡</span>
          </div>
          <div className="ac-kpi-val" style={{ color: "#fbbf24" }}>
            &lt; 2.5 Hours
          </div>
          <div className="ac-kpi-sub">Rapid Verification SLA</div>
        </div>
      </div>

      {/* Action / Search Bar */}
      <div className="ac-action-bar">
        <div className="ac-filters-row">
          <div className="ac-search-box">
            <span className="ac-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search correction by student, reason, or authorizer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="ac-clear-btn"
                onClick={() => setSearchQuery("")}
              >
                ×
              </button>
            )}
          </div>

          <select
            className="ac-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Request Statuses</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <button
          type="button"
          className="ac-btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          <span>＋</span> Request Attendance Correction
        </button>
      </div>

      {/* Corrections List Table */}
      <div className="ac-table-card">
        <div className="ac-card-header">
          <div>
            <h3>Attendance Correction Audit Trail</h3>
            <p>Every change includes the original state, requested state, official reason, and authorizing signature.</p>
          </div>
        </div>

        <div className="ac-table-scroll">
          <table className="ac-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Student ID & Name</th>
                <th>Class</th>
                <th>Date of Absence</th>
                <th>Original Status</th>
                <th>Corrected Status</th>
                <th>Official Reason / Note</th>
                <th>Requester & Approver</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCorrections.map((c) => (
                <tr key={c.id}>
                  <td>
                    <span className="ac-id-badge">{c.id}</span>
                  </td>
                  <td>
                    <div className="ac-stu-cell">
                      <strong>{c.studentName}</strong>
                      <span className="ac-stu-sub">{c.studentId}</span>
                    </div>
                  </td>
                  <td>{c.classGrade}</td>
                  <td>{c.date}</td>
                  <td>
                    <span className="ac-status-strike">
                      ✕ {c.originalStatus}
                    </span>
                  </td>
                  <td>
                    <span className="ac-status-new">
                      ✓ {c.requestedStatus}
                    </span>
                  </td>
                  <td style={{ maxWidth: "260px" }}>
                    <div className="ac-reason-text">"{c.reason}"</div>
                  </td>
                  <td>
                    <div className="ac-sign-info">
                      <div>Req: <span style={{ color: "#38bdf8" }}>{c.requestedBy}</span></div>
                      <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                        Sign: {c.approvedBy}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`ac-status-pill ${
                        c.status === "Approved"
                          ? "pill-approved"
                          : c.status === "Rejected"
                          ? "pill-rejected"
                          : "pill-pending"
                      }`}
                    >
                      ● {c.status}
                    </span>
                  </td>
                  <td>
                    {c.status === "Pending Review" ? (
                      <div className="ac-action-btns">
                        <button
                          type="button"
                          className="ac-btn-approve"
                          onClick={() => handleApprove(c.id, c.studentName)}
                          title="Authorize and apply correction"
                        >
                          ✓ Approve
                        </button>
                        <button
                          type="button"
                          className="ac-btn-reject"
                          onClick={() => handleReject(c.id, c.studentName)}
                          title="Reject correction"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: "11px", color: "#64748b" }}>
                        Audit Logged
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredCorrections.length === 0 && (
        <div className="ac-empty-state">
          <p>No correction requests match your query.</p>
          <button
            type="button"
            className="ac-btn-primary"
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("ALL");
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Request Correction Modal */}
      {isModalOpen && (
        <div className="ac-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="ac-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="ac-modal-header">
              <h2>Request Attendance Correction</h2>
              <button
                type="button"
                className="ac-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveCorrection} className="ac-modal-form">
              <div className="ac-form-row">
                <div className="ac-form-group">
                  <label>Select Student</label>
                  <select
                    value={formData.studentId}
                    onChange={(e) =>
                      setFormData({ ...formData, studentId: e.target.value })
                    }
                  >
                    {allStudents.slice(0, 8).map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.fullName} ({s.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="ac-form-group">
                  <label>Date of Record</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="ac-form-row">
                <div className="ac-form-group">
                  <label>Original Logged Status</label>
                  <select
                    value={formData.originalStatus}
                    onChange={(e) =>
                      setFormData({ ...formData, originalStatus: e.target.value })
                    }
                  >
                    <option value="Absent">Absent</option>
                    <option value="Late">Late</option>
                    <option value="Present">Present</option>
                  </select>
                </div>

                <div className="ac-form-group">
                  <label>Requested Correct Status</label>
                  <select
                    value={formData.requestedStatus}
                    onChange={(e) =>
                      setFormData({ ...formData, requestedStatus: e.target.value })
                    }
                  >
                    <option value="Present">Present (Verified In Class)</option>
                    <option value="Excused">Excused (Medical / Official Duty)</option>
                    <option value="Late">Late (Verified Transportation Issue)</option>
                  </select>
                </div>
              </div>

              <div className="ac-form-group">
                <label>Official Reason & Verification Document Reference</label>
                <textarea
                  rows={3}
                  required
                  placeholder="State reason: e.g. Submitted hospital note from Ridge Clinic, or was representing school at Math Olympiad..."
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                />
              </div>

              <div className="ac-form-group">
                <label>Submitting Teacher / Officer</label>
                <input
                  type="text"
                  value={formData.requestedBy}
                  onChange={(e) =>
                    setFormData({ ...formData, requestedBy: e.target.value })
                  }
                />
              </div>

              <div className="ac-modal-footer">
                <button
                  type="button"
                  className="ac-btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="ac-btn-primary">
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
