import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  Grid,
  Chip,
} from '@mui/material';
import {
  PersonOutline,
  EmailOutlined,
  CalendarTodayOutlined,
  LogoutOutlined,
  RefreshOutlined,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, checkAuth, loading } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setError('');
    try {
      await checkAuth();
    } catch (err: any) {
      setError(err.message || 'Failed to refresh profile');
    } finally {
      setRefreshing(false);
    }
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  if (loading && !user) {
    return (
      <Container maxWidth="md">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 8 }}>
          <Alert severity="error">No user data available. Please log in again.</Alert>
          <Button
            variant="contained"
            onClick={() => navigate('/login')}
            sx={{ mt: 2 }}
          >
            Go to Login
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4, minHeight: '100vh' }}>
        <Card elevation={3}>
          <CardContent sx={{ p: 4 }}>
            {/* Header Section */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  margin: '0 auto',
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: '2rem',
                }}
              >
                {getInitials(user.name)}
              </Avatar>
              <Typography variant="h4" gutterBottom>
                {user.name}
              </Typography>
              <Chip
                label={user.role}
                color="primary"
                size="small"
                sx={{ textTransform: 'capitalize' }}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Profile Information */}
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Profile Information
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <PersonOutline color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Full Name
                    </Typography>
                    <Typography variant="body1">{user.name}</Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <EmailOutlined color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Email Address
                    </Typography>
                    <Typography variant="body1">{user.email}</Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CalendarTodayOutlined color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Member Since
                    </Typography>
                    <Typography variant="body1">{formatDate(user.createdAt)}</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <Button
                variant="outlined"
                startIcon={refreshing ? <CircularProgress size={20} /> : <RefreshOutlined />}
                onClick={handleRefresh}
                disabled={refreshing}
                fullWidth
              >
                Refresh Profile
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<LogoutOutlined />}
                onClick={handleLogout}
                fullWidth
              >
                Logout
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default ProfilePage;
