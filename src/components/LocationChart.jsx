import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { fetchApi } from "../store/api";

export default function LocationChart({ filter, onLoadingChange }) {

    const [location_data, setLocationData] = useState([]);
    useEffect(() => {
        let isMounted = true;

        onLoadingChange?.(true);

        fetchApi(`/wp-json/custom/v1/location-data?location=${filter}`)
            .then(res => res.json())
            .then(json => {
                if (!isMounted) {
                    return;
                }

                setLocationData(json);
            })
            .catch(err => console.error(err))
            .finally(() => {
                if (!isMounted) {
                    return;
                }

                onLoadingChange?.(false);
            });

        return () => {
            isMounted = false;
        };
    }, [filter, onLoadingChange]);

    const dynamicHeight = location_data.length * 50;

    const series = [
        {
        name: "Registrants",
        data: location_data.map(item => item.count),
        },
    ];

    const options = {
        chart: {
        type: "bar",
        },
        plotOptions: {
        bar: {
            horizontal: true, // ✅ THIS makes it horizontal
            borderRadius: 5,
        },
        },
        xaxis: {
        categories: location_data.map(item => item.data_location),
        },
        colors: ["#3b82f6"],
        dataLabels: {
        enabled: true,
        },
    };

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="bar"
      height={dynamicHeight}
    />
  );
}
