import React, { useState, useEffect } from "react";
import FinanceNav from "./FinanceNav";
import {
  getInvoices,
  saveInvoices,
  getPayments,
  savePayments,
} from "./financeData";
import "./RecordPayment.css";

export default function RecordPayment() {
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [toast, setToast] = useState(null);

  // Form Fields
  const [selectedInvoiceId, setSelectedInvoiceId] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("MTN Mobile Money");
  const [transactionRef, setTransactionRef] = useState("");
  const [bankName, setBankName] = useState("MTN MoMo Gateway (Code: 408819)");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().substring(0, 16));
  const [notes, setNotes] = useState("");
  const [recordedBy, setRecordedBy] = useState("Mrs. Gertrude Addo (Chief Bursar)");

  // Success Receipt Modal
  const [issuedReceipt, setIssuedReceipt] = useState(null);

  useEffect(() => {
    const loadedInvoices = getInvoices();
    const loadedPayments = getPayments();
    setInvoices(loadedInvoices);
    setPayments(loadedPayments);

    // Default select first invoice with balance
    const outstandingInv = loadedInvoices.find((i) => i.balanceDue > 0);
    if (outstandingInv) {
      setSelectedInvoiceId(outstandingInv.id);
      setAmountPaid(outstandingInv.balanceDue);
    } else if (loadedInvoices.length > 0) {
      setSelectedInvoiceId(loadedInvoices[0].id);
      setAmountPaid(loadedInvoices[0].balanceDue);
    }
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleInvoiceChange = (e) => {
    const invId = e.target.value;
    setSelectedInvoiceId(invId);
    const inv = invoices.find((i) => i.id === invId);
    if (inv) {
      setAmountPaid(inv.balanceDue > 0 ? inv.balanceDue : 0);
    }
  };

  const handleMethodChange = (e) => {
    const method = e.target.value;
    setPaymentMethod(method);
    if (method === "MTN Mobile Money") {
      setBankName("MTN MoMo Gateway (Code: 408819)");
    } else if (method === "Vodafone Cash (Telecel)") {
      setBankName("Telecel Cash Merchant Terminal");
    } else if (method === "GCB Bank Direct Transfer") {
      setBankName("GCB Bank High Street Branch (A/C: 1011400293811)");
    } else if (method === "Ecobank Online Gateway") {
      setBankName("Ecobank Ghana Omnilite Portal");
    } else if (method === "Stanbic Bank Card") {
      setBankName("Stanbic Bank Ghana POS");
    } else if (method === "Cashier Counter") {
      setBankName("St. Michael's Bursar Vault (Cashier Desk 1)");
    }
  };

  const handleSubmitPayment = (e) => {
    e.preventDefault();
    const inv = invoices.find((i) => i.id === selectedInvoiceId);
    if (!inv) {
      showToast("Please select a valid invoice", "error");
      return;
    }

    const payVal = parseFloat(amountPaid);
    if (isNaN(payVal) || payVal <= 0) {
      showToast("Payment amount must be greater than GH₵ 0.00", "error");
      return;
    }

    const newReceiptNo = `REC-GH-2026-${String(8800 + payments.length + 1)}`;
    const autoRef = transactionRef.trim() || `TXN-GH-${Date.now().toString().slice(-8)}`;

    const newPayment = {
      id: `PAY-2026-${String(payments.length + 1).padStart(3, "0")}`,
      receiptNumber: newReceiptNo,
      invoiceId: inv.id,
      studentId: inv.studentId,
      studentName: inv.studentName,
      classCohort: inv.classCohort,
      amountPaid: payVal,
      currency: "GH₵",
      paymentMethod: paymentMethod,
      transactionReference: autoRef,
      bankName: bankName,
      paymentDate: paymentDate.replace("T", " "),
      recordedBy: recordedBy,
      status: "Verified & Cleared",
      notes: notes || `Direct fee payment credited against ${inv.id}.`,
    };

    // Update invoice paid & balance
    const updatedPaid = (inv.amountPaid || 0) + payVal;
    const updatedBalance = Math.max(0, inv.netAmount - updatedPaid);
    const updatedStatus = updatedBalance === 0 ? "Paid in Full" : "Partial Payment";

    const updatedInvoices = invoices.map((i) =>
      i.id === inv.id
        ? {
            ...i,
            amountPaid: updatedPaid,
            balanceDue: updatedBalance,
            paymentStatus: updatedStatus,
            lastPaymentDate: paymentDate.substring(0, 10),
          }
        : i
    );

    const updatedPayments = [newPayment, ...payments];

    setInvoices(updatedInvoices);
    setPayments(updatedPayments);
    saveInvoices(updatedInvoices);
    savePayments(updatedPayments);

    showToast(`Payment of GH₵ ${payVal.toLocaleString("en-US", { minimumFractionDigits: 2 })} recorded successfully!`);
    setIssuedReceipt(newPayment);

    // Reset form fields
    setTransactionRef("");
    setNotes("");
  };

  const selectedInv = invoices.find((i) => i.id === selectedInvoiceId);

  return (
    <div className="rp-container">
      <FinanceNav
        title="Bursar Counter & Payment Entry"
        subtitle="Record fees received via MTN Mobile Money, bank transfer, card gateway, or cash cashier in Ghanaian Cedi (GH₵)"
        badge="Module 10 • Screen 4 of 13"
      />

      {toast && (
        <div className={`rp-toast rp-toast-${toast.type}`}>
          <div className="rp-toast-dot" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="rp-header">
        <div className="rp-title-box">
          <span className="rp-tag">INSTITUTIONAL CASHIER TERMINAL</span>
          <h1 className="rp-title">Record Student Fee Payment</h1>
          <p className="rp-subtitle">
            Post collections directly against student invoices. Immediate automatic receipt generation,
            live ledger updating, and SMS/Email payment dispatch.
          </p>
        </div>
      </div>

      <div className="rp-layout-grid">
        {/* Payment Entry Form */}
        <div className="rp-form-card">
          <h2 className="rp-card-heading">💰 Payment Entry Details</h2>
          <p className="rp-card-sub">All transactions are logged in Ghanaian Cedi (GH₵) and audited.</p>

          <form onSubmit={handleSubmitPayment} className="rp-form">
            <div className="rp-field">
              <label>Select Target Student & Invoice:</label>
              <select value={selectedInvoiceId} onChange={handleInvoiceChange} required>
                {invoices.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.studentName} ({inv.studentId}) — {inv.classCohort} — Net: GH₵ {inv.netAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })} (Due: GH₵ {inv.balanceDue.toLocaleString("en-US", { minimumFractionDigits: 2 })})
                  </option>
                ))}
              </select>
            </div>

            <div className="rp-form-row">
              <div className="rp-field">
                <label>Amount Paid (GH₵):</label>
                <div className="rp-input-currency">
                  <span>GH₵</span>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="rp-field">
                <label>Payment Method:</label>
                <select value={paymentMethod} onChange={handleMethodChange} required>
                  <option value="MTN Mobile Money">MTN Mobile Money (MoMo)</option>
                  <option value="Vodafone Cash (Telecel)">Telecel Cash (Vodafone)</option>
                  <option value="GCB Bank Direct Transfer">GCB Bank Direct Transfer</option>
                  <option value="Ecobank Online Gateway">Ecobank Online Gateway</option>
                  <option value="Stanbic Bank Card">Stanbic Bank Card / POS</option>
                  <option value="Cashier Counter">Cashier Counter (Physical Cash)</option>
                </select>
              </div>
            </div>

            <div className="rp-form-row">
              <div className="rp-field">
                <label>Bank / Channel Name:</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  required
                />
              </div>

              <div className="rp-field">
                <label>Transaction / Teller Reference:</label>
                <input
                  type="text"
                  placeholder="e.g. MM-GH-9982410294"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                />
                <span className="rp-field-hint">Leave blank to auto-generate system reference</span>
              </div>
            </div>

            <div className="rp-form-row">
              <div className="rp-field">
                <label>Transaction Date & Time:</label>
                <input
                  type="datetime-local"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  required
                />
              </div>

              <div className="rp-field">
                <label>Recording Cashier / Bursar:</label>
                <input
                  type="text"
                  value={recordedBy}
                  onChange={(e) => setRecordedBy(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="rp-field">
              <label>Auditing Notes & Remarks:</label>
              <textarea
                rows="2"
                placeholder="e.g. Term 1 partial fee deposit, remaining balance payable before mid-term exams."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <button type="submit" className="rp-btn-submit">
              💳 Post & Issue Official Receipt
            </button>
          </form>
        </div>

        {/* Invoice Summary Preview */}
        <div className="rp-summary-panel">
          {selectedInv ? (
            <div className="rp-inv-summary-card">
              <div className="rp-inv-summary-head">
                <span className="rp-inv-pill">{selectedInv.id}</span>
                <span className={`rp-status-tag ${selectedInv.paymentStatus === "Paid in Full" ? "paid" : "unpaid"}`}>
                  {selectedInv.paymentStatus}
                </span>
              </div>

              <h3 className="rp-student-title">{selectedInv.studentName}</h3>
              <p className="rp-student-cohort">{selectedInv.classCohort} • Student ID: {selectedInv.studentId}</p>

              <div className="rp-breakdown-box">
                <div className="rp-breakdown-row">
                  <span>Gross Invoice Total:</span>
                  <strong>GH₵ {selectedInv.totalBilled.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong>
                </div>
                <div className="rp-breakdown-row">
                  <span>Approved Discounts / Waivers:</span>
                  <strong style={{ color: "#34d399" }}>
                    - GH₵ {selectedInv.discountApplied.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </strong>
                </div>
                <div className="rp-breakdown-row net">
                  <span>Net Bill Payable:</span>
                  <strong>GH₵ {selectedInv.netAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong>
                </div>
                <div className="rp-breakdown-row">
                  <span>Previously Cleared:</span>
                  <strong style={{ color: "#34d399" }}>
                    GH₵ {selectedInv.amountPaid.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </strong>
                </div>
                <div className="rp-breakdown-row due">
                  <span>Current Outstanding Balance:</span>
                  <strong style={{ color: selectedInv.balanceDue > 0 ? "#f87171" : "#34d399" }}>
                    GH₵ {selectedInv.balanceDue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </strong>
                </div>
              </div>

              <div className="rp-guardian-info">
                <div><strong>Parent:</strong> {selectedInv.guardianName}</div>
                <div><strong>Contact:</strong> {selectedInv.guardianPhone}</div>
                <div><strong>Due Date:</strong> {selectedInv.dueDate}</div>
              </div>

              <div className="rp-security-seal">
                <span>🛡️ BANK OF GHANA APPROVED BURSAR PROTOCOL</span>
              </div>
            </div>
          ) : (
            <div className="rp-inv-empty">Select an invoice to preview billing particulars.</div>
          )}

          {/* Recent Payments Stream */}
          <div className="rp-recent-card">
            <h4>Recent Bursar Postings</h4>
            <div className="rp-recent-list">
              {payments.slice(0, 4).map((p) => (
                <div key={p.id} className="rp-recent-item">
                  <div>
                    <strong>{p.studentName}</strong>
                    <div className="rp-recent-meta">{p.paymentMethod} • {p.receiptNumber}</div>
                  </div>
                  <div className="rp-recent-amt">
                    GH₵ {p.amountPaid.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Issued Receipt Modal */}
      {issuedReceipt && (
        <div className="rp-modal-overlay">
          <div className="rp-receipt-modal-box">
            <div className="rp-receipt-header">
              <div className="rp-receipt-badge">PAYMENT CONFIRMED & CLEARED</div>
              <h2>Official Cashier Receipt</h2>
              <span className="rp-receipt-code">{issuedReceipt.receiptNumber}</span>
            </div>

            <div className="rp-receipt-body">
              <div className="rp-receipt-grid">
                <div><strong>Student Name:</strong> {issuedReceipt.studentName}</div>
                <div><strong>Student ID:</strong> {issuedReceipt.studentId}</div>
                <div><strong>Class Cohort:</strong> {issuedReceipt.classCohort}</div>
                <div><strong>Invoice Reference:</strong> {issuedReceipt.invoiceId}</div>
                <div><strong>Payment Method:</strong> {issuedReceipt.paymentMethod}</div>
                <div><strong>Transaction Reference:</strong> {issuedReceipt.transactionReference}</div>
                <div><strong>Channel / Bank:</strong> {issuedReceipt.bankName}</div>
                <div><strong>Timestamp:</strong> {issuedReceipt.paymentDate}</div>
              </div>

              <div className="rp-receipt-amount-box">
                <span>Total Amount Received:</span>
                <h1>GH₵ {issuedReceipt.amountPaid.toLocaleString("en-US", { minimumFractionDigits: 2 })}</h1>
                <small>Ghanaian Cedi • Bursar Verified</small>
              </div>

              <p className="rp-receipt-notes">
                <strong>Remarks:</strong> {issuedReceipt.notes}
              </p>
            </div>

            <div className="rp-receipt-actions">
              <button className="rp-btn-print" onClick={() => window.print()}>
                🖨️ Print Receipt
              </button>
              <button className="rp-btn-done" onClick={() => setIssuedReceipt(null)}>
                ✓ Done / Record Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
