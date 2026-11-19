// Central Data Store for Module 11: Parent and Guardian Portal
// Standardized in Ghanaian Cedi (GH₵)

export const INITIAL_PARENTS = [
  {
    id: "PAR-2026-001",
    fullName: "Mr. Dmitri Rostov",
    relationship: "Father & Legal Guardian",
    email: "d.rostov@academyparent.com",
    phone: "+233 24 990 1122",
    occupation: "Senior Petrochemical Engineer",
    address: "Plot 14, Ringway Estates, Osu, Accra, Ghana",
    preferredContact: "SMS & WhatsApp",
    emergencyContact: "+233 24 990 1123",
    linkedStudentIds: ["STU-SMIA-001", "STU-SMIA-015"],
  },
  {
    id: "PAR-2026-002",
    fullName: "Nana Osei Serwaa",
    relationship: "Mother & Legal Guardian",
    email: "n.serwaa@academyparent.com",
    phone: "+233 27 655 4400",
    occupation: "Managing Director, Ashanti Agro Logistics",
    address: "7 Volta Street, Airport Residential Area, Accra",
    preferredContact: "Email & Phone Call",
    emergencyContact: "+233 20 551 2299",
    linkedStudentIds: ["STU-SMIA-004"],
  },
];

export const LINKED_CHILDREN = [
  {
    id: "STU-SMIA-001",
    parentId: "PAR-2026-001",
    fullName: "Elena Rostova",
    firstName: "Elena",
    lastName: "Rostova",
    gender: "Female",
    dateOfBirth: "2009-04-12",
    bloodGroup: "O+",
    allergies: "None reported",
    classCohort: "Grade 11-A",
    rollNumber: "11A-01",
    academicTrack: "Science & Engineering Track",
    campus: "Ridge Main Campus",
    residentialStatus: "Full Boarder (Hall 2)",
    formTutor: "Dr. Kwabena Asante (Senior Physics Master)",
    tutorEmail: "k.asante@smia.edu.gh",
    gpa: "3.94",
    classRank: "1st of 42 Students",
    attendanceRate: 98.2,
    totalAbsences: 1,
    unexcusedAbsences: 0,
    termBillNet: 7600.0,
    amountPaid: 7600.0,
    balanceDue: 0.0,
    feeStatus: "Paid in Full",
    avatar: "ER",
  },
  {
    id: "STU-SMIA-015",
    parentId: "PAR-2026-001",
    fullName: "Dmitri Rostov Jr.",
    firstName: "Dmitri",
    lastName: "Rostov Jr.",
    gender: "Male",
    dateOfBirth: "2012-08-25",
    bloodGroup: "O+",
    allergies: "Peanuts (Mild)",
    classCohort: "Grade 8-B",
    rollNumber: "08B-14",
    academicTrack: "Junior High Foundation Track",
    campus: "Ridge Junior Campus",
    residentialStatus: "Day Scholar (Campus Shuttle Route 3)",
    formTutor: "Mrs. Abena Mensah (Mathematics Specialist)",
    tutorEmail: "a.mensah@smia.edu.gh",
    gpa: "3.75",
    classRank: "4th of 38 Students",
    attendanceRate: 95.0,
    totalAbsences: 3,
    unexcusedAbsences: 1,
    termBillNet: 4200.0,
    amountPaid: 3000.0,
    balanceDue: 1200.0,
    feeStatus: "Partial Payment",
    avatar: "DJ",
  },
  {
    id: "STU-SMIA-004",
    parentId: "PAR-2026-002",
    fullName: "Ama Serwaa",
    firstName: "Ama",
    lastName: "Serwaa",
    gender: "Female",
    dateOfBirth: "2009-02-18",
    bloodGroup: "A+",
    allergies: "Penicillin",
    classCohort: "Grade 11-A",
    rollNumber: "11A-09",
    academicTrack: "Science Track",
    campus: "Ridge Main Campus",
    residentialStatus: "Full Boarder",
    formTutor: "Dr. Kwabena Asante",
    tutorEmail: "k.asante@smia.edu.gh",
    gpa: "3.68",
    classRank: "6th of 42 Students",
    attendanceRate: 96.5,
    totalAbsences: 2,
    unexcusedAbsences: 0,
    termBillNet: 8600.0,
    amountPaid: 5000.0,
    balanceDue: 3600.0,
    feeStatus: "Partial Payment",
    avatar: "AS",
  },
];

export const CHILD_ATTENDANCE_LOGS = {
  "STU-SMIA-001": [
    { date: "2026-11-19", day: "Thursday", status: "Present", checkIn: "07:42 AM", remarks: "Prompt arrival for Morning Assembly." },
    { date: "2026-11-18", day: "Wednesday", status: "Present", checkIn: "07:38 AM", remarks: "On time." },
    { date: "2026-11-17", day: "Tuesday", status: "Present", checkIn: "07:45 AM", remarks: "On time." },
    { date: "2026-11-16", day: "Monday", status: "Present", checkIn: "07:35 AM", remarks: "On time." },
    { date: "2026-11-13", day: "Friday", status: "Present", checkIn: "07:40 AM", remarks: "On time." },
    { date: "2026-11-12", day: "Thursday", status: "Present", checkIn: "07:44 AM", remarks: "On time." },
    { date: "2026-11-11", day: "Wednesday", status: "Late Arrival", checkIn: "08:12 AM", remarks: "Traffic delay on Ridge highway." },
    { date: "2026-11-10", day: "Tuesday", status: "Present", checkIn: "07:40 AM", remarks: "On time." },
    { date: "2026-11-09", day: "Monday", status: "Present", checkIn: "07:32 AM", remarks: "On time." },
    { date: "2026-11-06", day: "Friday", status: "Excused Absence", checkIn: "—", remarks: "Representing SMIA at National Science Fair." },
  ],
  "STU-SMIA-015": [
    { date: "2026-11-19", day: "Thursday", status: "Present", checkIn: "07:48 AM", remarks: "Bus Route 3 on time." },
    { date: "2026-11-18", day: "Wednesday", status: "Present", checkIn: "07:50 AM", remarks: "On time." },
    { date: "2026-11-17", day: "Tuesday", status: "Unexcused Absence", checkIn: "—", remarks: "No parent notice received. Parent alerted via SMS." },
    { date: "2026-11-16", day: "Monday", status: "Present", checkIn: "07:46 AM", remarks: "On time." },
    { date: "2026-11-13", day: "Friday", status: "Present", checkIn: "07:42 AM", remarks: "On time." },
    { date: "2026-11-12", day: "Thursday", status: "Late Arrival", checkIn: "08:20 AM", remarks: "Shuttle bus puncture." },
    { date: "2026-11-11", day: "Wednesday", status: "Present", checkIn: "07:45 AM", remarks: "On time." },
  ],
};

