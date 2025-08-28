import { useEffect, useState } from "react";
import "../Dashboards.css";

// Management komponenti
import VehicleManagement from "../../../components/Managements/VehicleManagement";
import VehicleTypeManagment from "../../../components/Managements/VehicleTypeManagement";
import DriverManagement from "../../../components/Managements/DriverManagement";
import RouteManagement from "../../../components/Managements/RouteManagement";
import RoutePriceManagement from "../../../components/Managements/RoutePriceManagement";
import ForwarderOfferManagement from "../../../components/Managements/ForwarderOfferManagement";
import ContractManagement from "../../../components/Managements/ContractManagement";
import ShipmentManagement from "../../../components/Managements/ShipmentManagement";
import PaymentManagement from "../../../components/Managements/PaymentManagement";
import PickupChangeManagement from "../../../components/Managements/PickupChangeManagement";
import { LogOut } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
const CompanyAdminDashboard = ({ companyType }) => {
  const [activeComponent, setActiveComponent] = useState("");
  let sidebarButtons = [];
  let componentMap = {};
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user]);
  switch (companyType) {
    case "Carrier":
      sidebarButtons = [
        "Vehicles",
        "Vehicle Types",
        "Drivers",
        "Routes",
        "Route Prices",
      ];
      componentMap = {
        Vehicles: <VehicleManagement />,
        "Vehicle Types": <VehicleTypeManagment />,
        Drivers: <DriverManagement />,
        Routes: <RouteManagement />,
        "Route Prices": <RoutePriceManagement />,
      };
      break;
    case "Forwarder":
      sidebarButtons = [
        "Forwarder Offers",
        "Contracts",
        "Shipments",
        "Payments",
      ];
      componentMap = {
        "Forwarder Offers": <ForwarderOfferManagement />,
        Contracts: <ContractManagement />,
        Shipments: <ShipmentManagement />,
        Payments: <PaymentManagement />,
      };
      break;
    case "Client":
      sidebarButtons = ["Contracts", "Shipments", "Payments", "Pickup Changes"];
      componentMap = {
        Contracts: <ContractManagement />,
        Shipments: <ShipmentManagement />,
        Payments: <PaymentManagement />,
        "Pickup Changes": <PickupChangeManagement />,
      };
      break;
    default:
      sidebarButtons = [];
      componentMap = {};
  }

  // Set default active component
  if (!activeComponent && sidebarButtons.length > 0) {
    setActiveComponent(sidebarButtons[0]);
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        {sidebarButtons.map((btn) => (
          <button
            key={btn}
            className={activeComponent === btn ? "active" : ""}
            onClick={() => setActiveComponent(btn)}
          >
            {btn}
          </button>
        ))}
        <button className="logout-button" onClick={logout}>
          <LogOut className="logout-icon" />
        </button>
      </div>

      {/* Main content */}
      <div className="dashboard-main">
        {componentMap[activeComponent] || (
          <p>Select an option from the sidebar.</p>
        )}
      </div>
    </div>
  );
};

export default CompanyAdminDashboard;
