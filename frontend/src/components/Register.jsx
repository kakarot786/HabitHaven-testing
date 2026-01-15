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
  Avatar,
  Grid
} from '@mui/material';
import {
  Mosque,
  Person,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  ArrowBack
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { colors, gradients, shadows, commonStyles } from '../styles';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const result = await register(formData.fullName, formData.username, formData.email, formData.password);
      if (result.success) {
        // Success! User will be automatically redirected to dashboard by App.jsx
        // No need to do anything here as the user state will update and App will redirect
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        background: gradients.background.primary,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
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
              color: colors.text.accent
            }}
          >
            <ArrowBack />
          </IconButton>

          <Box sx={{ textAlign: 'center', mb: 4, mt: 2 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 3,
                ...commonStyles.avatarGradient,
                boxShadow: '0 8px 24px rgba(20, 184, 166, 0.3)'
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
              Join HabitHaven
            </Typography>
            
            <Typography
              variant="h6"
              sx={{
                color: '#0c4a6e',
                fontWeight: 400
              }}
            >
              Begin your journey of spiritual growth
            </Typography>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  color: '#dc2626'
                }
              }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              name="fullName"
              label="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: '#bae6fd',
                    borderWidth: 2
                  },
                  '&:hover fieldset': {
                    borderColor: '#7dd3fc'
                  },
                  '&.Mui-focused fieldset': {
                    bordercolor: colors.text.accent
                  }
                },
                '& .MuiInputLabel-root': {
                  color: '#0c4a6e',
                  '&.Mui-focused': {
                    color: colors.text.accent
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: colors.text.accent }} />
                  </InputAdornment>
                )
              }}
            />

            <TextField
              fullWidth
              name="username"
              label="Username"
              value={formData.username}
              onChange={handleChange}
              required
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: '#bae6fd',
                    borderWidth: 2
                  },
                  '&:hover fieldset': {
                    borderColor: '#7dd3fc'
                  },
                  '&.Mui-focused fieldset': {
                    bordercolor: colors.text.accent
                  }
                },
                '& .MuiInputLabel-root': {
                  color: '#0c4a6e',
                  '&.Mui-focused': {
                    color: colors.text.accent
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: colors.text.accent }} />
                  </InputAdornment>
                )
              }}
            />

            <TextField
              fullWidth
              name="email"
              type="email"
              label="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: '#bae6fd',
                    borderWidth: 2
                  },
                  '&:hover fieldset': {
                    borderColor: '#7dd3fc'
                  },
                  '&.Mui-focused fieldset': {
                    bordercolor: colors.text.accent
                  }
                },
                '& .MuiInputLabel-root': {
                  color: '#0c4a6e',
                  '&.Mui-focused': {
                    color: colors.text.accent
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: colors.text.accent }} />
                  </InputAdornment>
                )
              }}
            />

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '& fieldset': {
                        borderColor: '#bae6fd',
                        borderWidth: 2
                      },
                      '&:hover fieldset': {
                        borderColor: '#7dd3fc'
                      },
                      '&.Mui-focused fieldset': {
                        bordercolor: colors.text.accent
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: '#0c4a6e',
                      '&.Mui-focused': {
                        color: colors.text.accent
                      }
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: colors.text.accent }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: colors.text.accent }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  label="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '& fieldset': {
                        borderColor: '#bae6fd',
                        borderWidth: 2
                      },
                      '&:hover fieldset': {
                        borderColor: '#7dd3fc'
                      },
                      '&.Mui-focused fieldset': {
                        bordercolor: colors.text.accent
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: '#0c4a6e',
                      '&.Mui-focused': {
                        color: colors.text.accent
                      }
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: colors.text.accent }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          sx={{ color: colors.text.accent }}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                backgroundcolor: colors.text.accent,
                color: 'white',
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 2,
                textTransform: 'none',
                mb: 3,
                boxShadow: '0 8px 24px rgba(15, 118, 110, 0.3)',
                '&:hover': {
                  backgroundColor: '#0369a1',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 32px rgba(15, 118, 110, 0.4)'
                },
                '&:disabled': {
                  backgroundColor: '#94a3b8',
                  transform: 'none'
                },
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <Divider sx={{ my: 3, color: '#0c4a6e' }}>or</Divider>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body1" sx={{ color: '#0c4a6e', mb: 2 }}>
                Already have an account?
              </Typography>
              
              <Button
                onClick={() => navigate('/login')}
                variant="outlined"
                fullWidth
                sx={{
                  bordercolor: colors.text.accent,
                  color: colors.text.accent,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: 'none',
                  borderWidth: 2,
                  '&:hover': {
                    borderColor: '#0369a1',
                    backgroundColor: 'rgba(15, 118, 110, 0.05)',
                    borderWidth: 2
                  }
                }}
              >
                Sign In
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
