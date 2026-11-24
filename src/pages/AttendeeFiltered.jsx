import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchApi } from "../store/api";

const attendanceLabels = {
    yes: "Yes",
    no: "No",
    attended: "Yes",
    not_attended: "No",
};

const summaryFields = [
    { key: "incomplete", label: "Incomplete" },
    { key: "reject", label: "Rejected" },
    { key: "verified", label: "Verified" },
    { key: "returned", label: "Returned" },
    { key: "validation", label: "Validating" },
    { key: "ofw", label: "OFW" },
    { key: "relative_ofw", label: "Relative of OFW" },
];

export default function AttendeeFiltered() {
    // App route declares this segment as :attendee.
    const { attendee: attendance } = useParams();
    const [data, setData] = useState(null);
    const [error, setError] = useState("");
    const attendanceName = attendanceLabels[attendance?.toLowerCase()] || attendance;

    useEffect(() => {
        if (!attendance) return;

        let active = true;
        setData(null);
        setError("");

        fetchApi(`/wp-json/custom/v1/attendance-filtered/${encodeURIComponent(attendance)}`)
            .then(async (res) => {
                const json = await res.json();
                if (!res.ok) throw new Error(json.message || "Unable to load attendance totals.");
                return json;
            })
            .then((result) => {
                if (active) setData(result);
            })
            .catch((err) => {
                if (active) setError(err.message || "Unable to load attendance totals.");
            });

        return () => {
            active = false;
        };
    }, [attendance]);
    
    console.log(data);

    const summaryCards = [
        { key: "attendance_total", label: `Total Attended (${attendanceName})` },
        ...summaryFields,
    ];

    return (
        <div className="p-[40px]">
            <Link to="/dashboard">Back to Dashboard</Link>
            <h1 className="mt-10 text-2xl font-semibold">Attendee Overview: {attendanceName}</h1>

            {error ? (
                <p className="mt-6 rounded bg-red-100 p-4 text-red-700">{error}</p>
            ) : (
                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {summaryCards.map(({ key, label }) => (
                        <div key={key} className="rounded bg-[#3babc8] p-8">
                            <h2 className="text-4xl font-medium text-white">
                                {data ? Number(data[key] || 0).toLocaleString() : "..."}
                            </h2>
                            <p className="mt-2 font-medium text-white">{label}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
