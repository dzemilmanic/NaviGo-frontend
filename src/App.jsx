import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";

// Global Components
import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";

// Public Pages
import Home from "./components/Home/Home.jsx";
import Services from "./components/Services/Services.jsx";
import Features from "./components/Features/Features.jsx";
import Login from "./components/Login/Login.jsx";
import Register from "./components/Register/Register.jsx";
import Cookies from "./pages/Cookies.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import TermsOfServices from "./pages/TermsOfServices.jsx";
import RouteMap from "./pages/RouteMap/RouteMap.jsx";
// SuperAdmin Pages
import SuperAdminLayout from "./components/superadmin/SuperAdminLayout/SuperAdminLayout";
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard/SuperAdminDashboard";
import CompanyManagement from "./pages/superadmin/CompanyManagement/CompanyManagement";
import UserManagement from "./pages/superadmin/UserManagement/UserManagement";
import SystemConfiguration from "./pages/superadmin/SystemConfiguration/SystemConfiguration";

// Auth placeholder pages
const UnauthorizedPage = () => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="bg-white p-8 rounded-lg shadow-md text-center">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Unauthorized</h1>
      <p className="text-gray-600">
        You don't have permission to access this page.
      </p>
    </div>
  </div>
);

const AppRoutes = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check if user is SuperAdmin to conditionally render navbar
  const isSuperAdmin = isAuthenticated && user?.role === "SuperAdmin";

  return (
    <>
      {/* Only show Navbar if user is not SuperAdmin */}
      {!isSuperAdmin && <Navbar />}

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/features" element={<Features />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfServices />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/routes" element={<RouteMap />} />
        {/* SuperAdmin routes - now using string role */}
        <Route
          path="/superadmin"
          element={
            <ProtectedRoute requiredRole="SuperAdmin">
              <SuperAdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<SuperAdminDashboard />} />
          <Route path="companies" element={<CompanyManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="system" element={<SystemConfiguration />} />
        </Route>

        {/* Default redirect based on user role - using string roles */}
        <Route
          path="/redirect"
          element={
            isAuthenticated ? (
              user?.role === "SuperAdmin" ? (
                <Navigate to="/superadmin" replace />
              ) : user?.role === "CompanyAdmin" ? (
                <Navigate to="/company-admin" replace />
              ) : user?.role === "CompanyUser" ? (
                <Navigate to="/company-user" replace />
              ) : (
                <Navigate to="/user" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Home />} />
      </Routes>

      {/* Only show Footer if user is not SuperAdmin */}
      {!isSuperAdmin && <Footer />}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
