import { apiService } from "./api";

class ShipmentDocumentService {
  async getAll(searchParams = {}) {
    const queryString = new URLSearchParams(searchParams).toString();
    const endpoint = queryString
      ? `/shipment-document?${queryString}`
      : "/shipment-document";
    return apiService.get(endpoint);
  }

  async getById(id) {
    return apiService.get(`/shipment-document/${id}`);
  }

  async create(data) {
    return apiService.post("/shipment-document", data);
  }

  async update(id, data) {
    return apiService.put(`/shipment-document/${id}`, data);
  }

  async delete(id) {
    return apiService.delete(`/shipment-document/${id}`);
  }
}

export const shipmentDocumentService = new ShipmentDocumentService();
