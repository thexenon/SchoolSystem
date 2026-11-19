// Central Data Store for Module 10: School Fees and Finance
// All monetary values standardized in Ghanaian Cedi (GH₵)

export const INITIAL_FEE_CATEGORIES = [
  {
    id: "CAT-01",
    name: "Tuition & Academic Instruction",
    code: "TUI-01",
    description: "Core classroom teaching, curriculum materials, and lecture delivery.",
    feeType: "Mandatory",
    billingCycle: "Per Term",
    standardAmount: 3200.0,
    status: "Active",
    applicableTo: "All Students",
  },
  {
    id: "CAT-02",
    name: "Boarding & Hostel Accommodation",
    code: "BRD-02",
    description: "Residential dormitory utilities, laundry services, and housing maintenance.",
    feeType: "Optional (Residential)",
    billingCycle: "Per Term",
    standardAmount: 2400.0,
    status: "Active",
    applicableTo: "Boarders Only",
  },
  {
    id: "CAT-03",
    name: "Cafeteria & Dining Meal Plan",
    code: "CAT-03",
    description: "Three daily balanced meals provided by certified campus catering.",
    feeType: "Optional",
    billingCycle: "Per Term",
    standardAmount: 1800.0,
    status: "Active",
    applicableTo: "Boarders & Day Opt-in",
  },
  {
    id: "CAT-04",
    name: "Campus Bus Transport & Shuttle",
    code: "TRN-04",
    description: "Daily morning pick-up and afternoon drop-off across Greater Accra routes.",
    feeType: "Optional (Day)",
    billingCycle: "Per Term",
    standardAmount: 950.0,
    status: "Active",
    applicableTo: "Day Students Only",
  },
  {
    id: "CAT-05",
    name: "Science & Computer Lab Practical Levy",
    code: "LAB-05",
    description: "Consumable chemical reagents, robotics kits, and high-speed fiber internet.",
    feeType: "Mandatory (Science & Tech)",
    billingCycle: "Per Term",
    standardAmount: 650.0,
    status: "Active",
    applicableTo: "Science & Engineering Cohorts",
  },
  {
    id: "CAT-06",
    name: "WASSCE & WAEC Examination Registration",
    code: "WAC-06",
    description: "National examination accreditation and WAEC test script administration.",
    feeType: "Mandatory (Finalists)",
    billingCycle: "Annual",
    standardAmount: 1200.0,
    status: "Active",
    applicableTo: "Grade 12 Only",
  },
  {
    id: "CAT-07",
    name: "PTA & School Development Levy",
    code: "PTA-07",
    description: "Parent-Teacher Association infrastructure endowment and sports pavilion project.",
    feeType: "Mandatory",
    billingCycle: "Per Term",
    standardAmount: 300.0,
    status: "Active",
    applicableTo: "All Students",
  },
  {
    id: "CAT-08",
    name: "Sports, Co-Curricular & Club Gear",
    code: "SPT-08",
    description: "Team jersey uniforms, athletic equipment, and inter-school sports league fees.",
    feeType: "Mandatory",
    billingCycle: "Annual",
    standardAmount: 250.0,
    status: "Active",
    applicableTo: "All Students",
  },
];

