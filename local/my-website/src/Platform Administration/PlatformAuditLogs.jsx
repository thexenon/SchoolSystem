import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./PlatformAuditLogs.css";

const INITIAL_LOGS = [
  {
    id: "LOG-8942",
    timestamp: "2026-10-27 15:04:12 UTC",
    actor: {
      name: "Marcus Chen",
      email: "m.chen@platform.schoolhub.net",
      role: "Cloud DevOps",
      avatar: "MC",
    },
    action: "School Suspension Enforced",
    category: "Tenant Management",
    target: "Horizon Collegiate Institute",
    targetId: "SCH-004",
    severity: "Critical",
    ipAddress: "10.0.4.88 (Toronto Office)",
    details:
      "Automated safety suspension triggered following 3 overdue billing cycles and payment gateway bounce. Tenant endpoints switched to read-only holding page.",
    metadata: {
      reason: "Payment default > 90 days",
      previousStatus: "Active",
      newStatus: "Suspended",
      affectedUsers: 1850,
      checksum: "e8b23f8194ad902c4f1c990b7123",
    },
  },
  {
    id: "LOG-8941",
    timestamp: "2026-10-27 14:48:30 UTC",
    actor: {
      name: "Dr. Arthur Bell",
      email: "a.bell@platform.schoolhub.net",
      role: "Super Admin",
      avatar: "AB",
    },
    action: "Plan Seat Limit Raised",
    category: "Subscription & Billing",
    target: "Oakridge High School",
    targetId: "SCH-002",
    severity: "Success",
    ipAddress: "192.168.1.10 (London HQ)",
    details:
      "Enterprise tier student seat capacity expanded from 2,000 to 3,000 students following signed SLA addendum #SLA-2026-088.",
    metadata: {
      previousLimit: 2000,
      newLimit: 3000,
      annualRevenueDelta: "+$12,000",
      checksum: "a31489b02319ef47bc184013489e",
    },
  },
  {
    id: "LOG-8940",
    timestamp: "2026-10-27 13:21:05 UTC",
    actor: {
      name: "David Thorne",
      email: "d.thorne@platform.schoolhub.net",
      role: "Support Agent",
      avatar: "DT",
    },
    action: "Two-Factor Auth Reset Requested",
    category: "Security & 2FA",
    target: "David Thorne (Self)",
    targetId: "OP-006",
    severity: "Warning",
    ipAddress: "10.14.2.11 (Remote VPN)",
    details:
      "Hardware TOTP token reported lost. Identity verification ticket #SEC-9902 queued for out-of-band biometric approval by Security Auditor.",
    metadata: {
      ticketId: "SEC-9902",
      authMethod: "Hardware YubiKey 5C",
      challengeStatus: "Pending Auditor Verification",
      checksum: "77cd4b2191fa120538df0119eab4",
    },
  },
  {
    id: "LOG-8939",
    timestamp: "2026-10-27 11:15:40 UTC",
    actor: {
      name: "Marcus Chen",
      email: "m.chen@platform.schoolhub.net",
      role: "Cloud DevOps",
      avatar: "MC",
    },
    action: "New Tenant Provisioned",
    category: "Tenant Management",
    target: "Beacon Hill Grammar School",
    targetId: "SCH-005",
    severity: "Info",
    ipAddress: "10.0.4.88 (Toronto Office)",
    details:
      "Dedicated multi-tenant database partition allocated on us-east-1 RDS cluster. Subdomain 'beaconhill.schoolhub.net' registered and TLS certificates issued.",
    metadata: {
      clusterId: "rds-useast1-tenant-4",
      dnsRecord: "CNAME beaconhill.schoolhub.net",
      allocatedQuotaGB: 250,
      checksum: "39bdf11849a90cd66318bc00192e",
    },
  },
  {
    id: "LOG-8938",
    timestamp: "2026-10-27 09:00:00 UTC",
    actor: {
      name: "Automated Cron Daemon",
      email: "cron.system@platform.internal",
      role: "System Service",
      avatar: "SYS",
    },
    action: "Platform Multi-Tenant Snapshot",
    category: "Data Governance",
    target: "Global Cluster (48 Databases)",
    targetId: "CLUSTER-CORE",
    severity: "Success",
    ipAddress: "127.0.0.1 (VPC Internal)",
    details:
      "Full encrypted AES-256 disaster recovery snapshot successfully created across all 48 school databases. Replication verified across EU-West and US-East regions.",
    metadata: {
      snapshotSize: "4.82 TB",
      durationSec: 184,
      retentionPolicy: "365 Days WORM Compliant",
      checksum: "89acb5710294fe4b12389cd310ba",
    },
  },
  {
    id: "LOG-8937",
    timestamp: "2026-10-26 19:42:18 UTC",
    actor: {
      name: "Dr. Arthur Bell",
      email: "a.bell@platform.schoolhub.net",
      role: "Super Admin",
      avatar: "AB",
    },
    action: "Temporary Role Elevation",
    category: "Staff Permission",
    target: "Samantha Wu",
    targetId: "OP-003",
    severity: "Warning",
    ipAddress: "192.168.1.10 (London HQ)",
    details:
      "Granted temporary Platform Root Audit privileges to Samantha Wu for scheduled SOC-2 external auditor examination. Expiration set for 72 hours.",
    metadata: {
      temporaryGrant: "ROLE_ROOT_AUDITOR",
      expiresAt: "2026-10-29 19:42:18 UTC",
      approvalTicket: "GOV-2026-441",
      checksum: "fa0184b90123ce88481239aa807e",
    },
  },
  {
    id: "LOG-8936",
    timestamp: "2026-10-26 16:11:02 UTC",
    actor: {
      name: "Liam Reynolds",
      email: "l.reynolds@platform.schoolhub.net",
      role: "Support Lead",
      avatar: "LR",
    },
    action: "IP Whitelist Updated",
    category: "Security & 2FA",
    target: "St. Jude Technical College",
    targetId: "SCH-006",
    severity: "Info",
    ipAddress: "192.168.12.4 (Dublin Office)",
    details:
      "Added campus computer lab subnet range 194.105.12.0/24 to school administrative whitelist following IT Director request.",
    metadata: {
      addedSubnet: "194.105.12.0/24",
      requestedBy: "director@stjude.ie",
      checksum: "c38190af338902be812746bc3810",
    },
  },
  {
    id: "LOG-8935",
    timestamp: "2026-10-26 14:02:45 UTC",
    actor: {
      name: "Intrusion Detection System",
      email: "ids-guard@platform.internal",
      role: "Security Guardrail",
      avatar: "IDS",
    },
    action: "Brute-Force Anomaly Blocked",
    category: "Security & 2FA",
    target: "Platform Login Gateway",
    targetId: "AUTH-GW-01",
    severity: "Critical",
    ipAddress: "203.0.113.84 (Autonomous System 15169)",
    details:
      "14 failed consecutive login attempts detected within 25 seconds against operator accounts. Source IP automatically added to perimeter rate-limiting blackhole.",
    metadata: {
      attemptsCount: 14,
      targetedAccount: "admin@platform.schoolhub.net",
      mitigationAction: "BGP Blackhole Route Injected",
      checksum: "0018fbc910248aef01934bc81290",
    },
  },
  {
    id: "LOG-8934",
    timestamp: "2026-10-26 10:28:19 UTC",
    actor: {
      name: "Marcus Chen",
      email: "m.chen@platform.schoolhub.net",
      role: "Cloud DevOps",
      avatar: "MC",
    },
    action: "Maintenance Window Scheduled",
    category: "Tenant Management",
    target: "Multi-Tenant Webhook Broker",
    targetId: "SVC-BROKER",
    severity: "Info",
    ipAddress: "10.0.4.88 (Toronto Office)",
    details:
      "Scheduled zero-downtime Redis memory upgrade and patch for Sunday at 02:00 UTC. Tenant webhooks will queue without drops during switchover.",
    metadata: {
      maintenanceWindow: "Sunday 02:00-02:30 UTC",
      downtimeExpected: "0 seconds (HA Failover)",
      checksum: "481029baecdf810239401923847a",
    },
  },
  {
    id: "LOG-8933",
    timestamp: "2026-10-25 17:50:33 UTC",
    actor: {
      name: "Maya Patel",
      email: "m.patel@platform.schoolhub.net",
      role: "Billing Operations",
      avatar: "MP",
    },
    action: "Enterprise Contract Renewed",
    category: "Subscription & Billing",
    target: "Greenwood International Academy",
    targetId: "SCH-001",
    severity: "Success",
    ipAddress: "192.168.8.19 (Austin Office)",
    details:
      "Executed annual contract renewal for 12 months with 5% multi-campus educational discount applied. Invoice paid in full via wire transfer.",
    metadata: {
      contractTerm: "12 Months",
      invoiceNumber: "INV-2026-1092",
      totalPaid: "$32,400.00",
      checksum: "67acfe1940192ba87123904fa198",
    },
  },
];

