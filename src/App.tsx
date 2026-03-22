import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import BusSearch from "./pages/BusSearch";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Services from "./pages/Services";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Tracking from "./pages/Tracking";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminRoutes from "./pages/admin/Routes";
import AdminBuses from "./pages/admin/Buses";
import AdminFacilities from "./pages/admin/Facilities";
import AdminBookings from "./pages/admin/Bookings";
import { AuthProvider } from "./contexts/AuthContext";
import { AdminProvider } from "./contexts/AdminContext";

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/s-to-d" element={<BusSearch />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/track" element={<Tracking />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/routes" element={<AdminRoutes />} />
              <Route path="/admin/buses" element={<AdminBuses />} />
              <Route path="/admin/facilities" element={<AdminFacilities />} />
              <Route path="/admin/bookings" element={<AdminBookings />} />
            </Routes>
            <Footer />
          </div>
        </Router>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;
