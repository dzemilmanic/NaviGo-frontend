const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7240/api';

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
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
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
          message: data.message || data.error || 'Login failed'
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

  // Logout user
  async logout() {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        // Call logout endpoint if needed
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }).catch(() => {
          // Ignore errors on logout endpoint
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
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
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