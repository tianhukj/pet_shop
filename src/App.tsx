import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Booking from "@/pages/Booking";
import Pets from "@/pages/Pets";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/pets" element={<Pets />} />
      </Routes>
    </Router>
  );
}
