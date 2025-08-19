import { API_ENDPOINTS } from './api.js';

// Helper function to decode JWT token
const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const authService = {
  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;

    try {
      const decoded = decodeToken(token);
      if (!decoded) return false;
      
      // Check if token is expired
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        this.clearTokens();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      this.clearTokens();
      return false;
    }
  },

  // Get current user from token
  getCurrentUser() {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;

    try {
      const decoded = decodeToken(token);
      if (!decoded) return null;

      // Keep the role as string as returned from backend
      const user = {
        email: decoded.email || decoded.sub,
        role: decoded.role, // Keep as string (e.g., "SuperAdmin", "CompanyAdmin", etc.)
        firstName: decoded.firstName || '',
        lastName: decoded.lastName || '',
        jti: decoded.jti,
        exp: decoded.exp
      };

      console.log('Current user from token:', user);
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Login user
  async login(credentials) {
    try {
      console.log('Attempting login with:', { email: credentials.email });
      
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        }),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (response.ok && data.accessToken) {
        // Store tokens
        localStorage.setItem('accessToken', data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }

        console.log('Login successful, tokens stored');
        return {
          success: true,
          user: this.getCurrentUser(),
          message: 'Login successful'
        };
      } else {
        console.error('Login failed:', data);
        return {
          success: false,
          message: data.message || data.error || 'Invalid email or password'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  },

  // Google login
  async googleLogin(idToken) {
    try {
      console.log('Attempting Google login');
      
      const response = await fetch(API_ENDPOINTS.GOOGLE_LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          idToken: idToken
        }),
      });

      const data = await response.json();
      console.log('Google login response:', data);

      if (response.ok && data.accessToken) {
        // Store tokens
        localStorage.setItem('accessToken', data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }

        console.log('Google login successful, tokens stored');
        return {
          success: true,
          user: this.getCurrentUser(),
          message: 'Google login successful'
        };
      } else {
        console.error('Google login failed:', data);
        return {
          success: false,
          message: data.message || data.error || 'Google login failed'
        };
      }
    } catch (error) {
      console.error('Google login error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  },

  // Logout user
  async logout() {
    try {
      const token = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (token && refreshToken) {
        // Call logout endpoint with refresh token as required by backend
        await fetch(API_ENDPOINTS.LOGOUT, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            token: refreshToken // Send refresh token for logout
          }),
        }).catch((error) => {
          console.error('Logout endpoint error:', error);
          // Continue with local cleanup even if server call fails
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear tokens
      this.clearTokens();
      return {
        success: true,
        message: 'Logged out successfully'
      };
    }
  },

  // Clear stored tokens
  clearTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  // Get access token
  getAccessToken() {
    return localStorage.getItem('accessToken');
  },

  // Get refresh token
  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  },

  // Refresh access token
  async refreshAccessToken() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return { success: false, message: 'No refresh token available' };
    }

    try {
      const response = await fetch(API_ENDPOINTS.REFRESH, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ 
          token: refreshToken // Backend expects 'token' field
        }),
      });

      const data = await response.json();

      if (response.ok && data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }
        
        return {
          success: true,
          accessToken: data.accessToken
        };
      } else {
        this.clearTokens();
        return {
          success: false,
          message: data.message || 'Token refresh failed'
        };
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      this.clearTokens();
      return {
        success: false,
        message: 'Network error during token refresh'
      };
    }
  }
};
