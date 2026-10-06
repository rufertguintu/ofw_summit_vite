
import { useEffect, useState } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import Logo from "../assets/ofwsummit-2026-logo.svg";
import LogoutIcon from "../assets/feather/log-out.svg";
import adminStylesUrl from "../styles/admin/new-admin-style.scss?url";

const CONTRIBUTOR_ADMIN_STYLE_ID = "contributor-admin-style";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isContributor = localStorage.getItem("role") === "contributor";
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isContributor) {
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
      <div className="admin-header-layout">
        <div className="logo"><img src={Logo} alt="" className="w-[150px]"/></div>
        <button
          type="button"
          className="admin-hamburger"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className={`admin-menu-overlay${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen(false)}></div>
        <div className={`admin-menu${menuOpen ? " open" : ""}`}>
        <div className="admin-navigation">
          <ul>
            <li className={location.pathname === "/dashboard" ? "active" : ""}><Link to="/dashboard">Dashboard</Link></li>
            <li className={location.pathname === "/records" ? "active" : ""}><Link to="/records">Records</Link></li>
            <li className={location.pathname === "/global-records" ? "active" : ""}><Link to="/global-records">Global Records</Link></li>
            <li className={location.pathname === "/options-page" ? "active" : ""}><Link to="/options-page">Options Page</Link></li>
          </ul>
        </div>

        <div className="admin-logout">
          <ul>
            <li><Link to="/export-data">Export Data</Link></li>
            <li>
                <button onClick={logout}>
                  <em className="fa fa-sign-out"></em>
                    <span className="item-text"><img src={LogoutIcon} alt="Logout" /></span>
                </button>
            </li>
          </ul>
        </div>
        </div>
      </div>

      {/* <div className="p-[24px] bg-[#35394b]">
        <div className="logo"><img src={Logo} alt="" className="w-[150px]"/></div>
      </div> */}
      <main className="flex flex-row">
        {/* <div className="w-1/6 admin-sidebar">
          <ul className="p-[20px]">
            <li><Link to="/dashboard" className="no-underline">Dashboard</Link></li>
            <li><Link to="/records" className="no-underline">Records</Link></li>
            <li><Link to="/global-records" className="no-underline">Global Records</Link></li>
            {isContributor && (
              <li><Link to="/export-data" className="no-underline">Export of Data</Link></li>
            )}
            <li><Link to="/options-page" className="no-underline">Options Page</Link></li>
            <li><button onClick={logout}>
                  <em className="fa fa-sign-out"></em>
                    <span className="item-text">Logout</span>
                </button>
            </li>
          </ul>
        </div> */}
        <div className="w-5/6 main-admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
