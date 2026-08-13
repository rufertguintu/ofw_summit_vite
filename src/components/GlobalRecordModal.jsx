import React from "react";

function formatLabel(key) {
  return String(key)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatValue(value) {
  if (value === null || value === undefined || value === "") {
    return "N/A";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return String(value);
}

function normalizeRecordData(recordData) {
  const payload = recordData?.data ?? recordData ?? {};

  if (payload.summary || payload.record) {
    return {
      summary: payload.summary || payload.record || {},
      record: payload.record || payload.summary || {},
    };
  }

  return {
    summary: payload,
    record: payload,
  };
}

function GlobalRecordModal({ isOpen, onClose, recordData, loading, title = "Global Record" }) {
  if (!isOpen) return null;

  const { summary, record } = normalizeRecordData(recordData);
  const detailEntries = Object.entries(record);
  const recordError = record?.error;

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(event) => event.stopPropagation()}>
        <div style={headerRow}>
          <div>
            <h3 style={{ margin: 0 }}>{title}</h3>
            {summary.display_name ? (
              <p style={subheading}>
                {summary.display_name}
                {summary.user_email ? ` • ${summary.user_email}` : ""}
              </p>
            ) : null}
          </div>
          <button type="button" onClick={onClose} style={closeButton}>
            Close
          </button>
        </div>

        {loading ? (
          <div style={loadingState}>Loading record details...</div>
        ) : recordData ? (
          <div style={contentWrapper}>
            {recordError ? <div style={errorState}>{formatValue(recordError)}</div> : null}

            <div style={summaryGrid}>
              <div style={summaryCard}>
                <div style={label}>ID</div>
                <div style={value}>{formatValue(summary.id)}</div>
              </div>
              <div style={summaryCard}>
                <div style={label}>Status</div>
                <div style={value}>{formatValue(summary.status)}</div>
              </div>
              <div style={summaryCard}>
                <div style={label}>Registrant Type</div>
                <div style={value}>{formatValue(summary.registrant_type)}</div>
              </div>
              <div style={summaryCard}>
                <div style={label}>OFW Type</div>
                <div style={value}>{formatValue(summary.ofw_type)}</div>
              </div>
            </div>

            {detailEntries.length > 0 ? (
              <div style={detailTableWrapper}>
                <table style={detailTable}>
                  <tbody>
                    {detailEntries.map(([key, value]) => (
                      <tr key={key}>
                        <th style={detailLabel}>{formatLabel(key)}</th>
                        <td style={detailValue}>{formatValue(value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={loadingState}>No record details available.</div>
            )}
          </div>
        ) : (
          <div style={loadingState}>No record found.</div>
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
  alignItems: "flex-start",
  gap: "12px",
  marginBottom: "20px",
};

const subheading = {
  margin: "8px 0 0",
  color: "#6b7280",
};

const closeButton = {
  border: "none",
  background: "#2563eb",
  color: "#fff",
  padding: "8px 14px",
  borderRadius: "8px",
  cursor: "pointer",
};

const loadingState = {
  padding: "24px",
  textAlign: "center",
  color: "#374151",
};

const errorState = {
  padding: "12px 14px",
  borderRadius: "10px",
  background: "#fef2f2",
  border: "1px solid #fecaca",
  color: "#b91c1c",
};

const contentWrapper = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const summaryGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "12px",
};

const summaryCard = {
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  padding: "14px",
};

const label = {
  fontSize: "12px",
  fontWeight: 700,
  color: "#6b7280",
  marginBottom: "6px",
  textTransform: "uppercase",
};

const value = {
  color: "#111827",
  wordBreak: "break-word",
};

const detailTableWrapper = {
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  overflow: "hidden",
};

const detailTable = {
  width: "100%",
  borderCollapse: "collapse",
};

const detailLabel = {
  width: "260px",
  padding: "12px 14px",
  background: "#f9fafb",
  borderBottom: "1px solid #e5e7eb",
  color: "#374151",
  textAlign: "left",
  verticalAlign: "top",
};

const detailValue = {
  padding: "12px 14px",
  borderBottom: "1px solid #e5e7eb",
  color: "#111827",
  wordBreak: "break-word",
};

export default GlobalRecordModal;
