import { useState, useEffect } from "react";
import { vehicleTypeService } from "../../services/vehicleTypeService";
import { X, Trash2, Pencil, User } from "lucide-react";
import { toast } from 'react-toastify';
import "./Managements.css";
import Loader from '../Loader/Loader';
import { useAuth } from "../../contexts/AuthContext";

const VehicleTypeManagement = () => {
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {user}=useAuth();
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await vehicleTypeService.getAll();
      setVehicleTypes(response.data);
    } catch (error) {
      toast.error("Failed to load vehicle types. Please try again.");
      console.error("Error fetching vehicle types:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (type = null) => {
    setSelectedType(type);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedType(null);
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
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
        const response = await vehicleTypeService.delete(id);
        if(response.success){
          toast.success(`Vehicle type ${typeName} deleted successfully!`);
        }else{
          toast.error(`Failed to delete vehicle type. Message:${response.message}`);
        }
        await fetchData();
      } catch (error) {
        toast.error("Failed to delete vehicle type. Please try again.");
        console.error("Error deleting vehicle type:", error);
      } finally {
        setLoading(false);
      }
    };

    // Show confirmation toast
    toast.warn(
      <div>
        <p>Are you sure you want to delete vehicle type <strong>{typeName}</strong>?</p>
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
    const submitData = {
      typeName: form.typeName.value,
      description: form.description.value,
      requiresSpecialLicense: form.requiresSpecialLicense.checked,
    };
    
    setIsSubmitting(true);
    setLoading(true);
    try {
      if (selectedType) {
        const response = await vehicleTypeService.update(selectedType.id, submitData);
        if(!response.success){
          toast.error(`Failed to update vehicle type. Message:${response.message}`);
        }else{
          toast.success(`Vehicle type ${submitData.typeName} updated successfully!`);
        }
      } else {
        await vehicleTypeService.create(submitData);
        toast.success(`Vehicle type ${submitData.typeName} created successfully!`);
      }
      fetchData();
      closeModal();
    } catch (error) {
      toast.error("Failed to save vehicle type. Please try again.");
      console.error("Error saving vehicle type:", error);
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const filteredVehicleTypes = vehicleTypes.filter((vt) =>
    vt.typeName.toLowerCase().includes(search.toLowerCase())
  );

  if (loading && !isSubmitting) {
    return <Loader />;
  }

  return (
    <div className="management-container">
      <div className="management-header">
        <div className="header-content">
          <h2 className="header-title">Vehicle Type Management</h2>
          <p className="header-subtitle">Manage vehicle types and their requirements</p>
        </div>
        <div className="header-actions">
          <input
            type="text"
            placeholder="Search vehicle types by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
         {user.role==="SuperAdmin" && <button onClick={() => openModal()} className="primary-btn">
            Add New Vehicle Type ➕
          </button>}
        </div>
      </div>

      <div className="table-container">
        <table className="management-table">
          <thead>
            <tr>
              <th>Type Name</th>
              <th>Description</th>
              <th>Special License Required</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVehicleTypes.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty-row">
                  <div className="empty-state">
                    <p>No vehicle types found matching your search criteria.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredVehicleTypes.map((t) => (
                <tr key={t.id}>
                  <td className="name-cell">{t.typeName}</td>
                  <td>{t.description}</td>
                  <td>
                    <span className={`status-badge ${t.requiresSpecialLicense ? 'status-active' : 'status-inactive'}`}>
                      {t.requiresSpecialLicense ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="actions-cell">
                   {user.role==="SuperAdmin" ? <div className="action-buttons">
                      <button 
                        onClick={() => openModal(t)}
                        className="action-btn edit-btn"
                        title="Edit vehicle type"
                      >
                        <Pencil size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(t.id, t.typeName)}
                        className="action-btn delete-btn"
                        title="Delete vehicle type"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>:"/"}
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
              <h3>{selectedType ? "Edit Vehicle Type" : "Add New Vehicle Type"}</h3>
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
                    name="typeName"
                    placeholder="Vehicle Type Name"
                    defaultValue={selectedType?.typeName || ""}
                    required
                  />
                </div>
              </div>

              <div className="form-section">
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    placeholder="Description of the vehicle type"
                    defaultValue={selectedType?.description || ""}
                  />
                </div>
              </div>

              <div className="form-section">
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      name="requiresSpecialLicense"
                      defaultChecked={selectedType?.requiresSpecialLicense || false}
                      style={{ marginRight: '8px' }}
                    />
                    Requires Special License
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
                  {isSubmitting ? (selectedType ? "Updating..." : "Creating...") : (selectedType ? "Update Vehicle Type" : "Create Vehicle Type")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleTypeManagement;