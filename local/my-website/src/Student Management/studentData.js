// Shared Student Data Service for Student Management Module
// All currency balances are denominated in Ghanaian Cedi (GH₵)
import { getActiveSchoolAdmin } from "../Platform Administration/schoolAdminAuth";

export const INITIAL_STUDENTS = [
  // --- School 1: St. Mary International Academy (SCH-001) ---
  {
    id: "STU-SMIA-001",
    schoolId: "SCH-001",
    schoolName: "St. Mary International Academy",
    firstName: "Elena",
    lastName: "Rostova",
    fullName: "Elena Rostova",
    gender: "Female",
    dob: "2009-04-12",
    grade: "Grade 11",
    section: "11-A (Advanced Science)",
    campus: "Kensington Central Campus",
    status: "Enrolled",
    rollNumber: "11A-01",
    academicYear: "2026 - 2027",
    gpa: "3.92",
    attendancePct: 98,
    feesStatus: "Paid",
    feesBalance: "GH₵0.00",
    email: "e.rostova@student.school.edu",
    phone: "+233 24 411 9081",
    address: "18 Cantonments Rd, Accra / London Campus",
    guardians: [
      { name: "Dr. Mikhail Rostov", relation: "Father", phone: "+233 24 411 9001", email: "m.rostov@hospital.org", isPrimary: true },
      { name: "Svetlana Rostova", relation: "Mother", phone: "+233 24 411 9002", email: "s.rostova@design.org", isPrimary: false },
    ],
    enrolledDate: "Sep 01, 2024",
    bloodGroup: "O+",
    allergies: "None",
  },
  {
    id: "STU-SMIA-002",
    schoolId: "SCH-001",
    schoolName: "St. Mary International Academy",
    firstName: "Kwame",
    lastName: "Mensah",
    fullName: "Kwame Mensah",
    gender: "Male",
    dob: "2009-08-14",
    grade: "Grade 11",
    section: "11-A (Advanced Science)",
    campus: "Kensington Central Campus",
    status: "Enrolled",
    rollNumber: "11A-04",
    academicYear: "2026 - 2027",
    gpa: "3.95",
    attendancePct: 99,
    feesStatus: "Paid",
    feesBalance: "GH₵0.00",
    email: "k.mensah@student.school.edu",
    phone: "+233 20 892 4410",
    address: "24 Independence Ave, Ridge, Accra",
    guardians: [
      { name: "Emmanuel Mensah", relation: "Father", phone: "+233 20 892 4400", email: "e.mensah@bank.gh", isPrimary: true },
    ],
    enrolledDate: "Sep 01, 2024",
    bloodGroup: "A+",
    allergies: "None",
  },
  {
    id: "STU-SMIA-003",
    schoolId: "SCH-001",
    schoolName: "St. Mary International Academy",
    firstName: "Lucas",
    lastName: "Vance",
    fullName: "Lucas Vance",
    gender: "Male",
    dob: "2010-08-23",
    grade: "Grade 10",
    section: "10-B (Robotics & Tech)",
    campus: "North London Science Wing",
    status: "Enrolled",
    rollNumber: "10B-14",
    academicYear: "2026 - 2027",
    gpa: "3.78",
    attendancePct: 95,
    feesStatus: "Paid",
    feesBalance: "GH₵0.00",
    email: "l.vance@student.school.edu",
    phone: "+44 7700 900219",
    address: "42 King's Rd, Chelsea",
    guardians: [
      { name: "Julian Vance", relation: "Father", phone: "+44 7700 900601", email: "j.vance@finance.org", isPrimary: true },
    ],
    enrolledDate: "Sep 01, 2025",
    bloodGroup: "A+",
    allergies: "Peanuts (Mild)",
  },
  {
    id: "STU-SMIA-004",
    schoolId: "SCH-001",
    schoolName: "St. Mary International Academy",
    firstName: "Ama",
    lastName: "Serwaa",
    fullName: "Ama Serwaa",
    gender: "Female",
    dob: "2010-03-22",
    grade: "Grade 10",
    section: "10-A (General Academic)",
    campus: "Kensington Central Campus",
    status: "Enrolled",
    rollNumber: "10A-09",
    academicYear: "2026 - 2027",
    gpa: "3.88",
    attendancePct: 97,
    feesStatus: "Partial",
    feesBalance: "GH₵850.00",
    email: "a.serwaa@student.school.edu",
    phone: "+233 27 751 2290",
    address: "15 Ring Road Central, Accra",
    guardians: [
      { name: "Grace Serwaa", relation: "Mother", phone: "+233 27 751 2200", email: "g.serwaa@consulting.gh", isPrimary: true },
    ],
    enrolledDate: "Sep 01, 2025",
    bloodGroup: "B+",
    allergies: "None",
  },
  {
    id: "STU-SMIA-005",
    schoolId: "SCH-001",
    schoolName: "St. Mary International Academy",
    firstName: "Liam",
    lastName: "Carter",
    fullName: "Liam Carter",
    gender: "Male",
    dob: "2010-01-15",
    grade: "Grade 10",
    section: "10-A (General Academic)",
    campus: "Kensington Central Campus",
    status: "Enrolled",
    rollNumber: "10A-05",
    academicYear: "2026 - 2027",
    gpa: "3.65",
    attendancePct: 92,
    feesStatus: "Partial",
    feesBalance: "GH₵850.00",
    email: "l.carter@student.stmarys.edu",
    phone: "+44 7700 900331",
    address: "95 Cromwell Rd, London",
    guardians: [
      { name: "Robert Carter", relation: "Father", phone: "+44 7700 900712", email: "r.carter@consulting.com", isPrimary: true },
    ],
    enrolledDate: "Sep 01, 2025",
    bloodGroup: "B+",
    allergies: "None",
  },
  {
    id: "STU-SMIA-006",
    schoolId: "SCH-001",
    schoolName: "St. Mary International Academy",
    firstName: "Sophia",
    lastName: "Martinez",
    fullName: "Sophia Martinez",
    gender: "Female",
    dob: "2009-11-04",
    grade: "Grade 11",
    section: "11-B (Literature)",
    campus: "Richmond Athletics Complex",
    status: "Enrolled",
    rollNumber: "11B-08",
    academicYear: "2026 - 2027",
    gpa: "3.95",
    attendancePct: 99,
    feesStatus: "Paid",
    feesBalance: "GH₵0.00",
    email: "s.martinez@student.stmarys.edu",
    phone: "+44 7700 900455",
    address: "12 Pelham St, Kensington",
    guardians: [
      { name: "Carlos Martinez", relation: "Father", phone: "+44 7700 900821", email: "c.martinez@embassy.es", isPrimary: true },
    ],
    enrolledDate: "Sep 01, 2024",
    bloodGroup: "O-",
    allergies: "Dust Mites",
  },

  // --- School 2: Oakridge High School (SCH-002) ---
  {
    id: "STU-OHS-001",
    schoolId: "SCH-002",
    schoolName: "Oakridge High School",
    firstName: "Alexander",
    lastName: "Wright",
    fullName: "Alexander Wright",
    gender: "Male",
    dob: "2008-09-18",
    grade: "Grade 12",
    section: "12-A (AP Calculus & Physics)",
    campus: "Bay Street Main Campus",
    status: "Enrolled",
    rollNumber: "12A-01",
    academicYear: "2026 - 2027",
    gpa: "3.98",
    attendancePct: 99,
    feesStatus: "Paid",
    feesBalance: "GH₵0.00",
    email: "a.wright@student.oakridge.edu",
    phone: "+1 (416) 555-8821",
    address: "240 Bloor St W, Toronto, ON",
    guardians: [
      { name: "Catherine Wright", relation: "Mother", phone: "+1 (416) 555-9901", email: "c.wright@law.ca", isPrimary: true },
    ],
    enrolledDate: "Sep 01, 2023",
    bloodGroup: "A+",
    allergies: "None",
  },
  {
    id: "STU-OHS-002",
    schoolId: "SCH-002",
    schoolName: "Oakridge High School",
    firstName: "Maya",
    lastName: "Lin",
    fullName: "Maya Lin",
    gender: "Female",
    dob: "2010-02-14",
    grade: "Grade 10",
    section: "10-C (Fine Arts & Design)",
    campus: "Yorkville Creative Arts Center",
    status: "Enrolled",
    rollNumber: "10C-12",
    academicYear: "2026 - 2027",
    gpa: "3.85",
    attendancePct: 96,
    feesStatus: "Paid",
    feesBalance: "GH₵0.00",
    email: "m.lin@student.oakridge.edu",
    phone: "+1 (416) 555-4311",
    address: "88 Yorkville Ave, Toronto, ON",
    guardians: [
      { name: "Henry Lin", relation: "Father", phone: "+1 (416) 555-7722", email: "h.lin@design.ca", isPrimary: true },
    ],
    enrolledDate: "Sep 01, 2025",
    bloodGroup: "O+",
    allergies: "None",
  },
  {
    id: "STU-OHS-003",
    schoolId: "SCH-002",
    schoolName: "Oakridge High School",
    firstName: "Benjamin",
    lastName: "Brooks",
    fullName: "Benjamin Brooks",
    gender: "Male",
    dob: "2009-07-22",
    grade: "Grade 11",
    section: "11-B (Business & Economics)",
    campus: "Bay Street Main Campus",
    status: "Enrolled",
    rollNumber: "11B-04",
    academicYear: "2026 - 2027",
    gpa: "3.55",
    attendancePct: 91,
    feesStatus: "Partial",
    feesBalance: "GH₵600.00",
    email: "b.brooks@student.oakridge.edu",
    phone: "+1 (416) 555-2940",
    address: "550 University Ave, Toronto",
    guardians: [
      { name: "Edward Brooks", relation: "Father", phone: "+1 (416) 555-3310", email: "e.brooks@fin.ca", isPrimary: true },
    ],
    enrolledDate: "Sep 01, 2024",
    bloodGroup: "B-",
    allergies: "Penicillin",
  },

  // --- School 3: Greenwood Preparatory (SCH-003) ---
  {
    id: "STU-GWP-001",
    schoolId: "SCH-003",
    schoolName: "Greenwood Preparatory",
    firstName: "Daniel",
    lastName: "Hayes",
    fullName: "Daniel Hayes",
    gender: "Male",
    dob: "2010-05-19",
    grade: "Grade 10",
    section: "10-A (STEM Leadership)",
    campus: "Austin Central Campus",
    status: "Enrolled",
    rollNumber: "10A-02",
    academicYear: "2026 - 2027",
    gpa: "3.90",
    attendancePct: 97,
    feesStatus: "Paid",
    feesBalance: "GH₵0.00",
    email: "d.hayes@student.greenwood.edu",
    phone: "+1 (512) 555-2244",
    address: "1400 Congress Ave, Austin, TX",
    guardians: [
      { name: "Rachel Hayes", relation: "Mother", phone: "+1 (512) 555-6611", email: "r.hayes@austinlaw.com", isPrimary: true },
    ],
    enrolledDate: "Sep 01, 2025",
    bloodGroup: "O+",
    allergies: "None",
  },
  {
    id: "STU-GWP-002",
    schoolId: "SCH-003",
    schoolName: "Greenwood Preparatory",
    firstName: "Olivia",
    lastName: "Taylor",
    fullName: "Olivia Taylor",
    gender: "Female",
    dob: "2011-01-30",
    grade: "Grade 9",
    section: "9-B (Honors Humanities)",
    campus: "Austin Central Campus",
    status: "Enrolled",
    rollNumber: "9B-15",
    academicYear: "2026 - 2027",
    gpa: "3.88",
    attendancePct: 99,
    feesStatus: "Paid",
    feesBalance: "GH₵0.00",
    email: "o.taylor@student.greenwood.edu",
    phone: "+1 (512) 555-8910",
    address: "3200 Barton Springs Rd, Austin",
    guardians: [
      { name: "Mark Taylor", relation: "Father", phone: "+1 (512) 555-9922", email: "m.taylor@tech.com", isPrimary: true },
    ],
    enrolledDate: "Sep 01, 2026",
    bloodGroup: "A+",
    allergies: "None",
  },

  // --- School 4: Horizon Collegiate Institute (SCH-004) ---
  {
    id: "STU-HCI-001",
    schoolId: "SCH-004",
    schoolName: "Horizon Collegiate Institute",
    firstName: "Chloe",
    lastName: "Dubois",
    fullName: "Chloe Dubois",
    gender: "Female",
    dob: "2009-03-11",
    grade: "Grade 11",
    section: "11-A (Biology & Health Sciences)",
    campus: "Melbourne Main Campus",
    status: "Enrolled",
    rollNumber: "11A-07",
    academicYear: "2026 - 2027",
    gpa: "3.75",
    attendancePct: 94,
    feesStatus: "Paid",
    feesBalance: "GH₵0.00",
    email: "c.dubois@student.horizon.edu",
    phone: "+61 3 9840 5512",
    address: "120 Collins St, Melbourne",
    guardians: [
      { name: "Jean Dubois", relation: "Father", phone: "+61 3 9840 9901", email: "j.dubois@health.au", isPrimary: true },
    ],
    enrolledDate: "Feb 01, 2025",
    bloodGroup: "B+",
    allergies: "Asthma",
  },

  // --- School 5: Beacon Hill Grammar School (SCH-005) ---
  {
    id: "STU-BHGS-001",
    schoolId: "SCH-005",
    schoolName: "Beacon Hill Grammar School",
    firstName: "James",
    lastName: "Cooper",
    fullName: "James Cooper",
    gender: "Male",
    dob: "2010-12-05",
    grade: "Grade 10",
    section: "10-Classical",
    campus: "Beacon Hill Main Campus",
    status: "Enrolled",
    rollNumber: "10C-03",
    academicYear: "2026 - 2027",
    gpa: "3.96",
    attendancePct: 99,
    feesStatus: "Paid",
    feesBalance: "GH₵0.00",
    email: "j.cooper@student.beaconhill.edu",
    phone: "+1 (617) 555-8833",
    address: "45 Beacon St, Boston, MA",
    guardians: [
      { name: "Eleanor Cooper", relation: "Mother", phone: "+1 (617) 555-7711", email: "e.cooper@harvard.edu", isPrimary: true },
    ],
    enrolledDate: "Sep 01, 2025",
    bloodGroup: "O-",
    allergies: "None",
  },

  // --- School 6: St. Jude Technical College (SCH-006) ---
  {
    id: "STU-SJTC-001",
    schoolId: "SCH-006",
    schoolName: "St. Jude Technical College",
    firstName: "Sean",
    lastName: "O'Connor",
    fullName: "Sean O'Connor",
    gender: "Male",
    dob: "2007-06-15",
    grade: "Vocational Year 1",
    section: "Polytechnic Mechanical Eng.",
    campus: "Dublin Central Campus",
    status: "Enrolled",
    rollNumber: "V1-09",
    academicYear: "2026 - 2027",
    gpa: "3.82",
    attendancePct: 96,
    feesStatus: "Paid",
    feesBalance: "GH₵0.00",
    email: "s.oconnor@student.stjude.ie",
    phone: "+353 1 496 2201",
    address: "74 Grafton St, Dublin",
    guardians: [
      { name: "Patrick O'Connor", relation: "Father", phone: "+353 1 496 9911", email: "p.oconnor@engineering.ie", isPrimary: true },
    ],
    enrolledDate: "Sep 01, 2024",
    bloodGroup: "A+",
    allergies: "None",
  },
];

const STORAGE_KEY = "sms_student_records";

export function getAllStudentsRaw() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Ensure all currency balances in existing storage are updated to GH₵
      const converted = parsed.map((s) => ({
        ...s,
        feesBalance: s.feesBalance ? s.feesBalance.replace("$", "GH₵") : "GH₵0.00",
      }));
      return converted;
    }
    return INITIAL_STUDENTS;
  } catch (e) {
    return INITIAL_STUDENTS;
  }
}

/**
 * Retrieve students, optionally filtered by schoolId
 * If schoolId is not passed, falls back to active school admin's schoolId
 * Pass "ALL" to get all students across all tenant schools
 */
export function getStudents(schoolId) {
  const all = getAllStudentsRaw();
  if (schoolId === "ALL") {
    return all;
  }
  const targetSchoolId = schoolId || getActiveSchoolAdmin()?.schoolId || "SCH-001";
  const schoolStudents = all.filter((s) => s.schoolId === targetSchoolId);
  return schoolStudents.length > 0 ? schoolStudents : all;
}

export function saveStudents(students) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  } catch (e) {
    console.error("Failed to save student records:", e);
  }
}

export function getStudentById(id) {
  const all = getAllStudentsRaw();
  return all.find((s) => s.id === id) || all[0];
}
