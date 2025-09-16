import React, { useEffect, useState } from 'react';
import { api } from '../api/client';

export function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.myOrders();
        setOrders(data as any[]);
      } catch (e) {}
      finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">My Orders</h1>
      <div className="bg-white dark:bg-gray-800 rounded-md shadow divide-y divide-gray-200 dark:divide-gray-700">
        {orders.length === 0 && <div className="p-4">No orders</div>}
        {orders.map((o) => (
          <div key={o.id} className="p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">Order #{o.id}</div>
              <div className="text-sm text-gray-600">{o.status} • {o.currency} {o.totalAmount}</div>
            </div>
            <div className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
