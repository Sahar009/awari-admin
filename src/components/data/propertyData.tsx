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
  },
  {
    id: 2,
    img: house1,
    propertyTitle: "2-Bedroom Apartment",
    vendor: "City Homes",
    PropertyType: "rent",
    location: "Abuja",
    price: "$800/month",
  },
  {
    id: 3,
    img: house1,
    propertyTitle: "Shortlet Studio",
    vendor: "QuickStay",
    PropertyType: "shortlet",
    location: "Port Harcourt",
    price: "$50/night",
  },
  {
    id: 4,
    img: house1,
    propertyTitle: "3-Bedroom Duplex",
    vendor: "Prime Properties",
    PropertyType: "sales",
    location: "Ibadan",
    price: "$120,000",
  },
  {
    id: 5,
    img: house1,
    propertyTitle: "Mini Flat for Rent",
    vendor: "Comfort Rentals",
    PropertyType: "rent",
    location: "Lagos",
    price: "$400/month",
  },
  {
    id: 6,
    img: house1,
    propertyTitle: "Shortlet Apartment",
    vendor: "StayEasy",
    PropertyType: "shortlet",
    location: "Abuja",
    price: "$60/night",
  },
  {
    id: 7,
    img: house1,
    propertyTitle: "Townhouse in Lekki Phase 1",
    vendor: "Elite Homes",
    PropertyType: "sales",
    location: "Lagos",
    price: "$180,000",
  },
  {
    id: 8,
    img: house1,
    propertyTitle: "1-Bedroom Apartment",
    vendor: "Urban Nest",
    PropertyType: "rent",
    location: "Benin City",
    price: "$500/month",
  },
  {
    id: 9,
    img: house1,
    propertyTitle: "Luxury Shortlet Suite",
    vendor: "QuickStay",
    PropertyType: "shortlet",
    location: "Warri",
    price: "$70/night",
  },
  {
    id: 10,
    img: house1,
    propertyTitle: "4-Bedroom Duplex",
    vendor: "Prime Properties",
    PropertyType: "sales",
    location: "Akure",
    price: "$200,000",
  },
   {
    id: 9,
    img: house1,
    propertyTitle: "Luxury Shortlet Suite",
    vendor: "QuickStay",
    PropertyType: "shortlet",
    location: "Warri",
    price: "$70/night",
  },
  {
    id: 10,
    img: house1,
    propertyTitle: "4-Bedroom Duplex",
    vendor: "Prime Properties",
    PropertyType: "sales",
    location: "Akure",
    price: "$200,000",
  },
];




export const propertyOverviewData: (CardProps & {
    color: string;
    bgColor: string;
  })[] = [
    {
      icon: <ClockIcon size={20} />,
      value: 35,
      label: "Pending Approval",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      icon: <HomeIcon size={20} />,
      value: 1540,
      label: "Total Properties",
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
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
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      icon: <CheckCircleIcon size={20} />,
      value: 210,
      label: "Active Shortlets",
      color: "text-pink-600",
      bgColor: "bg-pink-100",
    },
    {
      icon: <HomeIcon size={20} />,
      value: 400,
      label: "Sold / Rented Properties",
      color: "text-fuchsia-600",
      bgColor: "bg-fuchsia-100",
    },
    {
      icon: <StarIcon size={20} />,
      value: 50,
      label: "Featured Properties",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
  ];

