import React, { useState, useEffect } from "react";
import FinanceNav from "./FinanceNav";
import {
  getInvoices,
  saveInvoices,
  getPayments,
  savePayments,
} from "./financeData";
import "./OnlinePayment.css";

export default function OnlinePayment() {
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState("");
  const [payChannel, setPayChannel] = useState("momo"); // 'momo', 'telecel', 'card'
  const [amountToPay, setAmountToPay] = useState("");
  const [toast, setToast] = useState(null);

  // Form Fields - MoMo
  const [momoNumber, setMomoNumber] = useState("0249901122");
  const [momoName, setMomoName] = useState("Dmitri Rostov");

  // Form Fields - Telecel
  const [telecelNumber, setTelecelNumber] = useState("0208823344");
  const [telecelVoucher, setTelecelVoucher] = useState("889124");

  // Form Fields - Card
  const [cardNumber, setCardNumber] = useState("4111 2222 3333 4444");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvv, setCardCvv] = useState("882");
  const [cardName, setCardName] = useState("Dmitri Rostov");

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState("");
  const [successReceipt, setSuccessReceipt] = useState(null);

  useEffect(() => {
    const inv = getInvoices();
    const p = getPayments();
    setInvoices(inv);
    setPayments(p);

    const firstDue = inv.find((i) => i.balanceDue > 0);
    if (firstDue) {
      setSelectedInvoiceId(firstDue.id);
      setAmountToPay(firstDue.balanceDue);
      setMomoName(firstDue.guardianName);
      setCardName(firstDue.guardianName);
    } else if (inv.length > 0) {
      setSelectedInvoiceId(inv[0].id);
      setAmountToPay(inv[0].balanceDue);
    }
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSelectInvoice = (e) => {
    const invId = e.target.value;
    setSelectedInvoiceId(invId);
    const inv = invoices.find((i) => i.id === invId);
    if (inv) {
      setAmountToPay(inv.balanceDue > 0 ? inv.balanceDue : 500);
      setMomoName(inv.guardianName);
      setCardName(inv.guardianName);
    }
  };

  const currentInv = invoices.find((i) => i.id === selectedInvoiceId);

  const handlePayNow = (e) => {
    e.preventDefault();
    if (!currentInv) return;

    const payVal = parseFloat(amountToPay);
    if (isNaN(payVal) || payVal <= 0) {
      showToast("Payment amount must be greater than GH₵ 0.00", "error");
      return;
    }

    setIsProcessing(true);
    setProcessStep("Initiating secure gateway handshake with Bank of Ghana rails...");

    setTimeout(() => {
      if (payChannel === "momo") {
        setProcessStep(`Prompting MTN Mobile Money PIN verification on handset ${momoNumber}...`);
      } else if (payChannel === "telecel") {
        setProcessStep(`Validating Telecel Cash voucher code ${telecelVoucher}...`);
      } else {
        setProcessStep("Authenticating 3D Secure Verified by Visa / Mastercard OTP token...");
      }

      setTimeout(() => {
        setProcessStep("Payment authorized! Crediting St. Michael's Bursary institutional ledger...");

        setTimeout(() => {
          setIsProcessing(false);

          let channelName = "MTN Mobile Money";
          let refCode = `MM-GH-${Date.now().toString().slice(-10)}`;
          let bankGateway = "MTN MoMo Gateway (Code: 408819)";

          if (payChannel === "telecel") {
            channelName = "Vodafone Cash (Telecel)";
            refCode = `TC-GH-${Date.now().toString().slice(-10)}`;
            bankGateway = "Telecel Cash Gateway";
          } else if (payChannel === "card") {
            channelName = "Online Card Gateway (Visa)";
            refCode = `CC-GH-${Date.now().toString().slice(-10)}`;
            bankGateway = "Ecobank Web Checkout";
          }

          const newReceiptNo = `REC-GH-2026-${String(8800 + payments.length + 1)}`;
          const newPayment = {
            id: `PAY-2026-${String(payments.length + 1).padStart(3, "0")}`,
            receiptNumber: newReceiptNo,
            invoiceId: currentInv.id,
            studentId: currentInv.studentId,
            studentName: currentInv.studentName,
            classCohort: currentInv.classCohort,
            amountPaid: payVal,
            currency: "GH₵",
            paymentMethod: channelName,
            transactionReference: refCode,
            bankName: bankGateway,
            paymentDate: new Date().toISOString().replace("T", " ").substring(0, 16),
            recordedBy: "Automated Online Gateway",
            status: "Verified & Cleared",
            notes: `Instant digital portal checkout by guardian ${currentInv.guardianName}.`,
          };

          const newPaidTotal = (currentInv.amountPaid || 0) + payVal;
          const newBal = Math.max(0, currentInv.netAmount - newPaidTotal);
          const newStatus = newBal === 0 ? "Paid in Full" : "Partial Payment";

          const updatedInvoices = invoices.map((i) =>
            i.id === currentInv.id
              ? {
                  ...i,
                  amountPaid: newPaidTotal,
                  balanceDue: newBal,
                  paymentStatus: newStatus,
                  lastPaymentDate: new Date().toISOString().substring(0, 10),
                }
              : i
          );

          const updatedPayments = [newPayment, ...payments];

          setInvoices(updatedInvoices);
          setPayments(updatedPayments);
          saveInvoices(updatedInvoices);
          savePayments(updatedPayments);

          showToast("Payment successful! Receipt voucher generated.");
          setSuccessReceipt(newPayment);
        }, 1200);
      }, 1500);
    }, 1200);
  };

  return (
    <div className="op-container">
      <FinanceNav
        title="Electronic Payment Gateway & Web Checkout"
        subtitle="Secure parent and guardian online fee settlement supporting MTN MoMo, Telecel Cash, and Bank Cards in Ghanaian Cedi (GH₵)"
        badge="Module 10 • Screen 11 of 13"
      />

      {toast && (
        <div className={`op-toast op-toast-${toast.type}`}>
          <div className="op-toast-dot" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="op-header">
        <div className="op-title-box">
          <span className="op-tag">DIGITAL FEE SETTLEMENT TERMINAL</span>
          <h1 className="op-title">Online Fee Payment Portal</h1>
          <p className="op-subtitle">
            Pay term fees instantly from any smartphone or computer. Instant clearance, real-time ledger updates,
            and immediate downloadable official PDF receipts in Ghanaian Cedi (GH₵).
          </p>
        </div>
      </div>

      <div className="op-layout-grid">
        {/* Left Side: Payment Form & Gateway Selection */}
        <div className="op-checkout-card">
          <h2 className="op-card-title">Select Fee Bill & Payment Channel</h2>

          {/* Invoice Selector */}
          <div className="op-field">
            <label>Student Invoice to Settle:</label>
            <select value={selectedInvoiceId} onChange={handleSelectInvoice} className="op-select">
              {invoices.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.studentName} ({inv.studentId}) — {inv.classCohort} — Net: GH₵ {inv.netAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })} (Balance: GH₵ {inv.balanceDue.toLocaleString("en-US", { minimumFractionDigits: 2 })})
                </option>
              ))}
            </select>
          </div>

          {/* Channel Tabs */}
          <div className="op-channel-tabs">
            <button
              type="button"
              className={`op-tab-btn ${payChannel === "momo" ? "active" : ""}`}
              onClick={() => setPayChannel("momo")}
            >
              <span className="op-tab-icon">🟡</span>
              <div>
                <strong>MTN MoMo</strong>
                <small>Instant Mobile Money</small>
              </div>
            </button>

            <button
              type="button"
              className={`op-tab-btn ${payChannel === "telecel" ? "active" : ""}`}
              onClick={() => setPayChannel("telecel")}
            >
              <span className="op-tab-icon">🔴</span>
              <div>
                <strong>Telecel Cash</strong>
                <small>Vodafone Cash</small>
              </div>
            </button>

            <button
              type="button"
              className={`op-tab-btn ${payChannel === "card" ? "active" : ""}`}
              onClick={() => setPayChannel("card")}
            >
              <span className="op-tab-icon">💳</span>
              <div>
                <strong>Bank Card</strong>
                <small>Visa / Mastercard</small>
              </div>
            </button>
          </div>

          <form onSubmit={handlePayNow} className="op-form">
            <div className="op-field">
              <label>Amount to Pay (Ghanaian Cedi):</label>
              <div className="op-currency-input">
                <span>GH₵</span>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  value={amountToPay}
                  onChange={(e) => setAmountToPay(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* MTN MoMo Form */}
            {payChannel === "momo" && (
              <div className="op-channel-fields">
                <div className="op-field">
                  <label>MTN Mobile Money Phone Number:</label>
                  <input
                    type="tel"
                    placeholder="024 XXX XXXX"
                    value={momoNumber}
                    onChange={(e) => setMomoNumber(e.target.value)}
                    required
                  />
                  <span className="op-hint">A payment prompt will pop up on your phone to approve with your 4-digit MoMo PIN.</span>
                </div>

                <div className="op-field">
                  <label>Registered Account Name:</label>
                  <input
                    type="text"
                    value={momoName}
                    onChange={(e) => setMomoName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {/* Telecel Form */}
            {payChannel === "telecel" && (
              <div className="op-channel-fields">
                <div className="op-field">
                  <label>Telecel Cash Phone Number:</label>
                  <input
                    type="tel"
                    placeholder="020 XXX XXXX"
                    value={telecelNumber}
                    onChange={(e) => setTelecelNumber(e.target.value)}
                    required
                  />
                </div>

                <div className="op-field">
                  <label>Telecel Payment Voucher Code (*110#):</label>
                  <input
                    type="text"
                    placeholder="e.g. 889124"
                    value={telecelVoucher}
                    onChange={(e) => setTelecelVoucher(e.target.value)}
                    required
                  />
                  <span className="op-hint">Dial *110# on your Telecel line and choose 'Generate Voucher'</span>
                </div>
              </div>
            )}

            {/* Card Form */}
            {payChannel === "card" && (
              <div className="op-channel-fields">
                <div className="op-field">
                  <label>Cardholder Name:</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    required
                  />
                </div>

                <div className="op-field">
                  <label>Debit / Credit Card Number:</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                  />
                </div>

                <div className="op-form-row">
                  <div className="op-field">
                    <label>Expiry Date:</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      required
                    />
                  </div>
                  <div className="op-field">
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

            <button type="submit" className="op-btn-pay" disabled={isProcessing}>
              {isProcessing ? "Processing Authorization..." : `🔒 Pay GH₵ ${Number(amountToPay || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })} Now`}
            </button>
          </form>
        </div>

        {/* Right Side: Invoice Particulars & Security Badges */}
        <div className="op-summary-card">
          {currentInv ? (
            <div>
              <div className="op-bill-badge">TARGET INVOICE PARTICULARS</div>
              <h3 className="op-stu-name">{currentInv.studentName}</h3>
              <p className="op-stu-info">{currentInv.studentId} • {currentInv.classCohort}</p>

              <div className="op-inv-details">
                <div className="op-inv-row">
                  <span>Gross Invoice Total:</span>
                  <strong>GH₵ {currentInv.totalBilled.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong>
                </div>
                <div className="op-inv-row">
                  <span>Scholarships / Concessions:</span>
                  <strong style={{ color: "#34d399" }}>
                    - GH₵ {currentInv.discountApplied.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </strong>
                </div>
                <div className="op-inv-row net">
                  <span>Net Payable Bill:</span>
                  <strong>GH₵ {currentInv.netAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong>
                </div>
                <div className="op-inv-row">
                  <span>Amount Previously Cleared:</span>
                  <strong style={{ color: "#34d399" }}>
                    GH₵ {currentInv.amountPaid.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </strong>
                </div>
                <div className="op-inv-row balance">
                  <span>Current Outstanding Balance:</span>
                  <strong style={{ color: currentInv.balanceDue > 0 ? "#f87171" : "#34d399" }}>
                    GH₵ {currentInv.balanceDue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </strong>
                </div>
              </div>

              <div className="op-security-box">
                <div className="op-sec-title">🔐 256-Bit Bank Grade Encryption</div>
                <p>
                  Transactions are routed through Bank of Ghana authorized GhIPSS gateways.
                  No card PINs or MoMo secret codes are ever stored on academy servers.
                </p>
                <div className="op-badges-row">
                  <span>🛡️ GhIPSS Verified</span>
                  <span>🔒 PCI-DSS Compliant</span>
                  <span>⚡ Instant Clearance</span>
                </div>
              </div>
            </div>
          ) : (
            <div>No invoice loaded.</div>
          )}
        </div>
      </div>

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="op-overlay">
          <div className="op-process-box">
            <div className="op-spinner" />
            <h3>Processing Electronic Payment</h3>
            <p className="op-step-text">{processStep}</p>
            <small>Do not refresh or close this browser window...</small>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {successReceipt && (
        <div className="op-overlay">
          <div className="op-success-box">
            <div className="op-success-icon">✓</div>
            <h2>Payment Successful!</h2>
            <p>Your electronic transaction has cleared and credited against invoice {successReceipt.invoiceId}.</p>

            <div className="op-receipt-summary">
              <div><strong>Receipt Number:</strong> {successReceipt.receiptNumber}</div>
              <div><strong>Transaction Ref:</strong> {successReceipt.transactionReference}</div>
              <div><strong>Student Name:</strong> {successReceipt.studentName}</div>
              <div><strong>Channel:</strong> {successReceipt.paymentMethod}</div>
              <div><strong>Amount Paid:</strong> GH₵ {successReceipt.amountPaid.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
              <div><strong>Timestamp:</strong> {successReceipt.paymentDate}</div>
            </div>

            <div className="op-success-actions">
              <button className="op-btn-print-rec" onClick={() => window.print()}>
                🖨️ Print Receipt Voucher
              </button>
              <button className="op-btn-close-succ" onClick={() => setSuccessReceipt(null)}>
                ✓ Done / Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
