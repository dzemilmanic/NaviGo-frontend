import { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Truck,
  UserPlus,
  Building,
  User,
  Package,
} from "lucide-react";
import CompanyModal from "./CompanyModal";
import ClientTypeModal from "./ClientTypeModal";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import {
  mapRegistrationData,
  validateRegistrationData,
} from "../../utils/userMapper";
import Loader from "../Loader/Loader";
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    userType: null,
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validations, setValidations] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClientTypeModalOpen, setIsClientTypeModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [clientType, setClientType] = useState(null); // individual or company
  const [isCompanyAdmin, setIsCompanyAdmin] = useState(false);
  // Registration state
  const [isRegistering, setIsRegistering] = useState(false);

  // Real-time validations
  useEffect(() => {
    const newValidations = {};

    // Ime validacija
    if (formData.firstName) {
      if (
        formData.firstName.length >= 2 &&
        /^[a-zA-ZšđčćžŠĐČĆŽ\s]+$/.test(formData.firstName)
      ) {
        newValidations.firstName = { valid: true, message: "Valid name" };
      } else {
        newValidations.firstName = {
          valid: false,
          message: "Name must be at least 2 letters",
        };
      }
    }

    // Prezime validacija
    if (formData.lastName) {
      if (
        formData.lastName.length >= 2 &&
        /^[a-zA-ZšđčćžŠĐČĆŽ\s]+$/.test(formData.lastName)
      ) {
        newValidations.lastName = { valid: true, message: "Valid surname" };
      } else {
        newValidations.lastName = {
          valid: false,
          message: "Surname must be at least 2 letters",
        };
      }
    }

    // Email validacija
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(formData.email)) {
        newValidations.email = { valid: true, message: "Valid email address" };
      } else {
        newValidations.email = {
          valid: false,
          message: "Please enter a valid email address",
        };
      }
    }

    // Password validacija
    if (formData.password) {
      const hasUpperCase = /[A-Z]/.test(formData.password);
      const hasNumber = /\d/.test(formData.password);
      const isLongEnough = formData.password.length >= 8;

      if (hasUpperCase && hasNumber && isLongEnough) {
        newValidations.password = { valid: true, message: "Strong password" };
      } else {
        const missing = [];
        if (!isLongEnough) missing.push("8 characters");
        if (!hasUpperCase) missing.push("uppercase letter");
        if (!hasNumber) missing.push("number");
        newValidations.password = {
          valid: false,
          message: `Password must contain: ${missing.join(", ")}`,
        };
      }
    }
    // Potvrda lozinke validacija
    if (confirmPassword) {
      if (confirmPassword === formData.password) {
        newValidations.confirmPassword = {
          valid: true,
          message: "Passwords match",
        };
      } else {
        newValidations.confirmPassword = {
          valid: false,
          message: "Passwords must match",
        };
      }
    }

    // Telefon validacija
    if (formData.phoneNumber) {
      const phoneRegex = /^[+]?[\d\s\-\(\)]{9,15}$/;
      if (phoneRegex.test(formData.phoneNumber)) {
        newValidations.phoneNumber = {
          valid: true,
          message: "Valid phone number",
        };
      } else {
        newValidations.phoneNumber = {
          valid: false,
          message: "Please enter a valid phone number",
        };
      }
    }

    setValidations(newValidations);
  }, [formData, confirmPassword]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUserTypeSelect = (type) => {
    // Reset previous selections
    setClientType(null);
    setSelectedCompany(null);

    setFormData((prev) => ({ ...prev, userType: type }));

    if (type === "client") {
      // Klijent može biti fizičko ili pravno lice
      setIsClientTypeModalOpen(true);
    } else if (type === "shipper" || type === "transport") {
      // Shipper i transport su uvek kompanije
      setIsModalOpen(true);
    }
  };

  const handleClientTypeSelect = (type) => {
    setClientType(type);
    setIsClientTypeModalOpen(false);

    if (type === "company") {
      // Ako je klijent kompanija, otvori company modal
      setIsModalOpen(true);
    }
    // Ako je individual, samo se zatvori modal
  };

  const closeClientTypeModal = () => {
    setIsClientTypeModalOpen(false);
  };

  const handleCompanySelect = (company) => {
    console.log("Selected company:", company);
    setSelectedCompany(company);
    setIsModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSetCompanyAdmin = (val)=>{
    setIsCompanyAdmin(val);
  }
 
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all data
    const validation = validateRegistrationData(
      formData,
      validations,
      clientType,
      selectedCompany
    );

    if (!validation.isValid) {
      toast.error(validation.errors.join(". "));
      return;
    }

    setIsRegistering(true);

    try {
      // Map form data to backend format, including isCompanyAdmin logic
      const userCreateDto = mapRegistrationData(
        formData,
        clientType,
        selectedCompany,
        isCompanyAdmin
      );

      console.log("Sending registration data:", { ...userCreateDto, password: "[HIDDEN]" });

      // Call backend registration API
      const result = await authService.register(userCreateDto);

      if (result.success) {
        toast.success("Registration successful! Please check your email for verification before logging in.");

        // Show success message briefly then redirect
        setTimeout(() => {
          navigate("/login", {
            state: {
              message:
                "Registration successful! Please check your email for verification before logging in.",
              email: formData.email,
            },
          });
        }, 2000);
      } else {
        toast.error(result.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please check your connection and try again.");
    } finally {
      setIsRegistering(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Handle page loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (pageLoading) {
    return <Loader message="Loading..." />;
  }

  return (
    <>
      <div className="register-container">
        <div className="register-background">
          <div className="background-pattern"></div>
        </div>

        <div className="register-content">
          <div className="register-card">
            <div className="register-header">
              <div className="logo-section">
                <div className="logo-icon">
                  <Truck size={32} />
                </div>
                <h1>NaviGo</h1>
                <p>Digital Logistics & Transport Platform</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="register-form">
              <h2>Create Your Account</h2>
              <p className="form-subtitle">
                Fill in your information to get started
              </p>

              <div className="input-row">
                <div className="input-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={isRegistering}
                    className={
                      validations.firstName
                        ? validations.firstName.valid
                          ? "valid"
                          : "error"
                        : ""
                    }
                    placeholder="Enter your first name"
                  />
                  {validations.firstName && (
                    <span
                      className={`validation-message ${
                        validations.firstName.valid ? "success" : "error"
                      }`}
                    >
                      {validations.firstName.message}
                    </span>
                  )}
                </div>

                <div className="input-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={isRegistering}
                    className={
                      validations.lastName
                        ? validations.lastName.valid
                          ? "valid"
                          : "error"
                        : ""
                    }
                    placeholder="Enter your last name"
                  />
                  {validations.lastName && (
                    <span
                      className={`validation-message ${
                        validations.lastName.valid ? "success" : "error"
                      }`}
                    >
                      {validations.lastName.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isRegistering}
                  className={
                    validations.email
                      ? validations.email.valid
                        ? "valid"
                        : "error"
                      : ""
                  }
                  placeholder="Enter your email address"
                />
                {validations.email && (
                  <span
                    className={`validation-message ${
                      validations.email.valid ? "success" : "error"
                    }`}
                  >
                    {validations.email.message}
                  </span>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isRegistering}
                    className={
                      validations.password
                        ? validations.password.valid
                          ? "valid"
                          : "error"
                        : ""
                    }
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={togglePasswordVisibility}
                    disabled={isRegistering}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {validations.password && (
                  <span
                    className={`validation-message ${
                      validations.password.valid ? "success" : "error"
                    }`}
                  >
                    {validations.password.message}
                  </span>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="confirm-password">Confirm Password</label>
                <div className="password-input-container">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isRegistering}
                    className={
                      validations.confirmPassword
                        ? validations.confirmPassword.valid
                          ? "valid"
                          : "error"
                        : ""
                    }
                    placeholder="Repeat your password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={toggleConfirmPasswordVisibility}
                    disabled={isRegistering}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {validations.confirmPassword && (
                  <span
                    className={`validation-message ${
                      validations.confirmPassword.valid ? "success" : "error"
                    }`}
                  >
                    {validations.confirmPassword.message}
                  </span>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  disabled={isRegistering}
                  className={
                    validations.phoneNumber
                      ? validations.phoneNumber.valid
                        ? "valid"
                        : "error"
                      : ""
                  }
                  placeholder="Enter your phone number"
                />
                {validations.phoneNumber && (
                  <span
                    className={`validation-message ${
                      validations.phoneNumber.valid ? "success" : "error"
                    }`}
                  >
                    {validations.phoneNumber.message}
                  </span>
                )}
              </div>

              <div className="user-type-selection">
                <label>Account Type</label>
                <div className="user-type-options">
                  <button
                    type="button"
                    className={`user-type-btn ${
                      formData.userType === "client" ? "selected" : ""
                    }`}
                    onClick={() => handleUserTypeSelect("client")}
                    disabled={isRegistering}
                  >
                    <User size={24} />
                    <span>Client</span>
                    <small>Individuals & Companies needing transport</small>
                  </button>
                  <button
                    type="button"
                    className={`user-type-btn ${
                      formData.userType === "shipper" ? "selected" : ""
                    }`}
                    onClick={() => handleUserTypeSelect("shipper")}
                    disabled={isRegistering}
                  >
                    <Package size={24} />
                    <span>Shipper</span>
                    <small>Companies organizing shipments</small>
                  </button>
                  <button
                    type="button"
                    className={`user-type-btn ${
                      formData.userType === "transport" ? "selected" : ""
                    }`}
                    onClick={() => handleUserTypeSelect("transport")}
                    disabled={isRegistering}
                  >
                    <Building size={24} />
                    <span>Transport Company</span>
                    <small>Transport & logistics providers</small>
                  </button>
                </div>

                {formData.userType === "client" && clientType && (
                  <div className="selected-info">
                    <h4>
                      Client Type:{" "}
                      {clientType === "individual"
                        ? "Individual Person"
                        : "Company"}
                    </h4>
                  </div>
                )}

                {selectedCompany && (
                  <div className="selected-company">
                    <h4>Selected Company:</h4>
                    <p>{selectedCompany.companyName || selectedCompany.name}</p>
                    <small>{selectedCompany.address}</small>
                    <small>
                      PIB: {selectedCompany.pib || selectedCompany.PIB}
                    </small>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary register-btn"
                disabled={isRegistering}
              >
                {isRegistering ? (
                  <>
                    <div
                      className="spinner"
                      style={{
                        width: "20px",
                        height: "20px",
                        border: "2px solid #ffffff",
                        borderTop: "2px solid transparent",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                      }}
                    ></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus size={20} />
                    Create Account
                  </>
                )}
              </button>
            </form>

            <div className="register-footer">
              <p>
                Already have an account? <Link to="/login">Sign In</Link>
              </p>
            </div>
          </div>

          <div className="features-section">
            <h3>Why Choose LogiTrans?</h3>
            <div className="feature-list">
              <div className="feature-item">
                <div className="feature-icon">🚀</div>
                <div className="feature-text">
                  <h4>Fast Registration</h4>
                  <p>
                    Quick and easy setup process to get you started immediately
                  </p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🔒</div>
                <div className="feature-text">
                  <h4>Secure Platform</h4>
                  <p>
                    Advanced security measures to protect your business data
                  </p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📈</div>
                <div className="feature-text">
                  <h4>Business Growth</h4>
                  <p>
                    Tools and analytics to help grow your logistics business
                  </p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🌍</div>
                <div class="feature-text">
                  <h4>Global Network</h4>
                  <p>Connect with partners and customers worldwide</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <CompanyModal
          userType={formData.userType}
          onCompanySelect={handleCompanySelect}
          onClose={closeModal}
          companyAdmin={handleSetCompanyAdmin}
        />
      )}

      {isClientTypeModalOpen && (
        <ClientTypeModal
          onClientTypeSelect={handleClientTypeSelect}
          onClose={closeClientTypeModal}
        />
      )}

      {/* CSS for spinner animation */}
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
};

export default Register;