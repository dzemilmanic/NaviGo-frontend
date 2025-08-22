import React, { useState, useEffect } from 'react';
import { vehicleService } from '../../services/vehicleService';
import './VehicleManagement.css';

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    brand: '',
    model: '',
    registrationNumber: '',
    capacityKg: '',
    manufactureYear: '',
    vehicleTypeId: '',
    engineCapacityCc: '',
    categories: ''
  });

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const result = await vehicleService.getAll();
      if (result.success) {
        setVehicles(result.data);
      }
    } catch (error) {
      console.error('Error loading vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const result = await vehicleService.create(newVehicle);
      if (result.success) {
        await loadVehicles();
        setShowCreateModal(false);
        setNewVehicle({
          brand: '',
          model: '',
          registrationNumber: '',
          capacityKg: '',
          manufactureYear: '',
          vehicleTypeId: '',
          engineCapacityCc: '',
          categories: ''
        });
      }
    } catch (error) {
      console.error('Error creating vehicle:', error);
    }
  };

  const handleDelete = async (vehicleId) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        const result = await vehicleService.delete(vehicleId);
        if (result.success) {
          await loadVehicles();
        }
      } catch (error) {
        console.error('Error deleting vehicle:', error);
      }
    }
  };

  const getStatusName = (status) => {
    switch (status) {
      case 0: return 'Free';
      case 1: return 'On Route';
      case 2: return 'In Service';
      case 3: return 'Unavailable';
      default: return 'Unknown';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 0: return 'status-free';
      case 1: return 'status-on-route';
      case 2: return 'status-in-service';
      case 3: return 'status-unavailable';
      default: return 'status-unknown';
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || vehicle.vehicleStatus.toString() === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="vehicle-management">
      <div className="page-header">
        <div>
          <h1>Vehicle Management</h1>
          <p>Manage your company's vehicle fleet</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary"
        >
          Add Vehicle
        </button>
      </div>

      <div className="filters-section">
        <div className="filters-grid">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Statuses</option>
            <option value="0">Free</option>
            <option value="1">On Route</option>
            <option value="2">In Service</option>
            <option value="3">Unavailable</option>
          </select>

          <div className="results-count">
            {filteredVehicles.length} vehicles found
          </div>
        </div>
      </div>

      <div className="vehicles-grid">
        {filteredVehicles.map((vehicle) => (
          <div key={vehicle.id} className="vehicle-card">
            <div className="vehicle-header">
              <h3>{vehicle.brand} {vehicle.model}</h3>
              <span className={`status-badge ${getStatusClass(vehicle.vehicleStatus)}`}>
                {getStatusName(vehicle.vehicleStatus)}
              </span>
            </div>
            
            <div className="vehicle-details">
              <div className="detail-item">
                <span className="label">Registration:</span>
                <span className="value">{vehicle.registrationNumber}</span>
              </div>
              <div className="detail-item">
                <span className="label">Capacity:</span>
                <span className="value">{vehicle.capacityKg} kg</span>
              </div>
              <div className="detail-item">
                <span className="label">Year:</span>
                <span className="value">{vehicle.manufactureYear}</span>
              </div>
            </div>

            <div className="vehicle-actions">
              <button
                onClick={() => {
                  setSelectedVehicle(vehicle);
                  setShowModal(true);
                }}
                className="btn btn-secondary"
              >
                View Details
              </button>
              <button
                onClick={() => handleDelete(vehicle.id)}
                className="btn btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Vehicle Details Modal */}
      {showModal && selectedVehicle && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Vehicle Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            
            <div className="modal-content">
              <div className="details-grid">
                <div className="detail-group">
                  <label>Brand</label>
                  <p>{selectedVehicle.brand}</p>
                </div>
                
                <div className="detail-group">
                  <label>Model</label>
                  <p>{selectedVehicle.model}</p>
                </div>
                
                <div className="detail-group">
                  <label>Registration Number</label>
                  <p>{selectedVehicle.registrationNumber}</p>
                </div>
                
                <div className="detail-group">
                  <label>Capacity</label>
                  <p>{selectedVehicle.capacityKg} kg</p>
                </div>
                
                <div className="detail-group">
                  <label>Manufacture Year</label>
                  <p>{selectedVehicle.manufactureYear}</p>
                </div>
                
                <div className="detail-group">
                  <label>Engine Capacity</label>
                  <p>{selectedVehicle.engineCapacityCc} cc</p>
                </div>
                
                <div className="detail-group">
                  <label>Status</label>
                  <span className={`status-badge ${getStatusClass(selectedVehicle.vehicleStatus)}`}>
                    {getStatusName(selectedVehicle.vehicleStatus)}
                  </span>
                </div>
                
                {selectedVehicle.categories && (
                  <div className="detail-group">
                    <label>Categories</label>
                    <p>{selectedVehicle.categories}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Vehicle Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Vehicle</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="modal-content">
              <div className="form-grid">
                <div className="form-group">
                  <label>Brand</label>
                  <input
                    type="text"
                    required
                    value={newVehicle.brand}
                    onChange={(e) => setNewVehicle({...newVehicle, brand: e.target.value})}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>Model</label>
                  <input
                    type="text"
                    required
                    value={newVehicle.model}
                    onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>Registration Number</label>
                  <input
                    type="text"
                    required
                    value={newVehicle.registrationNumber}
                    onChange={(e) => setNewVehicle({...newVehicle, registrationNumber: e.target.value})}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>Capacity (kg)</label>
                  <input
                    type="number"
                    required
                    value={newVehicle.capacityKg}
                    onChange={(e) => setNewVehicle({...newVehicle, capacityKg: e.target.value})}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>Manufacture Year</label>
                  <input
                    type="number"
                    required
                    value={newVehicle.manufactureYear}
                    onChange={(e) => setNewVehicle({...newVehicle, manufactureYear: e.target.value})}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>Engine Capacity (cc)</label>
                  <input
                    type="number"
                    required
                    value={newVehicle.engineCapacityCc}
                    onChange={(e) => setNewVehicle({...newVehicle, engineCapacityCc: e.target.value})}
                    className="form-input"
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Create Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleManagement; 