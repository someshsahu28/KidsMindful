import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Button, Avatar } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import sounds from '../utils/sounds';

const badges = [
  { id: 'focus', emoji: '🎯', name: 'Focus Master', description: 'Complete 5 concentration activities', required: 5 },
  { id: 'creative', emoji: '🎨', name: 'Creative Spirit', description: 'Create 3 artworks', required: 3 },
  { id: 'mindful', emoji: '🧘', name: 'Mindfulness Expert', description: 'Complete 10 yoga sessions', required: 10 },
  { id: 'story', emoji: '📖', name: 'Story Explorer', description: 'Complete 5 interactive stories', required: 5 },
  { id: 'dance', emoji: '💃', name: 'Dance Star', description: 'Join 10 dance parties', required: 10 },
  { id: 'helper', emoji: '💝', name: 'Kind Helper', description: 'Help others 5 times', required: 5 },
];

const gardenStages = [
  { level: 1, emoji: '🌱', name: 'Sprout', required: 0 },
  { level: 2, emoji: '🌿', name: 'Growing Plant', required: 10 },
  { level: 3, emoji: '🌸', name: 'Blooming Flower', required: 25 },
  { level: 4, emoji: '🌳', name: 'Mighty Tree', required: 50 },
  { level: 5, emoji: '🌺', name: 'Magical Garden', required: 100 },
];

function Rewards() {
  const [progress, setProgress] = useState({
    points: 0,
    level: 1,
    earnedBadges: [],
    completedActivities: {},
  });

  useEffect(() => {
    // Load saved progress
    const savedProgress = localStorage.getItem('rewardsProgress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  const getCurrentGardenStage = () => {
    return gardenStages.reduce((prev, curr) => {
      return curr.required <= progress.points ? curr : prev;
    }, gardenStages[0]);
  };

  const handleActivityComplete = (type) => {
    const newProgress = {
      ...progress,
      points: progress.points + 1,
      completedActivities: {
        ...progress.completedActivities,
        [type]: (progress.completedActivities[type] || 0) + 1,
      },
    };

    // Check for new badges
    badges.forEach(badge => {
      if (!progress.earnedBadges.includes(badge.id) &&
          newProgress.completedActivities[badge.id] >= badge.required) {
        newProgress.earnedBadges.push(badge.id);
        if (sounds.effects?.success) {
          sounds.effects.success.play();
        }
      }
    });

    setProgress(newProgress);
    localStorage.setItem('rewardsProgress', JSON.stringify(newProgress));
  };

  const currentStage = getCurrentGardenStage();

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h2" align="center" gutterBottom>
        My Rewards Garden 🌱
      </Typography>

      {/* Garden Progress */}
      <Paper elevation={3} sx={{ p: 4, mb: 4, backgroundColor: '#F0F7FF', borderRadius: '20px' }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: 'center' }}>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Typography variant="h1" sx={{ fontSize: '120px', mb: 2 }}>
                  {currentStage.emoji}
                </Typography>
              </motion.div>
              <Typography variant="h4" gutterBottom>
                {currentStage.name}
              </Typography>
              <Typography variant="h6">
                Growth Points: {progress.points} / {gardenStages[currentStage.level].required}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" gutterBottom>
                Garden Growth Stages
              </Typography>
              <Grid container spacing={1}>
                {gardenStages.map((stage) => (
                  <Grid item xs={12} key={stage.level}>
                    <Paper
                      sx={{
                        p: 1,
                        backgroundColor: stage.level <= currentStage.level ? '#E8F5E9' : '#FFF',
                        opacity: stage.level <= currentStage.level ? 1 : 0.6,
                      }}
                    >
                      <Typography>
                        {stage.emoji} {stage.name} ({stage.required} points)
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Achievement Badges */}
      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
        Achievement Badges 🏆
      </Typography>
      <Grid container spacing={3}>
        {badges.map((badge) => (
          <Grid item xs={12} sm={6} md={4} key={badge.id}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  backgroundColor: progress.earnedBadges.includes(badge.id) ? '#FFD700' : '#FFF',
                  opacity: progress.earnedBadges.includes(badge.id) ? 1 : 0.7,
                  borderRadius: '15px',
                }}
              >
                <Typography variant="h2">{badge.emoji}</Typography>
                <Typography variant="h6" gutterBottom>{badge.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {badge.description}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Progress: {progress.completedActivities[badge.id] || 0} / {badge.required}
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Demo Buttons */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Demo: Complete Activities
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {badges.map((badge) => (
            <Grid item key={badge.id}>
              <Button
                variant="contained"
                onClick={() => handleActivityComplete(badge.id)}
                sx={{ backgroundColor: '#6A1B9A' }}
              >
                Complete {badge.emoji}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default Rewards; 