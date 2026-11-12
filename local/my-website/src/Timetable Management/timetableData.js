// Central Data Store for Module 9: Timetable Management

export const DEFAULT_PERIODS = [
  {
    id: "PER-00",
    periodNumber: 0,
    name: "Morning Assembly & Devotion",
    startTime: "07:30",
    endTime: "08:00",
    duration: 30,
    type: "Assembly",
    isBreak: true,
    applicableDays: ["Monday", "Wednesday", "Friday"],
  },
  {
    id: "PER-01",
    periodNumber: 1,
    name: "Period 1",
    startTime: "08:00",
    endTime: "08:50",
    duration: 50,
    type: "Academic Lesson",
    isBreak: false,
    applicableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  },
  {
    id: "PER-02",
    periodNumber: 2,
    name: "Period 2",
    startTime: "08:50",
    endTime: "09:40",
    duration: 50,
    type: "Academic Lesson",
    isBreak: false,
    applicableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  },
  {
    id: "PER-BRK1",
    periodNumber: null,
    name: "Morning Snack & Refreshment Break",
    startTime: "09:40",
    endTime: "10:10",
    duration: 30,
    type: "Break",
    isBreak: true,
    applicableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  },
  {
    id: "PER-03",
    periodNumber: 3,
    name: "Period 3",
    startTime: "10:10",
    endTime: "11:00",
    duration: 50,
    type: "Academic Lesson",
    isBreak: false,
    applicableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  },
  {
    id: "PER-04",
    periodNumber: 4,
    name: "Period 4",
    startTime: "11:00",
    endTime: "11:50",
    duration: 50,
    type: "Academic Lesson",
    isBreak: false,
    applicableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  },
  {
    id: "PER-BRK2",
    periodNumber: null,
    name: "Midday Lunch & Recreation",
    startTime: "11:50",
    endTime: "12:40",
    duration: 50,
    type: "Lunch",
    isBreak: true,
    applicableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  },
  {
    id: "PER-05",
    periodNumber: 5,
    name: "Period 5",
    startTime: "12:40",
    endTime: "13:30",
    duration: 50,
    type: "Academic Lesson",
    isBreak: false,
    applicableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  },
  {
    id: "PER-06",
    periodNumber: 6,
    name: "Period 6",
    startTime: "13:30",
    endTime: "14:20",
    duration: 50,
    type: "Academic Lesson",
    isBreak: false,
    applicableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  },
  {
    id: "PER-07",
    periodNumber: 7,
    name: "Period 7 (Labs & Clubs)",
    startTime: "14:20",
    endTime: "15:10",
    duration: 50,
    type: "Co-Curricular / Practical",
    isBreak: false,
    applicableDays: ["Monday", "Tuesday", "Wednesday", "Thursday"],
  },
];

export const INITIAL_ROOMS = [
  {
    id: "RM-101",
    roomName: "Classroom 101 (Science A)",
    building: "Academic Block A",
    floor: "Ground Floor",
    capacity: 35,
    type: "Standard Classroom",
    facilities: ["Smart Board", "Air Conditioning", "WiFi 6", "Ergonomic Desks"],
    status: "Available",
    assignedCohort: "Grade 11-A",
  },
  {
    id: "RM-LAB-CHM",
    roomName: "Senior Chemistry Laboratory",
    building: "Science & Innovation Wing",
    floor: "1st Floor",
    capacity: 30,
    type: "Laboratory",
    facilities: ["Fume Hoods", "Bunsen Gas Outlets", "Emergency Eyewash", "Chemical Reagents Locker"],
    status: "In Use",
    assignedCohort: "Science Department",
  },
  {
    id: "RM-LAB-PHY",
    roomName: "Physics & Robotics Lab",
    building: "Science & Innovation Wing",
    floor: "Ground Floor",
    capacity: 28,
    type: "Laboratory",
    facilities: ["Oscilloscopes", "3D Printers", "Optical Benches", "High-Voltage Power Supplies"],
    status: "Available",
    assignedCohort: "Applied Physics",
  },
  {
    id: "RM-102",
    roomName: "Classroom 102 (General Arts)",
    building: "Academic Block A",
    floor: "Ground Floor",
    capacity: 40,
    type: "Standard Classroom",
    facilities: ["Digital Projector", "Ceiling Fans", "Audio PA System"],
    status: "Available",
    assignedCohort: "Grade 11-B",
  },
  {
    id: "RM-204",
    roomName: "Lecture Theatre 204",
    building: "Main Administration Hub",
    floor: "2nd Floor",
    capacity: 75,
    type: "Lecture Hall",
    facilities: ["Dual Projectors", "Lapel Mics", "Acoustic Paneling", "Tiered Seating"],
    status: "Available",
    assignedCohort: "General School",
  },
  {
    id: "RM-ICT-1",
    roomName: "Computer Science & ICT Center",
    building: "Technology Pavilion",
    floor: "1st Floor",
    capacity: 45,
    type: "Computer Lab",
    facilities: ["45 iMac Workstations", "Gigabit LAN", "Server Rack", "Uninterruptible Power Supply"],
    status: "Maintenance",
    assignedCohort: "ICT Faculty",
  },
];

