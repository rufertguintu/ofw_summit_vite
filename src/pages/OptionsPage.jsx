import { useState, useEffect } from "react";
import { fetchApi } from "../store/api";

export default function OptionsPage() {
  const [settings, setSettings] = useState({
    onlineRegistration: false,
    onsiteRegistration: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [updating, setUpdating] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApi("/wp-json/custom/v1/settings")
      .then((res) => {
        if (!res.ok) throw new Error("Unable to load registration settings.");
        return res.json();
      })
      .then((data) => setSettings((prev) => ({ ...prev, ...data })))
      .catch(() => setError("Unable to load registration settings."))
      .finally(() => setIsLoading(false));
  }, []);

  const toggleRegistration = async (type) => {
    setUpdating(type);
    setError("");

    try {
      const response = await fetchApi("/wp-json/custom/v1/settings", {
        method: "POST",
        body: JSON.stringify({ [type]: !settings[type] }),
      });

      if (!response.ok) throw new Error("Unable to update registration settings.");

      const data = await response.json();
      setSettings((prev) => ({ ...prev, ...data }));
    } catch (requestError) {
      setError(requestError.message || "Unable to update registration settings.");
    } finally {
      setUpdating("");
    }
  };

  return (
    <div>
      <h2>Registration Page Settings</h2>
      <p>Use the controls below to open or close each registration page.</p>
      {error && <p className="text-red-600" role="alert">{error}</p>}

      <button
        onClick={() => toggleRegistration("onlineRegistration")}
        disabled={isLoading || updating === "onlineRegistration"}
        className={`px-4 py-2 rounded ${
          settings.onlineRegistration
            ? "bg-red-500 text-white"
            : "bg-green-500 text-white"
        }`}
      >
        {updating === "onlineRegistration" ? "Saving..." : `Online Registration: ${settings.onlineRegistration ? "CLOSED" : "OPEN"}`}
      </button>

      <button
        onClick={() => toggleRegistration("onsiteRegistration")}
        disabled={isLoading || updating === "onsiteRegistration"}
        className={`ml-3 px-4 py-2 rounded ${
          settings.onsiteRegistration
            ? "bg-red-500 text-white"
            : "bg-green-500 text-white"
        }`}
      >
        {updating === "onsiteRegistration" ? "Saving..." : `Onsite Registration: ${settings.onsiteRegistration ? "CLOSED" : "OPEN"}`}
      </button>
    </div>
  );
}
