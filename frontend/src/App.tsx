import { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import { User } from './types';
import { api } from './api/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SellerPage from './pages/SellerPage';
import AdminPage from './pages/AdminPage';
import SellerDashboard from './pages/SellerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardRouter from './pages/DashboardRouter';

function AppContent() {
  const { dispatch } = useApp();

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('auth_token');
    const refreshToken = localStorage.getItem('refresh_token');
    if (!token || !refreshToken) return;
    const restore = async () => {
      try {
        const me = await api.me();
        dispatch({ type: 'SET_USER', payload: me });
      } catch (e) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
      }
    };
    restore();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
        <Route
          path="/seller"
          element={
            <ProtectedRoute roles={['seller', 'admin']}>
              <SellerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/dashboard"
          element={
            <ProtectedRoute roles={['seller', 'admin']}>
              <SellerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute roles={['customer', 'seller', 'admin']}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
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