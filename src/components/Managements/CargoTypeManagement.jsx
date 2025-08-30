import React, { useState, useEffect } from "react";
import { cargoTypeService } from "../../services/cargoTypeService";
import { X } from "lucide-react";
import "./Managements.css";
import Loader from "../Loader/Loader";

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

  const fetchCargoTypes = async () => {
    setLoading(true);
    try {
      const response = await cargoTypeService.getAll();
      setCargoTypes(response.data);
    } catch (error) {
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
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCargoType(null);
    setFormData({
      typeName: "",
      description: "",
      requiresSpecialEquipment: false,
    });
    document.body.style.overflow = 'auto';
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this cargo type?")) {
      setLoading(true);
      try {
        await cargoTypeService.delete(id);
        fetchCargoTypes();
      } catch (error) {
        console.error("Error deleting cargo type:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (selectedCargoType) {
        await cargoTypeService.update(selectedCargoType.id, formData);
      } else {
        await cargoTypeService.create(formData);
      }
      closeModal();
      fetchCargoTypes();
    } catch (error) {
      console.error("Error saving cargo type:", error);
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
          <h2 className="header-title">Cargo Type Management</h2>
          <p className="header-subtitle">Manage cargo types and their requirements</p>
        </div>
        <div className="header-actions">
          <input
            type="text"
            placeholder="Search cargo types by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button onClick={() => openModal()} className="primary-btn">
            Add New Cargo Type
          </button>
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
                    <span className={`status-badge ${ct.requiresSpecialEquipment ? 'status-active' : 'status-inactive'}`}>
                      {ct.requiresSpecialEquipment ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <div className="action-buttons">
                      <button 
                        onClick={() => openModal(ct)}
                        className="action-btn edit-btn"
                        title="Edit cargo type"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(ct.id)}
                        className="action-btn delete-btn"
                        title="Delete cargo type"
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

      {modalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedCargoType ? "Edit Cargo Type" : "Add New Cargo Type"}</h3>
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
                      style={{ marginRight: '8px' }}
                    />
                    Requires Special Equipment
                  </label>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {selectedCargoType ? "Update Cargo Type" : "Create Cargo Type"}
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