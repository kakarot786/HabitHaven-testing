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
  CircularProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Checkbox,
  Tooltip,
  Menu,
  MenuList,
  ListItemIcon
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle,
  RadioButtonUnchecked,
  CalendarToday,
  Assignment,
  MoreVert,
  TaskAlt,
  Schedule,
  TrendingUp,
  Today,
  DateRange,
  Refresh
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import taskService from '../services/taskService';
import { colors, gradients, shadows, commonStyles, taskStyles } from '../styles';

const TaskComponent = () => {
  const { token, user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    todayTasks: 0,
    completionRate: 0
  });

  // Fetch all tasks
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const result = await taskService.getAllTasks();
      if (result.success) {
        setTasks(result.data || []);
        calculateStats(result.data || []);
        setError('');
      } else {
        setError(result.error);
        setTasks([]);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to fetch tasks');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = (taskList) => {
    // Ensure taskList is an array
    const safeTasks = Array.isArray(taskList) ? taskList : [];
    
    const total = safeTasks.length;
    const completed = safeTasks.filter(task => task.isCompleted).length;
    const pending = total - completed;
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = safeTasks.filter(task => 
      new Date(task.date).toISOString().split('T')[0] === today
    ).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    setStats({
      total,
      completed,
      pending,
      todayTasks,
      completionRate
    });
  };

  // Create or update task
  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.date) {
      setError('Title and date are required');
      return;
    }

    setLoading(true);
    try {
      let result;
      if (editingTask) {
        // Validate editing task has an ID
        if (!editingTask._id) {
          setError('Task ID is missing for update');
          setLoading(false);
          return;
        }
        result = await taskService.updateTask(editingTask._id, formData);
      } else {
        result = await taskService.createTask(formData);
      }

      if (result.success) {
        setOpenDialog(false);
        setEditingTask(null);
        setFormData({ title: '', description: '', date: new Date().toISOString().split('T')[0] });
        await fetchTasks();
        setError('');
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Error saving task:', error);
      setError('Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  // Delete task
  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setLoading(true);
    try {
      const result = await taskService.deleteTask(taskId);
      if (result.success) {
        await fetchTasks();
        setError('');
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task');
    } finally {
      setLoading(false);
      setAnchorEl(null);
    }
  };

  // Toggle task completion
  const toggleComplete = async (taskId, currentStatus) => {
    try {
      // Validate taskId
      if (!taskId) {
        setError('Task ID is missing');
        return;
      }

      const result = await taskService.markTaskComplete(taskId, !currentStatus);
      if (result.success) {
        await fetchTasks();
        setError('');
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Error toggling task:', error);
      setError('Failed to update task');
    }
  };

  // Open edit dialog
  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      date: new Date(task.date).toISOString().split('T')[0]
    });
    setOpenDialog(true);
    setAnchorEl(null);
  };

  // Open create dialog
  const handleCreate = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    setOpenDialog(true);
  };

  // Filter tasks
  const getFilteredTasks = () => {
    let filtered = [...tasks];

    // Filter by completion status
    if (filterStatus === 'completed') {
      filtered = filtered.filter(task => task.isCompleted);
    } else if (filterStatus === 'pending') {
      filtered = filtered.filter(task => !task.isCompleted);
    }

    // Filter by date
    const today = new Date().toISOString().split('T')[0];
    if (filterDate === 'today') {
      filtered = filtered.filter(task => 
        new Date(task.date).toISOString().split('T')[0] === today
      );
    } else if (filterDate === 'upcoming') {
      filtered = filtered.filter(task => 
        new Date(task.date).toISOString().split('T')[0] > today
      );
    } else if (filterDate === 'overdue') {
      filtered = filtered.filter(task => 
        new Date(task.date).toISOString().split('T')[0] < today && !task.isCompleted
      );
    }

    return filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  // Handle menu
  const handleMenuOpen = (event, task) => {
    setAnchorEl(event.currentTarget);
    setSelectedTask(task);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTask(null);
  };

  useEffect(() => {
    if (token && user) {
      fetchTasks();
    }
  }, [token, user]);

  if (loading && tasks.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress sx={{ color: 'primary.main', mb: 2 }} />
          <Typography variant="h6">Loading Tasks...</Typography>
        </Box>
      </Box>
    );
  }

  const filteredTasks = getFilteredTasks();

  return (
    <Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: colors.text.primary }}>
            Task Manager
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              onClick={fetchTasks}
              startIcon={<Refresh />}
              variant="outlined"
              disabled={loading}
              sx={{ 
                borderColor: colors.primary.main,
                color: colors.primary.main,
                borderWidth: 2,
                '&:hover': { 
                  borderColor: colors.primary.dark,
                  backgroundColor: `${colors.primary.main}10`,
                  borderWidth: 2
                }
              }}
            >
              Refresh
            </Button>
            <Button
              onClick={handleCreate}
              startIcon={<AddIcon />}
              variant="contained"
              disabled={loading}
              sx={{ 
                ...commonStyles.primaryButton,
                '&.Mui-disabled': {
                  background: colors.background.secondary,
                  color: colors.text.secondary
                }
              }}
            >
              Add Task
            </Button>
          </Box>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Organize and track your daily tasks efficiently
        </Typography>
      </Box>

      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ 
            ...commonStyles.frostedGlassCard,
            border: '2px solid #93c5fd',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: shadows.large,
              transition: 'all 0.3s ease'
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                    {stats.total}
                  </Typography>
                  <Typography variant="body1" sx={{ color: colors.text.primary, fontWeight: 500, mt: 1 }}>
                    Total Tasks
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #2196f3, #1976d2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)'
                  }}
                >
                  <Assignment sx={{ fontSize: 32, color: 'white' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ 
            ...commonStyles.frostedGlassCard,
            border: '2px solid #86efac',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: shadows.large,
              transition: 'all 0.3s ease'
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                    {stats.completed}
                  </Typography>
                  <Typography variant="body1" sx={{ color: colors.text.primary, fontWeight: 500, mt: 1 }}>
                    Completed
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #4caf50, #388e3c)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
                  }}
                >
                  <TaskAlt sx={{ fontSize: 32, color: 'white' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ 
            ...commonStyles.frostedGlassCard,
            border: '2px solid #fdba74',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: shadows.large,
              transition: 'all 0.3s ease'
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                    {stats.pending}
                  </Typography>
                  <Typography variant="body1" sx={{ color: colors.text.primary, fontWeight: 500, mt: 1 }}>
                    Pending
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #ff9800, #f57c00)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)'
                  }}
                >
                  <Schedule sx={{ fontSize: 32, color: 'white' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ 
            ...commonStyles.frostedGlassCard,
            border: '2px solid #d8b4fe',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: shadows.large,
              transition: 'all 0.3s ease'
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
                    {stats.completionRate}%
                  </Typography>
                  <Typography variant="body1" sx={{ color: colors.text.primary, fontWeight: 500, mt: 1 }}>
                    Completion Rate
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #9c27b0, #7b1fa2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(156, 39, 176, 0.3)'
                  }}
                >
                  <TrendingUp sx={{ fontSize: 32, color: 'white' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                label="Status"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="all">All Tasks</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Date</InputLabel>
              <Select
                value={filterDate}
                label="Date"
                onChange={(e) => setFilterDate(e.target.value)}
              >
                <MenuItem value="all">All Dates</MenuItem>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="upcoming">Upcoming</MenuItem>
                <MenuItem value="overdue">Overdue</MenuItem>
              </Select>
            </FormControl>

            <Typography variant="body2" color="text.secondary">
              Showing {filteredTasks.length} of {stats.total} tasks
            </Typography>
          </Box>
        </CardContent>
      </Card>

      
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Your Tasks
          </Typography>

          {filteredTasks.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Assignment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                No tasks found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {filterStatus !== 'all' || filterDate !== 'all' 
                  ? 'Try adjusting your filters or create a new task' 
                  : 'Create your first task to get started'
                }
              </Typography>
              <Button
                onClick={handleCreate}
                startIcon={<AddIcon />}
                variant="contained"
              >
                Create Task
              </Button>
            </Box>
          ) : (
            <List>
              {filteredTasks.map((task, index) => {
                const isOverdue = new Date(task.date) < new Date() && !task.isCompleted;
                const isToday = new Date(task.date).toDateString() === new Date().toDateString();

                return (
                  <React.Fragment key={task._id}>
                    <ListItem
                      sx={{
                        border: isOverdue ? '1px solid #f44336' : isToday ? '1px solid #2196f3' : '1px solid transparent',
                        borderRadius: 1,
                        mb: 1,
                        backgroundColor: task.isCompleted ? '#f0f9ff' : 'transparent'
                      }}
                    >
                      <Checkbox
                        checked={task.isCompleted}
                        onChange={() => toggleComplete(task._id, task.isCompleted)}
                        sx={{ mr: 2 }}
                      />
                      
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography
                              variant="body1"
                              sx={{
                                textDecoration: task.isCompleted ? 'line-through' : 'none',
                                fontWeight: task.isCompleted ? 'normal' : 'bold'
                              }}
                            >
                              {task.title}
                            </Typography>
                            {isOverdue && (
                              <Chip label="Overdue" size="small" color="error" />
                            )}
                            {isToday && !task.isCompleted && (
                              <Chip label="Today" size="small" color="primary" />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box component="div">
                            {task.description && (
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }} component="span">
                                {task.description}
                              </Typography>
                            )}
                            <Typography variant="caption" color="text.secondary" component="div">
                              Due: {new Date(task.date).toLocaleDateString()}
                            </Typography>
                          </Box>
                        }
                      />

                      <ListItemSecondaryAction>
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, task)}
                          size="small"
                        >
                          <MoreVert />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < filteredTasks.length - 1 && <Divider />}
                  </React.Fragment>
                );
              })}
            </List>
          )}
        </CardContent>
      </Card>

      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuList>
          <MenuItem onClick={() => selectedTask && handleEdit(selectedTask)}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            Edit Task
          </MenuItem>
          <MenuItem onClick={() => selectedTask && handleDelete(selectedTask._id)}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            Delete Task
          </MenuItem>
        </MenuList>
      </Menu>

      
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTask ? 'Edit Task' : 'Create New Task'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Task Title"
              fullWidth
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter task title..."
            />
            
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter task description (optional)..."
            />
            
            <TextField
              label="Due Date"
              type="date"
              fullWidth
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {loading ? 'Saving...' : editingTask ? 'Update Task' : 'Create Task'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskComponent;
