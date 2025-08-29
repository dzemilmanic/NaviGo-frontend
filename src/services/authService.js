import { API_ENDPOINTS } from "./api";

// Helper function to decode JWT token
const decodeToken = (token) => {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

class AuthService {
  // Register user
  async register(userData) {
    try {
      const response = await fetch(API_ENDPOINTS.REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: "Registration successful",
          data: data, // ovde možeš staviti ID ili token ako backend vraća
        };
      } else {
        return {
          success: false,
          message: data.message || data.error || "Registration failed",
        };
      }
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: error.message || "Network error during registration",
      };
    }
  }
  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem("accessToken");
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
      console.error("Token validation error:", error);
      this.clearTokens();
      return false;
    }
  }

  // Get current user from token
  getCurrentUser() {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    try {
      const decoded = decodeToken(token);
      if (!decoded) return null;

      const user = {
        email: decoded.email || decoded.sub,
        role: decoded.role,
        companyType: decoded.companyType || "",
        firstName: decoded.firstName || "",
        lastName: decoded.lastName || "",
        jti: decoded.jti,
        exp: decoded.exp,
        companyId:decoded.companyId || "",
        id: decoded.id,
      };

      return user;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  }

  // Login user
  async login(credentials) {
    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }
        console.log(this.getCurrentUser());
        return {
          success: true,
          user: this.getCurrentUser(),
          message: "Login successful",
        };
      } else {
        return {
          success: false,
          message: data.message || data.error || "Invalid email or password",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: "Network error. Please try again.",
      };
    }
  }

  // Google login
  async googleLogin(idToken) {
    try {
      const response = await fetch(API_ENDPOINTS.GOOGLE_LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          idToken: idToken,
        }),
      });

      const data = await response.json();

      if (response.ok && data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }
        console.log(this.getCurrentUser());
        return {
          success: true,
          user: this.getCurrentUser(),
          message: "Google login successful",
        };
      } else {
        return {
          success: false,
          message: data.message || data.error || "Google login failed",
        };
      }
    } catch (error) {
      console.error("Google login error:", error);
      return {
        success: false,
        message: "Network error. Please try again.",
      };
    }
  }

  // Logout user
  async logout() {
    try {
      const token = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (token && refreshToken) {
        await fetch(API_ENDPOINTS.LOGOUT, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            refreshToken: refreshToken,
          }),
        }).catch((error) => {
          console.error("Logout endpoint error:", error);
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      this.clearTokens();
      return {
        success: true,
        message: "Logged out successfully",
      };
    }
  }

  // Clear stored tokens
  clearTokens() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  // Get access token
  getAccessToken() {
    return localStorage.getItem("accessToken");
  }

  // Get refresh token
  getRefreshToken() {
    return localStorage.getItem("refreshToken");
  }

  // Refresh access token
  async refreshAccessToken() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return { success: false, message: "No refresh token available" };
    }

    try {
      const response = await fetch(API_ENDPOINTS.REFRESH, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          token: refreshToken,
        }),
      });

      const data = await response.json();

      if (response.ok && data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }

        return {
          success: true,
          accessToken: data.accessToken,
        };
      } else {
        this.clearTokens();
        return {
          success: false,
          message: data.message || "Token refresh failed",
        };
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      this.clearTokens();
      return {
        success: false,
        message: "Network error during token refresh",
      };
    }
  }
}

export const authService = new AuthService();
