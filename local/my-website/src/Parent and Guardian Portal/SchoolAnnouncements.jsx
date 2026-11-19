import React, { useState } from "react";
import ParentNav from "./ParentNav";
import { SCHOOL_ANNOUNCEMENTS } from "./parentData";
import "./SchoolAnnouncements.css";

export default function SchoolAnnouncements() {
  const [announcements, setAnnouncements] = useState(SCHOOL_ANNOUNCEMENTS);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [starredIds, setStarredIds] = useState([]);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const toggleStar = (id) => {
    if (starredIds.includes(id)) {
      setStarredIds(starredIds.filter((item) => item !== id));
      showToast("Notice unstarred.");
    } else {
      setStarredIds([...starredIds, id]);
      showToast("Notice starred for quick access!");
    }
  };

  const handleDownloadAttachment = (filename) => {
    showToast(`Downloading official school circular: ${filename}...`);
  };

  const filtered = announcements.filter((ann) => {
    if (categoryFilter !== "All" && ann.category !== categoryFilter) return false;
    if (searchTerm.trim() !== "") {
      const q = searchTerm.toLowerCase();
      const matchTitle = ann.title.toLowerCase().includes(q);
      const matchSummary = ann.summary.toLowerCase().includes(q);
      const matchVenue = ann.venue.toLowerCase().includes(q);
      if (!matchTitle && !matchSummary && !matchVenue) return false;
    }
    return true;
  });

  return (
    <div className="sa-container">
      <ParentNav
        title="Official School Circulars & Notices"
        subtitle="Stay informed on upcoming PTA meetings, term schedules, academic policies, and campus events"
        badge="Module 11 • Screen 8 of 10"
      />

      {toast && (
        <div className={`sa-toast sa-toast-${toast.type}`}>
          <div className="sa-toast-dot" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="sa-header">
        <div className="sa-title-box">
          <span className="sa-tag">PARENT NOTIFICATION BULLETIN</span>
          <h1 className="sa-title">School Notices & Announcements</h1>
          <p className="sa-subtitle">
            Authenticated communiqués issued by the Office of the Head Principal, Academic Board,
            and Parent-Teacher Association (PTA) Directorate.
          </p>
        </div>
      </div>

      {/* Toolbar & Filter */}
      <div className="sa-toolbar">
        <div className="sa-search-box">
          <span className="sa-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search circulars by keyword, venue, or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="sa-search-clear" onClick={() => setSearchTerm("")}>✕</button>
          )}
        </div>

        <div className="sa-filters">
          <label>Category:</label>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="All">All Categories ({announcements.length})</option>
            <option value="Administrative & Governance">Administrative & Governance</option>
            <option value="Academic Assessment">Academic Assessment</option>
            <option value="Sports & Co-Curricular">Sports & Co-Curricular</option>
            <option value="Health & Wellbeing">Health & Wellbeing</option>
          </select>
        </div>
      </div>

      {/* Announcements Stream */}
      <div className="sa-stream-list">
        {filtered.length === 0 ? (
          <div className="sa-empty">No announcements found matching the current search criteria.</div>
        ) : (
          filtered.map((item) => {
            const isStarred = starredIds.includes(item.id);
            return (
              <div key={item.id} className="sa-card">
                <div className="sa-card-top">
                  <div className="sa-tags-row">
                    <span
                      className={`sa-urgency-badge ${
                        item.urgency === "High Priority"
                          ? "high"
                          : item.urgency === "Event"
                          ? "event"
                          : "notice"
                      }`}
                    >
                      ● {item.urgency}
                    </span>
                    <span className="sa-category-tag">{item.category}</span>
                  </div>

                  <button
                    className={`sa-star-btn ${isStarred ? "starred" : ""}`}
                    onClick={() => toggleStar(item.id)}
                    title={isStarred ? "Unstar notice" : "Star notice"}
                  >
                    {isStarred ? "★ Starred" : "☆ Star"}
                  </button>
                </div>

                <h2 className="sa-card-title">{item.title}</h2>
                <p className="sa-card-summary">{item.summary}</p>

                <div className="sa-meta-grid">
                  <div>
                    <small>Date & Time:</small>
                    <strong>📅 {item.date} • {item.time}</strong>
                  </div>
                  <div>
                    <small>Venue / Location:</small>
                    <strong>📍 {item.venue}</strong>
                  </div>
                  <div>
                    <small>Issued By:</small>
                    <strong>✍️ {item.publishedBy}</strong>
                  </div>
                </div>

                {item.attachment && (
                  <div className="sa-attachment-bar">
                    <span className="sa-file-icon">📄</span>
                    <span>Official Circular Attachment: <strong>{item.attachment}</strong></span>
                    <button
                      className="sa-btn-download"
                      onClick={() => handleDownloadAttachment(item.attachment)}
                    >
                      📥 Download PDF
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
