// Development stubs for backend endpoints
// These provide realistic data for development and testing
// Real implementations are available in production

import React from 'react';

// Stub for Seller Dashboard
export const SellerDashboardStub: React.FC = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Seller Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Active Products</h3>
          <p className="text-3xl font-bold text-blue-600">12</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Sales</h3>
          <p className="text-3xl font-bold text-green-600">₺2,450</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Orders Today</h3>
          <p className="text-3xl font-bold text-purple-600">8</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Recent Products</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded">
            <div>
              <p className="font-medium">iPhone 15 Pro</p>
              <p className="text-sm text-gray-600">Electronics</p>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">Active</span>
          </div>
          <div className="flex items-center justify-between p-4 border rounded">
            <div>
              <p className="font-medium">MacBook Air M3</p>
              <p className="text-sm text-gray-600">Electronics</p>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stub for Admin Dashboard
export const AdminDashboardStub: React.FC = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">1,234</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Active Sellers</h3>
          <p className="text-3xl font-bold text-green-600">89</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-purple-600">456</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Revenue</h3>
          <p className="text-3xl font-bold text-yellow-600">₺125,430</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">System Status</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span>Order Service</span>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">Online</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Payment Service</span>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">Online</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Catalog Service</span>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">Online</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Auth Service</span>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stub for Payment History
export const PaymentHistoryStub: React.FC = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Payment History</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #ORD-001
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ₺299.99
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Completed
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                2024-01-15
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #ORD-002
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ₺149.50
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                  Pending
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                2024-01-14
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
