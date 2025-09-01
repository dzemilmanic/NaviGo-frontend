import { useState, useEffect } from "react";
import { paymentService } from "../../services/paymentService";
import { contractService } from "../../services/contractService";
import { userService } from "../../services/userService";
import { X } from "lucide-react";
import { toast } from 'react-toastify';
import "./Managements.css";
import { useAuth } from "../../contexts/AuthContext";
import Loader from "../Loader/Loader";

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

  const fetchData = async () => {
    setLoading(true);
    try {
      const paymentsResponse = await paymentService.getAll({ search });
      const contractsResponse = await contractService.getAll();
      const clientsResponse = await userService.getAll();

      setPayments(paymentsResponse.data);
      setContracts(contractsResponse.data);
      setClients(clientsResponse.data);
    } catch (error) {
      toast.error("Failed to load payments. Please try again.");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  const openModal = (payment = null) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedPayment(null);
    setIsModalOpen(false);
    setFileUrl(null);
    document.body.style.overflow = 'auto';
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
          toast.success("Payment deleted successfully!");
        } else {
          toast.error(`Failed to delete payment. Message: ${response.message}`);
        }
        await fetchData();
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
        <p>Are you sure you want to delete this payment?</p>
        <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
          <button 
            onClick={confirmDelete}
            style={{
              background: '#dc2626',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Delete
          </button>
          <button 
            onClick={cancelDelete}
            style={{
              background: '#6b7280',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
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
        receiptUrl = uploadResponse.data.url;
        console.log(receiptUrl);
      } catch (error) {
        toast.error("Failed to upload file. Please try again.");
        console.error("Error uploading file:", error);
        setLoading(false);
        return;
      }
    }

    const formData = {
      contractId: Number(e.target.contractId.value),
      receiptUrl,
    };

    try {
      if (selectedPayment) {
        const response = await paymentService.update(selectedPayment.id, formData);
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
      
      await fetchData();
      closeModal();
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
        <div className="header-content">
          <h2 className="header-title">Payment Management</h2>
          <p className="header-subtitle">Manage payments and track financial transactions</p>
        </div>
        <div className="header-actions">
          <input
            type="text"
            placeholder="Search payments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button onClick={() => openModal()} className="primary-btn">
            Add Payment
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="management-table">
          <thead>
            <tr>
              {/* <th>ID</th> */}
              <th>Contract</th>
              <th>Client</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Receipt</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-row">
                  <div className="empty-state">
                    <p>No payments found matching your search criteria.</p>
                  </div>
                </td>
              </tr>
            ) : (
              payments.map((p) => (
                <tr key={p.id} className="table-row">
                  {/* <td>{p.id}</td> */}
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
                        className="receipt-link"
                      >
                        View
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="actions-cell">
                    <div className="action-buttons">
                      <button 
                        onClick={() => openModal(p)}
                        className="action-btn activate-btn"
                        title="Edit payment"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(p.id)}
                        className="action-btn delete-btn"
                        title="Delete payment"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedPayment ? "Edit Payment" : "Add Payment"}</h3>
              <button
                type="button"
                onClick={closeModal}
                className="modal-close-btn"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
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
              </div>

              <div className="form-group">
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
              </div>

              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {selectedPayment ? "Save" : "Add"}
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