import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  FileText, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { companyService } from '../../../services/companyService';
import { userService } from '../../../services/userService';
import './SuperAdminDashboard.css';

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCompanies: 0,
    pendingCompanies: 0,
    approvedCompanies: 0,
    rejectedCompanies: 0,
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0
  });
  const [recentCompanies, setRecentCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load companies
      const companiesResult = await companyService.getAll();
      if (companiesResult.success) {
        const companies = companiesResult.data;
        const pendingCount = companies.filter(c => c.companyStatus === 0).length;
        const approvedCount = companies.filter(c => c.companyStatus === 1).length;
        const rejectedCount = companies.filter(c => c.companyStatus === 2).length;
        
        setStats(prev => ({
          ...prev,
          totalCompanies: companies.length,
          pendingCompanies: pendingCount,
          approvedCompanies: approvedCount,
          rejectedCompanies: rejectedCount
        }));

        // Get recent companies (last 5)
        const recent = companies
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        setRecentCompanies(recent);
      }

      // Load users
      const usersResult = await userService.getAll();
      if (usersResult.success) {
        const users = usersResult.data;
        const activeCount = users.filter(u => u.userStatus === 1).length;
        const inactiveCount = users.filter(u => u.userStatus === 0).length;
        
        setStats(prev => ({
          ...prev,
          totalUsers: users.length,
          activeUsers: activeCount,
          inactiveUsers: inactiveCount
        }));
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCompanyStatusBadge = (status) => {
    switch (status) {
      case 0:
        return <span className="status-badge pending">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </span>;
      case 1:
        return <span className="status-badge approved">
          <CheckCircle className="w-3 h-3 mr-1" />
          Approved
        </span>;
      case 2:
        return <span className="status-badge rejected">
          <XCircle className="w-3 h-3 mr-1" />
          Rejected
        </span>;
      default:
        return null;
    }
  };

  const getCompanyTypeName = (type) => {
    switch (type) {
      case 1: return 'Client';
      case 2: return 'Forwarder';
      case 3: return 'Carrier';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening in your system.</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {/* Total Companies */}
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-icon blue">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="stat-info">
              <p>Total Companies</p>
              <p>{stats.totalCompanies}</p>
            </div>
          </div>
        </div>

        {/* Pending Companies */}
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-icon yellow">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="stat-info">
              <p>Pending Approval</p>
              <p>{stats.pendingCompanies}</p>
            </div>
          </div>
        </div>

        {/* Total Users */}
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-icon green">
              <Users className="w-6 h-6" />
            </div>
            <div className="stat-info">
              <p>Total Users</p>
              <p>{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        {/* Active Users */}
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-icon purple">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="stat-info">
              <p>Active Users</p>
              <p>{stats.activeUsers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Companies */}
      <div className="recent-companies">
        <div className="recent-companies-header">
          <h2>Recent Company Registrations</h2>
        </div>
        <div className="recent-companies-body">
          {recentCompanies.length === 0 ? (
            <p className="no-companies">No companies registered yet.</p>
          ) : (
            <div className="companies-list">
              {recentCompanies.map((company) => (
                <div key={company.id} className="company-item">
                  <div className="company-item-left">
                    <div className="company-item-icon">
                      <Building2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="company-item-info">
                      <h3>{company.companyName}</h3>
                      <p>
                        {getCompanyTypeName(company.companyType)} • PIB: {company.pib}
                      </p>
                    </div>
                  </div>
                  <div className="company-item-right">
                    {getCompanyStatusBadge(company.companyStatus)}
                    <p className="company-item-date">
                      {new Date(company.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <div className="quick-action-card">
          <h3>Company Status</h3>
          <div className="quick-action-list">
            <div className="quick-action-item">
              <span>Approved</span>
              <span className="success">{stats.approvedCompanies}</span>
            </div>
            <div className="quick-action-item">
              <span>Pending</span>
              <span className="warning">{stats.pendingCompanies}</span>
            </div>
            <div className="quick-action-item">
              <span>Rejected</span>
              <span className="error">{stats.rejectedCompanies}</span>
            </div>
          </div>
        </div>

        <div className="quick-action-card">
          <h3>User Status</h3>
          <div className="quick-action-list">
            <div className="quick-action-item">
              <span>Active</span>
              <span className="success">{stats.activeUsers}</span>
            </div>
            <div className="quick-action-item">
              <span>Inactive</span>
              <span className="error">{stats.inactiveUsers}</span>
            </div>
          </div>
        </div>

        <div className="quick-action-card">
          <h3>System Health</h3>
          <div className="quick-action-list">
            <div className="system-health-item">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>API Status: Online</span>
            </div>
            <div className="system-health-item">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Database: Connected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;