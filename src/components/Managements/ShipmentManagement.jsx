import { useState, useEffect } from "react";
import { shipmentService } from "../../services/shipmentService";
import { contractService } from "../../services/contractService";
import { vehicleService } from "../../services/vehicleService";
import { driverService } from "../../services/driverService";
import { cargoTypeService } from "../../services/cargoTypeService";
import { X } from "lucide-react";
import { toast } from 'react-toastify';
import "./Managements.css";
import Loader from "../Loader/Loader";

const ShipmentManagement = () => {
  const [shipments, setShipments] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [cargoTypes, setCargoTypes] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const shipmentResponse = await shipmentService.getAll({ search });
      const contractResponse = await contractService.getAll();
      const vehicleResponse = await vehicleService.getAll();
      const driverResponse = await driverService.getAll();
      const cargoTypeResponse = await cargoTypeService.getAll();

      setShipments(shipmentResponse.data);
      setContracts(contractResponse.data);
      setVehicles(vehicleResponse.data);
      setDrivers(driverResponse.data);
      setCargoTypes(cargoTypeResponse.data);
      //toast.success("Shipments loaded successfully!");
    } catch (error) {
      toast.error("Failed to load shipments. Please try again.");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  const openModal = (shipment = null) => {
    setSelectedShipment(shipment);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedShipment(null);
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const handleDelete = async (id, shipmentDescription) => {
    // Custom toast confirmation
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
        await shipmentService.delete(id);
        await fetchData();
        toast.success("Shipment deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete shipment. Please try again.");
        console.error("Error deleting shipment:", error);
      } finally {
        setLoading(false);
      }
    };

    // Show confirmation toast
    toast.warn(
      <div>
        <p>Are you sure you want to delete this shipment?</p>
        <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
          <button 
            onClick={confirmDelete}
            style={{
              background: '#dc2626',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Delete
          </button>
          <button 
            onClick={cancelDelete}
            style={{
              background: '#6b7280',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    setLoading(true);
    try {
      if (selectedShipment) {
        // EDIT payload
        const updateData = {
          description: form.description.value,
          status: Number(form.status.value),
          actualDeparture: form.actualDeparture.value,
          actualArrival: form.actualArrival.value,
        };

        await shipmentService.update(selectedShipment.id, updateData);
        toast.success("Shipment updated successfully!");
      } else {
        // CREATE payload
        const createData = {
          contractId: Number(form.contractId.value),
          vehicleId: Number(form.vehicleId.value),
          driverId: Number(form.driverId.value),
          cargoTypeId: Number(form.cargoTypeId.value),
          weightKg: Number(form.weightKg.value),
          priority: Number(form.priority.value),
          description: form.description.value,
          scheduledDeparture: form.scheduledDeparture.value,
          scheduledArrival: form.scheduledArrival.value,
        };

        await shipmentService.create(createData);
        toast.success("Shipment created successfully!");
      }

      await fetchData();
      closeModal();
    } catch (error) {
      toast.error("Failed to save shipment. Please try again.");
      console.error("Error saving shipment:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="management-container">
      <div className="management-header">
        <div className="header-content">
          <h2 className="header-title">Shipment Management</h2>
          <p className="header-subtitle">Manage shipments and track deliveries</p>
        </div>
        <div className="header-actions">
          <input
            type="text"
            placeholder="Search shipments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button onClick={() => openModal()} className="primary-btn">
            Add Shipment
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="management-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Contract ID</th>
              <th>Vehicle</th>
              <th>Driver</th>
              <th>Cargo Type</th>
              <th>Weight (Kg)</th>
              <th>Priority</th>
              <th>Description</th>
              <th>Scheduled Departure</th>
              <th>Scheduled Arrival</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {shipments.length === 0 ? (
              <tr>
                <td colSpan="11" className="empty-row">
                  <div className="empty-state">
                    <p>No shipments found matching your search criteria.</p>
                  </div>
                </td>
              </tr>
            ) : (
              shipments.map((s) => (
                <tr key={s.id} className="table-row">
                  <td>{s.id}</td>
                  <td>{s.contractName}</td>
                  <td>{s.vehicleName}</td>
                  <td>{s.driverName}</td>
                  <td>{s.cargoTypeName}</td>
                  <td>{s.weightKg}</td>
                  <td>{s.priority}</td>
                  <td>{s.description}</td>
                  <td>{new Date(s.scheduledDeparture).toLocaleString()}</td>
                  <td>{new Date(s.scheduledArrival).toLocaleString()}</td>
                  <td className="actions-cell">
                    <div className="action-buttons">
                      <button 
                        onClick={() => openModal(s)}
                        className="action-btn activate-btn"
                        title="Edit shipment"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(s.id, s.description)}
                        className="action-btn delete-btn"
                        title="Delete shipment"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedShipment ? "Edit Shipment" : "Add Shipment"}</h3>
              <button
                type="button"
                onClick={closeModal}
                className="modal-close-btn"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              {/* CREATE polja - vidi se samo kad dodaješ */}
              {!selectedShipment && (
                <>
                  <div className="form-group">
                    <label htmlFor="contractId">Contract ID:</label>
                    <select name="contractId" required>
                      <option value="">Select Contract</option>
                      {contracts.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.contractNumber}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="vehicleId">Vehicle</label>
                    <select name="vehicleId" required>
                      <option value="">Select Vehicle</option>
                      {vehicles.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.brand} {v.model} ({v.registrationNumber})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="driverId">Driver</label>
                    <select name="driverId" required>
                      <option value="">Select Driver</option>
                      {drivers.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.firstName} {d.lastName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="cargoTypeId">Cargo Type</label>
                    <select name="cargoTypeId" required>
                      <option value="">Select Cargo Type</option>
                      {cargoTypes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.typeName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="weightKg">Weight (kg)</label>
                    <input
                      type="number"
                      name="weightKg"
                      placeholder="Weight (Kg)"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="priority">Priority</label>
                    <input
                      type="number"
                      name="priority"
                      placeholder="Priority"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="scheduledDeparture">Choose Departure:</label>
                    <input
                      type="datetime-local"
                      name="scheduledDeparture"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="scheduledArrival">Choose Arrival:</label>
                    <input
                      type="datetime-local"
                      name="scheduledArrival"
                      required
                    />
                  </div>
                </>
              )}

              {/* Zajednička polja */}
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  name="description"
                  placeholder="Description"
                  defaultValue={selectedShipment?.description || ""}
                />
              </div>

              {/* EDIT polja - vidi se samo kad edituješ */}
              {selectedShipment && (
                <>
                  <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select name="status" defaultValue={selectedShipment.status}>
                      <option value="0">Scheduled</option>
                      <option value="1">In Transit</option>
                      <option value="2">Delayed</option>
                      <option value="3">Delivered</option>
                      <option value="4">Cancelled</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="actualDeparture">Actual Departure:</label>
                    <input
                      type="datetime-local"
                      name="actualDeparture"
                      defaultValue={selectedShipment.actualDeparture || ""}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="actualArrival">Actual Arrival:</label>
                    <input
                      type="datetime-local"
                      name="actualArrival"
                      defaultValue={selectedShipment.actualArrival || ""}
                    />
                  </div>
                </>
              )}

              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {selectedShipment ? "Save" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShipmentManagement;