import { useState, useEffect } from "react";
import { forwarderOfferService } from "../../services/forwarderOfferService";
import { routeService } from "../../services/routeService";
import { companyService } from "../../services/companyService"; // za forwardere
import "./Managements.css";
import { useAuth } from "../../contexts/AuthContext";
import Loader from "../Loader/Loader";
import { toast } from "react-toastify";
const ForwarderOfferManagement = () => {
  const [offers, setOffers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [forwarders, setForwarders] = useState([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const fetchOffers = async () => {
    setLoading(true);
    try {
      const response = await forwarderOfferService.getAll({ search });
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
  }, [search]);

  const openModal = (offer = null) => {
    setSelectedOffer(offer);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOffer(null);
    setIsModalOpen(false);
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
      routeId: Number(form.routeId.value),
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
      } else {
        const response = await forwarderOfferService.create(formData);
        if (response.success) {
          toast.success("Forwarder offer created successfully!");
        } else {
          toast.error(
            `Failed to create forwarder offer. Message: ${response.message}`
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
  if (loading) return <Loader />;
  return (
    <div className="management-container">
      <div className="management-header">
        <input
          type="text"
          placeholder="Search offers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => openModal()}>Add Offer</button>
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
          {offers.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.routeId}</td>
              <td>{o.forwarderCompanyName}</td>
              <td>{o.commissionRate}</td>
              <td>{o.discountRate}</td>
              <td>{o.forwarderOfferStatus}</td>
              <td>{o.expiresAt?.split("T")[0]}</td>
              <td>
                <button onClick={() => openModal(o)}>Edit</button>
                <button onClick={() => handleDelete(o.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>{selectedOffer ? "Edit Offer" : "Add Offer"}</h3>
            <form onSubmit={handleSubmit}>
              <label htmlFor="routeId">Route</label>
              <select
                name="routeId"
                defaultValue={selectedOffer?.routeId || ""}
                required
              >
                <option value="">Select Route</option>
                {routes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {`Route ${r.id}`}
                  </option>
                ))}
              </select>
              <label htmlFor="commissionRate">Commission Rate</label>
              <input
                type="number"
                name="commissionRate"
                placeholder="Commission Rate"
                defaultValue={selectedOffer?.commissionRate || null}
                required
              />
              <label htmlFor="discountRate">Discount Rate</label>
              <input
                type="number"
                name="discountRate"
                placeholder="Discount Rate"
                defaultValue={selectedOffer?.discountRate || null}
              />
              <label htmlFor="expiresAt">Expires At</label>
              <input
                type="date"
                name="expiresAt"
                defaultValue={selectedOffer?.expiresAt?.split("T")[0] || ""}
              />

              <div className="modal-actions">
                <button type="submit">{selectedOffer ? "Save" : "Add"}</button>
                <button type="button" onClick={closeModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForwarderOfferManagement;