function PlatformAuditLogs({ onNavigate, onLogout }) {
  const [logs, setLogs] = useState(INITIAL_LOGS);

  const handleLogout = () => {
    localStorage.removeItem("platform_admin_auth");
    sessionStorage.removeItem("platform_admin_auth");
    if (onLogout) {
      onLogout();
    } else if (onNavigate) {
      onNavigate("platform-login");
    }
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selectedLog, setSelectedLog] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const navigateTo = (screen) => {
    if (onNavigate) onNavigate(screen);
  };

  const handleExportCSV = () => {
    const csvContent =
      "Log ID,Timestamp,Actor,Role,Action,Category,Target,Severity,IP Address,Details\n" +
      filteredLogs
        .map(
          (l) =>
            `"${l.id}","${l.timestamp}","${l.actor.name}","${l.actor.role}","${l.action}","${l.category}","${l.target} (${l.targetId})","${l.severity}","${l.ipAddress}","${l.details}"`
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `platform_audit_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`✓ Exported ${filteredLogs.length} audit log entries as CSV file!`);
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(filteredLogs, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `platform_audit_trail_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`✓ Exported ${filteredLogs.length} verified immutable audit records (JSON)!`);
  };

  const handleSimulateNewEvent = () => {
    const randomEventId = `LOG-${Math.floor(8943 + Math.random() * 100)}`;
    const now = new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC";
    const sampleNew = {
      id: randomEventId,
      timestamp: now,
      actor: {
        name: "Samantha Wu",
        email: "s.wu@platform.schoolhub.net",
        role: "Security Auditor",
        avatar: "SW",
      },
      action: "Ad-Hoc FERPA Compliance Audit Run",
      category: "Data Governance",
      target: "Riverdale STEM Academy",
      targetId: "SCH-003",
      severity: "Success",
      ipAddress: "172.16.0.45 (San Francisco)",
      details:
        "Student record PII masking and zero-knowledge encryption verified across tenant databases with zero violations found.",
      metadata: {
        encryptionStandard: "AES-256-GCM",
        recordsInspected: 1240,
        violationsFound: 0,
        checksum: "812fa4b901238910eac918402138",
      },
    };

    setLogs([sampleNew, ...logs]);
    showToast(`⚡ New audit event captured: ${sampleNew.id} - ${sampleNew.action}`);
  };

  const filteredLogs = logs.filter((l) => {
    const matchesSearch =
      l.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.actor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.actor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.targetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.ipAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.details.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity = severityFilter === "All" || l.severity === severityFilter;
    const matchesCategory = categoryFilter === "All" || l.category === categoryFilter;

    return matchesSearch && matchesSeverity && matchesCategory;
  });

  const getSeverityBadgeClass = (severity) => {
    switch (severity) {
      case "Critical":
        return "pal-badge-critical";
      case "Warning":
        return "pal-badge-warning";
      case "Info":
        return "pal-badge-info";
      case "Success":
        return "pal-badge-success";
      default:
        return "pal-badge-info";
    }
  };

  const criticalCount = logs.filter((l) => l.severity === "Critical").length;

  return (
    <div className="pal-wrapper">
      {/* Platform Navigation */}
      <nav className="platform-nav-bar">
        <div className="platform-brand">
          <div className="platform-logo-badge">SMS</div>
          <div>
            <div className="platform-brand-text">Multi-School Platform Administration</div>
            <div className="platform-brand-sub">Tenant Management & Global Operations</div>
          </div>
        </div>

        <div className="platform-menu-links">
          <button
            type="button"
            className="platform-menu-item"
            onClick={() => navigateTo("platform-dashboard")}
          >
            📊 Dashboard
          </button>
          <button
            type="button"
            className="platform-menu-item"
            onClick={() => navigateTo("school-management")}
          >
            🏫 School Management
          </button>
          <button
            type="button"
            className="platform-menu-item"
            onClick={() => navigateTo("school-details")}
          >
            🔍 School Details
          </button>
          <button
            type="button"
            className="platform-menu-item"
            onClick={() => navigateTo("subscription-management")}
          >
            💎 Subscriptions
          </button>
          <button
            type="button"
            className="platform-menu-item"
            onClick={() => navigateTo("platform-user-management")}
          >
            👥 Platform Staff
          </button>
          <button
            type="button"
            className="platform-menu-item active"
            onClick={() => navigateTo("platform-audit-logs")}
          >
            📜 Audit Logs
          </button>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Link to="/" className="platform-back-link">
            ← School Hub
          </Link>
          <button
            type="button"
            className="platform-logout-btn"
            onClick={handleLogout}
            title="Log out of Multi-School Platform Administration"
          >
            🔒 Logout
          </button>
        </div>
      </nav>

      {/* Header */}
      <div className="pal-header">
        <div>
          <h1 className="pal-title">Platform Administrative Audit Logs</h1>
          <p className="pal-subtitle">
            Tracks important administrative actions across all registered schools, tenants, and platform operators
          </p>
        </div>

        <div className="pal-header-actions">
          <div className="pal-live-badge">
            <span className="pal-live-dot"></span>
            {isLiveStreaming ? "LIVE LOG STREAM" : "STREAM PAUSED"}
          </div>

          <button
            type="button"
            className="sm-btn sm-btn-secondary"
            onClick={handleSimulateNewEvent}
            title="Simulate incoming live administrative event"
          >
            🔄 Capture Event
          </button>

          <button
            type="button"
            className="sm-btn sm-btn-secondary"
            onClick={handleExportCSV}
          >
            📄 Export CSV
          </button>

          <button
            type="button"
            className="sm-btn sm-btn-primary"
            onClick={handleExportJSON}
          >
            📥 Audit Trail (JSON)
          </button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="pal-stats-grid">
        <div className="pal-stat-card">
          <div className="pal-stat-top">
            <span className="pal-stat-label">Total Audited Events</span>
            <span className="pal-stat-icon">📜</span>
          </div>
          <div className="pal-stat-val">14,892</div>
          <div className="pal-stat-sub">Across 48 school tenants & operators</div>
        </div>

        <div className="pal-stat-card">
          <div className="pal-stat-top">
            <span className="pal-stat-label">Critical Security Alerts</span>
            <span className="pal-stat-icon">🚨</span>
          </div>
          <div className="pal-stat-val" style={{ color: "#f87171" }}>
            {criticalCount} Flagged
          </div>
          <div className="pal-stat-sub">Automated perimeter mitigation active</div>
        </div>

        <div className="pal-stat-card">
          <div className="pal-stat-top">
            <span className="pal-stat-label">Active Tenants Audited</span>
            <span className="pal-stat-icon">🏫</span>
          </div>
          <div className="pal-stat-val" style={{ color: "#34d399" }}>
            48 / 48
          </div>
          <div className="pal-stat-sub">100% operational monitoring coverage</div>
        </div>

        <div className="pal-stat-card">
          <div className="pal-stat-top">
            <span className="pal-stat-label">Compliance & Retention</span>
            <span className="pal-stat-icon">🛡️</span>
          </div>
          <div className="pal-stat-val" style={{ color: "#818cf8" }}>
            SOC2 / FERPA
          </div>
          <div className="pal-stat-sub">365-day immutable WORM archival</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="pal-filter-card">
        <div className="pal-filter-bar">
          <div className="pal-search-input-wrap">
            <span className="pal-search-icon">🔍</span>
            <input
              type="text"
              className="pal-search-input"
              placeholder="Search logs by actor, action, tenant school, event ID, or IP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="pal-select"
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
          >
            <option value="All">All Severities</option>
            <option value="Critical">🚨 Critical</option>
            <option value="Warning">⚠️ Warning</option>
            <option value="Info">ℹ️ Info</option>
            <option value="Success">✅ Success</option>
          </select>

          <select
            className="pal-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Tenant Management">Tenant Management</option>
            <option value="Subscription & Billing">Subscription & Billing</option>
            <option value="Security & 2FA">Security & 2FA</option>
            <option value="Staff Permission">Staff Permission</option>
            <option value="Data Governance">Data Governance</option>
          </select>

          {(searchQuery || severityFilter !== "All" || categoryFilter !== "All") && (
            <button
              type="button"
              className="sm-btn sm-btn-secondary"
              onClick={() => {
                setSearchQuery("");
                setSeverityFilter("All");
                setCategoryFilter("All");
              }}
            >
              🧹 Clear Filters
            </button>
          )}

          <div style={{ marginLeft: "auto", fontSize: "13px", color: "#94a3b8" }}>
            Showing <strong>{filteredLogs.length}</strong> of <strong>{logs.length}</strong> events
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="pal-table-container">
        <table className="pal-table">
          <thead>
            <tr>
              <th>Event ID</th>
              <th>Timestamp</th>
              <th>Actor</th>
              <th>Action / Category</th>
              <th>Target Entity</th>
              <th>Severity</th>
              <th>Originating IP</th>
              <th style={{ textAlign: "right" }}>Inspect</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="8">
                  <div className="pal-empty-state">
                    <div className="pal-empty-icon">🔍</div>
                    <div style={{ fontWeight: "700", color: "#f1f5f9", marginBottom: "6px" }}>
                      No matching platform audit logs found
                    </div>
                    <p style={{ margin: 0, fontSize: "13px" }}>
                      Try adjusting your search terms or clearing the active filters above.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="pal-table-row"
                  onClick={() => setSelectedLog(log)}
                >
                  <td>
                    <span className="pal-event-id">{log.id}</span>
                  </td>
                  <td>
                    <span className="pal-timestamp">{log.timestamp}</span>
                  </td>
                  <td>
                    <div className="pal-actor-cell">
                      <div className="pal-actor-avatar">{log.actor.avatar}</div>
                      <div>
                        <div className="pal-actor-name">{log.actor.name}</div>
                        <div className="pal-actor-email">{log.actor.role}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="pal-action-tag">{log.action}</span>
                    <span className="pal-action-cat">{log.category}</span>
                  </td>
                  <td>
                    <div className="pal-target-entity">{log.target}</div>
                    <div className="pal-target-sub">{log.targetId}</div>
                  </td>
                  <td>
                    <span className={`pal-badge ${getSeverityBadgeClass(log.severity)}`}>
                      {log.severity === "Critical" && "🚨 "}
                      {log.severity === "Warning" && "⚠️ "}
                      {log.severity === "Success" && "✓ "}
                      {log.severity === "Info" && "ℹ "}
                      {log.severity}
                    </span>
                  </td>
                  <td>
                    <span className="pal-ip-address">{log.ipAddress}</span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      type="button"
                      className="sm-btn sm-btn-secondary"
                      style={{ padding: "4px 10px", fontSize: "12px" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLog(log);
                      }}
                    >
                      🔍 Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Log Detail Inspector Modal */}
      {selectedLog && (
        <div className="pal-modal-backdrop" onClick={() => setSelectedLog(null)}>
          <div className="pal-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="pal-modal-header">
              <h2 className="pal-modal-title">
                <span>📜</span> Audit Record: {selectedLog.id}
              </h2>
              <button
                type="button"
                className="pal-modal-close"
                onClick={() => setSelectedLog(null)}
              >
                ✕
              </button>
            </div>

            <div className="pal-detail-section">
              <div className="pal-detail-label">Action Description</div>
              <div className="pal-detail-value" style={{ fontWeight: 600 }}>
                {selectedLog.action} ({selectedLog.category})
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "16px" }}>
              <div>
                <div className="pal-detail-label">Timestamp</div>
                <div className="pal-detail-value" style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "12px" }}>
                  {selectedLog.timestamp}
                </div>
              </div>
              <div>
                <div className="pal-detail-label">Severity Level</div>
                <div className="pal-detail-value">
                  <span className={`pal-badge ${getSeverityBadgeClass(selectedLog.severity)}`}>
                    {selectedLog.severity}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "16px" }}>
              <div>
                <div className="pal-detail-label">Initiating Actor</div>
                <div className="pal-detail-value">
                  <strong>{selectedLog.actor.name}</strong> ({selectedLog.actor.role})
                  <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>
                    {selectedLog.actor.email}
                  </div>
                </div>
              </div>
              <div>
                <div className="pal-detail-label">Target School / Entity</div>
                <div className="pal-detail-value">
                  <strong style={{ color: "#38bdf8" }}>{selectedLog.target}</strong>
                  <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>
                    ID: {selectedLog.targetId}
                  </div>
                </div>
              </div>
            </div>

            <div className="pal-detail-section">
              <div className="pal-detail-label">Originating Host & Network</div>
              <div className="pal-detail-value" style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "12px" }}>
                🌐 {selectedLog.ipAddress}
              </div>
            </div>

            <div className="pal-detail-section">
              <div className="pal-detail-label">Full Narrative Details</div>
              <div className="pal-detail-value" style={{ lineHeight: "1.6" }}>
                {selectedLog.details}
              </div>
            </div>

            <div className="pal-detail-section">
              <div className="pal-detail-label">Cryptographic Proof & Event Metadata (JSON)</div>
              <div className="pal-json-box">
                {JSON.stringify(
                  {
                    eventId: selectedLog.id,
                    timestamp: selectedLog.timestamp,
                    actor: selectedLog.actor,
                    action: selectedLog.action,
                    category: selectedLog.category,
                    target: {
                      name: selectedLog.target,
                      id: selectedLog.targetId,
                    },
                    network: {
                      ip: selectedLog.ipAddress,
                    },
                    payloadMetadata: selectedLog.metadata,
                  },
                  null,
                  2
                )}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
              <button
                type="button"
                className="sm-btn sm-btn-secondary"
                onClick={() => {
                  navigator.clipboard?.writeText(JSON.stringify(selectedLog, null, 2));
                  showToast(`✓ Copied event payload for ${selectedLog.id} to clipboard!`);
                }}
              >
                📋 Copy JSON
              </button>
              <button
                type="button"
                className="sm-btn sm-btn-primary"
                onClick={() => setSelectedLog(null)}
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && <div className="pal-toast">{toastMessage}</div>}
    </div>
  );
}

export default PlatformAuditLogs;
