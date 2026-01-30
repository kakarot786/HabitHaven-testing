import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress as MuiCircularProgress,
  Chip,
  Alert,
  Paper
} from '@mui/material';
import {
  Moon,
  Sun,
  Sunrise,
  Sunset,
  Stars,
  RefreshCw,
  Check,
  Circle,
  Flame,
  TrendingUp,
  Calendar,
  Target
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { prayerService } from '../services/prayerService';
import { CircularProgress, XPProgressBar } from './ui/ModernComponents';

const PrayerComponent = () => {
  const { user, token } = useAuth();
  const [prayers, setPrayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    todayCompleted: 0,
    totalToday: 0,
    streakCount: 0,
    weeklyPercentage: 0,
    monthlyPercentage: 0
  });

  // Prayer names with colors and icons
  const prayerConfig = {
    'Fajar': { color: '#6366f1', bgColor: '#eef2ff', icon: Sunrise, time: 'Dawn', emoji: '🌅' },
    'Dhuhr': { color: '#eab308', bgColor: '#fefce8', icon: Sun, time: 'Noon', emoji: '☀️' },
    'Asr': { color: '#f97316', bgColor: '#fff7ed', icon: Sun, time: 'Afternoon', emoji: '🌤️' },
    'Maghrib': { color: '#ec4899', bgColor: '#fdf2f8', icon: Sunset, time: 'Sunset', emoji: '🌅' },
    'Isha': { color: '#6366f1', bgColor: '#eef2ff', icon: Moon, time: 'Night', emoji: '🌙' },
    'Tahajjud': { color: '#8b5cf6', bgColor: '#f5f3ff', icon: Stars, time: 'Pre-Dawn', emoji: '⭐' }
  };

  const fetchPrayers = async () => {
    try {
      const result = await prayerService.getTodaysPrayers();
      
      if (result.success) {
        const prayersData = result.data || [];
        setPrayers(prayersData);
        calculateStats(prayersData);
        setError('');
      } else if (result.needsCreation) {
        await logTodaysPrayers();
      } else {
        setError(result.error);
        setPrayers([]);
      }
    } catch (error) {
      console.error('Error fetching prayers:', error);
      if (error.message && !error.message.includes('404') && !error.message.includes('Failed to fetch')) {
        setError('Failed to fetch prayers');
      }
      setPrayers([]);
    } finally {
      setLoading(false);
    }
  };

  const logTodaysPrayers = async () => {
    setLoading(true);
    try {
      const result = await prayerService.logPrayers();
      if (result.success) {
        const prayersData = result.data || [];
        setPrayers(prayersData);
        calculateStats(prayersData);
        setError('');
      } else {
        setError(result.error);
        setPrayers([]); // Set empty array on error
      }
    } catch (error) {
      console.error('Error creating prayers:', error);
      // Don't show error for 404 (backend not implemented) or network errors
      if (error.message && !error.message.includes('404') && !error.message.includes('Failed to fetch')) {
        setError('Failed to create today\'s prayers');
      }
      setPrayers([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const togglePrayerStatus = async (prayerId) => {
    try {
      // Validate prayer ID
      if (!prayerId) {
        setError('Prayer ID is missing');
        return;
      }

      const result = await prayerService.togglePrayerStatus(prayerId);
      if (result && result.success) {
        fetchPrayers(); // Refresh prayers and stats
        setError(''); // Clear any previous errors
      } else {
        setError(result?.error || 'Failed to toggle prayer status');
      }
    } catch (error) {
      console.error('Error toggling prayer status:', error);
      setError('Failed to toggle prayer status');
    }
  };

  const calculateStats = (prayersData) => {
    const safePrayersData = Array.isArray(prayersData) ? prayersData : [];
    
    const completed = safePrayersData.filter(p => p.isCompleted).length;
    const total = safePrayersData.length;
    const mandatoryPrayers = safePrayersData.filter(p => p.prayerName !== 'Tahajjud');
    const mandatoryCompleted = mandatoryPrayers.filter(p => p.isCompleted).length;

    setStats({
      todayCompleted: mandatoryCompleted,
      totalToday: mandatoryPrayers.length,
      streakCount: user?.streakCount || 0,
      weeklyPercentage: 85,
      monthlyPercentage: 78
    });
  };

  useEffect(() => {
    if (token && user) {
      fetchPrayers();
    }
  }, [token, user]);

 // In PrayerComponent and TaskComponent
if (loading) {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100%',
        minHeight: 400,
        width: '100%'
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <MuiCircularProgress sx={{ color: '#6366f1', mb: 2 }} />
        <Typography variant="h6" sx={{ color: '#475569', fontWeight: 600 }}>Loading Prayers...</Typography>
      </Box>
    </Box>
  );
}

  const completionPercentage = stats.totalToday > 0 ? Math.round((stats.todayCompleted / stats.totalToday) * 100) : 0;

  return (
    <Box sx={{ 
      animation: 'fadeIn 0.5s ease-out',
      '@keyframes fadeIn': {
        from: { opacity: 0, transform: 'translateY(20px)' },
        to: { opacity: 1, transform: 'translateY(0)' }
      }
    }}>
      
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 0.5, fontSize: { xs: '1.75rem', sm: '2rem' } }}>
              Prayer Tracker 🕌
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b' }}>
              Track your daily prayers and build a consistent spiritual routine
            </Typography>
          </Box>
          <Button
            onClick={fetchPrayers}
            startIcon={<RefreshCw size={18} />}
            variant="outlined"
            disabled={loading}
            sx={{ 
              borderColor: '#e2e8f0',
              color: '#475569',
              borderRadius: 3,
              px: 3,
              fontWeight: 600,
              transition: 'all 0.2s ease',
              '&:hover': { 
                borderColor: '#6366f1',
                backgroundColor: '#eef2ff',
                color: '#6366f1'
              }
            }}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </Box>
      </Box>

      
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3, 
            borderRadius: 3, 
            border: '1px solid #fecaca',
            '& .MuiAlert-icon': { color: '#dc2626' }
          }} 
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Main Prayer Progress Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            borderRadius: 4,
            overflow: 'hidden',
            position: 'relative',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: { xs: 'none', md: 'translateY(-4px)' },
              boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3)',
            }
          }}>
            {/* Decorative circles */}
            <Box sx={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
            }} />
            
            <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Moon size={20} color="rgba(255,255,255,0.8)" />
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>
                      Today's Progress
                    </Typography>
                  </Box>
                  <Typography variant="h2" sx={{ fontWeight: 800, color: 'white', mb: 1, fontSize: { xs: '2.5rem', sm: '3rem' } }}>
                    {stats.todayCompleted}<span style={{ fontSize: '1.5rem', opacity: 0.7 }}>/{stats.totalToday}</span>
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                    {stats.todayCompleted === stats.totalToday && stats.totalToday > 0 ? '🎉 All prayers completed!' : `${stats.totalToday - stats.todayCompleted} prayers remaining`}
                  </Typography>
                  
                  {/* Progress Bar */}
                  <Box sx={{ 
                    height: 8, 
                    borderRadius: 4, 
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    overflow: 'hidden'
                  }}>
                    <Box sx={{
                      height: '100%',
                      width: `${completionPercentage}%`,
                      borderRadius: 4,
                      background: 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)',
                      transition: 'width 0.8s ease-out',
                      boxShadow: '0 0 10px rgba(251, 191, 36, 0.5)',
                    }} />
                  </Box>
                </Box>
                
                <Box sx={{ display: { xs: 'none', sm: 'block' }, ml: 3 }}>
                  <CircularProgress 
                    value={completionPercentage} 
                    size={100} 
                    strokeWidth={8}
                    color="#fbbf24"
                    bgColor="rgba(255,255,255,0.2)"
                  >
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                      {completionPercentage}%
                    </Typography>
                  </CircularProgress>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Streak and Stats */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <Card sx={{ 
                backgroundColor: 'white',
                borderRadius: 4,
                border: '1px solid #e2e8f0',
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }
              }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Box sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2.5,
                      background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)',
                    }}>
                      <Flame size={20} color="white" />
                    </Box>
                    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>Streak</Typography>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#1e293b', fontSize: '2rem' }}>
                    {stats.streakCount}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    {stats.streakCount >= 7 ? '🔥 On fire!' : 'days'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid size={{ xs: 6 }}>
              <Card sx={{ 
                backgroundColor: 'white',
                borderRadius: 4,
                border: '1px solid #e2e8f0',
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }
              }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Box sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2.5,
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                    }}>
                      <TrendingUp size={20} color="white" />
                    </Box>
                    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>Weekly</Typography>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#1e293b', fontSize: '2rem' }}>
                    {stats.weeklyPercentage}%
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>completion</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Prayer Cards */}
      <Card sx={{ 
        backgroundColor: 'white',
        borderRadius: 4,
        border: '1px solid #e2e8f0',
      }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box sx={{ 
              p: 1, 
              borderRadius: 2, 
              backgroundColor: '#eef2ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Target size={18} color="#6366f1" />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
              Today's Prayers
            </Typography>
          </Box>
          
          <Grid container spacing={2}>
            {Array.isArray(prayers) && prayers.map((prayer) => {
              const config = prayerConfig[prayer.prayerName] || { 
                color: '#6b7280', 
                bgColor: '#f9fafb', 
                icon: Moon, 
                time: '', 
                emoji: '🕌' 
              };
              const isOptional = prayer.prayerName === 'Tahajjud';
              const IconComponent = config.icon;
              
              return (
                <Grid size={{ xs: 6, sm: 4, md: 2 }} key={prayer._id}>
                  <Paper
                    sx={{
                      p: 2.5,
                      borderRadius: 4,
                      border: `2px solid ${prayer.isCompleted ? config.color : '#e2e8f0'}`,
                      backgroundColor: prayer.isCompleted ? config.bgColor : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      textAlign: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: `0 12px 24px ${config.color}25`,
                        borderColor: config.color
                      },
                      '&:active': {
                        transform: 'scale(0.98)'
                      }
                    }}
                    onClick={() => togglePrayerStatus(prayer._id)}
                  >
                    {/* Completed checkmark */}
                    {prayer.isCompleted && (
                      <Box sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        backgroundColor: '#10b981',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        animation: 'scaleIn 0.3s ease-out',
                        '@keyframes scaleIn': {
                          from: { transform: 'scale(0)' },
                          to: { transform: 'scale(1)' }
                        }
                      }}>
                        <Check size={12} color="white" strokeWidth={3} />
                      </Box>
                    )}
                    
                    {/* Icon */}
                    <Box sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 3,
                      background: prayer.isCompleted 
                        ? `linear-gradient(135deg, ${config.color} 0%, ${config.color}dd 100%)` 
                        : config.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                      transition: 'all 0.3s ease',
                      boxShadow: prayer.isCompleted ? `0 8px 16px ${config.color}40` : 'none'
                    }}>
                      <IconComponent 
                        size={28} 
                        color={prayer.isCompleted ? 'white' : config.color}
                      />
                    </Box>
                    
                    <Typography variant="subtitle1" sx={{ 
                      fontWeight: 700, 
                      color: prayer.isCompleted ? config.color : '#1e293b',
                      mb: 0.5
                    }}>
                      {prayer.prayerName}
                    </Typography>
                    
                    <Typography variant="caption" sx={{ 
                      color: '#94a3b8',
                      display: 'block'
                    }}>
                      {config.time}
                    </Typography>
                    
                    {isOptional && (
                      <Chip 
                        label="Optional" 
                        size="small" 
                        sx={{ 
                          mt: 1,
                          height: 20,
                          fontSize: '0.65rem',
                          backgroundColor: '#f1f5f9',
                          color: '#64748b'
                        }} 
                      />
                    )}
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
          
          {(!prayers || prayers.length === 0) && (
            <Box sx={{ 
              textAlign: 'center', 
              py: 6,
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              borderRadius: 3,
            }}>
              <Box sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: '#e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2
              }}>
                <Moon size={28} color="#94a3b8" />
              </Box>
              <Typography variant="h6" sx={{ color: '#475569', fontWeight: 600, mb: 0.5 }}>
                No prayers logged yet
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                Prayers will be automatically created for today
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default PrayerComponent;
