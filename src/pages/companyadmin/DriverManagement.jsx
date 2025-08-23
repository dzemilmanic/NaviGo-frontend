import React, { useState, useEffect } from 'react';
import { driverService } from '../../services/driverService';
import './DriverManagement.css';

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDriver, setNewDriver] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    licenseNumber: '',
    licenseExpiry: '',
    licenseCategories: '',
    hireDate: ''
  });

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    setLoading(true);
    try {
      const result = await driverService.getAll();
      if (result.success) {
        setDrivers(result.data || []);
      }
    } catch (error) {
      console.error('Error loading drivers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const result = await driverService.create(newDriver);
      if (result.success) {
        await loadDrivers();
        setShowCreateModal(false);
        setNewDriver({
          firstName: '',
          lastName: '',
          phoneNumber: '',
          licenseNumber: '',
          licenseExpiry: '',
          licenseCategories: '',
          hireDate: ''
        });
      }
    } catch (error) {
      console.error('Error creating driver:', error);
    }
  };

  const handleDelete = async (driverId) => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      try {
        const result = await driverService.delete(driverId);
        if (result.success) {
          await loadDrivers();
        }
      } catch (error) {
        console.error('Error deleting driver:', error);
      }
    }
  };

  const getStatusName = (status) => {
    switch (status) {
      case 0: return 'Available';
      case 1: return 'On Route';
      case 2: return 'Inactive';
      default: return 'Unknown';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 0: return 'status-available';
      case 1: return 'status-on-route';
      case 2: return 'status-inactive';
      default: return 'status-unknown';
    }
  };

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || driver.driverStatus.toString() === statusFilter;
    
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
    <div className="driver-management">
      <div className="page-header">
        <div>
          <h1>Driver Management</h1>
          <p>Manage your company's drivers</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary"
        >
          Add Driver
        </button>
      </div>

      <div className="filters-section">
        <div className="filters-grid">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search drivers..."
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
            <option value="0">Available</option>
            <option value="1">On Route</option>
            <option value="2">Inactive</option>
          </select>

          <div className="results-count">
            {filteredDrivers.length} drivers found
          </div>
        </div>
      </div>

      <div className="drivers-table">
        <table>
          <thead>
            <tr>
              <th>Driver</th>
              <th>License Number</th>
              <th>Categories</th>
              <th>Status</th>
              <th>Hire Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDrivers.map((driver) => (
              <tr key={driver.id}>
                <td>
                  <div className="driver-info">
                    <div className="driver-avatar">
                      {driver.firstName.charAt(0)}{driver.lastName.charAt(0)}
                    </div>
                    <div>
                      <div className="driver-name">
                        {driver.firstName} {driver.lastName}
                      </div>
                      <div className="driver-phone">{driver.phoneNumber}</div>
                    </div>
                  </div>
                </td>
                <td>{driver.licenseNumber}</td>
                <td>{driver.licenseCategories}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(driver.driverStatus)}`}>
                    {getStatusName(driver.driverStatus)}
                  </span>
                </td>
                <td>{new Date(driver.hireDate).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => {
                        setSelectedDriver(driver);
                        setShowModal(true);
                      }}
                      className="btn btn-secondary btn-sm"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(driver.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Driver Details Modal */}
      {showModal && selectedDriver && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Driver Details</h2>
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
                  <label>First Name</label>
                  <p>{selectedDriver.firstName}</p>
                </div>
                
                <div className="detail-group">
                  <label>Last Name</label>
                  <p>{selectedDriver.lastName}</p>
                </div>
                
                <div className="detail-group">
                  <label>Phone Number</label>
                  <p>{selectedDriver.phoneNumber}</p>
                </div>
                
                <div className="detail-group">
                  <label>License Number</label>
                  <p>{selectedDriver.licenseNumber}</p>
                </div>
                
                <div className="detail-group">
                  <label>License Categories</label>
                  <p>{selectedDriver.licenseCategories}</p>
                </div>
                
                <div className="detail-group">
                  <label>License Expiry</label>
                  <p>{new Date(selectedDriver.licenseExpiry).toLocaleDateString()}</p>
                </div>
                
                <div className="detail-group">
                  <label>Hire Date</label>
                  <p>{new Date(selectedDriver.hireDate).toLocaleDateString()}</p>
                </div>
                
                <div className="detail-group">
                  <label>Status</label>
                  <span className={`status-badge ${getStatusClass(selectedDriver.driverStatus)}`}>
                    {getStatusName(selectedDriver.driverStatus)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Driver Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Driver</h2>
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
                  <label>First Name</label>
                  <input
                    type="text"
                    required
                    value={newDriver.firstName}
                    onChange={(e) => setNewDriver({...newDriver, firstName: e.target.value})}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    required
                    value={newDriver.lastName}
                    onChange={(e) => setNewDriver({...newDriver, lastName: e.target.value})}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={newDriver.phoneNumber}
                    onChange={(e) => setNewDriver({...newDriver, phoneNumber: e.target.value})}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>License Number</label>
                  <input
                    type="text"
                    required
                    value={newDriver.licenseNumber}
                    onChange={(e) => setNewDriver({...newDriver, licenseNumber: e.target.value})}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>License Categories</label>
                  <input
                    type="text"
                    required
                    value={newDriver.licenseCategories}
                    onChange={(e) => setNewDriver({...newDriver, licenseCategories: e.target.value})}
                    className="form-input"
                    placeholder="e.g., B, C, D"
                  />
                </div>
                
                <div className="form-group">
                  <label>License Expiry</label>
                  <input
                    type="date"
                    required
                    value={newDriver.licenseExpiry}
                    onChange={(e) => setNewDriver({...newDriver, licenseExpiry: e.target.value})}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>Hire Date</label>
                  <input
                    type="date"
                    required
                    value={newDriver.hireDate}
                    onChange={(e) => setNewDriver({...newDriver, hireDate: e.target.value})}
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
                  Create Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverManagement;