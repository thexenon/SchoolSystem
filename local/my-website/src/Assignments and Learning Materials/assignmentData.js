// Centralized Data Service for Module 13: Assignments and Learning Materials

export const INITIAL_ASSIGNMENTS_DATA = [
  {
    id: "ASN-2026-001",
    title: "Newtonian Gravitation & Orbital Decay Simulation",
    subject: "Advanced Physics",
    subjectCode: "PHY-302",
    targetClass: "Grade 11-A (Advanced Science)",
    teacher: "Mr. Kofi Annan",
    teacherEmail: "k.annan@faculty.school.edu",
    maxPoints: 100,
    passingScore: 60,
    dueDate: "2026-11-23",
    dueTime: "11:59 PM",
    status: "Published",
    createdAt: "2026-11-10",
    submissionType: "File Upload (.PDF / .ZIP)",
    instructions: "Perform analytical calculations for satellite orbital decay under atmospheric drag. Implement a simple computational model in Python or calculate manually for three altitude scenarios (250km, 400km, 700km). Include vector force diagrams and error analysis.",
    attachments: [
      { name: "Orbital_Decay_Formula_Sheet.pdf", size: "1.4 MB" },
      { name: "Satellite_Drag_Parameters.xlsx", size: "480 KB" },
    ],
    rubric: [
      { criteria: "Mathematical Derivations", points: 30 },
      { criteria: "Simulation / Methodology", points: 30 },
      { criteria: "Discussion & Error Margins", points: 25 },
      { criteria: "Formatting & Academic References", points: 15 },
    ],
    totalEnrolled: 38,
    submittedCount: 29,
    gradedCount: 22,
  },
  {
    id: "ASN-2026-002",
    title: "Integral Calculus: Definite Integrals & Arc Lengths",
    subject: "Core Mathematics",
    subjectCode: "MTH-401",
    targetClass: "Grade 11-A (Advanced Science)",
    teacher: "Dr. Jonathan Miller",
    teacherEmail: "j.miller@faculty.school.edu",
    maxPoints: 50,
    passingScore: 30,
    dueDate: "2026-11-20",
    dueTime: "05:00 PM",
    status: "Published",
    createdAt: "2026-11-08",
    submissionType: "Scanned Homework / PDF",
    instructions: "Complete Problem Set 4 questions 1 through 14 from the syllabus handbook. Fully justify every substitution technique (trigonometric substitution and integration by parts). Graph polar area boundaries where indicated.",
    attachments: [
      { name: "Problem_Set_4_Calculus.pdf", size: "2.1 MB" },
    ],
    rubric: [
      { criteria: "Correct Mathematical Steps", points: 30 },
      { criteria: "Polar Boundary Sketches", points: 10 },
      { criteria: "Accuracy of Final Solutions", points: 10 },
    ],
    totalEnrolled: 42,
    submittedCount: 40,
    gradedCount: 38,
  },
  {
    id: "ASN-2026-003",
    title: "Graph Traversal & Dijkstra Shortest Path Architecture",
    subject: "Computer Science",
    subjectCode: "CSC-310",
    targetClass: "Grade 11-A (Advanced Science)",
    teacher: "Dr. Margaret Hamilton",
    teacherEmail: "m.hamilton@faculty.school.edu",
    maxPoints: 100,
    passingScore: 65,
    dueDate: "2026-11-25",
    dueTime: "11:59 PM",
    status: "Published",
    createdAt: "2026-11-12",
    submissionType: "Python Source Code (.PY / .ZIP)",
    instructions: "Develop an object-oriented Python program implementing Dijkstra's algorithm for finding shortest paths on a weighted directed graph. Test against the provided campus road network dataset (nodes: 18, edges: 42). Benchmark asymptotic time complexity using min-priority queues.",
    attachments: [
      { name: "Campus_Graph_Dataset.json", size: "320 KB" },
      { name: "Dijkstra_Starter_Template.py", size: "8 KB" },
    ],
    rubric: [
      { criteria: "Correct Graph Implementation", points: 35 },
      { criteria: "Priority Queue Performance", points: 25 },
      { criteria: "Edge Case Handling", points: 20 },
      { criteria: "Code Cleanliness & Docstrings", points: 20 },
    ],
    totalEnrolled: 35,
    submittedCount: 24,
    gradedCount: 15,
  },
  {
    id: "ASN-2026-004",
    title: "Volumetric Titration & Acid-Base Stoichiometry Lab",
    subject: "Chemistry",
    subjectCode: "CHM-301",
    targetClass: "Grade 11-A (Advanced Science)",
    teacher: "Mrs. Sarah Jenkins",
    teacherEmail: "s.jenkins@faculty.school.edu",
    maxPoints: 100,
    passingScore: 60,
    dueDate: "2026-11-15",
    dueTime: "04:00 PM",
    status: "Published",
    createdAt: "2026-11-01",
    submissionType: "Formal Laboratory Report (.PDF)",
    instructions: "Submit formal laboratory write-up on titration of standardized 0.1M oxalic acid with unknown sodium hydroxide solution. Include raw burette readings, concordant titre volume calculations, indicator reaction theory, and balanced ionic equations.",
    attachments: [
      { name: "Acid_Base_Lab_Guidelines.pdf", size: "3.6 MB" },
    ],
    rubric: [
      { criteria: "Titre Data Concordance & Tables", points: 25 },
      { criteria: "Stoichiometric Calculations", points: 35 },
      { criteria: "Discussion & Indicator Theory", points: 25 },
      { criteria: "Laboratory Safety & Precautions", points: 15 },
    ],
    totalEnrolled: 38,
    submittedCount: 37,
    gradedCount: 37,
  },
  {
    id: "ASN-2026-005",
    title: "Post-Colonial Identity & Allegory in African Literature",
    subject: "English Literature",
    subjectCode: "ENG-204",
    targetClass: "Grade 11-A & 11-B",
    teacher: "Mrs. Clara Oswald",
    teacherEmail: "c.oswald@faculty.school.edu",
    maxPoints: 40,
    passingScore: 20,
    dueDate: "2026-11-28",
    dueTime: "11:59 PM",
    status: "Published",
    createdAt: "2026-11-14",
    submissionType: "Comparative Essay (.DOCX / .PDF)",
    instructions: "Compose an analytical 1,500-word comparative essay exploring allegorical representations of cultural conflict in Chinua Achebe's 'Things Fall Apart' and Ama Ata Aidoo's 'Anowa'. Cite specific textual passages using MLA 9th Edition.",
    attachments: [
      { name: "Literary_Essay_Rubric_MLA.pdf", size: "950 KB" },
    ],
    rubric: [
      { criteria: "Thesis & Critical Argument", points: 15 },
      { criteria: "Textual Evidence & Quotation", points: 15 },
      { criteria: "Structure, Tone & MLA Citations", points: 10 },
    ],
    totalEnrolled: 75,
    submittedCount: 18,
    gradedCount: 8,
  },
];

