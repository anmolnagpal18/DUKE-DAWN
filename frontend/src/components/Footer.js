import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark-900 border-t border-gold-500 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-gold-400 mb-4">
              VIBE HOODIES
            </h3>
            <p className="text-gray-400">
              Premium hoodies for every vibe. Quality, comfort, and style.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-gold-400 transition">Home</a></li>
              <li><Link to="/shop" className="hover:text-gold-400 transition">Shop All</Link></li>
              <li><Link to="/signature" className="hover:text-gold-400 transition">Signature</Link></li>
              <li><Link to="/limited" className="hover:text-gold-400 transition">Limited Drop</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-gold-400 transition">FAQ</a></li>
              <li><a href="#" className="hover:text-gold-400 transition">Shipping Info</a></li>
              <li><a href="#" className="hover:text-gold-400 transition">Returns</a></li>
              <li><Link to="/contact" className="hover:text-gold-400 transition">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gold-500 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <p>&copy; 2024 Vibe Hoodies. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-gold-400 transition">Privacy Policy</a>
              <a href="#" className="hover:text-gold-400 transition">Terms of Service</a>
              <a href="#" className="hover:text-gold-400 transition">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
