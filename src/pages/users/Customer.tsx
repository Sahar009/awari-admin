import { useState } from "react";
import SearchInput from "../../components/ui/SearchInput";
import vendor1 from "../../assets/images/houseimg (10).jpg";
import RatingStars from "../../components/ui/RatingStars";
import { INITIAL_VENDORS } from "./demoData";

const ITEMS_PER_PAGE = 5; // 👈 number of rows per page

const Customer = () => {
  const [vendors, setVendors] = useState(INITIAL_VENDORS);
  const [currentPage, setCurrentPage] = useState(1);

  const handleRate = (id: number, newRating: number) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, rating: newRating } : v))
    );
  };

  const toggleStatus = (id: number) => {
    setVendors((prev) =>
      prev.map((v) =>
        v.id === id
          ? { ...v, status: v.status === "active" ? "suspended" : "active" }
          : v
      )
    );
  };

  // Pagination logic
  const totalPages = Math.ceil(vendors.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedVendors = vendors.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="bg-white w-full rounded-xl p-6 shadow">
      {/* Header */}
      <div className="flex flex-row justify-end items-center mb-6">
        <SearchInput />
      </div>

      {/* Vendor Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-purple-100 text-left text-slate-900">
              <th className="py-3 px-4">Vendor Name</th>
              <th className="py-3 px-4">Email Address</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Date Joined</th>
              <th className="py-3 px-4">Rating</th>
              <th className="py-3 px-4">Reviews</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedVendors.map((vendor) => (
              <tr
                key={vendor.id}
                className=" transition duration-200 hover:bg-purple-50"
              >
                <td className="py-3 px-4 flex items-center gap-3">
                  <img
                    className="w-10 h-10 rounded-full object-cover"
                    src={vendor1}
                    alt={vendor.name}
                  />
                  <span className="font-medium">{vendor.name}</span>
                </td>
                <td className="py-3 px-4 text-gray-700">{vendor.email}</td>
                <td className="py-3 px-4 text-gray-700">{vendor.location}</td>
                <td className="py-3 px-4 text-gray-700">{vendor.dateJoined}</td>
                <td className="py-3 px-4">
                  <RatingStars
                    value={vendor.rating}
                    onChange={(val) => handleRate(vendor.id, val)}
                  />
                </td>
                <td className="py-3 px-4">{vendor.reviews}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      vendor.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {vendor.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => toggleStatus(vendor.id)}
                    className="text-xs px-3 py-1 rounded border hover:bg-gray-100"
                  >
                    {vendor.status === "active" ? "Suspend" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-end items-center gap-3 mt-6">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50  border-primary text-primary"
        >
          Prev
        </button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50  border-primary text-primary"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Customer;
