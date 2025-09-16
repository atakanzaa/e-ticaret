import React from 'react';
import { ArrowRight, ShoppingBag } from 'lucide-react';

const Hero: React.FC = () => {
  const scrollToProducts = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Harika Ürünleri
              <span className="block text-yellow-300">Keşfedin</span>
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              En iyi fiyatlar ve kaliteyle binlerce üründen alışveriş yapın. 
              Hızlı teslimat ve güvenli ödeme garantili.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={scrollToProducts}
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag size={20} />
                Alışverişe Başla
                <ArrowRight size={20} />
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Daha Fazla Bilgi
              </button>
            </div>
          </div>

          {/* Right Content - Hero Image/Graphics */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/20 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold">1000+</div>
                  <div className="text-sm text-blue-100">Products</div>
                </div>
                <div className="bg-white/20 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold">50+</div>
                  <div className="text-sm text-blue-100">Categories</div>
                </div>
                <div className="bg-white/20 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold">24/7</div>
                  <div className="text-sm text-blue-100">Support</div>
                </div>
                <div className="bg-white/20 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold">Free</div>
                  <div className="text-sm text-blue-100">Shipping</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
