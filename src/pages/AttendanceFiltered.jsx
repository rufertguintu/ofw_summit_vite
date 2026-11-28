import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReactApexChart from "react-apexcharts";
import { fetchApi } from "../store/api";

const breakdowns = [
    { key: "ofw_type", title: "By OFW Type" },
    { key: "region", title: "By Region" },
    { key: "province", title: "By Province" },
    { key: "city", title: "By City" },
];

function AttendanceBarChart({ title, rows }) {
    const categories = rows.map((row) => row.label);
    const series = [{ name: "Attended", data: rows.map((row) => Number(row.count) || 0) }];
    const options = {
        chart: { type: "bar", toolbar: { show: false }, fontFamily: "inherit" },
        plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: "65%", distributed: false } },
        dataLabels: { enabled: true, formatter: (value) => value.toLocaleString() },
        xaxis: { categories, labels: { formatter: (value) => Number(value).toLocaleString() }, title: { text: "Attendees" } },
        yaxis: { labels: { maxWidth: 220 } },
        colors: ["#3babc8"],
        grid: { borderColor: "#e5e7eb" },
        tooltip: { y: { formatter: (value) => `${value.toLocaleString()} attendees` } },
        noData: { text: "No attendance data" },
    };

    return (
        <section className="min-w-0 rounded-lg bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">{title}</h2>
            {rows.length ? (
                <div className="overflow-y-scroll" style={{ maxHeight: 520 }}>
                    <ReactApexChart options={options} series={series} type="bar" height={Math.max(260, rows.length * 38)} />
                </div>
            ) : <p className="py-10 text-center text-gray-500">No records to display.</p>}
        </section>
    );
}

export default function AttendanceAnalytics() {
    const [data, setData] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        fetchApi("/wp-json/custom/v1/attendance-analytics")
            .then(async (response) => {
                const result = await response.json();
                if (!response.ok) throw new Error(result.message || "Unable to load attendance analytics.");
                return result;
            })
            .then((result) => { if (active) setData(result); })
            .catch((fetchError) => { if (active) setError(fetchError.message || "Unable to load attendance analytics."); });

        return () => { active = false; };
    }, []);

    return (
        <div className="p-[40px] attendance-dashboard">
            <Link className="text-blue-700 hover:underline" to="/dashboard">Back to Dashboard</Link>
            <h1 className="mb-2 mt-8 text-2xl font-semibold">Attendance Analytics</h1>
            <p className="mb-6 text-gray-600">Counts of registrants marked as attended (attend_event = 0).</p>

            {error ? <p className="rounded bg-red-100 p-4 text-red-700">{error}</p> : (
                <>
                    <section className="mb-6 rounded-lg bg-[#3babc8] p-6 text-white shadow-sm">
                        <p className="text-sm font-medium text-white">Total Attendees</p>
                        <p className="mt-1 text-4xl font-semibold text-white">{data ? Number(data.total || 0).toLocaleString() : "..."}</p>
                    </section>
                    <div className="grid gap-6 xl:grid-cols-2">
                        {breakdowns.map(({ key, title }) => (
                            <AttendanceBarChart key={key} title={title} rows={data?.[key] ?? []} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
