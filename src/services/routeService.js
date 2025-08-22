import { apiClient, API_ENDPOINTS } from './api';

export const routeService = {
  // Get all routes with optional search parameters
  getAll: async (searchParams = {}) => {
    try {
      const queryString = new URLSearchParams(searchParams).toString();
      const url = queryString ? `${API_ENDPOINTS.ROUTES}?${queryString}` : API_ENDPOINTS.ROUTES;
      
      const response = await apiClient.get(url);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch routes',
        error: error
      };
    }
  },

  // Get route by ID
  getById: async (id) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.ROUTES}/${id}`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch route',
        error: error
      };
    }
  },

  // Create route
  create: async (routeData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.ROUTES, routeData);
      return {
        success: true,
        data: response,
        message: 'Route created successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to create route',
        error: error
      };
    }
  },

  // Update route
  update: async (id, routeData) => {
    try {
      const response = await apiClient.put(`${API_ENDPOINTS.ROUTES}/${id}`, routeData);
      return {
        success: true,
        data: response,
        message: 'Route updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to update route',
        error: error
      };
    }
  },

  // Delete route
  delete: async (id) => {
    try {
      await apiClient.delete(`${API_ENDPOINTS.ROUTES}/${id}`);
      return {
        success: true,
        message: 'Route deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to delete route',
        error: error
      };
    }
  }
};