export const INITIAL_FEE_STRUCTURES = [
  {
    id: "STR-2026-001",
    structureName: "Grade 11-A (Science Track) - Full Boarder Bill",
    cohort: "Grade 11-A",
    academicYear: "2026/2027",
    term: "Term 1",
    categoryIds: ["CAT-01", "CAT-02", "CAT-03", "CAT-05", "CAT-07", "CAT-08"],
    items: [
      { categoryName: "Tuition & Academic Instruction", amount: 3200.0 },
      { categoryName: "Boarding & Hostel Accommodation", amount: 2400.0 },
      { categoryName: "Cafeteria & Dining Meal Plan", amount: 1800.0 },
      { categoryName: "Science & Computer Lab Practical Levy", amount: 650.0 },
      { categoryName: "PTA & School Development Levy", amount: 300.0 },
      { categoryName: "Sports & Club Gear", amount: 250.0 },
    ],
    totalFee: 8600.0,
    currency: "GH₵",
    status: "Approved",
    effectiveDate: "2026-09-01",
  },
  {
    id: "STR-2026-002",
    structureName: "Grade 11-A (Science Track) - Day Student Bill",
    cohort: "Grade 11-A",
    academicYear: "2026/2027",
    term: "Term 1",
    categoryIds: ["CAT-01", "CAT-04", "CAT-05", "CAT-07", "CAT-08"],
    items: [
      { categoryName: "Tuition & Academic Instruction", amount: 3200.0 },
      { categoryName: "Campus Bus Transport & Shuttle", amount: 950.0 },
      { categoryName: "Science & Computer Lab Practical Levy", amount: 650.0 },
      { categoryName: "PTA & School Development Levy", amount: 300.0 },
      { categoryName: "Sports & Club Gear", amount: 250.0 },
    ],
    totalFee: 5350.0,
    currency: "GH₵",
    status: "Approved",
    effectiveDate: "2026-09-01",
  },
  {
    id: "STR-2026-003",
    structureName: "Grade 11-B (General Arts & Business) - Day Student Bill",
    cohort: "Grade 11-B",
    academicYear: "2026/2027",
    term: "Term 1",
    categoryIds: ["CAT-01", "CAT-04", "CAT-07", "CAT-08"],
    items: [
      { categoryName: "Tuition & Academic Instruction", amount: 3200.0 },
      { categoryName: "Campus Bus Transport & Shuttle", amount: 950.0 },
      { categoryName: "PTA & School Development Levy", amount: 300.0 },
      { categoryName: "Sports & Club Gear", amount: 250.0 },
    ],
    totalFee: 4700.0,
    currency: "GH₵",
    status: "Approved",
    effectiveDate: "2026-09-01",
  },
  {
    id: "STR-2026-004",
    structureName: "Grade 12-A (WASSCE Finalists) - Complete Candidate Bill",
    cohort: "Grade 12-A",
    academicYear: "2026/2027",
    term: "Term 1",
    categoryIds: ["CAT-01", "CAT-02", "CAT-03", "CAT-05", "CAT-06", "CAT-07", "CAT-08"],
    items: [
      { categoryName: "Tuition & Academic Instruction", amount: 3200.0 },
      { categoryName: "Boarding & Hostel Accommodation", amount: 2400.0 },
      { categoryName: "Cafeteria & Dining Meal Plan", amount: 1800.0 },
      { categoryName: "Science & Computer Lab Practical Levy", amount: 650.0 },
      { categoryName: "WASSCE & WAEC Registration", amount: 1200.0 },
      { categoryName: "PTA & School Development Levy", amount: 300.0 },
      { categoryName: "Sports & Club Gear", amount: 250.0 },
    ],
    totalFee: 9800.0,
    currency: "GH₵",
    status: "Approved",
    effectiveDate: "2026-09-01",
  },
];

