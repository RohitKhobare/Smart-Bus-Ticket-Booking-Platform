import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold">Raj Mudra Travels</h3>
            <p className="text-sm">Premium Luxury Bus Services Across India</p>
            <p className="text-sm mt-1">Email: rohitkhobare2005@gmail.com</p>
            <p className="text-sm">Phone: +91-XXXXXXXXXX</p>
          </div>
          <div className="mt-4 md:mt-0 text-center md:text-right">
            <Link
              to="/about"
              className="text-sm hover:text-white mr-4 transition-colors"
            >
              About
            </Link>
            <Link
              to="/services"
              className="text-sm hover:text-white transition-colors"
            >
              Services
            </Link>
          </div>
        </div>
        <div className="mt-6 text-center text-xs">
          © 2026 Raj Mudra Travels. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
