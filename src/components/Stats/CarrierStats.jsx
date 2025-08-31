import { useEffect, useState } from "react";
import { vehicleService } from "../../services/vehicleService";
import { vehicleMaintenanceService } from "../../services/vehicleMaintenanceService";
import { driverService } from "../../services/driverService";
import { routeService } from "../../services/routeService";
import { shipmentService } from "../../services/shipmentService";
import { contractService } from "../../services/contractService";

import { Truck, Wrench, UserCheck, Route, Package, FileText } from "lucide-react";
import "./CarrierStats.css";

const CarrierStats = () => {
  const [stats, setStats] = useState({
    vehicles: 0,
    maintenances: 0,
    drivers: 0,
    routes: 0,
    shipments: 0,
    contracts: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [vehicles, maintenances, drivers, routes, shipments, contracts] = await Promise.all([
          vehicleService.getAll(),
          vehicleMaintenanceService.getAll(),
          driverService.getAll(),
          routeService.getAll(),
          shipmentService.getAll(),
          contractService.getAll()
        ]);

        setStats({
          vehicles: vehicles.data.length,
          maintenances: maintenances.data.length,
          drivers: drivers.data.length,
          routes: routes.data.length,
          shipments: shipments.data.length,
          contracts: contracts.data.length
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { 
      title: "Vehicles", 
      value: stats.vehicles, 
      icon: Truck, 
      gradient: "from-blue-500 to-blue-700",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    { 
      title: "Maintenances", 
      value: stats.maintenances, 
      icon: Wrench, 
      gradient: "from-orange-500 to-orange-700",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600"
    },
    { 
      title: "Drivers", 
      value: stats.drivers, 
      icon: UserCheck, 
      gradient: "from-green-500 to-green-700",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    { 
      title: "Routes", 
      value: stats.routes, 
      icon: Route, 
      gradient: "from-purple-500 to-purple-700",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    { 
      title: "Shipments", 
      value: stats.shipments, 
      icon: Package, 
      gradient: "from-indigo-500 to-indigo-700",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600"
    },
    { 
      title: "Contracts", 
      value: stats.contracts, 
      icon: FileText, 
      gradient: "from-teal-500 to-teal-700",
      bgColor: "bg-teal-50",
      iconColor: "text-teal-600"
    },
  ];

  if (loading) {
    return (
      <div className="carrier-stats-container">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="carrier-stats-skeleton">
            <div className="skeleton-icon"></div>
            <div className="skeleton-content">
              <div className="skeleton-title"></div>
              <div className="skeleton-value"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="carrier-stats-container">
      {statCards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div 
            key={card.title} 
            className={`carrier-stats-card ${card.bgColor}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="carrier-stats-card-header">
              <div className={`carrier-stats-card-icon bg-gradient-to-br ${card.gradient}`}>
                <IconComponent size={24} className="text-white" />
              </div>
              <div className="carrier-stats-card-trend">
                <div className="trend-indicator positive">
                  <span>+5.2%</span>
                </div>
              </div>
            </div>
            <div className="carrier-stats-card-content">
              <h3 className="carrier-stats-card-title">{card.title}</h3>
              <div className="carrier-stats-card-value-container">
                <span className="carrier-stats-card-value">{card.value}</span>
                <span className="carrier-stats-card-subtitle">Total</span>
              </div>
            </div>
            <div className={`carrier-stats-card-progress bg-gradient-to-r ${card.gradient}`}></div>
          </div>
        );
      })}
    </div>
  );
};

export default CarrierStats;
