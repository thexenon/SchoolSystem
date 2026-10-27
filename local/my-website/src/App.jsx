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

function ScreenWrapper({ Component }) {
  const navigate = useNavigate();
  return <Component onNavigate={(screen) => navigate(`/${screen}`)} />;
}

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

        {/* Platform Administration (Multi-School Management) - Password Protected */}
        <Route path="/platform-login" element={<PlatformLoginWrapper />} />
        <Route path="/platform-dashboard" element={<PlatformProtected Component={PlatformDashboard} />} />
        <Route path="/school-management" element={<PlatformProtected Component={SchoolManagement} />} />
        <Route path="/school-details" element={<PlatformProtected Component={SchoolDetails} />} />
        <Route path="/subscription-management" element={<PlatformProtected Component={SubscriptionManagement} />} />
        <Route path="/platform-user-management" element={<PlatformProtected Component={PlatformUserManagement} />} />
        <Route path="/platform-audit-logs" element={<PlatformProtected Component={PlatformAuditLogs} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;