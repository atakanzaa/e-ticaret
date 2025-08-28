import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from './ProductCard';
import { api } from '../api/client';

const FeaturedProducts: React.FC = () => {
  const { state } = useApp();
  const [featured, setFeatured] = useState(state.products.filter(p => p.featured).slice(0, 4));

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await api.homeProducts(8);
        if (mounted) setFeatured(data.slice(0, 4));
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (featured.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of the most popular and trending products
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;