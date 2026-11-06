import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { fetchApi } from "../store/api";

const COMPARISONS = [
    { key: "attend_event", title: "Attendance" },
    { key: "ofw_type", title: "OFW Type" },
    { key: "admin_verified", title: "Validation Status" },
    { key: "type_registrant", title: "Registrant Type" },
];

const chartColors = ["#10b981", "#6366f1", "#f59e0b"];

function ComparisonChart({ title, comparison }) {
    const options = {
        chart: {
            type: "bar",
            toolbar: { show: false },
        },
        colors: chartColors,
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "55%",
                borderRadius: 4,
            },
        },
        dataLabels: { enabled: false },
        xaxis: { categories: comparison.labels },
        yaxis: {
            labels: {
                formatter: (value) => Math.round(value).toLocaleString(),
            },
        },
        legend: { position: "top" },
        tooltip: {
            y: {
                formatter: (value) => value.toLocaleString(),
            },
        },
    };

    const series = [
        { name: "2024", data: comparison["2024"] },
        { name: "2025", data: comparison["2025"] },
        { name: "Current", data: comparison.current },
    ];

    return (
        <section className="border border-table-line rounded-lg bg-layer p-4">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <ReactApexChart options={options} series={series} type="bar" height={350} />
        </section>
    );
}

export default function DataComparison() {
    const [data, setData] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        fetchApi("/wp-json/custom/v1/data-comparison")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Unable to load comparison data.");
                }
                return response.json();
            })
            .then((result) => {
                if (isMounted) {
                    setData(result);
                }
            })
            .catch((requestError) => {
                console.error(requestError);
                if (isMounted) {
                    setError("Unable to load comparison data.");
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    if (error) {
        return (
            <div className="admin-divider border p-6 rounded-[10px]" role="alert">
                {error}
            </div>
        );
    }

    if (!data) {
        return (
            <div className="admin-divider border p-6 rounded-[10px]">
                Loading comparison data...
            </div>
        );
    }

    return (
        <div className="admin-divider border p-3 rounded-[10px]">
            <div className="px-6 py-3">
                <h1 className="text-3xl font-bold">Data Comparison</h1>
                <p className="mt-1 text-muted-foreground-1">
                    Compare 2025 registration data with current records.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3">
                <div className="border border-table-line rounded-lg bg-layer p-5">
                    <p className="text-sm text-muted-foreground-1">Total Registered</p>
                    <div className="mt-3 flex flex-wrap gap-8">
                    <div>
                            <p className="text-2xl font-bold text-foreground">
                                {data.total_registered["2024"].toLocaleString()}
                            </p>
                            <p className="text-sm text-muted-foreground-1">2024</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground">
                                {data.total_registered["2025"].toLocaleString()}
                            </p>
                            <p className="text-sm text-muted-foreground-1">2025</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground">
                                {data.total_registered.current.toLocaleString()}
                            </p>
                            <p className="text-sm text-muted-foreground-1">Current</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 p-3">
                {COMPARISONS.map(({ key, title }) => (
                    <ComparisonChart key={key} title={title} comparison={data[key]} />
                ))}
            </div>
        </div>
    );
}
