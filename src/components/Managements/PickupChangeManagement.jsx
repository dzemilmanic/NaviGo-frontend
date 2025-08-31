import { useState, useEffect } from "react";
import { pickupChangeService } from "../../services/pickupChangeService";
import { shipmentService } from "../../services/shipmentService"; // za povezane pošiljke
import "./Managements.css";
import Loader from "../Loader/Loader";
import { toast } from "react-toastify";
const PickupChangeManagement = () => {
  const [pickupChanges, setPickupChanges] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPickupChange, setSelectedPickupChange] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchPickupChanges = async () => {
    setLoading(true);
    try {
      const response = await pickupChangeService.getAll({ search });
      setPickupChanges(response.data);
    } catch (error) {
      toast.error("Failed to load pickup changes. Please try again.");
      console.error("Error fetching pickup changes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const response = await shipmentService.getAll();
      setShipments(response.data);
    } catch (error) {
      toast.error("Failed to load shipments. Please try again.");
      console.error("Error fetching shipments:", error);
    } finally {
      setLoading(false);
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
        const response = await pickupChangeService.delete(id);
        if (response.success) {
          toast.success(`Pickup change ${id} deleted successfully!`);
        } else {
          toast.error(
            `Failed to delete pickup change. Message: ${response.message}`
          );
        }
        await fetchPickupChanges();
      } catch (error) {
        toast.error("Failed to delete pickup change. Please try again.");
        console.error("Error deleting pickup change:", error);
      } finally {
        setLoading(false);
      }
    };

    // Show confirmation toast
    toast.warn(
      <div>
        <p>
          Are you sure you want to delete pickup change <strong>{id}</strong>?
        </p>
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = {
      shipmentId: Number(form.shipmentId.value),
      newTime: form.newTime.value,
    };
    setLoading(true);
    try {
      if (selectedPickupChange) {
        const response = await pickupChangeService.update(
          selectedPickupChange.id,
          formData
        );
        if (!response.success) {
          toast.error(
            `Failed to update pickup change. Message: ${response.message}`
          );
        } else {
          toast.success(
            `Pickup change ${selectedPickupChange.id} updated successfully!`
          );
        }
      } else {
        const response = await pickupChangeService.create(formData);
        if (!response.success) {
          toast.error(
            `Failed to create pickup change. Message: ${response.message}`
          );
        } else {
          toast.success(
            `Pickup change ${formData.shipmentId} created successfully!`
          );
        }
      }
      fetchPickupChanges();
      closeModal();
    } catch (error) {
      console.error("Error saving pickup change:", error);
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
            <h3>
              {selectedPickupChange
                ? "Edit Pickup Change"
                : "Add Pickup Change"}
            </h3>
            <form onSubmit={handleSubmit}>
              <select
                name="shipmentId"
                defaultValue={selectedPickupChange?.shipmentId || ""}
                required
              >
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
                <button type="submit">
                  {selectedPickupChange ? "Save" : "Add"}
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

export default PickupChangeManagement;
