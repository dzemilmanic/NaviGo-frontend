import { useState, useEffect } from "react";
import { companyService } from "../../services/companyService";
import { X } from "lucide-react";
import { toast } from 'react-toastify';
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
      //toast.success("Companies loaded successfully!");
    } catch (error) {
      toast.error("Failed to load companies. Please try again.");
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
    
    const statusText = getStatusText(newStatus);
    const companyName = selectedCompanyForStatus.companyName;

    // Custom toast confirmation
    const confirmUpdate = () => {
      toast.dismiss();
      performStatusUpdate();
    };

    const cancelUpdate = () => {
      toast.dismiss();
      toast.info("Status update cancelled");
    };

    const performStatusUpdate = async () => {
      setLoading(true);
      setIsUpdatingStatus(true);
      try {
        const response = await companyService.updateStatus(selectedCompanyForStatus.id, newStatus);
        if(response.success){
          toast.success(`Company ${companyName} status updated to ${statusText}!`);
        }else{
          toast.error(`Failed to update company status. Message: ${response.message}`);
        }
        await fetchCompanies();
        closeStatusModal();
      } catch (error) {
        toast.error("Failed to update company status. Please try again.");
        console.error("Error updating company status:", error);
      } finally {
        setLoading(false);
        setIsUpdatingStatus(false);
      }
    };

    // Show confirmation toast
    toast.info(
      <div>
        <p>Change status of <strong>{companyName}</strong> to <strong>{statusText}</strong>?</p>
        <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
          <button 
            onClick={confirmUpdate}
            style={{
              background: '#059669',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Update
          </button>
          <button 
            onClick={cancelUpdate}
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

  const handleDelete = async (id, companyName) => {
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
        const response = await companyService.delete(id);
        if(response.success){
          toast.success(`Company ${companyName} deleted successfully!`);
        }else{
          toast.error(`Failed to delete company. Message: ${response.message}`);
        }
        await fetchCompanies();
      } catch (error) {
        toast.error("Failed to delete company. Please try again.");
        console.error("Error deleting company:", error);
      } finally {
        setLoading(false);
      }
    };

    // Show confirmation toast
    toast.warn(
      <div>
        <p>Are you sure you want to delete company <strong>{companyName}</strong>?</p>
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
                        onClick={() => handleDelete(company.id, company.companyName)}
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