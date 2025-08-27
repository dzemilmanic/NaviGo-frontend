import { useState } from "react";
// import { apiService,API_ENDPOINTS } from "../../services/api";
import {userService} from "../../services/userService";
import { Eye, EyeOff } from "lucide-react";
import "./ForgotPassword.css";

const ForgotPassword = ({ onClose }) => {
  const [resetPassword, setResetPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");   // ✅ success/error message
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    token: "",
    newPassword: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);     // 👁 toggle za password
  const [showConfirm, setShowConfirm] = useState(false);       // 👁 toggle za confirm password
  const [passwordResetDone, setPasswordResetDone] = useState(false); // ✅ da se sakrije forma posle successa

  const handleSubmitEmail = async () => {
    setErrors({});
    setMessage("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors({ email: "Please enter a valid email address." });
      return;
    }

    setIsLoading(true);
    const res = await userService.forgotPassword(email);
    setIsLoading(false);

    if (res.success) {
      setMessage("Reset PIN has been sent to your email ✅");
      setResetPassword(true);
    } else {
      setErrors({ api: res.error || "Something went wrong. Try again." });
    }
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    const pinRegex = /^\d{6}$/;
    if (!pinRegex.test(formData.token)) {
      setErrors({ token: "Please enter a valid 6-digit PIN." });
      return;
    }
    if (formData.newPassword !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match." });
      return;
    }

    setIsLoading(true);
    const res = await userService.resetPassword(formData.token, formData.newPassword);
    setIsLoading(false);

    if (res.success) {
      setMessage("Password reset successfully ✅");
      setPasswordResetDone(true);  // ✅ sakrij formu i ostavi samo success poruku
      setTimeout(() => onClose(), 2000);
    } else {
      setErrors({ api: res.error || "Password reset failed. Try again." });
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="forgot-password-container">
      <button className="back-button" onClick={onClose}>
        ⬅ Go back
      </button>

      {message && <p className="success">{message}</p>}
      {errors.api && <p className="error-messages">{errors.api}</p>}

      {!resetPassword && !passwordResetDone && (
        <>
          <h2 className="forgot-password-title">Forgot Password</h2>
          <p className="forgot-password-text">
            Enter your email to reset your password:
          </p>
          <input
            type="email"
            placeholder="Email"
            className="forgot-password-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="error-messages">{errors.email}</p>}
          <button
            className="forgot-password-button"
            onClick={handleSubmitEmail}
          >
            Reset Password
          </button>
        </>
      )}

      {resetPassword && !passwordResetDone && (
        <form onSubmit={handleSubmitPassword} className="forgot-password-form">
          <p className="forgot-password-text">
            Enter your PIN, new password and confirm password:
          </p>
          {errors.token && <p className="error-messages">{errors.token}</p>}
          <input
            type="number"
            placeholder="PIN"
            className="forgot-password-input"
            value={formData.token}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, token: e.target.value }))
            }
          />

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              className="forgot-password-input"
              value={formData.newPassword}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  newPassword: e.target.value,
                }))
              }
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </span>
          </div>


          <div className="password-wrapper">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              className="forgot-password-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span
              className="eye-icon"
              onClick={() => setShowConfirm((prev) => !prev)}
            >
              {showConfirm ? <Eye /> : <EyeOff />}
            </span>
          </div>
          {errors.confirmPassword && (
            <p className="error-messages">{errors.confirmPassword}</p>
          )}
          <button className="forgot-password-button" type="submit">
            Reset Password
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
