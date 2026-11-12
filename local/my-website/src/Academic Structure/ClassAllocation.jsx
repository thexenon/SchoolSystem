import React, { useState } from "react";
import AcademicNav from "./AcademicNav";
import "./ClassAllocation.css";
import { INITIAL_ALLOCATIONS, STREAMS_LIST, CLASSES_LIST } from "./academicData";
import SpinningWordsBackground from "../components/SpinningWordsBackground";
import MotivationQuoteWidget from "../components/MotivationQuoteWidget";

export default function ClassAllocation({ onNavigate }) {
  const [allocations, setAllocations] = useState(INITIAL_ALLOCATIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterClass, setFilterClass] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    assignedClass: "Grade 11",
    assignedStream: "Grade 11-A (General Science & STEM)",
    rollNumber: "11A-05",
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenAllocate = (stu) => {
    setSelectedStudent(stu);
    setFormData({
      assignedClass: stu.assignedClass === "Unallocated" ? "Grade 11" : stu.assignedClass,
      assignedStream:
        stu.assignedStream === "Unallocated"
          ? "Grade 11-A (General Science & STEM)"
          : stu.assignedStream,
      rollNumber: stu.rollNumber === "Pending" ? "11A-08" : stu.rollNumber,
    });
    setIsModalOpen(true);
  };

  const handleSaveAllocation = (e) => {
    e.preventDefault();
    if (!selectedStudent) return;

    setAllocations((prev) =>
      prev.map((item) =>
        item.id === selectedStudent.id
          ? {
              ...item,
              assignedClass: formData.assignedClass,
              assignedStream: formData.assignedStream,
              rollNumber: formData.rollNumber,
              assignedDate: new Date().toISOString().split("T")[0],
              status: "Confirmed",
            }
          : item
      )
    );

    showToast(`Successfully allocated ${selectedStudent.studentName} to ${formData.assignedStream}!`);
    setIsModalOpen(false);
  };

  const handleAutoBalance = () => {
    let unallocatedCount = 0;
    setAllocations((prev) =>
      prev.map((item, idx) => {
        if (item.status === "Pending Allocation") {
          unallocatedCount++;
          const stream = STREAMS_LIST[idx % STREAMS_LIST.length];
          return {
            ...item,
            assignedClass: stream.className.split(" ")[0] + " " + stream.className.split(" ")[1],
            assignedStream: stream.name,
            rollNumber: `${stream.code}-${String(15 + idx).padStart(2, "0")}`,
            assignedDate: new Date().toISOString().split("T")[0],
            status: "Confirmed",
          };
        }
        return item;
      })
    );
    showToast(`Smart AI Auto-Balanced ${unallocatedCount} pending student allocations!`);
  };

  const filteredAllocations = allocations.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.studentName.toLowerCase().includes(q) ||
      item.studentId.toLowerCase().includes(q) ||
      item.assignedStream.toLowerCase().includes(q) ||
      item.rollNumber.toLowerCase().includes(q);
    const matchesStatus =
      filterStatus === "ALL" || item.status === filterStatus;
    const matchesClass =
      filterClass === "ALL" || item.assignedClass === filterClass;
    return matchesSearch && matchesStatus && matchesClass;
  });

  const pendingCount = allocations.filter((a) => a.status === "Pending Allocation").length;
  const confirmedCount = allocations.filter((a) => a.status === "Confirmed").length;

  return (
    <div className="alc-page-wrapper">
      <SpinningWordsBackground speed="slow" showControlBadge={false} />

      {/* Toast Alert */}
      {toastMessage && <div className="alc-toast">✓ {toastMessage}</div>}

      <AcademicNav
        activePath="/class-allocation"
        title="Class Allocation"
        subtitle="Assign students to classes, cohort streams, roll numbers, and balance capacity"
      />

      <MotivationQuoteWidget compact={true} />

      {/* KPI Stats Strip */}
      <div className="alc-kpi-grid">
        <div className="alc-kpi-card">
          <div className="alc-kpi-top">
            <span className="alc-kpi-label">Total Student Roster</span>
            <span className="alc-kpi-icon">👥</span>
          </div>
          <div className="alc-kpi-val">{allocations.length} Scholars</div>
          <div className="alc-kpi-sub">Enrolled for Current Academic Year</div>
        </div>

        <div className="alc-kpi-card">
          <div className="alc-kpi-top">
            <span className="alc-kpi-label">Confirmed Allocations</span>
            <span className="alc-kpi-icon">✓</span>
          </div>
          <div className="alc-kpi-val" style={{ color: "#34d399" }}>
            {confirmedCount} Assigned
          </div>
          <div className="alc-kpi-sub">Assigned to Form Class & Stream</div>
        </div>

        <div className="alc-kpi-card">
          <div className="alc-kpi-top">
            <span className="alc-kpi-label">Pending Allocation</span>
            <span className="alc-kpi-icon">⏳</span>
          </div>
          <div className="alc-kpi-val" style={{ color: pendingCount > 0 ? "#f59e0b" : "#38bdf8" }}>
            {pendingCount} Pending
          </div>
          <div className="alc-kpi-sub">Awaiting Section Assignment</div>
        </div>

        <div className="alc-kpi-card">
          <div className="alc-kpi-top">
            <span className="alc-kpi-label">Gender Equality Ratio</span>
            <span className="alc-kpi-icon">⚖️</span>
          </div>
          <div className="alc-kpi-val" style={{ color: "#fbbf24" }}>
            50% M / 50% F
          </div>
          <div className="alc-kpi-sub">Balanced Cohort Distribution</div>
        </div>
      </div>

      {/* Action / Search Bar */}
      <div className="alc-action-bar">
        <div className="alc-filters-row">
          <div className="alc-search-box">
            <span className="alc-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search student name, ID, roll number, or assigned stream..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="alc-clear-btn"
                onClick={() => setSearchQuery("")}
              >
                ×
              </button>
            )}
          </div>

          <select
            className="alc-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">All Allocation Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending Allocation">Pending Allocation</option>
          </select>

          <select
            className="alc-select"
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
          >
            <option value="ALL">All Classes</option>
            <option value="Grade 10">Grade 10</option>
            <option value="Grade 11">Grade 11</option>
            <option value="Grade 12">Grade 12</option>
          </select>
        </div>

        <button
          type="button"
          className="alc-btn-primary"
          onClick={handleAutoBalance}
          title="Automatically assign and balance pending students into open streams"
        >
          <span>⚡</span> Smart Auto-Balance Allocations
        </button>
      </div>

      {/* Allocations Table */}
      <div className="alc-table-container">
        <table className="alc-table">
          <thead>
            <tr>
              <th>Student ID & Name</th>
              <th>Gender</th>
              <th>Education Level</th>
              <th>Target Class</th>
              <th>Assigned Stream / Section</th>
              <th>Roll Number</th>
              <th>Allocation Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAllocations.map((a) => (
              <tr key={a.id} className={a.status === "Pending Allocation" ? "alc-pending-row" : ""}>
                <td>
                  <div className="alc-student-cell">
                    <span className="alc-avatar-circle">
                      {a.studentName[0]}
                    </span>
                    <div>
                      <div className="alc-stu-name">{a.studentName}</div>
                      <div className="alc-stu-id">{a.studentId}</div>
                    </div>
                  </div>
                </td>
                <td>{a.gender === "Female" ? "♀ Female" : "♂ Male"}</td>
                <td><span className="alc-level-tag">{a.level}</span></td>
                <td><strong>{a.assignedClass}</strong></td>
                <td>
                  {a.assignedStream === "Unallocated" ? (
                    <span className="alc-unalloc-chip">⚠️ Unallocated</span>
                  ) : (
                    <span className="alc-stream-chip">🔀 {a.assignedStream}</span>
                  )}
                </td>
                <td>
                  <span className="alc-roll-code">{a.rollNumber}</span>
                </td>
                <td style={{ fontSize: "12px", color: "#94a3b8" }}>{a.assignedDate}</td>
                <td>
                  <span
                    className={`alc-status-badge ${
                      a.status === "Confirmed" ? "alc-badge-confirmed" : "alc-badge-pending"
                    }`}
                  >
                    ● {a.status}
                  </span>
                </td>
                <td>
                  <button
                    type="button"
                    className="alc-btn-reassign"
                    onClick={() => handleOpenAllocate(a)}
                  >
                    {a.status === "Confirmed" ? "✏️ Reassign" : "＋ Allocate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAllocations.length === 0 && (
        <div className="alc-empty-state">
          <p>No students match the current filters.</p>
          <button
            type="button"
            className="alc-btn-primary"
            onClick={() => {
              setSearchQuery("");
              setFilterStatus("ALL");
              setFilterClass("ALL");
            }}
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Allocate Modal */}
      {isModalOpen && selectedStudent && (
        <div className="alc-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="alc-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="alc-modal-header">
              <h2>Allocate {selectedStudent.studentName}</h2>
              <button
                type="button"
                className="alc-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveAllocation} className="alc-modal-form">
              <div className="alc-modal-info">
                <div><strong>Student ID:</strong> {selectedStudent.studentId}</div>
                <div><strong>Gender:</strong> {selectedStudent.gender}</div>
                <div><strong>Level:</strong> {selectedStudent.level}</div>
              </div>

              <div className="alc-form-group">
                <label>Select Target Class</label>
                <select
                  value={formData.assignedClass}
                  onChange={(e) =>
                    setFormData({ ...formData, assignedClass: e.target.value })
                  }
                >
                  <option value="Grade 10">Grade 10 (Senior High 1)</option>
                  <option value="Grade 11">Grade 11 (Senior High 2)</option>
                  <option value="Grade 12">Grade 12 (Senior High 3)</option>
                  <option value="JHS 3">JHS 3 (Junior High)</option>
                </select>
              </div>

              <div className="alc-form-group">
                <label>Select Stream / Section Track</label>
                <select
                  value={formData.assignedStream}
                  onChange={(e) =>
                    setFormData({ ...formData, assignedStream: e.target.value })
                  }
                >
                  {STREAMS_LIST.map((str) => (
                    <option key={str.id} value={str.name}>
                      {str.name} ({str.enrolledCount}/{str.capacity} filled)
                    </option>
                  ))}
                </select>
              </div>

              <div className="alc-form-group">
                <label>Assign Roll Number / Desk Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 11A-04, 10A-12"
                  value={formData.rollNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, rollNumber: e.target.value })
                  }
                />
              </div>

              <div className="alc-modal-footer">
                <button
                  type="button"
                  className="alc-btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="alc-btn-primary">
                  Confirm Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
