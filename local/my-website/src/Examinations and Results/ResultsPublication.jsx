import React, { useState, useEffect } from "react";
import ExamNav from "./ExamNav";
import { getMarks, saveMarks, getAssessments } from "./examData";
import "./ResultsPublication.css";

export default function ResultsPublication() {
  const [marks, setMarks] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [selectedCohort, setSelectedCohort] = useState("All");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [toast, setToast] = useState(null);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false);
  const [targetPublication, setTargetPublication] = useState(null);
  const [smsChannel, setSmsChannel] = useState(true);
  const [whatsAppChannel, setWhatsAppChannel] = useState(true);
  const [emailChannel, setEmailChannel] = useState(false);
  const [customMsg, setCustomMsg] = useState("");

  // Publication batches synthesized from marks data
  const [publicationBatches, setPublicationBatches] = useState([
    {
      id: "PUB-2026-001",
      cohort: "Grade 11-A",
      subject: "Elective Mathematics",
      subjectCode: "MTH-401",
      assessmentTitle: "Mid-Term Examination 2026",
      studentsCount: 28,
      approvalStatus: "Approved",
      approvedBy: "Dame Eleanor Vance (Head Principal)",
      isPublished: true,
      publishedAt: "2026-11-11 16:30",
      studentPortalVisible: true,
      guardianPortalVisible: true,
      broadcastStatus: "Sent (28 Guardians)",
      scheduleDate: null,
    },
    {
      id: "PUB-2026-002",
      cohort: "Grade 11-A",
      subject: "Chemistry",
      subjectCode: "CHM-301",
      assessmentTitle: "End of Term Examination",
      studentsCount: 26,
      approvalStatus: "Approved",
      approvedBy: "Dame Eleanor Vance",
      isPublished: true,
      publishedAt: "2026-11-10 14:15",
      studentPortalVisible: true,
      guardianPortalVisible: true,
      broadcastStatus: "Sent (26 Guardians)",
      scheduleDate: null,
    },
    {
      id: "PUB-2026-003",
      cohort: "Grade 11-A",
      subject: "Physics",
      subjectCode: "PHY-302",
      assessmentTitle: "Physics Laboratory Assessment",
      studentsCount: 27,
      approvalStatus: "Pending Approval",
      approvedBy: "Academic Dean (Reviewing)",
      isPublished: false,
      publishedAt: null,
      studentPortalVisible: false,
      guardianPortalVisible: false,
      broadcastStatus: "Not Dispatched",
      scheduleDate: null,
    },
    {
      id: "PUB-2026-004",
      cohort: "Grade 12-A",
      subject: "English Language",
      subjectCode: "ENG-204",
      assessmentTitle: "WAEC Mock Paper 1 & 2",
      studentsCount: 32,
      approvalStatus: "Approved",
      approvedBy: "Academic Council",
      isPublished: false,
      publishedAt: null,
      studentPortalVisible: false,
      guardianPortalVisible: false,
      broadcastStatus: "Scheduled",
      scheduleDate: "2026-11-20 08:00 AM",
    },
    {
      id: "PUB-2026-005",
      cohort: "Grade 11-B",
      subject: "Economics",
      subjectCode: "ECN-102",
      assessmentTitle: "Mid-Term Comprehensive",
      studentsCount: 24,
      approvalStatus: "Approved",
      approvedBy: "Dame Eleanor Vance",
      isPublished: true,
      publishedAt: "2026-11-09 10:00",
      studentPortalVisible: true,
      guardianPortalVisible: true,
      broadcastStatus: "Sent (24 Guardians)",
      scheduleDate: null,
    },
  ]);

  useEffect(() => {
    setMarks(getMarks());
    setAssessments(getAssessments());
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Toggle Publish / Unpublish
  const handleTogglePublish = (id) => {
    setPublicationBatches((prev) =>
      prev.map((batch) => {
        if (batch.id === id) {
          if (batch.approvalStatus !== "Approved") {
            showToast("Cannot publish results prior to Principal Approval!", "error");
            return batch;
          }
          const nextPublished = !batch.isPublished;
          showToast(
            nextPublished
              ? `Results for ${batch.cohort} - ${batch.subject} have been published to Student & Guardian Portals!`
              : `Results for ${batch.cohort} - ${batch.subject} have been retracted to Draft status.`,
            nextPublished ? "success" : "info"
          );
          return {
            ...batch,
            isPublished: nextPublished,
            publishedAt: nextPublished ? new Date().toISOString().replace("T", " ").substring(0, 16) : null,
            studentPortalVisible: nextPublished,
            guardianPortalVisible: nextPublished,
            broadcastStatus: nextPublished ? "Ready for Broadcast" : "Not Dispatched",
          };
        }
        return batch;
      })
    );
  };

  // Toggle portal visibility
  const toggleVisibility = (id, portal) => {
    setPublicationBatches((prev) =>
      prev.map((batch) => {
        if (batch.id === id) {
          if (!batch.isPublished) {
            showToast("Publish the batch first before adjusting individual portal visibility.", "error");
            return batch;
          }
          const updated = {
            ...batch,
            [portal]: !batch[portal],
          };
          showToast(
            `${portal === "studentPortalVisible" ? "Student Portal" : "Guardian Portal"} visibility updated for ${batch.cohort}!`
          );
          return updated;
        }
        return batch;
      })
    );
  };

  // Open Broadcast modal
  const openBroadcast = (batch) => {
    setTargetPublication(batch);
    setCustomMsg(
      `St. Michael's International Academy Notice: Term 1 Final Results for ${batch.cohort} (${batch.subject}) are officially published. Please access the Guardian Portal at portal.smia.edu.gh to review performance and download terminal report cards.`
    );
    setBroadcastModalOpen(true);
  };

  // Execute broadcast
  const handleSendBroadcast = () => {
    if (!targetPublication) return;
    setIsBroadcasting(true);
    setTimeout(() => {
      setIsBroadcasting(false);
      setBroadcastModalOpen(false);
      setPublicationBatches((prev) =>
        prev.map((b) =>
          b.id === targetPublication.id
            ? { ...b, broadcastStatus: `Dispatched (${b.studentsCount} Guardians via SMS/WhatsApp)` }
            : b
        )
      );
      showToast(
        `Automated SMS & WhatsApp broadcast successfully dispatched to ${targetPublication.studentsCount} guardians!`,
        "success"
      );
    }, 1200);
  };

  // Bulk Publish All Approved
  const handleBulkPublish = () => {
    let count = 0;
    setPublicationBatches((prev) =>
      prev.map((batch) => {
        if (batch.approvalStatus === "Approved" && !batch.isPublished) {
          count++;
          return {
            ...batch,
            isPublished: true,
            publishedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
            studentPortalVisible: true,
            guardianPortalVisible: true,
            broadcastStatus: "Ready for Broadcast",
          };
        }
        return batch;
      })
    );
    if (count > 0) {
      showToast(`Successfully published ${count} approved exam batches to all portals!`, "success");
    } else {
      showToast("No unreleased approved batches found to publish.", "info");
    }
  };

  const filteredBatches = publicationBatches.filter((b) => {
    if (selectedCohort !== "All" && b.cohort !== selectedCohort) return false;
    if (selectedSubject !== "All" && b.subject !== selectedSubject) return false;
    if (statusFilter === "Published" && !b.isPublished) return false;
    if (statusFilter === "Draft" && b.isPublished) return false;
    if (statusFilter === "Scheduled" && !b.scheduleDate) return false;
    return true;
  });

  const totalPublished = publicationBatches.filter((b) => b.isPublished).length;
  const totalApproved = publicationBatches.filter((b) => b.approvalStatus === "Approved").length;
  const pendingBroadcast = publicationBatches.filter((b) => b.isPublished && b.broadcastStatus.includes("Ready")).length;

  return (
    <div className="pub-container">
      <ExamNav activeTab="Results Publication" />

      {toast && (
        <div className={`pub-toast pub-toast-${toast.type}`}>
          <div className="pub-toast-dot" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="pub-header">
        <div className="pub-title-box">
          <span className="pub-tag">MODULE 8 • SCREEN 11 OF 12</span>
          <h1 className="pub-title">Results Publication & Portal Dispatch</h1>
          <p className="pub-subtitle">
            Control live portal visibility of approved academic marks and dispatch real-time SMS & WhatsApp
            notifications to students and guardians.
          </p>
        </div>
        <div className="pub-quick-actions">
          <button className="pub-btn-bulk" onClick={handleBulkPublish}>
            <span className="pub-btn-icon">⚡</span> Publish All Approved
          </button>
        </div>
      </div>

      {/* KPI Highlights */}
      <div className="pub-kpi-grid">
        <div className="pub-kpi-card">
          <div className="pub-kpi-icon-wrap" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
            📢
          </div>
          <div className="pub-kpi-body">
            <span className="pub-kpi-label">Live on Portals</span>
            <div className="pub-kpi-val">{totalPublished} <span className="pub-kpi-sub">/ {publicationBatches.length} Batches</span></div>
          </div>
        </div>

        <div className="pub-kpi-card">
          <div className="pub-kpi-icon-wrap" style={{ background: "rgba(59, 130, 246, 0.15)", color: "#3b82f6" }}>
            🛡️
          </div>
          <div className="pub-kpi-body">
            <span className="pub-kpi-label">Executive Clearance</span>
            <div className="pub-kpi-val">{totalApproved} <span className="pub-kpi-sub">Batches Approved</span></div>
          </div>
        </div>

        <div className="pub-kpi-card">
          <div className="pub-kpi-icon-wrap" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b" }}>
            📲
          </div>
          <div className="pub-kpi-body">
            <span className="pub-kpi-label">Guardian Alerts</span>
            <div className="pub-kpi-val">SMS & WhatsApp <span className="pub-kpi-sub">Ghanaian Gateways</span></div>
          </div>
        </div>

        <div className="pub-kpi-card">
          <div className="pub-kpi-icon-wrap" style={{ background: "rgba(139, 92, 246, 0.15)", color: "#8b5cf6" }}>
            🔒
          </div>
          <div className="pub-kpi-body">
            <span className="pub-kpi-label">Security Protocol</span>
            <div className="pub-kpi-val">Two-Factor Gate <span className="pub-kpi-sub">Principal Signature</span></div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="pub-filter-toolbar">
        <div className="pub-filter-group">
          <label>Cohort Filter:</label>
          <select value={selectedCohort} onChange={(e) => setSelectedCohort(e.target.value)}>
            <option value="All">All Classes (Grade 11 & 12)</option>
            <option value="Grade 11-A">Grade 11-A</option>
            <option value="Grade 11-B">Grade 11-B</option>
            <option value="Grade 12-A">Grade 12-A</option>
          </select>
        </div>

        <div className="pub-filter-group">
          <label>Subject:</label>
          <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
            <option value="All">All Subjects</option>
            <option value="Elective Mathematics">Elective Mathematics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Physics">Physics</option>
            <option value="English Language">English Language</option>
            <option value="Economics">Economics</option>
          </select>
        </div>

        <div className="pub-filter-group">
          <label>Release State:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Release States</option>
            <option value="Published">Published (Live)</option>
            <option value="Draft">Draft / Withheld</option>
            <option value="Scheduled">Scheduled</option>
          </select>
        </div>
      </div>

      {/* Publication Batches Table */}
      <div className="pub-card-wrap">
        <div className="pub-table-header">
          <div>
            <h3>Academic Results Publication Queue</h3>
            <p>Select which classes and subjects are accessible to students and guardians.</p>
          </div>
          <div className="pub-legend">
            <span className="pub-legend-item"><span className="dot-green" /> Published</span>
            <span className="pub-legend-item"><span className="dot-amber" /> Scheduled</span>
            <span className="pub-legend-item"><span className="dot-gray" /> Draft / Hidden</span>
          </div>
        </div>

        <div className="pub-table-responsive">
          <table className="pub-table">
            <thead>
              <tr>
                <th>Batch & Cohort</th>
                <th>Subject & Exam Assessment</th>
                <th>Principal Approval</th>
                <th>Portal Visibility</th>
                <th>Release Status</th>
                <th>Guardian Broadcast</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBatches.map((b) => (
                <tr key={b.id} className={b.isPublished ? "row-published" : "row-draft"}>
                  <td>
                    <div className="pub-cohort-title">{b.cohort}</div>
                    <div className="pub-meta-sub">{b.id} • {b.studentsCount} Students</div>
                  </td>
                  <td>
                    <div className="pub-subj-title">{b.subject}</div>
                    <div className="pub-meta-sub">{b.assessmentTitle} ({b.subjectCode})</div>
                  </td>
                  <td>
                    <div className={`pub-badge-approval ${b.approvalStatus === "Approved" ? "approved" : "pending"}`}>
                      {b.approvalStatus === "Approved" ? "✓ Cleared" : "⏳ " + b.approvalStatus}
                    </div>
                    <div className="pub-meta-sub">{b.approvedBy}</div>
                  </td>
                  <td>
                    <div className="pub-portal-switches">
                      <button
                        className={`pub-switch-btn ${b.studentPortalVisible ? "active" : ""}`}
                        onClick={() => toggleVisibility(b.id, "studentPortalVisible")}
                        title="Toggle visibility in Student Portal"
                      >
                        🎓 Student {b.studentPortalVisible ? "ON" : "OFF"}
                      </button>
                      <button
                        className={`pub-switch-btn ${b.guardianPortalVisible ? "active" : ""}`}
                        onClick={() => toggleVisibility(b.id, "guardianPortalVisible")}
                        title="Toggle visibility in Guardian Portal"
                      >
                        👨‍👩‍👧 Guardian {b.guardianPortalVisible ? "ON" : "OFF"}
                      </button>
                    </div>
                  </td>
                  <td>
                    {b.isPublished ? (
                      <div>
                        <span className="pub-status-pill pill-live">● Live on Portal</span>
                        <div className="pub-meta-sub">{b.publishedAt}</div>
                      </div>
                    ) : b.scheduleDate ? (
                      <div>
                        <span className="pub-status-pill pill-sched">⏱ Scheduled</span>
                        <div className="pub-meta-sub">{b.scheduleDate}</div>
                      </div>
                    ) : (
                      <span className="pub-status-pill pill-draft">Draft / Hidden</span>
                    )}
                  </td>
                  <td>
                    <div className="pub-broadcast-col">
                      <span className="pub-broadcast-text">{b.broadcastStatus}</span>
                      {b.isPublished && (
                        <button
                          className="pub-btn-broadcast-sm"
                          onClick={() => openBroadcast(b)}
                          title="Trigger SMS / WhatsApp broadcast to parents"
                        >
                          📲 Broadcast
                        </button>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="pub-action-btns">
                      <button
                        className={`pub-btn-toggle ${b.isPublished ? "btn-unpublish" : "btn-publish"}`}
                        onClick={() => handleTogglePublish(b.id)}
                      >
                        {b.isPublished ? "Retract" : "Publish Now"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Broadcast Notification Modal */}
      {broadcastModalOpen && targetPublication && (
        <div className="pub-modal-overlay">
          <div className="pub-modal-box">
            <div className="pub-modal-header">
              <div>
                <h3>📱 Guardian Broadcast Alert</h3>
                <p>
                  Dispatch instant SMS & WhatsApp alerts to {targetPublication.studentsCount} parents of {targetPublication.cohort}.
                </p>
              </div>
              <button className="pub-modal-close" onClick={() => setBroadcastModalOpen(false)}>✕</button>
            </div>

            <div className="pub-modal-body">
              <div className="pub-channel-selectors">
                <label className="pub-channel-checkbox">
                  <input
                    type="checkbox"
                    checked={smsChannel}
                    onChange={(e) => setSmsChannel(e.target.checked)}
                  />
                  <span>Ghana SMS Gateway (Hubtel / Arkesel)</span>
                </label>
                <label className="pub-channel-checkbox">
                  <input
                    type="checkbox"
                    checked={whatsAppChannel}
                    onChange={(e) => setWhatsAppChannel(e.target.checked)}
                  />
                  <span>WhatsApp Business API Gateway</span>
                </label>
                <label className="pub-channel-checkbox">
                  <input
                    type="checkbox"
                    checked={emailChannel}
                    onChange={(e) => setEmailChannel(e.target.checked)}
                  />
                  <span>Registered Guardian Email</span>
                </label>
              </div>

              <div className="pub-form-field">
                <label>Message Content:</label>
                <textarea
                  rows={4}
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  className="pub-textarea"
                />
                <span className="pub-field-note">Dynamic tokens like [Student_Name] and [Portal_Link] are auto-inserted.</span>
              </div>

              <div className="pub-alert-summary">
                <div className="pub-alert-row">
                  <span>Target Recipients:</span>
                  <strong>{targetPublication.studentsCount} Guardians</strong>
                </div>
                <div className="pub-alert-row">
                  <span>Subject:</span>
                  <strong>{targetPublication.subject} ({targetPublication.cohort})</strong>
                </div>
                <div className="pub-alert-row">
                  <span>Estimated Cost:</span>
                  <strong style={{ color: "#10b981" }}>GH₵ {(targetPublication.studentsCount * 0.08).toFixed(2)} (Standard SMS Rate)</strong>
                </div>
              </div>
            </div>

            <div className="pub-modal-footer">
              <button className="pub-btn-cancel" onClick={() => setBroadcastModalOpen(false)}>
                Cancel
              </button>
              <button
                className="pub-btn-confirm"
                onClick={handleSendBroadcast}
                disabled={isBroadcasting || (!smsChannel && !whatsAppChannel && !emailChannel)}
              >
                {isBroadcasting ? "Transmitting Alerts..." : "🚀 Send Broadcast Immediately"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
