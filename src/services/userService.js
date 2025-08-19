import { apiClient, API_ENDPOINTS } from './api';

export const userService = {
  // Get all users with optional search parameters
  getAll: async (searchParams = {}) => {
    try {
      const queryString = new URLSearchParams(searchParams).toString();
      const url = queryString ? `${API_ENDPOINTS.USERS}?${queryString}` : API_ENDPOINTS.USERS;
      
      const response = await apiClient.get(url);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch users',
        error: error
      };
    }
  },

  // Get user by ID
  getById: async (id) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.USERS}/${id}`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch user',
        error: error
      };
    }
  },

  // Activate/Deactivate user
  updateStatus: async (id, status) => {
    try {
      const response = await apiClient.patch(`${API_ENDPOINTS.USERS}/activate/${id}`, {
        userStatus: status
      });
      return {
        success: true,
        data: response,
        message: 'User status updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to update user status',
        error: error
      };
    }
  },

  // Create SuperAdmin
  createSuperAdmin: async (userData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.SUPERADMIN, userData);
      return {
        success: true,
        data: response,
        message: 'SuperAdmin created successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to create SuperAdmin',
        error: error
      };
    }
  },

  // Delete user
  delete: async (id) => {
    try {
      await apiClient.delete(`${API_ENDPOINTS.USERS}/${id}`);
      return {
        success: true,
        message: 'User deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to delete user',
        error: error
      };
    }
  }
};