import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { api, Product } from '../api/client';
import { Plus, Edit, Trash2, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

const SellerPage: React.FC = () => {
  const { state } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    price: 0,
    currency: 'TRY' as 'TRY' | 'USD' | 'EUR',
    stock: 0,
    categoryId: '',
    description: '',
    image: '',
  });

  const isSeller = useMemo(() => state.user?.role === 'seller' || state.user?.role === 'admin', [state.user]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        // Reuse catalog products as "my" for now until backend filters by store
        const list = await api.listProducts();
        setProducts(list);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ name: '', price: 0, currency: 'TRY', stock: 0, categoryId: '', description: '', image: '' });
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      price: p.price,
      currency: 'TRY',
      stock: p.stock,
      categoryId: 'unknown',
      description: p.description,
      image: p.image,
    });
    setShowForm(true);
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editingId) {
        await api.updateProduct(editingId, {
          name: form.name,
          price: form.price,
          stock: form.stock,
          description: form.description,
        });
      } else {
        const { id } = await api.createProduct({
          name: form.name,
          price: form.price,
          currency: form.currency,
          stock: form.stock,
          categoryId: form.categoryId || '11111111-1111-1111-1111-111111111111',
          description: form.description,
          attrs: {},
        });
        // naive refetch
        const list = await api.listProducts();
        setProducts(list);
        if (!editingId) setEditingId(id);
      }
      setShowForm(false);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    setIsLoading(true);
    try {
      await api.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSeller) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-6 rounded-lg">
          You need a seller account to manage products.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Seller Products</h1>
        <button onClick={openCreate} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={16} /> New Product
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <Loader2 className="animate-spin" size={18} /> Loading...
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p.id} className="bg-white rounded-lg shadow">
            <img src={p.image} alt={p.name} className="w-full h-48 object-cover rounded-t-lg" />
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="text-sm text-gray-500">{p.category}</p>
                </div>
                <span className="font-semibold">${p.price}</span>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-600">Stock: {p.stock}</div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(p)} className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => deleteProduct(p.id)} className="px-3 py-1 text-red-600 hover:bg-red-50 rounded">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="p-4 border-b font-semibold">{editingId ? 'Edit Product' : 'Create Product'}</div>
            <form onSubmit={submitForm} className="p-4 space-y-4">
              <input className="w-full border rounded p-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <div className="grid grid-cols-3 gap-3">
                <input type="number" className="border rounded p-2" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required />
                <select className="border rounded p-2" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value as any })}>
                  <option value="TRY">TRY</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
                <input type="number" className="border rounded p-2" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} required />
              </div>
              <input className="w-full border rounded p-2" placeholder="Category ID" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} required={!editingId} />
              <input className="w-full border rounded p-2" placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
              <textarea className="w-full border rounded p-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded border flex items-center gap-2">
                  <XCircle size={16} /> Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white flex items-center gap-2">
                  <CheckCircle2 size={16} /> Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerPage;


