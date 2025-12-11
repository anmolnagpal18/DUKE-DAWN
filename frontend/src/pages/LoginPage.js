import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { authService } from '../services/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize Google Sign-In
    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: '465148785416-c96dvmbfirgvmjp5vp8l5ghf4l2gr6ee.apps.googleusercontent.com',
          callback: handleGoogleResponse,
        });
        
        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'signin_with',
          }
        );
      } else {
        // Retry if Google script not loaded yet
        setTimeout(initializeGoogleSignIn, 100);
      }
    };
    
    initializeGoogleSignIn();
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      setIsLoading(true);
      const credential = response.credential;
      const payload = JSON.parse(atob(credential.split('.')[1]));
      
      const googleData = {
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      };

      const result = await authService.googleLogin(googleData);
      login(result.data.user, result.data.token);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Google login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authService.login({ email, password });
      login(response.data.user, response.data.token);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-dark-800 rounded-lg shadow-lg p-8 border border-gold-500">
        <h1 className="text-3xl font-bold text-gold-400 text-center mb-8">
          Sign In
        </h1>

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-dark-900 border border-gold-400 text-white px-4 py-2 rounded focus:outline-none focus:border-gold-300"
              required
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-dark-900 border border-gold-400 text-white px-4 py-2 rounded focus:outline-none focus:border-gold-300"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gold-500 text-dark-900 py-2 rounded font-bold hover-gold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-dark-800 text-gray-400">Or continue with</span>
            </div>
          </div>
          
          <div className="mt-6">
            <div id="google-signin-button" className="w-full"></div>
          </div>
        </div>

        <div className="mt-6 text-center space-y-2">
          <a href="/forgot-password" className="text-gold-400 hover:text-gold-300 text-sm block">
            Forgot your password?
          </a>
          <p className="text-gray-400">
            Don't have an account?{' '}
            <a href="/signup" className="text-gold-400 hover:text-gold-300 font-semibold">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
