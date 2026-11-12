// Module 8: Examinations and Results Central Data Store
// Currency standard: Ghanaian Cedi (GH₵) where applicable (e.g., remarking fees, exam certification)

export const DEFAULT_GRADING_SCALES = [
  {
    id: "SCALE-WAEC-SHS",
    name: "WAEC / WASSCE Standard Senior High Grading System",
    type: "WASSCE",
    applicableLevel: "Senior High School (SHS 1 - SHS 3)",
    isActive: true,
    grades: [
      { grade: "A1", minScore: 80, maxScore: 100, gpaPoint: 4.0, description: "Excellent / Distinction", creditWorth: true },
      { grade: "B2", minScore: 75, maxScore: 79, gpaPoint: 3.5, description: "Very Good", creditWorth: true },
      { grade: "B3", minScore: 70, maxScore: 74, gpaPoint: 3.0, description: "Good", creditWorth: true },
      { grade: "C4", minScore: 65, maxScore: 69, gpaPoint: 2.5, description: "Credit", creditWorth: true },
      { grade: "C5", minScore: 60, maxScore: 64, gpaPoint: 2.0, description: "Credit", creditWorth: true },
      { grade: "C6", minScore: 55, maxScore: 59, gpaPoint: 1.5, description: "Credit", creditWorth: true },
      { grade: "D7", minScore: 50, maxScore: 54, gpaPoint: 1.0, description: "Pass", creditWorth: false },
      { grade: "E8", minScore: 45, maxScore: 49, gpaPoint: 0.5, description: "Weak Pass", creditWorth: false },
      { grade: "F9", minScore: 0, maxScore: 44, gpaPoint: 0.0, description: "Fail", creditWorth: false },
    ],
  },
  {
    id: "SCALE-BECE-JHS",
    name: "BECE Basic Education Certificate Grading Scale",
    type: "BECE",
    applicableLevel: "Junior High School (JHS 1 - JHS 3)",
    isActive: false,
    grades: [
      { grade: "Grade 1", minScore: 90, maxScore: 100, gpaPoint: 4.0, description: "Highest Distinction", creditWorth: true },
      { grade: "Grade 2", minScore: 80, maxScore: 89, gpaPoint: 3.5, description: "Higher", creditWorth: true },
      { grade: "Grade 3", minScore: 70, maxScore: 79, gpaPoint: 3.0, description: "High", creditWorth: true },
      { grade: "Grade 4", minScore: 60, maxScore: 69, gpaPoint: 2.5, description: "High Average", creditWorth: true },
      { grade: "Grade 5", minScore: 55, maxScore: 59, gpaPoint: 2.0, description: "Average", creditWorth: true },
      { grade: "Grade 6", minScore: 50, maxScore: 54, gpaPoint: 1.5, description: "Low Average", creditWorth: true },
      { grade: "Grade 7", minScore: 45, maxScore: 49, gpaPoint: 1.0, description: "Low", creditWorth: false },
      { grade: "Grade 8", minScore: 40, maxScore: 44, gpaPoint: 0.5, description: "Lower", creditWorth: false },
      { grade: "Grade 9", minScore: 0, maxScore: 39, gpaPoint: 0.0, description: "Lowest / Fail", creditWorth: false },
    ],
  },
  {
    id: "SCALE-TERTIARY-GPA",
    name: "University & College 4.00 Cumulative Grade Point Scale",
    type: "GPA",
    applicableLevel: "Tertiary & Diploma Programmes",
    isActive: false,
    grades: [
      { grade: "A+", minScore: 90, maxScore: 100, gpaPoint: 4.0, description: "First Class Distinction", creditWorth: true },
      { grade: "A", minScore: 80, maxScore: 89, gpaPoint: 3.75, description: "First Class Honours", creditWorth: true },
      { grade: "B+", minScore: 75, maxScore: 79, gpaPoint: 3.5, description: "Second Class Upper", creditWorth: true },
      { grade: "B", minScore: 70, maxScore: 74, gpaPoint: 3.0, description: "Second Class Upper", creditWorth: true },
      { grade: "C+", minScore: 65, maxScore: 69, gpaPoint: 2.5, description: "Second Class Lower", creditWorth: true },
      { grade: "C", minScore: 60, maxScore: 64, gpaPoint: 2.0, description: "Third Class", creditWorth: true },
      { grade: "D+", minScore: 55, maxScore: 59, gpaPoint: 1.5, description: "Pass", creditWorth: true },
      { grade: "D", minScore: 50, maxScore: 54, gpaPoint: 1.0, description: "Low Pass", creditWorth: false },
      { grade: "F", minScore: 0, maxScore: 49, gpaPoint: 0.0, description: "Fail", creditWorth: false },
    ],
  },
];