export const INITIAL_STUDENT_INVOICES = [
  {
    id: "INV-2026-001",
    studentId: "STU-SMIA-001",
    studentName: "Elena Rostova",
    rollNumber: "11A-01",
    classCohort: "Grade 11-A",
    guardianName: "Dmitri Rostov",
    guardianPhone: "+233 24 990 1122",
    guardianEmail: "d.rostov@academyparent.com",
    structureId: "STR-2026-001",
    billingDate: "2026-09-05",
    dueDate: "2026-10-15",
    term: "Term 1, 2026/2027",
    totalBilled: 8600.0,
    discountApplied: 1000.0, // Academic Excellence Merit Scholarship
    netAmount: 7600.0,
    amountPaid: 7600.0,
    balanceDue: 0.0,
    paymentStatus: "Paid in Full",
    lastPaymentDate: "2026-10-10",
  },
  {
    id: "INV-2026-002",
    studentId: "STU-SMIA-002",
    studentName: "Kwame Mensah",
    rollNumber: "11A-04",
    classCohort: "Grade 11-A",
    guardianName: "Kofi Mensah Snr.",
    guardianPhone: "+233 20 882 3344",
    guardianEmail: "k.mensah@academyparent.com",
    structureId: "STR-2026-001",
    billingDate: "2026-09-05",
    dueDate: "2026-10-15",
    term: "Term 1, 2026/2027",
    totalBilled: 8600.0,
    discountApplied: 0.0,
    netAmount: 8600.0,
    amountPaid: 8600.0,
    balanceDue: 0.0,
    paymentStatus: "Paid in Full",
    lastPaymentDate: "2026-09-28",
  },
  {
    id: "INV-2026-003",
    studentId: "STU-SMIA-003",
    studentName: "Lucas Vance",
    rollNumber: "11A-07",
    classCohort: "Grade 11-A",
    guardianName: "Dame Eleanor Vance",
    guardianPhone: "+233 24 100 2000",
    guardianEmail: "principal@smia.edu.gh",
    structureId: "STR-2026-002",
    billingDate: "2026-09-05",
    dueDate: "2026-10-15",
    term: "Term 1, 2026/2027",
    totalBilled: 5350.0,
    discountApplied: 3200.0, // 100% Tuition Staff Benefit
    netAmount: 2150.0,
    amountPaid: 2150.0,
    balanceDue: 0.0,
    paymentStatus: "Paid in Full",
    lastPaymentDate: "2026-09-12",
  },
  {
    id: "INV-2026-004",
    studentId: "STU-SMIA-004",
    studentName: "Ama Serwaa",
    rollNumber: "11A-09",
    classCohort: "Grade 11-A",
    guardianName: "Nana Osei Serwaa",
    guardianPhone: "+233 27 655 4400",
    guardianEmail: "n.serwaa@academyparent.com",
    structureId: "STR-2026-001",
    billingDate: "2026-09-05",
    dueDate: "2026-10-15",
    term: "Term 1, 2026/2027",
    totalBilled: 8600.0,
    discountApplied: 0.0,
    netAmount: 8600.0,
    amountPaid: 5000.0,
    balanceDue: 3600.0,
    paymentStatus: "Partial Payment",
    lastPaymentDate: "2026-10-02",
  },
  {
    id: "INV-2026-005",
    studentId: "STU-SMIA-005",
    studentName: "Liam Carter",
    rollNumber: "11A-12",
    classCohort: "Grade 11-A",
    guardianName: "Jonathan Carter",
    guardianPhone: "+44 7700 900222",
    guardianEmail: "j.carter@academyparent.com",
    structureId: "STR-2026-002",
    billingDate: "2026-09-05",
    dueDate: "2026-10-15",
    term: "Term 1, 2026/2027",
    totalBilled: 5350.0,
    discountApplied: 0.0,
    netAmount: 5350.0,
    amountPaid: 2500.0,
    balanceDue: 2850.0,
    paymentStatus: "Overdue",
    lastPaymentDate: "2026-09-20",
  },
  {
    id: "INV-2026-006",
    studentId: "STU-SMIA-006",
    studentName: "Sophia Martinez",
    rollNumber: "11A-15",
    classCohort: "Grade 11-A",
    guardianName: "Maria Martinez",
    guardianPhone: "+233 55 330 9988",
    guardianEmail: "m.martinez@academyparent.com",
    structureId: "STR-2026-002",
    billingDate: "2026-09-05",
    dueDate: "2026-10-15",
    term: "Term 1, 2026/2027",
    totalBilled: 5350.0,
    discountApplied: 535.0, // 10% Sibling Concession
    netAmount: 4815.0,
    amountPaid: 4815.0,
    balanceDue: 0.0,
    paymentStatus: "Paid in Full",
    lastPaymentDate: "2026-10-08",
  },
  {
    id: "INV-2026-007",
    studentId: "STU-SMIA-008",
    studentName: "David Osei",
    rollNumber: "11B-03",
    classCohort: "Grade 11-B",
    guardianName: "Dr. Kwadwo Osei",
    guardianPhone: "+233 24 776 5511",
    guardianEmail: "k.osei@academyparent.com",
    structureId: "STR-2026-003",
    billingDate: "2026-09-05",
    dueDate: "2026-10-15",
    term: "Term 1, 2026/2027",
    totalBilled: 4700.0,
    discountApplied: 0.0,
    netAmount: 4700.0,
    amountPaid: 0.0,
    balanceDue: 4700.0,
    paymentStatus: "Overdue",
    lastPaymentDate: null,
  },
  {
    id: "INV-2026-008",
    studentId: "STU-SMIA-009",
    studentName: "Fatima Al-Hassan",
    rollNumber: "12A-02",
    classCohort: "Grade 12-A",
    guardianName: "Ibrahim Al-Hassan",
    guardianPhone: "+233 20 445 6677",
    guardianEmail: "i.alhassan@academyparent.com",
    structureId: "STR-2026-004",
    billingDate: "2026-09-05",
    dueDate: "2026-10-15",
    term: "Term 1, 2026/2027",
    totalBilled: 9800.0,
    discountApplied: 1000.0,
    netAmount: 8800.0,
    amountPaid: 8800.0,
    balanceDue: 0.0,
    paymentStatus: "Paid in Full",
    lastPaymentDate: "2026-09-18",
  },
];

