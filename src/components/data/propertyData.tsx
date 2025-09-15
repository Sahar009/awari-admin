import house1 from '../../assets/images/houseimg (1).jpg'
import {
  HomeIcon,
  CheckCircleIcon,
  ClockIcon,
  StarIcon,
  HousePlug,
  ReceiptCentIcon,
} from "lucide-react";
import type { CardProps } from '../ui/Card';
interface propertyProps {
  id: number;
  img: string;
  propertyTitle: string;
  vendor: string;
  PropertyType: "rent" | "sales" | "shortlet";
  location: string;
  price: string | number;
  date: string;
}

export const propertyData: propertyProps[] = [
  {
    id: 1,
    img: house1,
    propertyTitle: "Luxury Villa in Lekki",
    vendor: "Olajide Estate",
    PropertyType: "sales",
    location: "Lagos",
    price: "$250,000",
    date: "15/6/2025"
  },
  {
    id: 2,
    img: house1,
    propertyTitle: "2-Bedroom Apartment",
    vendor: "City Homes",
    PropertyType: "rent",
    location: "Abuja",
    price: "$800/month",
    date: "15/6/2025"
  },
  {
    id: 3,
    img: house1,
    propertyTitle: "Shortlet Studio",
    vendor: "QuickStay",
    PropertyType: "shortlet",
    location: "Port Harcourt",
    price: "$50/night",
    date: "15/6/2025"
  },
  {
    id: 4,
    img: house1,
    propertyTitle: "3-Bedroom Duplex",
    vendor: "Prime Properties",
    PropertyType: "sales",
    location: "Ibadan",
    price: "$120,000",
    date: "15/6/2025"
  },
  {
    id: 5,
    img: house1,
    propertyTitle: "Mini Flat for Rent",
    vendor: "Comfort Rentals",
    PropertyType: "rent",
    location: "Lagos",
    price: "$400/month",
    date: "15/6/2025"
  },
  {
    id: 6,
    img: house1,
    propertyTitle: "Shortlet Apartment",
    vendor: "StayEasy",
    PropertyType: "shortlet",
    location: "Abuja",
    price: "$60/night",
    date: "15/6/2025"
  },
  {
    id: 7,
    img: house1,
    propertyTitle: "Townhouse in Lekki Phase 1",
    vendor: "Elite Homes",
    PropertyType: "sales",
    location: "Lagos",
    price: "$180,000",
    date: "15/6/2025"
  },
  {
    id: 8,
    img: house1,
    propertyTitle: "1-Bedroom Apartment",
    vendor: "Urban Nest",
    PropertyType: "rent",
    location: "Benin City",
    price: "$500/month",
    date: "15/6/2025"
  },
  {
    id: 9,
    img: house1,
    propertyTitle: "Luxury Shortlet Suite",
    vendor: "QuickStay",
    PropertyType: "shortlet",
    location: "Warri",
    price: "$70/night",
    date: "15/6/2025"
  },
  {
    id: 10,
    img: house1,
    propertyTitle: "4-Bedroom Duplex",
    vendor: "Prime Properties",
    PropertyType: "sales",
    location: "Akure",
    price: "$200,000",
    date: "15/6/2025"
  },
   {
    id: 9,
    img: house1,
    propertyTitle: "Luxury Shortlet Suite",
    vendor: "QuickStay",
    PropertyType: "shortlet",
    location: "Warri",
    price: "$70/night",
    date: "15/6/2025"
  },
  {
    id: 10,
    img: house1,
    propertyTitle: "4-Bedroom Duplex",
    vendor: "Prime Properties",
    PropertyType: "sales",
    location: "Akure",
    price: "$200,000",
    date: "15/6/2025"
  },
];




export const propertyOverviewData: (CardProps & {
    color: string;
    bgColor: string;
  })[] = [
    
    {
      icon: <HomeIcon size={20} />,
      value: 1540,
      label: "Total Properties",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      icon: <HousePlug size={20} />,
      value: 800,
      label: "Houses for Sale",
      color: "text-teal-600",
      bgColor: "bg-teal-100",
    },
    {
      icon: <ReceiptCentIcon size={20} />,
      value: 420,
      label: "Houses for Rent",
      color: "text-rose-600",
      bgColor: "bg-rose-100",
    },
    {
      icon: <HomeIcon size={20} />,
      value: 320,
      label: "Shortlet Properties",
      color: "text-green-900",
      bgColor: "bg-green-300",
    },
    {
      icon: <CheckCircleIcon size={20} />,
      value: 210,
      label: "Active Shortlets",
      color: "text-blue-900",
      bgColor: "bg-blue-300",
    },
    {
      icon: <HomeIcon size={20} />,
      value: 400,
      label: "Sold / Rented Properties",
      color: "text-fuchsia-900",
      bgColor: "bg-fuchsia-200",
    },
    {
      icon: <ClockIcon size={20} />,
      value: 35,
      label: "Pending Approval",
      color: "text-red-900",
      bgColor: "bg-red-300",
    },
    {
      icon: <StarIcon size={20} />,
      value: 50,
      label: "Featured Properties",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
  ];