export const INITIAL_ASSESSMENTS = [
  {
    id: "ASM-2026-001",
    title: "Mid-Term Examination: Elective Mathematics",
    code: "EMTH-MID-T1",
    type: "Examination",
    subject: "Elective Mathematics",
    subjectCode: "MTH-401",
    classCohort: "Grade 11-A (Science Track)",
    gradeLevel: "Senior High School (SHS 2)",
    academicYear: "2026 / 2027",
    term: "Term 1",
    totalMarks: 100,
    weightagePct: 30,
    passMark: 50,
    scheduledDate: "2026-11-20",
    durationMinutes: 120,
    venue: "Main Science Hall B",
    chiefExaminer: "Dr. Jonathan Miller",
    status: "Approved",
    submissionsCount: 28,
    totalExpected: 28,
    isPublished: true,
  },
  {
    id: "ASM-2026-002",
    title: "Physics & Circuit Theory Practical Lab Examination",
    code: "PHY-PRAC-T1",
    type: "Practical Lab Test",
    subject: "Physics",
    subjectCode: "PHY-302",
    classCohort: "Grade 11-A (Science Track)",
    gradeLevel: "Senior High School (SHS 2)",
    academicYear: "2026 / 2027",
    term: "Term 1",
    totalMarks: 50,
    weightagePct: 20,
    passMark: 25,
    scheduledDate: "2026-11-24",
    durationMinutes: 90,
    venue: "Robotics & Physics Lab 3",
    chiefExaminer: "Mr. Kofi Annan",
    status: "In Progress",
    submissionsCount: 24,
    totalExpected: 28,
    isPublished: false,
  },
  {
    id: "ASM-2026-003",
    title: "Continuous Assessment Quiz 2: Organic Chemistry",
    code: "CHM-QUIZ-02",
    type: "Class Quiz",
    subject: "Chemistry",
    subjectCode: "CHM-301",
    classCohort: "Grade 11-A (Science Track)",
    gradeLevel: "Senior High School (SHS 2)",
    academicYear: "2026 / 2027",
    term: "Term 1",
    totalMarks: 30,
    weightagePct: 15,
    passMark: 15,
    scheduledDate: "2026-11-14",
    durationMinutes: 45,
    venue: "Chemistry Lab 1",
    chiefExaminer: "Mrs. Sarah Jenkins",
    status: "Completed",
    submissionsCount: 28,
    totalExpected: 28,
    isPublished: true,
  },
  {
    id: "ASM-2026-004",
    title: "Mock WAEC English Essay & Comprehension Examination",
    code: "ENG-WAEC-MOCK",
    type: "Mock Examination",
    subject: "English Language",
    subjectCode: "ENG-204",
    classCohort: "Grade 12-A (Final Year)",
    gradeLevel: "Senior High School (SHS 3)",
    academicYear: "2026 / 2027",
    term: "Term 1",
    totalMarks: 100,
    weightagePct: 40,
    passMark: 50,
    scheduledDate: "2026-12-02",
    durationMinutes: 150,
    venue: "Great Assembly Hall",
    chiefExaminer: "Mrs. Clara Oswald",
    status: "Scheduled",
    submissionsCount: 0,
    totalExpected: 35,
    isPublished: false,
  },
  {
    id: "ASM-2026-005",
    title: "Computer Science & Python Data Structures Project Test",
    code: "CSC-PROJ-T1",
    type: "Project Assessment",
    subject: "Computer Science",
    subjectCode: "CSC-310",
    classCohort: "Grade 11-A (Science Track)",
    gradeLevel: "Senior High School (SHS 2)",
    academicYear: "2026 / 2027",
    term: "Term 1",
    totalMarks: 100,
    weightagePct: 25,
    passMark: 50,
    scheduledDate: "2026-11-28",
    durationMinutes: 180,
    venue: "Innovation Computer Lab",
    chiefExaminer: "Dr. Margaret Hamilton",
    status: "Scheduled",
    submissionsCount: 0,
    totalExpected: 28,
    isPublished: false,
  },
  {
    id: "ASM-2026-006",
    title: "Economics & African Trade Case Study Assignment",
    code: "ECN-CASE-01",
    type: "Assignment",
    subject: "Economics",
    subjectCode: "ECN-201",
    classCohort: "Grade 11-B (General Arts & Business)",
    gradeLevel: "Senior High School (SHS 2)",
    academicYear: "2026 / 2027",
    term: "Term 1",
    totalMarks: 40,
    weightagePct: 15,
    passMark: 20,
    scheduledDate: "2026-11-18",
    durationMinutes: 60,
    venue: "Room 202",
    chiefExaminer: "Mr. Harrison Sterling",
    status: "Under Review",
    submissionsCount: 30,
    totalExpected: 30,
    isPublished: false,
  },
];

