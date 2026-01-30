import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  CircularProgress as MuiCircularProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Chip,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Tabs,
  Tab,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  Trophy,
  Plus,
  RefreshCw,
  TrendingUp,
  Calendar,
  Users,
  CheckCircle,
  Play,
  Target,
  X,
  Clock,
  User,
  Award,
  Flame,
  Star,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { challengeService } from '../services/challengeService';

// Custom circular progress component
const CircularProgress = ({ value, size = 80, strokeWidth = 8, color = '#6366f1', bgColor = '#e2e8f0', children }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;
  
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
        />
      </svg>
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {children}
      </Box>
    </Box>
  );
};

const ChallengeComponent = () => {
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [myChallenges, setMyChallenges] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [challengeDetails, setChallengeDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  
  // Dialog states
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal: '',
    totalDays: '',
    isGroup: true
  });

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    inProgress: 0
  });

  // Fetch user's challenges
  const fetchMyChallenges = async () => {
    setLoading(true);
    try {
      const result = await challengeService.getMyChallenges();
      if (result.success) {
        const challenges = result.data?.data || result.data || [];
        setMyChallenges(challenges);
        calculateStats(challenges);
        setError('');
      } else {
        setError(result.error);
        setMyChallenges([]);
      }
    } catch (error) {
      console.error('Error fetching challenges:', error);
      setError('Failed to fetch challenges');
      setMyChallenges([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = (challenges) => {
    const total = challenges.length;
    const completed = challenges.filter(c => c.completed).length;
    const active = challenges.filter(c => !c.completed && c.challengeId?.status === 'active').length;
    const inProgress = challenges.filter(c => !c.completed && c.progress > 0).length;

    setStats({ total, active, completed, inProgress });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Create new challenge
  const handleCreateChallenge = async () => {
    if (!formData.title.trim() || !formData.description.trim() || !formData.goal.trim() || !formData.totalDays) {
      setError('All fields are required');
      return;
    }

    const days = parseInt(formData.totalDays);
    if (isNaN(days) || days < 1) {
      setError('Total days must be a positive number');
      return;
    }

    setCreateLoading(true);
    setError('');
    try {
      const result = await challengeService.createChallenge({
        ...formData,
        totalDays: days
      });
      
      if (result.success) {
        setOpenCreateDialog(false);
        setFormData({ title: '', description: '', goal: '', totalDays: '', isGroup: true });
        await fetchMyChallenges();
      } else {
        setError(result.error || 'Failed to create challenge');
      }
    } catch (error) {
      console.error('Error creating challenge:', error);
      setError(error.message || 'Failed to create challenge');
    } finally {
      setCreateLoading(false);
    }
  };

  // Update challenge progress
  const handleUpdateProgress = async (challengeId) => {
    try {
      const result = await challengeService.updateProgress(challengeId);
      if (result.success) {
        await fetchMyChallenges();
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      setError('Failed to update progress');
    }
  };

  // View challenge details
  const handleViewDetails = async (challenge) => {
    setSelectedChallenge(challenge);
    setOpenDetailsDialog(true);
    setDetailsLoading(true);
    
    try {
      const result = await challengeService.getChallengeDetails(challenge.challengeId._id);
      if (result.success) {
        setChallengeDetails(result.data?.data || result.data?.message || result.data);
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Error fetching details:', error);
      setError('Failed to load challenge details');
    } finally {
      setDetailsLoading(false);
    }
  };

  // Calculate progress percentage
  const getProgressPercentage = (progress, totalDays) => {
    return Math.min(Math.round((progress / totalDays) * 100), 100);
  };

  useEffect(() => {
    if (token && user) {
      fetchMyChallenges();
    }
  }, [token, user]);

  // Filter challenges by tab
  const getFilteredChallenges = () => {
    switch (activeTab) {
      case 1: return myChallenges.filter(c => c.challengeId?.status === 'active' && !c.completed);
      case 2: return myChallenges.filter(c => c.completed);
      default: return myChallenges;
    }
  };

  if (loading && myChallenges.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400, width: '100%' }}>
        <Box sx={{ textAlign: 'center' }}>
          <MuiCircularProgress sx={{ color: '#f59e0b', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#475569', fontWeight: 600 }}>Loading Challenges...</Typography>
        </Box>
      </Box>
    );
  }

  const completionPercentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const filteredChallenges = getFilteredChallenges();

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
              Challenges 🏆
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b' }}>
              Set goals, track progress, and achieve greatness with daily challenges
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              onClick={fetchMyChallenges}
              startIcon={<RefreshCw size={18} />}
              variant="outlined"
              disabled={loading}
              sx={{ 
                borderColor: '#e2e8f0',
                color: '#475569',
                borderRadius: 3,
                px: 3,
                fontWeight: 600,
                '&:hover': { 
                  borderColor: '#f59e0b',
                  backgroundColor: '#fffbeb',
                  color: '#f59e0b'
                }
              }}
            >
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
            <Button
              onClick={() => setOpenCreateDialog(true)}
              startIcon={<Plus size={18} />}
              variant="contained"
              sx={{ 
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                borderRadius: 3,
                px: 3,
                fontWeight: 600,
                boxShadow: '0 4px 14px rgba(245, 158, 11, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                  boxShadow: '0 6px 20px rgba(245, 158, 11, 0.5)',
                }
              }}
            >
              New Challenge
            </Button>
          </Box>
        </Box>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3, borderRadius: 3, border: '1px solid #fecaca' }} 
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Main Challenge Progress Card */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            borderRadius: 4,
            overflow: 'hidden',
            position: 'relative',
            height: '100%',
            minHeight: 200,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: { xs: 'none', md: 'translateY(-4px)' },
              boxShadow: '0 20px 40px rgba(245, 158, 11, 0.3)',
            }
          }}>
            <Box sx={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
            }} />
            
            <CardContent sx={{ p: 3, position: 'relative', zIndex: 1, height: '100%', display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Trophy size={20} color="rgba(255,255,255,0.8)" />
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>
                      Challenge Progress
                    </Typography>
                  </Box>
                  <Typography variant="h2" sx={{ fontWeight: 800, color: 'white', mb: 1, fontSize: { xs: '2.5rem', sm: '3rem' } }}>
                    {stats.completed}<span style={{ fontSize: '1.5rem', opacity: 0.7 }}>/{stats.total}</span>
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                    {stats.completed === stats.total && stats.total > 0 ? '🎉 All challenges completed!' : `${stats.active} active challenges`}
                  </Typography>
                  
                  <Box sx={{ height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.2)', overflow: 'hidden' }}>
                    <Box sx={{
                      height: '100%',
                      width: `${completionPercentage}%`,
                      borderRadius: 4,
                      background: 'linear-gradient(90deg, #ffffff 0%, #fef3c7 100%)',
                      transition: 'width 0.8s ease-out',
                      boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
                    }} />
                  </Box>
                </Box>
                
                <Box sx={{ display: { xs: 'none', sm: 'block' }, ml: 3 }}>
                  <CircularProgress 
                    value={completionPercentage} 
                    size={100} 
                    strokeWidth={8}
                    color="#ffffff"
                    bgColor="rgba(255,255,255,0.2)"
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', lineHeight: 1 }}>
                        {completionPercentage}%
                      </Typography>
                    </Box>
                  </CircularProgress>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Side Stats */}
        <Grid item xs={12} lg={6}>
          <Grid container spacing={2} sx={{ height: '100%' }}>
            <Grid item xs={6} sm={6}>
              <Card sx={{ 
                height: '100%',
                minHeight: 90,
                background: 'white',
                borderRadius: 3,
                border: '1px solid #e2e8f0',
                transition: 'all 0.2s ease',
                '&:hover': { borderColor: '#22c55e', boxShadow: '0 4px 12px rgba(34, 197, 94, 0.15)' }
              }}>
                <CardContent sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ 
                      width: 44, height: 44, borderRadius: 2, 
                      background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Zap size={22} color="white" />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: '#22c55e', lineHeight: 1, fontSize: { xs: '1.5rem', sm: '1.75rem' } }}>
                        {stats.active}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>Active</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={6}>
              <Card sx={{ 
                height: '100%',
                minHeight: 90,
                background: 'white',
                borderRadius: 3,
                border: '1px solid #e2e8f0',
                transition: 'all 0.2s ease',
                '&:hover': { borderColor: '#8b5cf6', boxShadow: '0 4px 12px rgba(139, 92, 246, 0.15)' }
              }}>
                <CardContent sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ 
                      width: 44, height: 44, borderRadius: 2, 
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <TrendingUp size={22} color="white" />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: '#8b5cf6', lineHeight: 1, fontSize: { xs: '1.5rem', sm: '1.75rem' } }}>
                        {stats.inProgress}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>In Progress</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={6}>
              <Card sx={{ 
                height: '100%',
                minHeight: 90,
                background: 'white',
                borderRadius: 3,
                border: '1px solid #e2e8f0',
                transition: 'all 0.2s ease',
                '&:hover': { borderColor: '#06b6d4', boxShadow: '0 4px 12px rgba(6, 182, 212, 0.15)' }
              }}>
                <CardContent sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ 
                      width: 44, height: 44, borderRadius: 2, 
                      background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Trophy size={22} color="white" />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: '#06b6d4', lineHeight: 1, fontSize: { xs: '1.5rem', sm: '1.75rem' } }}>
                        {stats.total}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>Total</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={6}>
              <Card sx={{ 
                height: '100%',
                minHeight: 90,
                background: 'white',
                borderRadius: 3,
                border: '1px solid #e2e8f0',
                transition: 'all 0.2s ease',
                '&:hover': { borderColor: '#f59e0b', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15)' }
              }}>
                <CardContent sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ 
                      width: 44, height: 44, borderRadius: 2, 
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Award size={22} color="white" />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: '#f59e0b', lineHeight: 1, fontSize: { xs: '1.5rem', sm: '1.75rem' } }}>
                        {stats.completed}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>Completed</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3, borderRadius: 3, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, v) => setActiveTab(v)}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              minHeight: 56,
            },
            '& .Mui-selected': {
              color: '#f59e0b !important',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#f59e0b',
              height: 3,
            }
          }}
        >
          <Tab label={`All Challenges (${myChallenges.length})`} icon={<Trophy size={18} />} iconPosition="start" />
          <Tab label={`Active (${stats.active})`} icon={<Zap size={18} />} iconPosition="start" />
          <Tab label={`Completed (${stats.completed})`} icon={<CheckCircle size={18} />} iconPosition="start" />
        </Tabs>
      </Paper>

      {/* Challenges List */}
      <Grid container spacing={3}>
        {filteredChallenges.length === 0 ? (
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ 
              p: 6, 
              textAlign: 'center', 
              borderRadius: 4, 
              border: '2px dashed #e2e8f0',
              background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)'
            }}>
              <Box sx={{ 
                width: 80, height: 80, borderRadius: '50%', 
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                mx: 'auto', mb: 3
              }}>
                <Trophy size={40} color="white" />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                {activeTab === 0 ? 'No challenges yet' : activeTab === 1 ? 'No active challenges' : 'No completed challenges'}
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b', mb: 3 }}>
                Create your first challenge to start your journey to greatness!
              </Typography>
              <Button
                variant="contained"
                onClick={() => setOpenCreateDialog(true)}
                startIcon={<Plus size={18} />}
                sx={{ 
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                }}
              >
                Create Challenge
              </Button>
            </Paper>
          </Grid>
        ) : (
          filteredChallenges.map((challenge) => {
            const progressPercentage = getProgressPercentage(
              challenge.progress,
              challenge.challengeId?.totalDays || 1
            );
            const isCompleted = challenge.completed;
            const isActive = challenge.challengeId?.status === 'active';

            return (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={challenge._id}>
                <Card sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: isCompleted ? '#22c55e' : isActive ? '#f59e0b' : '#e2e8f0',
                  background: isCompleted ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' : 'white',
                  transition: 'all 0.3s ease',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: isCompleted 
                      ? '0 12px 24px rgba(34, 197, 94, 0.2)' 
                      : '0 12px 24px rgba(245, 158, 11, 0.2)'
                  }
                }}>
                  {/* Progress bar at top */}
                  <Box sx={{ height: 4, background: '#e2e8f0' }}>
                    <Box sx={{ 
                      height: '100%', 
                      width: `${progressPercentage}%`,
                      background: isCompleted 
                        ? 'linear-gradient(90deg, #22c55e, #16a34a)' 
                        : 'linear-gradient(90deg, #f59e0b, #d97706)',
                      transition: 'width 0.5s ease'
                    }} />
                  </Box>

                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5, lineHeight: 1.3 }}>
                          {challenge.challengeId?.title || 'Untitled Challenge'}
                        </Typography>
                        <Chip
                          label={isCompleted ? 'Completed' : isActive ? 'Active' : 'Expired'}
                          size="small"
                          sx={{ 
                            fontWeight: 600,
                            fontSize: '0.7rem',
                            backgroundColor: isCompleted ? '#dcfce7' : isActive ? '#fef3c7' : '#f1f5f9',
                            color: isCompleted ? '#16a34a' : isActive ? '#d97706' : '#64748b',
                          }}
                        />
                      </Box>
                      <Box sx={{ 
                        width: 48, height: 48, borderRadius: 2, 
                        background: isCompleted 
                          ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
                          : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: isCompleted 
                          ? '0 4px 12px rgba(34, 197, 94, 0.3)'
                          : '0 4px 12px rgba(245, 158, 11, 0.3)'
                      }}>
                        {isCompleted ? <CheckCircle size={24} color="white" /> : <Trophy size={24} color="white" />}
                      </Box>
                    </Box>

                    <Typography variant="body2" sx={{ color: '#64748b', mb: 3, minHeight: 40, lineHeight: 1.5 }}>
                      {challenge.challengeId?.description || 'No description'}
                    </Typography>

                    {/* Progress */}
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#475569' }}>
                          Day {challenge.currentDay} of {challenge.challengeId?.totalDays || 0}
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: isCompleted ? '#16a34a' : '#f59e0b' }}>
                          {progressPercentage}%
                        </Typography>
                      </Box>
                      <Box sx={{ height: 8, borderRadius: 4, backgroundColor: '#f1f5f9', overflow: 'hidden' }}>
                        <Box sx={{
                          height: '100%',
                          width: `${progressPercentage}%`,
                          borderRadius: 4,
                          background: isCompleted 
                            ? 'linear-gradient(90deg, #22c55e, #16a34a)'
                            : 'linear-gradient(90deg, #f59e0b, #d97706)',
                          transition: 'width 0.5s ease'
                        }} />
                      </Box>
                    </Box>

                    {/* Info */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Target size={14} color="#64748b" />
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                          {challenge.challengeId?.goal || 'No goal'}
                        </Typography>
                      </Box>
                      {challenge.challengeId?.isGroup && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Users size={14} color="#64748b" />
                          <Typography variant="caption" sx={{ color: '#64748b' }}>Group</Typography>
                        </Box>
                      )}
                    </Box>
                  </CardContent>

                  <Divider />

                  <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleViewDetails(challenge)}
                      fullWidth
                      sx={{ 
                        borderRadius: 2, 
                        borderColor: '#e2e8f0', 
                        color: '#475569',
                        fontWeight: 600,
                        '&:hover': { borderColor: '#f59e0b', color: '#f59e0b', backgroundColor: '#fffbeb' }
                      }}
                    >
                      View Details
                    </Button>
                    {!isCompleted && isActive && (
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleUpdateProgress(challenge.challengeId._id)}
                        fullWidth
                        sx={{ 
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                          fontWeight: 600,
                          '&:hover': { background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)' }
                        }}
                      >
                        Complete Day
                      </Button>
                    )}
                  </Box>
                </Card>
              </Grid>
            );
          })
        )}
      </Grid>

      {/* Create Challenge Dialog */}
      <Dialog 
        open={openCreateDialog} 
        onClose={() => setOpenCreateDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ 
                width: 48, height: 48, borderRadius: 2, 
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Trophy size={24} color="white" />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Create New Challenge</Typography>
            </Box>
            <IconButton onClick={() => setOpenCreateDialog(false)} size="small">
              <X size={20} />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            name="title"
            label="Challenge Title"
            fullWidth
            variant="outlined"
            value={formData.title}
            onChange={handleInputChange}
            helperText={`${formData.title.length}/100 characters`}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          <TextField
            name="description"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={formData.description}
            onChange={handleInputChange}
            helperText={`${formData.description.length}/500 characters`}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          <TextField
            name="goal"
            label="Goal"
            fullWidth
            variant="outlined"
            value={formData.goal}
            onChange={handleInputChange}
            placeholder="e.g., Complete 5 prayers daily"
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          <TextField
            name="totalDays"
            label="Total Days"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.totalDays}
            onChange={handleInputChange}
            inputProps={{ min: 1 }}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.isGroup}
                onChange={handleInputChange}
                name="isGroup"
                sx={{ 
                  '& .MuiSwitch-switchBase.Mui-checked': { color: '#f59e0b' },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#f59e0b' }
                }}
              />
            }
            label="Group Challenge (others can join)"
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => setOpenCreateDialog(false)}
            sx={{ borderRadius: 2, color: '#64748b' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateChallenge} 
            variant="contained" 
            disabled={createLoading || !formData.title.trim()}
            sx={{ 
              borderRadius: 2,
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              px: 4,
              '&:hover': { background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)' }
            }}
          >
            {createLoading ? 'Creating...' : 'Create Challenge'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Challenge Details Dialog */}
      <Dialog
        open={openDetailsDialog}
        onClose={() => setOpenDetailsDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Challenge Details</Typography>
            <IconButton onClick={() => setOpenDetailsDialog(false)} size="small">
              <X size={20} />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {detailsLoading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <MuiCircularProgress sx={{ color: '#f59e0b' }} />
            </Box>
          ) : challengeDetails ? (
            <Box>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, color: '#1e293b' }}>
                {challengeDetails.challenge?.title}
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b', mb: 3 }}>
                {challengeDetails.challenge?.description}
              </Typography>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 6 }}>
                  <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3, background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)' }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: '#f59e0b' }}>
                      {challengeDetails.challenge?.totalDays}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                      Total Days
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3, background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: '#22c55e' }}>
                      {challengeDetails.participants?.length || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                      Participants
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                Participants
              </Typography>
              <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                {challengeDetails.participants?.length > 0 ? (
                  challengeDetails.participants.map((participant) => (
                    <ListItem key={participant._id} sx={{ borderRadius: 2, mb: 1, backgroundColor: '#f8fafc' }}>
                      <ListItemAvatar>
                        <Avatar sx={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                          <User size={20} />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={participant.userId?.fullName || participant.userId?.username || 'User'}
                        secondary={`Day ${participant.currentDay} - ${participant.completed ? 'Completed' : 'In Progress'}`}
                      />
                      <Chip
                        label={`${getProgressPercentage(participant.progress, challengeDetails.challenge?.totalDays)}%`}
                        size="small"
                        sx={{ 
                          fontWeight: 600,
                          backgroundColor: participant.completed ? '#dcfce7' : '#fef3c7',
                          color: participant.completed ? '#16a34a' : '#d97706'
                        }}
                      />
                    </ListItem>
                  ))
                ) : (
                  <Typography variant="body2" sx={{ color: '#64748b', textAlign: 'center', py: 2 }}>
                    No participants yet
                  </Typography>
                )}
              </List>
            </Box>
          ) : (
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              No details available
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => setOpenDetailsDialog(false)}
            variant="outlined"
            sx={{ borderRadius: 2, borderColor: '#e2e8f0', color: '#475569' }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChallengeComponent;
