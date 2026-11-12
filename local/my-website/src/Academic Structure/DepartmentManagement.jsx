import React, { useState } from "react";
import AcademicNav from "./AcademicNav";
import "./DepartmentManagement.css";
import { DEPARTMENTS_LIST } from "./academicData";
import SpinningWordsBackground from "../components/SpinningWordsBackground";
import MotivationQuoteWidget from "../components/MotivationQuoteWidget";

export default function DepartmentManagement({ onNavigate }) {
  const [departments, setDepartments] = useState(DEPARTMENTS_LIST);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    hod: "",
    email: "",
    phone: "",
    location: "",
    facultyCount: 10,
    annualBudget: "GH₵250,000.00",
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenModal = (dept = null) => {
    if (dept) {
      setEditingDept(dept);
      setFormData({
        code: dept.code,
        name: dept.name,
        hod: dept.hod,
        email: dept.email,
        phone: dept.phone,
        location: dept.location,
        facultyCount: dept.facultyCount,
        annualBudget: dept.annualBudget,
      });
    } else {
      setEditingDept(null);
      setFormData({
        code: "",
        name: "",
        hod: "",
        email: "",
        phone: "+233 ",
        location: "",
        facultyCount: 8,
        annualBudget: "GH₵250,000.00",
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveDept = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      showToast("Please provide Department Code and Name.");
      return;
    }

    if (editingDept) {
      setDepartments((prev) =>
        prev.map((d) =>
          d.id === editingDept.id
            ? {
                ...d,
                ...formData,
                facultyCount: Number(formData.facultyCount),
              }
            : d
        )
      );
      showToast(`Updated Department: ${formData.name}`);
    } else {
      const newDept = {
        id: `DPT-0${departments.length + 1}`,
        code: formData.code.toUpperCase(),
        name: formData.name,
        hod: formData.hod || "Appointed HOD",
        email: formData.email,
        phone: formData.phone,
        location: formData.location || "Main Academic Wing",
        facultyCount: Number(formData.facultyCount),
        subjectsCount: 4,
        annualBudget: formData.annualBudget.startsWith("GH₵")
          ? formData.annualBudget
          : `GH₵${formData.annualBudget}`,
        status: "Active",
      };
      setDepartments((prev) => [...prev, newDept]);
      showToast(`Created new Department: ${formData.name}`);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove the ${name}?`)) {
      setDepartments((prev) => prev.filter((d) => d.id !== id));
      showToast(`Removed ${name}`);
    }
  };

  const filteredDepts = departments.filter((d) => {
    const q = searchQuery.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      d.code.toLowerCase().includes(q) ||
      d.hod.toLowerCase().includes(q) ||
      d.location.toLowerCase().includes(q)
    );
  });

  const totalFaculty = departments.reduce((acc, d) => acc + d.facultyCount, 0);

  return (
    <div className="dpm-page-wrapper">
      <SpinningWordsBackground speed="slow" showControlBadge={false} />

      {/* Toast Alert */}
      {toastMessage && <div className="dpm-toast">✓ {toastMessage}</div>}

      <AcademicNav
        activePath="/department-management"
        title="Department Management"
        subtitle="Organize faculties, heads of departments, budgets (GH₵), and laboratories"
      />

      <MotivationQuoteWidget compact={true} />

      {/* KPI Stats Strip */}
      <div className="dpm-kpi-grid">
        <div className="dpm-kpi-card">
          <div className="dpm-kpi-top">
            <span className="dpm-kpi-label">Academic Departments</span>
            <span className="dpm-kpi-icon">🏢</span>
          </div>
          <div className="dpm-kpi-val">{departments.length} Divisions</div>
          <div className="dpm-kpi-sub">Sciences, Humanities, Tech & Arts</div>
        </div>

        <div className="dpm-kpi-card">
          <div className="dpm-kpi-top">
            <span className="dpm-kpi-label">Teaching Staff Deployed</span>
            <span className="dpm-kpi-icon">👨‍🏫</span>
          </div>
          <div className="dpm-kpi-val" style={{ color: "#38bdf8" }}>
            {totalFaculty} Professors & Masters
          </div>
          <div className="dpm-kpi-sub">Assigned Across Departments</div>
        </div>

        <div className="dpm-kpi-card">
          <div className="dpm-kpi-top">
            <span className="dpm-kpi-label">Total Department Budget</span>
            <span className="dpm-kpi-icon">₵</span>
          </div>
          <div className="dpm-kpi-val" style={{ color: "#34d399" }}>
            GH₵1,325,000.00
          </div>
          <div className="dpm-kpi-sub">Annual Academic Operating Fund</div>
        </div>

        <div className="dpm-kpi-card">
          <div className="dpm-kpi-top">
            <span className="dpm-kpi-label">Department Leadership</span>
            <span className="dpm-kpi-icon">⭐</span>
          </div>
          <div className="dpm-kpi-val" style={{ color: "#fbbf24" }}>
            100% Appointed
          </div>
          <div className="dpm-kpi-sub">All HOD Offices Active</div>
        </div>
      </div>

      {/* Action / Search Bar */}
      <div className="dpm-action-bar">
        <div className="dpm-search-box">
          <span className="dpm-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search department name, HOD master, code, or office..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="dpm-clear-btn"
              onClick={() => setSearchQuery("")}
            >
              ×
            </button>
          )}
        </div>

        <button
          type="button"
          className="dpm-btn-primary"
          onClick={() => handleOpenModal()}
        >
          <span>＋</span> Create Department
        </button>
      </div>

      {/* Departments Cards Grid */}
      <div className="dpm-cards-grid">
        {filteredDepts.map((d) => (
          <div key={d.id} className="dpm-card">
            <div className="dpm-card-top">
              <div className="dpm-code-badge">{d.code}</div>
              <span className="dpm-status-pill">● {d.status}</span>
            </div>

            <h3 className="dpm-dept-name">{d.name}</h3>

            <div className="dpm-hod-card">
              <div className="dpm-hod-label">Head of Department (HOD)</div>
              <div className="dpm-hod-name">👨‍🏫 {d.hod}</div>
              <div className="dpm-hod-contacts">
                <span>✉ {d.email}</span>
                <span>•</span>
                <span>📞 {d.phone}</span>
              </div>
            </div>

            <div className="dpm-details-list">
              <div className="dpm-detail-item">
                <span className="dpm-detail-label">Office Location:</span>
                <span className="dpm-detail-val">📍 {d.location}</span>
              </div>
              <div className="dpm-detail-item">
                <span className="dpm-detail-label">Assigned Faculty:</span>
                <span className="dpm-detail-val">👥 {d.facultyCount} Members</span>
              </div>
              <div className="dpm-detail-item">
                <span className="dpm-detail-label">Curriculum Subjects:</span>
                <span className="dpm-detail-val">📚 {d.subjectsCount} Subjects</span>
              </div>
              <div className="dpm-detail-item">
                <span className="dpm-detail-label">Annual Budget:</span>
                <span className="dpm-detail-val dpm-budget-highlight">
                  ₵ {d.annualBudget}
                </span>
              </div>
            </div>

            <div className="dpm-card-footer">
              <span className="dpm-academic-status">✓ Operational</span>
              <div className="dpm-actions-group">
                <button
                  type="button"
                  className="dpm-btn-sm"
                  onClick={() => handleOpenModal(d)}
                  title="Edit Department"
                >
                  ✏️ Edit
                </button>
                <button
                  type="button"
                  className="dpm-btn-sm dpm-btn-danger"
                  onClick={() => handleDelete(d.id, d.name)}
                  title="Delete Department"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDepts.length === 0 && (
        <div className="dpm-empty-state">
          <p>No departments match your search query.</p>
          <button
            type="button"
            className="dpm-btn-primary"
            onClick={() => setSearchQuery("")}
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="dpm-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="dpm-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dpm-modal-header">
              <h2>{editingDept ? "Edit Department" : "Create Academic Department"}</h2>
              <button
                type="button"
                className="dpm-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveDept} className="dpm-modal-form">
              <div className="dpm-form-row">
                <div className="dpm-form-group">
                  <label>Department Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SCI-MATH, COMP-AI"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                  />
                </div>
                <div className="dpm-form-group">
                  <label>Annual Budget (GH₵)</label>
                  <input
                    type="text"
                    placeholder="e.g. GH₵350,000.00"
                    value={formData.annualBudget}
                    onChange={(e) =>
                      setFormData({ ...formData, annualBudget: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="dpm-form-group">
                <label>Department Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Department of Sciences & Mathematics"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="dpm-form-row">
                <div className="dpm-form-group">
                  <label>Head of Department (HOD)</label>
                  <input
                    type="text"
                    placeholder="e.g. Mr. Kofi Annan"
                    value={formData.hod}
                    onChange={(e) =>
                      setFormData({ ...formData, hod: e.target.value })
                    }
                  />
                </div>
                <div className="dpm-form-group">
                  <label>Faculty Count</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.facultyCount}
                    onChange={(e) =>
                      setFormData({ ...formData, facultyCount: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="dpm-form-row">
                <div className="dpm-form-group">
                  <label>Official Email</label>
                  <input
                    type="email"
                    placeholder="e.g. science.hod@faculty.school.edu"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className="dpm-form-group">
                  <label>Contact Phone</label>
                  <input
                    type="text"
                    placeholder="e.g. +233 20 782 1109"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="dpm-form-group">
                <label>Office & Wing Location</label>
                <input
                  type="text"
                  placeholder="e.g. Science Complex, Floor 2, Suite 201"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>

              <div className="dpm-modal-footer">
                <button
                  type="button"
                  className="dpm-btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="dpm-btn-primary">
                  {editingDept ? "Save Department" : "Create Department"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
