import { apiService } from './api';

class ShipmentStatusHistoryService {
  async getAll(searchParams = {}) {
    const queryString = new URLSearchParams(searchParams).toString();
    const endpoint = queryString 
      ? `/ShipmentStatusHistory?${queryString}` 
      : '/ShipmentStatusHistory';
    return apiService.get(endpoint);
  }

  async getById(id) {
    return apiService.get(`/ShipmentStatusHistoryy/${id}`);
  }

  async create(data) {
    return apiService.post('/ShipmentStatusHistory', data);
  }

  async update(id, data) {
    return apiService.put(`/ShipmentStatusHistory/${id}`, data);
  }

  async delete(id) {
    return apiService.delete(`/ShipmentStatusHistory/${id}`);
  }
}

export const shipmentStatusHistoryService = new ShipmentStatusHistoryService();
