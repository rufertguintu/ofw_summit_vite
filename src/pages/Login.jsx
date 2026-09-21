
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";

import logo from "../assets/ofw-summit-15th.svg";

import Loading from "../assets/loading-reg.gif";
import { fetchApi } from "../store/api";



function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user_role = localStorage.getItem("role");

  if (token) {
    if (user_role == "contributor") {
      return <Navigate to="/dashboard" />;
    } else {
      return <Navigate to="/profile-dashboard" />;
    }
  }



  const handleLogin = async () => {
    setLoading(true);

    try {
      // ✅ LOGIN REQUEST
      const loginRes = await fetchApi("/wp-json/jwt-auth/v1/token", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      const loginData = await loginRes.json();

      if (!loginData.token) {
        alert("Login failed ❌");
        setLoading(false);

        return;
      }

      // ✅ SAVE TOKEN
      localStorage.setItem("token", loginData.token);

      // ✅ FETCH USER INFO
      const userRes = await fetchApi("/wp-json/wp/v2/users/me");

      const user = await userRes.json();

      // ✅ SAVE USER + ROLE
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.roles[0]);


      // ✅ ROLE-BASED REDIRECT
      if (user_role == "contributor") {
        navigate("/dashboard");
      } else {
        navigate("/profile-dashboard");
      }

    } catch (error) {
      console.error(error);
      alert("Server error ❌");
    }

    setLoading(false);
  };



  return (
    <div className="registration-page join-now-page join-register">
      <div className="custom-container">
          <div className="registration-wrapper">
              <div className="registration-info">
                  <div className="join-event-instruction">
                      <img src={logo} alt=""/>

                      <h2>How to create an <span>Online Account</span></h2>
                      <ul>
                          <li><h5>1</h5>
                              <h4><strong>Pre-registration Checking</strong> — Verify user information and eligibility before registration.</h4>
                          </li>
                          <li>
                              <h5>2</h5>
                              <h4><strong>Complete your event registration</strong> while reviewing and updating your profile to keep your information accurate and up to date.</h4>
                          </li>
                          <li>
                              <h5>3</h5>
                              <h4><strong>Verify your account details and required documents</strong> to confirm your identity and ensure all information is accurate and valid.</h4>
                          </li>
                          <li>
                              <h5>4</h5>
                              <h4><strong>Join the fun, enjoy the event</strong>, and get a chance to win exciting prizes along the way!</h4>
                          </li>
                      </ul>
                  </div>
              </div>

              <div className="reg-form-section login-form">
                  <h2>Log in</h2>
                  <div className="reg_fields">
                    <div className="one-column_field">
                      <div className="reg_field-cont">
                        <label htmlFor="username">Email Address</label>
                        <input type="email" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter Email Address" />
                      </div>
                    </div>
                    <div className="one-column_field">
                      <div className="reg_field-cont">
                        <label htmlFor="password">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password" />
                      </div>
                    </div>
                    <div className="one-column_field">
                      <div className="reg_field-cont forgot-pw-cta">
                        <Link to="/forgot-password">Nakalimutan ang password?</Link>
                      </div>
                    </div>
                    <div className="one-column_field">
                      <div className="reg_field-cont logged-in-btn">
                        {loading ? <img src={Loading} width="200px" style={{ margin: "auto" }} /> : <button onClick={handleLogin}>Sign In</button>}
                      </div>
                    </div>
                    <div className="one-column_field">
                      <div className="reg_field-cont create-account-cta">
                        <p>Wala pang Account? <Link to="/register">Gumawa dito</Link></p>
                      </div>
                    </div>
                  </div>
              </div>
          </div>
          
      </div>
  </div>


  );
}

export default Login;
