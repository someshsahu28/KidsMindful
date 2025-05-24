import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Button, CircularProgress, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import sounds from '../../utils/sounds';
import { soundManager } from '../../utils/soundManager';

const flowers = [
  { emoji: '🌸', name: 'Cherry Blossom', color: '#FFB7EB' },
  { emoji: '🌹', name: 'Rose', color: '#FF9AA2' },
  { emoji: '🌻', name: 'Sunflower', color: '#FFE66D' },
  { emoji: '🌼', name: 'Daisy', color: '#FFFFBA' },
];

function MemoryGarden({ onGameComplete }) {
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [garden, setGarden] = useState([]);
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    return () => {
      // Stop all sounds when component unmounts
      if (sounds.effects) {
        Object.values(sounds.effects).forEach(sound => {
          if (sound && sound.stop) sound.stop();
        });
      }
      if (sounds.match && sounds.match.stop) {
        sounds.match.stop();
      }
      soundManager.stopAllSounds();
    };
  }, []);

  useEffect(() => {
    if (gameOver) {
      // Stop all sounds when game is over
      if (sounds.effects) {
        Object.values(sounds.effects).forEach(sound => {
          if (sound && sound.stop) sound.stop();
        });
      }
      if (sounds.match && sounds.match.stop) {
        sounds.match.stop();
      }
      soundManager.stopAllSounds();
    }
  }, [gameOver]);

  useEffect(() => {
    if (round <= 10 && !gameOver && !showInstructions) {
      generateSequence();
    }
  }, [round, showInstructions]);

  const generateSequence = () => {
    const newFlower = flowers[Math.floor(Math.random() * flowers.length)];
    setSequence([...sequence, newFlower]);
    playSequence([...sequence, newFlower]);
  };

  const playSequence = async (seq) => {
    setPlaying(true);
    // Stop any currently playing sounds
    if (sounds.effects) {
      Object.values(sounds.effects).forEach(sound => {
        if (sound && sound.stop) sound.stop();
      });
    }
    if (sounds.match && sounds.match.stop) {
      sounds.match.stop();
    }
    soundManager.stopAllSounds();

    // Show each flower in sequence
    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      try {
        if (sounds.match && sounds.match.play) {
          sounds.match.play();
        }
      } catch (error) {
        console.error('Error playing sound:', error);
      }
    }
    setPlaying(false);
    setUserSequence([]);
  };

  const handleFlowerClick = (flower) => {
    if (playing) return;

    const newUserSequence = [...userSequence, flower];
    setUserSequence(newUserSequence);
    
    try {
      if (sounds.match && sounds.match.play) {
        sounds.match.play();
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }

    // Check if the clicked flower matches the sequence
    if (newUserSequence[newUserSequence.length - 1].name !== 
        sequence[newUserSequence.length - 1].name) {
      try {
        if (sounds.effects && sounds.effects.error) {
          // Stop other sounds before playing error sound
          Object.values(sounds.effects).forEach(sound => {
            if (sound && sound.stop) sound.stop();
          });
          sounds.effects.error.play();
        }
      } catch (error) {
        console.error('Error playing sound:', error);
      }
      setGameOver(true);
      onGameComplete(score);
      return;
    }

    // If the sequence is complete
    if (newUserSequence.length === sequence.length) {
      setGarden([...garden, sequence[sequence.length - 1]]);
      setScore(score + 1);
      setRound(round + 1);
      if (round >= 10) {
        setGameOver(true);
        // Stop all sounds before playing completion sound
        if (sounds.effects) {
          Object.values(sounds.effects).forEach(sound => {
            if (sound && sound.stop) sound.stop();
          });
        }
        if (sounds.match && sounds.match.stop) {
          sounds.match.stop();
        }
        soundManager.stopAllSounds();
        onGameComplete(score + 1);
      }
    }
  };

  const startGame = () => {
    // Stop all sounds before starting new game
    if (sounds.effects) {
      Object.values(sounds.effects).forEach(sound => {
        if (sound && sound.stop) sound.stop();
      });
    }
    if (sounds.match && sounds.match.stop) {
      sounds.match.stop();
    }
    soundManager.stopAllSounds();
    
    setShowInstructions(false);
    setSequence([]);
    setUserSequence([]);
    setGarden([]);
    setRound(1);
    setScore(0);
    setGameOver(false);
  };

  return (
    <Box sx={{ textAlign: 'center', p: 3 }}>
      {showInstructions ? (
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: '20px',
            backgroundColor: '#FFF9F0',
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ color: '#2C3E50' }}>
            Welcome to Memory Garden! 🌸
          </Typography>
          
          <Box sx={{ my: 4, textAlign: 'left' }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#444' }}>
              How to Play:
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, fontSize: '1.1rem' }}>
              1. Watch the flowers light up in a special pattern 🌺
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, fontSize: '1.1rem' }}>
              2. After the pattern finishes, click the flowers in the same order 🌸
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, fontSize: '1.1rem' }}>
              3. Each time you get it right, your garden grows with a new flower! 🌻
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, fontSize: '1.1rem' }}>
              4. Try to remember longer and longer patterns 🌼
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={startGame}
            sx={{
              fontSize: '1.2rem',
              py: 2,
              px: 6,
              borderRadius: '30px',
              backgroundColor: '#98FB98',
              color: '#2C3E50',
              '&:hover': {
                backgroundColor: '#7DD389',
              }
            }}
          >
            Start Playing! 🎮
          </Button>
        </Paper>
      ) : (
        <>
          <Typography variant="h4" gutterBottom>
            Round: {round}/10 | Score: {score}
          </Typography>

          {playing ? (
            <Box sx={{ my: 6 }}>
              <CircularProgress size={80} />
              <Typography variant="h4" sx={{ mt: 3, color: '#2C3E50' }}>
                Watch the flowers carefully! 👀
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3} justifyContent="center" sx={{ maxWidth: '800px', mx: 'auto', my: 4 }}>
              {flowers.map((flower) => (
                <Grid item xs={6} sm={6} key={flower.name}>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => handleFlowerClick(flower)}
                      disabled={playing}
                      sx={{
                        width: '100%',
                        height: '160px',
                        backgroundColor: flower.color,
                        borderRadius: '20px',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        '&:hover': {
                          backgroundColor: flower.color,
                          opacity: 0.9,
                        },
                      }}
                    >
                      <Typography variant="h2" sx={{ fontSize: '80px', mb: 1 }}>
                        {flower.emoji}
                      </Typography>
                      <Typography variant="h6">
                        {flower.name}
                      </Typography>
                    </Button>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          )}

          {garden.length > 0 && (
            <Box sx={{ mt: 4, p: 3, backgroundColor: '#F0FFF0', borderRadius: '20px' }}>
              <Typography variant="h5" gutterBottom sx={{ color: '#2C3E50' }}>
                Your Garden 🌿
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
                {garden.map((flower, index) => (
                  <Typography key={index} variant="h3">
                    {flower.emoji}
                  </Typography>
                ))}
              </Box>
            </Box>
          )}

          {gameOver && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h4" gutterBottom sx={{ color: '#2C3E50' }}>
                Game Over! 🎉
              </Typography>
              <Typography variant="h5" sx={{ mb: 3, color: '#666' }}>
                You grew {score} beautiful flowers!
              </Typography>
              <Button
                variant="contained"
                onClick={startGame}
                sx={{
                  fontSize: '1.2rem',
                  py: 2,
                  px: 6,
                  borderRadius: '30px',
                  backgroundColor: '#98FB98',
                  color: '#2C3E50',
                  '&:hover': {
                    backgroundColor: '#7DD389',
                  }
                }}
              >
                Play Again! 🌸
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

export default MemoryGarden; 