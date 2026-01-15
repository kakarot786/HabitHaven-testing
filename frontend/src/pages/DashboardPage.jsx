import React from 'react';
import { Box } from '@mui/material';
import Dashboard from '../components/Dashboard';

/**
 * Dashboard Page
 * Main application dashboard for authenticated users
 */
const DashboardPage = () => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Dashboard />
    </Box>
  );
};

export default DashboardPage;
