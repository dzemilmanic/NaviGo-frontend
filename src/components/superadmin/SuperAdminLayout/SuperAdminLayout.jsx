import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Settings, 
  LogOut,
  Shield,
  Menu,
  X
} from 'lucide-react';
import './SuperAdminLayout.css';

const SuperAdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const navItems = [
    { to: '/superadmin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/superadmin/companies', icon: Building2, label: 'Companies' },
    { to: '/superadmin/users', icon: Users, label: 'Users' },
    { to: '/superadmin/system', icon: Settings, label: 'System Config' },
  ];

  return (
    <div className="super-admin-layout">
      {/* Mobile Menu Toggle */}
      <button 
        className="mobile-menu-toggle" 
        onClick={toggleSidebar}
        aria-label="Toggle navigation menu"
      >
        <Menu />
      </button>

      {/* Sidebar Overlay for Mobile */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Shield className="w-8 h-8 text-blue-600" />
            <div>
              <h1>NaviGo Admin</h1>
              <p>Super Administrator</p>
            </div>
          </div>
          
          {/* Close button for mobile */}
          <button 
            className="sidebar-close-btn"
            onClick={closeSidebar}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: 'var(--gray-400)',
              cursor: 'pointer',
              padding: 'var(--spacing-sm)',
              borderRadius: 'var(--radius-sm)',
              transition: 'color 0.2s ease'
            }}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
              onClick={closeSidebar}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <p>{user?.email}</p>
            <p>Super Admin</p>
          </div>
          <button
            onClick={handleLogout}
            className="logout-btn"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <main>
          <Outlet />
        </main>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .sidebar-close-btn {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SuperAdminLayout;