import { useState, useEffect } from "react";
import { forwarderOfferService } from "../../services/forwarderOfferService";
import { routeService } from "../../services/routeService";
import { companyService } from "../../services/companyService"; // za forwardere
import "./Managements.css";
import { useAuth } from "../../contexts/AuthContext";
import Loader from "../Loader/Loader";
import { toast } from "react-toastify";
import { X, MessageCircleQuestionMark, Pencil, Trash } from "lucide-react";
import ForwarderOfferDecisionModal from "../Modals/ForwarderOfferDecisionModal";
const ForwarderOfferManagement = () => {
  const [offers, setOffers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [forwarders, setForwarders] = useState([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const fetchOffers = async () => {
    setLoading(true);
    try {
      const response = await forwarderOfferService.getAll();
      setOffers(response.data);
    } catch (error) {
      toast.error("Failed to load offers. Please try again.");
      console.error("Error fetching offers:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const response = await routeService.getAll();
      setRoutes(response.data);
    } catch (error) {
      toast.error("Failed to load routes. Please try again.");
      console.error("Error fetching routes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchForwarders = async () => {
    setLoading(true);
    try {
      const response = await companyService.getAll({ companyType: 2 }); // forwarderi
      setForwarders(response.data);
    } catch (error) {
      toast.error("Failed to load forwarders. Please try again.");
      console.error("Error fetching forwarders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
    fetchRoutes();
    fetchForwarders();
  }, []);

  const openModal = (offer = null) => {
    setSelectedOffer(offer);
    setIsModalOpen(true);
  };
  const openDecisionModal = (offer = null) => {
    setSelectedOffer(offer);
    setIsDecisionModalOpen(true);
  };
  const closeModal = () => {
    setSelectedOffer(null);
    setIsModalOpen(false);
  };
  const closeDecisionModal = () => {
    setSelectedOffer(null);
    setIsDecisionModalOpen(false);
  };
  const handleDelete = async (id) => {
    // Custom toast confirmation
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
        const response = await forwarderOfferService.delete(id);
        if (response.success) {
          toast.success(`Forwarder offer ${id} deleted successfully!`);
        } else {
          toast.error(
            `Failed to delete forwarder offer. Message: ${response.message}`
          );
        }
        await fetchOffers();
      } catch (error) {
        toast.error("Failed to delete forwarder offer. Please try again.");
        console.error("Error deleting offer:", error);
      } finally {
        setLoading(false);
      }
    };

    // Show confirmation toast
    toast.warn(
      <div>
        <p>
          Are you sure you want to delete forwarder offer <strong>{id}</strong>?
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    const formData = {
      routeId: selectedOffer.routeId,
      forwarderId: +user.companyId,
      commissionRate: Number(form.commissionRate.value),
      discountRate: Number(form.discountRate.value),
      expiresAt: form.expiresAt.value,
    };

    try {
      if (selectedOffer) {
        const response = await forwarderOfferService.update(
          selectedOffer.id,
          formData
        );
        if (response.success) {
          toast.success("Forwarder offer updated successfully!");
        } else {
          toast.error(
            `Failed to update forwarder offer. Message: ${response.message}`
          );
        }
      }
      fetchOffers();
      closeModal();
    } catch (error) {
      console.error("Error saving offer:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleDecisionSubmit = async (data) => {
    setLoading(true);
    console.log(data)
    try{
      const response = await forwarderOfferService.updateStatus(selectedOffer.id, data);
      if(!response.success){
        toast.error(`${response.message}`);
        return;
      }
      toast.success("Forwarder offer updated successfuly.");
       fetchOffers();
      closeDecisionModal();
    }catch(err){
        toast.error(`${err.message}`);
    }finally{
      setLoading(false);
    }
  };
  if (loading) return <Loader />;
  const filteredOffers = offers.filter((o) =>
    [
      o.id?.toString(),
      o.routeId?.toString(),
      o.forwarderId?.toString(),
      o.commissionRate?.toString(),
      o.discountRate?.toString(),
      o.forwarderOfferStatus,
      o.rejectionReason,
      o.createdAt,
      o.expiresAt,
      o.forwarderCompanyName,
    ]
      .filter(Boolean)
      .some((field) =>
        field.toString().toLowerCase().includes(search.toLowerCase())
      )
  );

  return (
    <div className="management-container">
      <div className="management-header">
        <div className="header-content">
          <h2 className="header-title">Forwarder Offer Management</h2>
          <p className="header-subtitle">Manage and update forwarder offers</p>
        </div>
        <div className="header-actions">
          <input
            type="text"
            placeholder="Search offers..."
            value={search}
            className="search-input"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <table className="management-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Route</th>
            <th>Forwarder</th>
            <th>Commission Rate</th>
            <th>Discount Rate</th>
            <th>Status</th>
            <th>Expires At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOffers.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.routeId}</td>
              <td>{o.forwarderCompanyName}</td>
              <td>{o.commissionRate}</td>
              <td>{o.discountRate}</td>
              <td>{o.forwarderOfferStatus}</td>
              <td>{o.expiresAt?.split("T")[0]}</td>
              <td className="actions-cell">
                <div className="action-buttons">
                  {user.companyType === "Forwarder" && (
                    <>
                      <button
                        className="action-btn activate-btn"
                        onClick={() => openModal(o)}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(o.id)}
                      >
                        <Trash size={16} />
                      </button>
                    </>
                  )}
                  {user.companyType === "Carrier" && o.forwarderOfferStatus === "Pending" && (
                    <button
                      className="action-btn activate-btn"
                      onClick={() => openDecisionModal(o)}
                    >
                      <MessageCircleQuestionMark size={16} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Offer</h3>
              <button
                type="button"
                onClick={closeModal}
                className="modal-close-btn"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="user-form">
              <div className="form-section">
                <div className="form-group">
                  <div className="form-section">
                    <div className="form-group">
                      <label htmlFor="commissionRate">Commission Rate</label>
                      <input
                        type="number"
                        name="commissionRate"
                        placeholder="Commission Rate"
                        defaultValue={selectedOffer?.commissionRate || null}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-section">
                    <div className="form-group">
                      <label htmlFor="discountRate">Discount Rate</label>
                      <input
                        type="number"
                        name="discountRate"
                        placeholder="Discount Rate"
                        defaultValue={selectedOffer?.discountRate || null}
                      />
                    </div>
                  </div>
                  <div className="form-section">
                    <div className="form-group">
                      <label htmlFor="expiresAt">Expires At</label>
                      <input
                        type="date"
                        name="expiresAt"
                        defaultValue={
                          selectedOffer?.expiresAt?.split("T")[0] || ""
                        }
                      />
                    </div>
                  </div>
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
                  {selectedOffer ? "Save" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isDecisionModalOpen && (
        <ForwarderOfferDecisionModal
          onClose={closeDecisionModal}
          onSubmit={handleDecisionSubmit}
          forwarderOffer={selectedOffer}
        />
      )}
    </div>
  );
};

export default ForwarderOfferManagement;