export const INITIAL_EXAM_SCHEDULE = [
  {
    id: "EXSCH-01",
    examTitle: "Elective Mathematics Paper 1 (Objective & Theory)",
    assessmentId: "ASM-2026-001",
    subject: "Elective Mathematics",
    code: "MTH-401",
    class: "Grade 11-A",
    date: "2026-11-20",
    session: "Morning Session",
    startTime: "09:00 AM",
    endTime: "11:30 AM",
    duration: "2h 30m",
    hall: "Science Hall B",
    seatCount: 32,
    invigilator: "Mr. Kofi Annan",
    reliefInvigilator: "Mrs. Sarah Jenkins",
    status: "Confirmed",
  },
  {
    id: "EXSCH-02",
    examTitle: "Physics Practical Experiment Paper 3",
    assessmentId: "ASM-2026-002",
    subject: "Physics",
    code: "PHY-302",
    class: "Grade 11-A",
    date: "2026-11-24",
    session: "Morning Session",
    startTime: "09:30 AM",
    endTime: "11:00 AM",
    duration: "1h 30m",
    hall: "Robotics & Physics Lab 3",
    seatCount: 28,
    invigilator: "Dr. Jonathan Miller",
    reliefInvigilator: "Marcus Brody",
    status: "Confirmed",
  },
  {
    id: "EXSCH-03",
    examTitle: "Chemistry Paper 2 (Theory & Calculations)",
    assessmentId: "ASM-2026-003",
    subject: "Chemistry",
    code: "CHM-301",
    class: "Grade 11-A",
    date: "2026-11-26",
    session: "Afternoon Session",
    startTime: "01:30 PM",
    endTime: "03:30 PM",
    duration: "2h 00m",
    hall: "Chemistry Hall 1",
    seatCount: 30,
    invigilator: "Mrs. Clara Oswald",
    reliefInvigilator: "Dr. Arthur Bell",
    status: "Confirmed",
  },
  {
    id: "EXSCH-04",
    examTitle: "English Language WAEC Mock Paper 1 & 2",
    assessmentId: "ASM-2026-004",
    subject: "English Language",
    code: "ENG-204",
    class: "Grade 12-A",
    date: "2026-12-02",
    session: "Morning Session",
    startTime: "08:30 AM",
    endTime: "11:30 AM",
    duration: "3h 00m",
    hall: "Great Assembly Hall",
    seatCount: 80,
    invigilator: "Dame Eleanor Vance",
    reliefInvigilator: "Harrison Sterling",
    status: "Scheduled",
  },
];

export const INITIAL_STUDENT_MARKS = [
  {
    id: "MRK-1001",
    studentId: "STU-SMIA-002",
    studentName: "Kwame Mensah",
    rollNumber: "11A-04",
    classCohort: "Grade 11-A",
    subject: "Elective Mathematics",
    subjectCode: "MTH-401",
    teacherName: "Dr. Jonathan Miller",
    classScore: 29.5, // out of 30
    midTermScore: 19.5, // out of 20
    examScore: 49.0, // out of 50
    totalScore: 98.0,
    grade: "A1",
    gpaPoint: 4.0,
    positionInSubject: 1,
    remark: "Exceptional mastery of mathematical abstractions and calculus.",
    reviewStatus: "Approved",
    reviewedBy: "Dame Eleanor Vance (Head Principal)",
    reviewedAt: "2026-11-11",
    isPublished: true,
  },
  {
    id: "MRK-1002",
    studentId: "STU-SMIA-001",
    studentName: "Elena Rostova",
    rollNumber: "11A-01",
    classCohort: "Grade 11-A",
    subject: "Elective Mathematics",
    subjectCode: "MTH-401",
    teacherName: "Dr. Jonathan Miller",
    classScore: 28.5,
    midTermScore: 19.0,
    examScore: 48.5,
    totalScore: 96.0,
    grade: "A1",
    gpaPoint: 4.0,
    positionInSubject: 2,
    remark: "Outstanding performance with rigorous analytical solutions.",
    reviewStatus: "Approved",
    reviewedBy: "Dame Eleanor Vance (Head Principal)",
    reviewedAt: "2026-11-11",
    isPublished: true,
  },
  {
    id: "MRK-1003",
    studentId: "STU-SMIA-003",
    studentName: "Lucas Vance",
    rollNumber: "11A-07",
    classCohort: "Grade 11-A",
    subject: "Elective Mathematics",
    subjectCode: "MTH-401",
    teacherName: "Dr. Jonathan Miller",
    classScore: 24.0,
    midTermScore: 16.0,
    examScore: 44.0,
    totalScore: 84.0,
    grade: "A1",
    gpaPoint: 4.0,
    positionInSubject: 5,
    remark: "Very strong quantitative problem-solving skills.",
    reviewStatus: "Approved",
    reviewedBy: "Dame Eleanor Vance (Head Principal)",
    reviewedAt: "2026-11-11",
    isPublished: true,
  },
  {
    id: "MRK-1004",
    studentId: "STU-SMIA-004",
    studentName: "Ama Serwaa",
    rollNumber: "11A-09",
    classCohort: "Grade 11-A",
    subject: "Elective Mathematics",
    subjectCode: "MTH-401",
    teacherName: "Dr. Jonathan Miller",
    classScore: 27.0,
    midTermScore: 18.0,
    examScore: 47.0,
    totalScore: 92.0,
    grade: "A1",
    gpaPoint: 4.0,
    positionInSubject: 3,
    remark: "Superb attention to detail and consistent homework quality.",
    reviewStatus: "Approved",
    reviewedBy: "Dame Eleanor Vance (Head Principal)",
    reviewedAt: "2026-11-11",
    isPublished: true,
  },
  {
    id: "MRK-1005",
    studentId: "STU-SMIA-005",
    studentName: "Liam Carter",
    rollNumber: "11A-12",
    classCohort: "Grade 11-A",
    subject: "Elective Mathematics",
    subjectCode: "MTH-401",
    teacherName: "Dr. Jonathan Miller",
    classScore: 22.0,
    midTermScore: 14.5,
    examScore: 41.5,
    totalScore: 78.0,
    grade: "B2",
    gpaPoint: 3.5,
    positionInSubject: 8,
    remark: "Good comprehension; extra work needed on vectors.",
    reviewStatus: "Approved",
    reviewedBy: "Dame Eleanor Vance (Head Principal)",
    reviewedAt: "2026-11-11",
    isPublished: true,
  },
  {
    id: "MRK-1006",
    studentId: "STU-SMIA-006",
    studentName: "Sophia Martinez",
    rollNumber: "11A-15",
    classCohort: "Grade 11-A",
    subject: "Elective Mathematics",
    subjectCode: "MTH-401",
    teacherName: "Dr. Jonathan Miller",
    classScore: 28.0,
    midTermScore: 19.0,
    examScore: 48.0,
    totalScore: 95.0,
    grade: "A1",
    gpaPoint: 4.0,
    positionInSubject: 4,
    remark: "Excellent conceptual precision across algebra and calculus.",
    reviewStatus: "Approved",
    reviewedBy: "Dame Eleanor Vance (Head Principal)",
    reviewedAt: "2026-11-11",
    isPublished: true,
  },
  // Physics Marks
  {
    id: "MRK-1007",
    studentId: "STU-SMIA-002",
    studentName: "Kwame Mensah",
    rollNumber: "11A-04",
    classCohort: "Grade 11-A",
    subject: "Physics",
    subjectCode: "PHY-302",
    teacherName: "Mr. Kofi Annan",
    classScore: 29.0,
    midTermScore: 19.0,
    examScore: 49.0,
    totalScore: 97.0,
    grade: "A1",
    gpaPoint: 4.0,
    positionInSubject: 1,
    remark: "Superb lab technician and exceptional theoretical physicist.",
    reviewStatus: "Under Review",
    reviewedBy: "Pending Academic Dean",
    reviewedAt: null,
    isPublished: false,
  },
  {
    id: "MRK-1008",
    studentId: "STU-SMIA-001",
    studentName: "Elena Rostova",
    rollNumber: "11A-01",
    classCohort: "Grade 11-A",
    subject: "Physics",
    subjectCode: "PHY-302",
    teacherName: "Mr. Kofi Annan",
    classScore: 28.0,
    midTermScore: 18.5,
    examScore: 48.0,
    totalScore: 94.5,
    grade: "A1",
    gpaPoint: 4.0,
    positionInSubject: 2,
    remark: "Flawless circuit design and mechanics problem formulation.",
    reviewStatus: "Under Review",
    reviewedBy: "Pending Academic Dean",
    reviewedAt: null,
    isPublished: false,
  },
  // Chemistry Marks
  {
    id: "MRK-1009",
    studentId: "STU-SMIA-002",
    studentName: "Kwame Mensah",
    rollNumber: "11A-04",
    classCohort: "Grade 11-A",
    subject: "Chemistry",
    subjectCode: "CHM-301",
    teacherName: "Mrs. Sarah Jenkins",
    classScore: 30.0,
    midTermScore: 20.0,
    examScore: 49.5,
    totalScore: 99.5,
    grade: "A1",
    gpaPoint: 4.0,
    positionInSubject: 1,
    remark: "Top student nationwide in inorganic reaction mechanism.",
    reviewStatus: "Approved",
    reviewedBy: "Dame Eleanor Vance",
    reviewedAt: "2026-11-10",
    isPublished: true,
  },
  {
    id: "MRK-1010",
    studentId: "STU-SMIA-004",
    studentName: "Ama Serwaa",
    rollNumber: "11A-09",
    classCohort: "Grade 11-A",
    subject: "Chemistry",
    subjectCode: "CHM-301",
    teacherName: "Mrs. Sarah Jenkins",
    classScore: 26.5,
    midTermScore: 17.5,
    examScore: 45.0,
    totalScore: 89.0,
    grade: "A1",
    gpaPoint: 4.0,
    positionInSubject: 3,
    remark: "Very competent qualitative analysis laboratory report.",
    reviewStatus: "Approved",
    reviewedBy: "Dame Eleanor Vance",
    reviewedAt: "2026-11-10",
    isPublished: true,
  },
];

