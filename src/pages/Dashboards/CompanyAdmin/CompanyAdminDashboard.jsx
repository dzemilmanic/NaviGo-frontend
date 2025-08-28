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
import { LogOut } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const CompanyAdminDashboard = ({ companyType }) => {
  const [activeComponent, setActiveComponent] = useState(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) navigate("/");
  }, [user]);

  // Konfiguracija pristupa po tipu kompanije
  const dashboardConfig = {
    Carrier: {
      sidebarButtons: ["Vehicles", "Drivers", "Routes", "Route Prices"],
      components: {
        Vehicles: <VehicleManagement />,
        Drivers: <DriverManagement />,
        Routes: <RouteManagement />,
        "Route Prices": <RoutePriceManagement />,
      },
    },
    Forwarder: {
      sidebarButtons: [
        "Forwarder Offers",
        "Contracts",
        "Shipments",
        "Payments",
        "Shipment Documents"
      ],
      components: {
        "Forwarder Offers": <ForwarderOfferManagement />,
        Contracts: <ContractManagement />,
        Shipments: <ShipmentManagement />,
        Payments: <PaymentManagement />,
        "Shipment Documents": <ShipmentDocumentManagement />,
      },
    },
    Client: {
      sidebarButtons: ["Contracts", "Shipments", "Payments", "Pickup Changes"],
      components: {
        Contracts: <ContractManagement />,
        Shipments: <ShipmentManagement />,
        Payments: <PaymentManagement />,
        "Pickup Changes": <PickupChangeManagement />,
      },
    },
  };

  const { sidebarButtons = [], components = {} } =
    dashboardConfig[companyType] || {};

  // Default aktivna komponenta
  useEffect(() => {
    if (!activeComponent && sidebarButtons.length > 0) {
      setActiveComponent(sidebarButtons[0]);
    }
  }, [sidebarButtons, activeComponent]);

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
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
      </aside>

      <main className="dashboard-main">
        {components[activeComponent] || (
          <p>Select an option from the sidebar.</p>
        )}
      </main>
    </div>
  );
};

export default CompanyAdminDashboard;
