import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
