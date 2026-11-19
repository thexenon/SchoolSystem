import React, { useState, useEffect } from "react";
import FinanceNav from "./FinanceNav";
import { getInvoices } from "./financeData";
import "./OutstandingFees.css";

export default function OutstandingFees() {
  const [invoices, setInvoices] = useState([]);
  const [cohortFilter, setCohortFilter] = useState("All");
  const [agingFilter, setAgingFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState(null);
  const [demandNoticeModal, setDemandNoticeModal] = useState(null);

  useEffect(() => {
    setInvoices(getInvoices());
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Only consider invoices with balance due > 0
  const outstandingList = invoices
    .filter((inv) => inv.balanceDue > 0)
    .map((inv) => {
      // Calculate days overdue based on due date
      const due = new Date(inv.dueDate);
      const today = new Date("2026-11-19");
      const diffTime = today - due;
      const diffDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

      let agingCategory = "< 30 Days";
      if (diffDays > 60) agingCategory = "> 60 Days Overdue";
      else if (diffDays >= 30) agingCategory = "30 - 60 Days Overdue";

      return {
        ...inv,
        daysOverdue: diffDays,
        agingCategory: agingCategory,
      };
    });

  const filteredList = outstandingList.filter((item) => {
    if (cohortFilter !== "All" && item.classCohort !== cohortFilter) return false;
    if (agingFilter !== "All" && item.agingCategory !== agingFilter) return false;
    if (searchTerm.trim() !== "") {
      const q = searchTerm.toLowerCase();
      const matchName = item.studentName.toLowerCase().includes(q);
      const matchStuId = item.studentId.toLowerCase().includes(q);
      const matchGuardian = item.guardianName.toLowerCase().includes(q);
      if (!matchName && !matchStuId && !matchGuardian) return false;
    }
    return true;
  });

  const totalArrears = outstandingList.reduce((acc, curr) => acc + curr.balanceDue, 0);
  const countDefaulters = outstandingList.length;
  const criticalCount = outstandingList.filter((i) => i.daysOverdue >= 30).length;

  const handleSendSMS = (student) => {
    showToast(
      `SMS Payment Reminder dispatched to ${student.guardianName} (${student.guardianPhone}): "Dear Parent, fee balance of GH₵ ${student.balanceDue.toFixed(2)} is outstanding for ${student.studentName}."`,
      "success"
    );
  };

  const handleBulkSMS = () => {
    showToast(
      `Dispatched bulk payment reminder SMS to all ${filteredList.length} guardians with outstanding balances!`,
      "success"
    );
  };

  const exportArrearsCSV = () => {
    const headers = "Student ID,Student Name,Cohort,Guardian Name,Guardian Phone,Net Bill (GHS),Paid (GHS),Balance Due (GHS),Days Overdue,Aging Category\n";
    const rows = filteredList
      .map(
        (i) =>
          `"${i.studentId}","${i.studentName}","${i.classCohort}","${i.guardianName}","${i.guardianPhone}","${i.netAmount}","${i.amountPaid}","${i.balanceDue}","${i.daysOverdue}","${i.agingCategory}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Outstanding_Arrears_Report_${new Date().toISOString().substring(0, 10)}.csv`;
    a.click();
    showToast("Outstanding arrears exported to CSV file!");
  };

  return (
    <div className="of-container">
      <FinanceNav
        title="Outstanding Balances & Arrears Recovery"
        subtitle="Track unpaid fees, age analysis debtor classification, and automated collection reminders in Ghanaian Cedi (GH₵)"
        badge="Module 10 • Screen 7 of 13"
      />

      {toast && (
        <div className={`of-toast of-toast-${toast.type}`}>
          <div className="of-toast-dot" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="of-header">
        <div className="of-title-box">
          <span className="of-tag">DEBT MANAGEMENT & RECOVERY</span>
          <h1 className="of-title">Outstanding Fee Defaulters</h1>
          <p className="of-subtitle">
            Monitor institutional fee arrears across all academic divisions. Dispatch automated SMS/Email alerts,
            generate formal demand letters, and analyze aging debt portfolios in Ghanaian Cedi (GH₵).
          </p>
        </div>

        <div className="of-actions">
          <button className="of-btn-bulk-sms" onClick={handleBulkSMS}>
            📱 Send Bulk SMS Alert
          </button>
          <button className="of-btn-export" onClick={exportArrearsCSV}>
            📥 Export Arrears List
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="of-kpi-grid">
        <div className="of-kpi-card">
          <div className="of-kpi-icon-wrap" style={{ background: "rgba(239, 68, 68, 0.15)", color: "#ef4444" }}>
            🚨
          </div>
          <div className="of-kpi-body">
            <span className="of-kpi-label">Total Debt Arrears</span>
            <div className="of-kpi-val" style={{ color: "#f87171" }}>
              GH₵ {totalArrears.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <span className="of-kpi-sub">Across active cohorts</span>
          </div>
        </div>

        <div className="of-kpi-card">
          <div className="of-kpi-icon-wrap" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b" }}>
            👥
          </div>
          <div className="of-kpi-body">
            <span className="of-kpi-label">Students in Arrears</span>
            <div className="of-kpi-val">{countDefaulters} Students</div>
            <span className="of-kpi-sub">Unsettled term balances</span>
          </div>
        </div>

        <div className="of-kpi-card">
          <div className="of-kpi-icon-wrap" style={{ background: "rgba(139, 92, 246, 0.15)", color: "#8b5cf6" }}>
            ⏳
          </div>
          <div className="of-kpi-body">
            <span className="of-kpi-label">Critical Debt (&gt;30 Days)</span>
            <div className="of-kpi-val" style={{ color: "#c084fc" }}>
              {criticalCount} Students
            </div>
            <span className="of-kpi-sub">Escalation required</span>
          </div>
        </div>

        <div className="of-kpi-card">
          <div className="of-kpi-icon-wrap" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
            🛡️
          </div>
          <div className="of-kpi-body">
            <span className="of-kpi-label">Bursar Collection Policy</span>
            <div className="of-kpi-val">Grace Period</div>
            <span className="of-kpi-sub">14 Days post-due date</span>
          </div>
        </div>
      </div>

      {/* Filter / Search Toolbar */}
      <div className="of-toolbar">
        <div className="of-search-box">
          <span className="of-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search defaulters by student name, ID, or guardian..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="of-search-clear" onClick={() => setSearchTerm("")}>✕</button>
          )}
        </div>

        <div className="of-filters">
          <div className="of-filter-item">
            <label>Aging Analysis:</label>
            <select value={agingFilter} onChange={(e) => setAgingFilter(e.target.value)}>
              <option value="All">All Aging Brackets</option>
              <option value="< 30 Days">&lt; 30 Days Overdue</option>
              <option value="30 - 60 Days Overdue">30 - 60 Days Overdue</option>
              <option value="> 60 Days Overdue">&gt; 60 Days Overdue</option>
            </select>
          </div>

          <div className="of-filter-item">
            <label>Cohort:</label>
            <select value={cohortFilter} onChange={(e) => setCohortFilter(e.target.value)}>
              <option value="All">All Cohorts</option>
              <option value="Grade 11-A">Grade 11-A</option>
              <option value="Grade 11-B">Grade 11-B</option>
              <option value="Grade 12-A">Grade 12-A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="of-table-card">
        <div className="of-table-responsive">
          <table className="of-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Student Particulars</th>
                <th>Cohort</th>
                <th>Guardian Contact</th>
                <th>Net Invoiced</th>
                <th>Paid to Date</th>
                <th>Outstanding Arrears</th>
                <th>Days Overdue</th>
                <th>Aging Category</th>
                <th>Reminders & Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan="10" className="of-empty">
                    🎉 Excellent! No students match the arrears criteria for this filter.
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => (
                  <tr key={item.id} className="of-table-row">
                    <td>
                      <span className="of-inv-code">{item.id}</span>
                      <div className="of-due-text">Due: {item.dueDate}</div>
                    </td>
                    <td>
                      <strong className="of-student-name">{item.studentName}</strong>
                      <div className="of-sub-text">{item.studentId} • Roll: {item.rollNumber}</div>
                    </td>
                    <td>
                      <span className="of-cohort-badge">{item.classCohort}</span>
                    </td>
                    <td>
                      <div className="of-guardian-name">{item.guardianName}</div>
                      <div className="of-phone-link">{item.guardianPhone}</div>
                    </td>
                    <td className="of-amt">
                      GH₵ {item.netAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="of-amt" style={{ color: "#34d399" }}>
                      GH₵ {item.amountPaid.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="of-amt of-debt-amt">
                      GH₵ {item.balanceDue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td>
                      <span className="of-days-badge">{item.daysOverdue} days</span>
                    </td>
                    <td>
                      <span
                        className={`of-aging-badge ${
                          item.agingCategory === "> 60 Days Overdue"
                            ? "critical"
                            : item.agingCategory === "30 - 60 Days Overdue"
                            ? "warning"
                            : "mild"
                        }`}
                      >
                        {item.agingCategory}
                      </span>
                    </td>
                    <td>
                      <div className="of-action-group">
                        <button
                          className="of-btn-sms"
                          onClick={() => handleSendSMS(item)}
                          title="Send Quick SMS Alert to Parent"
                        >
                          📱 SMS
                        </button>
                        <button
                          className="of-btn-demand"
                          onClick={() => setDemandNoticeModal(item)}
                          title="Issue Formal Demand Letter"
                        >
                          📜 Demand Notice
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Demand Notice Modal */}
      {demandNoticeModal && (
        <div className="of-modal-overlay">
          <div className="of-modal-notice-box">
            <div className="of-notice-header">
              <span className="of-notice-badge">FORMAL LEGAL BILLING DEMAND</span>
              <h2>ST. MICHAEL'S INTERNATIONAL ACADEMY</h2>
              <p>Office of the Chief Bursar & Board of Trustees • Ridge, Accra</p>
            </div>

            <div className="of-notice-body">
              <div className="of-notice-meta">
                <div><strong>Notice Date:</strong> {new Date().toISOString().substring(0, 10)}</div>
                <div><strong>Student Name:</strong> {demandNoticeModal.studentName} ({demandNoticeModal.studentId})</div>
                <div><strong>Parent / Guardian:</strong> {demandNoticeModal.guardianName}</div>
                <div><strong>Class Cohort:</strong> {demandNoticeModal.classCohort}</div>
              </div>

              <div className="of-notice-letter">
                <p>Dear {demandNoticeModal.guardianName},</p>
                <p>
                  Our institutional bursary audit indicates that an outstanding tuition & boarding fee balance of
                  <strong style={{ color: "#dc2626" }}> GH₵ {demandNoticeModal.balanceDue.toLocaleString("en-US", { minimumFractionDigits: 2 })} </strong>
                  remains unpaid under invoice reference <strong>{demandNoticeModal.id}</strong> (Due since {demandNoticeModal.dueDate}).
                </p>
                <p>
                  To prevent suspension of academic privileges, boarding residence access, or WAEC examination registration,
                  kindly arrange settlement within <strong>5 business days</strong> of this notice.
                </p>
                <div className="of-notice-bank-box">
                  <strong>Authorized Payment Rails:</strong>
                  <div>• MTN Mobile Money: Merchant Code <strong>408819</strong> (St. Michaels Academy)</div>
                  <div>• GCB Bank High Street: A/C No. <strong>1011400293811</strong></div>
                </div>
              </div>

              <div className="of-notice-sign-row">
                <div>
                  <div className="of-sig-line" />
                  <span>Mrs. Gertrude Addo</span>
                  <small>Chief Bursar</small>
                </div>
                <div>
                  <div className="of-sig-line" />
                  <span>Dame Eleanor Vance</span>
                  <small>Head Principal</small>
                </div>
              </div>
            </div>

            <div className="of-notice-footer">
              <button className="of-btn-print-notice" onClick={() => window.print()}>
                🖨️ Print Demand Letter
              </button>
              <button className="of-btn-close-notice" onClick={() => setDemandNoticeModal(null)}>
                ✕ Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
