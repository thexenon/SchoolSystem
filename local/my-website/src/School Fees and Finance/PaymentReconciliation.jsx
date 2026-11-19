import React, { useState, useEffect } from "react";
import FinanceNav from "./FinanceNav";
import {
  getReconciliations,
  saveReconciliations,
  getPayments,
} from "./financeData";
import "./PaymentReconciliation.css";

export default function PaymentReconciliation() {
  const [accounts, setAccounts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState("ACC-03");
  const [toast, setToast] = useState(null);
  const [isAutoReconciling, setIsAutoReconciling] = useState(false);

  useEffect(() => {
    setAccounts(getReconciliations());
    setPayments(getPayments());
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId) || accounts[0];

  const handleRunAutoReconcile = () => {
    setIsAutoReconciling(true);
    showToast("Running automated transaction reference matching engine...", "info");

    setTimeout(() => {
      const updated = accounts.map((acc) => {
        if (acc.id === selectedAccountId) {
          return {
            ...acc,
            ledgerBalance: acc.bankStatementBalance,
            unreconciledDifference: 0.0,
            status: "Fully Balanced",
            lastReconciled: new Date().toISOString().replace("T", " ").substring(0, 16),
          };
        }
        return acc;
      });

      setAccounts(updated);
      saveReconciliations(updated);
      setIsAutoReconciling(false);
      showToast(
        `Auto-reconciliation complete for ${selectedAccount.accountName}! All batches matched & cleared.`,
        "success"
      );
    }, 1500);
  };

  const handleClearDiscrepancy = (accId) => {
    const updated = accounts.map((acc) => {
      if (acc.id === accId) {
        return {
          ...acc,
          ledgerBalance: acc.bankStatementBalance,
          unreconciledDifference: 0.0,
          status: "Fully Balanced",
          lastReconciled: new Date().toISOString().replace("T", " ").substring(0, 16),
        };
      }
      return acc;
    });
    setAccounts(updated);
    saveReconciliations(updated);
    showToast(`Discrepancy cleared for ${accId}! Account is now balanced.`);
  };

  const totalLedger = accounts.reduce((acc, curr) => acc + curr.ledgerBalance, 0);
  const totalBank = accounts.reduce((acc, curr) => acc + curr.bankStatementBalance, 0);
  const totalVariance = accounts.reduce((acc, curr) => acc + Math.abs(curr.unreconciledDifference), 0);

  return (
    <div className="pr-container">
      <FinanceNav
        title="Bank & Gateway Payment Reconciliation"
        subtitle="Match internal bursar ledgers against commercial bank statements and MoMo merchant feeds in Ghanaian Cedi (GH₵)"
        badge="Module 10 • Screen 12 of 13"
      />

      {toast && (
        <div className={`pr-toast pr-toast-${toast.type}`}>
          <div className="pr-toast-dot" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="pr-header">
        <div className="pr-title-box">
          <span className="pr-tag">FISCAL LEDGER AUDITING ENGINE</span>
          <h1 className="pr-title">Payment Reconciliation</h1>
          <p className="pr-subtitle">
            Reconcile institutional cash registers against GCB Bank statements, MTN Mobile Money merchant wallets,
            and Ecobank web payment settlement batches in Ghanaian Cedi (GH₵).
          </p>
        </div>

        <div className="pr-actions">
          <button
            className="pr-btn-auto-recon"
            onClick={handleRunAutoReconcile}
            disabled={isAutoReconciling}
          >
            {isAutoReconciling ? "⚙️ Matching Ref Feeds..." : "⚡ Run Auto-Reconcile Batch"}
          </button>
          <button className="pr-btn-print" onClick={() => window.print()}>
            🖨️ Print Audit Sheet
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="pr-kpi-grid">
        <div className="pr-kpi-card">
          <div className="pr-kpi-icon-wrap" style={{ background: "rgba(59, 130, 246, 0.15)", color: "#3b82f6" }}>
            📒
          </div>
          <div className="pr-kpi-body">
            <span className="pr-kpi-label">School Ledger Balance</span>
            <div className="pr-kpi-val">GH₵ {totalLedger.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
            <span className="pr-kpi-sub">Across 3 settlement accounts</span>
          </div>
        </div>

        <div className="pr-kpi-card">
          <div className="pr-kpi-icon-wrap" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
            🏦
          </div>
          <div className="pr-kpi-body">
            <span className="pr-kpi-label">Bank Statement Balance</span>
            <div className="pr-kpi-val">GH₵ {totalBank.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
            <span className="pr-kpi-sub">Verified bank credit feed</span>
          </div>
        </div>

        <div className="pr-kpi-card">
          <div className="pr-kpi-icon-wrap" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b" }}>
            ⚖️
          </div>
          <div className="pr-kpi-body">
            <span className="pr-kpi-label">Unreconciled Variance</span>
            <div className="pr-kpi-val" style={{ color: totalVariance > 0 ? "#fbbf24" : "#34d399" }}>
              GH₵ {totalVariance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <span className="pr-kpi-sub">{totalVariance > 0 ? "Pending batch clearing" : "100% Balanced"}</span>
          </div>
        </div>

        <div className="pr-kpi-card">
          <div className="pr-kpi-icon-wrap" style={{ background: "rgba(139, 92, 246, 0.15)", color: "#8b5cf6" }}>
            🛡️
          </div>
          <div className="pr-kpi-body">
            <span className="pr-kpi-label">Auditing Benchmark</span>
            <div className="pr-kpi-val">BOG / GhIPSS</div>
            <span className="pr-kpi-sub">Certified daily settlement</span>
          </div>
        </div>
      </div>

      {/* Settlement Accounts Grid */}
      <div className="pr-accounts-grid">
        {accounts.map((acc) => {
          const isSelected = selectedAccountId === acc.id;
          const isBalanced = acc.status === "Fully Balanced";
          return (
            <div
              key={acc.id}
              className={`pr-account-card ${isSelected ? "selected" : ""}`}
              onClick={() => setSelectedAccountId(acc.id)}
            >
              <div className="pr-acc-head">
                <span className="pr-acc-code">{acc.id}</span>
                <span className={`pr-acc-status ${isBalanced ? "balanced" : "attention"}`}>
                  {isBalanced ? "✓ Balanced" : "⚠️ Discrepancy"}
                </span>
              </div>

              <h3 className="pr-acc-name">{acc.accountName}</h3>
              <div className="pr-acc-bank">{acc.bankName} • {acc.accountNumber}</div>

              <div className="pr-acc-balances">
                <div>
                  <small>Internal Ledger:</small>
                  <strong>GH₵ {acc.ledgerBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong>
                </div>
                <div>
                  <small>Bank Statement:</small>
                  <strong>GH₵ {acc.bankStatementBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong>
                </div>
              </div>

              {acc.unreconciledDifference > 0 && (
                <div className="pr-acc-diff">
                  <span>Variance:</span>
                  <strong style={{ color: "#fbbf24" }}>
                    GH₵ {acc.unreconciledDifference.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </strong>
                </div>
              )}

              <div className="pr-acc-foot">
                <span className="pr-recon-date">Reconciled: {acc.lastReconciled}</span>
                {!isBalanced && (
                  <button
                    className="pr-btn-clear"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClearDiscrepancy(acc.id);
                    }}
                  >
                    Clear Match
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Side-by-Side Batch Ledger Audit */}
      {selectedAccount && (
        <div className="pr-audit-panel">
          <div className="pr-audit-panel-head">
            <div>
              <h3>Batch Audit: {selectedAccount.accountName}</h3>
              <p>Comparing school internal entries against {selectedAccount.bankName} statement stream.</p>
            </div>
            <div className="pr-audit-sync-status">
              Status: <span style={{ color: selectedAccount.status === "Fully Balanced" ? "#34d399" : "#fbbf24", fontWeight: 700 }}>{selectedAccount.status}</span>
            </div>
          </div>

          <div className="pr-side-by-side-grid">
            {/* School Ledger Side */}
            <div className="pr-side-box">
              <h4>Internal School Ledger Entries</h4>
              <div className="pr-side-list">
                {payments
                  .filter((p) => p.bankName.includes("MTN") || p.bankName.includes("GCB") || p.bankName.includes("Ecobank"))
                  .slice(0, 4)
                  .map((p) => (
                    <div key={p.id} className="pr-item-row">
                      <div>
                        <strong>{p.studentName}</strong>
                        <div className="pr-item-sub">{p.receiptNumber} • {p.transactionReference}</div>
                      </div>
                      <div className="pr-item-amt-box">
                        <span className="pr-item-amt">GH₵ {p.amountPaid.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                        <span className="pr-matched-pill">✓ Matched</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Bank Statement Side */}
            <div className="pr-side-box">
              <h4>Bank / Provider Settlement Feed</h4>
              <div className="pr-side-list">
                {payments
                  .filter((p) => p.bankName.includes("MTN") || p.bankName.includes("GCB") || p.bankName.includes("Ecobank"))
                  .slice(0, 4)
                  .map((p) => (
                    <div key={p.id} className="pr-item-row bank">
                      <div>
                        <strong>{selectedAccount.bankName} Wire Inward</strong>
                        <div className="pr-item-sub">Ref: {p.transactionReference} • Cleared</div>
                      </div>
                      <div className="pr-item-amt-box">
                        <span className="pr-item-amt" style={{ color: "#34d399" }}>
                          GH₵ {p.amountPaid.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </span>
                        <span className="pr-matched-pill">✓ Verified Deposit</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
