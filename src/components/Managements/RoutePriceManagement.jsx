import { useState, useEffect } from "react";
import { routePriceService } from "../../services/routePriceService";
import { routeService } from "../../services/routeService";
import { vehicleTypeService } from "../../services/vehicleTypeService";
import { X, Trash2, Pencil } from "lucide-react";
import Loader from "../Loader/Loader";
import "./Managements.css";
import { toast } from "react-toastify";
const RoutePriceManagement = () => {
  const [routePrices, setRoutePrices] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRoutePrice, setSelectedRoutePrice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [routePricesResponse, routesResponse, vehicleTypesResponse] =
        await Promise.all([
          routePriceService.getAll({ search }),
          routeService.getAll(),
          vehicleTypeService.getAll(),
        ]);

      setRoutePrices(routePricesResponse.data);
      setRoutes(routesResponse.data);
      setVehicleTypes(vehicleTypesResponse.data);
    } catch (error) {
      toast.error("Failed to load route prices. Please try again.");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter route prices on frontend
  const filteredRoutePrices = routePrices.filter(
    (rp) =>
      rp.vehicleTypeName?.toLowerCase().includes(search.toLowerCase()) ||
      rp.routeId?.toString().includes(search.toLowerCase())
  );

  const openModal = (routePrice = null) => {
    setSelectedRoutePrice(routePrice);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedRoutePrice(null);
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
        const response = await routePriceService.delete(id);
        if (response.success) {
          toast.success(`Route price ${id} deleted successfully!`);
        } else {
          toast.error(
            `Failed to delete route price. Message: ${response.message}`
          );
        }
        await fetchData();
      } catch (error) {
        toast.error("Failed to delete route price. Please try again.");
        console.error("Error deleting route price:", error);
      } finally {
        setLoading(false);
      }
    };

    // Show confirmation toast
    toast.warn(
      <div>
        <p>
          Are you sure you want to delete route price <strong>{id}</strong>?
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
    setLoading(true);

    try {
      const form = e.target;
      const formData = {
        routeId: Number(form.routeId.value),
        vehicleTypeId: Number(form.vehicleTypeId.value),
        pricePerKm: Number(form.pricePerKm.value),
        minimumPrice: Number(form.minimumPrice.value),
      };

      if (selectedRoutePrice) {
        const response = await routePriceService.update(
          selectedRoutePrice.id,
          formData
        );
        if (response.success) {
          toast.success(
            `Route price ${selectedRoutePrice.id} updated successfully!`
          );
        } else {
          toast.error(
            `Failed to update route price. Message: ${response.message}`
          );
        }
      } else {
        const response = await routePriceService.create(formData);
        if (response.success) {
          toast.success(`Route price created successfully!`);
        } else {
          toast.error(
            `Failed to create route price. Message: ${response.message}`
          );
        }
      }

      await fetchData();
      closeModal();
    } catch (error) {
      console.error("Error saving route price:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRouteName = (routeId) => {
    const route = routes.find((r) => r.id === routeId);
    return route
      ? `${route.startLocationName || route.startLocationId} → ${
          route.endLocationName || route.endLocationId
        }`
      : `Route ${routeId}`;
  };

  if (loading) return <Loader />;

  return (
    <div className="management-container">
      <div className="management-header">
        <div className="header-content">
          <h2 className="header-title">Route Price Management</h2>
          <p className="header-subtitle">
            Manage pricing for different routes and vehicle types
          </p>
        </div>
        <div className="header-actions">
          <input
            type="text"
            placeholder="Search route prices by vehicle type or route..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button onClick={() => openModal()} className="primary-btn">
            Add Route Price
➕          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="management-table">
          <thead>
            <tr>
              {/* <th>ID</th> */}
              <th>Route</th>
              <th>Vehicle Type</th>
              <th>Price per Km</th>
              <th>Minimum Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoutePrices.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-row">
                  <div className="empty-state">
                    <p>No route prices found matching your search criteria.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredRoutePrices.map((rp) => (
                <tr key={rp.id} className="table-row">
                  {/* <td>{rp.id}</td> */}
                  <td>{getRouteName(rp.routeId)}</td>
                  <td>
                    <span className="role-badge">{rp.vehicleTypeName}</span>
                  </td>
                  <td className="price-cell">${rp.pricePerKm}</td>
                  <td className="price-cell">${rp.minimumPrice}</td>
                  <td className="actions-cell">
                    <div className="action-buttons">
                      <button
                        onClick={() => openModal(rp)}
                        className="action-btn activate-btn"
                        title="Edit route price"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(rp.id)}
                        className="action-btn delete-btn"
                        title="Delete route price"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
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
                {selectedRoutePrice ? "Edit Route Price" : "Add Route Price"}
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
                  <label htmlFor="routeId">Route:</label>
                  <select
                    name="routeId"
                    defaultValue={selectedRoutePrice?.routeId || ""}
                    required
                  >
                    <option value="">Select Route</option>
                    {routes.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.id}: {r.startLocationName} - {r.endLocationName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-section">
                <div className="form-group">
                  <label htmlFor="vehicleTypeId">Vehicle Type:</label>
                  <select
                    name="vehicleTypeId"
                    defaultValue={selectedRoutePrice?.vehicleTypeId || ""}
                    required
                  >
                    <option value="">Select Vehicle Type</option>
                    {vehicleTypes.map((vt) => (
                      <option key={vt.id} value={vt.id}>
                        {vt.typeName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-section">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="pricePerKm">Price per Km:</label>
                    <input
                      type="number"
                      step="0.01"
                      name="pricePerKm"
                      placeholder="Price per Km"
                      defaultValue={selectedRoutePrice?.pricePerKm || ""}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="minimumPrice">Minimum Price:</label>
                    <input
                      type="number"
                      step="0.01"
                      name="minimumPrice"
                      placeholder="Minimum Price"
                      defaultValue={selectedRoutePrice?.minimumPrice || ""}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={closeModal}
                  className="cancel-btn"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Saving..." : selectedRoutePrice ? "Save" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutePriceManagement;
