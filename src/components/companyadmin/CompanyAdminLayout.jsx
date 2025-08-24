import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut } from 'lucide-react';
import './CompanyAdminLayout.css';

const CompanyAdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/company-admin', label: 'Dashboard', end: true },
    { to: '/company-admin/company', label: 'Company Profile' },
    { to: '/company-admin/vehicles', label: 'Vehicles' },
    { to: '/company-admin/drivers', label: 'Drivers' },
    { to: '/company-admin/routes', label: 'Routes' },
    { to: '/company-admin/shipments', label: 'Shipments' },
    { to: '/company-admin/contracts', label: 'Contracts' },
    { to: '/company-admin/maintenance', label: 'Maintenance' },
  ];

  return (
    <div className="company-admin-layout">
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🚛</span>
            <div>
              <h1>NaviGo Admin</h1>
              <p>Company Administrator</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <p className="user-email">{user?.email}</p>
            <p className="user-role">Company Admin</p>
          </div>
          <button onClick={handleLogout} className="logout-btn" title="Logout">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default CompanyAdminLayout;