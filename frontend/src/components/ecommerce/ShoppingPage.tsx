import React, { useState } from 'react';
import { Filter, Grid, List, ChevronDown, SlidersHorizontal } from 'lucide-react';
import Header from './Header';
import ProductCard from './ProductCard';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
  isOnSale?: boolean;
}

interface ShoppingPageProps {
  onLoginClick: () => void;
  onProfileClick: () => void;
  isLoggedIn: boolean;
  userType?: 'customer' | 'seller' | 'admin';
}

const ShoppingPage: React.FC<ShoppingPageProps> = ({ 
  onLoginClick, 
  onProfileClick, 
  isLoggedIn, 
  userType 
}) => {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);

  const products: Product[] = [
    {
      id: '1',
      name: 'Wireless Bluetooth Headphones Pro',
      price: 79.99,
      originalPrice: 99.99,
      image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
      rating: 4.5,
      reviewCount: 234,
      category: 'Electronics',
      isOnSale: true
    },
    {
      id: '2',
      name: 'Premium Cotton T-Shirt',
      price: 24.99,
      image: 'https://images.pexels.com/photos/1020585/pexels-photo-1020585.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
      rating: 4.2,
      reviewCount: 156,
      category: 'Clothing'
    },
    {
      id: '3',
      name: 'Smart Watch Series X',
      price: 299.99,
      originalPrice: 349.99,
      image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
      rating: 4.8,
      reviewCount: 89,
      category: 'Electronics',
      isOnSale: true
    },
    {
      id: '4',
      name: 'Yoga Mat Premium Non-Slip',
      price: 49.99,
      image: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
      rating: 4.6,
      reviewCount: 78,
      category: 'Sports & Outdoors'
    },
    {
      id: '5',
      name: 'Coffee Maker Deluxe Edition',
      price: 149.99,
      originalPrice: 199.99,
      image: 'https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
      rating: 4.4,
      reviewCount: 45,
      category: 'Home & Garden',
      isOnSale: true
    },
    {
      id: '6',
      name: 'Leather Crossbody Bag',
      price: 89.99,
      image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
      rating: 4.3,
      reviewCount: 67,
      category: 'Clothing'
    },
    {
      id: '7',
      name: 'Wireless Gaming Mouse',
      price: 59.99,
      originalPrice: 79.99,
      image: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
      rating: 4.7,
      reviewCount: 123,
      category: 'Electronics',
      isOnSale: true
    },
    {
      id: '8',
      name: 'Organic Skincare Set',
      price: 34.99,
      image: 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
      rating: 4.5,
      reviewCount: 91,
      category: 'Health & Beauty'
    }
  ];

  const categories = [
    'All Categories',
    'Electronics',
    'Clothing',
    'Home & Garden',
    'Sports & Outdoors',
    'Health & Beauty',
    'Books',
    'Toys & Games'
  ];

  const handleAddToCart = (productId: string) => {
    setCartItemCount(prev => prev + 1);
    // In a real app, you'd add the product to cart state/context
  };

  const handleAddToWishlist = (productId: string) => {
    // Handle wishlist functionality
    console.log('Added to wishlist:', productId);
  };

  const handleQuickView = (productId: string) => {
    // Handle quick view functionality
    console.log('Quick view:', productId);
  };

  const handleCartClick = () => {
    // Handle cart click
    console.log('Cart clicked');
  };

  const filteredProducts = products.filter(product => {
    if (selectedCategory !== 'all' && selectedCategory !== 'All Categories') {
      return product.category === selectedCategory;
    }
    return product.price >= priceRange[0] && product.price <= priceRange[1];
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartItemCount={cartItemCount}
        onCartClick={handleCartClick}
        onProfileClick={onProfileClick}
        onLoginClick={onLoginClick}
        isLoggedIn={isLoggedIn}
        userType={userType}
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Discover Amazing Products
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Shop the latest trends with unbeatable prices
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Shop Now
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
              
              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Categories</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category === 'All Categories' ? 'all' : category}
                        checked={selectedCategory === (category === 'All Categories' ? 'all' : category)}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Price Range</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Rating</h4>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {rating}+ Stars
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <SlidersHorizontal size={16} className="mr-2" />
                    Filters
                  </button>
                  <span className="text-sm text-gray-600">
                    {filteredProducts.length} products found
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Sort Dropdown */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="featured">Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                      <option value="newest">Newest</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  </div>

                  {/* View Mode */}
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'} transition-colors`}
                    >
                      <Grid size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'} transition-colors`}
                    >
                      <List size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                  onQuickView={handleQuickView}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Previous
                </button>
                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      page === 1
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingPage;