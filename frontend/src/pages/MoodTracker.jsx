import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  Snackbar,
  Alert,
  Paper,
  CircularProgress,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { useAuth } from '../context/AuthContext';
import { fetchWithAuth } from '../config/api';

const moods = [
  { emoji: '😊', name: 'Happy', color: '#FFD700', message: "That's wonderful! Keep spreading joy!" },
  { emoji: '😢', name: 'Sad', color: '#87CEEB', message: "It's okay to feel sad sometimes. Would you like a hug? 🤗" },
  { emoji: '😡', name: 'Angry', color: '#FF6B6B', message: "Take a deep breath. Let's find a way to feel better!" },
  { emoji: '😴', name: 'Tired', color: '#A0A0A0', message: "Everyone needs rest sometimes. Take it easy!" },
  { emoji: '😨', name: 'Worried', color: '#9370DB', message: "Don't worry, we're here to help you feel safe!" },
  { emoji: '🤗', name: 'Excited', color: '#98FB98', message: "Yay! Your excitement is contagious!" },
];

const encouragements = [
  "You're doing great! 🌟",
  "Every feeling is okay! 🌈",
  "You're so brave for sharing! 💪",
  "We care about how you feel! 💖",
];

function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [moodHistory, setMoodHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [encouragement, setEncouragement] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      fetchMoodHistory();
    }
  }, [user]);

  useEffect(() => {
    if (selectedMood !== null) {
      setEncouragement(encouragements[Math.floor(Math.random() * encouragements.length)]);
    }
  }, [selectedMood]);

  const fetchMoodHistory = async () => {
    try {
      setLoading(true);
      const data = await fetchWithAuth(`moods/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      setMoodHistory(data);
    } catch (error) {
      console.error('Error fetching mood history:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Could not load your mood history. Please try again later.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMoodSelect = async (index) => {
    setSelectedMood(index);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);

    try {
      setLoading(true);
      await fetchWithAuth('moods', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          mood: moods[index].name,
          userId: user.id,
          note: `Feeling ${moods[index].name.toLowerCase()} today!`
        }),
      });

      setSnackbar({
        open: true,
        message: moods[index].message,
        severity: 'success'
      });
      
      await fetchMoodHistory();
    } catch (error) {
      console.error('Error saving mood:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Oops! Could not save your mood. Please try again!',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Typography variant="h1" align="center" sx={{ mb: 2 }}>
          How Are You Feeling Today? 🌈
        </Typography>
        <Typography variant="h5" align="center" sx={{ mb: 6, color: '#666' }}>
          Click on the emoji that matches your mood!
        </Typography>
      </motion.div>

      <Grid container spacing={3}>
        {moods.map((mood, index) => (
          <Grid item xs={6} md={4} key={mood.name}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                sx={{
                  cursor: 'pointer',
                  backgroundColor: selectedMood === index ? mood.color : 'white',
                  transition: 'all 0.3s ease',
                  height: '100%',
                  borderRadius: '20px',
                  boxShadow: selectedMood === index 
                    ? '0 8px 16px rgba(0,0,0,0.2)' 
                    : '0 4px 8px rgba(0,0,0,0.1)',
                  transform: selectedMood === index ? 'translateY(-8px)' : 'none',
                }}
                onClick={() => handleMoodSelect(index)}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 2,
                      p: 2,
                    }}
                  >
                    <motion.div
                      animate={selectedMood === index ? {
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0],
                      } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <Typography variant="h2" sx={{ fontSize: '4rem' }}>
                        {mood.emoji}
                      </Typography>
                    </motion.div>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 'bold',
                        color: selectedMood === index ? 'white' : 'inherit',
                      }}
                    >
                      {mood.name}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <AnimatePresence>
        {selectedMood !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ textAlign: 'center', mt: 6 }}>
              <Typography variant="h4" sx={{ mb: 2, color: moods[selectedMood].color }}>
                {encouragement}
              </Typography>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {moodHistory.length > 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Paper
            elevation={3}
            sx={{
              mt: 6,
              p: 3,
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,245,245,0.95) 100%)',
            }}
          >
            <Typography variant="h2" align="center" gutterBottom>
              Your Mood Journey 📝
            </Typography>
            <Grid container spacing={2}>
              {moodHistory.slice(0, 5).map((entry, index) => (
                <Grid item xs={12} sm={6} md={2.4} key={entry.id}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      sx={{
                        backgroundColor: moods.find(m => m.name === entry.mood)?.color || 'white',
                        opacity: 0.9,
                        borderRadius: '15px',
                        transform: 'rotate(-2deg)',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'rotate(0deg) scale(1.05)',
                        },
                      }}
                    >
                      <CardContent>
                        <Typography variant="h4" align="center">
                          {moods.find(m => m.name === entry.mood)?.emoji}
                        </Typography>
                        <Typography variant="body2" align="center" sx={{ mt: 1, color: 'white' }}>
                          {new Date(entry.date).toLocaleDateString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </motion.div>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            borderRadius: '15px',
            fontSize: '1.1rem',
            '& .MuiAlert-icon': {
              fontSize: '2rem'
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default MoodTracker; 