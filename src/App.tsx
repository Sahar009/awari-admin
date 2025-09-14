import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import SideBar from "./components/sidebar/SideBar";
import { Dashboard } from "./pages/Dashboard";
import MainLayout from "./components/layout/Mainlayout";
import { Property } from "./pages/Property";
import Vendor from "./pages/users/Vendor";
import Customer  from "./pages/users/Customer";
import ViewVendors from "./pages/users/ViewVendors";
import MyAccount from "./pages/MyAccount";
import RatingPage from "./pages/users/RatingPage";
import PropertiesPage from "./pages/users/RatingPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          element={
            <SideBar>
              <MainLayout />
            </SideBar>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/property" element={<Property />} />
          <Route path="/vendor" element={<Vendor/>} />
          <Route path="/customer" element={<Customer/>} />
          <Route path="/Vendor-Details" element={<ViewVendors/>} />
          <Route path="/my-account" element={<PropertiesPage/>} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