export const INITIAL_RESULTS_CORRECTIONS = [
  {
    id: "CORR-2026-001",
    studentId: "STU-SMIA-005",
    studentName: "Liam Carter",
    classCohort: "Grade 11-A",
    subject: "Elective Mathematics",
    assessmentId: "ASM-2026-001",
    previousScore: 72.0,
    correctedScore: 78.0,
    previousGrade: "B3",
    correctedGrade: "B2",
    reason: "Omission of Part B section 4 marks during manual grade sheet collation.",
    requestedBy: "Dr. Jonathan Miller (Subject Master)",
    requestedAt: "2026-11-11 14:20",
    authorizedBy: "Dame Eleanor Vance (Head Principal)",
    status: "Approved",
    feeAmount: "GH₵0.00",
    auditLog: "Recount verified with physical exam script by Head of Mathematics Department.",
  },
  {
    id: "CORR-2026-002",
    studentId: "STU-SMIA-003",
    studentName: "Lucas Vance",
    classCohort: "Grade 11-A",
    subject: "Physics",
    assessmentId: "ASM-2026-002",
    previousScore: 81.0,
    correctedScore: 85.5,
    previousGrade: "A1",
    correctedGrade: "A1",
    reason: "Continuous assessment lab report 4 submitted during authorized sick leave recount.",
    requestedBy: "Mr. Kofi Annan (Physics Faculty)",
    requestedAt: "2026-11-12 09:10",
    authorizedBy: null,
    status: "Pending Approval",
    feeAmount: "GH₵0.00",
    auditLog: "Awaiting final sign-off from Academic Dean.",
  },
  {
    id: "CORR-2026-003",
    studentId: "STU-SMIA-008",
    studentName: "David Osei",
    classCohort: "Grade 11-B",
    subject: "Economics",
    assessmentId: "ASM-2026-006",
    previousScore: 61.0,
    correctedScore: 68.0,
    previousGrade: "C5",
    correctedGrade: "C4",
    reason: "Guardian requested formal re-marking of Term 1 essay script.",
    requestedBy: "Mr. Harrison Sterling",
    requestedAt: "2026-11-09 11:45",
    authorizedBy: "Dame Eleanor Vance",
    status: "Approved",
    feeAmount: "GH₵150.00",
    auditLog: "Official remarking fee of GH₵150.00 cleared via MTN MoMo. Script re-graded.",
  },
];

