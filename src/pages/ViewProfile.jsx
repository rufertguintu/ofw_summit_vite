import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchApi } from "../store/api";

const STATUS_OPTIONS = [
  { label: "Incomplete", value: "0" },
  { label: "Reject", value: "1" },
  { label: "Return", value: "3" },
  { label: "Complete Verified", value: "2" },
];

const REASON_OPTIONS = [
  { label: "No Documents Submitted", value: "No Documents Submitted" },
  { label: "Incomplete: Only passport submitted.", value: "Incomplete: Only passport submitted." },
];

const ATTENDANCE_OPTIONS = [
  { label: "Yes", value: "0" },
  { label: "No", value: "1" },
];

function ViewProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [userdata, setUserdata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [formData, setFormData] = useState({
    admin_verified: "",
    reason_incomplete: "",
    attendance: "",
    companion: "",
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  useEffect(() => {
    if (!id) {
      return;
    }

    setLoading(true);
    setLoadError("");
    setUserdata(null);

    fetchApi(`/wp-json/custom/v1/user/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load user profile.");
        }
        return res.json();
      })
      .then((data) => setUserdata(data))
      .catch((err) => {
        console.error(err);
        setLoadError(err.message || "Unable to load user profile.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!userdata) {
      return;
    }

    setFormData({
      admin_verified: String(userdata?.admin_verified ?? userdata?.meta?.admin_verified ?? userdata?.status ?? ""),
      reason_incomplete: userdata?.reason_incomplete ?? userdata?.meta?.reason_incomplete ?? "",
      attendance: String(userdata?.attendance ?? userdata?.meta?.attendance ?? ""),
      companion: String(userdata?.companion ?? userdata?.meta?.companion ?? ""),
    });
    setSubmitError("");
    setSubmitSuccess("");
  }, [userdata]);

  const meta = userdata?.meta || {};

  const profileItems = [
    { label: "User ID", value: meta.custom_id || userdata?.id || "N/A" },
    { label: "Type of Registrant", value: meta.type_registrant == 0 ? "Online Registrant" : "Onsite Registrant" },
    { label: "Type of OFW", value: meta.ofw_type === 0 ? "OFW" : "Relative of OFW" },
    { label: "Full Name", value: userdata?.name || "N/A" },
    { label: "Email Address", value: userdata?.email || "N/A" },
    { label: "Date of Birth", value: meta.date_birth || "N/A" },
    { label: "Home Town", value: meta.hometown || "N/A" },
    { label: "Address", value: meta.address || "N/A" },
    { label: "Civil Status", value: meta.civil_status || "N/A" },
    { label: "Gender", value: meta.gender || "N/A" },
    { label: "Mobile Number", value: meta.mobile || "N/A" },
    { label: "Landline Number", value: meta.landline || "N/A" },
  ];

  let documentItems = [];

  if (meta.type_registrant === "0") {
    documentItems = [
      { key: "passport", label: "Passport", value: meta.passport, alt: "passport" },
      { key: "married_cert", label: "Married Certificate", value: meta.married_cert, alt: "married certificate" },
      { key: "ofw_birthcert", label: "OFW Birth Certificate", value: meta.ofw_birthcert, alt: "OFW birth certificate" },
      { key: "valid_id", label: "Valid ID", value: meta.valid_id, alt: "valid ID" },
      { key: "seaman_book", label: "Seaman Book", value: meta.seaman_book, alt: "seaman book" },
      { key: "employment_contract", label: "Employment Contract", value: meta.employment_contract, alt: "employment contract" },
      { key: "birth_cert", label: "Birth Certificate", value: meta.birth_cert, alt: "birth certificate" },
      { key: "visa", label: "Working Visa", value: meta.visa, alt: "working visa" },
      { key: "owwa_poea", label: "OWWA / POEA", value: meta.owwa_poea, alt: "owwa poea" },
      { key: "remittance", label: "Remittance", value: meta.remittance, alt: "remittance" },
      { key: "allotment", label: "Allotment", value: meta.allotment, alt: "allotment" },
    ];
  } else if (meta.type_registrant === "2") {
    documentItems = [
      { key: "passport", label: "Passport", value: meta.passport_checked },
      { key: "married_cert", label: "Married Certificate", value: meta.married_cert_checked },
      { key: "ofw_birthcert", label: "OFW Birth Certificate", value: meta.ofw_birthcert_checked },
      { key: "valid_id", label: "Valid ID", value: meta.valid_id_checked },
      { key: "seaman_book", label: "Seaman Book", value: meta.seaman_book_checked },
      { key: "employment_contract", label: "Employment Contract", value: meta.employment_contract_checked },
      { key: "birth_cert", label: "Birth Certificate", value: meta.birth_cert_checked },
      { key: "visa", label: "Working Visa", value: meta.visa_checked },
      { key: "owwa_poea", label: "OWWA / POEA", value: meta.owwa_poea_checked },
      { key: "remittance", label: "Remittance", value: meta.remittance_checked },
      { key: "allotment", label: "Allotment", value: meta.allotment_checked },
    ];
  }

  const getWordPressBaseUrl = (user) => {
    const candidates = [user?.doc_base_url, user?.profile_image_base_url];

    for (const candidate of candidates) {
      const value = String(candidate || "").trim();
      if (!value) {
        continue;
      }

      const uploadsIndex = value.toLowerCase().indexOf("/wp-content/uploads");
      if (uploadsIndex > -1) {
        return value.slice(0, uploadsIndex).replace(/\/$/, "");
      }

      if (/^https?:\/\//i.test(value)) {
        return value.replace(/\/$/, "");
      }
    }

    return "";
  };


  const renderDocumentPreview = (value, alt) => {
    
      console.log(value);
    if (!value) {
      return (
        <p style={{ margin: 0, color: "#6b7280" }}>
          No file uploaded
        </p>
      );
    }

    const stringValue = String(value).trim();

    let previewUrl = stringValue;

    // If not already a URL, build the structured URL
    if (!/^https?:\/\//i.test(stringValue)) {
      const wordpressBaseUrl = getWordPressBaseUrl(userdata);

      const displayName = String(
        meta?.doc_display_name ||
        userdata?.display_name ||
        userdata?.name ||
        ""
      ).trim();

      const fileName = stringValue
        .replace(/\\/g, "/")
        .split("/")
        .filter(Boolean)
        .pop();
      previewUrl = `http://localhost:8005/wp-content/uploads/register-records/${encodeURIComponent(
        displayName
      )}/${encodeURIComponent(fileName)}`;
    }

    const normalizedUrl = previewUrl.toLowerCase();

    const isPdf = normalizedUrl.endsWith(".pdf");

    return isPdf ? (
      <embed
        src={previewUrl}
        type="application/pdf"
        style={imagePreviewStyle}
      />
    ) : (
      <img
        src={previewUrl}
        alt={`${alt} preview`}
        style={{ width: "100%", maxWidth: "220px", borderRadius: "6px", border: "1px solid #e5e7eb" }}
      />
    );
  };

  const showReasonIncomplete = formData.admin_verified === "0";

  const companionValue = useMemo(() => {
    if (formData.companion === "") {
      return "";
    }

    return formData.companion;
  }, [formData.companion]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSubmitSuccess("");
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "admin_verified" && value !== "0" ? { reason_incomplete: "" } : null),
    }));
  };

  const handleSubmit = async () => {
    if (!userdata?.id || submitLoading) {
      return;
    }

    setSubmitLoading(true);
    setSubmitError("");
    setSubmitSuccess("");

    const nextAdminVerified = formData.admin_verified === "" ? null : Number(formData.admin_verified);
    const nextAttendance = formData.attendance === "" ? null : Number(formData.attendance);
    const nextCompanion = formData.companion === "" ? null : Number(formData.companion);
    const nextReasonIncomplete = formData.admin_verified === "0" ? formData.reason_incomplete : "";

    try {
      const res = await fetchApi(`/wp-json/custom/v1/user/${userdata.id}/record-status`, {
        method: "POST",
        body: JSON.stringify({
          admin_verified: nextAdminVerified,
          reason_incomplete: nextReasonIncomplete,
          attendance: nextAttendance,
          companion: nextCompanion,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update record status.");
      }

      const payload = await res.json();
      const updatedFields = payload?.data || {};
      const normalizedAdminVerified = updatedFields.admin_verified === "" ? null : updatedFields.admin_verified ?? nextAdminVerified;
      const normalizedReasonIncomplete = updatedFields.reason_incomplete ?? nextReasonIncomplete;
      const normalizedAttendance = updatedFields.attendance === "" ? null : updatedFields.attendance ?? nextAttendance;
      const normalizedCompanion = updatedFields.companion === "" ? null : updatedFields.companion ?? nextCompanion;

      setFormData({
        admin_verified: String(normalizedAdminVerified ?? ""),
        reason_incomplete: normalizedReasonIncomplete,
        attendance: String(normalizedAttendance ?? ""),
        companion: String(normalizedCompanion ?? ""),
      });

      setUserdata((prev) =>
        prev
          ? {
              ...prev,
              admin_verified: normalizedAdminVerified,
              reason_incomplete: normalizedReasonIncomplete,
              attendance: normalizedAttendance,
              companion: normalizedCompanion,
            }
          : prev
      );

      setSubmitSuccess("Record updated successfully.");
    } catch (error) {
      console.error(error);
      setSubmitError(error.message || "Unable to update record.");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div style={pageWrapper}>
      <div style={headerRow}>
        <h1 style={{ margin: 0 }}>View Profile</h1>
        <div style={headerActions}>
          <Link to="/records" style={secondaryButton}>
            Back to Records
          </Link>
        </div>
      </div>

      {loading ? (
        <div style={loadingState}>Please wait...</div>
      ) : loadError ? (
        <div style={errorBanner}>{loadError}</div>
      ) : userdata ? (
        <div style={contentWrapper}>
          <section style={sectionCard}>
            <h4 style={sectionTitle}>Profile Details</h4>
            <div style={infoGrid}>
              {profileItems.map((item) => (
                <div key={item.label} style={infoItem}>
                  <div style={infoLabel}>{item.label}</div>
                  <div style={infoValue}>{item.value}</div>
                </div>
              ))}
            </div>
          </section>

          <section style={sectionCard}>
            <h4 style={sectionTitle}>Documents</h4>
            <div style={documentGrid}>
              {documentItems.map((item) => (
                <div key={item.key} style={documentCard}>
                  <h5 style={documentTitle}>{item.label}</h5>
                  {meta.type_registrant === "0" ? renderDocumentPreview(item.value, item.alt) : item.value}
                </div>
              ))}
            </div>
          </section>

          <section style={sectionCard}>
            <h4 style={sectionTitle}>Update Status</h4>

            <div style={formGrid}>
              <div style={fieldCard}>
                <label style={fieldLabel} htmlFor="admin_verified">
                  Update Status
                </label>
                <select
                  id="admin_verified"
                  name="admin_verified"
                  value={formData.admin_verified}
                  onChange={handleChange}
                  style={fieldControl}
                >
                  <option value="">Select status</option>
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {showReasonIncomplete ? (
                <div style={fieldCard}>
                  <label style={fieldLabel} htmlFor="reason_incomplete">
                    Reason for Incomplete
                  </label>
                  <select
                    id="reason_incomplete"
                    name="reason_incomplete"
                    value={formData.reason_incomplete}
                    onChange={handleChange}
                    style={fieldControl}
                  >
                    <option value="">Select reason</option>
                    {REASON_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}

              <div style={fieldCard}>
                <label style={fieldLabel} htmlFor="attendance">
                  Attendance
                </label>
                <select
                  id="attendance"
                  name="attendance"
                  value={formData.attendance}
                  onChange={handleChange}
                  style={fieldControl}
                >
                  <option value="">Select attendance</option>
                  {ATTENDANCE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div style={fieldCard}>
                <label style={fieldLabel} htmlFor="companion">
                  Number of Companion
                </label>
                <input
                  id="companion"
                  type="number"
                  min="0"
                  step="1"
                  name="companion"
                  value={companionValue}
                  onChange={handleChange}
                  style={fieldControl}
                  placeholder="Enter number of companion"
                />
              </div>
            </div>

            {submitError ? <div style={errorBanner}>{submitError}</div> : null}
            {submitSuccess ? <div style={successBanner}>{submitSuccess}</div> : null}

            <div style={actionsRow}>
              <button type="button" onClick={() => navigate("/records")} style={secondaryButtonBtn} disabled={submitLoading}>
                Cancel
              </button>
              <button type="button" onClick={handleSubmit} style={primaryButton} disabled={submitLoading}>
                {submitLoading ? "Updating..." : "Update"}
              </button>
            </div>
          </section>
        </div>
      ) : (
        <p style={{ margin: "16px 0 0" }}>No Data</p>
      )}
    </div>
  );
}

const pageWrapper = {
  padding: "24px",
};

const headerRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
  marginBottom: "20px",
};

const headerActions = {
  display: "flex",
  gap: "10px",
};

const contentWrapper = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const sectionCard = {
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  padding: "16px",
  background: "#f9fafb",
};

const sectionTitle = {
  margin: "0 0 12px",
  color: "#111827",
};

const infoGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "12px",
};

const infoItem = {
  background: "#fff",
  borderRadius: "10px",
  padding: "10px 12px",
  border: "1px solid #e5e7eb",
};

const infoLabel = {
  fontSize: "12px",
  fontWeight: 700,
  color: "#6b7280",
  marginBottom: "4px",
  textTransform: "uppercase",
};

const infoValue = {
  color: "#111827",
  wordBreak: "break-word",
};

const documentGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "14px",
};

const documentCard = {
  background: "#fff",
  borderRadius: "10px",
  padding: "12px",
  border: "1px solid #e5e7eb",
};

const documentTitle = {
  margin: "0 0 8px",
  color: "#111827",
};

const pdfPreviewStyle = {
  width: "100%",
  minHeight: "220px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
};

const imagePreviewStyle = {
  width: "100%",
  maxHeight: "220px",
  objectFit: "contain",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
};

const loadingState = {
  padding: "24px",
  textAlign: "center",
  color: "#374151",
};

const formGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "14px",
};

const fieldCard = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: "10px",
  padding: "12px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const fieldLabel = {
  fontSize: "12px",
  fontWeight: 700,
  color: "#374151",
  textTransform: "uppercase",
};

const fieldControl = {
  width: "100%",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  padding: "10px 12px",
  fontSize: "14px",
  background: "#fff",
  color: "#111827",
};

const actionsRow = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
  marginTop: "16px",
  flexWrap: "wrap",
};

const secondaryButton = {
  border: "1px solid #d1d5db",
  background: "#fff",
  color: "#111827",
  padding: "10px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  textDecoration: "none",
  display: "inline-block",
};

const secondaryButtonBtn = {
  border: "1px solid #d1d5db",
  background: "#fff",
  color: "#111827",
  padding: "10px 16px",
  borderRadius: "8px",
  cursor: "pointer",
};

const primaryButton = {
  border: "none",
  background: "#2563eb",
  color: "#fff",
  padding: "10px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  minWidth: "120px",
};

const errorBanner = {
  marginTop: "12px",
  padding: "10px 12px",
  borderRadius: "8px",
  background: "#fef2f2",
  color: "#b91c1c",
  border: "1px solid #fecaca",
};

const successBanner = {
  marginTop: "12px",
  padding: "10px 12px",
  borderRadius: "8px",
  background: "#f0fdf4",
  color: "#166534",
  border: "1px solid #86efac",
};

export default ViewProfile;
