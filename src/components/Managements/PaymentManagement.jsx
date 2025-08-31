import { useState, useEffect } from "react";
import { paymentService } from "../../services/paymentService";
import { contractService } from "../../services/contractService";
import { userService } from "../../services/userService"; // za klijente
import "./Managements.css";
import { useAuth } from "../../contexts/AuthContext";
import Loader from "../Loader/Loader";
import { toast } from "react-toastify";
const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contracts, setContracts] = useState([]);
  const [clients, setClients] = useState([]);
  const { user } = useAuth();
  const [fileUrl, setFileUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await paymentService.getAll({ search });
      setPayments(response.data);
    } catch (error) {
      toast.error("Failed to load payments. Please try again.");
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const response = await contractService.getAll();
      setContracts(response.data);
    } catch (error) {
      toast.error("Failed to load contracts. Please try again.");
      console.error("Error fetching contracts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await userService.getAll();
      setClients(response.data);
    } catch (error) {
      toast.error("Failed to load clients. Please try again.");
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchContracts();
    fetchClients();
  }, [search]);

  const openModal = (payment = null) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPayment(null);
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
        const response = await paymentService.delete(id);
        if (response.success) {
          toast.success(`Payment ${id} deleted successfully!`);
        } else {
          toast.error(`Failed to delete payment. Message: ${response.message}`);
        }
        await fetchPayments();
      } catch (error) {
        toast.error("Failed to delete payment. Please try again.");
        console.error("Error deleting payment:", error);
      } finally {
        setLoading(false);
      }
    };

    // Show confirmation toast
    toast.warn(
      <div>
        <p>
          Are you sure you want to delete payment <strong>{id}</strong>?
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
    let receiptUrl = selectedPayment?.receiptUrl || "";
    setLoading(true);
    if (fileUrl) {
      try {
        const uploadResponse = await paymentService.uploadFile(fileUrl);
        receiptUrl = uploadResponse.data.url; // URL sa Azure-a(
        console.log(receiptUrl);
      } catch (error) {
        console.error("Error uploading file:", error);
        return;
      }
    }
    const formData = {
      contractId: Number(e.target.contractId.value),
      receiptUrl, // ovo se uvek šalje
    };

    try {
      if (selectedPayment) {
        const response = await paymentService.update(
          selectedPayment.id,
          formData
        );
        if (response.success) {
          toast.success("Payment updated successfully!");
        } else {
          toast.error(`Failed to update payment. Message: ${response.message}`);
        }
      } else {
        const response = await paymentService.create(formData);
        if (response.success) {
          toast.success("Payment created successfully!");
        } else {
          toast.error(`Failed to create payment. Message: ${response.message}`);
        }
      }
      fetchPayments();
      closeModal();
      setFileUrl(null); // reset fajla
    } catch (error) {
      toast.error("Failed to save payment. Please try again.");
      console.error("Error saving payment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFileUrl(e.target.files[0]);
  };
  if (loading) {
    return <Loader />;
  }
  return (
    <div className="management-container">
      <div className="management-header">
        <input
          type="text"
          placeholder="Search payments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => openModal()}>Add Payment</button>
      </div>

      <table className="management-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Contract</th>
            <th>Client</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Receipt</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.contract}</td>
              <td>{p.client}</td>
              <td>{p.amount}</td>
              <td>{p.paymentStatus}</td>
              <td>
                {p.receiptUrl ? (
                  <a
                    href={p.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View
                  </a>
                ) : (
                  "N/A"
                )}
              </td>
              <td>
                <button onClick={() => openModal(p)}>Edit</button>
                <button onClick={() => handleDelete(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>{selectedPayment ? "Edit Payment" : "Add Payment"}</h3>
            <form onSubmit={handleSubmit}>
              <label htmlFor="contractId">Contract:</label>
              <select
                name="contractId"
                defaultValue={selectedPayment?.contractId || ""}
                required
              >
                <option value="">Select Contract</option>
                {contracts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.contractNumber}
                  </option>
                ))}
              </select>

              <div className="file-input-wrapper">
                <label htmlFor="receiptFile">
                  {fileUrl
                    ? `Selected: ${fileUrl.name}`
                    : "Select Receipt File"}
                </label>
                <input
                  type="file"
                  id="receiptFile"
                  name="receiptFile"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                />
              </div>

              <div className="modal-actions">
                <button type="submit">
                  {selectedPayment ? "Save" : "Add"}
                </button>
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

export default PaymentManagement;
