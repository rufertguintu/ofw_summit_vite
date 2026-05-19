
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

import Logo from "../assets/2025-assets/section1-logo.png";
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
      return <Navigate to="/" />;
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
        navigate("/");
      }

    } catch (error) {
      console.error(error);
      alert("Server error ❌");
    }

    setLoading(false);
  };



  return (


    <div className="login-section">
      <div className="login-banner">
        <img src={Logo} alt="" />
      </div>
      <div className="custom-container">
        <div className="login-wrapper">
          <h2>Login</h2>
          <div className="reg_fields">
            <div className="one-column_field mb-30">
              <div className="reg_field-cont">
                <label htmlFor="username">Email Address</label>
                <input type="email" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter Email Address" />
              </div>
            </div>
            <div className="two-column_fields">
              <div className="reg_field-cont">
                <label htmlFor="password">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password" />
              </div>
            </div>
            <div className="two-column_fields">
              <div className="reg_field-cont"><a href="" target="_blank">Nakalimutan ang password?</a></div>
            </div>
            <div className="one-column_field">
              <div id="message"></div>
            </div>
            <div className="one-column_field center">{loading ? <img src={Loading} width="200px" style={{ margin: "auto" }} /> : <button onClick={handleLogin}>Sign In</button>}</div>
            <div className="one-column_field text-center">
              <p>Wala pang account? <a href="" target="_blank">Gumawa</a>.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

export default Login;
