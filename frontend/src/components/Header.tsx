import React, { useMemo, useRef, useState } from 'react';
import { Search, ShoppingCart, User, Menu, X, ChevronDown, Grid2X2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Cart from './Cart';
import AuthModal from './AuthModal';
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const { state, dispatch } = useApp();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const [isCatOpen, setIsCatOpen] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const categories = useMemo(() => {
    const set = new Set<string>(['All']);
    state.products.forEach((p) => set.add(p.category));
    return Array.from(set);
  }, [state.products]);

  const handleSelectCategory = (cat: string) => {
    dispatch({ type: 'SET_CATEGORY', payload: cat.toLowerCase() });
    setIsCatOpen(false);
    if (location.pathname !== '/') {
      navigate('/#products');
    } else {
      window.location.hash = 'products';
    }
  };

  const cartItemsCount = state.cart.reduce((total, item) => total + item.quantity, 0);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  };

  return (
    <>
      <header className="bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold text-blue-600">ShopHub</Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8 items-center">
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">Home</Link>
              <a href="#products" className="text-gray-700 hover:text-blue-600 transition-colors">Products</a>
              <div className="relative" ref={catRef}>
                <button onClick={() => setIsCatOpen((v) => !v)} className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors">
                  <Grid2X2 size={18} />
                  <span>Categories</span>
                  <ChevronDown size={14} />
                </button>
                {isCatOpen && (
                  <div className="absolute left-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                    {categories.map((c) => (
                      <button key={c} onClick={() => handleSelectCategory(c)} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${state.selectedCategory === c.toLowerCase() ? 'text-blue-600' : 'text-gray-700'}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {state.user?.role === 'seller' && (
                <Link to="/seller" className="text-gray-700 hover:text-blue-600 transition-colors">Seller</Link>
              )}
              {state.user?.role === 'admin' && (
                <Link to="/admin" className="text-gray-700 hover:text-blue-600 transition-colors">Admin</Link>
              )}
            </nav>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <input
                  type="text"
                  name="search"
                  placeholder="Search products..."
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button type="submit" className="absolute right-3 top-2.5 text-gray-400 hover:text-blue-600">
                  <Search size={18} />
                </button>
              </div>
            </form>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              {state.user ? (
                <div className="relative" ref={profileRef}>
                  <button onClick={() => setIsProfileOpen((v) => !v)} className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
                    <User size={20} />
                    <span className="hidden md:block text-sm font-medium">{state.user.name}</span>
                    <ChevronDown size={16} />
                  </button>
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Profile</Link>
                      <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Orders</Link>
                      <button
                        onClick={() => {
                          localStorage.removeItem('auth_token');
                          localStorage.removeItem('refresh_token');
                          dispatch({ type: 'SET_USER', payload: null });
                          setIsProfileOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <User size={24} />
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative text-gray-700 hover:text-blue-600 transition-colors"
              >
                <ShoppingCart size={24} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-gray-700"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-4 space-y-4">
              <form onSubmit={handleSearch} className="flex">
                <div className="relative w-full">
                  <input
                    type="text"
                    name="search"
                    placeholder="Search products..."
                    className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button type="submit" className="absolute right-3 top-2.5 text-gray-400">
                    <Search size={18} />
                  </button>
                </div>
              </form>
              <nav className="flex flex-col space-y-2">
                <Link to="/" className="text-gray-700 hover:text-blue-600 py-2">Home</Link>
                <a href="#products" className="text-gray-700 hover:text-blue-600 py-2">Products</a>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="text-sm text-gray-500 mb-1">Categories</div>
                {categories.map((c) => (
                  <button key={c} onClick={() => handleSelectCategory(c)} className={`text-left py-2 ${state.selectedCategory === c.toLowerCase() ? 'text-blue-600' : 'text-gray-700'}`}>
                    {c}
                  </button>
                ))}
                {state.user?.role === 'seller' && (
                  <Link to="/seller" className="text-gray-700 hover:text-blue-600 py-2">Seller</Link>
                )}
                {state.user?.role === 'admin' && (
                  <Link to="/admin" className="text-gray-700 hover:text-blue-600 py-2">Admin</Link>
                )}
              </nav>
            </div>
          </div>
        )}
      </header>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
};

export default Header;