import { useEffect, useState } from "react";
import { fetchApi } from "../store/api";

const PSGC_API = "https://psgc.gitlab.io/api";

const textFields = [
  ["firstname", "First Name (Pangalan)"],
  ["middlename", "Middle Name"],
  ["lastname", "Last Name (Apelyido)"],
  ["date_birth", "Date of Birth (Format: MM/DD/YYYY)"],
  ["emailaddress", "Email Address", "email"],
  ["mobile", "Mobile Number"],
  ["address", "Address", "text"],
  ["owwa_ofw_id", "OWWA ID", "text"],
  ["ofw_type", "OFW Type (Value 0 for OFW and 1 for Relative)", "text"],
];

const OwwaRegistration = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");


  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setIsSubmitting(true);
    setMessage("");

    try {
      const formData = new FormData(form);
      formData.set("type_registrant", "4");
      formData.set("registrant_type", "OWWA");
      formData.set("attend_type", formData.get("attend_type") || "Onsite");

      const response = await fetchApi("/wp-json/custom/v1/submit-form-networker", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Unable to submit owwa registration.");
      }

      form.reset();
      setMessage(data?.message || "OWWA registration submitted successfully.");
    } catch (error) {
      setMessage(error.message || "Unable to submit owwa registration.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTextField = ([name, label, type = "text"]) => (
    <div className="reg_field-cont" key={name}>
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} />
    </div>
  );

  const renderSelect = (name, label, onChange) => (
    <div className="reg_field-cont" key={name}>
      <label htmlFor={name}>{label}</label>
      <select id={name} name={name} defaultValue="" onChange={onChange}>
        <option value="">- Select -</option>
        {selectOptions[name].map((option) => {
          const [value, text] = Array.isArray(option) ? option : [option, option];
          return <option value={value} key={value}>{text}</option>;
        })}
      </select>
    </div>
  );

  return (
    <div className="registration-page join-now-page onsite-registration-page">
      <div className="onsite-registration-container">
        <div className="onsite-registration-heading">
          <h2>OWWA Registration</h2>
          <p>Please complete any information available. All fields are optional.</p>
        </div>

        <form className="reg_fields onsite-registration-form" onSubmit={handleSubmit}>
          <section>
            <h3>Registrant Information</h3>
            <div className="onsite-registration-grid">{textFields.map(renderTextField)}</div>
          </section>


          <div className="onsite-registration-actions">
            <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Submit OWWA Registration"}</button>
          </div>
          {message && <p className="onsite-registration-message" role="status">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default OwwaRegistration;
