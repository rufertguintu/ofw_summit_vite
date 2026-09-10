import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import DashboardTitle from "../components/DashboardTitle";
import { API_BASE_URL } from "../store/api";

const EXPORT_OPTIONS = [
  {
    type: "all",
    label: "Export All User",
    description: "Download a CSV of every registered user and their metadata.",
  },
  {
    type: "ofw",
    label: "Export OFW User",
    description: "Download a CSV of users registered as OFW.",
  },
  {
    type: "relative",
    label: "Export Relative of OFW User",
    description: "Download a CSV of users registered as a Relative of OFW.",
  },
  {
    type: "mandalay",
    label: "Export All noemail@mandalay.com.ph",
    description: "Download a CSV of users whose email address is a mandalay.com.ph placeholder.",
  },
];

const ExportData = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [loadingType, setLoadingType] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "contributor") {
    return <Navigate to="/profile-dashboard" replace />;
  }

  const handleExport = async (type, label) => {
    setErrorMessage("");
    setLoadingType(type);

    try {
      const authToken = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/wp-json/custom/v1/export-users?type=${type}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Unable to export data. Please try again.");
      }

      const blob = await response.blob();
      const disposition = response.headers.get("Content-Disposition") || "";
      const filenameMatch = disposition.match(/filename="?([^"]+)"?/);
      const filename = filenameMatch ? filenameMatch[1] : `${type}-export.csv`;

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || `Failed to export "${label}".`);
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <div className="export-data-page">
      <DashboardTitle />

      {errorMessage && <p className="export-data-error">{errorMessage}</p>}

      <div className="export-data-options">
        {EXPORT_OPTIONS.map((option) => (
          <div className="export-data-card" key={option.type}>
            <h3>{option.label}</h3>
            <p>{option.description}</p>
            <button
              type="button"
              disabled={loadingType === option.type}
              onClick={() => handleExport(option.type, option.label)}
            >
              {loadingType === option.type ? "Exporting..." : "Export CSV"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExportData;
