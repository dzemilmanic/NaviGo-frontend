import { useState, useEffect } from "react";
import { shipmentStatusHistoryService } from "../../services/shipmentStatusHistoryService";
import { shipmentService } from "../../services/shipmentService";
import { X } from "lucide-react";
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
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedHistory(null);
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this history entry?")) {
      setLoading(true);
      try {
        await shipmentStatusHistoryService.delete(id);
        fetchData();
      } catch (error) {
        console.error("Error deleting history entry:", error);
      } finally {
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
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="management-container">
      <div className="management-header">
        <div className="header-content">
          <h2 className="header-title">Shipment Status History</h2>
          <p className="header-subtitle">Track shipment status changes and updates</p>
        </div>
        <div className="header-actions">
          <input
            type="text"
            placeholder="Search history..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button onClick={() => openModal()} className="primary-btn">
            Add History Entry
          </button>
        </div>
      </div>

      <div className="table-container">
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
            {histories.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-row">
                  <div className="empty-state">
                    <p>No history entries found matching your search criteria.</p>
                  </div>
                </td>
              </tr>
            ) : (
              histories.map((h) => (
                <tr key={h.id} className="table-row">
                  <td>{h.id}</td>
                  <td>{h.shipmentId}</td>
                  <td>
                    <span className="status-badge status-active">
                      {h.shipmentStatus}
                    </span>
                  </td>
                  <td>{h.notes}</td>
                  <td className="actions-cell">
                    <div className="action-buttons">
                      <button 
                        onClick={() => openModal(h)}
                        className="action-btn activate-btn"
                        title="Edit history entry"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(h.id)}
                        className="action-btn delete-btn"
                        title="Delete history entry"
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
              <h3>{selectedHistory ? "Edit History Entry" : "Add History Entry"}</h3>
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
              <div className="form-group">
                <label htmlFor="shipmentId">Shipment</label>
                <select
                  name="shipmentId"
                  defaultValue={selectedHistory?.shipmentId || ""}
                  required
                >
                  <option value="">Select Shipment</option>
                  {shipments.map((s) => (
                    <option key={s.id} value={s.id}>
                      Shipment #{s.id}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="shipmentStatus">Status</label>
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
              </div>

              <div className="form-group">
                <label htmlFor="notes">Notes</label>
                <textarea
                  name="notes"
                  placeholder="Enter notes about this status change..."
                  defaultValue={selectedHistory?.notes || ""}
                  rows="3"
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {selectedHistory ? "Save" : "Add"}
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