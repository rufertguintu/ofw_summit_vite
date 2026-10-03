import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { fetchApi } from "../store/api";

const formatLabel = (key) =>
  String(key)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") return "N/A";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};

const GlobalRecordView = () => {
  const token = localStorage.getItem("token");
  const { recordId } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retrieving, setRetrieving] = useState(false);
  const [retrieveResult, setRetrieveResult] = useState(null);

  const handleRetrieve = async () => {
    if (!window.confirm("Retrieve this account and restore all of its data?")) return;

    setRetrieving(true);
    setRetrieveResult(null);

    try {
      const response = await fetchApi(`/wp-json/custom/v1/global-records/${encodeURIComponent(recordId)}/retrieve`, {
        method: "POST",
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.message || "Unable to retrieve this account.");
      }
      setRetrieveResult({ type: "success", message: payload.message || "Account retrieved successfully." });
      navigate(`/records/${payload.user_id}/view-profile`);
      return;
    } catch (retrieveError) {
      setRetrieveResult({ type: "error", message: retrieveError.message || "Unable to retrieve this account." });
    }

    setRetrieving(false);
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError("");

    fetchApi(`/wp-json/custom/v1/global-records/${encodeURIComponent(recordId)}`)
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.message || "Unable to load record details.");
        }
        if (!isMounted) return;
        const data = payload?.data ?? payload;
        setRecord(data?.record || data?.summary || data);
      })
      .catch((fetchError) => {
        if (isMounted) setError(fetchError.message || "Unable to load record details.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [recordId]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const entries = record ? Object.entries(record) : [];

  return (
    <div className="p-[40px]">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Record Details</h2>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-lg bg-[#ff902b] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handleRetrieve}
            disabled={retrieving || loading || !!error}
          >
            {retrieving ? "Retrieving..." : "Retrieved this Account"}
          </button>
          <Link
            to="/global-records"
            className="rounded-lg border border-table-line px-4 py-2 text-sm font-medium text-foreground no-underline"
          >
            Back to Global Records
          </Link>
        </div>
      </div>

      {retrieveResult ? (
        <div
          className={`mt-6 rounded-lg px-4 py-3 text-sm ${
            retrieveResult.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
          }`}
        >
          {retrieveResult.message}
        </div>
      ) : null}

      <div className="mt-10 overflow-x-auto rounded-lg border border-table-line bg-layer">
        {loading ? (
          <div className="px-6 py-8 text-center text-sm text-foreground">Loading record details...</div>
        ) : error ? (
          <div className="px-6 py-8 text-center text-sm text-red-600">{error}</div>
        ) : entries.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-foreground">No record details available.</div>
        ) : (
          <table className="min-w-full divide-y divide-table-line">
            <tbody className="divide-y divide-table-line">
              {entries.map(([key, value]) => (
                <tr key={key}>
                  <th className="w-64 bg-muted px-6 py-3 text-start align-top text-xs font-medium uppercase text-muted-foreground-1">
                    {formatLabel(key)}
                  </th>
                  <td className="break-words px-6 py-3 text-sm text-foreground">{formatValue(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default GlobalRecordView;
