import { useState } from "react";
import { X } from "lucide-react";
const Forwarder = ({ onClose, onSubmit, route }) => {
  const [commissionRate, setCommissionRate] = useState(0);
  const [discountRate, setDiscountRate] = useState(0);
  const [expiresAt, setExpiresAt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    onSubmit({ commissionRate, discountRate, expiresAt });
  };
  return (
    <>
      <div className="modal" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Forwarder Offer for route: #{route.id}</h3>

            <button
              type="button"
              onClick={onClose}
              className="modal-close-btn"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
          <div className="modal-info">
            <p>
              {route.startLocationName} → {route.endLocationName}
            </p>
            <p>
              📏{" "}
              {route.distanceKm ? Math.round(route.distanceKm) + " km" : "N/A"}{" "}
              • ⏱️{" "}
              {route.estimatedDurationHours
                ? Math.round(route.estimatedDurationHours)
                : "N/A"}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="user-form">
            <div className="form-section">
              <div className="form-group">
                <label htmlFor="commissionRate">Commision Rate</label>
                <input
                  type="text"
                  id="commissionRate"
                  placeholder="Commision Rate (%)"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-section">
              <div className="form-group">
                <label htmlFor="discountRate">Discount Rate</label>
                <input
                  type="text"
                  id="discountRate"
                  placeholder="Discount Rate (%)"
                  value={discountRate}
                  onChange={(e) => setDiscountRate(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-section">
              <div className="form-group">
                <label htmlFor="expiresAt">Expires At</label>
                <input
                  type="datetime-local"
                  id="expiresAt"
                  placeholder="Expires At (YYYY-MM-DD)"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                onClick={onClose}
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
                {isSubmitting ? route && "Updating..." : route && "Add Offer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Forwarder;
