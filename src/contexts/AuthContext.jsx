import React, { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService";


const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = () => {
    setLoading(true);
    const authenticated = authService.isAuthenticated();
    const currentUser = authService.getCurrentUser();

    console.log('Auth status check:', { authenticated, currentUser });

    setIsAuthenticated(authenticated);
    setUser(currentUser);
    setLoading(false);
  };

  const isSuperAdmin = () => {
    return user && user.role === "SuperAdmin";
  };

  const isCompanyAdmin = () => {
    return user && user.role === "CompanyAdmin";
  };

  const isCompanyUser = () => {
    return user && user.role === "CompanyUser";
  };

  const isRegularUser = () => {
    return user && (user.role === "User" || user.role === "RegularUser");
  };

  const login = async (credentials) => {
    try {
      const result = await authService.login(credentials);
      if (result.success) {
        checkAuthStatus(); // Refresh auth state
        
        
      }
      return result;
    } catch (error) {
      return {
        success: false,
        message: error.message || "Login failed. Please try again.",
      };
    }
  };
  const googleLogin = async (idToken) =>{
    try {
      const result = await authService.googleLogin(idToken);
      if (result.success) {
        checkAuthStatus(); 
      }
      return result;
    } catch (error) {
      return {
        success: false,
        message: error.message || "Login failed. Please try again.",
      };
    }
  }
  const logout = async () => {
    try {
      const result = await authService.logout();
      if (result.success) {
        setIsAuthenticated(false);
        setUser(null);
      }
      return result;
    } catch (error) {
      // Clear state even if logout call fails
      setIsAuthenticated(false);
      setUser(null);
      return {
        success: true,
        message: "Logged out successfully",
      };
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    googleLogin,
    logout,
    checkAuthStatus,
    isSuperAdmin,
    isCompanyAdmin,
    isCompanyUser,
    isRegularUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};