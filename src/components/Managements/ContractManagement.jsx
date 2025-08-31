import { useState, useEffect } from "react";
import { contractService } from "../../services/contractService";
import { companyService } from "../../services/companyService";
import { forwarderOfferService } from "../../services/forwarderOfferService";
import { routePriceService } from "../../services/routePriceService";
import { routeService } from "../../services/routeService";
import { userService } from "../../services/userService";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import "./Managements.css";
import Loader from "../Loader/Loader";
import { jsPDF } from "jspdf";

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
  const [loading, setLoading] = useState(false);
  // Fetch contracts
  const fetchContracts = async () => {
    setLoading(true);
    try {
      const response = await contractService.getAll();
      setContracts(response.data);
    } catch (error) {
      console.error("Error fetching contracts:", error);
      toast.error("Failed to load contracts. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const generateContractPDF = (contract) => {
    const doc = new jsPDF();

    // Font i veličina
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text("TRANSPORTATION CONTRACT", 105, 20, { align: "center" });

    doc.setFontSize(12);
    let y = 40;

    // Podaci o ugovoru
    doc.text(`Contract Number: ${contract.contractNumber}`, 20, y);
    y += 10;

    const clientCompany = clientsCompany.find(
      (c) => c.id === contract.clientId
    )?.companyName;
    doc.text(
      `Client: ${contract.clientFullName} ${
        clientCompany ? `(${clientCompany})` : ""
      }`,
      20,
      y
    );
    y += 10;

    doc.text(`Forwarder: ${contract.forwarderCompanyName}`, 20, y);
    y += 10;

    // Dohvati rutu i transporter kompaniju
    const route = routes.find((r) => r.id === contract.routeId);
    const transporterCompany = route?.companyName || "N/A";
    const routeText = route
      ? `${route.startLocationName} - ${route.endLocationName}`
      : contract.routeId;

    doc.text(`Transporter: ${transporterCompany}`, 20, y);
    y += 10;
    doc.text(`Route: ${routeText}`, 20, y);
    y += 20;

    // Tekst ugovora
    const contractText = `This contract defines the transportation of goods by the forwarder and transporter.
The parties to the contract agree to all the terms and rules specified in the contract.
The payment terms, liability, and obligations are detailed below.`;
    doc.text(contractText, 20, y, { maxWidth: 170 });

    y += 50;

    // Potpisi
    doc.text("____________________", 20, y);
    doc.text("Client", 20, y + 10);

    doc.text("____________________", 80, y);
    doc.text("Forwarder", 80, y + 10);

    doc.text("____________________", 140, y);
    doc.text("Transporter", 140, y + 10);

    // Sačuvaj PDF
    doc.save(`Contract_${contract.contractNumber}.pdf`);
  };

  // Fetch dropdown data
  const fetchDropdownData = async () => {
    setLoading(true);
    try {
      const [
        clientsCompanyData,
        allUsersData,
        forwardersData,
        routePricesData,
        forwarderOffersData,
        routesData,
      ] = await Promise.all([
        companyService.getAll({ companyType: 1 }),
        userService.getAll(),
        companyService.getAll({ companyType: 2 }),
        routePriceService.getAll(),
        forwarderOfferService.getAll(),
        routeService.getAll(),
      ]);

      setClientsCompany(clientsCompanyData.data);
      setForwarders(forwardersData.data);
      setRoutePrices(routePricesData.data);
      setForwarderOffers(forwarderOffersData.data);
      setRoutes(routesData.data);

      // Kombinujemo Regular i CompanyAdmin u jednu listu za dropdown
      const combinedUsers = allUsersData.data
        .filter((u) => {
          if (u.userRole === "RegularUser" && !u.companyId) {
            // fizičko lice
            return true;
          }
          if (
            u.userRole === "CompanyAdmin" &&
            u.companyId &&
            clientsCompanyData.data.find(
              (c) => c.id === u.companyId && c.companyType === "Client"
            )
          ) {
            // pravno lice
            return true;
          }
          return false; // sve ostalo filtriramo
        })
        .map((u) => {
          const company = clientsCompanyData.data.find(
            (c) => c.id === u.companyId
          );
          return {
            id: u.id,
            fullName: `${u.firstName} ${u.lastName}${
              company ? ` (${company.companyName})` : ""
            }`,
          };
        });

      setClientsRegular(combinedUsers);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    } finally {
      setLoading(false);
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
  const handleDelete = async (id, contractNumber) => {
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
        const response = await contractService.delete(id);
        if (response.success) {
          toast.success(`Contract ${contractNumber} deleted successfully!`);
        } else {
          toast.error(
            `Failed to delete contract. Message: ${response.message}`
          );
        }
        await fetchContracts();
      } catch (error) {
        toast.error("Failed to delete contract. Please try again.");
        console.error("Error deleting contract:", error);
      } finally {
        setLoading(false);
      }
    };

    // Show confirmation toast
    toast.warn(
      <div>
        <p>
          Are you sure you want to delete contract{" "}
          <strong>{contractNumber}</strong>?
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
    const form = e.target;
    setLoading(true);
    try {
      if (selectedContract) {
        // Map string value to enum number
        const statusMap = {
          Pending: 0,
          Active: 1,
          Completed: 2,
          Cancelled: 3,
        };

        const updateData = {
          terms: form.terms.value,
          contractStatus: form.contractStatus?.value
            ? statusMap[form.contractStatus.value]
            : selectedContract.contractStatus,
          penaltyRatePerHour: Number(form.penaltyRatePerHour.value),
          maxPenaltyPercent: Number(form.maxPenaltyPercent.value),
        };

        const response = await contractService.update(
          selectedContract.id,
          updateData
        );
        if (response.success) {
          toast.success("Contract updated successfully!");
        } else {
          toast.error(
            `Failed to update contract. Message: ${response.message}`
          );
        }
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
        const response = await contractService.create(createData);
        if (response.success) {
          toast.success("Contract created successfully!");
        } else {
          toast.error(
            `Failed to create contract. Message: ${response.message}`
          );
        }
      }

      fetchContracts();
      closeModal();
    } catch (error) {
      toast.error("Failed to save contract. Please try again.");
      console.error("Error saving contract:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }
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
                {clientsCompany.find((client) => client.id === c.clientId)
                  ?.companyName
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
                <button onClick={() => handleDelete(c.id, c.contractNumber)}>
                  Delete
                </button>
                <button onClick={() => generateContractPDF(c)}>Download</button>
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
                  <select
                    name="contractStatus"
                    defaultValue={selectedContract?.contractStatus || ""}
                  >
                    <option value="">Select Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>

                  <label htmlFor="penaltyRatePerHour">
                    Penalty Rate per Hour:
                  </label>
                  <input
                    type="number"
                    name="penaltyRatePerHour"
                    placeholder="Penalty Rate per Hour"
                    defaultValue={selectedContract?.penaltyRatePerHour || ""}
                  />

                  <label htmlFor="maxPenaltyPercent">
                    Max Penalty Percent:
                  </label>
                  <input
                    type="number"
                    name="maxPenaltyPercent"
                    placeholder="Max Penalty Percent"
                    defaultValue={selectedContract?.maxPenaltyPercent || ""}
                  />

                  <div className="modal-actions">
                    <button type="submit">Save</button>
                    <button type="button" onClick={closeModal}>
                      Cancel
                    </button>
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
                  <input
                    type="text"
                    name="contractNumber"
                    placeholder="Contract Number"
                    required
                  />

                  <label htmlFor="terms">Terms:</label>
                  <textarea name="terms" placeholder="Terms" />

                  <label htmlFor="penaltyRatePerHour">
                    Penalty Rate per Hour:
                  </label>
                  <input
                    type="number"
                    name="penaltyRatePerHour"
                    placeholder="Penalty Rate per Hour"
                  />

                  <label htmlFor="maxPenaltyPercent">
                    Max Penalty Percent:
                  </label>
                  <input
                    type="number"
                    name="maxPenaltyPercent"
                    placeholder="Max Penalty Percent"
                  />

                  <div className="modal-actions">
                    <button type="submit">Add</button>
                    <button type="button" onClick={closeModal}>
                      Cancel
                    </button>
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
