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

            {/* Waiting Applications */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Waiting Applications
              </h2>
              <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                Pending: <span className="font-semibold">{pendingApps.length}</span>
              </div>
              <div className="space-y-4">
                {pendingApps.slice(0, 5).map((app) => (
                  <div key={app.id} className="flex items-center justify-between">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900 dark:text-white">Application #{app.id.substring(0, 8)}</div>
                      <div className="text-gray-500">User: {app.userId}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove(app.id, app.userId)}>Approve</Button>
                      <Button size="sm" variant="outline" className="text-red-600 border-red-300 hover:bg-red-50" onClick={() => handleReject(app.id)}>Reject</Button>
                    </div>
                  </div>
                ))}
                {pendingApps.length === 0 && (
                  <div className="text-sm text-gray-500">
                    No pending applications.
                  </div>
                )}
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}