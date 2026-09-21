import { useState } from "react";
import { Link } from "react-router-dom";

import blackLogo2026 from "../assets/ofw-summit-15th.svg";
import Loading from "../assets/loading-reg.gif";
import { fetchApi } from "../store/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isValid = /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async () => {
    setError("");
    setMessage("");

    if (!isValid) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetchApi("/wp-json/custom/v1/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.message || "Unable to process your request.");
        return;
      }

      setMessage(data?.message || "If an account exists for that email, a password reset link has been sent.");
      setSubmitted(true);
    } catch (err) {
      console.error("Error requesting password reset:", err);
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-section">
        <div className="custom-container">
          <div className="login-banner">
            <img src={blackLogo2026} alt="" />
          </div>
          <div className="login-wrapper">
            <h2>Forgot Password</h2>
            <div className="reg_fields">
              {submitted ? (
                <div className="one-column_field">
                  <p>{message}</p>
                </div>
              ) : (
                <>
                  <div className="one-column_field">
                    <div className="reg_field-cont">
                      <label htmlFor="email">Email Address</label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter Email Address"
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
                      <button onClick={handleSubmit} className="submit-button" disabled={!isValid}>
                        Send Reset Link
                      </button>
                    )}
                  </div>
                </>
              )}
              <div className="sign-in-btn one-column_field text-center">
                <p>
                  Remembered your password? <Link to="/login">Sign In</Link>.
                </p>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}

export default ForgotPassword;
