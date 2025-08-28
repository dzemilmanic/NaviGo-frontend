import { useState, useEffect } from "react";
import { vehicleService } from "../../services/vehicleService";
import { vehicleTypeService } from "../../services/vehicleTypeService";
import { companyService } from "../../services/companyService";
import { locationService } from "../../services/locationService";
import "./Managements.css";

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [locations, setLocations] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const vehicleResponse = await vehicleService.getAll({ search });
      const typeResponse = await vehicleTypeService.getAll();
      const companyResponse = await companyService.getAll();
      const locationResponse = await locationService.getAll();
      setVehicles(vehicleResponse.data);
      setVehicleTypes(typeResponse.data);
      setCompanies(companyResponse.data);
      setLocations(locationResponse.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  const openModal = (vehicle = null) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedVehicle(null);
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await vehicleService.delete(id);
        fetchData();
      } catch (error) {
        console.error("Error deleting vehicle:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = {
      brand: form.brand.value,
      model: form.model.value,
      engineCapacityCc: Number(form.engineCapacityCc.value),
      vehiclePicture: form.vehiclePicture.value,
      companyId: Number(form.companyId.value),
      vehicleTypeId: Number(form.vehicleTypeId.value),
      registrationNumber: form.registrationNumber.value,
      capacityKg: Number(form.capacityKg.value),
      manufactureYear: Number(form.manufactureYear.value),
      lastInspectionDate: form.lastInspectionDate.value,
      insuranceExpiry: form.insuranceExpiry.value,
      currentLocationId: Number(form.currentLocationId.value),
      categories: form.categories.value,
    };

    try {
      if (selectedVehicle) {
        await vehicleService.update(selectedVehicle.id, formData);
      } else {
        await vehicleService.create(formData);
      }
      fetchData();
      closeModal();
    } catch (error) {
      console.error("Error saving vehicle:", error);
    }
  };

  return (
    <div className="management-container">
      <div className="management-header">
        <input
          type="text"
          placeholder="Search vehicles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => openModal()}>Add Vehicle</button>
      </div>

      <table className="management-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Brand</th>
            <th>Model</th>
            <th>Registration</th>
            <th>Type</th>
            <th>Company</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((v) => (
            <tr key={v.id}>
              <td>{v.id}</td>
              <td>{v.brand}</td>
              <td>{v.model}</td>
              <td>{v.registrationNumber}</td>
              <td>{vehicleTypes.find(t => t.id === v.vehicleTypeId)?.typeName}</td>
              <td>{companies.find(c => c.id === v.companyId)?.companyName}</td>
              <td>{locations.find(l => l.id === v.currentLocationId)?.fullAddress}</td>
              <td>
                <button onClick={() => openModal(v)}>Edit</button>
                <button onClick={() => handleDelete(v.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>{selectedVehicle ? "Edit Vehicle" : "Add Vehicle"}</h3>
            <form onSubmit={handleSubmit}>
              <input type="text" name="brand" placeholder="Brand" defaultValue={selectedVehicle?.brand || ""} required />
              <input type="text" name="model" placeholder="Model" defaultValue={selectedVehicle?.model || ""} required />
              <input type="number" name="engineCapacityCc" placeholder="Engine Capacity" defaultValue={selectedVehicle?.engineCapacityCc || ""} required />
              <input type="text" name="vehiclePicture" placeholder="Vehicle Picture URL" defaultValue={selectedVehicle?.vehiclePicture || ""} />
              <select name="companyId" defaultValue={selectedVehicle?.companyId || ""} required>
                <option value="">Select Company</option>
                {companies.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
              </select>
              <select name="vehicleTypeId" defaultValue={selectedVehicle?.vehicleTypeId || ""} required>
                <option value="">Select Vehicle Type</option>
                {vehicleTypes.map(t => <option key={t.id} value={t.id}>{t.typeName}</option>)}
              </select>
              <input type="text" name="registrationNumber" placeholder="Registration Number" defaultValue={selectedVehicle?.registrationNumber || ""} required />
              <input type="number" name="capacityKg" placeholder="Capacity (Kg)" defaultValue={selectedVehicle?.capacityKg || ""} />
              <input type="number" name="manufactureYear" placeholder="Manufacture Year" defaultValue={selectedVehicle?.manufactureYear || ""} />
              <input type="date" name="lastInspectionDate" defaultValue={selectedVehicle?.lastInspectionDate?.split("T")[0] || ""} />
              <input type="date" name="insuranceExpiry" defaultValue={selectedVehicle?.insuranceExpiry?.split("T")[0] || ""} />
              <select name="currentLocationId" defaultValue={selectedVehicle?.currentLocationId || ""}>
                <option value="">Select Location</option>
                {locations.map(l => <option key={l.id} value={l.id}>{l.fullAddress}</option>)}
              </select>
              <input type="text" name="categories" placeholder="Categories" defaultValue={selectedVehicle?.categories || ""} />

              <div className="modal-actions">
                <button type="submit">{selectedVehicle ? "Save" : "Add"}</button>
                <button type="button" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;
