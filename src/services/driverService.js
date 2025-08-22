import { apiClient, API_ENDPOINTS } from './api';

export const driverService = {
  // Get all drivers with optional search parameters
  getAll: async (searchParams = {}) => {
    try {
      const queryString = new URLSearchParams(searchParams).toString();
      const url = queryString ? `${API_ENDPOINTS.DRIVERS}?${queryString}` : API_ENDPOINTS.DRIVERS;
      
      const response = await apiClient.get(url);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch drivers',
        error: error
      };
    }
  },

  // Get driver by ID
  getById: async (id) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.DRIVERS}/${id}`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch driver',
        error: error
      };
    }
  },

  // Create driver
  create: async (driverData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.DRIVERS, driverData);
      return {
        success: true,
        data: response,
        message: 'Driver created successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to create driver',
        error: error
      };
    }
  },

  // Update driver
  update: async (id, driverData) => {
    try {
      const response = await apiClient.put(`${API_ENDPOINTS.DRIVERS}/${id}`, driverData);
      return {
        success: true,
        data: response,
        message: 'Driver updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to update driver',
        error: error
      };
    }
  },

  // Delete driver
  delete: async (id) => {
    try {
      await apiClient.delete(`${API_ENDPOINTS.DRIVERS}/${id}`);
      return {
        success: true,
        message: 'Driver deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to delete driver',
        error: error
      };
    }
  }
};