export const INITIAL_SUBMISSIONS_DATA = [
  {
    id: "SUB-001",
    assignmentId: "ASN-2026-001",
    studentId: "STU-SMIA-002",
    studentName: "Kwame Mensah",
    grade: "Grade 11-A",
    rollNumber: "11A-04",
    submittedAt: "2026-11-18 09:42 PM",
    status: "Graded",
    fileUrl: "Kwame_Mensah_Orbital_Decay_Report.pdf",
    fileSize: "3.2 MB",
    punctuality: "On Time (5 Days Early)",
    studentNote: "Included Python simulation graph output in Appendix B. Model assumes spherical satellite with 2.5m cross section.",
    gradePoints: 98,
    maxPoints: 100,
    gradedBy: "Mr. Kofi Annan",
    gradedAt: "2026-11-19 10:15 AM",
    feedback: "Outstanding mathematical derivation and exceptional orbital plotting. Excellent use of the Runge-Kutta numerical integration method. Keep up this university-caliber work!",
  },
  {
    id: "SUB-002",
    assignmentId: "ASN-2026-001",
    studentId: "STU-SMIA-001",
    studentName: "Elena Rostova",
    grade: "Grade 11-A",
    rollNumber: "11A-01",
    submittedAt: "2026-11-17 04:15 PM",
    status: "Graded",
    fileUrl: "Elena_Rostova_Physics_Orbital_Decay.pdf",
    fileSize: "2.8 MB",
    punctuality: "On Time (6 Days Early)",
    studentNote: "Derived analytical equations and tested atmospheric density variation using exponential model.",
    gradePoints: 96,
    maxPoints: 100,
    gradedBy: "Mr. Kofi Annan",
    gradedAt: "2026-11-18 02:30 PM",
    feedback: "Brilliant analytical work! The atmospheric scale-height approximation was very well articulated.",
  },
  {
    id: "SUB-003",
    assignmentId: "ASN-2026-001",
    studentId: "STU-SMIA-005",
    studentName: "Nana Osei Bonsu",
    grade: "Grade 11-A",
    rollNumber: "11A-12",
    submittedAt: "2026-11-19 08:30 AM",
    status: "Needs Grading",
    fileUrl: "Nana_Bonsu_Orbital_Decay.pdf",
    fileSize: "1.9 MB",
    punctuality: "On Time",
    studentNote: "Calculated trajectory graphs manually with plotted points.",
    gradePoints: null,
    maxPoints: 100,
    gradedBy: null,
    gradedAt: null,
    feedback: "",
  },
  {
    id: "SUB-004",
    assignmentId: "ASN-2026-002",
    studentId: "STU-SMIA-002",
    studentName: "Kwame Mensah",
    grade: "Grade 11-A",
    rollNumber: "11A-04",
    submittedAt: "2026-11-18 03:10 PM",
    status: "Graded",
    fileUrl: "Kwame_Mensah_Calculus_PS4.pdf",
    fileSize: "4.1 MB",
    punctuality: "On Time (2 Days Early)",
    studentNote: "Detailed handwriting with box answers for all 14 questions.",
    gradePoints: 49,
    maxPoints: 50,
    gradedBy: "Dr. Jonathan Miller",
    gradedAt: "2026-11-19 09:00 AM",
    feedback: "Exceptional clarity in trigonometric substitution. Minor sign slip on Question 8 step 3, otherwise flawless.",
  },
  {
    id: "SUB-005",
    assignmentId: "ASN-2026-003",
    studentId: "STU-SMIA-002",
    studentName: "Kwame Mensah",
    grade: "Grade 11-A",
    rollNumber: "11A-04",
    submittedAt: "2026-11-19 11:20 AM",
    status: "Needs Grading",
    fileUrl: "Kwame_Mensah_Dijkstra_Graph_Project.zip",
    fileSize: "1.1 MB",
    punctuality: "On Time",
    studentNote: "Includes unit tests with pytest and visualization script using networkx.",
    gradePoints: null,
    maxPoints: 100,
    gradedBy: null,
    gradedAt: null,
    feedback: "",
  },
  {
    id: "SUB-006",
    assignmentId: "ASN-2026-004",
    studentId: "STU-SMIA-002",
    studentName: "Kwame Mensah",
    grade: "Grade 11-A",
    rollNumber: "11A-04",
    submittedAt: "2026-11-14 02:40 PM",
    status: "Graded",
    fileUrl: "Chemistry_Titration_KwameMensah.pdf",
    fileSize: "3.7 MB",
    punctuality: "On Time",
    studentNote: "Concordant volumes within 0.05 cm3. Attached raw lab notebook scan.",
    gradePoints: 96,
    maxPoints: 100,
    gradedBy: "Mrs. Sarah Jenkins",
    gradedAt: "2026-11-15 11:30 AM",
    feedback: "Exemplary laboratory precision. Error calculation using propagation of uncertainties was very mature.",
  },
];

