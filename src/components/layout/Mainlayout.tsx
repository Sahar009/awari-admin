import { Outlet } from "react-router-dom";
import { Header } from "../header/Header";

const MainLayout = () => {
  return (
    <div style={{ height: "80vh" }} className="overflow-y-auto">
      {/* Nested route content */}
      <Outlet />
    </div>
  );
};

export default MainLayout;
