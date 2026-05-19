
import HeaderLayout from "./HeaderLayout";
import { Outlet } from "react-router-dom";

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
