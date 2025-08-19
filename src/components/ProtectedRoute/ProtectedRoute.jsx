import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role if required - now using string comparison
  if (requiredRole && user?.role !== requiredRole) {
    console.log('Role check failed:', { userRole: user?.role, requiredRole });
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;