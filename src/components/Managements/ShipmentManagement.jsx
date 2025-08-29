import { useState, useEffect } from "react";
import { shipmentService } from "../../services/shipmentService";
import { contractService } from "../../services/contractService";
import { vehicleService } from "../../services/vehicleService";
import { driverService } from "../../services/driverService";
import { cargoTypeService } from "../../services/cargoTypeService";
import "./Managements.css";

const ShipmentManagement = () => {
  const [shipments, setShipments] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [cargoTypes, setCargoTypes] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
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
      try {
        await shipmentService.delete(id);
        fetchData();
      } catch (error) {
        console.error("Error deleting shipment:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = {
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

    try {
      if (selectedShipment) {
        await shipmentService.update(selectedShipment.id, formData);
      } else {
        await shipmentService.create(formData);
      }
      fetchData();
      closeModal();
    } catch (error) {
      console.error("Error saving shipment:", error);
    }
  };

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
              <label htmlFor="contractId">Contract ID:</label>
              <select
                name="contractId"
                defaultValue={selectedShipment?.contractId || ""}
                required
              >
                <option value="">Select Contract</option>
                {contracts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.contractNumber}
                  </option>
                ))}
              </select>
              <label htmlFor="vehicleId">Vehicle</label>
              <select
                name="vehicleId"
                defaultValue={selectedShipment?.vehicleId || ""}
                required
              >
                <option value="">Select Vehicle</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.brand} {v.model} ({v.registrationNumber})
                  </option>
                ))}
              </select>
              <label htmlFor="driverId">Driver</label>
              <select
                name="driverId"
                defaultValue={selectedShipment?.driverId || ""}
                required
              >
                <option value="">Select Driver</option>
                {drivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.firstName} {d.lastName}
                  </option>
                ))}
              </select>
              <label htmlFor="cargoTypeId">Cargo Type</label>
              <select
                name="cargoTypeId"
                defaultValue={selectedShipment?.cargoTypeId || ""}
                required
              >
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
                defaultValue={selectedShipment?.weightKg || ""}
                required
              />
              <label htmlFor="priority">Priority</label>
              <input
                type="number"
                name="priority"
                placeholder="Priority"
                defaultValue={selectedShipment?.priority || 0}
                required
              />
              <label htmlFor="description">Description</label>
              <input
                type="text"
                name="description"
                placeholder="Description"
                defaultValue={selectedShipment?.description || ""}
              />
              <label htmlFor="scheduledDeparture">Choose date and time:</label>
              <input
                type="datetime-local"
                name="scheduledDeparture"
                defaultValue={selectedShipment?.scheduledDeparture || ""}
                required
              />
              <label htmlFor="scheduledArrival">Choose date and time:</label>
              <input
                type="datetime-local"
                name="scheduledArrival"
                defaultValue={selectedShipment?.scheduledArrival || ""}
                required
              />

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
