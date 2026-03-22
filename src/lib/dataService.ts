import { Route, Bus } from "./supabase";
import { SAMPLE_ROUTES, SAMPLE_BUSES } from "./sampleData";

const ROUTES_KEY = "app_routes";
const BUSES_KEY = "app_buses";
const BOOKINGS_KEY = "bookings";
const FACILITIES_KEY = "bus_facilities";

// Initialize with sample data on first load
const initializeData = () => {
  const ROUTES_VERSION = "v3"; // Bump version when sample data changes
  const storedVersion = localStorage.getItem("ROUTES_VERSION");

  // Reset cache if version changed (ensures latest sample data is used)
  if (storedVersion !== ROUTES_VERSION) {
    localStorage.setItem(ROUTES_KEY, JSON.stringify(SAMPLE_ROUTES));
    localStorage.setItem(BUSES_KEY, JSON.stringify(SAMPLE_BUSES));
    localStorage.setItem("ROUTES_VERSION", ROUTES_VERSION);
  } else if (!localStorage.getItem(ROUTES_KEY)) {
    localStorage.setItem(ROUTES_KEY, JSON.stringify(SAMPLE_ROUTES));
  }
  if (!localStorage.getItem(BUSES_KEY)) {
    localStorage.setItem(BUSES_KEY, JSON.stringify(SAMPLE_BUSES));
  }
};

export const dataService = {
  // Routes Management
  getRoutes: (): Route[] => {
    initializeData();
    return JSON.parse(localStorage.getItem(ROUTES_KEY) || "[]");
  },

  addRoute: (route: Route): Route => {
    const routes = dataService.getRoutes();
    routes.push(route);
    localStorage.setItem(ROUTES_KEY, JSON.stringify(routes));
    return route;
  },

  updateRoute: (id: string, updates: Partial<Route>): Route | null => {
    const routes = dataService.getRoutes();
    const index = routes.findIndex((r) => r.id === id);
    if (index !== -1) {
      routes[index] = { ...routes[index], ...updates };
      localStorage.setItem(ROUTES_KEY, JSON.stringify(routes));
      return routes[index];
    }
    return null;
  },

  deleteRoute: (id: string): boolean => {
    const routes = dataService.getRoutes();
    const filtered = routes.filter((r) => r.id !== id);
    if (filtered.length < routes.length) {
      localStorage.setItem(ROUTES_KEY, JSON.stringify(filtered));
      // Also delete associated buses
      const buses = dataService.getBuses();
      const updatedBuses = buses.filter((b) => b.route_id !== id);
      localStorage.setItem(BUSES_KEY, JSON.stringify(updatedBuses));
      return true;
    }
    return false;
  },

  // Buses Management
  getBuses: (): Bus[] => {
    initializeData();
    return JSON.parse(localStorage.getItem(BUSES_KEY) || "[]");
  },

  addBus: (bus: Bus): Bus => {
    const buses = dataService.getBuses();
    buses.push(bus);
    localStorage.setItem(BUSES_KEY, JSON.stringify(buses));
    return bus;
  },

  updateBus: (id: string, updates: Partial<Bus>): Bus | null => {
    const buses = dataService.getBuses();
    const index = buses.findIndex((b) => b.id === id);
    if (index !== -1) {
      buses[index] = { ...buses[index], ...updates };
      localStorage.setItem(BUSES_KEY, JSON.stringify(buses));
      return buses[index];
    }
    return null;
  },

  deleteBus: (id: string): boolean => {
    const buses = dataService.getBuses();
    const filtered = buses.filter((b) => b.id !== id);
    if (filtered.length < buses.length) {
      localStorage.setItem(BUSES_KEY, JSON.stringify(filtered));
      return true;
    }
    return false;
  },

  getBusesByRoute: (routeId: string): Bus[] => {
    return dataService.getBuses().filter((b) => b.route_id === routeId);
  },

  // Facilities Management
  getFacilities: (): string[] => {
    return JSON.parse(
      localStorage.getItem(FACILITIES_KEY) ||
        '["WiFi", "Charging Point", "AC", "Recliner", "Blanket", "Food", "TV", "Toilet"]',
    );
  },

  addFacility: (facility: string): void => {
    const facilities = dataService.getFacilities();
    if (!facilities.includes(facility)) {
      facilities.push(facility);
      localStorage.setItem(FACILITIES_KEY, JSON.stringify(facilities));
    }
  },

  removeFacility: (facility: string): void => {
    const facilities = dataService.getFacilities();
    const filtered = facilities.filter((f) => f !== facility);
    localStorage.setItem(FACILITIES_KEY, JSON.stringify(filtered));
  },

  // Bookings Management
  getBookings: (): any[] => {
    return JSON.parse(localStorage.getItem(BOOKINGS_KEY) || "[]");
  },

  getBookingsByUser: (email: string): any[] => {
    return dataService.getBookings().filter((b) => b.passenger_email === email);
  },

  getBookingsByBus: (busId: string): any[] => {
    return dataService.getBookings().filter((b) => b.bus_id === busId);
  },

  addBooking: (booking: any): any => {
    const bookings = dataService.getBookings();
    const newBooking = { ...booking, id: "booking-" + Date.now() };
    bookings.push(newBooking);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    return newBooking;
  },

  updateBooking: (id: string, updates: any): any | null => {
    const bookings = dataService.getBookings();
    const index = bookings.findIndex((b) => b.id === id);
    if (index !== -1) {
      bookings[index] = { ...bookings[index], ...updates };
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
      return bookings[index];
    }
    return null;
  },

  deleteBooking: (id: string): boolean => {
    const bookings = dataService.getBookings();
    const filtered = bookings.filter((b) => b.id !== id);
    if (filtered.length < bookings.length) {
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(filtered));
      return true;
    }
    return false;
  },

  // Export/Import
  exportData: () => {
    return {
      routes: dataService.getRoutes(),
      buses: dataService.getBuses(),
      bookings: dataService.getBookings(),
      facilities: dataService.getFacilities(),
    };
  },

  importData: (data: any) => {
    if (data.routes)
      localStorage.setItem(ROUTES_KEY, JSON.stringify(data.routes));
    if (data.buses) localStorage.setItem(BUSES_KEY, JSON.stringify(data.buses));
    if (data.bookings)
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(data.bookings));
    if (data.facilities)
      localStorage.setItem(FACILITIES_KEY, JSON.stringify(data.facilities));
  },
};
