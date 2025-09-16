import { CheckCircle, CloudAlertIcon, Trash } from "lucide-react";
import { useState } from "react";


const ReviewsReports = () => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      user: "John Doe",
      property: "2 Bedroom Shortlet, Lekki",
      rating: 4,
      content: "The apartment was clean and cozy, loved the stay!",
      status: "Approved",
      reports: 0,
    },
    {
      id: 2,
      user: "Jane Smith",
      property: "Luxury Flat, Ikoyi",
      rating: 2,
      content: "Not as described, had plumbing issues.",
      status: "Flagged",
      reports: 3,
    },
  ]);

  interface demoProps {
    id: number,
    action: void
  }

  const handleAction = (id, action): demoProps => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: action } : r
      )
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reviews & Reports</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by property, user..."
          className="border px-4 py-2 rounded-lg w-1/3"
        />
        <select className="border px-4 py-2 rounded-lg">
          <option>Status</option>
          <option>Approved</option>
          <option>Flagged</option>
          <option>Pending</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3">User</th>
              <th className="p-3">Property</th>
              <th className="p-3">Rating</th>
              <th className="p-3">Review</th>
              <th className="p-3">Status</th>
              <th className="p-3">Reports</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{review.user}</td>
                <td className="p-3">{review.property}</td>
                <td className="p-3">{review.rating} ⭐</td>
                <td className="p-3">{review.content.slice(0, 50)}...</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      review.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : review.status === "Flagged"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {review.status}
                  </span>
                </td>
                <td className="p-3">{review.reports}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleAction(review.id, "Approved")}
                    className="text-green-600 hover:scale-110 transition"
                  >
                   <CheckCircle/>
                  </button>
                  <button
                    onClick={() => handleAction(review.id, "Flagged")}
                    className="text-red-600 hover:scale-110 transition"
                  >
                    <CloudAlertIcon/>
                  </button>
                  <button
                    onClick={() =>
                      setReviews((prev) =>
                        prev.filter((r) => r.id !== review.id)
                      )
                    }
                    className="text-gray-500 hover:scale-110 transition"
                  >
                   <Trash/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReviewsReports;
