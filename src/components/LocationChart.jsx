import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { fetchApi } from "../store/api";

export default function LocationChart({filter}) {

    const [location_data, setLocationData] = useState([]);
    const [data, setData] = useState(0);
    useEffect(() => {
        fetchApi(`/wp-json/custom/v1/location-data?location=${filter}`)
            .then(res => res.json())
            .then(json => setLocationData(json))
            .catch(err => console.error(err));
    }, [filter]);

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
