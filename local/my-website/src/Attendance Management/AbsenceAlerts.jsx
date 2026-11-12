import React, { useState } from "react";
import AttendanceNav from "./AttendanceNav";
import "./AbsenceAlerts.css";
import { ABSENCE_ALERTS } from "./attendanceData";
import SpinningWordsBackground from "../components/SpinningWordsBackground";
import MotivationQuoteWidget from "../components/MotivationQuoteWidget";

export default function AbsenceAlerts({ onNavigate }) {
  const [alerts, setAlerts] = useState(ABSENCE_ALERTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [channelFilter, setChannelFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // New Alert Dispatch form
  const [dispatchData, setDispatchData] = useState({
    studentName: "Liam Carter",
    guardianName: "Mrs. Evelyn Carter",
    guardianPhone: "+233 24 990 1204",
    channel: "SMS & WhatsApp",
    message:
      "URGENT: Your ward was recorded absent from morning session on Nov 12, 2026. Please confirm safety with school administration.",
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSendSingle = (id, name, channel) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              deliveryStatus: "Delivered",
              timeSent: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            }
          : a
      )
    );
    showToast(`Instant ${channel} alert dispatched to guardian of ${name}!`);
  };

  const handleBatchDispatch = () => {
    setAlerts((prev) =>
      prev.map((a) => ({
        ...a,
        deliveryStatus: "Delivered",
      }))
    );
    showToast("Dispatched batch automated absence alerts to all absent guardians via SMS & WhatsApp Gateway!");
  };

  const handleLogResponse = (id, guardianName) => {
    const res = prompt(
      `Enter guardian response note for ${guardianName}:`,
      "Parent called: Student is recovering from fever at home."
    );
    if (res) {
      setAlerts((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, guardianResponse: `Logged: "${res}"` } : a
        )
      );
      showToast(`Logged response from ${guardianName}.`);
    }
  };

  const filteredAlerts = alerts.filter((a) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      a.studentName.toLowerCase().includes(q) ||
      a.guardianName.toLowerCase().includes(q) ||
      a.guardianPhone.toLowerCase().includes(q) ||
      a.message.toLowerCase().includes(q);
    const matchesChannel =
      channelFilter === "ALL" || a.channel.includes(channelFilter);
    return matchesSearch && matchesChannel;
  });

  const deliveredCount = alerts.filter((a) => a.deliveryStatus === "Delivered").length;

  return (
    <div className="aa-page-wrapper">
      <SpinningWordsBackground speed="slow" showControlBadge={false} />

      {/* Toast Alert */}
      {toastMessage && <div className="aa-toast">✓ {toastMessage}</div>}

      <AttendanceNav
        activePath="/absence-alerts"
        title="Absence Alerts & Guardian Dispatcher"
        subtitle="Automated SMS, WhatsApp, and voice notifications sent to parents for unexcused absences"
      />

      <MotivationQuoteWidget compact={true} />

      {/* KPI Stats Strip */}
      <div className="aa-kpi-grid">
        <div className="aa-kpi-card">
          <div className="aa-kpi-top">
            <span className="aa-kpi-label">Active Absence Alerts</span>
            <span className="aa-kpi-icon">🚨</span>
          </div>
          <div className="aa-kpi-val">{alerts.length} Notifications</div>
          <div className="aa-kpi-sub">Triggered by Morning Roll Call</div>
        </div>

        <div className="aa-kpi-card">
          <div className="aa-kpi-top">
            <span className="aa-kpi-label">Delivery Confirmation</span>
            <span className="aa-kpi-icon">📱</span>
          </div>
          <div className="aa-kpi-val" style={{ color: "#34d399" }}>
            {deliveredCount} Delivered
          </div>
          <div className="aa-kpi-sub">SMS & WhatsApp Gateway Active</div>
        </div>

        <div className="aa-kpi-card">
          <div className="aa-kpi-top">
            <span className="aa-kpi-label">Parent Response Rate</span>
            <span className="aa-kpi-icon">💬</span>
          </div>
          <div className="aa-kpi-val" style={{ color: "#38bdf8" }}>
            66.7% Acknowledged
          </div>
          <div className="aa-kpi-sub">Follow-up Protocols Enabled</div>
        </div>

        <div className="aa-kpi-card">
          <div className="aa-kpi-top">
            <span className="aa-kpi-label">Gateway Network</span>
            <span className="aa-kpi-icon">⚡</span>
          </div>
          <div className="aa-kpi-val" style={{ color: "#fbbf24" }}>
            MTN / Telecel
          </div>
          <div className="aa-kpi-sub">Direct Telecom API Integration</div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="aa-action-bar">
        <div className="aa-filters-row">
          <div className="aa-search-box">
            <span className="aa-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search alert by student, guardian, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="aa-clear-btn"
                onClick={() => setSearchQuery("")}
              >
                ×
              </button>
            )}
          </div>

          <select
            className="aa-select"
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
          >
            <option value="ALL">All Communication Channels</option>
            <option value="SMS">SMS</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Email">Email</option>
          </select>
        </div>

        <button
          type="button"
          className="aa-btn-primary"
          onClick={handleBatchDispatch}
          title="Send SMS/WhatsApp notifications to all today's unexcused students"
        >
          <span>⚡</span> Batch Dispatch All Morning Alerts
        </button>
      </div>

      {/* Alerts Cards Grid */}
      <div className="aa-cards-grid">
        {filteredAlerts.map((a) => (
          <div key={a.id} className="aa-card">
            <div className="aa-card-top">
              <div className="aa-id-badge">{a.id}</div>
              <span
                className={`aa-status-pill ${
                  a.deliveryStatus === "Delivered" ? "pill-delivered" : "pill-sent"
                }`}
              >
                ✓ {a.deliveryStatus} ({a.timeSent})
              </span>
            </div>

            <div className="aa-student-banner">
              <span className="aa-stu-icon">👤</span>
              <div>
                <div className="aa-stu-name">{a.studentName}</div>
                <div className="aa-stu-id">{a.studentId}</div>
              </div>
            </div>

            <div className="aa-guardian-box">
              <div className="aa-guard-label">Guardian Contact:</div>
              <div className="aa-guard-name">👨‍👩‍👧 {a.guardianName}</div>
              <div className="aa-guard-details">
                <span>📞 {a.guardianPhone}</span>
                <span>•</span>
                <span>✉ {a.guardianEmail}</span>
              </div>
              <div className="aa-channel-tag">Channel: {a.channel}</div>
            </div>

            {/* Template Preview */}
            <div className="aa-msg-preview">
              <div className="aa-msg-title">Dispatched Message:</div>
              <p className="aa-msg-body">"{a.message}"</p>
            </div>

            {/* Response status */}
            <div className="aa-response-box">
              <span className="aa-resp-label">Guardian Feedback:</span>
              <span className="aa-resp-val">{a.guardianResponse}</span>
            </div>

            {/* Card Footer Actions */}
            <div className="aa-card-footer">
              <button
                type="button"
                className="aa-btn-sm"
                onClick={() => handleLogResponse(a.id, a.guardianName)}
              >
                📝 Log Call Response
              </button>

              <button
                type="button"
                className="aa-btn-sm aa-btn-retrigger"
                onClick={() => handleSendSingle(a.id, a.studentName, a.channel)}
              >
                📲 Resend Alert
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredAlerts.length === 0 && (
        <div className="aa-empty-state">
          <p>No absence alerts match your search filters.</p>
          <button
            type="button"
            className="aa-btn-primary"
            onClick={() => {
              setSearchQuery("");
              setChannelFilter("ALL");
            }}
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
