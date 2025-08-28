import { useState, useEffect } from "react";
import "../Dashboards.css";
import ShipmentManagement from "../../../components/Managements/ShipmentManagement";
import PaymentManagement from "../../../components/Managements/PaymentManagement";
import { LogOut } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
const RegularUserDashboard = () => {
  const [activeComponent, setActiveComponent] = useState("shipments");
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user]);
  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "shipments":
        return <ShipmentManagement />;
      case "payments":
        return <PaymentManagement />;
      default:
        return <ShipmentManagement />;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <button
          className={activeComponent === "shipments" ? "active" : ""}
          onClick={() => setActiveComponent("shipments")}
        >
          Shipments
        </button>
        <button
          className={activeComponent === "payments" ? "active" : ""}
          onClick={() => setActiveComponent("payments")}
        >
          Payments
        </button>
        <button className="logout-button" onClick={logout}>
          <LogOut className="logout-icon" />
        </button>
      </div>

      {/* Main content */}
      <div className="dashboard-main">{renderActiveComponent()}</div>
    </div>
  );
};

export default RegularUserDashboard;
