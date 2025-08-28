import { useState, useEffect } from "react";
import { routeService } from "../../services/routeService";
import { locationService } from "../../services/locationService"; // za start i end lokacije
import "./Managements.css";

const RouteManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [locations, setLocations] = useState([]);

  const fetchRoutes = async () => {
    try {
      const response = await routeService.getAll({ search });
      setRoutes(response.data);
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await locationService.getAll();
      setLocations(response.data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  useEffect(() => {
    fetchRoutes();
    fetchLocations();
  }, [search]);

  const openModal = (route = null) => {
    setSelectedRoute(route);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRoute(null);
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this route?")) {
      try {
        await routeService.delete(id);
        fetchRoutes();
      } catch (error) {
        console.error("Error deleting route:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = {
      companyId: Number(form.companyId.value),
      startLocationId: Number(form.startLocationId.value),
      endLocationId: Number(form.endLocationId.value),
      isActive: form.isActive.checked,
      availableFrom: form.availableFrom.value,
      availableTo: form.availableTo.value,
    };

    try {
      if (selectedRoute) {
        await routeService.update(selectedRoute.id, formData);
      } else {
        await routeService.create(formData);
      }
      fetchRoutes();
      closeModal();
    } catch (error) {
      console.error("Error saving route:", error);
    }
  };

  return (
    <div className="management-container">
      <div className="management-header">
        <input
          type="text"
          placeholder="Search routes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => openModal()}>Add Route</button>
      </div>

      <table className="management-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Company ID</th>
            <th>Start Location</th>
            <th>End Location</th>
            <th>Active</th>
            <th>Available From</th>
            <th>Available To</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.companyId}</td>
              <td>{r.startLocationId}</td>
              <td>{r.endLocationId}</td>
              <td>{r.isActive ? "Yes" : "No"}</td>
              <td>{r.availableFrom}</td>
              <td>{r.availableTo}</td>
              <td>
                <button onClick={() => openModal(r)}>Edit</button>
                <button onClick={() => handleDelete(r.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>{selectedRoute ? "Edit Route" : "Add Route"}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="number"
                name="companyId"
                defaultValue={selectedRoute?.companyId || ""}
                placeholder="Company ID"
                required
              />
              <select name="startLocationId" defaultValue={selectedRoute?.startLocationId || ""} required>
                <option value="">Select Start Location</option>
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.city} - {l.country}
                  </option>
                ))}
              </select>

              <select name="endLocationId" defaultValue={selectedRoute?.endLocationId || ""} required>
                <option value="">Select End Location</option>
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.city} - {l.country}
                  </option>
                ))}
              </select>

              <label>
                Active:
                <input
                  type="checkbox"
                  name="isActive"
                  defaultChecked={selectedRoute?.isActive || false}
                />
              </label>

              <input
                type="datetime-local"
                name="availableFrom"
                defaultValue={selectedRoute?.availableFrom || ""}
                required
              />
              <input
                type="datetime-local"
                name="availableTo"
                defaultValue={selectedRoute?.availableTo || ""}
                required
              />

              <div className="modal-actions">
                <button type="submit">{selectedRoute ? "Save" : "Add"}</button>
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

export default RouteManagement;
