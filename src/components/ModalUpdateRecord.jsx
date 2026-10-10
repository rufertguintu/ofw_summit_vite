
import React, { useEffect, useState } from "react";

import { fetchApi } from "../store/api";

function ModalUpdateRecord({ isOpen, onClose, userdata, ModalEditloading, setUsers, onSuccess }) {
  
//   console.log(userdata);
  
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        meta: {
            date_birth: "",
            ofw_type: ""
        },
        passport: "",
    });

    
    // ✅ Fill form when user loads
    useEffect(() => {
        if (userdata) {
        setFormData({
            name: userdata?.name || "",
            email: userdata?.email || "",
            meta: {
                    date_birth: userdata.meta?.date_birth || "",
                    ofw_type: String(userdata.meta?.ofw_type ?? ""),
                    hometown: userdata.meta?.hometown || "",
                    address: userdata.meta?.address || "",
                    civil_status: userdata.meta?.civil_status || "",
                    gender: userdata.meta?.gender || "",
                    mobile: userdata.meta?.mobile || "",
                    landline: userdata.meta?.landline || "",        
                    region: userdata.meta?.region || "",
                    province: userdata.meta?.province || "",
                    city: userdata.meta?.city || "",
                    barangay: userdata.meta?.barangay || "",
                    zip_code: userdata.meta?.zip_code || "",
                    country: userdata.meta?.country || "",
                    source: userdata.meta?.source || "",
                    manning_agency: userdata.meta?.manning_agency || "",
                    profession: userdata.meta?.profession || "",
                    passport_id: userdata.meta?.passport_id || "",
                    owwa_member: userdata.meta?.owwa_member || "",
                    owwa_ofw_id: userdata.meta?.owwa_ofw_id || "",
                    ofw_firstname: userdata.meta?.ofw_firstname || "",
                    ofw_lastname: userdata.meta?.ofw_lastname || "",
                    ofw_middle_name: userdata.meta?.ofw_middle_name || "",
                    ofw_status: userdata.meta?.ofw_status || "",
                    ofw_profession: userdata.meta?.ofw_profession || "",
                    ofw_emailaddress: userdata.meta?.ofw_emailaddress || "",
                    ofw_income: userdata.meta?.ofw_income || "",
                    work_country: userdata.meta?.work_country || "",
                    ofw_year_service: userdata.meta?.ofw_year_service || "",
            },
            passport: userdata?.passport || "",

        });
        }
    }, [userdata]);

    
    // ✅ Handle input
    const handleChange = (e) => {
        
        const { name, value, dataset } = e.target;

        if (dataset.type === "meta") {
        setFormData({
            ...formData,
            meta: {
            ...formData.meta,
            [name]: value
            }
        });
        } else {
        setFormData({
            ...formData,
            [name]: value
        });
        }

    };

    
    // PSGC location lists (names are stored, codes are used for lookups)
    const PSGC = "https://psgc.gitlab.io/api";
    const [regions, setRegions] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [barangays, setBarangays] = useState([]);

    const loadList = (url, setter) => {
        let cancelled = false;
        fetch(url)
            .then(r => (r.ok ? r.json() : []))
            .then(d => { if (!cancelled) setter(Array.isArray(d) ? d : []); })
            .catch(() => { if (!cancelled) setter([]); });
        return () => { cancelled = true; };
    };

    const findCode = (list, name) => list.find(i => i.name === name)?.code;
    const regionCode = findCode(regions, formData.meta.region);
    const provinceCode = findCode(provinces, formData.meta.province);
    const cityCode = findCode(cities, formData.meta.city);

    useEffect(() => {
        if (!isOpen) return;
        return loadList(`${PSGC}/regions/`, setRegions);
    }, [isOpen]);

    useEffect(() => {
        setProvinces([]);
        if (!regionCode) return;
        return loadList(`${PSGC}/regions/${regionCode}/provinces/`, setProvinces);
    }, [regionCode]);

    // Regions without provinces (e.g. NCR) list their cities directly
    const noProvinces = regionCode && provinces.length === 0;
    useEffect(() => {
        setCities([]);
        if (provinceCode) return loadList(`${PSGC}/provinces/${provinceCode}/cities-municipalities/`, setCities);
        if (noProvinces) return loadList(`${PSGC}/regions/${regionCode}/cities-municipalities/`, setCities);
    }, [provinceCode, noProvinces, regionCode]);

    useEffect(() => {
        setBarangays([]);
        if (!cityCode) return;
        return loadList(`${PSGC}/cities-municipalities/${cityCode}/barangays/`, setBarangays);
    }, [cityCode]);

    const children = {
        region: ["province", "city", "barangay"],
        province: ["city", "barangay"],
        city: ["barangay"],
        barangay: [],
    };

    const handleLocationChange = (e) => {
        const { name, value } = e.target;
        const cleared = Object.fromEntries(children[name].map(k => [k, ""]));
        setFormData(prev => ({ ...prev, meta: { ...prev.meta, ...cleared, [name]: value } }));
    };

    const renderSelect = (name, placeholder, list) => {
        const current = formData.meta[name];
        const hasCurrent = !current || list.some(i => i.name === current);
        return (
            <select
                name={name}
                value={current}
                onChange={handleLocationChange}
                className="form-control"
            >
                <option value="">{placeholder}</option>
                {!hasCurrent && <option value={current}>{current}</option>}
                {list.map(i => <option key={i.code} value={i.name}>{i.name}</option>)}
            </select>
        );
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;

        setFormData({
            ...formData,
            [name]: files[0] // ✅ store file object
        });
    };


    
    // ✅ Submit update
    const handleSubmit = async () => {


        try {
            const res = await fetchApi(
                `/wp-json/custom/v1/user/${userdata.id}`,
                {
                    method: "PUT",
                    body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    meta: formData.meta
                    })
                }
            );

            
            if (formData.passport) {

                const fileData = new FormData();
                fileData.append("passport", formData.passport);
                fileData.append("user_id", userdata.id);

                await fetchApi(
                "/wp-json/custom/v1/upload-files",
                {
                    method: "POST",
                    body: fileData
                }
                );
            }


            
            if (res.ok) {
                // ✅ Update UI instantly
                setUsers(prevUsers =>
                    prevUsers.map(u =>
                    u.id === userdata.id
                        ? 
                        {
                            ...u,
                            name: formData.name,
                            email: formData.email,
                            meta: {
                            ...u.meta,
                            ...formData.meta
                            }
                        }

                        : u
                    )
                );

                onSuccess?.("Profile updated successfully!");
                onClose();
            } else {
                onSuccess?.("Failed to update profile.", "error");
            }

        
        } catch (error) {
            console.error(error);
            onSuccess?.("Failed to update profile.", "error");
        }



    };




  if (!isOpen) return null;

  return (
    <div style={overlay} className="z-999" onClick={onClose}>
      <div className="modalbody !max-w-[1200px]" style={modal} onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-edit-heading">
            <h4>Update Information</h4>
            
            <div className="action-btn">
                <button onClick={handleSubmit}>
                    Update
                </button>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
        
        {ModalEditloading ? ( 
          <p>Please wait . . . .</p>
        ) : userdata ? (
          <>
            <div className="update-form">
                <div><label>User ID:</label> {userdata.meta.custom_id}</div>
                <div><label style={{ display: "block" }}>Type of Registrant: </label> 
                
                    <select
                    name="ofw_type"
                    value={formData.meta.ofw_type}
                    onChange={handleChange}
                    >
                        <option value="0">OFW</option>
                        <option value="1">Relative of OFW</option>
                    </select>
                </div>

                <div><label>Full Name:</label> 
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Name"
                    class="form-control"
                />
                </div>
                <div><label>Email Address:</label> 
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    class="form-control"
                />
                </div>
                <div><label>Date of Birth:</label> 
                <input
                    type="text"
                    name="date_birth"
                    data-type="meta"
                    value={formData.meta.date_birth}
                    onChange={handleChange}
                    placeholder="Date of Birth"
                    class="form-control"
                />
                </div>
                <div><label>Home Town:</label><input
                    type="text"
                    name="hometown"
                    data-type="meta"
                    value={formData.meta.hometown}
                    onChange={handleChange}
                    placeholder="Home Town"
                    class="form-control"
                /></div>
                <div><label>Address:</label> <input
                    type="text"
                    name="address"
                    data-type="meta"
                    value={formData.meta.address}
                    onChange={handleChange}
                    placeholder="Address"
                    class="form-control"
                />
                </div>
                <div><label>Civil Status:</label> 
                    <select
                        name="civil_status"
                        data-type="meta"
                        value={formData.meta.civil_status}
                        onChange={handleChange}
                        class="form-control"
                    >
                        <option value="">Select Civil Status</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Widowed">Widowed</option>
                        <option value="Divorced">Divorced</option>
                    </select>
                </div>
                <div>
                    <label>Gender:</label> 
                    <select
                        name="gender"
                        data-type="meta"
                        value={formData.meta.gender}
                        onChange={handleChange}
                        class="form-control"
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
                <div><label>Mobile Number:</label> <input
                    type="text"
                    name="mobile"
                    data-type="meta"
                    value={formData.meta.mobile}
                    onChange={handleChange}
                    placeholder="Mobile Number"
                    class="form-control"
                /></div>
                <div><label>Landline Number:</label> <input
                    type="text"
                    name="landline"
                    data-type="meta"
                    value={formData.meta.landline}
                    onChange={handleChange}
                    placeholder="Landline Number"
                    class="form-control"
                /></div>
                <div><label>Region:</label> {renderSelect("region", "Select Region", regions)}</div>
                <div><label>Province:</label> {renderSelect("province", "Select Province", provinces)}</div>
                <div><label>City:</label> {renderSelect("city", "Select City / Municipality", cities)}</div>
                <div><label>Barangay:</label> {renderSelect("barangay", "Select Barangay", barangays)}</div>
                <div><label>Zip Code:</label> <input
                    type="text"
                    name="zip_code"
                    data-type="meta"
                    value={formData.meta.zip_code}
                    onChange={handleChange}
                    placeholder="Zip Code"
                    class="form-control"
                /></div>
                <div><label>Current Location (Country):</label> 
                    <select
                        name="country"
                        data-type="meta"
                        value={formData.meta.country}
                        onChange={handleChange}
                        class="form-control"
                    >
                        <option value="">Select Country</option>
                        <option value="Algeria">Algeria</option>
                        <option value="Andorra">Andorra</option>
                        <option value="Angola">Angola</option>
                        <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                        <option value="Argentina">Argentina</option>
                        <option value="Armenia">Armenia</option>
                        <option value="Australia">Australia</option>
                        <option value="Austria">Austria</option>
                        <option value="Azerbaijan">Azerbaijan</option>
                        <option value="Bahamas">Bahamas</option>
                        <option value="Bahrain">Bahrain</option>
                        <option value="Bangladesh">Bangladesh</option>
                        <option value="Barbados">Barbados</option>
                        <option value="Belarus">Belarus</option>
                        <option value="Belgium">Belgium</option>
                        <option value="Belize">Belize</option>
                        <option value="Benin">Benin</option>
                        <option value="Bhutan">Bhutan</option>
                        <option value="Bolivia">Bolivia</option>
                        <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                        <option value="Botswana">Botswana</option>
                        <option value="Brazil">Brazil</option>
                        <option value="Brunei">Brunei</option>
                        <option value="Bulgaria">Bulgaria</option>
                        <option value="Burkina Faso">Burkina Faso</option>
                        <option value="Burundi">Burundi</option>
                        <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                        <option value="Cabo Verde">Cabo Verde</option>
                        <option value="Cambodia">Cambodia</option>
                        <option value="Cameroon">
                        Cameroon</option>
                        <option value="Canada">
                        Canada</option>
                        <option value="Central African Republic">
                        Central African Republic</option>
                        <option value="Chad">
                        Chad</option>
                        <option value="Chile">
                        Chile</option>
                        <option value="China">
                        China</option>
                        <option value="Colombia">
                        Colombia</option>
                        <option value="Comoros">
                        Comoros</option>
                        <option value="Congo (Congo-Brazzaville)">
                        Congo (Congo-Brazzaville)</option>
                        <option value="Costa Rica">
                        Costa Rica</option>
                        <option value="Croatia">
                        Croatia</option>
                        <option value="Cuba">
                        Cuba</option>
                        <option value="Cyprus">
                        Cyprus</option>
                        <option value="Czechia (Czech Republic)">
                        Czechia (Czech Republic)</option>
                        <option value="Democratic Republic of the Congo">
                        Democratic Republic of the Congo</option>
                        <option value="Denmark">
                        Denmark</option>
                        <option value="Djibouti">
                        Djibouti</option>
                        <option value="Dominica">
                        Dominica</option>
                        <option value="Dominican Republic">
                        Dominican Republic</option>
                        <option value="Ecuador">
                        Ecuador</option>
                        <option value="Egypt">
                        Egypt</option>
                        <option value="El Salvador">
                        El Salvador</option>
                        <option value="Equatorial Guinea">
                        Equatorial Guinea</option>
                        <option value="Eritrea">
                        Eritrea</option>
                        <option value="Estonia">
                        Estonia</option>
                        <option value="Eswatini (fmr. Swaziland)">
                        Eswatini (fmr. "Swaziland")</option>
                        <option value="Ethiopia">
                        Ethiopia</option>
                        <option value="Fiji">
                        Fiji</option>
                        <option value="Finland">
                        Finland</option>
                        <option value="France">
                        France</option>
                        <option value="Gabon">
                        Gabon</option>
                        <option value="Gambia">
                        Gambia</option>
                        <option value="Georgia">
                        Georgia</option>
                        <option value="Germany">
                        Germany</option>
                        <option value="Ghana">
                        Ghana</option>
                        <option value="Greece">
                        Greece</option>
                        <option value="Grenada">
                        Grenada</option>
                        <option value="Guatemala">
                        Guatemala</option>
                        <option value="Guinea">
                        Guinea</option>
                        <option value="Guinea-Bissau">
                        Guinea-Bissau</option>
                        <option value="Guyana">
                        Guyana</option>
                        <option value="Haiti">
                        Haiti</option>
                        <option value="Holy See">
                        Holy See</option>
                        <option value="Honduras">
                        Honduras</option>
                        <option value="Hong Kong">
                        Hong Kong</option>
                        <option value="Hungary">
                        Hungary</option>
                        <option value="Iceland">
                        Iceland</option>
                        <option value="India">
                        India</option>
                        <option value="Indonesia">
                        Indonesia</option>
                        <option value="Iran">
                        Iran</option>
                        <option value="Iraq">
                        Iraq</option>
                        <option value="Ireland">
                        Ireland</option>
                        <option value="Israel">
                        Israel</option>
                        <option value="Italy">
                        Italy</option>
                        <option value="Jamaica">
                        Jamaica</option>
                        <option value="Japan">
                        Japan</option>
                        <option value="Jordan">
                        Jordan</option>
                        <option value="Kazakhstan">
                        Kazakhstan</option>
                        <option value="Kenya">
                        Kenya</option>
                        <option value="Kiribati">
                        Kiribati</option>
                        <option value="Kuwait">
                        Kuwait</option>
                        <option value="Kyrgyzstan">
                        Kyrgyzstan</option>
                        <option value="Laos">
                        Laos</option>
                        <option value="Latvia">
                        Latvia</option>
                        <option value="Lebanon">
                        Lebanon</option>
                        <option value="Lesotho">
                        Lesotho</option>
                        <option value="Liberia">
                        Liberia</option>
                        <option value="Libya">
                        Libya</option>
                        <option value="Liechtenstein">
                        Liechtenstein</option>
                        <option value="Lithuania">
                        Lithuania</option>
                        <option value="Luxembourg">
                        Luxembourg</option>
                        <option value="Macau">
                        Macau</option>
                        <option value="Madagascar">
                        Madagascar</option>
                        <option value="Malawi">
                        Malawi</option>
                        <option value="Malaysia">
                        Malaysia</option>
                        <option value="Maldives">
                        Maldives</option>
                        <option value="Mali">
                        Mali</option>
                        <option value="Malta">
                        Malta</option>
                        <option value="Marshall Islands">
                        Marshall Islands</option>
                        <option value="Mauritania">
                        Mauritania</option>
                        <option value="Mauritius">
                        Mauritius</option>
                        <option value="Mexico">
                        Mexico</option>
                        <option value="Micronesia">
                        Micronesia</option>
                        <option value="Moldova">
                        Moldova</option>
                        <option value="Monaco">
                        Monaco</option>
                        <option value="Mongolia">
                        Mongolia</option>
                        <option value="Montenegro">
                        Montenegro</option>
                        <option value="Morocco">
                        Morocco</option>
                        <option value="Mozambique">
                        Mozambique</option>
                        <option value="Myanmar (formerly Burma)">
                        Myanmar (formerly Burma)</option>
                        <option value="Namibia">
                        Namibia</option>
                        <option value="Nauru">
                        Nauru</option>
                        <option value="Nepal">
                        Nepal</option>
                        <option value="Netherlands">
                        Netherlands</option>
                        <option value="New Zealand">
                        New Zealand</option>
                        <option value="Nicaragua">
                        Nicaragua</option>
                        <option value="Niger">
                        Niger</option>
                        <option value="Nigeria">
                        Nigeria</option>
                        <option value="North Korea">
                        North Korea</option>
                        <option value="North Macedonia">
                        North Macedonia</option>
                        <option value="Norway">
                        Norway</option>
                        <option value="Oman">
                        Oman</option>
                        <option value="Pakistan">
                        Pakistan</option>
                        <option value="Palau">
                        Palau</option>
                        <option value="Palestine State">
                        Palestine State</option>
                        <option value="Panama">
                        Panama</option>
                        <option value="Papua New Guinea">
                        Papua New Guinea</option>
                        <option value="Paraguay">
                        Paraguay</option>
                        <option value="Peru">
                        Peru</option>
                        <option value="Philippines">
                        Philippines</option>
                        <option value="Poland">
                        Poland</option>
                        <option value="Portugal">
                        Portugal</option>
                        <option value="Qatar">
                        Qatar</option>
                        <option value="Romania">
                        Romania</option>
                        <option value="Russia">
                        Russia</option>
                        <option value="Rwanda">
                        Rwanda</option>
                        <option value="Saint Kitts and Nevis">
                        Saint Kitts and Nevis</option>
                        <option value="Saint Lucia">
                        Saint Lucia</option>
                        <option value="Saint Vincent and the Grenadines">
                        Saint Vincent and the Grenadines</option>
                        <option value="Samoa">
                        Samoa</option>
                        <option value="San Marino">
                        San Marino</option>
                        <option value="Sao Tome and Principe">
                        Sao Tome and Principe</option>
                        <option value="Saudi Arabia">
                        Saudi Arabia</option>
                        <option value="Senegal">
                        Senegal</option>
                        <option value="Serbia">
                        Serbia</option>
                        <option value="Seychelles">
                        Seychelles</option>
                        <option value="Sierra Leone">
                        Sierra Leone</option>
                        <option value="Singapore">
                        Singapore</option>
                        <option value="Slovakia">
                        Slovakia</option>
                        <option value="Slovenia">
                        Slovenia</option>
                        <option value="Solomon Islands">
                        Solomon Islands</option>
                        <option value="Somalia">
                        Somalia</option>
                        <option value="South Africa">
                        South Africa</option>
                        <option value="South Korea">
                        South Korea</option>
                        <option value="South Sudan">
                        South Sudan</option>
                        <option value="Spain">
                        Spain</option>
                        <option value="Sri Lanka">
                        Sri Lanka</option>
                        <option value="Sudan">
                        Sudan</option>
                        <option value="Suriname">
                        Suriname</option>
                        <option value="Sweden">
                        Sweden</option>
                        <option value="Switzerland">
                        Switzerland</option>
                        <option value="Syria">
                        Syria</option>
                        <option value="Taiwan">
                        Taiwan</option>
                        <option value="Tajikistan">
                        Tajikistan</option>
                        <option value="Tanzania">
                        Tanzania</option>
                        <option value="Thailand">
                        Thailand</option>
                        <option value="Timor-Leste">
                        Timor-Leste</option>
                        <option value="Togo">
                        Togo</option>
                        <option value="Tonga">
                        Tonga</option>
                        <option value="Trinidad and Tobago">
                        Trinidad and Tobago</option>
                        <option value="Tunisia">
                        Tunisia</option>
                        <option value="Turkey">
                        Turkey</option>
                        <option value="Turkmenistan">
                        Turkmenistan</option>
                        <option value="Tuvalu">
                        Tuvalu</option>
                        <option value="Uganda">
                        Uganda</option>
                        <option value="Ukraine">
                        Ukraine</option>
                        <option value="United Arab Emirates">
                        United Arab Emirates</option>
                        <option value="United Kingdom">
                        United Kingdom</option>
                        <option value="United States of America">
                        United States of America</option>
                        <option value="Uruguay">
                        Uruguay</option>
                        <option value="Uzbekistan">
                        Uzbekistan</option>
                        <option value="Vanuatu">
                        Vanuatu</option>
                        <option value="Venezuela">
                        Venezuela</option>
                        <option value="Vietnam">
                        Vietnam</option>
                        <option value="Yemen">
                        Yemen</option>
                        <option value="Zambia">
                        Zambia</option>
                        <option value="Zimbabwe">
                        Zimbabwe</option>                
                    </select>
                </div>
                <div><label>Manning Agency:</label>
                    <select
                        name="manning_agency"
                        data-type="meta"
                        value={formData.meta.manning_agency}
                        onChange={handleChange}
                        class="form-control"
                    >
                        <option value="">- Select Source -</option>
                        <option value="Friend" >Friend</option>
                        <option value="Relative / Family" >Relative / Family</option>
                        <option value="Newspaper or Magazine" >Newspaper or Magazine</option>
                        <option value="Radio" >Radio</option>
                        <option value="Television" >Television</option>
                        <option value="Social Website (Facebook, LinkedIn, etc.)" >Social Website (Facebook, LinkedIn, etc.)</option>
                        <option value="Website" >Website</option>
                        <option value="Manning Agency" >Manning Agency</option>
                        <option value="Others" >Others</option>
                    </select>
                </div>
                <div><label>Profession:</label> <input
                    type="text"
                    name="profession"
                    data-type="meta"
                    value={formData.meta.profession}
                    onChange={handleChange}
                    placeholder="Profession"
                    class="form-control"
                /></div>
                <div><label>Passport ID:</label> <input
                    type="text"
                    name="passport_id"
                    data-type="meta"
                    value={formData.meta.passport_id}
                    onChange={handleChange}
                    placeholder="Passport ID"
                    class="form-control"
                /></div>
                <div><label>OWWA Member:</label> <input
                    type="text"
                    name="owwa_member"
                    data-type="meta"
                    value={formData.meta.owwa_member}
                    onChange={handleChange}
                    placeholder="OWWA Member"
                    class="form-control"
                /></div>
                <div><label>OWWA OFW ID:</label> <input
                    type="text"
                    name="owwa_ofw_id"
                    data-type="meta"
                    value={formData.meta.owwa_ofw_id}
                    onChange={handleChange}
                    placeholder="OWWA OFW ID"
                    class="form-control"
                /></div>
                <div><label>Passport:</label> 
                {userdata?.passport ? (
                    userdata.passport.toLowerCase().endsWith(".pdf") ? (
                    <embed
                        src={userdata.passport}
                        width="300px"
                        height="400px"
                        type="application/pdf"
                    />
                    ) : (
                    <img
                        src={userdata.passport}
                        alt="passport"
                        width="250px"
                    />
                    )
                ) : (
                    <p>No Passport uploaded</p>
                )}
                    <br />
                    <input
                    type="file"
                    name="passport"
                    onChange={handleFileChange}
                    />
                </div>
                <div><label>Married Certificate:</label> 
                    {userdata?.married_cert ? (
                        userdata.married_cert.toLowerCase().endsWith(".pdf") ? (
                        <embed
                            src={userdata.married_cert}
                            width="300px"
                            height="400px"
                            type="application/pdf"
                        />
                        ) : (
                        <img
                            src={userdata.married_cert}
                            alt="married_cert"
                            width="250px"
                        />
                        )
                    ) : (
                        <p>No Married Certificate uploaded</p>
                    )}
                    <br />
                    <input
                    type="file"
                    name="married_cert"
                    onChange={handleFileChange}
                    />
                </div>

                <div><label>OFW Birth Certificate:</label> 
                    {userdata?.ofw_birth_cert ? (
                        userdata.ofw_birth_cert.toLowerCase().endsWith(".pdf") ? (
                        <embed
                            src={userdata.ofw_birth_cert}
                            width="300px"
                            height="400px"
                            type="application/pdf"
                        />
                        ) : (
                        <img
                            src={userdata.ofw_birth_cert}
                            alt="ofw_birth_cert"
                            width="250px"
                        />
                        )
                    ) : (
                        <p>No OFW Birth Certificate uploaded</p>
                    )}
                    <br />
                    <input
                    type="file"
                    name="ofw_birth_cert"
                    onChange={handleFileChange}
                    />
                </div>

                <div><label>Valid ID:</label> 
                    {userdata?.valid_id ? (
                        userdata.valid_id.toLowerCase().endsWith(".pdf") ? (
                        <embed
                            src={userdata.valid_id}
                            width="300px"
                            height="400px"
                            type="application/pdf"
                        />
                        ) : (
                        <img
                            src={userdata.valid_id}
                            alt="valid_id"
                            width="250px"
                        />
                        )
                    ) : (
                        <p>No Valid ID uploaded</p>
                    )}
                    <br />
                    <input
                    type="file"
                    name="valid_id"
                    onChange={handleFileChange}
                    />
                </div>

                <div><label>Seaman Book:</label> 
                    {userdata?.seaman_book ? (
                        userdata.seaman_book.toLowerCase().endsWith(".pdf") ? (
                        <embed
                            src={userdata.seaman_book}
                            width="300px"
                            height="400px"
                            type="application/pdf"
                        />
                        ) : (
                        <img
                            src={userdata.seaman_book}
                            alt="seaman_book"
                            width="250px"
                        />
                        )
                    ) : (
                        <p>No Seaman Book uploaded</p>
                    )}
                    <br />
                    <input
                    type="file"
                    name="seaman_book"
                    onChange={handleFileChange}
                    />
                </div>

                <div><label>Employment Contract:</label> 
                    {userdata?.employment_contract ? (
                        userdata.employment_contract.toLowerCase().endsWith(".pdf") ? (
                        <embed
                            src={userdata.employment_contract}
                            width="300px"
                            height="400px"
                            type="application/pdf"
                        />
                        ) : (
                        <img
                            src={userdata.employment_contract}
                            alt="employment_contract"
                            width="250px"
                        />
                        )
                    ) : (
                        <p>No Employment Contract uploaded</p>
                    )}
                    <br />
                    <input
                    type="file"
                    name="employment_contract"
                    onChange={handleFileChange}
                    />
                </div>

                <div><label>Working Visa:</label> 
                    {userdata?.visa ? (
                        userdata.visa.toLowerCase().endsWith(".pdf") ? (
                        <embed
                            src={userdata.visa}
                            width="300px"
                            height="400px"
                            type="application/pdf"
                        />
                        ) : (
                        <img
                            src={userdata.visa}
                            alt="visa"
                            width="250px"
                        />
                        )
                    ) : (
                        <p>No Working Visa uploaded</p>
                    )}
                    <br />
                    <input
                    type="file"
                    name="visa"
                    onChange={handleFileChange}
                    />
                </div>

                <div><label>OWWA POEA:</label> 
                    {userdata?.owwa_poea ? (
                        userdata.owwa_poea.toLowerCase().endsWith(".pdf") ? (
                        <embed
                            src={userdata.owwa_poea}
                            width="300px"
                            height="400px"
                            type="application/pdf"
                        />
                        ) : (
                        <img
                            src={userdata.owwa_poea}
                            alt="owwa_poea"
                            width="250px"
                        />
                        )
                    ) : (
                        <p>No Working owwa_poea uploaded</p>
                    )}
                    <br />
                    <input
                    type="file"
                    name="owwa_poea"
                    onChange={handleFileChange}
                    />
                </div>

                <div><label>Remittance:</label> 
                    {userdata?.remittance ? (
                        userdata.remittance.toLowerCase().endsWith(".pdf") ? (
                        <embed
                            src={userdata.remittance}
                            width="300px"
                            height="400px"
                            type="application/pdf"
                        />
                        ) : (
                        <img
                            src={userdata.remittance}
                            alt="remittance"
                            width="250px"
                        />
                        )
                    ) : (
                        <p>No Remittance uploaded</p>
                    )}
                    <br />
                    <input
                    type="file"
                    name="remittance"
                    onChange={handleFileChange}
                    />
                </div>

                <div><label>Allotment:</label> 
                    {userdata?.allotment ? (
                        userdata.allotment.toLowerCase().endsWith(".pdf") ? (
                        <embed
                            src={userdata.allotment}
                            width="300px"
                            height="400px"
                            type="application/pdf"
                        />
                        ) : (
                        <img
                            src={userdata.allotment}
                            alt="allotment"
                            width="250px"
                        />
                        )
                    ) : (
                        <p>No allotment uploaded</p>
                    )}
                    <br />
                    <input
                    type="file"
                    name="allotment"
                    onChange={handleFileChange}
                    />
                </div>
            </div>
          </>
        ) : (
          <p>No Data</p>
        )}

      </div>
    </div>
  );
}

// styles
const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modal = {
  borderRadius: "10px",
  width: "90%",
  maxWidth: "700px",
};

export default ModalUpdateRecord;
