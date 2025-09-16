import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Product } from '../types';
import ProductCard from './ProductCard';
import { Loader2 } from 'lucide-react';

const FeaturedProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const featuredProducts = await api.homeProducts(8);
        setProducts(featuredProducts);
      } catch (error) {
        console.error('Error loading featured products:', error);
        // Fallback to sample data
        setProducts([
          {
            id: '1',
            name: 'Wireless Bluetooth Headphones Pro',
            description: 'High-quality wireless headphones with noise cancellation',
            price: 79.99,
            originalPrice: 99.99,
            category: 'Electronics',
            image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
            images: ['https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2'],
            stock: 25,
            rating: 4.5,
            reviewCount: 234,
            featured: true,
            tags: ['wireless', 'bluetooth', 'headphones']
          },
          {
            id: '2',
            name: 'Premium Cotton T-Shirt',
            description: '100% organic cotton t-shirt available in multiple colors',
            price: 24.99,
            category: 'Clothing',
            image: 'https://images.pexels.com/photos/1020585/pexels-photo-1020585.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
            images: ['https://images.pexels.com/photos/1020585/pexels-photo-1020585.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2'],
            stock: 50,
            rating: 4.2,
            reviewCount: 156,
            featured: true,
            tags: ['cotton', 'organic', 'clothing']
          },
          {
            id: '3',
            name: 'Smart Watch Series X',
            description: 'Advanced smartwatch with health monitoring and GPS',
            price: 299.99,
            originalPrice: 349.99,
            category: 'Electronics',
            image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
            images: ['https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2'],
            stock: 15,
            rating: 4.8,
            reviewCount: 89,
            featured: true,
            tags: ['smartwatch', 'fitness', 'gps']
          },
          {
            id: '4',
            name: 'Yoga Mat Premium Non-Slip',
            description: 'Premium yoga mat with superior grip and comfort',
            price: 49.99,
            category: 'Sports & Outdoors',
            image: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
            images: ['https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2'],
            stock: 30,
            rating: 4.6,
            reviewCount: 78,
            featured: true,
            tags: ['yoga', 'fitness', 'non-slip']
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <div className="flex justify-center">
              <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of the best products with amazing deals
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
