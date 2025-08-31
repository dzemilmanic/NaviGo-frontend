import { useState, useEffect } from "react";
import { routeService } from "../../services/routeService";
import { companyService } from "../../services/companyService";
import { locationService } from "../../services/locationService";
import { X } from "lucide-react";
import Loader from "../Loader/Loader";
import "./Managements.css";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import LocationPicker from "../LocationPicker/LocationPicker";

const RouteManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  // Autocomplete states - inicijalizovano sa praznim nizovima
  const [startQuery, setStartQuery] = useState("");
  const [startResults, setStartResults] = useState([]);
  const [selectedStart, setSelectedStart] = useState(null);

  const [endQuery, setEndQuery] = useState("");
  const [endResults, setEndResults] = useState([]);
  const [selectedEnd, setSelectedEnd] = useState(null);

  // Location modal states
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [locationModalType, setLocationModalType] = useState(""); // 'start' or 'end'
  const [locationForm, setLocationForm] = useState({
    city: "",
    country: "",
    ZIP: "",
    latitude: "",
    longitude: "",
    fullAddress: "",
  });

  const { user } = useAuth();

  const openLocationModal = (type) => {
    setLocationModalType(type);
    setLocationForm({
      city: "",
      country: "",
      ZIP: "",
      latitude: "",
      longitude: "",
      fullAddress: "",
    });
    setIsLocationModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLocationModal = () => {
    setIsLocationModalOpen(false);
    setLocationModalType("");
    setLocationForm({
      city: "",
      country: "",
      ZIP: "",
      latitude: "",
      longitude: "",
      fullAddress: "",
    });
    document.body.style.overflow = "auto";
  };

  const handleLocationFormChange = (e) => {
    setLocationForm({
      ...locationForm,
      [e.target.name]: e.target.value,
    });
  };

  const fetchAddressFromCoords = async (lat, lng) => {
    const apiKey = import.meta.env.VITE_MAP_API_KEY;
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}&no_annotations=1&limit=1`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch address from OpenCage");

    const data = await res.json();
    const result = data.results[0];

    return {
      city:
        result.components.city ||
        result.components.town ||
        result.components.village ||
        result.components.county ||
        result.components.state ||
        "",
      country: result.components.country || "",
      zip: result.components.postcode || "",
      latitude: result.geometry.lat,
      longitude: result.geometry.lng,
      fullAddress: result.formatted,
    };
  };

  const handleDelete = async (id) => {
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
        const response = await routeService.delete(id);
        if (response.success)
          toast.success(`Route ${id} deleted successfully!`);
        else
          toast.error(`Failed to delete route. Message: ${response.message}`);
        await fetchRoutesAndCompanies();
      } catch (error) {
        toast.error("Failed to delete route. Please try again.");
        console.error("Error deleting route:", error);
      } finally {
        setLoading(false);
      }
    };

    toast.warn(
      <div>
        <p>
          Are you sure you want to delete route <strong>{id}</strong>?
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

  const handleLocationSearch = async (query, setResults) => {
    if (!query || query.length < 3) {
      setResults([]);
      return;
    }

    try {
      const apiKey = import.meta.env.VITE_MAP_API_KEY;
      const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        query
      )}&key=${apiKey}&no_annotations=1&limit=5`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch location from OpenCage");

      const data = await res.json();
      if (!data.results || data.results.length === 0) {
        setResults([]);
        return;
      }

      // Mapiramo rezultat u uniformni format za frontend
      const formattedResults = data.results.map((r) => ({
        display_name: r.formatted,
        lat: r.geometry.lat,
        lon: r.geometry.lng,
        city:
          r.components.city ||
          r.components.town ||
          r.components.village ||
          r.components.county ||
          r.components.state ||
          "Unknown city",
        country: r.components.country || "Unknown country",
        ZIP: r.components.postcode || "00000",
      }));

      setResults(formattedResults);
    } catch (err) {
      console.error("Location search error:", err);
      setResults([]);
    }
  };

  // Funkcija za dodavanje lokacije iz modal-a
  const handleLocationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Uvek koristimo validan payload
      const payload = {
        city: locationForm.city || "Unknown city",
        country: locationForm.country || "Unknown country",
        zip: locationForm.ZIP || "00000",
        latitude: parseFloat(locationForm.latitude),
        longitude: parseFloat(locationForm.longitude),
        fullAddress: locationForm.fullAddress,
      };

      const response = await locationService.create(payload);

      if (!response.success || !response.data?.id) {
        throw new Error(response.message || "Failed to create location");
      }

      const location = response.data;

      const newLocation = {
        place_id: location.id,
        display_name: location.fullAddress,
        lat: location.latitude,
        lon: location.longitude,
        city: location.city,
        country: location.country,
        ZIP: location.ZIP,
      };

      if (locationModalType === "start") {
        setSelectedStart(newLocation);
        setStartQuery(location.fullAddress);
        setStartResults([]);
      } else {
        setSelectedEnd(newLocation);
        setEndQuery(location.fullAddress);
        setEndResults([]);
      }

      toast.success("Location added successfully!");
      closeLocationModal();
    } catch (error) {
      toast.error(`Error creating location: ${error.message}`);
      console.error("Error creating location:", error);
    } finally {
      setLoading(false);
    }
  };

  // Funkcija za kreiranje ili update rute
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedStart || !selectedEnd) {
      toast.error("Please select both start and end locations.");
      return;
    }

    setLoading(true);

    try {
      const ensureLocation = async (loc) => {
        const payload = {
          city: loc.city || "Unknown city",
          country: loc.country || "Unknown country",
          zip: loc.ZIP || "00000",
          latitude: parseFloat(loc.lat),
          longitude: parseFloat(loc.lon),
          fullAddress: loc.display_name,
        };

        const response = await locationService.create(payload);
        if (!response.success || !response.data?.id) {
          throw new Error(response.message || "Failed to create/get location");
        }

        return response.data.id;
      };

      const startLocationId = await ensureLocation(selectedStart);
      const endLocationId = await ensureLocation(selectedEnd);

      const form = e.target;
      const formData = {
        companyId: +user.companyId,
        startLocationId,
        endLocationId,
        isActive: form.isActive.checked,
        availableFrom: form.availableFrom.value,
        availableTo: form.availableTo.value,
      };

      let response;
      if (selectedRoute) {
        response = await routeService.update(selectedRoute.id, formData);
        if (!response.success)
          toast.error(`Failed to update route. Message: ${response.message}`);
        else toast.success(`Route ${selectedRoute.id} updated successfully!`);
      } else {
        response = await routeService.create(formData);
        if (!response.success)
          toast.error(`Failed to create route. Message: ${response.message}`);
        else toast.success("Route created successfully!");
      }

      await fetchRoutesAndCompanies();
      closeModal();
    } catch (error) {
      console.error("Error saving route:", error);
      toast.error(`Error saving route: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredRoutes = routes.filter(
    (r) =>
      r.startLocationName?.toLowerCase().includes(search.toLowerCase()) ||
      r.endLocationName?.toLowerCase().includes(search.toLowerCase()) ||
      r.companyName?.toLowerCase().includes(search.toLowerCase())
  );

  const fetchRoutesAndCompanies = async () => {
    setLoading(true);
    try {
      const [routeResponse, companyResponse] = await Promise.all([
        routeService.getAll(),
        companyService.getAll(),
      ]);
      setRoutes(routeResponse.data);
      setCompanies(companyResponse.data);
    } catch (error) {
      toast.error("Failed to load routes. Please try again.");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutesAndCompanies();
  }, []);

  const openModal = (route = null) => {
    setSelectedRoute(route);
    setSelectedStart(null);
    setStartQuery("");
    setStartResults([]);
    setSelectedEnd(null);
    setEndQuery("");
    setEndResults([]);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedRoute(null);
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const getCompanyName = (companyId) => {
    const company = companies.find((c) => c.id === companyId);
    return company ? company.companyName : "Unknown Company";
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
          <p className="header-subtitle">
            Manage transportation routes and schedules
          </p>
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
                    {getCompanyName(r.companyId)}
                  </td>
                  <td>{r.startLocationName || r.startLocationId}</td>
                  <td>{r.endLocationName || r.endLocationId}</td>
                  <td className="status-cell">
                    <span
                      className={`status-badge ${
                        r.isActive ? "status-active" : "status-inactive"
                      }`}
                    >
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
                    <label>Start Location:</label>
                    <input
                      type="text"
                      value={startQuery}
                      onChange={(e) => {
                        setStartQuery(e.target.value);
                        handleLocationSearch(e.target.value, setStartResults);
                      }}
                      placeholder="Search start location..."
                      required
                    />
                    {startResults && startResults.length > 0 && (
                      <ul className="search-results">
                        {startResults.map((loc) => (
                          <li
                            key={loc.place_id}
                            onClick={() => {
                              setSelectedStart(loc);
                              setStartQuery(loc.display_name);
                              setStartResults([]);
                            }}
                          >
                            {loc.display_name}
                          </li>
                        ))}
                      </ul>
                    )}
                    {startQuery &&
                      startQuery.length >= 3 &&
                      startResults &&
                      startResults.length === 0 && (
                        <div className="add-location-container">
                          <button
                            type="button"
                            onClick={() => openLocationModal("start")}
                            className="add-location-btn"
                          >
                            Add Start Location
                          </button>
                        </div>
                      )}
                  </div>

                  <div className="form-group">
                    <label>End Location:</label>
                    <input
                      type="text"
                      value={endQuery}
                      onChange={(e) => {
                        setEndQuery(e.target.value);
                        handleLocationSearch(e.target.value, setEndResults);
                      }}
                      placeholder="Search end location..."
                      required
                    />
                    {endResults && endResults.length > 0 && (
                      <ul className="search-results">
                        {endResults.map((loc) => (
                          <li
                            key={loc.place_id}
                            onClick={() => {
                              setSelectedEnd(loc);
                              setEndQuery(loc.display_name);
                              setEndResults([]);
                            }}
                          >
                            {loc.display_name}
                          </li>
                        ))}
                      </ul>
                    )}
                    {endQuery &&
                      endQuery.length >= 3 &&
                      endResults &&
                      endResults.length === 0 && (
                        <div className="add-location-container">
                          <button
                            type="button"
                            onClick={() => openLocationModal("end")}
                            className="add-location-btn"
                          >
                            Add End Location
                          </button>
                        </div>
                      )}
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
                      defaultValue={
                        selectedRoute?.availableFrom?.slice(0, 16) || ""
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="availableTo">Available To:</label>
                    <input
                      type="datetime-local"
                      name="availableTo"
                      defaultValue={
                        selectedRoute?.availableTo?.slice(0, 16) || ""
                      }
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
                <button
                  type="button"
                  onClick={closeModal}
                  className="cancel-btn"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Saving..." : selectedRoute ? "Save" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLocationModalOpen && (
        <div className="modal" onClick={closeLocationModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                Add {locationModalType === "start" ? "Start" : "End"} Location
              </h3>
              <button
                type="button"
                onClick={closeLocationModal}
                className="modal-close-btn"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="form-section">
              <LocationPicker
                onSelect={async (coords) => {
                  setLoading(true);
                  try {
                    // fetch address from OpenCage
                    const payload = await fetchAddressFromCoords(
                      coords.latitude,
                      coords.longitude
                    );

                    const location = await locationService.create(payload);

                    if (!location.success) {
                      toast.error(
                        `Failed to create location. Message: ${location.message}`
                      );
                    }

                    const newLocation = {
                      place_id: location.data.id,
                      display_name: location.data.fullAddress,
                      lat: location.data.latitude,
                      lon: location.data.longitude,
                      city: location.data.city,
                      country: location.data.country,
                      ZIP: location.data.zip,
                    };

                    if (locationModalType === "start") {
                      setSelectedStart(newLocation);
                      setStartQuery(location.data.fullAddress);
                      setStartResults([]);
                    } else {
                      setSelectedEnd(newLocation);
                      setEndQuery(location.data.fullAddress);
                      setEndResults([]);
                    }

                    toast.success("Location added successfully!");
                    closeLocationModal();
                  } catch (error) {
                    toast.error(`Error creating location: ${error.message}`);
                    console.error(error);
                  } finally {
                    setLoading(false);
                  }
                }}
              />
            </div>

            <div className="modal-actions">
              <button
                type="button"
                onClick={closeLocationModal}
                className="cancel-btn"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteManagement;
