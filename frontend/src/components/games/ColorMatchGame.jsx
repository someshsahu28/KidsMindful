import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { soundManager } from '../../utils/soundManager';

function ColorMatchGame({ onGameComplete }) {
  const [score, setScore] = useState(0);
  const [currentColor, setCurrentColor] = useState(null);
  const [currentWord, setCurrentWord] = useState('');
  const [options, setOptions] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => {
        clearInterval(timer);
        soundManager.stopAllSounds();
      };
    } else if (timeLeft === 0) {
      setGameOver(true);
      onGameComplete(score);
    }
  }, [timeLeft, gameOver, score, onGameComplete]);

  useEffect(() => {
    generateNewRound();
    // Cleanup sounds when component unmounts
    return () => {
      soundManager.stopAllSounds();
    };
  }, []);

  const generateNewRound = () => {
    const colorIndex = Math.floor(Math.random() * colors.length);
    const wordIndex = Math.floor(Math.random() * colors.length);
    setCurrentColor(colors[colorIndex]);
    setCurrentWord(colors[wordIndex]);
    
    const shuffledOptions = [...colors]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    if (!shuffledOptions.includes(colors[colorIndex])) {
      shuffledOptions[0] = colors[colorIndex];
    }
    setOptions(shuffledOptions.sort(() => Math.random() - 0.5));
  };

  const handleAnswer = (selectedColor) => {
    soundManager.playClickSound();
    
    if (selectedColor === currentColor) {
      soundManager.playMatchSound();
      setScore(s => s + 1);
    } else {
      soundManager.playErrorSound();
    }
    generateNewRound();
  };

  return (
    <Box sx={{ textAlign: 'center', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Time Left: {timeLeft}s | Score: {score}
      </Typography>
      <Typography
        variant="h1"
        sx={{ 
          color: currentColor, 
          mb: 6,
          fontSize: '100px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
        }}
      >
        {currentWord}
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {options.map((color, index) => (
          <Grid item key={index}>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="contained"
                onClick={() => handleAnswer(color)}
                sx={{
                  backgroundColor: color,
                  width: 150,
                  height: 80,
                  borderRadius: '20px',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                  '&:hover': {
                    backgroundColor: color,
                    opacity: 0.9,
                  },
                }}
              />
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ColorMatchGame; 