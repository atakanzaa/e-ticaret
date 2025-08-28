import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { api, Product } from '../api/client';
import { ToggleLeft, ToggleRight, Trash2, Loader2, Users, Store } from 'lucide-react';

const AdminPage: React.FC = () => {
  const { state } = useApp();
  const isAdmin = useMemo(() => state.user?.role === 'admin', [state.user]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<Array<{ id: string; email: string; name: string; roles: string[] }>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;
    const load = async () => {
      setLoading(true);
      try {
        const [plist, ulist] = await Promise.all([
          api.listProducts(),
          api.listUsers().catch(() => []),
        ]);
        setProducts(plist);
        setUsers(ulist);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-6 rounded-lg">
          Admin access is required.
        </div>
      </div>
    );
  }

  const toggleActive = async (id: string, current: boolean) => {
    setLoading(true);
    try {
      await api.setProductActive(id, !current);
      // Ideally refetch from backend to reflect state correctly
      const list = await api.listProducts();
      setProducts(list);
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id: string) => {
    setLoading(true);
    try {
      await api.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {loading && (
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <Loader2 className="animate-spin" size={18} /> Loading...
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Store size={18} />
            <h2 className="text-xl font-semibold">Products</h2>
          </div>
          <div className="bg-white rounded-lg shadow divide-y">
            {products.map((p) => (
              <div key={p.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={p.image} alt={p.name} className="w-12 h-12 rounded object-cover" />
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-sm text-gray-500">{p.category} • ${p.price}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleActive(p.id, true)} className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-50">
                    <ToggleLeft size={16} />
                  </button>
                  <button onClick={() => toggleActive(p.id, false)} className="px-3 py-1 border rounded text-green-600 hover:bg-green-50">
                    <ToggleRight size={16} />
                  </button>
                  <button onClick={() => removeProduct(p.id)} className="px-3 py-1 border rounded text-red-600 hover:bg-red-50">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Users size={18} />
            <h2 className="text-xl font-semibold">Users</h2>
          </div>
          <div className="bg-white rounded-lg shadow divide-y">
            {users.map((u) => (
              <div key={u.id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">{u.name}</div>
                  <div className="text-sm text-gray-500">{u.email}</div>
                </div>
                <div className="text-sm text-gray-600">{u.roles?.join(', ')}</div>
              </div>
            ))}
            {users.length === 0 && <div className="p-4 text-sm text-gray-500">No users or endpoint disabled.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;


