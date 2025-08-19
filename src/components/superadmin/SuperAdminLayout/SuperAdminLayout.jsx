import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Settings, 
  LogOut,
  Shield
} from 'lucide-react';
import './SuperAdminLayout.css';

const SuperAdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/superadmin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/superadmin/companies', icon: Building2, label: 'Companies' },
    { to: '/superadmin/users', icon: Users, label: 'Users' },
    { to: '/superadmin/system', icon: Settings, label: 'System Config' },
  ];

  return (
    <div className="super-admin-layout">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Shield className="w-8 h-8 text-blue-600" />
            <div>
              <h1>NaviGo Admin</h1>
              <p>Super Administrator</p>
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
                `nav-link ${isActive ? 'active' : ''}`
              }
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
    </div>
  );
};

export default SuperAdminLayout;