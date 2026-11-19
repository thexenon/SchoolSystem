import React, { useState, useEffect } from "react";
import FinanceNav from "./FinanceNav";
import {
  getDiscounts,
  saveDiscounts,
  getInvoices,
  saveInvoices,
} from "./financeData";
import "./DiscountsAndScholarships.css";

export default function DiscountsAndScholarships() {
  const [discounts, setDiscounts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [scholarshipName, setScholarshipName] = useState("");
  const [discountType, setDiscountType] = useState("Fixed Amount");
  const [amountValue, setAmountValue] = useState("");
  const [academicYear, setAcademicYear] = useState("2026/2027");
  const [categoryApplied, setCategoryApplied] = useState("Tuition & Instruction");
  const [justification, setJustification] = useState("");
  const [principalPin, setPrincipalPin] = useState("Admin@2026");

  useEffect(() => {
    const d = getDiscounts();
    const inv = getInvoices();
    setDiscounts(d);
    setInvoices(inv);
    if (inv.length > 0) {
      setSelectedStudentId(inv[0].studentId);
    }
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleGrantDiscount = (e) => {
    e.preventDefault();

    if (principalPin !== "Admin@2026") {
      showToast("Security Violation: Invalid Principal Authorization PIN!", "error");
      return;
    }

    const targetStudent = invoices.find((i) => i.studentId === selectedStudentId);
    if (!targetStudent) {
      showToast("Please select a student from the active registry", "error");
      return;
    }

    const grantAmt = parseFloat(amountValue);
    if (isNaN(grantAmt) || grantAmt <= 0) {
      showToast("Please enter a valid grant amount", "error");
      return;
    }

    const newDiscount = {
      id: `DSC-${String(discounts.length + 1).padStart(2, "0")}`,
      studentId: targetStudent.studentId,
      studentName: targetStudent.studentName,
      discountName: scholarshipName,
      type: discountType,
      amount: grantAmt,
      currency: "GH₵",
      academicYear: academicYear,
      categoryApplied: categoryApplied,
      reason: justification,
      status: "Approved",
      authorizedBy: "Dame Eleanor Vance (Head Principal)",
    };

    const updatedDiscounts = [...discounts, newDiscount];
    setDiscounts(updatedDiscounts);
    saveDiscounts(updatedDiscounts);

    // Apply discount to student invoice
    const updatedInvoices = invoices.map((inv) => {
      if (inv.studentId === targetStudent.studentId) {
        const newDiscountTotal = (inv.discountApplied || 0) + grantAmt;
        const newNet = Math.max(0, inv.totalBilled - newDiscountTotal);
        const newBal = Math.max(0, newNet - (inv.amountPaid || 0));
        return {
          ...inv,
          discountApplied: newDiscountTotal,
          netAmount: newNet,
          balanceDue: newBal,
          paymentStatus: newBal === 0 ? "Paid in Full" : inv.paymentStatus,
        };
      }
      return inv;
    });

    setInvoices(updatedInvoices);
    saveInvoices(updatedInvoices);

    showToast(`Scholarship of GH₵ ${grantAmt.toLocaleString("en-US", { minimumFractionDigits: 2 })} approved for ${targetStudent.studentName}!`);
    setModalOpen(false);

    // Reset Form
    setScholarshipName("");
    setAmountValue("");
    setJustification("");
  };

  const filteredDiscounts = discounts.filter((d) => {
    if (searchTerm.trim() !== "") {
      const q = searchTerm.toLowerCase();
      const matchName = d.studentName.toLowerCase().includes(q);
      const matchScholarship = d.discountName.toLowerCase().includes(q);
      const matchId = d.id.toLowerCase().includes(q);
      if (!matchName && !matchScholarship && !matchId) return false;
    }
    return true;
  });

  const totalAssistance = discounts.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const totalBeneficiaries = new Set(discounts.map((d) => d.studentId)).size;

  return (
    <div className="ds-container">
      <FinanceNav
        title="Discounts, Bursaries & Scholarships"
        subtitle="Endowment fund allocation, academic merit awards, and statutory faculty tuition waivers in Ghanaian Cedi (GH₵)"
        badge="Module 10 • Screen 8 of 13"
      />

      {toast && (
        <div className={`ds-toast ds-toast-${toast.type}`}>
          <div className="ds-toast-dot" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="ds-header">
        <div className="ds-title-box">
          <span className="ds-tag">INSTITUTIONAL FINANCIAL AID & ENDOWMENT</span>
          <h1 className="ds-title">Scholarships & Discounts</h1>
          <p className="ds-subtitle">
            Administer STEM excellence grants, need-based bursaries, faculty tuition waivers,
            and sibling concessions. Each allocation is gated by Principal cryptographic PIN authorization.
          </p>
        </div>

        <div className="ds-actions">
          <button className="ds-btn-primary" onClick={() => setModalOpen(true)}>
            <span className="ds-btn-icon">+</span> Authorize Scholarship / Waiver
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="ds-kpi-grid">
        <div className="ds-kpi-card">
          <div className="ds-kpi-icon-wrap" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
            🎖️
          </div>
          <div className="ds-kpi-body">
            <span className="ds-kpi-label">Total Endowment Disbursed</span>
            <div className="ds-kpi-val">GH₵ {totalAssistance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
            <span className="ds-kpi-sub">{discounts.length} approved grants</span>
          </div>
        </div>

        <div className="ds-kpi-card">
          <div className="ds-kpi-icon-wrap" style={{ background: "rgba(59, 130, 246, 0.15)", color: "#3b82f6" }}>
            🎓
          </div>
          <div className="ds-kpi-body">
            <span className="ds-kpi-label">Beneficiary Scholars</span>
            <div className="ds-kpi-val">{totalBeneficiaries} Students</div>
            <span className="ds-kpi-sub">Across all divisions</span>
          </div>
        </div>

        <div className="ds-kpi-card">
          <div className="ds-kpi-icon-wrap" style={{ background: "rgba(139, 92, 246, 0.15)", color: "#8b5cf6" }}>
            ⚖️
          </div>
          <div className="ds-kpi-body">
            <span className="ds-kpi-label">Authority Gate</span>
            <div className="ds-kpi-val">Principal Seal</div>
            <span className="ds-kpi-sub">Dame Eleanor Vance</span>
          </div>
        </div>

        <div className="ds-kpi-card">
          <div className="ds-kpi-icon-wrap" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b" }}>
            ⭐
          </div>
          <div className="ds-kpi-body">
            <span className="ds-kpi-label">Funding Source</span>
            <div className="ds-kpi-val">SMIA Endowment</div>
            <span className="ds-kpi-sub">Board Trust Reserve</span>
          </div>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="ds-toolbar">
        <div className="ds-search-box">
          <span className="ds-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by student name, grant title, or scholarship ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="ds-search-clear" onClick={() => setSearchTerm("")}>✕</button>
          )}
        </div>
      </div>

      {/* Discounts Table */}
      <div className="ds-table-card">
        <div className="ds-table-responsive">
          <table className="ds-table">
            <thead>
              <tr>
                <th>Grant ID</th>
                <th>Scholarship / Concession Title</th>
                <th>Recipient Scholar</th>
                <th>Grant Classification</th>
                <th>Category Applied</th>
                <th>Value (GH₵)</th>
                <th>Academic Year</th>
                <th>Justification & Grounds</th>
                <th>Approval Status</th>
                <th>Authorized By</th>
              </tr>
            </thead>
            <tbody>
              {filteredDiscounts.length === 0 ? (
                <tr>
                  <td colSpan="10" className="ds-empty">
                    No scholarships or discounts match the current search.
                  </td>
                </tr>
              ) : (
                filteredDiscounts.map((d) => (
                  <tr key={d.id} className="ds-table-row">
                    <td>
                      <span className="ds-grant-code">{d.id}</span>
                    </td>
                    <td>
                      <strong className="ds-grant-title">{d.discountName}</strong>
                    </td>
                    <td>
                      <div className="ds-student-name">{d.studentName}</div>
                      <div className="ds-sub-text">{d.studentId}</div>
                    </td>
                    <td>
                      <span className="ds-type-badge">{d.type}</span>
                    </td>
                    <td>
                      <span className="ds-cat-text">{d.categoryApplied}</span>
                    </td>
                    <td className="ds-amt">
                      GH₵ {d.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td>
                      <span className="ds-year-text">{d.academicYear}</span>
                    </td>
                    <td>
                      <div className="ds-reason-text">{d.reason}</div>
                    </td>
                    <td>
                      <span className="ds-status-badge">✓ {d.status}</span>
                    </td>
                    <td>
                      <div className="ds-auth-text">{d.authorizedBy}</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Authorize Scholarship */}
      {modalOpen && (
        <div className="ds-modal-overlay">
          <div className="ds-modal-box">
            <div className="ds-modal-header">
              <div>
                <h3>🎖️ Authorize Scholarship or Fee Waiver</h3>
                <p>Allocate endowment funds or tuition concessions in Ghanaian Cedi (GH₵).</p>
              </div>
              <button className="ds-btn-close" onClick={() => setModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleGrantDiscount} className="ds-modal-form">
              <div className="ds-form-field">
                <label>Select Beneficiary Student:</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  required
                >
                  {invoices.map((inv) => (
                    <option key={inv.id} value={inv.studentId}>
                      {inv.studentName} ({inv.studentId}) — {inv.classCohort} — Net Bill: GH₵ {inv.netAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </option>
                  ))}
                </select>
              </div>

              <div className="ds-form-field">
                <label>Scholarship / Discount Designation:</label>
                <input
                  type="text"
                  placeholder="e.g. National Robotics Championship Merit Award"
                  value={scholarshipName}
                  onChange={(e) => setScholarshipName(e.target.value)}
                  required
                />
              </div>

              <div className="ds-form-row">
                <div className="ds-form-field">
                  <label>Grant Classification:</label>
                  <select value={discountType} onChange={(e) => setDiscountType(e.target.value)}>
                    <option value="Fixed Amount">Fixed Amount (GH₵)</option>
                    <option value="Tuition Waiver">100% Tuition Waiver</option>
                    <option value="Percentage (10%)">Sibling Concession (10%)</option>
                    <option value="Need-based Bursary">Need-based Financial Assistance</option>
                  </select>
                </div>

                <div className="ds-form-field">
                  <label>Grant Value in GH₵:</label>
                  <input
                    type="number"
                    step="50"
                    placeholder="e.g. 1500.00"
                    value={amountValue}
                    onChange={(e) => setAmountValue(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="ds-form-row">
                <div className="ds-form-field">
                  <label>Category Applied:</label>
                  <select value={categoryApplied} onChange={(e) => setCategoryApplied(e.target.value)}>
                    <option value="Tuition & Instruction">Tuition & Academic Instruction</option>
                    <option value="Boarding & Accommodation">Boarding & Hostel Accommodation</option>
                    <option value="Comprehensive Bill">Comprehensive Term Bill</option>
                    <option value="STEM Lab Practical Levy">STEM Lab Practical Levy</option>
                  </select>
                </div>

                <div className="ds-form-field">
                  <label>Academic Year:</label>
                  <select value={academicYear} onChange={(e) => setAcademicYear(e.target.value)}>
                    <option value="2026/2027">2026/2027</option>
                    <option value="2027/2028">2027/2028</option>
                  </select>
                </div>
              </div>

              <div className="ds-form-field">
                <label>Board Justification & Minutes Reference:</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Awarded per Academic Board Resolution 2026/04 for outstanding STEM Olympiad performance."
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  required
                />
              </div>

              <div className="ds-pin-field">
                <label>🔒 Principal Cryptographic Authorization PIN:</label>
                <input
                  type="password"
                  value={principalPin}
                  onChange={(e) => setPrincipalPin(e.target.value)}
                  placeholder="Enter Head Principal PIN"
                  required
                />
                <span className="ds-pin-hint">Auto-filled for demonstration: Admin@2026</span>
              </div>

              <div className="ds-modal-footer">
                <button type="button" className="ds-btn-cancel" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="ds-btn-submit">
                  🎖️ Authorize & Credit Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
