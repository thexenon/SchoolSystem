import React, { useState, useEffect } from "react";
import StudentNav from "./StudentNav";
import { getActiveStudent, STUDENT_FEES_SCHEDULE } from "./studentPortalData";
import "./MyFees.css";

export default function MyFees() {
  const [student, setStudent] = useState(getActiveStudent());
  const [fees, setFees] = useState(STUDENT_FEES_SCHEDULE);
  const [activeReceipt, setActiveReceipt] = useState(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [payAmount, setPayAmount] = useState("3450");
  const [momoNetwork, setMomoNetwork] = useState("MTN Mobile Money");
  const [momoNumber, setMomoNumber] = useState("+233 24 411 9081");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handleStudentChanged = (e) => {
      if (e.detail) setStudent(e.detail);
      else setStudent(getActiveStudent());
    };
    window.addEventListener("studentUserChanged", handleStudentChanged);
    return () => window.removeEventListener("studentUserChanged", handleStudentChanged);
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    const newReceiptId = `RCP-MOMO-${Math.floor(Math.random() * 80000 + 10000)}`;

    const updated = fees.map((f) => {
      if (f.status === "Upcoming") {
        return {
          ...f,
          status: "Paid",
          paidOn: new Date().toISOString().split("T")[0],
          method: momoNetwork,
          receiptId: newReceiptId,
        };
      }
      return f;
    });

    setFees(updated);
    setShowPayModal(false);
    showToast(`Payment of GH₵${payAmount} approved via ${momoNetwork}! Receipt: ${newReceiptId}`);
  };

  const totalBilled = fees.reduce((acc, curr) => acc + curr.amount, 0);
  const totalPaid = fees
    .filter((f) => f.status === "Paid")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const outstanding = totalBilled - totalPaid;

  return (
    <div className="mf-page-container">
      {toast && (
        <div className="mf-toast">
          <span>✓</span> {toast}
        </div>
      )}

      <StudentNav
        title="Student Fee Statement & Billing Ledger"
        subtitle="Review billed tuition invoices, verified Mobile Money receipts, and official financial clearance status"
        badge="Module 12 • Screen 9 of 10"
      />

      {/* Header Banner */}
      <div className="mf-header-strip">
        <div>
          <span className="mf-tag">GHANAIAN CEDI (GH₵) FINANCIAL LEDGER</span>
          <h1 className="mf-title">My School Fees & Receipts</h1>
          <p className="mf-sub">
            Verified student accounting ledger for <strong>{student.fullName}</strong> ({student.id}) •{" "}
            {student.grade} - {student.section}
          </p>
        </div>

        <div className="mf-header-actions">
          <button className="mf-btn-pay" onClick={() => setShowPayModal(true)}>
            📱 Pay Online (Mobile Money)
          </button>
          <button className="mf-btn-print" onClick={handlePrint}>
            🖨️ Print Statement
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="mf-kpi-grid">
        <div className="mf-kpi-card">
          <span className="mf-kpi-label">Total Invoiced (Term 1)</span>
          <div className="mf-kpi-val text-cyan">GH₵{totalBilled.toLocaleString()}.00</div>
          <span className="mf-kpi-sub">Tuition, STEM & kit fees</span>
        </div>

        <div className="mf-kpi-card">
          <span className="mf-kpi-label">Total Remitted</span>
          <div className="mf-kpi-val text-emerald">GH₵{totalPaid.toLocaleString()}.00</div>
          <span className="mf-kpi-sub">Verified bank & MoMo credits</span>
        </div>

        <div className="mf-kpi-card">
          <span className="mf-kpi-label">Outstanding Balance</span>
          <div className={`mf-kpi-val ${outstanding === 0 ? "text-emerald" : "text-amber"}`}>
            GH₵{outstanding.toLocaleString()}.00
          </div>
          <span className="mf-kpi-sub">
            {outstanding === 0 ? "✓ Full Term Clearance" : "Due prior to examinations"}
          </span>
        </div>

        <div className="mf-kpi-card">
          <span className="mf-kpi-label">Official Clearance</span>
          <div className="mf-kpi-val text-emerald">
            {student.feesStatus === "Paid" ? "CERTIFIED" : "PENDING"}
          </div>
          <span className="mf-kpi-sub">Examination pass issued</span>
        </div>
      </div>

      {/* Fees Schedule Table Card */}
      <div className="mf-card">
        <div className="mf-card-header">
          <h2>Itemized Fee Invoices & Payment History</h2>
          <span className="mf-currency-badge">Currency: GHS (GH₵)</span>
        </div>

        <div className="mf-table-wrapper">
          <table className="mf-table">
            <thead>
              <tr>
                <th>Invoice Ref</th>
                <th>Fee Description</th>
                <th style={{ textAlign: "right" }}>Amount (GH₵)</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Settled On</th>
                <th>Payment Mode</th>
                <th>Receipt Voucher</th>
              </tr>
            </thead>
            <tbody>
              {fees.map((f) => (
                <tr key={f.id}>
                  <td className="font-mono mf-inv-id">{f.id}</td>
                  <td>
                    <strong>{f.title}</strong>
                  </td>
                  <td style={{ textAlign: "right", fontWeight: 800, color: "#fde047" }} className="font-mono">
                    GH₵{f.amount.toLocaleString()}.00
                  </td>
                  <td className="font-mono text-cyan">{f.dueDate}</td>
                  <td>
                    <span
                      className={`mf-badge ${
                        f.status === "Paid" ? "mf-badge-paid" : "mf-badge-upcoming"
                      }`}
                    >
                      ● {f.status}
                    </span>
                  </td>
                  <td className="font-mono">{f.paidOn || "—"}</td>
                  <td>{f.method}</td>
                  <td>
                    {f.receiptId !== "—" ? (
                      <button
                        className="mf-btn-receipt"
                        onClick={() => setActiveReceipt(f)}
                      >
                        📄 {f.receiptId}
                      </button>
                    ) : (
                      <span style={{ color: "#64748b" }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Receipt Modal */}
      {activeReceipt && (
        <div className="mf-modal-backdrop" onClick={() => setActiveReceipt(null)}>
          <div className="mf-receipt-card" onClick={(e) => e.stopPropagation()}>
            <div className="mf-receipt-header">
              <div className="mf-receipt-brand">
                <span className="mf-receipt-logo">🏫</span>
                <div>
                  <h3>ST. MARY INTERNATIONAL ACADEMY</h3>
                  <small>Office of the Head Bursar & Accounts Directorate</small>
                </div>
              </div>
              <button className="mf-modal-close" onClick={() => setActiveReceipt(null)}>
                ✕
              </button>
            </div>

            <div className="mf-receipt-banner">
              <div>
                <span className="mf-receipt-tag">OFFICIAL ELECTRONIC RECEIPT</span>
                <h4>{activeReceipt.receiptId}</h4>
              </div>
              <div className="mf-receipt-amount font-mono">
                GH₵{activeReceipt.amount.toLocaleString()}.00
              </div>
            </div>

            <div className="mf-receipt-body">
              <div className="mf-receipt-row">
                <span>Received From (Student):</span>
                <strong>{student.fullName} ({student.id})</strong>
              </div>
              <div className="mf-receipt-row">
                <span>Class & Division:</span>
                <strong>{student.grade} - {student.section}</strong>
              </div>
              <div className="mf-receipt-row">
                <span>Payment For:</span>
                <strong>{activeReceipt.title}</strong>
              </div>
              <div className="mf-receipt-row">
                <span>Payment Channel:</span>
                <strong>{activeReceipt.method}</strong>
              </div>
              <div className="mf-receipt-row">
                <span>Transaction Date:</span>
                <strong>{activeReceipt.paidOn}</strong>
              </div>
              <div className="mf-receipt-row">
                <span>Bursary Status:</span>
                <strong className="text-emerald">VERIFIED & CLEARED</strong>
              </div>
            </div>

            <div className="mf-receipt-footer">
              <button className="mf-btn-print-receipt" onClick={() => window.print()}>
                🖨️ Print Official Receipt
              </button>
              <button className="mf-btn-close-receipt" onClick={() => setActiveReceipt(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Online Mobile Money Checkout Modal */}
      {showPayModal && (
        <div className="mf-modal-backdrop" onClick={() => setShowPayModal(false)}>
          <div className="mf-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="mf-modal-header">
              <h3>Pay Fees with Mobile Money</h3>
              <button className="mf-modal-close" onClick={() => setShowPayModal(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handlePaymentSubmit}>
              <p className="mf-modal-desc">
                Instant school fee settlement with prompt mobile push prompt to your phone.
              </p>

              <div className="mf-form-group">
                <label>Mobile Money Network:</label>
                <select
                  value={momoNetwork}
                  onChange={(e) => setMomoNetwork(e.target.value)}
                >
                  <option value="MTN Mobile Money">MTN Mobile Money (Merchant 408819)</option>
                  <option value="Telecel Cash">Telecel Cash (*110# Voucher)</option>
                  <option value="AT Money">AT Money (AirtelTigo)</option>
                </select>
              </div>

              <div className="mf-form-group">
                <label>Payer Mobile Phone Number:</label>
                <input
                  type="text"
                  value={momoNumber}
                  onChange={(e) => setMomoNumber(e.target.value)}
                  placeholder="+233 24 000 0000"
                  required
                />
              </div>

              <div className="mf-form-group">
                <label>Amount to Pay (GH₵):</label>
                <input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  required
                />
              </div>

              <div className="mf-modal-footer">
                <button
                  type="button"
                  className="mf-btn-cancel"
                  onClick={() => setShowPayModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="mf-btn-confirm-pay">
                  Authorize GH₵{Number(payAmount).toLocaleString()}.00 Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
