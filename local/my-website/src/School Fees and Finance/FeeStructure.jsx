import React, { useState, useEffect } from "react";
import FinanceNav from "./FinanceNav";
import {
  getFeeStructures,
  saveFeeStructures,
  getFeeCategories,
} from "./financeData";
import "./FeeStructure.css";

export default function FeeStructure() {
  const [structures, setStructures] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCohort, setSelectedCohort] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStructure, setEditingStructure] = useState(null);
  const [toast, setToast] = useState(null);

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formCohort, setFormCohort] = useState("Grade 11-A");
  const [formYear, setFormYear] = useState("2026/2027");
  const [formTerm, setFormTerm] = useState("Term 1");
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    setStructures(getFeeStructures());
    setCategories(getFeeCategories());
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleOpenAdd = () => {
    setEditingStructure(null);
    setFormName("Grade 11-A Science Term 1 Bill");
    setFormCohort("Grade 11-A");
    setFormYear("2026/2027");
    setFormTerm("Term 1");
    // Pre-select tuition and PTA
    setSelectedItems(
      categories.slice(0, 3).map((c) => ({
        categoryName: c.name,
        amount: c.standardAmount,
      }))
    );
    setModalOpen(true);
  };

  const handleOpenEdit = (str) => {
    setEditingStructure(str);
    setFormName(str.structureName);
    setFormCohort(str.cohort);
    setFormYear(str.academicYear);
    setFormTerm(str.term);
    setSelectedItems(str.items || []);
    setModalOpen(true);
  };

  const handleToggleItem = (cat) => {
    const exists = selectedItems.find((i) => i.categoryName === cat.name);
    if (exists) {
      setSelectedItems(selectedItems.filter((i) => i.categoryName !== cat.name));
    } else {
      setSelectedItems([
        ...selectedItems,
        { categoryName: cat.name, amount: cat.standardAmount },
      ]);
    }
  };

  const handleItemAmountChange = (categoryName, val) => {
    const num = parseFloat(val) || 0;
    setSelectedItems(
      selectedItems.map((i) =>
        i.categoryName === categoryName ? { ...i, amount: num } : i
      )
    );
  };

  const calculatedTotal = selectedItems.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const handleSaveStructure = (e) => {
    e.preventDefault();
    if (selectedItems.length === 0) {
      showToast("Please include at least one fee category in the structure!", "error");
      return;
    }

    if (editingStructure) {
      const updated = structures.map((s) =>
        s.id === editingStructure.id
          ? {
              ...s,
              structureName: formName,
              cohort: formCohort,
              academicYear: formYear,
              term: formTerm,
              items: selectedItems,
              totalFee: calculatedTotal,
            }
          : s
      );
      setStructures(updated);
      saveFeeStructures(updated);
      showToast(`Fee structure "${formName}" updated successfully!`);
    } else {
      const newId = `STR-2026-00${structures.length + 1}`;
      const newStruct = {
        id: newId,
        structureName: formName,
        cohort: formCohort,
        academicYear: formYear,
        term: formTerm,
        items: selectedItems,
        totalFee: calculatedTotal,
        currency: "GH₵",
        status: "Approved",
        effectiveDate: new Date().toISOString().substring(0, 10),
      };
      const updated = [...structures, newStruct];
      setStructures(updated);
      saveFeeStructures(updated);
      showToast(`New fee structure "${formName}" saved & approved!`);
    }

    setModalOpen(false);
  };

  const filteredStructures = structures.filter((s) => {
    if (selectedCohort !== "All" && s.cohort !== selectedCohort) return false;
    return true;
  });

  const highestFee = Math.max(...structures.map((s) => s.totalFee || 0), 0);
  const avgFee =
    structures.reduce((acc, curr) => acc + (curr.totalFee || 0), 0) / (structures.length || 1);

  return (
    <div className="fs-container">
      <FinanceNav
        title="Class & Programme Fee Structures"
        subtitle="Establish comprehensive termly fee bills customized by class cohort, residential status, and study track"
        badge="Module 10 • Screen 2 of 13"
      />

      {toast && (
        <div className={`fs-toast fs-toast-${toast.type}`}>
          <div className="fs-toast-dot" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="fs-header">
        <div className="fs-title-box">
          <span className="fs-tag">ACADEMIC BILLING MATRIX</span>
          <h1 className="fs-title">Class Cohort Fee Structures</h1>
          <p className="fs-subtitle">
            Consolidate tuition, boarding, labs, and examination levies into unified termly bills
            for automatic student invoice generation in Ghanaian Cedi (GH₵).
          </p>
        </div>

        <div className="fs-actions">
          <button className="fs-btn-primary" onClick={handleOpenAdd}>
            <span className="fs-btn-icon">+</span> Create Fee Structure
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="fs-kpi-grid">
        <div className="fs-kpi-card">
          <div className="fs-kpi-icon-wrap" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
            📐
          </div>
          <div className="fs-kpi-body">
            <span className="fs-kpi-label">Active Fee Structures</span>
            <div className="fs-kpi-val">{structures.length} Bills <span className="fs-kpi-sub">Approved</span></div>
          </div>
        </div>

        <div className="fs-kpi-card">
          <div className="fs-kpi-icon-wrap" style={{ background: "rgba(59, 130, 246, 0.15)", color: "#3b82f6" }}>
            🎓
          </div>
          <div className="fs-kpi-body">
            <span className="fs-kpi-label">Highest Term Bill</span>
            <div className="fs-kpi-val">GH₵ {highestFee.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
          </div>
        </div>

        <div className="fs-kpi-card">
          <div className="fs-kpi-icon-wrap" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b" }}>
            📊
          </div>
          <div className="fs-kpi-body">
            <span className="fs-kpi-label">Average Institutional Fee</span>
            <div className="fs-kpi-val">GH₵ {avgFee.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
          </div>
        </div>

        <div className="fs-kpi-card">
          <div className="fs-kpi-icon-wrap" style={{ background: "rgba(139, 92, 246, 0.15)", color: "#8b5cf6" }}>
            🔒
          </div>
          <div className="fs-kpi-body">
            <span className="fs-kpi-label">Audit Approval Gate</span>
            <div className="fs-kpi-val">Principal Seal <span className="fs-kpi-sub">Dame Eleanor Vance</span></div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="fs-toolbar">
        <div className="fs-filter-group">
          <label>Cohort Filter:</label>
          <select value={selectedCohort} onChange={(e) => setSelectedCohort(e.target.value)} className="fs-select">
            <option value="All">All Cohorts & Classes ({structures.length})</option>
            <option value="Grade 11-A">Grade 11-A (Science Track)</option>
            <option value="Grade 11-B">Grade 11-B (General Arts)</option>
            <option value="Grade 12-A">Grade 12-A (WASSCE Finalists)</option>
          </select>
        </div>
      </div>

      {/* Structure Cards Grid */}
      <div className="fs-structures-grid">
        {filteredStructures.map((s) => (
          <div key={s.id} className="fs-card">
            <div className="fs-card-head">
              <div>
                <span className="fs-cohort-pill">{s.cohort}</span>
                <h3 className="fs-card-title">{s.structureName}</h3>
                <span className="fs-card-ref">{s.id} • {s.term} ({s.academicYear})</span>
              </div>
              <div className="fs-total-box">
                <span className="fs-total-label">Total Term Bill</span>
                <div className="fs-total-amt">GH₵ {s.totalFee.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
              </div>
            </div>

            <div className="fs-items-list">
              <div className="fs-items-title">Itemized Billing Components:</div>
              {s.items.map((item, idx) => (
                <div key={idx} className="fs-item-row">
                  <span className="fs-item-name">• {item.categoryName}</span>
                  <strong className="fs-item-val">GH₵ {item.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong>
                </div>
              ))}
            </div>

            <div className="fs-card-foot">
              <span className="fs-status-tag">✓ {s.status}</span>
              <div className="fs-card-actions">
                <button className="fs-btn-edit" onClick={() => handleOpenEdit(s)}>
                  ✏️ Edit Structure
                </button>
                <button
                  className="fs-btn-invoice"
                  onClick={() => showToast(`Generated term invoices for all ${s.cohort} students based on ${s.id}!`)}
                >
                  🧾 Bill Cohort
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Structure Modal */}
      {modalOpen && (
        <div className="fs-modal-overlay">
          <div className="fs-modal-box">
            <div className="fs-modal-header">
              <div>
                <h3>{editingStructure ? "✏️ Edit Fee Structure" : "➕ Create Cohort Fee Structure"}</h3>
                <p>Select applicable fee categories and configure itemized tariffs in Ghanaian Cedi (GH₵).</p>
              </div>
              <button className="fs-modal-close" onClick={() => setModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveStructure} className="fs-modal-body">
              <div className="fs-form-field">
                <label>Structure Descriptive Title:</label>
                <input
                  type="text"
                  placeholder="e.g. Grade 11-A (Science) - Day Student Term 1 Bill"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                />
              </div>

              <div className="fs-form-grid">
                <div className="fs-form-field">
                  <label>Class Cohort:</label>
                  <select value={formCohort} onChange={(e) => setFormCohort(e.target.value)}>
                    <option value="Grade 11-A">Grade 11-A (Science Track)</option>
                    <option value="Grade 11-B">Grade 11-B (General Arts & Business)</option>
                    <option value="Grade 12-A">Grade 12-A (WASSCE Finalists)</option>
                    <option value="Grade 10-A">Grade 10-A (Foundation Division)</option>
                  </select>
                </div>

                <div className="fs-form-field">
                  <label>Academic Term & Year:</label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <select value={formTerm} onChange={(e) => setFormTerm(e.target.value)}>
                      <option value="Term 1">Term 1</option>
                      <option value="Term 2">Term 2</option>
                      <option value="Term 3">Term 3</option>
                    </select>
                    <select value={formYear} onChange={(e) => setFormYear(e.target.value)}>
                      <option value="2026/2027">2026/2027</option>
                      <option value="2027/2028">2027/2028</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="fs-items-selection-wrap">
                <label style={{ fontSize: "0.85rem", color: "#94a3b8", fontWeight: 700 }}>
                  Select Components to Include in Bill:
                </label>
                <div className="fs-categories-checklist">
                  {categories.map((cat) => {
                    const isSelected = selectedItems.some((i) => i.categoryName === cat.name);
                    const currentItem = selectedItems.find((i) => i.categoryName === cat.name);
                    return (
                      <div
                        key={cat.id}
                        className={`fs-cat-checkbox-row ${isSelected ? "selected" : ""}`}
                      >
                        <label className="fs-checkbox-label">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleItem(cat)}
                          />
                          <span>{cat.name} ({cat.feeType})</span>
                        </label>
                        {isSelected && (
                          <div className="fs-cat-custom-amt">
                            <span>GH₵</span>
                            <input
                              type="number"
                              step="50"
                              value={currentItem ? currentItem.amount : cat.standardAmount}
                              onChange={(e) => handleItemAmountChange(cat.name, e.target.value)}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="fs-live-total-bar">
                <span>Calculated Total Term Bill:</span>
                <strong style={{ color: "#34d399", fontSize: "1.2rem" }}>
                  GH₵ {calculatedTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </strong>
              </div>

              <div className="fs-modal-footer">
                <button type="button" className="fs-btn-cancel" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="fs-btn-save">
                  {editingStructure ? "Commit Changes" : "Approve & Save Structure"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
