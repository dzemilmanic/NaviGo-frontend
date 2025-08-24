import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Users, 
  Package, 
  FileText, 
  MapPin, 
  DollarSign,
  TrendingUp,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity
} from 'lucide-react';
import { vehicleService } from '../../services/vehicleService';
import { driverService } from '../../services/driverService';
import { shipmentService } from '../../services/shipmentService';
import { contractService } from '../../services/contractService';
import { routeService } from '../../services/routeService';
import { vehicleMaintenanceService } from '../../services/vehicleMaintenanceService';
import './CompanyAdminDashboard.css';

const CompanyAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    availableVehicles: 0,
    vehiclesInService: 0,
    totalDrivers: 0,
    availableDrivers: 0,
    driversOnRoute: 0,
    activeShipments: 0,
    completedShipments: 0,
    pendingShipments: 0,
    activeContracts: 0,
    totalRoutes: 0,
    maintenancesDue: 0
  });
  
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingMaintenances, setUpcomingMaintenances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load all data in parallel
      const [
        vehiclesResult,
        driversResult,
        shipmentsResult,
        contractsResult,
        routesResult,
        maintenanceResult
      ] = await Promise.all([
        vehicleService.getAll(),
        driverService.getAll(),
        shipmentService.getAll(),
        contractService.getAll(),
        routeService.getAll(),
        vehicleMaintenanceService.getAll()
      ]);

      // Process vehicles data
      if (vehiclesResult.success) {
        const vehicles = vehiclesResult.data || [];
        const availableCount = vehicles.filter(v => v.vehicleStatus === 0).length;
        const inServiceCount = vehicles.filter(v => v.vehicleStatus === 2).length;
        
        setStats(prev => ({
          ...prev,
          totalVehicles: vehicles.length,
          availableVehicles: availableCount,
          vehiclesInService: inServiceCount
        }));
      }

      // Process drivers data
      if (driversResult.success) {
        const drivers = driversResult.data || [];
        const availableCount = drivers.filter(d => d.driverStatus === 0).length;
        const onRouteCount = drivers.filter(d => d.driverStatus === 1).length;
        
        setStats(prev => ({
          ...prev,
          totalDrivers: drivers.length,
          availableDrivers: availableCount,
          driversOnRoute: onRouteCount
        }));
      }

      // Process shipments data
      if (shipmentsResult.success) {
        const shipments = shipmentsResult.data || [];
        const activeCount = shipments.filter(s => s.shipmentStatus === 1).length;
        const completedCount = shipments.filter(s => s.shipmentStatus === 2).length;
        const pendingCount = shipments.filter(s => s.shipmentStatus === 0).length;
        
        setStats(prev => ({
          ...prev,
          activeShipments: activeCount,
          completedShipments: completedCount,
          pendingShipments: pendingCount
        }));
      }

      // Process contracts data
      if (contractsResult.success) {
        const contracts = contractsResult.data || [];
        const activeCount = contracts.filter(c => c.contractStatus === 1).length;
        
        setStats(prev => ({
          ...prev,
          activeContracts: activeCount
        }));
      }

      // Process routes data
      if (routesResult.success) {
        const routes = routesResult.data || [];
        setStats(prev => ({
          ...prev,
          totalRoutes: routes.length
        }));
      }

      // Process maintenance data
      if (maintenanceResult.success) {
        const maintenances = maintenanceResult.data || [];
        const now = new Date();
        const upcomingCount = maintenances.filter(m => {
          const maintenanceDate = new Date(m.scheduledDate);
          const daysDiff = (maintenanceDate - now) / (1000 * 60 * 60 * 24);
          return daysDiff <= 7 && daysDiff >= 0;
        }).length;
        
        setStats(prev => ({
          ...prev,
          maintenancesDue: upcomingCount
        }));

        // Set upcoming maintenances
        const upcoming = maintenances
          .filter(m => {
            const maintenanceDate = new Date(m.scheduledDate);
            return maintenanceDate > now;
          })
          .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
          .slice(0, 5);
        
        setUpcomingMaintenances(upcoming);
      }

      // Generate recent activities (mock data based on real data)
      generateRecentActivities();

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateRecentActivities = () => {
    const activities = [
      {
        id: 1,
        type: 'shipment',
        icon: Package,
        message: 'New shipment created and assigned to route',
        time: '2 hours ago',
        status: 'success'
      },
      {
        id: 2,
        type: 'vehicle',
        icon: Truck,
        message: 'Vehicle maintenance completed successfully',
        time: '4 hours ago',
        status: 'success'
      },
      {
        id: 3,
        type: 'driver',
        icon: Users,
        message: 'Driver assigned to new delivery route',
        time: '6 hours ago',
        status: 'info'
      },
      {
        id: 4,
        type: 'contract',
        icon: FileText,
        message: 'New contract signed with client',
        time: '1 day ago',
        status: 'success'
      },
      {
        id: 5,
        type: 'maintenance',
        icon: AlertTriangle,
        message: 'Vehicle maintenance scheduled for next week',
        time: '2 days ago',
        status: 'warning'
      }
    ];
    
    setRecentActivities(activities);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <AlertTriangle className="error-icon" />
        <h2>Error Loading Dashboard</h2>
        <p>{error}</p>
        <button onClick={loadDashboardData} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="company-admin-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Company Dashboard</h1>
          <p>Welcome back! Here's what's happening in your company.</p>
        </div>
        <div className="header-actions">
          <button onClick={loadDashboardData} className="refresh-btn">
            <Activity className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card vehicles">
          <div className="stat-header">
            <div className="stat-icon">
              <Truck className="w-6 h-6" />
            </div>
            <div className="stat-trend positive">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="stat-content">
            <h3>Vehicles</h3>
            <div className="stat-number">{stats.totalVehicles}</div>
            <div className="stat-details">
              <span className="stat-detail available">
                {stats.availableVehicles} available
              </span>
              <span className="stat-detail in-service">
                {stats.vehiclesInService} in service
              </span>
            </div>
          </div>
        </div>

        <div className="stat-card drivers">
          <div className="stat-header">
            <div className="stat-icon">
              <Users className="w-6 h-6" />
            </div>
            <div className="stat-trend positive">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="stat-content">
            <h3>Drivers</h3>
            <div className="stat-number">{stats.totalDrivers}</div>
            <div className="stat-details">
              <span className="stat-detail available">
                {stats.availableDrivers} available
              </span>
              <span className="stat-detail on-route">
                {stats.driversOnRoute} on route
              </span>
            </div>
          </div>
        </div>

        <div className="stat-card shipments">
          <div className="stat-header">
            <div className="stat-icon">
              <Package className="w-6 h-6" />
            </div>
            <div className="stat-trend positive">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="stat-content">
            <h3>Shipments</h3>
            <div className="stat-number">{stats.activeShipments}</div>
            <div className="stat-details">
              <span className="stat-detail pending">
                {stats.pendingShipments} pending
              </span>
              <span className="stat-detail completed">
                {stats.completedShipments} completed
              </span>
            </div>
          </div>
        </div>

        <div className="stat-card contracts">
          <div className="stat-header">
            <div className="stat-icon">
              <FileText className="w-6 h-6" />
            </div>
            <div className="stat-trend positive">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="stat-content">
            <h3>Active Contracts</h3>
            <div className="stat-number">{stats.activeContracts}</div>
            <div className="stat-details">
              <span className="stat-detail">
                Currently running
              </span>
            </div>
          </div>
        </div>

        <div className="stat-card routes">
          <div className="stat-header">
            <div className="stat-icon">
              <MapPin className="w-6 h-6" />
            </div>
          </div>
          <div className="stat-content">
            <h3>Total Routes</h3>
            <div className="stat-number">{stats.totalRoutes}</div>
            <div className="stat-details">
              <span className="stat-detail">
                Available routes
              </span>
            </div>
          </div>
        </div>

        <div className="stat-card maintenance">
          <div className="stat-header">
            <div className="stat-icon">
              <AlertTriangle className="w-6 h-6" />
            </div>
            {stats.maintenancesDue > 0 && (
              <div className="stat-trend warning">
                <Clock className="w-4 h-4" />
              </div>
            )}
          </div>
          <div className="stat-content">
            <h3>Maintenance Due</h3>
            <div className="stat-number">{stats.maintenancesDue}</div>
            <div className="stat-details">
              <span className="stat-detail warning">
                Next 7 days
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-content">
        <div className="dashboard-left">
          {/* Recent Activities */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Activities</h2>
              <button className="view-all-btn">View All</button>
            </div>
            <div className="activities-list">
              {recentActivities.map((activity) => (
                <div key={activity.id} className={`activity-item ${activity.status}`}>
                  <div className="activity-icon">
                    <activity.icon className="w-5 h-5" />
                  </div>
                  <div className="activity-content">
                    <p className="activity-message">{activity.message}</p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                  <div className={`activity-status ${activity.status}`}>
                    {activity.status === 'success' && <CheckCircle className="w-4 h-4" />}
                    {activity.status === 'warning' && <AlertTriangle className="w-4 h-4" />}
                    {activity.status === 'info' && <Clock className="w-4 h-4" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Quick Actions</h2>
            </div>
            <div className="quick-actions-grid">
              <button className="action-btn vehicles">
                <Truck className="w-6 h-6" />
                <span>Add Vehicle</span>
              </button>
              <button className="action-btn drivers">
                <Users className="w-6 h-6" />
                <span>Add Driver</span>
              </button>
              <button className="action-btn routes">
                <MapPin className="w-6 h-6" />
                <span>Create Route</span>
              </button>
              <button className="action-btn contracts">
                <FileText className="w-6 h-6" />
                <span>New Contract</span>
              </button>
              <button className="action-btn shipments">
                <Package className="w-6 h-6" />
                <span>New Shipment</span>
              </button>
              <button className="action-btn maintenance">
                <Calendar className="w-6 h-6" />
                <span>Schedule Maintenance</span>
              </button>
            </div>
          </div>
        </div>

        <div className="dashboard-right">
          {/* Upcoming Maintenances */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Upcoming Maintenances</h2>
              <button className="view-all-btn">View All</button>
            </div>
            <div className="maintenance-list">
              {upcomingMaintenances.length > 0 ? (
                upcomingMaintenances.map((maintenance) => (
                  <div key={maintenance.id} className="maintenance-item">
                    <div className="maintenance-icon">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div className="maintenance-content">
                      <p className="maintenance-type">{maintenance.maintenanceType}</p>
                      <p className="maintenance-vehicle">Vehicle ID: {maintenance.vehicleId}</p>
                      <span className="maintenance-date">
                        {new Date(maintenance.scheduledDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-maintenance">
                  <CheckCircle className="w-8 h-8" />
                  <p>No upcoming maintenances</p>
                </div>
              )}
            </div>
          </div>

          {/* Performance Overview */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Performance Overview</h2>
            </div>
            <div className="performance-metrics">
              <div className="metric-item">
                <div className="metric-label">Fleet Utilization</div>
                <div className="metric-value">
                  {stats.totalVehicles > 0 
                    ? Math.round(((stats.totalVehicles - stats.availableVehicles) / stats.totalVehicles) * 100)
                    : 0}%
                </div>
                <div className="metric-bar">
                  <div 
                    className="metric-fill" 
                    style={{ 
                      width: `${stats.totalVehicles > 0 
                        ? ((stats.totalVehicles - stats.availableVehicles) / stats.totalVehicles) * 100
                        : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="metric-item">
                <div className="metric-label">Driver Utilization</div>
                <div className="metric-value">
                  {stats.totalDrivers > 0 
                    ? Math.round(((stats.totalDrivers - stats.availableDrivers) / stats.totalDrivers) * 100)
                    : 0}%
                </div>
                <div className="metric-bar">
                  <div 
                    className="metric-fill" 
                    style={{ 
                      width: `${stats.totalDrivers > 0 
                        ? ((stats.totalDrivers - stats.availableDrivers) / stats.totalDrivers) * 100
                        : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="metric-item">
                <div className="metric-label">Shipment Completion</div>
                <div className="metric-value">
                  {(stats.activeShipments + stats.completedShipments + stats.pendingShipments) > 0 
                    ? Math.round((stats.completedShipments / (stats.activeShipments + stats.completedShipments + stats.pendingShipments)) * 100)
                    : 0}%
                </div>
                <div className="metric-bar">
                  <div 
                    className="metric-fill" 
                    style={{ 
                      width: `${(stats.activeShipments + stats.completedShipments + stats.pendingShipments) > 0 
                        ? (stats.completedShipments / (stats.activeShipments + stats.completedShipments + stats.pendingShipments)) * 100
                        : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyAdminDashboard;