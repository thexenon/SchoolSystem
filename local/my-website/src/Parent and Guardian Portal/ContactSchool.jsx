import React, { useState, useEffect } from "react";
import ParentNav from "./ParentNav";
import {
  getActiveParent,
  getActiveChildId,
  getParentEnquiries,
  saveParentEnquiries,
} from "./parentData";
import "./ContactSchool.css";

const DEPARTMENTS = [
  {
    name: "Academic Affairs",
    recipients: [
      "Dr. Kwabena Asante (Academic Dean / Form Tutor)",
      "Mrs. Florence Lamptey (Head of Sciences)",
      "Mr. Isaac Owusu (Examinations Officer)",
    ],
  },
  {
    name: "Bursary & Accounts",
    recipients: [
      "Mrs. Gertrude Addo (Chief Bursar)",
      "Mr. Samuel Donkor (Student Billings Specialist)",
    ],
  },
  {
    name: "Transport & Student Logistics",
    recipients: [
      "Mr. Ebenezer Coffie (Fleet Operations Manager)",
      "Ms. Abigail Mensah (Bus Route Coordinator)",
    ],
  },
  {
    name: "Health & Pastoral Welfare",
    recipients: [
      "Dr. Matilda Quarshie (Campus Chief Medical Officer)",
      "Rev. Father Emmanuel Boateng (School Chaplain & Counselor)",
    ],
  },
  {
    name: "General Administration",
    recipients: [
      "Dame Eleanor Vance (Headmistress Office)",
      "Front Desk Administrative Registry",
    ],
  },
];

