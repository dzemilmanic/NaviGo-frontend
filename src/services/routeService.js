import { apiService } from './api';

class RouteService {
  async getAll(searchParams = {}) {
    const queryString = new URLSearchParams(searchParams).toString();
    const endpoint = queryString ? `/route?${queryString}` : '/route';
    return apiService.get(endpoint);
  }

  async getById(id) {
    return apiService.get(`/route/${id}`);
  }

  async create(routeData) {
    return apiService.post('/route', routeData);
  }

  async update(id, routeData) {
    return apiService.put(`/route/${id}`, routeData);
  }

  async delete(id) {
    return apiService.delete(`/route/${id}`);
  }
}

export const routeService = new RouteService();