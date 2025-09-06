import { useState } from "react";
import { userService } from "../../services/userService";
import { toast } from "react-toastify";
import { Eye, EyeOff, X } from "lucide-react";
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

export default ChangePasswordModal;
