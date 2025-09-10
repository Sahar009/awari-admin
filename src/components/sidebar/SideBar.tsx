import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeftCircle, ChevronRightCircle } from "lucide-react";
import SideBarItem from "./SideBarItem";
import menu from "./sidebaraData";
import logo from "../../assets/logo.png";
import { Header } from "../header/Header";

const SideBar = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const toggle = () => setIsOpen(!isOpen);
  const goHome = () => navigate("/");

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-gray-100 p-4 flex flex-col transition-all duration-500 ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Logo + toggle */}
        <div className="flex items-center justify-between mb-8">
          {isOpen && (
            <button onClick={goHome}>
              <img src={logo} alt="awari logo" className="w-28" />
            </button>
          )}
          <button onClick={toggle}>
            {isOpen ? (
              <ChevronLeftCircle className="w-6 h-6 text-gray-300" />
            ) : (
              <ChevronRightCircle className="w-6 h-6 text-gray-300" />
            )}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="space-y-8">
          {menu.map((item, index) => (
            <SideBarItem key={index} item={item} isOpen={isOpen} />
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col transition-all duration-500 bg-purple-50 ">
        {/* Header always on top */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 p-6 ">{children}</main>
      </div>
    </div>
  );
};

export default SideBar;
