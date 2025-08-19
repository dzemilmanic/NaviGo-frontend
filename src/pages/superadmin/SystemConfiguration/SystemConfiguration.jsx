import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Package, 
  Truck, 
  Plus, 
  Edit, 
  Trash2,
  Save,
  X
} from 'lucide-react';
import './SystemConfiguration.css';

const SystemConfiguration = () => {
  const [cargoTypes, setCargoTypes] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('cargo');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    typeName: '',
    description: '',
    requiresSpecialEquipment: false,
    requiresSpecialLicense: false
  });

  useEffect(() => {
    loadSystemData();
  }, []);

  const loadSystemData = async () => {
    setLoading(true);
    try {
      // TODO: Implement API calls for cargo types and vehicle types
      // For now, using mock data
      setCargoTypes([
        { id: 1, typeName: 'General Cargo', description: 'Standard cargo without special requirements', requiresSpecialEquipment: false },
        { id: 2, typeName: 'Hazardous Materials', description: 'Dangerous goods requiring special handling', requiresSpecialEquipment: true },
        { id: 3, typeName: 'Refrigerated Goods', description: 'Temperature-controlled cargo', requiresSpecialEquipment: true }
      ]);
      
      setVehicleTypes([
        { id: 1, typeName: 'Standard Truck', description: 'Regular cargo truck', requiresSpecialLicense: false },
        { id: 2, typeName: 'Refrigerated Truck', description: 'Temperature-controlled vehicle', requiresSpecialLicense: false },
        { id: 3, typeName: 'Hazmat Truck', description: 'Vehicle for dangerous goods', requiresSpecialLicense: true }
      ]);
    } catch (error) {
      console.error('Error loading system data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      typeName: '',
      description: '',
      requiresSpecialEquipment: false,
      requiresSpecialLicense: false
    });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      typeName: item.typeName,
      description: item.description,
      requiresSpecialEquipment: item.requiresSpecialEquipment || false,
      requiresSpecialLicense: item.requiresSpecialLicense || false
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        // Update existing item
        if (activeTab === 'cargo') {
          setCargoTypes(prev => prev.map(item => 
            item.id === editingItem.id 
              ? { ...item, ...formData }
              : item
          ));
        } else {
          setVehicleTypes(prev => prev.map(item => 
            item.id === editingItem.id 
              ? { ...item, ...formData }
              : item
          ));
        }
      } else {
        // Add new item
        const newItem = {
          id: Date.now(), // Temporary ID
          ...formData
        };
        
        if (activeTab === 'cargo') {
          setCargoTypes(prev => [...prev, newItem]);
        } else {
          setVehicleTypes(prev => [...prev, newItem]);
        }
      }
      
      setShowModal(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        if (activeTab === 'cargo') {
          setCargoTypes(prev => prev.filter(item => item.id !== id));
        } else {
          setVehicleTypes(prev => prev.filter(item => item.id !== id));
        }
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const currentData = activeTab === 'cargo' ? cargoTypes : vehicleTypes;
  const isCargoTab = activeTab === 'cargo';

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="system-config">
      {/* Header */}
      <div className="config-header">
        <div>
          <h1>System Configuration</h1>
          <p>Manage cargo types and vehicle types</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="config-container">
        <div className="config-tabs">
          <nav className="tabs-nav">
            <button
              onClick={() => setActiveTab('cargo')}
              className={`tab-btn ${activeTab === 'cargo' ? 'active' : ''}`}
            >
              <Package className="w-4 h-4 inline mr-2" />
              Cargo Types
            </button>
            <button
              onClick={() => setActiveTab('vehicle')}
              className={`tab-btn ${activeTab === 'vehicle' ? 'active' : ''}`}
            >
              <Truck className="w-4 h-4 inline mr-2" />
              Vehicle Types
            </button>
          </nav>
        </div>

        <div className="config-content">
          {/* Add Button */}
          <div className="add-btn-container">
            <button
              onClick={handleAdd}
              className="add-btn"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add {isCargoTab ? 'Cargo Type' : 'Vehicle Type'}
            </button>
          </div>

          {/* Data Table */}
          <div className="config-table-container">
            <table className="config-table">
              <thead className="config-table-header">
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>{isCargoTab ? 'Special Equipment' : 'Special License'}</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((item) => (
                  <tr key={item.id} className="config-table-row">
                    <td className="config-table-cell">
                      <div className="type-info">
                        <div className="type-icon">
                          {isCargoTab ? (
                            <Package className="w-4 h-4" />
                          ) : (
                            <Truck className="w-4 h-4" />
                          )}
                        </div>
                        <div className="type-name">
                          {item.typeName}
                        </div>
                      </div>
                    </td>
                    <td className="config-table-cell">
                      <div className="type-description">{item.description}</div>
                    </td>
                    <td className="config-table-cell">
                      <span className={`requirement-badge ${
                        (isCargoTab ? item.requiresSpecialEquipment : item.requiresSpecialLicense)
                          ? 'required'
                          : 'not-required'
                      }`}>
                        {(isCargoTab ? item.requiresSpecialEquipment : item.requiresSpecialLicense) ? 'Required' : 'Not Required'}
                      </span>
                    </td>
                    <td className="config-table-cell">
                      <div className="actions-container">
                        <button
                          onClick={() => handleEdit(item)}
                          className="action-btn edit"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
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

          {currentData.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">
                {isCargoTab ? (
                  <Package className="w-6 h-6" />
                ) : (
                  <Truck className="w-6 h-6" />
                )}
              </div>
              <h3>
                No {isCargoTab ? 'cargo types' : 'vehicle types'} found
              </h3>
              <p>
                Get started by adding your first {isCargoTab ? 'cargo type' : 'vehicle type'}.
              </p>
              <button
                onClick={handleAdd}
                className="empty-state-btn"
              >
                Add {isCargoTab ? 'Cargo Type' : 'Vehicle Type'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">
                {editingItem ? 'Edit' : 'Add'} {isCargoTab ? 'Cargo Type' : 'Vehicle Type'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="close-btn"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="modal-form">
              <div className="form-group">
                <label>
                  Type Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.typeName}
                  onChange={(e) => setFormData({...formData, typeName: e.target.value})}
                  className="form-input"
                  placeholder={`Enter ${isCargoTab ? 'cargo' : 'vehicle'} type name`}
                />
              </div>
              
              <div className="form-group">
                <label>
                  Description
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="form-textarea"
                  placeholder="Enter description"
                />
              </div>
              
              <div className="form-checkbox-container">
                <input
                  type="checkbox"
                  id="specialRequirement"
                  checked={isCargoTab ? formData.requiresSpecialEquipment : formData.requiresSpecialLicense}
                  onChange={(e) => setFormData({
                    ...formData,
                    [isCargoTab ? 'requiresSpecialEquipment' : 'requiresSpecialLicense']: e.target.checked
                  })}
                  className="form-checkbox"
                />
                <label htmlFor="specialRequirement" className="form-checkbox-label">
                  Requires {isCargoTab ? 'Special Equipment' : 'Special License'}
                </label>
              </div>
              
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="modal-btn cancel"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="modal-btn save"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemConfiguration;