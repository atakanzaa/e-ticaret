import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Edit, Trash2, Plus, Eye } from 'lucide-react';
import { useEffect } from 'react';
import { api } from '../../api/client';
import { useAuth } from '../../context/UnifiedAuthContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export function ProductManagement() {
  const { user } = useAuth();
  const [sellerProducts, setSellerProducts] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const store = await api.getMyStore();
        const products = await api.getStoreProducts(store.id);
        setSellerProducts(products);
      } catch (e) {
        try {
          const all = await api.listProducts();
          const mine = all.filter((p: any) => true);
          setSellerProducts(mine);
        } catch {}
      }
    })();
  }, []);

  const handleDeleteProduct = (productId: string) => {
    setSellerProducts(prev => prev.filter(p => p.id !== productId));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Product Management
            </h1>
            <Link to="/seller/products/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </Link>
          </div>

          {sellerProducts.length === 0 ? (
            <Card className="p-12 text-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                No products yet
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start selling by adding your first product
              </p>
              <Link to="/seller/products/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Product
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid gap-6">
              {sellerProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="p-6">
                    <div className="flex items-center space-x-6">
                      <img
                        src={product.images?.[0] || product.image}
                        alt={(product as any).title || product.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {(product as any).title || product.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                          {product.description.substring(0, 100)}...
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>Price: ${product.price.toFixed(2)}</span>
                          <span>Stock: {(product as any).quantity ?? product.stock}</span>
                          <span>Category: {product.category}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link to={`/products/${product.slug || product.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link to={`/seller/products/${product.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}