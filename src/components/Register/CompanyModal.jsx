import React, { useState } from 'react';
import { Search, Plus, Building, X } from 'lucide-react';
import './CompanyModal.css';

const CompanyModal = ({ userType, onCompanySelect, onClose }) => {
  const [step, setStep] = useState('search'); // 'search' or 'add'
  const [companyData, setCompanyData] = useState({
    pib: '',
    name: '',
    address: '',
    email: '',
    website: '',
    description: ''
  });
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompanyData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const searchCompanyByPIB = async () => {
    if (!companyData.pib) return;
    
    setIsSearching(true);
    
    // Simulacija API poziva
    setTimeout(() => {
      // Simulirani rezultati pretrage
      const mockResults = [
        { 
          id: 1, 
          pib: companyData.pib, 
          name: 'LogiTrans d.o.o.', 
          address: 'Bulevar Oslobođenja 123, Novi Sad',
          email: 'info@logitrans.rs',
          website: 'www.logitrans.rs'
        },
        { 
          id: 2, 
          pib: companyData.pib, 
          name: 'Trans Express', 
          address: 'Knez Mihailova 45, Beograd',
          email: 'contact@transexpress.rs',
          website: 'www.transexpress.rs'
        }
      ];
      
      if (companyData.pib === '123456789') {
        setSearchResults(mockResults);
      } else {
        setSearchResults([]);
      }
      setIsSearching(false);
    }, 1000);
  };

  const selectCompany = (company) => {
    setSelectedCompany(company);
  };

  const proceedWithNewCompany = () => {
    setStep('add');
    setSearchResults([]);
  };

  const handleBackToSearch = () => {
    setStep('search');
    setSelectedCompany(null);
  };

  const handleSaveCompany = () => {
    if (companyData.name && companyData.address && companyData.email) {
      const newCompany = {
        id: Date.now(),
        pib: companyData.pib,
        name: companyData.name,
        address: companyData.address,
        email: companyData.email,
        website: companyData.website,
        description: companyData.description
      };
      onCompanySelect(newCompany);
    } else {
      alert('Please fill in all required fields');
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
                    placeholder="Enter PIB number (try 123456789 for demo)"
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
                        <h5>{company.name}</h5>
                        <p>{company.address}</p>
                        <div className="company-details">
                          <small>PIB: {company.pib}</small>
                          <small>Email: {company.email}</small>
                        </div>
                      </div>
                      {selectedCompany?.id === company.id && (
                        <div className="selected-indicator">✓</div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {companyData.pib && searchResults.length === 0 && !isSearching && (
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
                  Continue with {selectedCompany.name}
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
                  name="name"
                  value={companyData.name}
                  onChange={handleInputChange}
                  placeholder="Enter company name"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="companyAddress">Address *</label>
                <input
                  type="text"
                  id="companyAddress"
                  name="address"
                  value={companyData.address}
                  onChange={handleInputChange}
                  placeholder="Enter company address"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="companyEmail">Email *</label>
                <input
                  type="email"
                  id="companyEmail"
                  name="email"
                  value={companyData.email}
                  onChange={handleInputChange}
                  placeholder="Enter company email"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="companyWebsite">Website</label>
                <input
                  type="url"
                  id="companyWebsite"
                  name="website"
                  value={companyData.website}
                  onChange={handleInputChange}
                  placeholder="https://company-website.com"
                />
              </div>

              <div className="input-group">
                <label htmlFor="companyDescription">Description</label>
                <textarea
                  id="companyDescription"
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
                disabled={!companyData.name || !companyData.address || !companyData.email}
              >
                Save Company
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyModal;