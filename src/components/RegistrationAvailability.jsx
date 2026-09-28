import { useEffect, useState } from "react";
import { fetchApi } from "../store/api";

/**
 * Hides a registration form while its corresponding maintenance flag is on.
 * The API flags use maintenance semantics: true means the page is closed.
 */
export default function RegistrationAvailability({ setting, title, children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadAvailability = async () => {
      try {
        const response = await fetchApi("/wp-json/custom/v1/settings");
        if (!response.ok) throw new Error("Unable to load registration settings.");

        const settings = await response.json();
        if (isMounted) setIsClosed(Boolean(settings?.[setting]));
      } catch (error) {
        // Keep registration available if the settings endpoint is temporarily unavailable.
        console.error(error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadAvailability();
    return () => {
      isMounted = false;
    };
  }, [setting]);

  if (isLoading) {
    return (
      <div className="registration-page join-now-page">
        <div className="custom-container py-5 text-center">Loading registration...</div>
      </div>
    );
  }

  if (isClosed) {
    return (
      <div className="registration-page join-now-page">
        <div className="custom-container py-5 text-center">
          <h2>{title} is currently closed</h2>
          <p>Please check back later for updates.</p>
        </div>
      </div>
    );
  }

  return children;
}
