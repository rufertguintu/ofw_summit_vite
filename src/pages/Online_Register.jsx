import { useState } from "react";
import { useNavigate } from "react-router-dom";

import StepOne from "../components/StepOne";
import StepTwo from "../components/StepTwo";
import { fetchApi } from "../store/api";

import logo from "../assets/2025-assets/section1-logo.png";
import Loading from "../assets/loading-reg.gif";

const RETRIEVED_ACCOUNT_STORAGE_KEY = "retrievedAccountContext";

const Online_Register = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [checkingExisting, setCheckingExisting] = useState(false);
    const [checkError, setCheckError] = useState("");
    const [showExistingPrompt, setShowExistingPrompt] = useState(false);
    const [existingPromptError, setExistingPromptError] = useState("");
    const [retrievingExistingData, setRetrievingExistingData] = useState(false);
    const [matchedYear, setMatchedYear] = useState(null);
    const [showExistingPasswordStep, setShowExistingPasswordStep] = useState(false);
    const [existingPassword, setExistingPassword] = useState("");
    const [existingConfirmPassword, setExistingConfirmPassword] = useState("");
    const [existingPasswordError, setExistingPasswordError] = useState("");

    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        date_birth: "",
        mobile: "",
        email: "",
        relative_company: "",
        company_relationship: "",
        company_relative_fullname: "",
        ofw_type: "",
        relationship: "",
        firstname_relative: "",
        lastname_relative: "",
        emailaddress: "",
        hometown: "",
        password: "",
        confirmpw: "",
        agree: "",
    });

    
    const handleChange = (field) => (e) => {
        setFormData((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));
    };

    const getExistingRegistrantPayload = () => ({
        firstname: formData.firstname.trim(),
        lastname: formData.lastname.trim(),
        date_birth: formData.date_birth,
    });

    const resetExistingPasswordStep = () => {
        setShowExistingPasswordStep(false);
        setExistingPassword("");
        setExistingConfirmPassword("");
        setExistingPasswordError("");
    };

    const getExistingPasswordValidationError = () => {
        const trimmedPassword = existingPassword.trim();
        const trimmedConfirmPassword = existingConfirmPassword.trim();

        if (!trimmedPassword || !trimmedConfirmPassword) {
            return "Please enter and confirm your new password.";
        }

        if (trimmedPassword.length < 8) {
            return "Password must be at least 8 characters.";
        }

        if (trimmedPassword !== trimmedConfirmPassword) {
            return "Passwords do not match.";
        }

        return "";
    };

    const canRetrieveExistingAccount = showExistingPasswordStep
        && existingPassword.trim() !== ""
        && existingConfirmPassword.trim() !== ""
        && !getExistingPasswordValidationError();
    const shouldShowExistingPasswordValidation = existingPassword !== "" || existingConfirmPassword !== "";

    const handleStepOneNext = async () => {
        setCheckError("");
        setExistingPromptError("");
        resetExistingPasswordStep();

        try {
            setCheckingExisting(true);
            const response = await fetchApi("/wp-json/custom/v1/existing-registrant-check", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(getExistingRegistrantPayload()),
            });

            const data = await response.json();
            if (!response.ok) {
                setCheckError(data?.message || "Unable to validate existing registration.");
                return;
            }

            if (data?.matched) {
                setMatchedYear(data?.matched_year || null);
                setShowExistingPrompt(true);
                return;
            }

            localStorage.removeItem(RETRIEVED_ACCOUNT_STORAGE_KEY);

            setStep(2);
        } catch (error) {
            console.error("Error checking existing registrant:", error);
            setCheckError("Unable to validate existing registration.");
        } finally {
            setCheckingExisting(false);
        }
    };

    const handlePrepareExistingRegistration = () => {
        setExistingPromptError("");
        setExistingPasswordError("");
        setShowExistingPasswordStep(true);
    };

    const handleProceedExistingRegistration = async () => {
        setExistingPromptError("");
        setExistingPasswordError("");

        const passwordValidationError = getExistingPasswordValidationError();
        if (passwordValidationError) {
            setExistingPasswordError(passwordValidationError);
            return;
        }

        try {
            setRetrievingExistingData(true);
            const response = await fetchApi("/wp-json/custom/v1/existing-registrant-migrate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...getExistingRegistrantPayload(),
                    password: existingPassword.trim(),
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                setExistingPasswordError(data?.message || "Unable to retrieve account.");
                return;
            }

            // Save auth data so the user is automatically logged in
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.roles?.[0] ?? "subscriber");
            localStorage.setItem("user", JSON.stringify({
                user_email: data.user_email,
                user_nicename: data.user_nicename,
                display_name: data.user_display_name,
                roles: data.roles,
            }));

            localStorage.setItem(RETRIEVED_ACCOUNT_STORAGE_KEY, JSON.stringify({
                isRetrieved: true,
                registeredYear: String(data?.matched_year || matchedYear || "").trim(),
                userEmail: data?.user_email || "",
                displayName: data?.user_display_name || "",
            }));

            navigate("/profile-dashboard");
        } catch (error) {
            console.error("Error migrating existing registrant:", error);
            setExistingPasswordError("Unable to retrieve account. Please try again.");
        } finally {
            setRetrievingExistingData(false);
        }
    };

    const handleManualRegister = () => {
        localStorage.removeItem(RETRIEVED_ACCOUNT_STORAGE_KEY);
        setShowExistingPrompt(false);
        setExistingPromptError("");
        resetExistingPasswordStep();
        setStep(2);
    };

    
    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);


    return <>
        <div className="registration-page join-now-page join-register">
            <div className="custom-container">
                <div className="registration-info">
                    <div className="join-event-instruction">
                        <img src={logo} alt=""/>
                        <ul>
                            <li>
                                <h3>Step 1</h3>
                                <h5>Pre-registration (Checking)</h5>
                            </li>
                            <li>
                                <h3>Step 2</h3>
                                <h5>Event Registration including Profile Update</h5>
                            </li>
                            <li>
                                <h3>Step 3</h3>
                                <h5>Account and Document Verification</h5>
                            </li>
                            <li>
                                <h3>Step 4</h3>
                                <h5>Attend the Event</h5>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="reg-form-section">
                    {showExistingPrompt ? (
                        <div className="match-record-result">
                            <h3>You have been previously registered</h3>
                            <p>
                                We found your record{matchedYear ? ` in ${matchedYear}` : ""}. Do you want to proceed with your previous data?
                            </p>
                            {existingPromptError && (
                                <p style={{ color: "red" }}>{existingPromptError}</p>
                            )}
                            {!showExistingPasswordStep ? (
                                <div className="match-record-actions">
                                    <button type="button" onClick={handlePrepareExistingRegistration} disabled={retrievingExistingData}>
                                        Proceed
                                    </button>
                                    <button type="button" onClick={handleManualRegister} disabled={retrievingExistingData}>
                                        Manual Register
                                    </button>
                                </div>
                            ) : (
                                <div className="existing-account-password-step reg_fields">
                                    <p className="existing-account-password-note">
                                        Set a new password first. The Retrieve Account button will be enabled once your password is valid.
                                    </p>
                                    <div className="two-column_field">
                                        <div className="two-column_inner-wrapper">
                                            <div className="reg_field-cont">
                                                <label htmlFor="existing-password">New Password <span className="required-field">*</span></label>
                                                <input
                                                    id="existing-password"
                                                    type="password"
                                                    value={existingPassword}
                                                    onChange={(e) => {
                                                        setExistingPassword(e.target.value);
                                                        setExistingPasswordError("");
                                                    }}
                                                    placeholder="Enter new password"
                                                />
                                            </div>
                                            <div className="reg_field-cont">
                                                <label htmlFor="existing-confirm-password">Confirm Password <span className="required-field">*</span></label>
                                                <input
                                                    id="existing-confirm-password"
                                                    type="password"
                                                    value={existingConfirmPassword}
                                                    onChange={(e) => {
                                                        setExistingConfirmPassword(e.target.value);
                                                        setExistingPasswordError("");
                                                    }}
                                                    placeholder="Confirm new password"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {(existingPasswordError || shouldShowExistingPasswordValidation) && (existingPasswordError || getExistingPasswordValidationError()) && (
                                        <p className="existing-account-password-error">
                                            {existingPasswordError || getExistingPasswordValidationError()}
                                        </p>
                                    )}
                                    {retrievingExistingData ? (
                                        <div className="existing-account-loader">
                                            <img src={Loading} width="160" alt="Retrieving account" />
                                            <p>Retrieving account...</p>
                                        </div>
                                    ) : (
                                        <div className="match-record-actions">
                                            <button
                                                type="button"
                                                onClick={handleProceedExistingRegistration}
                                                disabled={!canRetrieveExistingAccount || retrievingExistingData}
                                                className={!canRetrieveExistingAccount || retrievingExistingData ? "disabled" : ""}
                                            >
                                                Retrieve Account
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleManualRegister}
                                                disabled={retrievingExistingData}
                                            >
                                                Manual Register
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            {step === 1 && (
                                <StepOne
                                    nextStep={handleStepOneNext}
                                    handleChange={handleChange}
                                    values={formData}
                                    checkError={checkError}
                                    checkingExisting={checkingExisting}
                                />
                            )}
                            {step === 2 && (
                                <StepTwo
                                    nextStep={nextStep}
                                    prevStep={prevStep}
                                    handleChange={handleChange}
                                    values={formData}
                                />
                            )}
                        </>
                    )}


			

                    {/* DIto lalagay */}
                </div>
            </div>
        </div>
        </>
}

export default Online_Register;