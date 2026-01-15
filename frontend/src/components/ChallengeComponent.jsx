import React, { useState, useEffect } from 'react';
import {
  Box,
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
  LinearProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Fab,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Add as AddIcon,
  Refresh,
  TrendingUp,
  CalendarToday,
  Group,
  CheckCircle,
  PlayArrow,
  Flag,
  Close,
  Timer,
  Person
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { challengeService } from '../services/challengeService';
import { colors, gradients, shadows, commonStyles } from '../styles';

const ChallengeComponent = () => {
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [myChallenges, setMyChallenges] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [challengeDetails, setChallengeDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  
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
        const challenges = result.data || [];
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

    if (formData.title.length > 100) {
      setError('Title must be 100 characters or less');
      return;
    }

    if (formData.description.length > 500) {
      setError('Description must be 500 characters or less');
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
        setError('');
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
        setError('');
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
        setChallengeDetails(result.data.message || result.data.data);
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

  // Get status color
  const getStatusColor = (challenge) => {
    if (challenge.completed) return 'success';
    if (challenge.challengeId?.status === 'expired') return 'default';
    if (challenge.challengeId?.status === 'active') return 'primary';
    return 'default';
  };

  // Get status label
  const getStatusLabel = (challenge) => {
    if (challenge.completed) return 'Completed';
    if (challenge.challengeId?.status === 'expired') return 'Expired';
    if (challenge.challengeId?.status === 'active') return 'Active';
    return challenge.challengeId?.status || 'Unknown';
  };

  useEffect(() => {
    if (token && user) {
      fetchMyChallenges();
    }
  }, [token, user]);

  if (loading && myChallenges.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress sx={{ color: 'primary.main', mb: 2 }} />
          <Typography variant="h6">Loading Challenges...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: colors.text.primary }}>
            Challenges
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              onClick={fetchMyChallenges}
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
              onClick={() => setOpenCreateDialog(true)}
              startIcon={<AddIcon />}
              variant="contained"
              disabled={loading}
              sx={{ ...commonStyles.primaryButton }}
            >
              Create Challenge
            </Button>
          </Box>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Set goals, track progress, and achieve greatness with daily challenges
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
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
                    Total Challenges
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
                  <TrophyIcon sx={{ fontSize: 32, color: 'white' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
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
                    {stats.active}
                  </Typography>
                  <Typography variant="body1" sx={{ color: colors.text.primary, fontWeight: 500, mt: 1 }}>
                    Active
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
                  <PlayArrow sx={{ fontSize: 32, color: 'white' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
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
                    {stats.inProgress}
                  </Typography>
                  <Typography variant="body1" sx={{ color: colors.text.primary, fontWeight: 500, mt: 1 }}>
                    In Progress
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
                  <TrendingUp sx={{ fontSize: 32, color: 'white' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
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
                    background: 'linear-gradient(135deg, #9c27b0, #7b1fa2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(156, 39, 176, 0.3)'
                  }}
                >
                  <CheckCircle sx={{ fontSize: 32, color: 'white' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Challenges List */}
      <Grid container spacing={3}>
        {myChallenges.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <TrophyIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>
                No challenges yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Create your first challenge to start your journey
              </Typography>
              <Button
                variant="contained"
                onClick={() => setOpenCreateDialog(true)}
                startIcon={<AddIcon />}
              >
                Create Challenge
              </Button>
            </Paper>
          </Grid>
        ) : (
          myChallenges.map((challenge) => {
            const progressPercentage = getProgressPercentage(
              challenge.progress,
              challenge.challengeId?.totalDays || 1
            );

            return (
              <Grid item xs={12} sm={6} md={4} key={challenge._id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    border: '2px solid',
                    borderColor: challenge.completed ? '#2196f3' : challenge.challengeId?.status === 'active' ? '#4caf50' : '#e0e0e0',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
                        {challenge.challengeId?.title || 'Untitled Challenge'}
                      </Typography>
                      <Chip
                        label={getStatusLabel(challenge)}
                        color={getStatusColor(challenge)}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                      {challenge.challengeId?.description || 'No description'}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" fontWeight="bold">
                          Progress
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Day {challenge.currentDay} / {challenge.challengeId?.totalDays || 0}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={progressPercentage} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          backgroundColor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            background: challenge.completed 
                              ? 'linear-gradient(90deg, #2196f3, #1976d2)'
                              : 'linear-gradient(90deg, #4caf50, #388e3c)'
                          }
                        }} 
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        {progressPercentage}% Complete
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                      <Flag fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        <strong>Goal:</strong> {challenge.challengeId?.goal || 'No goal set'}
                      </Typography>
                    </Box>

                    {challenge.challengeId?.isGroup && (
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                        <Group fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          Group Challenge
                        </Typography>
                      </Box>
                    )}

                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <CalendarToday fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        Joined {new Date(challenge.joinedAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </CardContent>

                  <Divider />

                  <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleViewDetails(challenge)}
                      fullWidth
                    >
                      View Details
                    </Button>
                    {!challenge.completed && challenge.challengeId?.status === 'active' && (
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleUpdateProgress(challenge.challengeId._id)}
                        fullWidth
                      >
                        Mark Day Complete
                      </Button>
                    )}
                  </Box>
                </Card>
              </Grid>
            );
          })
        )}
      </Grid>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="create challenge"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setOpenCreateDialog(true)}
      >
        <AddIcon />
      </Fab>

      {/* Create Challenge Dialog */}
      <Dialog 
        open={openCreateDialog} 
        onClose={() => setOpenCreateDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Create New Challenge</Typography>
            <IconButton onClick={() => setOpenCreateDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Challenge Title"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.title}
            onChange={handleInputChange}
            helperText={`${formData.title.length}/100 characters`}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={formData.description}
            onChange={handleInputChange}
            helperText={`${formData.description.length}/500 characters`}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="goal"
            label="Goal"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.goal}
            onChange={handleInputChange}
            placeholder="e.g., Complete 5 prayers daily"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="totalDays"
            label="Total Days"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.totalDays}
            onChange={handleInputChange}
            inputProps={{ min: 1 }}
            sx={{ mb: 2 }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.isGroup}
                onChange={handleInputChange}
                name="isGroup"
                color="primary"
              />
            }
            label="Group Challenge (others can join)"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateChallenge} 
            variant="contained" 
            disabled={createLoading || !formData.title.trim()}
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
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Challenge Details</Typography>
            <IconButton onClick={() => setOpenDetailsDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {detailsLoading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : challengeDetails ? (
            <Box>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                {challengeDetails.challenge?.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {challengeDetails.challenge?.description}
              </Typography>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {challengeDetails.challenge?.totalDays}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Days
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main">
                      {challengeDetails.participants?.length || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Participants
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Typography variant="h6" sx={{ mb: 2 }}>
                Participants
              </Typography>
              <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                {challengeDetails.participants?.length > 0 ? (
                  challengeDetails.participants.map((participant) => (
                    <ListItem key={participant._id}>
                      <ListItemAvatar>
                        <Avatar>
                          <Person />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={participant.userId?.fullName || participant.userId?.username || 'User'}
                        secondary={`Day ${participant.currentDay} - ${participant.completed ? 'Completed' : 'In Progress'}`}
                      />
                      <Chip
                        label={`${getProgressPercentage(participant.progress, challengeDetails.challenge?.totalDays)}%`}
                        size="small"
                        color={participant.completed ? 'success' : 'primary'}
                      />
                    </ListItem>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                    No participants yet
                  </Typography>
                )}
              </List>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No details available
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailsDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChallengeComponent;
