import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { api } from '../api/client';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, username: string, role: 'customer' | 'seller') => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved auth token and fetch user info
    const initAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const userData = await api.me();
          setUser(userData);
        } catch (error) {
          console.error('Auth initialization failed:', error);
          localStorage.removeItem('auth_token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      const response = await api.login(email, password);
      
      // Store token first
      localStorage.setItem('auth_token', response.token);
      
      // Small delay to ensure token is stored
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Fetch user data after successful login
      console.log('Fetching user data with token:', response.token.substring(0, 50) + '...');
      const userData = await api.me();
      console.log('User data received:', userData);
      setUser(userData);
      
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      setLoading(false);
      return false;
    }
  };

  const register = async (email: string, password: string, username: string, role: 'customer' | 'seller'): Promise<boolean> => {
    setLoading(true);
    
    try {
      const response = await api.register({
        email,
        password,
        name: username
      });
      
      // Store token first
      localStorage.setItem('auth_token', response.token);
      
      // Small delay to ensure token is stored
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Fetch user data after successful registration
      const userData = await api.me();
      setUser(userData);
      
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}