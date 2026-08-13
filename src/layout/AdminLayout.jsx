
import { useEffect } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import Logo from "../assets/2024-logo.svg";
import adminStylesUrl from "../styles/admin/new-admin-style.scss?url";

const CONTRIBUTOR_ADMIN_STYLE_ID = "contributor-admin-style";

export default function AdminLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("role") !== "contributor") {
      document.getElementById(CONTRIBUTOR_ADMIN_STYLE_ID)?.remove();
      return undefined;
    }

    let styleLink = document.getElementById(CONTRIBUTOR_ADMIN_STYLE_ID);
    let createdStyleLink = false;

    if (!styleLink) {
      styleLink = document.createElement("link");
      styleLink.id = CONTRIBUTOR_ADMIN_STYLE_ID;
      styleLink.rel = "stylesheet";
      styleLink.href = adminStylesUrl;
      document.head.appendChild(styleLink);
      createdStyleLink = true;
    }

    return () => {
      if (createdStyleLink) {
        styleLink?.remove();
      }
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    document.getElementById(CONTRIBUTOR_ADMIN_STYLE_ID)?.remove();
    navigate("/login");
  };

  return (
    <div className="admin-wrapper text-[#000]">
      <div className="p-[24px] bg-[darkgray]">
        <div className="logo"><img src={Logo} alt="" className="w-xs"/></div>
      </div>
      <main className="flex flex-row">
        <div className="w-1/6 admin-sidebar">
          <ul className="p-[20px]">
            <li><Link to="/dashboard" className="no-underline">Dashboard</Link></li>
            <li><Link to="/records" className="no-underline">Records</Link></li>
            <li><Link to="/global-records" className="no-underline">Global Records</Link></li>
            <li><Link to="/2024-records" className="no-underline">2024 Records</Link></li>
            <li><a href="" className="no-underline">2023 Records</a></li>
            <li><a href="" className="no-underline">2022 Records</a></li>
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
