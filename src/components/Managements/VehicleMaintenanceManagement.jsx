import React, { useState, useEffect } from "react";
import { vehicleMaintenanceService } from "../../services/vehicleMaintenanceService";
import { vehicleService } from "../../services/vehicleService";
import "./Managements.css";
import Loader from "../Loader/Loader";
const VehicleMaintenanceManagement = () => {
  const [vehicleMaintenances, setVehicleMaintenances] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVehicleMaintenance, setSelectedVehicleMaintenance] =
    useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    vehicleId: "",
    description: "",
    severity: 0,
    maintenanceType: 0,
    repairCost: 0,
    resolvedAt: "",
  });

  // Fetch data
  const fetchVehicleMaintenances = async () => {
    setLoading(true);
    try {
      const response = await vehicleMaintenanceService.getAll();
      setVehicleMaintenances(response.data);
    } catch (error) {
      console.error("Error fetching vehicle maintenances:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await vehicleService.getAll();
      setVehicles(response.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicleMaintenances();
    fetchVehicles();
  }, []);

  // Edit
  const handleEdit = (vm) => {
    setSelectedVehicleMaintenance(vm);
    setFormData({
      vehicleId: vm.vehicleId,
      description: vm.description,
      severity: severityEnumToValue(vm.severity),
      maintenanceType: maintenanceEnumToValue(vm.maintenanceType),
      repairCost: vm.repairCost,
      resolvedAt: vm.resolvedAt || "",
    });
    setModalOpen(true);
  };

  // Delete
  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this vehicle maintenance?"
      )
    ) {
      setLoading(true);
      try {
        await vehicleMaintenanceService.delete(id);
        fetchVehicleMaintenances();
      } catch (error) {
        console.error("Error deleting vehicle maintenance:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Submit (Add / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (selectedVehicleMaintenance) {
        await vehicleMaintenanceService.update(selectedVehicleMaintenance.id, {
          description: formData.description,
          severity: Number(formData.severity),
          maintenanceType: Number(formData.maintenanceType),
          repairCost: Number(formData.repairCost),
          resolvedAt: formData.resolvedAt || new Date().toISOString(),
        });
      } else {
        await vehicleMaintenanceService.create({
          vehicleId: Number(formData.vehicleId),
          description: formData.description,
          severity: Number(formData.severity),
          maintenanceType: Number(formData.maintenanceType),
          repairCost: Number(formData.repairCost),
        });
      }
      setModalOpen(false);
      setSelectedVehicleMaintenance(null);
      setFormData({
        vehicleId: "",
        description: "",
        severity: 0,
        maintenanceType: 0,
        repairCost: 0,
        resolvedAt: "",
      });
      fetchVehicleMaintenances();
    } catch (error) {
      console.error("Error saving vehicle maintenance:", error);
    } finally {
      setLoading(false);
    }
  };

  // Search
  const filteredVehicleMaintenances = vehicleMaintenances.filter((vm) =>
    vm.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Enums
  const severityOptions = ["Low", "Medium", "High", "Critical"];
  const maintenanceOptions = ["Regular", "Repair", "Emergency"];

  const severityEnumToValue = (str) => severityOptions.indexOf(str);
  const maintenanceEnumToValue = (str) => maintenanceOptions.indexOf(str);
  if (loading) {
    return <Loader />;
  }
  return (
    <div className="management-container">
      <div className="management-header">
        <input
          type="text"
          placeholder="Search description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={() => setModalOpen(true)}>
          Add Vehicle Maintenance
        </button>
      </div>

      <table className="management-table">
        <thead>
          <tr>
            <th>Vehicle</th>
            <th>Description</th>
            <th>Severity</th>
            <th>Maintenance Type</th>
            <th>Repair Cost</th>
            <th>Reported At</th>
            <th>Resolved At</th>
            <th>Reported By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredVehicleMaintenances.map((vm) => (
            <tr key={vm.id}>
              <td>{vm.vehicleName}</td>
              <td>{vm.description}</td>
              <td>{vm.severity}</td>
              <td>{vm.maintenanceType}</td>
              <td>{vm.repairCost}</td>
              <td>{new Date(vm.reportedAt).toLocaleString()}</td>
              <td>
                {vm.resolvedAt ? new Date(vm.resolvedAt).toLocaleString() : "-"}
              </td>
              <td>{vm.reportedByUserEmail}</td>
              <td>
                <button onClick={() => handleEdit(vm)}>Edit</button>
                <button onClick={() => handleDelete(vm.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>
              {selectedVehicleMaintenance
                ? "Edit Vehicle Maintenance"
                : "Add Vehicle Maintenance"}
            </h3>
            <form onSubmit={handleSubmit}>
              {!selectedVehicleMaintenance && (
                <>
                  <label htmlFor="vehicle">Vehicle</label>
                  <select
                    value={formData.vehicleId}
                    onChange={(e) =>
                      setFormData({ ...formData, vehicleId: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Vehicle</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.brand} - {v.model} ({v.manufactureYear})
                      </option>
                    ))}
                  </select>
                </>
              )}
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
              <label>Severity</label>
              <select
                value={formData.severity}
                onChange={(e) =>
                  setFormData({ ...formData, severity: e.target.value })
                }
              >
                {severityOptions.map((s, i) => (
                  <option key={i} value={i}>
                    {s}
                  </option>
                ))}
              </select>
              <label>Maintenance Type</label>
              <select
                value={formData.maintenanceType}
                onChange={(e) =>
                  setFormData({ ...formData, maintenanceType: e.target.value })
                }
              >
                {maintenanceOptions.map((m, i) => (
                  <option key={i} value={i}>
                    {m}
                  </option>
                ))}
              </select>
              <label>Repair Cost</label>
              <input
                type="number"
                value={formData.repairCost}
                onChange={(e) =>
                  setFormData({ ...formData, repairCost: e.target.value })
                }
              />
              {selectedVehicleMaintenance && (
                <>
                  <label>Resolved At</label>
                  <input
                    type="datetime-local"
                    value={
                      formData.resolvedAt
                        ? formData.resolvedAt.substring(0, 16)
                        : ""
                    }
                    onChange={(e) =>
                      setFormData({ ...formData, resolvedAt: e.target.value })
                    }
                  />
                </>
              )}
              <div className="modal-actions">
                <button type="submit">Save</button>
                <button type="button" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleMaintenanceManagement;
