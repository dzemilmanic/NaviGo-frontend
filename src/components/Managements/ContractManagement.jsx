import { useState, useEffect } from "react";
import { contractService } from "../../services/contractService";
import { companyService } from "../../services/companyService";
import { forwarderOfferService } from "../../services/forwarderOfferService";
import { routePriceService } from "../../services/routePriceService";
import { routeService } from "../../services/routeService";
import { userService } from "../../services/userService";
import { useAuth } from "../../contexts/AuthContext";
import "./Managements.css";

const ContractManagement = () => {
  const [contracts, setContracts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedContract, setSelectedContract] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientsCompany, setClientsCompany] = useState([]);
  const [clientsRegular, setClientsRegular] = useState([]);
  const [forwarders, setForwarders] = useState([]);
  const [routePrices, setRoutePrices] = useState([]);
  const [forwarderOffers, setForwarderOffers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const { user } = useAuth();

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
      const [clientsCompanyData, allUsersData, forwardersData, routePricesData, forwarderOffersData, routesData] = await Promise.all([
        companyService.getAll({ companyType: 1 }),
        userService.getAll(),
        companyService.getAll({ companyType: 2 }),
        routePriceService.getAll(),
        forwarderOfferService.getAll(),
        routeService.getAll()
      ]);

      setClientsCompany(clientsCompanyData.data);
      setForwarders(forwardersData.data);
      setRoutePrices(routePricesData.data);
      setForwarderOffers(forwarderOffersData.data);
      setRoutes(routesData.data);

      // Kombinujemo Regular i CompanyAdmin u jednu listu za dropdown
const combinedUsers = allUsersData.data
  .filter(u => {
    if (u.userRole === "RegularUser" && !u.companyId) {
      // fizičko lice
      return true;
    }
    if (
      u.userRole === "CompanyAdmin" &&
      u.companyId &&
      clientsCompanyData.data.find(c => c.id === u.companyId && c.companyType === "Client")
    ) {
      // pravno lice
      return true;
    }
    return false; // sve ostalo filtriramo
  })
  .map(u => {
    const company = clientsCompanyData.data.find(c => c.id === u.companyId);
    return {
      id: u.id,
      fullName: `${u.firstName} ${u.lastName}${company ? ` (${company.companyName})` : ""}`
    };
  });

setClientsRegular(combinedUsers);


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

  try {
    if (selectedContract) {
      // Map string value to enum number
      const statusMap = {
        Pending: 0,
        Active: 1,
        Completed: 2,
        Cancelled: 3
      };

      const updateData = {
        terms: form.terms.value,
        contractStatus: form.contractStatus?.value
          ? statusMap[form.contractStatus.value]
          : selectedContract.contractStatus,
        penaltyRatePerHour: Number(form.penaltyRatePerHour.value),
        maxPenaltyPercent: Number(form.maxPenaltyPercent.value),
      };

      await contractService.update(selectedContract.id, updateData);
    } else {
      const createData = {
        clientId: Number(form.clientId.value),
        forwarderId: Number(user.companyId),
        routeId: Number(form.routeId.value),
        routePriceId: Number(form.routePriceId.value),
        forwarderOfferId: Number(form.forwarderOfferId.value),
        contractNumber: form.contractNumber.value,
        terms: form.terms.value,
        penaltyRatePerHour: Number(form.penaltyRatePerHour.value),
        maxPenaltyPercent: Number(form.maxPenaltyPercent.value),
      };
      await contractService.create(createData);
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
              <td>
                {c.clientFullName}{" "}
                {clientsCompany.find((client) => client.id === c.clientId)?.companyName
                  ? "(" +
                    clientsCompany.find((client) => client.id === c.clientId)
                      ?.companyName +
                    ")"
                  : ""}
              </td>
              <td>{c.forwarderCompanyName}</td>
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
      {selectedContract ? (
        <>
          <h3>Edit Contract</h3>
          <form onSubmit={handleSubmit}>
            <label htmlFor="terms">Terms:</label>
            <textarea
              name="terms"
              placeholder="Terms"
              defaultValue={selectedContract?.terms || ""}
            />

            <label htmlFor="contractStatus">Status:</label>
            <select name="contractStatus" defaultValue={selectedContract?.contractStatus || ""}>
              <option value="">Select Status</option>
              <option value="Pending">Pending</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <label htmlFor="penaltyRatePerHour">Penalty Rate per Hour:</label>
            <input
              type="number"
              name="penaltyRatePerHour"
              placeholder="Penalty Rate per Hour"
              defaultValue={selectedContract?.penaltyRatePerHour || ""}
            />

            <label htmlFor="maxPenaltyPercent">Max Penalty Percent:</label>
            <input
              type="number"
              name="maxPenaltyPercent"
              placeholder="Max Penalty Percent"
              defaultValue={selectedContract?.maxPenaltyPercent || ""}
            />

            <div className="modal-actions">
              <button type="submit">Save</button>
              <button type="button" onClick={closeModal}>Cancel</button>
            </div>
          </form>
        </>
      ) : (
        <>
          <h3>Add Contract</h3>
          <form onSubmit={handleSubmit}>
            <label htmlFor="clientId">Client:</label>
            <select name="clientId" required>
              <option value="">Select Client</option>
              {clientsRegular.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.fullName}
                </option>
              ))}
            </select>

            <label htmlFor="routeId">Route:</label>
            <select name="routeId" required>
              <option value="">Select Route</option>
              {routes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.id}: {r.startLocationName} - {r.endLocationName}
                </option>
              ))}
            </select>

            <label htmlFor="routePriceId">Route Prices</label>
            <select name="routePriceId" required>
              <option value="">Select Route Price</option>
              {routePrices.map((r) => (
                <option key={r.id} value={r.id}>
                  Route {r.routeId} - {r.pricePerKm} per km
                </option>
              ))}
            </select>

            <label htmlFor="forwarderOfferId">Forwarder Offers</label>
            <select name="forwarderOfferId">
              <option value="">Select Forwarder Offer</option>
              {forwarderOffers.map((o) => (
                <option key={o.id} value={o.id}>
                  Offer {o.id} - {o.commissionRate}%
                </option>
              ))}
            </select>

            <label htmlFor="contractNumber">Contract Number:</label>
            <input type="text" name="contractNumber" placeholder="Contract Number" required />

            <label htmlFor="terms">Terms:</label>
            <textarea name="terms" placeholder="Terms" />

            <label htmlFor="penaltyRatePerHour">Penalty Rate per Hour:</label>
            <input type="number" name="penaltyRatePerHour" placeholder="Penalty Rate per Hour" />

            <label htmlFor="maxPenaltyPercent">Max Penalty Percent:</label>
            <input type="number" name="maxPenaltyPercent" placeholder="Max Penalty Percent" />

            <div className="modal-actions">
              <button type="submit">Add</button>
              <button type="button" onClick={closeModal}>Cancel</button>
            </div>
          </form>
        </>
      )}
    </div>
  </div>
)}

    </div>
  );
};

export default ContractManagement;
