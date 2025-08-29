import { useState, useEffect } from "react";
import { vehicleService } from "../../services/vehicleService";
import { vehicleTypeService } from "../../services/vehicleTypeService";
import { companyService } from "../../services/companyService";
import { locationService } from "../../services/locationService";
import Loader from "../Loader/Loader";
// import "./Managements.css";
import "./VehicleManagement.css";
const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [locations, setLocations] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading,setLoading] = useState(false);
  const fetchData = async () => {
    setLoading(true);
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
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
    <div className="vehicle-management">
      <div className="page-header">
        <h1>Vehicle Management</h1>
        <div className="header-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search vehicles by brand, model, or registration..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="add-button" onClick={() => openModal()}>
            + Add Vehicle
          </button>
        </div>
      </div>

      <div className="vehicles-grid">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="vehicle-card">
            <div className="vehicle-image-container">
              <img
                src={vehicle.vehiclePicture || 'https://t4.ftcdn.net/jpg/16/24/39/73/360_F_1624397305_9anhxAqBjO0u24bLzRnOe9l97SWjaPXU.jpg'}
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="vehicle-image"
                onError={(e) => {
                  e.target.src = 'https://t4.ftcdn.net/jpg/16/24/39/73/360_F_1624397305_9anhxAqBjO0u24bLzRnOe9l97SWjaPXU.jpg';
                }}
              />
              <div className="vehicle-type-badge">
                {vehicle.vehicleTypeName}
              </div>
            </div>
            
            <div className="vehicle-info">
              <div className="vehicle-header">
                <h3 className="vehicle-title">{vehicle.brand} {vehicle.model}</h3>
                <span className="vehicle-year">{vehicle.manufactureYear}</span>
              </div>
              
              <div className="vehicle-details">
                <div className="detail-row">
                  <span className="detail-label">Registration:</span>
                  <span className="detail-value">{vehicle.registrationNumber}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Company:</span>
                  <span className="detail-value">{vehicle.companyName}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Location:</span>
                  <span className="detail-value">{vehicle.currentLocationName}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Engine:</span>
                  <span className="detail-value">{vehicle.engineCapacityCc} cc</span>
                </div>
                {vehicle.capacityKg && (
                  <div className="detail-row">
                    <span className="detail-label">Capacity:</span>
                    <span className="detail-value">{vehicle.capacityKg} kg</span>
                  </div>
                )}
              </div>
              
              <div className="vehicle-dates">
                {vehicle.lastInspectionDate && (
                  <div className="date-info">
                    <span className="date-label">Last Inspection:</span>
                    <span className="date-value">
                      {new Date(vehicle.lastInspectionDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {vehicle.insuranceExpiry && (
                  <div className="date-info">
                    <span className="date-label">Insurance Expires:</span>
                    <span className="date-value">
                      {new Date(vehicle.insuranceExpiry).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="vehicle-actions">
              <button className="edit-button" onClick={() => openModal(vehicle)}>
                Edit
              </button>
              <button className="delete-button" onClick={() => handleDelete(vehicle.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
        {loading && <Loader />}
      {vehicles.length === 0 && !loading && (
        <div className="empty-state">
          <div className="empty-icon">🚗</div>
          <h3>No vehicles found</h3>
          <p>Start by adding your first vehicle to the fleet</p>
          <button className="empty-add-button" onClick={() => openModal()}>
            Add Vehicle
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedVehicle ? "Edit Vehicle" : "Add New Vehicle"}</h3>
              <button className="close-button" onClick={closeModal}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="vehicle-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="brand">Brand</label>
                  <input 
                    type="text" 
                    id="brand"
                    name="brand" 
                    placeholder="Enter vehicle brand" 
                    defaultValue={selectedVehicle?.brand || ""} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="model">Model</label>
                  <input 
                    type="text" 
                    id="model"
                    name="model" 
                    placeholder="Enter vehicle model" 
                    defaultValue={selectedVehicle?.model || ""} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="registrationNumber">Registration Number</label>
                  <input 
                    type="text" 
                    id="registrationNumber"
                    name="registrationNumber" 
                    placeholder="Enter registration number" 
                    defaultValue={selectedVehicle?.registrationNumber || ""} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="engineCapacityCc">Engine Capacity (cc)</label>
                  <input 
                    type="number" 
                    id="engineCapacityCc"
                    name="engineCapacityCc" 
                    placeholder="Enter engine capacity" 
                    defaultValue={selectedVehicle?.engineCapacityCc || ""} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="manufactureYear">Manufacture Year</label>
                  <input 
                    type="number" 
                    id="manufactureYear"
                    name="manufactureYear" 
                    placeholder="Enter manufacture year" 
                    defaultValue={selectedVehicle?.manufactureYear || ""} 
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="capacityKg">Capacity (kg)</label>
                  <input 
                    type="number" 
                    id="capacityKg"
                    name="capacityKg" 
                    placeholder="Enter capacity in kg" 
                    defaultValue={selectedVehicle?.capacityKg || ""} 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="companyId">Company</label>
                  <select name="companyId" id="companyId" defaultValue={selectedVehicle?.companyId || ""} required>
                    <option value="">Select Company</option>
                    {companies.map(c => (
                      <option key={c.id} value={c.id}>{c.companyName}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="vehicleTypeId">Vehicle Type</label>
                  <select name="vehicleTypeId" id="vehicleTypeId" defaultValue={selectedVehicle?.vehicleTypeId || ""} required>
                    <option value="">Select Vehicle Type</option>
                    {vehicleTypes.map(t => (
                      <option key={t.id} value={t.id}>{t.typeName}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="currentLocationId">Current Location</label>
                  <select name="currentLocationId" id="currentLocationId" defaultValue={selectedVehicle?.currentLocationId || ""}>
                    <option value="">Select Location</option>
                    {locations.map(l => (
                      <option key={l.id} value={l.id}>{l.fullAddress}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="lastInspectionDate">Last Inspection Date</label>
                  <input 
                    type="date" 
                    id="lastInspectionDate"
                    name="lastInspectionDate" 
                    defaultValue={selectedVehicle?.lastInspectionDate?.split("T")[0] || ""} 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="insuranceExpiry">Insurance Expiry</label>
                  <input 
                    type="date" 
                    id="insuranceExpiry"
                    name="insuranceExpiry" 
                    defaultValue={selectedVehicle?.insuranceExpiry?.split("T")[0] || ""} 
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="vehiclePicture">Vehicle Picture URL</label>
                  <input 
                    type="text" 
                    id="vehiclePicture"
                    name="vehiclePicture" 
                    placeholder="Enter vehicle picture URL" 
                    defaultValue={selectedVehicle?.vehiclePicture || ""} 
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="categories">Categories</label>
                  <input 
                    type="text" 
                    id="categories"
                    name="categories" 
                    placeholder="Enter categories (comma separated)" 
                    defaultValue={selectedVehicle?.categories || ""} 
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="submit" className="submit-button">
                  {selectedVehicle ? "Save Changes" : "Add Vehicle"}
                </button>
                <button type="button" className="cancel-button" onClick={closeModal}>
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

export default VehicleManagement;