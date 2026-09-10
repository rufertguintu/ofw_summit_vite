import React, { useEffect, useMemo, useState } from "react";
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

// Document path resolution helpers — mirrors the logic used in ProfileDashboard.jsx
// so document previews resolve to the same file URL structure.
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

function ModalRecord({ isOpen, onClose, userdata, Modalloading, setUsers }) {
  const meta = userdata?.meta || {};

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

  const profileItems = [
    { label: "User ID", value: meta.custom_id || userdata?.id || "N/A" },
    { label: "Admin Verified", value: userdata?.admin_verified == 2 ? "Complete Verified" : userdata?.admin_verified == 1 ? "Reject" : userdata?.admin_verified == 3 ? "Return" : "Incomplete" },
    { label: "Attendance", value: userdata?.attendance == 0 ? "Yes" : userdata?.attendance == 1 ? "No" : "N/A" },
    { label: "Type of Attendance", value: userdata?.attend_type ?? meta.attend_type ?? "N/A" },
    { label: "Type of Registrant", value: meta.type_registrant == 0 ? "Online Registrant" : "Onsite Registrant" },
    { label: "Type of OFW", value: meta.ofw_type === 0 ? "OFW" : "Relative of OFW" },
    { label: "Full Name", value: userdata?.name || "N/A" },
    { label: "Email Address", value: userdata?.email || "N/A" },
    { label: "Date of Birth", value: meta.date_birth || "N/A" },
    { label: "Home Town", value: meta.hometown || "N/A" },
    { label: "Current Location", value: meta.current_location || "N/A" },
    { label: "Address", value: meta.address || "N/A" },
    { label: "Region", value: meta.region || "N/A" },
    { label: "Province", value: meta.province || "N/A" },
    { label: "City", value: meta.city || "N/A" },
    { label: "Barangay", value: meta.barangay || "N/A" },
    { label: "Zip Code", value: meta.zip_code || "N/A" },
    { label: "Civil Status", value: meta.civil_status || "N/A" },
    { label: "Gender", value: meta.gender || "N/A" },
    { label: "Mobile Number", value: meta.mobile || "N/A" },
    { label: "Landline Number", value: meta.landline || "N/A" },
    { label: "Source", value: meta.source || "N/A" },
    { label: "Passport ID", value: meta.passport_id || "N/A" },
    { label: "Profession", value: meta.profession || "N/A" },
    { label: "Relationship to OFW", value: meta.relationship || "N/A" },
    { label: "OWWA Member", value: meta.owwa_member || "N/A" },
    { label: "OWWA ID", value: meta.owwa_ofw_id || "N/A" },
    { label: "OFW First Name", value: meta.ofw_firstname || "N/A" },
    { label: "OFW Last Name", value: meta.ofw_lastname || "N/A" },
    { label: "OFW Middle Name", value: meta.ofw_middlename || "N/A" },
    { label: "OFW Status", value: meta.ofw_status || "N/A" },
    { label: "OFW Profession", value: meta.ofw_profession || "N/A" },
    { label: "OFW Email Address", value: meta.ofw_email || "N/A" },
    { label: "OFW Income", value: meta.ofw_income || "N/A" },
    { label: "Years of Service", value: meta.ofw_year_service || "N/A" },
    { label: "Work Country", value: meta.work_country || "N/A" },

  ];

  // Retrieved accounts only ever store the bare filename in meta and rely on
  // doc_display_name + wordpressBaseUrl to rebuild the file URL — mirrors the
  // resolvePreviewSrc logic used in ReviewInfo.jsx instead of the fuller
  // path-resolution fallback chain used for regular uploads.
  const isRetrievedAccount = Boolean(String(meta?.doc_display_name || "").trim());

  const resolveRetrievedAccountDocumentUrl = (metaKey) => {
    const rawValue = String(meta?.[metaKey] || "").trim();
    if (!rawValue || rawValue === "[object File]") {
      return "";
    }

    if (/^https?:\/\//i.test(rawValue)) {
      return rawValue;
    }

    const displayName = String(meta?.doc_display_name || "").trim();
    const wordpressBaseUrl = getWordPressBaseUrl(userdata);
    const filename = rawValue.replace(/\\/g, "/").split("/").filter(Boolean).pop() || "";

    if (!filename || !displayName || !wordpressBaseUrl) {
      return "";
    }

    return `${wordpressBaseUrl}/wp-content/uploads/register-records/${encodeURIComponent(displayName)}/${encodeURIComponent(filename)}`;
  };

  // Resolves a document meta key to its file URL using the same path
  // structure/resolution rules as ProfileDashboard.jsx.
  const resolveDocumentUrl = (metaKey) => {
    const fileName = String(meta?.[metaKey] || "").trim();

    if (!fileName || fileName === "[object File]") {
      return "";
    }

    const wordpressBaseUrl = getWordPressBaseUrl(userdata);

    const displayName = String(
      meta?.doc_display_name ||
      userdata?.display_name ||
      userdata?.name ||
      ""
    ).trim();

    if (!wordpressBaseUrl || !displayName) {
      return "";
    }

    return `${wordpressBaseUrl}/wp-content/uploads/register-records/${encodeURIComponent(
      displayName
    )}/${encodeURIComponent(fileName)}`;
  };

  let documentItems = [];

  if (meta.type_registrant === "0") {
    documentItems = [
      { key: "passport", label: "Passport", value: meta?.passport, alt: "passport" },
      { key: "married_cert", label: "Married Certificate", value: meta?.married_cert, alt: "married certificate" },
      { key: "ofw_birthcert", label: "OFW Birth Certificate", value: meta?.ofw_birthcert, alt: "OFW birth certificate" },
      { key: "valid_id", label: "Valid ID", value: meta?.valid_id, alt: "valid ID" },
      { key: "seaman_book", label: "Seaman Book", value: meta?.seaman_book, alt: "seaman book" },
      { key: "employment_contract", label: "Employment Contract", value: meta?.employment_contract, alt: "employment contract" },
      { key: "birth_cert", label: "Birth Certificate", value: meta?.birth_cert, alt: "birth certificate" },
      { key: "visa", label: "Working Visa", value: meta?.visa, alt: "working visa" },
      { key: "owwa_poea", label: "OWWA / POEA", value: meta?.owwa_poea, alt: "owwa poea" },
      { key: "remittance", label: "Remittance", value: meta?.remittance, alt: "remittance" },
      { key: "allotment", label: "Allotment", value: meta?.allotment, alt: "allotment" },
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
  
  
  const renderDocumentPreview = (metaKey, label) => {
    const fileUrl = resolveDocumentUrl(metaKey);
    if (!fileUrl) {
      return null;
    }

    const isImage = /\.(png|jpe?g|gif|webp|bmp|svg)(\?.*)?$/i.test(fileUrl);

    return (
      <div style={{ marginTop: "8px" }}>
        <a href={fileUrl} target="_blank" rel="noreferrer">
          View uploaded {label}
        </a>
        {isImage ? (
          <div style={{ marginTop: "8px" }}>
            <img
              src={fileUrl}
              alt={`${label} preview`}
              style={{ width: "100%", maxWidth: "220px", borderRadius: "6px", border: "1px solid #e5e7eb" }}
            />
          </div>
        ) : null}
      </div>
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

      if (typeof setUsers === "function") {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userdata.id
              ? {
                  ...user,
                  admin_verified: normalizedAdminVerified,
                  reason_incomplete: normalizedReasonIncomplete,
                  attendance: normalizedAttendance,
                  companion: normalizedCompanion,
                }
              : user
          )
        );
      }

      setSubmitSuccess("Record updated successfully.");
    } catch (error) {
      console.error(error);
      setSubmitError(error.message || "Unable to update record.");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={overlay} className="z-999" onClick={onClose}>
      <div className="modalbody" style={modal} onClick={(e) => e.stopPropagation()}>
        <div style={headerRow}>
          <h3 style={{ margin: 0 }}>Information</h3>
          <button type="button" onClick={onClose} style={closeButton} disabled={submitLoading}>
            Close
          </button>
        </div>

        {Modalloading ? (
          <div style={loadingState}>Please wait...</div>
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
                    {renderDocumentPreview(item.value, item.alt)} 
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
                <button type="button" onClick={onClose} style={secondaryButton} disabled={submitLoading}>
                  Cancel
                </button>
                <button type="button" onClick={handleSubmit} style={primaryButton} disabled={submitLoading}>
                  {submitLoading ? (
                    <span style={buttonContent}>
                      <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
                        <circle cx="12" cy="12" r="10" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="4" />
                        <path
                          d="M22 12a10 10 0 0 1-10 10"
                          fill="none"
                          stroke="#fff"
                          strokeWidth="4"
                          strokeLinecap="round"
                        >
                          <animateTransform
                            attributeName="transform"
                            attributeType="XML"
                            type="rotate"
                            from="0 12 12"
                            to="360 12 12"
                            dur="0.8s"
                            repeatCount="indefinite"
                          />
                        </path>
                      </svg>
                      Updating...
                    </span>
                  ) : (
                    "Update"
                  )}
                </button>
              </div>
            </section>
          </div>
        ) : (
          <p style={{ margin: "16px 0 0" }}>No Data</p>
        )}
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(15, 23, 42, 0.65)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
  zIndex: 9999,
};

const modal = {
  background: "#fff",
  borderRadius: "16px",
  width: "100%",
  maxWidth: "1100px",
  maxHeight: "90vh",
  overflowY: "auto",
  padding: "24px",
  boxShadow: "0 20px 45px rgba(0, 0, 0, 0.2)",
};

const headerRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
  marginBottom: "20px",
};

const closeButton = {
  border: "none",
  background: "#2563eb",
  color: "#fff",
  padding: "8px 14px",
  borderRadius: "8px",
  cursor: "pointer",
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

const documentLink = {
  color: "#2563eb",
  fontWeight: 600,
  cursor: "pointer",
  textDecoration: "underline",
};

const previewFrame = {
  width: "100%",
  height: "100%",
  border: "none",
  objectFit: "contain",
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

const buttonContent = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
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

export default ModalRecord;
