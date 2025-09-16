import { ArrowLeft, MessageSquareWarning, Trash2 } from "lucide-react";
import Vendor1 from "../../assets/images/houseimg (6).jpg";
import { useState } from "react";
import { transactions } from "./demoData";





const ViewVendors = () => {
  const [activeTab, setActiveTab] = useState<
    "profile" | "verification" 
  >("profile");

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "verification", label: "Verification" },
    
  ];

    const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentTransactions = transactions.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  return (
    <div className=" w-full bg-white p-6 rounded-xl min-h-[80vh] space-y-12">
      <div className="space-y-8">
        <div className="flex gap-2 items-center">
          <ArrowLeft />
          <p className="">View Vendor</p>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex flex-row gap-6">
            <div className="w-28 h-28 rounded-full">
              <img className="rounded-full" src={Vendor1} alt="vendor image" />
            </div>
            <div className="flex  flex-col">
              <h1 className="text-xl font-bold">Cunha Onana</h1>
              <a href="" className="text-primary underline">
                mbuemoinbox@gmail.com
              </a>
              <p className="text-lg font-light">Lekki, Lagos</p>
              <p className="text-green-500 text-shadow-amber-600">verified</p>
            </div>
          </div>

          <div className="flex items-end flex-col gap-3">
            <button className="border p-3 border-primary text-primary flex gap-4 rounded-lg">
              <MessageSquareWarning />
              Suspend
            </button>

            <button className="bg-red-700 text-white p-3 flex gap-4 rounded-lg">
              <Trash2 />
              Deactivate Vendor
            </button>
          </div>
        </div>
      </div>

      <div className="w-full space-y-4">
        {/* Tabs Buttons */}
        <div className="flex border-b-2 border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-6 py-2 text-sm font-medium transition-colors duration-300 ${
                activeTab === tab.id
                  ? "text-primary border-b-2 border-primary"
                  : "text-purple-300 hover:not-first:text-primary"
              }`}
              onClick={() => setActiveTab(tab.id as any)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="relative">
          {/* Profile */}
          <div
            className={`transition-all duration-300 ease-in-out ${
              activeTab === "profile"
                ? "opacity-100 translate-x-0 block"
                : "opacity-0 -translate-x-4 hidden"
            }`}
          >
            <div className="p-4 flex">
      {/* LEFT SIDE - Vendor Bio */}
      <div className="w-[40%] space-y-5">
        <div className="w-full space-y-3">
          <h1 className="text-xl font-bold">Vendor Bio data</h1>
          <div className="flex flex-col gap-2 items-start text-sm w-full">
            <div className="flex flex-row gap-4">
              <p className="font-light w-28">Vendor name:</p>
              <p className="font-semibold">Jendo Real Estate</p>
            </div>
            <div className="flex flex-row gap-4">
              <p className="font-light w-28">Email:</p>
              <p className="font-light text-primary">jendoestate@gmail.com</p>
            </div>
            <div className="flex flex-row gap-4">
              <p className="font-light w-28">Location:</p>
              <p className="font-normal">Lagos, Nigeria</p>
            </div>
            <div className="flex flex-row gap-4">
              <p className="font-light w-28">Verification Status:</p>
              <p className="font-light text-green-500">Verified</p>
            </div>
            <div className="flex flex-row gap-4">
              <p className="font-light w-28">Date registered:</p>
              <p className="font-normal">15/06/2033</p>
            </div>
            <div className="flex flex-row gap-4">
              <p className="font-light w-28">Star rating:</p>
              <p className="font-normal">4.5</p>
            </div>
          </div>
        </div>

        {/* BANKING INFO */}
        <div className="space-y-3">
          <h1 className="text-xl font-bold">Vendor Banking Information</h1>
          <div className="flex flex-col gap-2 items-start text-sm w-full">
            <div className="flex flex-row gap-4">
              <p className="font-light w-28">Account Name:</p>
              <p className="font-semibold">Jendo Gyokeres</p>
            </div>
            <div className="flex flex-row gap-4">
              <p className="font-light w-28">Account Number:</p>
              <p className="font-semibold">8119923671</p>
            </div>
            <div className="flex flex-row gap-4">
              <p className="font-light w-28">BVN:</p>
              <p className="font-semibold">*******************</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Transactions */}
      <div className="w-[60%]">
        <div className="space-y-3">
          <h1 className="text-xl font-bold">Transaction History</h1>

          <div className="w-full">
            <table className="w-full border-collapse">
              <thead>
                <tr className=" text-left">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {currentTransactions.map((t) => (
                  <tr key={t.id} className="text-sm">
                    <td className="py-3 px-4 text-gray-700">{t.date}</td>
                    <td className="py-3 px-4 text-gray-700">₦{t.amount}</td>
                    <td className="py-3 px-4 text-gray-700">{t.type}</td>
                    <td
                      className={`py-3 px-4 ${
                        t.status === "Successful"
                          ? "text-green-600"
                          : t.status === "Pending"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {t.status}
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-primary underline underline-offset-2 cursor-pointer">
                        details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-end mt-4 gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50  border-primary text-primary"
              >
                Prev
              </button>
              <span className="px-3 py-1">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50 text-primary border-primary"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
          </div>

          <div
            className={`transition-all duration-300 ease-in-out ${
              activeTab === "verification"
                ? "opacity-100 translate-x-0 block"
                : "opacity-0 -translate-x-4 hidden"
            }`}
          >
            <div className="p-4 flex flex-row justify-between w-full">
              <div className="w-[30%] space-y-3">
                <h1 className="">Business details</h1>
                 <div className="w-full space-y-3">
                   <div className="flex flex-col gap-1 items-start w-full">
                    <small>Registered name of business</small>
                    <p className="bg-purple-100 px-4 py-2 rounded-lg text-lg font-light text-purple-600 w-full">
                      Jendo RealEstate Company
                    </p>
                   </div>
                   <div className="flex flex-col items-start w-full">
                    <small>Display Name(open to customers)</small>
                    <p className="bg-purple-100 px-4 py-2 rounded-lg text-lg font-light text-purple-600 w-full">
                      Jendo's 
                    </p>
                   </div>
                   <div className="flex flex-col items-start w-full">
                    <small>Primary location</small>
                    <p className="bg-purple-100 px-4 py-2 rounded-lg text-lg font-light text-purple-600 w-full">
                    Lagos Nigeria
                    </p>
                   </div>
                    <div className="flex flex-col items-start w-full">
                    <small>Contact Number</small>
                    <p className="bg-purple-100 px-4 py-2 rounded-lg text-lg font-light text-purple-600 w-full">
                    +234 8164927222
                    </p>
                   </div>
                 </div>
              </div>

              <div className="w-[60%]">
                <h1>National Id or passport (front and back image)</h1>
                <div className="w-full space-y-12">

                
                 <div className="border-dashed border mt-8 border-primary bg-purple-100 rounded-2xl h-52 w-3/4">
                    {/* <Image
                     width={300}
                     height={80}
                     src=""
                     alt=""
                     className=""
                     /> */}
                 </div>

                 <div className="w-full flex items-end justify-end">
                   <div className=" gap-4 space-x-5 ">
                     <button className="border-red-500 border text-red-500 rounded-lg px-6 py-3 ">
                      Reject Verification
                     </button>

                     <button className="bg-green-500 rounded-lg text-white px-6 py-3">
                      Verify Vendor
                     </button>
                   </div>
                 </div>
                 </div>
              </div>
            </div>
          </div>

         
         
        </div>
      </div>
    </div>
  );
};

export default ViewVendors;
