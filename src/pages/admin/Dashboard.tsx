import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Bus as BusIcon,
  Users,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import Button from "../../components/Button";
import { useAuth } from "../../contexts/AuthContext";
import { useAdmin } from "../../contexts/AdminContext";
import { dataService } from "../../lib/dataService";

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    routes: 0,
    buses: 0,
    bookings: 0,
    revenue: 0,
  });

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/login");
      return;
    }

    const routes = dataService.getRoutes();
    const buses = dataService.getBuses();
    const bookings = dataService.getBookings();
    const revenue = bookings.reduce(
      (sum: number, b: any) => sum + (b.total_amount || 0),
      0,
    );

    setStats({
      routes: routes.length,
      buses: buses.length,
      bookings: bookings.length,
      revenue,
    });
  }, [user, isAdmin, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Welcome, {user?.email}</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2 inline" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Total Routes
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.routes}
                </p>
              </div>
              <MapPin className="w-12 h-12 text-[#FF6B00] opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Buses</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.buses}
                </p>
              </div>
              <BusIcon className="w-12 h-12 text-[#FF6B00] opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Total Bookings
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.bookings}
                </p>
              </div>
              <Users className="w-12 h-12 text-[#FF6B00] opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Total Revenue
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ₹{stats.revenue}
                </p>
              </div>
              <BarChart3 className="w-12 h-12 text-[#FF6B00] opacity-20" />
            </div>
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Routes Management */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Manage Routes
              </h2>
              <MapPin className="w-8 h-8 text-[#FF6B00]" />
            </div>
            <p className="text-gray-600 mb-4">
              Add, edit, or delete bus routes. Manage origins, destinations,
              durations, and pricing.
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/admin/routes")}
              className="w-full"
            >
              Go to Routes
            </Button>
          </div>

          {/* Buses Management */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Manage Buses</h2>
              <BusIcon className="w-8 h-8 text-[#FF6B00]" />
            </div>
            <p className="text-gray-600 mb-4">
              Add, edit, or delete buses. Configure bus types, timings,
              amenities, and seat availability.
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/admin/buses")}
              className="w-full"
            >
              Go to Buses
            </Button>
          </div>

          {/* Bookings Management */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                View Bookings
              </h2>
              <Users className="w-8 h-8 text-[#FF6B00]" />
            </div>
            <p className="text-gray-600 mb-4">
              View all customer bookings, confirm cancellations, and manage
              reservations.
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/admin/bookings")}
              className="w-full"
            >
              Go to Bookings
            </Button>
          </div>

          {/* Facilities Management */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Manage Facilities
              </h2>
              <Settings className="w-8 h-8 text-[#FF6B00]" />
            </div>
            <p className="text-gray-600 mb-4">
              Add or remove available bus facilities/amenities that can be
              assigned to buses.
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/admin/facilities")}
              className="w-full"
            >
              Go to Facilities
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
