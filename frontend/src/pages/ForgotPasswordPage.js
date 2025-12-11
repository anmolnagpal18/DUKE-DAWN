import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/api';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // 1: email, 2: code & new password
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      alert('Reset code sent to your email!');
      setStep(2);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.resetPassword({ email, code, newPassword });
      alert('Password reset successfully! You can now login.');
      window.location.href = '/login';
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gold-400">
            {step === 1 ? 'Forgot Password' : 'Reset Password'}
          </h2>
          <p className="mt-2 text-gray-400">
            {step === 1 
              ? 'Enter your email to receive a reset code'
              : 'Enter the code and your new password'
            }
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendCode} className="mt-8 space-y-6">
            <div>
              <label className="block text-white font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-dark-800 border border-gold-400 text-white px-4 py-3 rounded focus:outline-none focus:border-gold-300"
                placeholder="Enter your email"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold-500 text-dark-900 py-3 rounded font-bold text-lg hover:bg-gold-400 transition disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Code'}
            </button>

            <div className="text-center">
              <Link to="/login" className="text-gold-400 hover:text-gold-300">
                Back to Login
              </Link>
            </div>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="mt-8 space-y-6">
            <div>
              <label className="block text-white font-semibold mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-dark-800 border border-gold-400 text-white px-4 py-3 rounded focus:outline-none focus:border-gold-300 text-center text-2xl tracking-widest"
                placeholder="000000"
                maxLength="6"
                required
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-dark-800 border border-gold-400 text-white px-4 py-3 rounded focus:outline-none focus:border-gold-300"
                placeholder="Enter new password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold-500 text-dark-900 py-3 rounded font-bold text-lg hover:bg-gold-400 transition disabled:opacity-50"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-gold-400 hover:text-gold-300"
              >
                Back to Email
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;