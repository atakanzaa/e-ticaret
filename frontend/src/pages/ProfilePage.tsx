import React from 'react';
import { useApp } from '../context/AppContext';

const ProfilePage: React.FC = () => {
  const { state } = useApp();
  const user = state.user;
  if (!user) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-6 rounded-lg">
          Please sign in to view your profile.
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500">Name</div>
            <div className="font-medium">{user.name}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Email</div>
            <div className="font-medium">{user.email}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Role</div>
            <div className="font-medium">{user.role}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;


