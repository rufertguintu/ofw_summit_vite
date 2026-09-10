import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";

import Logo from "../assets/2025-assets/section1-logo.png";
import Loading from "../assets/loading-reg.gif";
import { fetchApi } from "../store/api";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const login = searchParams.get("login") || "";
  const key = searchParams.get("key") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const getValidationError = () => {
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    if (!trimmedPassword || !trimmedConfirmPassword) {
      return "Please enter and confirm your new password.";
    }

    if (trimmedPassword.length < 8) {
      return "Password must be at least 8 characters.";
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      return "Passwords do not match.";
    }

    return "";
  };

  const handleSubmit = async () => {
    setError("");
    setMessage("");

    if (!login || !key) {
      setError("This password reset link is invalid or missing required information.");
      return;
    }

    const validationError = getValidationError();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const response = await fetchApi("/wp-json/custom/v1/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login, key, password: password.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.message || "Unable to reset your password.");
        return;
      }

      setMessage(data?.message || "Your password has been reset. You can now log in with your new password.");
      setSuccess(true);
    } catch (err) {
      console.error("Error resetting password:", err);
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-section">
      <div className="login-banner">
        <img src={Logo} alt="" />
      </div>
      <div className="custom-container">
        <div className="login-wrapper">
          <h2>Reset Password</h2>
          <div className="reg_fields">
            {!login || !key ? (
              <div className="one-column_field">
                <p style={{ color: "red" }}>
                  This password reset link is invalid or has expired. Please request a new one.
                </p>
              </div>
            ) : success ? (
              <div className="one-column_field">
                <p>{message}</p>
              </div>
            ) : (
              <>
                <div className="one-column_field">
                  <div className="reg_field-cont">
                    <label htmlFor="password">New Password</label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                  </div>
                </div>
                <div className="two-column_fields">
                  <div className="reg_field-cont">
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
                {error && (
                  <div className="one-column_field">
                    <p style={{ color: "red" }}>{error}</p>
                  </div>
                )}
                <div className="one-column_field center">
                  {loading ? (
                    <img src={Loading} width="200px" style={{ margin: "auto" }} alt="Loading" />
                  ) : (
                    <button onClick={handleSubmit}>Reset Password</button>
                  )}
                </div>
              </>
            )}
            <div className="one-column_field text-center">
              <p>
                {success ? (
                  <button type="button" onClick={() => navigate("/login")}>
                    Go to Login
                  </button>
                ) : (
                  <>
                    Remembered your password? <Link to="/login">Sign In</Link>.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
