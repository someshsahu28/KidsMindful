import { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, Box, Button } from '@mui/material';
import { motion } from 'framer-motion';
import BalloonBreathing from '../components/activities/BalloonBreathing';
import MindfulSafari from '../components/activities/MindfulSafari';
import YogaActivity from '../components/activities/YogaActivity';
import DanceParty from '../components/activities/DanceParty';
import MindfulColoring from '../components/activities/MindfulColoring';
import MusicalMeditation from '../components/activities/MusicalMeditation';
import sounds from '../utils/sounds';

const activities = [
  {
    title: 'Balloon Breathing',
    description: 'Take deep breaths and watch the balloon grow!',
    component: BalloonBreathing,
    color: '#FFB7B2',
    emoji: '🎈'
  },
  {
    title: 'Mindful Safari',
    description: 'Explore and discover peaceful animals in nature.',
    component: MindfulSafari,
    color: '#BAFFC9',
    emoji: '🦁'
  },
  {
    title: 'Yoga Time',
    description: 'Follow fun yoga poses to feel calm and strong.',
    component: YogaActivity,
    color: '#BAE1FF',
    emoji: '🧘‍♀️'
  },
  {
    title: 'Dance Party',
    description: 'Move your body and dance to happy music!',
    component: DanceParty,
    color: '#FFB7EB',
    emoji: '💃'
  },
  {
    title: 'Mindful Coloring',
    description: 'Color beautiful mandalas to feel peaceful and focused.',
    component: MindfulColoring,
    color: '#E2F0CB',
    emoji: '🎨'
  },
  {
    title: 'Musical Meditation',
    description: 'Listen to soothing sounds and relax your mind.',
    component: MusicalMeditation,
    color: '#C7CEEA',
    emoji: '🎵'
  }
];

function Activities() {
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Preload sounds when the component mounts
  useEffect(() => {
    const preloadSounds = async () => {
      try {
        // Wait for dance sound to load
        if (sounds.dance) {
          await new Promise((resolve) => {
            if (sounds.dance.isLoaded()) {
              resolve();
            } else {
              const checkLoaded = setInterval(() => {
                if (sounds.dance.isLoaded()) {
                  clearInterval(checkLoaded);
                  resolve();
                }
              }, 100);
            }
          });
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error preloading sounds:', error);
        setIsLoading(false);
      }
    };

    preloadSounds();

    return () => {
      // Cleanup sounds when component unmounts
      if (sounds.dance) {
        sounds.dance.stop();
      }
    };
  }, []);

  const handleActivitySelect = (activity) => {
    setSelectedActivity(activity);
  };

  const handleBack = () => {
    setSelectedActivity(null);
  };

  if (selectedActivity) {
    const ActivityComponent = selectedActivity.component;
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Button
          variant="outlined"
          onClick={handleBack}
          sx={{ mb: 3 }}
        >
          ← Back to Activities
        </Button>
        <ActivityComponent />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Typography variant="h1" align="center" gutterBottom>
          Fun Activities 🌈
        </Typography>
        <Typography variant="h5" align="center" sx={{ mb: 4, color: '#666' }}>
          Choose an activity to help you feel calm and happy!
        </Typography>
      </motion.div>

      <Grid container spacing={3}>
        {activities.map((activity, index) => (
          <Grid item xs={12} sm={6} md={4} key={activity.title}>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                onClick={() => handleActivitySelect(activity)}
                sx={{
                  cursor: 'pointer',
                  height: '100%',
                  backgroundColor: activity.color,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.03)',
                  },
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Typography variant="h1" sx={{ fontSize: '4rem', mb: 2 }}>
                    {activity.emoji}
                  </Typography>
                  <Typography variant="h5" gutterBottom>
                    {activity.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {activity.description}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Activities;