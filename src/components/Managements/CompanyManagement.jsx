import { useState, useEffect } from "react";
import { companyService } from "../../services/companyService";
import {
  X,
  Building,
  Trash2,
  RotateCcw,
  Eye,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "lucide-react";
import { toast } from "react-toastify";
import "./Managements.css";
import Loader from "../Loader/Loader";
import { useAuth } from "../../contexts/AuthContext";

const CompanyManagement = ({ userType }) => {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedCompanyForStatus, setSelectedCompanyForStatus] =
    useState(null);
  const [newStatus, setNewStatus] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const { user } = useAuth();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Status mapping for display
  const getStatusText = (status) => {
    const statusStr = String(status).toLowerCase();
    switch (statusStr) {
      case "0":
      case "pending":
        return "Pending";
      case "1":
      case "approved":
        return "Approved";
      case "2":
      case "rejected":
        return "Rejected";
      default:
        return status || "Unknown";
    }
  };

  const getStatusClass = (status) => {
    const statusStr = String(status).toLowerCase();
    switch (statusStr) {
      case "0":
      case "pending":
        return "status-pending";
      case "1":
      case "approved":
        return "status-approved";
      case "2":
      case "rejected":
        return "status-rejected";
      default:
        return "status-unknown";
    }
  };

  // Company type mapping
  const getCompanyTypeText = (type) => {
    switch (type) {
      case 1:
        return "Client";
      case 2:
        return "Forwarder";
      case 3:
        return "Carrier";
      case "Client":
        return "Client";
      case "Forwarder":
        return "Forwarder";
      case "Carrier":
        return "Carrier";
      default:
        return "Unknown";
    }
  };

  // Logo modal functions
  const openImageModal = (imageUrl) => {
    if (!imageUrl) return;
    setSelectedImage(imageUrl);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImage(null);
  };

  // Logo preview component
  const LogoPreview = ({ url, companyName }) => {
    const [imageError, setImageError] = useState(false);

    if (!url || imageError) {
      return (
        <div className="image-preview-placeholder">
          <Building size={16} />
        </div>
      );
    }

    return (
      <div
        className="image-preview-container"
        onClick={() => openImageModal(url)}
        title={`View logo for ${companyName}`}
      >
        <img
          src={url}
          alt={`Logo for ${companyName}`}
          className="image-preview"
          onError={() => setImageError(true)}
        />
      </div>
    );
  };

  // Proof file link component
  const ProofFileLink = ({ url }) => {
    if (!url) {
      return <span>-</span>;
    }

    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="proof-link"
      >
        <Eye size={16} />
      </a>
    );
  };

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await companyService.getAll({
        search,
        page: 1,
        pageSize: 1000,
      });
      setCompanies(response.data.items || response.data || response || []);
    } catch (error) {
      toast.error("Failed to load companies. Please try again.");
      console.error("Error fetching companies:", error);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [search]);

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
        const response = await companyService.updateStatus(
          selectedCompanyForStatus.id,
          newStatus
        );
        if (response.success) {
          toast.success(
            `Company ${companyName} status updated to ${statusText}!`
          );
        } else {
          toast.error(
            `Failed to update company status. Message: ${response.message}`
          );
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

    toast.info(
      <div>
        <p>
          Change status of <strong>{companyName}</strong> to{" "}
          <strong>{statusText}</strong>?
        </p>
        <div style={{ marginTop: "10px", display: "flex", gap: "8px" }}>
          <button
            onClick={confirmUpdate}
            style={{
              background: "#059669",
              color: "white",
              border: "none",
              padding: "6px 12px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            Update
          </button>
          <button
            onClick={cancelUpdate}
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

  const handleDelete = async (id, companyName) => {
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
        if (response.success) {
          toast.success(`Company ${companyName} deleted successfully!`);
        } else {
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

    toast.warn(
      <div>
        <p>
          Are you sure you want to delete company <strong>{companyName}</strong>
          ?
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

  // Filter companies based on search
  const filteredCompanies = companies.filter(
    (c) =>
      c.companyName &&
      c.companyName.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredCompanies.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedCompanies = filteredCompanies.slice(startIndex, endIndex);

  // Reset to first page if current page is out of bounds
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when page size changes
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="management-container">
        <div className="management-header">
          <div className="header-content">
            <h2 className="header-title">Company Management</h2>
            <p className="header-subtitle">
              Manage companies and their information
            </p>
          </div>
          <div className="header-actions">
            <input
              type="text"
              placeholder="Search companies by name..."
              value={search}
              onChange={handleSearchChange}
              className="search-input"
            />
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="page-size-select"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="management-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>PIB</th>
                <th>Email</th>
                <th>Type</th>
                <th>Status</th>
                <th>Logo</th>
                <th>Proof</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCompanies.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-row">
                    <div className="empty-state">
                      <p>No companies found matching your search criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedCompanies.map((company) => (
                  <tr key={company.id}>
                    <td className="company-name">{company.companyName}</td>
                    <td>{company.pib}</td>
                    <td className="email-cell">{company.contactEmail}</td>
                    <td>{getCompanyTypeText(company.companyType)}</td>
                    <td>
                      <span
                        className={`status-badge ${getStatusClass(
                          company.companyStatus
                        )}`}
                      >
                        {getStatusText(company.companyStatus)}
                      </span>
                    </td>
                    <td className="image-cell">
                      {company.logoUrl ? (
                        <LogoPreview
                          url={company.logoUrl}
                          companyName={company.companyName}
                        />
                      ) : (
                        <div className="image-preview-placeholder">
                          <Building size={16} />
                        </div>
                      )}
                    </td>
                    <td className="proof-cell">
                      <ProofFileLink url={company.proofFileUrl} />
                    </td>
                    <td className="actions-cell">
                      {user.role === "SuperAdmin" ? (
                        <div className="action-buttons">
                          <button
                            className="action-btn activate-btn"
                            onClick={() => openStatusModal(company)}
                            title="Change status"
                          >
                            <RotateCcw size={16} />
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(company.id, company.companyName)
                            }
                            className="action-btn delete-btn"
                            title="Delete company"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ) : (
                        "/"
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination-container">
            <div className="pagination-info">
              <span>
                Showing {filteredCompanies.length === 0 ? 0 : startIndex + 1}-
                {Math.min(endIndex, filteredCompanies.length)} of{" "}
                {filteredCompanies.length} companies
              </span>
            </div>
            <div className="pagination-controls">
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ArrowLeftIcon size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`pagination-btn ${
                    currentPage === i + 1 ? "pagination-active" : ""
                  }`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ArrowRightIcon size={16} />
              </button>
            </div>
          </div>
        )}

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
                  <p>
                    Current Status:{" "}
                    <span
                      className={`status-badge ${getStatusClass(
                        selectedCompanyForStatus.companyStatus
                      )}`}
                    >
                      {getStatusText(selectedCompanyForStatus.companyStatus)}
                    </span>
                  </p>
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
                  className="action-btn cancel-btn"
                  onClick={closeStatusModal}
                  disabled={isUpdatingStatus}
                >
                  Cancel
                </button>
                <button
                  className="action-btn submit-btn"
                  onClick={handleStatusUpdate}
                  disabled={isUpdatingStatus}
                >
                  {isUpdatingStatus ? "Updating..." : "Update Status"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Logo Modal */}
        {isImageModalOpen && selectedImage && (
          <div className="image-modal-overlay" onClick={closeImageModal}>
            <div className="image-modal" onClick={(e) => e.stopPropagation()}>
              <div className="image-modal-header">
                <h3 className="image-modal-title">Company Logo</h3>
                <button className="close-btn" onClick={closeImageModal}>
                  <X size={20} />
                </button>
              </div>
              <div className="image-modal-body">
                <img
                  src={selectedImage}
                  alt="Logo preview"
                  className="modal-image"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div
                  className="image-error-fallback"
                  style={{ display: "none" }}
                >
                  <Building size={48} />
                  <p>Unable to load logo</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CompanyManagement;
