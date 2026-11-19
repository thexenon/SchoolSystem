import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ParentNav from "./ParentNav";
import {
  getActiveParent,
  LINKED_CHILDREN,
  getActiveChildId,
} from "./parentData";
import { getInvoices, getPayments } from "../School Fees and Finance/financeData";
import "./ParentFeeStatements.css";

export default function ParentFeeStatements() {
  const navigate = useNavigate();
  const parent = getActiveParent();
  const [activeChildId, setActiveChildId] = useState(getActiveChildId());

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
  const allPayments = getPayments();

  const childInvoices = allInvoices.filter((i) => i.studentId === child.id);
  const childPayments = allPayments.filter((p) => p.studentId === child.id);

  const totalBilled = childInvoices.reduce((acc, curr) => acc + curr.totalBilled, 0);
  const totalDiscounts = childInvoices.reduce((acc, curr) => acc + curr.discountApplied, 0);
  const totalNet = childInvoices.reduce((acc, curr) => acc + curr.netAmount, 0);
  const totalPaid = childPayments.reduce((acc, curr) => acc + curr.amountPaid, 0);
  const currentBalance = Math.max(0, totalNet - totalPaid);

  return (
    <div className="pfs-container">
      <ParentNav
        title="Student Fee Statements & Account Ledger"
        subtitle="Review billed tariffs, scholarship deductions, historical payments, and live outstanding balances in Ghanaian Cedi (GH₵)"
        badge="Module 11 • Screen 6 of 10"
      />

      {/* Header Banner */}
      <div className="pfs-header no-print">
        <div className="pfs-title-box">
          <span className="pfs-tag">BURSARY FINANCIAL LEDGER</span>
          <h1 className="pfs-title">{child.fullName}'s Fee Statement</h1>
          <p className="pfs-subtitle">
            Transparent statement of fees assessed and cleared for Academic Year 2026/2027.
            Payments are credited in real time via Bank of Ghana and MTN Mobile Money networks.
          </p>
        </div>

        <div className="pfs-actions">
          {currentBalance > 0 && (
            <button
              className="pfs-btn-pay-momo"
              onClick={() => navigate("/parent-fee-payment")}
            >
              📱 Settle Arrears via MoMo (GH₵ {currentBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })})
            </button>
          )}
          <button className="pfs-btn-print" onClick={() => window.print()}>
            🖨️ Print Statement
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="pfs-kpi-grid no-print">
        <div className="pfs-kpi-card">
          <div className="pfs-kpi-icon-wrap" style={{ background: "rgba(59, 130, 246, 0.15)", color: "#3b82f6" }}>
            📑
          </div>
          <div>
            <span className="pfs-kpi-label">Gross Assessed Bill</span>
            <div className="pfs-kpi-val">GH₵ {totalBilled.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
            <span className="pfs-kpi-sub">Term 1, 2026/2027</span>
          </div>
        </div>

        <div className="pfs-kpi-card">
          <div className="pfs-kpi-icon-wrap" style={{ background: "rgba(139, 92, 246, 0.15)", color: "#8b5cf6" }}>
            🎖️
          </div>
          <div>
            <span className="pfs-kpi-label">Approved Scholarships</span>
            <div className="pfs-kpi-val" style={{ color: "#c084fc" }}>
              - GH₵ {totalDiscounts.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <span className="pfs-kpi-sub">Endowment Merit Award</span>
          </div>
        </div>

        <div className="pfs-kpi-card">
          <div className="pfs-kpi-icon-wrap" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
            ✓
          </div>
          <div>
            <span className="pfs-kpi-label">Total Amount Paid</span>
            <div className="pfs-kpi-val" style={{ color: "#34d399" }}>
              GH₵ {totalPaid.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <span className="pfs-kpi-sub">Verified & Audited</span>
          </div>
        </div>

        <div className="pfs-kpi-card">
          <div className="pfs-kpi-icon-wrap" style={{ background: "rgba(239, 68, 68, 0.15)", color: "#ef4444" }}>
            ⚖️
          </div>
          <div>
            <span className="pfs-kpi-label">Balance Due</span>
            <div className="pfs-kpi-val" style={{ color: currentBalance > 0 ? "#f87171" : "#34d399" }}>
              GH₵ {currentBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <span className="pfs-kpi-sub">{currentBalance === 0 ? "Account in Good Standing" : "Payment Required"}</span>
          </div>
        </div>
      </div>

      {/* Printable Statement Sheet */}
      <div className="pfs-statement-sheet" id="printable-parent-statement">
        <div className="pfs-sheet-top">
          <div className="pfs-crest-area">
            <div className="pfs-crest-icon">SMIA</div>
            <div>
              <h2 className="pfs-school-title">ST. MICHAEL'S INTERNATIONAL ACADEMY</h2>
              <p className="pfs-school-sub">Office of the Chief Bursar • Student Billing Services</p>
              <p className="pfs-school-loc">Ridge Residential Area, Accra • Tel: +233 30 200 4488</p>
            </div>
          </div>

          <div className="pfs-sheet-meta-right">
            <span className="pfs-statement-badge">PARENT STATEMENT OF ACCOUNT</span>
            <div className="pfs-meta-date">Date: <strong>{new Date().toISOString().substring(0, 10)}</strong></div>
            <div className="pfs-meta-currency">Currency: <strong>Ghanaian Cedi (GH₵)</strong></div>
          </div>
        </div>

        {/* Student & Guardian Particulars */}
        <div className="pfs-particulars-grid">
          <div>
            <span className="pfs-box-label">STUDENT DETAILS:</span>
            <div className="pfs-box-name">{child.fullName}</div>
            <small>ID: {child.id} • Class: {child.classCohort} • Roll: {child.rollNumber}</small>
          </div>
          <div>
            <span className="pfs-box-label">PARENT / BILLING GUARDIAN:</span>
            <div className="pfs-box-name">{parent.fullName}</div>
            <small>{parent.phone} • {parent.email}</small>
          </div>
        </div>

        {/* Invoices List */}
        <div className="pfs-section-title">Term Invoices Assessed</div>
        <table className="pfs-table">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Billing Term</th>
              <th>Due Date</th>
              <th>Gross Amount</th>
              <th>Scholarship / Waiver</th>
              <th>Net Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {childInvoices.map((inv) => (
              <tr key={inv.id}>
                <td><code>{inv.id}</code></td>
                <td><strong>{inv.term}</strong></td>
                <td>{inv.dueDate}</td>
                <td className="pfs-amt">GH₵ {inv.totalBilled.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                <td className="pfs-amt" style={{ color: "#047857" }}>
                  {inv.discountApplied > 0 ? `- GH₵ ${inv.discountApplied.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "—"}
                </td>
                <td className="pfs-amt" style={{ fontWeight: 800 }}>
                  GH₵ {inv.netAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </td>
                <td>
                  <span className={`pfs-status-pill ${inv.paymentStatus === "Paid in Full" ? "paid" : "unpaid"}`}>
                    {inv.paymentStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Payments Made */}
        <div className="pfs-section-title">Verified Payment Receipts</div>
        <table className="pfs-table">
          <thead>
            <tr>
              <th>Receipt Number</th>
              <th>Payment Channel</th>
              <th>Transaction Reference</th>
              <th>Posting Date</th>
              <th>Amount Paid</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {childPayments.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", color: "#64748b", padding: "20px" }}>
                  No payment transactions recorded yet for this student.
                </td>
              </tr>
            ) : (
              childPayments.map((p) => (
                <tr key={p.id}>
                  <td><strong style={{ color: "#0284c7" }}>{p.receiptNumber}</strong></td>
                  <td>{p.paymentMethod}</td>
                  <td><code>{p.transactionReference}</code></td>
                  <td>{p.paymentDate}</td>
                  <td className="pfs-amt" style={{ color: "#047857", fontWeight: 800 }}>
                    GH₵ {p.amountPaid.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                  <td><span className="pfs-status-pill paid">✓ Cleared</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Summary Balance */}
        <div className="pfs-summary-box">
          <div className="pfs-sum-row">
            <span>Net Assessed Fees:</span>
            <strong>GH₵ {totalNet.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong>
          </div>
          <div className="pfs-sum-row">
            <span>Total Payments Cleared:</span>
            <strong style={{ color: "#047857" }}>GH₵ {totalPaid.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong>
          </div>
          <div className="pfs-sum-row balance">
            <span>CURRENT OUTSTANDING BALANCE:</span>
            <strong style={{ color: currentBalance > 0 ? "#b91c1c" : "#047857", fontSize: "1.15rem" }}>
              GH₵ {currentBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </strong>
          </div>
        </div>

        {/* Footer */}
        <div className="pfs-sheet-footer">
          <div className="pfs-bank-guide">
            <small><strong>Payment Channels:</strong> MTN Mobile Money Merchant Code: <strong>408819</strong> • GCB Bank High Street A/C: <strong>1011400293811</strong></small>
          </div>
          <div className="pfs-sign">
            <strong>Mrs. Gertrude Addo</strong>
            <small>Chief Bursar & Comptroller</small>
          </div>
        </div>
      </div>
    </div>
  );
}
