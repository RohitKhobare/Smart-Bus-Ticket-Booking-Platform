import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Edit2, Trash2 } from "lucide-react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { useAuth } from "../../contexts/AuthContext";
import { useAdmin } from "../../contexts/AdminContext";
import { dataService } from "../../lib/dataService";
import { Route } from "../../lib/supabase";

export default function AdminRoutes() {
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    duration: "",
    starting_price: 0,
    frequency: "",
    image_url: "",
  });

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/login");
      return;
    }
    loadRoutes();
  }, [user, isAdmin, navigate]);

  const loadRoutes = () => {
    setRoutes(dataService.getRoutes());
  };

  const handleSubmit = () => {
    if (
      !formData.origin ||
      !formData.destination ||
      !formData.duration ||
      !formData.starting_price
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (editing) {
      dataService.updateRoute(editing, {
        ...formData,
        starting_price: Number(formData.starting_price),
      } as any);
    } else {
      dataService.addRoute({
        id: "route-" + Date.now(),
        ...formData,
        starting_price: Number(formData.starting_price),
        created_at: new Date().toISOString(),
      } as any);
    }

    loadRoutes();
    resetForm();
  };

  const handleEdit = (route: Route) => {
    setFormData({
      origin: route.origin,
      destination: route.destination,
      duration: route.duration,
      starting_price: route.starting_price,
      frequency: route.frequency,
      image_url: route.image_url,
    });
    setEditing(route.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this route?")) {
      dataService.deleteRoute(id);
      loadRoutes();
    }
  };

  const resetForm = () => {
    setFormData({
      origin: "",
      destination: "",
      duration: "",
      starting_price: 0,
      frequency: "",
      image_url: "",
    });
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
              Manage Routes
            </h1>
          </div>
          <Button onClick={() => setShowForm(!showForm)} size="lg">
            <Plus className="w-4 h-4 mr-2 inline" />
            {showForm ? "Cancel" : "Add Route"}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">
              {editing ? "Edit Route" : "Add New Route"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Origin"
                value={formData.origin}
                onChange={(e) =>
                  setFormData({ ...formData, origin: e.target.value })
                }
                placeholder="e.g., Mumbai (any city in India)"
              />
              <Input
                label="Destination"
                value={formData.destination}
                onChange={(e) =>
                  setFormData({ ...formData, destination: e.target.value })
                }
                placeholder="e.g., Pune (any city in India)"
              />
              <Input
                label="Duration"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                placeholder="e.g., 3h 15m"
              />
              <Input
                label="Starting Price (₹)"
                type="number"
                value={formData.starting_price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    starting_price: Number(e.target.value),
                  })
                }
                placeholder="450"
              />
              <Input
                label="Frequency"
                value={formData.frequency}
                onChange={(e) =>
                  setFormData({ ...formData, frequency: e.target.value })
                }
                placeholder="e.g., Every 30 mins"
              />
              <Input
                label="Image URL"
                value={formData.image_url}
                onChange={(e) =>
                  setFormData({ ...formData, image_url: e.target.value })
                }
                placeholder="https://..."
              />
            </div>
            <div className="flex gap-4 mt-6">
              <Button onClick={handleSubmit} size="lg" className="flex-1">
                {editing ? "Update Route" : "Add Route"}
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

        {/* Routes Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Starting Price
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Frequency
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {routes.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No routes found. Add one to get started.
                  </td>
                </tr>
              ) : (
                routes.map((route) => (
                  <tr key={route.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">
                        {route.origin} → {route.destination}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {route.duration}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      ₹{route.starting_price}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {route.frequency}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(route)}
                          className="p-2 hover:bg-gray-200 rounded"
                        >
                          <Edit2 className="w-4 h-4 text-[#FF6B00]" />
                        </button>
                        <button
                          onClick={() => handleDelete(route.id)}
                          className="p-2 hover:bg-gray-200 rounded"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
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
