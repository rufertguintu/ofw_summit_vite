import React from "react";
import { useState } from "react";

export default function StepOne({ nextStep, handleChange, values, checkError = "", checkingExisting = false }) {
    
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

    const isFirstNameValid = values.firstname.trim() !== "";
    const isLastNameValid = values.lastname.trim() !== "";
    const isMobileValid = /^09\d{9}$/.test(values.mobile);

    const isValid =
        isFirstNameValid &&
        isLastNameValid &&
        isMobileValid;

    // const isValid = 
    //     values.firstname.trim() !== "" &&
    //     values.lastname.trim() !== "" &&
    //     /^09\d{9}$/.test(values.mobile);

    return <>
        <h2>Pre-registration</h2>
        <div className="flex w-full h-1.5 bg-surface-1 rounded-full overflow-hidden" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
            <div className="flex flex-col justify-center rounded-full overflow-hidden text-xs orange text-center whitespace-nowrap transition duration-500" style={{ width: "25%" }}>
            </div>
        </div>
        <div className="reg_fields">
            <div className="one-column_field ">
                <label>First Name (Pangalan) *</label>
                <input type="text" name="firstname" className="py-2.5 sm:py-3 px-4 rounded-lg block w-full bg-layer border-layer-line sm:text-sm text-foreground placeholder:text-muted-foreground-1 focus:border-primary-focus focus:ring-primary-focus disabled:opacity-50 disabled:pointer-events-none" placeholder="First Name" required value={values.firstname} onChange={handleChange("firstname")} onBlur={() => setTouched({ ...touched, firstname: true })} style={{ borderColor: !values.firstname.trim() && touched.firstname ? "red" : "" }}/>
                {!values.firstname.trim() && touched.firstname && (
                    
                    <div className="mt-[20px] bg-red-100 border border-red-200 text-sm text-red-800 rounded-lg p-3 dark:bg-red-500/20 dark:border-red-900 dark:text-red-400" role="alert" tabIndex="-1" aria-labelledby="hs-soft-color-danger-label">
                        First Name is required 
                    </div>
                )}
            </div>
            <div className="one-column_field">
                <label>Last Name (Apelyido) *</label>
                <input type="text" name="lastname" placeholder="Last Name" className="py-2.5 sm:py-3 px-4 rounded-lg block w-full bg-layer border-layer-line sm:text-sm text-foreground placeholder:text-muted-foreground-1 focus:border-primary-focus focus:ring-primary-focus disabled:opacity-50 disabled:pointer-events-none" placeholder="Last Name" required value={values.lastname} onChange={handleChange("lastname")} onBlur={() => setTouched({ ...touched, lastname: true })} style={{ borderColor: !values.lastname.trim() && touched.lastname ? "red" : "" }}/>
                {!values.lastname.trim() && touched.lastname && (
                    <div className="mt-[20px] bg-red-100 border border-red-200 text-sm text-red-800 rounded-lg p-3 dark:bg-red-500/20 dark:border-red-900 dark:text-red-400" role="alert" tabIndex="-1" aria-labelledby="hs-soft-color-danger-label">
                        Last Name is required 
                    </div>
                )}
            </div>
            <div className="one-column_field">
                <label>Date of Birth (Araw ng kapanganakan) *</label>
                <input type="date" name="date_birth" className="py-2.5 sm:py-3 px-4 rounded-lg block w-full bg-layer border-layer-line sm:text-sm text-foreground placeholder:text-muted-foreground-1 focus:border-primary-focus focus:ring-primary-focus disabled:opacity-50 disabled:pointer-events-none" placeholder="YYYY-MM-DD" required value={values.date_birth} onChange={handleChange("date_birth")} />
            </div>
            <div className="one-column_field">
                <label>Mobile Number</label>
                <input type="text" name="mobile" placeholder="Mobile Number" className="py-2.5 sm:py-3 px-4 rounded-lg block w-full bg-layer border-layer-line sm:text-sm text-foreground placeholder:text-muted-foreground-1 focus:border-primary-focus focus:ring-primary-focus disabled:opacity-50 disabled:pointer-events-none mobile"  id="phoneNum" maxLength="11" value={values.mobile} onChange={handleChange("mobile")} onBlur={() => setTouched({ ...touched, mobile: true })} style={{ borderColor: !isMobileValid && touched.mobile ? "red" : "" }}/>
                <div id="error-container">
                    
                {!isMobileValid && values.mobile && touched.mobile && (
                        <div className="mt-[20px] bg-red-100 border border-red-200 text-sm text-red-800 rounded-lg p-3 dark:bg-red-500/20 dark:border-red-900 dark:text-red-400" role="alert" tabIndex="-1" aria-labelledby="hs-soft-color-danger-label">
                            Enter valid mobile number (ex. 09123456789)
                        </div>
                    )}

                </div>
            </div>

            <div className="one-column_field">
                <div className="reg_field-cont">
                    <button
                        onClick={nextStep}
                        disabled={!isValid || checkingExisting}
                        className={`py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-secondary-line text-secondary-foreground hover:bg-secondary-hover focus:outline-hidden focus:bg-secondary-hover  ${!isValid || !isMobileValid || checkingExisting ? "validate_submit disabled disabled:opacity-50 disabled:pointer-events-none" : "validate_submit"}`} 
                    >
                        {checkingExisting ? "Checking..." : "Next"}
                    </button>
                    {checkError && (
                        <div className="mt-[20px] bg-red-100 border border-red-200 text-sm text-red-800 rounded-lg p-3 dark:bg-red-500/20 dark:border-red-900 dark:text-red-400" role="alert" tabIndex="-1" aria-labelledby="hs-soft-color-danger-label">
                            {checkError}
                        </div>
                    )}
                </div>
            </div>
        </div>
    </>
}