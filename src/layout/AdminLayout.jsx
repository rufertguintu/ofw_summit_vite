
import { Outlet, useNavigate, Link } from "react-router-dom";
import Logo from "../assets/2024-logo.svg";
import "../styles/admin/new-admin-style.scss";

export default function AdminLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="admin-wrapper text-[#000]">
      <div className="p-[24px] bg-[#000]">
        <div className="logo"><img src={Logo} alt="" className="w-50"/></div>
      </div>
      <main className="flex flex-row">
        <div className="w-1/6 admin-sidebar">
          <ul className="p-[20px]">
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
        <div className="w-5/6 main-admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
