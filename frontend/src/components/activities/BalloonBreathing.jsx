import { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import sounds from '../../utils/sounds';
import { soundManager } from '../../utils/soundManager';

function BalloonBreathing() {
  const [isBreathing, setIsBreathing] = useState(false);
  const [phase, setPhase] = useState('idle'); // idle, inhale, hold, exhale
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    let timer;
    if (isBreathing) {
      if (phase === 'idle') {
        sounds.instructions.inhale.play();
        setPhase('inhale');
        setTimeLeft(4);
      } else if (timeLeft > 0) {
        timer = setTimeout(() => {
          setTimeLeft(prev => prev - 1);
        }, 1000);
      } else {
        switch (phase) {
          case 'inhale':
            sounds.instructions.hold.play();
            setPhase('hold');
            setTimeLeft(4);
            break;
          case 'hold':
            sounds.instructions.exhale.play();
            setPhase('exhale');
            setTimeLeft(4);
            break;
          case 'exhale':
            sounds.instructions.inhale.play();
            setPhase('inhale');
            setTimeLeft(4);
            break;
        }
      }
    }
    return () => {
      clearTimeout(timer);
      // Stop any playing instruction sounds when phase changes
      if (sounds.instructions) {
        Object.values(sounds.instructions).forEach(sound => {
          if (sound && sound.stop) sound.stop();
        });
      }
    };
  }, [isBreathing, phase, timeLeft]);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      soundManager.stopAllSounds();
    };
  }, []);

  const handleStart = () => {
    // Stop any existing sounds before starting
    soundManager.stopAllSounds();
    setIsBreathing(true);
    setPhase('idle');
  };

  const handleStop = () => {
    // Stop all sounds when stopping
    soundManager.stopAllSounds();
    setIsBreathing(false);
    setPhase('idle');
    setTimeLeft(0);
  };

  const balloonVariants = {
    inhale: {
      scale: 1.5,
      transition: { duration: 4, ease: 'easeInOut' }
    },
    hold: {
      scale: 1.5,
      transition: { duration: 4, ease: 'linear' }
    },
    exhale: {
      scale: 1,
      transition: { duration: 4, ease: 'easeInOut' }
    },
    idle: {
      scale: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '500px',
        position: 'relative',
        backgroundColor: '#E3F2FD',
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Balloon Breathing 🎈
      </Typography>

      <Typography variant="h5" gutterBottom>
        {phase !== 'idle' && `${phase.charAt(0).toUpperCase() + phase.slice(1)} (${timeLeft}s)`}
      </Typography>

      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '300px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <motion.div
          animate={phase}
          variants={balloonVariants}
          style={{
            fontSize: '100px',
            cursor: 'pointer',
          }}
        >
          🎈
        </motion.div>
      </Box>

      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={isBreathing ? handleStop : handleStart}
        sx={{
          fontSize: '1.2rem',
          px: 4,
          py: 1.5,
          borderRadius: '25px',
          mt: 2,
        }}
      >
        {isBreathing ? 'Stop' : 'Start Breathing'}
      </Button>
    </Box>
  );
}

export default BalloonBreathing; 