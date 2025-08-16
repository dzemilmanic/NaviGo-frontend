import { apiClient, API_ENDPOINTS } from './api';

export const companyService = {
  // Search company by PIB
  searchByPib: async (pib) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.COMPANIES}/search?pib=${pib}`);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Company search failed.',
        data: []
      };
    }
  },

  // Create new company
  create: async (companyData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.COMPANIES, companyData);
      return {
        success: true,
        data: response.company || response,
        message: response.message || 'Company created successfully.'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to create company.',
      };
    }
  },

  // Get all companies
  getAll: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.COMPANIES);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch companies.',
        data: []
      };
    }
  },

  // Get company by ID
  getById: async (id) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.COMPANIES}/${id}`);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch company.',
      };
    }
  }
};