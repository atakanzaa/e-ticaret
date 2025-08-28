import React from 'react';
import Hero from '../components/Hero';
import FeaturedProducts from '../components/FeaturedProducts';
import CategoryFilter from '../components/CategoryFilter';
import ProductGrid from '../components/ProductGrid';

const HomePage: React.FC = () => {
  return (
    <main>
      <Hero />
      <FeaturedProducts />

      <section id="products" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              All Products
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse through our complete collection of quality products
            </p>
          </div>

          <CategoryFilter />
          <ProductGrid />
        </div>
      </section>
    </main>
  );
};

export default HomePage;


