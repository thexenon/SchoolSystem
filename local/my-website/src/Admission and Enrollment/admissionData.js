// Centralized Data Service for Module: Admission and Enrollment
// Standardized in Ghanaian Cedi (GH₵)

export const INITIAL_APPLICANTS = [
  {
    id: "APP-2026-101",
    fullName: "Abena Mansa Prempeh",
    firstName: "Abena",
    lastName: "Prempeh",
    gender: "Female",
    dob: "2010-03-15",
    nationality: "Ghanaian",
    nationalId: "GHA-7892103-2",
    targetGrade: "Grade 10",
    stream: "General Science",
    academicYear: "2026/2027",
    boardingStatus: "Boarding Student",
    previousSchool: "Achimota Basic School, Accra",
    entryExamScore: 88,
    beceAggregate: 7, // 1 is best, 6-7 is stellar in Ghana
    guardianName: "Nana Osei Prempeh",
    guardianRelation: "Father",
    guardianPhone: "+233 24 551 2290",
    guardianEmail: "nana.prempeh@ghcorp.com",
    address: "Plot 14, Airport Residential Area, Accra",
    applicationFeePaid: true,
    applicationFeeAmount: "GH₵250.00",
    feeReceipt: "RCP-ADM-8810",
    submissionDate: "2026-11-04",
    status: "Accepted", // 'Pending Review', 'Under Review', 'Accepted', 'Waitlisted', 'Rejected'
    reviewScores: {
      academicScore: 36, // out of 40
      entranceExam: 37,  // out of 40
      interviewScore: 19, // out of 20
      compositeRating: 92, // out of 100
      reviewer: "Mrs. Gertrude Addo (Admissions Dean)",
      reviewDate: "2026-11-10",
      comments: "Exceptional mastery in mathematics and integrated science. Eloquent and poised during interview.",
    },
    admissionDecision: {
      decision: "Accepted",
      date: "2026-11-12",
      decidedBy: "Dame Eleanor Vance (Headmistress)",
      assignedClass: "Grade 10-A (Secondary Science)",
      house: "St. Patrick (Green House)",
      reportingDate: "2027-01-12",
      tuitionDeposit: "GH₵2,500.00",
      scholarshipAward: "GH₵500.00 (Merit Waiver)",
      letterGenerated: true,
    },
    enrollment: {
      status: "Enrolled", // 'Pending Confirmation', 'Enrolled', 'Declined'
      enrolledDate: "2026-11-16",
      generatedStudentId: "STU-SMIA-042",
      rollNumber: "10A-18",
      tuitionDepositPaid: true,
      medicalClearanceReceived: true,
      codeOfConductSigned: true,
    },
    documents: [
      { name: "Birth_Certificate_Prempeh.pdf", size: "1.4 MB", verified: true },
      { name: "BECE_Official_Result_Slip.pdf", size: "850 KB", verified: true },
      { name: "Passport_Photo_Abena.jpg", size: "320 KB", verified: true },
      { name: "Former_School_Testimonial.pdf", size: "1.1 MB", verified: true },
    ],
  },
  {
    id: "APP-2026-102",
    fullName: "Kofi Boateng Frimpong",
    firstName: "Kofi",
    lastName: "Frimpong",
    gender: "Male",
    dob: "2009-11-20",
    nationality: "Ghanaian",
    nationalId: "GHA-9912048-5",
    targetGrade: "Grade 11",
    stream: "General Science",
    academicYear: "2026/2027",
    boardingStatus: "Day Student",
    previousSchool: "Presbyterian Boys' Secondary School, Legon",
    entryExamScore: 94,
    beceAggregate: 6,
    guardianName: "Dr. Kwadwo Frimpong",
    guardianRelation: "Father",
    guardianPhone: "+233 20 882 1100",
    guardianEmail: "dr.kfrimpong@korlebu.org",
    address: "22 East Legon Hills, Accra",
    applicationFeePaid: true,
    applicationFeeAmount: "GH₵250.00",
    feeReceipt: "RCP-ADM-8811",
    submissionDate: "2026-11-08",
    status: "Accepted",
    reviewScores: {
      academicScore: 39,
      entranceExam: 38,
      interviewScore: 19,
      compositeRating: 96,
      reviewer: "Dr. Kwabena Asante (Academic Dean)",
      reviewDate: "2026-11-14",
      comments: "Outstanding aptitude in physics and robotics. Former national robotics olympiad participant.",
    },
    admissionDecision: {
      decision: "Accepted",
      date: "2026-11-15",
      decidedBy: "Dame Eleanor Vance (Headmistress)",
      assignedClass: "Grade 11-A (Advanced Science)",
      house: "St. George (Blue House)",
      reportingDate: "2027-01-12",
      tuitionDeposit: "GH₵2,500.00",
      scholarshipAward: "GH₵1,000.00 (STEM Presidential Waiver)",
      letterGenerated: true,
    },
    enrollment: {
      status: "Pending Confirmation",
      enrolledDate: null,
      generatedStudentId: null,
      rollNumber: null,
      tuitionDepositPaid: true,
      medicalClearanceReceived: true,
      codeOfConductSigned: false,
    },
    documents: [
      { name: "Birth_Cert_Kofi_Frimpong.pdf", size: "1.2 MB", verified: true },
      { name: "WASSCE_Elective_Mock_Transcript.pdf", size: "1.5 MB", verified: true },
      { name: "Passport_Photo_Kofi.png", size: "450 KB", verified: true },
    ],
  },
  {
    id: "APP-2026-103",
    fullName: "Miriam Esi Sutherland",
    firstName: "Miriam",
    lastName: "Sutherland",
    gender: "Female",
    dob: "2010-06-18",
    nationality: "Ghanaian",
    nationalId: "GHA-6641920-8",
    targetGrade: "Grade 10",
    stream: "General Arts & Literature",
    academicYear: "2026/2027",
    boardingStatus: "Boarding Student",
    previousSchool: "SOS Hermann Gmeiner International College, Tema",
    entryExamScore: 82,
    beceAggregate: 8,
    guardianName: "Evelyn Sutherland",
    guardianRelation: "Mother",
    guardianPhone: "+233 24 990 4422",
    guardianEmail: "e.sutherland@unicef.org",
    address: "Comm 6, Tema / Ridge, Accra",
    applicationFeePaid: true,
    applicationFeeAmount: "GH₵250.00",
    feeReceipt: "RCP-ADM-8812",
    submissionDate: "2026-11-12",
    status: "Under Review",
    reviewScores: {
      academicScore: 32,
      entranceExam: 33,
      interviewScore: 18,
      compositeRating: 83,
      reviewer: "Mrs. Clara Oswald (Faculty Lead)",
      reviewDate: "2026-11-17",
      comments: "Strong command of written English and creative literature. Very expressive.",
    },
    admissionDecision: null,
    enrollment: null,
    documents: [
      { name: "Birth_Certificate_Miriam.pdf", size: "1.1 MB", verified: true },
      { name: "Transcript_SOS_HGIC.pdf", size: "2.3 MB", verified: true },
      { name: "Passport_Photograph.jpg", size: "510 KB", verified: true },
    ],
  },
  {
    id: "APP-2026-104",
    fullName: "Kwesi Emmanuel Darko",
    firstName: "Kwesi",
    lastName: "Darko",
    gender: "Male",
    dob: "2012-09-02",
    nationality: "Ghanaian",
    nationalId: "GHA-5521094-1",
    targetGrade: "Grade 8",
    stream: "Middle School Division",
    academicYear: "2026/2027",
    boardingStatus: "Day Student",
    previousSchool: "Lincoln Community School, Accra",
    entryExamScore: 78,
    beceAggregate: null,
    guardianName: "Samuel Darko",
    guardianRelation: "Father",
    guardianPhone: "+233 20 441 9911",
    guardianEmail: "s.darko@telecom.gh",
    address: "Cantonments Road, Accra",
    applicationFeePaid: true,
    applicationFeeAmount: "GH₵250.00",
    feeReceipt: "RCP-ADM-8813",
    submissionDate: "2026-11-15",
    status: "Pending Review",
    reviewScores: null,
    admissionDecision: null,
    enrollment: null,
    documents: [
      { name: "Birth_Certificate_Kwesi.pdf", size: "980 KB", verified: false },
      { name: "Grade_7_Academic_Report.pdf", size: "1.8 MB", verified: true },
    ],
  },
  {
    id: "APP-2026-105",
    fullName: "Derrick Nii Armah Tagoe",
    firstName: "Derrick",
    lastName: "Tagoe",
    gender: "Male",
    dob: "2010-01-25",
    nationality: "Ghanaian",
    nationalId: "GHA-3310945-7",
    targetGrade: "Grade 10",
    stream: "Business & Accounting",
    academicYear: "2026/2027",
    boardingStatus: "Boarding Student",
    previousSchool: "Morning Star International School, Cantonments",
    entryExamScore: 68,
    beceAggregate: 14,
    guardianName: "Vida Tagoe",
    guardianRelation: "Mother",
    guardianPhone: "+233 24 330 8877",
    guardianEmail: "vida.tagoe@ghanaoil.com",
    address: "Osu Ringway Estate, Accra",
    applicationFeePaid: true,
    applicationFeeAmount: "GH₵250.00",
    feeReceipt: "RCP-ADM-8814",
    submissionDate: "2026-11-16",
    status: "Waitlisted",
    reviewScores: {
      academicScore: 26,
      entranceExam: 27,
      interviewScore: 15,
      compositeRating: 68,
      reviewer: "Mr. Harrison Sterling (Business Dept)",
      reviewDate: "2026-11-18",
      comments: "Shows enthusiasm for business economics, but math foundation requires remedial support.",
    },
    admissionDecision: {
      decision: "Waitlisted",
      date: "2026-11-18",
      decidedBy: "Admissions Selection Board",
      assignedClass: "Pending Seat Availability",
      house: "Unassigned",
      reportingDate: "—",
      tuitionDeposit: "—",
      scholarshipAward: "None",
      letterGenerated: false,
    },
    enrollment: null,
    documents: [
      { name: "Birth_Cert_Tagoe.pdf", size: "1.0 MB", verified: true },
      { name: "BECE_Slip_Derrick.pdf", size: "820 KB", verified: true },
    ],
  },
];

const STORAGE_KEY = "sms_admissions_applicants_storage";

export function getApplicants() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_APPLICANTS;
  } catch {
    return INITIAL_APPLICANTS;
  }
}

export function saveApplicants(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent("admissionsDataChanged", { detail: data }));
}

export function getAdmissionsStats() {
  const applicants = getApplicants();
  const total = applicants.length;
  const accepted = applicants.filter((a) => a.status === "Accepted").length;
  const underReview = applicants.filter((a) => a.status === "Under Review" || a.status === "Pending Review").length;
  const waitlisted = applicants.filter((a) => a.status === "Waitlisted").length;
  const enrolled = applicants.filter((a) => a.enrollment && a.enrollment.status === "Enrolled").length;
  const totalRevenueCedi = applicants.filter((a) => a.applicationFeePaid).length * 250;

  return {
    total,
    accepted,
    underReview,
    waitlisted,
    enrolled,
    totalRevenueCedi,
  };
}
