import React, { useState, useEffect } from "react";
import { vehicleMaintenanceService } from "../../services/vehicleMaintenanceService";
import { vehicleService } from "../../services/vehicleService";
import { X, Trash2, Pencil } from "lucide-react";
import { toast } from "react-toastify";
import "./Managements.css";
import Loader from "../Loader/Loader";
import { useAuth } from "../../contexts/AuthContext";

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
  const { user } = useAuth();
  // Helper function to get current date-time in local timezone for datetime-local input
  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  // Helper function to get max allowed date (current date-time)
  const getMaxDateTime = () => {
    return getCurrentDateTime();
  };

  // Fetch data
  const fetchVehicleMaintenances = async () => {
    setLoading(true);
    try {
      const response = await vehicleMaintenanceService.getAll();
      if (response.success) {
        setVehicleMaintenances(response.data);
      } else {
        toast.error(response.message || "Failed to load maintenance records.");
      }
    } catch (error) {
      toast.error("Failed to load maintenance records. Please try again.");
      console.error("Error fetching vehicle maintenances:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await vehicleService.getAll();
      if (response.success) {
        setVehicles(response.data);
      } else {
        toast.error(response.message || "Failed to load vehicles.");
      }
    } catch (error) {
      toast.error("Failed to load vehicles. Please try again.");
      console.error("Error fetching vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicleMaintenances();
    fetchVehicles();
  }, []);

  const openModal = () => {
    setModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
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
    document.body.style.overflow = "auto";
  };

  // Edit
  const handleEdit = (vm) => {
    setSelectedVehicleMaintenance(vm);

    // Format resolvedAt for datetime-local input
    let formattedResolvedAt = "";
    if (vm.resolvedAt) {
      const date = new Date(vm.resolvedAt);
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      formattedResolvedAt = date.toISOString().slice(0, 16);
    }

    setFormData({
      vehicleId: vm.vehicleId,
      description: vm.description,
      severity: severityEnumToValue(vm.severity),
      maintenanceType: maintenanceEnumToValue(vm.maintenanceType),
      repairCost: vm.repairCost,
      resolvedAt: formattedResolvedAt,
    });
    setModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  // Delete with custom toast confirmation
  const handleDelete = async (id) => {
    const confirmDelete = () => {
      toast.dismiss();
      performDelete();
    };

    const cancelDelete = () => {
      toast.dismiss();
      toast.info("Delete operation cancelled");
    };

    const performDelete = async () => {
      setLoading(true);
      try {
        const response = await vehicleMaintenanceService.delete(id);
        if (response.success) {
          toast.success("Maintenance record deleted successfully!");
          await fetchVehicleMaintenances();
        } else {
          toast.error(
            `Failed to delete maintenance record. ${response.message || ""}`
          );
        }
      } catch (error) {
        toast.error("Failed to delete maintenance record. Please try again.");
        console.error("Error deleting vehicle maintenance:", error);
      } finally {
        setLoading(false);
      }
    };

    // Show confirmation toast
    toast.warn(
      <div>
        <p>Are you sure you want to delete this maintenance record?</p>
        <div style={{ marginTop: "10px", display: "flex", gap: "8px" }}>
          <button
            onClick={confirmDelete}
            style={{
              background: "#dc2626",
              color: "white",
              border: "none",
              padding: "6px 12px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            Delete
          </button>
          <button
            onClick={cancelDelete}
            style={{
              background: "#6b7280",
              color: "white",
              border: "none",
              padding: "6px 12px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
        closeButton: false,
      }
    );
  };

  // Submit (Add / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate resolved date is not in the future
    if (formData.resolvedAt) {
      const resolvedDate = new Date(formData.resolvedAt);
      const now = new Date();

      if (resolvedDate > now) {
        toast.error("Resolved date cannot be in the future!");
        return;
      }
    }

    setLoading(true);
    try {
      if (selectedVehicleMaintenance) {
        // Update
        const updateData = {
          description: formData.description,
          severity: Number(formData.severity),
          maintenanceType: Number(formData.maintenanceType),
          repairCost: Number(formData.repairCost),
        };

        // Only add resolvedAt if it's provided
        if (formData.resolvedAt) {
          updateData.resolvedAt = new Date(formData.resolvedAt).toISOString();
        }

        const response = await vehicleMaintenanceService.update(
          selectedVehicleMaintenance.id,
          updateData
        );

        if (response.success) {
          toast.success("Maintenance record updated successfully!");
          closeModal();
          await fetchVehicleMaintenances();
        } else {
          toast.error(
            `Failed to update maintenance record. ${response.message || ""}`
          );
        }
      } else {
        // Create
        const createData = {
          vehicleId: Number(formData.vehicleId),
          description: formData.description,
          severity: Number(formData.severity),
          maintenanceType: Number(formData.maintenanceType),
          repairCost: Number(formData.repairCost),
        };

        const response = await vehicleMaintenanceService.create(createData);

        if (response.success) {
          toast.success("Maintenance record created successfully!");
          closeModal();
          await fetchVehicleMaintenances();
        } else {
          toast.error(
            `Failed to create maintenance record. ${response.message || ""}`
          );
        }
      }
    } catch (error) {
      toast.error("Failed to save maintenance record. Please try again.");
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
        <div className="header-content">
          <h2 className="header-title">Vehicle Maintenance Management</h2>
          <p className="header-subtitle">
            Track and manage vehicle maintenance records
          </p>
        </div>
        <div className="header-actions">
          <input
            type="text"
            placeholder="Search by description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {user.role === "CompanyAdmin" && user.companyType === "Carrier" && (
            <button onClick={() => openModal()} className="primary-btn">
              Add Vehicle Maintenance ➕
            </button>
          )}
        </div>
      </div>

      <div className="table-container">
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
            {filteredVehicleMaintenances.length === 0 ? (
              <tr>
                <td colSpan="9" className="empty-row">
                  <div className="empty-state">
                    <p>
                      No vehicle maintenance records found matching your search
                      criteria.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredVehicleMaintenances.map((vm) => (
                <tr key={vm.id} className="table-row">
                  <td>{vm.vehicleName}</td>
                  <td>{vm.description}</td>
                  <td>
                    <span
                      className={`status-badge severity-${vm.severity.toLowerCase()}`}
                    >
                      {vm.severity}
                    </span>
                  </td>
                  <td>{vm.maintenanceType}</td>
                  <td>${vm.repairCost}</td>
                  <td>{new Date(vm.reportedAt).toLocaleString()}</td>
                  <td>
                    {vm.resolvedAt
                      ? new Date(vm.resolvedAt).toLocaleString()
                      : "—"}
                  </td>
                  <td>{vm.reportedByUserEmail}</td>
                  <td className="actions-cell">
                    {user.role === "CompanyAdmin" &&
                    user.companyType === "Carrier" ? (
                      <div className="action-buttons">
                        <button
                          onClick={() => handleEdit(vm)}
                          className="action-btn activate-btn"
                          title="Edit maintenance record"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(vm.id, vm.description)}
                          className="action-btn delete-btn"
                          title="Delete maintenance record"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ) : (
                      "/"
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {selectedVehicleMaintenance
                  ? "Edit Vehicle Maintenance"
                  : "Add Vehicle Maintenance"}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="modal-close-btn"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="user-form">
              {!selectedVehicleMaintenance && (
                <div className="form-group">
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
                </div>
              )}

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe the maintenance issue..."
                  required
                />
              </div>

              <div className="form-group">
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
              </div>

              <div className="form-group">
                <label>Maintenance Type</label>
                <select
                  value={formData.maintenanceType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maintenanceType: e.target.value,
                    })
                  }
                >
                  {maintenanceOptions.map((m, i) => (
                    <option key={i} value={i}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Repair Cost</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.repairCost}
                  onChange={(e) =>
                    setFormData({ ...formData, repairCost: e.target.value })
                  }
                  placeholder="Enter repair cost"
                />
              </div>

              {selectedVehicleMaintenance && (
                <div className="form-group">
                  <label>Resolved At</label>
                  <input
                    type="datetime-local"
                    value={formData.resolvedAt}
                    max={getMaxDateTime()}
                    onChange={(e) =>
                      setFormData({ ...formData, resolvedAt: e.target.value })
                    }
                    title="Cannot be in the future"
                  />
                  <small
                    style={{
                      color: "#666",
                      fontSize: "12px",
                      marginTop: "4px",
                    }}
                  >
                    Leave empty if not yet resolved. Date cannot be in the
                    future.
                  </small>
                </div>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={closeModal}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Save
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
