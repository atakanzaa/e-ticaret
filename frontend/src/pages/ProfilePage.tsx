import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Address, User } from '../types';

export function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressForm, setAddressForm] = useState<Omit<Address, 'id' | 'createdAt' | 'updatedAt'>>({
    type: 'SHIPPING',
    recipientName: '',
    phone: '',
    country: '',
    state: '',
    city: '',
    postalCode: '',
    streetLine1: '',
    streetLine2: '',
    isDefault: false
  });

  useEffect(() => {
    (async () => {
      try {
        const me = await api.userMe();
        setUser(me as any);
        const addrs = await api.listAddresses();
        setAddresses(addrs as any);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return <div className="p-6">Not logged in</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">My Profile</h1>
      <div className="bg-white dark:bg-gray-800 rounded-md p-4 shadow">
        <div className="mb-2"><strong>Name:</strong> {user.name}</div>
        <div className="mb-2"><strong>Email:</strong> {user.email}</div>
        <div className="mb-2"><strong>Role:</strong> {user.role}</div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Addresses</h2>
        <div className="space-y-3">
          {addresses.map(a => (
            <div key={a.id} className="bg-white dark:bg-gray-800 rounded-md p-4 shadow flex justify-between">
              <div>
                <div className="font-medium">{a.type} - {a.recipientName}</div>
                <div className="text-sm text-gray-600">{a.streetLine1} {a.streetLine2}, {a.city}/{a.state} {a.postalCode}, {a.country}</div>
                {a.phone && <div className="text-sm text-gray-600">{a.phone}</div>}
                {a.isDefault && <span className="text-xs text-green-600">Default</span>}
              </div>
              <div className="space-x-2">
                <button
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded"
                  onClick={async () => {
                    const updated = await api.updateAddress(a.id, {
                      ...a,
                      streetLine2: a.streetLine2 || '',
                    } as any);
                    setAddresses(prev => prev.map(x => x.id === a.id ? updated as any : x));
                  }}
                >Save</button>
                <button
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded"
                  onClick={async () => {
                    await api.deleteAddress(a.id);
                    setAddresses(prev => prev.filter(x => x.id !== a.id));
                  }}
                >Delete</button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-white dark:bg-gray-800 rounded-md p-4 shadow">
          <h3 className="font-medium mb-3">Add New Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <select
              value={addressForm.type}
              onChange={e => setAddressForm(f => ({ ...f, type: e.target.value as any }))}
              className="border rounded px-3 py-2"
            >
              <option value="SHIPPING">Shipping</option>
              <option value="BILLING">Billing</option>
            </select>
            <input className="border rounded px-3 py-2" placeholder="Recipient Name" value={addressForm.recipientName} onChange={e => setAddressForm(f => ({ ...f, recipientName: e.target.value }))} />
            <input className="border rounded px-3 py-2" placeholder="Phone" value={addressForm.phone} onChange={e => setAddressForm(f => ({ ...f, phone: e.target.value }))} />
            <input className="border rounded px-3 py-2" placeholder="Country" value={addressForm.country} onChange={e => setAddressForm(f => ({ ...f, country: e.target.value }))} />
            <input className="border rounded px-3 py-2" placeholder="State" value={addressForm.state} onChange={e => setAddressForm(f => ({ ...f, state: e.target.value }))} />
            <input className="border rounded px-3 py-2" placeholder="City" value={addressForm.city} onChange={e => setAddressForm(f => ({ ...f, city: e.target.value }))} />
            <input className="border rounded px-3 py-2" placeholder="Postal Code" value={addressForm.postalCode} onChange={e => setAddressForm(f => ({ ...f, postalCode: e.target.value }))} />
            <input className="border rounded px-3 py-2 md:col-span-2" placeholder="Street Line 1" value={addressForm.streetLine1} onChange={e => setAddressForm(f => ({ ...f, streetLine1: e.target.value }))} />
            <input className="border rounded px-3 py-2 md:col-span-2" placeholder="Street Line 2" value={addressForm.streetLine2} onChange={e => setAddressForm(f => ({ ...f, streetLine2: e.target.value }))} />
            <label className="flex items-center space-x-2">
              <input type="checkbox" checked={addressForm.isDefault} onChange={e => setAddressForm(f => ({ ...f, isDefault: e.target.checked }))} />
              <span>Set as default</span>
            </label>
          </div>
          <button
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded"
            onClick={async () => {
              const created = await api.createAddress(addressForm as any);
              setAddresses(prev => [...prev, created as any]);
              setAddressForm({
                type: 'SHIPPING', recipientName: '', phone: '', country: '', state: '', city: '', postalCode: '', streetLine1: '', streetLine2: '', isDefault: false
              });
            }}
          >Add Address</button>
        </div>
      </div>
    </div>
  );
}
