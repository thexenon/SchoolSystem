import React, { useState } from "react";
import AcademicNav from "./AcademicNav";
import "./ProgrammeManagement.css";
import { PROGRAMMES_LIST, DEPARTMENTS_LIST } from "./academicData";
import SpinningWordsBackground from "../components/SpinningWordsBackground";
import MotivationQuoteWidget from "../components/MotivationQuoteWidget";

export default function ProgrammeManagement({ onNavigate }) {
  const [programmes, setProgrammes] = useState(PROGRAMMES_LIST);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProg, setEditingProg] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    degreeAwarded: "WASSCE Diploma",
    duration: "3 Academic Years",
    departmentName: "Department of Sciences & Mathematics",
    tuitionFeePerTerm: "GH₵3,450.00",
    creditsRequired: 30,
    accreditationStatus: "Fully Accredited (WAEC / GES)",
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenModal = (prog = null) => {
    if (prog) {
      setEditingProg(prog);
      setFormData({
        code: prog.code,
        name: prog.name,
        degreeAwarded: prog.degreeAwarded,
        duration: prog.duration,
        departmentName: prog.departmentName,
        tuitionFeePerTerm: prog.tuitionFeePerTerm,
        creditsRequired: prog.creditsRequired,
        accreditationStatus: prog.accreditationStatus,
      });
    } else {
      setEditingProg(null);
      setFormData({
        code: "",
        name: "",
        degreeAwarded: "WASSCE Diploma",
        duration: "3 Academic Years",
        departmentName: "Department of Sciences & Mathematics",
        tuitionFeePerTerm: "GH₵3,450.00",
        creditsRequired: 30,
        accreditationStatus: "Fully Accredited (WAEC / GES)",
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveProg = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      showToast("Please provide Programme Code and Name.");
      return;
    }

    if (editingProg) {
      setProgrammes((prev) =>
        prev.map((p) =>
          p.id === editingProg.id
            ? {
                ...p,
                ...formData,
                creditsRequired: Number(formData.creditsRequired),
                tuitionFeePerTerm: formData.tuitionFeePerTerm.startsWith("GH₵")
                  ? formData.tuitionFeePerTerm
                  : `GH₵${formData.tuitionFeePerTerm}`,
              }
            : p
        )
      );
      showToast(`Updated Programme: ${formData.name}`);
    } else {
      const newProg = {
        id: `PRG-00${programmes.length + 1}`,
        code: formData.code.toUpperCase(),
        name: formData.name,
        degreeAwarded: formData.degreeAwarded,
        duration: formData.duration,
        departmentName: formData.departmentName,
        tuitionFeePerTerm: formData.tuitionFeePerTerm.startsWith("GH₵")
          ? formData.tuitionFeePerTerm
          : `GH₵${formData.tuitionFeePerTerm}`,
        creditsRequired: Number(formData.creditsRequired),
        enrolledStudents: 0,
        accreditationStatus: formData.accreditationStatus,
        status: "Active",
      };
      setProgrammes((prev) => [...prev, newProg]);
      showToast(`Created new Programme: ${formData.name}`);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove programme "${name}"?`)) {
      setProgrammes((prev) => prev.filter((p) => p.id !== id));
      showToast(`Removed ${name}`);
    }
  };

  const filteredProgs = programmes.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      p.degreeAwarded.toLowerCase().includes(q) ||
      p.departmentName.toLowerCase().includes(q)
    );
  });

  const totalEnrolled = programmes.reduce((sum, p) => sum + p.enrolledStudents, 0);

  return (
    <div className="pgm-page-wrapper">
      <SpinningWordsBackground speed="slow" showControlBadge={false} />

      {/* Toast Alert */}
      {toastMessage && <div className="pgm-toast">✓ {toastMessage}</div>}

      <AcademicNav
        activePath="/programme-management"
        title="Programme Management"
        subtitle="School & tertiary degree programmes, certification, and tuition in GH₵"
      />

      <MotivationQuoteWidget compact={true} />

      {/* KPI Stats Strip */}
      <div className="pgm-kpi-grid">
        <div className="pgm-kpi-card">
          <div className="pgm-kpi-top">
            <span className="pgm-kpi-label">Offered Programmes</span>
            <span className="pgm-kpi-icon">🎓</span>
          </div>
          <div className="pgm-kpi-val">{programmes.length} Curricula</div>
          <div className="pgm-kpi-sub">WASSCE, Cambridge & Tertiary</div>
        </div>

        <div className="pgm-kpi-card">
          <div className="pgm-kpi-top">
            <span className="pgm-kpi-label">Programme Enrollees</span>
            <span className="pgm-kpi-icon">👥</span>
          </div>
          <div className="pgm-kpi-val" style={{ color: "#38bdf8" }}>
            {totalEnrolled.toLocaleString()} Students
          </div>
          <div className="pgm-kpi-sub">Active Enrolled Scholars</div>
        </div>

        <div className="pgm-kpi-card">
          <div className="pgm-kpi-top">
            <span className="pgm-kpi-label">Tuition Standard</span>
            <span className="pgm-kpi-icon">₵</span>
          </div>
          <div className="pgm-kpi-val" style={{ color: "#34d399" }}>
            Ghanaian Cedi (GH₵)
          </div>
          <div className="pgm-kpi-sub">MoMo, Bank & Card Enabled</div>
        </div>

        <div className="pgm-kpi-card">
          <div className="pgm-kpi-top">
            <span className="pgm-kpi-label">Accreditation</span>
            <span className="pgm-kpi-icon">📜</span>
          </div>
          <div className="pgm-kpi-val" style={{ color: "#fbbf24" }}>
            WAEC / GTEC
          </div>
          <div className="pgm-kpi-sub">Recognized Worldwide</div>
        </div>
      </div>

      {/* Action / Search Bar */}
      <div className="pgm-action-bar">
        <div className="pgm-search-box">
          <span className="pgm-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search programme title, degree, code, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="pgm-clear-btn"
              onClick={() => setSearchQuery("")}
            >
              ×
            </button>
          )}
        </div>

        <button
          type="button"
          className="pgm-btn-primary"
          onClick={() => handleOpenModal()}
        >
          <span>＋</span> Offer New Programme
        </button>
      </div>

      {/* Programmes Cards Grid */}
      <div className="pgm-cards-grid">
        {filteredProgs.map((p) => (
          <div key={p.id} className="pgm-card">
            <div className="pgm-card-top">
              <div className="pgm-code-badge">{p.code}</div>
              <span className="pgm-status-pill">● {p.status}</span>
            </div>

            <h3 className="pgm-prog-name">{p.name}</h3>

            <div className="pgm-degree-banner">
              <span>🏅 Award:</span> <strong>{p.degreeAwarded}</strong>
            </div>

            <div className="pgm-details-list">
              <div className="pgm-detail-item">
                <span className="pgm-detail-label">Curriculum Duration:</span>
                <span className="pgm-detail-val">⏳ {p.duration}</span>
              </div>
              <div className="pgm-detail-item">
                <span className="pgm-detail-label">Overseeing Dept:</span>
                <span className="pgm-detail-val">🏢 {p.departmentName}</span>
              </div>
              <div className="pgm-detail-item">
                <span className="pgm-detail-label">Total Credits:</span>
                <span className="pgm-detail-val">📚 {p.creditsRequired} Credit Units</span>
              </div>
              <div className="pgm-detail-item">
                <span className="pgm-detail-label">Tuition Fee / Term:</span>
                <span className="pgm-detail-val pgm-fee-highlight">
                  ₵ {p.tuitionFeePerTerm}
                </span>
              </div>
              <div className="pgm-detail-item">
                <span className="pgm-detail-label">Accreditation:</span>
                <span className="pgm-detail-val pgm-accred-text">
                  ✓ {p.accreditationStatus}
                </span>
              </div>
            </div>

            <div className="pgm-card-footer">
              <span className="pgm-enrolled-count">
                👥 {p.enrolledStudents} Scholars Enrolled
              </span>
              <div className="pgm-actions-group">
                <button
                  type="button"
                  className="pgm-btn-sm"
                  onClick={() => handleOpenModal(p)}
                  title="Edit Programme"
                >
                  ✏️ Edit
                </button>
                <button
                  type="button"
                  className="pgm-btn-sm pgm-btn-danger"
                  onClick={() => handleDelete(p.id, p.name)}
                  title="Delete Programme"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProgs.length === 0 && (
        <div className="pgm-empty-state">
          <p>No programmes match your search query.</p>
          <button
            type="button"
            className="pgm-btn-primary"
            onClick={() => setSearchQuery("")}
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="pgm-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="pgm-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="pgm-modal-header">
              <h2>{editingProg ? "Edit Programme" : "Create Academic Programme"}</h2>
              <button
                type="button"
                className="pgm-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveProg} className="pgm-modal-form">
              <div className="pgm-form-row">
                <div className="pgm-form-group">
                  <label>Programme Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. WASSCE-SCI, BSC-AI"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                  />
                </div>
                <div className="pgm-form-group">
                  <label>Tuition Fee Per Term (GH₵)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GH₵3,450.00"
                    value={formData.tuitionFeePerTerm}
                    onChange={(e) =>
                      setFormData({ ...formData, tuitionFeePerTerm: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="pgm-form-group">
                <label>Programme Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. General Science Senior High Programme"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="pgm-form-row">
                <div className="pgm-form-group">
                  <label>Degree / Certificate Awarded</label>
                  <input
                    type="text"
                    placeholder="e.g. WASSCE Diploma, B.Sc. Hons"
                    value={formData.degreeAwarded}
                    onChange={(e) =>
                      setFormData({ ...formData, degreeAwarded: e.target.value })
                    }
                  />
                </div>
                <div className="pgm-form-group">
                  <label>Programme Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 3 Academic Years"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="pgm-form-row">
                <div className="pgm-form-group">
                  <label>Department in Charge</label>
                  <select
                    value={formData.departmentName}
                    onChange={(e) =>
                      setFormData({ ...formData, departmentName: e.target.value })
                    }
                  >
                    {DEPARTMENTS_LIST.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="pgm-form-group">
                  <label>Credits Required</label>
                  <input
                    type="number"
                    min="10"
                    max="200"
                    value={formData.creditsRequired}
                    onChange={(e) =>
                      setFormData({ ...formData, creditsRequired: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="pgm-form-group">
                <label>Accreditation Body & Status</label>
                <input
                  type="text"
                  placeholder="e.g. Fully Accredited (WAEC / GES)"
                  value={formData.accreditationStatus}
                  onChange={(e) =>
                    setFormData({ ...formData, accreditationStatus: e.target.value })
                  }
                />
              </div>

              <div className="pgm-modal-footer">
                <button
                  type="button"
                  className="pgm-btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="pgm-btn-primary">
                  {editingProg ? "Save Programme" : "Create Programme"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
