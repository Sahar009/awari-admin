import { ArrowLeft, MessageSquareWarning, Trash2,  } from "lucide-react"
import Vendor1 from '../../assets/images/houseimg (6).jpg'
import { useState } from "react";


const ViewVendors = () => {

     const [activeTab, setActiveTab] = useState<"profile" | "verification" | "property">("profile");

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "verification", label: "Verification" },
    { id: "property", label: "Property Posted" },
  ];

  return (
    <div className=" w-full bg-white p-6 rounded-xl min-h-[80vh] space-y-12">
      <div className="space-y-8">     
      <div className="flex gap-2 items-center">
      <ArrowLeft/>
      <p className="">View Vendor</p>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex flex-row gap-6">
          <div className="w-28 h-28 rounded-full"><img className="rounded-full" src={Vendor1} alt="vendor image" /></div>
          <div className="flex  flex-col">
            <h1 className="text-xl font-bold">Cunha Onana</h1>
            <a href="" className="text-primary underline">mbuemoinbox@gmail.com</a>
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
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-blue-500"
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
            activeTab === "profile" ? "opacity-100 translate-x-0 block" : "opacity-0 -translate-x-4 hidden"
          }`}
        >
          <div className="p-4">
            <div className="w-[60%]">
              <h1>Vendor Bio data</h1>
               <div className="flex flex-col gap-2  items-start text-lg w-full">
                  <div className=" flex flex-row gap-4">
                    <p className="font-light">Vendor name:</p>
                    <p className="font-semibold ">Jendo Real Estate</p>
                  </div>
                  <div className=" flex flex-row gap-4 ">
                    <p className="font-light">email</p>
                    <p className="font-semibold ">Jendo Real Estate</p>
                  </div>
                   <div className=" flex flex-row gap-4">
                    <p className="font-light">Location</p>
                    <p className="font-semibold ">Jendo Real Estate</p>
                  </div>
                  <div className=" flex flex-row gap-4 ">
                    <p className="font-light">Verification Status</p>
                    <p className="font-semibold ">Jendo Real Estate</p>
                  </div>
                   <div className=" flex flex-row gap-4">
                    <p className="font-light">Vendor name:</p>
                    <p className="font-semibold ">Jendo Real Estate</p>
                  </div>
                  <div className=" flex flex-row gap-4 ">
                    <p className="font-light">Vendor name</p>
                    <p className="font-semibold ">Jendo Real Estate</p>
                  </div>
               </div>
            </div>


            <div className="p w-[70%]">
              <div className="">
                <h1>Transcation History</h1>
              </div>
            </div>

          </div>
        </div>

        <div
          className={`transition-all duration-300 ease-in-out ${
            activeTab === "verification" ? "opacity-100 translate-x-0 block" : "opacity-0 -translate-x-4 hidden"
          }`}
        >
          <div className="p-4 bg-white rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">Verification</h2>
            <p>This is where user verification details (KYC, email, etc.) will appear.</p>
          </div>
        </div>

        {/* Property Posted */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            activeTab === "property" ? "opacity-100 translate-x-0 block" : "opacity-0 -translate-x-4 hidden"
          }`}
        >
         
        </div>
      </div>
    </div>
    </div>
  )
}

export default ViewVendors