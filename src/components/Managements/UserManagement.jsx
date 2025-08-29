import { useState, useEffect } from "react";
import { userService } from "../../services/userService";
import { companyService } from "../../services/companyService";
import "./Managements.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const userResponse = await userService.getAll();
      const companyResponse = await companyService.getAll();
      setUsers(userResponse.data);
      setCompanies(companyResponse.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (user = null) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await userService.delete(id);
        fetchData();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleActivateDeactivate = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    const action = newStatus === "Active" ? "activate" : "deactivate";
    
    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      try {
        await userService.updateStatus(id, newStatus);
        fetchData();
      } catch (error) {
        console.error("Error updating user status:", error);
      }
    }
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

    try {
      if (selectedUser) {
        await userService.update(selectedUser.id, formData);
      } else {
        await userService.create(formData);
      }
      fetchData();
      closeModal();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  // Frontend filter
  const filteredUsers = users.filter((u) =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="management-container">
      <div className="management-header">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => openModal()}>Add User</button>
      </div>

      <table className="management-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Company</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u) => (
            <tr key={u.id}>
              <td>{u.email}</td>
              <td>{`${u.firstName} ${u.lastName}`}</td>
              <td>{u.phoneNumber}</td>
              <td>{u.userRole}</td>
              <td>{u.companyId ? companies.find(c => c.id === u.companyId)?.companyName : "-"}</td>
              <td>
                <span className={`status-badge ${u.userStatus === 'Active' ? 'status-active' : 'status-inactive'}`}>
                  {u.userStatus}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <button 
                    onClick={() => handleActivateDeactivate(u.id, u.userStatus)}
                    className={`action-btn ${u.userStatus === 'Active' ? 'deactivate-btn' : 'activate-btn'}`}
                  >
                    {u.userStatus === "Active" ? "Deactivate" : "Activate"}
                  </button>
                  <button 
                    onClick={() => handleDelete(u.id)}
                    className="action-btn delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>{selectedUser ? "Edit User" : "Add User"}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                defaultValue={selectedUser?.email || ""}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required={!selectedUser}
              />
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                defaultValue={selectedUser?.firstName || ""}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                defaultValue={selectedUser?.lastName || ""}
                required
              />
              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                defaultValue={selectedUser?.phoneNumber || ""}
              />
              <select name="userRole" defaultValue={selectedUser?.userRole || 1}>
                <option value={1}>RegularUser</option>
                <option value={2}>CompanyUser</option>
                <option value={3}>CompanyAdmin</option>
                <option value={4}>SuperAdmin</option>
              </select>
              <select name="companyId" defaultValue={selectedUser?.companyId || ""}>
                <option value="">Select Company (optional)</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.companyName}
                  </option>
                ))}
              </select>

              <div className="modal-actions">
                <button type="submit">{selectedUser ? "Save" : "Add"}</button>
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

export default UserManagement;