import { useEffect, useState } from "react";
import "../Dashboards.css";

import CargoTypeManagement from "../../../components/Managements/CargoTypeManagement";
import VehicleTypeManagement from "../../../components/Managements/VehicleTypeManagement";
import UserManagement from "../../../components/Managements/UserManagement";
import CompanyManagement from "../../../components/Managements/CompanyManagement";

import { LogOut, Menu, X, Users, Building2, Package, Truck } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const SuperAdminDashboard = () => {
  const [activeComponent, setActiveComponent] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) navigate("/");
  }, [user]);

  // Enhanced dashboard configuration with icons
  const dashboardConfig = {
    sidebarButtons: [
      { name: "Users", icon: Users, component: <UserManagement /> },
      { name: "Companies", icon: Building2, component: <CompanyManagement /> },
      { name: "Cargo Types", icon: Package, component: <CargoTypeManagement /> },
      { name: "Vehicle Types", icon: Truck, component: <VehicleTypeManagement /> }
    ]
  };

  const { sidebarButtons = [] } = dashboardConfig;

  // Set default active component
  useEffect(() => {
    if (!activeComponent && sidebarButtons.length > 0) {
      setActiveComponent(sidebarButtons[0].name);
    }
  }, [sidebarButtons, activeComponent]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleMenuItemClick = (buttonName) => {
    setActiveComponent(buttonName);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const getCurrentComponent = () => {
    const currentConfig = sidebarButtons.find(btn => btn.name === activeComponent);
    return currentConfig ? currentConfig.component : <p className="empty-state">Select an option from the sidebar.</p>;
  };

  const handleLogout = () => {
    logout();
    setIsSidebarOpen(false);
  };

  return (
    <div className="dashboard-container">
      {/* Mobile Toggle Button */}
      <button 
        className="mobile-toggle"
        onClick={toggleSidebar}
        aria-label="Toggle navigation menu"
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`}
          onClick={closeSidebar}
        />
      )}

      {/* Enhanced Sidebar */}
      <aside className={`dashboard-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">Admin Panel</h2>
          <p className="sidebar-subtitle">Super Admin Dashboard</p>
        </div>

        <nav className="sidebar-nav">
          {sidebarButtons.map((btn) => {
            const IconComponent = btn.icon;
            return (
              <button
                key={btn.name}
                className={activeComponent === btn.name ? "active" : ""}
                onClick={() => handleMenuItemClick(btn.name)}
                aria-label={`Navigate to ${btn.name}`}
              >
                <IconComponent size={18} className="menu-icon" />
                <span>{btn.name}</span>
              </button>
            );
          })}
        </nav>

        <button 
          className="logout-button" 
          onClick={handleLogout}
          aria-label="Logout"
        >
          <LogOut className="logout-icon" />
          <span>Logout</span>
        </button>
      </aside>

      {/* Enhanced Main Content */}
      <main className="dashboard-main">
        <div className="main-header">
          <div className="breadcrumb">
            <span className="breadcrumb-home">Dashboard</span>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">{activeComponent}</span>
          </div>
          <div className="user-info">
            <span className="user-greeting">Welcome back, {user?.firstName || 'Admin'}</span>
          </div>
        </div>
        
        <div className="main-content">
          {getCurrentComponent()}
        </div>
      </main>
    </div>
  );
};

export default SuperAdminDashboard;