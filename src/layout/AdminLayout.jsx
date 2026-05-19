
import { Outlet, useNavigate, Link } from "react-router-dom";
import Logo from "../assets/2024-logo.svg";


export default function AdminLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="admin-wrapper">
      <div className="heading">
        <div className="logo"><img src={Logo} alt="" /></div>
      </div>
      <main>
        <div className="admin-sidebar">
          <ul>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/Records">Records</Link></li>
            <li><a href="">Global Records</a></li>
            <li><a href="">2024 Records</a></li>
            <li><a href="">2023 Records</a></li>
            <li><a href="">2022 Records</a></li>
            <li><button onClick={logout}>
                  <em className="fa fa-sign-out"></em>
                    <span className="item-text">Logout</span>
                </button>
            </li>
          </ul>
        </div>
        <div className="main-admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
