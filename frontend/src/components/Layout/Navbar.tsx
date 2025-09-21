import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, User, Sun, Moon, Store, BarChart3, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/UnifiedAuthContext';
import { useCart } from '../../context/UnifiedCartContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';

export function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Store className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                ShopHub
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {user ? (
              <>
                {user.role === 'customer' && (
                  <Link to="/cart" className="relative">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="ghost" size="sm" className="p-2">
                        <ShoppingCart className="h-5 w-5" />
                        {itemCount > 0 && (
                          <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {itemCount}
                          </span>
                        )}
                      </Button>
                    </motion.div>
                  </Link>
                )}

                {user.role === 'seller' && (
                  <Link to="/seller/dashboard">
                    <Button variant="ghost" size="sm">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                )}

                {user.role === 'admin' && (
                  <Link to="/admin/dashboard">
                    <Button variant="ghost" size="sm">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}

                <div className="relative">
                  <Button variant="ghost" size="sm" className="p-2 flex items-center" onClick={() => setOpen(v => !v)}>
                    <User className="h-4 w-4 mr-2" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{user.name}</span>
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                  {open && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
                      {user.role === 'admin' && (
                        <Link to="/admin/dashboard" className="block px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => setOpen(false)}>
                          ⚙️ Admin Dashboard
                        </Link>
                      )}
                      {user.role === 'seller' && (
                        <Link to="/seller/dashboard" className="block px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => setOpen(false)}>
                          🏪 Seller Dashboard
                        </Link>
                      )}
                      <Link to="/profile" className="block px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => setOpen(false)}>
                        👤 My Profile
                      </Link>
                      <Link to="/orders" className="block px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => setOpen(false)}>
                        📦 My Orders
                      </Link>
                      <div className="border-t border-gray-200 dark:border-gray-700"></div>
                      <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center text-red-600 dark:text-red-400" onClick={handleLogout}>
                        <LogOut className="h-4 w-4 mr-2" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Register</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}