import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Plus, Minus } from 'lucide-react';
import { mockProducts } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ReviewCard } from '../components/common/ReviewCard';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { user } = useAuth();

  const product = mockProducts.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Product not found
        </h1>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const adjustQuantity = (delta: number) => {
    const maxStock = (product as any).quantity ?? (product as any).stock ?? 99;
    setQuantity(prev => Math.max(1, Math.min(maxStock, prev + delta)));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          {/* Image Gallery */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <img
                src={product.images[selectedImage]}
                alt={((product as any).title ?? (product as any).name) as string}
                className="w-full h-96 object-cover"
              />
            </Card>
            {product.images.length > 1 && (
              <div className="flex space-x-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index
                        ? 'border-blue-600'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${((product as any).title ?? (product as any).name) as string} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {((product as any).title ?? (product as any).name) as string}
              </h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600 dark:text-gray-400">
                  {product.rating} ({(((product as any).reviews?.length) ?? ((product as any).reviewCount ?? 0)) as number} reviews)
                </span>
              </div>
            </div>

            <div className="text-3xl font-bold text-blue-600">
              ${product.price.toFixed(2)}
            </div>

            <Card className="p-4">
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {product.description}
              </p>
            </Card>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 dark:text-gray-300">Quantity:</span>
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                  <button
                    onClick={() => adjustQuantity(-1)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300 dark:border-gray-600">
                    {quantity}
                  </span>
                  <button
                    onClick={() => adjustQuantity(1)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {((product as any).quantity ?? (product as any).stock ?? 0) as number} in stock
                </span>
              </div>

              {user?.role === 'customer' && (
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="w-full"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
              )}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sold by <span className="font-medium">{product.sellerName}</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Customer Reviews
          </h2>
          {(((product as any).reviews?.length) ?? 0) > 0 ? (
            <div className="space-y-4">
              {((product as any).reviews as any[])?.map((review: any) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                No reviews yet. Be the first to review this product!
              </p>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}