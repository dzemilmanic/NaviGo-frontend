import { useState, useEffect } from "react";
import { contractService } from "../../services/contractService";
import { routeService } from "../../services/routeService";
import { useAuth } from "../../contexts/AuthContext";
import CarrierModal from "../BookingModal/CarrierModal.jsx";
import { Download, Trash2, Pencil, FileCheck2 } from "lucide-react";
import { toast } from "react-toastify";
import "./Managements.css";
import Loader from "../Loader/Loader";
import { jsPDF } from "jspdf";
import { shipmentService } from "../../services/shipmentService";

const ContractManagement = () => {
  const [contracts, setContracts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedContract, setSelectedContract] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [routes, setRoutes] = useState([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [shipments, setShipments] = useState([]);
  const [allShipments, setAllShipments] = useState([]);

  // Main data fetch - only runs once on component mount
  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        contractsResponse,
        routesData,
        shipmentsData,
      ] = await Promise.all([
        contractService.getAll(),
        routeService.getAll(),
        shipmentService.getAll()
      ]);

      setContracts(contractsResponse.data);
      setRoutes(routesData.data);
      setAllShipments(shipmentsData.data);
    } catch (error) {
      toast.error("Failed to load contracts. Please try again.");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Filter shipments when selectedContract changes
  useEffect(() => {
    if (selectedContract && allShipments.length > 0) {
      const filteredShipments = allShipments.filter(
        (shipment) => shipment.contractId === selectedContract.id
      );
      setShipments(filteredShipments);
    } else {
      setShipments([]);
    }
  }, [selectedContract, allShipments]);

  const generateContractPDF = (contract) => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text("TRANSPORTATION CONTRACT", 105, 20, { align: "center" });

    doc.setFontSize(12);
    let y = 40;

    doc.text(`Contract Number: ${contract.contractNumber}`, 20, y);
    y += 10;

    doc.text(`Client: ${contract.clientFullName} `, 20, y);
    y += 10;

    doc.text(`Forwarder: ${contract.forwarderCompanyName}`, 20, y);
    y += 10;

    const route = routes.find((r) => r.id === contract.routeId);
    const transporterCompany = route?.companyName || "N/A";
    const routeText = route
      ? `${route.startLocationName} - ${route.endLocationName}`
      : contract.routeId;

    doc.text(`Transporter: ${transporterCompany}`, 20, y);
    y += 10;
    doc.text(`Route: ${routeText}`, 20, y);
    y += 20;

    const contractText = `This contract defines the transportation of goods by the forwarder and transporter.
The parties to the contract agree to all the terms and rules specified in the contract.
The payment terms, liability, and obligations are detailed below.`;
    doc.text(contractText, 20, y, { maxWidth: 170 });

    y += 50;

    doc.text("____________________", 20, y);
    doc.text("Client", 20, y + 10);

    doc.text("____________________", 80, y);
    doc.text("Forwarder", 80, y + 10);

    doc.text("____________________", 140, y);
    doc.text("Transporter", 140, y + 10);

    doc.save(`Contract_${contract.contractNumber}.pdf`);
    toast.success("Contract PDF downloaded successfully!");
  };

  const openModal = (contract = null) => {
    setSelectedContract(contract);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedContract(null);
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
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
          toast.success("Contract deleted successfully!");
          setContracts((prevContracts) =>
            prevContracts.filter((contract) => contract.id !== id)
          );
        } else {
          toast.error(
            `Failed to delete contract. Message: ${response.message}`
          );
        }
      } catch (error) {
        toast.error("Failed to delete contract. Please try again.");
        console.error("Error deleting contract:", error);
      } finally {
        setLoading(false);
      }
    };
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

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await contractService.updateContractStatusCarrier(
        selectedContract.id,
        { ...data }
      );
      if (!response.success) {
        toast.error(`Failed to accept contract. Message: ${response.message}`);
        return;
      }
      toast.success("Contract has been accepted successfully!");
      closeModal();
      setContracts((prevContracts) =>
        prevContracts.map((contract) =>
          contract.id === selectedContract.id
            ? { ...contract, contractStatus: "Active" }
            : contract
        )
      );
    } catch (error) {
      toast.error(`Error accepting contract. ${error.message}`);
    }finally{
      setLoading(false);
    }
  };

  const handleReject = async (contract) => {
    setLoading(true);
    try {
      const response = await contractService.updateContractStatusCarrier(
        selectedContract.id,
        { ...contract }
      );
      if (!response.success) {
        toast.error(`Failed to reject contract. Message: ${response.message}`);
        return;
      }

      toast.success("Contract has been rejected successfully!");
      closeModal();
      setContracts((prevContracts) =>
        prevContracts.map((c) =>
          c.id === selectedContract.id
            ? { ...c, contractStatus: "Rejected" }
            : c
        )
      );
    } catch (error) {
      toast.error(`Error rejecting contract. ${error.message}`);
    }finally{
      setLoading(false);
    }
  };

  const finishContract = async (c) => {
    setSelectedContract(c);
    const confirmFinish = async () => {
      toast.dismiss();
      setLoading(true);
      try {
        const response = await contractService.update(selectedContract.id, {
          contractStatus: 2,
        });

        if (!response.success) {
          toast.error(
            `Failed to finish contract. Message: ${response.message}`
          );
          return;
        }

        toast.success("Contract has been finished successfully!");
        setContracts((prevContracts) =>
          prevContracts.map((contract) =>
            contract.id === selectedContract.id
              ? { ...contract, contractStatus: 2 }
              : contract
          )
        );
      } catch (err) {
        toast.error(`Error finishing contract. ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    const cancelFinish = () => {
      toast.dismiss();
      toast.info("Finish operation cancelled");
    };

    toast.warn(
      <div>
        <p>
          Are you sure you want to finish contract{" "}
          <strong>#{selectedContract.contractNumber}</strong>?
        </p>
        <div style={{ marginTop: "10px", display: "flex", gap: "8px" }}>
          <button
            onClick={confirmFinish}
            style={{
              background: "#16a34a",
              color: "white",
              border: "none",
              padding: "6px 12px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            Finish
          </button>
          <button
            onClick={cancelFinish}
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

  if (loading) {
    return <Loader />;
  }

  const filteredContracts = contracts.filter((c) =>
    [
      c.clientId?.toString(),
      c.clientFullName,
      c.forwarderId?.toString(),
      c.forwarderCompanyName,
      c.routeId?.toString(),
      c.contractNumber,
      c.contractDate,
      c.terms,
      c.contractStatus,
      c.penaltyRatePerHour?.toString(),
      c.maxPenaltyPercent?.toString(),
      c.validUntil,
      c.signedDate,
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
          <h2 className="header-title">Contract Management</h2>
          <p className="header-subtitle">
            Manage transportation contracts and agreements
          </p>
        </div>
        <div className="header-actions">
          <input
            type="text"
            placeholder="Search contracts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="table-container">
        <table className="management-table">
          <thead>
            <tr>
              <th>Contract Number</th>
              <th>Client</th>
              <th>Forwarder</th>
              <th>Route</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredContracts.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-row">
                  <div className="empty-state">
                    <p>No contracts found matching your search criteria.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredContracts.map((c) => (
                <tr key={c.id} className="table-row">
                  <td>{c.contractNumber}</td>
                  <td>{c.clientFullName}</td>
                  <td>{c.forwarderCompanyName}</td>
                  <td>{c.routeId}</td>
                  <td>{c.contractStatus}</td>
                  <td className="actions-cell">
                    {user.role === "CompanyAdmin" &&
                      user.companyType === "Carrier" && (
                        <div className="action-buttons">
                          {/* Finish button */}
                          {c.contractStatus === "Active" && (
                            <button
                              onClick={() => finishContract(c)}
                              className="action-btn view-btn"
                              title="Finish contract"
                            >
                              <Pencil size={16} />
                            </button>
                          )}

                          {/* Edit/Delete buttons only for Pending */}
                          {c.contractStatus === "Pending" && (
                            <>
                              <button
                                onClick={() => openModal(c)}
                                className="action-btn activate-btn"
                                title="Edit contract"
                              >
                                <FileCheck2 size={16} />
                              </button>
                              <button
                                onClick={() =>
                                  handleDelete(c.id, c.contractNumber)
                                }
                                className="action-btn delete-btn"
                                title="Delete contract"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                          {c.contractStatus !== "Pending" &&
                            c.contractStatus !== "Cancelled" && (
                              <button
                                onClick={() => generateContractPDF(c)}
                                className="action-btn download-btn"
                                title="Download contract PDF"
                              >
                                <Download size={16} />
                              </button>
                            )}
                        </div>
                      )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <CarrierModal
          contract={selectedContract}
          shipments={shipments}
          onClose={closeModal}
          onSubmit={handleSubmit}
          onReject={handleReject}
        />
      )}
    </div>
  );
};

export default ContractManagement;
