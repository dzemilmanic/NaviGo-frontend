import { apiService } from './api';

class VehicleTypeService {
  async getAll() {
    return apiService.get('/vehicletype');
  }

  async getById(id) {
    return apiService.get(`/vehicletype/${id}`);
  }

  async create(vehicleTypeData) {
    return apiService.post('/vehicletype', vehicleTypeData);
  }

  async update(id, vehicleTypeData) {
    return apiService.put(`/vehicletype/${id}`, vehicleTypeData);
  }

  async delete(id) {
    return apiService.delete(`/vehicletype/${id}`);
  }
}

export const vehicleTypeService = new VehicleTypeService();