// Data store and state helpers for Module 12: Student Portal
// Standardized in Ghanaian Cedi (GH₵)

export const PORTAL_STUDENTS = [
  {
    id: "STU-SMIA-002",
    fullName: "Kwame Mensah",
    firstName: "Kwame",
    lastName: "Mensah",
    gender: "Male",
    dob: "2009-08-14",
    grade: "Grade 11",
    section: "11-A (Advanced Science)",
    campus: "Kensington Central Campus",
    rollNumber: "11A-04",
    academicYear: "2026 - 2027",
    gpa: "3.95",
    attendancePct: 99,
    feesStatus: "Paid",
    feesBalance: "GH₵0.00",
    email: "k.mensah@student.school.edu",
    phone: "+233 20 892 4410",
    address: "24 Independence Ave, Ridge, Accra",
    house: "St. George (Blue House)",
    bloodGroup: "A+",
    allergies: "None",
    nationalId: "GHA-8829104-9",
    classTutor: "Dr. Kwabena Asante",
    guardians: [
      { name: "Emmanuel Mensah", relation: "Father", phone: "+233 20 892 4400", email: "e.mensah@bank.gh", isPrimary: true },
      { name: "Grace Mensah", relation: "Mother", phone: "+233 20 892 4401", email: "g.mensah@health.gov.gh", isPrimary: false },
    ],
  },
  {
    id: "STU-SMIA-001",
    fullName: "Elena Rostova",
    firstName: "Elena",
    lastName: "Rostova",
    gender: "Female",
    dob: "2009-04-12",
    grade: "Grade 11",
    section: "11-A (Advanced Science)",
    campus: "Kensington Central Campus",
    rollNumber: "11A-01",
    academicYear: "2026 - 2027",
    gpa: "3.92",
    attendancePct: 98,
    feesStatus: "Paid",
    feesBalance: "GH₵0.00",
    email: "e.rostova@student.school.edu",
    phone: "+233 24 411 9081",
    address: "18 Cantonments Rd, Accra",
    house: "St. Patrick (Green House)",
    bloodGroup: "O+",
    allergies: "None",
    nationalId: "GHA-7731902-1",
    classTutor: "Dr. Kwabena Asante",
    guardians: [
      { name: "Dr. Mikhail Rostov", relation: "Father", phone: "+233 24 411 9001", email: "m.rostov@hospital.org", isPrimary: true },
    ],
  },
  {
    id: "STU-SMIA-015",
    fullName: "Dmitri Rostov Jr.",
    firstName: "Dmitri",
    lastName: "Rostov Jr.",
    gender: "Male",
    dob: "2012-07-22",
    grade: "Grade 8",
    section: "8-B (Middle School)",
    campus: "Kensington Central Campus",
    rollNumber: "8B-09",
    academicYear: "2026 - 2027",
    gpa: "3.78",
    attendancePct: 96,
    feesStatus: "Partial",
    feesBalance: "GH₵650.00",
    email: "d.rostov.jr@student.school.edu",
    phone: "+233 24 411 9085",
    address: "18 Cantonments Rd, Accra",
    house: "St. Andrew (Yellow House)",
    bloodGroup: "B+",
    allergies: "Mild Peanut Allergy",
    nationalId: "GHA-9941023-4",
    classTutor: "Mrs. Gertrude Addo",
    guardians: [
      { name: "Dr. Mikhail Rostov", relation: "Father", phone: "+233 24 411 9001", email: "m.rostov@hospital.org", isPrimary: true },
    ],
  },
];

