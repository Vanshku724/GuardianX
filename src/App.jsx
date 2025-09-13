import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Map from "./pages/Map";
import SOS from "./pages/SOS";
import Resources from "./pages/Resources";
import Preparedness from "./pages/Preparedness";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/map" element={<Map />} />
        <Route path="/sos" element={<SOS />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/preparedness" element={<Preparedness />} />
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-red-500">
              404 | Page Not Found
            </div>
          }
        />
      </Routes>
    </Router>
  );
}