export const INITIAL_TIMETABLE_SLOTS = [
  // Grade 11-A (Science Track) Timetable
  {
    id: "SLOT-101",
    classCohort: "Grade 11-A",
    day: "Monday",
    periodId: "PER-01",
    periodNumber: 1,
    time: "08:00 - 08:50",
    subject: "Elective Mathematics",
    subjectCode: "MTH-401",
    teacherId: "TCH-2026-101",
    teacherName: "Dr. Jonathan Miller",
    roomId: "RM-101",
    roomName: "Classroom 101",
    color: "#6366f1",
  },
  {
    id: "SLOT-102",
    classCohort: "Grade 11-A",
    day: "Monday",
    periodId: "PER-02",
    periodNumber: 2,
    time: "08:50 - 09:40",
    subject: "Chemistry",
    subjectCode: "CHM-301",
    teacherId: "TCH-2026-102",
    teacherName: "Mrs. Sarah Jenkins",
    roomId: "RM-LAB-CHM",
    roomName: "Senior Chemistry Lab",
    color: "#10b981",
  },
  {
    id: "SLOT-103",
    classCohort: "Grade 11-A",
    day: "Monday",
    periodId: "PER-03",
    periodNumber: 3,
    time: "10:10 - 11:00",
    subject: "Physics",
    subjectCode: "PHY-302",
    teacherId: "TCH-GH-101",
    teacherName: "Mr. Kofi Annan",
    roomId: "RM-LAB-PHY",
    roomName: "Physics & Robotics Lab",
    color: "#3b82f6",
  },
  {
    id: "SLOT-104",
    classCohort: "Grade 11-A",
    day: "Monday",
    periodId: "PER-04",
    periodNumber: 4,
    time: "11:00 - 11:50",
    subject: "English Language",
    subjectCode: "ENG-204",
    teacherId: "TCH-2026-104",
    teacherName: "Dame Eleanor Vance",
    roomId: "RM-101",
    roomName: "Classroom 101",
    color: "#f59e0b",
  },
  {
    id: "SLOT-105",
    classCohort: "Grade 11-A",
    day: "Monday",
    periodId: "PER-05",
    periodNumber: 5,
    time: "12:40 - 13:30",
    subject: "Biology",
    subjectCode: "BIO-303",
    teacherId: "TCH-2026-105",
    teacherName: "Dr. Arthur Bell",
    roomId: "RM-101",
    roomName: "Classroom 101",
    color: "#ec4899",
  },
  {
    id: "SLOT-106",
    classCohort: "Grade 11-A",
    day: "Monday",
    periodId: "PER-06",
    periodNumber: 6,
    time: "13:30 - 14:20",
    subject: "Information Technology",
    subjectCode: "ICT-105",
    teacherId: "TCH-2026-106",
    teacherName: "Eng. Samuel Mensah",
    roomId: "RM-ICT-1",
    roomName: "Computer Lab 1",
    color: "#8b5cf6",
  },
  // Tuesday
  {
    id: "SLOT-107",
    classCohort: "Grade 11-A",
    day: "Tuesday",
    periodId: "PER-01",
    periodNumber: 1,
    time: "08:00 - 08:50",
    subject: "Physics",
    subjectCode: "PHY-302",
    teacherId: "TCH-GH-101",
    teacherName: "Mr. Kofi Annan",
    roomId: "RM-LAB-PHY",
    roomName: "Physics & Robotics Lab",
    color: "#3b82f6",
  },
  {
    id: "SLOT-108",
    classCohort: "Grade 11-A",
    day: "Tuesday",
    periodId: "PER-02",
    periodNumber: 2,
    time: "08:50 - 09:40",
    subject: "Elective Mathematics",
    subjectCode: "MTH-401",
    teacherId: "TCH-2026-101",
    teacherName: "Dr. Jonathan Miller",
    roomId: "RM-101",
    roomName: "Classroom 101",
    color: "#6366f1",
  },
  {
    id: "SLOT-109",
    classCohort: "Grade 11-A",
    day: "Tuesday",
    periodId: "PER-03",
    periodNumber: 3,
    time: "10:10 - 11:00",
    subject: "Chemistry Practical",
    subjectCode: "CHM-301",
    teacherId: "Mrs. Sarah Jenkins",
    teacherName: "Mrs. Sarah Jenkins",
    roomId: "RM-LAB-CHM",
    roomName: "Senior Chemistry Lab",
    color: "#10b981",
  },
  {
    id: "SLOT-110",
    classCohort: "Grade 11-A",
    day: "Tuesday",
    periodId: "PER-04",
    periodNumber: 4,
    time: "11:00 - 11:50",
    subject: "Social Studies & Civics",
    subjectCode: "SOC-101",
    teacherId: "TCH-2026-103",
    teacherName: "Marcus Brody",
    roomId: "RM-101",
    roomName: "Classroom 101",
    color: "#06b6d4",
  },
  // Wednesday
  {
    id: "SLOT-111",
    classCohort: "Grade 11-A",
    day: "Wednesday",
    periodId: "PER-01",
    periodNumber: 1,
    time: "08:00 - 08:50",
    subject: "Elective Mathematics",
    subjectCode: "MTH-401",
    teacherId: "TCH-2026-101",
    teacherName: "Dr. Jonathan Miller",
    roomId: "RM-101",
    roomName: "Classroom 101",
    color: "#6366f1",
  },
  {
    id: "SLOT-112",
    classCohort: "Grade 11-A",
    day: "Wednesday",
    periodId: "PER-02",
    periodNumber: 2,
    time: "08:50 - 09:40",
    subject: "Biology Lab",
    subjectCode: "BIO-303",
    teacherId: "TCH-2026-105",
    teacherName: "Dr. Arthur Bell",
    roomId: "RM-LAB-CHM",
    roomName: "Science Wing Lab",
    color: "#ec4899",
  },
  {
    id: "SLOT-113",
    classCohort: "Grade 11-A",
    day: "Wednesday",
    periodId: "PER-03",
    periodNumber: 3,
    time: "10:10 - 11:00",
    subject: "English Literature",
    subjectCode: "ENG-204",
    teacherId: "TCH-2026-104",
    teacherName: "Dame Eleanor Vance",
    roomId: "RM-101",
    roomName: "Classroom 101",
    color: "#f59e0b",
  },
  {
    id: "SLOT-114",
    classCohort: "Grade 11-A",
    day: "Wednesday",
    periodId: "PER-04",
    periodNumber: 4,
    time: "11:00 - 11:50",
    subject: "Physics",
    subjectCode: "PHY-302",
    teacherId: "TCH-GH-101",
    teacherName: "Mr. Kofi Annan",
    roomId: "RM-LAB-PHY",
    roomName: "Physics & Robotics Lab",
    color: "#3b82f6",
  },
  // Grade 12-A Sample Slot
  {
    id: "SLOT-201",
    classCohort: "Grade 12-A",
    day: "Monday",
    periodId: "PER-01",
    periodNumber: 1,
    time: "08:00 - 08:50",
    subject: "Advanced Chemistry",
    subjectCode: "CHM-401",
    teacherId: "TCH-2026-102",
    teacherName: "Mrs. Sarah Jenkins",
    roomId: "RM-204",
    roomName: "Lecture Theatre 204",
    color: "#10b981",
  },
  // Grade 11-B Sample Slot
  {
    id: "SLOT-301",
    classCohort: "Grade 11-B",
    day: "Monday",
    periodId: "PER-01",
    periodNumber: 1,
    time: "08:00 - 08:50",
    subject: "World History",
    subjectCode: "HIS-201",
    teacherId: "TCH-2026-103",
    teacherName: "Marcus Brody",
    roomId: "RM-102",
    roomName: "Classroom 102",
    color: "#06b6d4",
  },
];

