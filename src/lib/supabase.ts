import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // log a clear warning and create a dummy client so the application
  // does not crash immediately on import. Components can check for
  // `supabase` being null if desired.
  console.error(
    "Supabase environment variables are not set. Please copy .env.example to .env and add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
  );
}

// helpful flag for other modules to know whether real auth is available
export const SUPABASE_CONFIGURED = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : // create a no-op stub client to avoid null checks everywhere
      ({ auth: undefined } as any); // leave auth undefined so guards can detect missing configuration

export interface Route {
  id: string;
  origin: string;
  destination: string;
  duration: string;
  starting_price: number;
  frequency: string;
  image_url: string;
  created_at: string;
}

export interface Bus {
  id: string;
  route_id: string;
  bus_name: string;
  bus_type: string;
  departure_time: string;
  arrival_time: string;
  price: number;
  seats_available: number;
  total_seats: number;
  rating: number;
  amenities: string[];
  created_at: string;
}

export interface Booking {
  id?: string;
  bus_id: string;
  passenger_name: string;
  passenger_email: string;
  passenger_phone: string;
  seat_numbers: string[];
  total_amount: number;
  booking_date: string;
  status?: string;
}
