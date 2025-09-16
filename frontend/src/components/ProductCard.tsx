import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Eye, Heart } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
  showStore?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  viewMode = 'grid',
  showStore = true 
}) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleProductClick = () => {
    navigate(`/products/${product.id}`); // In real app, this would be slug
  };

  if (viewMode === 'list') {
    return (
      <div 
        className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer"
        onClick={handleProductClick}
      >
        <div className="flex">
          <div className="relative w-48 h-32 flex-shrink-0">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.originalPrice && (
              <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                %{Math.round((1 - product.price / product.originalPrice) * 100)} İndirim
              </div>
            )}
          </div>
          
          <div className="flex-1 p-4 flex justify-between">
            <div className="flex-1">
              <div className="mb-2">
                <span className="text-xs text-blue-600 font-medium">{product.category}</span>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600">
                {product.name}
              </h3>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {product.description}
              </p>
              
              <div className="flex items-center mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2">
                  ({product.reviewCount} değerlendirme)
                </span>
              </div>
            </div>
            
            <div className="flex flex-col items-end justify-between ml-4">
              <div className="text-right mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Stok: {product.stock}
                </p>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add to favorites
                  }}
                  className="p-2 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Heart className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Sepete Ekle
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div 
      className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group cursor-pointer"
      onClick={handleProductClick}
    >
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.originalPrice && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            %{Math.round((1 - product.price / product.originalPrice) * 100)}
          </div>
        )}
        
        {/* Hover Actions */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Add to favorites
            }}
            className="bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition-colors"
          >
            <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/products/${product.id}`);
            }}
            className="bg-white rounded-full p-2 shadow-md hover:bg-blue-50 transition-colors"
          >
            <Eye className="w-4 h-4 text-gray-600 hover:text-blue-500" />
          </button>
        </div>

        {/* Stock Badge */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Stokta Yok
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs text-blue-600 font-medium">{product.category}</span>
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600">
          {product.name}
        </h3>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">
            ({product.reviewCount})
          </span>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500">
            Stok: {product.stock}
          </span>
        </div>
        
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          {product.stock === 0 ? 'Stokta Yok' : 'Sepete Ekle'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
