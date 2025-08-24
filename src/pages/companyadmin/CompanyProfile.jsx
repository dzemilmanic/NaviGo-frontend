import React, { useState, useEffect, useCallback } from 'react';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Calendar,
  Edit3,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Users,
  Truck,
  Package,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { companyService } from '../../services/companyService';
import { vehicleService } from '../../services/vehicleService';
import { driverService } from '../../services/driverService';
import { shipmentService } from '../../services/shipmentService';

const CompanyProfile = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [company, setCompany] = useState(null);
  const [companyStats, setCompanyStats] = useState({
    totalVehicles: 0,
    totalDrivers: 0,
    totalShipments: 0,
    activeShipments: 0
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [editForm, setEditForm] = useState({
    companyName: '',
    contactEmail: '',
    address: '',
    website: '',
    description: ''
  });

  // Memoized function to prevent unnecessary re-renders
  const loadCompanyData = useCallback(async () => {
    if (!user?.companyId) {
      setError('No company associated with your account');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Use the specific endpoint for getting user's company
      const result = await companyService.getMyCompany();
      
      if (result.success && result.data) {
        setCompany(result.data);
        setEditForm({
          companyName: result.data.companyName || '',
          contactEmail: result.data.contactEmail || '',
          address: result.data.address || '',
          website: result.data.website || '',
          description: result.data.description || ''
        });
      } else {
        setError(result.error || 'Failed to load company information');
      }
    } catch (error) {
      console.error('Error loading company data:', error);
      setError('Failed to load company information');
    } finally {
      setLoading(false);
    }
  }, [user?.companyId]); // Only depend on companyId, not the entire user object

  const loadCompanyStats = useCallback(async () => {
    if (!user?.companyId) return;

    try {
      const [vehiclesResult, driversResult, shipmentsResult] = await Promise.all([
        vehicleService.getAll({ companyId: user.companyId }),
        driverService.getAll({ companyId: user.companyId }),
        shipmentService.getAll({ companyId: user.companyId })
      ]);

      let stats = {
        totalVehicles: 0,
        totalDrivers: 0,
        totalShipments: 0,
        activeShipments: 0
      };

      if (vehiclesResult.success && vehiclesResult.data) {
        stats.totalVehicles = Array.isArray(vehiclesResult.data) ? vehiclesResult.data.length : 0;
      }

      if (driversResult.success && driversResult.data) {
        stats.totalDrivers = Array.isArray(driversResult.data) ? driversResult.data.length : 0;
      }

      if (shipmentsResult.success && shipmentsResult.data) {
        const shipments = Array.isArray(shipmentsResult.data) ? shipmentsResult.data : [];
        stats.totalShipments = shipments.length;
        stats.activeShipments = shipments.filter(s => s.shipmentStatus === 1).length;
      }

      setCompanyStats(stats);
    } catch (error) {
      console.error('Error loading company stats:', error);
    }
  }, [user?.companyId]);

  useEffect(() => {
    // Only load data if user is authenticated and has a company
    if (isAuthenticated && user?.companyId && !authLoading) {
      loadCompanyData();
      loadCompanyStats();
    } else if (isAuthenticated && !user?.companyId && !authLoading) {
      setError('No company associated with your account');
      setLoading(false);
    }
  }, [isAuthenticated, user?.companyId, authLoading, loadCompanyData, loadCompanyStats]);

  const handleEdit = () => {
    setEditing(true);
    setError(null);
    setSuccess(null);
  };

  const handleCancel = () => {
    setEditing(false);
    setEditForm({
      companyName: company?.companyName || '',
      contactEmail: company?.contactEmail || '',
      address: company?.address || '',
      website: company?.website || '',
      description: company?.description || ''
    });
    setError(null);
    setSuccess(null);
  };

  const handleSave = async () => {
    if (!company?.id) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await companyService.update(company.id, editForm);
      if (result.success) {
        setCompany({ ...company, ...editForm });
        setEditing(false);
        setSuccess('Company information updated successfully');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.error || 'Failed to update company information');
      }
    } catch (error) {
      console.error('Error updating company:', error);
      setError('Failed to update company information');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return { text: 'Pending', class: 'status-pending' };
      case 'Approved':
        return { text: 'Active', class: 'status-active' };
      case 'Rejected':
        return { text: 'Rejected', class: 'status-suspended' };
      case 'Inactive':
        return { text: 'Inactive', class: 'status-inactive' };
      default:
        return { text: 'Unknown', class: 'status-unknown' };
    }
  };

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-6 h-6 animate-spin" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Show error if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
          <p>Please log in to view company information.</p>
        </div>
      </div>
    );
  }

  // Show error if no company associated
  if (!user?.companyId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Building2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Company Associated</h2>
          <p>Your account is not associated with any company.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-6 h-6 animate-spin" />
          <p>Loading company information...</p>
        </div>
      </div>
    );
  }

  if (error && !company) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Company</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={loadCompanyData}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Building2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Company Not Found</h2>
          <p>Unable to load company information.</p>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(company.companyStatus);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{company.companyName}</h1>
              <div className="flex items-center space-x-3 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  statusBadge.class === 'status-active' ? 'bg-green-100 text-green-800' :
                  statusBadge.class === 'status-pending' ? 'bg-yellow-100 text-yellow-800' :
                  statusBadge.class === 'status-suspended' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {statusBadge.text}
                </span>
                <span className="text-sm text-gray-500">ID: {company.id}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {!editing ? (
              <button 
                onClick={handleEdit} 
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handleCancel} 
                  className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  disabled={saving}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
                <button 
                  onClick={handleSave} 
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  disabled={saving}
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {success && (
          <div className="mx-6 mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
            <span className="text-green-700">{success}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Company Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  {editing ? (
                    <input
                      type="text"
                      value={editForm.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter company name"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-gray-900">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span>{company.companyName || 'Not specified'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  {editing ? (
                    <input
                      type="email"
                      value={editForm.contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter email address"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-gray-900">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{company.contactEmail || 'Not specified'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  {editing ? (
                    <input
                      type="text"
                      value={editForm.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter company address"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-gray-900">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{company.address || 'Not specified'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  {editing ? (
                    <input
                      type="url"
                      value={editForm.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter website URL"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-gray-900">
                      <Globe className="w-4 h-4 text-gray-400" />
                      {company.website ? (
                        <a 
                          href={company.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          {company.website}
                        </a>
                      ) : (
                        <span>Not specified</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                {editing ? (
                  <textarea
                    value={editForm.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter company description"
                    rows={4}
                  />
                ) : (
                  <div className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {company.description || 'No description provided'}
                  </div>
                )}
              </div>
            </div>

            {/* Company Details */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">PIB</label>
                  <div className="text-gray-900">{company.pib || 'Not specified'}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Type</label>
                  <div className="text-gray-900">{company.companyType || 'Not specified'}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Registration Date</label>
                  <div className="flex items-center space-x-2 text-gray-900">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{company.createdAt ? new Date(company.createdAt).toLocaleDateString() : 'Not available'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Stats */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Statistics</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Total Vehicles</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">{companyStats.totalVehicles}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-600">Total Drivers</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">{companyStats.totalDrivers}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-gray-600">Total Shipments</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">{companyStats.totalShipments}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-orange-600" />
                    <span className="text-sm text-gray-600">Active Shipments</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">{companyStats.activeShipments}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <button className="w-full flex items-center space-x-2 px-3 py-2 text-left text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
                  <Truck className="w-4 h-4" />
                  <span>Manage Vehicles</span>
                </button>
                <button className="w-full flex items-center space-x-2 px-3 py-2 text-left text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
                  <Users className="w-4 h-4" />
                  <span>Manage Drivers</span>
                </button>
                <button className="w-full flex items-center space-x-2 px-3 py-2 text-left text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
                  <Package className="w-4 h-4" />
                  <span>View Shipments</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;