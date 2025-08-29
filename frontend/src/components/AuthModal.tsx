import React, { useState, useEffect, useRef } from 'react';
import { X, User, Mail, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { User as AppUser } from '../types';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { dispatch } = useApp();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const googleSignInRef = useRef<HTMLDivElement>(null);

  // Initialize Google Sign-In
  useEffect(() => {
    const win = window as any;
    if (!isOpen || !win.google) return;

    const initializeGoogleSignIn = () => {
      win.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "your-google-client-id.apps.googleusercontent.com",
        callback: handleGoogleSignIn,
        context: isLogin ? 'signin' : 'signup',
      });

      if (googleSignInRef.current) {
        win.google.accounts.id.renderButton(
          googleSignInRef.current,
          {
            theme: 'outline',
            size: 'large',
            // Google GSI does not accept percentage widths; use style instead
            // and rely on container to be full-width.
            text: isLogin ? 'signin_with' : 'signup_with',
            locale: 'en',
          }
        );
      }
    };

    // Initialize when the script is loaded
    if (win.google?.accounts?.id) {
      initializeGoogleSignIn();
    } else {
      // Wait for Google script to load
      const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (script) {
        script.addEventListener('load', initializeGoogleSignIn);
        return () => script.removeEventListener('load', initializeGoogleSignIn);
      }
    }
  }, [isOpen, isLogin]);

  const handleGoogleSignIn = async (response: any) => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';
      
      // Send the ID token to your backend for verification
      const authRes = await fetch(`${baseUrl}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          idToken: response.credential,
          isRegistration: !isLogin 
        }),
      });

      if (!authRes.ok) {
        throw new Error('Google authentication failed');
      }

      const authData: { id: string; jwt: string; refresh: string } = await authRes.json();

      // Persist tokens
      localStorage.setItem('auth_token', authData.jwt);
      localStorage.setItem('refresh_token', authData.refresh);

      const me = await api.me();
      dispatch({ type: 'SET_USER', payload: me });
      onClose();
      navigate('/dashboard');
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      // Optionally add user-facing error handling here
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : { email: formData.email, name: formData.name, password: formData.password };

      const authRes = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!authRes.ok) {
        throw new Error('Authentication failed');
      }

      const authData: { id: string; jwt: string; refresh: string } = await authRes.json();

      // Persist tokens for subsequent requests
      localStorage.setItem('auth_token', authData.jwt);
      localStorage.setItem('refresh_token', authData.refresh);

      const me = await api.me();
      dispatch({ type: 'SET_USER', payload: me });
      onClose();
      navigate('/dashboard');

      // Reset form
      setFormData({ name: '', email: '', password: '' });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      // Optionally add user-facing error handling here
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose}></div>
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold">{isLogin ? 'Sign In' : 'Create Account'}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {!isLogin && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User size={16} className="inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail size={16} className="inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock size={16} className="inline mr-2" />
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>

            {/* Google Sign-In Button */}
            <div className="mt-6">
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>
              <div ref={googleSignInRef} className="w-full" style={{ display: 'flex', justifyContent: 'center' }}></div>
            </div>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:underline text-sm"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : 'Already have an account? Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AuthModal;