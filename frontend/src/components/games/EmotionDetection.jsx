import { useState, useEffect } from 'react';
import { Box, Button, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { soundManager } from '../../utils/soundManager';
import sounds from '../../utils/sounds';

const LEVELS = {
  EASY: {
    name: 'Easy',
    emotions: ['happy', 'sad', 'angry', 'scared'],
    timeLimit: 45,
    color: '#98FB98'
  },
  MEDIUM: {
    name: 'Medium',
    emotions: ['happy', 'sad', 'angry', 'scared', 'sleepy', 'sick'],
    timeLimit: 30,
    color: '#FFD700'
  },
  HARD: {
    name: 'Hard',
    emotions: ['happy', 'sad', 'angry', 'scared', 'sleepy', 'sick', 'surprised', 'loved'],
    timeLimit: 20,
    color: '#FF6B6B'
  }
};

const emotions = {
  happy: { emoji: '😊', name: 'happy' },
  sad: { emoji: '😢', name: 'sad' },
  angry: { emoji: '😠', name: 'angry' },
  scared: { emoji: '😨', name: 'scared' },
  sleepy: { emoji: '😴', name: 'sleepy' },
  sick: { emoji: '🤢', name: 'sick' },
  surprised: { emoji: '😲', name: 'surprised' },
  loved: { emoji: '🥰', name: 'loved' },
};

function EmotionDetection({ onGameComplete }) {
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [options, setOptions] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(LEVELS.EASY);
  const [timeLeft, setTimeLeft] = useState(LEVELS.EASY.timeLimit);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);

  useEffect(() => {
    return () => {
      if (sounds.effects) {
        Object.values(sounds.effects).forEach(sound => {
          if (sound && sound.stop) sound.stop();
        });
      }
      soundManager.stopAllSounds();
    };
  }, []);

  useEffect(() => {
    if (!gameOver) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setGameOver(true);
            if (sounds.effects) {
              Object.values(sounds.effects).forEach(sound => {
                if (sound && sound.stop) sound.stop();
              });
            }
            if (sounds.effects?.complete) {
              sounds.effects.complete.play();
            }
            onGameComplete(score);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearInterval(timer);
        if (sounds.effects) {
          Object.values(sounds.effects).forEach(sound => {
            if (sound && sound.stop) sound.stop();
          });
        }
        soundManager.stopAllSounds();
      };
    }
  }, [gameOver]);

  useEffect(() => {
    if (round < 10 && !gameOver) {
      startNewRound();
    } else if (round >= 10) {
      setGameOver(true);
      if (sounds.effects) {
        Object.values(sounds.effects).forEach(sound => {
          if (sound && sound.stop) sound.stop();
        });
      }
      if (sounds.effects?.complete) {
        sounds.effects.complete.play();
      }
      onGameComplete(score);
    }
  }, [round]);

  useEffect(() => {
    if (consecutiveCorrect >= 3 && currentLevel === LEVELS.EASY) {
      setCurrentLevel(LEVELS.MEDIUM);
      setTimeLeft(LEVELS.MEDIUM.timeLimit);
      sounds.effects.success.play();
    } else if (consecutiveCorrect >= 5 && currentLevel === LEVELS.MEDIUM) {
      setCurrentLevel(LEVELS.HARD);
      setTimeLeft(LEVELS.HARD.timeLimit);
      sounds.effects.success.play();
    }
  }, [consecutiveCorrect]);

  const startNewRound = () => {
    sounds.effects.click.play();
    const availableEmotions = currentLevel.emotions.map(name => emotions[name]);
    const correctEmotion = availableEmotions[Math.floor(Math.random() * availableEmotions.length)];
    let roundOptions = [correctEmotion];
    
    while (roundOptions.length < 4) {
      const option = availableEmotions[Math.floor(Math.random() * availableEmotions.length)];
      if (!roundOptions.find(e => e.name === option.name)) {
        roundOptions.push(option);
      }
    }
    
    roundOptions = roundOptions.sort(() => Math.random() - 0.5);
    setCurrentEmotion(correctEmotion);
    setOptions(roundOptions);
  };

  const handleGuess = (emotion) => {
    sounds.effects.click.play();
    
    if (emotion.name === currentEmotion.name) {
      sounds.effects.success.play();
      setScore(score + 1);
      setConsecutiveCorrect(prev => prev + 1);
    } else {
      sounds.effects.error.play();
      setConsecutiveCorrect(0);
    }
    setRound(round + 1);
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '600px',
        backgroundColor: '#F5F5F5',
        borderRadius: '20px',
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ color: '#4A4A4A', mb: 3 }}>
        Emotion Detective 🔍
      </Typography>

      {!gameOver && (
        <>
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ color: currentLevel.color, mb: 1 }}>
              Level: {currentLevel.name}
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Time Left: {timeLeft}s | Score: {score}/10
            </Typography>
          </Box>

          {currentEmotion && (
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Typography variant="h1" sx={{ fontSize: '120px', mb: 2 }}>
                  {currentEmotion.emoji}
                </Typography>
                <Typography variant="h5" sx={{ color: '#666' }}>
                  What emotion is this?
                </Typography>
              </motion.div>
            </Box>
          )}

          <Grid container spacing={2} justifyContent="center">
            {options.map((emotion, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => handleGuess(emotion)}
                    sx={{
                      p: 2,
                      backgroundColor: '#fff',
                      color: '#444',
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                      },
                    }}
                  >
                    <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                      {emotion.name}
                    </Typography>
                  </Button>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {gameOver && (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Game Over!
          </Typography>
          <Typography variant="h4" sx={{ mb: 4 }}>
            Final Score: {score}/10
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default EmotionDetection; 