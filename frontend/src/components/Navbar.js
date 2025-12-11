import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = ({ cartCount = 0, wishlistCount = 0 }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
    // Force page reload to reset all state
    window.location.reload();
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-black border-b border-gold-500/30 shadow-2xl backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <div className="flex items-center h-20 justify-between">
          {/* Logo (left) */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl md:text-3xl font-serif text-gold-400 tracking-wider">DUKE & DAWN</span>
          </Link>

          {/* Centered Navigation */}
          <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center gap-10">
            <Link
              to="/"
              className="text-gray-300 hover:text-gold-400 transition duration-300 text-sm tracking-widest uppercase font-light"
            >
              Home
            </Link>
            <Link
              to="/signature"
              className="text-gray-300 hover:text-gold-400 transition duration-300 text-sm tracking-widest uppercase font-light"
            >
              Signature
            </Link>
            <Link
              to="/limited"
              className="text-gray-300 hover:text-gold-400 transition duration-300 text-sm tracking-widest uppercase font-light"
            >
              Limited
            </Link>
            <Link
              to="/shop"
              className="text-gray-300 hover:text-gold-400 transition duration-300 text-sm tracking-widest uppercase font-light"
            >
              Shop
            </Link>
            <Link
              to="/about"
              className="text-gray-300 hover:text-gold-400 transition duration-300 text-sm tracking-widest uppercase font-light"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-300 hover:text-gold-400 transition duration-300 text-sm tracking-widest uppercase font-light"
            >
              Contact
            </Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-6">
            {/* Wishlist */}
            <Link
              to="/wishlist"
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
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold-500 text-dark-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
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

            {/* User Menu - Click Based */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="text-gray-300 hover:text-gold-400 transition duration-300 focus:outline-none flex items-center gap-2"
                  title={`${user.name} - Click to open menu`}
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="text-sm hidden sm:inline">{user.name}</span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-dark-900 rounded-lg shadow-2xl border border-gold-500 overflow-hidden animate-fadeIn">
                    <div className="bg-gradient-to-r from-gold-500 to-gold-600 px-4 py-4">
                      <p className="text-dark-900 font-bold text-base">
                        {user.name}
                      </p>
                      <p className="text-dark-800 text-xs mt-1">
                        {user.email}
                      </p>
                    </div>

                    <div className="py-2">
                      <Link
                        to="/orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-gold-400 hover:bg-dark-800 transition"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <span>My Orders</span>
                      </Link>

                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gold-400 font-semibold hover:text-gold-300 hover:bg-dark-800 transition border-t border-dark-700"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          <span>Admin Panel</span>
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full text-left px-4 py-3 text-gray-300 hover:text-red-400 hover:bg-dark-800 transition border-t border-dark-700"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:inline-block bg-transparent border border-gold-500 text-gold-400 px-4 py-2 rounded hover:bg-gold-500 hover:text-dark-900 transition font-semibold"
                >
                  Sign In
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
          <div className="md:hidden pb-4 text-center space-y-2">
            <Link
              to="/"
              className="block text-gray-300 hover:text-gold-400 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/signature"
              className="block text-gray-300 hover:text-gold-400 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Signature Collection
            </Link>
            <Link
              to="/limited"
              className="block text-gray-300 hover:text-gold-400 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Limited Drop
            </Link>
            <Link
              to="/shop"
              className="block text-gray-300 hover:text-gold-400 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Shop All
            </Link>
            <Link
              to="/about"
              className="block text-gray-300 hover:text-gold-400 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block text-gray-300 hover:text-gold-400 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
