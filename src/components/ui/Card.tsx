import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

export interface CardProps {
  icon: ReactNode;
  value: number | string;
  label: string;
  bgColor?: string;   // background color for icon circle
  color?: string; // text color for label
}

export const Card: React.FC<CardProps> = ({
  icon,
  value,
  label,
  bgColor = "bg-purple-200 text-purple-700", // default
  color = "text-gray-600", // default
}) => {
  return (
    <div className="shadow rounded-xl bg-white p-6 flex flex-col gap-6 justify-between hover:shadow-md transition">
      {/* Top Row */}
      <div className="flex flex-row items-center justify-between">
        {/* Icon circle */}
        <div
          className={`w-14 h-14 flex items-center justify-center rounded-full shadow transform hover:scale-105 transition duration-300 ${bgColor}`}
        >
          {icon}
        </div>

        {/* Percentage (fixed for now, can make dynamic later) */}
        <div className={`flex items-center gap-1  px-3 py-1 rounded-xl  text-sm font-medium ${bgColor} ${color}`}>
          <ArrowUpRight size={16} />
          <span>+38%</span>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">{value}</h1>
        <p className={`text-lg ${color}`}>{label}</p>
      </div>
    </div>
  );
};
