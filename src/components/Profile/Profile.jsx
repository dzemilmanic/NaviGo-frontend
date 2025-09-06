import { useEffect, useState, useCallback } from "react";
import { companyService } from "../../services/CompanyService";
import { userService } from "../../services/userService";
import { User, Building2, Mail, MapPin, Globe, Phone } from "lucide-react";
import "./Profile.css";
import Loader from "../Loader/Loader";
import ChangePasswordModal from "../Modals/ChangePasswordModal";
import CompanyInfoModal from "../Modals/CompanyInfoModal";
import UserInfoModal from "../Modals/UserInfoModal";
const Profile = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [userData, setUserData] = useState(null);
  const [change, setChange] = useState(false);
  const fetchUserCompany = useCallback(async () => {
    if (!user.companyId) return;
    try {
      const response = await companyService.getById(user.companyId);
      setCompany(response.data);
    } catch (error) {
      console.error("Failed to fetch company:", error);
    }
  }, [user.companyId]);

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await userService.getById(user.id);
      setUserData(response.data);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setLoading(false);
    }
  }, [user.id]);
  useEffect(() => {
    fetchUserCompany();
    fetchUserData();
  }, [fetchUserCompany, fetchUserData, change]);
  const handleUpdate = () => {
    setChange(!change);
  };
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
        <UserInfoModal
          user={userData}
          onClose={() => setActiveModal(null)}
          onUpdate={handleUpdate}
        />
      )}
      {activeModal === "company" && company && (
        <CompanyInfoModal
          company={company}
          onClose={() => setActiveModal(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};
export default Profile;
