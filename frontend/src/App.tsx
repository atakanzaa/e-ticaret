import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Navbar } from './components/Layout/Navbar';

// Pages
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { SellerDashboard } from './pages/seller/SellerDashboard';
import { ProductManagement } from './pages/seller/ProductManagement';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { SellerManagement } from './pages/admin/SellerManagement';

function App() {
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
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />

                {/* User Routes */}
                <Route 
                  path="/cart" 
                  element={
                    <ProtectedRoute allowedRoles={['user']}>
                      <CartPage />
                    </ProtectedRoute>
                  } 
                />

                {/* Seller Routes */}
                <Route 
                  path="/seller/dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['seller']}>
                      <SellerDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/seller/products" 
                  element={
                    <ProtectedRoute allowedRoles={['seller']}>
                      <ProductManagement />
                    </ProtectedRoute>
                  } 
                />

                {/* Admin Routes */}
                <Route 
                  path="/admin/dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/sellers" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <SellerManagement />
                    </ProtectedRoute>
                  } 
                />

                {/* Redirect unknown routes */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;