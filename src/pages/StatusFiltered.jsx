import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import DashboardTitle from "../components/DashboardTitle";
import { fetchApi } from "../store/api";

const statusLabels = {
    incomplete: "Incomplete",
    rejected: "Rejected",
    verified: "Verified",
    return: "Returned",
    returned: "Returned",
};

const StatusFiltered = () => {
    const { status } = useParams();
    const token = localStorage.getItem("token");
    const statusName = statusLabels[status];
    const [data, setData] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!statusName) return;

        setData(null);
        setError("");

        fetchApi(`/wp-json/custom/v1/status-filtered/${status}`)
            .then(async (res) => {
                const json = await res.json();

                if (!res.ok) {
                    throw new Error(json.message || "Unable to load status totals.");
                }

                return json;
            })
            .then(setData)
            .catch((err) => setError(err.message));
    }, [status, statusName]);

    const summaryCards = [
        { value: data?.total_status, label: `Total ${statusName}` },
        { value: data?.ofw_status, label: `Total OFW` },
        { value: data?.relative_ofw_status, label: `Total Relative OFW` },
        { value: data?.online_registrant_status, label: `Total Online Registrant` },
    ];

    return (
        <div className="p-[40px]">
            <DashboardTitle />
            <h1 className="mt-10 text-2xl font-semibold">Status: {status}</h1>

            {error ? (
                <p className="mt-6 rounded bg-red-100 p-4 text-red-700">{error}</p>
            ) : (
                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {summaryCards.map(({ value, label }) => (
                        <div key={label} className="rounded bg-[#ff902b] p-8">
                            <h3 className="text-4xl font-medium text-white">
                                {data ? Number(value || 0).toLocaleString() : "..."}
                            </h3>
                            <h5 className="mt-2 font-medium text-white">{label}</h5>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StatusFiltered;
