import { useState, useEffect } from "react";
import { pickupChangeService } from "../../services/pickupChangeService";
import { shipmentService } from "../../services/shipmentService"; // za povezane pošiljke
import "./Managements.css";

const PickupChangeManagement = () => {
  const [pickupChanges, setPickupChanges] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPickupChange, setSelectedPickupChange] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shipments, setShipments] = useState([]);

  const fetchPickupChanges = async () => {
    try {
      const response = await pickupChangeService.getAll({ search });
      setPickupChanges(response.data);
    } catch (error) {
      console.error("Error fetching pickup changes:", error);
    }
  };

  const fetchShipments = async () => {
    try {
      const response = await shipmentService.getAll();
      setShipments(response.data);
    } catch (error) {
      console.error("Error fetching shipments:", error);
    }
  };

  useEffect(() => {
    fetchPickupChanges();
    fetchShipments();
  }, [search]);

  const openModal = (pickupChange = null) => {
    setSelectedPickupChange(pickupChange);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPickupChange(null);
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this pickup change?")) {
      try {
        await pickupChangeService.delete(id);
        fetchPickupChanges();
      } catch (error) {
        console.error("Error deleting pickup change:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = {
      shipmentId: Number(form.shipmentId.value),
      newTime: form.newTime.value,
    };

    try {
      if (selectedPickupChange) {
        await pickupChangeService.update(selectedPickupChange.id, formData);
      } else {
        await pickupChangeService.create(formData);
      }
      fetchPickupChanges();
      closeModal();
    } catch (error) {
      console.error("Error saving pickup change:", error);
    }
  };

  return (
    <div className="management-container">
      <div className="management-header">
        <input
          type="text"
          placeholder="Search pickup changes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => openModal()}>Add Pickup Change</button>
      </div>

      <table className="management-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Shipment</th>
            <th>Old Time</th>
            <th>New Time</th>
            <th>Change Count</th>
            <th>Additional Fee</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pickupChanges.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.shipmentId}</td>
              <td>{p.oldTime}</td>
              <td>{p.newTime}</td>
              <td>{p.changeCount}</td>
              <td>{p.additionalFee}</td>
              <td>{p.pickupChangesStatus}</td>
              <td>
                <button onClick={() => openModal(p)}>Edit</button>
                <button onClick={() => handleDelete(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>{selectedPickupChange ? "Edit Pickup Change" : "Add Pickup Change"}</h3>
            <form onSubmit={handleSubmit}>
              <select name="shipmentId" defaultValue={selectedPickupChange?.shipmentId || ""} required>
                <option value="">Select Shipment</option>
                {shipments.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.id} - {s.description}
                  </option>
                ))}
              </select>

              <input
                type="datetime-local"
                name="newTime"
                defaultValue={selectedPickupChange?.newTime || ""}
                required
              />

              <div className="modal-actions">
                <button type="submit">{selectedPickupChange ? "Save" : "Add"}</button>
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

export default PickupChangeManagement;
