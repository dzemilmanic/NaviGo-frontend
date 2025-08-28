import { useState, useEffect } from "react";
import { contractService } from "../../services/contractService"; // pretpostavljam da postoji
import { companyService } from "../../services/companyService"; // za dropdown ako treba
import { forwarderOfferService } from "../../services/forwarderOfferService"; // za dropdown
import { routePriceService } from "../../services/routePriceService"; // za dropdown
import "./Managements.css";

const ContractManagement = () => {
  const [contracts, setContracts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedContract, setSelectedContract] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [forwarders, setForwarders] = useState([]);
  const [routePrices, setRoutePrices] = useState([]);
  const [forwarderOffers, setForwarderOffers] = useState([]);

  // Fetch contracts
  const fetchContracts = async () => {
    try {
      const response = await contractService.getAll({ search });
      setContracts(response.data);
    } catch (error) {
      console.error("Error fetching contracts:", error);
    }
  };

  // Fetch dropdown data
  const fetchDropdownData = async () => {
    try {
      const clientsData = await companyService.getAll({ companyType: 1 });
      const forwardersData = await companyService.getAll({ companyType: 2 });
      const routePricesData = await routePriceService.getAll();
      const forwarderOffersData = await forwarderOfferService.getAll();

      setClients(clientsData.data);
      setForwarders(forwardersData.data);
      setRoutePrices(routePricesData.data);
      setForwarderOffers(forwarderOffersData.data);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  useEffect(() => {
    fetchContracts();
    fetchDropdownData();
  }, [search]);

  const openModal = (contract = null) => {
    setSelectedContract(contract);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedContract(null);
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this contract?")) {
      try {
        await contractService.delete(id);
        fetchContracts();
      } catch (error) {
        console.error("Error deleting contract:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = {
      clientId: Number(form.clientId.value),
      forwarderId: Number(form.forwarderId.value),
      routeId: Number(form.routeId.value),
      routePriceId: Number(form.routePriceId.value),
      forwarderOfferId: Number(form.forwarderOfferId.value),
      contractNumber: form.contractNumber.value,
      terms: form.terms.value,
      penaltyRatePerHour: Number(form.penaltyRatePerHour.value),
      maxPenaltyPercent: Number(form.maxPenaltyPercent.value),
    };

    try {
      if (selectedContract) {
        await contractService.update(selectedContract.id, formData);
      } else {
        await contractService.create(formData);
      }
      fetchContracts();
      closeModal();
    } catch (error) {
      console.error("Error saving contract:", error);
    }
  };

  return (
    <div className="management-container">
      <div className="management-header">
        <input
          type="text"
          placeholder="Search contracts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => openModal()}>Add Contract</button>
      </div>

      <table className="management-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Contract Number</th>
            <th>Client</th>
            <th>Forwarder</th>
            <th>Route</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.contractNumber}</td>
              <td>{c.clientId}</td>
              <td>{c.forwarderId}</td>
              <td>{c.routeId}</td>
              <td>{c.contractStatus}</td>
              <td>
                <button onClick={() => openModal(c)}>Edit</button>
                <button onClick={() => handleDelete(c.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>{selectedContract ? "Edit Contract" : "Add Contract"}</h3>
            <form onSubmit={handleSubmit}>
              <select name="clientId" defaultValue={selectedContract?.clientId || ""} required>
                <option value="">Select Client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.companyName}
                  </option>
                ))}
              </select>
              <select name="forwarderId" defaultValue={selectedContract?.forwarderId || ""} required>
                <option value="">Select Forwarder</option>
                {forwarders.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.companyName}
                  </option>
                ))}
              </select>
              <select name="routePriceId" defaultValue={selectedContract?.routePriceId || ""} required>
                <option value="">Select Route Price</option>
                {routePrices.map((r) => (
                  <option key={r.id} value={r.id}>
                    Route {r.routeId} - {r.pricePerKm} per km
                  </option>
                ))}
              </select>
              <select name="forwarderOfferId" defaultValue={selectedContract?.forwarderOfferId || ""}>
                <option value="">Select Forwarder Offer</option>
                {forwarderOffers.map((o) => (
                  <option key={o.id} value={o.id}>
                    Offer {o.id} - {o.commissionRate}%
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="contractNumber"
                placeholder="Contract Number"
                defaultValue={selectedContract?.contractNumber || ""}
                required
              />
              <textarea
                name="terms"
                placeholder="Terms"
                defaultValue={selectedContract?.terms || ""}
              />
              <input
                type="number"
                name="penaltyRatePerHour"
                placeholder="Penalty Rate per Hour"
                defaultValue={selectedContract?.penaltyRatePerHour || 0}
              />
              <input
                type="number"
                name="maxPenaltyPercent"
                placeholder="Max Penalty Percent"
                defaultValue={selectedContract?.maxPenaltyPercent || 0}
              />
              <div className="modal-actions">
                <button type="submit">{selectedContract ? "Save" : "Add"}</button>
                <button type="button" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractManagement;
