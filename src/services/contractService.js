import { apiService } from './api';

class ContractService {
  async getAll(searchParams = {}) {
    const queryString = new URLSearchParams(searchParams).toString();
    const endpoint = queryString ? `/contract?${queryString}` : '/contract';
    return apiService.get(endpoint);
  }

  async getById(id) {
    return apiService.get(`/contract/${id}`);
  }

  async create(contractData) {
    return apiService.post('/contract', contractData);
  }

  async update(id, contractData) {
    return apiService.put(`/contract/${id}`, contractData);
  }

  async delete(id) {
    return apiService.delete(`/contract/${id}`);
  }
}

export const contractService = new ContractService();