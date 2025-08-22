import { apiClient, API_ENDPOINTS } from './api';

export const contractService = {
  // Get all contracts with optional search parameters
  getAll: async (searchParams = {}) => {
    try {
      const queryString = new URLSearchParams(searchParams).toString();
      const url = queryString ? `${API_ENDPOINTS.CONTRACTS}?${queryString}` : API_ENDPOINTS.CONTRACTS;
      
      const response = await apiClient.get(url);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch contracts',
        error: error
      };
    }
  },

  // Get contract by ID
  getById: async (id) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.CONTRACTS}/${id}`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch contract',
        error: error
      };
    }
  },

  // Create contract
  create: async (contractData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.CONTRACTS, contractData);
      return {
        success: true,
        data: response,
        message: 'Contract created successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to create contract',
        error: error
      };
    }
  },

  // Update contract
  update: async (id, contractData) => {
    try {
      const response = await apiClient.put(`${API_ENDPOINTS.CONTRACTS}/${id}`, contractData);
      return {
        success: true,
        data: response,
        message: 'Contract updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to update contract',
        error: error
      };
    }
  },

  // Delete contract
  delete: async (id) => {
    try {
      await apiClient.delete(`${API_ENDPOINTS.CONTRACTS}/${id}`);
      return {
        success: true,
        message: 'Contract deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to delete contract',
        error: error
      };
    }
  }
};