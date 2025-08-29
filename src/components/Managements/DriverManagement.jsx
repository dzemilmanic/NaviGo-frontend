import { useState, useEffect } from "react";
import { driverService } from "../../services/driverService";
import { companyService } from "../../services/companyService";
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
    } catch (error) {
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
  };

  const closeModal = () => {
    setSelectedDriver(null);
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this driver?")) {
      setLoading(true);
      try {
        await driverService.delete(id);
        await fetchDrivers();
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
      } else {
        await driverService.create(formData);
      }
      
      await fetchDrivers();
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

      <table className="management-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Company</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Phone</th>
            <th>License Number</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDrivers.map((d) => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.companyName || getCompanyName(d.companyId)}</td>
              <td>{d.firstName}</td>
              <td>{d.lastName}</td>
              <td>{d.phoneNumber}</td>
              <td>{d.licenseNumber}</td>
              <td>{d.driverStatus}</td>
              <td>
                <button onClick={() => openModal(d)}>Edit</button>
                <button onClick={() => handleDelete(d.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>{selectedDriver ? "Edit Driver" : "Add Driver"}</h3>
            <form onSubmit={handleSubmit}>
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                defaultValue={selectedDriver?.firstName || ""}
                required
              />
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                defaultValue={selectedDriver?.lastName || ""}
                required
              />
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                defaultValue={selectedDriver?.phoneNumber || ""}
                required
              />
              <label htmlFor="licenseNumber">License Number</label>
              <input
                type="text"
                name="licenseNumber"
                placeholder="License Number"
                defaultValue={selectedDriver?.licenseNumber || ""}
                required
              />
              <label htmlFor="licenseCategories">License Categories</label>
              <input
                type="text"
                name="licenseCategories"
                placeholder="License Categories (e.g., B, C, D)"
                defaultValue={selectedDriver?.licenseCategories || ""}
              />
              <label htmlFor="licenseExpiry">License Expiry</label>
              <input
                type="date"
                name="licenseExpiry"
                defaultValue={selectedDriver?.licenseExpiry?.split("T")[0] || ""}
              />
              <label htmlFor="hireDate">Hire Date</label>
              <input
                type="date"
                name="hireDate"
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
