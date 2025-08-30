import { useState, useEffect } from "react";
import { shipmentDocumentService } from "../../services/shipmentDocumentService";
import { shipmentService } from "../../services/shipmentService";
import "./Managements.css";
import Loader from "../Loader/Loader";
const ShipmentDocumentManagement = () => {
  const [documents, setDocuments] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading,setLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);
  const fetchData = async () => {
    setLoading(true);
    try {
      const docsResponse = await shipmentDocumentService.getAll({ search });
      const shipmentsResponse = await shipmentService.getAll();

      setDocuments(docsResponse.data);
      setShipments(shipmentsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
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
      setLoading(true)
      try {
        await shipmentDocumentService.delete(id);
        fetchData();
      } catch (error) {
        console.error("Error deleting document:", error);
      } finally{
        setLoading(false)
      }
    }
  };
  const handleFileChange = (e) => {
    setFileUrl(e.target.files[0]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    // Početni URL: kod edit-a koristi stari URL, kod add je prazan
    let fileUploadedUrl = selectedDocument?.fileUrl || "";
    setLoading(true);
    // Ako je korisnik izabrao novi fajl, uploaduj ga
    if (fileUrl) {
      try {
        const uploadResponse = await shipmentDocumentService.uploadFile(
          fileUrl
        );
        fileUploadedUrl = uploadResponse.data.url; // URL sa Azure-a
      } catch (error) {
        console.error("Error uploading file:", error);
        return;
      }
    }

    // Kod dodavanja novog dokumenta fajl je obavezan

    const formData = {
      shipmentId: Number(form.shipmentId.value),
      documentType: Number(form.documentType.value),
      fileUrl: fileUploadedUrl, // URL koji se šalje u backend
    };

    try {
      if (selectedDocument) {
        await shipmentDocumentService.update(selectedDocument.id, formData);
      } else {
        await shipmentDocumentService.create(formData);
      }
      fetchData();
      closeModal();
      setFileUrl(null); // reset fajla
    } catch (error) {
      console.error("Error saving document:", error);
    } finally{
      setLoading(false);
    }
  };
  if(loading){
    return <Loader/>
  }
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
              <td>
                <a href={doc.fileUrl} target="_blank">
                  View
                </a>{" "}
              </td>
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
              <label htmlFor="shipmentId">Shipment</label>
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
                <label htmlFor="documentType">Document Type</label>
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

              <div className="file-input-wrapper">
                <label htmlFor="receiptFile">
                  {fileUrl
                    ? `Selected: ${fileUrl.name}`
                    : "Select Receipt File"}
                </label>
                <input
                  type="file"
                  id="receiptFile"
                  name="receiptFile"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                />
              </div>

              <div className="modal-actions">
                <button type="submit">
                  {selectedDocument ? "Save" : "Add"}
                </button>
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
