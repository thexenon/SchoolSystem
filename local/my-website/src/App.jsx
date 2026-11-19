import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Homepage from "./homepage";
import {
  Login,
  ForgotPassword,
  ResetPassword,
  UserProfile,
  UserManagement,
  RolesAndPermissions,
  Notifications,
} from "./Auth and user accounts";
import {
  PlatformLogin,
  PlatformDashboard,
  SchoolManagement,
  SchoolDetails,
  SubscriptionManagement,
  PlatformUserManagement,
  PlatformAuditLogs,
} from "./Platform Administration";
import {
  SchoolLogin,
  SchoolDashboard,
  SchoolProfile,
  CampusManagement,
  AcademicYearManagement,
  TermSemesterManagement,
  SchoolCalendar,
  SchoolSettings,
} from "./School Administration";
import {
  StudentList,
  RegisterStudent,
  StudentProfile,
  EditStudent,
  StudentEnrollment,
} from "./Student Management";
import {
  EducationLevels,
  ClassManagement,
  StreamsAndSections,
  SubjectManagement,
  DepartmentManagement,
  ProgrammeManagement,
  CourseManagement,
  ClassAllocation,
  AcademicStructureOverview,
} from "./Academic Structure";
import {
  TakeAttendance,
  AttendanceRegister,
  StudentAttendanceHistory,
  AttendanceCorrection,
  AttendanceReports,
  AbsenceAlerts,
  StaffAttendanceRegister,
} from "./Attendance Management";
import {
  AssessmentSetup,
  ExaminationManagement,
  MarksEntry,
  MarksImport,
  ResultsReview,
  ResultsApproval,
  GradingSystem,
  StudentResults,
  ReportCards,
  ClassPerformance,
  ResultsPublication,
  ResultsCorrection,
} from "./Examinations and Results";
import {
  PeriodManagement,
  TimetableBuilder,
  ClassTimetable,
  TeacherTimetable,
  RoomManagement,
  TimetableConflictChecker,
  SubstituteTeacherManagement,
} from "./Timetable Management";
import {
  FeeCategories,
  FeeStructure,
  StudentInvoices,
  RecordPayment,
  PaymentHistory,
  FeeStatements,
  OutstandingFees,
  DiscountsAndScholarships,
  Receipts,
  RefundsAndReversals,
  OnlinePayment,
  PaymentReconciliation,
  FinancialReports,
} from "./School Fees and Finance";
import {
  ParentDashboard,
  MyChildren,
  ChildProfile,
  ChildAttendance,
  ChildResults,
  ParentFeeStatements,
  ParentFeePayment,
  SchoolAnnouncements,
  ParentSchoolCalendar,
  ContactSchool,
} from "./Parent and Guardian Portal";
import {
  StudentDashboard,
  MyProfile,
  MyTimetable,
  MyAttendance,
  MyResults,
  MyAssignments,
  LearningMaterials,
  StudentCalendar,
  MyFees,
  StudentNotifications,
  StudentPortal,
} from "./Student Portal";
import TeacherPortal from "./Teacher Portal/TeacherPortal";
import {
  AssignmentList,
  CreateAssignment,
  AssignmentDetails,
  StudentSubmissions,
  SubmissionReview,
  GradingAndFeedback,
  LearningResources,
} from "./Assignments and Learning Materials";
import {
  AdmissionsDashboard,
  ApplicationForm,
  ApplicantList,
  ApplicantProfile,
  ApplicationReview,
  AdmissionDecisions,
  AdmissionLetters,
  EnrollmentConfirmation,
  AdmissionsReports,
} from "./Admission and Enrollment";
import {
  isSchoolAdminAuthenticated,
  logoutSchoolAdmin,
} from "./Platform Administration/schoolAdminAuth";

function ScreenWrapper({ Component }) {
  const navigate = useNavigate();
  return <Component onNavigate={(screen) => navigate(`/${screen}`)} />;
}

/**
 * PlatformProtected: Multi-School Platform Super Admin Authentication Guard
 */
function PlatformProtected({ Component }) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return (
      localStorage.getItem("platform_admin_auth") === "true" ||
      sessionStorage.getItem("platform_admin_auth") === "true"
    );
  });

  const handleLogout = () => {
    localStorage.removeItem("platform_admin_auth");
    sessionStorage.removeItem("platform_admin_auth");
    localStorage.removeItem("platform_admin_user");
    sessionStorage.removeItem("platform_admin_user");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <PlatformLogin
        onSuccess={() => setIsAuthenticated(true)}
        onNavigate={(screen) => navigate(`/${screen}`)}
      />
    );
  }

  return (
    <Component
      onNavigate={(screen) => navigate(`/${screen}`)}
      onLogout={handleLogout}
    />
  );
}

