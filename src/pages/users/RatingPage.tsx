// pages/admin/properties.tsx
import  { useState } from "react";


type Property = {
  id: string;
  title: string;
  type: "rent" | "sale" | "shortlet";
  owner: string;
  price: number;
  location: string;
  status: "pending" | "published" | "denied" | "featured";
  createdAt: string;
};

const MOCK_PROPERTIES: Property[] = [
  {
    id: "p1",
    title: "Luxury 3-Bedroom Apartment",
    type: "rent",
    owner: "John Doe (Landlord)",
    price: 250000,
    location: "Lagos, Nigeria",
    status: "pending",
    createdAt: "2025-09-01",
  },
  {
    id: "p2",
    title: "2-Bedroom Flat",
    type: "sale",
    owner: "Mary Smith (Agent)",
    price: 12000000,
    location: "Abuja, Nigeria",
    status: "published",
    createdAt: "2025-09-05",
  },
  {
    id: "p3",
    title: "Furnished Shortlet Apartment",
    type: "shortlet",
    owner: "Chioma Ade (Agent)",
    price: 35000,
    location: "Port Harcourt, Nigeria",
    status: "featured",
    createdAt: "2025-09-10",
  },
];

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);

  const updateStatus = (id: string, newStatus: Property["status"]) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Property Listings</h1>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Title</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Type</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Owner</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Location</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Price</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Created</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {properties.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{p.title}</td>
                <td className="px-4 py-3 capitalize">{p.type}</td>
                <td className="px-4 py-3">{p.owner}</td>
                <td className="px-4 py-3">{p.location}</td>
                <td className="px-4 py-3">₦{p.price.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      p.status === "published"
                        ? "bg-green-100 text-green-700"
                        : p.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : p.status === "denied"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3">{p.createdAt}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  {p.status === "pending" && (
                    <>
                      <button
                        onClick={() => updateStatus(p.id, "published")}
                        className="text-xs px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(p.id, "denied")}
                        className="text-xs px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                      >
                        Deny
                      </button>
                    </>
                  )}

                  {p.status === "published" && (
                    <button
                      onClick={() => updateStatus(p.id, "featured")}
                      className="text-xs px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Mark Featured
                    </button>
                  )}

                  {p.status === "featured" && (
                    <button
                      onClick={() => updateStatus(p.id, "published")}
                      className="text-xs px-3 py-1 rounded border hover:bg-gray-100"
                    >
                      Remove Featured
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
