import { useEffect, useState } from "react";
import { fetchApi } from "../store/api";

const PSGC_API = "https://psgc.gitlab.io/api";

const textFields = [
  ["firstname", "First Name (Pangalan)"],
  ["middlename", "Middle Name"],
  ["lastname", "Last Name (Apelyido)"],
  ["date_birth", "Date of Birth (Araw ng kapanganakan)", "date"],
  ["emailaddress", "Email Address", "email"],
  ["mobile", "Mobile Number"],
  ["companion", "Companions", "number"],
  // ["profession", "Profession"],
  ["passport_id", "Passport ID (Numero ng Pasaporte)"],
];

const relativeOfwFields = [
  ["ofw_firstname", "OFW First Name (Pangalan ng OFW)"],
  ["ofw_middlename", "OFW Middle Name"],
  ["ofw_lastname", "OFW Last Name (Apelyido ng OFW)"],
  ["ofw_profession", "OFW Profession (Trabaho)"],
  ["ofw_emailaddress", "OFW Email Address", "email"],
];

const ofwFields = [
  ["work_country", "Work Country (Bansang Pinagtatrabahuhan)"],
  ["ofw_year_service", "Years of Service (Bilang ng Taon ng Serbisyo)", "number"],
];

const documentFields = [
  ["passport", "Passport"],
  ["birth_cert", "Birth Certificate (Personal)"],
  ["married_cert", "Marriage Certificate"],
  ["valid_id", "Valid ID"],
  ["seaman_book", "Seaman's Book"],
  ["employment_contract", "Employment Contract"],
  ["visa", "Working VISA"],
  ["owwa_poea", "OWWA / POEA Registration"],
  ["remittance", "Remittance Slip"],
  ["allotment", "Allotment Certificate"],
];

const selectOptions = {
  relative_company: ["Yes (Meron)", "No (Wala)"],
  company_relationship: ["Parent (Magulang)", "Sibling (Kapatid)", "Spouse (Asawa)", "Child (Anak)"],
  ofw_type: [["0", "OFW"], ["1", "Relative of OFW (Kamag-anak ng OFW)"]],
  relationship: ["Parent (Magulang)", "Sibling (Kapatid)", "Spouse (Asawa)", "Child (Anak)"],
  attend: [["yes", "Yes (Oo)"], ["no", "No (Hindi)"]],
  attend_type: ["Onsite", "Online"],
  civil_status: ["Single", "Married", "Widowed", "Separated"],
  gender: ["Male", "Female", "Prefer not to say"],
  source_info: ["Social Media", "Villar Foundation", "OWWA", "Family/Friend", "Other"],
  owwa_member: [["yes", "Yes (Oo)"], ["no", "No (Hindi)"]],
  ofw_status: ["Active OFW", "Returned OFW", "Former OFW"],
  ofw_income: ["1.00 - 25,000.00", "25,001.00 - 50,000.00", "50,000.01 - 100,000.00", "100,001.00 - 125,000.00", "125,001.00 - 150,000.00", "Above 150,000.00"],
};