export const INITIAL_RESOURCES_DATA = [
  {
    id: "RES-001",
    title: "Calculus Part II: Definite Integrals & Fundamental Theorem",
    subject: "Core Mathematics",
    subjectCode: "MTH-401",
    category: "Lecture Slides",
    targetClass: "Grade 11-A",
    fileFormat: "PDF",
    fileSize: "4.2 MB",
    uploadedBy: "Dr. Jonathan Miller",
    uploadDate: "2026-11-15",
    downloads: 142,
    description: "Lecture deck covering Riemann sums, substitution techniques, and applications to physics.",
    url: "Calculus_Integrals_Deck.pdf",
  },
  {
    id: "RES-002",
    title: "Quantum Physics & Wave-Particle Duality Laboratory Handbook",
    subject: "Advanced Physics",
    subjectCode: "PHY-302",
    category: "Lab Manual",
    targetClass: "Grade 11-A",
    fileFormat: "PDF",
    fileSize: "8.5 MB",
    uploadedBy: "Mr. Kofi Annan",
    uploadDate: "2026-11-12",
    downloads: 118,
    description: "Required guide for Term 1 optics, photoelectric effect, and spectrometer experiments.",
    url: "Quantum_Physics_Lab_Handbook.pdf",
  },
  {
    id: "RES-003",
    title: "WASSCE Past Examination Papers with Model Answers (2020-2025)",
    subject: "Core Mathematics",
    subjectCode: "MTH-401",
    category: "Past Papers",
    targetClass: "All Divisions",
    fileFormat: "ZIP",
    fileSize: "18.4 MB",
    uploadedBy: "Dr. Kwabena Asante",
    uploadDate: "2026-11-10",
    downloads: 389,
    description: "Comprehensive 5-year archive of official examination papers, marking schemes, and examiner commentary.",
    url: "WASSCE_Math_5Year_Archive.zip",
  },
  {
    id: "RES-004",
    title: "Python 3 Algorithms & Data Structures Quick Reference Sheet",
    subject: "Computer Science",
    subjectCode: "CSC-310",
    category: "Reference Guide",
    targetClass: "Grade 11-A",
    fileFormat: "PDF",
    fileSize: "2.1 MB",
    uploadedBy: "Dr. Margaret Hamilton",
    uploadDate: "2026-11-08",
    downloads: 95,
    description: "Syntax cheat sheet for big-O complexity, collections, recursion, and graph representations.",
    url: "Python_Algorithms_Cheatsheet.pdf",
  },
  {
    id: "RES-005",
    title: "Organic Chemistry Reaction Mechanisms & Functional Groups",
    subject: "Chemistry",
    subjectCode: "CHM-301",
    category: "Lecture Notes",
    targetClass: "Grade 11-A",
    fileFormat: "PDF",
    fileSize: "6.7 MB",
    uploadedBy: "Mrs. Sarah Jenkins",
    uploadDate: "2026-11-04",
    downloads: 165,
    description: "Illustrated study notes on alkanes, alkenes, alcohols, carboxylic acids, and esterification.",
    url: "Organic_Chemistry_Reactions.pdf",
  },
  {
    id: "RES-006",
    title: "Critical Literary Devices & Essay Writing Handbook",
    subject: "English Literature",
    subjectCode: "ENG-204",
    category: "Syllabus Guide",
    targetClass: "Grade 11 & 12",
    fileFormat: "DOCX",
    fileSize: "1.8 MB",
    uploadedBy: "Mrs. Clara Oswald",
    uploadDate: "2026-11-01",
    downloads: 87,
    description: "Framework guide for rhetorical analysis, poetry scansion, and APA thesis structuring.",
    url: "Literary_Devices_Handbook.docx",
  },
];

