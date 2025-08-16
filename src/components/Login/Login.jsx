import React, { useState } from "react";
import { Eye, EyeOff, Truck, Shield, AlertCircle } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    if (apiError) {
      setApiError("");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      setApiError("");
      
      try {
        const result = await login(formData);
        
        if (result.success) {
          // Redirect to dashboard or home page
          navigate('/dashboard', { replace: true });
        } else {
          setApiError(result.message || 'Login failed. Please try again.');
        }
      } catch (error) {
        setApiError('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="background-pattern"></div>
      </div>

      <div className="login-content">
        <div className="login-card">
          <div className="login-header">
            <div className="logo-section">
              <div className="logo-icon">
                <Truck size={32} />
              </div>
              <h1>NaviGo</h1>
              <p>Digital Logistics & Transport Platform</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <h2>Sign In to Your Account</h2>
            <p className="form-subtitle">
              Enter your credentials to access the platform
            </p>

            {apiError && (
              <div className="error-banner">
                <AlertCircle size={20} />
                <span>{apiError}</span>
              </div>
            )}

            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? "error" : ""}
                placeholder="Enter your email address"
                disabled={loading}
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
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
                  className={errors.password ? "error" : ""}
                  placeholder="Enter your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input type="checkbox" disabled={loading} />
                <span className="checkmark"></span>
                Remember me
              </label>
              <a href="#" className="forgot-password">
                Forgot Password?
              </a>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary login-btn"
              disabled={loading}
            >
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                <>
                  <Shield size={20} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </div>
        </div>

        <div className="features-section">
          <h3>Platform Features</h3>
          <div className="feature-list">
            <div className="feature-item">
              <div className="feature-icon">📦</div>
              <div className="feature-text">
                <h4>Shipment Tracking</h4>
                <p>Real-time monitoring of all shipments and deliveries</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🚛</div>
              <div className="feature-text">
                <h4>Fleet Management</h4>
                <p>Comprehensive vehicle and driver management system</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📊</div>
              <div className="feature-text">
                <h4>Analytics & Reports</h4>
                <p>Detailed insights and performance analytics</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">💬</div>
              <div className="feature-text">
                <h4>Communication Hub</h4>
                <p>Seamless communication between all stakeholders</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;