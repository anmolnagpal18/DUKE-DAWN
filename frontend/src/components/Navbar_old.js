import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = ({ cartCount = 0 }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-dark-900 border-b border-gold-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-gold-400">VIBE</span>
            <span className="text-xl font-bold text-white ml-1">HOODIES</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-300 hover:text-gold-400 transition duration-300"
            >
              Home
            </Link>
            <Link
              to="/signature"
              className="text-gray-300 hover:text-gold-400 transition duration-300"
            >
              Signature Collection
            </Link>
            <Link
              to="/limited"
              className="text-gray-300 hover:text-gold-400 transition duration-300"
            >
              Limited Drop
            </Link>
            <Link
              to="/shop"
              className="text-gray-300 hover:text-gold-400 transition duration-300"
            >
              Shop All
            </Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-6">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="text-gray-300 hover:text-gold-400 transition duration-300"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative text-gray-300 hover:text-gold-400 transition duration-300"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold-500 text-dark-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User */}
            {user ? (
              <div className="relative group">
                <button className="text-gray-300 hover:text-gold-400 transition duration-300">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-dark-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-300 py-2">
                  <p className="px-4 py-2 text-gray-300 text-sm">
                    {user.name}
                  </p>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-gray-300 hover:text-gold-400 transition"
                  >
                    My Orders
                  </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-gold-500 font-semibold hover:text-gold-600 transition border-t border-dark-700"
                      >
                        📊 Admin Panel
                      </Link>
                    )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-300 hover:text-gold-400 transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-gold-400 transition duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-gold-500 text-dark-900 px-4 py-2 rounded hover-gold font-semibold"
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-300 hover:text-gold-400"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              to="/"
              className="block text-gray-300 hover:text-gold-400 py-2"
            >
              Home
            </Link>
            <Link
              to="/signature"
              className="block text-gray-300 hover:text-gold-400 py-2"
            >
              Signature Collection
            </Link>
            <Link
              to="/limited"
              className="block text-gray-300 hover:text-gold-400 py-2"
            >
              Limited Drop
            </Link>
            <Link
              to="/shop"
              className="block text-gray-300 hover:text-gold-400 py-2"
            >
              Shop All
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
