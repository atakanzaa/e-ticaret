import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { api } from '../api/client';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: 'customer' | 'seller') => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      localStorage.setItem('auth_token', response.token);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const userData = await api.me();
      setUser(userData);
      
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      setLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, role: 'customer' | 'seller'): Promise<boolean> => {
    setLoading(true);
    
    try {
      const response = await api.register({
        email,
        password,
        name,
        role
      });
      
      localStorage.setItem('auth_token', response.token);
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const userData = await api.me();
      
      // Create seller application if role is seller
      if (role === 'seller') {
        try {
          await api.applyForSeller(userData.id);
        } catch (e) {
          console.warn('Seller application could not be created:', e);
        }
      }
      
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
