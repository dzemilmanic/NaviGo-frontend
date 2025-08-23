import { apiService } from './api';

class DriverService {
  async getAll(searchParams = {}) {
    const queryString = new URLSearchParams(searchParams).toString();
    const endpoint = queryString ? `/driver?${queryString}` : '/driver';
    return apiService.get(endpoint);
  }

  async getById(id) {
    return apiService.get(`/driver/${id}`);
  }

  async create(driverData) {
    return apiService.post('/driver', driverData);
  }

  async update(id, driverData) {
    return apiService.put(`/driver/${id}`, driverData);
  }

  async delete(id) {
    return apiService.delete(`/driver/${id}`);
  }
}

export const driverService = new DriverService();