export const INITIAL_PAYMENTS = [
  {
    id: "PAY-2026-001",
    receiptNumber: "REC-GH-2026-8801",
    invoiceId: "INV-2026-001",
    studentId: "STU-SMIA-001",
    studentName: "Elena Rostova",
    classCohort: "Grade 11-A",
    amountPaid: 7600.0,
    currency: "GH₵",
    paymentMethod: "MTN Mobile Money",
    transactionReference: "MM-GH-9982410294",
    bankName: "MTN MoMo Gateway",
    paymentDate: "2026-10-10 11:24",
    recordedBy: "Mrs. Gertrude Addo (Chief Bursar)",
    status: "Verified & Cleared",
    notes: "Term 1 full settlement via MTN MoMo Merchant code 408819.",
  },
  {
    id: "PAY-2026-002",
    receiptNumber: "REC-GH-2026-8802",
    invoiceId: "INV-2026-002",
    studentId: "STU-SMIA-002",
    studentName: "Kwame Mensah",
    classCohort: "Grade 11-A",
    amountPaid: 8600.0,
    currency: "GH₵",
    paymentMethod: "GCB Bank Direct Transfer",
    transactionReference: "GCB-TT-00291884",
    bankName: "GCB Bank High Street",
    paymentDate: "2026-09-28 14:15",
    recordedBy: "Mrs. Gertrude Addo",
    status: "Verified & Cleared",
    notes: "Direct bank transfer credited to St. Michael's School Account #1011400293.",
  },
  {
    id: "PAY-2026-003",
    receiptNumber: "REC-GH-2026-8803",
    invoiceId: "INV-2026-003",
    studentId: "STU-SMIA-003",
    studentName: "Lucas Vance",
    classCohort: "Grade 11-A",
    amountPaid: 2150.0,
    currency: "GH₵",
    paymentMethod: "Cashier Counter",
    transactionReference: "CSH-ACC-2026-041",
    bankName: "Bursar Campus Cashier",
    paymentDate: "2026-09-12 09:30",
    recordedBy: "Mrs. Gertrude Addo",
    status: "Verified & Cleared",
    notes: "Net boarding & lab fees paid at bursar desk after 100% staff tuition waiver.",
  },
  {
    id: "PAY-2026-004",
    receiptNumber: "REC-GH-2026-8804",
    invoiceId: "INV-2026-004",
    studentId: "STU-SMIA-004",
    studentName: "Ama Serwaa",
    classCohort: "Grade 11-A",
    amountPaid: 5000.0,
    currency: "GH₵",
    paymentMethod: "Vodafone Cash (Telecel)",
    transactionReference: "TC-VOD-88102934",
    bankName: "Telecel Cash Gateway",
    paymentDate: "2026-10-02 16:45",
    recordedBy: "Mrs. Gertrude Addo",
    status: "Verified & Cleared",
    notes: "1st installment paid. Remaining GH₵ 3,600.00 promised by end of month.",
  },
  {
    id: "PAY-2026-005",
    receiptNumber: "REC-GH-2026-8805",
    invoiceId: "INV-2026-005",
    studentId: "STU-SMIA-005",
    studentName: "Liam Carter",
    classCohort: "Grade 11-A",
    amountPaid: 2500.0,
    currency: "GH₵",
    paymentMethod: "Stanbic Bank Card",
    transactionReference: "STB-VISA-992184",
    bankName: "Stanbic Bank Ghana",
    paymentDate: "2026-09-20 10:10",
    recordedBy: "Mrs. Gertrude Addo",
    status: "Verified & Cleared",
    notes: "Partial tuition deposit via Stanbic POS terminal.",
  },
  {
    id: "PAY-2026-006",
    receiptNumber: "REC-GH-2026-8806",
    invoiceId: "INV-2026-006",
    studentId: "STU-SMIA-006",
    studentName: "Sophia Martinez",
    classCohort: "Grade 11-A",
    amountPaid: 4815.0,
    currency: "GH₵",
    paymentMethod: "Ecobank Online Gateway",
    transactionReference: "ECO-WEB-7738210",
    bankName: "Ecobank Ghana",
    paymentDate: "2026-10-08 12:05",
    recordedBy: "Automated Gateway",
    status: "Verified & Cleared",
    notes: "Instant online portal payment via Ecobank Omnilite web checkout.",
  },
];

