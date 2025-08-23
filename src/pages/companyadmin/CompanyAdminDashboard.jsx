import React, { useState, useEffect } from 'react';
import { vehicleService } from '../../services/vehicleService';
import { driverService } from '../../services/driverService';
import { shipmentService } from '../../services/shipmentService';
import { contractService } from '../../services/contractService';
import './CompanyAdminDashboard.css';

const CompanyAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    availableVehicles: 0,
    totalDrivers: 0,
    availableDrivers: 0,
    activeShipments: 0,
    activeContracts: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load vehicles
      const vehiclesResult = await vehicleService.getAll();
      if (vehiclesResult.success) {
        const vehicles = vehiclesResult.data || [];
        const availableCount = vehicles.filter(v => v.vehicleStatus === 0).length;
        setStats(prev => ({
          ...prev,
          totalVehicles: vehicles.length,
          availableVehicles: availableCount
        }));
      }

      // Load drivers
      const driversResult = await driverService.getAll();
      if (driversResult.success) {
        const drivers = driversResult.data || [];
        const availableCount = drivers.filter(d => d.driverStatus === 0).length;
        setStats(prev => ({
          ...prev,
          totalDrivers: drivers.length,
          availableDrivers: availableCount
        }));
      }

      // Load shipments
      const shipmentsResult = await shipmentService.getAll();
      if (shipmentsResult.success) {
        const shipments = shipmentsResult.data || [];
        const activeCount = shipments.filter(s => s.shipmentStatus === 1).length;
        setStats(prev => ({
          ...prev,
          activeShipments: activeCount
        }));
      }

      // Load contracts
      const contractsResult = await contractService.getAll();
      if (contractsResult.success) {
        const contracts = contractsResult.data || [];
        const activeCount = contracts.filter(c => c.contractStatus === 1).length;
        setStats(prev => ({
          ...prev,
          activeContracts: activeCount
        }));
      }

      // Mock recent activities
      setRecentActivities([
        { id: 1, type: 'vehicle', message: 'Vehicle ABC-123 completed maintenance', time: '2 hours ago' },
        { id: 2, type: 'shipment', message: 'New shipment created for Route Belgrade-Novi Sad', time: '4 hours ago' },
        { id: 3, type: 'driver', message: 'Driver John Doe assigned to new route', time: '6 hours ago' },
        { id: 4, type: 'contract', message: 'Contract #12345 signed with Client XYZ', time: '1 day ago' }
      ]);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="company-admin-dashboard">
      <div className="dashboard-header">
        <h1>Company Dashboard</h1>
        <p>Welcome back! Here's what's happening in your company.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon vehicles">🚛</div>
          <div className="stat-content">
            <h3>Vehicles</h3>
            <div className="stat-number">{stats.totalVehicles}</div>
            <div className="stat-detail">{stats.availableVehicles} available</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon drivers">👨‍💼</div>
          <div className="stat-content">
            <h3>Drivers</h3>
            <div className="stat-number">{stats.totalDrivers}</div>
            <div className="stat-detail">{stats.availableDrivers} available</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon shipments">📦</div>
          <div className="stat-content">
            <h3>Active Shipments</h3>
            <div className="stat-number">{stats.activeShipments}</div>
            <div className="stat-detail">In transit</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon contracts">📋</div>
          <div className="stat-content">
            <h3>Active Contracts</h3>
            <div className="stat-number">{stats.activeContracts}</div>
            <div className="stat-detail">Currently running</div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="recent-activities">
          <h2>Recent Activities</h2>
          <div className="activities-list">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className={`activity-icon ${activity.type}`}>
                  {activity.type === 'vehicle' && '🚛'}
                  {activity.type === 'shipment' && '📦'}
                  {activity.type === 'driver' && '👨‍💼'}
                  {activity.type === 'contract' && '📋'}
                </div>
                <div className="activity-content">
                  <p className="activity-message">{activity.message}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <button className="action-btn">
              <span className="action-icon">➕</span>
              Add Vehicle
            </button>
            <button className="action-btn">
              <span className="action-icon">👤</span>
              Add Driver
            </button>
            <button className="action-btn">
              <span className="action-icon">🛣️</span>
              Create Route
            </button>
            <button className="action-btn">
              <span className="action-icon">📄</span>
              New Contract
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyAdminDashboard;