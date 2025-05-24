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
  Slider,
  Grid,
  Card,
  CardContent,
  CardActionArea,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { gender } from '../theme/colors';

const genderOptions = [
  {
    id: 'boy',
    label: 'Boy',
    emoji: '👦',
    colors: gender.boys,
    avatar: '/avatars/boy.png'
  },
  {
    id: 'girl',
    label: 'Girl',
    emoji: '👧',
    colors: gender.girls,
    avatar: '/avatars/girl.png'
  }
];

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    age: 8,
    gender: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for the field being changed
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleAgeChange = (_, value) => {
    setFormData(prev => ({
      ...prev,
      age: value
    }));
    if (errors.age) {
      setErrors(prev => ({
        ...prev,
        age: null
      }));
    }
  };

  const handleGenderSelect = (gender) => {
    setFormData(prev => ({
      ...prev,
      gender: gender.id
    }));
    if (errors.gender) {
      setErrors(prev => ({
        ...prev,
        gender: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const result = await register(formData);
      
      if (result.success) {
        navigate('/');
      } else {
        if (result.errors) {
          setErrors(result.errors);
        } else {
          setErrors({ general: result.error || 'Registration failed. Please try again.' });
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: 'Unable to connect to server. Please try again later.' });
    } finally {
      setIsSubmitting(false);
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
              Join KidsMindful! 🌈
            </Typography>
            
            {errors.general && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errors.general}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Are you a boy or a girl?
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {genderOptions.map((option) => (
                  <Grid item xs={6} key={option.id}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Card
                        onClick={() => handleGenderSelect(option)}
                        sx={{
                          backgroundColor: formData.gender === option.id ? 
                            option.colors.background : 'white',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          border: formData.gender === option.id ?
                            `2px solid ${option.colors.primary}` : '2px solid transparent',
                          ...(errors.gender && {
                            borderColor: 'error.main',
                          }),
                        }}
                      >
                        <CardActionArea>
                          <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h2" component="div">
                              {option.emoji}
                            </Typography>
                            <Typography variant="h6" sx={{ mt: 1 }}>
                              {option.label}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
              {errors.gender && (
                <Typography color="error" variant="caption" sx={{ mt: -2, mb: 2, display: 'block' }}>
                  {errors.gender}
                </Typography>
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Your Name"
                name="name"
                autoComplete="name"
                autoFocus
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                value={formData.username}
                onChange={handleChange}
                error={!!errors.username}
                helperText={errors.username}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
              />
              <Box sx={{ mt: 3 }}>
                <Typography gutterBottom>
                  How old are you? {formData.age} years old
                </Typography>
                <Slider
                  value={formData.age}
                  onChange={handleAgeChange}
                  min={5}
                  max={12}
                  step={1}
                  marks
                  valueLabelDisplay="auto"
                  sx={{
                    color: formData.gender === 'boy' ? 
                      gender.boys.primary : 
                      formData.gender === 'girl' ? 
                        gender.girls.primary : 
                        '#FF9AA2',
                    '& .MuiSlider-thumb': {
                      '&:hover, &.Mui-focusVisible': {
                        boxShadow: `0 0 0 8px ${
                          formData.gender === 'boy' ? 
                            'rgba(74, 144, 226, 0.16)' : 
                            formData.gender === 'girl' ? 
                              'rgba(255, 105, 180, 0.16)' : 
                              'rgba(255, 154, 162, 0.16)'
                        }`,
                      },
                    },
                    ...(errors.age && {
                      '& .MuiSlider-rail': { backgroundColor: 'error.main' },
                    }),
                  }}
                />
                {errors.age && (
                  <Typography color="error" variant="caption">
                    {errors.age}
                  </Typography>
                )}
              </Box>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isSubmitting}
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: formData.gender === 'boy' ? 
                    gender.boys.primary : 
                    formData.gender === 'girl' ? 
                      gender.girls.primary : 
                      '#FF9AA2',
                  '&:hover': {
                    backgroundColor: formData.gender === 'boy' ? 
                      gender.boys.secondary : 
                      formData.gender === 'girl' ? 
                        gender.girls.secondary : 
                        '#FFB7B2'
                  }
                }}
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </Button>
              <Button
                fullWidth
                onClick={() => navigate('/login')}
                sx={{ color: '#666' }}
              >
                Already have an account? Login!
              </Button>
            </Box>
          </Paper>
        </Box>
      </motion.div>
    </Container>
  );
}

export default Register; 