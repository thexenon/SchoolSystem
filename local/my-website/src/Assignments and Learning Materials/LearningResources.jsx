import React, { useState } from "react";
import AssignmentNav from "./AssignmentNav";
import { getResources, saveResources } from "./assignmentData";
import "./LearningResources.css";

const CATEGORIES = [
  "All Categories",
  "Lecture Slides",
  "Lab Manual",
  "Past Papers",
  "Reference Guide",
  "Lecture Notes",
  "Syllabus Guide",
];

const SUBJECTS = [
  "All Subjects",
  "Core Mathematics",
  "Advanced Physics",
  "Chemistry",
  "Computer Science",
  "English Literature",
];

export default function LearningResources() {
  const [resources, setResources] = useState(getResources());
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [toast, setToast] = useState(null);

  // Upload Form State
  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState("Core Mathematics");
  const [newCategory, setNewCategory] = useState("Lecture Slides");
  const [newClass, setNewClass] = useState("Grade 11-A");
  const [newFormat, setNewFormat] = useState("PDF");
  const [newDesc, setNewDesc] = useState("");
  const [newFileName, setNewFileName] = useState("");

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  const handleDownload = (doc) => {
    showToast(`Downloading "${doc.title}" (${doc.fileSize} ${doc.fileFormat})...`);
  };

  const handleCreateResource = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) {
      showToast("Please provide both a title and curriculum description.");
      return;
    }

    const created = {
      id: `RES-${String(Math.floor(Math.random() * 800 + 100))}`,
      title: newTitle.trim(),
      subject: newSubject,
      subjectCode: newSubject === "Core Mathematics" ? "MTH-401" : "PHY-302",
      category: newCategory,
      targetClass: newClass,
      fileFormat: newFormat,
      fileSize: "3.5 MB",
      uploadedBy: "Faculty Instructor",
      uploadDate: new Date().toISOString().split("T")[0],
      downloads: 1,
      description: newDesc.trim(),
      url: newFileName || "Curriculum_Resource.pdf",
    };

    const updated = [created, ...resources];
    setResources(updated);
    saveResources(updated);

    setShowUploadModal(false);
    setNewTitle("");
    setNewDesc("");
    setNewFileName("");
    showToast(`Learning resource "${created.title}" published to academic library!`);
  };

  const filteredResources = resources.filter((item) => {
    if (selectedCategory !== "All Categories" && item.category !== selectedCategory) return false;
    if (selectedSubject !== "All Subjects" && item.subject !== selectedSubject) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchAuthor = item.uploadedBy.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchAuthor) return false;
    }
    return true;
  });

  const totalDownloads = resources.reduce((acc, curr) => acc + curr.downloads, 0);

  return (
    <div className="lr-page-container">
      {toast && (
        <div className="lr-toast">
          <span>✓</span> {toast}
        </div>
      )}

      <AssignmentNav
        title="Central Academic Learning Resources Repository"
        subtitle="Organize, index and distribute faculty lecture slides, laboratory manuals, past WASSCE questions, and study packs"
        badge="Module 13 • Screen 7 of 7"
      />

      {/* Header Banner */}
      <div className="lr-header-strip">
        <div>
          <span className="lr-tag">INSTITUTIONAL CURRICULUM ARCHIVE</span>
          <h1 className="lr-title">Learning Resources & Courseware</h1>
          <p className="lr-sub">
            Organized study materials, syllabus guides, reference manuals, and examination revision archives.
          </p>
        </div>

        <div className="lr-header-actions">
          <button className="lr-btn-upload" onClick={() => setShowUploadModal(true)}>
            📤 Upload Learning Resource
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="lr-kpi-grid">
        <div className="lr-kpi-card">
          <span className="lr-kpi-label">Catalog Resources</span>
          <div className="lr-kpi-val text-cyan">{resources.length} Modules</div>
          <span className="lr-kpi-sub">Across senior & middle streams</span>
        </div>

        <div className="lr-kpi-card">
          <span className="lr-kpi-label">Total Student Downloads</span>
          <div className="lr-kpi-val text-emerald">{totalDownloads} Downloads</div>
          <span className="lr-kpi-sub">Digital library bandwidth</span>
        </div>

        <div className="lr-kpi-card">
          <span className="lr-kpi-label">Past Question Papers</span>
          <div className="lr-kpi-val text-amber">
            {resources.filter((r) => r.category === "Past Papers").length} Archives
          </div>
          <span className="lr-kpi-sub">WASSCE & Cambridge syllabi</span>
        </div>

        <div className="lr-kpi-card">
          <span className="lr-kpi-label">Lab Manuals & Practical Decks</span>
          <div className="lr-kpi-val text-purple">
            {resources.filter((r) => r.category === "Lab Manual").length} Handbooks
          </div>
          <span className="lr-kpi-sub">STEM science laboratory practicals</span>
        </div>
      </div>

      {/* Toolbar Strip */}
      <div className="lr-toolbar">
        <div className="lr-search-box">
          <span className="lr-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search study packs, slide topics, or teachers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="lr-clear-btn" onClick={() => setSearchQuery("")}>
              ✕
            </button>
          )}
        </div>

        <div className="lr-filters">
          <div className="lr-filter-item">
            <label>Subject:</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="lr-filter-item">
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

      {/* Resources Cards Grid */}
      <div className="lr-grid">
        {filteredResources.map((res) => (
          <div key={res.id} className="lr-card">
            <div className="lr-card-top">
              <span className="lr-format-pill font-mono">{res.fileFormat}</span>
              <span className="lr-cat-pill">{res.category}</span>
            </div>

            <div className="lr-subject-tag">{res.subject} • {res.targetClass}</div>
            <h3 className="lr-card-title">{res.title}</h3>
            <p className="lr-card-desc">{res.description}</p>

            <div className="lr-meta-box">
              <div className="lr-meta-row">
                <span>👨‍🏫 Uploaded By:</span>
                <strong>{res.uploadedBy}</strong>
              </div>
              <div className="lr-meta-row">
                <span>📅 Date Posted:</span>
                <span className="font-mono">{res.uploadDate}</span>
              </div>
              <div className="lr-meta-row">
                <span>📦 File Size:</span>
                <span className="font-mono text-cyan">{res.fileSize}</span>
              </div>
              <div className="lr-meta-row">
                <span>📥 Total Downloads:</span>
                <strong className="text-emerald font-mono">{res.downloads}</strong>
              </div>
            </div>

            <div className="lr-card-actions">
              <button
                className="lr-btn-preview"
                onClick={() => setPreviewDoc(res)}
              >
                👁️ Preview Resource
              </button>
              <button
                className="lr-btn-download"
                onClick={() => handleDownload(res)}
              >
                📥 Download File
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Resource Modal */}
      {showUploadModal && (
        <div className="lr-modal-backdrop" onClick={() => setShowUploadModal(false)}>
          <div className="lr-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="lr-modal-header">
              <h3>Upload New Learning Resource</h3>
              <button className="lr-modal-close" onClick={() => setShowUploadModal(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateResource}>
              <div className="lr-form-group">
                <label>Resource Title *</label>
                <input
                  type="text"
                  placeholder="e.g., Organic Reaction Mechanisms Comprehensive Handbook"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div className="lr-form-row">
                <div className="lr-form-group">
                  <label>Subject Discipline</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                  >
                    <option value="Core Mathematics">Core Mathematics</option>
                    <option value="Advanced Physics">Advanced Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="English Literature">English Literature</option>
                  </select>
                </div>

                <div className="lr-form-group">
                  <label>Resource Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  >
                    <option value="Lecture Slides">Lecture Slides</option>
                    <option value="Lab Manual">Lab Manual</option>
                    <option value="Past Papers">Past Papers</option>
                    <option value="Reference Guide">Reference Guide</option>
                    <option value="Lecture Notes">Lecture Notes</option>
                    <option value="Syllabus Guide">Syllabus Guide</option>
                  </select>
                </div>
              </div>

              <div className="lr-form-row">
                <div className="lr-form-group">
                  <label>Target Academic Division</label>
                  <select
                    value={newClass}
                    onChange={(e) => setNewClass(e.target.value)}
                  >
                    <option value="Grade 11-A">Grade 11-A</option>
                    <option value="Grade 11-B">Grade 11-B</option>
                    <option value="Grade 12 Finalists">Grade 12 Finalists</option>
                    <option value="Grade 10">Grade 10</option>
                    <option value="All Divisions">All Divisions</option>
                  </select>
                </div>

                <div className="lr-form-group">
                  <label>Document Format</label>
                  <select
                    value={newFormat}
                    onChange={(e) => setNewFormat(e.target.value)}
                  >
                    <option value="PDF">PDF (.pdf)</option>
                    <option value="DOCX">DOCX (.docx)</option>
                    <option value="ZIP">ZIP Archive (.zip)</option>
                    <option value="PPTX">PowerPoint (.pptx)</option>
                  </select>
                </div>
              </div>

              <div className="lr-form-group">
                <label>Resource Abstract / Description *</label>
                <textarea
                  rows={3}
                  placeholder="Summarize the learning contents, weekly syllabus coverage, and learning objectives..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  required
                />
              </div>

              <div className="lr-form-group">
                <label>Select Document File:</label>
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setNewFileName(e.target.files[0].name);
                    }
                  }}
                />
                {newFileName && (
                  <span style={{ fontSize: "0.82rem", color: "#34d399", marginTop: "4px" }}>
                    ✅ Selected: {newFileName}
                  </span>
                )}
              </div>

              <div className="lr-modal-footer">
                <button
                  type="button"
                  className="lr-btn-cancel"
                  onClick={() => setShowUploadModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="lr-btn-confirm-upload">
                  🚀 Publish to Digital Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewDoc && (
        <div className="lr-modal-backdrop" onClick={() => setPreviewDoc(null)}>
          <div className="lr-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="lr-modal-header">
              <div>
                <span className="lr-modal-sub">{previewDoc.subject} • {previewDoc.category}</span>
                <h3>{previewDoc.title}</h3>
              </div>
              <button className="lr-modal-close" onClick={() => setPreviewDoc(null)}>
                ✕
              </button>
            </div>

            <div className="lr-preview-body">
              <div className="lr-preview-icon">📚</div>
              <h4>Official Curriculum Study Material</h4>
              <p>Uploaded by <strong>{previewDoc.uploadedBy}</strong> on {previewDoc.uploadDate}.</p>
              <div className="lr-preview-abstract">
                <strong>Resource Abstract:</strong>
                <p>{previewDoc.description}</p>
              </div>
            </div>

            <div className="lr-modal-footer">
              <button className="lr-btn-cancel" onClick={() => setPreviewDoc(null)}>
                Close
              </button>
              <button
                className="lr-btn-confirm-upload"
                onClick={() => {
                  handleDownload(previewDoc);
                  setPreviewDoc(null);
                }}
              >
                📥 Download {previewDoc.fileFormat} ({previewDoc.fileSize})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
