import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Public Only Route Component
 * Redirects to dashboard if user is already authenticated
 * Used for login and register pages
 */
const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // or a loading spinner
  }

  return user ? <Navigate to="/dashboard" replace /> : children;
};

export default PublicOnlyRoute;
