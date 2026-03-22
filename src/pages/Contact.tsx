import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Send,
  CheckCircle,
} from "lucide-react";
import Button from "../components/Button";
import Input from "../components/Input";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const sendEmail = async () => {
    try {
      // Store message in localStorage
      const messages = JSON.parse(
        localStorage.getItem("contact_messages") || "[]",
      );
      messages.push({
        ...formData,
        timestamp: new Date().toISOString(),
        id: "msg-" + Date.now(),
      });
      localStorage.setItem("contact_messages", JSON.stringify(messages));

      // Try to send via webhook if available (e.g., Discord webhook, Formspree, etc)
      try {
        const webhookUrl = localStorage.getItem("email_webhook_url");
        if (webhookUrl) {
          await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              content: `📧 New Contact Message\n\n**From:** ${formData.name} (${formData.email})\n\n**Message:**\n${formData.message}`,
            }),
          }).catch(() => {});
        }
      } catch {}

      return true;
    } catch (err) {
      setError("Failed to process message. Please try again.");
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.message) {
      setError("Please fill in all fields");
      return;
    }

    const success = await sendEmail();
    if (success) {
      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url(https://images.pexels.com/photos/1288482/pexels-photo-1288482.jpeg?auto=compress&cs=tinysrgb&w=1200)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl md:text-7xl font-serif font-bold tracking-tight mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Have questions about your journey? Our team is here to help 24/7.
          </p>
          <Button
            size="lg"
            onClick={() =>
              document
                .getElementById("contact-form")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
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
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                      Address
                    </h3>
                    <p className="text-gray-600">
                      Akurdi, Pune, Maharashtra, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#FF6B00] rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                      Phone
                    </h3>
                    <p className="text-gray-600">9096809820</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#FF6B00] rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                      Email
                    </h3>
                    <p className="text-gray-600">rohitkhobare2005@gmail.com</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-4">
                  Follow Us
                </h3>
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
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                  Send us a Message
                </h2>
                {submitted ? (
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <p className="text-green-700 font-semibold text-lg">
                      Thank you for reaching out!
                    </p>
                    <p className="text-green-600 mt-2">
                      Your message has been recorded. We'll respond to{" "}
                      {formData.email} shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                        {error}
                      </div>
                    )}
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.0238652!2d73.7745!3d18.569!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1sAkurdi%2C+Pune!2s1.0!5e0!3m2!1sen!2sin!4v1234567890"
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
                  "https://www.google.com/maps/search/Akurdi+Pune",
                  "_blank",
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
