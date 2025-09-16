import React from 'react';
import { motion } from 'framer-motion';
import { Users, Store, Package, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { mockDashboardStats, mockUsers } from '../../data/mockData';
import { DashboardCard } from '../../components/common/DashboardCard';
import { Card } from '../../components/ui/Card';

export function AdminDashboard() {
  const stats = mockDashboardStats;
  const sellers = mockUsers.filter(u => u.role === 'seller');
  const users = mockUsers.filter(u => u.role === 'user');

  const recentActivity = [
    { id: '1', type: 'user_registered', message: 'New user registered: John Smith', time: '2 hours ago' },
    { id: '2', type: 'seller_approved', message: 'Seller approved: Tech Store Inc', time: '4 hours ago' },
    { id: '3', type: 'product_added', message: 'New product listed: Gaming Headset', time: '6 hours ago' },
    { id: '4', type: 'order_completed', message: 'Order #12345 completed - $299.99', time: '8 hours ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Admin Dashboard
          </h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <DashboardCard
              title="Daily Sales"
              value={`$${stats.dailySales.toFixed(2)}`}
              icon={DollarSign}
              change="+12.5% today"
              changeType="positive"
            />
            <DashboardCard
              title="Total Users"
              value={users.length}
              icon={Users}
              change="+8 this week"
              changeType="positive"
            />
            <DashboardCard
              title="Active Sellers"
              value={sellers.length}
              icon={Store}
              change="+3 this month"
              changeType="positive"
            />
            <DashboardCard
              title="Total Products"
              value={stats.totalProducts}
              icon={Package}
              change="+45 this week"
              changeType="positive"
            />
            <DashboardCard
              title="Profit/Loss"
              value={`$${stats.profitLoss.toFixed(2)}`}
              icon={stats.profitLoss > 0 ? TrendingUp : TrendingDown}
              change="+5.2% vs last month"
              changeType={stats.profitLoss > 0 ? 'positive' : 'negative'}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Recent Activity
              </h2>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Top Sellers */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Top Sellers
              </h2>
              <div className="space-y-4">
                {sellers.map((seller, index) => (
                  <div key={seller.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {seller.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {seller.username}
                        </p>
                        <p className="text-xs text-gray-500">
                          {seller.email}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        ${(Math.random() * 10000).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        This month
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}