export const CHILD_RESULTS_DATA = {
  "STU-SMIA-001": {
    term: "Term 1, 2026/2027 Academic Session",
    cohort: "Grade 11-A (Science Track)",
    gpa: "3.94",
    overallGrade: "A",
    classRank: "1st / 42",
    totalMarks: "588 / 600",
    conductReport: "Exemplary leadership, disciplined scholar, peer tutor in Physics & Mathematics.",
    principalSeal: "Dame Eleanor Vance (Head Principal)",
    subjects: [
      { code: "MTH-11", name: "Core Mathematics", classScore: 29, examScore: 68, total: 97, grade: "A+", points: 4.0, remarks: "Flawless mathematical proofing." },
      { code: "PHY-11", name: "Physics", classScore: 28, examScore: 67, total: 95, grade: "A+", points: 4.0, remarks: "Superb lab experimentation." },
      { code: "CHM-11", name: "Chemistry", classScore: 27, examScore: 65, total: 92, grade: "A", points: 4.0, remarks: "Excellent analytical precision." },
      { code: "BIO-11", name: "Biology", classScore: 28, examScore: 63, total: 91, grade: "A", points: 4.0, remarks: "Deep conceptual command." },
      { code: "ENG-11", name: "English Language & Lit.", classScore: 26, examScore: 60, total: 86, grade: "B+", points: 3.5, remarks: "Strong persuasive rhetoric." },
      { code: "ICT-11", name: "Elective Computing & AI", classScore: 30, examScore: 67, total: 97, grade: "A+", points: 4.0, remarks: "Top score in Python algorithms." },
    ],
  },
  "STU-SMIA-015": {
    term: "Term 1, 2026/2027 Academic Session",
    cohort: "Grade 8-B (Middle Division)",
    gpa: "3.75",
    overallGrade: "A-",
    classRank: "4th / 38",
    totalMarks: "525 / 600",
    conductReport: "Enthusiastic and respectful young scholar. Shows rapid progress in Science & English.",
    principalSeal: "Dame Eleanor Vance (Head Principal)",
    subjects: [
      { code: "MTH-08", name: "Integrated Mathematics", classScore: 26, examScore: 60, total: 86, grade: "B+", points: 3.5, remarks: "Good algebraic foundations." },
      { code: "SCI-08", name: "General Science", classScore: 28, examScore: 64, total: 92, grade: "A", points: 4.0, remarks: "Very inquisitive in practical sessions." },
      { code: "ENG-08", name: "English Language", classScore: 27, examScore: 62, total: 89, grade: "A-", points: 3.7, remarks: "Great vocabulary and reading speed." },
      { code: "SOC-08", name: "Social Studies", classScore: 25, examScore: 59, total: 84, grade: "B", points: 3.0, remarks: "Participates actively in debates." },
      { code: "ICT-08", name: "Information Technology", classScore: 28, examScore: 65, total: 93, grade: "A", points: 4.0, remarks: "Talented with scratch coding." },
      { code: "FRE-08", name: "French Language", classScore: 24, examScore: 57, total: 81, grade: "B", points: 3.0, remarks: "Consistent oral pronunciation work." },
    ],
  },
};

export const SCHOOL_ANNOUNCEMENTS = [
  {
    id: "ANN-2026-01",
    title: "Annual Parent-Teacher Association (PTA) General Assembly",
    category: "Administrative & Governance",
    urgency: "High Priority",
    date: "2026-11-25",
    time: "09:30 AM - 12:30 PM",
    venue: "Dame Eleanor Vance Auditorium, Ridge Campus",
    summary: "Review of 2026/2027 infrastructure endowment, STEM robotics lab expansion, and election of parent representatives.",
    publishedBy: "Office of the Head Principal",
    attachment: "PTA_Agenda_November_2026.pdf",
  },
  {
    id: "ANN-2026-02",
    title: "Mid-Term Examination & WASSCE Preparation Timetable Released",
    category: "Academic Assessment",
    urgency: "Notice",
    date: "2026-11-20",
    time: "All Day",
    venue: "Main Examination Hall",
    summary: "Formal revision timetables for Grade 11 and 12 finalists are now published. Parents are advised to inspect student preparation schedules.",
    publishedBy: "Academic Examinations Board",
    attachment: "MidTerm_Exam_Schedule_2026.pdf",
  },
  {
    id: "ANN-2026-03",
    title: "Inter-House Athletic & Swimming Championship 2026",
    category: "Sports & Co-Curricular",
    urgency: "Event",
    date: "2026-12-05",
    time: "08:00 AM - 04:00 PM",
    venue: "St. Michael's Olympic Sports Complex",
    summary: "All parents and families are cordially invited to cheer the four traditional houses (St. George, St. Andrew, St. Patrick, St. David).",
    publishedBy: "Physical Education Department",
    attachment: "Sports_Day_Parent_Guide.pdf",
  },
  {
    id: "ANN-2026-04",
    title: "Campus Medical & Routine Dental Health Screening",
    category: "Health & Wellbeing",
    urgency: "Notice",
    date: "2026-11-30",
    time: "08:30 AM - 02:00 PM",
    venue: "Academy Infirmary",
    summary: "Annual health check conducted by certified pediatric physicians from Ridge Regional Hospital. Reports will be shared on parent portal.",
    publishedBy: "School Health Directorate",
    attachment: null,
  },
];

