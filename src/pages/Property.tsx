"use client";
import { useState } from "react";
import { Card } from "../components/ui/Card";
import SearchInput from "../components/ui/SearchInput";
import {
  propertyData,
  propertyOverviewData,
} from "../components/data/propertyData";

// Modal Component (simple Tailwind only)
const ReviewModal = ({ property, onClose, onApprove, onDeny }: any) => {
  if (!property) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4">Review Property Listing</h2>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">{property.propertyTitle}</h3>
          <p className="text-gray-600">
            <span className="font-medium">Vendor:</span> {property.vendor}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Type:</span> {property.PropertyType}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Location:</span> {property.location}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Price:</span> {property.price}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          {property.images?.map((img: string, i: number) => (
            <img
              key={i}
              src={img}
              alt="Property"
              className="rounded-lg border h-28 object-cover"
            />
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onDeny(property.id);
              onClose();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Deny
          </button>
          <button
            onClick={() => {
              onApprove(property.id);
              onClose();
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
};

export const Property = () => {
  const [tab, setTab] = useState<"overview" | "pending" | "featured">("overview");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  const [featured, setFeatured] = useState<number[]>([]);
  const [pending, setPending] = useState<number[]>([2, 4, 6]); // example pending property IDs

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(propertyData.length / itemsPerPage);
  const currentProperties = propertyData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const toggleFeatured = (id: number) => {
    setFeatured((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const approveProperty = (id: number) => {
    setPending((prev) => prev.filter((pid) => pid !== id));
  };

  const denyProperty = (id: number) => {
    setPending((prev) => prev.filter((pid) => pid !== id));
  };

  const filteredProperties =
    tab === "overview"
      ? currentProperties
      : tab === "pending"
      ? propertyData.filter((p) => pending.includes(p.id))
      : propertyData.filter((p) => featured.includes(p.id));

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

      {/* Tabs */}

      <div className="bg-white p-6">
      <div className="flex gap-4 border-b">
        <button
          onClick={() => setTab("overview")}
          className={`px-4 py-2 ${
            tab === "overview" ? "border-b-2 border-primary font-semibold" : ""
          }`}
        >
          All Properties
        </button>
        <button
          onClick={() => setTab("pending")}
          className={`px-4 py-2 ${
            tab === "pending" ? "border-b-2 border-primary font-semibold" : ""
          }`}
        >
          Pending Properties
        </button>
        <button
          onClick={() => setTab("featured")}
          className={`px-4 py-2 ${
            tab === "featured" ? "border-b-2 border-primary font-semibold" : ""
          }`}
        >
          Featured Listings
        </button>
      </div>

      {/* Property List */}
      <div className="gap-6 items-stretch w-full">
        <div className="bg-white  rounded-xl p-6 shadow flex flex-col">
          <div className="w-full flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold text-primary">
              {tab === "overview"
                ? "Property Overview"
                : tab === "pending"
                ? "Pending Property List"
                : "Featured Listings"}
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
            <div className="w-28">Action</div>
          </div>

          {/* Property Rows */}
          <div className="flex flex-col gap-3 flex-1">
            {filteredProperties.map((property) => (
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
                  {featured.includes(property.id) && (
                    <span className="text-blue-500">😋</span>
                  )}
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
                <div className="w-28 text-sm text-blue-500 flex gap-2">
                  {tab === "overview" && (
                    <button
                      onClick={() => toggleFeatured(property.id)}
                      className="hover:underline text-primary"
                    >
                      {featured.includes(property.id)
                        ? "Remove Featured"
                        : "Add to Featured"}
                    </button>
                  )}
                  {tab === "pending" && (
                    <button
                      onClick={() => {
                        setSelectedProperty(property);
                        setIsOpen(true);
                      }}
                      className="hover:underline text-primary"
                    >
                      Review
                    </button>
                  )}
                  {tab === "featured" && (
                    <button
                      onClick={() => toggleFeatured(property.id)}
                      className="hover:underline text-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination (only for overview) */}
          {tab === "overview" && (
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
          )}
        </div>
      </div>

      </div>

      {/* Review Modal */}
      {isOpen && (
        <ReviewModal
          property={selectedProperty}
          onClose={() => setIsOpen(false)}
          onApprove={approveProperty}
          onDeny={denyProperty}
        />
      )}
    </div>
  );
};
