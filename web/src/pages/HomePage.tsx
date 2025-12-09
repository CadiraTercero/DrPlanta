import React from 'react';
import { Container, Typography, Box, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          🌱 DrPlantes
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Your Plant Management Companion
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
          {user ? (
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/profile')}
            >
              Go to Profile
            </Button>
          ) : (
            <>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/register')}
              >
                Register
              </Button>
            </>
          )}
        </Stack>
      </Box>
    </Container>
  );
}
