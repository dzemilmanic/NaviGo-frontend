import { useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    setLoading(true);
    const authenticated = authService.isAuthenticated();
    const currentUser = authService.getCurrentUser();
    
    setIsAuthenticated(authenticated);
    setUser(currentUser);
    setLoading(false);
  };

  const login = async (credentials) => {
    const result = await authService.login(credentials);
    if (result.success) {
      checkAuthStatus(); // Refresh auth state
    }
    return result;
  };

  const logout = async () => {
    const result = await authService.logout();
    if (result.success) {
      setIsAuthenticated(false);
      setUser(null);
    }
    return result;
  };

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    checkAuthStatus
  };
};