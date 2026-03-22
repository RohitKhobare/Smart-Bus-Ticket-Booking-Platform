import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, Search, Clock, Star, Wifi, Zap } from "lucide-react";
import { Bus } from "../lib/supabase";
import { dataService } from "../lib/dataService";
import Button from "../components/Button";
import { useAuth } from "../contexts/AuthContext";
import Input from "../components/Input";
import SeatSelection from "../components/SeatSelection";

export default function BusSearch() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [buses, setBuses] = useState<Bus[]>([]);
  const [filteredBuses, setFilteredBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);

  const { user } = useAuth();
  const [origin, setOrigin] = useState(searchParams.get("origin") || "");
  const [destination, setDestination] = useState(
    searchParams.get("destination") || "",
  );
  const [date, setDate] = useState(searchParams.get("date") || "");

  const [filters, setFilters] = useState({
    busTypes: [] as string[],
    maxPrice: 2000,
    departureTimes: [] as string[],
  });

  const [sortBy, setSortBy] = useState("price");

  useEffect(() => {
    if (origin && destination) {
      fetchBuses();
    }
  }, [origin, destination]);

  // After user logs in, auto-select the bus if coming back from login
  useEffect(() => {
    if (user && location.state?.bus && buses.length > 0) {
      const busToSelect = buses.find((b) => b.id === location.state.bus);
      if (busToSelect) {
        setSelectedBus(busToSelect);
        // Clear the state to prevent re-selection on subsequent renders
        navigate(location.pathname + location.search, { state: {} });
      }
    }
  }, [user, buses, location.state?.bus]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [buses, filters, sortBy]);

  const fetchBuses = () => {
    setLoading(true);
    setError("");

    if (!origin || !destination) {
      setLoading(false);
      return;
    }

    try {
      const routes = dataService.getRoutes();
      const route = routes.find(
        (r) => r.origin === origin && r.destination === destination,
      );

      if (!route) {
        setError("No buses found for this route. Please select a valid route.");
        setBuses([]);
        setFilteredBuses([]);
      } else {
        const busesForRoute = dataService.getBusesByRoute(route.id);
        if (busesForRoute.length === 0) {
          setError("No buses available for this route currently.");
          setBuses([]);
          setFilteredBuses([]);
        } else {
          setBuses(busesForRoute);
        }
      }
    } catch (err) {
      console.error("Error fetching buses:", err);
      setError("Failed to load buses. Please try again.");
      setBuses([]);
      setFilteredBuses([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...buses];

    if (filters.busTypes.length > 0) {
      filtered = filtered.filter((bus) =>
        filters.busTypes.includes(bus.bus_type),
      );
    }

    filtered = filtered.filter((bus) => bus.price <= filters.maxPrice);

    if (filters.departureTimes.length > 0) {
      filtered = filtered.filter((bus) => {
        const hour = parseInt(bus.departure_time.split(":")[0]);
        return filters.departureTimes.some((range) => {
          if (range === "before10") return hour < 10;
          if (range === "10to17") return hour >= 10 && hour < 17;
          if (range === "17to23") return hour >= 17 && hour < 23;
          if (range === "after23") return hour >= 23;
          return false;
        });
      });
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.price - b.price;
        case "seats":
          return b.seats_available - a.seats_available;
        case "rating":
          return b.rating - a.rating;
        case "departure":
          return a.departure_time.localeCompare(b.departure_time);
        case "arrival":
          return a.arrival_time.localeCompare(b.arrival_time);
        default:
          return 0;
      }
    });

    setFilteredBuses(filtered);
  };

  const handleSearch = () => {
    navigate(
      `/s-to-d?origin=${origin}&destination=${destination}&date=${date}`,
    );
    fetchBuses();
  };

  const toggleFilter = (type: "busTypes" | "departureTimes", value: string) => {
    setFilters((prev) => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter((v) => v !== value)
        : [...prev[type], value],
    }));
  };

  const setTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDate(tomorrow.toISOString().split("T")[0]);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              label="From"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Enter origin city"
            />
            <Input
              label="To"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter destination city"
            />
            <div>
              <Input
                label="Departure Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <button
                onClick={setTomorrow}
                className="text-sm text-[#FF6B00] mt-1 hover:underline"
              >
                Tomorrow
              </button>
            </div>
            <div className="flex items-end">
              <Button onClick={handleSearch} className="w-full">
                <Search className="w-5 h-5 mr-2 inline" />
                Search
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-4">Filters</h3>

              <div className="mb-6">
                <h4 className="font-semibold mb-3">Bus Type</h4>
                <div className="space-y-2">
                  {[
                    "Non AC Seater",
                    "AC Seater",
                    "AC Sleeper",
                    "Non AC Sleeper",
                    "Electric Luxury",
                  ].map((type) => (
                    <label
                      key={type}
                      className="flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={filters.busTypes.includes(type)}
                        onChange={() => toggleFilter("busTypes", type)}
                        className="w-4 h-4 text-[#FF6B00] rounded focus:ring-[#FF6B00]"
                      />
                      <span className="ml-2 text-sm">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold mb-3">Price Ceiling</h4>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="50"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      maxPrice: parseInt(e.target.value),
                    })
                  }
                  className="w-full"
                />
                <div className="flex justify-between text-sm mt-2">
                  <span>₹0</span>
                  <span className="font-semibold text-[#FF6B00]">
                    ₹{filters.maxPrice}
                  </span>
                  <span>₹2000</span>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold mb-3">Departure Time</h4>
                <div className="space-y-2">
                  {[
                    { label: "Before 10 AM", value: "before10" },
                    { label: "10 AM - 5 PM", value: "10to17" },
                    { label: "5 PM - 11 PM", value: "17to23" },
                    { label: "After 11 PM", value: "after23" },
                  ].map((time) => (
                    <label
                      key={time.value}
                      className="flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={filters.departureTimes.includes(time.value)}
                        onChange={() =>
                          toggleFilter("departureTimes", time.value)
                        }
                        className="w-4 h-4 text-[#FF6B00] rounded focus:ring-[#FF6B00]"
                      />
                      <span className="ml-2 text-sm">{time.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <main className="lg:w-3/4">
            <div className="bg-white rounded-2xl shadow-md p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing {filteredBuses.length} buses
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent outline-none"
                >
                  <option value="price">Price</option>
                  <option value="seats">Seats</option>
                  <option value="rating">Ratings</option>
                  <option value="arrival">Arrival Time</option>
                  <option value="departure">Departure Time</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl h-48 animate-pulse"
                  ></div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
                <p className="text-red-600 font-semibold text-lg">{error}</p>
              </div>
            ) : filteredBuses.length === 0 ? (
              <div className="bg-gray-50 rounded-2xl p-8 text-center">
                <p className="text-gray-600 text-lg">
                  No buses found matching your criteria
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredBuses.map((bus) => (
                  <div
                    key={bus.id}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow p-6"
                  >
                    <div className="flex flex-col lg:flex-row justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">
                              {bus.bus_name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {bus.bus_type}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full">
                            <Star className="w-4 h-4 text-green-600 fill-green-600" />
                            <span className="font-semibold text-green-700">
                              {bus.rating}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-8 mb-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">
                              {bus.departure_time}
                            </div>
                            <div className="text-sm text-gray-600">
                              {origin}
                            </div>
                          </div>
                          <div className="flex-1 flex items-center">
                            <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
                            <Clock className="w-5 h-5 text-gray-400 mx-2" />
                            <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">
                              {bus.arrival_time}
                            </div>
                            <div className="text-sm text-gray-600">
                              {destination}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {bus.amenities.map((amenity, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-700"
                            >
                              {amenity.includes("WiFi") && (
                                <Wifi className="w-3 h-3" />
                              )}
                              {amenity.includes("Electric") && (
                                <Zap className="w-3 h-3" />
                              )}
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="lg:w-48 flex flex-col justify-between items-end">
                        <div className="text-right mb-4">
                          <div className="text-3xl font-bold text-[#FF6B00]">
                            ₹{bus.price}
                          </div>
                          <div className="text-sm text-gray-600">
                            {bus.seats_available} seats available
                          </div>
                        </div>
                        <Button
                          className="w-full lg:w-auto"
                          onClick={() => {
                            if (!user) {
                              navigate("/login", {
                                state: {
                                  from: location.pathname + location.search,
                                  bus: bus.id,
                                },
                              });
                            } else {
                              setSelectedBus(bus);
                            }
                          }}
                        >
                          Select Seats
                          <ArrowRight className="w-4 h-4 ml-2 inline" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {selectedBus && (
        <SeatSelection
          bus={selectedBus}
          origin={origin}
          destination={destination}
          date={date}
          onClose={() => {
            setSelectedBus(null);
            fetchBuses();
          }}
        />
      )}
    </div>
  );
}
