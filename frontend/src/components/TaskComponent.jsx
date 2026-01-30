import React, { useState, useEffect, useCallback } from 'react';
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
  Tabs,
  Tab,
  Tooltip,
  Fade,
  Zoom,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress
} from '@mui/material';
import {
  Plus,
  Edit3,
  Trash2,
  CheckCircle,
  Circle,
  Calendar,
  ListTodo,
  RefreshCw,
  Target,
  TrendingUp,
  Clock,
  Flame,
  Trophy,
  Sparkles,
  Heart,
  Brain,
  Dumbbell,
  BookOpen,
  Music,
  Users,
  Coffee,
  Zap,
  Star,
  Award,
  History,
  Play,
  ChevronLeft,
  ChevronRight,
  Palette,
  Apple,
  Bike,
  GraduationCap,
  Leaf,
  BriefcaseBusiness,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import taskService from '../services/taskService';
import { CircularProgress } from './ui/ModernComponents';
import confetti from 'canvas-confetti';

// Category configurations with meaningful icons
const CATEGORIES = {
  health: { label: 'Health', color: '#10b981', bgColor: '#ecfdf5', icon: Apple },
  fitness: { label: 'Fitness', color: '#f97316', bgColor: '#fff7ed', icon: Bike },
  learning: { label: 'Learning', color: '#6366f1', bgColor: '#eef2ff', icon: GraduationCap },
  mindfulness: { label: 'Mindfulness', color: '#8b5cf6', bgColor: '#f5f3ff', icon: Leaf },
  productivity: { label: 'Productivity', color: '#3b82f6', bgColor: '#eff6ff', icon: BriefcaseBusiness },
  social: { label: 'Social', color: '#ec4899', bgColor: '#fdf2f8', icon: MessageCircle },
  creative: { label: 'Creative', color: '#eab308', bgColor: '#fefce8', icon: Palette },
  other: { label: 'Other', color: '#64748b', bgColor: '#f8fafc', icon: Star }
};

// Preset durations
const DURATION_PRESETS = [
  { label: '7 Days', days: 7, description: 'One week challenge' },
  { label: '14 Days', days: 14, description: 'Two week sprint' },
  { label: '21 Days', days: 21, description: 'Build a habit' },
  { label: '30 Days', days: 30, description: 'Monthly challenge' },
  { label: '66 Days', days: 66, description: 'Habit formation' },
  { label: '90 Days', days: 90, description: 'Quarterly goal' },
  { label: '100 Days', days: 100, description: 'Century challenge' },
  { label: '365 Days', days: 365, description: 'Full year commitment' }
];

const TaskComponent = () => {
  const { token, user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [activeTab, setActiveTab] = useState(0); // 0 = Active, 1 = History
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [completedTask, setCompletedTask] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    durationDays: 21,
    category: 'other'
  });

  // Stats
  const [stats, setStats] = useState({
    activeHabits: 0,
    completedHabits: 0,
    totalStreak: 0,
    todayCompleted: 0
  });

  // Fire confetti celebration
  const fireConfetti = useCallback(() => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  }, []);

  // Fetch all tasks
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const [activeResult, historyResult] = await Promise.all([
        taskService.getAllTasks(),
        taskService.getCompletedTasks()
      ]);

      if (activeResult.success) {
        setTasks(activeResult.data || []);
      }
      if (historyResult.success) {
        setCompletedTasks(historyResult.data || []);
      }
      
      calculateStats(activeResult.data || [], historyResult.data || []);
      setError('');
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to fetch habits');
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = (active, completed) => {
    const today = new Date().toISOString().split('T')[0];
    let todayCompleted = 0;
    let totalStreak = 0;

    active.forEach(task => {
      if (task.dailyProgress) {
        const todayProgress = task.dailyProgress.find(d => d.date === today);
        if (todayProgress?.completed) todayCompleted++;
        totalStreak += task.currentStreak || 0;
      }
    });

    setStats({
      activeHabits: active.length,
      completedHabits: completed.length,
      totalStreak,
      todayCompleted
    });
  };

  // Create task
  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      setError('Habit name is required');
      return;
    }

    setLoading(true);
    try {
      let result;
      if (editingTask) {
        result = await taskService.updateTask(editingTask._id, {
          title: formData.title,
          description: formData.description,
          category: formData.category
        });
      } else {
        result = await taskService.createTask(formData);
      }

      if (result.success) {
        setOpenDialog(false);
        setEditingTask(null);
        setFormData({ title: '', description: '', durationDays: 21, category: 'other' });
        await fetchTasks();
        setError('');
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Error saving habit:', error);
      setError('Failed to save habit');
    } finally {
      setLoading(false);
    }
  };

  // Delete task
  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this habit? All progress will be lost.')) {
      return;
    }

    try {
      const result = await taskService.deleteTask(taskId);
      if (result.success) {
        await fetchTasks();
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Error deleting habit:', error);
      setError('Failed to delete habit');
    }
  };

  // Mark day complete
  const handleMarkDayComplete = async (taskId) => {
    try {
      const result = await taskService.markDayComplete(taskId);
      if (result.success) {
        // Check if task is now fully completed
        if (result.data?.isCompleted) {
          setCompletedTask(result.data);
          setShowCompletionDialog(true);
          fireConfetti();
        }
        await fetchTasks();
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Error marking day complete:', error);
      setError('Failed to update progress');
    }
  };

  // Edit task
  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      durationDays: task.durationDays,
      category: task.category || 'other'
    });
    setOpenDialog(true);
  };

  // Create new task
  const handleCreate = () => {
    setEditingTask(null);
    setFormData({ title: '', description: '', durationDays: 21, category: 'other' });
    setOpenDialog(true);
  };

  useEffect(() => {
    if (token && user) {
      fetchTasks();
    }
  }, [token, user]);

  // Calendar Progress Component
  const CalendarProgress = ({ task }) => {
    const today = new Date().toISOString().split('T')[0];
    const dailyProgress = task.dailyProgress || [];
    const startDate = new Date(task.startDate);
    
    // Calculate weeks for display
    const totalDays = dailyProgress.length;
    const daysPerRow = 7;
    const weeks = Math.ceil(totalDays / daysPerRow);
    
    // Get category config
    const categoryConfig = CATEGORIES[task.category] || CATEGORIES.other;
    
    return (
      <Box sx={{ mt: 2 }}>
        {/* Mini calendar grid */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: `repeat(${Math.min(totalDays, daysPerRow)}, 1fr)`,
          gap: 0.5,
          maxWidth: '100%',
          overflowX: 'auto',
          pb: 1
        }}>
          {dailyProgress.slice(0, 35).map((day, index) => {
            const isToday = day.date === today;
            const isPast = day.date < today;
            const isFuture = day.date > today;
            
            return (
              <Tooltip 
                key={day.date} 
                title={`${new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${day.completed ? 'Completed ✓' : isPast ? 'Missed' : isFuture ? 'Upcoming' : 'Today'}`}
                arrow
              >
                <Box
                  sx={{
                    width: { xs: 20, sm: 24 },
                    height: { xs: 20, sm: 24 },
                    borderRadius: 1,
                    backgroundColor: day.completed 
                      ? categoryConfig.color
                      : isPast 
                        ? '#fee2e2'
                        : isToday 
                          ? '#fef3c7'
                          : '#f1f5f9',
                    border: isToday ? `2px solid ${categoryConfig.color}` : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    cursor: isToday && !day.completed ? 'pointer' : 'default',
                    '&:hover': isToday ? {
                      transform: 'scale(1.1)',
                      boxShadow: `0 2px 8px ${categoryConfig.color}40`
                    } : {}
                  }}
                >
                  {day.completed && (
                    <CheckCircle size={12} color="white" strokeWidth={3} />
                  )}
                </Box>
              </Tooltip>
            );
          })}
        </Box>
        
        {totalDays > 35 && (
          <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mt: 1 }}>
            +{totalDays - 35} more days
          </Typography>
        )}
      </Box>
    );
  };

  // Habit Card Component
  const HabitCard = ({ task, isHistory = false }) => {
    const today = new Date().toISOString().split('T')[0];
    const categoryConfig = CATEGORIES[task.category] || CATEGORIES.other;
    const CategoryIcon = categoryConfig.icon;
    
    const todayProgress = task.dailyProgress?.find(d => d.date === today);
    const isTodayComplete = todayProgress?.completed || false;
    const completedDays = task.dailyProgress?.filter(d => d.completed).length || 0;
    const totalDays = task.durationDays || task.dailyProgress?.length || 0;
    const percentage = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
    
    // Calculate days remaining
    const endDate = new Date(task.endDate);
    const daysRemaining = Math.max(0, Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24)));

    return (
      <Card sx={{
        borderRadius: 4,
        border: '1px solid #e2e8f0',
        backgroundColor: 'white',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: isHistory ? 0.9 : 1,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        }
      }}>
        {/* Progress bar at top */}
        <Box sx={{
          height: 4,
          backgroundColor: '#f1f5f9',
          position: 'relative'
        }}>
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${percentage}%`,
            background: `linear-gradient(90deg, ${categoryConfig.color} 0%, ${categoryConfig.color}dd 100%)`,
            transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
          }} />
        </Box>

        <CardContent sx={{ p: 3 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
            <Box sx={{
              width: 48,
              height: 48,
              borderRadius: 3,
              backgroundColor: categoryConfig.bgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <CategoryIcon size={24} color={categoryConfig.color} />
            </Box>
            
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 700, 
                color: '#1e293b',
                mb: 0.5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {task.title}
              </Typography>
              {task.description && (
                <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                  {task.description}
                </Typography>
              )}
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  label={categoryConfig.label}
                  size="small"
                  sx={{ 
                    backgroundColor: categoryConfig.bgColor,
                    color: categoryConfig.color,
                    fontWeight: 600,
                    fontSize: '0.7rem'
                  }}
                />
                {!isHistory && (
                  <Chip 
                    icon={<Clock size={12} />}
                    label={`${daysRemaining} days left`}
                    size="small"
                    sx={{ 
                      backgroundColor: '#f1f5f9',
                      color: '#64748b',
                      fontWeight: 500,
                      fontSize: '0.7rem'
                    }}
                  />
                )}
                {task.currentStreak > 0 && (
                  <Chip 
                    icon={<Flame size={12} color="#f97316" />}
                    label={`${task.currentStreak} streak`}
                    size="small"
                    sx={{ 
                      backgroundColor: '#fff7ed',
                      color: '#f97316',
                      fontWeight: 600,
                      fontSize: '0.7rem'
                    }}
                  />
                )}
              </Box>
            </Box>

            {/* Actions */}
            {!isHistory && (
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <IconButton 
                  size="small" 
                  onClick={() => handleEdit(task)}
                  sx={{ color: '#94a3b8', '&:hover': { backgroundColor: '#f1f5f9', color: '#6366f1' } }}
                >
                  <Edit3 size={16} />
                </IconButton>
                <IconButton 
                  size="small" 
                  onClick={() => handleDelete(task._id)}
                  sx={{ color: '#94a3b8', '&:hover': { backgroundColor: '#fef2f2', color: '#dc2626' } }}
                >
                  <Trash2 size={16} />
                </IconButton>
              </Box>
            )}
          </Box>

          {/* Progress Stats */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 3, 
            mb: 2,
            p: 2,
            backgroundColor: '#f8fafc',
            borderRadius: 3
          }}>
            <Box sx={{ position: 'relative' }}>
              <CircularProgress 
                value={percentage} 
                size={70} 
                strokeWidth={6}
                color={categoryConfig.color}
                bgColor="#e2e8f0"
              >
                <Typography variant="body1" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  {percentage}%
                </Typography>
              </CircularProgress>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5 }}>
                Progress
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                {completedDays} / {totalDays}
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                days completed
              </Typography>
            </Box>
            {task.longestStreak > 0 && (
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'center' }}>
                  <Trophy size={16} color="#eab308" />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    {task.longestStreak}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                  best streak
                </Typography>
              </Box>
            )}
          </Box>

          {/* Calendar Progress */}
          <CalendarProgress task={task} />

          {/* Today's Action Button */}
          {!isHistory && (
            <Box sx={{ mt: 3 }}>
              {todayProgress ? (
                <Button
                  fullWidth
                  variant={isTodayComplete ? "outlined" : "contained"}
                  onClick={() => handleMarkDayComplete(task._id)}
                  startIcon={isTodayComplete ? <CheckCircle size={20} /> : <Circle size={20} />}
                  sx={{
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 700,
                    fontSize: '1rem',
                    ...(isTodayComplete ? {
                      borderColor: categoryConfig.color,
                      color: categoryConfig.color,
                      backgroundColor: categoryConfig.bgColor,
                      '&:hover': {
                        backgroundColor: categoryConfig.bgColor,
                        borderColor: categoryConfig.color,
                      }
                    } : {
                      background: `linear-gradient(135deg, ${categoryConfig.color} 0%, ${categoryConfig.color}dd 100%)`,
                      boxShadow: `0 4px 12px ${categoryConfig.color}40`,
                      '&:hover': {
                        background: `linear-gradient(135deg, ${categoryConfig.color}dd 0%, ${categoryConfig.color} 100%)`,
                        boxShadow: `0 6px 16px ${categoryConfig.color}50`,
                      }
                    })
                  }}
                >
                  {isTodayComplete ? "Completed Today ✓" : "Mark Today as Done"}
                </Button>
              ) : (
                <Alert severity="info" sx={{ borderRadius: 3 }}>
                  Today is not within this habit's duration
                </Alert>
              )}
            </Box>
          )}

          {/* Completed Badge */}
          {isHistory && (
            <Box sx={{ 
              mt: 2, 
              p: 2, 
              backgroundColor: '#f0fdf4', 
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              <Award size={24} color="#10b981" />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#10b981' }}>
                  Habit Completed! 🎉
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  Completed on {new Date(task.completedAt).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading && tasks.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Box sx={{ textAlign: 'center' }}>
          <MuiCircularProgress sx={{ color: '#6366f1', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#475569', fontWeight: 600 }}>Loading Habits...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      animation: 'fadeIn 0.5s ease-out',
      '@keyframes fadeIn': {
        from: { opacity: 0, transform: 'translateY(20px)' },
        to: { opacity: 1, transform: 'translateY(0)' }
      }
    }}>
      
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3, borderRadius: 3, border: '1px solid #fecaca' }} 
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}

      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 0.5, fontSize: { xs: '1.75rem', sm: '2rem' } }}>
              Habit Tracker 🎯
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b' }}>
              Build lasting habits with daily tracking and streaks
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              onClick={fetchTasks}
              startIcon={<RefreshCw size={18} />}
              variant="outlined"
              disabled={loading}
              sx={{ 
                borderColor: '#e2e8f0',
                color: '#475569',
                borderRadius: 3,
                fontWeight: 600,
                '&:hover': { borderColor: '#6366f1', backgroundColor: '#eef2ff', color: '#6366f1' }
              }}
            >
              Refresh
            </Button>
            <Button
              onClick={handleCreate}
              startIcon={<Plus size={18} />}
              variant="contained"
              sx={{ 
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                borderRadius: 3,
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                '&:hover': { 
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  boxShadow: '0 6px 16px rgba(99, 102, 241, 0.4)',
                }
              }}
            >
              New Habit
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Stats Cards - Matching Prayer Component Style */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Main Habit Progress Card - Featured */}
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
                    <Target size={20} color="rgba(255,255,255,0.8)" />
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>
                      Today's Progress
                    </Typography>
                  </Box>
                  <Typography variant="h2" sx={{ fontWeight: 800, color: 'white', mb: 1, fontSize: { xs: '2.5rem', sm: '3rem' } }}>
                    {stats.todayCompleted}<span style={{ fontSize: '1.5rem', opacity: 0.7 }}>/{stats.activeHabits}</span>
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                    {stats.todayCompleted === stats.activeHabits && stats.activeHabits > 0 ? '🎉 All habits done today!' : `${stats.activeHabits - stats.todayCompleted} habits remaining`}
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
                      width: `${stats.activeHabits > 0 ? Math.round((stats.todayCompleted / stats.activeHabits) * 100) : 0}%`,
                      borderRadius: 4,
                      background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                      transition: 'width 0.8s ease-out',
                      boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)',
                    }} />
                  </Box>
                </Box>
                
                <Box sx={{ display: { xs: 'none', sm: 'block' }, ml: 3 }}>
                  <CircularProgress 
                    value={stats.activeHabits > 0 ? Math.round((stats.todayCompleted / stats.activeHabits) * 100) : 0} 
                    size={100} 
                    strokeWidth={8}
                    color="#10b981"
                    bgColor="rgba(255,255,255,0.2)"
                  >
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                      {stats.activeHabits > 0 ? Math.round((stats.todayCompleted / stats.activeHabits) * 100) : 0}%
                    </Typography>
                  </CircularProgress>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Side Stats - Matching Prayer Component */}
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
                    {stats.totalStreak}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    {stats.totalStreak >= 7 ? '🔥 On fire!' : 'days total'}
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
                      background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(234, 179, 8, 0.3)',
                    }}>
                      <Trophy size={20} color="white" />
                    </Box>
                    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>Completed</Typography>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#1e293b', fontSize: '2rem' }}>
                    {stats.completedHabits}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    {stats.completedHabits > 0 ? '🏆 Great work!' : 'habits'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Card sx={{ 
                backgroundColor: 'white',
                borderRadius: 4,
                border: '1px solid #e2e8f0',
              }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
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
                      <Box>
                        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>Active Habits</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                          {stats.activeHabits} tracking
                        </Typography>
                      </Box>
                    </Box>
                    <Chip 
                      label={new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      size="small"
                      sx={{ 
                        backgroundColor: '#eef2ff',
                        color: '#6366f1',
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card sx={{ 
        mb: 3, 
        backgroundColor: 'white',
        borderRadius: 4,
        border: '1px solid #e2e8f0',
      }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, v) => setActiveTab(v)}
          sx={{
            px: 2,
            '& .MuiTab-root': {
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.95rem',
              minHeight: 56,
            },
            '& .Mui-selected': {
              color: '#6366f1',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#6366f1',
              height: 3,
              borderRadius: '3px 3px 0 0',
            }
          }}
        >
          <Tab 
            icon={<Play size={18} />} 
            iconPosition="start" 
            label={`Active (${tasks.length})`} 
          />
          <Tab 
            icon={<History size={18} />} 
            iconPosition="start" 
            label={`History (${completedTasks.length})`} 
          />
        </Tabs>
      </Card>

      {/* Content */}
      {activeTab === 0 ? (
        // Active Habits
        tasks.length === 0 ? (
          <Card sx={{ 
            backgroundColor: 'white',
            borderRadius: 4,
            border: '1px solid #e2e8f0',
          }}>
            <CardContent sx={{ py: 8, textAlign: 'center' }}>
              <Box sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3
              }}>
                <Target size={40} color="#94a3b8" />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                No Active Habits
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b', mb: 3, maxWidth: 400, mx: 'auto' }}>
                Start building lasting habits! Create your first habit and track your daily progress.
              </Typography>
              <Button
                onClick={handleCreate}
                startIcon={<Plus size={20} />}
                variant="contained"
                size="large"
                sx={{ 
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  borderRadius: 3,
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                }}
              >
                Create Your First Habit
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {tasks.map((task) => (
              <Grid size={{ xs: 12, md: 6 }} key={task._id}>
                <HabitCard task={task} />
              </Grid>
            ))}
          </Grid>
        )
      ) : (
        // History
        completedTasks.length === 0 ? (
          <Card sx={{ 
            backgroundColor: 'white',
            borderRadius: 4,
            border: '1px solid #e2e8f0',
          }}>
            <CardContent sx={{ py: 8, textAlign: 'center' }}>
              <Box sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3
              }}>
                <History size={40} color="#94a3b8" />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                No Completed Habits Yet
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b', maxWidth: 400, mx: 'auto' }}>
                Complete your active habits to see them here. Keep going! 💪
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {completedTasks.map((task) => (
              <Grid size={{ xs: 12, md: 6 }} key={task._id}>
                <HabitCard task={task} isHistory />
              </Grid>
            ))}
          </Grid>
        )
      )}

      {/* Create/Edit Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#1e293b', pb: 1 }}>
          {editingTask ? 'Edit Habit' : 'Create New Habit'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <TextField
              label="Habit Name"
              fullWidth
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Morning meditation, Read 20 pages..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': { borderColor: '#6366f1' },
                  '&.Mui-focused fieldset': { borderColor: '#6366f1' },
                }
              }}
            />
            
            <TextField
              label="Description (optional)"
              fullWidth
              multiline
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Why is this habit important to you?"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': { borderColor: '#6366f1' },
                  '&.Mui-focused fieldset': { borderColor: '#6366f1' },
                }
              }}
            />

            {/* Category Selection */}
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                label="Category"
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                sx={{ borderRadius: 2 }}
              >
                {Object.entries(CATEGORIES).map(([key, config]) => {
                  const Icon = config.icon;
                  return (
                    <MenuItem key={key} value={key}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{
                          width: 28,
                          height: 28,
                          borderRadius: 1.5,
                          backgroundColor: config.bgColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Icon size={16} color={config.color} />
                        </Box>
                        <Typography>{config.label}</Typography>
                      </Box>
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            
            {/* Duration Selection - Only show for new habits */}
            {!editingTask && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2, color: '#1e293b', fontWeight: 600 }}>
                  Duration: {formData.durationDays} days
                </Typography>
                
                {/* Duration Presets - Full Width Grid */}
                <Grid container spacing={1.5}>
                  {DURATION_PRESETS.map((preset) => (
                    <Grid size={{ xs: 6, sm: 3 }} key={preset.days}>
                      <Paper
                        onClick={() => setFormData({ ...formData, durationDays: preset.days })}
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          cursor: 'pointer',
                          borderRadius: 3,
                          border: formData.durationDays === preset.days 
                            ? '2px solid #6366f1' 
                            : '1px solid #e2e8f0',
                          backgroundColor: formData.durationDays === preset.days 
                            ? '#eef2ff' 
                            : 'white',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            borderColor: '#6366f1',
                            backgroundColor: '#f8fafc',
                            transform: 'translateY(-2px)',
                          }
                        }}
                      >
                        <Typography variant="h6" sx={{ 
                          fontWeight: 700, 
                          color: formData.durationDays === preset.days ? '#6366f1' : '#1e293b',
                          mb: 0.25
                        }}>
                          {preset.label}
                        </Typography>
                        <Typography variant="caption" sx={{ 
                          color: '#64748b',
                          display: 'block',
                          lineHeight: 1.2
                        }}>
                          {preset.description}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>

                {/* Custom Duration Input - Beautiful Full Width */}
                <Paper sx={{ 
                  mt: 3, 
                  p: 2.5, 
                  borderRadius: 3,
                  border: '1px solid #e2e8f0',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
                }}>
                  <Typography variant="body2" sx={{ color: '#64748b', mb: 1.5, fontWeight: 500 }}>
                    Or set a custom duration
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TextField
                      type="number"
                      fullWidth
                      value={formData.durationDays}
                      onChange={(e) => {
                        const value = Math.max(1, Math.min(365, parseInt(e.target.value) || 1));
                        setFormData({ ...formData, durationDays: value });
                      }}
                      inputProps={{ min: 1, max: 365, style: { fontSize: '1.25rem', fontWeight: 600 } }}
                      InputProps={{
                        endAdornment: (
                          <Typography sx={{ color: '#64748b', fontWeight: 500, whiteSpace: 'nowrap', mr: 1 }}>
                            days
                          </Typography>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          backgroundColor: 'white',
                          '& fieldset': { borderColor: '#e2e8f0' },
                          '&:hover fieldset': { borderColor: '#6366f1' },
                          '&.Mui-focused fieldset': { borderColor: '#6366f1', borderWidth: 2 },
                        },
                        '& input': {
                          py: 1.5,
                          color: '#1e293b'
                        }
                      }}
                    />
                  </Box>
                  <Typography variant="caption" sx={{ color: '#94a3b8', mt: 1, display: 'block' }}>
                    Enter any number between 1 and 365 days
                  </Typography>
                </Paper>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
          <Button 
            onClick={() => setOpenDialog(false)}
            sx={{ color: '#64748b', fontWeight: 600, borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={loading || !formData.title.trim()}
            sx={{ 
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              borderRadius: 2,
              fontWeight: 600,
              px: 3,
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
              '&:hover': { 
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              },
            }}
          >
            {loading ? 'Saving...' : editingTask ? 'Update Habit' : 'Create Habit'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Completion Celebration Dialog */}
      <Dialog
        open={showCompletionDialog}
        onClose={() => setShowCompletionDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            textAlign: 'center',
            overflow: 'visible',
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fef3c7 100%)',
          }
        }}
      >
        <DialogContent sx={{ py: 5, px: 4 }}>
          <Box sx={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
            boxShadow: '0 10px 40px rgba(251, 191, 36, 0.4)',
            animation: 'bounce 0.6s ease-in-out infinite alternate',
            '@keyframes bounce': {
              from: { transform: 'translateY(0)' },
              to: { transform: 'translateY(-10px)' }
            }
          }}>
            <Trophy size={50} color="white" />
          </Box>
          
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>
            🎉 Congratulations! 🎉
          </Typography>
          
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#6366f1', mb: 2 }}>
            You completed "{completedTask?.title}"!
          </Typography>
          
          <Typography variant="body1" sx={{ color: '#64748b', mb: 3 }}>
            Amazing dedication! You've successfully completed all {completedTask?.durationDays} days of your habit.
            This achievement has been added to your history.
          </Typography>

          {completedTask && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: 3, 
              mb: 3,
              p: 2,
              backgroundColor: 'rgba(255,255,255,0.6)',
              borderRadius: 3
            }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  {completedTask.durationDays}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>Days</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#f97316' }}>
                  {completedTask.longestStreak}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>Best Streak</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981' }}>
                  100%
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>Complete</Typography>
              </Box>
            </Box>
          )}
          
          <Button
            variant="contained"
            size="large"
            onClick={() => setShowCompletionDialog(false)}
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              borderRadius: 3,
              fontWeight: 700,
              px: 4,
              py: 1.5,
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
            }}
          >
            Keep Building Habits! 🚀
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TaskComponent;