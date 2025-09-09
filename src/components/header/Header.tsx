import { AlarmClock, User2Icon } from "lucide-react"
import { useLocation } from "react-router-dom";
import menu from "../sidebar/sidebaraData";
// interface HeaderProps {
//     title: string;
// }

export const Header = () => {
    const location = useLocation();

      const activeItem =
    menu.find((item) => item.path === location.pathname) ||
    menu
      .flatMap((item) => item.childrens || [])
      .find((child) => child.path === location.pathname);

  return (
    <div className="flex flex-row py-4 items-center px-16 justify-between shadow bg-purple-100">
       <h1 className="text-3xl font-bold text-primary">{activeItem ? activeItem.title : "Dashboard"}</h1> 
       <div className="flex flex-row items-center gap-5">
         <AlarmClock />
         <div className="flex flex-row items-center  gap-3">
           <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center">
            <User2Icon size={25}/>
            {/* <img src={} alt="" /> */}
             </div> 
             <p className="text-sm">Sahar</p>

         </div>
       </div>
    </div>
  )
}
