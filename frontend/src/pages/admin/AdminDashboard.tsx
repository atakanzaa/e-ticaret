import React from 'react';
import { motion } from 'framer-motion';
import { Users, Store, Package, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { mockDashboardStats } from '../../data/mockData';
import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { DashboardCard } from '../../components/common/DashboardCard';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export function AdminDashboard() {
  const stats = mockDashboardStats;
  const [sellers, setSellers] = useState<Array<{ id: string; email: string; name: string; roles: string[] }>>([]);
  const [users, setUsers] = useState<Array<{ id: string; email: string; name: string; roles: string[] }>>([]);
  const [applications, setApplications] = useState<Array<{ id: string; userId: string; status: string }>>([]);

  useEffect(() => {
    (async () => {
      const [all, apps] = await Promise.all([
        api.listUsers(),
        api.listSellerApplications(),
      ]);
      setSellers(all.filter(u => (u.roles || []).includes('SELLER')));
      setUsers(all.filter(u => !(u.roles || []).includes('ADMIN') && !(u.roles || []).includes('SELLER')));
      setApplications(apps);
    })();
  }, []);

  const pendingApps = applications.filter(a => a.status === 'PENDING');

  const handleApprove = async (applicationId: string, userId: string) => {
    await api.updateSellerApplication(applicationId, 'APPROVED');
    await api.toggleUserRole(userId, true);
    setApplications(prev => prev.map(a => a.id === applicationId ? { ...a, status: 'APPROVED' } : a));
  };

  const handleReject = async (applicationId: string) => {
    await api.updateSellerApplication(applicationId, 'REJECTED');
    setApplications(prev => prev.map(a => a.id === applicationId ? { ...a, status: 'REJECTED' } : a));
  };

  const recentActivity = [
    { id: '1', type: 'user_registered', message: 'New user registered: John Smith', time: '2 hours ago' },
    { id: '2', type: 'seller_approved', message: 'Seller approved: Tech Store Inc', time: '4 hours ago' },
    { id: '3', type: 'product_added', message: 'New product listed: Gaming Headset', time: '6 hours ago' },
    { id: '4', type: 'order_completed', message: 'Order #12345 completed - $299.99', time: '8 hours ago' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Welcome back! Here's what's happening with your platform today.
                </p>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Today</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {new Date().toLocaleDateString('tr-TR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <DashboardCard
                title="Daily Sales"
                value={`$${stats.dailySales.toFixed(2)}`}
                icon={DollarSign}
                change="+12.5% today"
                changeType="positive"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <DashboardCard
                title="Total Users"
                value={users.length}
                icon={Users}
                change="+8 this week"
                changeType="positive"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <DashboardCard
                title="Active Sellers"
                value={sellers.length}
                icon={Store}
                change="+3 this month"
                changeType="positive"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <DashboardCard
                title="Total Products"
                value={stats.totalProducts}
                icon={Package}
                change="+45 this week"
                changeType="positive"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <DashboardCard
                title="Profit/Loss"
                value={`$${stats.profitLoss.toFixed(2)}`}
                icon={stats.profitLoss > 0 ? TrendingUp : TrendingDown}
                change="+5.2% vs last month"
                changeType={stats.profitLoss > 0 ? 'positive' : 'negative'}
              />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Recent Activity
                  </h2>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <motion.div 
                      key={activity.id} 
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                    >
                      <div className="flex-shrink-0">
                        <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2 shadow-sm"></div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Waiting Applications */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Waiting Applications
                  </h2>
                  <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full text-sm font-medium">
                    {pendingApps.length} Pending
                  </span>
                </div>
                <div className="space-y-4">
                  {pendingApps.slice(0, 5).map((app, index) => (
                    <motion.div 
                      key={app.id} 
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                    >
                      <div className="text-sm">
                        <div className="font-medium text-gray-900 dark:text-white">
                          Application #{app.id.substring(0, 8)}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">
                          User: {app.userId.substring(0, 12)}...
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700 text-white shadow-sm" 
                          onClick={() => handleApprove(app.id, app.userId)}
                        >
                          ✓ Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20" 
                          onClick={() => handleReject(app.id)}
                        >
                          ✕ Reject
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                  {pendingApps.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <div className="text-4xl mb-2">📋</div>
                      <div className="text-sm">No pending applications.</div>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}