import React from 'react';
import { useApp } from '../context/AppContext';

const OrdersPage: React.FC = () => {
  const { state } = useApp();
  const user = state.user;
  if (!user) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-6 rounded-lg">
          Please sign in to view your orders.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <div className="bg-white rounded-lg shadow divide-y">
        {state.orders.length === 0 && (
          <div className="p-6 text-gray-500">You have no orders yet.</div>
        )}
        {state.orders.map((o) => (
          <div key={o.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Order #{o.id}</div>
                <div className="text-sm text-gray-500">{o.items.length} items</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">${o.total.toFixed(2)}</div>
                <div className="text-sm text-gray-500">{o.status}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;


