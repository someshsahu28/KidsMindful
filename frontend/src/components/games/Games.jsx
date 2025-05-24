import { useState, useEffect } from 'react';
import { Box, Grid, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { soundManager } from '../../utils/soundManager';
import AnimalSoundGame from './AnimalSoundGame';
import ColorMatchGame from './ColorMatchGame';
import EmotionDetection from './EmotionDetection';
import EmotionExplorer from './EmotionExplorer';
import MemoryGame from './MemoryGame';
import MemoryGarden from './MemoryGarden';

function Games() {
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    // Stop all sounds when component unmounts
    return () => {
      soundManager.stopAllSounds();
    };
  }, []);

  useEffect(() => {
    // Stop all sounds when changing games
    soundManager.stopAllSounds();
  }, [selectedGame]);

  const games = [
    { name: 'Animal Sounds', emoji: '🐱', component: AnimalSoundGame },
    { name: 'Color Match', emoji: '🎨', component: ColorMatchGame },
    { name: 'Emotion Detective', emoji: '🔍', component: EmotionDetection },
    { name: 'Emotion Explorer', emoji: '🌈', component: EmotionExplorer },
    { name: 'Memory Match', emoji: '🎯', component: MemoryGame },
    { name: 'Memory Garden', emoji: '🌸', component: MemoryGarden },
  ];

  const handleGameSelect = (game) => {
    // Stop any playing sounds before switching games
    soundManager.stopAllSounds();
    setSelectedGame(game);
  };

  const handleBack = () => {
    // Stop any playing sounds before going back
    soundManager.stopAllSounds();
    setSelectedGame(null);
  };

  const handleGameComplete = (score) => {
    // Play completion sound and show score
    soundManager.playMatchSound();
    console.log(`Game completed with score: ${score}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h3" gutterBottom sx={{ textAlign: 'center', color: '#2C3E50', mb: 4 }}>
        Fun Games 🎮
      </Typography>

      {selectedGame ? (
        <Box>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h6"
                onClick={handleBack}
                sx={{
                  cursor: 'pointer',
                  color: '#666',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  '&:hover': { color: '#333' }
                }}
              >
                ← Back to Games
              </Typography>
            </Box>
            <selectedGame.component onGameComplete={handleGameComplete} />
          </motion.div>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {games.map((game) => (
            <Grid item xs={12} sm={6} md={4} key={game.name}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Paper
                  elevation={3}
                  onClick={() => handleGameSelect(game)}
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    cursor: 'pointer',
                    borderRadius: '20px',
                    backgroundColor: '#fff',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#F5F5F5',
                      transform: 'translateY(-5px)',
                    }
                  }}
                >
                  <Typography variant="h2" gutterBottom>
                    {game.emoji}
                  </Typography>
                  <Typography variant="h5" sx={{ color: '#2C3E50' }}>
                    {game.name}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default Games; 