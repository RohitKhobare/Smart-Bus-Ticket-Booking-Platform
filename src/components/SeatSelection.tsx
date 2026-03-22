import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, AlertCircle, CheckCircle } from "lucide-react";
import Button from "./Button";
import Input from "./Input";
import { Bus } from "../lib/supabase";
import { dataService } from "../lib/dataService";
import { initiatePayment, recordPayment } from "../lib/paymentService";

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
    name: "",
    email: "",
    phone: "",
  });
  const [booking, setBooking] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);

  const seatLayout = Array.from(
    { length: bus.total_seats },
    (_, i) => `${i + 1}`,
  );
  const occupiedSeats = Array.from(
    { length: bus.total_seats - bus.seats_available },
    (_, i) => `${i + 1}`,
  );

  const totalAmount = bus.price * selectedSeats.length;
  const bookingId = `booking-${Date.now()}`;

  const toggleSeat = (seat: string) => {
    if (occupiedSeats.includes(seat)) return;

    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat],
    );
  };

  const navigate = useNavigate();

  const finalizeBooking = async (paymentId: string, orderId: string) => {
    try {
      const bookingData = {
        bus_id: bus.id,
        passenger_name: passengerInfo.name,
        passenger_email: passengerInfo.email,
        passenger_phone: passengerInfo.phone,
        seat_numbers: selectedSeats,
        total_amount: totalAmount,
        booking_date: date,
        status: "confirmed",
        payment_id: paymentId,
        order_id: orderId,
      };

      // Save booking to dataService
      dataService.addBooking(bookingData);

      // Update bus seats availability
      dataService.updateBus(bus.id, {
        seats_available: bus.seats_available - selectedSeats.length,
      });

      // Record payment
      recordPayment(paymentId, orderId, totalAmount, bookingId, "success");

      setSuccess(true);
      // navigate to tracking page after short delay so user sees confirmation
      setTimeout(() => {
        navigate(`/track?bus=${bus.id}`);
        onClose();
      }, 3000);
    } catch (error: any) {
      console.error("Booking error:", error);
      setPaymentError("Failed to complete booking. Please try again.");
    } finally {
      setBooking(false);
      setProcessingPayment(false);
    }
  };

  const handlePayment = async () => {
    // Validation
    if (selectedSeats.length === 0) {
      setPaymentError("Please select at least one seat");
      return;
    }

    if (!passengerInfo.name || !passengerInfo.email || !passengerInfo.phone) {
      setPaymentError("Please fill in all passenger details");
      return;
    }

    setPaymentError("");
    setProcessingPayment(true);
    setBooking(true);

    // Initiate Razorpay payment
    initiatePayment(
      totalAmount,
      passengerInfo.name,
      passengerInfo.email,
      passengerInfo.phone,
      bookingId,
      (paymentId: string, orderId: string) => {
        // Payment successful
        finalizeBooking(paymentId, orderId);
      },
      (error: string) => {
        // Payment failed
        setPaymentError(error);
        setBooking(false);
        setProcessingPayment(false);
        recordPayment("", "", totalAmount, bookingId, "failed");
      },
    );
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
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Booking Confirmed!
            </h3>
            <p className="text-gray-600 mb-4">
              Your payment has been processed successfully and tickets are
              booked.
            </p>
            <div className="bg-gray-50 rounded-xl p-4 text-left max-w-md mx-auto">
              <p className="text-sm text-gray-600 mb-1">Booking Details:</p>
              <p className="font-semibold">Seats: {selectedSeats.join(", ")}</p>
              <p className="font-semibold">Total: ₹{totalAmount}</p>
              <p className="text-sm text-gray-600 mt-2">
                Confirmation sent to {passengerInfo.email}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Booking ID: {bookingId}
              </p>
            </div>
            <div className="mt-6">
              <Button
                variant="outline"
                onClick={() => navigate(`/track?bus=${bus.id}`)}
              >
                Track Your Bus
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            {/* Error Message */}
            {paymentError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-800">Payment Error</p>
                  <p className="text-sm text-red-700">{paymentError}</p>
                </div>
              </div>
            )}

            <div className="mb-6">
              <h3 className="font-semibold mb-4 text-center">
                Select Your Seats
              </h3>
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
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : selectedSeats.includes(seat)
                          ? "bg-[#FF6B00] text-white scale-105"
                          : "bg-gray-200 hover:bg-gray-300 text-gray-800"
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
                    setPassengerInfo({
                      ...passengerInfo,
                      email: e.target.value,
                    })
                  }
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="1234567890"
                  value={passengerInfo.phone}
                  onChange={(e) =>
                    setPassengerInfo({
                      ...passengerInfo,
                      phone: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="border-t border-gray-200 mt-6 pt-6">
              <div className="flex justify-between items-center mb-6 max-w-md mx-auto">
                <div>
                  <p className="text-gray-600">Selected Seats:</p>
                  <p className="font-bold text-lg">
                    {selectedSeats.length === 0
                      ? "None"
                      : selectedSeats.join(", ")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600">Total Amount:</p>
                  <p className="font-bold text-2xl text-[#FF6B00]">
                    ₹{totalAmount}
                  </p>
                </div>
              </div>

              <div className="max-w-md mx-auto">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>Secure Payment:</strong> Your payment will be
                    processed securely via Razorpay. You'll be redirected to the
                    payment gateway.
                  </p>
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={
                    booking ||
                    selectedSeats.length === 0 ||
                    !passengerInfo.name ||
                    !passengerInfo.email ||
                    !passengerInfo.phone ||
                    processingPayment
                  }
                  className="w-full"
                  size="lg"
                >
                  {processingPayment
                    ? "Processing Payment..."
                    : `Pay ₹${totalAmount} & Confirm Booking`}
                </Button>

                <p className="text-xs text-gray-600 text-center mt-3">
                  By proceeding, you accept our terms & conditions
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
