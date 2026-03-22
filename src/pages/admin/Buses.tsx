import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Edit2, Trash2 } from "lucide-react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { useAuth } from "../../contexts/AuthContext";
import { useAdmin } from "../../contexts/AdminContext";
import { dataService } from "../../lib/dataService";
import { Bus, Route } from "../../lib/supabase";

export default function AdminBuses() {
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const [buses, setBuses] = useState<Bus[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [facilities, setFacilities] = useState<string[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    route_id: "",
    bus_name: "",
    bus_type: "",
    departure_time: "",
    arrival_time: "",
    price: 0,
    seats_available: 0,
    total_seats: 0,
    rating: 0,
  });

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/login");
      return;
    }
    loadData();
  }, [user, isAdmin, navigate]);

  const loadData = () => {
    setBuses(dataService.getBuses());
    setRoutes(dataService.getRoutes());
    setFacilities(dataService.getFacilities());
  };

  const handleSubmit = () => {
    if (
      !formData.route_id ||
      !formData.bus_name ||
      !formData.bus_type ||
      !formData.departure_time ||
      !formData.arrival_time ||
      !formData.total_seats
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (editing) {
      dataService.updateBus(editing, {
        ...formData,
        price: Number(formData.price),
        seats_available: Number(formData.seats_available),
        total_seats: Number(formData.total_seats),
        rating: Number(formData.rating),
        amenities: selectedAmenities,
      } as any);
    } else {
      dataService.addBus({
        id: "bus-" + Date.now(),
        ...formData,
        price: Number(formData.price),
        seats_available: Number(formData.seats_available),
        total_seats: Number(formData.total_seats),
        rating: Number(formData.rating),
        amenities: selectedAmenities,
        created_at: new Date().toISOString(),
      } as any);
    }

    loadData();
    resetForm();
  };

  const handleEdit = (bus: Bus) => {
    setFormData({
      route_id: bus.route_id,
      bus_name: bus.bus_name,
      bus_type: bus.bus_type,
      departure_time: bus.departure_time,
      arrival_time: bus.arrival_time,
      price: bus.price,
      seats_available: bus.seats_available,
      total_seats: bus.total_seats,
      rating: bus.rating,
    });
    setSelectedAmenities(bus.amenities || []);
    setEditing(bus.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this bus?")) {
      dataService.deleteBus(id);
      loadData();
    }
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity],
    );
  };

  const resetForm = () => {
    setFormData({
      route_id: "",
      bus_name: "",
      bus_type: "",
      departure_time: "",
      arrival_time: "",
      price: 0,
      seats_available: 0,
      total_seats: 0,
      rating: 0,
    });
    setSelectedAmenities([]);
    setEditing(null);
    setShowForm(false);
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
              Manage Buses
            </h1>
          </div>
          <Button onClick={() => setShowForm(!showForm)} size="lg">
            <Plus className="w-4 h-4 mr-2 inline" />
            {showForm ? "Cancel" : "Add Bus"}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">
              {editing ? "Edit Bus" : "Add New Bus"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Route
                </label>
                <select
                  value={formData.route_id}
                  onChange={(e) =>
                    setFormData({ ...formData, route_id: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] outline-none"
                >
                  <option value="">Select Route</option>
                  {routes.map((route) => (
                    <option key={route.id} value={route.id}>
                      {route.origin} → {route.destination}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                label="Bus Name"
                value={formData.bus_name}
                onChange={(e) =>
                  setFormData({ ...formData, bus_name: e.target.value })
                }
                placeholder="e.g., Mumbai Express (Luxury)"
              />
              <Input
                label="Bus Type"
                value={formData.bus_type}
                onChange={(e) =>
                  setFormData({ ...formData, bus_type: e.target.value })
                }
                placeholder="e.g., Luxury AC Sleeper"
              />
              <Input
                label="Departure Time"
                type="time"
                value={formData.departure_time}
                onChange={(e) =>
                  setFormData({ ...formData, departure_time: e.target.value })
                }
              />
              <Input
                label="Arrival Time"
                type="time"
                value={formData.arrival_time}
                onChange={(e) =>
                  setFormData({ ...formData, arrival_time: e.target.value })
                }
              />
              <Input
                label="Price (₹)"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                placeholder="450"
              />
              <Input
                label="Total Seats"
                type="number"
                value={formData.total_seats}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    total_seats: Number(e.target.value),
                  })
                }
                placeholder="40"
              />
              <Input
                label="Available Seats"
                type="number"
                value={formData.seats_available}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    seats_available: Number(e.target.value),
                  })
                }
                placeholder="40"
              />
              <Input
                label="Rating (0-5)"
                type="number"
                step="0.1"
                value={formData.rating}
                onChange={(e) =>
                  setFormData({ ...formData, rating: Number(e.target.value) })
                }
                placeholder="4.5"
              />
            </div>

            {/* Amenities */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Facilities
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {facilities.map((facility) => (
                  <label
                    key={facility}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(facility)}
                      onChange={() => toggleAmenity(facility)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm">{facility}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button onClick={handleSubmit} size="lg" className="flex-1">
                {editing ? "Update Bus" : "Add Bus"}
              </Button>
              <Button
                onClick={resetForm}
                variant="outline"
                size="lg"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Buses Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Bus Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Seats
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {buses.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No buses found. Add one to get started.
                  </td>
                </tr>
              ) : (
                buses.map((bus) => {
                  const route = routes.find((r) => r.id === bus.route_id);
                  return (
                    <tr key={bus.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">
                          {bus.bus_name}
                        </p>
                        <p className="text-sm text-gray-600">{bus.bus_type}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {route?.origin} → {route?.destination}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {bus.departure_time} - {bus.arrival_time}
                      </td>
                      <td className="px-6 py-4 text-gray-600">₹{bus.price}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {bus.seats_available}/{bus.total_seats}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(bus)}
                            className="p-2 hover:bg-gray-200 rounded"
                          >
                            <Edit2 className="w-4 h-4 text-[#FF6B00]" />
                          </button>
                          <button
                            onClick={() => handleDelete(bus.id)}
                            className="p-2 hover:bg-gray-200 rounded"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