export const INITIAL_DISCOUNTS = [
  {
    id: "DSC-01",
    studentId: "STU-SMIA-001",
    studentName: "Elena Rostova",
    discountName: "Presidential STEM Scholar Grant",
    type: "Fixed Amount",
    amount: 1000.0,
    currency: "GH₵",
    academicYear: "2026/2027",
    categoryApplied: "Tuition & Instruction",
    reason: "Ranked 1st nationwide in WAEC Junior Olympiad examination.",
    status: "Approved",
    authorizedBy: "Dame Eleanor Vance (Head Principal)",
  },
  {
    id: "DSC-02",
    studentId: "STU-SMIA-003",
    studentName: "Lucas Vance",
    discountName: "Faculty Dependent 100% Tuition Waiver",
    type: "Tuition Waiver",
    amount: 3200.0,
    currency: "GH₵",
    academicYear: "2026/2027",
    categoryApplied: "Tuition & Instruction",
    reason: "Statutory benefit for senior executive staff dependent.",
    status: "Approved",
    authorizedBy: "Academic Governing Board",
  },
  {
    id: "DSC-03",
    studentId: "STU-SMIA-006",
    studentName: "Sophia Martinez",
    discountName: "Sibling Concurrent Enrollment Concession",
    type: "Percentage (10%)",
    amount: 535.0,
    currency: "GH₵",
    academicYear: "2026/2027",
    categoryApplied: "Comprehensive Day Bill",
    reason: "Two biological siblings actively enrolled at St. Michael's Academy.",
    status: "Approved",
    authorizedBy: "Mrs. Gertrude Addo (Bursar)",
  },
  {
    id: "DSC-04",
    studentId: "STU-SMIA-009",
    studentName: "Fatima Al-Hassan",
    discountName: "Northern Regional Excellence Scholarship",
    type: "Fixed Amount",
    amount: 1000.0,
    currency: "GH₵",
    academicYear: "2026/2027",
    categoryApplied: "WASSCE Preparation",
    reason: "Merit award for leadership and academic distinction.",
    status: "Approved",
    authorizedBy: "Dame Eleanor Vance",
  },
];

export const INITIAL_REFUNDS = [
  {
    id: "REF-2026-001",
    paymentId: "PAY-2026-001",
    studentId: "STU-SMIA-007",
    studentName: "Kwabena Adjei",
    refundAmount: 950.0,
    currency: "GH₵",
    originalPaymentMethod: "MTN Mobile Money",
    refundMethod: "MTN MoMo Reversal",
    reason: "Parent relocated; student switched from Bus Shuttle to Day Walking route.",
    requestedDate: "2026-10-18",
    authorizedDate: "2026-10-20",
    status: "Approved & Refunded",
    authorizedBy: "Dame Eleanor Vance (Head Principal)",
    transactionRef: "REV-MM-88401924",
  },
  {
    id: "REF-2026-002",
    paymentId: "PAY-2026-005",
    studentId: "STU-SMIA-005",
    studentName: "Liam Carter",
    refundAmount: 300.0,
    currency: "GH₵",
    originalPaymentMethod: "Stanbic Bank Card",
    refundMethod: "Bank Account Credit",
    reason: "Duplicate PTA sports levy charged erroneously during Term 1 rollover.",
    requestedDate: "2026-11-04",
    authorizedDate: null,
    status: "Pending Principal PIN Authorization",
    authorizedBy: null,
    transactionRef: null,
  },
];

export const INITIAL_RECONCILIATION_ACCOUNTS = [
  {
    id: "ACC-01",
    accountName: "GCB Bank High Street Operational Account",
    accountNumber: "1011400293811",
    bankName: "GCB Bank Ghana",
    ledgerBalance: 348500.0,
    bankStatementBalance: 348500.0,
    unreconciledDifference: 0.0,
    lastReconciled: "2026-11-18 17:00",
    status: "Fully Balanced",
  },
  {
    id: "ACC-02",
    accountName: "MTN Mobile Money School Merchant Account",
    accountNumber: "Merchant Code: 408819",
    bankName: "MTN Mobile Money (Ghana)",
    ledgerBalance: 184200.0,
    bankStatementBalance: 184200.0,
    unreconciledDifference: 0.0,
    lastReconciled: "2026-11-18 16:30",
    status: "Fully Balanced",
  },
  {
    id: "ACC-03",
    accountName: "Ecobank Ghana Web Payment Collection Gateway",
    accountNumber: "EC-ECO-8890123",
    bankName: "Ecobank Ghana",
    ledgerBalance: 96400.0,
    bankStatementBalance: 97350.0,
    unreconciledDifference: 950.0, // Pending settlement batch from weekend
    lastReconciled: "2026-11-17 18:00",
    status: "Attention Required",
  },
];

// LocalStorage Persistence Keys
const CAT_STORAGE_KEY = "sms_module10_fee_categories";
const STR_STORAGE_KEY = "sms_module10_fee_structures";
const INV_STORAGE_KEY = "sms_module10_invoices";
const PAY_STORAGE_KEY = "sms_module10_payments";
const DSC_STORAGE_KEY = "sms_module10_discounts";
const REF_STORAGE_KEY = "sms_module10_refunds";
const REC_STORAGE_KEY = "sms_module10_reconciliations";

export function getFeeCategories() {
  try {
    const data = localStorage.getItem(CAT_STORAGE_KEY);
    return data ? JSON.parse(data) : INITIAL_FEE_CATEGORIES;
  } catch {
    return INITIAL_FEE_CATEGORIES;
  }
}

export function saveFeeCategories(list) {
  localStorage.setItem(CAT_STORAGE_KEY, JSON.stringify(list));
}

export function getFeeStructures() {
  try {
    const data = localStorage.getItem(STR_STORAGE_KEY);
    return data ? JSON.parse(data) : INITIAL_FEE_STRUCTURES;
  } catch {
    return INITIAL_FEE_STRUCTURES;
  }
}

export function saveFeeStructures(list) {
  localStorage.setItem(STR_STORAGE_KEY, JSON.stringify(list));
}

export function getInvoices() {
  try {
    const data = localStorage.getItem(INV_STORAGE_KEY);
    return data ? JSON.parse(data) : INITIAL_STUDENT_INVOICES;
  } catch {
    return INITIAL_STUDENT_INVOICES;
  }
}

export function saveInvoices(list) {
  localStorage.setItem(INV_STORAGE_KEY, JSON.stringify(list));
}

export function getPayments() {
  try {
    const data = localStorage.getItem(PAY_STORAGE_KEY);
    return data ? JSON.parse(data) : INITIAL_PAYMENTS;
  } catch {
    return INITIAL_PAYMENTS;
  }
}

export function savePayments(list) {
  localStorage.setItem(PAY_STORAGE_KEY, JSON.stringify(list));
}

export function getDiscounts() {
  try {
    const data = localStorage.getItem(DSC_STORAGE_KEY);
    return data ? JSON.parse(data) : INITIAL_DISCOUNTS;
  } catch {
    return INITIAL_DISCOUNTS;
  }
}

export function saveDiscounts(list) {
  localStorage.setItem(DSC_STORAGE_KEY, JSON.stringify(list));
}

export function getRefunds() {
  try {
    const data = localStorage.getItem(REF_STORAGE_KEY);
    return data ? JSON.parse(data) : INITIAL_REFUNDS;
  } catch {
    return INITIAL_REFUNDS;
  }
}

export function saveRefunds(list) {
  localStorage.setItem(REF_STORAGE_KEY, JSON.stringify(list));
}

export function getReconciliations() {
  try {
    const data = localStorage.getItem(REC_STORAGE_KEY);
    return data ? JSON.parse(data) : INITIAL_RECONCILIATION_ACCOUNTS;
  } catch {
    return INITIAL_RECONCILIATION_ACCOUNTS;
  }
}

export function saveReconciliations(list) {
  localStorage.setItem(REC_STORAGE_KEY, JSON.stringify(list));
}
