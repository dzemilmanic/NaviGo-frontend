import { apiService } from './api';

class UserService {
  async getAll(searchParams = {}) {
    const queryString = new URLSearchParams(searchParams).toString();
    const endpoint = queryString ? `/user?${queryString}` : '/user';
    return apiService.get(endpoint);
  }

  async getById(id) {
    return apiService.get(`/user/${id}`);
  }

  async create(userData) {
    return apiService.post('/user', userData);
  }

  async updateStatus(id, status) {
    const statusValue = status === "Active" ? 1 : 0;
    return apiService.patch(`/user/activate/${id}`, {
      userStatus: statusValue
    });
  }

  async createSuperAdmin(userData) {
    return apiService.post('/user/superadmin', userData);
  }

  async delete(id) {
    return apiService.delete(`/user/${id}`);
  }

  async changePassword(currentPassword, newPassword) {
    return apiService.post('/user/change-password', {
      currentPassword,
      newPassword
    });
  }

  async forgotPassword(email) {
    return apiService.post('/user/forgot-password', { email });
  }

  async resetPassword(token, newPassword) {
    return apiService.post('/user/reset-password', {
      token,
      newPassword
    });
  }

  async checkLoginEligibility(email) {
    return apiService.get(`/user/check-login-eligibility?email=${encodeURIComponent(email)}`);
  }
}

export const userService = new UserService();