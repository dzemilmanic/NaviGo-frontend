import "./ForgotPassword.css";
const ForgotPassword = ({onClose}) => {
  return (
    <div className="forgot-password-container">
      <button className="back-button" onClick={()=>{onClose()}}>⬅Go back</button>
      <h2 className="forgot-password-title">Forgot Password</h2>
      <p className="forgot-password-text">
        Enter your email to reset your password:
      </p>
      <input
        type="email"
        placeholder="Email"
        className="forgot-password-input"
      />
      <button className="forgot-password-button">Reset Password</button>  
    </div>
  );
};

export default ForgotPassword;
