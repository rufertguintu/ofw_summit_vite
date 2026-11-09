import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchApi } from "../store/api";

const RetrievedFiltered = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        fetchApi(`/wp-json/custom/v1/retrieved-filtered/`)
            .then(async (res) => {
                const json = await res.json();

                if (!res.ok) {
                    throw new Error(json.message || "Unable to load retrieved account totals.");
                }

                return json;
            })
            .then((result) => {
                if (active) setData(result);
            })
            .catch((err) => {
                if (active) setError(err.message);
            });

        return () => {
            active = false;
        };
    }, []);

    const summaryCards = [
        { value: data?.online_registrant, label: "Total Online Registrant" },
        { value: data?.onsite_registrant, label: "Total Onsite Registrant" },
        { value: data?.mall_registrant, label: "Total Mall Registrant" },
        { value: data?.networker_registrant, label: "Total Networker" },
    ];

    const TotalRetrieved = data?.total_retrieved ?? 0;

    const TotalOFW = data?.ofw ?? 0;
    const TotalRelativeOFW = data?.relative_ofw ?? 0;

    const locationGroups = [
        { label: "Region", counts: data?.region_count },
        { label: "Province", counts: data?.province_count },
    ];

    return (
        <div className="p-[40px]">
            <Link to="/dashboard">
                Back to Dashboard
            </Link>
            <h3 className="mt-10 text-2xl font-semibold">Retrieved Account Records</h3>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <div className="rounded bg-[#ff902b] p-8">
                    <h3 className="text-4xl font-medium text-white">
                        {data ? Number(TotalRetrieved).toLocaleString() : "..."}
                    </h3>
                    <h5 className="mt-2 font-medium text-white">Total Retrieved</h5>
                </div>
            </div>

            <h3 className="mt-6 text-2xl font-semibold" style={{ marginTop: "2rem" }}>OFW and Relative OFW</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                
                <div className="rounded bg-[#ff902b] p-8">
                    <h3 className="text-4xl font-medium text-white">
                        {data ? Number(TotalOFW).toLocaleString() : "..."}
                    </h3>
                    <h5 className="mt-2 font-medium text-white">Total OFW</h5>
                </div>
                <div className="rounded bg-[#ff902b] p-8">
                    <h3 className="text-4xl font-medium text-white">
                        {data ? Number(TotalRelativeOFW).toLocaleString() : "..."}
                    </h3>
                    <h5 className="mt-2 font-medium text-white">Total Relative OFW</h5>
                </div>
            </div>
            <h3 className="mt-6 text-2xl font-semibold" style={{ marginTop: "2rem" }}>Type of Registrants</h3>

            {error ? (
                <p role="alert" className="mt-6 rounded bg-red-100 p-4 text-red-700">{error}</p>
            ) : (
                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    {summaryCards.map(({ value, label }) => (
                        <div key={label} className="rounded bg-[#ff902b] p-8">
                            <h3 className="text-4xl font-medium text-white">
                                {data ? Number(value).toLocaleString() : "..."}
                            </h3>
                            <h5 className="mt-2 font-medium text-white">{label}</h5>
                        </div>
                    ))}
                </div>
            )}
            <h3 className="mt-6 text-2xl font-semibold" style={{ marginTop: "2rem" }}>Locations</h3>

            {data && (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {locationGroups.map(({ label, counts }) => (
                        <div key={label} className="rounded bg-[#ff902b] p-8 text-white">
                            <h4 className="text-2xl font-semibold text-white">{label} Count</h4>
                            {Object.entries(counts).length ? (
                                <ul className="mt-2">
                                    {Object.entries(counts).map(([location, count]) => (
                                        <li key={location}>
                                            {location}: {Number(count).toLocaleString()}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="mt-2">No {label.toLowerCase()} data available.</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RetrievedFiltered;