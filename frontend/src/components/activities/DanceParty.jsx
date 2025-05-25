import { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, CircularProgress } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import sounds from '../../utils/sounds';

// Dance sequences in order
const danceSequences = [
  { emojis: ['💃', '🕺'], duration: 5000 }, // Couple dance
  { emojis: ['👯‍♀️', '👯‍♂️'], duration: 5000 }, // Group dance
  { emojis: ['💃', '🕺', '👯‍♀️', '👯‍♂️'], duration: 5000 }, // All together
];

// Background dancers and effects
const backgroundEmojis = [
  '🪩', '🎵', // Dance party symbols
  '💫', '✨', // Sparkle effects
  '🌟', '🎶', // Music notes
];

function DanceParty() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [dancingEmojis, setDancingEmojis] = useState([]);
  const [soundPlaying, setSoundPlaying] = useState(false);
  const [currentSequence, setCurrentSequence] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Initial load and cleanup
  useEffect(() => {
    let mounted = true;

    const initializeSound = async () => {
      if (!sounds.dance) {
        console.error('Dance sound not available');
        if (mounted) setIsLoading(false);
        return;
      }

      try {
        await sounds.dance.waitForLoad();
        if (mounted) setIsLoading(false);
      } catch (error) {
        console.error('Error loading dance sound:', error);
        if (mounted) setIsLoading(false);
      }
    };

    initializeSound();

    return () => {
      mounted = false;
      if (sounds.dance) {
      sounds.dance.stop();
      }
    };
  }, []);

  // Handle dance sequences
  useEffect(() => {
    if (!isPlaying || isLoading) return;

    let sequenceTimer;
    let dancerInterval;

    const startDancing = async () => {
      try {
        if (sounds.dance) {
          // Add event listener for sound completion
          const handleSoundEnd = () => {
            handleStop();
          };
          sounds.dance.on('end', handleSoundEnd);
          await sounds.dance.play();
          setSoundPlaying(true);
        }

        // Sequence timer
        sequenceTimer = setInterval(() => {
          setCurrentSequence(prev => (prev + 1) % danceSequences.length);
        }, 5000);

        // Background dancers
        dancerInterval = setInterval(() => {
          setDancingEmojis(prev => {
            if (prev.length >= 6) return prev;
            
            const corner = prev.length % 4;
            let startX, startY;
            
            switch (corner) {
              case 0: startX = '0%'; startY = '0%'; break;
              case 1: startX = '100%'; startY = '0%'; break;
              case 2: startX = '0%'; startY = '100%'; break;
              default: startX = '100%'; startY = '100%';
            }

            return [...prev, {
            id: Date.now(),
              emoji: backgroundEmojis[Math.floor(Math.random() * backgroundEmojis.length)],
              startX,
              startY,
              duration: 2 + Math.random() * 2,
              rotations: Math.floor(Math.random() * 3) + 1,
            }];
          });
        }, 800);
      } catch (error) {
        console.error('Error starting dance:', error);
        handleStop();
      }
    };

    startDancing();

      return () => {
      clearInterval(sequenceTimer);
      clearInterval(dancerInterval);
      if (sounds.dance) {
        sounds.dance.off('end'); // Remove event listener on cleanup
        sounds.dance.stop();
        setSoundPlaying(false);
      }
      };
  }, [isPlaying, isLoading]);

  const handleStart = async () => {
    if (isLoading) return;
    setIsPlaying(true);
    setDancingEmojis([]);
    setCurrentSequence(0);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setDancingEmojis([]);
    if (sounds.dance) {
    sounds.dance.stop();
      setSoundPlaying(false);
    }
    setCurrentSequence(0);
  };

  if (isLoading) {
  return (
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          minHeight: '80vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #FFE5E5 0%, #FFD1F1 100%)',
          borderRadius: '20px',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography variant="h6">Loading Dance Party...</Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
    <Paper
      elevation={3}
      sx={{
        width: '100%',
        minHeight: '80vh',
        position: 'relative',
        background: 'linear-gradient(135deg, #FFE5E5 0%, #FFD1F1 100%)',
        borderRadius: '20px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 4,
        mb: 4,
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ color: '#444', textShadow: '2px 2px 4px rgba(0,0,0,0.1)', mb: 4 }}>
        Dance Party! 🎉
      </Typography>

      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '60vh',
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: '20px',
          overflow: 'hidden',
          mb: 4,
        }}
      >
            {/* Background Dancers */}
            <AnimatePresence>
              {dancingEmojis.map((dancer) => (
          <motion.div
            key={dancer.id}
            initial={{ 
                    scale: 1,
                    x: dancer.startX,
                    y: dancer.startY,
            }}
            animate={{
                    scale: [1, 1.5, 1.5, 1],
                    x: [dancer.startX, '50%', '50%', dancer.startX],
                    y: [dancer.startY, '50%', '50%', dancer.startY],
                    rotate: [0, 360 * dancer.rotations, 360 * dancer.rotations, 0],
                  }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{
                    duration: dancer.duration,
                    repeat: Infinity,
                    repeatType: 'loop',
                    times: [0, 0.4, 0.6, 1],
                    ease: "easeInOut",
                  }}
                  style={{
                    position: 'absolute',
                    fontSize: '40px',
                    transformOrigin: 'center',
                    filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1,
                  }}
                >
                  {dancer.emoji}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Main Dance Sequence */}
            <AnimatePresence>
              {isPlaying && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: 1,
                    scale: [1, 1.2, 1],
                    rotate: [0, 360, 0],
            }}
                  exit={{ opacity: 0, scale: 0 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            style={{
              position: 'absolute',
                    left: '50%',
                    top: '30%',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    gap: '20px',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    width: '300px',
                    zIndex: 2,
                  }}
                >
                  {danceSequences[currentSequence].emojis.map((emoji, index) => (
                    <motion.span
                      key={index}
                      style={{
                        fontSize: '100px',
                        display: 'inline-block',
                      }}
                      animate={{
                        y: [0, -20, 0],
                        rotate: [0, 10, -10, 0],
            }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        delay: index * 0.2,
                      }}
                    >
                      {emoji}
                    </motion.span>
                  ))}
          </motion.div>
              )}
            </AnimatePresence>
      </Box>

      <Button
        variant="contained"
        onClick={isPlaying ? handleStop : handleStart}
            disabled={isLoading}
        sx={{
          fontSize: '1.4rem',
          py: 2,
          px: 6,
          borderRadius: '30px',
          backgroundColor: isPlaying ? '#FF9AA2' : '#98FB98',
          color: '#4A4A4A',
          '&:hover': {
            backgroundColor: isPlaying ? '#FF8B93' : '#7DD389',
              },
              '&.Mui-disabled': {
                backgroundColor: '#ccc',
          }
        }}
      >
            {isLoading ? 'Loading...' : (isPlaying ? 'Stop Dancing 🛑' : 'Start Dancing! 💃')}
      </Button>
    </Paper>
      </motion.div>
    </AnimatePresence>
  );
}

export default DanceParty; 