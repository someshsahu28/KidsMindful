import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await login(formData.username, formData.password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Login failed. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              width: '100%',
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            <Typography component="h1" variant="h4" align="center" gutterBottom>
              Welcome Back! 👋
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={formData.username}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: '#FF9AA2',
                  '&:hover': { backgroundColor: '#FFB7B2' }
                }}
              >
                Login
              </Button>
              <Button
                fullWidth
                onClick={() => navigate('/register')}
                sx={{ color: '#666' }}
              >
                Don't have an account? Sign up!
              </Button>
            </Box>
          </Paper>
        </Box>
      </motion.div>
    </Container>
  );
}

export default Login; 