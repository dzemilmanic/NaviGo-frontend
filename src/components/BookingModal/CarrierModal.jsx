import { useState } from "react";
import { X } from "lucide-react";
import "./BookingModal.css"; 
import { toast } from "react-toastify";

const CarrierModal = ({ contract, onClose, onSubmit }) => {
  const [accepted, setAccepted] = useState(false);
  const [driverId, setDriverId] = useState("");
  const [vehicleId, setVehicleId] = useState("");

  const drivers = ["Driver A", "Driver B", "Driver C"];
  const vehicles = ["Truck 1", "Truck 2", "Truck 3"];

  const handleAccept = () => setAccepted(true);
  const handleBack = () => setAccepted(false);

  const handleStartTransport = () => {
    if (!driverId || !vehicleId) {
      toast.error("Please select both a driver and a vehicle.");
      return;
    }

    // napravi assignments za sve shipmente
    const assignments = Array.from({ length: contract.TotalShipments || 3 }, () => ({
      driverId,
      vehicleId,
    }));

    console.log("Transport started with assignments:", assignments);
    onSubmit(assignments);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Contract #{contract.ContractNumber}</h3>
          <button
            type="button"
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {!accepted ? (
          <div className="form-section user-form">
            <div className="contract-info">
            <p><strong>Route:</strong> {contract.Route?.startLocationName} → {contract.Route?.endLocationName}</p>
            <p><strong>Client:</strong> {contract.Client?.CompanyName || contract.Client?.Name}</p>
            <p><strong>Max Penalty Percent:</strong> 3 %</p>
            <p><strong>Penalty Rate Per Hour:</strong> 2 %</p>
            <p><strong>Total Shipments:</strong> {contract.TotalShipments || 3}</p>
            <p>Do you accept this contract?</p>
            </div>
            <div className="modal-actions">
              <button type="button" className="cancel-btn" onClick={onClose}>Reject</button>
              <button type="button" className="submit-btn" onClick={handleAccept}>Accept</button>
            </div>
          </div>
        ) : (
          <div className="form-section shipment-section">
            <h4>Assign Driver & Vehicle</h4>

            <div className="form-group">
              <label className="form-label">Driver:</label>
              <select
                className="form-input"
                value={driverId}
                onChange={(e) => setDriverId(e.target.value)}
              >
                <option value="">-- Select Driver --</option>
                {drivers.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Vehicle:</label>
              <select
                className="form-input"
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
              >
                <option value="">-- Select Vehicle --</option>
                {vehicles.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>

            <div className="modal-actions" style={{ justifyContent: "space-between" }}>
              <button type="button" className="cancel-btn" onClick={handleBack}>Back</button>
              <button type="button" className="submit-btn" onClick={handleStartTransport}>
                Start Transport
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Hardkodovan contract za UI test
CarrierModal.defaultProps = {
  contract: {
    ContractNumber: "1234",
    Route: { startLocationName: "Belgrade", endLocationName: "Vienna" },
    Client: { CompanyName: "ACME Corp." },
    TotalShipments: 3
  }
};

export default CarrierModal;
