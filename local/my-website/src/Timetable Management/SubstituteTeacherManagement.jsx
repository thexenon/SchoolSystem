import React, { useState, useEffect } from "react";
import TimetableNav from "./TimetableNav";
import {
  getSubstitutes,
  saveSubstitutes,
  getSubstituteAssignments,
  saveSubstituteAssignments,
} from "./timetableData";
import "./SubstituteTeacherManagement.css";

export default function SubstituteTeacherManagement() {
  const [substitutes, setSubstitutes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [activeTab, setActiveTab] = useState("assignments"); // 'assignments' or 'pool'
  const [toast, setToast] = useState(null);

  // New Deployment Modal
  const [deployModalOpen, setDeployModalOpen] = useState(false);
  const [registerSubModalOpen, setRegisterSubModalOpen] = useState(false);

  // Deployment form fields
  const [absentTeacher, setAbsentTeacher] = useState("Marcus Brody (Social Studies)");
  const [substituteTeacher, setSubstituteTeacher] = useState("");
  const [deployCohort, setDeployCohort] = useState("Grade 11-A");
  const [deploySubject, setDeploySubject] = useState("Chemistry");
  const [deployPeriod, setDeployPeriod] = useState("Monday, Period 2 (08:50 - 09:40)");
  const [deployDate, setDeployDate] = useState("2026-11-16");
  const [deployReason, setDeployReason] = useState("Academic Conference Attendance");
  const [deployStipend, setDeployStipend] = useState("250.00");

  // New Substitute Registration Form
  const [newSubName, setNewSubName] = useState("");
  const [newSubQual, setNewSubQual] = useState("");
  const [newSubSpec, setNewSubSpec] = useState("");
  const [newSubPhone, setNewSubPhone] = useState("+233 24 ");
  const [newSubStipend, setNewSubStipend] = useState("250.00");

  useEffect(() => {
    const loadedSubs = getSubstitutes();
    const loadedAssignments = getSubstituteAssignments();
    setSubstitutes(loadedSubs);
    setAssignments(loadedAssignments);
    if (loadedSubs.length > 0) {
      setSubstituteTeacher(loadedSubs[0].name);
    }
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleAuthorizeAssignment = (id) => {
    const updated = assignments.map((a) =>
      a.id === id
        ? {
            ...a,
            status: "Confirmed",
            authorizedBy: "Dame Eleanor Vance (Head Principal)",
          }
        : a
    );
    setAssignments(updated);
    saveSubstituteAssignments(updated);
    showToast(`Substitute coverage assignment ${id} officially confirmed by Principal!`, "success");
  };

  const handleCreateDeployment = (e) => {
    e.preventDefault();
    const newId = `SUBASN-2026-00${assignments.length + 1}`;
    const newEntry = {
      id: newId,
      absentTeacherId: "TCH-CUSTOM",
      absentTeacherName: absentTeacher.split("(")[0].trim(),
      substituteId: "SUB-ACTIVE",
      substituteName: substituteTeacher,
      classCohort: deployCohort,
      subject: deploySubject,
      periodTime: deployPeriod,
      date: deployDate,
      reason: deployReason,
      stipend: `GH₵ ${parseFloat(deployStipend).toFixed(2)}`,
      status: "Confirmed",
      authorizedBy: "Dame Eleanor Vance (Head Principal)",
    };

    const updated = [newEntry, ...assignments];
    setAssignments(updated);
    saveSubstituteAssignments(updated);
    setDeployModalOpen(false);
    showToast(`Substitute assignment ${newId} dispatched successfully!`);
  };

  const handleRegisterSubstitute = (e) => {
    e.preventDefault();
    const newId = `SUB-0${substitutes.length + 1}`;
    const newSub = {
      id: newId,
      name: newSubName,
      qualifications: newSubQual,
      specializations: newSubSpec.split(",").map((s) => s.trim()),
      contactPhone: newSubPhone,
      email: `${newSubName.toLowerCase().replace(/[^a-z]/g, "")}@substitutes.smia.edu.gh`,
      stipendPerDay: `GH₵ ${parseFloat(newSubStipend).toFixed(2)}`,
      status: "Available",
      campusAssigned: "Kensington Central Campus",
    };

    const updated = [...substitutes, newSub];
    setSubstitutes(updated);
    saveSubstitutes(updated);
    setRegisterSubModalOpen(false);
    showToast(`Substitute teacher ${newSubName} registered in standby faculty roster!`);
  };

  return (
    <div className="sub-container">
      <TimetableNav
        title="Substitute Teacher Management & Deployments"
        subtitle="Assign replacement teachers, manage faculty leave coverages, and process statutory daily honorarium stipends"
        badge="Module 9 • Screen 7 of 7"
      />

      {toast && (
        <div className={`sub-toast sub-toast-${toast.type}`}>
          <div className="sub-toast-dot" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="sub-header">
        <div className="sub-title-box">
          <span className="sub-tag">FACULTY ABSENCE & RELIEF ROSTER</span>
          <h1 className="sub-title">Substitute Teacher Management</h1>
          <p className="sub-subtitle">
            Coordinate emergency and scheduled classroom lesson coverages, match certified relief subject
            masters, and disburse official school teaching honorariums in Ghanaian Cedi (GH₵).
          </p>
        </div>

        <div className="sub-header-actions">
          <button className="sub-btn-primary" onClick={() => setDeployModalOpen(true)}>
            <span className="sub-btn-icon">+</span> Deploy Replacement Teacher
          </button>
          <button className="sub-btn-secondary" onClick={() => setRegisterSubModalOpen(true)}>
            👨‍🏫 Add to Standby Pool
          </button>
        </div>
      </div>

      {/* KPI Highlights */}
      <div className="sub-kpi-grid">
        <div className="sub-kpi-card">
          <div className="sub-kpi-icon-wrap" style={{ background: "rgba(6, 182, 212, 0.15)", color: "#06b6d4" }}>
            👥
          </div>
          <div className="sub-kpi-body">
            <span className="sub-kpi-label">On-Call Standby Pool</span>
            <div className="sub-kpi-val">{substitutes.length} Certified <span className="sub-kpi-sub">Relief Faculty</span></div>
          </div>
        </div>

        <div className="sub-kpi-card">
          <div className="sub-kpi-icon-wrap" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
            ✅
          </div>
          <div className="sub-kpi-body">
            <span className="sub-kpi-label">Active Lesson Coverages</span>
            <div className="sub-kpi-val">{assignments.length} Deployed <span className="sub-kpi-sub">This Term</span></div>
          </div>
        </div>

        <div className="sub-kpi-card">
          <div className="sub-kpi-icon-wrap" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b" }}>
            💰
          </div>
          <div className="sub-kpi-body">
            <span className="sub-kpi-label">Relief Honorarium Tariff</span>
            <div className="sub-kpi-val">GH₵ 250.00 <span className="sub-kpi-sub">Standard / Day</span></div>
          </div>
        </div>

        <div className="sub-kpi-card">
          <div className="sub-kpi-icon-wrap" style={{ background: "rgba(139, 92, 246, 0.15)", color: "#8b5cf6" }}>
            🛡️
          </div>
          <div className="sub-kpi-body">
            <span className="sub-kpi-label">Classroom Continuity</span>
            <div className="sub-kpi-val">100% Covered <span className="sub-kpi-sub">Zero Class Cancellations</span></div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sub-tab-strip">
        <button
          className={`sub-tab-btn ${activeTab === "assignments" ? "active" : ""}`}
          onClick={() => setActiveTab("assignments")}
        >
          📋 Active Coverage Deployments ({assignments.length})
        </button>
        <button
          className={`sub-tab-btn ${activeTab === "pool" ? "active" : ""}`}
          onClick={() => setActiveTab("pool")}
        >
          👥 Standby Substitute Faculty Pool ({substitutes.length})
        </button>
      </div>

      {/* TAB 1: ACTIVE DEPLOYMENTS TABLE */}
      {activeTab === "assignments" && (
        <div className="sub-card-wrap">
          <div className="sub-table-header">
            <div>
              <h3>Scheduled Lesson Coverages & Replacement Roster</h3>
              <p>Assignments authorized by the Principal to ensure continuous curriculum instruction.</p>
            </div>
            <span className="sub-badge-active">Term 1 Active Log</span>
          </div>

          <div className="sub-table-responsive">
            <table className="sub-table">
              <thead>
                <tr>
                  <th>Ref ID & Date</th>
                  <th>Absent Faculty</th>
                  <th>Assigned Substitute</th>
                  <th>Class & Subject</th>
                  <th>Period Slot</th>
                  <th>Honorarium</th>
                  <th>Status</th>
                  <th>Authorized By</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <div className="sub-asn-id">{a.id}</div>
                      <div className="sub-asn-date">{a.date}</div>
                    </td>
                    <td>
                      <div className="sub-teacher-absent">{a.absentTeacherName}</div>
                      <div className="sub-reason-sub">"{a.reason}"</div>
                    </td>
                    <td>
                      <div className="sub-teacher-assigned">👨‍🏫 {a.substituteName}</div>
                    </td>
                    <td>
                      <div className="sub-subject-title">{a.subject}</div>
                      <div className="sub-cohort-sub">{a.classCohort}</div>
                    </td>
                    <td>
                      <div className="sub-time-pill">{a.periodTime}</div>
                    </td>
                    <td>
                      <span className="sub-stipend-badge">{a.stipend}</span>
                    </td>
                    <td>
                      <span
                        className={`sub-status-pill ${
                          a.status === "Confirmed" ? "status-confirmed" : "status-pending"
                        }`}
                      >
                        {a.status === "Confirmed" ? "✓ Confirmed" : "⏳ Pending Sign"}
                      </span>
                    </td>
                    <td>
                      <div className="sub-auth-name">{a.authorizedBy || <span className="sub-unauth">Awaiting Sign-off</span>}</div>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {a.status !== "Confirmed" ? (
                        <button
                          className="sub-btn-confirm-action"
                          onClick={() => handleAuthorizeAssignment(a.id)}
                        >
                          Authorize
                        </button>
                      ) : (
                        <button
                          className="sub-btn-voucher"
                          onClick={() => window.print()}
                          title="Print Daily Honorarium Voucher"
                        >
                          📜 Voucher
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: STANDBY FACULTY POOL */}
      {activeTab === "pool" && (
        <div className="sub-card-wrap">
          <div className="sub-table-header">
            <div>
              <h3>Certified On-Call Relief Faculty Roster</h3>
              <p>Pre-vetted subject specialists available for immediate assignment.</p>
            </div>
            <button className="sub-btn-primary" onClick={() => setRegisterSubModalOpen(true)}>
              + Register Relief Teacher
            </button>
          </div>

          <div className="sub-table-responsive">
            <table className="sub-table">
              <thead>
                <tr>
                  <th>Substitute Name & ID</th>
                  <th>Credentials & University</th>
                  <th>Discipline Specializations</th>
                  <th>Contact Details</th>
                  <th>Daily Honorarium</th>
                  <th>Availability</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {substitutes.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div className="sub-pool-name">{s.name}</div>
                      <div className="sub-pool-id">{s.id} • {s.campusAssigned}</div>
                    </td>
                    <td>
                      <div className="sub-pool-qual">{s.qualifications}</div>
                    </td>
                    <td>
                      <div className="sub-spec-tags">
                        {s.specializations.map((spec, i) => (
                          <span key={i} className="sub-spec-tag">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div className="sub-phone">{s.contactPhone}</div>
                      <div className="sub-email">{s.email}</div>
                    </td>
                    <td>
                      <strong style={{ color: "#10b981" }}>{s.stipendPerDay}</strong>
                    </td>
                    <td>
                      <span className={`sub-avail-pill ${s.status === "Available" ? "avail-open" : "avail-busy"}`}>
                        ● {s.status}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        className="sub-btn-deploy-single"
                        onClick={() => {
                          setSubstituteTeacher(s.name);
                          setDeployModalOpen(true);
                        }}
                      >
                        Deploy
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Deploy Replacement Modal */}
      {deployModalOpen && (
        <div className="sub-modal-overlay">
          <div className="sub-modal-box">
            <div className="sub-modal-header">
              <div>
                <h3>📝 Deploy Replacement Teacher</h3>
                <p>Assign qualified on-call faculty to cover an instructional period.</p>
              </div>
              <button className="sub-modal-close" onClick={() => setDeployModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleCreateDeployment} className="sub-modal-body">
              <div className="sub-form-grid">
                <div className="sub-form-field">
                  <label>Absent Regular Teacher:</label>
                  <select value={absentTeacher} onChange={(e) => setAbsentTeacher(e.target.value)}>
                    <option value="Marcus Brody (Social Studies)">Marcus Brody (Social Studies)</option>
                    <option value="Dr. Arthur Bell (Biology)">Dr. Arthur Bell (Biology)</option>
                    <option value="Mrs. Sarah Jenkins (Chemistry)">Mrs. Sarah Jenkins (Chemistry)</option>
                    <option value="Mr. Kofi Annan (Physics)">Mr. Kofi Annan (Physics)</option>
                  </select>
                </div>

                <div className="sub-form-field">
                  <label>Assigned Relief Teacher:</label>
                  <select value={substituteTeacher} onChange={(e) => setSubstituteTeacher(e.target.value)}>
                    {substitutes.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name} ({s.specializations.join(", ")})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sub-form-grid">
                <div className="sub-form-field">
                  <label>Target Class Cohort:</label>
                  <select value={deployCohort} onChange={(e) => setDeployCohort(e.target.value)}>
                    <option value="Grade 11-A">Grade 11-A (Science Track)</option>
                    <option value="Grade 11-B">Grade 11-B (General Arts)</option>
                    <option value="Grade 12-A">Grade 12-A (Final Year)</option>
                  </select>
                </div>

                <div className="sub-form-field">
                  <label>Subject Discipline:</label>
                  <input
                    type="text"
                    value={deploySubject}
                    onChange={(e) => setDeploySubject(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="sub-form-grid">
                <div className="sub-form-field">
                  <label>Period Slot & Time:</label>
                  <input
                    type="text"
                    value={deployPeriod}
                    onChange={(e) => setDeployPeriod(e.target.value)}
                    required
                  />
                </div>

                <div className="sub-form-field">
                  <label>Date of Coverage:</label>
                  <input
                    type="date"
                    value={deployDate}
                    onChange={(e) => setDeployDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="sub-form-field">
                <label>Official Absence Justification:</label>
                <input
                  type="text"
                  placeholder="e.g. Authorized Medical Leave, WASSCE Examination Marking Board"
                  value={deployReason}
                  onChange={(e) => setDeployReason(e.target.value)}
                  required
                />
              </div>

              <div className="sub-form-field">
                <label>Daily Honorarium Stipend (Ghanaian Cedi):</label>
                <div className="sub-stipend-input-wrap">
                  <span>GH₵</span>
                  <input
                    type="number"
                    step="10"
                    value={deployStipend}
                    onChange={(e) => setDeployStipend(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="sub-modal-footer">
                <button type="button" className="sub-btn-cancel" onClick={() => setDeployModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="sub-btn-save">
                  Confirm & Deploy Teacher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Register Standby Teacher Modal */}
      {registerSubModalOpen && (
        <div className="sub-modal-overlay">
          <div className="sub-modal-box">
            <div className="sub-modal-header">
              <div>
                <h3>➕ Register Standby Relief Teacher</h3>
                <p>Enlist certified educator into on-call institutional pool.</p>
              </div>
              <button className="sub-modal-close" onClick={() => setRegisterSubModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleRegisterSubstitute} className="sub-modal-body">
              <div className="sub-form-field">
                <label>Full Educator Name & Title:</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Kwesi Appiah, Mrs. Grace Mensah"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  required
                />
              </div>

              <div className="sub-form-field">
                <label>Academic Qualifications & Institution:</label>
                <input
                  type="text"
                  placeholder="e.g. M.Sc. Physics (KNUST), B.Ed. Mathematics (UCC)"
                  value={newSubQual}
                  onChange={(e) => setNewSubQual(e.target.value)}
                  required
                />
              </div>

              <div className="sub-form-field">
                <label>Teaching Subject Specializations (Comma-separated):</label>
                <input
                  type="text"
                  placeholder="e.g. Chemistry, Biology, Integrated Science"
                  value={newSubSpec}
                  onChange={(e) => setNewSubSpec(e.target.value)}
                  required
                />
              </div>

              <div className="sub-form-grid">
                <div className="sub-form-field">
                  <label>Contact Phone (Ghana):</label>
                  <input
                    type="text"
                    value={newSubPhone}
                    onChange={(e) => setNewSubPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="sub-form-field">
                  <label>Standard Day Honorarium (GH₵):</label>
                  <input
                    type="number"
                    step="10"
                    value={newSubStipend}
                    onChange={(e) => setNewSubStipend(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="sub-modal-footer">
                <button type="button" className="sub-btn-cancel" onClick={() => setRegisterSubModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="sub-btn-save">
                  Add to Standby Roster
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
