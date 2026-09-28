import React from "react";
import { useLocation } from "react-router-dom";


function DashboardTitle() {
    
    const location = useLocation();

    const titles = {
        "/": "Home",
        "/about-us": "About Us",
        "/login": "Login",
        "/dashboard": "Dashboard",
        "/records": "Records",
        "/global-records": "Global Records",
        "/2024-records": "2024 Records",
        "/export-data": "Export of Data",
    };

    const currentTitle = titles[location.pathname] || "Page";

    return <h2 className="text-2xl font-bold">{currentTitle}</h2>;

}

export default DashboardTitle;