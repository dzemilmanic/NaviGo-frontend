import { apiService } from './api';

class VehicleMaintenanceService {
  async getAll(searchParams = {}) {
    const queryString = new URLSearchParams(searchParams).toString();
    const endpoint = queryString ? `/vehiclemaintenance?${queryString}` : '/vehiclemaintenance';
    return apiService.get(endpoint);
  }

  async getById(id) {
    return apiService.get(`/vehiclemaintenance/${id}`);
  }

  async create(maintenanceData) {
    return apiService.post('/vehiclemaintenance', maintenanceData);
  }

  async update(id, maintenanceData) {
    return apiService.put(`/vehiclemaintenance/${id}`, maintenanceData);
  }

  async delete(id) {
    return apiService.delete(`/vehiclemaintenance/${id}`);
  }
}

export const vehicleMaintenanceService = new VehicleMaintenanceService();