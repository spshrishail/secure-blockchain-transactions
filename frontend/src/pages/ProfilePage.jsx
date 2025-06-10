import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Avatar,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';

const ProfilePage = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [loading, setLoading] = useState(true);
  const [openEdit, setOpenEdit] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      walletAddress: user?.walletAddress || ''
    }
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/auth/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      reset(data.user); // Update form default values
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      setUser(result.user);
      localStorage.setItem('user', JSON.stringify(result.user));
      setOpenEdit(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress sx={{ color: '#00ff94' }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{
        background: 'rgba(26, 26, 26, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        p: 4
      }}>
        <Grid container spacing={4}>
          {/* Profile Header */}
          <Grid item xs={12} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: '#00ff94',
                  fontSize: '2.5rem'
                }}
              >
                {user?.fullName?.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ color: '#00ff94', fontFamily: 'Orbitron' }}>
                  {user?.fullName}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: '#cccccc' }}>
                  {user?.email}
                </Typography>
              </Box>
              <Button
                startIcon={<EditIcon />}
                onClick={() => setOpenEdit(true)}
                sx={{
                  ml: 'auto',
                  color: '#00ff94',
                  borderColor: '#00ff94',
                  '&:hover': { borderColor: '#00cc75', color: '#00cc75' }
                }}
                variant="outlined"
              >
                Edit Profile
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 2 }} />
          </Grid>

          {/* Profile Details */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ color: '#00ff94', mb: 2, fontFamily: 'Orbitron' }}>
              Account Details
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#cccccc' }}>
                  Full Name
                </Typography>
                <Typography variant="body1" sx={{ color: 'white' }}>
                  {user?.fullName}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#cccccc' }}>
                  Email Address
                </Typography>
                <Typography variant="body1" sx={{ color: 'white' }}>
                  {user?.email}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#cccccc' }}>
                  Phone Number
                </Typography>
                <Typography variant="body1" sx={{ color: 'white' }}>
                  {user?.phone || 'Not provided'}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ color: '#00ff94', mb: 2, fontFamily: 'Orbitron' }}>
              Wallet Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#cccccc' }}>
                  Wallet Address
                </Typography>
                <Typography variant="body1" sx={{ color: 'white', wordBreak: 'break-all' }}>
                  {user?.walletAddress || 'No wallet connected'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#cccccc' }}>
                  Account Created
                </Typography>
                <Typography variant="body1" sx={{ color: 'white' }}>
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Edit Profile Dialog */}
      <Dialog 
        open={openEdit} 
        onClose={() => setOpenEdit(false)}
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }
        }}
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  {...register('fullName', { required: 'Full name is required' })}
                  error={!!errors.fullName}
                  helperText={errors.fullName?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  {...register('phone')}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained" 
              sx={{ 
                bgcolor: '#00ff94', 
                color: '#000',
                '&:hover': { bgcolor: '#00cc75' }
              }}
            >
              Save Changes
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default ProfilePage; 