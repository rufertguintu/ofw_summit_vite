const SECTIONS = [
  {
    title: "Attendance",
    fields: [
      { key: "attend", label: "Will attend the summit" },
      { key: "attend_type", label: "Attendance type" },
    ],
  },
  {
    title: "Personal Information",
    fields: [
      { key: "address", label: "Address" },
      { key: "current_location", label: "Current location" },
      { key: "region", label: "Region" },
      { key: "province", label: "Province" },
      { key: "city", label: "City" },
      { key: "barangay", label: "Barangay" },
      { key: "zipcode", label: "Zip code" },
      { key: "civil_status", label: "Civil status" },
      { key: "gender", label: "Gender" },
      { key: "mobile", label: "Mobile number" },
      { key: "landline", label: "Landline number" },
      { key: "source", label: "Source of information" },
      { key: "source_info", label: "Source details" },
    ],
  },
  {
    title: "OFW Information",
    fields: [
      { key: "profession", label: "Profession" },
      { key: "passport_id", label: "Passport ID" },
      { key: "owwa_member", label: "OWWA member" },
      { key: "owwa_ofw_id", label: "OWWA OFW ID" },
      { key: "ofw_firstname", label: "OFW first name" },
      { key: "ofw_middlename", label: "OFW middle name" },
      { key: "ofw_lastname", label: "OFW last name" },
      { key: "ofw_status", label: "OFW status" },
      { key: "ofw_profession", label: "OFW profession" },
      { key: "ofw_emailaddress", label: "OFW email address" },
      { key: "work_country", label: "Country of work" },
      { key: "ofw_year_service", label: "Years of service" },
      { key: "ofw_income", label: "OFW income" },
      { key: "relationship", label: "Relationship" },
    ],
  },
];

const SUPPORTING_DOCS = [
  { key: "select_docs1", label: "Employment Contract" },
  { key: "select_docs2", label: "Working Visa" },
  { key: "select_docs3", label: "OWWA / POEA Registration" },
  { key: "select_docs4", label: "Remittance Slip" },
  { key: "select_docs5", label: "Allotment Certificate" },
  { key: "select_docs6", label: "Seaman's Book" },
];

const FILE_FIELDS = [
  { key: "file", label: "Passport attachment" },
  { key: "ofw_birthcert", label: "Birth certificate of OFW" },
  { key: "birth_cert", label: "Birth certificate" },
  { key: "married_cert", label: "Marriage certificate" },
  { key: "valid_id", label: "Valid ID" },
  { key: "seaman_book", label: "Seaman's book" },
  { key: "employment_contract", label: "Employment contract" },
  { key: "visa", label: "Working visa" },
  { key: "owwa_poea", label: "OWWA / POEA registration" },
  { key: "remittance", label: "Remittance slip" },
  { key: "allotment", label: "Allotment certificate" },
];

const isEmptyValue = (value) =>
  value === null ||
  value === undefined ||
  (typeof value === "string" && value.trim() === "") ||
  (Array.isArray(value) && value.length === 0);

const formatText = (value) => {
  if (isEmptyValue(value)) {
    return "Not provided";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (typeof value === "number") {
    return String(value);
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value).trim();
};

const getFileLabel = (value) => {
  const text = formatText(value);

  if (text === "Not provided") {
    return text;
  }

  if (/^https?:\/\//i.test(text)) {
    return text.split("/").pop() || "Uploaded file";
  }

  return text;
};

const isTruthyField = (value) => {
  const text = String(value ?? "").trim().toLowerCase();
  return text === "1" || text === "true" || text === "yes" || text === "on";
};

function FieldCard({ label, value, variant = "text" }) {
  const content = variant === "file" ? getFileLabel(value) : formatText(value);
  const isUrl = typeof value === "string" && /^https?:\/\//i.test(value.trim());

  return (
    <div style={styles.card}>
      <div style={styles.label}>{label}</div>
      <div style={styles.value}>
        {variant === "checkbox" ? (
          <span style={isTruthyField(value) ? styles.badgeYes : styles.badgeNo}>
            {isTruthyField(value) ? "Yes" : "No"}
          </span>
        ) : isUrl ? (
          <a href={value} target="_blank" rel="noreferrer" style={styles.link}>
            View file
          </a>
        ) : (
          content
        )}
      </div>
    </div>
  );
}

export default function ReviewInfo({ values = {}, onEdit }) {
  const hasAnyValue = Object.values(values).some((value) => !isEmptyValue(value));

  return (
    <div style={styles.shell}>
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <div>
            <h2 style={styles.title}>Review Information</h2>
            <p style={styles.subtitle}>
              Please review the submitted details below. You can go back and edit if needed.
            </p>
          </div>
          <button type="button" style={styles.editButton} onClick={onEdit}>
            Edit Profile
          </button>
        </div>
      </div>

      {hasAnyValue ? (
        <>
          {SECTIONS.map((section) => (
            <section key={section.title} style={styles.section}>
              <h3 style={styles.sectionTitle}>{section.title}</h3>
              <div style={styles.grid}>
                {section.fields.map((field) => (
                  <FieldCard
                    key={field.key}
                    label={field.label}
                    value={values[field.key]}
                  />
                ))}
              </div>
            </section>
          ))}

          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Uploaded Documents</h3>
            <div style={styles.grid}>
              {FILE_FIELDS.map((field) => (
                <FieldCard
                  key={field.key}
                  label={field.label}
                  value={values[field.key]}
                  variant="file"
                />
              ))}
            </div>
          </section>

          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Supporting Documents</h3>
            <div style={styles.grid}>
              {SUPPORTING_DOCS.map((field) => (
                <FieldCard
                  key={field.key}
                  label={field.label}
                  value={values[field.key]}
                  variant="checkbox"
                />
              ))}
            </div>
          </section>
        </>
      ) : (
        <div style={styles.emptyState}>No submitted information found.</div>
      )}
    </div>
  );
}

const styles = {
  shell: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
  },
  header: {
    marginBottom: "24px",
  },
  headerTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    flexWrap: "wrap",
  },
  title: {
    margin: 0,
    fontSize: "28px",
    fontWeight: 700,
    color: "#111827",
  },
  subtitle: {
    margin: "8px 0 0",
    color: "#6b7280",
    lineHeight: 1.5,
  },
  section: {
    marginTop: "24px",
  },
  sectionTitle: {
    margin: "0 0 12px",
    fontSize: "18px",
    fontWeight: 700,
    color: "#1f2937",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "12px",
  },
  card: {
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "14px 16px",
    background: "#f9fafb",
    minHeight: "84px",
  },
  label: {
    fontSize: "12px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    color: "#6b7280",
    marginBottom: "8px",
  },
  value: {
    fontSize: "15px",
    fontWeight: 600,
    color: "#111827",
    wordBreak: "break-word",
    lineHeight: 1.5,
  },
  badgeYes: {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 10px",
    borderRadius: "999px",
    background: "#dcfce7",
    color: "#166534",
    fontSize: "13px",
    fontWeight: 700,
  },
  badgeNo: {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 10px",
    borderRadius: "999px",
    background: "#fee2e2",
    color: "#991b1b",
    fontSize: "13px",
    fontWeight: 700,
  },
  link: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: 700,
  },
  editButton: {
    border: "none",
    borderRadius: "999px",
    background: "#f59e0b",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: 700,
    padding: "12px 18px",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  emptyState: {
    padding: "20px",
    borderRadius: "12px",
    background: "#f9fafb",
    color: "#6b7280",
    textAlign: "center",
  },
};
