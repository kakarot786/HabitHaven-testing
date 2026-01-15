import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container, Avatar, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { Mosque, Menu as MenuIcon } from '@mui/icons-material';
import { colors, gradients, shadows, commonStyles } from '../styles';

// Header Component
const Header = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar 
      
      sx={{ 
        backgroundColor: 'rgba(248, 250, 252, 0.95)',
        backdropFilter: 'blur(10px)',
        boxShadow: shadows.md
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between', py: { xs: 0.5, sm: 1 }, minHeight: { xs: 56, sm: 64 } }}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: { xs: 1, sm: 2 }, 
              cursor: 'pointer' 
            }} 
            onClick={() => navigate('/')}
          >
            <Avatar
              sx={{
                ...commonStyles.avatarGradient,
                width: { xs: 36, sm: 48 },
                height: { xs: 36, sm: 48 }
              }}
            >
              <Mosque sx={{ fontSize: { xs: 20, sm: 28 }, color: 'white' }} />
            </Avatar>
            <Box sx={{ display: { xs: 'block', sm: 'block' } }}>
              <Typography 
                variant="h5" 
                component="h1" 
                sx={{ 
                  fontWeight: 'bold',
                  color: colors.text.primary,
                  fontFamily: 'Inter, sans-serif',
                  fontSize: { xs: '1.1rem', sm: '1.5rem' }
                }}
              >
                Habit<span style={{ color: colors.primary.main }}>Haven</span>
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: colors.text.secondary,
                  fontSize: { xs: '0.65rem', sm: '0.75rem' },
                  mt: -0.5,
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                Spiritual Growth & Productivity
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 } }}>
            <Button
              onClick={() => navigate('/login')}
              sx={{
                color: colors.text.primary,
                textTransform: 'none',
                fontSize: { xs: '0.85rem', sm: '1rem' },
                fontWeight: 500,
                px: { xs: 1.5, sm: 3 },
                py: { xs: 0.5, sm: 1 },
                borderRadius: 2,
                minWidth: { xs: 'auto', sm: 'auto' },
                '&:hover': {
                  backgroundColor: 'rgba(2, 132, 199, 0.05)'
                }
              }}
            >
              {isMobile ? 'Sign In' : 'Sign In'}
            </Button>
            <Button
              onClick={() => navigate('/register')}
              variant="contained"
              sx={{
                backgroundColor: colors.primary.main,
                color: 'white',
                textTransform: 'none',
                fontSize: { xs: '0.85rem', sm: '1rem' },
                fontWeight: 600,
                px: { xs: 2, sm: 4 },
                py: { xs: 0.75, sm: 1.5 },
                borderRadius: { xs: 2, sm: 3 },
                boxShadow: shadows.medium,
                minWidth: { xs: 'auto', sm: 'auto' },
                '&:hover': {
                  backgroundColor: colors.primary.dark,
                  transform: 'translateY(-2px)',
                  boxShadow: shadows.large
                },
                transition: 'all 0.3s ease'
              }}
            >
              {isMobile ? 'Start' : 'Get Started'}
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
