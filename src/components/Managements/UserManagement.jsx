import { useState, useEffect } from "react";
import { userService } from "../../services/userService";
import { companyService } from "../../services/companyService";
import { Menu, X } from "lucide-react";
import { toast } from 'react-toastify';
import "./Managements.css";
import Loader from "../Loader/Loader";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const userResponse = await userService.getAll();
      const companyResponse = await companyService.getAll();
      setUsers(userResponse.data);
      setCompanies(companyResponse.data);
      //toast.success("Data loaded successfully!");
    } catch (error) {
      toast.error("Failed to load data. Please try again.");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const handleDelete = async (id, userName) => {
    // Custom toast confirmation
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
        await userService.delete(id);
        await fetchData();
        toast.success(`User ${userName} deleted successfully!`);
      } catch (error) {
        toast.error("Failed to delete user. Please try again.");
        console.error("Error deleting user:", error);
      } finally {
        setLoading(false);
      }
    };

    // Show confirmation toast
    toast.warn(
      <div>
        <p>Are you sure you want to delete user <strong>{userName}</strong>?</p>
        <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
          <button 
            onClick={confirmDelete}
            style={{
              background: '#dc2626',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Delete
          </button>
          <button 
            onClick={cancelDelete}
            style={{
              background: '#6b7280',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
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

  const handleActivateDeactivate = async (id, currentStatus, userName) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    const action = newStatus === "Active" ? "activate" : "deactivate";

    // Custom toast confirmation
    const confirmAction = () => {
      toast.dismiss();
      performStatusChange();
    };

    const cancelAction = () => {
      toast.dismiss();
      toast.info("Status change cancelled");
    };

    const performStatusChange = async () => {
      setLoading(true);
      try {
        await userService.updateStatus(id, newStatus);
        await fetchData();
        toast.success(`User ${userName} ${action}d successfully!`);
      } catch (error) {
        toast.error(`Failed to ${action} user. Please try again.`);
        console.error("Error updating user status:", error);
      } finally {
        setLoading(false);
      }
    };

    // Show confirmation toast
    toast.info(
      <div>
        <p>Are you sure you want to <strong>{action}</strong> user <strong>{userName}</strong>?</p>
        <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
          <button 
            onClick={confirmAction}
            style={{
              background: newStatus === 'Active' ? '#059669' : '#dc2626',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {action.charAt(0).toUpperCase() + action.slice(1)}
          </button>
          <button 
            onClick={cancelAction}
            style={{
              background: '#6b7280',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = {
      email: form.email.value,
      password: form.password.value,
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      phoneNumber: form.phoneNumber.value,
      userRole: Number(form.userRole.value),
      companyId: form.companyId.value ? Number(form.companyId.value) : null,
    };
    
    setLoading(true);
    try {
      await userService.create(formData);
      await fetchData();
      closeModal();
      toast.success(`User ${formData.firstName} ${formData.lastName} created successfully!`);
      form.reset();
    } catch (error) {
      toast.error("Failed to create user. Please check your input and try again.");
      console.error("Error saving user:", error);
    } finally {
      setLoading(false);
    }
  };

  // Frontend filter
  const filteredUsers = users.filter((u) =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <Loader/>;
  }

  return (
    <div className="management-container">
      <div className="management-header">
        <div className="header-content">
          <h2 className="header-title">User Management</h2>
          <p className="header-subtitle">Manage system users and their permissions</p>
        </div>
        <div className="header-actions">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button onClick={() => openModal()} className="primary-btn">
            Add New User
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="management-table">
          <thead>
            <tr>
              <th>Email Address</th>
              <th>Full Name</th>
              <th>Phone Number</th>
              <th>Role</th>
              <th>Company</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-row">
                  <div className="empty-state">
                    <p>No users found matching your search criteria.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u.id} className="table-row">
                  <td className="email-cell">{u.email}</td>
                  <td className="name-cell">
                    <div className="user-info">
                      <div className="user-avatar">
                        {u.firstName.charAt(0)}{u.lastName.charAt(0)}
                      </div>
                      <span>{`${u.firstName} ${u.lastName}`}</span>
                    </div>
                  </td>
                  <td className="phone-cell">{u.phoneNumber || "—"}</td>
                  <td className="role-cell">
                    <span className="role-badge">{u.userRole}</span>
                  </td>
                  <td className="company-cell">
                    {u.companyId ? companies.find(c => c.id === u.companyId)?.companyName || "—" : "—"}
                  </td>
                  <td className="status-cell">
                    <span className={`status-badge ${u.userStatus === 'Active' ? 'status-active' : 'status-inactive'}`}>
                      {u.userStatus}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <div className="action-buttons">
                      <button 
                        onClick={() => handleActivateDeactivate(u.id, u.userStatus, `${u.firstName} ${u.lastName}`)}
                        className={`action-btn ${u.userStatus === 'Active' ? 'deactivate-btn' : 'activate-btn'}`}
                        title={u.userStatus === "Active" ? "Deactivate user" : "Activate user"}
                      >
                        {u.userStatus === "Active" ? "Deactivate" : "Activate"}
                      </button>
                      <button 
                        onClick={() => handleDelete(u.id, `${u.firstName} ${u.lastName}`)}
                        className="action-btn delete-btn"
                        title="Delete user"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Enhanced Modal */}
      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New User</h3>
              <button
                type="button"
                onClick={closeModal}
                className="modal-close-btn"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="user-form">
              <div className="form-section">
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="user@example.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="form-section">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <div className="form-group">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="form-section">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="userRole">User Role</label>
                    <select name="userRole" id="userRole" defaultValue={1}>
                      <option value={1}>Regular User</option>
                      <option value={2}>Company User</option>
                      <option value={3}>Company Admin</option>
                      <option value={4}>Super Admin</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="companyId">Company</label>
                    <select name="companyId" id="companyId" defaultValue="">
                      <option value="">Select Company (optional)</option>
                      {companies.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.companyName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Create User
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