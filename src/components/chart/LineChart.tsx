"use client";

import React from "react";
import Chart from "react-apexcharts";

const SignupChart = () => {
  const options: ApexCharts.ApexOptions = {
    chart: {
      id: "signup-line-chart",
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"], // months
      title: {
        text: "Months",
      },
    },
    yaxis: {
      title: {
        text: "Sign Ups",
      },
    },
    stroke: {
      curve: "smooth", // smooth line
      width: 3,
    },
    markers: {
      size: 5,
    },
    colors: ["#3b82f6", "#10b981"], // blue for users, green for vendors
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
    },
    grid: {
      borderColor: "#e5e7eb",
    },
  };

  const series = [
    {
      name: "Users",
      data: [120, 150, 180, 200, 250, 300, 350], // example user data
    },
    {
      name: "Vendors",
      data: [40, 60, 80, 100, 120, 150, 180], // example vendor data
    },
  ];

  return (
    <div className="bg-white shadow rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4">Sign Up Trends</h2>
      <Chart options={options} series={series} type="line" height={300} />
    </div>
  );
};

export default SignupChart;
