import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, LogOut, LayoutDashboard, Package, ShoppingBag, Home } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-green-500 to-green-700 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img
              src="/logo.png"
              alt="Lumbung Sirkular"
              className="w-10 h-10 group-hover:scale-110 transition-transform duration-300"
            />
            <span className="text-white font-bold text-xl hidden sm:block">
              Lumbung Sirkular
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="text-white hover:bg-green-500 px-3 py-2 rounded-md transition-colors flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link
              to="/marketplace"
              className="text-white hover:bg-green-500 px-3 py-2 rounded-md transition-colors"
            >
              Marketplace
            </Link>

            {isAuthenticated ? (
              <>
                {user?.role === 'producer' && (
                  <Link
                    to="/my-wastes"
                    className="text-white hover:bg-green-500 px-3 py-2 rounded-md transition-colors flex items-center gap-2"
                  >
                    <Package className="w-4 h-4" />
                    Limbah Saya
                  </Link>
                )}
                {user?.role === 'recycler' && (
                  <Link
                    to="/my-bookings"
                    className="text-white hover:bg-green-500 px-3 py-2 rounded-md transition-colors flex items-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Booking Saya
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className="text-white hover:bg-green-500 px-3 py-2 rounded-md transition-colors flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:bg-green-500 px-4 py-2 rounded-md transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-green-600 hover:bg-green-50 px-4 py-2 rounded-md font-semibold transition-colors"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2 rounded-md hover:bg-green-500 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="block text-white hover:bg-green-500 px-3 py-2 rounded-md transition-colors flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link
              to="/marketplace"
              onClick={() => setIsMenuOpen(false)}
              className="block text-white hover:bg-green-500 px-3 py-2 rounded-md transition-colors"
            >
              Marketplace
            </Link>

            {isAuthenticated ? (
              <>
                {user?.role === 'producer' && (
                  <Link
                    to="/my-wastes"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-white hover:bg-green-500 px-3 py-2 rounded-md transition-colors"
                  >
                    Limbah Saya
                  </Link>
                )}
                {user?.role === 'recycler' && (
                  <Link
                    to="/my-bookings"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-white hover:bg-green-500 px-3 py-2 rounded-md transition-colors"
                  >
                    Booking Saya
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-white hover:bg-green-500 px-3 py-2 rounded-md transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-white hover:bg-green-500 px-3 py-2 rounded-md transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block bg-white text-green-600 hover:bg-green-50 px-3 py-2 rounded-md font-semibold transition-colors text-center"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;