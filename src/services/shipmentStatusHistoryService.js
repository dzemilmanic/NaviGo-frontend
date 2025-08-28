import { apiService } from './api';

class ShipmentStatusHistoryService {
  async getAll(searchParams = {}) {
    const queryString = new URLSearchParams(searchParams).toString();
    const endpoint = queryString 
      ? `/shipment-status-history?${queryString}` 
      : '/shipment-status-history';
    return apiService.get(endpoint);
  }

  async getById(id) {
    return apiService.get(`/shipment-status-history/${id}`);
  }

  async create(data) {
    return apiService.post('/shipment-status-history', data);
  }

  async update(id, data) {
    return apiService.put(`/shipment-status-history/${id}`, data);
  }

  async delete(id) {
    return apiService.delete(`/shipment-status-history/${id}`);
  }
}

export const shipmentStatusHistoryService = new ShipmentStatusHistoryService();
