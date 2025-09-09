import { useState } from "react";
import {
  Search,
  Plus,
  Building,
  X,
  Upload,
  FileText,
  Image,
  RefreshCw,
} from "lucide-react";
import { companyService } from "../../services/companyService";
import "./CompanyModal.css";
import { toast } from "react-toastify";

const CompanyModal = ({ userType, onCompanySelect, onClose, companyAdmin }) => {
  const [step, setStep] = useState("search"); // 'search' or 'add'
  const [companyData, setCompanyData] = useState({
    pib: "",
    companyName: "",
    address: "",
    contactEmail: "",
    website: "",
    description: "",
    maxCommissionRate: null,
    proofFileUrl: null,
    logoUrl: null,
    companyType:
      userType === "client"
        ? 1
        : userType === "shipper"
        ? 2
        : userType === "transport"
        ? 3
        : 1,
  });
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [fileUploading, setFileUploading] = useState({
    logo: false,
    proof: false,
  });

  const handleInputChange = (e) => {
    const { name, type, files, value } = e.target;

    setCompanyData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const searchCompanyByPIB = async () => {
    if (!companyData.pib) {
      toast.error("Please enter a PIB number to search");
      return;
    }

    setIsSearching(true);
    setSearchResults([]);
    setSelectedCompany(null);

    try {
      console.log(
        "Searching for PIB:",
        companyData.pib,
        "Type:",
        companyData.companyType
      );

      const result = await companyService.searchByPib(
        companyData.pib,
        companyData.companyType
      );

      if (result.success) {
        let companies = [];

        if (Array.isArray(result.data)) {
          companies = result.data;
        } else if (result.data?.items) {
          companies = result.data.items;
        } else {
          companies = [];
        }

        console.log("Search results:", companies);
        setSearchResults(companies);
      } else {
        console.error("Search failed:", result.message);
        setSearchResults([]);
        toast.error(result.message || "Failed to search for companies.");
      }
    } catch (error) {
      console.error("Company search error:", error);
      setSearchResults([]);
      toast.error("Failed to search for companies. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const selectCompany = (company) => {
    setSelectedCompany(company);
  };

  const proceedWithNewCompany = () => {
    setStep("add");
    setSearchResults([]);
    setSelectedCompany(null);
  };

  const handleBackToSearch = () => {
    setStep("search");
    setSelectedCompany(null);
  };

  const mapCompanyTypeToEnum = (userType) => {
    switch (userType) {
      case "client":
        return 1; // CompanyType.Client
      case "shipper":
        return 2; // CompanyType.Forwarder
      case "transport":
        return 3; // CompanyType.Carrier
      default:
        return 1;
    }
  };

  const uploadFile = async (file, fileType) => {
    setFileUploading((prev) => ({ ...prev, [fileType]: true }));

    try {
      console.log(`Uploading ${fileType}:`, file.name);

      const uploadResult = await companyService.uploadFile(file);

      if (uploadResult.success) {
        const fileUrl =
          uploadResult.data?.url ||
          uploadResult.data?.filePath ||
          uploadResult.data?.fileUrl ||
          uploadResult.url;

        if (fileUrl) {
          return fileUrl;
        }
      }

      toast.error(
        `Failed to upload ${fileType === "logo" ? "logo" : "proof document"}`
      );
      return null;
    } catch (error) {
      console.error(`${fileType} upload error:`, error);
      toast.error(
        `Failed to upload ${
          fileType === "logo" ? "logo" : "proof document"
        }. Please try again.`
      );
      return null;
    } finally {
      setFileUploading((prev) => ({ ...prev, [fileType]: false }));
    }
  };

  const handleSaveCompany = async () => {
    // Validacija obaveznih polja
    if (
      !companyData.companyName ||
      !companyData.address ||
      !companyData.contactEmail
    ) {
      toast.error(
        "Please fill in all required fields (Company Name, Address, Email)"
      );
      return;
    }

    // Validacija email-a
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(companyData.contactEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Validacija proof file-a za nove kompanije
    if (!companyData.proofFileUrl) {
      toast.error("Please upload a proof document");
      return;
    }

    setIsCreating(true);

    try {
      console.log("Creating company, starting file uploads...");

      // Upload fajlova sekvencijalno
      let logoUrl = null;
      let proofFileUrl = null;

      // Upload logo ako je odabran
      if (companyData.logoUrl instanceof File) {
        logoUrl = await uploadFile(companyData.logoUrl, "logo");
        if (!logoUrl) {
          setIsCreating(false);
          return;
        }
      }

      // Upload proof dokumenta (obavezan)
      if (companyData.proofFileUrl instanceof File) {
        proofFileUrl = await uploadFile(companyData.proofFileUrl, "proof");
        if (!proofFileUrl) {
          setIsCreating(false);
          return;
        }
      } else {
        proofFileUrl = companyData.proofFileUrl;
      }

      // DTO koji backend očekuje sa ispravnim nazivima svojstava
      const newCompanyDto = {
        CompanyName: companyData.companyName,
        PIB: companyData.pib,
        Address: companyData.address,
        ContactEmail: companyData.contactEmail,
        Website: companyData.website || null,
        Description: companyData.description || null,
        CompanyType: mapCompanyTypeToEnum(userType),
        MaxCommissionRate:
          userType === "shipper"
            ? Number(companyData.maxCommissionRate) || null
            : null,
        ProofFileUrl: proofFileUrl,
        LogoUrl: logoUrl,
      };

      console.log("Creating company with mapped data:", newCompanyDto);

      // Kreiraj kompaniju
      const createResult = await companyService.create(newCompanyDto);
      if (createResult.success) {
        const companyId = createResult.data.company.id;
        if (companyId) {

          const getByIdResult = await companyService.getById(companyId);

          if (getByIdResult.success) {
            const createdCompany = getByIdResult.data;
            toast.success(
              `Company ${companyData.companyName} created successfully!`
            );
            console.log("Company fetched with correct format:", createdCompany);

            // Proslijedi kompaniju u istom formatu kao što vraća getAll
            onCompanySelect(createdCompany);
            companyAdmin(true);
          } else {
            toast.error(
              "Company created but failed to fetch details. Please try searching for it."
            );
          }
        } else {
          toast.error("Company creation response missing ID");
        }
      } else {
        console.error("Company creation failed:", createResult);
        toast.error(
          createResult.message || "Failed to create company. Please try again."
        );
      }
    } catch (err) {
      console.error("Company creation error:", err);
      toast.error("Failed to create company. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleContinueWithSelected = () => {
    if (selectedCompany) {
      onCompanySelect(selectedCompany);
      companyAdmin(false);
    }
  };

  const getFileIcon = (fileType) => {
    return fileType === "logo" ? <Image size={16} /> : <FileText size={16} />;
  };

  const getFileLabel = (file, fileType) => {
    if (file instanceof File) {
      return (
        <span className="file-selected">
          {getFileIcon(fileType)}
          {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
        </span>
      );
    }
    return `Select ${fileType === "logo" ? "logo" : "proof document"}`;
  };

  const handleRefreshSearch = async () => {
    if (companyData.pib) {
      await searchCompanyByPIB();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <Building size={24} />
            {step === "search" ? "Find Your Company" : "Add New Company"}
          </h3>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {step === "search" && (
          <div className="modal-body">
            <div className="search-section">
              <div className="input-group">
                <label htmlFor="pib">Company PIB Number</label>
                <div className="search-input-container">
                  <input
                    type="text"
                    id="pib"
                    name="pib"
                    value={companyData.pib}
                    onChange={handleInputChange}
                    placeholder="Enter PIB number"
                    disabled={isSearching}
                  />
                  <div className="search-buttons">
                    <button
                      type="button"
                      className="search-btn"
                      onClick={searchCompanyByPIB}
                      disabled={isSearching || !companyData.pib}
                    >
                      {isSearching ? (
                        <div className="spinner small"></div>
                      ) : (
                        <Search size={20} />
                      )}
                    </button>
                    {searchResults.length > 0 && (
                      <button
                        type="button"
                        className="refresh-btn"
                        onClick={handleRefreshSearch}
                        disabled={isSearching}
                        title="Refresh search"
                      >
                        <RefreshCw size={20} />
                      </button>
                    )}
                  </div>
                </div>
                <small className="input-hint">
                  Enter your company's PIB number to search for existing
                  companies
                </small>
              </div>

              {isSearching && (
                <div className="search-loading">
                  <div className="spinner"></div>
                  <p>Searching for companies...</p>
                </div>
              )}

              {searchResults.length > 0 && !isSearching && (
                <div className="search-results">
                  <h4>Found Companies:</h4>
                  {searchResults.map((company) => (
                    <div
                      key={company.id}
                      className={`company-result ${
                        selectedCompany?.id === company.id ? "selected" : ""
                      }`}
                      onClick={() => selectCompany(company)}
                    >
                      <div className="company-info">
                        <h5>{company.companyName}</h5>
                        <p>{company.address}</p>
                        <div className="company-details">
                          <small>PIB: {company.pib}</small>
                          <small>Email: {company.contactEmail}</small>
                          {company.website && (
                            <small>Web: {company.website}</small>
                          )}
                        </div>
                      </div>
                      {selectedCompany?.id === company.id && (
                        <div className="selected-indicator">✓</div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {companyData.pib &&
                searchResults.length === 0 &&
                !isSearching && (
                  <div className="no-results">
                    <div className="no-results-icon">🔍</div>
                    <p>No company found with PIB number: {companyData.pib}</p>
                    <p>Would you like to add your company to our database?</p>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={proceedWithNewCompany}
                    >
                      <Plus size={20} />
                      Add New Company
                    </button>
                  </div>
                )}
            </div>

            {selectedCompany && (
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleContinueWithSelected}
                >
                  Continue with {selectedCompany.companyName}
                </button>
              </div>
            )}
          </div>
        )}

        {step === "add" && (
          <div className="modal-body">
            <div className="add-company-info">
              <p>
                Adding new company with PIB: <strong>{companyData.pib}</strong>
              </p>
            </div>

            <form className="company-form">
              <div className="input-group">
                <label htmlFor="companyName">Company Name *</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={companyData.companyName}
                  onChange={handleInputChange}
                  placeholder="Enter company name"
                  required
                  disabled={isCreating}
                />
              </div>

              <div className="input-group">
                <label htmlFor="logoUrl">Company Logo</label>
                <div className="file-input-container">
                  <label
                    htmlFor="logoUrl"
                    className={`file-input-label ${
                      companyData.logoUrl ? "has-file" : ""
                    }`}
                  >
                    {fileUploading.logo ? (
                      <div className="uploading-indicator">
                        <div className="spinner small"></div>
                        Uploading logo...
                      </div>
                    ) : (
                      <>
                        <Upload size={16} />
                        {getFileLabel(companyData.logoUrl, "logo")}
                      </>
                    )}
                  </label>
                  <input
                    type="file"
                    id="logoUrl"
                    name="logoUrl"
                    onChange={handleInputChange}
                    accept="image/*"
                    disabled={isCreating || fileUploading.logo}
                    style={{ display: "none" }}
                  />
                </div>
                <small className="input-hint">PNG, JPG or GIF (max 5MB)</small>
              </div>

              <div className="input-group">
                <label htmlFor="address">Address *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={companyData.address}
                  onChange={handleInputChange}
                  placeholder="Enter company address"
                  required
                  disabled={isCreating}
                />
              </div>

              <div className="input-group">
                <label htmlFor="contactEmail">Email *</label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={companyData.contactEmail}
                  onChange={handleInputChange}
                  placeholder="Enter company email"
                  required
                  disabled={isCreating}
                />
              </div>

              <div className="input-group">
                <label htmlFor="website">Website</label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={companyData.website}
                  onChange={handleInputChange}
                  placeholder="https://company-website.com"
                  disabled={isCreating}
                />
              </div>

              <div className="input-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={companyData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of your company..."
                  rows="4"
                  disabled={isCreating}
                />
              </div>

              <div className="input-group">
                <label htmlFor="proofFileUrl">Proof Document *</label>
                <div className="file-input-container">
                  <label
                    htmlFor="proofFileUrl"
                    className={`file-input-label ${
                      companyData.proofFileUrl ? "has-file" : ""
                    }`}
                  >
                    {fileUploading.proof ? (
                      <div className="uploading-indicator">
                        <div className="spinner small"></div>
                        Uploading document...
                      </div>
                    ) : (
                      <>
                        <Upload size={16} />
                        {getFileLabel(companyData.proofFileUrl, "proof")}
                      </>
                    )}
                  </label>
                  <input
                    type="file"
                    id="proofFileUrl"
                    name="proofFileUrl"
                    onChange={handleInputChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    disabled={isCreating || fileUploading.proof}
                    style={{ display: "none" }}
                    required
                  />
                </div>
                <small className="input-hint">
                  PDF, DOC, DOCX, JPG, PNG (max 10MB)
                </small>
              </div>

              {userType === "shipper" && (
                <div className="input-group">
                  <label htmlFor="maxCommissionRate">
                    Max Commission Rate *
                  </label>
                  <input
                    type="number"
                    id="maxCommissionRate"
                    name="maxCommissionRate"
                    value={companyData.maxCommissionRate}
                    onChange={handleInputChange}
                    placeholder="Enter max commission rate as a percentage"
                    min="0"
                    max="100"
                    required
                    disabled={isCreating}
                  />
                </div>
              )}
            </form>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleBackToSearch}
                disabled={
                  isCreating || fileUploading.logo || fileUploading.proof
                }
              >
                Back to Search
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveCompany}
                disabled={
                  isCreating ||
                  fileUploading.logo ||
                  fileUploading.proof ||
                  !companyData.companyName ||
                  !companyData.address ||
                  !companyData.contactEmail ||
                  !companyData.proofFileUrl ||
                  (userType === "shipper" && !companyData.maxCommissionRate)
                }
              >
                {isCreating ? (
                  <>
                    <div className="spinner small"></div>
                    Creating Company...
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    Save Company
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .search-input-container {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .search-buttons {
          display: flex;
          gap: 4px;
        }

        .search-btn,
        .refresh-btn {
          min-width: 44px;
          height: 44px;
          border: none;
          background: #3b82f6;
          color: white;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .search-btn:hover,
        .refresh-btn:hover {
          background: #2563eb;
        }

        .search-btn:disabled,
        .refresh-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .refresh-btn {
          background: #6b7280;
        }

        .refresh-btn:hover {
          background: #4b5563;
        }

        .file-input-container {
          position: relative;
        }

        .file-input-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          background: #f9fafb;
          color: #6b7280;
          font-size: 14px;
          width: 100%;
          box-sizing: border-box;
        }

        .file-input-label:hover {
          border-color: #3b82f6;
          background: #eff6ff;
          color: #1d4ed8;
        }

        .file-input-label.has-file {
          border-color: #10b981;
          background: #ecfdf5;
          color: #047857;
        }

        .uploading-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #3b82f6;
        }

        .file-selected {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #047857;
        }

        .spinner.small {
          width: 16px;
          height: 16px;
          border: 2px solid #e5e7eb;
          border-top: 2px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .input-hint {
          color: #6b7280;
          font-size: 12px;
          margin-top: 4px;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default CompanyModal;
