import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Button } from '@mui/material';
import { motion } from 'framer-motion';
import sounds from '../../utils/sounds';

function EmotionGuessGame({ onGameComplete }) {
  const [score, setScore] = useState(0);
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [round, setRound] = useState(1);

  const emotions = [
    { emoji: '😊', name: 'happy' },
    { emoji: '😢', name: 'sad' },
    { emoji: '😠', name: 'angry' },
    { emoji: '😨', name: 'scared' },
    { emoji: '😴', name: 'sleepy' },
    { emoji: '🤔', name: 'thinking' },
    { emoji: '🥳', name: 'excited' },
    { emoji: '🤗', name: 'loving' },
    { emoji: '😎', name: 'cool' },
    { emoji: '🤪', name: 'silly' },
  ];

  useEffect(() => {
    generateNewRound();
  }, []);

  const generateNewRound = () => {
    if (round > 10) {
      setGameOver(true);
      const finalScore = Math.floor((score / 10) * 100);
      onGameComplete(finalScore);
      return;
    }
    const emotion = emotions[Math.floor(Math.random() * emotions.length)];
    setCurrentEmotion(emotion);
  };

  const handleAnswer = (selectedName) => {
    if (selectedName === currentEmotion.name) {
      sounds.match.play();
      setScore(s => s + 1);
    } else {
      sounds.effects.error.play();
    }
    setRound(r => r + 1);
    generateNewRound();
  };

  return (
    <Box sx={{ textAlign: 'center', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Round: {round}/10 | Score: {score}
      </Typography>
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Typography variant="h1" sx={{ fontSize: '150px', mb: 4 }}>
          {currentEmotion?.emoji}
        </Typography>
      </motion.div>
      <Grid container spacing={2} justifyContent="center">
        {emotions.map((emotion) => (
          <Grid item xs={6} sm={4} key={emotion.name}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="contained"
                onClick={() => handleAnswer(emotion.name)}
                sx={{
                  width: '100%',
                  py: 2,
                  backgroundColor: '#FF9AA2',
                  borderRadius: '20px',
                  fontSize: '1.2rem',
                  '&:hover': {
                    backgroundColor: '#FFB7B2',
                  },
                }}
              >
                {emotion.name}
              </Button>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default EmotionGuessGame; 