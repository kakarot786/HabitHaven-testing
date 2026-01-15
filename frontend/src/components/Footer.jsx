import React from 'react';
import { Box, Container, Grid, Typography, Link, Divider, Avatar } from '@mui/material';
import { Mosque, Facebook, Twitter, Instagram } from '@mui/icons-material';
import { colors, gradients, shadows, commonStyles } from '../styles';

// Footer Component
const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'rgba(248, 250, 252, 0.95)', // neutral slate-50
        borderTop: '1px solid rgba(226, 232, 240, 0.8)', // slate-200
        mt: 'auto',
        py: 8,
        boxShadow: shadows.lg
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Avatar
                sx={{
                  ...commonStyles.avatarGradient,
                  width: 56,
                  height: 56
                }}
              >
                <Mosque sx={{ fontSize: 32, color: 'white' }} />
              </Avatar>
              <Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: colors.text.primary,
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  Habit<span style={{ color: colors.primary.main }}>Haven</span>
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ color: colors.text.secondary }}
                >
                  Spiritual Growth & Productivity Platform
                </Typography>
              </Box>
            </Box>
            <Typography 
              variant="body1" 
              sx={{ 
                color: colors.text.secondary,
                lineHeight: 1.6,
                maxWidth: 400
              }}
            >
              Your comprehensive companion for spiritual growth, prayer tracking, and productivity enhancement. 
              Build meaningful habits and strengthen your connection with Allah.
            </Typography>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: colors.text.primary,
                fontWeight: 600,
                mb: 3
              }}
            >
              Features
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {['Prayer & Task Tracking', 'Smart Reminders', 'Personal Challenges', 'Group Challenges', 'Daily Performance Score'].map((item) => (
                <Link
                  key={item}
                  href="#"
                  sx={{
                    color: colors.text.secondary,
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    '&:hover': {
                      color: colors.primary.main,
                      textDecoration: 'none'
                    },
                    transition: 'color 0.3s ease'
                  }}
                >
                  {item}
                </Link>
              ))}
            </Box>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: colors.text.primary,
                fontWeight: 600,
                mb: 3
              }}
            >
              Support
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service', 'Community Guidelines'].map((item) => (
                <Link
                  key={item}
                  href="#"
                  sx={{
                    color: colors.text.secondary,
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    '&:hover': {
                      color: colors.primary.main,
                      textDecoration: 'none'
                    },
                    transition: 'color 0.3s ease'
                  }}
                >
                  {item}
                </Link>
              ))}
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 6, borderColor: 'rgba(226, 232, 240, 0.6)' }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography 
            variant="body2" 
            sx={{ color: colors.text.secondary }}
          >
            © 2025 HabitHaven. All rights reserved. Built with ❤️ for spiritual growth.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            {['Privacy', 'Terms', 'Contact'].map((item) => (
              <Link
                key={item}
                href="#"
                sx={{
                  color: colors.text.secondary,
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': {
                    color: colors.primary.main,
                    textDecoration: 'none'
                  },
                  transition: 'color 0.3s ease'
                }}
              >
                {item}
              </Link>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
