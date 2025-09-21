import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Ban, Eye } from 'lucide-react';
import { api } from '../../api/client';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { User } from '../../types';

interface SellerData extends User {
  isActive?: boolean;
  roles: string[];
}

interface ApplicationData {
  id: string;
  userId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt?: string;
}

export function SellerManagement() {
  const [sellers, setSellers] = useState<SellerData[]>([]);
  const [applications, setApplications] = useState<ApplicationData[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [list, apps] = await Promise.all([
          api.listSellers(),
          api.listSellerApplications(),
        ]);
        setSellers(
          list.map(u => ({
            ...u,
            // API'den role gelmiyorsa seller varsayalım
            role: (u as any).role ?? 'seller',
            isActive: true,
            roles: (u as any).roles || ['SELLER'],
          }))
        );
        setApplications(
          apps.map(app => ({
            ...app,
            status:
              app.status === 'PENDING' || app.status === 'APPROVED' || app.status === 'REJECTED'
                ? app.status
                : 'PENDING', // Uygun olmayan status değerini düzelt
          }))
        );
      } catch (error) {
        console.error('Failed to load sellers and applications:', error);
        // Set mock data for development
        setSellers([
          {
            id: '1',
            name: 'John Seller',
            email: 'john@seller.com',
            role: 'seller',
            isActive: true,
            roles: ['SELLER'],
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Jane Store',
            email: 'jane@store.com',
            role: 'seller',
            isActive: false,
            roles: ['SELLER'],
            createdAt: new Date().toISOString()
          }
        ]);
        setApplications([
          {
            id: '1',
            userId: '3',
            status: 'PENDING',
            createdAt: new Date().toISOString()
          }
        ]);
      }
    })();
  }, []);

  const handleToggleStatus = async (sellerId: string) => {
    const seller = sellers.find(s => s.id === sellerId);
    if (!seller) return;
    const enable = !(seller.isActive ?? true);
    
    try {
      await api.toggleUserRole(sellerId, enable);
      setSellers(prev => prev.map(s => s.id === sellerId ? { ...s, isActive: enable } : s));
    } catch (error) {
      console.error('Failed to toggle seller status:', error);
      // Still update UI for development
      setSellers(prev => prev.map(s => s.id === sellerId ? { ...s, isActive: enable } : s));
    }
  };

  const handleApprove = async (applicationId: string, userId: string) => {
    try {
      await api.updateSellerApplication(applicationId, 'APPROVED');
      await api.toggleUserRole(userId, true);
      setApplications(prev => prev.map(a => a.id === applicationId ? { ...a, status: 'APPROVED' as const } : a));
    } catch (error) {
      console.error('Failed to approve application:', error);
      // Still update UI for development
      setApplications(prev => prev.map(a => a.id === applicationId ? { ...a, status: 'APPROVED' as const } : a));
    }
  };

  const handleReject = async (applicationId: string) => {
    try {
      await api.updateSellerApplication(applicationId, 'REJECTED');
      setApplications(prev => prev.map(a => a.id === applicationId ? { ...a, status: 'REJECTED' as const } : a));
    } catch (error) {
      console.error('Failed to reject application:', error);
      // Still update UI for development
      setApplications(prev => prev.map(a => a.id === applicationId ? { ...a, status: 'REJECTED' as const } : a));
    }
  };

  const handleBanSeller = (sellerId: string) => {
    setSellers(prev => 
      prev.map(seller => 
        seller.id === sellerId 
          ? { ...seller, isActive: false }
          : seller
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
    {/* motion.div için kapanış etiketi eklendi */}
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  Seller Management
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Manage and monitor all sellers on your platform
                </p>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Total Sellers</div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {sellers.length}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Active</div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {sellers.filter(s => s.isActive).length}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sellers Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Active Sellers
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Manage seller accounts and permissions
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Seller
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Joined Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {sellers.map((seller, index) => (
                      <motion.tr
                        key={seller.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12">
                              <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-sm font-bold text-white">
                                  {(seller.name || seller.email).charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                {seller.name || 'Unknown Seller'}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                ID: {seller.id.substring(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {seller.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
                            seller.isActive
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border border-green-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border border-red-200'
                          }`}>
                            <div className={`w-2 h-2 rounded-full mr-2 ${seller.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            {seller.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {seller.createdAt ? new Date(seller.createdAt).toLocaleDateString('tr-TR') : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleStatus(seller.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                seller.isActive 
                                  ? 'text-red-600 hover:text-red-900 hover:bg-red-50' 
                                  : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                              }`}
                              title={seller.isActive ? 'Deactivate' : 'Activate'}
                            >
                              {seller.isActive ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleBanSeller(seller.id)}
                              className="text-red-600 hover:text-red-900 hover:bg-red-50 p-2 rounded-lg transition-colors"
                              title="Ban Seller"
                            >
                              <Ban className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                    {sellers.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center">
                          <div className="text-gray-500 dark:text-gray-400">
                            <div className="text-4xl mb-4">👥</div>
                            <div className="text-lg font-medium mb-2">No sellers found</div>
                            <div className="text-sm">Sellers will appear here once they register</div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
              </table>
            </div>
          </Card>
          </motion.div>

          {/* Applications Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Pending Seller Applications
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Review and approve new seller applications
                    </p>
                  </div>
                  <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full text-sm font-medium">
                    {applications.filter(app => app.status === 'PENDING').length} Pending
                  </span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Application ID</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">User ID</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {applications.map((app, index) => (
                      <motion.tr 
                        key={app.id} 
                        className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          #{app.id.substring(0, 8)}...
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {app.userId.substring(0, 12)}...
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
                            app.status === 'APPROVED' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border border-green-200' :
                            app.status === 'REJECTED' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border border-red-200' :
                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border border-yellow-200'
                          }`}>
                            <div className={`w-2 h-2 rounded-full mr-2 ${
                              app.status === 'APPROVED' ? 'bg-green-500' : 
                              app.status === 'REJECTED' ? 'bg-red-500' : 'bg-yellow-500'
                            }`}></div>
                            {app.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-green-600 hover:text-green-900 hover:bg-green-50 px-3 py-1 rounded-lg transition-colors" 
                              onClick={() => handleApprove(app.id, app.userId)} 
                              disabled={app.status !== 'PENDING'}
                            >
                              ✓ Approve
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-600 hover:text-red-900 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors" 
                              onClick={() => handleReject(app.id)} 
                              disabled={app.status !== 'PENDING'}
                            >
                              ✕ Reject
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                    {applications.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center">
                          <div className="text-gray-500 dark:text-gray-400">
                            <div className="text-4xl mb-4">📋</div>
                            <div className="text-lg font-medium mb-2">No applications found</div>
                            <div className="text-sm">Seller applications will appear here</div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}