import { apiService } from './api';

class RoutePriceService {
  async getAll(searchParams = {}) {
    const queryString = new URLSearchParams(searchParams).toString();
    const endpoint = queryString ? `/routeprice?${queryString}` : '/routeprice';
    return apiService.get(endpoint);
  }

  async getById(id) {
    return apiService.get(`/routeprice/${id}`);
  }

  async create(routePriceData) {
    return apiService.post('/routeprice', routePriceData);
  }

  async update(id, routePriceData) {
    return apiService.put(`/routeprice/${id}`, routePriceData);
  }

  async delete(id) {
    return apiService.delete(`/routeprice/${id}`);
  }
}

export const routePriceService = new RoutePriceService();