export default function ContactSchool() {
  const [parent, setParent] = useState(getActiveParent());
  const [enquiries, setEnquiries] = useState(getParentEnquiries());
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFormModal, setShowFormModal] = useState(false);
  const [toast, setToast] = useState(null);

  // Form State
  const [selectedDept, setSelectedDept] = useState(DEPARTMENTS[0].name);
  const [selectedRecipient, setSelectedRecipient] = useState(DEPARTMENTS[0].recipients[0]);
  const [selectedChildId, setSelectedChildId] = useState(getActiveChildId());
  const [subject, setSubject] = useState("");
  const [urgency, setUrgency] = useState("Normal");
  const [message, setMessage] = useState("");
  const [attachmentName, setAttachmentName] = useState("");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const handleChildChanged = () => {
      setParent(getActiveParent());
      setSelectedChildId(getActiveChildId());
    };
    window.addEventListener("childChanged", handleChildChanged);
    return () => window.removeEventListener("childChanged", handleChildChanged);
  }, []);

  const handleDeptChange = (deptName) => {
    setSelectedDept(deptName);
    const found = DEPARTMENTS.find((d) => d.name === deptName);
    if (found && found.recipients.length > 0) {
      setSelectedRecipient(found.recipients[0]);
    }
  };

  const currentRecipientList =
    DEPARTMENTS.find((d) => d.name === selectedDept)?.recipients || [];

  const handleSendEnquiry = (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      showToast("Please provide both a subject and enquiry message.", "error");
      return;
    }

    const linkedChild = parent.children.find((c) => c.id === selectedChildId);
    const newEnquiry = {
      id: `ENQ-2026-${String(Math.floor(Math.random() * 900) + 100)}`,
      parentId: parent.id,
      studentId: selectedChildId,
      studentName: linkedChild ? linkedChild.name : "Student",
      subject: subject.trim(),
      department: selectedDept,
      recipient: selectedRecipient,
      urgency,
      date: new Date().toISOString().split("T")[0],
      status: "Pending Response",
      message: message.trim(),
      attachment: attachmentName || null,
      reply: null,
      replyDate: null,
      repliedBy: null,
    };

    const updated = [newEnquiry, ...enquiries];
    setEnquiries(updated);
    saveParentEnquiries(updated);

    // Reset Form
    setSubject("");
    setMessage("");
    setAttachmentName("");
    setShowFormModal(false);
    showToast(`Enquiry ${newEnquiry.id} sent successfully to ${selectedRecipient}!`);
  };

  const handleSimulateReply = (enquiryId) => {
    const updated = enquiries.map((enq) => {
      if (enq.id === enquiryId) {
        return {
          ...enq,
          status: "Replied",
          reply: `Official Acknowledgement: Thank you for your inquiry regarding ${enq.studentName}. Your note has been reviewed by the department head and appropriate measures are actively in progress. Please feel free to reach out for further assistance.`,
          replyDate: `${new Date().toISOString().split("T")[0]} 11:45 AM`,
          repliedBy: enq.recipient.split(" (")[0],
        };
      }
      return enq;
    });
    setEnquiries(updated);
    saveParentEnquiries(updated);
    showToast(`Official administrative reply generated for ${enquiryId}!`);
  };

  // Filtered list
  const filteredEnquiries = enquiries.filter((item) => {
    if (filterStatus !== "All" && item.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchSubject = item.subject.toLowerCase().includes(q);
      const matchRecipient = item.recipient.toLowerCase().includes(q);
      const matchStudent = item.studentName.toLowerCase().includes(q);
      const matchDept = item.department.toLowerCase().includes(q);
      if (!matchSubject && !matchRecipient && !matchStudent && !matchDept) return false;
    }
    return true;
  });

  const totalCount = enquiries.length;
  const repliedCount = enquiries.filter((e) => e.status === "Replied").length;
  const pendingCount = enquiries.filter((e) => e.status === "Pending Response").length;

  return (
    <div className="cs-container">
      <ParentNav
        title="Direct School Enquiry & Message Center"
        subtitle="Submit permitted academic, financial, transport, and pastoral inquiries directly to administration"
        badge="Module 11 • Screen 10 of 10"
      />

      {toast && (
        <div className={`cs-toast cs-toast-${toast.type}`}>
          <div className="cs-toast-dot" />
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="cs-header">
        <div className="cs-title-box">
          <span className="cs-tag">PARENT-ADMINISTRATION COMMUNICATION HUB</span>
          <h1 className="cs-title">School Inquiries & Messages</h1>
          <p className="cs-subtitle">
            Directly communicate with academic form masters, accounts bursars, health services, and
            administrative registries with end-to-end tracked correspondence logs.
          </p>
        </div>

        <div className="cs-header-actions">
          <button className="cs-btn-new-enquiry" onClick={() => setShowFormModal(true)}>
            ✉️ Compose New Message
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="cs-stats-grid">
        <div className="cs-stat-card">
          <div className="cs-stat-icon">📨</div>
          <div className="cs-stat-info">
            <span className="cs-stat-label">Total Messages</span>
            <span className="cs-stat-val">{totalCount}</span>
          </div>
        </div>

        <div className="cs-stat-card">
          <div className="cs-stat-icon text-emerald">✅</div>
          <div className="cs-stat-info">
            <span className="cs-stat-label">Resolved / Replied</span>
            <span className="cs-stat-val text-emerald">{repliedCount}</span>
          </div>
        </div>

        <div className="cs-stat-card">
          <div className="cs-stat-icon text-amber">⏳</div>
          <div className="cs-stat-info">
            <span className="cs-stat-label">Pending Review</span>
            <span className="cs-stat-val text-amber">{pendingCount}</span>
          </div>
        </div>

        <div className="cs-stat-card">
          <div className="cs-stat-icon text-cyan">⚡</div>
          <div className="cs-stat-info">
            <span className="cs-stat-label">Avg Response SLA</span>
            <span className="cs-stat-val">&lt; 4 Hours</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="cs-toolbar">
        <div className="cs-search-box">
          <span className="cs-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search enquiries by subject, recipient, or student..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="cs-clear-search" onClick={() => setSearchQuery("")}>
              ✕
            </button>
          )}
        </div>

        <div className="cs-filter-tabs">
          <button
            className={`cs-filter-tab ${filterStatus === "All" ? "active" : ""}`}
            onClick={() => setFilterStatus("All")}
          >
            All Threads ({totalCount})
          </button>
          <button
            className={`cs-filter-tab ${filterStatus === "Replied" ? "active" : ""}`}
            onClick={() => setFilterStatus("Replied")}
          >
            ✅ Replied ({repliedCount})
          </button>
          <button
            className={`cs-filter-tab ${filterStatus === "Pending Response" ? "active" : ""}`}
            onClick={() => setFilterStatus("Pending Response")}
          >
            ⏳ Pending ({pendingCount})
          </button>
        </div>
      </div>

      {/* Messages Thread List */}
      <div className="cs-threads-container">
        {filteredEnquiries.length === 0 ? (
          <div className="cs-empty-state">
            <div className="cs-empty-icon">📭</div>
            <h3>No Enquiries Found</h3>
            <p>You have not submitted any messages matching the active filter.</p>
            <button className="cs-btn-new-enquiry" onClick={() => setShowFormModal(true)}>
              Compose First Message
            </button>
          </div>
        ) : (
          filteredEnquiries.map((enq) => (
            <div key={enq.id} className="cs-thread-card">
              <div className="cs-thread-header">
                <div className="cs-thread-meta-left">
                  <span className={`cs-status-pill ${enq.status === "Replied" ? "replied" : "pending"}`}>
                    ● {enq.status}
                  </span>
                  <span className="cs-dept-pill">🏢 {enq.department}</span>
                  <span className="cs-student-pill">👤 Child: {enq.studentName}</span>
                </div>
                <div className="cs-thread-meta-right">
                  <span className="cs-date-pill">📅 {enq.date}</span>
                  <span className="cs-id-pill">{enq.id}</span>
                </div>
              </div>

              <div className="cs-thread-body">
                <h3 className="cs-thread-subject">{enq.subject}</h3>
                <div className="cs-recipient-line">
                  <strong>Addressed To:</strong> <span>{enq.recipient}</span>
                </div>
                <div className="cs-parent-message-box">
                  <div className="cs-message-author">
                    <span>👨‍👧 {parent.name} (Parent)</span>
                  </div>
                  <p className="cs-message-text">{enq.message}</p>
                  {enq.attachment && (
                    <div className="cs-attached-file">
                      📎 Attached: <span>{enq.attachment}</span>
                    </div>
                  )}
                </div>

                {/* Staff Reply Section */}
                {enq.status === "Replied" ? (
                  <div className="cs-reply-box">
                    <div className="cs-reply-header">
                      <div className="cs-reply-author">
                        <span className="cs-staff-badge">🏫 OFFICIAL RESPONSE</span>
                        <strong>{enq.repliedBy || enq.recipient}</strong>
                      </div>
                      <span className="cs-reply-date">🕒 {enq.replyDate}</span>
                    </div>
                    <p className="cs-reply-text">{enq.reply}</p>
                  </div>
                ) : (
                  <div className="cs-pending-notice-row">
                    <div className="cs-pending-info">
                      <span className="cs-pulse-dot" />
                      <span>This enquiry is currently assigned to {enq.recipient}. Expect response shortly.</span>
                    </div>
                    <button
                      className="cs-btn-sim-reply"
                      onClick={() => handleSimulateReply(enq.id)}
                      title="Simulate immediate school staff response for demonstration"
                    >
                      ⚡ Simulate School Reply
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Compose Message Modal */}
      {showFormModal && (
        <div className="cs-modal-backdrop" onClick={() => setShowFormModal(false)}>
          <div className="cs-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="cs-modal-header">
              <div className="cs-modal-title">
                <h2>Send Permitted School Enquiry</h2>
                <p>Submit an inquiry directly to academy staff and faculty members</p>
              </div>
              <button className="cs-modal-close" onClick={() => setShowFormModal(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSendEnquiry} className="cs-modal-form">
              <div className="cs-form-row">
                <div className="cs-form-group">
                  <label>Linked Child / Ward</label>
                  <select
                    value={selectedChildId}
                    onChange={(e) => setSelectedChildId(e.target.value)}
                  >
                    {parent.children.map((ch) => (
                      <option key={ch.id} value={ch.id}>
                        {ch.name} ({ch.grade} - {ch.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="cs-form-group">
                  <label>Target Department</label>
                  <select
                    value={selectedDept}
                    onChange={(e) => handleDeptChange(e.target.value)}
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept.name} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="cs-form-row">
                <div className="cs-form-group">
                  <label>Specific Recipient</label>
                  <select
                    value={selectedRecipient}
                    onChange={(e) => setSelectedRecipient(e.target.value)}
                  >
                    {currentRecipientList.map((rec) => (
                      <option key={rec} value={rec}>
                        {rec}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="cs-form-group">
                  <label>Message Priority</label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                  >
                    <option value="Normal">Normal Inquiry</option>
                    <option value="Urgent">High Priority / Urgent</option>
                    <option value="Confidential">Confidential / Pastoral</option>
                  </select>
                </div>
              </div>

              <div className="cs-form-group">
                <label>Subject Line</label>
                <input
                  type="text"
                  placeholder="e.g. Inquiring on mid-term robotics lab schedule"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div className="cs-form-group">
                <label>Enquiry Body</label>
                <textarea
                  rows={5}
                  placeholder="Please state your inquiry or request clearly. Include any dates or specific requirements..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              <div className="cs-form-group">
                <label>Attach Supporting Document (Optional)</label>
                <div className="cs-file-input-wrapper">
                  <input
                    type="file"
                    id="cs-file-upload"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setAttachmentName(e.target.files[0].name);
                      }
                    }}
                  />
                  {attachmentName && (
                    <span className="cs-file-chosen">📎 {attachmentName}</span>
                  )}
                </div>
              </div>

              <div className="cs-modal-actions">
                <button
                  type="button"
                  className="cs-btn-cancel"
                  onClick={() => setShowFormModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="cs-btn-submit">
                  🚀 Transmit Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
