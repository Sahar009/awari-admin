import {
  UsersIcon,
  StoreIcon,
  ActivityIcon,
  DollarSignIcon,
  ClockIcon,
  LifeBuoyIcon,
  Verified,
} from "lucide-react";
import { Card, type CardProps } from "../components/ui/Card";
import SignupChart from "../components/chart/LineChart";
import VendorLocationChart from "../components/chart/PolarChart";

export const Dashboard = () => {
  const overviewData: (CardProps & { color: string; bgColor: string })[] = [
    {
      icon: <UsersIcon size={20} />,
      value: 456795,
      label: "Total Users",
      color: "text-blue-500",
      bgColor: "bg-blue-100",
    },
    {
      icon: <ActivityIcon size={20} />,
      value: 23000,
      label: "Active Users",
      color: "text-green-500",
      bgColor: "bg-green-100",
    },
    {
      icon: <StoreIcon size={20} />,
      value: 1200,
      label: "Total Vendors",
      color: "text-purple-500",
      bgColor: "bg-purple-100",
    },
    {
      icon: <ActivityIcon size={20} />,
      value: 850,
      label: "Active Vendors",
      color: "text-pink-500",
      bgColor: "bg-pink-100",
    },
    {
      icon: <Verified size={20} />,
      value: 40,
      label: "Verified Vendor",
      color: "text-yellow-500",
      bgColor: "bg-yellow-100",
    },
    {
      icon: <ClockIcon size={20} />,
      value: 15,
      label: "Pending Kyc Approvals",
      color: "text-orange-500",
      bgColor: "bg-orange-100",
    },
    {
      icon: <DollarSignIcon size={20} />,
      value: "$250,000",
      label: "Total Revenue",
      color: "text-emerald-500",
      bgColor: "bg-emerald-100",
    },
    {
      icon: <LifeBuoyIcon size={20} />,
      value: 32,
      label: "Open Tickets",
      color: "text-red-500",
      bgColor: "bg-red-100",
    },
  ];

  return (
    <div className="h-full w-full space-y-12 ">
      <div className="grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-6">
        {overviewData.map((data, index) => (
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

      <div className="w-full flex items-center justify-between gap-6 ">
       <div className="w-[50%]">
      <SignupChart/>
      </div> 
      <div className="flex flex-row gap-6 w-[50%] ">
      <VendorLocationChart/>
      <VendorLocationChart/>
      </div>
      </div>
    </div>
  );
};
