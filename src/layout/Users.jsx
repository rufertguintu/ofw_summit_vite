
import HeaderLayout from "./HeaderLayout";
import { Outlet } from "react-router-dom";
// import "../styles/css/reset.custom.min.css";
import "../styles/css/mobile-nav-style.css";
import "../styles/css/home-style.css";
import "../styles/css/bootstrap.min.css";
import "../styles/css/main.css";

export default function UserLayout() {
  return (
    <>
    
      <HeaderLayout />

      <main>
        <div className="userlayout">
          <Outlet />
        </div>
        
      </main>
    </>
  );
}
