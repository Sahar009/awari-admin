import { Bell, VerifiedIcon } from "lucide-react";
import SearchInput from "../../components/ui/SearchInput";
import vendor1 from "../../assets/images/houseimg (10).jpg";
import { useNavigate } from "react-router-dom";

// Dummy vendors
const vendors = [
  {
    id: 1,
    name: "Bukayo Saka",
    email: "saka@email.com",
    location: "Lekki, Lagos",
    status: "Active",
    dateJoined: "19/06/2025",
    verified: true,
    verificationRequested: false,
  },
  {
    id: 2,
    name: "Victor Osimhen",
    email: "osimhen@email.com",
    location: "Ibadan, Oyo",
    status: "Pending",
    dateJoined: "20/06/2025",
    verified: false,
    verificationRequested: true, // 👈 requested but not verified yet
  },
  {
    id: 3,
    name: "Paul Pogba",
    email: "pogba@email.com",
    location: "Port Harcourt, Rivers",
    status: "Active",
    dateJoined: "21/06/2025",
    verified: true,
    verificationRequested: false,
  },
  {
    id: 4,
    name: "Lionel Messi",
    email: "messi@email.com",
    location: "Abuja, FCT",
    status: "Inactive",
    dateJoined: "22/06/2025",
    verified: false,
    verificationRequested: false,
  },
  {
    id: 5,
    name: "Cristiano Ronaldo",
    email: "ronaldo@email.com",
    location: "Benin, Edo",
    status: "Active",
    dateJoined: "23/06/2025",
    verified: true,
    verificationRequested: false,
  },
  {
    id: 6,
    name: "Kylian Mbappe",
    email: "mbappe@email.com",
    location: "Warri, Delta",
    status: "Pending",
    dateJoined: "24/06/2025",
    verified: false,
    verificationRequested: true, // 👈 requested but not verified yet
  },
  {
    id: 7,
    name: "Kevin De Bruyne",
    email: "kdb@email.com",
    location: "Akure, Ondo",
    status: "Active",
    dateJoined: "25/06/2025",
    verified: true,
    verificationRequested: false,
  },
  {
    id: 8,
    name: "Erling Haaland",
    email: "haaland@email.com",
    location: "Jos, Plateau",
    status: "Active",
    dateJoined: "26/06/2025",
    verified: true,
    verificationRequested: false,
  },
  {
    id: 9,
    name: "Neymar Jr",
    email: "neymar@email.com",
    location: "Enugu",
    status: "Inactive",
    dateJoined: "27/06/2025",
    verified: false,
    verificationRequested: false,
  },
  {
    id: 10,
    name: "Mohamed Salah",
    email: "salah@email.com",
    location: "Kano",
    status: "Active",
    dateJoined: "28/06/2025",
    verified: true,
    verificationRequested: false,
  },
];

const Vendor = () => {
    const route = useNavigate()
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
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-purple-100 text-left text-slate-900">
              <th className="py-3 px-4">Vendor Name</th>
              <th className="py-3 px-4">Email Address</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Date Joined</th>
               <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr
                key={vendor.id}
                className={` transition duration-200 ${
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
                <td
                  className={`py-3 px-4 font-medium ${
                    vendor.status === "Active"
                      ? "text-green-600"
                      : vendor.status === "Pending"
                      ? "text-orange-600"
                      : "text-red-600"
                  }`}
                >
                  {vendor.status}
                </td>
                <td className="py-3 px-4 text-gray-700">{vendor.dateJoined}</td>
                <td className="py-3 px-4 "><button onClick={() => route('/Vendor-Details')} className="text-primary underline underline-offset-2 cursor-pointer">View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Vendor;
