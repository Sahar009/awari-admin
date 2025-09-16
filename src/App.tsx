import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import SideBar from "./components/sidebar/SideBar";
import { Dashboard } from "./pages/Dashboard";
import MainLayout from "./components/layout/Mainlayout";
import { Property } from "./pages/Property";
import Vendor from "./pages/users/Vendor";
import Customer  from "./pages/users/Customer";
import ViewVendors from "./pages/users/ViewVendors";
import MyAccount from "./pages/MyAccount";

import ReviewsReports from "./pages/ReviewsReport";
import FaqAnnoucement from "./pages/FaqAnnoucement";
import Blog from "./pages/Blog";
import { About } from "./pages/About";


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
          <Route path="/my-account" element={<MyAccount/>} />
          <Route path="/review" element={<ReviewsReports/>}  />
          <Route path="/faq-annoucement" element={<FaqAnnoucement/>}  />
          <Route path="/blog" element={<Blog/>}  />
          <Route path="/about" element={<About/>}  />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
