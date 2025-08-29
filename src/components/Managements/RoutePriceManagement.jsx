import { useState, useEffect } from "react";
import { routePriceService } from "../../services/routePriceService";
import { routeService } from "../../services/routeService";
import { vehicleTypeService } from "../../services/vehicleTypeService";
import "./Managements.css";

const RoutePriceManagement = () => {
  const [routePrices, setRoutePrices] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRoutePrice, setSelectedRoutePrice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const routePricesResponse = await routePriceService.getAll({ search });
      const routesResponse = await routeService.getAll();
      const vehicleTypesResponse = await vehicleTypeService.getAll();

      setRoutePrices(routePricesResponse.data);
      setRoutes(routesResponse.data);
      setVehicleTypes(vehicleTypesResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);

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
        await routePriceService.delete(id);
        fetchData();
      } catch (error) {
        console.error("Error deleting route price:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = {
      routeId: Number(form.routeId.value),
      vehicleTypeId: Number(form.vehicleTypeId.value),
      pricePerKm: Number(form.pricePerKm.value),
      minimumPrice: Number(form.minimumPrice.value),
    };

    try {
      if (selectedRoutePrice) {
        await routePriceService.update(selectedRoutePrice.id, formData);
      } else {
        await routePriceService.create(formData);
      }
      fetchData();
      closeModal();
    } catch (error) {
      console.error("Error saving route price:", error);
    }
  };

  return (
    <div className="management-container">
      <div className="management-header">
        <input
          type="text"
          placeholder="Search route prices..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => openModal()}>Add Route Price</button>
      </div>

      <table className="management-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Route ID</th>
            <th>Vehicle Type</th>
            <th>Price per Km</th>
            <th>Minimum Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {routePrices.map((rp) => (
            <tr key={rp.id}>
              <td>{rp.id}</td>
              <td>{rp.routeId}</td>
              <td>{rp.vehicleTypeName}</td>
              <td>{rp.pricePerKm}</td>
              <td>{rp.minimumPrice}</td>
              <td>
                <button onClick={() => openModal(rp)}>Edit</button>
                <button onClick={() => handleDelete(rp.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>{selectedRoutePrice ? "Edit Route Price" : "Add Route Price"}</h3>
            <form onSubmit={handleSubmit}>
              <label htmlFor="routeId">Route ID:</label>
              <select name="routeId" defaultValue={selectedRoutePrice?.routeId || ""} required>
                <option value="">Select Route</option>
                {routes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.id} : {r.startLocationName} - {r.endLocationName}
                  </option>
                ))}
              </select>
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
                <label htmlFor="pricePerKm">Price per Km:</label>
              <input
                type="number"
                name="pricePerKm"
                placeholder="Price per Km"
                defaultValue={selectedRoutePrice?.pricePerKm || ""}
                required
              />
              <label htmlFor="minimumPrice">Minimum Price:</label>
              <input
                type="number"
                name="minimumPrice"
                placeholder="Minimum Price"
                defaultValue={selectedRoutePrice?.minimumPrice || ""}
                required
              />

              <div className="modal-actions">
                <button type="submit">{selectedRoutePrice ? "Save" : "Add"}</button>
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

export default RoutePriceManagement;
