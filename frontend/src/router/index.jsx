import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress, Typography, Avatar } from '@mui/material';
import { Mosque } from '@mui/icons-material';
import ProtectedRoute from '../components/ProtectedRoute';
import PublicOnlyRoute from '../components/PublicOnlyRoute';

// Lazy load pages for better performance
const HomePage = lazy(() => import('../pages/HomePage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));

// Loading component
const LoadingFallback = () => (
  <Box
    sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #dbeafe 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    <Box sx={{ textAlign: 'center' }}>
      <Avatar
        sx={{
          width: 80,
          height: 80,
          mx: 'auto',
          mb: 3,
          background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
          boxShadow: '0 8px 24px rgba(2, 132, 199, 0.3)'
        }}
      >
        <Mosque sx={{ fontSize: 40, color: 'white' }} />
      </Avatar>
      <CircularProgress 
        sx={{ 
          color: '#0284c7',
          mb: 2
        }} 
      />
      <Typography 
        variant="h6" 
        sx={{ 
          color: '#082f49',
          fontWeight: 600 
        }}
      >
        Loading...
      </Typography>
    </Box>
  </Box>
);

/**
 * Application Router
 * Defines all routes and navigation logic
 */
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          
          {/* Auth Routes - Redirect to dashboard if already logged in */}
          <Route 
            path="/login" 
            element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicOnlyRoute>
                <RegisterPage />
              </PublicOnlyRoute>
            } 
          />
          
          {/* Protected Routes - Require authentication */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          
          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