function PlatformLoginWrapper() {
  const navigate = useNavigate();
  return (
    <PlatformLogin
      onSuccess={() => navigate("/platform-dashboard")}
      onNavigate={(screen) => navigate(`/${screen}`)}
    />
  );
}

/**
 * SchoolProtected: School Administration & Student Management Authentication Guard
 * Requires school administrator login credentials or Multi-School Platform Super Admin authority.
 */
function SchoolProtected({ Component }) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return isSchoolAdminAuthenticated();
  });

  const handleLogout = () => {
    logoutSchoolAdmin();
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <SchoolLogin
        onSuccess={() => setIsAuthenticated(true)}
        onNavigate={(screen) => navigate(`/${screen}`)}
      />
    );
  }

  return (
    <Component
      onNavigate={(screen) => navigate(`/${screen}`)}
      onLogout={handleLogout}
    />
  );
}

function SchoolLoginWrapper() {
  const navigate = useNavigate();
  return (
    <SchoolLogin
      onSuccess={() => navigate("/school-dashboard")}
      onNavigate={(screen) => navigate(`/${screen}`)}
    />
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/login" element={<ScreenWrapper Component={Login} />} />
        <Route path="/forgot-password" element={<ScreenWrapper Component={ForgotPassword} />} />
        <Route path="/reset-password" element={<ScreenWrapper Component={ResetPassword} />} />
        <Route path="/user-profile" element={<ScreenWrapper Component={UserProfile} />} />
        <Route path="/user-management" element={<ScreenWrapper Component={UserManagement} />} />
        <Route path="/roles-and-permissions" element={<ScreenWrapper Component={RolesAndPermissions} />} />
        <Route path="/notifications" element={<ScreenWrapper Component={Notifications} />} />

        {/* Platform Administration (Multi-School Management) - Password Protected (Overall Boss) */}
        <Route path="/platform-login" element={<PlatformLoginWrapper />} />
        <Route path="/platform-dashboard" element={<PlatformProtected Component={PlatformDashboard} />} />
        <Route path="/school-management" element={<PlatformProtected Component={SchoolManagement} />} />
        <Route path="/school-details" element={<PlatformProtected Component={SchoolDetails} />} />
        <Route path="/subscription-management" element={<PlatformProtected Component={SubscriptionManagement} />} />
        <Route path="/platform-user-management" element={<PlatformProtected Component={PlatformUserManagement} />} />
        <Route path="/platform-audit-logs" element={<PlatformProtected Component={PlatformAuditLogs} />} />

        {/* School Administration Module - Password Protected Gate */}
        <Route path="/school-login" element={<SchoolLoginWrapper />} />
        <Route path="/school-dashboard" element={<SchoolProtected Component={SchoolDashboard} />} />
        <Route path="/school-profile" element={<SchoolProtected Component={SchoolProfile} />} />
        <Route path="/campus-management" element={<SchoolProtected Component={CampusManagement} />} />
        <Route path="/academic-year-management" element={<SchoolProtected Component={AcademicYearManagement} />} />
        <Route path="/term-semester-management" element={<SchoolProtected Component={TermSemesterManagement} />} />
        <Route path="/school-calendar" element={<SchoolProtected Component={SchoolCalendar} />} />
        <Route path="/school-settings" element={<SchoolProtected Component={SchoolSettings} />} />

        {/* Student Management Module - Protected Under School & Platform Admin */}
        <Route path="/student-list" element={<SchoolProtected Component={StudentList} />} />
        <Route path="/register-student" element={<SchoolProtected Component={RegisterStudent} />} />
        <Route path="/student-profile" element={<SchoolProtected Component={StudentProfile} />} />
        <Route path="/edit-student" element={<SchoolProtected Component={EditStudent} />} />
        <Route path="/student-enrollment" element={<SchoolProtected Component={StudentEnrollment} />} />

        {/* Module 6: Classes, Subjects and Academic Structure */}
        <Route path="/education-levels" element={<SchoolProtected Component={EducationLevels} />} />
        <Route path="/class-management" element={<SchoolProtected Component={ClassManagement} />} />
        <Route path="/streams-and-sections" element={<SchoolProtected Component={StreamsAndSections} />} />
        <Route path="/subject-management" element={<SchoolProtected Component={SubjectManagement} />} />
        <Route path="/department-management" element={<SchoolProtected Component={DepartmentManagement} />} />
        <Route path="/programme-management" element={<SchoolProtected Component={ProgrammeManagement} />} />
        <Route path="/course-management" element={<SchoolProtected Component={CourseManagement} />} />
        <Route path="/class-allocation" element={<SchoolProtected Component={ClassAllocation} />} />
        <Route path="/academic-structure-overview" element={<SchoolProtected Component={AcademicStructureOverview} />} />

        {/* Module 7: Attendance Management */}
        <Route path="/take-attendance" element={<SchoolProtected Component={TakeAttendance} />} />
        <Route path="/attendance-register" element={<SchoolProtected Component={AttendanceRegister} />} />
        <Route path="/student-attendance-history" element={<SchoolProtected Component={StudentAttendanceHistory} />} />
        <Route path="/attendance-correction" element={<SchoolProtected Component={AttendanceCorrection} />} />
        <Route path="/attendance-reports" element={<SchoolProtected Component={AttendanceReports} />} />
        <Route path="/absence-alerts" element={<SchoolProtected Component={AbsenceAlerts} />} />
        <Route path="/staff-attendance-register" element={<SchoolProtected Component={StaffAttendanceRegister} />} />

        {/* Module 8: Examinations and Results */}
        <Route path="/assessment-setup" element={<SchoolProtected Component={AssessmentSetup} />} />
        <Route path="/examination-management" element={<SchoolProtected Component={ExaminationManagement} />} />
        <Route path="/marks-entry" element={<SchoolProtected Component={MarksEntry} />} />
        <Route path="/marks-import" element={<SchoolProtected Component={MarksImport} />} />
        <Route path="/results-review" element={<SchoolProtected Component={ResultsReview} />} />
        <Route path="/results-approval" element={<SchoolProtected Component={ResultsApproval} />} />
        <Route path="/grading-system" element={<SchoolProtected Component={GradingSystem} />} />
        <Route path="/student-results" element={<SchoolProtected Component={StudentResults} />} />
        <Route path="/report-cards" element={<SchoolProtected Component={ReportCards} />} />
        <Route path="/class-performance" element={<SchoolProtected Component={ClassPerformance} />} />
        <Route path="/results-publication" element={<SchoolProtected Component={ResultsPublication} />} />
        <Route path="/results-correction" element={<SchoolProtected Component={ResultsCorrection} />} />

        {/* Module 9: Timetable Management */}
        <Route path="/period-management" element={<SchoolProtected Component={PeriodManagement} />} />
        <Route path="/timetable-builder" element={<SchoolProtected Component={TimetableBuilder} />} />
        <Route path="/class-timetable" element={<SchoolProtected Component={ClassTimetable} />} />
        <Route path="/teacher-timetable" element={<SchoolProtected Component={TeacherTimetable} />} />
        <Route path="/room-management" element={<SchoolProtected Component={RoomManagement} />} />
        <Route path="/timetable-conflict-checker" element={<SchoolProtected Component={TimetableConflictChecker} />} />
        <Route path="/substitute-teacher-management" element={<SchoolProtected Component={SubstituteTeacherManagement} />} />

        {/* Module 10: School Fees and Finance */}
        <Route path="/fee-categories" element={<SchoolProtected Component={FeeCategories} />} />
        <Route path="/fee-structure" element={<SchoolProtected Component={FeeStructure} />} />
        <Route path="/student-invoices" element={<SchoolProtected Component={StudentInvoices} />} />
        <Route path="/record-payment" element={<SchoolProtected Component={RecordPayment} />} />
        <Route path="/payment-history" element={<SchoolProtected Component={PaymentHistory} />} />
        <Route path="/fee-statements" element={<SchoolProtected Component={FeeStatements} />} />
        <Route path="/outstanding-fees" element={<SchoolProtected Component={OutstandingFees} />} />
        <Route path="/discounts-and-scholarships" element={<SchoolProtected Component={DiscountsAndScholarships} />} />
        <Route path="/receipts" element={<SchoolProtected Component={Receipts} />} />
        <Route path="/refunds-and-reversals" element={<SchoolProtected Component={RefundsAndReversals} />} />
        <Route path="/online-payment" element={<ScreenWrapper Component={OnlinePayment} />} />
        <Route path="/payment-reconciliation" element={<SchoolProtected Component={PaymentReconciliation} />} />
        <Route path="/financial-reports" element={<SchoolProtected Component={FinancialReports} />} />

        {/* Module 12: Student Portal (10 Modular Screens) */}
        <Route path="/student-portal" element={<ScreenWrapper Component={StudentDashboard} />} />
        <Route path="/student-dashboard" element={<ScreenWrapper Component={StudentDashboard} />} />
        <Route path="/student-profile" element={<ScreenWrapper Component={MyProfile} />} />
        <Route path="/student-timetable" element={<ScreenWrapper Component={MyTimetable} />} />
        <Route path="/student-attendance" element={<ScreenWrapper Component={MyAttendance} />} />
        <Route path="/student-results" element={<ScreenWrapper Component={MyResults} />} />
        <Route path="/student-assignments" element={<ScreenWrapper Component={MyAssignments} />} />
        <Route path="/student-materials" element={<ScreenWrapper Component={LearningMaterials} />} />
        <Route path="/student-calendar" element={<ScreenWrapper Component={StudentCalendar} />} />
        <Route path="/student-fees" element={<ScreenWrapper Component={MyFees} />} />
        <Route path="/student-notifications" element={<ScreenWrapper Component={StudentNotifications} />} />

        {/* Dedicated Teacher Workstation Portal */}
        <Route path="/teacher-portal" element={<ScreenWrapper Component={TeacherPortal} />} />

        {/* Module 11: Parent and Guardian Portal */}
        <Route path="/parent-dashboard" element={<ScreenWrapper Component={ParentDashboard} />} />
        <Route path="/my-children" element={<ScreenWrapper Component={MyChildren} />} />
        <Route path="/child-profile" element={<ScreenWrapper Component={ChildProfile} />} />
        <Route path="/child-attendance" element={<ScreenWrapper Component={ChildAttendance} />} />
        <Route path="/child-results" element={<ScreenWrapper Component={ChildResults} />} />
        <Route path="/parent-fee-statements" element={<ScreenWrapper Component={ParentFeeStatements} />} />
        <Route path="/parent-fee-payment" element={<ScreenWrapper Component={ParentFeePayment} />} />
        <Route path="/school-announcements" element={<ScreenWrapper Component={SchoolAnnouncements} />} />
        <Route path="/parent-calendar" element={<ScreenWrapper Component={ParentSchoolCalendar} />} />
        <Route path="/contact-school" element={<ScreenWrapper Component={ContactSchool} />} />

        {/* Module 13: Assignments and Learning Materials */}
        <Route path="/assignment-list" element={<ScreenWrapper Component={AssignmentList} />} />
        <Route path="/create-assignment" element={<ScreenWrapper Component={CreateAssignment} />} />
        <Route path="/assignment-details" element={<ScreenWrapper Component={AssignmentDetails} />} />
        <Route path="/student-submissions" element={<ScreenWrapper Component={StudentSubmissions} />} />
        <Route path="/submission-review" element={<ScreenWrapper Component={SubmissionReview} />} />
        <Route path="/grading-feedback" element={<ScreenWrapper Component={GradingAndFeedback} />} />
        <Route path="/learning-resources" element={<ScreenWrapper Component={LearningResources} />} />

        {/* Module 14: Admission and Enrollment (9 Screens) */}
        <Route path="/admissions-dashboard" element={<ScreenWrapper Component={AdmissionsDashboard} />} />
        <Route path="/application-form" element={<ScreenWrapper Component={ApplicationForm} />} />
        <Route path="/applicant-list" element={<ScreenWrapper Component={ApplicantList} />} />
        <Route path="/applicant-profile" element={<ScreenWrapper Component={ApplicantProfile} />} />
        <Route path="/application-review" element={<ScreenWrapper Component={ApplicationReview} />} />
        <Route path="/admission-decisions" element={<ScreenWrapper Component={AdmissionDecisions} />} />
        <Route path="/admission-letters" element={<ScreenWrapper Component={AdmissionLetters} />} />
        <Route path="/enrollment-confirmation" element={<ScreenWrapper Component={EnrollmentConfirmation} />} />
        <Route path="/admissions-reports" element={<ScreenWrapper Component={AdmissionsReports} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;