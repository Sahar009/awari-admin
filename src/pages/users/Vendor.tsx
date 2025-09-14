import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, VerifiedIcon } from "lucide-react";
import SearchInput from "../../components/ui/SearchInput";
import vendor1 from "../../assets/images/houseimg (10).jpg";
import RatingStars from "../../components/ui/RatingStars";

// Demo vendors
const INITIAL_VENDORS = [
  {
    id: 1,
    name: "Bukayo Saka",
    email: "saka@email.com",
    location: "Lekki, Lagos",
    status: "active",
    dateJoined: "19/06/2025",
    verified: true,
    verificationRequested: false,
    rating: 4,
    reviews: 120,
  },
  {
    id: 2,
    name: "Victor Osimhen",
    email: "osimhen@email.com",
    location: "Ibadan, Oyo",
    status: "pending",
    dateJoined: "20/06/2025",
    verified: false,
    verificationRequested: true,
    rating: 3,
    reviews: 75,
  },
  {
    id: 3,
    name: "Paul Pogba",
    email: "pogba@email.com",
    location: "Port Harcourt, Rivers",
    status: "active",
    dateJoined: "21/06/2025",
    verified: true,
    verificationRequested: false,
    rating: 5,
    reviews: 210,
  },
  // ... add more like above
];

const ITEMS_PER_PAGE = 5;

const Vendor = () => {
  const route = useNavigate();
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
          ? {
              ...v,
              status: v.status === "active" ? "suspended" : "active",
            }
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
      <div className="flex flex-row justify-between items-center mb-6">
        <button className="flex items-center gap-2 border p-3 rounded-lg border-primary">
          <Bell className="text-primary" />
          <p>Verification Request</p>
          <span className="bg-primary text-white h-6 flex items-center justify-center w-6 rounded-full text-sm">
            40
          </span>
        </button>
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
                className={`transition duration-200 ${
                  vendor.verificationRequested
                    ? "bg-purple-300/10 animate-pulse"
                    : "hover:bg-purple-50"
                }`}
              >
                <td className="py-3 px-4 flex items-center gap-3">
                  <div className="relative">
                    {vendor.verified && (
                      <VerifiedIcon className="absolute bg-white rounded-full p-[1px] -top-1 -right-1 text-green-500 w-4 h-4" />
                    )}
                    <img
                      className="w-10 h-10 rounded-full object-cover"
                      src={vendor1}
                      alt={vendor.name}
                    />
                  </div>
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
                 <button onClick={() => route("/Vendor-Details")} className="text-primary underline underline-offset-2 cursor-pointer" > View </button>
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
          className="px-3 py-1 border rounded disabled:opacity-50 border-primary text-primary"
        >
          Prev
        </button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50 border-primary text-primary"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Vendor;
