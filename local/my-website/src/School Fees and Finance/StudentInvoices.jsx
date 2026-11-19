import React, { useState, useEffect } from "react";
import FinanceNav from "./FinanceNav";
import {
  getInvoices,
  saveInvoices,
  getFeeStructures,
  getFeeCategories,
} from "./financeData";
import "./StudentInvoices.css";

export default function StudentInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [structures, setStructures] = useState([]);
  const [selectedCohort, setSelectedCohort] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState(null);

  // Print / View Invoice Modal
  const [viewInvoiceModal, setViewInvoiceModal] = useState(null);

  // New Invoice Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newStudentId, setNewStudentId] = useState("");
  const [newStudentName, setNewStudentName] = useState("");
  const [newCohort, setNewCohort] = useState("Grade 11-A");
  const [newRollNo, setNewRollNo] = useState("");
  const [newGuardianName, setNewGuardianName] = useState("");
  const [newGuardianPhone, setNewGuardianPhone] = useState("");
  const [newGuardianEmail, setNewGuardianEmail] = useState("");
  const [newStructureId, setNewStructureId] = useState("");
  const [newDiscount, setNewDiscount] = useState(0);
  const [newDueDate, setNewDueDate] = useState("2026-10-15");

  useEffect(() => {
    const loadedInvoices = getInvoices();
    const loadedStructures = getFeeStructures();
    setInvoices(loadedInvoices);
    setStructures(loadedStructures);
    if (loadedStructures.length > 0) {
      setNewStructureId(loadedStructures[0].id);
    }
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCreateInvoice = (e) => {
    e.preventDefault();
    const struct = structures.find((s) => s.id === newStructureId);
    const totalBilled = struct ? struct.totalFee : 5000;
    const discountVal = parseFloat(newDiscount) || 0;
    const net = Math.max(0, totalBilled - discountVal);

    const newInv = {
      id: `INV-2026-${String(invoices.length + 1).padStart(3, "0")}`,
      studentId: newStudentId || `STU-SMIA-${Math.floor(100 + Math.random() * 900)}`,
      studentName: newStudentName,
      rollNumber: newRollNo || "11A-99",
      classCohort: newCohort,
      guardianName: newGuardianName,
      guardianPhone: newGuardianPhone || "+233 24 000 0000",
      guardianEmail: newGuardianEmail || "parent@smia.edu.gh",
      structureId: newStructureId,
      billingDate: new Date().toISOString().substring(0, 10),
      dueDate: newDueDate,
      term: struct ? `${struct.term}, ${struct.academicYear}` : "Term 1, 2026/2027",
      totalBilled: totalBilled,
      discountApplied: discountVal,
      netAmount: net,
      amountPaid: 0.0,
      balanceDue: net,
      paymentStatus: "Overdue",
      lastPaymentDate: null,
    };

    const updated = [newInv, ...invoices];
    setInvoices(updated);
    saveInvoices(updated);
    showToast(`Invoice ${newInv.id} issued for ${newInv.studentName}!`);
    setCreateModalOpen(false);

    // Reset Form
    setNewStudentName("");
    setNewStudentId("");
    setNewRollNo("");
    setNewGuardianName("");
    setNewGuardianPhone("");
    setNewGuardianEmail("");
    setNewDiscount(0);
  };

  const filteredInvoices = invoices.filter((inv) => {
    if (selectedCohort !== "All" && inv.classCohort !== selectedCohort) return false;
    if (statusFilter !== "All" && inv.paymentStatus !== statusFilter) return false;
    if (searchTerm.trim() !== "") {
      const q = searchTerm.toLowerCase();
      const matchName = inv.studentName.toLowerCase().includes(q);
      const matchId = inv.id.toLowerCase().includes(q);
      const matchStuId = inv.studentId.toLowerCase().includes(q);
      const matchGuardian = inv.guardianName.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchStuId && !matchGuardian) return false;
    }
    return true;
  });

  const totalBilledSum = invoices.reduce((acc, curr) => acc + (curr.netAmount || 0), 0);
  const totalCollectedSum = invoices.reduce((acc, curr) => acc + (curr.amountPaid || 0), 0);
  const totalOutstandingSum = invoices.reduce((acc, curr) => acc + (curr.balanceDue || 0), 0);
  const collectionRate = totalBilledSum > 0 ? ((totalCollectedSum / totalBilledSum) * 100).toFixed(1) : "0.0";

  return (
    <div className="si-container">
      <FinanceNav
        title="Student Invoicing & Term Billing"
        subtitle="Generate, customize, and issue institutional fee invoices with automated debt tracking in Ghanaian Cedi (GH₵)"
        badge="Module 10 • Screen 3 of 13"
      />

      {toast && (
        <div className={`si-toast si-toast-${toast.type}`}>
          <div className="si-toast-dot" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="si-header">
        <div className="si-title-box">
          <span className="si-tag">STUDENT BILLING REGISTRY</span>
          <h1 className="si-title">Student Fee Invoices</h1>
          <p className="si-subtitle">
            Manage comprehensive fee bills across all classes. Each invoice reflects approved cohort tariffs,
            individual scholarships/waivers, and live balances in Ghanaian Cedi (GH₵).
          </p>
        </div>

        <div className="si-actions">
          <button className="si-btn-primary" onClick={() => setCreateModalOpen(true)}>
            <span className="si-btn-icon">+</span> Issue Student Invoice
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="si-kpi-grid">
        <div className="si-kpi-card">
          <div className="si-kpi-icon-wrap" style={{ background: "rgba(59, 130, 246, 0.15)", color: "#3b82f6" }}>
            📑
          </div>
          <div className="si-kpi-body">
            <span className="si-kpi-label">Total Invoiced (Net)</span>
            <div className="si-kpi-val">GH₵ {totalBilledSum.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
            <span className="si-kpi-sub">{invoices.length} active invoices</span>
          </div>
        </div>

        <div className="si-kpi-card">
          <div className="si-kpi-icon-wrap" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
            💰
          </div>
          <div className="si-kpi-body">
            <span className="si-kpi-label">Total Paid & Cleared</span>
            <div className="si-kpi-val">GH₵ {totalCollectedSum.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
            <span className="si-kpi-sub" style={{ color: "#34d399" }}>{collectionRate}% collection rate</span>
          </div>
        </div>

        <div className="si-kpi-card">
          <div className="si-kpi-icon-wrap" style={{ background: "rgba(239, 68, 68, 0.15)", color: "#ef4444" }}>
            ⚠️
          </div>
          <div className="si-kpi-body">
            <span className="si-kpi-label">Outstanding Arrears</span>
            <div className="si-kpi-val" style={{ color: "#f87171" }}>
              GH₵ {totalOutstandingSum.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <span className="si-kpi-sub">Pending bursar collection</span>
          </div>
        </div>

        <div className="si-kpi-card">
          <div className="si-kpi-icon-wrap" style={{ background: "rgba(139, 92, 246, 0.15)", color: "#8b5cf6" }}>
            ⚖️
          </div>
          <div className="si-kpi-body">
            <span className="si-kpi-label">Currency Standard</span>
            <div className="si-kpi-val">GH₵ (Ghana Cedi)</div>
            <span className="si-kpi-sub">BOG Benchmark Standard</span>
          </div>
        </div>
      </div>

      {/* Filter / Search Toolbar */}
      <div className="si-toolbar">
        <div className="si-search-box">
          <span className="si-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by student name, roll number, invoice ID, or guardian..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="si-search-clear" onClick={() => setSearchTerm("")}>✕</button>
          )}
        </div>

        <div className="si-filters">
          <div className="si-filter-item">
            <label>Cohort:</label>
            <select value={selectedCohort} onChange={(e) => setSelectedCohort(e.target.value)}>
              <option value="All">All Cohorts</option>
              <option value="Grade 11-A">Grade 11-A</option>
              <option value="Grade 11-B">Grade 11-B</option>
              <option value="Grade 12-A">Grade 12-A</option>
            </select>
          </div>

          <div className="si-filter-item">
            <label>Status:</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="Paid in Full">Paid in Full</option>
              <option value="Partial Payment">Partial Payment</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="si-table-card">
        <div className="si-table-responsive">
          <table className="si-table">
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Student & Roll No</th>
                <th>Class Cohort</th>
                <th>Guardian Contact</th>
                <th>Total Billed</th>
                <th>Discount</th>
                <th>Net Bill</th>
                <th>Paid</th>
                <th>Balance Due</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan="11" className="si-empty">
                    No student invoices matched the current search criteria.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="si-table-row">
                    <td>
                      <span className="si-inv-badge">{inv.id}</span>
                      <div className="si-term-text">{inv.term}</div>
                    </td>
                    <td>
                      <strong className="si-student-name">{inv.studentName}</strong>
                      <div className="si-meta-text">{inv.studentId} • Roll: {inv.rollNumber}</div>
                    </td>
                    <td>
                      <span className="si-cohort-tag">{inv.classCohort}</span>
                    </td>
                    <td>
                      <div className="si-guardian-name">{inv.guardianName}</div>
                      <div className="si-meta-text">{inv.guardianPhone}</div>
                    </td>
                    <td className="si-amt">
                      GH₵ {inv.totalBilled.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="si-amt" style={{ color: inv.discountApplied > 0 ? "#34d399" : "#94a3b8" }}>
                      {inv.discountApplied > 0
                        ? `- GH₵ ${inv.discountApplied.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                        : "GH₵ 0.00"}
                    </td>
                    <td className="si-amt si-net-amt">
                      GH₵ {inv.netAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="si-amt" style={{ color: "#34d399" }}>
                      GH₵ {inv.amountPaid.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="si-amt" style={{ color: inv.balanceDue > 0 ? "#f87171" : "#34d399", fontWeight: 700 }}>
                      GH₵ {inv.balanceDue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td>
                      <span
                        className={`si-status-badge ${
                          inv.paymentStatus === "Paid in Full"
                            ? "status-paid"
                            : inv.paymentStatus === "Partial Payment"
                            ? "status-partial"
                            : "status-overdue"
                        }`}
                      >
                        {inv.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <div className="si-row-actions">
                        <button
                          className="si-btn-view"
                          title="View Official Invoice Voucher"
                          onClick={() => setViewInvoiceModal(inv)}
                        >
                          👁️ View / Print
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Invoice Modal */}
      {viewInvoiceModal && (
        <div className="si-modal-overlay">
          <div className="si-modal-print-container">
            <div className="si-print-controls no-print">
              <button className="si-btn-print-action" onClick={handlePrint}>
                🖨️ Print / Save as PDF
              </button>
              <button className="si-btn-close-modal" onClick={() => setViewInvoiceModal(null)}>
                ✕ Close
              </button>
            </div>

            {/* Printable Invoice Sheet */}
            <div className="si-invoice-sheet" id="printable-invoice">
              <div className="si-sheet-header">
                <div className="si-school-crest">
                  <div className="si-crest-emblem">SMIA</div>
                  <div>
                    <h2 className="si-school-title">ST. MICHAEL'S INTERNATIONAL ACADEMY</h2>
                    <p className="si-school-motto">"Excellence, Integrity & Leadership" • Founded 1988</p>
                    <p className="si-school-address">Ridge Residential Area, Accra, Ghana • Tel: +233 30 200 4488 • bursar@smia.edu.gh</p>
                  </div>
                </div>
                <div className="si-invoice-meta-box">
                  <span className="si-official-badge">OFFICIAL BILLING INVOICE</span>
                  <div className="si-invoice-num">{viewInvoiceModal.id}</div>
                  <div className="si-meta-row"><span>Billing Date:</span> <strong>{viewInvoiceModal.billingDate}</strong></div>
                  <div className="si-meta-row"><span>Due Date:</span> <strong>{viewInvoiceModal.dueDate}</strong></div>
                  <div className="si-meta-row"><span>Billing Term:</span> <strong>{viewInvoiceModal.term}</strong></div>
                </div>
              </div>

              <div className="si-bill-to-grid">
                <div className="si-bill-to-box">
                  <span className="si-box-head">STUDENT PARTICULARS:</span>
                  <div className="si-particular-name">{viewInvoiceModal.studentName}</div>
                  <div><strong>Student ID:</strong> {viewInvoiceModal.studentId}</div>
                  <div><strong>Roll / Class:</strong> {viewInvoiceModal.rollNumber} • {viewInvoiceModal.classCohort}</div>
                  <div><strong>Residential Status:</strong> Day / Boarding Scholar</div>
                </div>

                <div className="si-bill-to-box">
                  <span className="si-box-head">PARENT / GUARDIAN BILLING TO:</span>
                  <div className="si-particular-name">{viewInvoiceModal.guardianName}</div>
                  <div><strong>Phone:</strong> {viewInvoiceModal.guardianPhone}</div>
                  <div><strong>Email:</strong> {viewInvoiceModal.guardianEmail}</div>
                  <div><strong>Currency:</strong> Ghanaian Cedi (GH₵)</div>
                </div>
              </div>

              <table className="si-sheet-table">
                <thead>
                  <tr>
                    <th>Item Description</th>
                    <th>Billing Cycle</th>
                    <th>Standard Amount (GH₵)</th>
                    <th>Net Charge (GH₵)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Tuition & Classroom Instruction (Core Curriculum)</td>
                    <td>Per Term</td>
                    <td>GH₵ 3,200.00</td>
                    <td>GH₵ 3,200.00</td>
                  </tr>
                  <tr>
                    <td>Boarding, Residential Hostel Utilities & Maintenance</td>
                    <td>Per Term</td>
                    <td>GH₵ 2,400.00</td>
                    <td>GH₵ 2,400.00</td>
                  </tr>
                  <tr>
                    <td>Science & Computer Lab Practical levy</td>
                    <td>Per Term</td>
                    <td>GH₵ 650.00</td>
                    <td>GH₵ 650.00</td>
                  </tr>
                  <tr>
                    <td>PTA Development Endowment & Campus Infrastructure</td>
                    <td>Per Term</td>
                    <td>GH₵ 300.00</td>
                    <td>GH₵ 300.00</td>
                  </tr>
                  <tr>
                    <td>Co-Curricular, Sports & Sports Equipment Levy</td>
                    <td>Annual</td>
                    <td>GH₵ 250.00</td>
                    <td>GH₵ 250.00</td>
                  </tr>
                </tbody>
              </table>

              <div className="si-sheet-summary-grid">
                <div className="si-banking-instructions">
                  <h4>PAYMENT INSTRUCTIONS & BANK ACCOUNTS:</h4>
                  <p><strong>• MTN Mobile Money:</strong> Merchant Code <strong>408819</strong> (St. Michaels Academy)</p>
                  <p><strong>• GCB Bank High Street:</strong> A/C No: <strong>1011400293811</strong></p>
                  <p><strong>• Ecobank Ghana:</strong> Branch: Ridge • A/C No: <strong>0092144882</strong></p>
                  <p><em>* Please always reference student ID ({viewInvoiceModal.studentId}) on payment description.</em></p>
                </div>

                <div className="si-totals-summary-box">
                  <div className="si-calc-row">
                    <span>Gross Institutional Bill:</span>
                    <strong>GH₵ {viewInvoiceModal.totalBilled.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong>
                  </div>
                  {viewInvoiceModal.discountApplied > 0 && (
                    <div className="si-calc-row discount">
                      <span>Approved Scholarship / Waiver:</span>
                      <strong>- GH₵ {viewInvoiceModal.discountApplied.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong>
                    </div>
                  )}
                  <div className="si-calc-row net">
                    <span>Net Bill Payable:</span>
                    <strong>GH₵ {viewInvoiceModal.netAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong>
                  </div>
                  <div className="si-calc-row paid">
                    <span>Amount Paid to Date:</span>
                    <strong>GH₵ {viewInvoiceModal.amountPaid.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong>
                  </div>
                  <div className="si-calc-row due">
                    <span>CURRENT BALANCE DUE:</span>
                    <strong style={{ color: viewInvoiceModal.balanceDue > 0 ? "#b91c1c" : "#047857" }}>
                      GH₵ {viewInvoiceModal.balanceDue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="si-sheet-footer">
                <div className="si-signature-block">
                  <div className="si-signature-line" />
                  <span>Mrs. Gertrude Addo</span>
                  <small>Chief Bursar & Director of Finance</small>
                </div>

                <div className="si-stamp-box">
                  <div className="si-official-seal">
                    <span>ST. MICHAEL'S ACADEMY</span>
                    <span>* BURSA'S OFFICE *</span>
                    <span>OFFICIALLY AUDITED</span>
                  </div>
                </div>

                <div className="si-signature-block">
                  <div className="si-signature-line" />
                  <span>Dame Eleanor Vance</span>
                  <small>Head Principal & Board Trustee</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Invoice Modal */}
      {createModalOpen && (
        <div className="si-modal-overlay">
          <div className="si-form-modal-box">
            <div className="si-modal-header">
              <div>
                <h3>➕ Issue New Student Invoice</h3>
                <p>Generate a customized term bill linked to an approved fee structure in Ghanaian Cedi (GH₵).</p>
              </div>
              <button className="si-btn-close" onClick={() => setCreateModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleCreateInvoice} className="si-modal-form">
              <div className="si-form-row">
                <div className="si-form-field">
                  <label>Student Full Name:</label>
                  <input
                    type="text"
                    placeholder="e.g. Samuel Yaw Boateng"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    required
                  />
                </div>
                <div className="si-form-field">
                  <label>Student ID (Optional):</label>
                  <input
                    type="text"
                    placeholder="e.g. STU-SMIA-010"
                    value={newStudentId}
                    onChange={(e) => setNewStudentId(e.target.value)}
                  />
                </div>
              </div>

              <div className="si-form-row">
                <div className="si-form-field">
                  <label>Class Cohort:</label>
                  <select value={newCohort} onChange={(e) => setNewCohort(e.target.value)}>
                    <option value="Grade 11-A">Grade 11-A (Science Track)</option>
                    <option value="Grade 11-B">Grade 11-B (General Arts & Business)</option>
                    <option value="Grade 12-A">Grade 12-A (WASSCE Finalists)</option>
                    <option value="Grade 10-A">Grade 10-A (Foundation Division)</option>
                  </select>
                </div>
                <div className="si-form-field">
                  <label>Roll Number:</label>
                  <input
                    type="text"
                    placeholder="e.g. 11A-18"
                    value={newRollNo}
                    onChange={(e) => setNewRollNo(e.target.value)}
                  />
                </div>
              </div>

              <div className="si-form-row">
                <div className="si-form-field">
                  <label>Parent / Guardian Name:</label>
                  <input
                    type="text"
                    placeholder="e.g. Mr. Emmanuel Boateng"
                    value={newGuardianName}
                    onChange={(e) => setNewGuardianName(e.target.value)}
                    required
                  />
                </div>
                <div className="si-form-field">
                  <label>Guardian Phone (MoMo Alerts):</label>
                  <input
                    type="text"
                    placeholder="e.g. +233 24 555 9900"
                    value={newGuardianPhone}
                    onChange={(e) => setNewGuardianPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="si-form-field">
                <label>Apply Fee Structure:</label>
                <select value={newStructureId} onChange={(e) => setNewStructureId(e.target.value)}>
                  {structures.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.structureName} — GH₵ {s.totalFee.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </option>
                  ))}
                </select>
              </div>

              <div className="si-form-row">
                <div className="si-form-field">
                  <label>Scholarship / Discount (GH₵):</label>
                  <input
                    type="number"
                    step="50"
                    value={newDiscount}
                    onChange={(e) => setNewDiscount(e.target.value)}
                  />
                </div>
                <div className="si-form-field">
                  <label>Payment Due Date:</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="si-modal-footer">
                <button type="button" className="si-btn-cancel" onClick={() => setCreateModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="si-btn-submit">
                  Generate & Issue Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
