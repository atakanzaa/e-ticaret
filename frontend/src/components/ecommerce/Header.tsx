import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, User, Heart, Menu, X } from 'lucide-react';

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
  onProfileClick: () => void;
  onLoginClick: () => void;
  isLoggedIn: boolean;
  userType?: 'customer' | 'seller' | 'admin';
}

const Header: React.FC<HeaderProps> = ({ 
  cartItemCount, 
  onCartClick, 
  onProfileClick, 
  onLoginClick, 
  isLoggedIn,
  userType 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categories = [
    'Electronics',
    'Clothing',
    'Home & Garden',
    'Sports & Outdoors',
    'Books',
    'Health & Beauty',
    'Toys & Games',
    'Automotive'
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-blue-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span>Free shipping on orders over $50</span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline">24/7 Customer Support</span>
            </div>
            <div className="flex items-center space-x-4">
              {isLoggedIn && userType === 'seller' && (
                <button
                  onClick={onProfileClick}
                  className="hover:text-blue-200 transition-colors"
                >
                  Seller Dashboard
                </button>
              )}
              {isLoggedIn && userType === 'admin' && (
                <button
                  onClick={onProfileClick}
                  className="hover:text-blue-200 transition-colors"
                >
                  Admin Panel
                </button>
              )}
              <span className="hidden md:inline">Help</span>
              <span className="hidden md:inline">Track Order</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">S</span>
              </div>
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold text-gray-900">ShopHub</h1>
              <p className="text-xs text-gray-500">Your Shopping Destination</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Wishlist */}
            <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors relative">
              <Heart size={24} />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            {/* Cart */}
            <button 
              onClick={onCartClick}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors relative"
            >
              <ShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* User Account */}
            {isLoggedIn ? (
              <div className="relative" ref={profileRef}>
                <button 
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 p-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User size={16} className="text-blue-600" />
                  </div>
                  <span className="hidden md:inline text-sm font-medium">Account</span>
                </button>
                
                {/* Profile Dropdown */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg p-2 space-y-1 min-w-[200px] z-50">
                    {userType === 'seller' && (
                      <a 
                        href="/seller/dashboard" 
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        🏪 Seller Dashboard
                      </a>
                    )}
                    {userType === 'admin' && (
                      <a 
                        href="/admin/dashboard" 
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        ⚙️ Admin Panel
                      </a>
                    )}
                    <button 
                      onClick={() => {
                        onProfileClick();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors"
                    >
                      👤 My Profile
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={onLoginClick}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Sign In
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-blue-600"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Categories Navigation */}
      <div className="bg-gray-50 border-t border-gray-200 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-8 py-3">
            {categories.map((category) => (
              <button
                key={category}
                className="text-sm text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Mobile Categories */}
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Categories</h3>
              {categories.map((category) => (
                <button
                  key={category}
                  className="block w-full text-left py-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;