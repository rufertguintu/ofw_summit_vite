import React, { useEffect, useState } from "react";
import { Navigate, useParams, Link } from "react-router-dom";
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

    console.log(data?.province_count);
    const summaryCards = [
        { value: data?.total_status, label: `Total ${statusName}` },
        { value: data?.ofw_status, label: `Total OFW` },
        { value: data?.relative_ofw_status, label: `Total Relative OFW` },
        { value: data?.online_registrant_status, label: `Total Online Registrant` },
        { value: data?.onsite_registrant_status, label: `Total Onsite Registrant` },
    ];

    return (
        <div className="p-[40px]">
            <Link to="/dashboard">
                Back to Dashboard
            </Link>
            <h3 className="mt-10 text-2xl font-semibold">Status: {status}</h3>

            {error ? (
                <p className="mt-6 rounded bg-red-100 p-4 text-red-700">{error}</p>
            ) : (
                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
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

            <div className="mt-6 p-4 text-red-700 rounded bg-[#ff902b] p-8">
                <h4 className="text-2xl font-semibold text-white">Region Count</h4>
                {data?.region_count &&
                    Object.entries(data.region_count).map(([region, count]) => (
                        <div key={region} className="text-white">
                            {region}: {count}
                        </div>
                    ))
                }
            </div>
            <div className="mt-6 p-4 text-red-700 rounded bg-[#ff902b] p-8">
                <h4 className="text-2xl font-semibold text-white">Province Count</h4>
                {data?.province_count &&
                    Object.entries(data.province_count).map(([province, count]) => (
                        <div key={province} className="text-white">
                            {province}: {count}
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default StatusFiltered;