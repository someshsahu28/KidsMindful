import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  CardMedia,
} from '@mui/material';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { startTransition } from 'react';
import sounds from '../utils/sounds';
import { soundManager } from '../utils/soundManager';
import MemoryGarden from '../components/games/MemoryGarden';
import EmotionExplorer from '../components/games/EmotionExplorer';
import MemoryGame from '../components/games/MemoryGame';
import ColorMatchGame from '../components/games/ColorMatchGame';
import EmotionGuessGame from '../components/games/EmotionGuessGame';
import AnimalSoundGame from '../components/games/AnimalSoundGame';

function Games() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // Add effect to clean up sounds when component unmounts
  useEffect(() => {
    return () => {
      // Stop all sounds when component unmounts
      if (sounds.effects) {
        Object.values(sounds.effects).forEach(sound => {
          if (sound && sound.stop) sound.stop();
        });
      }
      soundManager.stopAllSounds();
    };
  }, []);

  // Add effect to clean up sounds when game changes
  useEffect(() => {
    // Stop all sounds when changing games
    if (sounds.effects) {
      Object.values(sounds.effects).forEach(sound => {
        if (sound && sound.stop) sound.stop();
      });
    }
    soundManager.stopAllSounds();
  }, [selectedGame]);

  const updateRewardsProgress = (gameId, score) => {
    // Load current progress
    const savedProgress = localStorage.getItem('rewardsProgress');
    let progress = savedProgress ? JSON.parse(savedProgress) : {
      points: 0,
      level: 1,
      earnedBadges: [],
      completedActivities: {}
    };

    // Map game IDs to badge IDs
    const gameToBadgeMap = {
      'memory-garden': 'focus',
      'emotion-explorer': 'mindful',
      'memory-match': 'focus',
      'color-match': 'focus',
      'emotion-detective': 'mindful',
      'animal-sounds': 'focus'
    };

    // Update points and completed activities
    progress.points += 1;
    const badgeId = gameToBadgeMap[gameId];
    if (badgeId) {
      progress.completedActivities[badgeId] = (progress.completedActivities[badgeId] || 0) + 1;
    }

    // Check for new badges
    const badges = [
      { id: 'focus', required: 5 },
      { id: 'mindful', required: 10 },
      { id: 'creative', required: 3 },
      { id: 'story', required: 5 },
      { id: 'dance', required: 10 },
      { id: 'helper', required: 5 }
    ];

    badges.forEach(badge => {
      if (!progress.earnedBadges.includes(badge.id) &&
          progress.completedActivities[badge.id] >= badge.required) {
        progress.earnedBadges.push(badge.id);
        if (sounds.effects?.success) {
          sounds.effects.success.play();
        }
      }
    });

    // Save updated progress
    localStorage.setItem('rewardsProgress', JSON.stringify(progress));
  };

  const handleGameComplete = (score) => {
    startTransition(() => {
      setFinalScore(score);
      setGameComplete(true);
      setShowConfetti(true);
      if (sounds.effects?.success) {
        sounds.effects.success.play();
      }
      
      // Update rewards progress
      if (selectedGame) {
        updateRewardsProgress(selectedGame, score);
      }
      
      setTimeout(() => setShowConfetti(false), 5000);
    });
  };

  const handleGameSelect = (game) => {
    startTransition(() => {
      // Stop all sounds before switching games
      if (sounds.effects) {
        Object.values(sounds.effects).forEach(sound => {
          if (sound && sound.stop) sound.stop();
        });
      }
      soundManager.stopAllSounds();
      
      setSelectedGame(game.id);
      setGameComplete(false);
      setFinalScore(0);
      if (sounds.effects?.click) {
        sounds.effects.click.play();
      }
    });
  };

  const handlePlayAgain = () => {
    startTransition(() => {
      // Stop all sounds before going back
      if (sounds.effects) {
        Object.values(sounds.effects).forEach(sound => {
          if (sound && sound.stop) sound.stop();
        });
      }
      soundManager.stopAllSounds();
      
      setSelectedGame(null);
      setGameComplete(false);
      setFinalScore(0);
      if (sounds.effects?.click) {
        sounds.effects.click.play();
      }
    });
  };

  const games = [
    {
      id: 'memory-garden',
      title: 'Memory Garden',
      description: 'Grow your garden by remembering patterns of flowers! Train your memory while creating a beautiful garden.',
      component: <MemoryGarden onGameComplete={handleGameComplete} />,
      emoji: '🌸',
      color: '#FFB7EB'
    },
    {
      id: 'emotion-explorer',
      title: 'Emotion Explorer',
      description: 'Learn about different emotions through fun scenarios! Understand how different situations make us feel.',
      component: <EmotionExplorer onGameComplete={handleGameComplete} />,
      emoji: '🎭',
      color: '#FFD1F1'
    },
    {
      id: 'memory-match',
      title: 'Memory Match',
      description: 'Match pairs of cute emojis! Train your memory and concentration.',
      component: <MemoryGame onGameComplete={handleGameComplete} />,
      emoji: '🎯',
      color: '#FFB7B2'
    },
    {
      id: 'color-match',
      title: 'Color Match',
      description: 'Match the color, not the word! A fun way to practice focus.',
      component: <ColorMatchGame onGameComplete={handleGameComplete} />,
      emoji: '🎨',
      color: '#BAFFC9'
    },
    {
      id: 'emotion-detective',
      title: 'Emotion Detective',
      description: 'Can you guess the emotion? Learn to recognize different feelings!',
      component: <EmotionGuessGame onGameComplete={handleGameComplete} />,
      emoji: '🔍',
      color: '#BAE1FF'
    },
    {
      id: 'animal-sounds',
      title: 'Animal Sounds',
      description: 'Remember and repeat the animal sound pattern!',
      component: <AnimalSoundGame onGameComplete={handleGameComplete} />,
      emoji: '🐾',
      color: '#FFFFBA'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
        }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const getCurrentGame = () => {
    return games.find(game => game.id === selectedGame);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Typography variant="h1" align="center" gutterBottom>
          Fun Games 🎮
        </Typography>
        <Typography variant="h5" align="center" sx={{ mb: 4, color: '#666' }}>
          Play games that help you learn about feelings and stay happy!
        </Typography>
      </motion.div>

      {!selectedGame ? (
            <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
            >
          <Grid container spacing={3}>
            {games.map((game) => (
              <Grid item xs={12} sm={6} key={game.id}>
                <motion.div variants={itemVariants}>
              <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.02)',
                      },
                      borderRadius: '15px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    }}
                    onClick={() => handleGameSelect(game)}
                  >
                    <CardMedia
                      component="div"
                sx={{
                        height: 200,
                        backgroundColor: game.color,
                  display: 'flex',
                        alignItems: 'center',
                  justifyContent: 'center',
                      }}
                    >
                      <Typography variant="h1">
                        {game.emoji}
                      </Typography>
                    </CardMedia>
                    <CardContent>
                      <Typography variant="h5" gutterBottom>
                        {game.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {game.description}
                </Typography>
                    </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
        </motion.div>
      ) : (
        <Box>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
          <Button
              onClick={handlePlayAgain}
              variant="contained"
              sx={{
                mb: 3,
                backgroundColor: '#FFB7EB',
                color: '#444',
                '&:hover': {
                  backgroundColor: '#FF9AA2',
                },
              }}
          >
            ← Back to Games
        </Button>
          {getCurrentGame()?.component}
          </motion.div>
      </Box>
      )}

      <Dialog
        open={gameComplete}
        onClose={handlePlayAgain}
        PaperProps={{
          sx: {
            borderRadius: '20px',
            padding: '20px',
            background: 'linear-gradient(135deg, #FFE5E5 0%, #FFD1F1 100%)',
          }
        }}
      >
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h3" gutterBottom>
              🎉 Great Job! 🎉
            </Typography>
            <Typography variant="h5" gutterBottom>
              You completed the game!
            </Typography>
            <Typography variant="h6" color="primary">
              Score: {finalScore}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2, color: '#666' }}>
              You earned a reward point! 🌟
              <br />
              Check your rewards garden to see your progress!
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            onClick={handlePlayAgain}
            variant="contained"
            sx={{
              backgroundColor: '#FFB7EB',
              color: '#444',
              '&:hover': {
                backgroundColor: '#FF9AA2',
              },
            }}
          >
            Play Another Game
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Games; 