const OnsiteRegistration = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [ofwType, setOfwType] = useState("");
  const [relativeCompany, setRelativeCompany] = useState("");
  const [owwaMember, setOwwaMember] = useState("");
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState("");
  const isRelativeOfw = ofwType === "1";
  const hasCompanyRelative = relativeCompany === "Yes (Meron)";
  const isOwwaMember = owwaMember === "yes";

  const fetchLocations = async (path) => {
    const response = await fetch(`${PSGC_API}${path}`);
    if (!response.ok) throw new Error("Unable to load address locations.");
    return response.json();
  };

  useEffect(() => {
    fetchLocations("/regions/")
      .then((data) => setRegions(data || []))
      .catch((error) => console.error("Failed to load regions:", error));
  }, []);

  useEffect(() => {
    if (!selectedRegion) return;

    if (selectedRegion === "130000000") {
      setProvinces([{ code: "130000000", name: "Metro Manila" }]);
      return;
    }

    fetchLocations(`/regions/${selectedRegion}/provinces/`)
      .then((data) => setProvinces(data || []))
      .catch((error) => console.error("Failed to load provinces:", error));
  }, [selectedRegion]);

  useEffect(() => {
    if (!selectedProvince) return;

    const path = selectedProvince === "130000000"
      ? "/regions/130000000/cities-municipalities/"
      : `/provinces/${selectedProvince}/cities-municipalities/`;

    fetchLocations(path)
      .then((data) => setCities(data || []))
      .catch((error) => console.error("Failed to load cities and municipalities:", error));
  }, [selectedProvince]);

  useEffect(() => {
    if (!selectedCity) return;

    fetchLocations(`/cities-municipalities/${selectedCity}/barangays/`)
      .then((data) => setBarangays(data || []))
      .catch((error) => console.error("Failed to load barangays:", error));
  }, [selectedCity]);

  const handleRegionChange = (event) => {
    setSelectedRegion(event.target.value);
    setSelectedProvince("");
    setSelectedCity("");
    setSelectedBarangay("");
    setProvinces([]);
    setCities([]);
    setBarangays([]);
  };

  const handleProvinceChange = (event) => {
    setSelectedProvince(event.target.value);
    setSelectedCity("");
    setSelectedBarangay("");
    setCities([]);
    setBarangays([]);
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
    setSelectedBarangay("");
    setBarangays([]);
  };

  const getLocationName = (locations, code) =>
    locations.find((location) => String(location.code) === String(code))?.name || "";

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setIsSubmitting(true);
    setMessage("");

    try {
      const formData = new FormData(form);
      formData.set("type_registrant", "2");
      formData.set("registrant_type", "Onsite Registrant");
      formData.set("attend_type", formData.get("attend_type") || "Onsite");

      const response = await fetchApi("/wp-json/custom/v1/submit-form", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Unable to submit onsite registration.");
      }

      form.reset();
      setOfwType("");
      setRelativeCompany("");
      setOwwaMember("");
      setSelectedRegion("");
      setSelectedProvince("");
      setSelectedCity("");
      setSelectedBarangay("");
      setProvinces([]);
      setCities([]);
      setBarangays([]);
      setMessage(data?.message || "Onsite registration submitted successfully.");
    } catch (error) {
      setMessage(error.message || "Unable to submit onsite registration.");
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
          <h2>Onsite Registration</h2>
          <p>Please complete any information available. All fields are optional.</p>
        </div>

        <form className="reg_fields onsite-registration-form" onSubmit={handleSubmit}>
          <section>
            <h3>Registrant Information</h3>
            <div className="onsite-registration-grid">{textFields.map(renderTextField)}</div>
          </section>

          <section>
            <h3>Registration Details</h3>
            <div className="onsite-registration-grid">
              
              
              {renderSelect("ofw_type", "Registrant Type (Uri ng rehistrante)", (event) => setOfwType(event.target.value))}
              {isRelativeOfw && renderSelect("relationship", "Relationship with OFW (Relasyon sa OFW)")}
            </div>
          </section>

          <section>
            <h3>Address and Personal Information</h3>
            <div className="onsite-registration-grid">
              <div className="reg_field-cont onsite-registration-wide"><label htmlFor="address">Full Address</label><textarea id="address" name="address" rows="3" /></div>
              <div className="reg_field-cont"><label htmlFor="current_location">Current Location (Country)</label><input id="current_location" name="current_location" /></div>
              <div className="reg_field-cont">
                <label htmlFor="region">Region</label>
                <select id="region" value={selectedRegion} onChange={handleRegionChange}>
                  <option value="">- Select Region -</option>
                  {regions.map((region) => <option key={region.code} value={region.code}>{region.name}</option>)}
                </select>
                <input type="hidden" name="region" value={getLocationName(regions, selectedRegion)} />
              </div>
              <div className="reg_field-cont">
                <label htmlFor="province">Province</label>
                <select id="province" value={selectedProvince} onChange={handleProvinceChange} disabled={!selectedRegion}>
                  <option value="">- Select Province -</option>
                  {provinces.map((province) => <option key={province.code} value={province.code}>{province.name}</option>)}
                </select>
                <input type="hidden" name="province" value={getLocationName(provinces, selectedProvince)} />
              </div>
              <div className="reg_field-cont">
                <label htmlFor="city">City/Municipality</label>
                <select id="city" value={selectedCity} onChange={handleCityChange} disabled={!selectedProvince}>
                  <option value="">- Select City/Municipality -</option>
                  {cities.map((city) => <option key={city.code} value={city.code}>{city.name}</option>)}
                </select>
                <input type="hidden" name="city" value={getLocationName(cities, selectedCity)} />
              </div>
              <div className="reg_field-cont">
                <label htmlFor="barangay">Barangay</label>
                <select id="barangay" value={selectedBarangay} onChange={(event) => setSelectedBarangay(event.target.value)} disabled={!selectedCity}>
                  <option value="">- Select Barangay -</option>
                  {barangays.map((barangay) => <option key={barangay.code} value={barangay.code}>{barangay.name}</option>)}
                </select>
                <input type="hidden" name="barangay" value={getLocationName(barangays, selectedBarangay)} />
              </div>
              <div className="reg_field-cont"><label htmlFor="zipcode">Zip Code</label><input id="zipcode" name="zipcode" /></div>
              {renderSelect("civil_status", "Civil Status (Estado sa Buhay)")}
              {renderSelect("gender", "Gender (Kasarian)")}
              {renderSelect("source_info", "How did you hear about the Summit?")}
            </div>
          </section>

          <section>
            <h3>OFW Information</h3>
            <div className="onsite-registration-grid">
              {isRelativeOfw && relativeOfwFields.map(renderTextField)}
              {ofwFields.map(renderTextField)}
              {renderSelect("owwa_member", "Are you an OWWA Member?", (event) => setOwwaMember(event.target.value))}
              {isOwwaMember && (
                <div className="reg_field-cont"><label htmlFor="owwa_ofw_id">OWWA OFW ID No.</label><input id="owwa_ofw_id" name="owwa_ofw_id" /></div>
              )}
              {isRelativeOfw && renderSelect("ofw_status", "OFW Status (Estado sa Buhay)")}
              {renderSelect("ofw_income", "Monthly Income Range (Buwanang Sweldo)")}
            </div>
          </section>

          <section>
            <h3>Supporting Documents</h3>
            <p className="onsite-registration-note">Tick each document that was presented during onsite registration.</p>
            <div className="onsite-registration-grid">
              {isRelativeOfw && (
                <div className="reg_field-cont onsite-checkbox">
                  <label htmlFor="ofw_birthcert_checked">Birth Certificate of OFW</label>
                  <label><input id="ofw_birthcert_checked" name="ofw_birthcert_checked" type="checkbox" value="presented" /></label>
                </div>
              )}
              {documentFields.map(([name, label]) => (
                <div className="reg_field-cont onsite-checkbox" key={name}>
                  <label htmlFor={`${name}_checked`}>{label}</label>
                  <label><input id={`${name}_checked`} name={`${name}_checked`} type="checkbox" value="presented" /></label>
                </div>
              ))}
            </div>
          </section>

          <div className="onsite-registration-actions">
            <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Submit Onsite Registration"}</button>
          </div>
          {message && <p className="onsite-registration-message" role="status">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default OnsiteRegistration;
