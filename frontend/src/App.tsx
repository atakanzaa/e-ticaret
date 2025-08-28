import { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import { User } from './types';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SellerPage from './pages/SellerPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';

function AppContent() {
  const { dispatch } = useApp();

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('auth_token');
    const refreshToken = localStorage.getItem('refresh_token');

    if (token && refreshToken) {
      // Try to fetch user profile with existing token
      const fetchUserProfile = async () => {
        try {
          const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

          let meRes = await fetch(`${baseUrl}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          // Fallback: call auth-service directly if gateway JWT validation fails
          if (!meRes.ok) {
            meRes = await fetch(`http://localhost:8081/me`, {
              headers: { Authorization: `Bearer ${token}` },
            });
          }

          if (!meRes.ok) {
            // Token might be expired, clear localStorage
            localStorage.removeItem('auth_token');
            localStorage.removeItem('refresh_token');
            return;
          }

          const me: { id: string; email: string; name: string; roles: string[] } = await meRes.json();
          const role: User['role'] = (me.roles || []).includes('ADMIN')
            ? 'admin'
            : (me.roles || []).includes('SELLER')
            ? 'seller'
            : 'customer';

          const user: User = {
            id: me.id,
            name: me.name,
            email: me.email,
            role,
          };

          dispatch({ type: 'SET_USER', payload: user });
        } catch (error) {
          console.error('Failed to restore user session:', error);
          // Clear invalid tokens
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
        }
      };

      fetchUserProfile();
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/seller" element={<SellerPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/orders" element={<OrdersPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;