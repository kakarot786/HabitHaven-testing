import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  CircularProgress as MuiCircularProgress,
  LinearProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Mosque } from '@mui/icons-material';
// Lucide icons for modern look
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  Trophy,
  Settings,
  LogOut,
  Menu,
  Plus,
  Bell,
  Flame,
  Target,
  Zap,
  Star,
  TrendingUp,
  Calendar,
  Sparkles,
  Moon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PrayerComponent from './PrayerComponent';
import TaskComponent from './TaskComponent';
import GroupComponent from './GroupComponent';
import ChallengeComponent from './ChallengeComponent';
import { colors, gradients, shadows, commonStyles } from '../styles';
import { CircularProgress, StreakFire, XPProgressBar } from './ui/ModernComponents';
import { prayerService } from '../services/prayerService';
import { taskService } from '../services/taskService';

const Dashboard = () => {
  const { user, logout, token, isFirstLogin, clearFirstLogin } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [prayers, setPrayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', date: '' });

  const API_BASE = '/api/v1'; //'http://localhost:5000/api/v1'
  const drawerWidth = 280;

  const fetchTasks = async () => {
    try {
      const result = await taskService.getAllTasks();
      if (result.success) {
        setTasks(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchPrayers = async () => {
    try {
      const result = await prayerService.getTodaysPrayers();
      if (result.success) {
        setPrayers(result.data || []);
      } else if (result.needsCreation) {
        await logTodaysPrayers();
      }
    } catch (error) {
      console.error('Error fetching prayers:', error);
    }
  };

  const logTodaysPrayers = async () => {
    try {
      const result = await prayerService.logPrayers();
      if (result.success) {
        setPrayers(result.data || []);
      }
    } catch (error) {
      console.error('Error creating prayers:', error);
    }
  };

  const markPrayerComplete = async (prayerId) => {
    try {
      const response = await fetch(`${API_BASE}/prayer/${prayerId}/compelete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        fetchPrayers(); // Refresh prayers
      }
    } catch (error) {
      console.error('Error marking prayer complete:', error);
    }
  };

  const createTask = async () => {
    try {
      const response = await fetch(`${API_BASE}/task/createTask`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTask)
      });
      if (response.ok) {
        setNewTask({ title: '', description: '', date: '' });
        setOpenTaskDialog(false);
        fetchTasks();
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const toggleTaskComplete = async (taskId, isCompleted) => {
    try {
      await fetch(`${API_BASE}/task/complete/${taskId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isCompleted: !isCompleted })
      });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  useEffect(() => {
    if (token && user) {
      const loadData = async () => {
        setLoading(true);
        await Promise.all([fetchTasks(), fetchPrayers()]);
        setLoading(false);
      };
      loadData();
    }
  }, [token, user]);

  // Function to render active tab content
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'tasks':
        return <TaskComponent />;
      case 'prayers':
        return <PrayerComponent />;
      case 'groups':
        return <GroupComponent />;
      case 'challenges':
        return <ChallengeComponent />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <OverviewTab />;
    }
  };

  // Overview Tab Component
  const OverviewTab = () => {
    const safePrayers = Array.isArray(prayers) ? prayers : [];
    const safeTasks = Array.isArray(tasks) ? tasks : [];
    const completedPrayers = safePrayers.filter(p => p.isCompleted).length;
    const totalPrayers = safePrayers.length;
    const mandatoryPrayers = safePrayers.filter(p => p.prayerName !== 'Tahajjud');
    const completedMandatory = mandatoryPrayers.filter(p => p.isCompleted).length;
    const totalTasks = safeTasks.length;
    const completedTasks = safeTasks.filter(t => t.isCompleted).length;
    const prayerPercentage = mandatoryPrayers.length > 0 ? Math.round((completedMandatory / mandatoryPrayers.length) * 100) : 0;

    // Clear first login flag after showing welcome message
    useEffect(() => {
      if (isFirstLogin) {
        const timer = setTimeout(() => clearFirstLogin(), 5000);
        return () => clearTimeout(timer);
      }
    }, [isFirstLogin]);

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
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start', 
            mb: 2, 
            flexWrap: 'wrap', 
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' },
          }}>
            <Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 800, 
                  background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
                  mb: 0.5
                }}
              >
                {isFirstLogin ? `Welcome, ${user?.fullName?.split(' ')[0] || user?.username}! 👋` : `Welcome back, ${user?.fullName?.split(' ')[0] || user?.username}! ✨`}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#64748b',
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                Here's your spiritual journey overview for today
              </Typography>
            </Box>
            
            {/* Streak Badge */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5,
              backgroundColor: user?.streakCount > 0 ? '#fef3c7' : '#f1f5f9',
              padding: '8px 16px',
              borderRadius: 3,
              border: user?.streakCount > 0 ? '1px solid #fde68a' : '1px solid #e2e8f0',
            }}>
              <Flame 
                size={24} 
                color={user?.streakCount > 0 ? '#f97316' : '#94a3b8'}
                fill={user?.streakCount > 0 ? '#fdba74' : 'transparent'}
              />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b', lineHeight: 1 }}>
                  {user?.streakCount || 0} Day Streak
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  {user?.streakCount >= 7 ? '🔥 On fire!' : 'Keep going!'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Main Stats Grid */}
        <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 4 }}>
          
          {/* Prayer Progress Card - Featured */}
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
              <Box sx={{
                position: 'absolute',
                bottom: -30,
                left: -30,
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)',
              }} />
              
              <CardContent sx={{ p: { xs: 2.5, sm: 3 }, position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Moon size={20} color="rgba(255,255,255,0.8)" />
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>
                        Today's Prayers
                      </Typography>
                    </Box>
                    <Typography variant="h2" sx={{ fontWeight: 800, color: 'white', mb: 1, fontSize: { xs: '2.5rem', sm: '3rem' } }}>
                      {completedMandatory}<span style={{ fontSize: '1.5rem', opacity: 0.7 }}>/{mandatoryPrayers.length}</span>
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                      {completedMandatory === mandatoryPrayers.length ? '🎉 All prayers completed!' : `${mandatoryPrayers.length - completedMandatory} prayers remaining`}
                    </Typography>
                    
                    {/* Modern Progress Bar */}
                    <Box sx={{ 
                      height: 8, 
                      borderRadius: 4, 
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      overflow: 'hidden'
                    }}>
                      <Box sx={{
                        height: '100%',
                        width: `${prayerPercentage}%`,
                        borderRadius: 4,
                        background: 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)',
                        transition: 'width 0.8s ease-out',
                        boxShadow: '0 0 10px rgba(251, 191, 36, 0.5)',
                      }} />
                    </Box>
                  </Box>
                  
                  {/* Circular Progress */}
                  <Box sx={{ display: { xs: 'none', sm: 'block' }, ml: 3 }}>
                    <CircularProgress 
                      value={prayerPercentage} 
                      size={100} 
                      strokeWidth={8}
                      color="#fbbf24"
                      bgColor="rgba(255,255,255,0.2)"
                    >
                      <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                        {prayerPercentage}%
                      </Typography>
                    </CircularProgress>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Side Stats */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Grid container spacing={2}>
              {/* Tasks Card */}
              <Grid size={{ xs: 6 }}>
                <Card sx={{ 
                  backgroundColor: 'white',
                  borderRadius: 4,
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: { xs: 'none', md: 'translateY(-4px)' },
                    boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                  }
                }}>
                  <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2.5,
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                      }}>
                        <CheckSquare size={20} color="white" />
                      </Box>
                      <Chip 
                        label={`${completedTasks} done`}
                        size="small"
                        sx={{ 
                          backgroundColor: '#dbeafe',
                          color: '#2563eb',
                          fontWeight: 600,
                          fontSize: '0.7rem',
                        }}
                      />
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5, fontSize: { xs: '1.75rem', sm: '2rem' } }}>
                      {totalTasks}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                      Total Tasks
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Level Card */}
              <Grid size={{ xs: 6 }}>
                <Card sx={{ 
                  backgroundColor: 'white',
                  borderRadius: 4,
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: { xs: 'none', md: 'translateY(-4px)' },
                    boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                  }
                }}>
                  <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2.5,
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                      }}>
                        <Sparkles size={20} color="white" />
                      </Box>
                      <Chip 
                        label={`${user?.xp || 0} XP`}
                        size="small"
                        sx={{ 
                          backgroundColor: '#ede9fe',
                          color: '#7c3aed',
                          fontWeight: 600,
                          fontSize: '0.7rem',
                        }}
                      />
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5, fontSize: { xs: '1.75rem', sm: '2rem' } }}>
                      {user?.level || 1}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                      Current Level
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* XP Progress */}
              <Grid size={{ xs: 12 }}>
                <Card sx={{ 
                  backgroundColor: 'white',
                  borderRadius: 4,
                  border: '1px solid #e2e8f0',
                }}>
                  <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                    <XPProgressBar current={user?.xp || 0} max={100} level={user?.level || 1} />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Recent Activity Card */}
        <Card sx={{ 
          backgroundColor: 'white',
          borderRadius: 4,
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Box sx={{ 
                p: 1, 
                borderRadius: 2, 
                backgroundColor: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <TrendingUp size={18} color="#64748b" />
              </Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700, 
                  color: '#1e293b',
                  fontSize: { xs: '1rem', sm: '1.1rem' }
                }}
              >
                Recent Activity
              </Typography>
            </Box>
            <Grid container spacing={2}>
              {safePrayers.filter(p => p.isCompleted).slice(-3).map((prayer) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={prayer._id}>
                  <Paper sx={{ 
                    p: 2, 
                    background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                    border: '1px solid #a7f3d0',
                    borderRadius: 3,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      boxShadow: '0 10px 25px rgba(16, 185, 129, 0.15)',
                      transform: 'translateY(-2px)',
                    }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 2,
                        backgroundColor: '#10b981',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Moon size={18} color="white" />
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#065f46' }}>
                          {prayer.prayerName} completed
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#047857' }}>
                          Today
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}

              {safeTasks.filter(t => t.isCompleted).slice(-2).map((task) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={task._id}>
                  <Paper sx={{ 
                    p: 2, 
                    background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                    border: '1px solid #93c5fd',
                    borderRadius: 3,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      boxShadow: '0 10px 25px rgba(59, 130, 246, 0.15)',
                      transform: 'translateY(-2px)',
                    }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 2,
                        backgroundColor: '#3b82f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <CheckSquare size={18} color="white" />
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e40af' }}>
                          {task.title} completed
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#2563eb' }}>
                          {new Date(task.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {safePrayers.filter(p => p.isCompleted).length === 0 && safeTasks.filter(t => t.isCompleted).length === 0 && (
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
                  <Calendar size={28} color="#94a3b8" />
                </Box>
                <Typography variant="h6" sx={{ color: '#475569', fontWeight: 600, mb: 0.5 }}>
                  No recent activity yet
                </Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                  Complete some prayers or tasks to see them here!
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    );
  };

  // Settings Tab Component
  const SettingsTab = () => {
    return (
      <Box sx={{ 
        animation: 'fadeIn 0.5s ease-out',
        '@keyframes fadeIn': {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' }
        }
      }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 800, color: '#1e293b' }}>
          Settings
        </Typography>
        <Card sx={{ 
          backgroundColor: 'white',
          borderRadius: 4,
          border: '1px solid #e2e8f0',
          p: 4, 
          textAlign: 'center' 
        }}>
          <Box sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3
          }}>
            <Settings size={36} color="#64748b" />
          </Box>
          <Typography variant="h6" sx={{ color: '#475569', fontWeight: 600, mb: 0.5 }}>
            Coming Soon
          </Typography>
          <Typography variant="body1" sx={{ color: '#94a3b8' }}>
            Settings panel is under development...
          </Typography>
        </Card>
      </Box>
    );
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare size={20} /> },
    { id: 'prayers', label: 'Prayers', icon: <Moon size={20} /> },
    { id: 'groups', label: 'Groups', icon: <Users size={20} /> },
    { id: 'challenges', label: 'Challenges', icon: <Trophy size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'white' }}>
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
            boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)',
          }}
        >
          <Mosque sx={{ fontSize: 28, color: 'white' }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b' }}>
          Habit<span style={{ color: '#6366f1' }}>Haven</span>
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
          Welcome, {user?.username}!
        </Typography>
      </Box>
      
      <Divider sx={{ borderColor: '#f1f5f9' }} />
      
      <List sx={{ px: 2, py: 2, flex: 1 }}>
        {menuItems.map((item) => (
          <ListItem
            component="button"
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              if (isMobile) setMobileOpen(false);
            }}
            sx={{
              borderRadius: 3,
              mb: 0.5,
              py: 1.5,
              backgroundColor: activeTab === item.id ? '#eef2ff' : 'transparent',
              border: activeTab === item.id ? 'none' : '2px solid transparent',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: activeTab === item.id ? '#e0e7ff' : '#f8fafc',
                transform: 'translateX(4px)',
              }
            }}
          >
            <ListItemIcon sx={{ 
              color: activeTab === item.id ? '#6366f1' : '#94a3b8', 
              minWidth: 40,
              transition: 'color 0.2s ease'
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.label}
              sx={{ 
                '& .MuiListItemText-primary': {
                  color: activeTab === item.id ? '#4f46e5' : '#475569',
                  fontWeight: activeTab === item.id ? 600 : 500,
                  fontSize: '0.9rem'
                }
              }}
            />
            {activeTab === item.id && (
              <Box sx={{
                width: 4,
                height: 24,
                borderRadius: 2,
                backgroundColor: '#6366f1',
                ml: 1
              }} />
            )}
          </ListItem>
        ))}
      </List>
      
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          startIcon={<LogOut size={18} />}
          onClick={logout}
          variant="outlined"
          sx={{
            borderColor: '#fecaca',
            backgroundColor: '#fef2f2',
            color: '#dc2626',
            borderWidth: 1,
            borderRadius: 3,
            py: 1.5,
            fontWeight: 600,
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: '#dc2626',
              backgroundColor: 'rgba(239, 68, 68, 0.05)',
              borderWidth: 2
            }
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #f8fafc 100%)'
      }}
    >
      {isMobile && (
        <AppBar 
          position="fixed" 
          sx={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            color: '#1e293b',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            borderBottom: '1px solid #e2e8f0'
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              onClick={() => setMobileOpen(true)}
              sx={{ mr: 2, color: '#6366f1' }}
            >
              <Menu size={24} />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 800, color: '#1e293b' }}>
              Habit<span style={{ color: '#6366f1' }}>Haven</span>
            </Typography>
            <IconButton sx={{ color: '#64748b' }}>
              <Bell size={22} />
            </IconButton>
          </Toolbar>
        </AppBar>
      )}

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: 'white',
              borderRight: '1px solid #e2e8f0'
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: isMobile ? 8 : 0
        }}
      >
        {renderActiveTab()}
      </Box>
    </Box>
  );
};

export default Dashboard;