export const INITIAL_SUBSTITUTE_TEACHERS = [
  {
    id: "SUB-01",
    name: "Dr. Kwesi Appiah",
    qualifications: "Ph.D. in Organic Chemistry, Univ. of Ghana",
    specializations: ["Chemistry", "General Science", "Biology"],
    contactPhone: "+233 24 991 4022",
    email: "k.appiah@substitutes.smia.edu.gh",
    stipendPerDay: "GH₵ 250.00",
    status: "Available",
    campusAssigned: "Kensington Central Campus",
  },
  {
    id: "SUB-02",
    name: "Mrs. Victoria Addo",
    qualifications: "M.Sc. in Applied Mathematics (KNUST)",
    specializations: ["Elective Mathematics", "Core Mathematics", "Physics"],
    contactPhone: "+233 20 551 8834",
    email: "v.addo@substitutes.smia.edu.gh",
    stipendPerDay: "GH₵ 250.00",
    status: "On Assignment",
    campusAssigned: "Kensington Central Campus",
  },
  {
    id: "SUB-03",
    name: "Mr. Emmanuel Darko",
    qualifications: "B.Ed. English & African Literature (UCC)",
    specializations: ["English Language", "Literature-in-English", "Social Studies"],
    contactPhone: "+233 27 120 9945",
    email: "e.darko@substitutes.smia.edu.gh",
    stipendPerDay: "GH₵ 200.00",
    status: "Available",
    campusAssigned: "North London Science Wing",
  },
  {
    id: "SUB-04",
    name: "Miss Abena Mensah",
    qualifications: "B.Sc. Computer Engineering (Ashesi University)",
    specializations: ["Information Technology", "Robotics", "Physics"],
    contactPhone: "+233 55 432 1098",
    email: "a.mensah@substitutes.smia.edu.gh",
    stipendPerDay: "GH₵ 250.00",
    status: "Available",
    campusAssigned: "Kensington Central Campus",
  },
];

export const INITIAL_SUBSTITUTE_ASSIGNMENTS = [
  {
    id: "SUBASN-2026-001",
    absentTeacherId: "TCH-2026-103",
    absentTeacherName: "Marcus Brody",
    substituteId: "SUB-03",
    substituteName: "Mr. Emmanuel Darko",
    classCohort: "Grade 11-B",
    subject: "World History",
    periodTime: "Monday, Period 1 (08:00 - 08:50)",
    date: "2026-11-16",
    reason: "Approved Academic Research Leave (Oxford Library)",
    stipend: "GH₵ 200.00",
    status: "Confirmed",
    authorizedBy: "Dame Eleanor Vance (Head Principal)",
  },
  {
    id: "SUBASN-2026-002",
    absentTeacherId: "TCH-2026-105",
    absentTeacherName: "Dr. Arthur Bell",
    substituteId: "SUB-01",
    substituteName: "Dr. Kwesi Appiah",
    classCohort: "Grade 11-A",
    subject: "Biology",
    periodTime: "Monday, Period 5 (12:40 - 13:30)",
    date: "2026-11-16",
    reason: "Authorized Medical Consultation",
    stipend: "GH₵ 250.00",
    status: "Pending Principal Sign",
    authorizedBy: null,
  },
];

// Helper functions for persistent storage
const PERIODS_KEY = "sms_module9_periods";
const ROOMS_KEY = "sms_module9_rooms";
const SLOTS_KEY = "sms_module9_slots";
const SUBSTITUTES_KEY = "sms_module9_substitutes";
const ASSIGNMENTS_KEY = "sms_module9_assignments";

