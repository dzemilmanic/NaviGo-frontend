import { useState, useEffect } from "react";
import { companyService } from "../../services/companyService";
import "./Managements.css";
const CompanyManagement = ({ userType }) => {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const fetchCompanies = async () => {
    try {
      const response = await companyService.getAll();
      setCompanies(response.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
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

  const closeModal = () => setIsModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setCompanyData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      try {
        await companyService.delete(id);
        fetchCompanies();
      } catch (error) {
        console.error("Error deleting company:", error);
      }
    }
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsCreating(true);

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
      // maxCommissionRate mora postojati, ali null ako nije Forwarder
      maxCommissionRate:
        companyData.companyType === 2 ? companyData.maxCommissionRate : null,
    };

    console.log(payload); // sada treba da bude validan za backend

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
  return (
    <div className="management-container">
      <div className="management-header">
        <input
          type="text"
          placeholder="Search companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        
      </div>

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
              <td>{company.companyName}</td>
              <td>{company.pib}</td>
              <td>{company.contactEmail}</td>
              <td>{company.companyType}</td>
              <td>{company.companyStatus}</td>
              <td>
                
                <button onClick={() => handleDelete(company.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>{companyData.id ? "Edit Company" : "Add Company"}</h3>
            <form onSubmit={handleSubmit} className="company-form">
              <label htmlFor="companyName">Company Name</label>
              <input
                type="text"
                name="companyName"
                placeholder="Company Name"
                value={companyData.companyName}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="pib">PIB</label>
              <input
                type="text"
                name="pib"
                placeholder="PIB"
                value={companyData.pib}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="address">Address</label>
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={companyData.address}
                onChange={handleInputChange}
              />
              <label htmlFor="contactEmail">Contact Email</label>
              <input
                type="email"
                name="contactEmail"
                placeholder="Contact Email"
                value={companyData.contactEmail}
                onChange={handleInputChange}
              />
              <label htmlFor="website">Website</label>
              <input
                type="url"
                name="website"
                placeholder="Website"
                value={companyData.website}
                onChange={handleInputChange}
              />
              <label htmlFor="description">Description</label>
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
              <label htmlFor="companyType">Company Type</label>
              <select
                name="companyType"
                value={companyData.companyType}
                onChange={handleInputChange}
              >
                <option value={1}>Client</option>
                <option value={2}>Forwarder</option>
                <option value={3}>Carrier</option>
              </select>

              <div className="modal-actions">
                <button type="submit" disabled={isCreating}>
                  {isCreating ? "Saving..." : companyData.id ? "Save" : "Add"}
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

export default CompanyManagement;
