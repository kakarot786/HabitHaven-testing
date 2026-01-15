import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  Chip,
  Avatar,
  Paper
} from '@mui/material';
import { 
  Mosque,
  Assignment,
  Notifications,
  EmojiEvents,
  Groups,
  Analytics,
  CheckCircle,
  TrendingUp,
  Schedule,
  AutoAwesome
} from '@mui/icons-material';
import { colors, gradients, shadows, commonStyles } from '../styles';

// Home Component
const Home = () => {
  const navigate = useNavigate();
  const features = [
    {
      icon: <Mosque sx={{ fontSize: 40, color: colors.text.accent }} />,
      title: 'Prayer & Task Tracking',
      description: 'Log your prayers and productivity tasks, view history, and monitor progress over time with detailed analytics.'
    },
    {
      icon: <Notifications sx={{ fontSize: 40, color: colors.text.accent }} />,
      title: 'Smart Reminders',
      description: 'Receive intelligent notifications for upcoming prayer times and scheduled tasks to ensure you stay on track.'
    },
    {
      icon: <AutoAwesome sx={{ fontSize: 40, color: colors.text.accent }} />,
      title: 'AI-Powered Insights',
      description: 'Get personalized recommendations and insights powered by AI to optimize your spiritual routine and productivity patterns.'
    },
    {
      icon: <EmojiEvents sx={{ fontSize: 40, color: colors.text.accent }} />,
      title: 'Personal Challenges',
      description: 'Set personal goals like consistent prayer or completing specific tasks to build positive habits and spiritual growth.'
    },
    {
      icon: <Groups sx={{ fontSize: 40, color: colors.text.accent }} />,
      title: 'Group Challenges',
      description: 'Join or create groups to participate in challenges with friends and community members for accountability.'
    },
    {
      icon: <Analytics sx={{ fontSize: 40, color: colors.text.accent }} />,
      title: 'Daily Performance Score',
      description: 'Get a daily score out of 100 based on completed prayers and tasks, providing clear performance indicators.'
    }
  ];

  const stats = [
    { label: 'Active Users', value: '50K+', icon: <Groups sx={{ color: colors.text.accent }} /> },
    { label: 'Prayers Tracked', value: '2M+', icon: <Mosque sx={{ color: colors.text.accent }} /> },
    { label: 'Tasks Completed', value: '1.5M+', icon: <CheckCircle sx={{ color: colors.text.accent }} /> },
    { label: 'Success Rate', value: '94%', icon: <TrendingUp sx={{ color: colors.text.accent }} /> }
  ];

  return (
    <Box
      sx={{
        background: gradients.background.primary,
        minHeight: '100vh'
        
      }}
    >
      
      <Container maxWidth="xl" sx={{ pt: 8, pb: 12 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 'bold',
              color: colors.text.primary,
              mb: 3,
              fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Transform Your{' '}
            <span style={{ color: colors.text.accent }}>Spiritual Journey</span>
          </Typography>
          
          <Typography
            variant="h5"
            sx={{
              color: colors.text.secondary,
              mb: 6,
              maxWidth: 800,
              mx: 'auto',
              lineHeight: 1.6,
              fontWeight: 400
            }}
          >
            Track your prayers, build productive habits, and grow spiritually with our comprehensive 
            platform designed for modern Muslims seeking balance and growth.
          </Typography>

          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              onClick={() => navigate('/register')}
              variant="contained"
              size="large"
              sx={{
                backgroundColor: colors.primary.main, // sky-600
                color: 'white',
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 3,
                textTransform: 'none',
                boxShadow: shadows.button.default,
                '&:hover': {
                  backgroundColor: colors.primary.dark, // sky-900
                  transform: 'translateY(-2px)',
                  boxShadow: shadows.button.hover
                },
                transition: 'all 0.3s ease'
              }}
            >
              Start Your Journey
            </Button>
            
            <Button
              onClick={() => navigate('/login')}
              variant="outlined"
              size="large"
              sx={{
                borderColor: colors.text.accent, // sky-600
                color: colors.text.accent,
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 3,
                textTransform: 'none',
                borderWidth: 2,
                '&:hover': {
                  borderColor: colors.primary.dark, // sky-900
                  backgroundColor: 'rgba(2, 132, 199, 0.05)',
                  borderWidth: 2
                }
              }}
            >
              Sign In
            </Button>
          </Box>
        </Box>

        
        <Paper
          elevation={0}
          sx={{
            background: 'rgba(255, 255, 255, 0.75)', // white/75
            border: `1px solid ${colors.border.main}`, // sky-300
            borderRadius: 4,
            p: 4,
            mb: 12,
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            boxShadow: shadows.card.default
          }}
        >
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid size={{ xs: 6, md: 3 }} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      backgroundColor: colors.secondary.lighter, // sky-100
                      width: 60,
                      height: 60,
                      mx: 'auto',
                      mb: 2
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 'bold',
                      color: colors.text.primary,
                      mb: 1
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: colors.text.secondary, fontWeight: 500 }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>

        
        <Box sx={{ mb: 12 }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              color: colors.text.primary,
              mb: 3
            }}
          >
            Powerful Features for{' '}
            <span style={{ color: colors.text.accent }}>Spiritual Growth</span>
          </Typography>
          
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              color: colors.text.secondary,
              mb: 8,
              maxWidth: 600,
              mx: 'auto'
            }}
          >
            Everything you need to build consistent habits, track progress, and strengthen your connection with Allah
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={index}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.75)', // white/75
                    border: `1px solid ${colors.border.main}`, // sky-300
                    borderRadius: 3,
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: shadows.card.hover,
                      borderColor: colors.border.hover // sky-500
                    }
                  }}
                >
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Avatar
                      sx={{
                        backgroundColor: colors.secondary.lighter, // sky-100
                        width: 80,
                        height: 80,
                        mx: 'auto',
                        mb: 3
                      }}
                    >
                      {feature.icon}
                    </Avatar>
                    
                    <Typography
                      variant="h5"
                      component="h3"
                      sx={{
                        fontWeight: 'bold',
                        color: colors.text.primary,
                        mb: 2
                      }}
                    >
                      {feature.title}
                    </Typography>
                    
                    <Typography
                      variant="body1"
                      sx={{
                        color: colors.text.secondary,
                        lineHeight: 1.6
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        
        <Paper
          elevation={0}
          sx={{
            background: 'rgba(255, 255, 255, 0.85)', // Frosted glass effect
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: `2px solid ${colors.border.main}`, // sky-300 border
            borderRadius: 4,
            p: 8,
            textAlign: 'center',
            boxShadow: shadows.lg,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(90deg, ${colors.primary.main}, ${colors.primary.dark})`,
            }
          }}
        >
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 'bold',
              mb: 3,
              color: colors.text.primary,
              background: `linear-gradient(135deg, ${colors.primary.main}, ${colors.primary.dark})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Ready to Begin Your Journey?
          </Typography>
          
          <Typography
            variant="h6"
            sx={{
              mb: 6,
              color: colors.text.secondary,
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.7,
              fontWeight: 400
            }}
          >
            Join thousands of Muslims who are transforming their spiritual lives and building productive habits with HabitHaven
          </Typography>

          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
            <Button
              onClick={() => navigate('/register')}
              variant="contained"
              size="large"
              sx={{
                ...commonStyles.primaryButton,
                px: 7,
                py: 2.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 3,
                textTransform: 'none',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: shadows.button.hover,
                }
              }}
            >
              Get Started Free
            </Button>
            
            <Chip
              icon={<CheckCircle sx={{ fontSize: 20, color: colors.primary.main }} />}
              label="Free Forever • No Credit Card"
              sx={{
                backgroundColor: colors.secondary.lighter, // sky-100
                color: colors.text.primary,
                fontSize: '0.95rem',
                py: 3,
                px: 2,
                fontWeight: 500,
                border: `1px solid ${colors.border.main}`,
                '& .MuiChip-icon': {
                  color: colors.primary.main
                }
              }}
            />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Home;
