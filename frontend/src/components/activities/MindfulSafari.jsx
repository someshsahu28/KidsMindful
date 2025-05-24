import { useState, useEffect } from 'react';
import { Box, Button, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import sounds from '../../utils/sounds';
import { soundManager } from '../../utils/soundManager';

const animals = [
  { name: 'Cat', emoji: '🐱', sound: sounds.animals.cat },
  { name: 'Dog', emoji: '🐶', sound: sounds.animals.dog },
  { name: 'Bird', emoji: '🐦', sound: sounds.animals.bird },
  { name: 'Lion', emoji: '🦁', sound: sounds.animals.lion }
];

function MindfulSafari() {
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [soundError, setSoundError] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('checking');

  useEffect(() => {
    // Check if animal sounds are available and loaded
    const checkSounds = () => {
      setLoadingStatus('checking');
      
      const missingOrNotLoaded = animals.some(animal => {
        const isAvailable = animal.sound && typeof animal.sound.play === 'function';
        const isLoaded = animal.sound && animal.sound.isLoaded && animal.sound.isLoaded();
        return !isAvailable || !isLoaded;
      });

      setSoundError(missingOrNotLoaded);
      setLoadingStatus(missingOrNotLoaded ? 'error' : 'ready');
    };

    checkSounds();

    // Cleanup function to stop all sounds when component unmounts
    return () => {
      soundManager.stopAllSounds();
      if (selectedAnimal && selectedAnimal.sound) {
        try {
          selectedAnimal.sound.stop();
        } catch (error) {
          console.error('Error stopping sound:', error);
        }
      }
    };
  }, []);

  // Add event listener for page visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && selectedAnimal && selectedAnimal.sound) {
        try {
          selectedAnimal.sound.stop();
          setSelectedAnimal(null);
        } catch (error) {
          console.error('Error stopping sound:', error);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [selectedAnimal]);

  const handleAnimalClick = (animal) => {
    try {
      // Stop currently playing sound if any
      if (selectedAnimal && selectedAnimal.sound) {
        selectedAnimal.sound.stop();
      }

      // If clicking the same animal that's playing, just stop it
      if (selectedAnimal && selectedAnimal.name === animal.name) {
        setSelectedAnimal(null);
        return;
      }

      // Play the new sound
      if (animal.sound && animal.sound.play) {
        animal.sound.play();
        setSelectedAnimal(animal);
      }
    } catch (error) {
      console.error('Error handling animal sound:', error);
      setSoundError(true);
      setSelectedAnimal(null);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '600px', // Increased minimum height
        position: 'relative',
        backgroundColor: '#BAFFC9',
        borderRadius: '20px',
        p: 4, // Increased padding
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mb: 4, // Added margin bottom
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ color: '#2C3E50', mb: 2 }}>
        Mindful Safari 🌿
      </Typography>

      <Typography variant="body1" sx={{ mb: 4, textAlign: 'center', color: '#444', maxWidth: '600px' }}>
        Click on the animals to hear their peaceful sounds. Take deep breaths and imagine being in nature with them.
      </Typography>

      {loadingStatus === 'checking' && (
        <Typography sx={{ mb: 2, color: '#666' }}>
          Loading animal sounds...
        </Typography>
      )}

      {soundError && (
        <Typography 
          variant="body2" 
          color="error" 
          sx={{ mb: 2 }}
        >
          Some animal sounds are not available. Please check your internet connection.
        </Typography>
      )}

      <Grid 
        container 
        spacing={3} 
        justifyContent="center"
        sx={{
          maxWidth: '900px', // Added max width to contain cards
          margin: '0 auto', // Center the grid
          width: '100%',
        }}
      >
        {animals.map((animal) => (
          <Grid item xs={12} sm={6} key={animal.name}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="contained"
                fullWidth
                onClick={() => handleAnimalClick(animal)}
                disabled={loadingStatus === 'checking'}
                sx={{
                  py: 3,
                  backgroundColor: selectedAnimal?.name === animal.name ? '#98E5A6' : '#fff',
                  color: '#444',
                  borderRadius: '15px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  minHeight: '180px', // Added minimum height
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  '&:hover': {
                    backgroundColor: selectedAnimal?.name === animal.name ? '#7DD389' : '#f5f5f5',
                  },
                  '&.Mui-disabled': {
                    backgroundColor: '#f0f0f0',
                    color: '#999'
                  }
                }}
              >
                <Box>
                  <Typography variant="h3" gutterBottom>
                    {animal.emoji}
                  </Typography>
                  <Typography variant="h6">
                    {animal.name}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
                    {loadingStatus === 'checking' ? 'Loading...' :
                      selectedAnimal?.name === animal.name ? 'Playing...' : 'Click to Listen'}
                  </Typography>
                </Box>
              </Button>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default MindfulSafari; 