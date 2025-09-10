
import { useState } from "react";
import { Card, } from "../components/ui/Card";
import SearchInput from "../components/ui/SearchInput";
import PropertyPieChart from "../components/chart/PieChart";
import { propertyData, propertyOverviewData } from "../components/data/propertyData";


export const Property = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(propertyData.length / itemsPerPage);

  // Slice propertyData for current page
  const currentProperties = propertyData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  
  return (
    <div className="h-full w-full space-y-12">
      {/* Property Overview Cards */}
      <div className="grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-6">
        {propertyOverviewData.map((data, index) => (
          <Card
            key={index}
            icon={data.icon}
            value={data.value}
            label={data.label}
            color={data.color}
            bgColor={data.bgColor}
          />
        ))}
      </div>

      {/* Property List as Divs */}
      <div className="grid grid-cols-7 gap-6 items-stretch">
        {/* Table Section */}
        <div className="bg-white col-span-5 rounded-xl p-6 shadow flex flex-col">
          <div className="w-full flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold text-primary">
              Property Overview
            </h1>
            <SearchInput />
          </div>

          {/* Table Header */}
          <div className="flex w-full gap-2 rounded-lg bg-purple-100 font-medium text-slate-900 py-2 my-2 px-3">
            <div className="w-10">Id</div>
            <div className="w-60">Property Listing</div>
            <div className="w-40">Vendor</div>
            <div className="w-32">Type</div>
            <div className="w-40">Location</div>
            <div className="w-32">Price</div>
            <div className="w-20">Action</div>
          </div>

          {/* Property Rows */}
          <div className="flex flex-col gap-3 flex-1">
            {currentProperties.map((property) => (
              <div
                key={property.id}
                className="flex px-3 gap-2 items-center rounded-xl py-3 hover:bg-purple-100 hover:translate-y-1 transform transition duration-300 shadow"
              >
                <div className="w-10 text-sm text-gray-700">{property.id}</div>

                <div className="w-60 flex items-center gap-2">
                  <div className="w-12 h-10 rounded-sm overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src={property.img}
                      alt={property.propertyTitle}
                    />
                  </div>
                  <p className="text-sm text-gray-700 ">
                    {property.propertyTitle}
                  </p>
                </div>

                <div className="w-40 text-sm text-gray-700">
                  {property.vendor}
                </div>
                <div className="w-32 text-sm text-gray-700">
                  {property.PropertyType}
                </div>
                <div className="w-40 text-sm text-gray-700">
                  {property.location}
                </div>
                <div className="w-32 text-sm text-gray-700">
                  {property.price}
                </div>
                <div className="w-20 text-sm text-blue-500">
                  <button className="hover:underline text-primary">View</button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-600">
              Showing {currentProperties.length} of {propertyData.length}{" "}
              properties
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1
                      ? "bg-primary text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="col-span-2 bg-white rounded-xl p-6 h-[400px]">
          <div className="w-full h-[300px]">
            <PropertyPieChart />
          </div>
        </div>
      </div>
    </div>
  );
};
