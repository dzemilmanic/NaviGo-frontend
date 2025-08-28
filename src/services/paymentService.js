import { apiService } from './api';

class PaymentService {
  async getAll(searchParams = {}) {
    const queryString = new URLSearchParams(searchParams).toString();
    const endpoint = queryString ? `/payment?${queryString}` : '/payment';
    return apiService.get(endpoint);
  }

  async getById(id) {
    return apiService.get(`/payment/${id}`);
  }

  async create(paymentData) {
    return apiService.post('/payment', paymentData);
  }

  async update(id, paymentData) {
    return apiService.put(`/payment/${id}`, paymentData);
  }

  async delete(id) {
    return apiService.delete(`/payment/${id}`);
  }
  async uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file); // "file" je ime parametra koje server očekuje
    return apiService.upload("/File/upload", formData);
  }
}

export const paymentService = new PaymentService();
