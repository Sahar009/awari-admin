import Chart from "react-apexcharts";

const PropertyPieChart = () => {
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "pie",
      height: "100%", 
      width: "100%",
    },
    labels: ["Rent", "Sales", "Apartments"],
    colors: ["#3b82f6", "#10b981", "#f59e0b"],
    legend: {
      position: "bottom",
    },
    dataLabels: {
      formatter: (val: number, opts?: any) =>
        `${opts.w.config.labels[opts.seriesIndex]}: ${val.toFixed(1)}%`,
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            width: "100%",
            height: 250,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const series = [45, 30, 25];

  return (
    <div className="w-full h-[350px] flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Available Properties</h2>
      {/* Wrapper ensures chart fits parent div */}
      <div className="flex-1">
        <Chart options={options} series={series} type="pie" height="100%" width="100%" />
      </div>
    </div>
  );
};

export default PropertyPieChart;
