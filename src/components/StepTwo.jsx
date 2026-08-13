import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StepTwo({nextStep, prevStep, handleChange, values}) {
    const [hasRelativeCompany, setHasRelativeCompany] = useState(false);
    const [hasRelativeOFW, setHasRelativeOFW] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [errorField, setErrorField] = useState("");
    const [loading, setLoading] = useState(false);
    const [termsEnabled, setTermsEnabled] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const navigate = useNavigate();

    const setFieldError = (field, message) => {
        setErrorField(field);
        setEmailError(message);
    };

    useEffect(() => {
        setHasRelativeCompany(values.relative_company === "yes");
    }, [values.relative_company]);

    useEffect(() => {
        setHasRelativeOFW(values.ofw_type === "1");
    }, [values.ofw_type]);

    const validateEmailAddress = async (email) => {
        if (!email?.trim()) {
            setFieldError("Email Address", "Please enter an email address.");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setFieldError("Email Address", "Please enter a valid email.");
            return false;
        }

        try {
            setLoading(true);
            const apiKey = "9aee96d37d5645628a5a1c055c4fb11e";
            const validateUrl = `https://emailreputation.abstractapi.com/v1/?api_key=${apiKey}&email=${encodeURIComponent(email)}`;
            const validateResponse = await fetch(validateUrl);
            const validateData = await validateResponse.json();

            if (validateData.email_deliverability?.status === "deliverable") {
                setErrorField("");
                setEmailError("");
                setTermsEnabled(true);
                return true;
            }

            setFieldError("Email Address", "Please enter a valid email.");
            setTermsEnabled(false);
            return false;
        } catch (error) {
            console.error("Error validating email:", error);
            setFieldError("Email Address", "Unable to validate email.");
            setTermsEnabled(false);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleEmailBlur = async (e) => {
        const input = e?.target;
        const email = (input?.value || values.emailaddress || values.email || "").trim();
        await validateEmailAddress(email);
    };

    const handleSubmit = async () => {
        try {
            const email = (values.emailaddress || values.email || "").trim();
            const isValidEmail = await validateEmailAddress(email);

            if (!isValidEmail) {
                return;
            }

            const response = await fetch(
                "http://localhost:8005/wp-json/custom/v1/submit-form",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ ...values, emailaddress: email }),
                }
            );

            const data = await response.json();

            console.log("Response:", data);

            if (response.ok) {
                try {
                    const loginResponse = await fetch(
                        "http://localhost:8005/wp-json/jwt-auth/v1/token",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                username: email,
                                password: values.password,
                            }),
                        }
                    );

                    const loginData = await loginResponse.json();

                    if (loginResponse.ok && loginData?.token) {
                        localStorage.setItem("token", loginData.token);
                        localStorage.setItem("user", JSON.stringify(loginData.user || {}));
                    }
                } catch (loginError) {
                    console.error("Auto-login failed:", loginError);
                }

                alert("✅ Form submitted successfully!");
                setTimeout(() => {
                    navigate("/profile-dashboard");
                }, 500);
            } else {
                alert("❌ Error submitting form: " + (data?.message || "Unknown error"));
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return <>
        <h2>Step 2</h2>
        <div className="reg_fields" id="new">
            <div className="one-column_field mb-5">
                <div className="reg_field-cont">
                    <label>May kamag-anak ka bang nagtatrabaho sa Villar Group of Companies? <span className="required-field">*</span></label>
                    <div className="reg_radio">
                        <div className="reg_radio-list">
                            <input
                                type="radio"
                                name="relative_company"
                                value="yes"
                                checked={values.relative_company === "yes"}
                                onChange={(e) => {
                                    handleChange("relative_company")(e);
                                    setHasRelativeCompany(true);
                                }}
                            /> Yes (Meron)
                        </div>
                        <div className="reg_radio-list">
                            <input
                                type="radio"
                                name="relative_company"
                                value="no"
                                checked={values.relative_company === "no"}
                                onChange={(e) => {
                                    handleChange("relative_company")(e);
                                    setHasRelativeCompany(false);
                                }}
                            /> No (Wala)
                        </div>
                    </div>
                </div>
            </div>
            {hasRelativeCompany && (
            <div className="two-column_field mb-5" id="relative_relationship">
                <p>Kung meron, ano ang relasyon mo sakanya:</p>
                <div className="two-column_inner-wrapper">
                    <div className="reg_field-cont">
                        <label>Relative Relationship (Relasyon)</label>
                        <select name="company_relationship" id="company_relationship" value={values.company_relationship} onChange={handleChange("company_relationship")}>
                            <option value="">- Select Relationship -</option>
                            <option value="Parent">Parent (Magulang)</option>
                            <option value="Sibling">Sibling (Kapatid)</option>
                            <option value="Spouse">Spouse (Asawa)</option>
                            <option value="Child">Child (Anak)</option>
                        </select>
                    </div>
                    <div className="reg_field-cont">
                        <label>Relative Full Name (Buong Pangalan)</label>
                        <input type="text" name="company_relative_fullname" placeholder="Full Name (Buong Pangalan)" value={values.company_relative_fullname} onChange={handleChange("company_relative_fullname")}/>
                    </div>
                </div>
            </div>
            )}
            <div className="one-column_field mb-5">
                <div className="reg_field-cont">
                    <label>Registrant Type (Uri ng rehistrante) <span className="required-field">*</span></label>
                    <select
                        name="ofw_type"
                        id="ofw_type"
                        required
                        value={values.ofw_type || ""}
                        onChange={(e) => {
                            handleChange("ofw_type")(e);
                            setHasRelativeOFW(e.target.value === "1");
                        }}
                    >
                        <option value="">- Select Registrant Type -</option>
                        <option value="0">OFW</option>
                        <option value="1">Relative of OFW (Kamag-anak ng OFW)</option>
                    </select>
                </div>
            </div>
            {hasRelativeOFW && (
            <div className="one-column_field mb-5"  id="relationship_ofw_f" >
                <div className="reg_field-cont">
                    <label>Relationship with OFW (Relasyon sa OFW) </label>
                    <select name="relationship" id="relationship" required value={values.relationship} onChange={handleChange("relationship")}>
                        <option value="">- Select Relationship -</option>
                        <option value="Parent">Parent (Magulang)</option>
                        <option value="Sibling">Sibling (Kapatid)</option>
                        <option value="Spouse">Spouse (Asawa)</option>
                        <option value="Child">Child (Anak)</option>
                    </select>
                </div>
            </div>
            )}

            <div className="two-column_field">
                <div className="two-column_inner-wrapper">
                    <div className="reg_field-cont">
                        <label>First Name (Pangalan) <span className="required-field">*</span></label>
                        <input type="text" disabled placeholder="First Name" className="fname" value={values.firstname} onChange={handleChange("firstname")} readOnly/>
                    </div>
                    <div className="reg_field-cont">
                        <label>Last Name (Apelyido) <span className="required-field">*</span></label>
                        <input type="text" disabled name="lastname" placeholder="Last Name" className="lname"  value={values.lastname} onChange={handleChange("lastname")}  readOnly/>
                    </div>
                </div>
            </div>
            <div className="two-column_field">
                <div className="two-column_inner-wrapper mb-5">
                    <div className="reg_field-cont">
                        <label>Email Address <span className="required-field">*</span></label>
                        <input
                            type="email"
                            id="reg_email"
                            name="emailaddress"
                            placeholder="Email Address"
                            value={values.emailaddress || values.email || ""}
                            onChange={(e) => {
                                handleChange("emailaddress")(e);
                                if (emailError) {
                                    setErrorField("");
                                    setEmailError("");
                                }
                                setTermsEnabled(false);
                            }}
                            onBlur={handleEmailBlur}
                            style={{ borderColor: emailError ? "#e11d48" : undefined }}
                            aria-invalid={Boolean(emailError)}
                        />
                        
                        {emailError && (
                            <span className="email-error" role="alert">
                                {errorField ? `${errorField}: ${emailError}` : emailError}
                            </span>
                        )}

                        <div className="email-disclaimer">
                            <p><i>Doesn't have Email Address? <a href="https://accounts.google.com/signup/v2/createaccount?biz=false&cc=PH&continue=https%3A%2F%2Fwww.google.com%2Fsearch%3Fq%3Ddoesn%2527t%2Bhave%2Bemail%2Baccount%26sca_esv%3D567212709%26source%3Dhp%26ei%3DVwQMZclA0d3aug_4jK_YCQ%26iflsig%3DAO6bgOgAAAAAZQwSZ6ja1KjNG_6GbRh2dlKh3OXFpcnB%26ved%3D0ahUKEwiJyOLpqbuBAxXRrlYBHXjGC5sQ4dUDCAk%26uact%3D5%26oq%3Ddoesn%2527t%2Bhave%2Bemail%2Baccount%26gs_lp%3DEgdnd3Mtd2l6Ihpkb2Vzbid0IGhhdmUgZW1haWwgYWNjb3VudDIFECEYoAEyBRAhGKABMggQIRgWGB4YHTIIECEYFhgeGB0yCBAhGBYYHhgdSPl8UABYtEVwAHgAkAEAmAHLAaABkxmqAQYwLjI1LjG4AQPIAQD4AQHCAgsQABiABBixAxiDAcICCBAuGIAEGLEDwgIFEC4YgATCAggQABiABBixA8ICCxAAGIoFGLEDGIMBwgIOEC4YgAQYsQMYxwEY0QPCAgUQABiABMICCxAuGIAEGLEDGIMBwgIQEAAYgAQYsQMYgwEYRhj5AcICBhAAGBYYHsICCBAAGBYYHhgPwgIIEAAYigUYhgPCAggQABgeGA0YD8ICCBAAGAUYHhgNwgIIEAAYCBgeGA3CAgcQIRigARgK%26sclient%3Dgws-wiz&dsh=S620996524%3A1695286508038664&flowEntry=SignUp&flowName=GlifWebSignIn&hl=en&ifkv=AYZoVhcrKF6_kBAnxGfXsHHtaO4rRDxXhEJfk0r5nLsjyMS4u9RJwaXbMnuGToUIKSAgZe8sDtz00Q&theme=glif" target="_blank">Click here.</a></i></p>
                        </div>
                    </div>
                    <div className="reg_field-cont">
                        <label>Date of Birth (Araw ng kapanganakan) <span className="required-field">*</span></label>
                        <input type="text" name="date_birth" className="dob" placeholder="YYYY/MM/DD" required  value={values.date_birth} onChange={handleChange("date_birth")} readOnly/>
                    </div>
                </div>
            </div>
            <div className="two-column_field">
                <div className="two-column_inner-wrapper">
                    <div className="reg_field-cont">
                        <label>Mobile Number <span className="required-field">*</span></label>
                        <input type="text" disabled name="mobile" className="mobile" placeholder="ex. 09123456789"  value={values.mobile} onChange={handleChange("mobile")}  maxLength="11"/>
                        <div id="error-container"></div>
                    </div>
                    <div className="reg_field-cont">
                        <label>Home Town <span className="required-field">*</span></label>
                        <input type="text" name="hometown" placeholder="Home Town (City or Province only)" value={values.hometown} onChange={handleChange("hometown")}  required/>
                    </div>
                </div>
            </div>
            <div className="two-column_field">
                <div className="two-column_inner-wrapper">
                    <div className="reg_field-cont">
                        <label>Password <span className="required-field">*</span></label>
                        <input type="password" name="password" placeholder="Password" required value={values.password} onChange={handleChange("password")}/>
                    </div>
                    <div className="reg_field-cont">
                        <label>Confirm Password <span className="required-field">*</span></label>
                        <input type="password" name="confirmpw" placeholder="Confirm Password" required value={values.confirmpw} onChange={handleChange("confirmpw")}/>
                    </div>
                </div>
            </div>
            <div className="one-column_field">
                <p>Alinsunod sa Data Privacy Act of 2012, pinapahintulutan ko ang Villar Foundation na gamitin at iproseso ang mga impormasyong ibinahagi ko sa Registration Form na ito para sa layunin at maayos na pangangasiwa ng 12th OFW & Family Summit 2023 lamang at para na rin sa iba pang mga layunin na naaayon sa batas.<span className="required-field">*</span></p>
                <div className="agreement-field">
                    <input
                        type="checkbox"
                        name="agree"
                        value="1"
                        disabled={!termsEnabled}
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                    /> I Agree
                </div>
            </div>
            <div className="one-column_field">
                <div className="reg_field-cont">
                    <div id="message"></div>
                </div>
            </div>
            <div className="one-column_field required_fill">
                                
                <button onClick={handleSubmit} disabled={!termsAccepted || !termsEnabled}>
                Submit
                </button>

            </div>
        </div>
    </>
}