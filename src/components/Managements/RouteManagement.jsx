import { useState, useEffect } from "react";
import { routeService } from "../../services/routeService";
import { locationService } from "../../services/locationService";
import { companyService } from "../../services/companyService";
import Loader from "../Loader/Loader";
import "./Managements.css";
import { useAuth } from "../../contexts/AuthContext";

const RouteManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [locations, setLocations] = useState([]);
  const {user} = useAuth();
  const fetchRoutes = async () => {
    try {
      const [routeResponse, locationResponse, companyResponse] = await Promise.all([
        routeService.getAll(),
        locationService.getAll(),
        companyService.getAll()
      ]);
      setRoutes(routeResponse.data);
      setLocations(locationResponse.data);
      setCompanies(companyResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
        setLoading(true);
        await routeService.delete(id);
        await fetchData();
      } catch (error) {
        console.error("Error deleting route:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    const formData = {
      companyId: +user.companyId,
      startLocationId: Number(form.startLocationId.value),
      endLocationId: Number(form.endLocationId.value),
      isActive: form.isActive.checked,
      availableFrom: form.availableFrom.value,
      availableTo: form.availableTo.value,
    };

      if (selectedRoute) {
        await routeService.update(selectedRoute.id, formData);
      } else {
        await routeService.create(formData);
      }
      
      await fetchData();
      closeModal();
    } catch (error) {
      console.error("Error saving route:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter routes on frontend
  const filteredRoutes = routes.filter((r) =>
    r.startLocationName?.toLowerCase().includes(search.toLowerCase()) ||
    r.endLocationName?.toLowerCase().includes(search.toLowerCase()) ||
    r.companyName?.toLowerCase().includes(search.toLowerCase())
  );

  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.id === companyId);
    return company ? company.companyName : "Unknown Company";
  };

  const getLocationName = (locationId) => {
    const location = locations.find(l => l.id === locationId);
    return location ? `${location.city} - ${location.country}` : "Unknown Location";
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "-";
    return new Date(dateTimeString).toLocaleString();
  };

  return (
    <div className="management-container">
      <div className="management-header">
        <input
          type="text"
          placeholder="Search routes by location or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => openModal()}>Add Route</button>
      </div>

      {loading && <Loader />}

      {!loading && (
        <>
          <table className="management-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Company</th>
                <th>Start Location</th>
                <th>End Location</th>
                <th>Active</th>
                <th>Available From</th>
                <th>Available To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoutes.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.companyName || getCompanyName(r.companyId)}</td>
                  <td>{r.startLocationName || getLocationName(r.startLocationId)}</td>
                  <td>{r.endLocationName || getLocationName(r.endLocationId)}</td>
                  <td>
                    <span className={`status-badge ${r.isActive ? 'status-active' : 'status-inactive'}`}>
                      {r.isActive ? "Yes" : "No"}
                    </span>
                  </td>
                  <td>{formatDateTime(r.availableFrom)}</td>
                  <td>{formatDateTime(r.availableTo)}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        onClick={() => openModal(r)}
                        className="action-btn activate-btn"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(r.id)}
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

          {filteredRoutes.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🗺️</div>
              <h3>No routes found</h3>
              <p>Start by adding your first route to the system</p>
              <button className="empty-add-button" onClick={() => openModal()}>
                Add Route
              </button>
            </div>
          )}
        </>
      )}

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>{selectedRoute ? "Edit Route" : "Add Route"}</h3>
            <form onSubmit={handleSubmit}>
              <label htmlFor="startLocationId">Start Location:</label>
              <select name="startLocationId" defaultValue={selectedRoute?.startLocationId || ""} required>
                <option value="">Select Start Location</option>
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.city} - {l.country}
                  </option>
                ))}
              </select>
              <label htmlFor="endLocationId">End Location:</label>
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
                <label htmlFor="availableFrom">Available From:</label>
              <input
                type="datetime-local"
                name="availableFrom"
                placeholder="Available From"
                defaultValue={selectedRoute?.availableFrom?.slice(0, 16) || ""}
                required
              />
              <label htmlFor="availableTo">Available To:</label>
              <input
                type="datetime-local"
                name="availableTo"
                placeholder="Available To"
                defaultValue={selectedRoute?.availableTo?.slice(0, 16) || ""}
                required
              />

              <div className="modal-actions">
                <button type="submit" disabled={loading}>
                  {loading ? "Saving..." : (selectedRoute ? "Save" : "Add")}
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

export default RouteManagement;