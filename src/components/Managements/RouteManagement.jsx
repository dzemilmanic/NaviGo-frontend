import { useState, useEffect } from "react";
import { routeService } from "../../services/routeService";
import { locationService } from "../../services/locationService";
import { companyService } from "../../services/companyService";
import { X } from "lucide-react";
import Loader from "../Loader/Loader";
import "./Managements.css";
import { useAuth } from "../../contexts/AuthContext";

const RouteManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [locations, setLocations] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchRoutes = async () => {
    setLoading(true);
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
    fetchRoutes();
  }, []);

  const openModal = (route = null) => {
    setSelectedRoute(route);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedRoute(null);
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this route?")) {
      setLoading(true);
      try {
        await routeService.delete(id);
        await fetchRoutes();
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

    try {
      if (selectedRoute) {
        await routeService.update(selectedRoute.id, formData);
      } else {
        await routeService.create(formData);
      }

      await fetchRoutes();
      closeModal();
    } catch (error) {
      console.error("Error saving route:", error);
    } finally {
      setLoading(false);
    }
  };

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
    if (!dateTimeString) return "—";
    return new Date(dateTimeString).toLocaleString();
  };

  if (loading) return <Loader />;

  return (
    <div className="management-container">
      <div className="management-header">
        <div className="header-content">
          <h2 className="header-title">Route Management</h2>
          <p className="header-subtitle">Manage transportation routes and schedules</p>
        </div>
        <div className="header-actions">
          <input
            type="text"
            placeholder="Search routes by location or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button onClick={() => openModal()} className="primary-btn">
            Add Route
          </button>
        </div>
      </div>

      <div className="table-container">
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
            {filteredRoutes.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty-row">
                  <div className="empty-state">
                    <p>No routes found matching your search criteria.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredRoutes.map((r) => (
                <tr key={r.id} className="table-row">
                  <td>{r.id}</td>
                  <td className="company-cell">
                    {r.companyName || getCompanyName(r.companyId)}
                  </td>
                  <td>{r.startLocationName || getLocationName(r.startLocationId)}</td>
                  <td>{r.endLocationName || getLocationName(r.endLocationId)}</td>
                  <td className="status-cell">
                    <span className={`status-badge ${r.isActive ? 'status-active' : 'status-inactive'}`}>
                      {r.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>{formatDateTime(r.availableFrom)}</td>
                  <td>{formatDateTime(r.availableTo)}</td>
                  <td className="actions-cell">
                    <div className="action-buttons">
                      <button 
                        onClick={() => openModal(r)}
                        className="action-btn activate-btn"
                        title="Edit route"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(r.id)}
                        className="action-btn delete-btn"
                        title="Delete route"
                      >
                        Delete
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
              <h3>{selectedRoute ? "Edit Route" : "Add Route"}</h3>
              <button
                type="button"
                onClick={closeModal}
                className="modal-close-btn"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-section">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="startLocationId">Start Location:</label>
                    <select name="startLocationId" defaultValue={selectedRoute?.startLocationId || ""} required>
                      <option value="">Select Start Location</option>
                      {locations.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.city} - {l.country}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="endLocationId">End Location:</label>
                    <select name="endLocationId" defaultValue={selectedRoute?.endLocationId || ""} required>
                      <option value="">Select End Location</option>
                      {locations.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.city} - {l.country}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="availableFrom">Available From:</label>
                    <input
                      type="datetime-local"
                      name="availableFrom"
                      defaultValue={selectedRoute?.availableFrom?.slice(0, 16) || ""}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="availableTo">Available To:</label>
                    <input
                      type="datetime-local"
                      name="availableTo"
                      defaultValue={selectedRoute?.availableTo?.slice(0, 16) || ""}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isActive"
                      defaultChecked={selectedRoute?.isActive || false}
                    />
                    <span>Active Route</span>
                  </label>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="cancel-btn" disabled={loading}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Saving..." : (selectedRoute ? "Save" : "Add")}
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