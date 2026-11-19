import React, { useState, useEffect } from "react";
import FinanceNav from "./FinanceNav";
import { getPayments } from "./financeData";
import "./PaymentHistory.css";

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [methodFilter, setMethodFilter] = useState("All");
  const [cohortFilter, setCohortFilter] = useState("All");
  const [viewReceipt, setViewReceipt] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setPayments(getPayments());
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const filteredPayments = payments.filter((p) => {
    if (methodFilter !== "All" && p.paymentMethod !== methodFilter) return false;
    if (cohortFilter !== "All" && p.classCohort !== cohortFilter) return false;
    if (searchTerm.trim() !== "") {
      const q = searchTerm.toLowerCase();
      const matchName = p.studentName.toLowerCase().includes(q);
      const matchReceipt = p.receiptNumber.toLowerCase().includes(q);
      const matchRef = p.transactionReference.toLowerCase().includes(q);
      const matchInv = p.invoiceId.toLowerCase().includes(q);
      if (!matchName && !matchReceipt && !matchRef && !matchInv) return false;
    }
    return true;
  });

  const totalCollected = payments.reduce((acc, curr) => acc + (curr.amountPaid || 0), 0);
  const momoShare = payments
    .filter((p) => p.paymentMethod.includes("MTN") || p.paymentMethod.includes("Telecel") || p.paymentMethod.includes("Vodafone"))
    .reduce((acc, curr) => acc + (curr.amountPaid || 0), 0);
  const bankShare = payments
    .filter((p) => p.paymentMethod.includes("Bank") || p.paymentMethod.includes("Ecobank"))
    .reduce((acc, curr) => acc + (curr.amountPaid || 0), 0);
  const cashShare = payments
    .filter((p) => p.paymentMethod.includes("Cashier"))
    .reduce((acc, curr) => acc + (curr.amountPaid || 0), 0);

  const exportCSV = () => {
    const headers = "Receipt Number,Invoice ID,Student Name,Cohort,Payment Method,Transaction Ref,Date,Amount (GHS),Recorded By\n";
    const rows = filteredPayments
      .map(
        (p) =>
          `"${p.receiptNumber}","${p.invoiceId}","${p.studentName}","${p.classCohort}","${p.paymentMethod}","${p.transactionReference}","${p.paymentDate}","${p.amountPaid}","${p.recordedBy}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Payment_Ledger_${new Date().toISOString().substring(0, 10)}.csv`;
    a.click();
    showToast("Payment ledger exported as CSV file!");
  };

  return (
    <div className="ph-container">
      <FinanceNav
        title="Payment History & Audit Trail"
        subtitle="Complete chronological transaction journal with bank references, receipts, and cashier timestamps in Ghanaian Cedi (GH₵)"
        badge="Module 10 • Screen 5 of 13"
      />

      {toast && (
        <div className={`ph-toast ph-toast-${toast.type}`}>
          <div className="ph-toast-dot" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="ph-header">
        <div className="ph-title-box">
          <span className="ph-tag">FINANCIAL TRANSACTION AUDIT LOG</span>
          <h1 className="ph-title">Institutional Payment Ledger</h1>
          <p className="ph-subtitle">
            Search, verify, and export all fee collections processed through electronic gateways,
            direct bank wires, and bursary cashier counters in Ghanaian Cedi (GH₵).
          </p>
        </div>

        <div className="ph-actions">
          <button className="ph-btn-export" onClick={exportCSV}>
            📥 Export CSV Ledger
          </button>
          <button className="ph-btn-print-summary" onClick={() => window.print()}>
            🖨️ Print Audit Sheet
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="ph-kpi-grid">
        <div className="ph-kpi-card">
          <div className="ph-kpi-icon-wrap" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
            💵
          </div>
          <div className="ph-kpi-body">
            <span className="ph-kpi-label">Total Fee Collections</span>
            <div className="ph-kpi-val">GH₵ {totalCollected.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
            <span className="ph-kpi-sub">{payments.length} audited payments</span>
          </div>
        </div>

        <div className="ph-kpi-card">
          <div className="ph-kpi-icon-wrap" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b" }}>
            📱
          </div>
          <div className="ph-kpi-body">
            <span className="ph-kpi-label">Mobile Money (MoMo)</span>
            <div className="ph-kpi-val">GH₵ {momoShare.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
            <span className="ph-kpi-sub">MTN MoMo & Telecel Cash</span>
          </div>
        </div>

        <div className="ph-kpi-card">
          <div className="ph-kpi-icon-wrap" style={{ background: "rgba(59, 130, 246, 0.15)", color: "#3b82f6" }}>
            🏦
          </div>
          <div className="ph-kpi-body">
            <span className="ph-kpi-label">Direct Bank & Cards</span>
            <div className="ph-kpi-val">GH₵ {bankShare.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
            <span className="ph-kpi-sub">GCB, Ecobank & Stanbic</span>
          </div>
        </div>

        <div className="ph-kpi-card">
          <div className="ph-kpi-icon-wrap" style={{ background: "rgba(139, 92, 246, 0.15)", color: "#8b5cf6" }}>
            🏢
          </div>
          <div className="ph-kpi-body">
            <span className="ph-kpi-label">Bursar Cashier Desk</span>
            <div className="ph-kpi-val">GH₵ {cashShare.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
            <span className="ph-kpi-sub">Physical Cash Vault</span>
          </div>
        </div>
      </div>

      {/* Filter / Search Toolbar */}
      <div className="ph-toolbar">
        <div className="ph-search-box">
          <span className="ph-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by student name, receipt number, transaction reference, or invoice ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="ph-search-clear" onClick={() => setSearchTerm("")}>✕</button>
          )}
        </div>

        <div className="ph-filters">
          <div className="ph-filter-item">
            <label>Payment Channel:</label>
            <select value={methodFilter} onChange={(e) => setMethodFilter(e.target.value)}>
              <option value="All">All Channels</option>
              <option value="MTN Mobile Money">MTN Mobile Money</option>
              <option value="Vodafone Cash (Telecel)">Telecel Cash</option>
              <option value="GCB Bank Direct Transfer">GCB Bank Direct Transfer</option>
              <option value="Ecobank Online Gateway">Ecobank Online Gateway</option>
              <option value="Stanbic Bank Card">Stanbic Bank Card</option>
              <option value="Cashier Counter">Cashier Counter</option>
            </select>
          </div>

          <div className="ph-filter-item">
            <label>Class Cohort:</label>
            <select value={cohortFilter} onChange={(e) => setCohortFilter(e.target.value)}>
              <option value="All">All Cohorts</option>
              <option value="Grade 11-A">Grade 11-A</option>
              <option value="Grade 11-B">Grade 11-B</option>
              <option value="Grade 12-A">Grade 12-A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="ph-table-card">
        <div className="ph-table-responsive">
          <table className="ph-table">
            <thead>
              <tr>
                <th>Receipt No</th>
                <th>Invoice ID</th>
                <th>Student Particulars</th>
                <th>Class Cohort</th>
                <th>Channel / Gateway</th>
                <th>Transaction Ref</th>
                <th>Amount (GH₵)</th>
                <th>Timestamp</th>
                <th>Recorded By</th>
                <th>Audit Status</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="11" className="ph-empty">
                    No transactions match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="ph-table-row">
                    <td>
                      <strong className="ph-receipt-no">{p.receiptNumber}</strong>
                    </td>
                    <td>
                      <span className="ph-inv-link">{p.invoiceId}</span>
                    </td>
                    <td>
                      <div className="ph-student-name">{p.studentName}</div>
                      <div className="ph-sub-text">{p.studentId}</div>
                    </td>
                    <td>
                      <span className="ph-cohort-tag">{p.classCohort}</span>
                    </td>
                    <td>
                      <div className="ph-method-name">{p.paymentMethod}</div>
                      <div className="ph-sub-text">{p.bankName}</div>
                    </td>
                    <td>
                      <code className="ph-ref-code">{p.transactionReference}</code>
                    </td>
                    <td className="ph-amt">
                      GH₵ {p.amountPaid.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td>
                      <div className="ph-date-text">{p.paymentDate}</div>
                    </td>
                    <td>
                      <span className="ph-cashier-text">{p.recordedBy}</span>
                    </td>
                    <td>
                      <span className="ph-status-tag">✓ {p.status}</span>
                    </td>
                    <td>
                      <button
                        className="ph-btn-view-rec"
                        onClick={() => setViewReceipt(p)}
                        title="View Official Receipt"
                      >
                        🧾 Receipt
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Receipt Voucher Modal */}
      {viewReceipt && (
        <div className="ph-modal-overlay">
          <div className="ph-modal-voucher">
            <div className="ph-voucher-header">
              <div className="ph-voucher-seal">OFFICIAL PAYMENT RECEIPT</div>
              <h2>ST. MICHAEL'S INTERNATIONAL ACADEMY</h2>
              <p>Bursar Office • Greater Accra, Ghana • Tel: +233 30 200 4488</p>
              <div className="ph-voucher-number">{viewReceipt.receiptNumber}</div>
            </div>

            <div className="ph-voucher-body">
              <div className="ph-voucher-grid">
                <div><strong>Student Name:</strong> {viewReceipt.studentName}</div>
                <div><strong>Student ID:</strong> {viewReceipt.studentId}</div>
                <div><strong>Class / Cohort:</strong> {viewReceipt.classCohort}</div>
                <div><strong>Target Invoice:</strong> {viewReceipt.invoiceId}</div>
                <div><strong>Payment Gateway:</strong> {viewReceipt.paymentMethod}</div>
                <div><strong>Transaction Reference:</strong> {viewReceipt.transactionReference}</div>
                <div><strong>Deposit Account:</strong> {viewReceipt.bankName}</div>
                <div><strong>Date & Time:</strong> {viewReceipt.paymentDate}</div>
              </div>

              <div className="ph-voucher-amount-box">
                <span>Total Amount Paid:</span>
                <h1>GH₵ {viewReceipt.amountPaid.toLocaleString("en-US", { minimumFractionDigits: 2 })}</h1>
                <small>Ghanaian Cedi • Authorized & Cleared</small>
              </div>

              <div className="ph-voucher-notes">
                <strong>Auditor's Note:</strong> {viewReceipt.notes}
              </div>

              <div className="ph-voucher-signatures">
                <div>
                  <div className="ph-sig-line" />
                  <span>{viewReceipt.recordedBy}</span>
                  <small>Authorized Cashier</small>
                </div>
                <div className="ph-qr-box">
                  <div className="ph-qr-sim">QR VERIFIED</div>
                </div>
                <div>
                  <div className="ph-sig-line" />
                  <span>Dame Eleanor Vance</span>
                  <small>Head Principal</small>
                </div>
              </div>
            </div>

            <div className="ph-voucher-footer">
              <button className="ph-btn-print" onClick={() => window.print()}>
                🖨️ Print Receipt Voucher
              </button>
              <button className="ph-btn-close" onClick={() => setViewReceipt(null)}>
                ✕ Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
