import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";

import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";

import Home from "./components/Home/Home.jsx";
import Services from "./components/Services/Services.jsx";
import Features from "./components/Features/Features.jsx";
import Login from "./components/Login/Login.jsx";
import Register from "./components/Register/Register.jsx";
import Cookies from "./pages/Cookies.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import TermsOfServices from "./pages/TermsOfServices.jsx";
import RouteMap from "./pages/RouteMap/RouteMap.jsx";
import News from "./pages/News/News.jsx";
import SuperAdminLayout from "./components/Layouts/SuperAdmin/SuperAdminLayout.jsx";
import SuperAdminDashboard from "./pages/Dashboards/SuperAdmin/SuperAdminDashboard.jsx";
import CompanyAdminLayout from "./components/Layouts/CompanyAdmin/CompanyAdminLayout.jsx";
import CompanyAdminDashboard from "./pages/Dashboards/CompanyAdmin/CompanyAdminDashboard.jsx";
import RegularUserLayout from "./components/Layouts/RegularUser/RegularUserLayout.jsx";
import RegularUserDashboard from "./pages/Dashboards/RegularUser/RegularUserDashboard.jsx";
import AboutUs from "./pages/AboutUs/AboutUs.jsx";
import Error from './pages/Error/Error.jsx'
const UnauthorizedPage = () => (
  <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#ff0000", marginBottom: "16px" }}>Unauthorized</h1>
      <p style={{ color: "#666" }}>
        You don't have permission to access this page.
      </p>
        <a href="/">Go to back</a>
    </div>
  </div>
);

const AppRoutes = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

useEffect(() => {
  if (!loading && isAuthenticated && user) {
    const currentPath = location.pathname;

    if (user.role === "SuperAdmin") {
      if (!currentPath.startsWith("/superadmin")) {
        if (currentPath === "/" || currentPath === "/login" || currentPath === "/register") {
          navigate("/superadmin", { replace: true });
        }
      }
    }
    else if (user.role === "CompanyAdmin") {
      if (!currentPath.startsWith("/companyadmin")) {
        if (currentPath === "/" || currentPath === "/login" || currentPath === "/register") {
          navigate("/companyadmin", { replace: true });
        }
      }
    }
  }
}, [isAuthenticated, user, loading, navigate, location.pathname]);


    if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ animation: "spin 1s ease-in-out infinite", borderRadius: "50%", height: "32px", width: "32px", border: "2px solid #3498db" }} />
      </div>
    );
  }

  // Check if user is SuperAdmin to conditionally render navbar
  const isSuperAdmin = isAuthenticated && user?.role === "SuperAdmin";
  const isCompanyAdmin = isAuthenticated && user?.role === "CompanyAdmin";
  const isRegularUser = isAuthenticated && user?.role === "RegularUser";
  return (
    <>
      {/* Only show Navbar if user is not SuperAdmin or CompanyAdmin */}
      {!isSuperAdmin && !isCompanyAdmin && !isRegularUser && <Navbar />}

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
        <Route path="/news" element={<News />} />
        <Route path="/about" element={<AboutUs />} />

        {/* SuperAdmin Routes */}
        <Route
          path="/superadmin"
          element={
            <ProtectedRoute requiredRole="SuperAdmin">
              <SuperAdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<SuperAdminDashboard />} />
        </Route>
        {/* Regular user routes  */}
        <Route
          path="/regularuser"
          element={
            <ProtectedRoute requiredRole="RegularUser">
              <RegularUserLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<RegularUserDashboard />} />
        </Route>
        {/* Company admin routes  */}
        <Route
          path="/companyadmin"
          element={
            <ProtectedRoute requiredRole="CompanyAdmin">
              <CompanyAdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CompanyAdminDashboard companyType={user?.companyType} />} />
        </Route>

        {/* Manual redirect route (fallback) */}
        <Route
          path="/redirect"
          element={
            isAuthenticated ? (
              user?.role === "SuperAdmin" ? (
                <Navigate to="/superadmin" replace />
              ) : user?.role === "CompanyAdmin" ? (
                <Navigate to="/companyadmin" replace />
              ) : user?.role === "RegularUser" ? (
                <Navigate to="/regularuser" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            ) : (
              <Navigate to="/login" replace /> // fallback za neautentifikovanog
            )
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Error />} />
      </Routes>

      {/* Only show Footer if user is not SuperAdmin or CompanyAdmin */}
      {!isSuperAdmin && !isCompanyAdmin && !isRegularUser && <Footer />}
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
