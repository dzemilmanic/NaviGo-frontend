import { apiClient, API_ENDPOINTS } from './api';

export const authService = {
  // Register user
  register: async (userData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.REGISTER, userData);
      return {
        success: true,
        data: response,
        message: 'Registration successful! Please check your email for verification.'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Registration failed. Please try again.',
        error: error
      };
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.LOGIN, credentials);
      
      if (response.accessToken) {
        // Store tokens in localStorage
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        
        // Decode user info from token (basic implementation)
        const userInfo = parseJwtToken(response.accessToken);
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        
        return {
          success: true,
          data: response,
          message: 'Login successful!'
        };
      } else {
        throw new Error('No access token received');
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Login failed. Please check your credentials.',
        error: error
      };
    }
  },

  // Logout user
  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        // Call backend logout endpoint
        await apiClient.post(API_ENDPOINTS.LOGOUT, { token: refreshToken });
      }
      
      // Clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userInfo');
      
      return {
        success: true,
        message: 'Logged out successfully'
      };
    } catch (error) {
      // Even if backend call fails, clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userInfo');
      
      return {
        success: true,
        message: 'Logged out successfully'
      };
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;
    
    try {
      const payload = parseJwtToken(token);
      // Check if token is expired
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },

  // Get current user info
  getCurrentUser: () => {
    try {
      const userInfo = localStorage.getItem('userInfo');
      return userInfo ? JSON.parse(userInfo) : null;
    } catch {
      return null;
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token available');

      const response = await apiClient.post(API_ENDPOINTS.REFRESH, { token: refreshToken });
      
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      
      const userInfo = parseJwtToken(response.accessToken);
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      // If refresh fails, logout user
      authService.logout();
      return {
        success: false,
        message: 'Session expired. Please login again.'
      };
    }
  }
};

// Helper function to parse JWT token
function parseJwtToken(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT token:', error);
    return {};
  }
}