import React, { useState, useEffect } from "react";
import ParentNav from "./ParentNav";
import {
  getActiveParent,
  LINKED_CHILDREN,
  getActiveChildId,
} from "./parentData";
import {
  getInvoices,
  saveInvoices,
  getPayments,
  savePayments,
} from "../School Fees and Finance/financeData";
import "./ParentFeePayment.css";

export default function ParentFeePayment() {
  const parent = getActiveParent();
  const [activeChildId, setActiveChildId] = useState(getActiveChildId());
  const [payChannel, setPayChannel] = useState("momo"); // momo, telecel, card
  const [amountInput, setAmountInput] = useState("");
  const [toast, setToast] = useState(null);

  // Form Fields
  const [momoNumber, setMomoNumber] = useState(parent.phone.replace(/[^0-9]/g, "").slice(-10) || "0249901122");
  const [telecelNumber, setTelecelNumber] = useState("0208823344");
  const [telecelVoucher, setTelecelVoucher] = useState("448921");
  const [cardNumber, setCardNumber] = useState("4111 2222 3333 4444");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvv, setCardCvv] = useState("882");

  // Processing Animation State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState("");
  const [issuedReceipt, setIssuedReceipt] = useState(null);

  useEffect(() => {
    const handleChildChanged = () => {
      setActiveChildId(getActiveChildId());
    };
    window.addEventListener("childChanged", handleChildChanged);
    return () => window.removeEventListener("childChanged", handleChildChanged);
  }, []);

  const parentChildren = LINKED_CHILDREN.filter((c) =>
    parent.linkedStudentIds.includes(c.id)
  );

  const child =
    parentChildren.find((c) => c.id === activeChildId) || parentChildren[0];

  const allInvoices = getInvoices();
  const targetInvoice =
    allInvoices.find((i) => i.studentId === child.id) || allInvoices[0];

  useEffect(() => {
    if (targetInvoice) {
      setAmountInput(targetInvoice.balanceDue > 0 ? targetInvoice.balanceDue : 500);
    }
  }, [targetInvoice]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handlePaySubmit = (e) => {
    e.preventDefault();
    const payVal = parseFloat(amountInput);
    if (isNaN(payVal) || payVal <= 0) {
      showToast("Please enter an amount greater than GH₵ 0.00", "error");
      return;
    }

    setIsProcessing(true);
    setProcessStep("Securing 256-bit connection to Bank of Ghana GhIPSS payment gateway...");

    setTimeout(() => {
      if (payChannel === "momo") {
        setProcessStep(`Dispatched authorization prompt to MTN phone number ${momoNumber}...`);
      } else if (payChannel === "telecel") {
        setProcessStep(`Validating Telecel Cash voucher code ${telecelVoucher}...`);
      } else {
        setProcessStep("Validating 3D Secure Verified by Visa / Mastercard authentication token...");
      }

      setTimeout(() => {
        setProcessStep("Merchant account 408819 credited. Updating student billing records...");

        setTimeout(() => {
          setIsProcessing(false);

          const payments = getPayments();
          const newReceiptNo = `REC-GH-2026-${String(8800 + payments.length + 1)}`;
          const channelName =
            payChannel === "momo"
              ? "MTN Mobile Money"
              : payChannel === "telecel"
              ? "Vodafone Cash (Telecel)"
              : "Stanbic / Visa Online Card";

          const newPayment = {
            id: `PAY-2026-${String(payments.length + 1).padStart(3, "0")}`,
            receiptNumber: newReceiptNo,
            invoiceId: targetInvoice ? targetInvoice.id : "INV-2026-001",
            studentId: child.id,
            studentName: child.fullName,
            classCohort: child.classCohort,
            amountPaid: payVal,
            currency: "GH₵",
            paymentMethod: channelName,
            transactionReference: `MM-GH-${Date.now().toString().slice(-10)}`,
            bankName: "MTN MoMo Gateway (Code: 408819)",
            paymentDate: new Date().toISOString().replace("T", " ").substring(0, 16),
            recordedBy: "Parent Portal Online Gateway",
            status: "Verified & Cleared",
            notes: `Direct parent checkout by ${parent.fullName} for ward ${child.fullName}.`,
          };

          // Update invoices
          if (targetInvoice) {
            const newPaid = (targetInvoice.amountPaid || 0) + payVal;
            const newBal = Math.max(0, targetInvoice.netAmount - newPaid);
            const updatedInvoices = allInvoices.map((inv) =>
              inv.id === targetInvoice.id
                ? {
                    ...inv,
                    amountPaid: newPaid,
                    balanceDue: newBal,
                    paymentStatus: newBal === 0 ? "Paid in Full" : "Partial Payment",
                    lastPaymentDate: new Date().toISOString().substring(0, 10),
                  }
                : inv
            );
            saveInvoices(updatedInvoices);
          }

          savePayments([newPayment, ...payments]);
          showToast(`Fee payment of GH₵ ${payVal.toLocaleString("en-US", { minimumFractionDigits: 2 })} successful!`);
          setIssuedReceipt(newPayment);
        }, 1200);
      }, 1400);
    }, 1200);
  };

  return (
    <div className="pfp-container">
      <ParentNav
        title="Electronic Fee Payment Checkout"
        subtitle="Instant and secure school fee payments via MTN Mobile Money, Telecel Cash, and Bank Cards in Ghanaian Cedi (GH₵)"
        badge="Module 11 • Screen 7 of 10"
      />

      {toast && (
        <div className={`pfp-toast pfp-toast-${toast.type}`}>
          <div className="pfp-toast-dot" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="pfp-header">
        <div className="pfp-title-box">
          <span className="pfp-tag">GHANA MOBILE MONEY & WEB CHECKOUT</span>
          <h1 className="pfp-title">Pay School Fees Online</h1>
          <p className="pfp-subtitle">
            Instant electronic fee payments credited directly to St. Michael's International Academy
            bursary operational accounts. All transactions are logged in Ghanaian Cedi (GH₵).
          </p>
        </div>
      </div>

      <div className="pfp-layout-grid">
        {/* Payment Form */}
        <div className="pfp-form-card">
          <h2 className="pfp-card-title">Select Payment Channel for {child.fullName}</h2>

          {/* Payment Method Switcher */}
          <div className="pfp-channel-tabs">
            <button
              type="button"
              className={`pfp-tab-btn ${payChannel === "momo" ? "active" : ""}`}
              onClick={() => setPayChannel("momo")}
            >
              <span className="pfp-tab-icon">🟡</span>
              <div>
                <strong>MTN MoMo</strong>
                <small>Merchant: 408819</small>
              </div>
            </button>

            <button
              type="button"
              className={`pfp-tab-btn ${payChannel === "telecel" ? "active" : ""}`}
              onClick={() => setPayChannel("telecel")}
            >
              <span className="pfp-tab-icon">🔴</span>
              <div>
                <strong>Telecel Cash</strong>
                <small>Vodafone (*110#)</small>
              </div>
            </button>

            <button
              type="button"
              className={`pfp-tab-btn ${payChannel === "card" ? "active" : ""}`}
              onClick={() => setPayChannel("card")}
            >
              <span className="pfp-tab-icon">💳</span>
              <div>
                <strong>Debit Card</strong>
                <small>Visa / Mastercard</small>
              </div>
            </button>
          </div>

          <form onSubmit={handlePaySubmit} className="pfp-form">
            <div className="pfp-field">
              <label>Amount to Pay in Ghanaian Cedi (GH₵):</label>
              <div className="pfp-currency-input">
                <span>GH₵</span>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  required
                />
              </div>
            </div>

            {payChannel === "momo" && (
              <div className="pfp-channel-box">
                <div className="pfp-field">
                  <label>MTN Mobile Money Phone Number:</label>
                  <input
                    type="tel"
                    value={momoNumber}
                    onChange={(e) => setMomoNumber(e.target.value)}
                    required
                  />
                  <span className="pfp-hint">You will receive an instant push prompt on this phone to enter your 4-digit MoMo PIN.</span>
                </div>
              </div>
            )}

            {payChannel === "telecel" && (
              <div className="pfp-channel-box">
                <div className="pfp-field">
                  <label>Telecel Cash Phone Number:</label>
                  <input
                    type="tel"
                    value={telecelNumber}
                    onChange={(e) => setTelecelNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="pfp-field">
                  <label>Telecel Voucher Code (Dial *110#):</label>
                  <input
                    type="text"
                    value={telecelVoucher}
                    onChange={(e) => setTelecelVoucher(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {payChannel === "card" && (
              <div className="pfp-channel-box">
                <div className="pfp-field">
                  <label>Card Number (Visa / Mastercard):</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="pfp-form-row">
                  <div className="pfp-field">
                    <label>Expiry (MM/YY):</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      required
                    />
                  </div>
                  <div className="pfp-field">
                    <label>CVV / CVC:</label>
                    <input
                      type="password"
                      maxLength="4"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <button type="submit" className="pfp-btn-submit" disabled={isProcessing}>
              {isProcessing ? "Authorizing Payment..." : `🔒 Pay GH₵ ${Number(amountInput || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })} Now`}
            </button>
          </form>
        </div>

        {/* Bill Summary */}
        <div className="pfp-summary-card">
          <div className="pfp-sum-header">
            <span className="pfp-pill">FEE BALANCE SUMMARY</span>
            <h3>{child.fullName}</h3>
            <p>{child.classCohort} • Student ID: {child.id}</p>
          </div>

          <div className="pfp-sum-box">
            <div className="pfp-sum-row">
              <span>Gross Assessment:</span>
              <strong>GH₵ {targetInvoice ? targetInvoice.totalBilled.toLocaleString("en-US", { minimumFractionDigits: 2 }) : "8,600.00"}</strong>
            </div>
            <div className="pfp-sum-row">
              <span>Scholarship Waivers:</span>
              <strong style={{ color: "#34d399" }}>
                - GH₵ {targetInvoice ? targetInvoice.discountApplied.toLocaleString("en-US", { minimumFractionDigits: 2 }) : "1,000.00"}
              </strong>
            </div>
            <div className="pfp-sum-row net">
              <span>Net Term Bill:</span>
              <strong>GH₵ {targetInvoice ? targetInvoice.netAmount.toLocaleString("en-US", { minimumFractionDigits: 2 }) : "7,600.00"}</strong>
            </div>
            <div className="pfp-sum-row">
              <span>Amount Paid:</span>
              <strong style={{ color: "#34d399" }}>
                GH₵ {targetInvoice ? targetInvoice.amountPaid.toLocaleString("en-US", { minimumFractionDigits: 2 }) : "7,600.00"}
              </strong>
            </div>
            <div className="pfp-sum-row due">
              <span>Current Outstanding Balance:</span>
              <strong style={{ color: targetInvoice && targetInvoice.balanceDue > 0 ? "#f87171" : "#34d399" }}>
                GH₵ {targetInvoice ? targetInvoice.balanceDue.toLocaleString("en-US", { minimumFractionDigits: 2 }) : "0.00"}
              </strong>
            </div>
          </div>

          <div className="pfp-security-banner">
            <strong>🛡️ Bank of Ghana Certified Gateway</strong>
            <p>Direct integration with St. Michael's Academy Merchant Code 408819.</p>
          </div>
        </div>
      </div>

      {/* Processing Animation Modal */}
      {isProcessing && (
        <div className="pfp-overlay">
          <div className="pfp-process-box">
            <div className="pfp-spinner" />
            <h3>Processing Electronic Payment</h3>
            <p className="pfp-step-text">{processStep}</p>
            <small>Please keep this browser window open...</small>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {issuedReceipt && (
        <div className="pfp-overlay">
          <div className="pfp-receipt-box">
            <div className="pfp-receipt-check">✓</div>
            <h2>Payment Cleared Successfully!</h2>
            <p>Your payment has been officially credited and verified by the Chief Bursar.</p>

            <div className="pfp-receipt-details">
              <div><strong>Receipt Number:</strong> {issuedReceipt.receiptNumber}</div>
              <div><strong>Student Name:</strong> {issuedReceipt.studentName}</div>
              <div><strong>Transaction Ref:</strong> {issuedReceipt.transactionReference}</div>
              <div><strong>Payment Method:</strong> {issuedReceipt.paymentMethod}</div>
              <div><strong>Amount Paid:</strong> GH₵ {issuedReceipt.amountPaid.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
              <div><strong>Timestamp:</strong> {issuedReceipt.paymentDate}</div>
            </div>

            <div className="pfp-receipt-actions">
              <button className="pfp-btn-print-rec" onClick={() => window.print()}>
                🖨️ Print Receipt Voucher
              </button>
              <button className="pfp-btn-done" onClick={() => setIssuedReceipt(null)}>
                ✓ Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
