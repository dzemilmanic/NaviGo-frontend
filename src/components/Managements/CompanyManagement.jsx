import { useState, useEffect } from "react";
import { companyService } from "../../services/companyService"; // pretpostavljam da imaš servis
import "./Managements.css";

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch companies
  const fetchCompanies = async () => {
    try {
      const response = await companyService.getAll(); // bez search parametra
      setCompanies(response.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Open modal for add/edit
  const openModal = (company = null) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedCompany(null);
    setIsModalOpen(false);
  };

  // Delete company
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      try {
        await companyService.delete(id);
        fetchCompanies();
      } catch (error) {
        console.error("Error deleting company:", error);
      }
    }
  };

  // Submit add/edit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = {
      companyName: form.companyName.value,
      pib: form.pib.value,
      address: form.address.value,
      contactEmail: form.contactEmail.value,
      website: form.website.value,
      description: form.description.value,
      maxCommissionRate: Number(form.maxCommissionRate.value),
      proofFileUrl: form.proofFileUrl.value,
      companyType: Number(form.companyType.value),
    };

    try {
      if (selectedCompany) {
        await companyService.update(selectedCompany.id, formData);
      } else {
        await companyService.create(formData);
      }
      fetchCompanies();
      closeModal();
    } catch (error) {
      console.error("Error saving company:", error);
    }
  };

  // Filter companies na frontendu
  const filteredCompanies = companies.filter((c) =>
    c.companyName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="management-container">
      <div className="management-header">
        <input
          type="text"
          placeholder="Search companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => openModal()}>Add Company</button>
      </div>

      <table className="management-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>PIB</th>
            <th>Email</th>
            <th>Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCompanies.map((company) => (
            <tr key={company.id}>
              <td>{company.id}</td>
              <td>{company.companyName}</td>
              <td>{company.pib}</td>
              <td>{company.contactEmail}</td>
              <td>{company.companyType}</td>
              <td>{company.companyStatus}</td>
              <td>
                <button onClick={() => openModal(company)}>Edit</button>
                <button onClick={() => handleDelete(company.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>{selectedCompany ? "Edit Company" : "Add Company"}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="companyName"
                placeholder="Company Name"
                defaultValue={selectedCompany?.companyName || ""}
                required
              />
              <input
                type="text"
                name="pib"
                placeholder="PIB"
                defaultValue={selectedCompany?.pib || ""}
                required
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                defaultValue={selectedCompany?.address || ""}
              />
              <input
                type="text"
                name="contactEmail"
                placeholder="Contact Email"
                defaultValue={selectedCompany?.contactEmail || ""}
              />
              <input
                type="text"
                name="website"
                placeholder="Website"
                defaultValue={selectedCompany?.website || ""}
              />
              <input
                type="text"
                name="description"
                placeholder="Description"
                defaultValue={selectedCompany?.description || ""}
              />
              <input
                type="number"
                name="maxCommissionRate"
                placeholder="Max Commission Rate"
                defaultValue={selectedCompany?.maxCommissionRate || 0}
              />
              <input
                type="text"
                name="proofFileUrl"
                placeholder="Proof File URL"
                defaultValue={selectedCompany?.proofFileUrl || ""}
              />
              <select
                name="companyType"
                defaultValue={selectedCompany?.companyType || 1}
              >
                <option value={1}>Client</option>
                <option value={2}>Forwarder</option>
                <option value={3}>Carrier</option>
              </select>
              <div className="modal-actions">
                <button type="submit">{selectedCompany ? "Save" : "Add"}</button>
                <button type="button" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyManagement;
