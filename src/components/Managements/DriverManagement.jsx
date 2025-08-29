import { useState, useEffect } from "react";
import { driverService } from "../../services/driverService";
import { companyService } from "../../services/companyService";
import Loader from "../Loader/Loader";
import "./Managements.css";

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch drivers and companies
  const fetchData = async () => {
    setLoading(true);
    try {
      const [driverResponse, companyResponse] = await Promise.all([
        driverService.getAll(),
        companyService.getAll()
      ]);
      setDrivers(driverResponse.data);
      setCompanies(companyResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (driver = null) => {
    setSelectedDriver(driver);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedDriver(null);
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this driver?")) {
      try {
        setLoading(true);
        await driverService.delete(id);
        await fetchData();
      } catch (error) {
        console.error("Error deleting driver:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const form = e.target;
      const formData = {
        companyId: Number(form.companyId.value),
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        phoneNumber: form.phoneNumber.value,
        licenseNumber: form.licenseNumber.value,
        licenseExpiry: form.licenseExpiry.value,
        licenseCategories: form.licenseCategories.value,
        hireDate: form.hireDate.value,
      };

      if (selectedDriver) {
        await driverService.update(selectedDriver.id, formData);
      } else {
        await driverService.create(formData);
      }
      
      await fetchData();
      closeModal();
    } catch (error) {
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
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="management-container">
      <div className="management-header">
        <input
          type="text"
          placeholder="Search drivers by name, license, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => openModal()}>Add Driver</button>
      </div>

      {loading && <Loader />}

      {!loading && (
        <>
          <table className="management-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Company</th>
                <th>Name</th>
                <th>Phone</th>
                <th>License Number</th>
                <th>License Categories</th>
                <th>License Expiry</th>
                <th>Hire Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDrivers.map((d) => (
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td>{getCompanyName(d.companyId)}</td>
                  <td>{`${d.firstName} ${d.lastName}`}</td>
                  <td>{d.phoneNumber}</td>
                  <td>{d.licenseNumber}</td>
                  <td>{d.licenseCategories || "-"}</td>
                  <td>{formatDate(d.licenseExpiry)}</td>
                  <td>{formatDate(d.hireDate)}</td>
                  <td>
                    <span className={`status-badge ${d.driverStatus === 'Active' ? 'status-active' : 'status-inactive'}`}>
                      {d.driverStatus || "Unknown"}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        onClick={() => openModal(d)}
                        className="action-btn activate-btn"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(d.id)}
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

          {filteredDrivers.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">👨‍💼</div>
              <h3>No drivers found</h3>
              <p>Start by adding your first driver to the system</p>
              <button className="empty-add-button" onClick={() => openModal()}>
                Add Driver
              </button>
            </div>
          )}
        </>
      )}

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>{selectedDriver ? "Edit Driver" : "Add Driver"}</h3>
            <form onSubmit={handleSubmit}>
              <select 
                name="companyId" 
                defaultValue={selectedDriver?.companyId || ""} 
                required
              >
                <option value="">Select Company</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.companyName}
                  </option>
                ))}
              </select>
              
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                defaultValue={selectedDriver?.firstName || ""}
                required
              />
              
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                defaultValue={selectedDriver?.lastName || ""}
                required
              />
              
              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                defaultValue={selectedDriver?.phoneNumber || ""}
                required
              />
              
              <input
                type="text"
                name="licenseNumber"
                placeholder="License Number"
                defaultValue={selectedDriver?.licenseNumber || ""}
                required
              />
              
              <input
                type="date"
                name="licenseExpiry"
                placeholder="License Expiry"
                defaultValue={selectedDriver?.licenseExpiry?.split("T")[0] || ""}
              />
              
              <input
                type="text"
                name="licenseCategories"
                placeholder="License Categories (e.g., B, C, D)"
                defaultValue={selectedDriver?.licenseCategories || ""}
              />
              
              <input
                type="date"
                name="hireDate"
                placeholder="Hire Date"
                defaultValue={selectedDriver?.hireDate?.split("T")[0] || ""}
              />

              <div className="modal-actions">
                <button type="submit" disabled={loading}>
                  {loading ? "Saving..." : (selectedDriver ? "Save" : "Add")}
                </button>
                <button type="button" onClick={closeModal} disabled={loading}>
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

export default DriverManagement;