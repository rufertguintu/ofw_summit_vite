// import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Users from "./layout/Users";
import AdminLayout from "./layout/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Login from "./pages/Login";
import Online_Register from "./pages/Online_Register";
import Dashboard from "./pages/Dashboard";
import Records from "./pages/Records";
import ProfileDashboard from "./pages/ProfileDashboard";
// import { Button } from "@/components/ui/button"
import './App.css'

function App() {
  // const role = localStorage.getItem("role");
  return (
    <Router>
      <Routes>

        {/* ✅ PUBLIC PAGES */}
        <Route element={<Users />}>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/online-register" element={<Online_Register />} />
          <Route path="/profile-dashboard" element={<ProfileDashboard />} />
        </Route>


        {/* ✅ LOGIN (no layout or optional) */}


        {/* ✅ ADMIN PAGES */}
        <Route
          element={
            <ProtectedRoute >
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/records" element={<Records />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App
