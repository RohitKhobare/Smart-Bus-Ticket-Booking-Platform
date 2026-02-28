import { useState } from 'react';
import { X } from 'lucide-react';
import Button from './Button';
import Input from './Input';
import { supabase, Bus } from '../lib/supabase';

interface SeatSelectionProps {
  bus: Bus;
  origin: string;
  destination: string;
  date: string;
  onClose: () => void;
}

export default function SeatSelection({
  bus,
  origin,
  destination,
  date,
  onClose,
}: SeatSelectionProps) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [passengerInfo, setPassengerInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [booking, setBooking] = useState(false);
  const [success, setSuccess] = useState(false);

  const seatLayout = Array.from({ length: bus.total_seats }, (_, i) => `${i + 1}`);
  const occupiedSeats = Array.from(
    { length: bus.total_seats - bus.seats_available },
    (_, i) => `${i + 1}`
  );

  const toggleSeat = (seat: string) => {
    if (occupiedSeats.includes(seat)) return;

    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0 || !passengerInfo.name || !passengerInfo.email || !passengerInfo.phone) {
      alert('Please fill all details and select at least one seat');
      return;
    }

    setBooking(true);
    try {
      const { error } = await supabase.from('bookings').insert({
        bus_id: bus.id,
        passenger_name: passengerInfo.name,
        passenger_email: passengerInfo.email,
        passenger_phone: passengerInfo.phone,
        seat_numbers: selectedSeats,
        total_amount: bus.price * selectedSeats.length,
        booking_date: date,
        status: 'confirmed',
      });

      if (error) throw error;

      await supabase
        .from('buses')
        .update({ seats_available: bus.seats_available - selectedSeats.length })
        .eq('id', bus.id);

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to book tickets. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{bus.bus_name}</h2>
            <p className="text-gray-600">
              {origin} → {destination}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Booking Confirmed!
            </h3>
            <p className="text-gray-600 mb-4">
              Your tickets have been booked successfully.
            </p>
            <div className="bg-gray-50 rounded-xl p-4 text-left max-w-md mx-auto">
              <p className="text-sm text-gray-600 mb-1">Booking Details:</p>
              <p className="font-semibold">Seats: {selectedSeats.join(', ')}</p>
              <p className="font-semibold">
                Total: ₹{bus.price * selectedSeats.length}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Confirmation sent to {passengerInfo.email}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="mb-6">
              <h3 className="font-semibold mb-4 text-center">Select Your Seats</h3>
              <div className="flex justify-center mb-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#FF6B00] rounded"></div>
                  <span>Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-400 rounded"></div>
                  <span>Occupied</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
                {seatLayout.map((seat) => (
                  <button
                    key={seat}
                    onClick={() => toggleSeat(seat)}
                    disabled={occupiedSeats.includes(seat)}
                    className={`w-full h-12 rounded font-semibold transition-all ${
                      occupiedSeats.includes(seat)
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : selectedSeats.includes(seat)
                        ? 'bg-[#FF6B00] text-white scale-105'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    }`}
                  >
                    {seat}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold mb-4">Passenger Details</h3>
              <div className="space-y-4 max-w-md mx-auto">
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={passengerInfo.name}
                  onChange={(e) =>
                    setPassengerInfo({ ...passengerInfo, name: e.target.value })
                  }
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={passengerInfo.email}
                  onChange={(e) =>
                    setPassengerInfo({ ...passengerInfo, email: e.target.value })
                  }
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="1234567890"
                  value={passengerInfo.phone}
                  onChange={(e) =>
                    setPassengerInfo({ ...passengerInfo, phone: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="border-t border-gray-200 mt-6 pt-6">
              <div className="flex justify-between items-center mb-4 max-w-md mx-auto">
                <div>
                  <p className="text-gray-600">Selected Seats:</p>
                  <p className="font-bold text-lg">
                    {selectedSeats.length === 0
                      ? 'None'
                      : selectedSeats.join(', ')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600">Total Amount:</p>
                  <p className="font-bold text-2xl text-[#FF6B00]">
                    ₹{bus.price * selectedSeats.length}
                  </p>
                </div>
              </div>
              <div className="max-w-md mx-auto">
                <Button
                  onClick={handleBooking}
                  disabled={booking || selectedSeats.length === 0}
                  className="w-full"
                  size="lg"
                >
                  {booking ? 'Processing...' : 'Confirm Booking'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
