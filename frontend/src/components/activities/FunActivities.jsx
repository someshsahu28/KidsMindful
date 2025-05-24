import { useState, useEffect } from 'react';
import { Box, Grid, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { stopAllSounds } from '../../utils/soundCleanup';
import MusicalMeditation from './MusicalMeditation';
import MindfulSafari from './MindfulSafari';
import BalloonBreathing from './BalloonBreathing';
import DanceParty from './DanceParty';
import MindfulColoring from './MindfulColoring';
import YogaActivity from './YogaActivity';

function FunActivities() {
  const [selectedActivity, setSelectedActivity] = useState(null);

  useEffect(() => {
    // Stop all sounds when component unmounts
    return () => {
      stopAllSounds();
    };
  }, []);

  useEffect(() => {
    // Stop all sounds when changing activities
    stopAllSounds();
  }, [selectedActivity]);

  const activities = [
    { name: 'Musical Meditation', emoji: '🎵', component: MusicalMeditation },
    { name: 'Mindful Safari', emoji: '🦁', component: MindfulSafari },
    { name: 'Balloon Breathing', emoji: '🎈', component: BalloonBreathing },
    { name: 'Dance Party', emoji: '💃', component: DanceParty },
    { name: 'Mindful Coloring', emoji: '🎨', component: MindfulColoring },
    { name: 'Yoga Time', emoji: '🧘‍♀️', component: YogaActivity },
  ];

  const handleActivitySelect = (activity) => {
    // Stop any playing sounds before switching activities
    stopAllSounds();
    setSelectedActivity(activity);
  };

  const handleBack = () => {
    // Stop any playing sounds before going back
    stopAllSounds();
    setSelectedActivity(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h3" gutterBottom sx={{ textAlign: 'center', color: '#2C3E50', mb: 4 }}>
        Fun Activities 🎨
      </Typography>

      {selectedActivity ? (
        <Box>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h6"
                onClick={handleBack}
                sx={{
                  cursor: 'pointer',
                  color: '#666',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  '&:hover': { color: '#333' }
                }}
              >
                ← Back to Activities
              </Typography>
            </Box>
            <selectedActivity.component />
          </motion.div>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {activities.map((activity) => (
            <Grid item xs={12} sm={6} md={4} key={activity.name}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Paper
                  elevation={3}
                  onClick={() => handleActivitySelect(activity)}
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    cursor: 'pointer',
                    borderRadius: '20px',
                    backgroundColor: '#fff',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#F5F5F5',
                      transform: 'translateY(-5px)',
                    }
                  }}
                >
                  <Typography variant="h2" gutterBottom>
                    {activity.emoji}
                  </Typography>
                  <Typography variant="h5" sx={{ color: '#2C3E50' }}>
                    {activity.name}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default FunActivities; 