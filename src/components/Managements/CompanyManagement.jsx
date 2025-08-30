import { useState, useEffect } from "react";
import { companyService } from "../../services/companyService";
import "./Managements.css";
import Loader from '../Loader/Loader';
const CompanyManagement = ({ userType }) => {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedCompanyForStatus, setSelectedCompanyForStatus] = useState(null);
  const [newStatus, setNewStatus] = useState(0);
  const [loading,setLoading] = useState(false);
  const [companyData, setCompanyData] = useState({
    id: null,
    companyName: "",
    pib: "",
    address: "",
    contactEmail: "",
    website: "",
    description: "",
    maxCommissionRate: 0,
    proofFileUrl: "",
    logoUrl: "",
    companyType: 1,
  });
  const [proofFile, setProofFile] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Status mapping for display
  const getStatusText = (status) => {
    // Handle both string and number values from backend
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
    // Handle both string and number values from backend
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
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const openModal = (company = null) => {
    if (company) {
      setCompanyData({
        id: company.id,
        companyName: company.companyName,
        pib: company.pib,
        address: company.address,
        contactEmail: company.contactEmail,
        website: company.website,
        description: company.description,
        maxCommissionRate: company.maxCommissionRate || 0,
        proofFileUrl: company.proofFileUrl,
        companyType: company.companyType,
      });
    } else {
      setCompanyData({
        id: null,
        companyName: "",
        pib: "",
        address: "",
        contactEmail: "",
        website: "",
        description: "",
        maxCommissionRate: 0,
        proofFileUrl: "",
        companyType: 1,
      });
    }
    setIsModalOpen(true);
  };

  const openStatusModal = (company) => {
    setSelectedCompanyForStatus(company);
    // Convert status to number for select
    const statusStr = String(company.companyStatus).toLowerCase();
    let statusNum = 0;
    if (statusStr === "1" || statusStr === "approved") statusNum = 1;
    else if (statusStr === "2" || statusStr === "rejected") statusNum = 2;
    setNewStatus(statusNum);
    setIsStatusModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);
  const closeStatusModal = () => {
    setIsStatusModalOpen(false);
    setSelectedCompanyForStatus(null);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setCompanyData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleStatusUpdate = async () => {
    if (!selectedCompanyForStatus) return;
    setLoading(true)
    setIsUpdatingStatus(true);
    try {
      await companyService.updateStatus(selectedCompanyForStatus.id, newStatus);
      await fetchCompanies(); // Refresh the data
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
      }finally{
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    setLoading(true)
    try {
      let proofFileUrl = companyData.proofFileUrl;
      let logoFileUrl = companyData.logoUrl;

      // Upload proof file
      if (proofFile) {
        const proofResponse = await companyService.uploadFile(proofFile);
        proofFileUrl = proofResponse.data.url;
      }

      // Upload logo file
      if (logoUrl) {
        const logoResponse = await companyService.uploadFile(logoUrl);
        logoFileUrl = logoResponse.data.url;
      }

      const payload = {
        ...companyData,
        proofFileUrl,
        logoUrl: logoFileUrl,
        companyType: companyData.companyType,
        maxCommissionRate:
          companyData.companyType === 2 ? companyData.maxCommissionRate : null,
      };

      if (companyData.id) {
        await companyService.update(companyData.id, payload);
      } else {
        await companyService.create(payload);
      }

      setIsModalOpen(false);
      fetchCompanies();
      setProofFile(null);
      setLogoUrl(null);
    } catch (error) {
      console.error("Error saving company:", error);
    } finally {
      setLoading(false);
      setIsCreating(false);
    }
  };

  const filteredCompanies = companies.filter((c) =>
    c.companyName.toLowerCase().includes(search.toLowerCase())
  );

  const handleFileChange = (e) => {
    setProofFile(e.target.files[0]);
  };

  const handleLogoChange = (e) => {
    setLogoUrl(e.target.files[0]);
  };
  if(loading){
    return <Loader/>
  }
  return (
    <div className="management-container">
      <div className="management-header">
        <input
          type="text"
          placeholder="Search companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
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
            {filteredCompanies.map((company) => (
              <tr key={company.id}>
                <td>{company.id}</td>
                <td className="company-name">{company.companyName}</td>
                <td>{company.pib}</td>
                <td>{company.contactEmail}</td>
                <td>{getCompanyTypeText(company.companyType)}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(company.companyStatus)}`}>
                    {getStatusText(company.companyStatus)}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn-status" 
                    onClick={() => openStatusModal(company)}
                  >
                    Change Status
                  </button>
                  <button onClick={() => handleDelete(company.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Status Update Modal */}
      {isStatusModalOpen && selectedCompanyForStatus && (
        <div className="company-status-modal-overlay">
          <div className="modal company-status-modal">
            <div className="company-status-modal-header">
              <h3>Change Company Status</h3>
              <button className="close-btn" onClick={closeStatusModal}>×</button>
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
                className="btn btn-primary" 
                onClick={handleStatusUpdate}
                disabled={isUpdatingStatus}
              >
                {isUpdatingStatus ? "Updating..." : "Update Status"}
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={closeStatusModal}
                disabled={isUpdatingStatus}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Company Edit/Create Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{companyData.id ? "Edit Company" : "Add Company"}</h3>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="company-form">
              <div className="form-row">
                <input
                  type="text"
                  name="companyName"
                  placeholder="Company Name"
                  value={companyData.companyName}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="pib"
                  placeholder="PIB"
                  value={companyData.pib}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={companyData.address}
                onChange={handleInputChange}
              />
              <div className="form-row">
                <input
                  type="email"
                  name="contactEmail"
                  placeholder="Contact Email"
                  value={companyData.contactEmail}
                  onChange={handleInputChange}
                />
                <input
                  type="url"
                  name="website"
                  placeholder="Website"
                  value={companyData.website}
                  onChange={handleInputChange}
                />
              </div>
              <textarea
                name="description"
                placeholder="Description"
                value={companyData.description}
                onChange={handleInputChange}
              />
              {userType === "shipper" && <>
                <label htmlFor="maxCommissionRate">Max Commission Rate</label>
                <input
                  type="number"
                  name="maxCommissionRate"
                  placeholder="Max Commission Rate"
                  value={companyData.maxCommissionRate}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  required
                />
              </>}

              <div className="file-inputs">
                <div className="file-input-wrapper">
                  <label htmlFor="proofFileUrl">
                    {proofFile
                      ? `Selected: ${proofFile.name}`
                      : "Select Proof File"}
                  </label>
                  <input
                    type="file"
                    id="proofFileUrl"
                    name="proofFileUrl"
                    onChange={handleFileChange}
                  />
                </div>
                <div className="file-input-wrapper">
                  <label htmlFor="logoUrl">
                    {logoUrl ? `Selected: ${logoUrl.name}` : "Select Logo File"}
                  </label>
                  <input
                    type="file"
                    id="logoUrl"
                    name="logoUrl"
                    accept="image/*"
                    onChange={handleLogoChange}
                  />
                </div>
              </div>

              <select
                name="companyType"
                value={companyData.companyType}
                onChange={handleInputChange}
                className="company-type-select"
              >
                <option value={1}>Client</option>
                <option value={2}>Forwarder</option>
                <option value={3}>Carrier</option>
              </select>

              <div className="modal-actions">
                <button type="submit" disabled={isCreating} className="btn btn-primary">
                  {isCreating ? "Saving..." : companyData.id ? "Save" : "Add"}
                </button>
                <button type="button" onClick={closeModal} className="btn btn-secondary">
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

export default CompanyManagement;