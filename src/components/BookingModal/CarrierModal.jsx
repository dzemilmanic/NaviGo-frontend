import { useState } from "react";
import { X } from "lucide-react";
import "./BookingModal.css"; 
import { toast } from "react-toastify";
const CarrierModal = ({ contract, onClose, onSubmit }) => {
  const [accepted, setAccepted] = useState(false);
  const [shipmentIndex, setShipmentIndex] = useState(0); 
  const [assignments, setAssignments] = useState([
    { driverId: "", vehicleId: "" },
    { driverId: "", vehicleId: "" },
    { driverId: "", vehicleId: "" }
  ]);

  const drivers = ["Driver A", "Driver B", "Driver C"];
  const vehicles = ["Truck 1", "Truck 2", "Truck 3"];

  const handleAccept = () => setAccepted(true);
  const handleBack = () => setAccepted(false);
  const handlePrevShipment = () => setShipmentIndex((i) => Math.max(i - 1, 0));
const handleNextShipment = () => {
  const current = assignments[shipmentIndex];
  if (!current.driverId || !current.vehicleId) {
    toast.error("Please select a driver and vehicle for each shipment.");
    return;
  }
  setShipmentIndex((i) => Math.min(i + 1, assignments.length - 1));
};


  const handleAssignmentChange = (field, value) => {
    setAssignments((prev) =>
      prev.map((a, index) =>
        index === shipmentIndex ? { ...a, [field]: value } : a
      )
    );
  };

  const handleStartTransport = () => {
    console.log("Transport started with assignments:", assignments);
    onSubmit();
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
            <p><strong>Route:</strong> {contract.Route?.startLocationName} → {contract.Route?.endLocationName}</p>
            <p><strong>Client:</strong> {contract.Client?.CompanyName || contract.Client?.Name}</p>
            <p><strong>Max Penalty Percent:</strong> 3 %</p>
            <p><strong>Penalty Rate Per Hour:</strong> 2 %</p>
            <p><strong>Total Shipments:</strong> 3</p>
            <p>Do you accept this contract?</p>
            <div className="modal-actions">
              <button type="button" className="cancel-btn" onClick={onClose}>Reject</button>
              <button type="button" className="submit-btn" onClick={handleAccept}>Accept</button>
            </div>
          </div>
        ) : (
          <div className="form-section shipment-section">
            <h4>Shipment #{shipmentIndex + 1}</h4>

            <div className="form-group">
              <label className="form-label">Driver:</label>
              <select
                className="form-input"
                value={assignments[shipmentIndex].driverId}
                onChange={(e) => handleAssignmentChange("driverId", e.target.value)}
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
                value={assignments[shipmentIndex].vehicleId}
                onChange={(e) => handleAssignmentChange("vehicleId", e.target.value)}
              >
                <option value="">-- Select Vehicle --</option>
                {vehicles.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>

            <div className="modal-actions" style={{ justifyContent: "space-between" }}>
              <button type="button" className="cancel-btn" onClick={handleBack}>Back</button>
              <div>
                {shipmentIndex > 0 && <button type="button" className="cancel-btn" onClick={handlePrevShipment}>Previous Shipment</button>}
                {shipmentIndex < assignments.length - 1 && <button type="button" className="submit-btn" onClick={handleNextShipment}>Next Shipment</button>}
                {shipmentIndex === assignments.length - 1 && <button type="button" className="submit-btn" onClick={handleStartTransport}>Start Transport</button>}
              </div>
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
    Client: { CompanyName: "ACME Corp." }
  }
};

export default CarrierModal;
