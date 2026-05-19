// import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Users from "./layout/Users";
import AdminLayout from "./layout/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Records from "./pages/Records";
// import { Button } from "@/components/ui/button"
import './App.css'

function App() {
  const role = localStorage.getItem("role");
  return (
    <Router>
      <Routes>

        {/* ✅ PUBLIC PAGES */}
          <Route element={<Users />}>
            <Route path="/" element={<Home />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/login" element={<Login />} />
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
