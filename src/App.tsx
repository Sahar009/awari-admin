import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import SideBar from "./components/sidebar/SideBar";
import { Dashboard } from "./pages/Dashboard";
import MainLayout from "./components/layout/Mainlayout";
import { Property } from "./pages/Property";


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
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
