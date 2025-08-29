import { useState, useEffect } from "react";
import { routePriceService } from "../../services/routePriceService";
import { routeService } from "../../services/routeService";
import { vehicleTypeService } from "../../services/vehicleTypeService";
import Loader from "../Loader/Loader";
import "./Managements.css";

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
      const [routePricesResponse, routesResponse, vehicleTypesResponse] = await Promise.all([
        routePriceService.getAll({ search }),
        routeService.getAll(),
        vehicleTypeService.getAll()
      ]);
      
      setRoutePrices(routePricesResponse.data);
      setRoutes(routesResponse.data);
      setVehicleTypes(vehicleTypesResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter route prices on frontend
  const filteredRoutePrices = routePrices.filter((rp) =>
    rp.vehicleTypeName?.toLowerCase().includes(search.toLowerCase()) ||
    rp.routeId?.toString().includes(search.toLowerCase())
  );

  const openModal = (routePrice = null) => {
    setSelectedRoutePrice(routePrice);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRoutePrice(null);
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this route price?")) {
      try {
        setLoading(true);
        await routePriceService.delete(id);
        await fetchData();
      } catch (error) {
        console.error("Error deleting route price:", error);
      } finally {
        setLoading(false);
      }
    }
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
        await routePriceService.update(selectedRoutePrice.id, formData);
      } else {
        await routePriceService.create(formData);
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
    const route = routes.find(r => r.id === routeId);
    return route ? `${route.startLocationName || route.startLocationId} → ${route.endLocationName || route.endLocationId}` : `Route ${routeId}`;
  };

  return (
    <div className="management-container">
      <div className="management-header">
        <input
          type="text"
          placeholder="Search route prices by vehicle type or route..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => openModal()}>Add Route Price</button>
      </div>

      {loading && <Loader />}

      {!loading && (
        <>
          <table className="management-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Route</th>
                <th>Vehicle Type</th>
                <th>Price per Km</th>
                <th>Minimum Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoutePrices.map((rp) => (
                <tr key={rp.id}>
                  <td>{rp.id}</td>
                  <td>{getRouteName(rp.routeId)}</td>
                  <td>{rp.vehicleTypeName}</td>
                  <td>${rp.pricePerKm}</td>
                  <td>${rp.minimumPrice}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        onClick={() => openModal(rp)}
                        className="action-btn activate-btn"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(rp.id)}
                        className="action-btn delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredRoutePrices.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">💰</div>
              <h3>No route prices found</h3>
              <p>Start by adding your first route price to the system</p>
              <button className="empty-add-button" onClick={() => openModal()}>
                Add Route Price
              </button>
            </div>
          )}
        </>
      )}

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>{selectedRoutePrice ? "Edit Route Price" : "Add Route Price"}</h3>
            <form onSubmit={handleSubmit}>
              <select 
                name="routeId" 
                defaultValue={selectedRoutePrice?.routeId || ""} 
                required
              >
                <option value="">Select Route</option>
                {routes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {getRouteName(r.id)}
                  </option>
                ))}
              </select>

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

              <input
                type="number"
                step="0.01"
                name="pricePerKm"
                placeholder="Price per Km"
                defaultValue={selectedRoutePrice?.pricePerKm || ""}
                required
              />
              
              <input
                type="number"
                step="0.01"
                name="minimumPrice"
                placeholder="Minimum Price"
                defaultValue={selectedRoutePrice?.minimumPrice || ""}
                required
              />

              <div className="modal-actions">
                <button type="submit" disabled={loading}>
                  {loading ? "Saving..." : (selectedRoutePrice ? "Save" : "Add")}
                </button>
                <button type="button" onClick={closeModal} disabled={loading}>
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

export default RoutePriceManagement;