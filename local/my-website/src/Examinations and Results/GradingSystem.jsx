import React, { useState } from "react";
import "./GradingSystem.css";
import ExamNav from "./ExamNav";
import { getGradingScales, saveGradingScales } from "./examData";
import SpinningWordsBackground from "../components/SpinningWordsBackground";
import DailyQuotePopupModal from "../components/DailyQuotePopupModal";

export default function GradingSystem() {
  const [scales, setScales] = useState(() => getGradingScales());
  const [activeScaleId, setActiveScaleId] = useState(() => {
    const active = scales.find((s) => s.isActive);
    return active ? active.id : scales[0].id;
  });

  const [testScore, setTestScore] = useState(82.5);
  const [toastMessage, setToastMessage] = useState(null);
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const currentScale = scales.find((s) => s.id === activeScaleId) || scales[0];

  const handleSetActiveScale = (id) => {
    const updated = scales.map((s) => ({
      ...s,
      isActive: s.id === id,
    }));
    setActiveScaleId(id);
    setScales(updated);
    saveGradingScales(updated);
    const chosen = updated.find((s) => s.id === id);
    showToast(`"${chosen.name}" activated as the school default grading system!`);
  };

  const handleOpenEditGrade = (gradeObj) => {
    setEditingGrade({ ...gradeObj });
    setIsEditingModalOpen(true);
  };

  const handleSaveGradeBoundary = (e) => {
    e.preventDefault();
    const updatedGrades = currentScale.grades.map((g) =>
      g.grade === editingGrade.grade ? editingGrade : g
    );

    const updatedScales = scales.map((s) =>
      s.id === currentScale.id ? { ...s, grades: updatedGrades } : s
    );

    setScales(updatedScales);
    saveGradingScales(updatedScales);
    setIsEditingModalOpen(false);
    showToast(`Grade boundary for "${editingGrade.grade}" updated successfully!`);
  };

  // Simulation test against active scale
  const simulatedGrade = currentScale.grades.find(
    (g) => testScore >= g.minScore && testScore <= g.maxScore
  ) || currentScale.grades[currentScale.grades.length - 1];

  return (
    <div className="gs-page-wrapper">
      <SpinningWordsBackground speed="slow" />
      <DailyQuotePopupModal />

      {toastMessage && <div className="gs-toast">✓ {toastMessage}</div>}

      <ExamNav
        title="Grading System"
        subtitle="Configure academic grade boundaries, WASSCE / BECE mark thresholds, GPA weighting multipliers, and pass rules"
        badge="Screen 7 of 12"
      />

      {/* Scale Switcher Tabs */}
      <div className="gs-switcher-bar">
        <div className="gs-switcher-tabs">
          {scales.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`gs-tab-btn ${s.id === activeScaleId ? "active" : ""}`}
              onClick={() => setActiveScaleId(s.id)}
            >
              <div className="gs-tab-title">{s.name}</div>
              <div className="gs-tab-sub">
                {s.applicableLevel} {s.isActive && <span className="gs-active-chip">● ACTIVE DEFAULT</span>}
              </div>
            </button>
          ))}
        </div>

        {!currentScale.isActive && (
          <button
            type="button"
            className="gs-btn-activate"
            onClick={() => handleSetActiveScale(currentScale.id)}
          >
            ★ Set as Active School Grading Scale
          </button>
        )}
      </div>

      {/* Interactive Grade Simulation Widget */}
      <div className="gs-simulator-card">
        <div className="gs-sim-left">
          <span className="gs-sim-badge">INTERACTIVE SCORE SIMULATOR</span>
          <h3 className="gs-sim-title">Live Score-to-Grade Validation Engine</h3>
          <p className="gs-sim-sub">
            Drag the slider or enter a test score to observe how the active boundary assigns WASSCE letter grades, GPA multipliers, and certification eligibility.
          </p>

          <div className="gs-slider-row">
            <input
              type="range"
              min="0"
              max="100"
              step="0.5"
              value={testScore}
              onChange={(e) => setTestScore(Number(e.target.value))}
              className="gs-range-slider"
            />
            <div className="gs-score-display">
              <span className="gs-score-num">{testScore}%</span>
            </div>
          </div>
        </div>

        <div className="gs-sim-right">
          <div className="gs-result-box">
            <div className="gs-result-top">Assigned Grade</div>
            <div className="gs-result-grade">{simulatedGrade?.grade}</div>
            <div className="gs-result-desc">{simulatedGrade?.description}</div>
            <div className="gs-result-meta">
              <span>GPA: <strong>{simulatedGrade?.gpaPoint.toFixed(2)}</strong></span>
              <span>•</span>
              <span style={{ color: simulatedGrade?.creditWorth ? "#34d399" : "#f87171" }}>
                {simulatedGrade?.creditWorth ? "✓ WAEC Credit Pass" : "⚠ Non-Credit Pass"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Boundaries Table */}
      <div className="gs-table-card">
        <div className="gs-table-header">
          <div>
            <h3 className="gs-table-title">Configured Grade Boundaries: {currentScale.name}</h3>
            <p className="gs-table-sub">Defines numerical mark ranges and corresponding classification descriptors</p>
          </div>
          <button
            type="button"
            className="gs-btn-export"
            onClick={() => showToast("Exporting official grading policy document...")}
          >
            📄 Export Policy Document
          </button>
        </div>

        <div className="gs-table-responsive">
          <table className="gs-table">
            <thead>
              <tr>
                <th>Grade Code</th>
                <th>Score Range (%)</th>
                <th>Classification / Descriptor</th>
                <th>GPA Multiplier</th>
                <th>Credit Eligible</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentScale.grades.map((g) => (
                <tr key={g.grade}>
                  <td>
                    <span className="gs-grade-code">{g.grade}</span>
                  </td>
                  <td>
                    <strong style={{ color: "#ffffff", fontFamily: "JetBrains Mono" }}>
                      {g.minScore}% – {g.maxScore}%
                    </strong>
                  </td>
                  <td>
                    <span className="gs-grade-desc">{g.description}</span>
                  </td>
                  <td>
                    <span className="gs-gpa-val">{g.gpaPoint.toFixed(2)}</span>
                  </td>
                  <td>
                    {g.creditWorth ? (
                      <span className="gs-credit-yes">✓ WASSCE Credit</span>
                    ) : (
                      <span className="gs-credit-no">✕ Weak / Non-Credit</span>
                    )}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="gs-btn-edit-boundary"
                      onClick={() => handleOpenEditGrade(g)}
                    >
                      ✏️ Edit Boundary
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Boundary Modal */}
      {isEditingModalOpen && editingGrade && (
        <div className="gs-modal-backdrop" onClick={() => setIsEditingModalOpen(false)}>
          <div className="gs-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="gs-modal-header">
              <h3 className="gs-modal-title">✏️ Edit Boundary: Grade {editingGrade.grade}</h3>
              <button
                type="button"
                className="gs-modal-close"
                onClick={() => setIsEditingModalOpen(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveGradeBoundary} className="gs-modal-form">
              <div className="gs-form-row">
                <div className="gs-form-group">
                  <label>Minimum Score (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={editingGrade.minScore}
                    onChange={(e) => setEditingGrade({ ...editingGrade, minScore: Number(e.target.value) })}
                  />
                </div>
                <div className="gs-form-group">
                  <label>Maximum Score (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={editingGrade.maxScore}
                    onChange={(e) => setEditingGrade({ ...editingGrade, maxScore: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="gs-form-row">
                <div className="gs-form-group">
                  <label>GPA Point Multiplier</label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    max="5.0"
                    required
                    value={editingGrade.gpaPoint}
                    onChange={(e) => setEditingGrade({ ...editingGrade, gpaPoint: Number(e.target.value) })}
                  />
                </div>
                <div className="gs-form-group">
                  <label>Classification Descriptor</label>
                  <input
                    type="text"
                    required
                    value={editingGrade.description}
                    onChange={(e) => setEditingGrade({ ...editingGrade, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="gs-form-group">
                <label className="gs-checkbox-label">
                  <input
                    type="checkbox"
                    checked={editingGrade.creditWorth}
                    onChange={(e) => setEditingGrade({ ...editingGrade, creditWorth: e.target.checked })}
                  />
                  <span>Counts as WAEC / Tertiary credit-worthy qualifying pass</span>
                </label>
              </div>

              <div className="gs-modal-actions">
                <button
                  type="button"
                  className="gs-btn-cancel"
                  onClick={() => setIsEditingModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gs-btn-submit"
                >
                  Save Boundary Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
