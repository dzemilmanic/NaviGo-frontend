import { useState, useEffect } from "react";
import "../Dashboards.css";
import ShipmentManagement from "../../../components/Managements/ShipmentManagement";
import PaymentManagement from "../../../components/Managements/PaymentManagement";
import PickupChangeManagement from "../../../components/Managements/PickupChangeManagement";
import ContractManagement from "../../../components/Managements/ContractManagement";
import {
  LogOut,
  Menu,
  X,
  Package,
  CreditCard,
  CalendarClock,
  FileText,
  User,
  Map,
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Profile from "../../../components/Profile/Profile";
import Loader from "../../../components/Loader/Loader";
import { toast } from "react-toastify";
const RegularUserDashboard = () => {
  const [activeComponent, setActiveComponent] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!user) navigate("/");
  }, [user]);

  // Enhanced dashboard configuration with icons
  const dashboardConfig = {
    sidebarButtons: [
      { name: "Shipments", icon: Package, component: <ShipmentManagement /> },
      { name: "Payments", icon: CreditCard, component: <PaymentManagement /> },
      {
        name: "Pickup Changes",
        icon: CalendarClock,
        component: <PickupChangeManagement />,
      },
      { name: "Contracts", icon: FileText, component: <ContractManagement /> },
      { name: "Profile", icon: User, component: <Profile user={user} /> },
    ],
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
    const currentConfig = sidebarButtons.find(
      (btn) => btn.name === activeComponent
    );
    return currentConfig ? (
      currentConfig.component
    ) : (
      <p className="empty-state">Select an option from the sidebar.</p>
    );
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await logout();
      if (!response.success) {
        toast.error(response.message);
      }
      toast.success(response.message);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSidebarOpen(false);
      setLoading(false);
    }
  };
  if (loading) {
    return <Loader />;
  }
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
          className={`sidebar-overlay ${isSidebarOpen ? "open" : ""}`}
          onClick={closeSidebar}
        />
      )}

      {/* Enhanced Sidebar */}
      <aside className={`dashboard-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="flex items-center gap-2 mb-1">
            <User size={20} className="text-blue-600" />
            <h2 className="sidebar-title">User Dashboard</h2>
          </div>
          <p className="sidebar-subtitle">Personal Panel</p>
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
          onClick={() => navigate("/routes")}
          aria-label="Logout"
        >
          <Map className="menu-icon" />
          <span>Route Map</span>
        </button>
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
            <span className="user-greeting">
              Welcome back, {user?.firstName || "User"}
            </span>
          </div>
        </div>

        <div className="main-content">{getCurrentComponent()}</div>
      </main>
    </div>
  );
};

export default RegularUserDashboard;
