import { useState, useEffect } from 'react';
import { Box, Button, Typography, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';
import sounds from '../../utils/sounds';
import { soundManager } from '../../utils/soundManager';

const yogaPoses = [
  {
    name: 'Mountain Pose',
    emoji: '🧘',
    description: 'Stand tall like a mountain with your feet together and arms by your sides.',
    duration: 20,
    sound: 'mountain'
  },
  {
    name: 'Tree Pose',
    emoji: '🧘‍♀️',
    description: 'Balance on one foot like a tree, with your other foot resting on your leg.',
    duration: 20,
    sound: 'tree'
  },
  {
    name: 'Butterfly Pose',
    emoji: '🧘‍♂️',
    description: 'Sit with your feet together and flutter your legs like butterfly wings.',
    duration: 20,
    sound: 'butterfly'
  },
  {
    name: 'Cat Pose',
    emoji: '🧎‍♀️',
    description: 'On your hands and knees, arch your back like a happy cat.',
    duration: 20,
    sound: 'cat'
  }
];

const YogaActivity = () => {
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Play yoga background music when component mounts
    if (sounds.yoga) {
      sounds.yoga.play();
      sounds.yoga.volume(0.3);
      sounds.yoga.loop(true); // Make the background music loop
    }

    return () => {
      // Stop all sounds when component unmounts
      soundManager.stopAllSounds();
    };
  }, []);

  useEffect(() => {
    let timer;
    if (isActive && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      if (currentPoseIndex < yogaPoses.length - 1) {
        sounds.effects.success.play();
        setCurrentPoseIndex(currentPoseIndex + 1);
        setTimeLeft(yogaPoses[currentPoseIndex + 1].duration);
        // Play the sound for the next pose
        if (sounds[yogaPoses[currentPoseIndex + 1].sound]) {
          sounds[yogaPoses[currentPoseIndex + 1].sound].play();
        }
      } else {
        sounds.effects.complete.play();
        setIsActive(false);
      }
    }
    return () => {
      clearTimeout(timer);
      // Stop pose-specific sounds when changing poses
      if (currentPoseIndex < yogaPoses.length) {
        const currentPose = yogaPoses[currentPoseIndex];
        if (sounds[currentPose.sound]) {
          sounds[currentPose.sound].stop();
        }
      }
    };
  }, [isActive, timeLeft, currentPoseIndex]);

  const handleStart = () => {
    setIsActive(true);
    setCurrentPoseIndex(0);
    setTimeLeft(yogaPoses[0].duration);
    sounds.effects.click.play();
    // Play the sound for the first pose
    if (sounds[yogaPoses[0].sound]) {
      sounds[yogaPoses[0].sound].play();
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setCurrentPoseIndex(0);
    setTimeLeft(null);
    sounds.effects.click.play();
    // Stop all pose sounds
    soundManager.stopAllSounds();
    // Restart background music
    if (sounds.yoga) {
      sounds.yoga.play();
      sounds.yoga.volume(0.3);
    }
  };

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
        Yoga Time 🧘‍♀️
      </Typography>

      <Typography variant="body1" sx={{ mb: 4, textAlign: 'center', color: '#666', maxWidth: '600px' }}>
        Follow along with these fun yoga poses! Each pose lasts for 20 seconds.
      </Typography>

      {isActive ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', maxWidth: '600px' }}
        >
          <Card
            sx={{
              backgroundColor: '#fff',
              borderRadius: '20px',
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              overflow: 'hidden',
            }}
          >
            <CardContent sx={{ textAlign: 'center', p: 6 }}>
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <Typography variant="h1" gutterBottom sx={{ fontSize: '120px' }}>
                  {yogaPoses[currentPoseIndex].emoji}
                </Typography>
              </motion.div>
              <Typography variant="h4" gutterBottom sx={{ color: '#4A4A4A', mt: 2 }}>
                {yogaPoses[currentPoseIndex].name}
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, color: '#666' }}>
                {yogaPoses[currentPoseIndex].description}
              </Typography>
              <Typography variant="h5" color="primary" sx={{ 
                fontWeight: 'bold',
                animation: 'pulse 1s infinite'
              }}>
                Time Left: {timeLeft} seconds
              </Typography>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <Button
          variant="contained"
          size="large"
          onClick={handleStart}
          sx={{
            fontSize: '1.4rem',
            px: 6,
            py: 2,
            borderRadius: '30px',
            backgroundColor: '#9C27B0',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#7B1FA2',
            }
          }}
        >
          Start Yoga Session
        </Button>
      )}

      {isActive && (
        <Button
          variant="outlined"
          onClick={handleReset}
          sx={{ 
            mt: 4,
            fontSize: '1.1rem',
            color: '#9C27B0',
            borderColor: '#9C27B0',
            '&:hover': {
              borderColor: '#7B1FA2',
              backgroundColor: 'rgba(156, 39, 176, 0.1)'
            }
          }}
        >
          Reset Session
        </Button>
      )}
    </Box>
  );
};

export default YogaActivity; 