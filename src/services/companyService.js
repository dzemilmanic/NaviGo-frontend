import { apiService } from './api';

class CompanyService {
  async getAll(searchParams = {}) {
    const queryString = new URLSearchParams(searchParams).toString();
    const endpoint = queryString ? `/company?${queryString}` : '/company';
    return apiService.get(endpoint);
  }

  async getById(id) {
    return apiService.get(`/company/${id}`);
  }

  async create(companyData) {
    return apiService.post('/company', companyData);
  }

  async update(id, companyData) {
    return apiService.put(`/company/${id}`, companyData);
  }

  async updateStatus(id, status) {
    return apiService.patch(`/company/${id}/status`, {
      companyStatus: status
    });
  }

  async delete(id) {
    return apiService.delete(`/company/${id}`);
  }
}

export const companyService = new CompanyService();