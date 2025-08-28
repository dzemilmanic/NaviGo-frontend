import { useState, useEffect } from "react";
import { paymentService } from "../../services/paymentService";
import { contractService } from "../../services/contractService";
import { userService } from "../../services/userService"; // za klijente
import "./Managements.css";

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contracts, setContracts] = useState([]);
  const [clients, setClients] = useState([]);

  const fetchPayments = async () => {
    try {
      const response = await paymentService.getAll({ search });
      setPayments(response.data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const fetchContracts = async () => {
    try {
      const response = await contractService.getAll();
      setContracts(response.data);
    } catch (error) {
      console.error("Error fetching contracts:", error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await userService.getAll({ userRole: 1 }); // regular users / clients
      setClients(response.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
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
    if (window.confirm("Are you sure you want to delete this payment?")) {
      try {
        await paymentService.delete(id);
        fetchPayments();
      } catch (error) {
        console.error("Error deleting payment:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = {
      contractId: Number(form.contractId.value),
      amount: Number(form.amount.value),
      paymentStatus: Number(form.paymentStatus.value),
      receiptUrl: form.receiptUrl.value,
      clientId: Number(form.clientId.value),
    };

    try {
      if (selectedPayment) {
        await paymentService.update(selectedPayment.id, formData);
      } else {
        await paymentService.create(formData);
      }
      fetchPayments();
      closeModal();
    } catch (error) {
      console.error("Error saving payment:", error);
    }
  };

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
              <td>{p.contractId}</td>
              <td>{p.clientId}</td>
              <td>{p.amount}</td>
              <td>{p.paymentStatus}</td>
              <td>
                {p.receiptUrl ? (
                  <a href={p.receiptUrl} target="_blank" rel="noopener noreferrer">
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
              <select name="contractId" defaultValue={selectedPayment?.contractId || ""} required>
                <option value="">Select Contract</option>
                {contracts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.contractNumber}
                  </option>
                ))}
              </select>

              <select name="clientId" defaultValue={selectedPayment?.clientId || ""} required>
                <option value="">Select Client</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.firstName} {c.lastName}
                  </option>
                ))}
              </select>

              <input
                type="number"
                name="amount"
                placeholder="Amount"
                defaultValue={selectedPayment?.amount || 0}
                required
              />

              <select
                name="paymentStatus"
                defaultValue={selectedPayment?.paymentStatus || 0}
                required
              >
                <option value={0}>Pending</option>
                <option value={1}>Verified</option>
                <option value={2}>Rejected</option>
              </select>

              <input
                type="text"
                name="receiptUrl"
                placeholder="Receipt URL"
                defaultValue={selectedPayment?.receiptUrl || ""}
              />

              <div className="modal-actions">
                <button type="submit">{selectedPayment ? "Save" : "Add"}</button>
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
