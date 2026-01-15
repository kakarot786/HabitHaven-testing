import React from 'react';
import { Box } from '@mui/material';
import Header from '../components/Header';
import Home from '../components/Home';
import Footer from '../components/Footer';

/**
 * Home Page (Landing Page)
 * Displays the main landing page with header and footer
 */
const HomePage = () => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Home />
      <Footer />
    </Box>
  );
};

export default HomePage;
