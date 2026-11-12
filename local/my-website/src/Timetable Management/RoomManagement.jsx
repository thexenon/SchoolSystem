import React, { useState, useEffect } from "react";
import TimetableNav from "./TimetableNav";
import { getRooms, saveRooms, getTimetableSlots } from "./timetableData";
import "./RoomManagement.css";

export default function RoomManagement() {
  const [rooms, setRooms] = useState([]);
  const [slots, setSlots] = useState([]);
  const [filterType, setFilterType] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [scheduleModalRoom, setScheduleModalRoom] = useState(null);
  const [toast, setToast] = useState(null);

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formBuilding, setFormBuilding] = useState("Academic Block A");
  const [formFloor, setFormFloor] = useState("Ground Floor");
  const [formCapacity, setFormCapacity] = useState(35);
  const [formType, setFormType] = useState("Standard Classroom");
  const [formCohort, setFormCohort] = useState("General School");
  const [facilityText, setFacilityText] = useState("Smart Board, Air Conditioning, WiFi 6");

  useEffect(() => {
    setRooms(getRooms());
    setSlots(getTimetableSlots());
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleOpenAdd = () => {
    setEditingRoom(null);
    setFormName("");
    setFormBuilding("Academic Block A");
    setFormFloor("Ground Floor");
    setFormCapacity(35);
    setFormType("Standard Classroom");
    setFormCohort("General School");
    setFacilityText("Smart Board, Air Conditioning, WiFi 6");
    setModalOpen(true);
  };

  const handleOpenEdit = (r) => {
    setEditingRoom(r);
    setFormName(r.roomName);
    setFormBuilding(r.building);
    setFormFloor(r.floor);
    setFormCapacity(r.capacity);
    setFormType(r.type);
    setFormCohort(r.assignedCohort || "General School");
    setFacilityText((r.facilities || []).join(", "));
    setModalOpen(true);
  };

  const handleSaveRoom = (e) => {
    e.preventDefault();
    const facilitiesArray = facilityText.split(",").map((s) => s.trim()).filter(Boolean);

    if (editingRoom) {
      const updated = rooms.map((r) =>
        r.id === editingRoom.id
          ? {
              ...r,
              roomName: formName,
              building: formBuilding,
              floor: formFloor,
              capacity: Number(formCapacity),
              type: formType,
              assignedCohort: formCohort,
              facilities: facilitiesArray,
            }
          : r
      );
      setRooms(updated);
      saveRooms(updated);
      showToast(`Room "${formName}" updated successfully!`);
    } else {
      const newId = `RM-${Date.now().toString().slice(-4)}`;
      const newRoom = {
        id: newId,
        roomName: formName,
        building: formBuilding,
        floor: formFloor,
        capacity: Number(formCapacity),
        type: formType,
        assignedCohort: formCohort,
        facilities: facilitiesArray,
        status: "Available",
      };
      const updated = [...rooms, newRoom];
      setRooms(updated);
      saveRooms(updated);
      showToast(`Learning space "${formName}" registered successfully!`);
    }
    setModalOpen(false);
  };

  const handleToggleStatus = (id) => {
    const updated = rooms.map((r) => {
      if (r.id === id) {
        const nextStatus = r.status === "Maintenance" ? "Available" : "Maintenance";
        return { ...r, status: nextStatus };
      }
      return r;
    });
    setRooms(updated);
    saveRooms(updated);
    showToast("Room maintenance status updated.");
  };

  const filteredRooms = rooms.filter((r) => {
    if (filterType !== "All" && r.type !== filterType) return false;
    if (
      searchTerm &&
      !r.roomName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !r.building.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const totalSeats = rooms.reduce((acc, curr) => acc + (curr.capacity || 0), 0);
  const labCount = rooms.filter((r) => r.type.includes("Laboratory") || r.type.includes("Computer")).length;

  return (
    <div className="rm-container">
      <TimetableNav
        title="Classroom & Laboratory Room Management"
        subtitle="Manage instructional spaces, seat capacities, laboratory equipment, and weekly room utilization"
        badge="Module 9 • Screen 5 of 7"
      />

      {toast && (
        <div className={`rm-toast rm-toast-${toast.type}`}>
          <div className="rm-toast-dot" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="rm-header">
        <div className="rm-title-box">
          <span className="rm-tag">CAMPUS LEARNING SPACES</span>
          <h1 className="rm-title">Classrooms & Laboratories Directory</h1>
          <p className="rm-subtitle">
            Catalog learning spaces, track maximum student occupancy limits, and inspect weekly classroom
            schedules to prevent overlapping bookings.
          </p>
        </div>

        <div className="rm-actions">
          <button className="rm-btn-primary" onClick={handleOpenAdd}>
            <span className="rm-btn-icon">+</span> Add Learning Space
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="rm-kpi-grid">
        <div className="rm-kpi-card">
          <div className="rm-kpi-icon-wrap" style={{ background: "rgba(6, 182, 212, 0.15)", color: "#06b6d4" }}>
            🏢
          </div>
          <div className="rm-kpi-body">
            <span className="rm-kpi-label">Active Learning Spaces</span>
            <div className="rm-kpi-val">{rooms.length} Venues <span className="rm-kpi-sub">Across 3 Wings</span></div>
          </div>
        </div>

        <div className="rm-kpi-card">
          <div className="rm-kpi-icon-wrap" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
            💺
          </div>
          <div className="rm-kpi-body">
            <span className="rm-kpi-label">Campus Seating Capacity</span>
            <div className="rm-kpi-val">{totalSeats} Desks <span className="rm-kpi-sub">Max Simultaneous</span></div>
          </div>
        </div>

        <div className="rm-kpi-card">
          <div className="rm-kpi-icon-wrap" style={{ background: "rgba(139, 92, 246, 0.15)", color: "#8b5cf6" }}>
            🔬
          </div>
          <div className="rm-kpi-body">
            <span className="rm-kpi-label">Specialized Laboratories</span>
            <div className="rm-kpi-val">{labCount} Labs <span className="rm-kpi-sub">Physics, Chem & ICT</span></div>
          </div>
        </div>

        <div className="rm-kpi-card">
          <div className="rm-kpi-icon-wrap" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b" }}>
            ⚡
          </div>
          <div className="rm-kpi-body">
            <span className="rm-kpi-label">Readiness Rate</span>
            <div className="rm-kpi-val">96.8% <span className="rm-kpi-sub">Operational</span></div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rm-toolbar">
        <div className="rm-search-box">
          <span className="rm-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by room name, building, or wing..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rm-search-input"
          />
        </div>

        <div className="rm-filter-box">
          <label>Space Classification:</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="rm-select">
            <option value="All">All Room Types ({rooms.length})</option>
            <option value="Standard Classroom">Standard Classrooms</option>
            <option value="Laboratory">Science Laboratories</option>
            <option value="Lecture Hall">Lecture Theatres</option>
            <option value="Computer Lab">Computer Labs</option>
          </select>
        </div>
      </div>

      {/* Rooms Table Card */}
      <div className="rm-card-wrap">
        <div className="rm-table-header">
          <div>
            <h3>Official Campus Learning Spaces Directory</h3>
            <p>Classrooms, specialized laboratories, and lecture auditoriums.</p>
          </div>
          <span className="rm-badge-facility">Fire Safety & ISO 9001 Audited</span>
        </div>

        <div className="rm-table-responsive">
          <table className="rm-table">
            <thead>
              <tr>
                <th>Room & ID</th>
                <th>Location & Wing</th>
                <th>Type</th>
                <th>Max Capacity</th>
                <th>Installed Facilities & Tech</th>
                <th>Status</th>
                <th>Assigned Cohort</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRooms.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div className="rm-room-title">{r.roomName}</div>
                    <div className="rm-room-id">{r.id}</div>
                  </td>
                  <td>
                    <div className="rm-building-text">{r.building}</div>
                    <div className="rm-floor-sub">{r.floor}</div>
                  </td>
                  <td>
                    <span
                      className={`rm-type-badge ${
                        r.type.includes("Lab") ? "badge-lab" : r.type.includes("Lecture") ? "badge-lecture" : "badge-standard"
                      }`}
                    >
                      {r.type}
                    </span>
                  </td>
                  <td>
                    <div className="rm-capacity-val">
                      <strong>{r.capacity}</strong> <span className="rm-capacity-unit">Seats</span>
                    </div>
                  </td>
                  <td>
                    <div className="rm-facilities-list">
                      {(r.facilities || []).slice(0, 3).map((f, i) => (
                        <span key={i} className="rm-facility-tag">
                          {f}
                        </span>
                      ))}
                      {(r.facilities || []).length > 3 && (
                        <span className="rm-facility-more">+{r.facilities.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`rm-status-pill ${
                        r.status === "Available"
                          ? "status-available"
                          : r.status === "Maintenance"
                          ? "status-maint"
                          : "status-inuse"
                      }`}
                    >
                      ● {r.status}
                    </span>
                  </td>
                  <td>
                    <div className="rm-cohort-text">{r.assignedCohort || "Shared"}</div>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div className="rm-action-btns">
                      <button
                        className="rm-btn-sub rm-btn-schedule"
                        onClick={() => setScheduleModalRoom(r)}
                        title="View Room Weekly Booking Schedule"
                      >
                        🗓️ Timetable
                      </button>
                      <button
                        className="rm-btn-sub rm-btn-edit"
                        onClick={() => handleOpenEdit(r)}
                        title="Edit Room Specifications"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="rm-btn-sub rm-btn-toggle"
                        onClick={() => handleToggleStatus(r.id)}
                        title="Toggle Maintenance Mode"
                      >
                        {r.status === "Maintenance" ? "Reopen" : "Maint"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Room Modal */}
      {modalOpen && (
        <div className="rm-modal-overlay">
          <div className="rm-modal-box">
            <div className="rm-modal-header">
              <div>
                <h3>{editingRoom ? "✏️ Edit Room Specifications" : "➕ Register New Learning Space"}</h3>
                <p>Configure room geometry, capacity, and specialized equipment.</p>
              </div>
              <button className="rm-modal-close" onClick={() => setModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveRoom} className="rm-modal-body">
              <div className="rm-form-field">
                <label>Room Name / Number:</label>
                <input
                  type="text"
                  placeholder="e.g. Science Lab 3, Classroom 205, Lecture Theatre 1"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                />
              </div>

              <div className="rm-form-grid">
                <div className="rm-form-field">
                  <label>Building / Wing:</label>
                  <select value={formBuilding} onChange={(e) => setFormBuilding(e.target.value)}>
                    <option value="Academic Block A">Academic Block A</option>
                    <option value="Science & Innovation Wing">Science & Innovation Wing</option>
                    <option value="Technology Pavilion">Technology Pavilion</option>
                    <option value="Main Administration Hub">Main Administration Hub</option>
                  </select>
                </div>

                <div className="rm-form-field">
                  <label>Floor Level:</label>
                  <select value={formFloor} onChange={(e) => setFormFloor(e.target.value)}>
                    <option value="Ground Floor">Ground Floor</option>
                    <option value="1st Floor">1st Floor</option>
                    <option value="2nd Floor">2nd Floor</option>
                    <option value="3rd Floor">3rd Floor</option>
                  </select>
                </div>
              </div>

              <div className="rm-form-grid">
                <div className="rm-form-field">
                  <label>Max Seating Capacity (Desks):</label>
                  <input
                    type="number"
                    min="10"
                    max="300"
                    value={formCapacity}
                    onChange={(e) => setFormCapacity(e.target.value)}
                    required
                  />
                </div>

                <div className="rm-form-field">
                  <label>Space Classification:</label>
                  <select value={formType} onChange={(e) => setFormType(e.target.value)}>
                    <option value="Standard Classroom">Standard Classroom</option>
                    <option value="Laboratory">Science Laboratory</option>
                    <option value="Computer Lab">Computer Lab</option>
                    <option value="Lecture Hall">Lecture Theatre</option>
                    <option value="Seminar Room">Seminar Room</option>
                  </select>
                </div>
              </div>

              <div className="rm-form-field">
                <label>Default Assigned Cohort / Department:</label>
                <input
                  type="text"
                  placeholder="e.g. Grade 11-A, Science Faculty, General Use"
                  value={formCohort}
                  onChange={(e) => setFormCohort(e.target.value)}
                />
              </div>

              <div className="rm-form-field">
                <label>Installed Facilities & Technology (Comma-separated):</label>
                <input
                  type="text"
                  placeholder="Smart Board, Air Conditioning, Fume Hoods, WiFi 6"
                  value={facilityText}
                  onChange={(e) => setFacilityText(e.target.value)}
                />
              </div>

              <div className="rm-modal-footer">
                <button type="button" className="rm-btn-cancel" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="rm-btn-save">
                  {editingRoom ? "Commit Changes" : "Register Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Room Weekly Schedule Inspection Modal */}
      {scheduleModalRoom && (
        <div className="rm-modal-overlay">
          <div className="rm-modal-box rm-modal-schedule">
            <div className="rm-modal-header">
              <div>
                <h3>📍 Room Timetable: {scheduleModalRoom.roomName}</h3>
                <p>
                  {scheduleModalRoom.building} • Max Capacity: {scheduleModalRoom.capacity} Students
                </p>
              </div>
              <button className="rm-modal-close" onClick={() => setScheduleModalRoom(null)}>✕</button>
            </div>

            <div className="rm-modal-body">
              <div className="rm-room-slots-list">
                {slots
                  .filter((s) => s.roomName === scheduleModalRoom.roomName || s.roomId === scheduleModalRoom.id)
                  .map((s) => (
                    <div key={s.id} className="rm-room-slot-card">
                      <div className="rm-rsc-time">
                        <strong>{s.day}</strong> • {s.time}
                      </div>
                      <div className="rm-rsc-main">
                        <span className="rm-rsc-subj">{s.subject}</span>
                        <span className="rm-rsc-cohort">{s.classCohort}</span>
                      </div>
                      <div className="rm-rsc-teacher">👨‍🏫 {s.teacherName}</div>
                    </div>
                  ))}

                {slots.filter((s) => s.roomName === scheduleModalRoom.roomName || s.roomId === scheduleModalRoom.id).length === 0 && (
                  <div className="rm-no-bookings">
                    No scheduled lessons currently booked for this venue. Available for open study or booking.
                  </div>
                )}
              </div>
            </div>

            <div className="rm-modal-footer">
              <button className="rm-btn-cancel" onClick={() => setScheduleModalRoom(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
