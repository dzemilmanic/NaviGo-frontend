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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";

import Home from "./components/Home/Home.jsx";

import Login from "./components/Login/Login.jsx";
import Register from "./components/Register/Register.jsx";
import Cookies from "./pages/Cookies.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import TermsOfServices from "./pages/TermsOfServices.jsx";
import RouteMap from "./pages/RouteMap/RouteMap.jsx";

import SuperAdminLayout from "./components/Layouts/SuperAdmin/SuperAdminLayout.jsx";
import SuperAdminDashboard from "./pages/Dashboards/SuperAdmin/SuperAdminDashboard.jsx";
import CompanyAdminLayout from "./components/Layouts/CompanyAdmin/CompanyAdminLayout.jsx";
import CompanyAdminDashboard from "./pages/Dashboards/CompanyAdmin/CompanyAdminDashboard.jsx";
import RegularUserLayout from "./components/Layouts/RegularUser/RegularUserLayout.jsx";
import RegularUserDashboard from "./pages/Dashboards/RegularUser/RegularUserDashboard.jsx";
import Unauthorized from "./pages/Unauthorized/Unauthorized.jsx";
import Error from "./pages/Error/Error.jsx";

const AppRoutes = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      const currentPath = location.pathname;

      if (user.role === "SuperAdmin") {
        if (!currentPath.startsWith("/superadmin")) {
          if (
            currentPath === "/" ||
            currentPath === "/login" ||
            currentPath === "/register"
          ) {
            navigate("/superadmin", { replace: true });
          }
        }
      } else if (user.role === "CompanyAdmin") {
        if (!currentPath.startsWith("/companyadmin")) {
          if (
            currentPath === "/" ||
            currentPath === "/login" ||
            currentPath === "/register"
          ) {
            navigate("/companyadmin", { replace: true });
          }
        }
      } else if (user.role === "RegularUser") {
        if (!currentPath.startsWith("/regularuser")) {
          if (
            currentPath === "/" ||
            currentPath === "/login" ||
            currentPath === "/register"
          ) {
            navigate("/regularuser", { replace: true });
          }
        }
      }
    }
  }, [isAuthenticated, user, loading, navigate, location.pathname]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            animation: "spin 1s ease-in-out infinite",
            borderRadius: "50%",
            height: "32px",
            width: "32px",
            border: "2px solid #3498db",
          }}
        />
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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfServices />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route  
          path="/routes"
          element={
            <ProtectedRoute>
              <RouteMap />
            </ProtectedRoute>
          }
        />

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
          <Route
            index
            element={<CompanyAdminDashboard companyType={user?.companyType} />}
          />
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

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ zIndex: 9999 }}
      />
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
