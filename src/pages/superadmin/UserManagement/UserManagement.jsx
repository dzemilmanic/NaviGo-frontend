import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  UserPlus,
  Trash2,
  Shield,
  Building2,
  User,
  CheckCircle,
  XCircle,
  Plus,
  X
} from 'lucide-react';
import { userService } from '../../../services/userService';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSuperAdmin, setNewSuperAdmin] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: ''
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const result = await userService.getAll();
      if (result.success) {
        setUsers(result.data);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (userId, newStatus) => {
    try {
      const result = await userService.updateStatus(userId, newStatus);
      if (result.success) {
        await loadUsers();
        setShowModal(false);
        setSelectedUser(null);
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const result = await userService.delete(userId);
        if (result.success) {
          await loadUsers();
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleCreateSuperAdmin = async (e) => {
    e.preventDefault();
    try {
      const result = await userService.createSuperAdmin(newSuperAdmin);
      if (result.success) {
        await loadUsers();
        setShowCreateModal(false);
        setNewSuperAdmin({
          email: '',
          password: '',
          firstName: '',
          lastName: '',
          phoneNumber: ''
        });
      }
    } catch (error) {
      console.error('Error creating SuperAdmin:', error);
    }
  };

  const getRoleName = (role) => {
    switch (role) {
      case 1: return 'Regular User';
      case 2: return 'Company User';
      case 3: return 'Company Admin';
      case 4: return 'Super Admin';
      default: return 'Unknown';
    }
  };

  const getRoleClass = (role) => {
    switch (role) {
      case 1: return 'regular';
      case 2: return 'company-user';
      case 3: return 'company-admin';
      case 4: return 'super-admin';
      default: return 'regular';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 1: return <User className="w-3 h-3 mr-1" />;
      case 2: return <Building2 className="w-3 h-3 mr-1" />;
      case 3: return <Building2 className="w-3 h-3 mr-1" />;
      case 4: return <Shield className="w-3 h-3 mr-1" />;
      default: return <User className="w-3 h-3 mr-1" />;
    }
  };

  const getStatusBadge = (status) => {
    return status === 1 ? (
      <span className="status-badge active">
        <CheckCircle className="w-3 h-3 mr-1" />
        Active
      </span>
    ) : (
      <span className="status-badge inactive">
        <XCircle className="w-3 h-3 mr-1" />
        Inactive
      </span>
    );
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || user.userStatus.toString() === statusFilter;
    const matchesRole = roleFilter === 'all' || user.userRole.toString() === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="user-management">
      {/* Header */}
      <div className="user-header">
        <div className="user-header-info">
          <h1>User Management</h1>
          <p>Manage system users and their permissions</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="create-admin-btn"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create SuperAdmin
        </button>
      </div>

      {/* Filters */}
      <div className="filters-container">
        <div className="filters-grid">
          <div className="search-input-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search users..."
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
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Roles</option>
            <option value="1">Regular User</option>
            <option value="2">Company User</option>
            <option value="3">Company Admin</option>
            <option value="4">Super Admin</option>
          </select>

          <div className="filter-info">
            <Filter className="w-4 h-4 mr-2" />
            {filteredUsers.length} users found
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="users-table-container">
        <div style={{ overflowX: 'auto' }}>
          <table className="users-table">
            <thead className="table-header">
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Email Verified</th>
                <th>Created</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="table-row">
                  <td className="table-cell">
                    <div className="user-info">
                      <div className="user-avatar">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="user-name">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="user-email">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className={`role-badge ${getRoleClass(user.userRole)}`}>
                      {getRoleIcon(user.userRole)}
                      {getRoleName(user.userRole)}
                    </span>
                  </td>
                  <td className="table-cell">
                    {getStatusBadge(user.userStatus)}
                  </td>
                  <td className="table-cell">
                    {user.emailVerified ? (
                      <CheckCircle className="verification-icon verified" />
                    ) : (
                      <XCircle className="verification-icon not-verified" />
                    )}
                  </td>
                  <td className="table-cell" style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="table-cell">
                    <div className="actions-container">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowModal(true);
                        }}
                        className="action-btn view"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleStatusUpdate(user.id, user.userStatus === 1 ? 0 : 1)}
                        className={`action-btn ${user.userStatus === 1 ? 'deactivate' : 'activate'}`}
                        title={user.userStatus === 1 ? 'Deactivate' : 'Activate'}
                      >
                        {user.userStatus === 1 ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </button>
                      
                      <button
                        onClick={() => handleDelete(user.id)}
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

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">User Details</h2>
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
                  <label>First Name</label>
                  <p>{selectedUser.firstName}</p>
                </div>
                
                <div className="detail-item">
                  <label>Last Name</label>
                  <p>{selectedUser.lastName}</p>
                </div>
                
                <div className="detail-item">
                  <label>Email</label>
                  <p>{selectedUser.email}</p>
                </div>
                
                <div className="detail-item">
                  <label>Phone</label>
                  <p>{selectedUser.phoneNumber || 'Not provided'}</p>
                </div>
                
                <div className="detail-item">
                  <label>Role</label>
                  <span className={`role-badge ${getRoleClass(selectedUser.userRole)}`}>
                    {getRoleIcon(selectedUser.userRole)}
                    {getRoleName(selectedUser.userRole)}
                  </span>
                </div>
                
                <div className="detail-item">
                  <label>Status</label>
                  {getStatusBadge(selectedUser.userStatus)}
                </div>
                
                <div className="detail-item">
                  <label>Email Verified</label>
                  <div className="verification-status">
                    {selectedUser.emailVerified ? (
                      <>
                        <CheckCircle className="verified" />
                        <span style={{ color: 'var(--success)' }}>Verified</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="not-verified" />
                        <span style={{ color: 'var(--error)' }}>Not Verified</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="detail-item">
                  <label>Created</label>
                  <p>{new Date(selectedUser.createdAt).toLocaleString()}</p>
                </div>
                
                {selectedUser.lastLogin && (
                  <div className="detail-item">
                    <label>Last Login</label>
                    <p>{new Date(selectedUser.lastLogin).toLocaleString()}</p>
                  </div>
                )}
              </div>
              
              <div className="modal-actions">
                <button
                  onClick={() => handleStatusUpdate(selectedUser.id, selectedUser.userStatus === 1 ? 0 : 1)}
                  className={`modal-btn ${selectedUser.userStatus === 1 ? 'deactivate' : 'activate'}`}
                >
                  {selectedUser.userStatus === 1 ? (
                    <>
                      <XCircle className="w-4 h-4 mr-2" />
                      Deactivate User
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Activate User
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create SuperAdmin Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content create-modal">
            <div className="modal-header">
              <h2 className="modal-title">Create SuperAdmin</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="close-btn"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleCreateSuperAdmin} className="create-form">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  required
                  value={newSuperAdmin.email}
                  onChange={(e) => setNewSuperAdmin({...newSuperAdmin, email: e.target.value})}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  required
                  value={newSuperAdmin.password}
                  onChange={(e) => setNewSuperAdmin({...newSuperAdmin, password: e.target.value})}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  required
                  value={newSuperAdmin.firstName}
                  onChange={(e) => setNewSuperAdmin({...newSuperAdmin, firstName: e.target.value})}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  required
                  value={newSuperAdmin.lastName}
                  onChange={(e) => setNewSuperAdmin({...newSuperAdmin, lastName: e.target.value})}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  required
                  value={newSuperAdmin.phoneNumber}
                  onChange={(e) => setNewSuperAdmin({...newSuperAdmin, phoneNumber: e.target.value})}
                  className="form-input"
                />
              </div>
              
              <div className="create-actions">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="create-btn cancel"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="create-btn submit"
                >
                  Create SuperAdmin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;