// Screen 3: Timetable Data (Weekly & Daily)
export const WEEKLY_TIMETABLE = {
  Monday: [
    { period: "Period 1", time: "08:00 - 08:50", subject: "Core Mathematics", code: "MTH-401", room: "Hall B-12", teacher: "Dr. Jonathan Miller" },
    { period: "Period 2", time: "08:55 - 09:45", subject: "Advanced Physics", code: "PHY-302", room: "Physics Lab 3", teacher: "Mr. Kofi Annan" },
    { period: "Break", time: "09:45 - 10:15", subject: "Morning Snack & Assembly", code: "REC-01", room: "Quadrangle", teacher: "Duty Master" },
    { period: "Period 3", time: "10:15 - 11:05", subject: "Organic Chemistry", code: "CHM-301", room: "Chemistry Lab 1", teacher: "Mrs. Sarah Jenkins" },
    { period: "Period 4", time: "11:10 - 12:00", subject: "English Language & Lit", code: "ENG-204", room: "Room 104", teacher: "Mrs. Clara Oswald" },
    { period: "Lunch", time: "12:00 - 13:00", subject: "Midday Meal & Recreation", code: "LNC-01", room: "Dining Hall", teacher: "Campus Staff" },
    { period: "Period 5", time: "13:00 - 13:50", subject: "Computer Science & Python", code: "CSC-310", room: "Innovation Lab", teacher: "Dr. Margaret Hamilton" },
    { period: "Period 6", time: "13:55 - 14:45", subject: "Economics & Global Trade", code: "ECN-201", room: "Room 202", teacher: "Mr. Harrison Sterling" },
  ],
  Tuesday: [
    { period: "Period 1", time: "08:00 - 08:50", subject: "Advanced Physics", code: "PHY-302", room: "Physics Lab 3", teacher: "Mr. Kofi Annan" },
    { period: "Period 2", time: "08:55 - 09:45", subject: "Core Mathematics", code: "MTH-401", room: "Hall B-12", teacher: "Dr. Jonathan Miller" },
    { period: "Break", time: "09:45 - 10:15", subject: "Morning Snack", code: "REC-01", room: "Courtyard", teacher: "Duty Master" },
    { period: "Period 3", time: "10:15 - 11:05", subject: "Elective Biology", code: "BIO-305", room: "Biology Lab", teacher: "Dr. Matilda Quarshie" },
    { period: "Period 4", time: "11:10 - 12:00", subject: "Computer Science Lab", code: "CSC-310", room: "Innovation Lab", teacher: "Dr. Margaret Hamilton" },
    { period: "Lunch", time: "12:00 - 13:00", subject: "Lunch", code: "LNC-01", room: "Dining Hall", teacher: "Campus Staff" },
    { period: "Period 5", time: "13:00 - 13:50", subject: "French Language", code: "FRE-202", room: "Language Wing", teacher: "M. Jean-Paul Dupont" },
    { period: "Period 6", time: "13:55 - 14:45", subject: "Library Research Period", code: "LIB-101", room: "Main Library", teacher: "Mrs. Evelyn Carter" },
  ],
  Wednesday: [
    { period: "Period 1", time: "08:00 - 08:50", subject: "Organic Chemistry", code: "CHM-301", room: "Chemistry Lab 1", teacher: "Mrs. Sarah Jenkins" },
    { period: "Period 2", time: "08:55 - 09:45", subject: "Core Mathematics", code: "MTH-401", room: "Hall B-12", teacher: "Dr. Jonathan Miller" },
    { period: "Break", time: "09:45 - 10:15", subject: "Morning Snack", code: "REC-01", room: "Courtyard", teacher: "Duty Master" },
    { period: "Period 3", time: "10:15 - 11:05", subject: "English Language & Lit", code: "ENG-204", room: "Room 104", teacher: "Mrs. Clara Oswald" },
    { period: "Period 4", time: "11:10 - 12:00", subject: "Social Studies & Governance", code: "SOC-201", room: "Lecture Hall 2", teacher: "Mr. Kwesi Arthur" },
    { period: "Lunch", time: "12:00 - 13:00", subject: "Lunch", code: "LNC-01", room: "Dining Hall", teacher: "Campus Staff" },
    { period: "Period 5", time: "13:00 - 13:50", subject: "Robotics & Automation", code: "ROB-402", room: "Maker Space", teacher: "Eng. Desmond Ocloo" },
    { period: "Period 6", time: "13:55 - 14:45", subject: "Physical Education & Games", code: "PHE-101", room: "Sports Field", teacher: "Coach Evans Mensah" },
  ],
  Thursday: [
    { period: "Period 1", time: "08:00 - 08:50", subject: "Computer Science & Python", code: "CSC-310", room: "Innovation Lab", teacher: "Dr. Margaret Hamilton" },
    { period: "Period 2", time: "08:55 - 09:45", subject: "Advanced Physics", code: "PHY-302", room: "Physics Lab 3", teacher: "Mr. Kofi Annan" },
    { period: "Break", time: "09:45 - 10:15", subject: "Morning Snack", code: "REC-01", room: "Courtyard", teacher: "Duty Master" },
    { period: "Period 3", time: "10:15 - 11:05", subject: "Core Mathematics", code: "MTH-401", room: "Hall B-12", teacher: "Dr. Jonathan Miller" },
    { period: "Period 4", time: "11:10 - 12:00", subject: "Economics & Global Trade", code: "ECN-201", room: "Room 202", teacher: "Mr. Harrison Sterling" },
    { period: "Lunch", time: "12:00 - 13:00", subject: "Lunch", code: "LNC-01", room: "Dining Hall", teacher: "Campus Staff" },
    { period: "Period 5", time: "13:00 - 13:50", subject: "Organic Chemistry Practical", code: "CHM-301", room: "Chemistry Lab 1", teacher: "Mrs. Sarah Jenkins" },
    { period: "Period 6", time: "13:55 - 14:45", subject: "Pastoral Guidance & Mentorship", code: "PAS-101", room: "Auditorium", teacher: "Dr. Kwabena Asante" },
  ],
  Friday: [
    { period: "Period 1", time: "08:00 - 08:50", subject: "English Language & Lit", code: "ENG-204", room: "Room 104", teacher: "Mrs. Clara Oswald" },
    { period: "Period 2", time: "08:55 - 09:45", subject: "Elective Biology", code: "BIO-305", room: "Biology Lab", teacher: "Dr. Matilda Quarshie" },
    { period: "Break", time: "09:45 - 10:15", subject: "Morning Snack", code: "REC-01", room: "Courtyard", teacher: "Duty Master" },
    { period: "Period 3", time: "10:15 - 11:05", subject: "Core Mathematics Quiz", code: "MTH-401", room: "Hall B-12", teacher: "Dr. Jonathan Miller" },
    { period: "Period 4", time: "11:10 - 12:00", subject: "French Oral & Culture", code: "FRE-202", room: "Language Wing", teacher: "M. Jean-Paul Dupont" },
    { period: "Lunch", time: "12:00 - 13:00", subject: "Lunch", code: "LNC-01", room: "Dining Hall", teacher: "Campus Staff" },
    { period: "Period 5", time: "13:00 - 14:30", subject: "Clubs & Society Activities", code: "ACT-01", room: "Activity Centers", teacher: "Faculty Advisors" },
  ],
};

// Screen 4: Attendance History Log
export const STUDENT_ATTENDANCE_LOGS = [
  { id: "ATT-101", date: "2026-11-19", day: "Thursday", status: "Present", timeIn: "07:44 AM", timeOut: "03:15 PM", remarks: "Punctual. Perfect morning roll." },
  { id: "ATT-102", date: "2026-11-18", day: "Wednesday", status: "Present", timeIn: "07:50 AM", timeOut: "03:10 PM", remarks: "Present for morning lab." },
  { id: "ATT-103", date: "2026-11-17", day: "Tuesday", status: "Late", timeIn: "08:12 AM", timeOut: "03:15 PM", remarks: "Arrived during Period 1 (Traffic Delay)." },
  { id: "ATT-104", date: "2026-11-14", day: "Friday", status: "Present", timeIn: "07:40 AM", timeOut: "03:30 PM", remarks: "Attended robotics afterschool." },
  { id: "ATT-105", date: "2026-11-13", day: "Thursday", status: "Present", timeIn: "07:48 AM", timeOut: "03:15 PM", remarks: "Full day attendance." },
  { id: "ATT-106", date: "2026-11-12", day: "Wednesday", status: "Present", timeIn: "07:45 AM", timeOut: "03:15 PM", remarks: "Full day attendance." },
  { id: "ATT-107", date: "2026-11-11", day: "Tuesday", status: "Excused", timeIn: "—", timeOut: "—", remarks: "Official Inter-School Mathematics Olympiad Team." },
  { id: "ATT-108", date: "2026-11-10", day: "Monday", status: "Present", timeIn: "07:35 AM", timeOut: "03:15 PM", remarks: "Punctual. Homeroom prefect." },
  { id: "ATT-109", date: "2026-11-07", day: "Friday", status: "Present", timeIn: "07:42 AM", timeOut: "03:15 PM", remarks: "Full day attendance." },
  { id: "ATT-110", date: "2026-11-06", day: "Thursday", status: "Present", timeIn: "07:46 AM", timeOut: "03:15 PM", remarks: "Full day attendance." },
];

// Screen 5: Academic Results
export const STUDENT_RESULTS_DATA = {
  term: "Term 1 (2026/2027)",
  division: "High School (Advanced Science)",
  gpa: "3.95",
  position: "2nd out of 42 Students",
  conduct: "Exemplary",
  headmasterRemark: "Brilliant performance with exceptional aptitude in STEM subjects. Keep up the distinguished work.",
  subjects: [
    { code: "MTH-401", name: "Core Mathematics & Calculus", classScore: 29, examScore: 68, total: 97, grade: "A+", points: 4.0, remark: "Outstanding mathematical precision and problem-solving." },
    { code: "PHY-302", name: "Advanced Physics & Robotics", classScore: 28, examScore: 66, total: 94, grade: "A", points: 4.0, remark: "Superb lab comprehension and theoretical mastery." },
    { code: "CHM-301", name: "Organic & Analytical Chemistry", classScore: 28, examScore: 64, total: 92, grade: "A", points: 4.0, remark: "Very diligent in stoichiometric analysis and titration." },
    { code: "CSC-310", name: "Computer Science & Python AI", classScore: 30, examScore: 69, total: 99, grade: "A+", points: 4.0, remark: "Exceptional algorithm architecture and clean coding." },
    { code: "ENG-204", name: "English Language & Literature", classScore: 27, examScore: 62, total: 89, grade: "A-", points: 3.7, remark: "Insightful literary essays and articulate oral expression." },
    { code: "ECN-201", name: "Economics & Global Trade", classScore: 26, examScore: 60, total: 86, grade: "B+", points: 3.3, remark: "Demonstrates keen understanding of macroeconomic principles." },
  ],
};

// Screen 6: Assignments & Coursework
export const INITIAL_ASSIGNMENTS = [
  {
    id: "ASN-2026-001",
    subject: "Physics",
    title: "Newtonian Gravitation & Orbital Motion Simulation",
    dueDate: "2026-11-23",
    status: "In Progress",
    maxScore: 100,
    score: null,
    teacher: "Mr. Kofi Annan",
    instructions: "Write a 3-page investigative report on planetary satellite orbital decay with Python simulation graphs.",
    submissionDate: null,
    submittedFile: null,
  },
  {
    id: "ASN-2026-002",
    subject: "Core Mathematics",
    title: "Integral Calculus & Areas under Polar Curves",
    dueDate: "2026-11-20",
    status: "Submitted",
    maxScore: 50,
    score: "49/50",
    teacher: "Dr. Jonathan Miller",
    instructions: "Solve Problem Set 4 questions 1-12. Show complete working steps for all definite integrals.",
    submissionDate: "2026-11-18",
    submittedFile: "Kwame_Mensah_Calculus_PS4.pdf",
  },
  {
    id: "ASN-2026-003",
    subject: "Computer Science",
    title: "Binary Search Tree & Dijkstra Shortest Path Implementation",
    dueDate: "2026-11-25",
    status: "In Progress",
    maxScore: 100,
    score: null,
    teacher: "Dr. Margaret Hamilton",
    instructions: "Implement Dijkstra's algorithm in Python with adjacency matrices and test against school route dataset.",
    submissionDate: null,
    submittedFile: null,
  },
  {
    id: "ASN-2026-004",
    subject: "Chemistry",
    title: "Volumetric Titration Analysis of Acid-Base Neutralization",
    dueDate: "2026-11-15",
    status: "Graded",
    maxScore: 100,
    score: "96/100",
    teacher: "Mrs. Sarah Jenkins",
    instructions: "Tabulate titration trials and compute molarity of unknown sodium hydroxide solution.",
    submissionDate: "2026-11-14",
    submittedFile: "Chemistry_Titration_LabReport.pdf",
  },
  {
    id: "ASN-2026-005",
    subject: "English Literature",
    title: "Thematic Analysis of Post-Colonial Identity in Modern Fiction",
    dueDate: "2026-11-28",
    status: "Pending",
    maxScore: 40,
    score: null,
    teacher: "Mrs. Clara Oswald",
    instructions: "Compose a 1,500-word comparative essay referencing texts read in Weeks 4 through 8.",
    submissionDate: null,
    submittedFile: null,
  },
];

// Screen 7: Learning Materials (Teacher-Uploaded Resources)
export const LEARNING_MATERIALS = [
  {
    id: "MAT-01",
    title: "Calculus Part II: Definite Integrals & Fundamental Theorem",
    subject: "Core Mathematics",
    category: "Lecture Slides",
    format: "PDF",
    size: "4.2 MB",
    uploadedBy: "Dr. Jonathan Miller",
    uploadDate: "2026-11-15",
    description: "Detailed slide deck covering Riemann sums, substitution techniques, and physics integration applications.",
  },
  {
    id: "MAT-02",
    title: "Quantum Physics & Wave-Particle Duality Laboratory Handbook",
    subject: "Advanced Physics",
    category: "Lab Manual",
    format: "PDF",
    size: "8.5 MB",
    uploadedBy: "Mr. Kofi Annan",
    uploadDate: "2026-11-12",
    description: "Required practical guide for Term 1 optics and electromagnetic wave experiments.",
  },
  {
    id: "MAT-03",
    title: "WASSCE Past Examination Papers with Model Answers (2020-2025)",
    subject: "Core Mathematics",
    category: "Past Papers",
    format: "ZIP",
    size: "18.4 MB",
    uploadedBy: "Dr. Kwabena Asante",
    uploadDate: "2026-11-10",
    description: "Comprehensive 5-year archive of official examination papers, marking schemes, and examiners' remarks.",
  },
  {
    id: "MAT-04",
    title: "Python 3 Algorithms & Data Structures Quick Reference Sheet",
    subject: "Computer Science",
    category: "Reference Guide",
    format: "PDF",
    size: "2.1 MB",
    uploadedBy: "Dr. Margaret Hamilton",
    uploadDate: "2026-11-08",
    description: "Syntax cheat sheet for big-O complexity, collections, recursion, and graph representations.",
  },
  {
    id: "MAT-05",
    title: "Organic Chemistry Reaction Mechanisms & Functional Groups",
    subject: "Chemistry",
    category: "Lecture Notes",
    format: "PDF",
    size: "6.7 MB",
    uploadedBy: "Mrs. Sarah Jenkins",
    uploadDate: "2026-11-04",
    description: "Illustrated study notes on alkanes, alkenes, alcohols, carboxylic acids, and esterification.",
  },
  {
    id: "MAT-06",
    title: "Critical Literary Devices & Essay Writing Handbook",
    subject: "English Literature",
    category: "Syllabus & Guide",
    format: "DOCX",
    size: "1.8 MB",
    uploadedBy: "Mrs. Clara Oswald",
    uploadDate: "2026-11-01",
    description: "Framework guide for rhetorical analysis, poetry scansion, and APA thesis structuring.",
  },
];

// Screen 8: School Calendar Events for Students
export const STUDENT_CALENDAR_EVENTS = [
  { id: "SCE-01", title: "Term 1 Mid-Term Assessments", date: "2026-11-23", endDate: "2026-11-27", category: "Examination", color: "#3b82f6", location: "Main Examination Hall" },
  { id: "SCE-02", title: "Inter-House Athletic & Track Championship", date: "2026-12-05", endDate: "2026-12-05", category: "Sports", color: "#10b981", location: "Olympic Field" },
  { id: "SCE-03", title: "Final End-of-Term Terminal Examinations", date: "2026-12-08", endDate: "2026-12-15", category: "Examination", color: "#ef4444", location: "Academy Halls" },
  { id: "SCE-04", title: "Speech & Prize-Giving Day 2026", date: "2026-12-17", endDate: "2026-12-17", category: "Ceremony", color: "#f59e0b", location: "Dame Eleanor Vance Auditorium" },
  { id: "SCE-05", title: "End of Term 1 Vacation Respite", date: "2026-12-18", endDate: "2027-01-11", category: "Holiday", color: "#8b5cf6", location: "All Campuses" },
  { id: "SCE-06", title: "Term 2 Resumption & Academic Registration", date: "2027-01-12", endDate: "2027-01-12", category: "Academic", color: "#06b6d4", location: "Campus Registry" },
];

