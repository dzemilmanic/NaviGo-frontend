import { apiService } from "./api";

class ShipmentDocumentService {
  async getAll(searchParams = {}) {
    const queryString = new URLSearchParams(searchParams).toString();
    const endpoint = queryString
      ? `/shipmentdocument?${queryString}`
      : "/shipmentdocument";
    return apiService.get(endpoint);
  }

  async getById(id) {
    return apiService.get(`/shipmentdocument/${id}`);
  }

  async create(data) {
    return apiService.post("/shipmentdocument", data);
  }

  async update(id, data) {
    return apiService.put(`/shipmentdocument/${id}`, data);
  }

  async delete(id) {
    return apiService.delete(`/shipmentdocument/${id}`);
  }
  async uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);
    return apiService.upload("/File/upload", formData);
  }
}

export const shipmentDocumentService = new ShipmentDocumentService();
