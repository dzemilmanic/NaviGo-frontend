import { cargoTypeService } from './cargoTypeService';
import { vehicleTypeService } from './vehicleTypeService';

class SystemService {
  async getCargoTypes() {
    return cargoTypeService.getAll();
  }

  async createCargoType(data) {
    return cargoTypeService.create(data);
  }

  async updateCargoType(id, data) {
    return cargoTypeService.update(id, data);
  }

  async deleteCargoType(id) {
    return cargoTypeService.delete(id);
  }

  async getVehicleTypes() {
    return vehicleTypeService.getAll();
  }

  async createVehicleType(data) {
    return vehicleTypeService.create(data);
  }

  async updateVehicleType(id, data) {
    return vehicleTypeService.update(id, data);
  }

  async deleteVehicleType(id) {
    return vehicleTypeService.delete(id);
  }
}

export const systemService = new SystemService();