// Helper functions for persistent state and CRUD operations
const EXAM_STORAGE_KEY = "sms_module8_assessments";
const MARKS_STORAGE_KEY = "sms_module8_marks";
const CORRECTIONS_STORAGE_KEY = "sms_module8_corrections";
const SCHEDULE_STORAGE_KEY = "sms_module8_schedule";
const GRADING_STORAGE_KEY = "sms_module8_grading";

export function getAssessments() {
  try {
    const data = localStorage.getItem(EXAM_STORAGE_KEY);
    return data ? JSON.parse(data) : INITIAL_ASSESSMENTS;
  } catch {
    return INITIAL_ASSESSMENTS;
  }
}

export function saveAssessments(list) {
  localStorage.setItem(EXAM_STORAGE_KEY, JSON.stringify(list));
}

export function getMarks() {
  try {
    const data = localStorage.getItem(MARKS_STORAGE_KEY);
    return data ? JSON.parse(data) : INITIAL_STUDENT_MARKS;
  } catch {
    return INITIAL_STUDENT_MARKS;
  }
}

export function saveMarks(list) {
  localStorage.setItem(MARKS_STORAGE_KEY, JSON.stringify(list));
}

export function getExamSchedules() {
  try {
    const data = localStorage.getItem(SCHEDULE_STORAGE_KEY);
    return data ? JSON.parse(data) : INITIAL_EXAM_SCHEDULE;
  } catch {
    return INITIAL_EXAM_SCHEDULE;
  }
}

export function saveExamSchedules(list) {
  localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(list));
}

export function getCorrections() {
  try {
    const data = localStorage.getItem(CORRECTIONS_STORAGE_KEY);
    return data ? JSON.parse(data) : INITIAL_RESULTS_CORRECTIONS;
  } catch {
    return INITIAL_RESULTS_CORRECTIONS;
  }
}

export function saveCorrections(list) {
  localStorage.setItem(CORRECTIONS_STORAGE_KEY, JSON.stringify(list));
}

export function getGradingScales() {
  try {
    const data = localStorage.getItem(GRADING_STORAGE_KEY);
    return data ? JSON.parse(data) : DEFAULT_GRADING_SCALES;
  } catch {
    return DEFAULT_GRADING_SCALES;
  }
}

export function saveGradingScales(list) {
  localStorage.setItem(GRADING_STORAGE_KEY, JSON.stringify(list));
}

export function calculateWassceGrade(score) {
  const num = Number(score) || 0;
  if (num >= 80) return { grade: "A1", gpa: 4.0, remark: "Excellent / Distinction" };
  if (num >= 75) return { grade: "B2", gpa: 3.5, remark: "Very Good" };
  if (num >= 70) return { grade: "B3", gpa: 3.0, remark: "Good" };
  if (num >= 65) return { grade: "C4", gpa: 2.5, remark: "Credit" };
  if (num >= 60) return { grade: "C5", gpa: 2.0, remark: "Credit" };
  if (num >= 55) return { grade: "C6", gpa: 1.5, remark: "Credit" };
  if (num >= 50) return { grade: "D7", gpa: 1.0, remark: "Pass" };
  if (num >= 45) return { grade: "E8", gpa: 0.5, remark: "Weak Pass" };
  return { grade: "F9", gpa: 0.0, remark: "Fail" };
}

