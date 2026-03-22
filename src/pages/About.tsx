import { Shield, Clock, Users, Award } from "lucide-react";

export default function About() {
  const features = [
    {
      icon: Shield,
      title: "Luxurious Fleet",
      description: "Travel in style aboard our premium, fully-equipped buses",
    },
    {
      icon: Clock,
      title: "24/7 Concierge Support",
      description: "Personalized assistance anytime during your journey",
    },
    {
      icon: Users,
      title: "Exclusive Membership",
      description:
        "Join our elite travelers club for perks and priority service",
    },
    {
      icon: Award,
      title: "Premium Comfort Promise",
      description: "We guarantee a relaxing and comfortable ride every time",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight mb-6">
            About <span className="text-[#FF6B00]">Raj Mudra Travels</span>
          </h1>
          <p className="text-xl text-gray-300">
            Your trusted partner for comfortable and affordable bus journeys
            across India
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow text-center"
              >
                <div className="w-16 h-16 bg-[#FF6B00] rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Our <span className="text-[#FF6B00]">Story</span>
          </h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="mb-4">
              Raj Mudra Travels has been connecting people and places across
              India for years. We started with a simple mission: to make bus
              travel comfortable, affordable, and accessible to everyone.
            </p>
            <p className="mb-4">
              Today, we partner with hundreds of trusted bus operators to offer
              you the widest selection of routes, timings, and bus types.
              Whether you're traveling for business or leisure, we ensure your
              journey is smooth and enjoyable.
            </p>
            <p>
              Our commitment to quality service, customer satisfaction, and
              innovation has made us one of the most trusted names in bus
              booking services across the country.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
