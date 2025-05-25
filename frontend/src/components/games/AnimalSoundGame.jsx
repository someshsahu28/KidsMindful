import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Button, CircularProgress, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import sounds from '../../utils/sounds';
import { soundManager } from '../../utils/soundManager';

const LEVELS = {
  EASY: {
    name: 'Easy',
    sequenceLength: 3,
    playbackSpeed: 2000,
    color: '#98FB98',
    description: 'Remember 3 animal sounds'
  },
  MEDIUM: {
    name: 'Medium',
    sequenceLength: 5,
    playbackSpeed: 1500,
    color: '#FFD700',
    description: 'Remember 5 animal sounds'
  },
  HARD: {
    name: 'Hard',
    sequenceLength: 7,
    playbackSpeed: 1000,
    color: '#FF6B6B',
    description: 'Remember 7 animal sounds'
  }
};

function AnimalSoundGame({ onGameComplete }) {
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [soundError, setSoundError] = useState(false);
  const [canAnswer, setCanAnswer] = useState(false);
  const [currentSound, setCurrentSound] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(LEVELS.EASY);
  const [totalScore, setTotalScore] = useState(0);

  const animals = [
    { name: 'cat', sound: '🐱 Meow', color: '#FFB7B2' },
    { name: 'dog', sound: '🐶 Woof', color: '#BAFFC9' },
    { name: 'bird', sound: '🐦 Tweet', color: '#BAE1FF' },
    { name: 'lion', sound: '🦁 Roar', color: '#FFFFBA' },
  ];

  useEffect(() => {
    // Check if animal sounds are available
    const checkSounds = () => {
      const missingSound = animals.some(animal => 
        !sounds.animals[animal.name] || 
        !sounds.animals[animal.name].play
      );
      setSoundError(missingSound);
    };
    checkSounds();

    // Cleanup sounds when component unmounts
    return () => {
      soundManager.stopAllSounds();
    };
  }, []);

  useEffect(() => {
    if (round <= currentLevel.sequenceLength && !gameOver) {
      generateSequence();
    } else if (round > currentLevel.sequenceLength) {
      // Level completed
      const levelScore = Math.floor((score / currentLevel.sequenceLength) * 100);
      setTotalScore(prev => prev + levelScore);
      
      if (levelScore >= 70) { // Need 70% to advance
        sounds.effects.success.play();
        if (currentLevel === LEVELS.EASY) {
          setCurrentLevel(LEVELS.MEDIUM);
        } else if (currentLevel === LEVELS.MEDIUM) {
          setCurrentLevel(LEVELS.HARD);
        } else {
          setGameOver(true);
          const finalScore = totalScore + levelScore;
          onGameComplete(finalScore);
        }
        setRound(1);
        setScore(0);
        setSequence([]);
      } else {
        // Failed to advance, game over
        sounds.effects.error.play();
        setGameOver(true);
        const finalScore = totalScore + levelScore;
        onGameComplete(finalScore);
      }
    }
  }, [round, currentLevel]);

  const generateSequence = () => {
    const newAnimal = animals[Math.floor(Math.random() * animals.length)];
    setSequence([...sequence, newAnimal]);
    playSequence([...sequence, newAnimal]);
  };

  const playSequence = async (seq) => {
    setPlaying(true);
    setCanAnswer(false);
    setCurrentSound(null);
    
    // Stop any currently playing sounds
    soundManager.stopAllSounds();
    
    // Play each sound in sequence with proper timing
    for (let i = 0; i < seq.length; i++) {
      try {
        if (sounds.animals[seq[i].name]) {
          setCurrentSound(seq[i]);
          const sound = sounds.animals[seq[i].name];
          
          // Play current sound for exactly 10 seconds
          await new Promise((resolve) => {
            soundManager.stopAllSounds(); // Stop all sounds before playing new one
            const soundId = sound.play();
            setTimeout(() => {
              sound.stop(soundId);
              setCurrentSound(null);
              resolve();
            }, 10000); // Play for 10 seconds
          });
          
          // Add a pause between sounds
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (error) {
        console.warn(`Error playing ${seq[i].name} sound:`, error);
      }
    }
    
    setPlaying(false);
    setCanAnswer(true);
    setUserSequence([]);
    // Play a click sound to indicate it's user's turn
    if (sounds.effects?.click) {
      sounds.effects.click.play();
    }
  };

  const handleAnimalClick = async (animal) => {
    if (playing || !canAnswer) return;

    setCanAnswer(false); // Disable clicking while sound is playing
    
    try {
      if (sounds.animals[animal.name]) {
        setCurrentSound(animal);
        const sound = sounds.animals[animal.name];
        
        // Play the selected animal sound for exactly 10 seconds
        await new Promise((resolve) => {
          soundManager.stopAllSounds(); // Stop all sounds before playing new one
          const soundId = sound.play();
          setTimeout(() => {
            sound.stop(soundId);
            setCurrentSound(null);
            resolve();
          }, 10000);
        });
      }
    } catch (error) {
      console.warn(`Error playing ${animal.name} sound:`, error);
    }

    const newUserSequence = [...userSequence, animal];
    setUserSequence(newUserSequence);

    // Check if the answer is correct
    if (newUserSequence[newUserSequence.length - 1].name !== 
        sequence[newUserSequence.length - 1].name) {
      if (sounds.effects?.error) {
        sounds.effects.error.play();
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
      setGameOver(true);
      onGameComplete(Math.floor((score / currentLevel.sequenceLength) * 100));
      return;
    }

    // Check if sequence is complete
    if (newUserSequence.length === sequence.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (sounds.effects?.complete) {
        const sound = sounds.effects.complete;
        sound.play();
        setTimeout(() => {
          sound.stop();
        }, 2000);
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
      const newScore = score + 1;
      setScore(newScore);
      
      // Only update total score when level is complete
      if (round === currentLevel.sequenceLength) {
        const levelScore = Math.floor((newScore / currentLevel.sequenceLength) * 100);
        setTotalScore(prev => prev + levelScore);
      }
      
      setRound(round + 1);
      setUserSequence([]); // Reset user sequence for next round
    } else {
      setCanAnswer(true); // Re-enable clicking for next sound
    }
  };

  if (gameOver) {
    return (
      <Box sx={{ textAlign: 'center', p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Game Over!
        </Typography>
        <Typography variant="h5" gutterBottom>
          Total Score: {totalScore}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Highest Level Reached: {currentLevel.name}
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            setScore(0);
            setRound(1);
            setGameOver(false);
            setCurrentLevel(LEVELS.EASY);
            setTotalScore(0);
            setSequence([]);
          }}
          sx={{ mt: 2 }}
        >
          Play Again
        </Button>
      </Box>
    );
  }

  return (
    <Box
        sx={{ 
        width: '100%',
        minHeight: '600px',
        position: 'relative',
        backgroundColor: '#F3E5F5',
        borderRadius: '20px',
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ color: '#4A4A4A', mb: 3 }}>
        Animal Sound Game 🎵
      </Typography>

      {!gameOver && (
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ color: currentLevel.color, mb: 1 }}>
          Level: {currentLevel.name}
        </Typography>
          <Typography variant="body1" sx={{ color: '#666' }}>
            {currentLevel.description}
        </Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Round {round} of {currentLevel.sequenceLength} | Score: {score}
        </Typography>
        </Box>
      )}

      {soundError && (
        <Typography 
          variant="body1" 
          color="error" 
          sx={{ mb: 2 }}
        >
          Note: Some animal sounds might not be available. The game will still work without sounds.
        </Typography>
      )}

      {playing ? (
        <Box sx={{ my: 6 }}>
          <CircularProgress size={80} />
          <Typography variant="h4" sx={{ mt: 3 }}>
            Listen carefully to the sounds!
          </Typography>
          {currentSound && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Typography variant="h2" sx={{ mt: 2 }}>
                {currentSound.sound}
              </Typography>
            </motion.div>
          )}
        </Box>
      ) : (
        <>
          <Typography variant="h5" sx={{ mb: 3, color: canAnswer ? 'green' : 'grey' }}>
            {canAnswer ? "Now it's your turn! Repeat the sequence." : "Wait for the sounds..."}
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {animals.map((animal) => (
              <Grid item xs={6} sm={3} key={animal.name}>
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }} 
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    variant="contained"
                    onClick={() => handleAnimalClick(animal)}
                    disabled={!canAnswer}
                    sx={{
                      width: '100%',
                      height: 160,
                      backgroundColor: animal.color,
                      borderRadius: '20px',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                      opacity: canAnswer ? 1 : 0.7,
                      '&:hover': {
                        backgroundColor: animal.color,
                        opacity: canAnswer ? 0.9 : 0.7,
                      },
                    }}
                  >
                    <Typography variant="h2" sx={{ fontSize: '80px' }}>
                      {animal.sound}
                    </Typography>
                  </Button>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
}

export default AnimalSoundGame; 