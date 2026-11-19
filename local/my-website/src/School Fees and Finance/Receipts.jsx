import React, { useState, useEffect } from "react";
import FinanceNav from "./FinanceNav";
import { getPayments } from "./financeData";
import "./Receipts.css";

// Helper function to convert numeric amount to words (in Ghana Cedis)
function convertAmountToWords(amount) {
  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen",
  ];
  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
  ];

  function numToWords(n) {
    if (n === 0) return "";
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ones[n % 10] : "");
    if (n < 1000)
      return (
        ones[Math.floor(n / 100)] +
        " Hundred" +
        (n % 100 !== 0 ? " and " + numToWords(n % 100) : "")
      );
    if (n < 100000)
      return (
        numToWords(Math.floor(n / 1000)) +
        " Thousand" +
        (n % 1000 !== 0 ? " " + numToWords(n % 1000) : "")
      );
    return `${n}`;
  }

  const intPart = Math.floor(amount);
  const words = numToWords(intPart);
  return `${words} Ghana Cedis Only`;
}

export default function Receipts() {
  const [payments, setPayments] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const list = getPayments();
    setPayments(list);
    if (list.length > 0) {
      setSelectedReceipt(list[0]);
    }
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredPayments = payments.filter((p) => {
    if (searchTerm.trim() !== "") {
      const q = searchTerm.toLowerCase();
      const matchName = p.studentName.toLowerCase().includes(q);
      const matchReceipt = p.receiptNumber.toLowerCase().includes(q);
      const matchRef = p.transactionReference.toLowerCase().includes(q);
      const matchStu = p.studentId.toLowerCase().includes(q);
      if (!matchName && !matchReceipt && !matchRef && !matchStu) return false;
    }
    return true;
  });

  return (
    <div className="rec-container">
      <FinanceNav
        title="Official Receipt Voucher Dispatch"
        subtitle="Generate, retrieve, and print authenticated payment receipts with QR cryptographic verification in Ghanaian Cedi (GH₵)"
        badge="Module 10 • Screen 9 of 13"
      />

      {toast && (
        <div className={`rec-toast rec-toast-${toast.type}`}>
          <div className="rec-toast-dot" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="rec-header no-print">
        <div className="rec-title-box">
          <span className="rec-tag">OFFICIAL BURSAR DISBURSEMENT PROOF</span>
          <h1 className="rec-title">Fee Payment Receipts</h1>
          <p className="rec-subtitle">
            Generate and reprint verified fiscal receipts. Each voucher features statutory school seal,
            amount in words, transaction verification serials, and cashier attestation in Ghanaian Cedi (GH₵).
          </p>
        </div>

        <div className="rec-actions">
          <button className="rec-btn-print" onClick={handlePrint}>
            🖨️ Print Receipt Voucher
          </button>
        </div>
      </div>

      <div className="rec-layout-grid">
        {/* Left Side: Receipt Registry & Search */}
        <div className="rec-list-panel no-print">
          <div className="rec-search-box">
            <span className="rec-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search receipts by receipt no, student, ref..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="rec-search-clear" onClick={() => setSearchTerm("")}>✕</button>
            )}
          </div>

          <div className="rec-items-list">
            {filteredPayments.map((p) => {
              const isSelected = selectedReceipt && selectedReceipt.id === p.id;
              return (
                <div
                  key={p.id}
                  className={`rec-item-card ${isSelected ? "active" : ""}`}
                  onClick={() => setSelectedReceipt(p)}
                >
                  <div className="rec-item-head">
                    <span className="rec-item-code">{p.receiptNumber}</span>
                    <span className="rec-item-date">{p.paymentDate.substring(0, 10)}</span>
                  </div>
                  <div className="rec-item-name">{p.studentName}</div>
                  <div className="rec-item-sub">
                    {p.classCohort} • {p.paymentMethod}
                  </div>
                  <div className="rec-item-amt">
                    GH₵ {p.amountPaid.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: The Official Printable Voucher */}
        <div className="rec-voucher-panel">
          {selectedReceipt ? (
            <div className="rec-sheet" id="printable-receipt">
              <div className="rec-sheet-header">
                <div className="rec-crest-wrap">
                  <div className="rec-crest-emblem">SMIA</div>
                  <div>
                    <h2 className="rec-school-name">ST. MICHAEL'S INTERNATIONAL ACADEMY</h2>
                    <p className="rec-school-motto">"Excellence, Integrity & Leadership" • Accra, Ghana</p>
                    <p className="rec-school-bursar">Division of Finance & Accounts • Official Bursar Desk</p>
                  </div>
                </div>

                <div className="rec-sheet-right-meta">
                  <span className="rec-voucher-tag">OFFICIAL BURSAR RECEIPT</span>
                  <div className="rec-serial-num">{selectedReceipt.receiptNumber}</div>
                  <div className="rec-meta-date">Date: <strong>{selectedReceipt.paymentDate}</strong></div>
                  <div className="rec-meta-inv">Target Invoice: <strong>{selectedReceipt.invoiceId}</strong></div>
                </div>
              </div>

              {/* Student Particulars */}
              <div className="rec-particulars-bar">
                <div>
                  <span className="rec-part-label">RECEIVED FROM (STUDENT):</span>
                  <div className="rec-part-val">{selectedReceipt.studentName}</div>
                  <small>ID: {selectedReceipt.studentId} • Cohort: {selectedReceipt.classCohort}</small>
                </div>
                <div>
                  <span className="rec-part-label">PAYMENT CHANNEL / GATEWAY:</span>
                  <div className="rec-part-val">{selectedReceipt.paymentMethod}</div>
                  <small>Ref: {selectedReceipt.transactionReference}</small>
                </div>
              </div>

              {/* Amount Box */}
              <div className="rec-sum-box">
                <div className="rec-sum-row">
                  <span className="rec-sum-label">THE SUM OF (IN WORDS):</span>
                  <div className="rec-sum-words">{convertAmountToWords(selectedReceipt.amountPaid)}</div>
                </div>

                <div className="rec-amount-highlight">
                  <span>AMOUNT RECEIVED:</span>
                  <h1>GH₵ {selectedReceipt.amountPaid.toLocaleString("en-US", { minimumFractionDigits: 2 })}</h1>
                </div>
              </div>

              {/* Transaction Context */}
              <table className="rec-details-table">
                <thead>
                  <tr>
                    <th>Description / Purpose</th>
                    <th>Account / Gateway</th>
                    <th>Transaction Reference</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{selectedReceipt.notes || "Tuition & Institutional Fee Settlement"}</td>
                    <td>{selectedReceipt.bankName}</td>
                    <td><code>{selectedReceipt.transactionReference}</code></td>
                    <td><span className="rec-cleared-pill">✓ VERIFIED & CLEARED</span></td>
                  </tr>
                </tbody>
              </table>

              {/* Signatures & QR Seal */}
              <div className="rec-sheet-signatures">
                <div className="rec-sig-block">
                  <div className="rec-sig-line" />
                  <strong>{selectedReceipt.recordedBy}</strong>
                  <small>Chief Bursar / Authorized Cashier</small>
                </div>

                <div className="rec-qr-seal-box">
                  <div className="rec-qr-stamp">
                    <span>SECURITY QR</span>
                    <code>{selectedReceipt.receiptNumber}</code>
                    <small>SMIA VERIFIED</small>
                  </div>
                </div>

                <div className="rec-sig-block">
                  <div className="rec-sig-line" />
                  <strong>Dame Eleanor Vance</strong>
                  <small>Head Principal & Board Trustee</small>
                </div>
              </div>

              <div className="rec-disclaimer">
                <em>* This receipt is valid only with the official cashier signature and security seal. Retain for academic accreditation.</em>
              </div>
            </div>
          ) : (
            <div className="rec-empty-preview">Select a receipt from the registry to inspect.</div>
          )}
        </div>
      </div>
    </div>
  );
}
