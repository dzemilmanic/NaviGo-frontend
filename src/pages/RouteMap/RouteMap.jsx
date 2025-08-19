import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import polyline from "@mapbox/polyline";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./RouteMap.css";
import { authService } from "../../services/authService";

// Fix za default marker ikone u Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// FitBounds komponenta
const FitBounds = ({ bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(L.latLngBounds(bounds), { padding: [50, 50] });
    }
  }, [bounds, map]);
  return null;
};

// Custom ikone za start i end
const createCustomIcon = (symbol) => {
  return L.divIcon({
    className: "custom-div-icon",
    html: `<div class="marker-pin">${symbol}</div>`,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -42],
  });
};

// Funkcija za formatiranje trajanja
const formatDuration = (hours) => {
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}h ${m}m`;
};

const RouteMap = () => {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Paging i sortiranje
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("Id");
  const [sortDirection, setSortDirection] = useState("asc");

  // Client-side search
  const [searchTerm, setSearchTerm] = useState("");

  const token = authService.getAccessToken();

  const loadRoutes = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/Route?SortBy=${sortBy}&SortDirection=${sortDirection}&Page=${page}&PageSize=${pageSize}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Greška pri učitavanju ruta");

      const data = await res.json();
      setRoutes(data);

      if (data.length > 0) handleRouteSelect(data[0]);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoutes();
  }, [token, page, pageSize, sortBy, sortDirection]);

  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
    const decoded = polyline.decode(route.geometryEncoded);
    const leafletCoords = decoded.map((c) => [c[0], c[1]]);
    setRouteCoords(leafletCoords);
  };

  // Filtriranje ruta po searchTerm (start ili end location)
  const filteredRoutes = routes.filter((route) => {
    const term = searchTerm.toLowerCase();
    return (
      route.startLocationName?.toLowerCase().includes(term) ||
      route.endLocationName?.toLowerCase().includes(term)
    );
  });

  if (loading) return <div className="loading">Učitavanje ruta...</div>;
  if (error)
    return (
      <div className="error">
        <p>Greška: {error}</p>
      </div>
    );

  return (
    <div className="route-map-wrapper">
      {/* Sidebar */}
      <div className="routes-sidebar">
        <h2>Rute ({filteredRoutes.length})</h2>

        {/* Search */}
        <div className="search-box" style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="Pretraži rute po lokacijama..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "0.4rem 0.6rem",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              fontSize: "0.9rem",
            }}
          />
        </div>

        {/* Sortiranje */}
        <div className="sorting-controls">
          <label>
            Sort By:
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="Id">ID</option>
              <option value="DistanceKm">Distance</option>
              <option value="EstimatedDurationHours">Duration</option>
            </select>
          </label>

          <label>
            Direction:
            <select
              value={sortDirection}
              onChange={(e) => setSortDirection(e.target.value)}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </label>
        </div>

        <ul>
          {filteredRoutes.map((route) => (
            <li
              key={route.id}
              className={selectedRoute?.id === route.id ? "active" : ""}
              onClick={() => handleRouteSelect(route)}
            >
              <strong>Ruta #{route.id}</strong>
              <p>
                {route.startLocationName} → {route.endLocationName}
              </p>
              <p>
                📏 {route.distanceKm ? Math.round(route.distanceKm) + " km" : "N/A"}{" "}
                • ⏱️{" "}
                {route.estimatedDurationHours
                  ? formatDuration(route.estimatedDurationHours)
                  : "N/A"}
              </p>
            </li>
          ))}
        </ul>

        {/* Paging */}
        <div className="paging-controls">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span>Page {page}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={routes.length < pageSize}
          >
            Next
          </button>

          <label>
            Page Size:
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Mapa */}
      <div className="map-container">
        <MapContainer
          center={[44.8176, 20.4569]}
          zoom={5}
          className="leaflet-container"
          key={selectedRoute?.id}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {routeCoords.length > 0 && (
            <>
              <Polyline
                positions={routeCoords}
                pathOptions={{ color: "#4F46E5", weight: 5, opacity: 0.8 }}
              />

              <Marker position={routeCoords[0]} icon={createCustomIcon("🚀")}>
                <Popup>
                  <strong>Start:</strong> {selectedRoute.startLocationName}
                </Popup>
              </Marker>

              <Marker
                position={routeCoords[routeCoords.length - 1]}
                icon={createCustomIcon("🏁")}
              >
                <Popup>
                  <strong>End:</strong> {selectedRoute.endLocationName}
                </Popup>
              </Marker>

              <FitBounds bounds={routeCoords} />
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default RouteMap;
