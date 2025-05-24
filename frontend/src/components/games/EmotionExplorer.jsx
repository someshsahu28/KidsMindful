import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Button, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import sounds from '../../utils/sounds';

const LEVELS = {
  EASY: {
    name: 'Easy',
    emotions: ['Happy', 'Sad', 'Angry', 'Scared'],
    timeLimit: 20,
    color: '#98FB98',
    description: 'Basic emotions'
  },
  MEDIUM: {
    name: 'Medium',
    emotions: ['Happy', 'Sad', 'Angry', 'Scared', 'Excited', 'Calm'],
    timeLimit: 15,
    color: '#FFD700',
    description: 'More complex emotions'
  },
  HARD: {
    name: 'Hard',
    emotions: ['Happy', 'Sad', 'Angry', 'Scared', 'Excited', 'Calm'],
    timeLimit: 10,
    color: '#FF6B6B',
    description: 'All emotions with less time'
  }
};

const emotions = [
  {
    name: 'Happy',
    emoji: '😊',
    color: '#FFE66D',
    scenarios: [
      'Your friend shares their favorite toy with you',
      'You get to eat your favorite ice cream',
      'You win a game you were playing',
      'Your family takes you to the park'
    ]
  },
  {
    name: 'Sad',
    emoji: '😢',
    color: '#A7C5EB',
    scenarios: [
      'You lost your favorite toy',
      'Your friend couldn\'t come to play today',
      'You dropped your ice cream cone',
      'It\'s raining and you can\'t go outside'
    ]
  },
  {
    name: 'Angry',
    emoji: '😠',
    color: '#FF9AA2',
    scenarios: [
      'Someone broke your toy on purpose',
      'Your sibling won\'t share with you',
      'Someone cut in line in front of you',
      'You have to stop playing your game'
    ]
  },
  {
    name: 'Scared',
    emoji: '😨',
    color: '#B5EAD7',
    scenarios: [
      'You hear a loud thunder',
      'You see a big spider',
      'You\'re alone in a dark room',
      'You have to try something new'
    ]
  },
  {
    name: 'Excited',
    emoji: '🤩',
    color: '#FFB7EB',
    scenarios: [
      'It\'s your birthday tomorrow',
      'You\'re going on a vacation',
      'Your best friend is coming over',
      'You\'re getting a new pet'
    ]
  },
  {
    name: 'Calm',
    emoji: '😌',
    color: '#BAFFC9',
    scenarios: [
      'You\'re reading your favorite book',
      'You\'re drawing a picture',
      'You\'re listening to soft music',
      'You\'re taking deep breaths'
    ]
  }
];

function EmotionExplorer({ onGameComplete }) {
  const [currentScenario, setCurrentScenario] = useState('');
  const [correctEmotion, setCorrectEmotion] = useState(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [feedback, setFeedback] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(LEVELS.EASY);
  const [timeLeft, setTimeLeft] = useState(LEVELS.EASY.timeLimit);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (!gameOver) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setGameOver(true);
            sounds.effects.complete.play();
            onGameComplete(score);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearInterval(timer);
        if (sounds.effects) {
          Object.values(sounds.effects).forEach(sound => sound.stop());
        }
      };
    }
  }, [gameOver]);

  useEffect(() => {
    if (round <= 10 && !gameOver) {
      generateNewScenario();
    } else if (round > 10) {
      setGameOver(true);
      sounds.effects.complete.play();
      onGameComplete(score);
    }
  }, [round]);

  useEffect(() => {
    // Level progression
    if (consecutiveCorrect >= 3 && currentLevel === LEVELS.EASY) {
      setCurrentLevel(LEVELS.MEDIUM);
      setTimeLeft(LEVELS.MEDIUM.timeLimit);
      sounds.effects.success.play();
    } else if (consecutiveCorrect >= 5 && currentLevel === LEVELS.MEDIUM) {
      setCurrentLevel(LEVELS.HARD);
      setTimeLeft(LEVELS.HARD.timeLimit);
      sounds.effects.success.play();
    }
  }, [consecutiveCorrect]);

  const generateNewScenario = () => {
    sounds.effects.click.play();
    const availableEmotions = emotions.filter(emotion => 
      currentLevel.emotions.includes(emotion.name)
    );
    const emotion = availableEmotions[Math.floor(Math.random() * availableEmotions.length)];
    const scenario = emotion.scenarios[Math.floor(Math.random() * emotion.scenarios.length)];
    setCurrentScenario(scenario);
    setCorrectEmotion(emotion);
    setFeedback(null);
  };

  const handleEmotionSelect = (selectedEmotion) => {
    sounds.effects.click.play();
    
    if (selectedEmotion.name === correctEmotion.name) {
      sounds.effects.success.play();
      setFeedback({
        message: `Yes! This situation might make you feel ${selectedEmotion.name.toLowerCase()}!`,
        isCorrect: true,
        color: selectedEmotion.color
      });
      setScore(score + 1);
      setConsecutiveCorrect(prev => prev + 1);
    } else {
      sounds.effects.error.play();
      setFeedback({
        message: `This situation might make you feel ${correctEmotion.name.toLowerCase()}. It's okay to feel different emotions!`,
        isCorrect: false,
        color: correctEmotion.color
      });
      setConsecutiveCorrect(0);
    }

    setTimeout(() => {
      setRound(round + 1);
    }, 2000);
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '600px',
        backgroundColor: '#F5F5F5',
        borderRadius: '20px',
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ color: '#4A4A4A', mb: 3 }}>
        Emotion Explorer 🎭
      </Typography>

      {!gameOver && (
        <>
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ color: currentLevel.color, mb: 1 }}>
              Level: {currentLevel.name}
            </Typography>
            <Typography variant="body1" sx={{ color: '#666' }}>
              {currentLevel.description}
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Time Left: {timeLeft}s | Score: {score}/10
            </Typography>
          </Box>

      <Paper
        elevation={3}
        sx={{
          p: 4,
          my: 4,
          borderRadius: '20px',
          backgroundColor: '#FFF5F5',
          maxWidth: 600,
          mx: 'auto'
        }}
      >
        <Typography variant="h5" gutterBottom>
          How would you feel if...
        </Typography>
        <Typography variant="h4" sx={{ mb: 4, color: '#444' }}>
          {currentScenario}
        </Typography>
      </Paper>

      <Grid container spacing={2} justifyContent="center">
            {emotions
              .filter(emotion => currentLevel.emotions.includes(emotion.name))
              .map((emotion) => (
          <Grid item xs={6} sm={4} key={emotion.name}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="contained"
                onClick={() => handleEmotionSelect(emotion)}
                disabled={!!feedback}
                sx={{
                  width: '100%',
                  height: 120,
                  backgroundColor: emotion.color,
                  borderRadius: '20px',
                  flexDirection: 'column',
                  '&:hover': {
                    backgroundColor: emotion.color,
                    opacity: 0.9,
                  },
                }}
              >
                <Typography variant="h2" sx={{ fontSize: '40px', mb: 1 }}>
                  {emotion.emoji}
                </Typography>
                <Typography variant="h6">
                  {emotion.name}
                </Typography>
              </Button>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 3,
              mt: 4,
              backgroundColor: feedback.isCorrect ? '#E8F5E9' : '#FFF3E0',
              borderRadius: '20px'
            }}
          >
            <Typography variant="h5" sx={{ color: '#444' }}>
              {feedback.message}
            </Typography>
          </Paper>
        </motion.div>
          )}
        </>
      )}

      {gameOver && (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Game Over!
          </Typography>
          <Typography variant="h4" sx={{ mb: 4 }}>
            Final Score: {score}/10
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default EmotionExplorer; 