import { useState, useEffect } from "react";
import { vehicleTypeService } from "../../services/vehicleTypeService";
import "./Managements.css";

const VehicleTypeManagement = () => {
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const response = await vehicleTypeService.getAll({ search });
      setVehicleTypes(response.data);
    } catch (error) {
      console.error("Error fetching vehicle types:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  const openModal = (type = null) => {
    setSelectedType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedType(null);
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this vehicle type?")) {
      try {
        await vehicleTypeService.delete(id);
        fetchData();
      } catch (error) {
        console.error("Error deleting vehicle type:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = {
      typeName: form.typeName.value,
      description: form.description.value,
      requiresSpecialLicense: form.requiresSpecialLicense.checked,
    };

    try {
      if (selectedType) {
        await vehicleTypeService.update(selectedType.id, formData);
      } else {
        await vehicleTypeService.create(formData);
      }
      fetchData();
      closeModal();
    } catch (error) {
      console.error("Error saving vehicle type:", error);
    }
  };

  return (
    <div className="management-container">
      <div className="management-header">
        <input
          type="text"
          placeholder="Search vehicle types..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => openModal()}>Add Vehicle Type</button>
      </div>

      <table className="management-table">
        <thead>
          <tr>
            
            <th>Type Name</th>
            <th>Description</th>
            <th>Special License</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicleTypes.map((t) => (
            <tr key={t.id}>
              
              <td>{t.typeName}</td>
              <td>{t.description}</td>
              <td>{t.requiresSpecialLicense ? "Yes" : "No"}</td>
              <td>
                <button onClick={() => openModal(t)}>Edit</button>
                <button onClick={() => handleDelete(t.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>{selectedType ? "Edit Vehicle Type" : "Add Vehicle Type"}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="typeName"
                placeholder="Type Name"
                defaultValue={selectedType?.typeName || ""}
                required
              />
              <input
                type="text"
                name="description"
                placeholder="Description"
                defaultValue={selectedType?.description || ""}
              />
              <label>
                <input
                  type="checkbox"
                  name="requiresSpecialLicense"
                  defaultChecked={selectedType?.requiresSpecialLicense || false}
                />
                Requires Special License
              </label>

              <div className="modal-actions">
                <button type="submit">{selectedType ? "Save" : "Add"}</button>
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

export default VehicleTypeManagement;
