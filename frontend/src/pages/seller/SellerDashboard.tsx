import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Plus, DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';
import { mockProducts } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { DashboardCard } from '../../components/common/DashboardCard';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export function SellerDashboard() {
  const { user } = useAuth();
  
  const sellerProducts = mockProducts.filter(p => p.sellerId === user?.id);
  const totalValue = sellerProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  const totalSales = 1250; // Mock data
  const monthlyGrowth = "+15%";

  const recentOrders = [
    { id: '1', product: 'Wireless Headphones', quantity: 2, total: 399.98, status: 'pending' },
    { id: '2', product: 'Smart Watch', quantity: 1, total: 299.99, status: 'shipped' },
    { id: '3', product: 'Coffee Beans', quantity: 3, total: 74.97, status: 'delivered' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Seller Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Welcome back, {user?.username}
              </p>
            </div>
            <Link to="/seller/products/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <DashboardCard
              title="Total Products"
              value={sellerProducts.length}
              icon={Package}
              change={`+${sellerProducts.length > 0 ? '2' : '0'} this month`}
              changeType="positive"
            />
            <DashboardCard
              title="Inventory Value"
              value={`$${totalValue.toFixed(2)}`}
              icon={DollarSign}
              change="+$340.00 this week"
              changeType="positive"
            />
            <DashboardCard
              title="Total Sales"
              value={totalSales}
              icon={ShoppingCart}
              change="+12 this week"
              changeType="positive"
            />
            <DashboardCard
              title="Growth Rate"
              value={monthlyGrowth}
              icon={TrendingUp}
              change="vs last month"
              changeType="positive"
            />
          </div>

          {/* Recent Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Recent Orders
              </h2>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {order.product}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Quantity: {order.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white">
                        ${order.total.toFixed(2)}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'delivered' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : order.status === 'shipped'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link to="/seller/orders">
                  <Button variant="outline" className="w-full">
                    View All Orders
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Link to="/seller/products/new" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Product
                  </Button>
                </Link>
                <Link to="/seller/products" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="h-4 w-4 mr-2" />
                    Manage Products
                  </Button>
                </Link>
                <Link to="/seller/store" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Store Settings
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}