import { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import sounds from '../../utils/sounds';

const emojis = ['🕺', '💃', '🌟', '🎵', '🎶', '✨'];
const colors = ['#FFB7EB', '#FFD1F1', '#FFE5F7', '#FFF0FB'];
const dancers = ['👧', '👦', '🧒', '👶', '🧚‍♀️', '🧚‍♂️'];

function DanceParty() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [dancingEmojis, setDancingEmojis] = useState([]);
  const [soundPlaying, setSoundPlaying] = useState(false);
  const [selectedDancer, setSelectedDancer] = useState(dancers[0]);

  useEffect(() => {
    return () => {
      if (sounds.dance) {
      sounds.dance.stop();
        setSoundPlaying(false);
      }
    };
  }, []);

  useEffect(() => {
    if (isPlaying && !soundPlaying) {
      if (sounds.dance) {
        sounds.dance.stop(); // Stop any existing sound
      sounds.dance.play();
      sounds.dance.volume(0.4);
        setSoundPlaying(true);
      }
      
      const interval = setInterval(() => {
        setDancingEmojis(prev => {
          if (prev.length >= 12) {
            clearInterval(interval);
            return prev;
          }
          
          const corner = Math.floor(Math.random() * 4);
          let startX, startY;
          
          switch (corner) {
            case 0: // top-left
              startX = -10;
              startY = -10;
              break;
            case 1: // top-right
              startX = 110;
              startY = -10;
              break;
            case 2: // bottom-left
              startX = -10;
              startY = 110;
              break;
            default: // bottom-right
              startX = 110;
              startY = 110;
          }

          const newDancer = {
            id: Date.now(),
            emoji: emojis[Math.floor(Math.random() * emojis.length)],
            startX,
            startY,
            scale: Math.random() * 0.4 + 1.8,
            rotation: Math.random() * 360,
            color: colors[Math.floor(Math.random() * colors.length)],
          };
          return [...prev, newDancer];
        });
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    } else if (!isPlaying && soundPlaying) {
      if (sounds.dance) {
        sounds.dance.stop();
        setSoundPlaying(false);
      }
      setDancingEmojis([]);
    }
  }, [isPlaying, soundPlaying]);

  const handleStart = () => {
    setIsPlaying(true);
    setDancingEmojis([]);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setDancingEmojis([]);
    if (sounds.dance) {
    sounds.dance.stop();
      setSoundPlaying(false);
    }
  };

  const handleDancerChange = () => {
    const currentIndex = dancers.indexOf(selectedDancer);
    const nextIndex = (currentIndex + 1) % dancers.length;
    setSelectedDancer(dancers[nextIndex]);
    if (sounds.effects?.click) {
      sounds.effects.click.play();
    }
  };

  return (
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

      {/* Dancer Selection */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleDancerChange}
        style={{ cursor: 'pointer', marginBottom: '20px' }}
      >
        <Typography 
          variant="h1" 
          sx={{ 
            fontSize: '80px',
            cursor: 'pointer',
            filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.2))',
          }}
        >
          {selectedDancer}
        </Typography>
      </motion.div>

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
        {dancingEmojis.map((dancer) => (
          <motion.div
            key={dancer.id}
            initial={{ 
              scale: 0, 
              x: `${dancer.startX}%`,
              y: `${dancer.startY}%`,
              rotate: 0,
            }}
            animate={{
              scale: dancer.scale,
              rotate: [0, dancer.rotation, 0],
              x: '50%',
              y: '50%',
            }}
            transition={{
              type: "spring",
              stiffness: 50,
              damping: 10,
              duration: 3,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            style={{
              position: 'absolute',
              fontSize: '80px',
              transformOrigin: 'center',
              filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))',
            }}
          >
            {dancer.emoji}
          </motion.div>
        ))}

        {/* Main Dancer */}
        {isPlaying && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '100px',
              zIndex: 10,
            }}
          >
            {selectedDancer}
          </motion.div>
        )}
      </Box>

      <Button
        variant="contained"
        onClick={isPlaying ? handleStop : handleStart}
        sx={{
          fontSize: '1.4rem',
          py: 2,
          px: 6,
          borderRadius: '30px',
          backgroundColor: isPlaying ? '#FF9AA2' : '#98FB98',
          color: '#4A4A4A',
          '&:hover': {
            backgroundColor: isPlaying ? '#FF8B93' : '#7DD389',
          }
        }}
      >
        {isPlaying ? 'Stop Dancing 🛑' : 'Start Dancing! 💃'}
      </Button>
    </Paper>
  );
}

export default DanceParty; 