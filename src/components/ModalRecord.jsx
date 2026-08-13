import React from "react";

function ModalRecord({ isOpen, onClose, userdata, Modalloading }) {
  if (!isOpen) return null;

  const meta = userdata?.meta || {};
  const profileItems = [
    { label: "User ID", value: meta.custom_id || userdata?.id || "N/A" },
    { label: "Type of Registrant", value: meta.ofw_type === 0 ? "OFW" : "Relative of OFW" },
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

  const documentItems = [
    { key: "passport", label: "Passport", value: userdata?.passport, alt: "passport" },
    { key: "married_cert", label: "Married Certificate", value: userdata?.married_cert, alt: "married certificate" },
    { key: "ofw_birthcert", label: "OFW Birth Certificate", value: userdata?.ofw_birthcert, alt: "OFW birth certificate" },
    { key: "valid_id", label: "Valid ID", value: userdata?.valid_id, alt: "valid ID" },
    { key: "seaman_book", label: "Seaman Book", value: userdata?.seaman_book, alt: "seaman book" },
    { key: "employment_contract", label: "Employment Contract", value: userdata?.employment_contract, alt: "employment contract" },
    { key: "birth_cert", label: "Birth Certificate", value: userdata?.birth_cert, alt: "birth certificate" },
    { key: "visa", label: "Working Visa", value: userdata?.visa, alt: "working visa" },
    { key: "owwa_poea", label: "OWWA / POEA", value: userdata?.owwa_poea, alt: "owwa poea" },
    { key: "remittance", label: "Remittance", value: userdata?.remittance, alt: "remittance" },
    { key: "allotment", label: "Allotment", value: userdata?.allotment, alt: "allotment" },
  ];

  const renderDocumentPreview = (url, alt) => {
    if (!url) {
      return <p style={{ margin: 0, color: "#6b7280" }}>No file uploaded</p>;
    }

    const normalizedUrl = String(url).toLowerCase();
    const isPdf = normalizedUrl.endsWith(".pdf");

    return isPdf ? (
      <embed src={url} type="application/pdf" style={pdfPreviewStyle} />
    ) : (
      <img src={url} alt={alt} style={imagePreviewStyle} />
    );
  };

  return (
    <div style={overlay} className="z-999" onClick={onClose}>
      <div className="modalbody" style={modal} onClick={(e) => e.stopPropagation()}>
        <div style={headerRow}>
          <h3 style={{ margin: 0 }}>Information</h3>
          <button type="button" onClick={onClose} style={closeButton}>
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
                    {renderDocumentPreview(item.value, item.alt)}
                  </div>
                ))}
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

export default ModalRecord;
