import { useState, useEffect } from "react";
import { shipmentDocumentService } from "../../services/shipmentDocumentService";
import { shipmentService } from "../../services/shipmentService";
import "./Managements.css";

const ShipmentDocumentManagement = () => {
  const [documents, setDocuments] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const docsResponse = await shipmentDocumentService.getAll({ search });
      const shipmentsResponse = await shipmentService.getAll();

      setDocuments(docsResponse.data);
      setShipments(shipmentsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  const openModal = (doc = null) => {
    setSelectedDocument(doc);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedDocument(null);
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        await shipmentDocumentService.delete(id);
        fetchData();
      } catch (error) {
        console.error("Error deleting document:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = {
      shipmentId: Number(form.shipmentId.value),
      documentType: Number(form.documentType.value),
      fileUrl: form.fileUrl.value,
    };

    try {
      if (selectedDocument) {
        await shipmentDocumentService.update(selectedDocument.id, formData);
      } else {
        await shipmentDocumentService.create(formData);
      }
      fetchData();
      closeModal();
    } catch (error) {
      console.error("Error saving document:", error);
    }
  };

  return (
    <div className="management-container">
      <div className="management-header">
        <input
          type="text"
          placeholder="Search documents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => openModal()}>Add Document</button>
      </div>

      <table className="management-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Shipment ID</th>
            <th>Document Type</th>
            <th>File URL</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id}>
              <td>{doc.id}</td>
              <td>{doc.shipmentId}</td>
              <td>{doc.documentType}</td>
              <td>{doc.fileUrl}</td>
              <td>
                <button onClick={() => openModal(doc)}>Edit</button>
                <button onClick={() => handleDelete(doc.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>{selectedDocument ? "Edit Document" : "Add Document"}</h3>
            <form onSubmit={handleSubmit}>
              <select
                name="shipmentId"
                defaultValue={selectedDocument?.shipmentId || ""}
                required
              >
                <option value="">Select Shipment</option>
                {shipments.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.id} - {s.description}
                  </option>
                ))}
              </select>

              <select
                name="documentType"
                defaultValue={selectedDocument?.documentType || ""}
                required
              >
                <option value="">Select Document Type</option>
                <option value={0}>Bill of Lading</option>
                <option value={1}>Invoice</option>
                <option value={2}>Packing List</option>
                <option value={3}>Customs Declaration</option>
                <option value={4}>Insurance Certificate</option>
                <option value={99}>Other</option>
              </select>

              <input
                type="text"
                name="fileUrl"
                placeholder="File URL"
                defaultValue={selectedDocument?.fileUrl || ""}
                required
              />

              <div className="modal-actions">
                <button type="submit">{selectedDocument ? "Save" : "Add"}</button>
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

export default ShipmentDocumentManagement;
