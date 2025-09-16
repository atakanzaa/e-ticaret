import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { User } from '../types';

export function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const me = await api.userMe();
        setUser(me as any);
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
    </div>
  );
}
