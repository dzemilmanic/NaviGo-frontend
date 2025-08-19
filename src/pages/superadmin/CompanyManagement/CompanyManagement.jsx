import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  Eye, 
  Check, 
  X, 
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  ExternalLink
} from 'lucide-react';
import { companyService } from '../../../services/companyService';
import './CompanyManagement.css';

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    setLoading(true);
    try {
      const result = await companyService.getAll();
      if (result.success) {
        setCompanies(result.data);
      }
    } catch (error) {
      console.error('Error loading companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (companyId, newStatus) => {
    try {
      const result = await companyService.updateStatus(companyId, newStatus);
      if (result.success) {
        await loadCompanies();
        setShowModal(false);
        setSelectedCompany(null);
      }
    } catch (error) {
      console.error('Error updating company status:', error);
    }
  };

  const handleDelete = async (companyId) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        const result = await companyService.delete(companyId);
        if (result.success) {
          await loadCompanies();
        }
      } catch (error) {
        console.error('Error deleting company:', error);
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 0:
        return <span className="status-badge pending">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </span>;
      case 1:
        return <span className="status-badge approved">
          <CheckCircle className="w-3 h-3 mr-1" />
          Approved
        </span>;
      case 2:
        return <span className="status-badge rejected">
          <XCircle className="w-3 h-3 mr-1" />
          Rejected
        </span>;
      default:
        return null;
    }
  };

  const getCompanyTypeName = (type) => {
    switch (type) {
      case 1: return 'Client';
      case 2: return 'Forwarder';
      case 3: return 'Carrier';
      default: return 'Unknown';
    }
  };

  const getCompanyTypeClass = (type) => {
    switch (type) {
      case 1: return 'client';
      case 2: return 'forwarder';
      case 3: return 'carrier';
      default: return '';
    }
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.pib.includes(searchTerm) ||
                         company.contactEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || company.companyStatus.toString() === statusFilter;
    const matchesType = typeFilter === 'all' || company.companyType.toString() === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="company-management">
      {/* Header */}
      <div className="company-header">
        <h1>Company Management</h1>
        <p>Manage and approve company registrations</p>
      </div>

      {/* Filters */}
      <div className="filters-container">
        <div className="filters-grid">
          <div className="search-input-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Statuses</option>
            <option value="0">Pending</option>
            <option value="1">Approved</option>
            <option value="2">Rejected</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Types</option>
            <option value="1">Client</option>
            <option value="2">Forwarder</option>
            <option value="3">Carrier</option>
          </select>

          <div className="filter-info">
            <Filter className="w-4 h-4 mr-2" />
            {filteredCompanies.length} companies found
          </div>
        </div>
      </div>

      {/* Companies Table */}
      <div className="companies-table-container">
        <div style={{ overflowX: 'auto' }}>
          <table className="companies-table">
            <thead className="table-header">
              <tr>
                <th>Company</th>
                <th>Type</th>
                <th>Status</th>
                <th>Contact</th>
                <th>Created</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map((company) => (
                <tr key={company.id} className="table-row">
                  <td className="table-cell">
                    <div className="company-info">
                      <div className="company-icon">
                        <Building2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="company-name">{company.companyName}</div>
                        <div className="company-pib">PIB: {company.pib}</div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className={`type-badge ${getCompanyTypeClass(company.companyType)}`}>
                      {getCompanyTypeName(company.companyType)}
                    </span>
                  </td>
                  <td className="table-cell">
                    {getStatusBadge(company.companyStatus)}
                  </td>
                  <td className="table-cell">
                    <div style={{ fontSize: '0.875rem', color: '#1f2937' }}>{company.contactEmail}</div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{company.address}</div>
                  </td>
                  <td className="table-cell" style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {new Date(company.createdAt).toLocaleDateString()}
                  </td>
                  <td className="table-cell">
                    <div className="actions-container">
                      <button
                        onClick={() => {
                          setSelectedCompany(company);
                          setShowModal(true);
                        }}
                        className="action-btn view"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      {company.companyStatus === 0 && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(company.id, 1)}
                            className="action-btn approve"
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(company.id, 2)}
                            className="action-btn reject"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => handleDelete(company.id)}
                        className="action-btn delete"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Company Details Modal */}
      {showModal && selectedCompany && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Company Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="close-btn"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="details-grid">
                <div className="detail-item">
                  <label>Company Name</label>
                  <p>{selectedCompany.companyName}</p>
                </div>
                
                <div className="detail-item">
                  <label>PIB</label>
                  <p>{selectedCompany.pib}</p>
                </div>
                
                <div className="detail-item">
                  <label>Type</label>
                  <span className={`type-badge ${getCompanyTypeClass(selectedCompany.companyType)}`}>
                    {getCompanyTypeName(selectedCompany.companyType)}
                  </span>
                </div>
                
                <div className="detail-item">
                  <label>Status</label>
                  {getStatusBadge(selectedCompany.companyStatus)}
                </div>
                
                <div className="detail-item full-width">
                  <label>Address</label>
                  <p>{selectedCompany.address}</p>
                </div>
                
                <div className="detail-item">
                  <label>Contact Email</label>
                  <p>{selectedCompany.contactEmail}</p>
                </div>
                
                <div className="detail-item">
                  <label>Website</label>
                  {selectedCompany.website ? (
                    <a 
                      href={selectedCompany.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="website-link"
                    >
                      {selectedCompany.website}
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  ) : (
                    <p style={{ color: '#6b7280' }}>Not provided</p>
                  )}
                </div>
                
                {selectedCompany.description && (
                  <div className="detail-item full-width">
                    <label>Description</label>
                    <p>{selectedCompany.description}</p>
                  </div>
                )}
                
                {selectedCompany.maxCommissionRate && (
                  <div className="detail-item">
                    <label>Max Commission Rate</label>
                    <p>{selectedCompany.maxCommissionRate}%</p>
                  </div>
                )}
              </div>
              
              {selectedCompany.companyStatus === 0 && (
                <div className="modal-actions">
                  <button
                    onClick={() => handleStatusUpdate(selectedCompany.id, 1)}
                    className="modal-btn approve"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Approve Company
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedCompany.id, 2)}
                    className="modal-btn reject"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reject Company
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyManagement;