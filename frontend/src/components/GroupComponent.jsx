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
  Avatar,
  Alert,
  Divider,
  Tooltip,
  Badge,
  Fab
} from '@mui/material';
import {
  Groups as GroupsIcon,
  Add as AddIcon,
  Person,
  PersonAdd,
  Close,
  Refresh,
  Search,
  Public,
  Lock,
  People,
  AdminPanelSettings,
  CalendarMonth,
  Star,
  Groups
} from '@mui/icons-material';
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
  const [activeTab, setActiveTab] = useState('discover'); // 'discover' or 'myGroups'
  
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
        setAllGroups(result.data);
        setFilteredGroups(result.data);
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
        setMyGroups(result.data);
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
        group.description.toLowerCase().includes(searchTerm.toLowerCase())
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

    if (formData.name.length > 100) {
      setError('Group name must be 100 characters or less');
      return;
    }

    if (formData.description.length > 1000) {
      setError('Description must be 1000 characters or less');
      return;
    }

    setCreateLoading(true);
    setError(''); // Clear previous errors
    try {
      const result = await groupService.createGroup(formData);
      
      if (result.success) {
        setOpenCreateDialog(false);
        setFormData({ name: '', description: '' });
        await Promise.all([fetchAllGroups(), fetchMyGroups()]);
        setError('');
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
        setError('');
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress sx={{ color: 'primary.main', mb: 2 }} />
          <Typography variant="h6">Loading Groups...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Groups
          </Typography>
          <Button
            onClick={() => Promise.all([fetchAllGroups(), fetchMyGroups()])}
            startIcon={<Refresh />}
            variant="outlined"
            disabled={loading}
            sx={{ 
              borderColor: 'primary.main', 
              color: 'primary.main',
              '&:hover': { borderColor: 'primary.dark', backgroundColor: 'primary.50' }
            }}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </Box>
        <Typography variant="h6" color="text.secondary">
          Connect with like-minded people on your spiritual journey
        </Typography>
      </Box>

      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
          <Button
            variant={activeTab === 'discover' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('discover')}
            startIcon={<Search />}
          >
            Discover Groups
          </Button>
          <Button
            variant={activeTab === 'myGroups' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('myGroups')}
            startIcon={<Groups />}
          >
            My Groups ({myGroups.length})
          </Button>
        </Box>

        
        {activeTab === 'discover' && (
          <TextField
            fullWidth
            placeholder="Search groups by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />
            }}
            sx={{ mb: 3 }}
          />
        )}
      </Box>

      
      <Grid container spacing={3}>
        {activeTab === 'discover' && (
          <>
            {filteredGroups.length === 0 ? (
              <Grid size={{ xs: 12 }}>
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                  <GroupsIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {searchTerm ? 'No groups found' : 'No groups available'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {searchTerm 
                      ? 'Try adjusting your search terms'
                      : 'Be the first to create a group for your community'
                    }
                  </Typography>
                </Paper>
              </Grid>
            ) : (
              filteredGroups.map((group) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={group._id}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                      }
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          sx={{
                            backgroundColor: 'primary.main',
                            mr: 2,
                            width: 50,
                            height: 50
                          }}
                        >
                          <GroupsIcon />
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {group.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Created {new Date(group.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, minHeight: 40 }}>
                        {group.description || 'No description available'}
                      </Typography>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip
                          icon={<People />}
                          label={`${group.memberCount || 0} members`}
                          size="small"
                          variant="outlined"
                        />
                        
                        {isGroupMember(group._id) ? (
                          <Chip
                            icon={<Star />}
                            label="Joined"
                            size="small"
                            color="success"
                            variant="filled"
                          />
                        ) : (
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<PersonAdd />}
                            onClick={() => handleJoinGroup(group._id)}
                          >
                            Join
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </>
        )}

        {activeTab === 'myGroups' && (
          <>
            {myGroups.length === 0 ? (
              <Grid size={{ xs: 12 }}>
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                  <Groups sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    You haven't joined any groups yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Discover groups to connect with your community
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => setActiveTab('discover')}
                    startIcon={<Search />}
                  >
                    Discover Groups
                  </Button>
                </Paper>
              </Grid>
            ) : (
              myGroups.map((group) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={group._id || group.groupId}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      border: '2px solid',
                      borderColor: 'success.main',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                      }
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Badge
                          badgeContent={<Star sx={{ fontSize: 12 }} />}
                          color="success"
                        >
                          <Avatar
                            sx={{
                              backgroundColor: 'success.main',
                              mr: 2,
                              width: 50,
                              height: 50
                            }}
                          >
                            <GroupsIcon />
                          </Avatar>
                        </Badge>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {group.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Joined {new Date(group.joinedAt || group.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, minHeight: 40 }}>
                        {group.description || 'No description available'}
                      </Typography>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip
                          icon={<People />}
                          label={`${group.memberCount || 0} members`}
                          size="small"
                          variant="outlined"
                          color="success"
                        />
                        
                        <Chip
                          icon={<Star />}
                          label="Member"
                          size="small"
                          color="success"
                          variant="filled"
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

      
      <Fab
        color="primary"
        aria-label="create group"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setOpenCreateDialog(true)}
      >
        <AddIcon />
      </Fab>

      
      <Dialog 
        open={openCreateDialog} 
        onClose={() => setOpenCreateDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Create New Group</Typography>
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
            name="name"
            label="Group Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleInputChange}
            helperText={`${formData.name.length}/100 characters`}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={formData.description}
            onChange={handleInputChange}
            helperText={`${formData.description.length}/1000 characters`}
            placeholder="Describe your group's purpose and goals..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateGroup} 
            variant="contained" 
            disabled={createLoading || !formData.name.trim()}
          >
            {createLoading ? 'Creating...' : 'Create Group'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GroupComponent;
