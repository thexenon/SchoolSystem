import React, { useState, useEffect } from "react";
import FinanceNav from "./FinanceNav";
import { getInvoices, getPayments, getDiscounts } from "./financeData";
import "./FeeStatements.css";

export default function FeeStatements() {
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const inv = getInvoices();
    const pay = getPayments();
    const disc = getDiscounts();
    setInvoices(inv);
    setPayments(pay);
    setDiscounts(disc);
    if (inv.length > 0) {
      setSelectedStudentId(inv[0].studentId);
    }
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handlePrint = () => {
    window.print();
  };

  // Find target student's invoices, payments, and discounts
  const studentInvoices = invoices.filter((i) => i.studentId === selectedStudentId);
  const studentPayments = payments.filter((p) => p.studentId === selectedStudentId);
  const studentDiscounts = discounts.filter((d) => d.studentId === selectedStudentId);

  const currentInvoice = studentInvoices[0] || null;

  // Build unified chronological ledger
  const ledgerEntries = [];

  studentInvoices.forEach((inv) => {
    ledgerEntries.push({
      date: inv.billingDate,
      ref: inv.id,
      type: "Debit",
      desc: `Term Tuition & Comprehensive Billing (${inv.term})`,
      debit: inv.totalBilled,
      credit: 0,
    });

    if (inv.discountApplied > 0) {
      ledgerEntries.push({
        date: inv.billingDate,
        ref: `DISC-${inv.id}`,
        type: "Credit",
        desc: "Institutional Scholarship / Approved Fee Concession",
        debit: 0,
        credit: inv.discountApplied,
      });
    }
  });

  studentPayments.forEach((p) => {
    ledgerEntries.push({
      date: p.paymentDate.substring(0, 10),
      ref: p.receiptNumber,
      type: "Credit",
      desc: `Fee Settlement via ${p.paymentMethod} (Ref: ${p.transactionReference})`,
      debit: 0,
      credit: p.amountPaid,
    });
  });

  // Sort chronological
  ledgerEntries.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Compute running balances
  let running = 0;
  const computedLedger = ledgerEntries.map((e) => {
    running = running + e.debit - e.credit;
    return {
      ...e,
      balance: running,
    };
  });

  const totalDebited = studentInvoices.reduce((acc, curr) => acc + (curr.totalBilled || 0), 0);
  const totalCredited =
    studentPayments.reduce((acc, curr) => acc + (curr.amountPaid || 0), 0) +
    studentInvoices.reduce((acc, curr) => acc + (curr.discountApplied || 0), 0);
  const currentNetBalance = Math.max(0, totalDebited - totalCredited);

  return (
    <div className="fst-container">
      <FinanceNav
        title="Student Statement of Account"
        subtitle="Individual student financial ledger showing debits, credits, running balances, and audit history in Ghanaian Cedi (GH₵)"
        badge="Module 10 • Screen 6 of 13"
      />

      {toast && (
        <div className={`fst-toast fst-toast-${toast.type}`}>
          <div className="fst-toast-dot" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="fst-header no-print">
        <div className="fst-title-box">
          <span className="fst-tag">STUDENT FINANCIAL LEDGER</span>
          <h1 className="fst-title">Fee Statements & Balances</h1>
          <p className="fst-subtitle">
            Generate and print official running statements of accounts. Track term billings, payments received,
            scholarship deductions, and live outstanding balances in Ghanaian Cedi (GH₵).
          </p>
        </div>

        <div className="fst-actions">
          <button className="fst-btn-print" onClick={handlePrint}>
            🖨️ Print Statement
          </button>
        </div>
      </div>

      {/* Student Selector Bar */}
      <div className="fst-selector-card no-print">
        <label>Select Student to View Statement of Account:</label>
        <select
          value={selectedStudentId}
          onChange={(e) => setSelectedStudentId(e.target.value)}
          className="fst-select"
        >
          {invoices.map((inv) => (
            <option key={inv.id} value={inv.studentId}>
              {inv.studentName} ({inv.studentId}) — {inv.classCohort} — Balance: GH₵ {inv.balanceDue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </option>
          ))}
        </select>
      </div>

      {currentInvoice && (
        <div className="fst-sheet" id="printable-statement">
          {/* Statement Header */}
          <div className="fst-sheet-top">
            <div className="fst-crest-area">
              <div className="fst-crest-icon">SMIA</div>
              <div>
                <h2 className="fst-inst-name">ST. MICHAEL'S INTERNATIONAL ACADEMY</h2>
                <p className="fst-inst-sub">Office of the Chief Bursar • Division of Financial Services</p>
                <p className="fst-inst-loc">P.O. Box 8810, Ridge, Accra, Ghana • Tel: +233 30 200 4488</p>
              </div>
            </div>

            <div className="fst-meta-box">
              <span className="fst-meta-badge">OFFICIAL STATEMENT OF ACCOUNT</span>
              <div className="fst-statement-date">
                Date: <strong>{new Date().toISOString().substring(0, 10)}</strong>
              </div>
              <div className="fst-currency-text">Base Currency: <strong>Ghanaian Cedi (GH₵)</strong></div>
            </div>
          </div>

          {/* Student Particulars Bar */}
          <div className="fst-particulars-grid">
            <div className="fst-part-box">
              <span className="fst-part-label">STUDENT DETAILS:</span>
              <div className="fst-student-name">{currentInvoice.studentName}</div>
              <div><strong>Student ID:</strong> {currentInvoice.studentId}</div>
              <div><strong>Class Cohort:</strong> {currentInvoice.classCohort}</div>
              <div><strong>Roll Number:</strong> {currentInvoice.rollNumber}</div>
            </div>

            <div className="fst-part-box">
              <span className="fst-part-label">GUARDIAN & BILLING PARTICULARS:</span>
              <div className="fst-student-name">{currentInvoice.guardianName}</div>
              <div><strong>Phone Number:</strong> {currentInvoice.guardianPhone}</div>
              <div><strong>Email:</strong> {currentInvoice.guardianEmail}</div>
              <div><strong>Standing:</strong> <span className={currentNetBalance > 0 ? "fst-arrears" : "fst-cleared"}>{currentNetBalance > 0 ? "Outstanding Debt" : "Account in Good Standing"}</span></div>
            </div>
          </div>

          {/* KPI Summary Strip */}
          <div className="fst-kpi-strip">
            <div className="fst-kpi-pill">
              <span>Total Invoiced</span>
              <strong>GH₵ {totalDebited.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong>
            </div>
            <div className="fst-kpi-pill">
              <span>Total Credits / Paid</span>
              <strong style={{ color: "#34d399" }}>
                GH₵ {totalCredited.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </strong>
            </div>
            <div className="fst-kpi-pill">
              <span>Scholarships Applied</span>
              <strong>
                GH₵ {currentInvoice.discountApplied.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </strong>
            </div>
            <div className="fst-kpi-pill balance">
              <span>Current Balance Due</span>
              <strong style={{ color: currentNetBalance > 0 ? "#ef4444" : "#10b981" }}>
                GH₵ {currentNetBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </strong>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="fst-ledger-card">
            <table className="fst-table">
              <thead>
                <tr>
                  <th>Posting Date</th>
                  <th>Reference</th>
                  <th>Transaction Description</th>
                  <th>Debit (Billed GH₵)</th>
                  <th>Credit (Paid GH₵)</th>
                  <th>Running Balance (GH₵)</th>
                </tr>
              </thead>
              <tbody>
                {computedLedger.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="fst-empty">No transactions recorded for this account.</td>
                  </tr>
                ) : (
                  computedLedger.map((entry, idx) => (
                    <tr key={idx} className="fst-row">
                      <td>{entry.date}</td>
                      <td>
                        <span className="fst-ref-badge">{entry.ref}</span>
                      </td>
                      <td>
                        <strong className="fst-desc-text">{entry.desc}</strong>
                      </td>
                      <td className="fst-amt">
                        {entry.debit > 0
                          ? `GH₵ ${entry.debit.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                          : "—"}
                      </td>
                      <td className="fst-amt" style={{ color: entry.credit > 0 ? "#10b981" : "#94a3b8" }}>
                        {entry.credit > 0
                          ? `GH₵ ${entry.credit.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                          : "—"}
                      </td>
                      <td className="fst-amt fst-run-bal">
                        GH₵ {entry.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Settlement Guidelines & Stamp */}
          <div className="fst-sheet-footer">
            <div className="fst-bank-info">
              <h4>SETTLEMENT INSTRUCTIONS & MOBILE MONEY:</h4>
              <p>• Official MTN MoMo Merchant Code: <strong>408819</strong> (St. Michaels Academy)</p>
              <p>• GCB Bank High Street Account: <strong>1011400293811</strong></p>
              <p><em>* Always quote Student ID <strong>{currentInvoice.studentId}</strong> on bank deposit slips.</em></p>
            </div>

            <div className="fst-sign-block">
              <div className="fst-sign-line" />
              <span>Mrs. Gertrude Addo</span>
              <small>Chief Bursar & Comptroller</small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
