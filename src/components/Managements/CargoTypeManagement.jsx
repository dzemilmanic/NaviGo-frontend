import { useState, useEffect } from "react";
import { cargoTypeService } from "../../services/cargoTypeService";
import { X, Trash2, Pencil } from "lucide-react";
import { toast } from "react-toastify";
import "./Managements.css";
import Loader from "../Loader/Loader";
import { useAuth } from "../../contexts/AuthContext";

const CargoTypeManagement = () => {
  const [cargoTypes, setCargoTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCargoType, setSelectedCargoType] = useState(null);
  const [formData, setFormData] = useState({
    typeName: "",
    description: "",
    requiresSpecialEquipment: false,
  });
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const fetchCargoTypes = async () => {
    setLoading(true);
    try {
      const response = await cargoTypeService.getAll();
      setCargoTypes(response.data);
      //toast.success("Cargo types loaded successfully!");
    } catch (error) {
      toast.error("Failed to load cargo types. Please try again.");
      console.error("Error fetching cargo types:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCargoTypes();
  }, []);

  const filteredCargoTypes = cargoTypes.filter((ct) =>
    ct.typeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (cargoType = null) => {
    if (cargoType) {
      setSelectedCargoType(cargoType);
      setFormData({
        typeName: cargoType.typeName,
        description: cargoType.description,
        requiresSpecialEquipment: cargoType.requiresSpecialEquipment,
      });
    } else {
      setSelectedCargoType(null);
      setFormData({
        typeName: "",
        description: "",
        requiresSpecialEquipment: false,
      });
    }
    setModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCargoType(null);
    setFormData({
      typeName: "",
      description: "",
      requiresSpecialEquipment: false,
    });
    document.body.style.overflow = "auto";
  };

  const handleDelete = async (id, typeName) => {
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
        const response = await cargoTypeService.delete(id);
        if (response.success) {
          toast.success(`Cargo type ${typeName} deleted successfully!`);
        } else {
          toast.error(
            `Failed to delete cargo type. Message:${response.message}`
          );
        }
        await fetchCargoTypes();
      } catch (error) {
        toast.error("Failed to delete cargo type. Please try again.");
        console.error("Error deleting cargo type:", error);
      } finally {
        setLoading(false);
      }
    };

    // Show confirmation toast
    toast.warn(
      <div>
        <p>
          Are you sure you want to delete cargo type <strong>{typeName}</strong>
          ?
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
    setIsSubmitting(true);
    setLoading(true);
    try {
      if (selectedCargoType) {
        const response = await cargoTypeService.update(
          selectedCargoType.id,
          formData
        );
        if (!response.success) {
          toast.error(
            `Failed to update cargo type. Message:${response.message}`
          );
        } else {
          toast.success(
            `Cargo type ${formData.typeName} updated successfully!`
          );
        }
      } else {
        await cargoTypeService.create(formData);
        toast.success(`Cargo type ${formData.typeName} created successfully!`);
      }
      closeModal();
      fetchCargoTypes();
    } catch (error) {
      toast.error("Failed to save cargo type. Please try again.");
      console.error("Error saving cargo type:", error);
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  if (loading && !isSubmitting) {
    return <Loader />;
  }

  return (
    <div className="management-container">
      <div className="management-header">
        <div className="header-content">
          <h2 className="header-title">Cargo Type Management</h2>
          <p className="header-subtitle">
            Manage cargo types and their requirements
          </p>
        </div>
        <div className="header-actions">
          <input
            type="text"
            placeholder="Search cargo types by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {user.role === "SuperAdmin" && (
            <button onClick={() => openModal()} className="primary-btn">
              Add New Cargo Type ➕
            </button>
          )}
        </div>
      </div>

      <div className="table-container">
        <table className="management-table">
          <thead>
            <tr>
              <th>Type Name</th>
              <th>Description</th>
              <th>Requires Special Equipment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCargoTypes.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty-row">
                  <div className="empty-state">
                    <p>No cargo types found matching your search criteria.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredCargoTypes.map((ct) => (
                <tr key={ct.id}>
                  <td className="name-cell">{ct.typeName}</td>
                  <td>{ct.description}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        ct.requiresSpecialEquipment
                          ? "status-active"
                          : "status-inactive"
                      }`}
                    >
                      {ct.requiresSpecialEquipment ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="actions-cell">
                    {user.role === "SuperAdmin" ? (
                      <div className="action-buttons">
                        <button
                          onClick={() => openModal(ct)}
                          className="action-btn edit-btn"
                          title="Edit cargo type"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(ct.id, ct.typeName)}
                          className="action-btn delete-btn"
                          title="Delete cargo type"
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
                {selectedCargoType ? "Edit Cargo Type" : "Add New Cargo Type"}
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
              <div className="form-section">
                <div className="form-group">
                  <label htmlFor="typeName">Type Name</label>
                  <input
                    type="text"
                    id="typeName"
                    placeholder="Cargo Type Name"
                    value={formData.typeName}
                    onChange={(e) =>
                      setFormData({ ...formData, typeName: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-section">
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    placeholder="Description of the cargo type"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-section">
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.requiresSpecialEquipment}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          requiresSpecialEquipment: e.target.checked,
                        })
                      }
                      style={{ marginRight: "8px" }}
                    />
                    Requires Special Equipment
                  </label>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={closeModal}
                  className="cancel-btn"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? selectedCargoType
                      ? "Updating..."
                      : "Creating..."
                    : selectedCargoType
                    ? "Update Cargo Type"
                    : "Create Cargo Type"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CargoTypeManagement;