export function getPeriods() {
  try {
    const data = localStorage.getItem(PERIODS_KEY);
    return data ? JSON.parse(data) : DEFAULT_PERIODS;
  } catch {
    return DEFAULT_PERIODS;
  }
}

export function savePeriods(list) {
  localStorage.setItem(PERIODS_KEY, JSON.stringify(list));
}

export function getRooms() {
  try {
    const data = localStorage.getItem(ROOMS_KEY);
    return data ? JSON.parse(data) : INITIAL_ROOMS;
  } catch {
    return INITIAL_ROOMS;
  }
}

export function saveRooms(list) {
  localStorage.setItem(ROOMS_KEY, JSON.stringify(list));
}

export function getTimetableSlots() {
  try {
    const data = localStorage.getItem(SLOTS_KEY);
    return data ? JSON.parse(data) : INITIAL_TIMETABLE_SLOTS;
  } catch {
    return INITIAL_TIMETABLE_SLOTS;
  }
}

export function saveTimetableSlots(list) {
  localStorage.setItem(SLOTS_KEY, JSON.stringify(list));
}

export function getSubstitutes() {
  try {
    const data = localStorage.getItem(SUBSTITUTES_KEY);
    return data ? JSON.parse(data) : INITIAL_SUBSTITUTE_TEACHERS;
  } catch {
    return INITIAL_SUBSTITUTE_TEACHERS;
  }
}

export function saveSubstitutes(list) {
  localStorage.setItem(SUBSTITUTES_KEY, JSON.stringify(list));
}

export function getSubstituteAssignments() {
  try {
    const data = localStorage.getItem(ASSIGNMENTS_KEY);
    return data ? JSON.parse(data) : INITIAL_SUBSTITUTE_ASSIGNMENTS;
  } catch {
    return INITIAL_SUBSTITUTE_ASSIGNMENTS;
  }
}

export function saveSubstituteAssignments(list) {
  localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(list));
}

// Conflict Detection Algorithm: checks if two slots clash in teacher, room, or class cohort
export function detectConflicts(slots) {
  const conflicts = [];

  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      const a = slots[i];
      const b = slots[j];

      if (a.day === b.day && a.periodId === b.periodId) {
        // Teacher double booking
        if (a.teacherName === b.teacherName) {
          conflicts.push({
            id: `CONF-TCH-${a.id}-${b.id}`,
            type: "Teacher Conflict",
            severity: "High",
            description: `${a.teacherName} is double-booked on ${a.day} (${a.time}) for both ${a.classCohort} (${a.subject}) and ${b.classCohort} (${b.subject}).`,
            slotA: a,
            slotB: b,
            resolutionSuggestion: `Reassign ${b.classCohort} (${b.subject}) to an open period or assign a substitute teacher.`,
          });
        }

        // Room double booking
        if (a.roomName === b.roomName) {
          conflicts.push({
            id: `CONF-RM-${a.id}-${b.id}`,
            type: "Room Conflict",
            severity: "Critical",
            description: `${a.roomName} is double-booked on ${a.day} (${a.time}) by ${a.classCohort} (${a.subject}) and ${b.classCohort} (${b.subject}).`,
            slotA: a,
            slotB: b,
            resolutionSuggestion: `Move ${b.classCohort} to an alternative available room or lecture theatre.`,
          });
        }

        // Class Cohort double booking
        if (a.classCohort === b.classCohort) {
          conflicts.push({
            id: `CONF-CLS-${a.id}-${b.id}`,
            type: "Class Overlap Conflict",
            severity: "High",
            description: `${a.classCohort} is scheduled for both ${a.subject} and ${b.subject} at the same time on ${a.day} (${a.time}).`,
            slotA: a,
            slotB: b,
            resolutionSuggestion: `Move one of the conflicting subjects to an unassigned period slot.`,
          });
        }
      }
    }
  }

  return conflicts;
}
