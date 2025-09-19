import { useState, useEffect } from "react";
import { vehicleService } from "../../services/vehicleService";
import { vehicleTypeService } from "../../services/vehicleTypeService";
import { companyService } from "../../services/companyService";
import { locationService } from "../../services/locationService";
import { X, Pencil, Trash2, ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";
import { useAuth } from "../../contexts/AuthContext";
import "./Managements.css";
import "./VehicleManagement.css";

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [locations, setLocations] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [pictureUrl, setPictureUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { user } = useAuth();

  const fetchData = async () => {
    setLoading(true);
    try {
      const vehicleResponse = await vehicleService.getAll({ search });
      const typeResponse = await vehicleTypeService.getAll();
      const companyResponse = await companyService.getAll();
      const locationResponse = await locationService.getAll();
      setVehicles(vehicleResponse.data);
      setFilteredVehicles(vehicleResponse.data);
      setVehicleTypes(typeResponse.data);
      setCompanies(companyResponse.data);
      setLocations(locationResponse.data);
      //toast.success("Vehicles loaded successfully!");
    } catch (error) {
      toast.error("Failed to load vehicles. Please try again.");
      console.error("Error fetching vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (vehicle = null) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedVehicle(null);
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const handleDelete = async (id, vehicleName) => {
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
        const response = await vehicleService.delete(id);
        if (response.success) {
          toast.success(`Vehicle ${vehicleName} deleted successfully!`);
        } else {
          toast.error(`Failed to delete vehicle. Message:${response.message}`);
        }
        await fetchData();
      } catch (error) {
        toast.error("Failed to delete vehicle. Please try again.");
        console.error("Error deleting vehicle:", error);
      } finally {
        setLoading(false);
      }
    };

    // Show confirmation toast
    toast.warn(
      <div>
        <p>
          Are you sure you want to delete vehicle <strong>{vehicleName}</strong>
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
      const form = e.target;
      let vehiclePicture = pictureUrl;

      // Upload vehicle picture ako postoji URL
      if (vehiclePicture) {
        const pictureResponse = await vehicleService.uploadFile(vehiclePicture);
        vehiclePicture = pictureResponse.data.url;
      }

      // Funkcija za formatiranje datuma u yyyy-MM-dd
      const formatDate = (dateString) => {
        if (!dateString) return null;
        const d = new Date(dateString);
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${d.getFullYear()}-${month}-${day}`;
      };

      const formData = {
        brand: form.brand.value,
        model: form.model.value,
        engineCapacityCc: Number(form.engineCapacityCc.value),
        vehiclePicture,
        companyId: +user.companyId,
        vehicleTypeId: Number(form.vehicleTypeId.value),
        registrationNumber: form.registrationNumber.value,
        capacityKg: Number(form.capacityKg.value),
        manufactureYear: Number(form.manufactureYear.value),
        lastInspectionDate: formatDate(form.lastInspectionDate.value),
        insuranceExpiry: formatDate(form.insuranceExpiry.value),
        currentLocationId: Number(form.currentLocationId.value),
        categories: form.categories.value,
      };

      if (selectedVehicle) {
        const response = await vehicleService.update(
          selectedVehicle.id,
          formData
        );
        if (!response.success) {
          toast.error(`Failed to update vehicle. Message:${response.message}`);
        } else {
          toast.success(
            `Vehicle ${formData.brand} ${formData.model} updated successfully!`
          );
        }
      } else {
        const response = await vehicleService.create(formData);
        if (!response.success) {
          toast.error(`Failed to create vehicle. Message:${response.message}`);
        } else {
          toast.success(
            `Vehicle ${formData.brand} ${formData.model} created successfully!`
          );
        }
      }

      await fetchData();
      closeModal();
    } catch (error) {
      toast.error("Failed to save vehicle. Please try again.");
      console.error("Error saving vehicle:", error);
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    const filtered = vehicles.filter((vehicle) => {
      return (
        vehicle.brand.toLowerCase().includes(e.target.value.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(e.target.value.toLowerCase()) ||
        vehicle.registrationNumber
          .toLowerCase()
          .includes(e.target.value.toLowerCase())
      );
    });
    setCurrentPage(1);
    setFilteredVehicles(filtered);
  };
  // Pagination calculations
  const totalPages = Math.ceil(filteredVehicles.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedVehicles = filteredVehicles.slice(startIndex, endIndex);

  // Reset to first page if current page is out of bounds
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);
  const handleFileChange = (e) => {
    setPictureUrl(e.target.files[0]);
  };

  if (loading && !isSubmitting) {
    return <Loader />;
  }
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };
  return (
    <div className="management-container">
      <div className="management-header">
        <div className="header-content">
          <h2 className="header-title">Vehicle Management</h2>
          <p className="header-subtitle">
            Manage your fleet vehicles and their information
          </p>
        </div>
        <div className="header-actions">
          <input
            type="text"
            placeholder="Search vehicles by brand, model, or registration..."
            value={search}
            onChange={(e) => handleSearch(e)}
            className="search-input"
          />
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="page-size-select"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
          {user.companyType === "Carrier" && (
            <button onClick={() => openModal()} className="primary-btn">
              Add Vehicle ➕
            </button>
          )}
        </div>
      </div>

      <div className="vehicles-grid">
        {paginatedVehicles.map((vehicle) => (
          <div key={vehicle.id} className="vehicle-card">
            <div className="vehicle-image-container">
              <img
                src={
                  vehicle.vehiclePicture ||
                  "https://t4.ftcdn.net/jpg/16/24/39/73/360_F_1624397305_9anhxAqBjO0u24bLzRnOe9l97SWjaPXU.jpg"
                }
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="vehicle-image"
                onError={(e) => {
                  e.target.src =
                    "https://t4.ftcdn.net/jpg/16/24/39/73/360_F_1624397305_9anhxAqBjO0u24bLzRnOe9l97SWjaPXU.jpg";
                }}
              />
              <div className="vehicle-type-badge">
                {vehicle.vehicleTypeName}
              </div>
            </div>

            <div className="vehicle-info">
              <div className="vehicle-header">
                <h3 className="vehicle-title">
                  {vehicle.brand} {vehicle.model}
                </h3>
                <span className="vehicle-year">{vehicle.manufactureYear}</span>
              </div>

              <div className="vehicle-details">
                <div className="detail-row">
                  <span className="detail-label">Registration:</span>
                  <span className="detail-value">
                    {vehicle.registrationNumber}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Company:</span>
                  <span className="detail-value">{vehicle.companyName}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Location:</span>
                  <span className="detail-value">
                    {vehicle.currentLocationName}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Engine:</span>
                  <span className="detail-value">
                    {vehicle.engineCapacityCc} cc
                  </span>
                </div>
                {vehicle.capacityKg && (
                  <div className="detail-row">
                    <span className="detail-label">Capacity:</span>
                    <span className="detail-value">
                      {vehicle.capacityKg} kg
                    </span>
                  </div>
                )}
              </div>

              <div className="vehicle-dates">
                {vehicle.lastInspectionDate && (
                  <div className="date-info">
                    <span className="date-label">Last Inspection:</span>
                    <span className="date-value">
                      {new Date(
                        vehicle.lastInspectionDate
                      ).toLocaleDateString()}
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

            {user.companyType === "Carrier" && (
              <div className="vehicle-actions">
                <button
                  className="edit-button"
                  onClick={() => openModal(vehicle)}
                >
                  <Pencil size={16} />
                </button>
                <button
                  className="delete-button"
                  onClick={() =>
                    handleDelete(
                      vehicle.id,
                      `${vehicle.brand} ${vehicle.model}`
                    )
                  }
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredVehicles.length === 0 && !loading && (
        <div className="empty-state">
          <div className="empty-icon">🚗</div>
          <h3>No vehicles found</h3>
          <p>Start by adding your first vehicle to the fleet</p>
          {user.companyType === "Carrier" && (
            <button className="empty-add-button" onClick={() => openModal()}>
              Add Vehicle
            </button>
          )}
        </div>
      )}
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination-info">
            <span>
              Showing {paginatedVehicles.length === 0 ? 0 : startIndex + 1}-
              {Math.min(endIndex, filteredVehicles.length)} of{" "}
              {filteredVehicles.length} vehicles
            </span>
          </div>
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ArrowLeftIcon size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`pagination-btn ${
                  currentPage === i + 1 ? "pagination-active" : ""
                }`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ArrowRightIcon size={16} />
            </button>
          </div>
        </div>
      )}
      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedVehicle ? "Edit Vehicle" : "Add New Vehicle"}</h3>
              <button
                type="button"
                onClick={closeModal}
                className="modal-close-btn"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
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
                  <label htmlFor="registrationNumber">
                    Registration Number
                  </label>
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
                  <label htmlFor="vehicleTypeId">Vehicle Type</label>
                  <select
                    name="vehicleTypeId"
                    id="vehicleTypeId"
                    defaultValue={selectedVehicle?.vehicleTypeId || ""}
                    required
                  >
                    <option value="">Select Vehicle Type</option>
                    {vehicleTypes.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.typeName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="currentLocationId">Current Location</label>
                  <select
                    name="currentLocationId"
                    id="currentLocationId"
                    defaultValue={selectedVehicle?.currentLocationId || ""}
                  >
                    <option value="">Select Location</option>
                    {locations.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.fullAddress}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="lastInspectionDate">
                    Last Inspection Date
                  </label>
                  <input
                    type="date"
                    id="lastInspectionDate"
                    name="lastInspectionDate"
                    defaultValue={
                      selectedVehicle?.lastInspectionDate?.split("T")[0] || ""
                    }
                    max={
                      new Date(Date.now() - 60 * 60 * 1000)
                        .toISOString()
                        .split("T")[0]
                    }
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="insuranceExpiry">Insurance Expiry</label>
                  <input
                    type="date"
                    id="insuranceExpiry"
                    name="insuranceExpiry"
                    defaultValue={
                      selectedVehicle?.insuranceExpiry?.split("T")[0] || ""
                    }
                    min={
                      new Date(Date.now() + 60 * 60 * 1000)
                        .toISOString()
                        .split("T")[0]
                    }
                  />
                </div>

                <div className="file-input-wrapper">
                  <label htmlFor="vehiclePicture">
                    {pictureUrl
                      ? `Selected: ${pictureUrl.name}`
                      : "Select Picture"}
                  </label>
                  <input
                    type="file"
                    id="vehiclePicture"
                    name="vehiclePicture"
                    onChange={handleFileChange}
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
                    ? selectedVehicle
                      ? "Updating..."
                      : "Creating..."
                    : selectedVehicle
                    ? "Save Changes"
                    : "Add Vehicle"}
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
