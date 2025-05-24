import { Box, Typography, Grid, Paper, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    title: "Dance Party 🎉",
    description: "Join our improved dance party with better animations and sound control!",
    path: "/activities",
    color: "#FFE5E5"
  },
  {
    title: "Story Mode 📚",
    description: "Experience interactive stories with 'The Brave Little Star' and 'The Friendly Forest'",
    path: "/stories",
    color: "#E5FFE5"
  },
  {
    title: "My Garden 🌱",
    description: "Customize your avatar and earn rewards in your virtual garden",
    path: "/profile",
    color: "#E5E5FF"
  },
  {
    title: "Animal Sound Game 🐾",
    description: "Play the improved animal sound game with better sound management",
    path: "/games",
    color: "#FFE5FF"
  },
  {
    title: "Yoga Activities 🧘‍♀️",
    description: "Try our enhanced yoga activities with better poses and sounds",
    path: "/activities",
    color: "#FFFFE5"
  }
];

function NewFeatures() {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h2" align="center" gutterBottom sx={{ mb: 4 }}>
        New Features! ✨
      </Typography>

      <Grid container spacing={3}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  height: '100%',
                  backgroundColor: feature.color,
                  borderRadius: '20px',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  }
                }}
                onClick={() => navigate(feature.path)}
              >
                <Typography variant="h4" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {feature.description}
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: 2,
                    backgroundColor: '#6A1B9A',
                    '&:hover': {
                      backgroundColor: '#4A148C',
                    }
                  }}
                >
                  Try Now
                </Button>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default NewFeatures; 