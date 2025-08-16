// Service za komunikaciju sa .NET API-jem
const API_BASE_URL = import.meta.env.REACT_APP_API_BASE_URL || 'https://localhost:7000/api';

class VehicleService {
  async getVehicleTypes() {
    try {
      const response = await fetch(`${API_BASE_URL}/vehicletypes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Greška pri dohvatanju tipova vozila');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching vehicle types:', error);
      throw error;
    }
  }

  async getLocations() {
    try {
      const response = await fetch(`${API_BASE_URL}/locations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Greška pri dohvatanju lokacija');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching locations:', error);
      throw error;
    }
  }

  async createVehicle(vehicleDto) {
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(vehicleDto)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Greška pri kreiranju vozila');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating vehicle:', error);
      throw error;
    }
  }

  async getCompanyVehicles(companyId) {
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles/company/${companyId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Greška pri dohvatanju vozila kompanije');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching company vehicles:', error);
      throw error;
    }
  }
}

export default new VehicleService();