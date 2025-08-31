import { authService } from "./authService";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://navigoapi-fgguf3fkh6b4fqg3.italynorth-01.azurewebsites.net/api";

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/auth/login`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  REFRESH: `${API_BASE_URL}/auth/refresh`,
  GOOGLE_LOGIN: `${API_BASE_URL}/auth/google-login`,
  REGISTER: `${API_BASE_URL}/User`,

  // User endpoints
  USERS: `${API_BASE_URL}/user`,
  SUPERADMIN: `${API_BASE_URL}/user/superadmin`,
  VERIFY_EMAIL: `${API_BASE_URL}/user/verify-email`,
  FORGOT_PASSWORD: `${API_BASE_URL}/user/forgot-password`,
  RESET_PASSWORD: `${API_BASE_URL}/user/reset-password`,

  // Company endpoints
  COMPANIES: `${API_BASE_URL}/company`,

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
    this.isRefreshing = false;
    this.pendingRequests = [];
  }

  getAuthHeaders() {
    const token = localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

async request(endpoint, options = {}, retry = true) {
  const url = `${this.baseURL}${endpoint}`;
  const { body, headers: customHeaders, ...rest } = options;

  let headers = { ...this.getAuthHeaders(), ...customHeaders };

  // Ne dodaj Content-Type ako šalješ FormData ili raw string
  if (body instanceof FormData) {
    delete headers["Content-Type"];
  } else if (typeof body === "string") {
    headers["Content-Type"] = "application/json";
  }

  const config = {
    headers,
    ...rest,
    body:
      body instanceof FormData || typeof body === "string"
        ? body
        : JSON.stringify(body),
  };

  try {
    const response = await fetch(url, config);

    // Ako je token istekao → pokušaj refresh
    if (response.status === 401 && retry) {
      console.warn("Access token expired. Attempting refresh...");

      if (!this.isRefreshing) {
        this.isRefreshing = true;

        const refreshResult = await authService.refreshAccessToken();

        this.isRefreshing = false;

        if (refreshResult.success) {
          // ponovo pokreni sve pending requeste
          this.pendingRequests.forEach(cb => cb());
          this.pendingRequests = [];

          // retry original request sa novim tokenom
          return this.request(endpoint, options, false);
        } else {
          authService.clearTokens();
          // reject sve pending requests ako refresh failuje
          this.pendingRequests.forEach(cb => cb());
          this.pendingRequests = [];
          return { success: false, message: "Session expired. Please login again." };
        }
      } else {
        // Ako refresh već traje → sačekaj
        return new Promise(resolve => {
          this.pendingRequests.push(() => {
            resolve(this.request(endpoint, options, false));
          });
        });
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      let errorMessage = "";

      if (errorData.message) {
        // Klasičan message
        errorMessage = errorData.message;
      } else if (errorData.errors) {
        // ASP.NET ValidationProblemDetails
        const fieldErrors = Object.entries(errorData.errors)
          .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
          .join(" | ");
        errorMessage = errorData.title
          ? `${errorData.title} - ${fieldErrors}`
          : fieldErrors;
      } else {
        // Fallback
        errorMessage = `HTTP error! status: ${response.status}`;
      }

      throw new Error(errorMessage);
    }

    if (response.status === 204) return { success: true, data: null };

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    return { success: false, message: error.message };
  }
}


  async get(endpoint) {
    return this.request(endpoint, { method: "GET" });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  }

  async upload(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      body: data,
    });
  }
}

export const apiService = new ApiService();
