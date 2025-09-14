export interface Transaction {
  id: number;
  date: string;
  amount: string;
  type: string;
  status: "Successful" | "Pending" | "Failed";
}

export const transactions: Transaction[] = [
  {
    id: 1,
    date: "10:12:56 am 24/06/2025",
    amount: "1,100,090.00",
    type: "Withdrawal",
    status: "Successful",
  },
  {
    id: 2,
    date: "02:45:12 pm 22/06/2025",
    amount: "250,000.00",
    type: "Payment",
    status: "Pending",
  },
  {
    id: 3,
    date: "11:30:45 am 20/06/2025",
    amount: "980,500.00",
    type: "Withdrawal",
    status: "Failed",
  },
  {
    id: 4,
    date: "03:15:00 pm 18/06/2025",
    amount: "500,000.00",
    type: "Payment",
    status: "Successful",
  },
  {
    id: 5,
    date: "08:00:33 am 16/06/2025",
    amount: "750,200.00",
    type: "Withdrawal",
    status: "Successful",
  },
  {
    id: 6,
    date: "06:12:10 pm 14/06/2025",
    amount: "1,250,300.00",
    type: "Payment",
    status: "Pending",
  },
  {
    id: 7,
    date: "01:22:18 pm 12/06/2025",
    amount: "100,000.00",
    type: "Withdrawal",
    status: "Successful",
  },
  {
    id: 8,
    date: "09:45:55 am 10/06/2025",
    amount: "850,750.00",
    type: "Payment",
    status: "Failed",
  },
  {
    id: 9,
    date: "05:33:20 pm 08/06/2025",
    amount: "400,000.00",
    type: "Withdrawal",
    status: "Successful",
  },
  {
    id: 10,
    date: "12:12:12 pm 06/06/2025",
    amount: "650,890.00",
    type: "Payment",
    status: "Successful",
  },
];


type Vendor = {
  id: number;
  name: string;
  email: string;
  location: string;
  status: "active" | "suspended";
  dateJoined: string;
  verified: boolean;
  verificationRequested: boolean;
  rating: number;
  reviews: number;
};

export const INITIAL_VENDORS: Vendor[] = [
  {
    id: 1,
    name: "Bukayo Saka",
    email: "saka@email.com",
    location: "Lekki, Lagos",
    status: "active",
    dateJoined: "19/06/2025",
    verified: true,
    verificationRequested: false,
    rating: 4.5,
    reviews: 10,
  },
  {
    id: 2,
    name: "Victor Osimhen",
    email: "osimhen@email.com",
    location: "Ibadan, Oyo",
    status: "active",
    dateJoined: "20/06/2025",
    verified: false,
    verificationRequested: true,
    rating: 3.8,
    reviews: 7,
  },
  {
    id: 3,
    name: "Paul Pogba",
    email: "pogba@email.com",
    location: "Port Harcourt, Rivers",
    status: "active",
    dateJoined: "21/06/2025",
    verified: true,
    verificationRequested: false,
    rating: 4.9,
    reviews: 20,
  },
  {
    id: 4,
    name: "Lionel Messi",
    email: "messi@email.com",
    location: "Abuja, FCT",
    status: "suspended",
    dateJoined: "22/06/2025",
    verified: false,
    verificationRequested: false,
    rating: 2.5,
    reviews: 3,
  },
  {
    id: 5,
    name: "Cristiano Ronaldo",
    email: "ronaldo@email.com",
    location: "Benin, Edo",
    status: "active",
    dateJoined: "23/06/2025",
    verified: true,
    verificationRequested: false,
    rating: 4.7,
    reviews: 15,
  },
];