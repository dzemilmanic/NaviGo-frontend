import React, { useState, useEffect } from "react";
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
import { Link } from 'react-router-dom';


const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    userType: "", // client, shipper, transport
  });

  const [showPassword, setShowPassword] = useState(false);
  const [validations, setValidations] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClientTypeModalOpen, setIsClientTypeModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [clientType, setClientType] = useState(null); // individual or company

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
  }, [formData]);

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
    setSelectedCompany(company);
    setIsModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const allValid = Object.values(validations).every((v) => v.valid);
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "password",
      "phoneNumber",
      "userType",
    ];
    const allFilled = requiredFields.every((field) => formData[field]);

    // Proveri da li je potrebna kompanija
    const needsCompany =
      formData.userType === "shipper" ||
      formData.userType === "transport" ||
      (formData.userType === "client" && clientType === "company");

    // Proveri da li je potreban client type za klijente
    const needsClientType = formData.userType === "client";

    if (
      allValid &&
      allFilled &&
      (!needsCompany || selectedCompany) &&
      (!needsClientType || clientType)
    ) {
      const registrationData = {
        personalInfo: formData,
        clientType: formData.userType === "client" ? clientType : null,
        companyInfo: selectedCompany,
        timestamp: new Date().toISOString(),
      };

      console.log("Registration data for backend:", registrationData);
      alert("Registration successful! Data ready for backend implementation.");
    } else {
      alert(
        "Please fill in all fields correctly and complete all required selections"
      );
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
                <h1>LogiTrans</h1>
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
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
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
                    <p>{selectedCompany.name}</p>
                    <small>{selectedCompany.address}</small>
                  </div>
                )}
              </div>

              <button type="submit" className="btn btn-primary register-btn">
                <UserPlus size={20} />
                Create Account
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
                <div className="feature-text">
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
        />
      )}

      {isClientTypeModalOpen && (
        <ClientTypeModal
          onClientTypeSelect={handleClientTypeSelect}
          onClose={closeClientTypeModal}
        />
      )}
    </>
  );
};

export default Register;
