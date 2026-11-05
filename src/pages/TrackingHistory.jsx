import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchApi } from "../store/api";

const ACTIONS = ["Incomplete", "Returned", "Reject", "Validating", "Verified"];
const selectClass = "py-1.5 sm:py-2 px-3 block bg-layer border border-layer-line shadow-2xs rounded-lg sm:text-sm text-foreground";
const thClass = "px-6 py-3 text-start text-xs font-medium text-muted-foreground-1 uppercase";
const tdClass = "px-6 py-4 text-sm text-foreground";

const getPageItems = (page, total) => {
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    const items = new Set([1, total, page - 1, page, page + 1]);
    const sorted = [...items].filter(n => n >= 1 && n <= total).sort((a, b) => a - b);
    const result = [];
    sorted.forEach((n, i) => {
        if (i > 0 && n - sorted[i - 1] > 1) result.push("...");
        result.push(n);
    });
    return result;
};

const TrackingHistory = () => {
    const [rows, setRows] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [adminFilter, setAdminFilter] = useState("");
    const [actionFilter, setActionFilter] = useState("");
    const [participantFilter, setParticipantFilter] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        setLoading(true);
        setError("");

        const params = new URLSearchParams({ page, per_page: 10 });
        if (adminFilter) params.set("admin_name", adminFilter);
        if (actionFilter) params.set("action", actionFilter);
        if (participantFilter) params.set("participant_name", participantFilter);

        fetchApi(`/wp-json/custom/v1/tracking-history?${params.toString()}`)
            .then(res => res.json())
            .then(res => {
                if (!res.pagination) throw new Error(res.message || "Failed to load history");
                setRows(res.data);
                setAdmins(res.admins || []);
                setTotalPages(res.pagination.pages);
            })
            .catch(err => {
                console.error(err);
                setRows([]);
                setError("Unable to load tracking history.");
            })
            .finally(() => setLoading(false));
    }, [page, adminFilter, actionFilter, participantFilter]);

    return (
        <div className="admin-divider border p-3 rounded-[10px]">
            <h3 className="px-10">Tracking History</h3>

            <div className="min-w-full px-10">
                <div className="py-3 flex flex-wrap items-center gap-3">
                    <input type="text" 
                        aria-label="Participant Name"
                        className={selectClass}
                        style={{ minWidth: "250px" }}
                        value={participantFilter}
                        onChange={(e) => { setParticipantFilter(e.target.value); setPage(1); }}
                    />
                    <select
                        aria-label="Admin Name"
                        className={selectClass}
                        style={{ minWidth: "250px" }}
                        value={adminFilter}
                        onChange={(e) => { setAdminFilter(e.target.value); setPage(1); }}
                    >
                        <option value="">All Admin Names</option>
                        {admins.map(name => <option key={name} value={name}>{name}</option>)}
                    </select>
                    <select
                        aria-label="Action"
                        className={selectClass}
                        style={{ minWidth: "250px" }}
                        value={actionFilter}
                        onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
                    >
                        <option value="">All Actions</option>
                        {ACTIONS.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                </div>

                <div className="border-table-line rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-table-line">
                        <thead style={{ backgroundColor: "#F8F9FB" }}>
                            <tr>
                                <th className={thClass}>ID</th>
                                <th className={thClass}>Admin Name</th>
                                <th className={thClass}>Participant Name</th>
                                <th className={thClass}>Action</th>
                                <th className={thClass}>Remarks</th>
                                <th className={thClass}>Date</th>
                                <th className={thClass}>Action</th>
                            </tr>
                        </thead>
                        <tbody className="records-style divide-y divide-table-line">
                            {loading ? (
                                <tr><td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>Loading history...</td></tr>
                            ) : error ? (
                                <tr><td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>{error}</td></tr>
                            ) : rows.length === 0 ? (
                                <tr><td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>No history found</td></tr>
                            ) : rows.map(row => (
                                <tr key={row.id}>
                                    <td className={`${tdClass} font-medium whitespace-nowrap`}>{row.id}</td>
                                    <td className={`${tdClass} whitespace-nowrap`}>{row.admin_name}</td>
                                    <td className={`${tdClass} whitespace-nowrap`}>{row.participants_name}</td>
                                    <td className={tdClass}>{row.action}</td>
                                    <td className={tdClass}>{row.remarks}</td>
                                    <td className={`${tdClass} whitespace-nowrap`}>{row.date}</td>
                                    <td className={tdClass}>
                                        {row.user_id ? (
                                            <Link to={`/records/${row.user_id}/view-profile`} target="_blank" rel="noopener noreferrer">View</Link>
                                        ) : (
                                            <span className="text-muted-foreground-1">N/A</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        aria-label="Previous page"
                        className="size-8 rounded-full text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                    >
                        &lsaquo;
                    </button>

                    {getPageItems(page, totalPages).map((item, i) =>
                        item === "..." ? (
                            <span key={`gap-${i}`} className="px-1 text-gray-500">...</span>
                        ) : (
                            <button
                                key={item}
                                type="button"
                                onClick={() => setPage(item)}
                                className={`size-8 rounded-full text-sm ${item === page ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
                            >
                                {item}
                            </button>
                        )
                    )}

                    <button
                        type="button"
                        aria-label="Next page"
                        className="size-8 rounded-full text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none"
                        onClick={() => setPage(page + 1)}
                        disabled={page >= totalPages}
                    >
                        &rsaquo;
                    </button>

                    <label className="ms-4 flex items-center gap-2 text-sm text-gray-600">
                        Go to
                        <select
                            aria-label="Go to page"
                            className="mx-1 py-1 px-4 bg-gray-100 border border-layer-line rounded-lg text-sm text-foreground"
                            value={page}
                            onChange={(e) => setPage(Number(e.target.value))}
                        >
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                                <option key={n} value={n}>{n}</option>
                            ))}
                        </select>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default TrackingHistory;
