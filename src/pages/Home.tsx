import { useEffect, useState } from 'react';
import { MapPin, Calendar, Users, CreditCard, ArrowRight } from 'lucide-react';
import RouteCard from '../components/RouteCard';
import Button from '../components/Button';
import { supabase, Route } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const { data, error } = await supabase
        .from('routes')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setRoutes(data || []);
    } catch (error) {
      console.error('Error fetching routes:', error);
    } finally {
      setLoading(false);
    }
  };

  const displayedRoutes = showAll ? routes : routes.slice(0, 6);

  const bookingSteps = [
    {
      icon: MapPin,
      title: 'Select Your Route',
      description: 'Choose from our extensive network of routes',
    },
    {
      icon: Calendar,
      title: 'Pick Date & Time',
      description: 'Select your preferred travel date and time',
    },
    {
      icon: Users,
      title: 'Choose Your Seat',
      description: 'Pick your favorite seat from available options',
    },
    {
      icon: CreditCard,
      title: 'Secure Payment',
      description: 'Complete booking with secure payment gateway',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-gray-900">Popular </span>
              <span className="text-[#FF6B00]">Routes</span>
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover our most traveled routes connecting major cities across the
              country.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl h-96 animate-pulse"
                ></div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedRoutes.map((route) => (
                  <RouteCard key={route.id} route={route} />
                ))}
              </div>

              {routes.length > 6 && (
                <div className="text-center mt-12">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setShowAll(!showAll)}
                  >
                    {showAll ? 'Show Less' : 'View All Routes'}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-gray-900">Simple </span>
              <span className="text-[#FF6B00]">Booking Process</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Book your bus tickets in just 4 easy steps. Quick, secure, and
              hassle-free.
            </p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2"></div>
            <div className="hidden md:block absolute top-1/2 left-0 h-1 bg-[#FF6B00] -translate-y-1/2 w-3/4"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {bookingSteps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="relative inline-block mb-4">
                    <div className="w-24 h-24 rounded-full border-4 border-[#FF6B00] bg-white flex items-center justify-center mx-auto relative z-10">
                      <step.icon className="w-10 h-10 text-[#FF6B00]" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#FF6B00] text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <Button size="lg" onClick={() => navigate('/')}>
              Start Booking Now
              <ArrowRight className="w-5 h-5 ml-2 inline" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
