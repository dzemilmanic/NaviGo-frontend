import { useState } from "react";
import { X } from "lucide-react";

const ForwarderOfferDecisionModal = ({ onClose, onSubmit, forwarderOffer, isSubmitting }) => {
  const [forwarderOfferStatus, setForwarderOfferStatus] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ako je reject a nema reason -> validacija
    if (forwarderOfferStatus === 2 && !rejectionReason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }

    onSubmit({
      forwarderOfferStatus: forwarderOfferStatus === "" ? null : forwarderOfferStatus,
      rejectionReason: rejectionReason || null,
    });
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Accept or Decline Forwarder Offer</h3>
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
              <label htmlFor="newStatus">Decision</label>
              <select
                id="newStatus"
                value={forwarderOfferStatus}
                onChange={(e) => setForwarderOfferStatus(e.target.value ? parseInt(e.target.value) : "")}
              >
                <option value="">-- Select --</option>
                <option value={1}>Accept ✔</option>
                <option value={2}>Reject ✖</option>
              </select>
            </div>
          </div>

          {forwarderOfferStatus === 2 && (
            <div className="form-section">
              <div className="form-group">
                <label htmlFor="rejectionReason">Reason for rejection</label>
                <textarea
                  id="rejectionReason"
                  placeholder="Reason for rejection"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>
            </div>
          )}

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
              {isSubmitting ? forwarderOffer && "Updating..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForwarderOfferDecisionModal;
