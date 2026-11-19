import React, { useState } from "react";
import StudentNav from "./StudentNav";
import { LEARNING_MATERIALS } from "./studentPortalData";
import "./LearningMaterials.css";

const CATEGORIES = ["All Types", "Lecture Slides", "Lab Manual", "Past Papers", "Reference Guide", "Syllabus & Guide"];

export default function LearningMaterials() {
  const [materials] = useState(LEARNING_MATERIALS);
  const [selectedCategory, setSelectedCategory] = useState("All Types");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewDoc, setPreviewDoc] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  const handleDownload = (doc) => {
    showToast(`Downloading "${doc.title}" (${doc.size} ${doc.format})...`);
  };

  const filteredMaterials = materials.filter((item) => {
    if (selectedCategory !== "All Types" && item.category !== selectedCategory) return false;
    if (selectedSubject !== "All" && item.subject !== selectedSubject) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchTeacher = item.uploadedBy.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchTeacher) return false;
    }
    return true;
  });

  const subjectsList = ["All", ...Array.from(new Set(materials.map((m) => m.subject)))];

  return (
    <div className="lm-page-container">
      {toast && (
        <div className="lm-toast">
          <span>✓</span> {toast}
        </div>
      )}

      <StudentNav
        title="Digital Academic Library & Learning Materials"
        subtitle="Access teacher-uploaded lecture slides, laboratory manuals, past WASSCE questions, and study packs"
        badge="Module 12 • Screen 7 of 10"
      />

      {/* Header Banner */}
      <div className="lm-header-strip">
        <div>
          <span className="lm-tag">CENTRAL ACADEMIC REPOSITORY</span>
          <h1 className="lm-title">Course Learning Materials</h1>
          <p className="lm-sub">
            Download authorized revision decks, practical lab handbooks, and model exam solutions
            uploaded directly by subject masters.
          </p>
        </div>

        <div className="lm-header-stats">
          <div className="lm-stat-chip">
            <span>📚 Total Modules:</span>
            <strong>{materials.length} Resources</strong>
          </div>
        </div>
      </div>

      {/* Toolbar Filter Strip */}
      <div className="lm-toolbar">
        <div className="lm-search-box">
          <span className="lm-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search study materials, topics, or faculty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="lm-clear-btn" onClick={() => setSearchQuery("")}>
              ✕
            </button>
          )}
        </div>

        <div className="lm-filters">
          <div className="lm-filter-group">
            <label>Subject Course:</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              {subjectsList.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          <div className="lm-filter-group">
            <label>Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="lm-grid">
        {filteredMaterials.map((mat) => (
          <div key={mat.id} className="lm-card">
            <div className="lm-card-top">
              <span className="lm-format-badge font-mono">{mat.format}</span>
              <span className="lm-cat-tag">{mat.category}</span>
            </div>

            <div className="lm-subject-tag">{mat.subject}</div>
            <h3 className="lm-card-title">{mat.title}</h3>
            <p className="lm-card-desc">{mat.description}</p>

            <div className="lm-meta-grid">
              <div>
                <small>Faculty:</small>
                <strong>{mat.uploadedBy}</strong>
              </div>
              <div>
                <small>File Size:</small>
                <span className="font-mono">{mat.size}</span>
              </div>
              <div>
                <small>Uploaded:</small>
                <span>{mat.uploadDate}</span>
              </div>
            </div>

            <div className="lm-card-actions">
              <button
                className="lm-btn-preview"
                onClick={() => setPreviewDoc(mat)}
              >
                👁️ Preview
              </button>
              <button
                className="lm-btn-download"
                onClick={() => handleDownload(mat)}
              >
                📥 Download ({mat.format})
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Document Reader Preview Modal */}
      {previewDoc && (
        <div className="lm-modal-backdrop" onClick={() => setPreviewDoc(null)}>
          <div className="lm-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="lm-modal-header">
              <div>
                <span className="lm-modal-sub">{previewDoc.subject} • {previewDoc.category}</span>
                <h3>{previewDoc.title}</h3>
              </div>
              <button className="lm-modal-close" onClick={() => setPreviewDoc(null)}>
                ✕
              </button>
            </div>

            <div className="lm-preview-body">
              <div className="lm-preview-placeholder">
                <div className="lm-preview-icon">📄</div>
                <h4>{previewDoc.format} Document Viewer Simulation</h4>
                <p>
                  Viewing official curriculum resource compiled by <strong>{previewDoc.uploadedBy}</strong> on{" "}
                  {previewDoc.uploadDate}.
                </p>
                <div className="lm-preview-abstract">
                  <strong>Resource Abstract:</strong>
                  <p>{previewDoc.description}</p>
                </div>
              </div>
            </div>

            <div className="lm-modal-footer">
              <button className="lm-btn-close" onClick={() => setPreviewDoc(null)}>
                Close Preview
              </button>
              <button
                className="lm-btn-download-modal"
                onClick={() => {
                  handleDownload(previewDoc);
                  setPreviewDoc(null);
                }}
              >
                📥 Save {previewDoc.format} File to Device ({previewDoc.size})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
