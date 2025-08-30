import { useState, useEffect } from "react";
import { companyService } from "../../services/companyService";
import { X } from "lucide-react";
import "./Managements.css";
import Loader from '../Loader/Loader';

const CompanyManagement = ({ userType }) => {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedCompanyForStatus, setSelectedCompanyForStatus] = useState(null);
  const [newStatus, setNewStatus] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Status mapping for display
  const getStatusText = (status) => {
    const statusStr = String(status).toLowerCase();
    switch (statusStr) {
      case "0":
      case "pending": return "Pending";
      case "1":
      case "approved": return "Approved";
      case "2":
      case "rejected": return "Rejected";
      default: return status || "Unknown";
    }
  };

  const getStatusClass = (status) => {
    const statusStr = String(status).toLowerCase();
    switch (statusStr) {
      case "0":
      case "pending": return "status-pending";
      case "1":
      case "approved": return "status-approved";
      case "2":
      case "rejected": return "status-rejected";
      default: return "status-unknown";
    }
  };

  // Company type mapping
  const getCompanyTypeText = (type) => {
    switch (type) {
      case 1: return "Client";
      case 2: return "Forwarder";
      case 3: return "Carrier";
      case "Client": return "Client";
      case "Forwarder": return "Forwarder";
      case "Carrier": return "Carrier";
      default: return "Unknown";
    }
  };

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await companyService.getAll();
      setCompanies(response.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const openStatusModal = (company) => {
    setSelectedCompanyForStatus(company);
    const statusStr = String(company.companyStatus).toLowerCase();
    let statusNum = 0;
    if (statusStr === "1" || statusStr === "approved") statusNum = 1;
    else if (statusStr === "2" || statusStr === "rejected") statusNum = 2;
    setNewStatus(statusNum);
    setIsStatusModalOpen(true);
  };

  const closeStatusModal = () => {
    setIsStatusModalOpen(false);
    setSelectedCompanyForStatus(null);
  };

  const handleStatusUpdate = async () => {
    if (!selectedCompanyForStatus) return;
    setLoading(true)
    setIsUpdatingStatus(true);
    try {
      await companyService.updateStatus(selectedCompanyForStatus.id, newStatus);
      await fetchCompanies();
      closeStatusModal();
    } catch (error) {
      console.error("Error updating company status:", error);
      alert("Failed to update company status. Please try again.");
    } finally {
      setLoading(false);
      setIsUpdatingStatus(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      setLoading(true);
      try {
        await companyService.delete(id);
        fetchCompanies();
      } catch (error) {
        console.error("Error deleting company:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredCompanies = companies.filter((c) =>
    c.companyName.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <Loader />
  }

  return (
    <div className="management-container">
      <div className="management-header">
        <div className="header-content">
          <h2 className="header-title">Company Management</h2>
          <p className="header-subtitle">Manage companies and their information</p>
        </div>
        <div className="header-actions">
          <input
            type="text"
            placeholder="Search companies by name..."
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
              <th>ID</th>
              <th>Name</th>
              <th>PIB</th>
              <th>Email</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-row">
                  <div className="empty-state">
                    <p>No companies found matching your search criteria.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredCompanies.map((company) => (
                <tr key={company.id}>
                  <td>{company.id}</td>
                  <td className="company-name">{company.companyName}</td>
                  <td>{company.pib}</td>
                  <td className="email-cell">{company.contactEmail}</td>
                  <td>{getCompanyTypeText(company.companyType)}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(company.companyStatus)}`}>
                      {getStatusText(company.companyStatus)}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <div className="action-buttons">
                      <button 
                        className="action-btn activate-btn" 
                        onClick={() => openStatusModal(company)}
                        title="Change status"
                      >
                        Change Status
                      </button>
                      <button 
                        onClick={() => handleDelete(company.id)}
                        className="action-btn delete-btn"
                        title="Delete company"
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

      {/* Status Update Modal */}
      {isStatusModalOpen && selectedCompanyForStatus && (
        <div className="company-status-modal-overlay">
          <div className="company-status-modal">
            <div className="company-status-modal-header">
              <h3>Change Company Status</h3>
              <button className="close-btn" onClick={closeStatusModal}>
                <X size={20} />
              </button>
            </div>
            <div className="company-status-modal-body">
              <div className="company-status-company-info">
                <h4>{selectedCompanyForStatus.companyName}</h4>
                <p>Current Status: <span className={`status-badge ${getStatusClass(selectedCompanyForStatus.companyStatus)}`}>
                  {getStatusText(selectedCompanyForStatus.companyStatus)}
                </span></p>
              </div>
              <div className="company-status-status-selection">
                <label htmlFor="status-select">New Status:</label>
                <select
                  id="status-select"
                  value={newStatus}
                  onChange={(e) => setNewStatus(parseInt(e.target.value))}
                  className="status-select"
                >
                  <option value={0}>Pending</option>
                  <option value={1}>Approved</option>
                  <option value={2}>Rejected</option>
                </select>
              </div>
            </div>
            <div className="company-status-modal-actions">
              <button 
                className="cancel-btn" 
                onClick={closeStatusModal}
                disabled={isUpdatingStatus}
              >
                Cancel
              </button>
              <button 
                className="submit-btn" 
                onClick={handleStatusUpdate}
                disabled={isUpdatingStatus}
              >
                {isUpdatingStatus ? "Updating..." : "Update Status"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyManagement;