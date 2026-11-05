// Multi-School Platform Administration - School Admin Credentials Service
// The Multi-School Admin is the overall boss who provisions, manages, and generates logins for all school administrators,
// and can directly access any individual school's dashboard, students, and administrator information.

export const INITIAL_SCHOOL_ADMINS = [
  {
    id: "SADM-001",
    schoolId: "SCH-001",
    schoolName: "St. Mary International Academy",
    schoolCode: "SMIA",
    adminName: "Dame Eleanor Vance, Ph.D.",
    adminTitle: "Head Principal & Executive Trustee",
    email: "admin@stmarys.edu",
    password: "StMary@Admin2026",
    phone: "+44 20 7946 0912",
    city: "London",
    country: "United Kingdom",
    status: "Active",
    createdAt: "Jan 14, 2024",
    lastLogin: "Today, 08:30 AM",
    campusesCount: 3,
    studentCount: 3400,
    facultyCount: 220,
    securityClearance: "Tier 1 - Full Trustee Level",
    deputyName: "Dr. Arthur Bell (Vice Principal)",
    bio: "Dame Eleanor has led St. Mary for 9 years, supervising three campuses across London with IB World accreditation.",
  },
  {
    id: "SADM-002",
    schoolId: "SCH-002",
    schoolName: "Oakridge High School",
    schoolCode: "OHS",
    adminName: "Dr. Jonathan Hayes",
    adminTitle: "Executive Director of Academics",
    email: "admin@oakridge.edu",
    password: "Oakridge@Admin2026",
    phone: "+1 (416) 555-0199",
    city: "Toronto",
    country: "Canada",
    status: "Active",
    createdAt: "Mar 22, 2024",
    lastLogin: "Yesterday, 02:15 PM",
    campusesCount: 2,
    studentCount: 2850,
    facultyCount: 180,
    securityClearance: "Tier 1 - Full Trustee Level",
    deputyName: "Mrs. Clara Oswald (Academic Dean)",
    bio: "Dr. Hayes oversees Oakridge's Bay Street and Yorkville campuses, managing the Ontario Curriculum and AP Capstone programs.",
  },
  {
    id: "SADM-003",
    schoolId: "SCH-003",
    schoolName: "Greenwood Preparatory",
    schoolCode: "GWP",
    adminName: "Harrison Sterling, M.Ed.",
    adminTitle: "Headmaster",
    email: "admin@greenwood.edu",
    password: "Greenwood@Admin2026",
    phone: "+1 (512) 555-8321",
    city: "Austin, TX",
    country: "United States",
    status: "Active",
    createdAt: "Aug 05, 2024",
    lastLogin: "2 days ago",
    campusesCount: 1,
    studentCount: 1420,
    facultyCount: 95,
    securityClearance: "Tier 1 - Headmaster Level",
    deputyName: "Diana Prince (Dean of Students)",
    bio: "Harrison Sterling has directed Greenwood Preparatory through STEM and arts integration under SACS accreditation.",
  },
  {
    id: "SADM-004",
    schoolId: "SCH-004",
    schoolName: "Horizon Collegiate Institute",
    schoolCode: "HCI",
    adminName: "Marcus Brody",
    adminTitle: "Academic Dean",
    email: "admin@horizon.edu",
    password: "Horizon@Admin2026",
    phone: "+61 3 9840 2200",
    city: "Melbourne",
    country: "Australia",
    status: "Suspended",
    createdAt: "Nov 19, 2024",
    lastLogin: "14 days ago",
    campusesCount: 1,
    studentCount: 980,
    facultyCount: 68,
    securityClearance: "Tier 2 - Dean Level (Under Audit Review)",
    deputyName: "Samantha Reed (Acting Dean)",
    bio: "Horizon Collegiate Institute is currently undergoing platform financial audit reconciliation.",
  },
  {
    id: "SADM-005",
    schoolId: "SCH-005",
    schoolName: "Beacon Hill Grammar School",
    schoolCode: "BHGS",
    adminName: "Clara Oswald",
    adminTitle: "Headmistress",
    email: "admin@beaconhill.edu",
    password: "BeaconHill@Admin2026",
    phone: "+1 (617) 555-4920",
    city: "Boston, MA",
    country: "United States",
    status: "Active",
    createdAt: "Oct 02, 2026",
    lastLogin: "Never",
    campusesCount: 1,
    studentCount: 420,
    facultyCount: 32,
    securityClearance: "Tier 1 - Headmistress Level",
    deputyName: "Robert Langdon (Senior Master)",
    bio: "Beacon Hill is an historic preparatory institution currently piloting the digital School Hub platform.",
  },
  {
    id: "SADM-006",
    schoolId: "SCH-006",
    schoolName: "St. Jude Technical College",
    schoolCode: "SJTC",
    adminName: "Liam Gallagher",
    adminTitle: "College Provost",
    email: "admin@stjude.ie",
    password: "StJude@Admin2026",
    phone: "+353 1 496 0888",
    city: "Dublin",
    country: "Ireland",
    status: "Active",
    createdAt: "Feb 10, 2023",
    lastLogin: "Oct 24, 2026",
    campusesCount: 4,
    studentCount: 4100,
    facultyCount: 290,
    securityClearance: "Tier 1 - Provost Level",
    deputyName: "Dr. Margaret Hamilton (Dean of Technology)",
    bio: "St. Jude Technical College leads tertiary vocational and polytechnic education across 4 regional campuses in Ireland.",
  },
];

