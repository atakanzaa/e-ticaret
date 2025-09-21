import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/UnifiedAuthContext';
import { CartProvider } from './context/UnifiedCartContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Public Pages
import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { SellerManagement } from './pages/admin/SellerManagement';

// Seller Pages
import { SellerDashboard } from './pages/seller/SellerDashboard';
import { ProductManagement } from './pages/seller/ProductManagement';
import ProductNewPage from './pages/seller/ProductNewPage';
import ProductEditPage from './pages/seller/ProductEditPage';

// Other Pages
import { OrdersPage } from './pages/OrdersPage';
import { ProfilePage } from './pages/ProfilePage';
import { CartPage } from './pages/CartPage';

// Layout Components
import { Navbar } from './components/Layout/Navbar';

function AppRouter() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              <Navbar />
              <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/products/:slug" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              
              {/* Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Profile Routes */}
              <Route path="/profile" element={
                <ProtectedRoute allowedRoles={['customer', 'seller', 'admin']}>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute allowedRoles={['customer', 'seller', 'admin']}>
                  <OrdersPage />
                </ProtectedRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/sellers" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <SellerManagement />
                </ProtectedRoute>
              } />
              
              {/* Seller Routes */}
              <Route path="/seller" element={<Navigate to="/seller/dashboard" replace />} />
              <Route path="/seller/dashboard" element={
                <ProtectedRoute allowedRoles={['seller', 'admin']}>
                  <SellerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/seller/products" element={
                <ProtectedRoute allowedRoles={['seller', 'admin']}>
                  <ProductManagement />
                </ProtectedRoute>
              } />
              <Route path="/seller/products/new" element={
                <ProtectedRoute allowedRoles={['seller', 'admin']}>
                  <ProductNewPage />
                </ProtectedRoute>
              } />
              <Route path="/seller/products/:id/edit" element={
                <ProtectedRoute allowedRoles={['seller', 'admin']}>
                  <ProductEditPage />
                </ProtectedRoute>
              } />
              <Route path="/seller/orders" element={
                <ProtectedRoute allowedRoles={['seller', 'admin']}>
                  <OrdersPage />
                </ProtectedRoute>
              } />
              
              {/* Catch all - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default AppRouter;
