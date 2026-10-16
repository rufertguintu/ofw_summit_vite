
import { Navigate, Outlet } from "react-router-dom";

/** @param {{ children?: import("react").ReactNode, allowedRoles?: string[] }} props */
export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles) {
    const role = localStorage.getItem("role")?.toLowerCase();

    if (!role || !allowedRoles.includes(role)) {
      return <Navigate to="/profile-dashboard" replace />;
    }
  }

  return children ?? <Outlet />;
}