const STORAGE_KEY = "platform_school_admins";
const ACTIVE_ADMIN_KEY = "active_school_admin";
const SCHOOL_AUTH_KEY = "school_admin_auth";
const PLATFORM_AUTH_KEY = "platform_admin_auth";

/**
 * Retrieve all registered school admins from localStorage or initial defaults
 */
export function getSchoolAdmins() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SCHOOL_ADMINS));
      return INITIAL_SCHOOL_ADMINS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SCHOOL_ADMINS;
  } catch (err) {
    console.error("Error reading school admins from storage:", err);
    return INITIAL_SCHOOL_ADMINS;
  }
}

/**
 * Save school admins array to localStorage
 */
export function saveSchoolAdmins(admins) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(admins));
  } catch (err) {
    console.error("Error saving school admins to storage:", err);
  }
}

/**
 * Find admin record by schoolId
 */
export function getSchoolAdminBySchoolId(schoolId) {
  const admins = getSchoolAdmins();
  return (
    admins.find((a) => a.schoolId === schoolId) ||
    admins.find((a) => a.id === schoolId) ||
    admins[0]
  );
}

/**
 * Check if the Multi-School Platform Super Admin (Overall Boss) is logged in
 */
export function isPlatformAdminAuthenticated() {
  return (
    localStorage.getItem(PLATFORM_AUTH_KEY) === "true" ||
    sessionStorage.getItem(PLATFORM_AUTH_KEY) === "true"
  );
}

/**
 * Check if School Administration session is authenticated.
 * Note: If the Multi-School Platform Super Admin is logged in, they automatically have access!
 */
export function isSchoolAdminAuthenticated() {
  if (isPlatformAdminAuthenticated()) {
    return true;
  }
  return (
    localStorage.getItem(SCHOOL_AUTH_KEY) === "true" ||
    sessionStorage.getItem(SCHOOL_AUTH_KEY) === "true"
  );
}

/**
 * Switch active school context (Used by Multi-School Admin or upon login)
 */
export function switchActiveSchool(schoolId) {
  const admin = getSchoolAdminBySchoolId(schoolId);
  if (admin) {
    setActiveSchoolAdmin(admin);
    localStorage.setItem(SCHOOL_AUTH_KEY, "true");
    return admin;
  }
  return null;
}

/**
 * Generate a new school admin credential set
 */
export function generateSchoolAdminLogin({
  schoolId,
  schoolName,
  schoolCode,
  adminName,
  adminTitle = "School Administrator",
  customEmail = "",
  customPassword = "",
}) {
  const admins = getSchoolAdmins();

  const cleanDomain =
    schoolCode?.toLowerCase().replace(/[^a-z0-9]/g, "") ||
    schoolName.toLowerCase().replace(/[^a-z0-9]/g, "").substring(0, 8);

  const finalEmail =
    customEmail.trim() ||
    `admin@${cleanDomain}.edu`;

  const cleanPrefix =
    schoolName.split(" ")[0].replace(/[^a-zA-Z]/g, "") ||
    schoolCode ||
    "School";
  const finalPassword =
    customPassword.trim() ||
    `${cleanPrefix}@Admin2026`;

  const newAdmin = {
    id: `SADM-${String(admins.length + 1).padStart(3, "0")}`,
    schoolId: schoolId || `SCH-${String(admins.length + 1).padStart(3, "0")}`,
    schoolName,
    schoolCode: schoolCode || cleanDomain.toUpperCase(),
    adminName: adminName || `Admin of ${schoolName}`,
    adminTitle,
    email: finalEmail.toLowerCase(),
    password: finalPassword,
    phone: "+1 (555) 010-0900",
    city: "Headquarters",
    country: "International",
    status: "Active",
    createdAt: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),
    lastLogin: "Never",
    campusesCount: 1,
    studentCount: 500,
    facultyCount: 40,
    securityClearance: "Tier 1 - School Admin Level",
    deputyName: "Deputy Administrator",
    bio: `Newly provisioned school administrator account for ${schoolName}.`,
  };

  const updated = [newAdmin, ...admins];
  saveSchoolAdmins(updated);
  return newAdmin;
}

