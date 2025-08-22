import { apiClient, API_ENDPOINTS } from './api';

export const shipmentService = {
  // Get all shipments with optional search parameters
  getAll: async (searchParams = {}) => {
    try {
      const queryString = new URLSearchParams(searchParams).toString();
      const url = queryString ? `${API_ENDPOINTS.SHIPMENTS}?${queryString}` : API_ENDPOINTS.SHIPMENTS;
      
      const response = await apiClient.get(url);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch shipments',
        error: error
      };
    }
  },

  // Get shipment by ID
  getById: async (id) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.SHIPMENTS}/${id}`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch shipment',
        error: error
      };
    }
  },

  // Create shipment
  create: async (shipmentData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.SHIPMENTS, shipmentData);
      return {
        success: true,
        data: response,
        message: 'Shipment created successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to create shipment',
        error: error
      };
    }
  },

  // Update shipment
  update: async (id, shipmentData) => {
    try {
      const response = await apiClient.put(`${API_ENDPOINTS.SHIPMENTS}/${id}`, shipmentData);
      return {
        success: true,
        data: response,
        message: 'Shipment updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to update shipment',
        error: error
      };
    }
  },

  // Delete shipment
  delete: async (id) => {
    try {
      await apiClient.delete(`${API_ENDPOINTS.SHIPMENTS}/${id}`);
      return {
        success: true,
        message: 'Shipment deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to delete shipment',
        error: error
      };
    }
  }
};