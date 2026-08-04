import { Link } from "react-router-dom"
import { useEffect, useState } from "react";

import StepOne from "../components/StepOne";
import StepTwo from "../components/StepTwo";

// import { fetchApi } from "../store/api";
import logo from "../assets/2025-assets/section1-logo.png";

const Online_Register = () => {
    
    const [step, setStep] = useState(1);

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
 
                    {step === 1 && (
                        <StepOne
                        nextStep={nextStep}
                        handleChange={handleChange}
                        values={formData}
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


			

                    {/* DIto lalagay */}
                </div>
            </div>
        </div>
        </>
}

export default Online_Register;