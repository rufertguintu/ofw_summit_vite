import React from "react";
import { useEffect, useState } from "react";

export default function StepOne({ nextStep, handleChange, values }) {
    
    // const isValid =
    // values.firstname.trim() !== "" &&
    // values.lastname.trim() !== "" &&    
    // /\S+@\S+\.\S+/.test(values.email) &&
    // values.password.length >= 6;
    
    const [touched, setTouched] = useState({
        firstname: false,
        lastname: false,
        mobile: false,
    });

    const isValid = 
        values.firstname.trim() !== "" &&
        values.lastname.trim() !== "" &&
        /^09\d{9}$/.test(values.mobile);

    return <>
        <h2>Join Event</h2>
        <div className="reg_fields">
            <div className="two-column_field mb-5">
                <div className="two-column_inner-wrapper">
                    <div className="reg_field-cont">
                        <label>First Name (Pangalan) *</label>
                        <input type="text" name="firstname" placeholder="First Name" required value={values.firstname} onChange={handleChange("firstname")} onBlur={() => setTouched({ ...touched, firstname: true })}/>
                        {!values.firstname.trim() && touched.firstname && (
                            <p style={{ color: "red" }}>
                            First Name is required 
                            </p>
                        )}
                    </div>
                    <div className="reg_field-cont">
                        <label>Last Name (Apelyido) *</label>
                        <input type="text" name="lastname" placeholder="Last Name" required value={values.lastname} onChange={handleChange("lastname")} onBlur={() => setTouched({ ...touched, lastname: true })} />
                        {!values.lastname.trim() && touched.lastname && (
                            <p style={{ color: "red" }}>
                            Last Name is required 
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <div className="one-column_field mb-5">
                <div className="reg_field-cont">
                    <label>Date of Birth (Araw ng kapanganakan) *</label>
                    <input type="date" name="date_birth" placeholder="YYYY-MM-DD" required value={values.date_birth} onChange={handleChange("date_birth")} />

                </div>
            </div>
            <div className="one-column_field mb-5">
                <div className="reg_field-cont">
                    <label>Mobile Number</label>
                    <input type="text" name="mobile" placeholder="Mobile Number" className="mobile"  id="phoneNum" maxLength="11" value={values.mobile} onChange={handleChange("mobile")} onBlur={() => setTouched({ ...touched, mobile: true })} />
                    <div id="error-container">
                        
                    {!isValid && values.mobile && touched.mobile && (
                            <p style={{ color: "red" }}>
                            Enter valid mobile number (ex. 09123456789)
                            </p>
                        )}

                    </div>
                </div>
            </div>

            <div className="one-column_field mb-5">
                <div className="reg_field-cont">
                    <button onClick={nextStep} 
                        disabled={!isValid} className={!isValid ? "validate_submit disabled" : "validate_submit"}
                        >Next</button>
                </div>
            </div>
        </div>
    </>
}