import { apiService } from "./api";

class VehicleService {
  async getAll(searchParams = {}) {
    // Default parametri koji su obavezni za API
    const defaultParams = {
      Brand: "",
      SortBy: "1",
      SortDirection: "asc",
      Page: "1",
      PageSize: "100",
      ...searchParams, // Override default values sa proslijeđenim parametrima
    };

    const queryString = new URLSearchParams(defaultParams).toString();
    const endpoint = `/vehicle?${queryString}`;
    return apiService.get(endpoint);
  }

  async getById(id) {
    return apiService.get(`/vehicle/${id}`);
  }

  async create(vehicleData) {
    return apiService.post("/vehicle", vehicleData);
  }

  async update(id, vehicleData) {
    return apiService.put(`/vehicle/${id}`, vehicleData);
  }

  async delete(id) {
    return apiService.delete(`/vehicle/${id}`);
  }
}

export const vehicleService = new VehicleService();
