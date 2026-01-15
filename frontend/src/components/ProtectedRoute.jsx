import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress, Typography, Avatar } from '@mui/material';
import { Mosque } from '@mui/icons-material';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading && !user) {
    return (
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
            Loading HabitHaven...
          </Typography>
        </Box>
      </Box>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
