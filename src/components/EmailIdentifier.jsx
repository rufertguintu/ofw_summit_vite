import { useState } from "react";
import { fetchApi } from "../store/api";

const MAX_EMAIL_ATTEMPTS = 3;
const alertBase = "mt-[20px] border text-sm rounded-lg p-3";

export default function EmailIdentifier({ values, onCreateNew, onBack }) {
    const [email, setEmail] = useState("");
    const [attempts, setAttempts] = useState(0);
    const [status, setStatus] = useState({ state: "idle", message: "" });

    const isEmailValid = /^\S+@\S+\.\S+$/.test(email.trim());
    const exceeded = attempts >= MAX_EMAIL_ATTEMPTS;
    const found = status.state === "found";

    const handleVerify = async () => {
        setStatus({ state: "checking", message: "Validating email..." });
        try {
            const response = await fetchApi("/wp-json/custom/v1/existing-registrant-email-check", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstname: values.firstname.trim(),
                    lastname: values.lastname.trim(),
                    date_birth: values.date_birth,
                    email: email.trim(),
                }),
            });
            const data = await response.json();

            if (response.ok && data?.valid) {
                setStatus({ state: "found", message: "Account Found! Please check your email address and click the link to change your password." });
                return;
            }

            if (response.status === 404 || response.status === 429) {
                setAttempts(response.status === 429
                    ? MAX_EMAIL_ATTEMPTS
                    : MAX_EMAIL_ATTEMPTS - (data?.data?.attempts_left ?? 0));
            }
            setStatus({ state: "invalid", message: data?.message || "Unable to validate email." });
        } catch (error) {
            setStatus({ state: "invalid", message: "Unable to validate email." });
        }
    };

    return (
        <div className="match-record-result">
            <h3>We found a previous record</h3>
            <p>Enter the email address you used before so we can help you recover your account.</p>

            {!found && !exceeded && (
                <div className="one-column_field">
                    <label>Email Address *</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        className="py-2.5 sm:py-3 px-4 rounded-lg block w-full bg-layer border-layer-line sm:text-sm text-foreground"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={status.state === "checking"}
                    />
                    <div className="match-record-actions">
                        <button
                            type="button"
                            className={`proceed-button ${!isEmailValid || status.state === "checking" ? "disabled" : ""}`}
                            onClick={handleVerify}
                            disabled={!isEmailValid || status.state === "checking"}
                        >
                            {status.state === "checking" ? "Checking..." : "Find my account"}
                        </button>
                        <button type="button" className="manual-register-button" onClick={onBack}>Back</button>
                    </div>
                </div>
            )}

            {status.message && (
                <div
                    className={`${alertBase} ${found ? "bg-green-100 border-green-200 text-green-800" : status.state === "invalid" ? "bg-red-100 border-red-200 text-red-800" : "bg-gray-100 border-gray-200 text-gray-800"}`}
                    role="alert"
                >
                    {status.message}
                    {status.state === "invalid" && !exceeded && ` (${MAX_EMAIL_ATTEMPTS - attempts} of ${MAX_EMAIL_ATTEMPTS} attempts left)`}
                </div>
            )}

            {exceeded && !found && (
                <>
                    <p>You have used all {MAX_EMAIL_ATTEMPTS} attempts. We suggest creating a new account instead.</p>
                    <div className="match-record-actions">
                        <button type="button" className="proceed-button" onClick={onCreateNew}>Create New Account</button>
                    </div>
                </>
            )}
        </div>
    );
}
