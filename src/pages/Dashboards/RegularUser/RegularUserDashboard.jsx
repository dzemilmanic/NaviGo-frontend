import { useState, useEffect } from "react";
import "../Dashboards.css";
import ShipmentManagement from "../../../components/Managements/ShipmentManagement";
import PaymentManagement from "../../../components/Managements/PaymentManagement";
import PickupChangeManagement from '../../../components/Managements/PickupChangeManagement';
import { LogOut } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const RegularUserDashboard = () => {
  const [activeComponent, setActiveComponent] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/");
  }, [user]);

  // Konfiguracija dugmadi i komponenti
  const dashboardConfig = {
    sidebarButtons: ["Shipments", "Payments","Pickup Changes"],
    components: {
      Shipments: <ShipmentManagement />,
      Payments: <PaymentManagement />,
      "Pickup Changes": <PickupChangeManagement />,
    },
  };

  const { sidebarButtons = [], components = {} } = dashboardConfig;

  // Setuj default aktivnu komponentu
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
        {components[activeComponent] || <p>Select an option from the sidebar.</p>}
      </main>
    </div>
  );
};

export default RegularUserDashboard;
