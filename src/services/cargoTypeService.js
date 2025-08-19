import { apiService } from './api';

class CargoTypeService {
  async getAll() {
    return apiService.get('/cargotype');
  }

  async getById(id) {
    return apiService.get(`/cargotype/${id}`);
  }

  async create(cargoTypeData) {
    return apiService.post('/cargotype', cargoTypeData);
  }

  async update(id, cargoTypeData) {
    return apiService.put(`/cargotype/${id}`, cargoTypeData);
  }

  async delete(id) {
    return apiService.delete(`/cargotype/${id}`);
  }
}

export const cargoTypeService = new CargoTypeService();