import { apiService } from './api';

class ForwarderOfferService {
  async getAll(searchParams = {}) {
    const queryString = new URLSearchParams(searchParams).toString();
    const endpoint = queryString ? `/forwarderoffer?${queryString}` : '/forwarderoffer';
    return apiService.get(endpoint);
  }

  async getById(id) {
    return apiService.get(`/forwarderoffer/${id}`);
  }

  async create(offerData) {
    return apiService.post('/forwarderoffer', offerData);
  }

  async update(id, offerData) {
    return apiService.put(`/forwarderoffer/${id}`, offerData);
  }

  async delete(id) {
    return apiService.delete(`/forwarderoffer/${id}`);
  }

  async updateStatus(id, statusData) {
    return apiService.patch(`/forwarderoffer/${id}/status`, statusData);
  }
}

export const forwarderOfferService = new ForwarderOfferService();
