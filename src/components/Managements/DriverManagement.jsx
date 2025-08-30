import { useState, useEffect } from "react";
import { driverService } from "../../services/driverService";
import { companyService } from "../../services/companyService";
import { X } from "lucide-react";
import { toast } from 'react-toastify';
import Loader from "../Loader/Loader";
import "./Managements.css";
import { useAuth } from "../../contexts/AuthContext";

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Fetch drivers
  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const [driverResponse, companyResponse] = await Promise.all([
        driverService.getAll(),
        companyService.getAll()
      ]);
      setDrivers(driverResponse.data);
      setCompanies(companyResponse.data);
      //toast.success("Drivers loaded successfully!");
    } catch (error) {
      toast.error("Failed to load drivers. Please try again.");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const openModal = (driver = null) => {
    setSelectedDriver(driver);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedDriver(null);
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const handleDelete = async (id, driverName) => {
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
        await driverService.delete(id);
        await fetchDrivers();
        toast.success(`Driver ${driverName} deleted successfully!`);
      } catch (error) {
        toast.error("Failed to delete driver. Please try again.");
        console.error("Error deleting driver:", error);
      } finally {
        setLoading(false);
      }
    };

    // Show confirmation toast
    toast.warn(
      <div>
        <p>Are you sure you want to delete driver <strong>{driverName}</strong>?</p>
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    const formData = {
      companyId: user.companyId,
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      phoneNumber: form.phoneNumber.value,
      licenseNumber: form.licenseNumber.value,
      licenseExpiry: form.licenseExpiry.value,
      licenseCategories: form.licenseCategories.value,
      hireDate: form.hireDate.value,
    };

    try {
      if (selectedDriver) {
        await driverService.update(selectedDriver.id, formData);
        toast.success(`Driver ${formData.firstName} ${formData.lastName} updated successfully!`);
      } else {
        await driverService.create(formData);
        toast.success(`Driver ${formData.firstName} ${formData.lastName} created successfully!`);
      }
      
      await fetchDrivers();
      closeModal();
    } catch (error) {
      toast.error("Failed to save driver. Please try again.");
      console.error("Error saving driver:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter drivers on frontend
  const filteredDrivers = drivers.filter((d) =>
    `${d.firstName} ${d.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    d.licenseNumber.toLowerCase().includes(search.toLowerCase()) ||
    d.phoneNumber.toLowerCase().includes(search.toLowerCase())
  );

  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.id === companyId);
    return company ? company.companyName : "Unknown Company";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) return <Loader />;

  return (
    <div className="management-container">
      <div className="management-header">
        <div className="header-content">
          <h2 className="header-title">Driver Management</h2>
          <p className="header-subtitle">Manage drivers and their information</p>
        </div>
        <div className="header-actions">
          <input
            type="text"
            placeholder="Search drivers by name, license, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button onClick={() => openModal()} className="primary-btn">
            Add Driver
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="management-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Company</th>
              <th>Full Name</th>
              <th>Phone</th>
              <th>License Number</th>
              <th>License Expiry</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDrivers.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty-row">
                  <div className="empty-state">
                    <p>No drivers found matching your search criteria.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredDrivers.map((d) => (
                <tr key={d.id} className="table-row">
                  <td>{d.id}</td>
                  <td className="company-cell">
                    {d.companyName || getCompanyName(d.companyId)}
                  </td>
                  <td className="name-cell">
                    <div className="user-info">
                      <div className="user-avatar">
                        {d.firstName.charAt(0)}{d.lastName.charAt(0)}
                      </div>
                      <span>{`${d.firstName} ${d.lastName}`}</span>
                    </div>
                  </td>
                  <td className="phone-cell">{d.phoneNumber}</td>
                  <td>{d.licenseNumber}</td>
                  <td>{formatDate(d.licenseExpiry)}</td>
                  <td className="status-cell">
                    <span className={`status-badge ${d.driverStatus === 'Active' ? 'status-active' : 'status-inactive'}`}>
                      {d.driverStatus}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <div className="action-buttons">
                      <button 
                        onClick={() => openModal(d)}
                        className="action-btn activate-btn"
                        title="Edit driver"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(d.id, `${d.firstName} ${d.lastName}`)}
                        className="action-btn delete-btn"
                        title="Delete driver"
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

      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedDriver ? "Edit Driver" : "Add Driver"}</h3>
              <button
                type="button"
                onClick={closeModal}
                className="modal-close-btn"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-section">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      defaultValue={selectedDriver?.firstName || ""}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      defaultValue={selectedDriver?.lastName || ""}
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
                    name="phoneNumber"
                    placeholder="Phone Number"
                    defaultValue={selectedDriver?.phoneNumber || ""}
                    required
                  />
                </div>
              </div>

              <div className="form-section">
                <div className="form-group">
                  <label htmlFor="licenseNumber">License Number</label>
                  <input
                    type="text"
                    name="licenseNumber"
                    placeholder="License Number"
                    defaultValue={selectedDriver?.licenseNumber || ""}
                    required
                  />
                </div>
              </div>

              <div className="form-section">
                <div className="form-group">
                  <label htmlFor="licenseCategories">License Categories</label>
                  <input
                    type="text"
                    name="licenseCategories"
                    placeholder="License Categories (e.g., B, C, D)"
                    defaultValue={selectedDriver?.licenseCategories || ""}
                  />
                </div>
              </div>

              <div className="form-section">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="licenseExpiry">License Expiry</label>
                    <input
                      type="date"
                      name="licenseExpiry"
                      defaultValue={selectedDriver?.licenseExpiry?.split("T")[0] || ""}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="hireDate">Hire Date</label>
                    <input
                      type="date"
                      name="hireDate"
                      defaultValue={selectedDriver?.hireDate?.split("T")[0] || ""}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="cancel-btn" disabled={loading}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Saving..." : (selectedDriver ? "Save" : "Add")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverManagement;