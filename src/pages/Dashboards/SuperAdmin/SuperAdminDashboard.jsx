import { useState, useEffect } from "react";
import "../Dashboards.css";

// Management komponente koje SuperAdmin može koristiti
import UserManagement from "../../../components/Managements/UserManagement";
import CompanyManagement from "../../../components/Managements/CompanyManagement";
import ContractManagement from "../../../components/Managements/ContractManagement";
import { LogOut } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
const SuperAdminDashboard = () => {
  const [activeComponent, setActiveComponent] = useState("users");
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user]);
  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "users":
        return <UserManagement />;
      case "companies":
        return <CompanyManagement />;
      case "contracts":
        return <ContractManagement />;
      default:
        return <div>Select a management from the sidebar</div>;
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <button
          className={activeComponent === "users" ? "active" : ""}
          onClick={() => setActiveComponent("users")}
        >
          User Management
        </button>
        <button
          className={activeComponent === "companies" ? "active" : ""}
          onClick={() => setActiveComponent("companies")}
        >
          Company Management
        </button>
        <button
          className={activeComponent === "contracts" ? "active" : ""}
          onClick={() => setActiveComponent("contracts")}
        >
          Contract Management
        </button>
        <button className="logout-button" onClick={logout}>
          <LogOut className="logout-icon" />
        </button>
      </aside>

      <main className="dashboard-main">{renderActiveComponent()}</main>
    </div>
  );
};

export default SuperAdminDashboard;
