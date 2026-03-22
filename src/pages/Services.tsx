import {
  Bus,
  Ticket,
  CreditCard,
  HeadphonesIcon,
  MapPin,
  Shield,
} from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: Bus,
      title: "Luxury Fleet",
      description:
        "Experience premium buses with reclining seats, entertainment, and refreshments",
    },
    {
      icon: Ticket,
      title: "Seamless Booking",
      description:
        "Reserve your seat in seconds with our elegant, user-friendly system",
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      description:
        "Encrypted transactions with multiple payment methods for your peace of mind",
    },
    {
      icon: HeadphonesIcon,
      title: "24/7 Concierge Support",
      description:
        "Dedicated support to make your journey effortless and enjoyable",
    },
    {
      icon: MapPin,
      title: "Pan-India Coverage",
      description:
        "Routes connecting every major city and tourist destination across India",
    },
    {
      icon: Shield,
      title: "Verified Operators",
      description:
        "Only top-tier partners are selected to ensure reliability and comfort",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight mb-6">
            Our <span className="text-[#FF6B00]">Services</span>
          </h1>
          <p className="text-xl text-gray-300">
            Everything you need for a comfortable and hassle-free bus journey
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all hover:-translate-y-2 duration-300"
              >
                <div className="w-16 h-16 bg-[#FF6B00] rounded-full flex items-center justify-center mb-6">
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Why Choose <span className="text-[#FF6B00]">Us?</span>
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            We are committed to providing the best bus booking experience with
            transparent pricing, reliable service, and customer satisfaction at
            the heart of everything we do.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="text-4xl font-bold text-[#FF6B00] mb-2">500+</div>
              <div className="text-gray-600">Routes Covered</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="text-4xl font-bold text-[#FF6B00] mb-2">1M+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="text-4xl font-bold text-[#FF6B00] mb-2">24/7</div>
              <div className="text-gray-600">Support Available</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
