import {
  LayoutDashboard,
  UserPlus,
  Users,
  FileBarChart,
  BarChart2,
  MessageCircle,
} from "lucide-react";

const menu = [
  {
    title: "Overview",
    icon: <LayoutDashboard className="w-5 h-5" />,
    path: "/dashboard",
  },
   {
    title: "Property",
    icon: <BarChart2 className="w-5 h-5" />,
    path: "/property"
  },
   {
    title: "Users",
    icon: <UserPlus className="w-5 h-5" />,
     childrens: [
      { title: "Vendor", path: "/Vendor" },
      { title: "Customer", path: "/Customer" },
    ],
  },
  {
    title: "Review & Report Bug",
    icon: <MessageCircle className="w-5 h-5" />,
    path: "/review",
  },
  {
    title: "Content Management",
    icon: <FileBarChart className="w-5 h-5" />,
     childrens: [
      { title: "Faq & Annoucements", path: "/faq-annoucement" },
       { title: "Blog", path: "/blog" },
      { title: "About", path: "/about" },
    ],
  }, 
  {
    title: "My Account",
    icon: <Users className="w-5 h-5 " />,
    path: "/my-account"
  },
 
];

export default menu;
