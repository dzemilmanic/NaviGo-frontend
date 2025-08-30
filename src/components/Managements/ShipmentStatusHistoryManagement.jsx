import { useState, useEffect } from "react";
import { shipmentStatusHistoryService } from "../../services/shipmentStatusHistoryService";
import { shipmentService } from "../../services/shipmentService";
import "./Managements.css";
import Loader from "../Loader/Loader";
const ShipmentStatusHistoryManagement = () => {
  const [histories, setHistories] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const fetchData = async () => {
    setLoading(true);
    try {
      const historyResponse = await shipmentStatusHistoryService.getAll({ search });
      const shipmentResponse = await shipmentService.getAll();
      setHistories(historyResponse.data);
      setShipments(shipmentResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  const openModal = (history = null) => {
    setSelectedHistory(history);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedHistory(null);
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this history entry?")) {
      setLoading(true);
      try {
        await shipmentStatusHistoryService.delete(id);
        fetchData();
      } catch (error) {
        console.error("Error deleting history entry:", error);
      } finally{
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = {
      shipmentId: Number(form.shipmentId.value),
      shipmentStatus: Number(form.shipmentStatus.value),
      notes: form.notes.value,
    };
    setLoading(true);
    try {
      if (selectedHistory) {
        await shipmentStatusHistoryService.update(selectedHistory.id, formData);
      } else {
        await shipmentStatusHistoryService.create(formData);
      }
      fetchData();
      closeModal();
    } catch (error) {
      console.error("Error saving history entry:", error);
    } finally{
      setLoading(false);
    }
  };
  if(loading) return <Loader />
  return (
    <div className="management-container">
      <div className="management-header">
        <input
          type="text"
          placeholder="Search history..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => openModal()}>Add History Entry</button>
      </div>

      <table className="management-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Shipment ID</th>
            <th>Status</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {histories.map((h) => (
            <tr key={h.id}>
              <td>{h.id}</td>
              <td>{h.shipmentId}</td>
              <td>{h.shipmentStatus}</td>
              <td>{h.notes}</td>
              <td>
                <button onClick={() => openModal(h)}>Edit</button>
                <button onClick={() => handleDelete(h.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>{selectedHistory ? "Edit History Entry" : "Add History Entry"}</h3>
            <form onSubmit={handleSubmit}>
              <select
                name="shipmentId"
                defaultValue={selectedHistory?.shipmentId || ""}
                required
              >
                <option value="">Select Shipment</option>
                {shipments.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.id}
                  </option>
                ))}
              </select>

              <select
                name="shipmentStatus"
                defaultValue={selectedHistory?.shipmentStatus || 0}
                required
              >
                <option value={0}>Scheduled</option>
                <option value={1}>In Transit</option>
                <option value={2}>Delivered</option>
                <option value={3}>Delayed</option>
                <option value={4}>Cancelled</option>
              </select>

              <input
                type="text"
                name="notes"
                placeholder="Notes"
                defaultValue={selectedHistory?.notes || ""}
              />

              <div className="modal-actions">
                <button type="submit">{selectedHistory ? "Save" : "Add"}</button>
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

export default ShipmentStatusHistoryManagement;
