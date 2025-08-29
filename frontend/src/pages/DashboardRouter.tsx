import React, { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const DashboardRouter: React.FC = () => {
  const { state } = useApp();
  const role = useMemo(() => state.user?.role, [state.user]);

  if (!role) {
    return <Navigate to="/" replace />;
  }

  if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (role === 'seller') return <Navigate to="/seller/dashboard" replace />;
  return <Navigate to="/profile" replace />;
};

export default DashboardRouter;


