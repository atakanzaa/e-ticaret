import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { User } from '../types';

type ProtectedRouteProps = {
  children: React.ReactElement;
  roles?: Array<User['role']>;
  requireAuth?: boolean;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles, requireAuth = true }) => {
  const { state } = useApp();
  const location = useLocation();

  const user = state.user;

  if (requireAuth && !user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;


