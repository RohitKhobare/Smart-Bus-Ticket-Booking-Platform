import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useAdmin } from "../../contexts/AdminContext";
import { dataService } from "../../lib/dataService";

export default function AdminBookings() {
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [buses, setBuses] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/login");
      return;
    }
    loadData();
  }, [user, isAdmin, navigate]);

  const loadData = () => {
    setBookings(dataService.getBookings());
    setBuses(dataService.getBuses());
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this booking?")) {
      dataService.deleteBooking(id);
      loadData();
    }
  };

  const handleStatusUpdate = (id: string, status: string) => {
    dataService.updateBooking(id, { status });
    loadData();
  };

  const filteredBookings = bookings.filter((b) => {
    if (filter === "all") return true;
    return b.status === filter;
  });

  const getBusName = (busId: string) => {
    return buses.find((b) => b.id === busId)?.bus_name || "Unknown Bus";
  };

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    pending: bookings.filter((b) => b.status === "pending").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin")}
              className="text-[#FF6B00] hover:opacity-80"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
              All Bookings
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-medium">Total Bookings</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {stats.total}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-medium">Confirmed</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {stats.confirmed}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-medium">Pending</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">
              {stats.pending}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-medium">Cancelled</p>
            <p className="text-3xl font-bold text-red-600 mt-2">
              {stats.cancelled}
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Filter by Status
          </label>
          <div className="flex gap-3 flex-wrap">
            {["all", "confirmed", "pending", "cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === status
                    ? "bg-[#FF6B00] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Passenger
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Bus
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Seats
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No bookings found.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">
                        {booking.passenger_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {booking.passenger_email}
                      </p>
                      <p className="text-sm text-gray-600">
                        {booking.passenger_phone}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {getBusName(booking.bus_id)}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {Array.isArray(booking.seat_numbers)
                        ? booking.seat_numbers.join(", ")
                        : booking.seat_numbers}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      ₹{booking.total_amount}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={booking.status || "confirmed"}
                        onChange={(e) =>
                          handleStatusUpdate(booking.id, e.target.value)
                        }
                        className={`px-3 py-1 rounded-lg text-sm font-medium border-0 ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : booking.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {booking.booking_date}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(booking.id)}
                        className="p-2 hover:bg-red-100 rounded text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
