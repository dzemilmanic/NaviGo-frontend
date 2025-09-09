import { useEffect, useState } from "react";
import { X } from "lucide-react";
import "./BookingModal.css";
import { toast } from "react-toastify";
import { driverService } from "../../services/driverService";
import { vehicleService } from "../../services/vehicleService";

const CarrierModal = ({ contract, shipments, onClose, onSubmit, onReject }) => {
  const [accepted, setAccepted] = useState(false);
  const [driverId, setDriverId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  useEffect(() => {
    driverService.getAll().then((response) => {
      setDrivers(response.data);
    });
    vehicleService.getAll().then((response) => {
      setVehicles(response.data);
    });
  }, []);
  const handleAccept = () => {
    setAccepted(true);
  };

  const handleReject = () => {
    const confirmReject = () => {
      toast.dismiss();
      onReject({
        contractId: contract.id,
        driverId: null,
        vehicleId: null,
        contractStatus: 3, // Cancelled
      });
      setAccepted(false);
      onClose();
    };

    const cancelReject = () => {
      toast.dismiss();
      toast.info("Reject operation cancelled");
    };

    toast.warn(
      <div>
        <p>
          Are you sure you want to reject contract{" "}
          <strong>#{contract.contractNumber}</strong>?
        </p>
        <div style={{ marginTop: "10px", display: "flex", gap: "8px" }}>
          <button
            onClick={confirmReject}
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
            Reject
          </button>
          <button
            onClick={cancelReject}
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

  const handleSubmit = () => {
    onSubmit({
      driverId,
      vehicleId,
      contractStatus: 1,
    });
    setAccepted(false);
    onClose();
  };

  const handleBack = () => setAccepted(false);

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Contract #{contract.contractNumber}</h3>
          <button type="button" onClick={onClose} className="modal-close-btn">
            <X size={20} />
          </button>
        </div>

        {!accepted ? (
          <div className="form-section user-form">
            <div className="contract-info">
              <p>
                <strong>Route ID:</strong> #{contract.routeId}
              </p>
              <p>
                <strong>Client:</strong> {contract.clientFullName}
              </p>
              <p>
                <strong>Max Penalty Percent:</strong>{" "}
                {contract.maxPenaltyPercent}%
              </p>
              <p>
                <strong>Penalty Rate Per Hour:</strong>{" "}
                {contract.penaltyRatePerHour}%
              </p>
              <p>
                <strong>Total Shipments:</strong> {shipments.length || 0}
              </p>
              <p>Do you accept this contract?</p>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={handleReject}
              >
                Reject
              </button>
              <button
                type="button"
                className="submit-btn"
                onClick={handleAccept}
              >
                Accept
              </button>
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
                  <option key={d.id} value={d.id}>
                    {d.firstName} {d.lastName}
                  </option>
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
                  <option key={v.id} value={v.id}>
                    {v.brand} {v.model} ({v.manufactureYear})
                  </option>
                ))}
              </select>
            </div>

            <div
              className="modal-actions"
              style={{ justifyContent: "space-between" }}
            >
              <button type="button" className="cancel-btn" onClick={handleBack}>
                Back
              </button>
              <button
                type="button"
                className="submit-btn"
                onClick={handleSubmit}
              >
                Start Transport
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarrierModal;
