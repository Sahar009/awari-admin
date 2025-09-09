"use client";

import React from "react";
import Chart from "react-apexcharts";

const VendorLocationChart = () => {
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "polarArea",
    },
    labels: [
      "Lagos",
      "Ibadan",
      "Port Harcourt",
      "Benin",
      "Abuja",
      "Akure",
      "Warri",
      "Others",
    ],
    stroke: {
      colors: ["#fff"],
    },
    fill: {
      opacity: 0.9,
    },
    legend: {
      position: "bottom",
    },
    colors: [
      "#3b82f6", // Lagos - Blue
      "#10b981", // Ibadan - Green
      "#f59e0b", // Port Harcourt - Amber
      "#ef4444", // Benin - Red
      "#8b5cf6", // Abuja - Purple
      "#14b8a6", // Akure - Teal
      "#f97316", // Warri - Orange
      "#64748b", // Others - Gray
    ],
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 300,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const series = [120, 80, 65, 40, 95, 30, 25, 50]; 
  // Example vendor counts per location

  return (
    <div className="bg-white shadow rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4">Vendor Locations in Nigeria</h2>
      <Chart options={options} series={series} type="polarArea" height={300} width={200} />
    </div>
  );
};

export default VendorLocationChart;
