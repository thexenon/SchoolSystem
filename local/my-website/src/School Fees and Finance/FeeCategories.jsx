import React, { useState, useEffect } from "react";
import FinanceNav from "./FinanceNav";
import { getFeeCategories, saveFeeCategories } from "./financeData";
import "./FeeCategories.css";

export default function FeeCategories() {
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [filterType, setFilterType] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState(null);

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formCode, setFormCode] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formFeeType, setFormFeeType] = useState("Mandatory");
  const [formCycle, setFormCycle] = useState("Per Term");
  const [formAmount, setFormAmount] = useState("1000.00");
  const [formApplicable, setFormApplicable] = useState("All Students");

  useEffect(() => {
    setCategories(getFeeCategories());
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormName("");
    setFormCode(`FEE-0${categories.length + 1}`);
    setFormDesc("");
    setFormFeeType("Mandatory");
    setFormCycle("Per Term");
    setFormAmount("1200.00");
    setFormApplicable("All Students");
    setModalOpen(true);
  };

  const handleOpenEdit = (c) => {
    setEditingCategory(c);
    setFormName(c.name);
    setFormCode(c.code);
    setFormDesc(c.description);
    setFormFeeType(c.feeType);
    setFormCycle(c.billingCycle);
    setFormAmount(c.standardAmount.toString());
    setFormApplicable(c.applicableTo);
    setModalOpen(true);
  };

  const handleSaveCategory = (e) => {
    e.preventDefault();
    const amountVal = parseFloat(formAmount) || 0;

    if (editingCategory) {
      const updated = categories.map((c) =>
        c.id === editingCategory.id
          ? {
              ...c,
              name: formName,
              code: formCode,
              description: formDesc,
              feeType: formFeeType,
              billingCycle: formCycle,
              standardAmount: amountVal,
              applicableTo: formApplicable,
            }
          : c
      );
      setCategories(updated);
      saveFeeCategories(updated);
      showToast(`Category "${formName}" updated successfully!`);
    } else {
      const newId = `CAT-${String(categories.length + 1).padStart(2, "0")}`;
      const newCat = {
        id: newId,
        name: formName,
        code: formCode,
        description: formDesc,
        feeType: formFeeType,
        billingCycle: formCycle,
        standardAmount: amountVal,
        status: "Active",
        applicableTo: formApplicable,
      };
      const updated = [...categories, newCat];
      setCategories(updated);
      saveFeeCategories(updated);
      showToast(`Fee category "${formName}" created successfully!`);
    }

    setModalOpen(false);
  };

  const handleToggleStatus = (id) => {
    const updated = categories.map((c) => {
      if (c.id === id) {
        const nextStatus = c.status === "Active" ? "Suspended" : "Active";
        return { ...c, status: nextStatus };
      }
      return c;
    });
    setCategories(updated);
    saveFeeCategories(updated);
    showToast("Fee category operational status updated.");
  };

  const filteredCategories = categories.filter((c) => {
    if (filterType !== "All" && !c.feeType.toLowerCase().includes(filterType.toLowerCase())) {
      return false;
    }
    if (
      searchTerm &&
      !c.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !c.code.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const mandatoryCount = categories.filter((c) => c.feeType.includes("Mandatory")).length;
  const optionalCount = categories.filter((c) => c.feeType.includes("Optional")).length;
  const totalStandardSum = categories.reduce((acc, curr) => acc + (curr.standardAmount || 0), 0);

  return (
    <div className="fc-container">
      <FinanceNav
        title="Fee Categories & Component Catalog"
        subtitle="Define and standardize institutional fee types, recurring tuition levies, and optional service tariffs"
        badge="Module 10 • Screen 1 of 13"
      />

      {toast && (
        <div className={`fc-toast fc-toast-${toast.type}`}>
          <div className="fc-toast-dot" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="fc-header">
        <div className="fc-title-box">
          <span className="fc-tag">FINANCIAL LEDGER HEADS</span>
          <h1 className="fc-title">Fee Categories & Billing Tariffs</h1>
          <p className="fc-subtitle">
            Configure institutional revenue items including tuition, laboratory supplies, boarding,
            and transport routes in Ghanaian Cedi (GH₵).
          </p>
        </div>

        <div className="fc-actions">
          <button className="fc-btn-primary" onClick={handleOpenAdd}>
            <span className="fc-btn-icon">+</span> Define Fee Category
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="fc-kpi-grid">
        <div className="fc-kpi-card">
          <div className="fc-kpi-icon-wrap" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
            🏷️
          </div>
          <div className="fc-kpi-body">
            <span className="fc-kpi-label">Configured Categories</span>
            <div className="fc-kpi-val">{categories.length} Items <span className="fc-kpi-sub">Active Ledger</span></div>
          </div>
        </div>

        <div className="fc-kpi-card">
          <div className="fc-kpi-icon-wrap" style={{ background: "rgba(59, 130, 246, 0.15)", color: "#3b82f6" }}>
            🛡️
          </div>
          <div className="fc-kpi-body">
            <span className="fc-kpi-label">Mandatory Core Levies</span>
            <div className="fc-kpi-val">{mandatoryCount} Items <span className="fc-kpi-sub">Tuition & PTA</span></div>
          </div>
        </div>

        <div className="fc-kpi-card">
          <div className="fc-kpi-icon-wrap" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b" }}>
            🚌
          </div>
          <div className="fc-kpi-body">
            <span className="fc-kpi-label">Optional Campus Services</span>
            <div className="fc-kpi-val">{optionalCount} Items <span className="fc-kpi-sub">Hostel & Transport</span></div>
          </div>
        </div>

        <div className="fc-kpi-card">
          <div className="fc-kpi-icon-wrap" style={{ background: "rgba(139, 92, 246, 0.15)", color: "#8b5cf6" }}>
            🇬🇭
          </div>
          <div className="fc-kpi-body">
            <span className="fc-kpi-label">Sum of Standard Tariffs</span>
            <div className="fc-kpi-val">GH₵ {totalStandardSum.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="fc-toolbar">
        <div className="fc-search-box">
          <span className="fc-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by category name, code, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="fc-search-input"
          />
        </div>

        <div className="fc-filter-box">
          <label>Classification:</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="fc-select">
            <option value="All">All Categories ({categories.length})</option>
            <option value="Mandatory">Mandatory Levies</option>
            <option value="Optional">Optional Services</option>
          </select>
        </div>
      </div>

      {/* Categories Table Card */}
      <div className="fc-card-wrap">
        <div className="fc-table-header">
          <div>
            <h3>Standardized School Fee Heads</h3>
            <p>Every student bill is synthesized from these verified institutional revenue components.</p>
          </div>
          <span className="fc-badge-currency">Currency Standard: Ghanaian Cedi (GH₵)</span>
        </div>

        <div className="fc-table-responsive">
          <table className="fc-table">
            <thead>
              <tr>
                <th>Code & Category Name</th>
                <th>Description</th>
                <th>Type</th>
                <th>Billing Cycle</th>
                <th>Standard Amount</th>
                <th>Target Eligibility</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="fc-cat-name">{c.name}</div>
                    <div className="fc-cat-code">{c.code} • {c.id}</div>
                  </td>
                  <td>
                    <div className="fc-cat-desc">{c.description}</div>
                  </td>
                  <td>
                    <span
                      className={`fc-type-badge ${
                        c.feeType.includes("Mandatory") ? "type-mandatory" : "type-optional"
                      }`}
                    >
                      {c.feeType}
                    </span>
                  </td>
                  <td>
                    <div className="fc-cycle-text">{c.billingCycle}</div>
                  </td>
                  <td>
                    <div className="fc-amount-val">
                      GH₵ {c.standardAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </div>
                  </td>
                  <td>
                    <div className="fc-eligibility-text">{c.applicableTo}</div>
                  </td>
                  <td>
                    <span
                      className={`fc-status-pill ${
                        c.status === "Active" ? "status-active" : "status-suspended"
                      }`}
                    >
                      ● {c.status}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div className="fc-action-btns">
                      <button
                        className="fc-btn-sub fc-btn-edit"
                        onClick={() => handleOpenEdit(c)}
                        title="Edit Category Details"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="fc-btn-sub fc-btn-toggle"
                        onClick={() => handleToggleStatus(c.id)}
                        title="Toggle Status"
                      >
                        {c.status === "Active" ? "Suspend" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      {modalOpen && (
        <div className="fc-modal-overlay">
          <div className="fc-modal-box">
            <div className="fc-modal-header">
              <div>
                <h3>{editingCategory ? "✏️ Edit Fee Category" : "➕ Define New Fee Category"}</h3>
                <p>Configure fee classification, cycle, and statutory tariff in Ghanaian Cedi (GH₵).</p>
              </div>
              <button className="fc-modal-close" onClick={() => setModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveCategory} className="fc-modal-body">
              <div className="fc-form-grid">
                <div className="fc-form-field">
                  <label>Category Title:</label>
                  <input
                    type="text"
                    placeholder="e.g. Science Laboratory Levy, Robotics Kit Fee"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                  />
                </div>

                <div className="fc-form-field">
                  <label>Short Ledger Code:</label>
                  <input
                    type="text"
                    placeholder="e.g. TUI-01, LAB-05"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="fc-form-field">
                <label>Description & Scope:</label>
                <textarea
                  rows={2}
                  placeholder="Detail what services or equipment this fee covers..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  required
                />
              </div>

              <div className="fc-form-grid">
                <div className="fc-form-field">
                  <label>Fee Classification:</label>
                  <select value={formFeeType} onChange={(e) => setFormFeeType(e.target.value)}>
                    <option value="Mandatory">Mandatory (Universal Core)</option>
                    <option value="Mandatory (Science & Tech)">Mandatory (Science & Practical Track)</option>
                    <option value="Mandatory (Finalists)">Mandatory (Grade 12 Candidates)</option>
                    <option value="Optional">Optional Service</option>
                    <option value="Optional (Residential)">Optional (Boarding & Accommodation)</option>
                    <option value="Optional (Day)">Optional (Transport Shuttle)</option>
                  </select>
                </div>

                <div className="fc-form-field">
                  <label>Billing Frequency:</label>
                  <select value={formCycle} onChange={(e) => setFormCycle(e.target.value)}>
                    <option value="Per Term">Per Academic Term</option>
                    <option value="Annual">Annual (Once per Academic Year)</option>
                    <option value="One-time Admission">One-time Admission Levy</option>
                  </select>
                </div>
              </div>

              <div className="fc-form-grid">
                <div className="fc-form-field">
                  <label>Standard Tariff (Ghanaian Cedi):</label>
                  <div className="fc-input-currency-box">
                    <span>GH₵</span>
                    <input
                      type="number"
                      step="50"
                      min="0"
                      value={formAmount}
                      onChange={(e) => setFormAmount(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="fc-form-field">
                  <label>Applicable Student Body:</label>
                  <input
                    type="text"
                    placeholder="e.g. All Students, Boarders Only, Science Track"
                    value={formApplicable}
                    onChange={(e) => setFormApplicable(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="fc-modal-footer">
                <button type="button" className="fc-btn-cancel" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="fc-btn-save">
                  {editingCategory ? "Commit Changes" : "Save Fee Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
