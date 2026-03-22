import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { useAuth } from "../../contexts/AuthContext";
import { useAdmin } from "../../contexts/AdminContext";
import { dataService } from "../../lib/dataService";

export default function AdminFacilities() {
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState<string[]>([]);
  const [newFacility, setNewFacility] = useState("");

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/login");
      return;
    }
    loadFacilities();
  }, [user, isAdmin, navigate]);

  const loadFacilities = () => {
    setFacilities(dataService.getFacilities());
  };

  const handleAdd = () => {
    if (!newFacility.trim()) {
      alert("Please enter a facility name");
      return;
    }

    if (facilities.includes(newFacility)) {
      alert("This facility already exists");
      return;
    }

    dataService.addFacility(newFacility);
    loadFacilities();
    setNewFacility("");
  };

  const handleDelete = (facility: string) => {
    if (confirm(`Are you sure you want to delete "${facility}"?`)) {
      dataService.removeFacility(facility);
      loadFacilities();
    }
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
            <h1 className="text-3xl font-bold text-gray-900">
              Manage Facilities
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Add Facility Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Add New Facility</h2>
          <div className="flex gap-4">
            <Input
              label="Facility Name"
              value={newFacility}
              onChange={(e) => setNewFacility(e.target.value)}
              placeholder="e.g., WiFi, USB Charging, WiFi Hotspot, etc."
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAdd();
                }
              }}
            />
            <div className="flex items-end">
              <Button onClick={handleAdd} size="lg">
                <Plus className="w-4 h-4 mr-2 inline" />
                Add Facility
              </Button>
            </div>
          </div>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {facilities.length === 0 ? (
            <div className="col-span-3 bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500 text-lg">
                No facilities found. Add one to get started.
              </p>
            </div>
          ) : (
            facilities.map((facility) => (
              <div
                key={facility}
                className="bg-white rounded-lg shadow p-6 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-gray-900">{facility}</p>
                  <p className="text-sm text-gray-600">
                    Available for assignment
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(facility)}
                  className="p-2 hover:bg-red-100 rounded text-red-600"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="font-semibold text-blue-900 mb-2">
            💡 Management Tips
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Add new facilities that buses can offer to customers</li>
            <li>
              • These facilities can be assigned when creating or editing buses
            </li>
            <li>• Deleted facilities will be removed from all buses</li>
            <li>
              • Popular facilities: WiFi, Charging Point, AC, Recliner, Blanket,
              Food, TV, Toilet
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
