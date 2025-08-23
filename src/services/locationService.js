import { apiService } from './api';

class LocationService {
  async getAll() {
    return apiService.get('/location');
  }

  async getById(id) {
    return apiService.get(`/location/${id}`);
  }

  async create(locationData) {
    return apiService.post('/location', locationData);
  }

  async update(id, locationData) {
    return apiService.put(`/location/${id}`, locationData);
  }

  async delete(id) {
    return apiService.delete(`/location/${id}`);
  }
}

export const locationService = new LocationService();