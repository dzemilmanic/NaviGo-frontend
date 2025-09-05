import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { routePriceService } from "../../services/routePriceService";
import "../Managements/Managements.css";

const BookingModal = ({ route, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [routePrices, setRoutePrices] = useState([]);
  const [selectedPriceId, setSelectedPriceId] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedPriceId) return;

    setLoading(true);
    console.log("Booking submitted:", {
      routeId: route.id,
      routePriceId: selectedPriceId,
    });
    setLoading(false);
    onClose();
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const pricesResponse = await routePriceService.getAll();
      // Filtriramo samo cene koje pripadaju kompaniji koja je kreirala rutu
      const filteredPrices = (pricesResponse.data || []).filter(
        (price) => price.routeId === route.id
      );
      setRoutePrices(filteredPrices);
    } catch (error) {
      console.error("Error fetching route prices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Booking for route #{route.id}</h3>
          <button
            type="button"
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-section">
            <div className="form-group">
              <p className="form-info">
                Route: {route.startLocationName} - {route.endLocationName}
              </p>
              <p className="form-info">
                Estimated Time: {Math.round(route.estimatedDurationHours)} h
              </p>
              <p className="form-info">Company: {route.companyName}</p>
              <p className="form-info">
                Available to:{" "}
                {new Intl.DateTimeFormat("en-GB", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(route.availableTo))}
              </p>
            </div>
          </div>

          <div className="form-section">
            <div className="form-group">
              <label htmlFor="routePrice" className="form-label">
                Route Price:
              </label>
              <select
                id="routePrice"
                name="routePrice"
                className="form-input"
                value={selectedPriceId}
                onChange={(e) => setSelectedPriceId(e.target.value)}
                required
              >
                <option value="">-- Select a price --</option>
                {routePrices.map((price) => (
                  <option key={price.id} value={price.id}>
                    {price.vehicleTypeName} | {price.pricePerKm} €/km (min{" "}
                    {price.minimumPrice} €)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="cancel-btn"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={loading || !selectedPriceId}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
