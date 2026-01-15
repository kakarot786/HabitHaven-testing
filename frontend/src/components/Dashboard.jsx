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
  CircularProgress,
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
import {
  Dashboard as DashboardIcon,
  Task as TaskIcon,
  Groups as GroupsIcon,
  EmojiEvents as ChallengesIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Add as AddIcon,
  CheckCircle,
  RadioButtonUnchecked,
  Star,
  TrendingUp,
  CalendarToday,
  Notifications,
  Mosque
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import PrayerComponent from './PrayerComponent';
import TaskComponent from './TaskComponent';
import GroupComponent from './GroupComponent';
import ChallengeComponent from './ChallengeComponent';
import { colors, gradients, shadows, commonStyles } from '../styles';

const Dashboard = () => {
  const { user, logout, token } = useAuth();
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
      const response = await fetch(`${API_BASE}/task/allTask`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      if (response.ok) {
  setTasks(result.message || []);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchPrayers = async () => {
    try {
      const response = await fetch(`${API_BASE}/prayer/prayers/today`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      if (response.ok) {
  setPrayers(result.message || []);
      } else if (response.status === 404) {
        // No prayers for today, create them
        await logTodaysPrayers();
      }
    } catch (error) {
      console.error('Error fetching prayers:', error);
    }
  };

  const logTodaysPrayers = async () => {
    try {
      const response = await fetch(`${API_BASE}/prayer/prayers`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      if (response.ok) {
        setPrayers(result.message || []);
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

    return (
      <Box>
        
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: colors.text.primary }}>
              Dashboard Overview
            </Typography>
            <Typography variant="h6" sx={{ color: colors.text.secondary }}>
              Welcome back, {user?.fullName || user?.username}!
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Here's your spiritual journey overview for today
          </Typography>
        </Box>

        
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ 
              ...commonStyles.frostedGlassCard,
              border: `2px solid ${colors.border.main}`,
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: shadows.large,
                transition: 'all 0.3s ease'
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', color: colors.primary.main }}>
                      {completedMandatory}/{mandatoryPrayers.length}
                    </Typography>
                    <Typography variant="body1" sx={{ color: colors.text.primary, fontWeight: 500, mt: 1 }}>
                      Today's Prayers
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      background: `linear-gradient(135deg, ${colors.primary.main}, ${colors.primary.dark})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: shadows.medium
                    }}
                  >
                    <Mosque sx={{ fontSize: 32, color: 'white' }} />
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={mandatoryPrayers.length > 0 ? (completedMandatory / mandatoryPrayers.length) * 100 : 0}
                  sx={{
                    mt: 2,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: colors.background.secondary,
                    '& .MuiLinearProgress-bar': { 
                      backgroundColor: colors.primary.main,
                      borderRadius: 4
                    }
                  }}
                />
                <Typography variant="caption" sx={{ mt: 1, display: 'block', color: colors.text.secondary }}>
                  {mandatoryPrayers.length > 0 ? Math.round((completedMandatory / mandatoryPrayers.length) * 100) : 0}% Complete
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ 
              ...commonStyles.frostedGlassCard,
              border: `2px solid #93c5fd`,
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: shadows.large,
                transition: 'all 0.3s ease'
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#3b82f6' }}>
                      {completedTasks}/{totalTasks}
                    </Typography>
                    <Typography variant="body1" sx={{ color: colors.text.primary, fontWeight: 500, mt: 1 }}>
                      Today's Tasks
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                    }}
                  >
                    <TaskIcon sx={{ fontSize: 32, color: 'white' }} />
                  </Box>
                </Box>
                <Typography variant="caption" sx={{ mt: 2, display: 'block', color: colors.text.secondary }}>
                  {completedTasks} completed today
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ 
              ...commonStyles.frostedGlassCard,
              border: `2px solid #fcd34d`,
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: shadows.large,
                transition: 'all 0.3s ease'
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#f59e0b' }}>
                      {user?.streakCount || 0}
                    </Typography>
                    <Typography variant="body1" sx={{ color: colors.text.primary, fontWeight: 500, mt: 1 }}>
                      Day Streak
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                    }}
                  >
                    <TrendingUp sx={{ fontSize: 32, color: 'white' }} />
                  </Box>
                </Box>
                <Typography variant="caption" sx={{ mt: 2, display: 'block', color: colors.text.secondary }}>
                  {user?.streakCount >= 7 ? 'Amazing streak!' : 'Keep it up!'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ 
              ...commonStyles.frostedGlassCard,
              border: `2px solid #c4b5fd`,
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: shadows.large,
                transition: 'all 0.3s ease'
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#8b5cf6' }}>
                      {user?.level || 1}
                    </Typography>
                    <Typography variant="body1" sx={{ color: colors.text.primary, fontWeight: 500, mt: 1 }}>
                      Current Level
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                    }}
                  >
                    <Star sx={{ fontSize: 32, color: 'white' }} />
                  </Box>
                </Box>
                <Typography variant="caption" sx={{ mt: 2, display: 'block', color: colors.text.secondary }}>
                  XP: {user?.xp || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        
        <Card sx={{ ...commonStyles.frostedGlassCard, border: `1px solid ${colors.border.light}` }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: colors.text.primary }}>
              Recent Activity
            </Typography>
            <Grid container spacing={2}>
              {safePrayers.filter(p => p.isCompleted).slice(-3).map((prayer) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={prayer._id}>
                  <Paper sx={{ 
                    p: 2, 
                    backgroundColor: '#f0fdf4', 
                    border: '1px solid #bbf7d0',
                    borderRadius: 2,
                    '&:hover': {
                      boxShadow: shadows.medium,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s ease'
                    }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <CheckCircle sx={{ color: '#16a34a', fontSize: 24 }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#166534' }}>
                          {prayer.prayerName} completed
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#15803d' }}>
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
                    backgroundColor: '#eff6ff', 
                    border: '1px solid #bfdbfe',
                    borderRadius: 2,
                    '&:hover': {
                      boxShadow: shadows.medium,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s ease'
                    }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <CheckCircle sx={{ color: '#2563eb', fontSize: 24 }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1e40af' }}>
                          {task.title} completed
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#1d4ed8' }}>
                          {new Date(task.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {safePrayers.filter(p => p.isCompleted).length === 0 && safeTasks.filter(t => t.isCompleted).length === 0 && (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  No recent activity yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
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
      <Box>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: colors.text.primary }}>
          Settings
        </Typography>
        <Card sx={{ ...commonStyles.frostedGlassCard, p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            Coming Soon
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Settings panel is under development...
          </Typography>
        </Card>
      </Box>
    );
  };

  const menuItems = [
  { id: 'overview', label: 'Overview', icon: <DashboardIcon /> },
  { id: 'tasks', label: 'Tasks', icon: <TaskIcon /> },
  { id: 'prayers', label: 'Prayers', icon: <Mosque /> },
  { id: 'groups', label: 'Groups', icon: <GroupsIcon /> },
  { id: 'challenges', label: 'Challenges', icon: <ChallengesIcon /> },
  { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            background: `linear-gradient(135deg, ${colors.primary.main}, ${colors.primary.dark})`,
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
            boxShadow: shadows.medium,
            border: `2px solid ${colors.border.main}`
          }}
        >
          <Mosque sx={{ color: 'white', fontSize: 32 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.text.primary }}>
          Habit<span style={{ color: colors.primary.main }}>Haven</span>
        </Typography>
        <Typography variant="body2" sx={{ color: colors.text.secondary, mt: 0.5 }}>
          Welcome, {user?.username}!
        </Typography>
      </Box>
      
      <Divider sx={{ borderColor: colors.border.light }} />
      
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
              borderRadius: 2,
              mb: 0.5,
              backgroundColor: activeTab === item.id ? `${colors.primary.main}15` : 'transparent',
              border: activeTab === item.id ? `2px solid ${colors.primary.main}` : '2px solid transparent',
              '&:hover': {
                backgroundColor: activeTab === item.id ? `${colors.primary.main}20` : 'rgba(0, 0, 0, 0.04)',
                transform: 'translateX(4px)',
                transition: 'all 0.2s ease'
              }
            }}
          >
            <ListItemIcon sx={{ color: activeTab === item.id ? colors.primary.main : colors.text.secondary, minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.label}
              sx={{ 
                '& .MuiListItemText-primary': {
                  color: activeTab === item.id ? colors.primary.main : colors.text.primary,
                  fontWeight: activeTab === item.id ? 600 : 400
                }
              }}
            />
          </ListItem>
        ))}
      </List>
      
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          startIcon={<LogoutIcon />}
          onClick={logout}
          variant="outlined"
          sx={{
            borderColor: 'rgba(239, 68, 68, 0.4)',
            color: '#dc2626',
            borderWidth: 2,
            py: 1.5,
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

  if (loading) {
    return (
      <Box 
        sx={{ 
          minHeight: '100vh',
          background: gradients.background.primary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              background: 'rgba(255, 255, 255, 0.75)',
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              boxShadow: shadows.avatar,
              border: `1px solid ${colors.border.main}`,
              backdropFilter: 'blur(8px)'
            }}
          >
            <Mosque sx={{ color: colors.text.accent, fontSize: 40 }} />
          </Box>
          <CircularProgress sx={{ color: colors.text.accent, mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.text.primary }}>
            Loading Dashboard...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        minHeight: '100vh',
        background: gradients.background.primary
      }}
    >
      {isMobile && (
        <AppBar 
          position="fixed" 
          sx={{ 
            backgroundColor: 'rgba(248, 250, 252, 0.95)',
            backdropFilter: 'blur(10px)',
            color: colors.text.primary,
            boxShadow: shadows.small,
            borderBottom: `1px solid ${colors.border.light}`
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              onClick={() => setMobileOpen(true)}
              sx={{ mr: 2, color: colors.primary.main }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', color: colors.text.primary }}>
              Habit<span style={{ color: colors.primary.main }}>Haven</span>
            </Typography>
            <IconButton sx={{ color: colors.primary.main }}>
              <Notifications />
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
              backgroundColor: 'rgba(248, 250, 252, 0.98)',
              backdropFilter: 'blur(10px)',
              borderRight: `1px solid ${colors.border.light}`
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
