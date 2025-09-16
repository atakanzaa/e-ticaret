import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Import the existing App component for the main dashboard
import App from './App';

// Import new pages
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';

function AppRouter() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Main Dashboard Route - existing App component */}
          <Route path="/" element={<App />} />
          <Route path="/dashboard" element={<App />} />
          <Route path="/admin/*" element={<App />} />
          <Route path="/seller/*" element={<App />} />
          
          {/* E-commerce Routes */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          
          {/* Catch all - redirect to main dashboard */}
          <Route path="*" element={<App />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default AppRouter;
