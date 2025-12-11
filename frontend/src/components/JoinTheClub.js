import React, { useState } from 'react';
import api from '../services/api';

const JoinTheClub = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Submitting email:', email);
      const response = await api.post('/newsletter/subscribe', { email });
      console.log('Response:', response.data);
      alert('Thank you for joining DUKE & DAWN Circle of Elegance!');
      setEmail('');
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      console.error('Error response:', error.response?.data);
      if (error.response?.data?.message === 'Email already subscribed') {
        alert('This email is already subscribed to our newsletter.');
      } else {
        alert(`Failed to subscribe: ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-dark-900 via-dark-800 to-dark-900">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-dark-800 p-10 rounded-lg border border-gold-500/30 shadow-2xl">
          <h2 className="text-4xl font-bold text-white mb-6">
            Join <span className="text-gold-400">DUKE & DAWN</span>
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            Subscribe to our exclusive mailing list for early access to limited drops and atelier news.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-6 py-3 bg-dark-900 text-white border border-gold-400/40 rounded focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 max-w-md"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 border-2 border-gold-400 text-gold-400 bg-transparent hover:bg-gold-400 hover:text-dark-900 transition-all duration-300 rounded font-semibold uppercase tracking-wider disabled:opacity-50"
            >
              {isSubmitting ? 'Joining...' : 'Join Now'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default JoinTheClub;