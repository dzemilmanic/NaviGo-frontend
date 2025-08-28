import { useState, useEffect } from "react";
import { forwarderOfferService } from "../../services/forwarderOfferService";
import { routeService } from "../../services/routeService";
import { companyService } from "../../services/companyService"; // za forwardere
import "./Managements.css";

const ForwarderOfferManagement = () => {
  const [offers, setOffers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [forwarders, setForwarders] = useState([]);

  const fetchOffers = async () => {
    try {
      const response = await forwarderOfferService.getAll({ search });
      setOffers(response.data);
    } catch (error) {
      console.error("Error fetching offers:", error);
    }
  };

  const fetchRoutes = async () => {
    try {
      const response = await routeService.getAll();
      setRoutes(response.data);
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  };

  const fetchForwarders = async () => {
    try {
      const response = await companyService.getAll({ companyType: 2 }); // forwarderi
      setForwarders(response.data);
    } catch (error) {
      console.error("Error fetching forwarders:", error);
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
    if (window.confirm("Are you sure you want to delete this offer?")) {
      try {
        await forwarderOfferService.delete(id);
        fetchOffers();
      } catch (error) {
        console.error("Error deleting offer:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = {
      routeId: Number(form.routeId.value),
      forwarderId: Number(form.forwarderId.value),
      commissionRate: Number(form.commissionRate.value),
      discountRate: Number(form.discountRate.value),
      expiresAt: form.expiresAt.value,
    };

    try {
      if (selectedOffer) {
        await forwarderOfferService.update(selectedOffer.id, formData);
      } else {
        await forwarderOfferService.create(formData);
      }
      fetchOffers();
      closeModal();
    } catch (error) {
      console.error("Error saving offer:", error);
    }
  };

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
              <td>{o.forwarderId}</td>
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
              <select name="routeId" defaultValue={selectedOffer?.routeId || ""} required>
                <option value="">Select Route</option>
                {routes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {`Route ${r.id}`}
                  </option>
                ))}
              </select>

              <select
                name="forwarderId"
                defaultValue={selectedOffer?.forwarderId || ""}
                required
              >
                <option value="">Select Forwarder</option>
                {forwarders.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.companyName}
                  </option>
                ))}
              </select>

              <input
                type="number"
                name="commissionRate"
                placeholder="Commission Rate"
                defaultValue={selectedOffer?.commissionRate || 0}
                required
              />
              <input
                type="number"
                name="discountRate"
                placeholder="Discount Rate"
                defaultValue={selectedOffer?.discountRate || 0}
              />
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
