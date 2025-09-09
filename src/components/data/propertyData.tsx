import house1 from '../../assets/images/houseimg (1).jpg'
interface propertyProps {
  id: number;
  img: string;
  propertyTitle: string;
  vendor: string;
  PropertyType: "rent" | "sales" | "shortlet";
  location: string;
  price: string | number;
}

const propertyData: propertyProps[] = [
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
];

export default propertyData;