// Storage keys
const ASSIGNMENTS_KEY = "sms_module13_assignments";
const SUBMISSIONS_KEY = "sms_module13_submissions";
const RESOURCES_KEY = "sms_module13_resources";
const ROLE_MODE_KEY = "sms_module13_user_role"; // 'teacher' or 'student'

export function getAssignments() {
  try {
    const raw = localStorage.getItem(ASSIGNMENTS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_ASSIGNMENTS_DATA;
  } catch {
    return INITIAL_ASSIGNMENTS_DATA;
  }
}

export function saveAssignments(data) {
  localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(data));
}

export function getSubmissions() {
  try {
    const raw = localStorage.getItem(SUBMISSIONS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_SUBMISSIONS_DATA;
  } catch {
    return INITIAL_SUBMISSIONS_DATA;
  }
}

export function saveSubmissions(data) {
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(data));
}

export function getResources() {
  try {
    const raw = localStorage.getItem(RESOURCES_KEY);
    return raw ? JSON.parse(raw) : INITIAL_RESOURCES_DATA;
  } catch {
    return INITIAL_RESOURCES_DATA;
  }
}

export function saveResources(data) {
  localStorage.setItem(RESOURCES_KEY, JSON.stringify(data));
}

export function getUserRoleMode() {
  try {
    return localStorage.getItem(ROLE_MODE_KEY) || "teacher";
  } catch {
    return "teacher";
  }
}

export function saveUserRoleMode(role) {
  localStorage.setItem(ROLE_MODE_KEY, role);
  window.dispatchEvent(new CustomEvent("assignmentRoleChanged", { detail: role }));
}
