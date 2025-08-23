const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://navigoapi-fgguf3fkh6b4fqg3.italynorth-01.azurewebsites.net/api';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/auth/login`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  REFRESH: `${API_BASE_URL}/auth/refresh`,
  GOOGLE_LOGIN: `${API_BASE_URL}/auth/google-login`,
  
  // User endpoints
  USERS: `${API_BASE_URL}/user`,
  SUPERADMIN: `${API_BASE_URL}/user/superadmin`,
  VERIFY_EMAIL: `${API_BASE_URL}/user/verify-email`,
  
  // Company endpoints
  COMPANIES: `${API_BASE_URL}/company`,
  
  // System configuration endpoints
  CARGO_TYPES: `${API_BASE_URL}/cargotype`,
  VEHICLE_TYPES: `${API_BASE_URL}/vehicletype`,
  
  // Other endpoints
  VEHICLES: `${API_BASE_URL}/vehicle`,
  DRIVERS: `${API_BASE_URL}/driver`,
  ROUTES: `${API_BASE_URL}/route`,
  CONTRACTS: `${API_BASE_URL}/contract`,
  SHIPMENTS: `${API_BASE_URL}/shipment`,
  CARGO_TYPES: `${API_BASE_URL}/cargotype`,
  VEHICLE_TYPES: `${API_BASE_URL}/vehicletype`,
  LOCATIONS: `${API_BASE_URL}/location`,
  VEHICLE_MAINTENANCE: `${API_BASE_URL}/vehiclemaintenance`,
  ROUTE_PRICES: `${API_BASE_URL}/routeprice`,
  FORWARDER_OFFERS: `${API_BASE_URL}/forwarderoffer`,
  PAYMENTS: `${API_BASE_URL}/payment`,
  SHIPMENT_DOCUMENTS: `${API_BASE_URL}/shipmentdocument`,
  SHIPMENT_STATUS_HISTORY: `${API_BASE_URL}/shipmentstatushistory`,
  PICKUP_CHANGES: `${API_BASE_URL}/pickupchange`,
  DELAY_PENALTIES: `${API_BASE_URL}/delaypenalty`,
};

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Handle empty responses (204 No Content)
      if (response.status === 204) {
        return { success: true, data: null };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      return { success: false, error: error.message };
    }
  }

  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export const apiService = new ApiService();