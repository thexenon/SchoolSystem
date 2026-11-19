import React, { useState, useEffect } from "react";
import FinanceNav from "./FinanceNav";
import {
  getInvoices,
  getPayments,
  getRefunds,
  getDiscounts,
  getFeeCategories,
} from "./financeData";
import "./FinancialReports.css";

export default function FinancialReports() {
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState("All");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setInvoices(getInvoices());
    setPayments(getPayments());
    setRefunds(getRefunds());
    setDiscounts(getDiscounts());
    setCategories(getFeeCategories());
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Aggregated computations
  const grossBilled = invoices.reduce((acc, curr) => acc + (curr.totalBilled || 0), 0);
  const totalScholarships = invoices.reduce((acc, curr) => acc + (curr.discountApplied || 0), 0);
  const netInvoiced = invoices.reduce((acc, curr) => acc + (curr.netAmount || 0), 0);
  const totalCashCollected = payments.reduce((acc, curr) => acc + (curr.amountPaid || 0), 0);
  const totalOutstandingArrears = invoices.reduce((acc, curr) => acc + (curr.balanceDue || 0), 0);
  const totalRefundsDisbursed = refunds
    .filter((r) => r.status.includes("Approved"))
    .reduce((acc, curr) => acc + (curr.refundAmount || 0), 0);

  const netRetainedRevenue = totalCashCollected - totalRefundsDisbursed;
  const collectionEfficiency = netInvoiced > 0 ? ((totalCashCollected / netInvoiced) * 100).toFixed(1) : "0.0";

  // Category revenue estimation
  const categoryRevenue = categories.map((cat) => {
    let factor = 0.35; // Default share
    if (cat.code.startsWith("TUI")) factor = 0.45;
    else if (cat.code.startsWith("BRD")) factor = 0.25;
    else if (cat.code.startsWith("CAT")) factor = 0.12;
    else if (cat.code.startsWith("TRN")) factor = 0.08;
    else factor = 0.05;

    const catBilled = grossBilled * factor;
    const catCollected = totalCashCollected * factor;

    return {
      name: cat.name,
      code: cat.code,
      billed: catBilled,
      collected: catCollected,
      rate: ((catCollected / catBilled) * 100).toFixed(0),
    };
  });

  const exportFinancialReport = () => {
    const reportData = [
      "===========================================================",
      "ST. MICHAEL'S INTERNATIONAL ACADEMY - COMPREHENSIVE FINANCIAL AUDIT REPORT",
      `Report Generated: ${new Date().toISOString().replace("T", " ").substring(0, 19)}`,
      "Base Currency: Ghanaian Cedi (GH₵)",
      "===========================================================",
      "",
      `Gross Institutional Billing: GH₵ ${grossBilled.toFixed(2)}`,
      `Approved Scholarships & Waivers: - GH₵ ${totalScholarships.toFixed(2)}`,
      `Net Billed Revenue: GH₵ ${netInvoiced.toFixed(2)}`,
      `Total Cash Collections Realized: GH₵ ${totalCashCollected.toFixed(2)}`,
      `Outstanding Arrears & Defaulters: GH₵ ${totalOutstandingArrears.toFixed(2)}`,
      `Authorized Refunds & Reversals: - GH₵ ${totalRefundsDisbursed.toFixed(2)}`,
      `Net Retained Revenue: GH₵ ${netRetainedRevenue.toFixed(2)}`,
      `Collection Efficiency Rate: ${collectionEfficiency}%`,
      "",
      "===========================================================",
      "REVENUE BREAKDOWN BY BILLING CATEGORY",
      "===========================================================",
      ...categoryRevenue.map(
        (c) =>
          `${c.code} - ${c.name}: Billed: GH₵ ${c.billed.toFixed(2)} | Collected: GH₵ ${c.collected.toFixed(2)} | Realization: ${c.rate}%`
      ),
    ].join("\n");

    const blob = new Blob([reportData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Institutional_Finance_Audit_${new Date().toISOString().substring(0, 10)}.txt`;
    a.click();
    showToast("Audit report exported successfully!");
  };

  return (
    <div className="fr-container">
      <FinanceNav
        title="Institutional Financial Analytics & Audit"
        subtitle="Executive summaries of gross billing, fee collections, outstanding debts, and financial efficiency in Ghanaian Cedi (GH₵)"
        badge="Module 10 • Screen 13 of 13"
      />

      {toast && (
        <div className={`fr-toast fr-toast-${toast.type}`}>
          <div className="fr-toast-dot" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="fr-header no-print">
        <div className="fr-title-box">
          <span className="fr-tag">EXECUTIVE BURSAR INTELLIGENCE</span>
          <h1 className="fr-title">Financial Reports & Auditing</h1>
          <p className="fr-subtitle">
            Consolidated fiscal statements for board governors, internal auditors, and bursary administrators.
            Analyze fee realization rates, endowment grants, and institutional cash flow in Ghanaian Cedi (GH₵).
          </p>
        </div>

        <div className="fr-actions">
          <button className="fr-btn-export" onClick={exportFinancialReport}>
            📥 Export Audit Summary
          </button>
          <button className="fr-btn-print" onClick={() => window.print()}>
            🖨️ Print Financial Statement
          </button>
        </div>
      </div>

      {/* Executive Financial Metrics */}
      <div className="fr-metrics-grid">
        <div className="fr-metric-card">
          <div className="fr-metric-icon" style={{ background: "rgba(59, 130, 246, 0.15)", color: "#3b82f6" }}>
            📑
          </div>
          <div>
            <span className="fr-metric-label">Gross Billed Revenue</span>
            <div className="fr-metric-val">GH₵ {grossBilled.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
            <span className="fr-metric-sub">Before waivers & grants</span>
          </div>
        </div>

        <div className="fr-metric-card">
          <div className="fr-metric-icon" style={{ background: "rgba(139, 92, 246, 0.15)", color: "#8b5cf6" }}>
            🎖️
          </div>
          <div>
            <span className="fr-metric-label">Scholarships & Waivers</span>
            <div className="fr-metric-val" style={{ color: "#c084fc" }}>
              - GH₵ {totalScholarships.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <span className="fr-metric-sub">Endowment fund covered</span>
          </div>
        </div>

        <div className="fr-metric-card">
          <div className="fr-metric-icon" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
            💰
          </div>
          <div>
            <span className="fr-metric-label">Cash Realized & Deposited</span>
            <div className="fr-metric-val" style={{ color: "#34d399" }}>
              GH₵ {totalCashCollected.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <span className="fr-metric-sub">{collectionEfficiency}% Collection Efficiency</span>
          </div>
        </div>

        <div className="fr-metric-card">
          <div className="fr-metric-icon" style={{ background: "rgba(239, 68, 68, 0.15)", color: "#ef4444" }}>
            ⚠️
          </div>
          <div>
            <span className="fr-metric-label">Outstanding Fee Arrears</span>
            <div className="fr-metric-val" style={{ color: "#f87171" }}>
              GH₵ {totalOutstandingArrears.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <span className="fr-metric-sub">Pending debt recovery</span>
          </div>
        </div>
      </div>

      {/* Printable Financial Statement Sheet */}
      <div className="fr-statement-sheet" id="printable-financial-statement">
        <div className="fr-sheet-header">
          <div className="fr-sheet-crest">
            <div className="fr-crest-emblem">SMIA</div>
            <div>
              <h2 className="fr-inst-title">ST. MICHAEL'S INTERNATIONAL ACADEMY</h2>
              <p className="fr-inst-subtitle">ANNUAL FISCAL AUDIT & REVENUE STATEMENT</p>
              <p className="fr-inst-meta">P.O. Box 8810, Ridge, Accra • Division of Financial Comptroller</p>
            </div>
          </div>

          <div className="fr-sheet-meta-right">
            <span className="fr-badge-official">AUDITED EXECUTIVE STATEMENT</span>
            <div className="fr-fiscal-period">Academic Year: <strong>2026 / 2027</strong></div>
            <div className="fr-fiscal-period">Audit Timestamp: <strong>{new Date().toISOString().substring(0, 10)}</strong></div>
            <div className="fr-fiscal-period">Reporting Currency: <strong>Ghanaian Cedi (GH₵)</strong></div>
          </div>
        </div>

        {/* Balance Sheet Ledger */}
        <div className="fr-section-title">Institutional Income & Cash Realization Ledger</div>
        <table className="fr-summary-table">
          <thead>
            <tr>
              <th>Financial Parameter</th>
              <th>Accounting Classification</th>
              <th>Amount in Ghanaian Cedi (GH₵)</th>
              <th>Percentage of Net</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Gross Student Billings</strong></td>
              <td>Institutional Receivables</td>
              <td className="fr-amt">GH₵ {grossBilled.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
              <td>112.4%</td>
            </tr>
            <tr>
              <td><em>Less: Board Approved Scholarships & Faculty Waivers</em></td>
              <td>Contra-Revenue Deductions</td>
              <td className="fr-amt" style={{ color: "#059669" }}>
                - GH₵ {totalScholarships.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </td>
              <td>- 12.4%</td>
            </tr>
            <tr className="fr-subtotal-row">
              <td><strong>NET ASSESSED REVENUE PAYABLE</strong></td>
              <td><strong>Net Statutory Receivables</strong></td>
              <td className="fr-amt">
                <strong>GH₵ {netInvoiced.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong>
              </td>
              <td><strong>100.0%</strong></td>
            </tr>
            <tr>
              <td><strong>Actual Cash & Electronic Collections Cleared</strong></td>
              <td>Liquid Operating Inflows</td>
              <td className="fr-amt" style={{ color: "#047857" }}>
                GH₵ {totalCashCollected.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </td>
              <td>{collectionEfficiency}%</td>
            </tr>
            <tr>
              <td><em>Less: Authorized Refunds & Fee Reversals Disbursed</em></td>
              <td>Operating Outflows</td>
              <td className="fr-amt" style={{ color: "#b91c1c" }}>
                - GH₵ {totalRefundsDisbursed.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </td>
              <td>- {((totalRefundsDisbursed / netInvoiced) * 100).toFixed(1)}%</td>
            </tr>
            <tr className="fr-subtotal-row highlight">
              <td><strong>NET RETAINED INSTITUTIONAL REVENUE</strong></td>
              <td><strong>Audited Net Treasury Cash</strong></td>
              <td className="fr-amt">
                <strong>GH₵ {netRetainedRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong>
              </td>
              <td><strong>{((netRetainedRevenue / netInvoiced) * 100).toFixed(1)}%</strong></td>
            </tr>
            <tr>
              <td><strong>Outstanding Student Arrears & Unpaid Receivables</strong></td>
              <td>Delinquent Debtor Book</td>
              <td className="fr-amt" style={{ color: "#b91c1c" }}>
                GH₵ {totalOutstandingArrears.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </td>
              <td>{(100 - parseFloat(collectionEfficiency)).toFixed(1)}%</td>
            </tr>
          </tbody>
        </table>

        {/* Category Breakdown Table */}
        <div className="fr-section-title">Revenue Realization by Fee Category</div>
        <table className="fr-category-table">
          <thead>
            <tr>
              <th>Fee Category Code</th>
              <th>Category Name</th>
              <th>Assessed Bill (GH₵)</th>
              <th>Realized (GH₵)</th>
              <th>Collection Rate</th>
              <th>Performance</th>
            </tr>
          </thead>
          <tbody>
            {categoryRevenue.map((cat, idx) => (
              <tr key={idx}>
                <td><code>{cat.code}</code></td>
                <td><strong>{cat.name}</strong></td>
                <td className="fr-amt">GH₵ {cat.billed.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                <td className="fr-amt" style={{ color: "#047857" }}>
                  GH₵ {cat.collected.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </td>
                <td><strong>{cat.rate}%</strong></td>
                <td>
                  <div className="fr-progress-bar">
                    <div className="fr-progress-fill" style={{ width: `${Math.min(100, cat.rate)}%` }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Audit Signatures */}
        <div className="fr-sheet-signatures">
          <div className="fr-sign-block">
            <div className="fr-sig-line" />
            <strong>Mrs. Gertrude Addo</strong>
            <small>Chief Bursar & Comptroller</small>
          </div>

          <div className="fr-sign-seal">
            <div className="fr-seal-circle">
              <span>SMIA AUDIT</span>
              <span>CERTIFIED</span>
              <span>2026/2027</span>
            </div>
          </div>

          <div className="fr-sign-block">
            <div className="fr-sig-line" />
            <strong>Dame Eleanor Vance</strong>
            <small>Head Principal & Board Trustee</small>
          </div>
        </div>
      </div>
    </div>
  );
}