export const SCHOOL_CALENDAR_EVENTS = [
  { id: "EVT-01", title: "Term 1 Mid-Term Assessments Begin", date: "2026-11-23", endDate: "2026-11-27", type: "Examination", color: "#3b82f6" },
  { id: "EVT-02", title: "PTA Annual General Assembly", date: "2026-11-25", endDate: "2026-11-25", type: "Parent Meeting", color: "#f59e0b" },
  { id: "EVT-03", title: "Inter-House Athletic Games", date: "2026-12-05", endDate: "2026-12-05", type: "Sports", color: "#10b981" },
  { id: "EVT-04", title: "Terminal Exams (All Divisions)", date: "2026-12-08", endDate: "2026-12-15", type: "Examination", color: "#ef4444" },
  { id: "EVT-05", title: "End of Term 1 Vacation & Carol Service", date: "2026-12-18", endDate: "2026-12-18", type: "Holiday", color: "#8b5cf6" },
  { id: "EVT-06", title: "Term 2 Resumption Date", date: "2027-01-12", endDate: "2027-01-12", type: "Academic", color: "#06b6d4" },
];

export const PARENT_ENQUIRIES = [
  {
    id: "ENQ-2026-041",
    parentId: "PAR-2026-001",
    studentId: "STU-SMIA-001",
    studentName: "Elena Rostova",
    subject: "Inquiry Regarding WAEC Advanced Robotics Lab Elective",
    department: "Academic Affairs",
    recipient: "Dr. Kwabena Asante (Form Tutor)",
    date: "2026-11-15",
    status: "Replied",
    message: "Good day Dr. Asante, we would like to confirm if Elena has been enrolled in the supplementary Saturday Robotics workshop.",
    reply: "Dear Mr. Rostov, yes indeed! Elena's enrollment has been approved with a full merit waiver. She will be leading the Python automation team.",
    replyDate: "2026-11-16 10:20 AM",
    repliedBy: "Dr. Kwabena Asante",
  },
  {
    id: "ENQ-2026-042",
    parentId: "PAR-2026-001",
    studentId: "STU-SMIA-015",
    studentName: "Dmitri Rostov Jr.",
    subject: "Morning Campus Bus Route 3 Pickup Time Adjustment",
    department: "Transport & Logistics",
    recipient: "Mr. Ebenezer Coffie (Transport Manager)",
    date: "2026-11-18",
    status: "Pending Response",
    message: "Hello, due to road rehabilitation on Ringway road, can the driver adjust the morning pick-up time to 07:15 AM?",
    reply: null,
    replyDate: null,
    repliedBy: null,
  },
];

// Storage Keys
const PARENT_KEY = "sms_module11_active_parent";
const ACTIVE_CHILD_KEY = "sms_module11_active_child";
const ENQUIRIES_KEY = "sms_module11_enquiries";

export function getActiveParent() {
  try {
    const data = localStorage.getItem(PARENT_KEY);
    return data ? JSON.parse(data) : INITIAL_PARENTS[0];
  } catch {
    return INITIAL_PARENTS[0];
  }
}

export function saveActiveParent(parent) {
  localStorage.setItem(PARENT_KEY, JSON.stringify(parent));
}

export function getActiveChildId() {
  try {
    const id = localStorage.getItem(ACTIVE_CHILD_KEY);
    return id || "STU-SMIA-001";
  } catch {
    return "STU-SMIA-001";
  }
}

export function saveActiveChildId(id) {
  localStorage.setItem(ACTIVE_CHILD_KEY, id);
}

export function getParentEnquiries() {
  try {
    const data = localStorage.getItem(ENQUIRIES_KEY);
    return data ? JSON.parse(data) : PARENT_ENQUIRIES;
  } catch {
    return PARENT_ENQUIRIES;
  }
}

export function saveParentEnquiries(list) {
  localStorage.setItem(ENQUIRIES_KEY, JSON.stringify(list));
}