/**
 * Reset / Re-generate password for a specific school admin
 */
export function regenerateSchoolAdminPassword(adminId, customNewPassword = "") {
  const admins = getSchoolAdmins();
  let updatedAdmin = null;

  const updated = admins.map((a) => {
    if (a.id === adminId || a.schoolId === adminId) {
      const cleanPrefix = a.schoolName.split(" ")[0].replace(/[^a-zA-Z]/g, "");
      const newPass =
        customNewPassword.trim() ||
        `${cleanPrefix}@${Math.floor(1000 + Math.random() * 9000)}`;
      updatedAdmin = { ...a, password: newPass };
      return updatedAdmin;
    }
    return a;
  });

  if (updatedAdmin) {
    saveSchoolAdmins(updated);
    // If currently active admin was modified, update active admin in storage
    const currentActive = getActiveSchoolAdmin();
    if (currentActive && (currentActive.id === adminId || currentActive.schoolId === adminId)) {
      setActiveSchoolAdmin(updatedAdmin);
    }
  }
  return updatedAdmin;
}

/**
 * Authenticate a school admin against stored school credentials OR Platform Boss master credentials
 */
export function authenticateSchoolAdmin(inputEmail, inputPassword) {
  const emailNorm = inputEmail.trim().toLowerCase();
  const passNorm = inputPassword.trim();

  // 1. Check if authenticated as Multi-School Super Admin (Platform Boss)
  if (
    emailNorm === "admin@platform.schoolhub.net" ||
    emailNorm === "platform" ||
    emailNorm.includes("platform") ||
    passNorm === "Platform@2026"
  ) {
    if (passNorm === "Platform@2026" || passNorm === "Admin@2026") {
      localStorage.setItem(PLATFORM_AUTH_KEY, "true");
      localStorage.setItem(SCHOOL_AUTH_KEY, "true");
      // Default active school to St. Mary International Academy if not already set
      if (!getActiveSchoolAdmin()) {
        const defaultAdmin = getSchoolAdmins()[0];
        setActiveSchoolAdmin(defaultAdmin);
      }
      return {
        success: true,
        isPlatformBoss: true,
        admin: getActiveSchoolAdmin() || getSchoolAdmins()[0],
        message: "Multi-School Super Admin authenticated! Full multi-school access granted.",
      };
    }
  }

  // 2. Check against registered school admins
  const admins = getSchoolAdmins();
  const found = admins.find(
    (a) => a.email.toLowerCase() === emailNorm && a.password === passNorm
  );

  if (found) {
    const updated = admins.map((a) =>
      a.id === found.id ? { ...a, lastLogin: "Just now" } : a
    );
    saveSchoolAdmins(updated);
    setActiveSchoolAdmin(found);
    localStorage.setItem(SCHOOL_AUTH_KEY, "true");
    return { success: true, isPlatformBoss: false, admin: found };
  }

  // 3. Fallback check for default single-school test account
  if (emailNorm === "admin@school.edu" && passNorm === "Admin@2026") {
    const defaultFallback = admins[0] || {
      id: "SADM-DEFAULT",
      schoolId: "SCH-001",
      schoolName: "St. Mary International Academy",
      schoolCode: "SMIA",
      adminName: "Executive Administrator",
      adminTitle: "System Administrator",
      email: "admin@school.edu",
      password: "Admin@2026",
      status: "Active",
    };
    setActiveSchoolAdmin(defaultFallback);
    localStorage.setItem(SCHOOL_AUTH_KEY, "true");
    return { success: true, isPlatformBoss: false, admin: defaultFallback };
  }

  return { success: false, isPlatformBoss: false, admin: null };
}

/**
 * Get active school admin from storage, or fallback to first school admin
 */
export function getActiveSchoolAdmin() {
  try {
    const raw = localStorage.getItem(ACTIVE_ADMIN_KEY);
    if (raw) return JSON.parse(raw);
    const admins = getSchoolAdmins();
    return admins[0] || null;
  } catch (err) {
    return null;
  }
}

/**
 * Set active school admin
 */
export function setActiveSchoolAdmin(admin) {
  try {
    localStorage.setItem(ACTIVE_ADMIN_KEY, JSON.stringify(admin));
  } catch (err) {
    console.error("Error setting active school admin:", err);
  }
}

/**
 * Clear active school admin & log out of school administration
 */
export function logoutSchoolAdmin() {
  try {
    localStorage.removeItem(SCHOOL_AUTH_KEY);
    sessionStorage.removeItem(SCHOOL_AUTH_KEY);
    localStorage.removeItem(ACTIVE_ADMIN_KEY);
  } catch (err) {
    console.error("Error clearing school admin session:", err);
  }
}

export function clearActiveSchoolAdmin() {
  logoutSchoolAdmin();
}
