// Multi-School Platform Administration - School Admin Credentials Service
// The Multi-School Admin is the overall boss who provisions, manages, and generates logins for all school administrators.

export const INITIAL_SCHOOL_ADMINS = [
  {
    id: "SADM-001",
    schoolId: "SCH-001",
    schoolName: "St. Mary International Academy",
    schoolCode: "SMIA",
    adminName: "Eleanor Vance",
    adminTitle: "Head Principal",
    email: "admin@stmarys.edu",
    password: "StMary@Admin2026",
    status: "Active",
    createdAt: "Jan 14, 2024",
    lastLogin: "Today, 08:30 AM",
  },
  {
    id: "SADM-002",
    schoolId: "SCH-002",
    schoolName: "Oakridge High School",
    schoolCode: "OHS",
    adminName: "Dr. Jonathan Hayes",
    adminTitle: "Executive Director",
    email: "admin@oakridge.edu",
    password: "Oakridge@Admin2026",
    status: "Active",
    createdAt: "Mar 22, 2024",
    lastLogin: "Yesterday, 02:15 PM",
  },
  {
    id: "SADM-003",
    schoolId: "SCH-003",
    schoolName: "Greenwood Preparatory",
    schoolCode: "GWP",
    adminName: "Harrison Sterling",
    adminTitle: "Headmaster",
    email: "admin@greenwood.edu",
    password: "Greenwood@Admin2026",
    status: "Active",
    createdAt: "Aug 05, 2024",
    lastLogin: "2 days ago",
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
    status: "Suspended",
    createdAt: "Nov 19, 2024",
    lastLogin: "14 days ago",
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
    status: "Active",
    createdAt: "Oct 02, 2026",
    lastLogin: "Never",
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
    status: "Active",
    createdAt: "Feb 10, 2023",
    lastLogin: "Oct 24, 2026",
  },
];

const STORAGE_KEY = "platform_school_admins";
const ACTIVE_ADMIN_KEY = "active_school_admin";

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

  // Create clean domain slug from school name
  const cleanDomain =
    schoolCode?.toLowerCase().replace(/[^a-z0-9]/g, "") ||
    schoolName.toLowerCase().replace(/[^a-z0-9]/g, "").substring(0, 8);

  const finalEmail =
    customEmail.trim() ||
    `admin@${cleanDomain}.edu`;

  // Create school-based password
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
    status: "Active",
    createdAt: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),
    lastLogin: "Never",
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
    if (a.id === adminId) {
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
  }
  return updatedAdmin;
}

/**
 * Authenticate a school admin against stored school credentials
 */
export function authenticateSchoolAdmin(inputEmail, inputPassword) {
  const admins = getSchoolAdmins();
  const emailNorm = inputEmail.trim().toLowerCase();
  const passNorm = inputPassword.trim();

  const found = admins.find(
    (a) => a.email.toLowerCase() === emailNorm && a.password === passNorm
  );

  if (found) {
    // Record login timestamp
    const updated = admins.map((a) =>
      a.id === found.id ? { ...a, lastLogin: "Just now" } : a
    );
    saveSchoolAdmins(updated);
    setActiveSchoolAdmin(found);
    return { success: true, admin: found };
  }

  // Also check legacy/default single-school fallback
  if (emailNorm === "admin@school.edu" && passNorm === "Admin@2026") {
    const defaultFallback = {
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
    return { success: true, admin: defaultFallback };
  }

  return { success: false, admin: null };
}

/**
 * Get active school admin
 */
export function getActiveSchoolAdmin() {
  try {
    const raw = localStorage.getItem(ACTIVE_ADMIN_KEY);
    return raw ? JSON.parse(raw) : null;
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
 * Clear active school admin
 */
export function clearActiveSchoolAdmin() {
  try {
    localStorage.removeItem(ACTIVE_ADMIN_KEY);
  } catch (err) {
    console.error("Error clearing active school admin:", err);
  }
}
