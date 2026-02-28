import { ArrowRight } from 'lucide-react';
import { Route } from '../lib/supabase';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

interface RouteCardProps {
  route: Route;
}

export default function RouteCard({ route }: RouteCardProps) {
  const navigate = useNavigate();

  const handleBookRoute = () => {
    const today = new Date().toISOString().split('T')[0];
    navigate(
      `/s-to-d?origin=${route.origin}&destination=${route.destination}&date=${today}`
    );
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      <div className="relative h-48 overflow-hidden">
        <img
          src={route.image_url}
          alt={`${route.origin} to ${route.destination}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-center space-x-2 text-lg font-bold">
            <span>{route.origin}</span>
            <ArrowRight className="w-5 h-5" />
            <span>{route.destination}</span>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div>
            <span className="text-gray-500">Duration:</span>
            <p className="font-semibold text-gray-800">{route.duration}</p>
          </div>
          <div>
            <span className="text-gray-500">Starting Price:</span>
            <p className="font-semibold text-[#FF6B00]">₹{route.starting_price}</p>
          </div>
          <div className="col-span-2">
            <span className="text-gray-500">Frequency:</span>
            <p className="font-semibold text-gray-800">{route.frequency}</p>
          </div>
        </div>

        <Button onClick={handleBookRoute} className="w-full">
          Book This Route
        </Button>
      </div>
    </div>
  );
}
