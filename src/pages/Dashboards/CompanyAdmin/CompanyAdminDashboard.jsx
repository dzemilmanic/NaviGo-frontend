import { useEffect, useState } from "react";
import "../Dashboards.css";

import VehicleManagement from "../../../components/Managements/VehicleManagement";
import DriverManagement from "../../../components/Managements/DriverManagement";
import RouteManagement from "../../../components/Managements/RouteManagement";
import RoutePriceManagement from "../../../components/Managements/RoutePriceManagement";
import ForwarderOfferManagement from "../../../components/Managements/ForwarderOfferManagement";
import ContractManagement from "../../../components/Managements/ContractManagement";
import ShipmentManagement from "../../../components/Managements/ShipmentManagement";
import PaymentManagement from "../../../components/Managements/PaymentManagement";
import PickupChangeManagement from "../../../components/Managements/PickupChangeManagement";
import ShipmentDocumentManagement from "../../../components/Managements/ShipmentDocumentManagement";
import VehicleMaintenanceManagement from "../../../components/Managements/VehicleMaintenanceManagement";
import ShipmentStatusHistoryManagement from "../../../components/Managements/ShipmentStatusHistoryManagement";
import CarrierStats from "../../../components/Stats/CarrierStats";
import Profile from "../../../components/Profile/Profile";
import {
  LogOut,
  Menu,
  X,
  Truck,
  Wrench,
  Package,
  Clock,
  UserCheck,
  Route,
  DollarSign,
  Handshake,
  FileText,
  CreditCard,
  CalendarClock,
  Building2,
  User,
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const CompanyAdminDashboard = ({ companyType }) => {
  const [activeComponent, setActiveComponent] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) navigate("/");
  }, [user]);

  // Enhanced dashboard configuration with icons
  const dashboardConfig = {
    Carrier: {
      sidebarButtons: [
        {
          name: "Carrier Stats",
          icon: CalendarClock,
          component: <CarrierStats />,
        },
        { name: "Vehicles", icon: Truck, component: <VehicleManagement /> },
        {
          name: "Vehicle Maintenances",
          icon: Wrench,
          component: <VehicleMaintenanceManagement />,
        },
        { name: "Shipments", icon: Package, component: <ShipmentManagement /> },
        {
          name: "Shipment Status Histories",
          icon: Clock,
          component: <ShipmentStatusHistoryManagement />,
        },
        { name: "Drivers", icon: UserCheck, component: <DriverManagement /> },
        { name: "Routes", icon: Route, component: <RouteManagement /> },
        {
          name: "Route Prices",
          icon: DollarSign,
          component: <RoutePriceManagement />,
        },
        {
          name: "Payments",
          icon: CreditCard,
          component: <PaymentManagement />,
        },
        {
          name: "Contracts",
          icon: FileText,
          component: <ContractManagement />,
        },
        {
          name: "Profile",
          icon: User,
          component: <Profile user={user} />,
        },
      ],
    },
    Forwarder: {
      sidebarButtons: [
        {
          name: "Forwarder Offers",
          icon: Handshake,
          component: <ForwarderOfferManagement />,
        },
        {
          name: "Contracts",
          icon: FileText,
          component: <ContractManagement />,
        },
        {
          name: "Payments",
          icon: CreditCard,
          component: <PaymentManagement />,
        },
        {
          name: "Shipment Documents",
          icon: FileText,
          component: <ShipmentDocumentManagement />,
        },
        { name: "Vehicles", icon: Truck, component: <VehicleManagement /> },
        {
          name: "Profile",
          icon: User,
          component: <Profile user={user} />,
        },
      ],
    },
    Client: {
      sidebarButtons: [
        {
          name: "Contracts",
          icon: FileText,
          component: <ContractManagement />,
        },
        { name: "Shipments", icon: Package, component: <ShipmentManagement /> },
        {
          name: "Payments",
          icon: CreditCard,
          component: <PaymentManagement />,
        },
        {
          name: "Pickup Changes",
          icon: CalendarClock,
          component: <PickupChangeManagement />,
        },
        {
          name: "Profile",
          icon: User,
          component: <Profile user={user} />,
        },
      ],
    },
  };

  const { sidebarButtons = [] } = dashboardConfig[companyType] || {};

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

  const handleLogout = () => {
    logout();
    setIsSidebarOpen(false);
  };

  const getCompanyTypeTitle = () => {
    switch (companyType) {
      case "Carrier":
        return "Carrier Admin Panel";
      case "Forwarder":
        return "Forwarder Admin Panel";
      case "Client":
        return "Client Admin Panel";
      default:
        return "Company Admin Panel";
    }
  };

  const getCompanyTypeSubtitle = () => {
    switch (companyType) {
      case "Carrier":
        return "Carrier Dashboard";
      case "Forwarder":
        return "Forwarder Dashboard";
      case "Client":
        return "Client Dashboard";
      default:
        return "Company Dashboard";
    }
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
          className={`sidebar-overlay ${isSidebarOpen ? "open" : ""}`}
          onClick={closeSidebar}
        />
      )}

      {/* Enhanced Sidebar */}
      <aside className={`dashboard-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="flex items-center gap-2 mb-1">
            <Building2 size={20} className="text-blue-600" />
            <h2 className="sidebar-title">{getCompanyTypeTitle()}</h2>
          </div>
          <p className="sidebar-subtitle">{getCompanyTypeSubtitle()}</p>
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
            <span className="user-greeting">
              Welcome back, {user?.firstName || "Admin"}
            </span>
          </div>
        </div>

        <div className="main-content">{getCurrentComponent()}</div>
      </main>
    </div>
  );
};

export default CompanyAdminDashboard;
