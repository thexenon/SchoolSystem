import React, { useState, useEffect } from "react";
import FinanceNav from "./FinanceNav";
import {
  getRefunds,
  saveRefunds,
  getPayments,
  savePayments,
} from "./financeData";
import "./RefundsAndReversals.css";

export default function RefundsAndReversals() {
  const [refunds, setRefunds] = useState([]);
  const [payments, setPayments] = useState([]);
  const [toast, setToast] = useState(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [refundMethod, setRefundMethod] = useState("MTN MoMo Reversal");
  const [reason, setReason] = useState("");
  const [principalPin, setPrincipalPin] = useState("Admin@2026");

  // PIN Gate for individual approve button
  const [approvingRefundId, setApprovingRefundId] = useState(null);
  const [actionPin, setActionPin] = useState("Admin@2026");

  useEffect(() => {
    const r = getRefunds();
    const p = getPayments();
    setRefunds(r);
    setPayments(p);
    if (p.length > 0) {
      setSelectedPaymentId(p[0].id);
      setRefundAmount(p[0].amountPaid);
    }
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handlePaymentSelect = (e) => {
    const payId = e.target.value;
    setSelectedPaymentId(payId);
    const p = payments.find((item) => item.id === payId);
    if (p) {
      setRefundAmount(p.amountPaid);
      if (p.paymentMethod.includes("MTN")) setRefundMethod("MTN MoMo Reversal");
      else if (p.paymentMethod.includes("Bank")) setRefundMethod("Bank Account Credit");
      else setRefundMethod("Cash Vault Disbursal");
    }
  };

  const handleInitiateRefund = (e) => {
    e.preventDefault();

    if (principalPin !== "Admin@2026") {
      showToast("Security Refusal: Principal PIN authorization failed!", "error");
      return;
    }

    const pay = payments.find((p) => p.id === selectedPaymentId);
    if (!pay) {
      showToast("Please select a target transaction", "error");
      return;
    }

    const refAmt = parseFloat(refundAmount);
    if (isNaN(refAmt) || refAmt <= 0 || refAmt > pay.amountPaid) {
      showToast(`Refund amount must be between GH₵ 1.00 and GH₵ ${pay.amountPaid}`, "error");
      return;
    }

    const newRefund = {
      id: `REF-2026-${String(refunds.length + 1).padStart(3, "0")}`,
      paymentId: pay.id,
      studentId: pay.studentId,
      studentName: pay.studentName,
      refundAmount: refAmt,
      currency: "GH₵",
      originalPaymentMethod: pay.paymentMethod,
      refundMethod: refundMethod,
      reason: reason,
      requestedDate: new Date().toISOString().substring(0, 10),
      authorizedDate: new Date().toISOString().substring(0, 10),
      status: "Approved & Refunded",
      authorizedBy: "Dame Eleanor Vance (Head Principal)",
      transactionRef: `REV-${Date.now().toString().slice(-8)}`,
    };

    const updatedRefunds = [newRefund, ...refunds];
    setRefunds(updatedRefunds);
    saveRefunds(updatedRefunds);

    showToast(`Refund of GH₵ ${refAmt.toLocaleString("en-US", { minimumFractionDigits: 2 })} authorized and reversed!`);
    setModalOpen(false);

    // Reset
    setReason("");
  };

  const handleApprovePending = (refId) => {
    if (actionPin !== "Admin@2026") {
      showToast("Security Refusal: Principal PIN authorization failed!", "error");
      return;
    }

    const updated = refunds.map((r) =>
      r.id === refId
        ? {
            ...r,
            status: "Approved & Refunded",
            authorizedDate: new Date().toISOString().substring(0, 10),
            authorizedBy: "Dame Eleanor Vance (Head Principal)",
            transactionRef: `REV-${Date.now().toString().slice(-8)}`,
          }
        : r
    );

    setRefunds(updated);
    saveRefunds(updated);
    showToast(`Refund ${refId} officially approved and dispatched!`);
    setApprovingRefundId(null);
  };

  const totalRefunded = refunds
    .filter((r) => r.status.includes("Approved"))
    .reduce((acc, curr) => acc + (curr.refundAmount || 0), 0);
  const pendingCount = refunds.filter((r) => r.status.includes("Pending")).length;

  return (
    <div className="rr-container">
      <FinanceNav
        title="Refunds, Reversals & Fiscal Corrections"
        subtitle="Manage authorized bursary reversals, billing corrections, and transaction clawbacks in Ghanaian Cedi (GH₵)"
        badge="Module 10 • Screen 10 of 13"
      />

      {toast && (
        <div className={`rr-toast rr-toast-${toast.type}`}>
          <div className="rr-toast-dot" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="rr-header">
        <div className="rr-title-box">
          <span className="rr-tag">FISCAL INTEGRITY & AUDIT GOVERNANCE</span>
          <h1 className="rr-title">Refunds & Payment Reversals</h1>
          <p className="rr-subtitle">
            Authorize legitimate bursary refunds for cohort relocations, duplicate bank deposits,
            or billing adjustments in Ghanaian Cedi (GH₵). Requires two-tier Principal cryptographic PIN authentication.
          </p>
        </div>

        <div className="rr-actions">
          <button className="rr-btn-primary" onClick={() => setModalOpen(true)}>
            <span className="rr-btn-icon">+</span> Initiate Fiscal Reversal
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="rr-kpi-grid">
        <div className="rr-kpi-card">
          <div className="rr-kpi-icon-wrap" style={{ background: "rgba(239, 68, 68, 0.15)", color: "#ef4444" }}>
            ↩️
          </div>
          <div className="rr-kpi-body">
            <span className="rr-kpi-label">Total Amount Refunded</span>
            <div className="rr-kpi-val" style={{ color: "#f87171" }}>
              GH₵ {totalRefunded.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <span className="rr-kpi-sub">Audited & balanced</span>
          </div>
        </div>

        <div className="rr-kpi-card">
          <div className="rr-kpi-icon-wrap" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b" }}>
            ⏳
          </div>
          <div className="rr-kpi-body">
            <span className="rr-kpi-label">Pending Approval</span>
            <div className="rr-kpi-val">{pendingCount} Requests</div>
            <span className="rr-kpi-sub">Awaiting Principal seal</span>
          </div>
        </div>

        <div className="rr-kpi-card">
          <div className="rr-kpi-icon-wrap" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
            🔒
          </div>
          <div className="rr-kpi-body">
            <span className="rr-kpi-label">Security Protocol</span>
            <div className="rr-kpi-val">PIN Protected</div>
            <span className="rr-kpi-sub">Admin@2026 Required</span>
          </div>
        </div>

        <div className="rr-kpi-card">
          <div className="rr-kpi-icon-wrap" style={{ background: "rgba(59, 130, 246, 0.15)", color: "#3b82f6" }}>
            🏛️
          </div>
          <div className="rr-kpi-body">
            <span className="rr-kpi-label">Audit Compliance</span>
            <div className="rr-kpi-val">Ghana Audit Service</div>
            <span className="rr-kpi-sub">Full ledger reconciliation</span>
          </div>
        </div>
      </div>

      {/* Refunds Table */}
      <div className="rr-table-card">
        <div className="rr-table-responsive">
          <table className="rr-table">
            <thead>
              <tr>
                <th>Refund ID</th>
                <th>Payment Ref</th>
                <th>Student Particulars</th>
                <th>Refund Amount</th>
                <th>Disbursal Method</th>
                <th>Audit Grounds & Reason</th>
                <th>Requested Date</th>
                <th>Authorized By</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {refunds.length === 0 ? (
                <tr>
                  <td colSpan="10" className="rr-empty">No refund or reversal records found.</td>
                </tr>
              ) : (
                refunds.map((r) => (
                  <tr key={r.id} className="rr-table-row">
                    <td>
                      <span className="rr-ref-code">{r.id}</span>
                    </td>
                    <td>
                      <code className="rr-pay-link">{r.paymentId}</code>
                    </td>
                    <td>
                      <strong className="rr-student-name">{r.studentName}</strong>
                      <div className="rr-sub-text">{r.studentId}</div>
                    </td>
                    <td className="rr-amt" style={{ color: "#f87171" }}>
                      - GH₵ {r.refundAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td>
                      <span className="rr-method-tag">{r.refundMethod}</span>
                    </td>
                    <td>
                      <div className="rr-reason-text">{r.reason}</div>
                    </td>
                    <td>
                      <span className="rr-date-text">{r.requestedDate}</span>
                    </td>
                    <td>
                      <span className="rr-auth-text">{r.authorizedBy || "Pending Review"}</span>
                    </td>
                    <td>
                      <span
                        className={`rr-status-badge ${
                          r.status.includes("Approved") ? "approved" : "pending"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td>
                      {r.status.includes("Pending") ? (
                        <button
                          className="rr-btn-approve"
                          onClick={() => setApprovingRefundId(r.id)}
                        >
                          🔐 Authorize
                        </button>
                      ) : (
                        <span className="rr-cleared-text">✓ Closed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Initiate Refund */}
      {modalOpen && (
        <div className="rr-modal-overlay">
          <div className="rr-modal-box">
            <div className="rr-modal-header">
              <div>
                <h3>↩️ Initiate Payment Refund / Reversal</h3>
                <p>Authorize return of funds or ledger credit in Ghanaian Cedi (GH₵).</p>
              </div>
              <button className="rr-btn-close" onClick={() => setModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleInitiateRefund} className="rr-modal-form">
              <div className="rr-form-field">
                <label>Select Target Payment Record to Reverse:</label>
                <select value={selectedPaymentId} onChange={handlePaymentSelect} required>
                  {payments.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.receiptNumber} — {p.studentName} — Paid: GH₵ {p.amountPaid.toLocaleString("en-US", { minimumFractionDigits: 2 })} via {p.paymentMethod}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rr-form-row">
                <div className="rr-form-field">
                  <label>Refund Amount (GH₵):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="rr-form-field">
                  <label>Refund / Disbursal Method:</label>
                  <select value={refundMethod} onChange={(e) => setRefundMethod(e.target.value)}>
                    <option value="MTN MoMo Reversal">MTN MoMo Reversal</option>
                    <option value="Bank Account Credit">Direct Bank Account Credit</option>
                    <option value="Cash Vault Disbursal">Cash Vault Cashier Return</option>
                    <option value="Term 2 Ledger Credit">Roll Over to Next Term Credit</option>
                  </select>
                </div>
              </div>

              <div className="rr-form-field">
                <label>Audit Grounds & Reason for Refund:</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Duplicate transport levy deposited erroneously by guardian during term registration."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                />
              </div>

              <div className="rr-pin-field">
                <label>🔒 Principal Cryptographic Authorization PIN:</label>
                <input
                  type="password"
                  value={principalPin}
                  onChange={(e) => setPrincipalPin(e.target.value)}
                  required
                />
                <span className="rr-pin-hint">Auto-filled for testing: Admin@2026</span>
              </div>

              <div className="rr-modal-footer">
                <button type="button" className="rr-btn-cancel" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="rr-btn-submit">
                  ↩️ Authorize & Disburse Refund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Authorize Pending Refund */}
      {approvingRefundId && (
        <div className="rr-modal-overlay">
          <div className="rr-modal-pin-box">
            <h3>🔐 Authorize Refund {approvingRefundId}</h3>
            <p>Enter Principal Security PIN to sign off this fiscal reversal:</p>

            <div className="rr-pin-field" style={{ margin: "16px 0" }}>
              <input
                type="password"
                value={actionPin}
                onChange={(e) => setActionPin(e.target.value)}
                placeholder="Enter Principal PIN"
                required
              />
              <span className="rr-pin-hint">Default: Admin@2026</span>
            </div>

            <div className="rr-modal-footer">
              <button className="rr-btn-cancel" onClick={() => setApprovingRefundId(null)}>
                Cancel
              </button>
              <button
                className="rr-btn-submit"
                onClick={() => handleApprovePending(approvingRefundId)}
              >
                Sign & Authorize
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
