import { apiClient, API_ENDPOINTS } from './api';

export const companyService = {
  // Get all companies with optional search parameters
  getAll: async (searchParams = {}) => {
    try {
      const queryString = new URLSearchParams(searchParams).toString();
      const url = queryString ? `${API_ENDPOINTS.COMPANIES}?${queryString}` : API_ENDPOINTS.COMPANIES;
      
      const response = await apiClient.get(url);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch companies',
        error: error
      };
    }
  },

  // Get company by ID
  getById: async (id) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.COMPANIES}/${id}`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch company',
        error: error
      };
    }
  },

  // Update company status (for SuperAdmin)
  updateStatus: async (id, status) => {
    try {
      const response = await apiClient.patch(`${API_ENDPOINTS.COMPANIES}/${id}/status`, {
        companyStatus: status
      });
      return {
        success: true,
        data: response,
        message: 'Company status updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to update company status',
        error: error
      };
    }
  },

  // Delete company
  delete: async (id) => {
    try {
      await apiClient.delete(`${API_ENDPOINTS.COMPANIES}/${id}`);
      return {
        success: true,
        message: 'Company deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to delete company',
        error: error
      };
    }
  }
};