import { useState } from 'react';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'url(https://images.pexels.com/photos/1288482/pexels-photo-1288482.jpeg?auto=compress&cs=tinysrgb&w=1200)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Have questions about your journey? Our team is here to help 24/7.
          </p>
          <Button size="lg" onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}>
            <Send className="w-5 h-5 mr-2 inline" />
            Send a Message
          </Button>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-8 text-gray-900">
                Get in <span className="text-[#FF6B00]">Touch</span>
              </h2>

              <div className="space-y-6 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#FF6B00] rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">Address</h3>
                    <p className="text-gray-600">Pimple Gurav, Pune, India</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#FF6B00] rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">Phone</h3>
                    <p className="text-gray-600">738281827172</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#FF6B00] rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">omkarjagtap368@gmail.com</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="w-12 h-12 bg-gray-100 hover:bg-[#FF6B00] text-gray-600 hover:text-white rounded-full flex items-center justify-center transition-all"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 bg-gray-100 hover:bg-[#FF6B00] text-gray-600 hover:text-white rounded-full flex items-center justify-center transition-all"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 bg-gray-100 hover:bg-[#FF6B00] text-gray-600 hover:text-white rounded-full flex items-center justify-center transition-all"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 bg-gray-100 hover:bg-[#FF6B00] text-gray-600 hover:text-white rounded-full flex items-center justify-center transition-all"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>

            <div id="contact-form">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Send us a Message</h2>
                {submitted ? (
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
                    <p className="text-green-700 font-semibold text-lg">
                      Thank you! We'll get back to you soon.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                      label="Name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Your full name"
                    />
                    <Input
                      label="Email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="your.email@example.com"
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                      </label>
                      <textarea
                        required
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        rows={5}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent outline-none transition-all resize-none"
                        placeholder="Tell us how we can help you..."
                      ></textarea>
                    </div>
                    <Button type="submit" className="w-full" size="lg">
                      <Send className="w-5 h-5 mr-2 inline" />
                      Send Message
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Visit Our <span className="text-[#FF6B00]">Office</span>
            </h2>
            <p className="text-gray-600">
              Find us on the map and plan your visit
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3781.1234567890!2d73.7234567!3d18.5678901!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDM0JzA0LjQiTiA3M8KwNDMnMjQuNCJF!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <div className="text-center mt-8">
            <Button
              size="lg"
              onClick={() =>
                window.open(
                  'https://www.google.com/maps/search/Pimple+Gurav+Pune',
                  '_blank'
                )
              }
            >
              <MapPin className="w-5 h-5 mr-2 inline" />
              See Location
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
