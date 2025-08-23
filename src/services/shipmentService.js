import { apiService } from './api';

class ShipmentService {
  async getAll(searchParams = {}) {
    const queryString = new URLSearchParams(searchParams).toString();
    const endpoint = queryString ? `/shipment?${queryString}` : '/shipment';
    return apiService.get(endpoint);
  }

  async getById(id) {
    return apiService.get(`/shipment/${id}`);
  }

  async create(shipmentData) {
    return apiService.post('/shipment', shipmentData);
  }

  async update(id, shipmentData) {
    return apiService.put(`/shipment/${id}`, shipmentData);
  }

  async delete(id) {
    return apiService.delete(`/shipment/${id}`);
  }
}

export const shipmentService = new ShipmentService();