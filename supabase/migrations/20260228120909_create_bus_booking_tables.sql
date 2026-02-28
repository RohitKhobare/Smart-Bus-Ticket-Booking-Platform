/*
  # Create Bus Booking System Tables

  1. New Tables
    - `routes`
      - `id` (uuid, primary key)
      - `origin` (text) - Starting city
      - `destination` (text) - Destination city
      - `duration` (text) - Journey duration (e.g., "3.5 hrs")
      - `starting_price` (integer) - Base price in rupees
      - `frequency` (text) - How often buses run (e.g., "Every 30 mins")
      - `image_url` (text) - Route card image
      - `created_at` (timestamp)
    
    - `buses`
      - `id` (uuid, primary key)
      - `route_id` (uuid, foreign key to routes)
      - `bus_name` (text) - Bus operator name
      - `bus_type` (text) - AC Seater, AC Sleeper, etc.
      - `departure_time` (text) - Departure time
      - `arrival_time` (text) - Arrival time
      - `price` (integer) - Ticket price
      - `seats_available` (integer) - Available seats
      - `total_seats` (integer) - Total seats
      - `rating` (decimal) - Bus rating
      - `amenities` (text array) - List of amenities
      - `created_at` (timestamp)
    
    - `bookings`
      - `id` (uuid, primary key)
      - `bus_id` (uuid, foreign key to buses)
      - `passenger_name` (text)
      - `passenger_email` (text)
      - `passenger_phone` (text)
      - `seat_numbers` (text array) - Booked seat numbers
      - `total_amount` (integer)
      - `booking_date` (date)
      - `status` (text) - confirmed, cancelled, pending
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access (routes and buses)
    - Add policies for authenticated users to create bookings
*/

-- Create routes table
CREATE TABLE IF NOT EXISTS routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  origin text NOT NULL,
  destination text NOT NULL,
  duration text NOT NULL,
  starting_price integer NOT NULL,
  frequency text NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create buses table
CREATE TABLE IF NOT EXISTS buses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id uuid REFERENCES routes(id) ON DELETE CASCADE,
  bus_name text NOT NULL,
  bus_type text NOT NULL,
  departure_time text NOT NULL,
  arrival_time text NOT NULL,
  price integer NOT NULL,
  seats_available integer NOT NULL DEFAULT 40,
  total_seats integer NOT NULL DEFAULT 40,
  rating decimal(2,1) DEFAULT 4.0,
  amenities text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bus_id uuid REFERENCES buses(id) ON DELETE CASCADE,
  passenger_name text NOT NULL,
  passenger_email text NOT NULL,
  passenger_phone text NOT NULL,
  seat_numbers text[] NOT NULL,
  total_amount integer NOT NULL,
  booking_date date NOT NULL,
  status text DEFAULT 'confirmed',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE buses ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Routes policies (public read)
CREATE POLICY "Anyone can view routes"
  ON routes FOR SELECT
  TO public
  USING (true);

-- Buses policies (public read)
CREATE POLICY "Anyone can view buses"
  ON buses FOR SELECT
  TO public
  USING (true);

-- Bookings policies
CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can view their bookings by email"
  ON bookings FOR SELECT
  TO public
  USING (true);

-- Insert popular routes
INSERT INTO routes (origin, destination, duration, starting_price, frequency, image_url) VALUES
  ('Mumbai', 'Pune', '3.5 hrs', 450, 'Every 30 mins', 'https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('Delhi', 'Jaipur', '5 hrs', 650, 'Every hour', 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('Bangalore', 'Mysore', '4 hrs', 550, 'Every 45 mins', 'https://images.pexels.com/photos/2096983/pexels-photo-2096983.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('Chennai', 'Pondicherry', '3 hrs', 400, 'Every hour', 'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('Kolkata', 'Darjeeling', '12 hrs', 1200, 'Daily departures', 'https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('Ahmedabad', 'Udaipur', '6 hrs', 750, 'Twice daily', 'https://images.pexels.com/photos/5626642/pexels-photo-5626642.jpeg?auto=compress&cs=tinysrgb&w=800')
ON CONFLICT DO NOTHING;

-- Insert sample buses for Mumbai-Pune route
INSERT INTO buses (route_id, bus_name, bus_type, departure_time, arrival_time, price, seats_available, total_seats, rating, amenities)
SELECT 
  id,
  'Shivneri Express',
  'AC Seater',
  '06:00 AM',
  '09:30 AM',
  450,
  35,
  40,
  4.5,
  ARRAY['WiFi', 'Charging Point', 'Water Bottle', 'Reading Light']
FROM routes WHERE origin = 'Mumbai' AND destination = 'Pune'
ON CONFLICT DO NOTHING;

INSERT INTO buses (route_id, bus_name, bus_type, departure_time, arrival_time, price, seats_available, total_seats, rating, amenities)
SELECT 
  id,
  'VRL Travels',
  'AC Sleeper',
  '10:00 PM',
  '01:30 AM',
  650,
  28,
  30,
  4.3,
  ARRAY['Blanket', 'Pillow', 'Charging Point', 'Emergency Exit']
FROM routes WHERE origin = 'Mumbai' AND destination = 'Pune'
ON CONFLICT DO NOTHING;

-- Insert sample buses for Delhi-Jaipur route
INSERT INTO buses (route_id, bus_name, bus_type, departure_time, arrival_time, price, seats_available, total_seats, rating, amenities)
SELECT 
  id,
  'Rajasthan Roadways',
  'AC Seater',
  '07:00 AM',
  '12:00 PM',
  650,
  32,
  40,
  4.2,
  ARRAY['WiFi', 'Charging Point', 'Snacks', 'Water Bottle']
FROM routes WHERE origin = 'Delhi' AND destination = 'Jaipur'
ON CONFLICT DO NOTHING;

INSERT INTO buses (route_id, bus_name, bus_type, departure_time, arrival_time, price, seats_available, total_seats, rating, amenities)
SELECT 
  id,
  'Pink City Express',
  'Electric Luxury',
  '02:00 PM',
  '07:00 PM',
  850,
  25,
  30,
  4.8,
  ARRAY['WiFi', 'TV', 'Reclining Seats', 'Charging Point', 'Snacks']
FROM routes WHERE origin = 'Delhi' AND destination = 'Jaipur'
ON CONFLICT DO NOTHING;