import { Bus, Menu, X, Settings, User } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useAdmin } from "../contexts/AdminContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-black text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Bus className="w-8 h-8 text-[#FF6B00]" />
          </Link>

          <Link to="/" className="text-xl sm:text-2xl font-bold">
            <span className="text-white">Raj </span>
            <span className="text-[#FF6B00]">Mudra </span>
            <span className="text-white">Travels</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`hover:text-[#FF6B00] transition-colors ${
                isActive("/") ? "text-[#FF6B00]" : ""
              }`}
            >
              Bus Booking
            </Link>
            <Link
              to="/about"
              className={`hover:text-[#FF6B00] transition-colors ${
                isActive("/about") ? "text-[#FF6B00]" : ""
              }`}
            >
              About Us
            </Link>
            <Link
              to="/services"
              className={`hover:text-[#FF6B00] transition-colors ${
                isActive("/services") ? "text-[#FF6B00]" : ""
              }`}
            >
              Services
            </Link>
            <Link
              to="/contact"
              className={`hover:text-[#FF6B00] transition-colors ${
                isActive("/contact") ? "text-[#FF6B00]" : ""
              }`}
            >
              Contact
            </Link>
            {user ? (
              <>
                <Link
                  to="/profile"
                  className={`hover:text-[#FF6B00] transition-colors flex items-center gap-1 ${
                    isActive("/profile") ? "text-[#FF6B00]" : ""
                  }`}
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`hover:text-[#FF6B00] transition-colors flex items-center gap-1 ${
                      isActive("/admin") ? "text-[#FF6B00]" : ""
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => {
                    signOut();
                    navigate("/");
                  }}
                  className="hover:text-[#FF6B00] transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="hover:text-[#FF6B00] transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-black border-t border-gray-800">
          <div className="px-4 py-4 space-y-4">
            <Link
              to="/"
              className="block hover:text-[#FF6B00] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Bus Booking
            </Link>
            <Link
              to="/about"
              className="block hover:text-[#FF6B00] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              to="/services"
              className="block hover:text-[#FF6B00] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              to="/contact"
              className="block hover:text-[#FF6B00] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="block hover:text-[#FF6B00] transition-colors flex items-center gap-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="block hover:text-[#FF6B00] transition-colors flex items-center gap-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    signOut();
                    navigate("/");
                    setIsMenuOpen(false);
                  }}
                  className="block text-left w-full hover:text-[#FF6B00] transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block hover:text-[#FF6B00] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
