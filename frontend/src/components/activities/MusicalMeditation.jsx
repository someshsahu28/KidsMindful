import { useState, useEffect } from 'react';
import { Box, Button, Typography, Grid, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import sounds from '../../utils/sounds';

const meditationSounds = [
  { name: 'Ocean Waves', emoji: '🌊', sound: sounds.nature.waves },
  { name: 'Forest Birds', emoji: '🦜', sound: sounds.nature.forest },
  { name: 'Rain Drops', emoji: '🌧️', sound: sounds.nature.rain },
  { name: 'Wind Chimes', emoji: '🎐', sound: sounds.nature.wind }
];

function MusicalMeditation() {
  const [playingSound, setPlayingSound] = useState(null);

  useEffect(() => {
    return () => {
      // Stop all sounds when component unmounts
      meditationSounds.forEach(({ sound }) => sound.stop());
    };
  }, []);

  const handleSoundClick = (soundItem) => {
    // Stop currently playing sound if any
    if (playingSound) {
      playingSound.sound.stop();
    }

    // If clicking the same sound that's playing, just stop it
    if (playingSound && playingSound.name === soundItem.name) {
      setPlayingSound(null);
      return;
    }

    // Play the new sound
    soundItem.sound.play();
    setPlayingSound(soundItem);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        width: '100%',
        minHeight: '600px',
        position: 'relative',
        backgroundColor: '#F0F8FF',
        borderRadius: '20px',
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mb: 4,
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ color: '#2C3E50', mb: 2 }}>
        Musical Meditation 🎵
      </Typography>

      <Typography variant="body1" sx={{ mb: 4, textAlign: 'center', color: '#444', maxWidth: '600px' }}>
        Click on a sound to play. Click again to stop. Take deep breaths and relax with the soothing sounds.
      </Typography>

      <Grid 
        container 
        spacing={3} 
        justifyContent="center"
        sx={{
          maxWidth: '900px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {meditationSounds.map((soundItem) => (
          <Grid item xs={12} sm={6} key={soundItem.name}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="contained"
                fullWidth
                onClick={() => handleSoundClick(soundItem)}
                sx={{
                  py: 3,
                  backgroundColor: playingSound?.name === soundItem.name ? '#E3F2FD' : '#fff',
                  color: '#444',
                  borderRadius: '15px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  minHeight: '180px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  '&:hover': {
                    backgroundColor: playingSound?.name === soundItem.name ? '#D4E9F7' : '#f5f5f5',
                  }
                }}
              >
                <Box>
                  <Typography variant="h2" sx={{ fontSize: '80px', mb: 2 }}>
                    {soundItem.emoji}
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {soundItem.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    {playingSound?.name === soundItem.name ? 'Playing...' : 'Click to Play'}
                  </Typography>
                </Box>
              </Button>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}

export default MusicalMeditation; 