import { useState, useEffect, useRef } from 'react';
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
  const [showMainDance, setShowMainDance] = useState(false);

  const sequenceTimerRef = useRef(null);
  const dancerIntervalRef = useRef(null);

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
      handleStop();
    };
  }, []);

  // Handle dance sequences
  useEffect(() => {
    console.log('useEffect: isPlaying =', isPlaying, ', isLoading =', isLoading);
    if (!isPlaying || isLoading) return;

    let soundEndHandler = null;

    const startDancing = async () => {
      try {
        if (sounds.dance) {
          // Add event listener for sound completion
          soundEndHandler = () => {
            console.log('Sound ended, stopping dance');
            handleStop();
          };
          sounds.dance.on('end', soundEndHandler);
          await sounds.dance.play();
          setSoundPlaying(true);
          setShowMainDance(true);
        }

        // Sequence timer
        sequenceTimerRef.current = setInterval(() => {
          setCurrentSequence(prev => (prev + 1) % danceSequences.length);
        }, 5000);

        // Background dancers
        dancerIntervalRef.current = setInterval(() => {
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
      console.log('Cleanup: stopping all animations and sound');
      if (sequenceTimerRef.current) {
        clearInterval(sequenceTimerRef.current);
        sequenceTimerRef.current = null;
      }
      if (dancerIntervalRef.current) {
        clearInterval(dancerIntervalRef.current);
        dancerIntervalRef.current = null;
      }
      if (sounds.dance) {
        if (soundEndHandler) {
          sounds.dance.off('end', soundEndHandler);
        }
        sounds.dance.stop();
        setSoundPlaying(false);
      }
      // Force immediate state updates
      setDancingEmojis([]);
      setShowMainDance(false);
      setCurrentSequence(0);
    };
  }, [isPlaying, isLoading]);

  const handleStart = () => {
    console.log('handleStart called');
    if (isLoading) return;
    setIsPlaying(true);
    setDancingEmojis([]);
    setCurrentSequence(0);
    setShowMainDance(true);
    console.log('handleStart: isPlaying set to true, showMainDance set to true');
  };

  const handleStop = () => {
    console.log('handleStop called');
    // First stop all intervals and sound
    if (sequenceTimerRef.current) {
      clearInterval(sequenceTimerRef.current);
      sequenceTimerRef.current = null;
    }
    if (dancerIntervalRef.current) {
      clearInterval(dancerIntervalRef.current);
      dancerIntervalRef.current = null;
    }
    if (sounds.dance) {
      sounds.dance.stop();
      setSoundPlaying(false);
    }
    
    // Then update all states immediately
    setIsPlaying(false);
    setDancingEmojis([]);
    setShowMainDance(false);
    setCurrentSequence(0);
    
    console.log('handleStop: All states reset, animations should stop');
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
            <AnimatePresence mode="wait">
              {isPlaying && dancingEmojis.map((dancer) => (
                <motion.div
                  key={`dancer-${dancer.id}`}
                  initial={{ 
                    scale: 1,
                    x: dancer.startX,
                    y: dancer.startY,
                    opacity: 0
                  }}
                  animate={isPlaying ? {
                    scale: [1, 1.5, 1.5, 1],
                    x: [dancer.startX, '50%', '50%', dancer.startX],
                    y: [dancer.startY, '50%', '50%', dancer.startY],
                    rotate: [0, 360 * dancer.rotations, 360 * dancer.rotations, 0],
                    opacity: 1
                  } : {
                    opacity: 0,
                    scale: 0
                  }}
                  exit={{ 
                    opacity: 0,
                    scale: 0,
                    transition: { duration: 0.2 }
                  }}
                  transition={{
                    duration: dancer.duration,
                    repeat: isPlaying ? Infinity : 0,
                    repeatType: 'loop',
                    times: [0, 0.4, 0.6, 1],
                    ease: "easeInOut"
                  }}
                  style={{
                    position: 'absolute',
                    fontSize: '40px',
                    transformOrigin: 'center',
                    filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))',
                    zIndex: 1,
                  }}
                >
                  {dancer.emoji}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Main Dance Sequence */}
            <AnimatePresence mode="wait">
              {showMainDance && isPlaying && (
                <motion.div
                  key={`main-dance-${currentSequence}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isPlaying ? {
                    opacity: 1,
                    scale: [1, 1.2, 1],
                    rotate: [0, 360, 0],
                  } : {
                    opacity: 0,
                    scale: 0
                  }}
                  exit={{ 
                    opacity: 0,
                    scale: 0,
                    transition: { duration: 0.2 }
                  }}
                  transition={{
                    duration: 2,
                    repeat: isPlaying ? Infinity : 0,
                    repeatType: 'reverse'
                  }}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '30%',
                    display: 'flex',
                    gap: '20px',
                    width: '300px',
                    zIndex: 2,
                  }}
                >
                  {danceSequences[currentSequence].emojis.map((emoji, index) => (
                    <motion.span
                      key={`emoji-${emoji}-${index}`}
                      style={{
                        fontSize: '100px',
                        display: 'inline-block',
                      }}
                      animate={isPlaying ? {
                        y: [0, -20, 0],
                        rotate: [0, 10, -10, 0],
                      } : {
                        y: 0,
                        rotate: 0
                      }}
                      exit={{ 
                        opacity: 0,
                        scale: 0,
                        transition: { duration: 0.2 }
                      }}
                      transition={{
                        duration: 1,
                        repeat: isPlaying ? Infinity : 0,
                        repeatType: 'reverse',
                        delay: index * 0.2
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