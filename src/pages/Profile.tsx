import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, MapPin, Calendar } from "lucide-react";
import Button from "../components/Button";
import { useAuth } from "../contexts/AuthContext";
import { dataService } from "../lib/dataService";

export default function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [buses, setBuses] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadBookings();
  }, [user, navigate]);

  const loadBookings = () => {
    if (user?.email) {
      setBookings(dataService.getBookingsByUser(user.email));
      setBuses(dataService.getBuses());
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const getBusDetails = (busId: string) => {
    return buses.find((b) => b.id === busId);
  };

  const getStatusBadge = (status: string) => {
    return (
      {
        confirmed: "bg-green-100 text-green-800",
        pending: "bg-yellow-100 text-yellow-800",
        cancelled: "bg-red-100 text-red-800",
      }[status] || "bg-gray-100 text-gray-800"
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#FF6B00] rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2 inline" />
            Logout
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Account Info */}
        <div className="bg-white rounded-lg shadow p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            Account Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-600">Email Address</label>
              <p className="text-lg font-semibold text-gray-900">
                {user?.email}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-600">User ID</label>
              <p className="text-lg font-semibold text-gray-900">{user?.id}</p>
            </div>
          </div>
        </div>

        {/* My Bookings */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">My Bookings</h2>

          {bookings.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-500 text-lg mb-4">
                You don't have any bookings yet.
              </p>
              <Button onClick={() => navigate("/")}>Start Booking Now</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {bookings.map((booking) => {
                const bus = getBusDetails(booking.bus_id);
                return (
                  <div
                    key={booking.id}
                    className="bg-white rounded-lg shadow p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {bus?.bus_name}
                        </h3>
                        <p className="text-gray-600">
                          {bus?.bus_type} • Booking #{booking.id}
                        </p>
                      </div>
                      <span
                        className={`px-4 py-1 rounded-full text-sm font-semibold ${getStatusBadge(booking.status || "confirmed")}`}
                      >
                        {(booking.status || "confirmed")
                          .charAt(0)
                          .toUpperCase() +
                          (booking.status || "confirmed").slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-[#FF6B00] mt-1" />
                        <div>
                          <p className="text-sm text-gray-600">Seats</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {Array.isArray(booking.seat_numbers)
                              ? booking.seat_numbers.join(", ")
                              : booking.seat_numbers}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-[#FF6B00] mt-1" />
                        <div>
                          <p className="text-sm text-gray-600">Booking Date</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {booking.booking_date}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">Total Amount</p>
                          <p className="text-2xl font-bold text-[#FF6B00]">
                            ₹{booking.total_amount}
                          </p>
                        </div>
                        {booking.status === "confirmed" && (
                          <Button variant="outline">Download Ticket</Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
