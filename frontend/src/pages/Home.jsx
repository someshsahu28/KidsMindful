import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const features = [
  {
    title: 'Track Your Mood',
    description: "Use fun emojis to tell us how you're feeling each day.",
    color: '#FF6B6B',
    path: '/mood-tracker',
    emoji: '😊'
  },
  {
    title: 'Play Fun Games',
    description: 'Enjoy games that help you feel better and learn new things.',
    color: '#4ECDC4',
    path: '/games',
    emoji: '🎮'
  },
  {
    title: 'Calming Activities',
    description: 'Try breathing exercises and relaxation techniques.',
    color: '#96CEB4',
    path: '/activities',
    emoji: '🧘‍♂️'
  },
  {
    title: 'Get Help',
    description: 'Find resources and people who can help when you need it.',
    color: '#FFD93D',
    path: '/help',
    emoji: '💭'
  },
];

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const getWelcomeEmoji = () => {
    if (user?.gender === 'boy') {
      return '👦';
    } else if (user?.gender === 'girl') {
      return '👧';
    }
    return '😊';
  };

  return (
    <Container 
      maxWidth="lg"
      sx={{
        minHeight: 'calc(100vh - 64px)',
        py: 6,
        background: 'linear-gradient(135deg, #FFF0F0 0%, #F0F8FF 100%)',
      }}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Typography 
              variant="h1" 
              gutterBottom
              sx={{
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
                background: 'linear-gradient(45deg, #FF6B6B, #FF8E53, #FFD93D, #6BCB77, #4ECDC4, #96CEB4)',
                backgroundSize: '300% 300%',
                color: 'transparent',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'rainbow 4s ease infinite',
                '@keyframes rainbow': {
                  '0%': {
                    backgroundPosition: '0% 50%',
                  },
                  '50%': {
                    backgroundPosition: '100% 50%',
                  },
                  '100%': {
                    backgroundPosition: '0% 50%',
                  },
                },
                fontWeight: 800,
                letterSpacing: '0.5px',
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                mb: { xs: 2, sm: 3 },
                textAlign: 'center',
              }}
            >
              Welcome to KidsMindful! 🌈
            </Typography>
          </motion.div>
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#666',
              mb: { xs: 3, sm: 4 },
              maxWidth: '800px',
              mx: 'auto',
              px: { xs: 2, sm: 3 },
              fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem', lg: '1.6rem' },
              lineHeight: 1.6,
            }}
          >
            {user ? (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              >
                Hi {user.name}! {getWelcomeEmoji()}
              </motion.span>
            ) : ''}
            {' '}A safe space to explore your feelings and find ways to feel better
          </Typography>
          {!user && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
                sx={{
                  backgroundColor: '#FF9AA2',
                  '&:hover': { backgroundColor: '#FFB7B2' },
                  fontSize: '1.2rem',
                  py: 1.5,
                  px: 4,
                  borderRadius: '25px',
                  boxShadow: '0 4px 14px 0 rgba(255, 154, 162, 0.39)',
                }}
              >
                Join Us! 🌟
              </Button>
            </motion.div>
          )}
        </Box>
      </motion.div>

      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} sx={{ mb: { xs: 4, sm: 6 } }}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} key={feature.title}>
            <motion.div
              initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <Card
                onClick={() => navigate(feature.path)}
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  borderRadius: { xs: '16px', sm: '24px' },
                  background: `linear-gradient(135deg, ${feature.color} 0%, ${feature.color}DD 100%)`,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                  position: 'relative',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 12px 40px ${feature.color}40`,
                  },
                  transition: 'all 0.3s ease',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(circle at top right, rgba(255,255,255,0.2), transparent)',
                    opacity: 0.6,
                  }
                }}
              >
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: { xs: 2, sm: 3, md: 4 },
                    height: '100%',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Typography variant="h2" sx={{ 
                      fontSize: { xs: '3rem', sm: '3.5rem', md: '4rem' }, 
                      mb: { xs: 1, sm: 2 }, 
                      color: 'white' 
                    }}>
                      {feature.emoji}
                    </Typography>
                  </motion.div>
                  <Typography 
                    variant="h4" 
                    gutterBottom
                    sx={{
                      fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                      fontWeight: 600,
                      color: 'white',
                      mb: { xs: 1, sm: 2 },
                      textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{
                      fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                      lineHeight: 1.6,
                      color: 'rgba(255,255,255,0.95)',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Typography 
        variant="body1" 
        align="center"
        sx={{ 
          color: '#666',
          fontSize: { xs: '1.1rem', md: '1.2rem' },
          lineHeight: 1.8,
          maxWidth: '800px',
          mx: 'auto',
          mt: 'auto',
          mb: 2,
        }}
      >
        Everyone has feelings, and it's okay to talk about them.
        <br />
        We're here to help you understand and manage your emotions in a fun way! 💝
      </Typography>
    </Container>
  );
}

export default Home; 