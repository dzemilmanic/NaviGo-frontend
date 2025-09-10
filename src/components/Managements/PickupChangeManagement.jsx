import { useState, useEffect } from "react";
import { pickupChangeService } from "../../services/pickupChangeService";
import { shipmentService } from "../../services/shipmentService";
import { X, Trash2, Pencil, Pen } from "lucide-react";
import { toast } from "react-toastify";
import "./Managements.css";
import Loader from "../Loader/Loader";
import { useAuth } from "../../contexts/AuthContext";

const PickupChangeManagement = () => {
  const [pickupChanges, setPickupChanges] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPickupChange, setSelectedPickupChange] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const fetchData = async () => {
    setLoading(true);
    try {
      const pickupChangesResponse = await pickupChangeService.getAll();
      const shipmentsResponse = await shipmentService.getAll();

      setPickupChanges(pickupChangesResponse.data);
      setShipments(shipmentsResponse.data);
    } catch (error) {
      toast.error("Failed to load pickup changes. Please try again.");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (pickupChange = null) => {
    setSelectedPickupChange(pickupChange);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedPickupChange(null);
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
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
          toast.success("Pickup change deleted successfully!");
        } else {
          toast.error(
            `Failed to delete pickup change. Message: ${response.message}`
          );
        }
        await fetchData();
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
        <p>Are you sure you want to delete this pickup change?</p>
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
        if (response.success) {
          toast.success("Pickup change updated successfully!");
        } else {
          toast.error(
            `Failed to update pickup change. Message: ${response.message}`
          );
        }
      } else {
        const response = await pickupChangeService.create(formData);
        if (response.success) {
          toast.success("Pickup change created successfully!");
        } else {
          toast.error(
            `Failed to create pickup change. Message: ${response.message}`
          );
        }
      }

      await fetchData();
      closeModal();
    } catch (error) {
      toast.error("Failed to save pickup change. Please try again.");
      console.error("Error saving pickup change:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }
  const filteredPickupChanges = pickupChanges.filter((pc) =>
    [
      pc.id?.toString(),
      pc.shipmentId?.toString(),
      pc.clientId?.toString(),
      pc.oldTime,
      pc.newTime,
      pc.changeCount?.toString(),
      pc.additionalFee?.toString(),
    ]
      .filter(Boolean)
      .some((field) =>
        field.toString().toLowerCase().includes(search.toLowerCase())
      )
  );

  return (
    <div className="management-container">
      <div className="management-header">
        <div className="header-content">
          <h2 className="header-title">Pickup Change Management</h2>
          <p className="header-subtitle">
            Manage pickup time changes and track modifications
          </p>
        </div>
        <div className="header-actions">
          <input
            type="text"
            placeholder="Search pickup changes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          {(user.role === "RegularUser" ||
            (user.role === "CompanyAdmin" &&
              user.companyType === "Client")) && (
            <button onClick={() => openModal()} className="primary-btn">
              Add Pickup Change ➕
            </button>
          )}
        </div>
      </div>

      <div className="table-container">
        <table className="management-table">
          <thead>
            <tr>
              {/* <th>ID</th> */}
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
            {filteredPickupChanges.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty-row">
                  <div className="empty-state">
                    <p>
                      No pickup changes found matching your search criteria.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredPickupChanges.map((p) => (
                <tr key={p.id} className="table-row">
                  {/* <td>{p.id}</td> */}
                  <td>{p.shipmentId}</td>
                  <td>
                    {p.oldTime ? new Date(p.oldTime).toLocaleString() : "N/A"}
                  </td>
                  <td>
                    {p.newTime ? new Date(p.newTime).toLocaleString() : "N/A"}
                  </td>
                  <td>{p.changeCount}</td>
                  <td>{p.additionalFee}</td>
                  <td>{p.pickupChangesStatus}</td>
                  <td className="actions-cell">
                    {user.role === "RegularUser" ||
                    (user.role === "CompanyAdmin" &&
                      user.companyType === "Client") ? (
                      <div className="action-buttons">
                        <button
                          onClick={() => openModal(p)}
                          className="action-btn activate-btn"
                          title="Edit pickup change"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="action-btn delete-btn"
                          title="Delete pickup change"
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

      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {selectedPickupChange
                  ? "Edit Pickup Change"
                  : "Add Pickup Change"}
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
              <div className="form-group">
                <label htmlFor="shipmentId">Shipment:</label>
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
              </div>

              <div className="form-group">
                <label htmlFor="newTime">New Time:</label>
                <input
                  type="datetime-local"
                  name="newTime"
                  defaultValue={selectedPickupChange?.newTime || ""}
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={closeModal}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {selectedPickupChange ? "Save" : "Add"}
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
