import {
  HomeIcon,
  CheckCircleIcon,
  ClockIcon,
  StarIcon,
  HousePlug,
  ReceiptCentIcon,
} from "lucide-react";
import { Card, type CardProps } from "../components/ui/Card";
import propertyData from "../components/data/propertyData";

export const Property = () => {
  const propertyOverviewData: (CardProps & { color: string; bgColor: string })[] = [
    { icon: <ClockIcon size={20} />, value: 35, label: "Pending Approval", color: "text-orange-600", bgColor: "bg-orange-100" },
    { icon: <HomeIcon size={20} />, value: 1540, label: "Total Properties", color: "text-indigo-600", bgColor: "bg-indigo-100" },
    { icon: <HousePlug size={20} />, value: 800, label: "Houses for Sale", color: "text-teal-600", bgColor: "bg-teal-100" },
    { icon: <ReceiptCentIcon size={20} />, value: 420, label: "Houses for Rent", color: "text-rose-600", bgColor: "bg-rose-100" },
    { icon: <HomeIcon size={20} />, value: 320, label: "Shortlet Properties", color: "text-emerald-600", bgColor: "bg-emerald-100" },
    { icon: <CheckCircleIcon size={20} />, value: 210, label: "Active Shortlets", color: "text-pink-600", bgColor: "bg-pink-100" },
    { icon: <HomeIcon size={20} />, value: 400, label: "Sold / Rented Properties", color: "text-fuchsia-600", bgColor: "bg-fuchsia-100" },
    { icon: <StarIcon size={20} />, value: 50, label: "Featured Properties", color: "text-yellow-600", bgColor: "bg-yellow-100" },
  ];

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
      <div className="w-full">
      <div className="bg-white rounded-xl p-6 shadow w-[65%]">
        <h1 className="text-2xl font-semibold mb-4">Property Overview</h1>

        {/* Table Header */}
        <div className="flex gap-2 font-medium text-gray-500 border-b-2 pb-2 mb-2 px-3">
          <div className="w-10">Id</div>
          <div className="w-60">Property Listing</div>
          <div className="w-40">Vendor</div>
          <div className="w-32">Type</div>
          <div className="w-40">Location</div>
          <div className="w-32">Price</div>
          <div className="w-20">Action</div>
        </div>

       <div className="flex flex-col gap-3">
        {propertyData.map((property) => (
          <div key={property.id} className="flex px-3 gap-2 items-center rounded-xl py-3 hover:bg-gray-50 shadow">
            <div className="w-10 text-sm text-gray-700">{property.id}</div>

            <div className="w-60 flex items-center gap-2">
              <div className="w-12 h-10 rounded-sm overflow-hidden">
                <img className="w-full h-full object-cover" src={property.img} alt={property.propertyTitle} />
              </div>
              <p className="text-sm text-gray-700 ">{property.propertyTitle}</p>
            </div>

            <div className="w-40 text-sm text-gray-700">{property.vendor}</div>
            <div className="w-32 text-sm text-gray-700">{property.PropertyType}</div>
            <div className="w-40 text-sm text-gray-700">{property.location}</div>
            <div className="w-32 text-sm text-gray-700">{property.price}</div>
            <div className="w-20 text-sm text-blue-500">
              <button className="hover:underline">View</button>
            </div>
          </div>
        ))}
        </div>
      </div>
      <div className="w-[30%]"></div>
     </div>
    </div>
  );
};
