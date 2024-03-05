import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getCookie } from '../../auth/auth';

interface IProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<IProps> = ({ children }) => {
  const location = useLocation();
  const token = getCookie('token');

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
