import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const SideBarItem = ({ item, isOpen }: { item: any; isOpen: boolean }) => {
  const [expandMenu, setExpandMenu] = useState(false);

  if (item.childrens) {
    return (
      <div>
        <div
          className={`flex items-center justify-between p-2 rounded-md cursor-pointer 
            hover:bg-purple-300 hover:text-white ${
              expandMenu ? "bg-purple-300 text-white" : ""
            }`}
          onClick={() => setExpandMenu(!expandMenu)}
        >
          <div className="flex items-center gap-3">
            {item.icon}
            {isOpen && <span>{item.title}</span>}
          </div>
          <ChevronRight
            className={`w-4 h-4 transition-transform ${
              expandMenu ? "rotate-90" : ""
            }`}
          />
        </div>
        {expandMenu && (
          <div className="ml-8 mt-2 space-y-2">
            {item.childrens.map((child: any, index: number) => (
              <NavLink
                key={index}
                to={child.path}
                className={({ isActive }) =>
                  `block px-2 py-1 rounded-md transition-colors duration-200
                   hover:bg-purple-300 hover:text-white ${
                     isActive ? "text-primary" : "text-gray-300"
                   }`
                }
              >
                {isOpen && child.title}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex items-center gap-3 p-2 rounded-md transition-colors duration-200
         hover:bg-purple-300 hover:text-white ${
           isActive ? "text-primary" : "text-gray-300"
         }`
      }
    >
      {item.icon}
      {isOpen && <span>{item.title}</span>}
    </NavLink>
  );
};

export default SideBarItem;
