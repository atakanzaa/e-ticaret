import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingCart } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card hover className="overflow-hidden">
        <Link to={`/product/${product.id}`}>
          <div className="aspect-w-16 aspect-h-12">
            <img
              src={product.image || product.images?.[0]}
              alt={(product as any).name || (product as any).title}
              className="w-full h-48 object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
              {(product as any).name || (product as any).title}
            </h3>
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                ({(product as any).reviewCount ?? (product as any).reviews?.length ?? 0})
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-blue-600">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-sm text-gray-500">
                {((product as any).stock ?? (product as any).quantity ?? 0)} in stock
              </span>
            </div>
          </div>
        </Link>
        {user?.role === 'customer' && (
          <div className="p-4 pt-0">
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddToCart}
              className="w-full"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        )}
      </Card>
    </motion.div>
  );
}