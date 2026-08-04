import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

export default function OFWtypeChart({ofw, relativeOfw}) {
    
    // const [series, setSeries] = useState([]);
    // const [labels, setLabels] = useState([]);

    const options = {
    chart: { type: "pie" },    
    
    labels: [
      `OFW (${ofw?.toLocaleString()})`,
      `Relative OFW (${relativeOfw?.toLocaleString()})`
    ],
    colors: ["#f59e0b", "#ef4444"],
    legend: {
      position: "bottom",
    },

    };

    const series = [ofw, relativeOfw];

  return (
    
    <div>
      {series.length > 0 ? (
        <ReactApexChart
          options={options}
          series={series}
          type="pie"
          height={550}
        />
      ) : (
        <p>Loading chart...</p> // ✅ loading state
      )}
    </div>

    
  );
}

