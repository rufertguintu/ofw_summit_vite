export const API_BASE_URL =
    "https://ofwsummit-sandbox.villarfoundation.com.ph";
 
// export const API_BASE_URL = "http://localhost:8005";
 
export const fetchApi = async (
    endpoint: string,
    options: RequestInit = {}
) => {
    const token = localStorage.getItem("token");
    const headers = new Headers(options.headers || {});
    const isFormData = options.body instanceof FormData;
    const url = `${API_BASE_URL}${endpoint}`;
 
    if (token && !headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${token}`);
    }
 
    // Ensure correct Content-Type handling.
    if (isFormData) {
        headers.delete("Content-Type");
    } else if (options.body && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }
 
    const startTime = performance.now();
 
    console.groupCollapsed(`[API] ${options.method || "GET"} ${endpoint}`);
 
    console.log("Request details:", {
        url,
        method: options.method || "GET",
        isFormData,
        hasAuthorization: headers.has("Authorization"),
        contentType: headers.get("Content-Type"),
    });
 
    if (isFormData) {
        const formData = options.body as FormData;
 
        console.table(
            Array.from(formData.entries()).map(([key, value]) => ({
                field: key,
                type: value instanceof File ? "File" : "Text",
                mimeType: value instanceof File ? value.type : "-",
                sizeMB: value instanceof File
                    ? (value.size / 1024 / 1024).toFixed(2)
                    : "-",
            }))
        );
 
        console.log(
            "Content-Type will be generated automatically by the browser."
        );
    }
 
    try {
        const response = await fetch(url, {
            ...options,
            headers,
        });
 
        console.log("Response details:", {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
            redirected: response.redirected,
            contentType: response.headers.get("Content-Type"),
            duration: `${(performance.now() - startTime).toFixed(2)}ms`,
        });
 
        if (!response.ok) {
            console.error("API request failed:", {
                endpoint,
                status: response.status,
                statusText: response.statusText,
            });
 
            // Clone so the original response remains readable.
            const errorResponse = await response.clone().text();
 
            console.log("Error response details:", {
                length: errorResponse.length,
                isHTML: /^\s*</.test(errorResponse),
            });
 
            try {
                const errorData = JSON.parse(errorResponse);
 
                console.error("API error code:", errorData?.code);
            } catch {
                console.warn("Error response is not JSON.");
            }
        }
 
        return response;
 
    } catch (error) {
        console.error("API network error:", error);
        throw error;
 
    } finally {
        console.groupEnd();
    }
};