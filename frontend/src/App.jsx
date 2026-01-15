import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './config/theme.config';
import AppRouter from './router';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRouter />
    </ThemeProvider>
  );
};

export default App;