import { apiService } from './api';

class VehicleService {
  async getAll(searchParams = {}) {
    const queryString = new URLSearchParams(searchParams).toString();
    const endpoint = queryString ? `/vehicle?${queryString}` : '/vehicle';
    return apiService.get(endpoint);
  }

  async getById(id) {
    return apiService.get(`/vehicle/${id}`);
  }

  async create(vehicleData) {
    return apiService.post('/vehicle', vehicleData);
  }

  async update(id, vehicleData) {
    return apiService.put(`/vehicle/${id}`, vehicleData);
  }

  async delete(id) {
    return apiService.delete(`/vehicle/${id}`);
  }
}

export const vehicleService = new VehicleService();