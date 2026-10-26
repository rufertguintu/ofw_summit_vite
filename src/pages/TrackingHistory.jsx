import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchApi } from "../store/api";

const ACTIONS = ["Incomplete", "Returned", "Reject", "Validating", "Verified"];
const selectClass = "py-1.5 sm:py-2 px-3 block bg-layer border border-layer-line shadow-2xs rounded-lg sm:text-sm text-foreground";
const thClass = "px-6 py-3 text-start text-xs font-medium text-muted-foreground-1 uppercase";
const tdClass = "px-6 py-4 text-sm text-foreground";

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
                                <tr><td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>Loading history...</td></tr>
                            ) : error ? (
                                <tr><td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>{error}</td></tr>
                            ) : rows.length === 0 ? (
                                <tr><td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>No history found</td></tr>
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

                <div style={{ marginTop: "20px" }}>
                    <button onClick={() => setPage(page - 1)} disabled={page === 1}>Prev</button>
                    <span style={{ margin: "0 10px" }}>Page {page} of {totalPages}</span>
                    <button onClick={() => setPage(page + 1)} disabled={page >= totalPages}>Next</button>
                </div>
            </div>
        </div>
    );
};

export default TrackingHistory;
