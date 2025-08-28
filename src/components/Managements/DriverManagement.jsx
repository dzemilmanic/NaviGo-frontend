import { useState, useEffect } from "react";
import { driverService } from "../../services/driverService";
import { companyService } from "../../services/companyService"; // za dropdown kompanija
import "./Managements.css";

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companies, setCompanies] = useState([]);

  // Fetch drivers
  const fetchDrivers = async () => {
    try {
      const response = await driverService.getAll(); // bez search parametra
      setDrivers(response.data);
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  };

  // Fetch companies for dropdown
  const fetchCompanies = async () => {
    try {
      const response = await companyService.getAll();
      setCompanies(response.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  useEffect(() => {
    fetchDrivers();
    fetchCompanies();
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
        await driverService.delete(id);
        fetchDrivers();
      } catch (error) {
        console.error("Error deleting driver:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

    try {
      if (selectedDriver) {
        await driverService.update(selectedDriver.id, formData);
      } else {
        await driverService.create(formData);
      }
      fetchDrivers();
      closeModal();
    } catch (error) {
      console.error("Error saving driver:", error);
    }
  };

  // Filter drivers na frontendu
  const filteredDrivers = drivers.filter((d) =>
    `${d.firstName} ${d.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="management-container">
      <div className="management-header">
        <input
          type="text"
          placeholder="Search drivers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => openModal()}>Add Driver</button>
      </div>

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
              <td>{companies.find(c => c.id === d.companyId)?.companyName || d.companyId}</td>
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
              <select name="companyId" defaultValue={selectedDriver?.companyId || ""} required>
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
              />
              <input
                type="text"
                name="licenseNumber"
                placeholder="License Number"
                defaultValue={selectedDriver?.licenseNumber || ""}
              />
              <input
                type="date"
                name="licenseExpiry"
                defaultValue={selectedDriver?.licenseExpiry?.split("T")[0] || ""}
              />
              <input
                type="text"
                name="licenseCategories"
                placeholder="License Categories"
                defaultValue={selectedDriver?.licenseCategories || ""}
              />
              <input
                type="date"
                name="hireDate"
                defaultValue={selectedDriver?.hireDate?.split("T")[0] || ""}
              />
              <div className="modal-actions">
                <button type="submit">{selectedDriver ? "Save" : "Add"}</button>
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

export default DriverManagement;
