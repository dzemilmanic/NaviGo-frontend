import { apiService } from './api';

class PickupChangeService {
  async getAll(searchParams = {}) {
    const queryString = new URLSearchParams(searchParams).toString();
    const endpoint = queryString ? `/pickupchange?${queryString}` : '/pickupchange';
    return apiService.get(endpoint);
  }

  async getById(id) {
    return apiService.get(`/pickupchange/${id}`);
  }

  async create(pickupChangeData) {
    return apiService.post('/pickupchange', pickupChangeData);
  }

  async update(id, pickupChangeData) {
    return apiService.put(`/pickupchange/${id}`, pickupChangeData);
  }

  async delete(id) {
    return apiService.delete(`/pickupchange/${id}`);
  }
}

export const pickupChangeService = new PickupChangeService();
