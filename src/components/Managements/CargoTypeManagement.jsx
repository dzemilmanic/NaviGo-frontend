import React, { useState, useEffect } from "react";
import { cargoTypeService } from "../../services/cargoTypeService"; // import tvog servisa
// import "./Managements.css";
import Loader from "../Loader/Loader";
const CargoTypeManagement = () => {
  const [cargoTypes, setCargoTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCargoType, setSelectedCargoType] = useState(null); // za edit
  const [formData, setFormData] = useState({
    typeName: "",
    description: "",
    requiresSpecialEquipment: false,
  });
  const [loading, setLoading] = useState(false);
  // Fetch svih cargo tipova
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

  // Filter podataka po searchTerm
  const filteredCargoTypes = cargoTypes.filter((ct) =>
    ct.typeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Otvori modal za edit
  const handleEdit = (cargoType) => {
    setSelectedCargoType(cargoType);
    setFormData({
      typeName: cargoType.typeName,
      description: cargoType.description,
      requiresSpecialEquipment: cargoType.requiresSpecialEquipment,
    });
    setModalOpen(true);
  };

  // Brisanje
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

  // Dodavanje / edit submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (selectedCargoType) {
        await cargoTypeService.update(selectedCargoType.id, formData);
      } else {
        await cargoTypeService.create(formData);
      }
      setModalOpen(false);
      setSelectedCargoType(null);
      setFormData({
        typeName: "",
        description: "",
        requiresSpecialEquipment: false,
      });
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
        <input
          type="text"
          placeholder="Search cargo types..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={() => setModalOpen(true)}>Add Cargo Type</button>
      </div>

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
          {filteredCargoTypes.map((ct) => (
            <tr key={ct.id}>
              <td>{ct.typeName}</td>
              <td>{ct.description}</td>
              <td>{ct.requiresSpecialEquipment ? "Yes" : "No"}</td>
              <td>
                <button onClick={() => handleEdit(ct)}>Edit</button>
                <button onClick={() => handleDelete(ct.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>{selectedCargoType ? "Edit Cargo Type" : "Add Cargo Type"}</h3>
            <form onSubmit={handleSubmit}>
              <label htmlFor="typeName">Type Name</label>
              <input
                type="text"
                placeholder="Type Name"
                value={formData.typeName}
                onChange={(e) =>
                  setFormData({ ...formData, typeName: e.target.value })
                }
                required
              />
              <label htmlFor="description">Description</label>
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
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
                />
                Requires Special Equipment
              </label>
              <div className="modal-actions">
                <button type="submit">Save</button>
                <button type="button" onClick={() => setModalOpen(false)}>
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

export default CargoTypeManagement;
