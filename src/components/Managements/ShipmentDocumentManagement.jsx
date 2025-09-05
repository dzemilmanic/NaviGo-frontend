import { useState, useEffect } from "react";
import { shipmentDocumentService } from "../../services/shipmentDocumentService";
import { shipmentService } from "../../services/shipmentService";
import "./Managements.css";
import Loader from "../Loader/Loader";
import { toast } from "react-toastify";
import { Trash2, Pencil, X } from "lucide-react";
const ShipmentDocumentManagement = () => {
  const [documents, setDocuments] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);
  const fetchData = async () => {
    setLoading(true);
    try {
      const docsResponse = await shipmentDocumentService.getAll();
      const shipmentsResponse = await shipmentService.getAll();

      setDocuments(docsResponse.data);
      setShipments(shipmentsResponse.data);
    } catch (error) {
      toast.error("Failed to load documents. Please try again.");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (doc = null) => {
    setSelectedDocument(doc);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedDocument(null);
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
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
        const response = await shipmentDocumentService.delete(id);
        if (response.success) {
          toast.success(`Shipment document  ${id} deleted successfully!`);
        } else {
          toast.error(
            `Failed to delete shipment document. Message: ${response.message}`
          );
        }
        await fetchData();
      } catch (error) {
        toast.error("Failed to delete shipment document. Please try again.");
        console.error("Error deleting shipment document:", error);
      } finally {
        setLoading(false);
      }
    };

    // Show confirmation toast
    toast.warn(
      <div>
        <p>
          Are you sure you want to delete shipment document{" "}
          <strong>{id}</strong>?
        </p>
        <div style={{ marginTop: "10px", display: "flex", gap: "8px" }}>
          <button
            onClick={confirmDelete}
            style={{
              background: "#dc2626",
              color: "white",
              border: "none",
              padding: "6px 12px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            Delete
          </button>
          <button
            onClick={cancelDelete}
            style={{
              background: "#6b7280",
              color: "white",
              border: "none",
              padding: "6px 12px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
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
        const response = await shipmentDocumentService.update(
          selectedDocument.id,
          formData
        );
        if (!response.success) {
          toast.error(
            `Failed to update document. Message: ${response.message}`
          );
        } else {
          toast.success(
            `Document ${selectedDocument.id} updated successfully!`
          );
        }
      } else {
        const response = await shipmentDocumentService.create(formData);
        if (!response.success) {
          toast.error(
            `Failed to create document. Message: ${response.message}`
          );
        } else {
          toast.success(`Document ${response.data.id} created successfully!`);
        }
      }
      fetchData();
      closeModal();
      setFileUrl(null); // reset fajla
    } catch (error) {
      console.error("Error saving document:", error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <Loader />;
  }
  const filteredDocuments = documents.filter((d) =>
  [
    d.documentType,
    d.fileUrl,
    d.uploadDate,
    d.expiryDate,
    d.verified ? "verified" : "not verified",
    d.shipmentId?.toString()
  ]
    .filter(Boolean)
    .some((field) =>
      field.toString().toLowerCase().includes(search.toLowerCase())
    )
);

  return (
    <div className="management-container">
      <div className="management-header">
        <div className="header-content">
          <h2 className="header-title">Shipment Document Management</h2>
          <p className="header-subtitle">
            Manage shipment documents for your shipments.
          </p>
        </div>
        <div className="header-actions">
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button onClick={() => openModal()} className="primary-btn">
            Add Document ➕
          </button>
        </div>
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
          {filteredDocuments.map((doc) => (
            <tr key={doc.id}>
              <td>{doc.id}</td>
              <td>{doc.shipmentId}</td>
              <td>{doc.documentType}</td>
              <td>
                <a href={doc.fileUrl} target="_blank">
                  View
                </a>{" "}
              </td>
              <td className="actions-cell">
                <div className="action-buttons">
                  <button
                    className="action-btn activate-btn"
                    onClick={() => openModal(doc)}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(doc.id)}
                  >
                    <Trash2 size={16} />
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
            <div className="modal-header">
              <h3>{selectedDocument ? "Edit Document" : "Add Document"}</h3>
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
                </div>
              </div>

              <div className="form-section">
                <div className="form-group">
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
                </div>
              </div>

              <div className="form-section">
                <div className="form-group">
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
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={closeModal}
                  className="cancel-btn"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  button
                  type="submit"
                  className="submit-btn"
                  disabled={loading}
                >
                  {selectedDocument ? "Save" : "Add"}
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
