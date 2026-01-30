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
  Avatar,
  Alert,
  Tabs,
  Tab,
  InputAdornment,
  Badge
} from '@mui/material';
import {
  Users,
  Plus,
  Search,
  X,
  RefreshCw,
  UserPlus,
  Star,
  Calendar,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { groupService } from '../services/groupService';

const GroupComponent = () => {
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [allGroups, setAllGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  
  // Dialog states
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  // Fetch all groups
  const fetchAllGroups = async () => {
    try {
      const result = await groupService.getAllGroups();
      if (result.success) {
        const groups = result.data?.data || result.data || [];
        setAllGroups(groups);
        setFilteredGroups(groups);
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
      setError('Failed to load groups');
    }
  };

  // Fetch user's groups
  const fetchMyGroups = async () => {
    try {
      const result = await groupService.getMyGroups();
      if (result.success) {
        const groups = result.data?.data || result.data || [];
        setMyGroups(groups);
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Error fetching my groups:', error);
      setError('Failed to load your groups');
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (token && user) {
      const loadData = async () => {
        setLoading(true);
        await Promise.all([fetchAllGroups(), fetchMyGroups()]);
        setLoading(false);
      };
      loadData();
    }
  }, [token, user]);

  // Search filter
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredGroups(allGroups);
    } else {
      const filtered = allGroups.filter(group =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredGroups(filtered);
    }
  }, [searchTerm, allGroups]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Create new group
  const handleCreateGroup = async () => {
    if (!formData.name.trim()) {
      setError('Group name is required');
      return;
    }

    setCreateLoading(true);
    setError('');
    try {
      const result = await groupService.createGroup(formData);
      
      if (result.success) {
        setOpenCreateDialog(false);
        setFormData({ name: '', description: '' });
        await Promise.all([fetchAllGroups(), fetchMyGroups()]);
      } else {
        setError(result.error || 'Failed to create group');
      }
    } catch (error) {
      console.error('Error creating group:', error);
      setError(error.message || 'Failed to create group');
    } finally {
      setCreateLoading(false);
    }
  };

  // Join group
  const handleJoinGroup = async (groupId) => {
    try {
      const result = await groupService.joinGroup(groupId);
      if (result.success) {
        await Promise.all([fetchAllGroups(), fetchMyGroups()]);
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Error joining group:', error);
      setError('Failed to join group');
    }
  };

  // Check if user is member of a group
  const isGroupMember = (groupId) => {
    return myGroups.some(group => group._id === groupId || group.groupId === groupId);
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400, width: '100%' }}>
        <Box sx={{ textAlign: 'center' }}>
          <MuiCircularProgress sx={{ color: '#10b981', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#475569', fontWeight: 600 }}>Loading Groups...</Typography>
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
      
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 0.5, fontSize: { xs: '1.75rem', sm: '2rem' } }}>
              Groups 👥
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b' }}>
              Connect with like-minded people on your spiritual journey
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              onClick={() => Promise.all([fetchAllGroups(), fetchMyGroups()])}
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
                  borderColor: '#10b981',
                  backgroundColor: '#ecfdf5',
                  color: '#10b981'
                }
              }}
            >
              Refresh
            </Button>
            <Button
              onClick={() => setOpenCreateDialog(true)}
              startIcon={<Plus size={18} />}
              variant="contained"
              sx={{ 
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: 3,
                px: 3,
                fontWeight: 600,
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  boxShadow: '0 6px 20px rgba(16, 185, 129, 0.5)',
                }
              }}
            >
              Create Group
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
              color: '#10b981 !important',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#10b981',
              height: 3,
            }
          }}
        >
          <Tab label={`Discover (${allGroups.length})`} icon={<Search size={18} />} iconPosition="start" />
          <Tab label={`My Groups (${myGroups.length})`} icon={<Star size={18} />} iconPosition="start" />
        </Tabs>
      </Paper>

      {/* Search Bar for Discover Tab */}
      {activeTab === 0 && (
        <Paper sx={{ 
          mb: 3, 
          borderRadius: 3, 
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}>
          <TextField
            fullWidth
            placeholder="Search groups by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} color="#64748b" />
                </InputAdornment>
              ),
              sx: { 
                '& fieldset': { border: 'none' },
                px: 2,
                py: 1
              }
            }}
          />
        </Paper>
      )}

      {/* Groups Grid */}
      <Grid container spacing={3}>
        {activeTab === 0 && (
          <>
            {filteredGroups.length === 0 ? (
              <Grid size={{ xs: 12 }}>
                <Paper sx={{ 
                  p: 6, 
                  textAlign: 'center', 
                  borderRadius: 4, 
                  border: '2px dashed #e2e8f0',
                  background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)'
                }}>
                  <Box sx={{ 
                    width: 80, height: 80, borderRadius: '50%', 
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    mx: 'auto', mb: 3
                  }}>
                    <Users size={40} color="white" />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                    {searchTerm ? 'No groups found' : 'No groups available'}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#64748b', mb: 3 }}>
                    {searchTerm ? 'Try adjusting your search terms' : 'Be the first to create a group for your community!'}
                  </Typography>
                  {!searchTerm && (
                    <Button
                      variant="contained"
                      onClick={() => setOpenCreateDialog(true)}
                      startIcon={<Plus size={18} />}
                      sx={{ 
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        borderRadius: 3,
                        px: 4,
                        py: 1.5,
                        fontWeight: 600,
                      }}
                    >
                      Create Group
                    </Button>
                  )}
                </Paper>
              </Grid>
            ) : (
              filteredGroups.map((group) => {
                const isMember = isGroupMember(group._id);
                return (
                  <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={group._id}>
                    <Card sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 4,
                      border: '1px solid',
                      borderColor: isMember ? '#10b981' : '#e2e8f0',
                      background: isMember ? 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)' : 'white',
                      transition: 'all 0.3s ease',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 24px rgba(16, 185, 129, 0.15)'
                      }
                    }}>
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'start', gap: 2, mb: 2 }}>
                          <Avatar sx={{ 
                            width: 56, height: 56, 
                            background: isMember 
                              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                              : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                            fontSize: '1.5rem',
                            fontWeight: 700
                          }}>
                            {group.name?.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', lineHeight: 1.3 }}>
                              {group.name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                              <Calendar size={14} color="#64748b" />
                              <Typography variant="caption" sx={{ color: '#64748b' }}>
                                Created {new Date(group.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>

                        <Typography variant="body2" sx={{ color: '#64748b', mb: 3, minHeight: 40, lineHeight: 1.5 }}>
                          {group.description || 'No description available'}
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Chip
                            icon={<Users size={14} />}
                            label={`${group.memberCount || 0} members`}
                            size="small"
                            sx={{ 
                              fontWeight: 600,
                              backgroundColor: '#f1f5f9',
                              color: '#475569',
                              '& .MuiChip-icon': { color: '#475569' }
                            }}
                          />
                          
                          {isMember ? (
                            <Chip
                              icon={<Check size={14} />}
                              label="Joined"
                              size="small"
                              sx={{ 
                                fontWeight: 600,
                                backgroundColor: '#dcfce7',
                                color: '#16a34a',
                                '& .MuiChip-icon': { color: '#16a34a' }
                              }}
                            />
                          ) : (
                            <Button
                              size="small"
                              variant="contained"
                              startIcon={<UserPlus size={16} />}
                              onClick={() => handleJoinGroup(group._id)}
                              sx={{ 
                                borderRadius: 2,
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                fontWeight: 600,
                                textTransform: 'none',
                                '&:hover': { background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' }
                              }}
                            >
                              Join
                            </Button>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })
            )}
          </>
        )}

        {activeTab === 1 && (
          <>
            {myGroups.length === 0 ? (
              <Grid size={{ xs: 12 }}>
                <Paper sx={{ 
                  p: 6, 
                  textAlign: 'center', 
                  borderRadius: 4, 
                  border: '2px dashed #e2e8f0',
                  background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)'
                }}>
                  <Box sx={{ 
                    width: 80, height: 80, borderRadius: '50%', 
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    mx: 'auto', mb: 3
                  }}>
                    <Star size={40} color="white" />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                    You haven't joined any groups yet
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#64748b', mb: 3 }}>
                    Discover groups to connect with your community
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => setActiveTab(0)}
                    startIcon={<Search size={18} />}
                    sx={{ 
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      borderRadius: 3,
                      px: 4,
                      py: 1.5,
                      fontWeight: 600,
                    }}
                  >
                    Discover Groups
                  </Button>
                </Paper>
              </Grid>
            ) : (
              myGroups.map((group) => (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={group._id || group.groupId}>
                  <Card sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 4,
                    border: '2px solid #10b981',
                    background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                    transition: 'all 0.3s ease',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px rgba(16, 185, 129, 0.2)'
                    }
                  }}>
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'start', gap: 2, mb: 2 }}>
                        <Badge
                          overlap="circular"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          badgeContent={
                            <Box sx={{ 
                              width: 20, height: 20, borderRadius: '50%', 
                              background: '#10b981',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              border: '2px solid white'
                            }}>
                              <Star size={10} color="white" fill="white" />
                            </Box>
                          }
                        >
                          <Avatar sx={{ 
                            width: 56, height: 56, 
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            fontSize: '1.5rem',
                            fontWeight: 700
                          }}>
                            {group.name?.charAt(0).toUpperCase()}
                          </Avatar>
                        </Badge>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', lineHeight: 1.3 }}>
                            {group.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <Calendar size={14} color="#64748b" />
                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                              Joined {new Date(group.joinedAt || group.createdAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      <Typography variant="body2" sx={{ color: '#64748b', mb: 3, minHeight: 40, lineHeight: 1.5 }}>
                        {group.description || 'No description available'}
                      </Typography>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip
                          icon={<Users size={14} />}
                          label={`${group.memberCount || 0} members`}
                          size="small"
                          sx={{ 
                            fontWeight: 600,
                            backgroundColor: 'white',
                            color: '#10b981',
                            border: '1px solid #10b981',
                            '& .MuiChip-icon': { color: '#10b981' }
                          }}
                        />
                        
                        <Chip
                          icon={<Check size={14} />}
                          label="Member"
                          size="small"
                          sx={{ 
                            fontWeight: 600,
                            backgroundColor: '#10b981',
                            color: 'white',
                            '& .MuiChip-icon': { color: 'white' }
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </>
        )}
      </Grid>

      {/* Create Group Dialog */}
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
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Users size={24} color="white" />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Create New Group</Typography>
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
            name="name"
            label="Group Name"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleInputChange}
            helperText={`${formData.name.length}/100 characters`}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          <TextField
            name="description"
            label="Description"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={formData.description}
            onChange={handleInputChange}
            helperText={`${formData.description.length}/1000 characters`}
            placeholder="Describe your group's purpose and goals..."
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
            onClick={handleCreateGroup} 
            variant="contained" 
            disabled={createLoading || !formData.name.trim()}
            sx={{ 
              borderRadius: 2,
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              px: 4,
              '&:hover': { background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' }
            }}
          >
            {createLoading ? 'Creating...' : 'Create Group'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GroupComponent;
