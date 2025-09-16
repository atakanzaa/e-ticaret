import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../api/client';
import { Product } from '../types';
import ProductCard from './ProductCard';
import { Loader2, Grid, List, Filter } from 'lucide-react';

const ProductGrid: React.FC = () => {
  const { state, dispatch } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const productList = await api.listProducts({
          category: state.selectedCategory === 'all' ? undefined : state.selectedCategory,
          sort: state.sortBy
        });
        setProducts(productList);
        dispatch({ type: 'SET_PRODUCTS', payload: productList });
      } catch (error) {
        console.error('Error loading products:', error);
        // Fallback to sample data
        setProducts([
          {
            id: '1',
            name: 'Wireless Bluetooth Headphones',
            description: 'High-quality wireless headphones with noise cancellation',
            price: 99.99,
            originalPrice: 129.99,
            category: 'Electronics',
            image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
            images: ['https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2'],
            stock: 45,
            rating: 4.5,
            reviewCount: 234,
            featured: false,
            tags: ['wireless', 'bluetooth']
          },
          {
            id: '2',
            name: 'Cotton T-Shirt',
            description: '100% organic cotton t-shirt available in multiple colors',
            price: 24.99,
            category: 'Clothing',
            image: 'https://images.pexels.com/photos/1020585/pexels-photo-1020585.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
            images: ['https://images.pexels.com/photos/1020585/pexels-photo-1020585.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2'],
            stock: 0,
            rating: 4.2,
            reviewCount: 156,
            featured: false,
            tags: ['cotton', 'organic']
          },
          {
            id: '3',
            name: 'Smart Watch Pro',
            description: 'Advanced smartwatch with health monitoring and GPS tracking',
            price: 299.99,
            originalPrice: 349.99,
            category: 'Electronics',
            image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
            images: ['https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2'],
            stock: 23,
            rating: 4.8,
            reviewCount: 89,
            featured: false,
            tags: ['smartwatch', 'gps']
          },
          {
            id: '4',
            name: 'Yoga Mat Premium',
            description: 'Premium yoga mat with superior grip and comfort',
            price: 49.99,
            category: 'Sports',
            image: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
            images: ['https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2'],
            stock: 67,
            rating: 4.6,
            reviewCount: 78,
            featured: false,
            tags: ['yoga', 'fitness']
          },
          {
            id: '5',
            name: 'Coffee Maker Deluxe',
            description: 'Professional coffee maker with multiple brewing options',
            price: 199.99,
            category: 'Home',
            image: 'https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
            images: ['https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2'],
            stock: 12,
            rating: 4.4,
            reviewCount: 145,
            featured: false,
            tags: ['coffee', 'kitchen']
          },
          {
            id: '6',
            name: 'Running Shoes',
            description: 'Lightweight running shoes with superior cushioning',
            price: 89.99,
            originalPrice: 119.99,
            category: 'Sports',
            image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
            images: ['https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2'],
            stock: 34,
            rating: 4.3,
            reviewCount: 267,
            featured: false,
            tags: ['running', 'shoes']
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [state.selectedCategory, state.sortBy, dispatch]);

  const sortOptions = [
    { value: 'featured', label: 'Öne Çıkanlar' },
    { value: 'price_asc', label: 'Fiyat (Düşük-Yüksek)' },
    { value: 'price_desc', label: 'Fiyat (Yüksek-Düşük)' },
    { value: 'rating', label: 'En Yüksek Puanlı' },
    { value: 'newest', label: 'En Yeni' }
  ];

  const filteredProducts = products.filter(product => {
    if (state.selectedCategory === 'all') return true;
    return product.category.toLowerCase() === state.selectedCategory;
  });

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div>
      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <span className="text-gray-600">
            {filteredProducts.length} ürün bulundu
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Sort */}
          <select
            value={state.sortBy}
            onChange={(e) => dispatch({ type: 'SET_SORT_BY', payload: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* View Mode */}
          <div className="flex border rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'}`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'}`}
            >
              <List size={16} />
            </button>
          </div>

          {/* Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <Filter size={16} />
            Filtreler
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat Aralığı</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Değerlendirme</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="">Tüm Değerlendirmeler</option>
                <option value="4">4+ Yıldız</option>
                <option value="3">3+ Yıldız</option>
                <option value="2">2+ Yıldız</option>
              </select>
            </div>

            <div className="flex items-end">
              <button className="text-blue-600 hover:text-blue-800 text-sm">
                Filtreleri Temizle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Grid size={64} className="mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Ürün Bulunamadı</h3>
          <p className="text-gray-600">
            Seçilen kategoride ürün bulunmuyor. Lütfen başka bir kategori seçin.
          </p>
        </div>
      ) : (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
