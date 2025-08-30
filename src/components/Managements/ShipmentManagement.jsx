import { useState, useEffect } from "react";
import { shipmentService } from "../../services/shipmentService";
import { contractService } from "../../services/contractService";
import { vehicleService } from "../../services/vehicleService";
import { driverService } from "../../services/driverService";
import { cargoTypeService } from "../../services/cargoTypeService";
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
    } catch (error) {
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
  };

  const closeModal = () => {
    setSelectedShipment(null);
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this shipment?")) {
      setLoading(true);
      try {
        await shipmentService.delete(id);
        fetchData();
      } catch (error) {
        console.error("Error deleting shipment:", error);
      } finally {
        setLoading(false);
      }
    }
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
      }

      fetchData();
      closeModal();
    } catch (error) {
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
        <input
          type="text"
          placeholder="Search shipments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => openModal()}>Add Shipment</button>
      </div>

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
          {shipments.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.contractName}</td>
              <td>{s.vehicleName}</td>
              <td>{s.driverName}</td>
              <td>{s.cargoTypeName}</td>
              <td>{s.weightKg}</td>
              <td>{s.priority}</td>
              <td>{s.description}</td>
              <td>{s.scheduledDeparture}</td>
              <td>{s.scheduledArrival}</td>
              <td>
                <button onClick={() => openModal(s)}>Edit</button>
                <button onClick={() => handleDelete(s.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>{selectedShipment ? "Edit Shipment" : "Add Shipment"}</h3>
            <form onSubmit={handleSubmit}>
              {/* CREATE polja - vidi se samo kad dodaješ */}
              {!selectedShipment && (
                <>
                  <label htmlFor="contractId">Contract ID:</label>
                  <select name="contractId" required>
                    <option value="">Select Contract</option>
                    {contracts.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.contractNumber}
                      </option>
                    ))}
                  </select>

                  <label htmlFor="vehicleId">Vehicle</label>
                  <select name="vehicleId" required>
                    <option value="">Select Vehicle</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.brand} {v.model} ({v.registrationNumber})
                      </option>
                    ))}
                  </select>

                  <label htmlFor="driverId">Driver</label>
                  <select name="driverId" required>
                    <option value="">Select Driver</option>
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.firstName} {d.lastName}
                      </option>
                    ))}
                  </select>

                  <label htmlFor="cargoTypeId">Cargo Type</label>
                  <select name="cargoTypeId" required>
                    <option value="">Select Cargo Type</option>
                    {cargoTypes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.typeName}
                      </option>
                    ))}
                  </select>

                  <label htmlFor="weightKg">Weight (kg)</label>
                  <input
                    type="number"
                    name="weightKg"
                    placeholder="Weight (Kg)"
                    required
                  />

                  <label htmlFor="priority">Priority</label>
                  <input
                    type="number"
                    name="priority"
                    placeholder="Priority"
                    required
                  />

                  <label htmlFor="scheduledDeparture">Choose Departure:</label>
                  <input
                    type="datetime-local"
                    name="scheduledDeparture"
                    required
                  />

                  <label htmlFor="scheduledArrival">Choose Arrival:</label>
                  <input
                    type="datetime-local"
                    name="scheduledArrival"
                    required
                  />
                </>
              )}

              {/* Zajednička polja */}
              <label htmlFor="description">Description</label>
              <input
                type="text"
                name="description"
                placeholder="Description"
                defaultValue={selectedShipment?.description || ""}
              />

              {/* EDIT polja - vidi se samo kad edituješ */}
              {selectedShipment && (
                <>
                  <label htmlFor="status">Status</label>
                  <select name="status" defaultValue={selectedShipment.status}>
                    <option value="0">Scheduled</option>
                    <option value="1">In Transit</option>
                    <option value="2">Delayed</option>
                    <option value="3">Delivered</option>
                    <option value="4">Cancelled</option>
                  </select>

                  <label htmlFor="actualDeparture">Actual Departure:</label>
                  <input
                    type="datetime-local"
                    name="actualDeparture"
                    defaultValue={selectedShipment.actualDeparture || ""}
                  />

                  <label htmlFor="actualArrival">Actual Arrival:</label>
                  <input
                    type="datetime-local"
                    name="actualArrival"
                    defaultValue={selectedShipment.actualArrival || ""}
                  />
                </>
              )}

              <div className="modal-actions">
                <button type="submit">
                  {selectedShipment ? "Save" : "Add"}
                </button>
                <button type="button" onClick={closeModal}>
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

export default ShipmentManagement;
