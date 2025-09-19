import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { routePriceService } from "../../services/routePriceService";
import { toast } from "react-toastify";
import { forwarderOfferService } from "../../services/forwarderOfferService";
import { cargoTypeService } from "../../services/cargoTypeService";
import { contractService } from "../../services/contractService";
import "../Managements/Managements.css";
import "./BookingModal.css";

const BookingModal = ({ route, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [routePrices, setRoutePrices] = useState([]);
  const [forwarderOffers, setForwarderOffers] = useState([]);
  const [cargoTypes, setCargoTypes] = useState([]);
  const [selectedPriceId, setSelectedPriceId] = useState("");
  const [selectedForwarderOfferId, setSelectedForwarderOfferId] = useState("");
  const [maxPenaltyPercent, setMaxPenaltyPercent] = useState(0);
  const [penaltyRatePerHour, setPenaltyRatePerHour] = useState(0);
  // State za više shipmenata
  const [shipments, setShipments] = useState([
    {
      cargoTypeId: "",
      weightKg: 0,
      priority: "",
      description: "",
      scheduledDeparture: "",
      scheduledArrival: "",
    },
  ]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedPriceId) return;

    setLoading(true);
    try {
      const response = await contractService.createClientContract({
        routePriceId: selectedPriceId,
        forwarderOfferId: selectedForwarderOfferId,
        maxPenaltyPercent: maxPenaltyPercent,
        penaltyRatePerHour: penaltyRatePerHour,
        shipments,
      });
      if (!response.success) {
        toast.error(`Failed to create contract. Message: ${response.message}`);
        return;
      }
      toast.success("Contract created successfully!");
    } catch (error) {
      toast.error(`Failed to create contract. ${error.message}`);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const pricesResponse = await routePriceService.getAll();
      const cargoTypesResponse = await cargoTypeService.getAll();
      const forwarderOfferResponse = await forwarderOfferService.getAll();

      const filteredPrices = (pricesResponse.data || []).filter(
        (price) => price.routeId === route.id
      );
      const filteredOffers = (forwarderOfferResponse.data || []).filter(
        (offer) => offer.routeId === route.id
      );

      setRoutePrices(filteredPrices);
      setForwarderOffers(filteredOffers);
      setCargoTypes(cargoTypesResponse.data || []);
    } catch (error) {
      console.error("Error fetching route prices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleShipmentChange = (index, field, value) => {
    const updatedShipments = [...shipments];
    updatedShipments[index][field] = value;
    setShipments(updatedShipments);
  };

  const addShipment = () => {
    setShipments([
      ...shipments,
      {
        cargoTypeId: "",
        weightKg: 0,
        priority: "",
        description: "",
        scheduledDeparture: "",
        scheduledArrival: "",
      },
    ]);
  };

  const removeShipment = (index) => {
    if (shipments.length === 1) return; // bar jedan shipment mora ostati
    const updatedShipments = shipments.filter((_, i) => i !== index);
    setShipments(updatedShipments);
  };

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
              <label htmlFor="routePriceId" className="form-label">
                Route Price:
              </label>
              <select
                id="routePriceId"
                name="routePriceId"
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

          <div className="form-section">
            <div className="form-group">
              <label htmlFor="forwarderOfferId" className="form-label">
                Forwarder Offer:
              </label>
              <select
                id="forwarderOfferId"
                name="forwarderOfferId"
                className="form-input"
                value={selectedForwarderOfferId}
                onChange={(e) => setSelectedForwarderOfferId(e.target.value)}
                required
              >
                <option value="">-- Select a forwarder offer --</option>
                {forwarderOffers.map((offer) => (
                  <option key={offer.id} value={offer.id}>
                    Forwarder: {offer.forwarderCompanyName} | Commision Rate:{" "}
                    {offer.commissionRate} % | Discount: {offer.discountRate} %
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="maxPenaltyPercent" className="form-label">
              Max Penalty Percent (%):
            </label>
            <input
              type="number"
              id="maxPenaltyPercent"
              name="maxPenaltyPercent"
              placeholder="0%"
              min={0}
              max={100}
              value={maxPenaltyPercent}
              onChange={(e) => setMaxPenaltyPercent(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="penaltyRatePerHour" className="form-label">
              Penalty Rate Per Hour (%):
            </label>
            <input
              type="number"
              id="penaltyRatePerHour"
              name="penaltyRatePerHour"
              placeholder="0%"
              min={0}
              max={100}
              value={penaltyRatePerHour}
              onChange={(e) => setPenaltyRatePerHour(e.target.value)}
              required
            />
          </div>

          {/* SHIPMENTS */}
          {shipments.map((shipment, index) => (
            <div key={index} className="form-section shipment-section">
              <h4>Shipment #{index + 1}</h4>

              <div className="form-group">
                <label htmlFor={`cargoTypeId-${index}`} className="form-label">
                  Cargo Type:
                </label>
                <select
                  id={`cargoTypeId-${index}`}
                  name={`cargoTypeId-${index}`}
                  className="form-input"
                  value={shipment.cargoTypeId}
                  onChange={(e) =>
                    handleShipmentChange(index, "cargoTypeId", e.target.value)
                  }
                  required
                >
                  <option value="">-- Select a cargo type--</option>
                  {cargoTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.typeName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor={`weightKg-${index}`} className="form-label">
                  WeightKg:
                </label>
                <input
                  type="number"
                  id={`weightKg-${index}`}
                  name={`weightKg-${index}`}
                  placeholder="WeightKg"
                  value={shipment.weightKg}
                  min={1}
                  onChange={(e) =>
                    handleShipmentChange(index, "weightKg", e.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor={`description-${index}`} className="form-label">
                  Description:
                </label>
                <input
                  type="text"
                  id={`description-${index}`}
                  name={`description-${index}`}
                  placeholder="Description"
                  value={shipment.description}
                  onChange={(e) =>
                    handleShipmentChange(index, "description", e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label
                  htmlFor={`scheduledDeparture-${index}`}
                  className="form-label"
                >
                  Scheduled Departure:
                </label>
                <input
                  type="datetime-local"
                  id={`scheduledDeparture-${index}`}
                  name={`scheduledDeparture-${index}`}
                  value={shipment.scheduledDeparture}
                  min={new Date().toISOString().slice(0, 16)}
                  max={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .slice(0, 16)}
                  onChange={(e) =>
                    handleShipmentChange(
                      index,
                      "scheduledDeparture",
                      e.target.value
                    )
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label
                  htmlFor={`scheduledArrival-${index}`}
                  className="form-label"
                >
                  Scheduled Arrival:
                </label>
                <input
                  type="datetime-local"
                  id={`scheduledArrival-${index}`}
                  name={`scheduledArrival-${index}`}
                  value={shipment.scheduledArrival}
                  min={new Date().toISOString().slice(0, 16)}
                  max={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .slice(0, 16)}
                  onChange={(e) =>
                    handleShipmentChange(
                      index,
                      "scheduledArrival",
                      e.target.value
                    )
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor={`priority-${index}`} className="form-label">
                  Priority:
                </label>
                <select
                  id={`priority-${index}`}
                  name={`priority-${index}`}
                  className="form-input"
                  value={shipment.priority}
                  onChange={(e) =>
                    handleShipmentChange(index, "priority", e.target.value)
                  }
                  required
                >
                  <option value="">-- Select a priority --</option>
                  <option value="0">Low</option>
                  <option value="1">High (30% surcharge)</option>
                </select>
              </div>

              {shipments.length > 1 && (
                <button
                  type="button"
                  className="remove-shipment-btn"
                  onClick={() => removeShipment(index)}
                >
                  Remove Shipment ❌
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            className="add-shipment-btn"
            onClick={addShipment}
          >
            Add Shipment ➕
          </button>

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
