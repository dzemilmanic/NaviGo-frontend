import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
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
    
    setIsAuthenticated(authenticated);
    setUser(currentUser);
    setLoading(false);
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
        message: error.message || 'Login failed. Please try again.'
      };
    }
  };

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
        message: 'Logged out successfully'
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
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};