import { useState } from 'react';
import { Search, Plus, Building, X } from 'lucide-react';
import { companyService } from '../../services/companyService';
import './CompanyModal.css';

const CompanyModal = ({ userType, onCompanySelect, onClose }) => {
  const [step, setStep] = useState('search'); // 'search' or 'add'
  const [companyData, setCompanyData] = useState({
    pib: '',
    companyName: '',
    address: '',
    contactEmail: '',
    website: '',
    description: ''
  });
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompanyData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const searchCompanyByPIB = async () => {
    if (!companyData.pib) return;
    
    setIsSearching(true);
    setError('');
    
    try {
      const result = await companyService.searchByPib(companyData.pib);
      
      if (result.success) {
        setSearchResults(result.data);
      } else {
        setSearchResults([]);
        setError(result.message);
      }
    } catch (error) {
      console.error('Company search error:', error);
      setSearchResults([]);
      setError('Failed to search for companies. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const selectCompany = (company) => {
    setSelectedCompany(company);
    setError('');
  };

  const proceedWithNewCompany = () => {
    setStep('add');
    setSearchResults([]);
    setError('');
  };

  const handleBackToSearch = () => {
    setStep('search');
    setSelectedCompany(null);
    setError('');
  };

  const mapCompanyTypeToEnum = (userType) => {
    switch (userType) {
      case 'client':
        return 1; // CompanyType.Client
      case 'shipper':
        return 2; // CompanyType.Forwarder
      case 'transport':
        return 3; // CompanyType.Carrier
      default:
        return 1;
    }
  };

  const handleSaveCompany = async () => {
    // Validate required fields
    if (!companyData.companyName || !companyData.address || !companyData.contactEmail) {
      setError('Please fill in all required fields (Company Name, Address, Email)');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(companyData.contactEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsCreating(true);
    setError('');

    try {
      const newCompanyDto = {
        companyName: companyData.companyName,
        pib: companyData.pib,
        address: companyData.address,
        contactEmail: companyData.contactEmail,
        website: companyData.website || null,
        description: companyData.description || null,
        companyType: mapCompanyTypeToEnum(userType),
        maxCommissionRate: userType === 'shipper' ? null : null, // Only for forwarders, set via backend logic
        proofFileUrl: null // TODO: Add file upload functionality later
      };

      console.log('Creating company:', newCompanyDto);

      const result = await companyService.create(newCompanyDto);

      if (result.success) {
        // Pass the created company with real backend ID
        onCompanySelect(result.data);
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Company creation error:', error);
      setError('Failed to create company. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleContinueWithSelected = () => {
    if (selectedCompany) {
      onCompanySelect(selectedCompany);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <Building size={24} />
            {step === 'search' ? 'Find Your Company' : 'Add New Company'}
          </h3>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {error && (
          <div style={{
            background: '#fee',
            color: '#c53030',
            padding: '12px',
            borderRadius: '8px',
            margin: '0 20px 20px 20px',
            border: '1px solid #fed7d7'
          }}>
            {error}
          </div>
        )}

        {step === 'search' && (
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
                  />
                  <button
                    type="button"
                    className="search-btn"
                    onClick={searchCompanyByPIB}
                    disabled={isSearching || !companyData.pib}
                  >
                    <Search size={20} />
                  </button>
                </div>
                <small className="input-hint">
                  Enter your company's PIB number to search for existing companies
                </small>
              </div>

              {isSearching && (
                <div className="search-loading">
                  <div className="spinner"></div>
                  <p>Searching for companies...</p>
                </div>
              )}

              {searchResults.length > 0 && (
                <div className="search-results">
                  <h4>Found Companies:</h4>
                  {searchResults.map(company => (
                    <div
                      key={company.id}
                      className={`company-result ${selectedCompany?.id === company.id ? 'selected' : ''}`}
                      onClick={() => selectCompany(company)}
                    >
                      <div className="company-info">
                        <h5>{company.companyName}</h5>
                        <p>{company.address}</p>
                        <div className="company-details">
                          <small>PIB: {company.pib}</small>
                          <small>Email: {company.contactEmail}</small>
                        </div>
                      </div>
                      {selectedCompany?.id === company.id && (
                        <div className="selected-indicator">✓</div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {companyData.pib && searchResults.length === 0 && !isSearching && !error && (
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
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleContinueWithSelected}>
                  Continue with {selectedCompany.companyName}
                </button>
              </div>
            )}
          </div>
        )}

        {step === 'add' && (
          <div className="modal-body">
            <div className="add-company-info">
              <p>Adding new company with PIB: <strong>{companyData.pib}</strong></p>
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
                />
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
                />
              </div>
            </form>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleBackToSearch}>
                Back to Search
              </button>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={handleSaveCompany}
                disabled={isCreating || !companyData.companyName || !companyData.address || !companyData.contactEmail}
              >
                {isCreating ? (
                  <>
                    <div className="spinner" style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid #ffffff',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Creating...
                  </>
                ) : (
                  'Save Company'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyModal;