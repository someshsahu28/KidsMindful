import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Button, Avatar } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import sounds from '../../utils/sounds';

const avatarItems = {
  hats: [
    { id: 'hat1', emoji: '🎩', name: 'Top Hat', required: 5 },
    { id: 'hat2', emoji: '👑', name: 'Crown', required: 10 },
    { id: 'hat3', emoji: '🎓', name: 'Graduate Cap', required: 15 },
    { id: 'hat4', emoji: '⛑️', name: 'Safety Hat', required: 20 },
  ],
  accessories: [
    { id: 'acc1', emoji: '👓', name: 'Glasses', required: 5 },
    { id: 'acc2', emoji: '🎀', name: 'Bow', required: 10 },
    { id: 'acc3', emoji: '🧣', name: 'Scarf', required: 15 },
  ],
  backgrounds: [
    { id: 'bg1', emoji: '🌈', name: 'Rainbow', required: 10 },
    { id: 'bg2', emoji: '🌟', name: 'Stars', required: 15 },
    { id: 'bg3', emoji: '🌸', name: 'Flowers', required: 20 },
  ]
};

const badges = [
  { id: 'badge1', emoji: '🌟', name: 'Star Achiever', description: 'Complete 5 activities' },
  { id: 'badge2', emoji: '🎯', name: 'Focus Master', description: 'Perfect score in concentration games' },
  { id: 'badge3', emoji: '🧘', name: 'Zen Master', description: 'Complete all yoga poses' },
  { id: 'badge4', emoji: '🎨', name: 'Creative Spirit', description: 'Create 5 artworks' },
];

function AvatarCustomization() {
  const [selectedItems, setSelectedItems] = useState({
    hat: null,
    accessory: null,
    background: null,
  });
  const [unlockedItems, setUnlockedItems] = useState([]);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [stars, setStars] = useState(0);
  const [gardenLevel, setGardenLevel] = useState(1);
  const [showUnlock, setShowUnlock] = useState(false);

  useEffect(() => {
    // Load saved progress
    const savedProgress = localStorage.getItem('avatarProgress');
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setSelectedItems(progress.selectedItems);
      setUnlockedItems(progress.unlockedItems);
      setEarnedBadges(progress.earnedBadges);
      setStars(progress.stars);
      setGardenLevel(progress.gardenLevel);
    }
  }, []);

  const saveProgress = () => {
    const progress = {
      selectedItems,
      unlockedItems,
      earnedBadges,
      stars,
      gardenLevel,
    };
    localStorage.setItem('avatarProgress', JSON.stringify(progress));
  };

  const handleItemSelect = (category, item) => {
    if (!unlockedItems.includes(item.id) && stars < item.required) {
      setShowUnlock(true);
      if (sounds.effects?.error) {
        sounds.effects.error.play();
      }
      return;
    }

    setSelectedItems(prev => ({
      ...prev,
      [category]: item
    }));

    if (sounds.effects?.click) {
      sounds.effects.click.play();
    }
    saveProgress();
  };

  const unlockItem = (item) => {
    if (stars >= item.required && !unlockedItems.includes(item.id)) {
      setUnlockedItems(prev => [...prev, item.id]);
      setStars(prev => prev - item.required);
      if (sounds.effects?.success) {
        sounds.effects.success.play();
      }
      saveProgress();
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h2" align="center" gutterBottom>
        My Garden 🌱
      </Typography>

      <Grid container spacing={4}>
        {/* Avatar Preview */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: '20px',
              backgroundColor: '#F0F7FF',
              textAlign: 'center',
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: '200px',
                  height: '200px',
                  margin: '0 auto',
                }}
              >
                {selectedItems.background && (
                  <Typography
                    variant="h1"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      fontSize: '120px',
                      zIndex: 1,
                    }}
                  >
                    {selectedItems.background.emoji}
                  </Typography>
                )}
                <Avatar
                  sx={{
                    width: '100%',
                    height: '100%',
                    fontSize: '80px',
                    backgroundColor: '#81C784',
                    position: 'relative',
                    zIndex: 2,
                  }}
                >
                  {selectedItems.hat?.emoji || '🙂'}
                </Avatar>
                {selectedItems.accessory && (
                  <Typography
                    variant="h1"
                    sx={{
                      position: 'absolute',
                      bottom: -10,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: '40px',
                      zIndex: 3,
                    }}
                  >
                    {selectedItems.accessory.emoji}
                  </Typography>
                )}
              </Box>
            </motion.div>

            <Typography variant="h5" sx={{ mt: 3 }}>
              Garden Level: {gardenLevel} 🌱
            </Typography>
            <Typography variant="h6">
              Stars: ⭐ {stars}
            </Typography>
          </Paper>
        </Grid>

        {/* Customization Options */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: '20px',
              backgroundColor: '#FFF',
            }}
          >
            {Object.entries(avatarItems).map(([category, items]) => (
              <Box key={category} sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ textTransform: 'capitalize' }}>
                  {category}
                </Typography>
                <Grid container spacing={2}>
                  {items.map((item) => (
                    <Grid item xs={6} sm={4} key={item.id}>
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Button
                          fullWidth
                          variant={selectedItems[category]?.id === item.id ? 'contained' : 'outlined'}
                          onClick={() => handleItemSelect(category, item)}
                          disabled={!unlockedItems.includes(item.id) && stars < item.required}
                          sx={{
                            p: 2,
                            borderRadius: '15px',
                            backgroundColor: unlockedItems.includes(item.id) ? '#81C784' : '#FFF',
                            opacity: unlockedItems.includes(item.id) ? 1 : 0.7,
                          }}
                        >
                          <Box>
                            <Typography variant="h4">{item.emoji}</Typography>
                            <Typography variant="body2">{item.name}</Typography>
                            {!unlockedItems.includes(item.id) && (
                              <Typography variant="caption" color="error">
                                Needs {item.required} ⭐
                              </Typography>
                            )}
                          </Box>
                        </Button>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Badges Section */}
        <Grid item xs={12}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: '20px',
              backgroundColor: '#FFF9C4',
            }}
          >
            <Typography variant="h4" gutterBottom>
              My Badges 🏆
            </Typography>
            <Grid container spacing={2}>
              {badges.map((badge) => (
                <Grid item xs={6} sm={3} key={badge.id}>
                  <Paper
                    elevation={earnedBadges.includes(badge.id) ? 3 : 1}
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      opacity: earnedBadges.includes(badge.id) ? 1 : 0.5,
                      backgroundColor: earnedBadges.includes(badge.id) ? '#FFD700' : '#FFF',
                    }}
                  >
                    <Typography variant="h3">{badge.emoji}</Typography>
                    <Typography variant="subtitle1">{badge.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {badge.description}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Unlock Animation */}
      <AnimatePresence>
        {showUnlock && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1000,
            }}
          >
            <Paper
              sx={{
                p: 4,
                textAlign: 'center',
                backgroundColor: '#FFF',
                borderRadius: '20px',
              }}
            >
              <Typography variant="h4">
                Keep practicing to unlock more items! 🌟
              </Typography>
              <Button
                variant="contained"
                onClick={() => setShowUnlock(false)}
                sx={{ mt: 2 }}
              >
                Got it!
              </Button>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}

export default AvatarCustomization; 