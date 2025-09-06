import { useState } from "react";
import { companyService } from "../../services/companyService";
import { toast } from "react-toastify";
import { Image, Upload, FileText, X } from "lucide-react";
const CompanyInfoModal = ({ company, onClose, onUpdate }) => {
  const [companyName, setCompanyName] = useState(company.companyName || "");
  const [address, setAddress] = useState(company.address || "");
  const [contactEmail, setContactEmail] = useState(company.contactEmail || "");
  const [website, setWebsite] = useState(company.website || "");
  const [description, setDescription] = useState(company.description || "");
  const [logoUrl, setLogoUrl] = useState(company.logoUrl || null);
  const [maxCommissionRate, setMaxCommissionRate] = useState(
    company.maxCommissionRate || ""
  );
  const [loading, setLoading] = useState(false);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoUrl(file); // čuvamo fajl u state
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let uploadedLogoUrl = logoUrl;

    // Upload ako je fajl
    if (logoUrl instanceof File) {
      uploadedLogoUrl = await uploadFile(logoUrl, "logo");
      if (!uploadedLogoUrl) return;
    }

    const response = await companyService.update(company.id, {
      companyName: companyName,
      address: address,
      contactEmail: contactEmail,
      website: website,
      description: description,
      logoUrl: uploadedLogoUrl,
      maxCommissionRate:
        maxCommissionRate.length > 0 ? Number(maxCommissionRate) : null,
    });
    if (!response.success) {
      toast.error(`Failed to update company. Message: ${response.message}`);
      onClose();
      return;
    }
    toast.success("Company updated successfully!");
    onUpdate();
    onClose();
  };

  const uploadFile = async (file, fileType) => {
    setLoading(true);
    try {
      console.log(`Uploading ${fileType}:`, file.name);

      const uploadResult = await companyService.uploadFile(file);

      if (uploadResult.success) {
        const fileUrl =
          uploadResult.data?.url ||
          uploadResult.data?.filePath ||
          uploadResult.data?.fileUrl ||
          uploadResult.url;

        if (fileUrl) {
          toast.success(
            `${
              fileType === "logo" ? "Logo" : "Document"
            } uploaded successfully!`
          );
          return fileUrl;
        }
      }

      toast.error(`Failed to upload ${fileType}`);
      return null;
    } catch (error) {
      console.error(`${fileType} upload error:`, error);
      toast.error(`Upload failed. Try again.`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (fileType) => {
    return fileType === "logo" ? <Image size={16} /> : <FileText size={16} />;
  };

  const getFileLabel = (file, fileType) => {
    if (file instanceof File) {
      return (
        <span className="file-selected">
          {getFileIcon(fileType)}
          {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
        </span>
      );
    }
    return `Select ${fileType === "logo" ? "logo" : "proof document"}`;
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit Company Information</h3>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-section">
            <label htmlFor="companyName">Company Name</label>
            <input
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>

          <div className="form-section">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className="form-section">
            <label htmlFor="contactEmail">Contact Email</label>
            <input
              type="email"
              id="contactEmail"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              required
            />
          </div>

          {company.maxCommissionRate && (
            <div className="form-section">
              <label htmlFor="maxCommissionRate">Max Commission Rate</label>
              <input
                type="number"
                id="maxCommissionRate"
                value={maxCommissionRate || null}
                onChange={(e) => setMaxCommissionRate(e.target.value)}
              />
            </div>
          )}

          <div className="form-section">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="form-section">
            <label htmlFor="website">Website</label>
            <input
              type="text"
              id="website"
              value={website}
              placeholder="https://"
              pattern="https?://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]"
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <div className="form-section">
            <label htmlFor="photo-logoUrl">Company Logo</label>
            <div className="photo-file-input-container">
              <label
                htmlFor="logoUrl"
                className={`photo-file-input-label ${
                  logoUrl ? "has-file" : ""
                }`}
              >
                {loading ? (
                  <div className="photo-uploading-indicator">
                    <div className="photo-spinner small"></div>
                    Uploading logo...
                  </div>
                ) : (
                  <>
                    <Upload size={16} />
                    {getFileLabel(logoUrl, "logo")}
                  </>
                )}
              </label>
              <input
                type="file"
                id="logoUrl"
                name="logoUrl"
                onChange={handleLogoChange}
                accept="image/*"
                disabled={loading}
                style={{ display: "none" }}
              />
            </div>
            <small className="photo-input-hint">
              PNG, JPG or GIF (max 5MB)
            </small>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyInfoModal;