// Screen 9: Fees & Payments (Denominated in GH₵)
export const STUDENT_FEES_SCHEDULE = [
  { id: "INV-2026-01", title: "Term 1 Academic Tuition & Tuition Syllabus", amount: 3450, dueDate: "2026-09-15", status: "Paid", paidOn: "2026-09-10", method: "MTN Mobile Money", receiptId: "RCP-MOMO-91823" },
  { id: "INV-2026-02", title: "STEM Science & Robotics Lab Access Fee", amount: 450, dueDate: "2026-10-01", status: "Paid", paidOn: "2026-09-28", method: "Visa / Bank Card", receiptId: "RCP-CARD-88129" },
  { id: "INV-2026-03", title: "Extracurricular Sports, Athletics & Kit Levy", amount: 250, dueDate: "2026-11-10", status: "Paid", paidOn: "2026-11-05", method: "Cash at Bank", receiptId: "RCP-CASH-77182" },
  { id: "INV-2026-04", title: "Term 2 Tuition Advance (Early Settlement)", amount: 3450, dueDate: "2027-01-10", status: "Upcoming", paidOn: null, method: "—", receiptId: "—" },
];

// Screen 10: Notifications & Reminders
export const STUDENT_NOTIFICATIONS = [
  {
    id: "NOTIF-01",
    title: "Mid-Term Examination Seating Plan & Timetable Released",
    category: "Academic Assessment",
    priority: "High",
    date: "2026-11-18",
    time: "10:30 AM",
    read: false,
    message: "The final seating arrangements and session timetables for the Grade 11 Mid-Term assessment week have been published. Inspect your roll number desk allocation.",
  },
  {
    id: "NOTIF-02",
    title: "Science & Robotics Club Meeting This Thursday",
    category: "Co-Curricular",
    priority: "Normal",
    date: "2026-11-17",
    time: "03:45 PM",
    read: false,
    message: "Preparation for the National Robotics League starts at 4:00 PM in Innovation Lab 2. Team members must bring their Arduino sensor kits.",
  },
  {
    id: "NOTIF-03",
    title: "Library Book Return Reminder: Quantum Mechanics Vol. 2",
    category: "Library Alert",
    priority: "Urgent",
    date: "2026-11-16",
    time: "08:15 AM",
    read: true,
    message: "Your borrowed book 'Quantum Mechanics Principles' is due for return by Friday Nov 20, 2026. Renew online or return at circulation counter.",
  },
  {
    id: "NOTIF-04",
    title: "Campus Cleanliness & Inter-House Inspection",
    category: "Campus Life",
    priority: "Normal",
    date: "2026-11-12",
    time: "07:30 AM",
    read: true,
    message: "House points for cleanliness and morning assembly orderliness have been tabulated. St. George House currently leads the table.",
  },
];

// Storage helpers
const ACTIVE_STUDENT_KEY = "sms_active_student_portal_user";
const ASSIGNMENTS_KEY = "sms_student_assignments_storage";
const NOTIFICATIONS_KEY = "sms_student_notifications_storage";

export function getActiveStudent() {
  try {
    const raw = localStorage.getItem(ACTIVE_STUDENT_KEY);
    return raw ? JSON.parse(raw) : PORTAL_STUDENTS[0];
  } catch {
    return PORTAL_STUDENTS[0];
  }
}

export function saveActiveStudent(stu) {
  localStorage.setItem(ACTIVE_STUDENT_KEY, JSON.stringify(stu));
  window.dispatchEvent(new CustomEvent("studentUserChanged", { detail: stu }));
}

export function getStoredAssignments() {
  try {
    const raw = localStorage.getItem(ASSIGNMENTS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_ASSIGNMENTS;
  } catch {
    return INITIAL_ASSIGNMENTS;
  }
}

export function saveStoredAssignments(list) {
  localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(list));
}

export function getStoredNotifications() {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    return raw ? JSON.parse(raw) : STUDENT_NOTIFICATIONS;
  } catch {
    return STUDENT_NOTIFICATIONS;
  }
}

export function saveStoredNotifications(list) {
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(list));
}
