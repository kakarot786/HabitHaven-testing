import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
  Avatar
} from '@mui/material';
import {
  Mosque,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  ArrowBack
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { colors, gradients, shadows, commonStyles } from '../styles';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <Box
      sx={{
        background: gradients.background.primary,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            ...commonStyles.frostedGlassCard,
            p: 6,
            position: 'relative'
          }}
        >
          
          <IconButton
            onClick={() => navigate('/')}
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              color: colors.primary.main
            }}
          >
            <ArrowBack />
          </IconButton>

          
          <Box sx={{ textAlign: 'center', mb: 4, mt: 2 }}>
            <Avatar
              sx={{
                ...commonStyles.avatarGradient,
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 3
              }}
            >
              <Mosque sx={{ fontSize: 40, color: 'white' }} />
            </Avatar>
            
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 'bold',
                color: colors.text.primary,
                mb: 1,
                fontFamily: 'Inter, sans-serif'
              }}
            >
              Welcome to HabitHaven
            </Typography>
            
            <Typography
              variant="h6"
              sx={{
                color: colors.text.accent,
                fontWeight: 400
              }}
            >
              Continue your spiritual journey
            </Typography>
          </Box>

          
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  color: colors.status.error.main
                }
              }}
            >
              {error}
            </Alert>
          )}

          
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              name="email"
              type="email"
              label="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              sx={{
                ...commonStyles.textField,
                mb: 3
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: colors.primary.main }} />
                  </InputAdornment>
                )
              }}
            />

            <TextField
              fullWidth
              name="password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              value={formData.password}
              onChange={handleChange}
              required
              sx={{
                ...commonStyles.textField,
                mb: 4
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: colors.primary.main }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: colors.primary.main }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                ...commonStyles.primaryButton,
                py: 1.5,
                fontSize: '1.1rem',
                mb: 3,
                '&:disabled': {
                  backgroundColor: '#94a3b8',
                  transform: 'none'
                }
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>

            <Divider sx={{ my: 3, color: colors.text.secondary }}>or</Divider>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body1" sx={{ color: colors.text.primary, mb: 2 }}>
                Don't have an account?
              </Typography>
              
              <Button
                onClick={() => navigate('/register')}
                variant="outlined"
                fullWidth
                sx={{
                  ...commonStyles.outlinedButton,
                  py: 1.5,
                  fontSize: '1rem'
                }}
              >
                Create Account
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;