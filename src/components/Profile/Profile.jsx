import { useEffect, useState } from "react";
import { companyService } from "../../services/CompanyService";
import { userService } from "../../services/userService";
import {
  X,
  User,
  Building2,
  Mail,
  MapPin,
  Globe,
  Phone,
  Eye,
  EyeOff,
} from "lucide-react";
import "./Profile.css";
import Loader from "../Loader/Loader";
import { toast } from "react-toastify";
// Modal za promenu lozinke
const ChangePasswordModal = ({ onClose }) => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};

    if (newPassword !== confirmPassword) {
      errs.confirmPassword = "Passwords do not match.";
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const response = await userService.changePassword(
        currentPassword,
        newPassword
      );
      if (!response.success) {
        throw new Error(response.message || "Failed to change password");
      }
      toast.success(`Password changed successfully!`);
      // uspešno promenjeno
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
      onClose();
    } catch (err) {
      setErrors({ apiError: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Change Password</h3>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="user-form">
          {/* Current Password */}
          <div className="input-group">
            <label htmlFor="currentPassword">Current Password</label>
            <div className="password-input-container">
              <input
                type={showCurrent ? "text" : "password"}
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowCurrent(!showCurrent)}
                aria-label={showCurrent ? "Hide password" : "Show password"}
              >
                {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="input-group">
            <label htmlFor="newPassword">New Password</label>
            <div className="password-input-container">
              <input
                type={showNew ? "text" : "password"}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowNew(!showNew)}
                aria-label={showNew ? "Hide password" : "Show password"}
              >
                {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input-container">
              <input
                type={showConfirm ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="validation-message error">
                {errors.confirmPassword}
              </span>
            )}
            {errors.apiError && (
              <div className="validation-message error">{errors.apiError}</div>
            )}
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Changing..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
// Modal za izmenu korisničkih informacija
const UserInfoModal = ({ user, onClose }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User info updated:", { firstName, lastName });
    onClose();
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit User Information</h3>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-section">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal za izmenu podataka o kompaniji
const CompanyInfoModal = ({ company, onClose }) => {
  const [companyName, setCompanyName] = useState(company.companyName);
  const [address, setAddress] = useState(company.address);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Company info updated:", { companyName, address });
    onClose();
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
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="companyName">Company Name</label>
                <input
                  type="text"
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          <div className="form-section">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Profile = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [userData, setUserData] = useState(null);
  const fetchUserCompany = async () => {
    if (!user.companyId) return;
    try {
      const response = await companyService.getById(user.companyId);
      setCompany(response.data);
    } catch (error) {
      console.error("Failed to fetch company:", error);
    }
  };
  const fetchUserData = async () => {
    try {
      const response = await userService.getById(user.id);
      console.log(response.data);
      setUserData(response.data);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };
  useEffect(() => {
    fetchUserCompany();
    fetchUserData();
  }, [user.companyId]);
  if (loading || !userData) return <Loader />;
  return (
    <div className="profile-main-page">
      <div className="profile-main-container">
        <div className="profile-main-header">
          <div className="profile-main-avatar">
            <User size={48} />
          </div>
          <div className="profile-main-title">
            <h1>Profile</h1>
            <p className="profile-main-subtitle">
              Manage your account information
            </p>
          </div>
        </div>

        <div className="profile-main-content">
          <div className="profile-main-card">
            <div className="profile-card-header">
              <div className="profile-card-icon">
                <User size={20} />
              </div>
              <h2>Personal Information</h2>
            </div>
            <div className="profile-card-body">
              <div className="profile-info-grid">
                <div className="profile-info-item">
                  <span className="profile-info-label">Full Name</span>
                  <span className="profile-info-value">
                    {userData.firstName} {userData.lastName}
                  </span>
                </div>
                <div className="profile-info-item">
                  <span className="profile-info-label">Phone Number</span>
                  <span className="profile-info-value">
                    <Phone size={16} />
                    {userData.phoneNumber}
                  </span>
                </div>
                <div className="profile-info-item">
                  <span className="profile-info-label">Email Address</span>
                  <span className="profile-info-value">
                    <Mail size={16} />
                    {userData.email}
                  </span>
                </div>
                <div className="profile-info-item">
                  <span className="profile-info-label">Role</span>
                  <span className="profile-info-value">
                    {userData.userRole}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {company && (
            <div className="profile-main-card">
              <div className="profile-card-header">
                <div className="profile-card-icon">
                  <Building2 size={20} />
                </div>
                <h2>Company Information</h2>
              </div>
              <div className="profile-card-body">
                {company.logoUrl && (
                  <div className="profile-company-logo">
                    <img src={company.logoUrl} alt="Company Logo" />
                  </div>
                )}
                <div className="profile-info-grid">
                  <div className="profile-info-item">
                    <span className="profile-info-label">Company Name</span>
                    <span className="profile-info-value">
                      {company.companyName}
                    </span>
                  </div>
                  <div className="profile-info-item">
                    <span className="profile-info-label">Type</span>
                    <span className="profile-info-value">
                      {company.companyType}
                    </span>
                  </div>
                  <div className="profile-info-item">
                    <span className="profile-info-label">PIB</span>
                    <span className="profile-info-value">{company.pib}</span>
                  </div>
                  <div className="profile-info-item">
                    <span className="profile-info-label">Contact Email</span>
                    <span className="profile-info-value">
                      <Mail size={16} />
                      {company.contactEmail}
                    </span>
                  </div>
                  <div className="profile-info-item">
                    <span className="profile-info-label">Address</span>
                    <span className="profile-info-value">
                      <MapPin size={16} />
                      {company.address}
                    </span>
                  </div>
                  {company.description && (
                    <div className="profile-info-item profile-info-full-width">
                      <span className="profile-info-label">Description</span>
                      <span className="profile-info-value">
                        {company.description}
                      </span>
                    </div>
                  )}
                  {company.website && (
                    <div className="profile-info-item">
                      <span className="profile-info-label">Website</span>
                      <span className="profile-info-value">
                        <Globe size={16} />
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {company.website}
                        </a>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="profile-main-actions">
          <button
            className="profile-action-btn profile-action-primary"
            onClick={() => setActiveModal("user")}
          >
            Edit User Info
          </button>
          <button
            className="profile-action-btn profile-action-secondary"
            onClick={() => setActiveModal("password")}
          >
            Change Password
          </button>
          {company && (
            <button
              className="profile-action-btn profile-action-secondary"
              onClick={() => setActiveModal("company")}
            >
              Edit Company Info
            </button>
          )}
        </div>
      </div>

      {activeModal === "password" && (
        <ChangePasswordModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "user" && (
        <UserInfoModal user={userData} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "company" && company && (
        <CompanyInfoModal
          company={company}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
};
export default Profile;
