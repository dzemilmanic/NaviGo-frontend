import { useEffect, useState } from "react";
import "../Dashboards.css";

import CargoTypeManagement from "../../../components/Managements/CargoTypeManagement";
import VehicleTypeManagement from "../../../components/Managements/VehicleTypeManagement";
import UserManagement from "../../../components/Managements/UserManagement";
import CompanyManagement from "../../../components/Managements/CompanyManagement";

import { LogOut } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const SuperAdminDashboard = () => {
  const [activeComponent, setActiveComponent] = useState(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) navigate("/");
  }, [user]);

  // Dinamička konfiguracija dugmadi i komponenti
  const dashboardConfig = {
    sidebarButtons: ["Users", "Companies", "Cargo Types", "Vehicle Types"],
    components: {
      Users: <UserManagement />,
      Companies: <CompanyManagement />,
      "Cargo Types": <CargoTypeManagement />,
      "Vehicle Types": <VehicleTypeManagement />,
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

export default SuperAdminDashboard;
