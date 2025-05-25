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
  const [gameOver, setGameOver] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [currentLevelRounds, setCurrentLevelRounds] = useState(0);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [levelScores, setLevelScores] = useState({
    EASY: 0,
    MEDIUM: 0,
    HARD: 0
  });
  const [isAnswering, setIsAnswering] = useState(false);

  // Reset timer for each new round
  useEffect(() => {
    setTimeLeft(currentLevel.timeLimit);
  }, [round, currentLevel]);

  // Timer effect
  useEffect(() => {
    let timer;
    if (!gameOver && !showLevelComplete && !isAnswering) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleTimeOut();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
      if (sounds.effects) {
        Object.values(sounds.effects).forEach(sound => {
          if (sound && sound.stop) sound.stop();
        });
      }
    };
  }, [gameOver, showLevelComplete, isAnswering, round, currentLevel]);

  const handleTimeOut = () => {
    setIsAnswering(true);
    setFeedback({
      message: `Time's up! The emotion was ${correctEmotion.name.toLowerCase()}.`,
      isCorrect: false,
      color: correctEmotion.color
    });

    if (sounds.effects?.error) {
      sounds.effects.error.play();
    }

    // Move to next round after timeout
    setTimeout(() => {
      const nextLevelRounds = currentLevelRounds + 1;
      setCurrentLevelRounds(nextLevelRounds);

      if (nextLevelRounds >= 10) {
        handleLevelEnd();
      } else {
        setRound(prev => prev + 1);
        setIsAnswering(false);
        setTimeLeft(currentLevel.timeLimit);
        generateNewScenario();
      }
    }, 2000);
  };

  useEffect(() => {
    if (!gameOver && !showLevelComplete && !isAnswering) {
      generateNewScenario();
    }
  }, [round, currentLevel, showLevelComplete]);

  const startNextLevel = () => {
    let nextLevel;
    if (currentLevel === LEVELS.EASY) {
      nextLevel = LEVELS.MEDIUM;
    } else if (currentLevel === LEVELS.MEDIUM) {
      nextLevel = LEVELS.HARD;
    } else {
      finishGame();
      return;
    }

    setCurrentLevel(nextLevel);
    setTimeLeft(nextLevel.timeLimit);
    setRound(1);
    setCurrentLevelRounds(0);
    setScore(0);
    setShowLevelComplete(false);
    setIsAnswering(false);
    generateNewScenario();
  };

  const finishGame = () => {
    setGameOver(true);
    if (sounds.effects?.success) {
      const sound = sounds.effects.success;
      sound.play();
      setTimeout(() => {
        sound.stop();
      }, 2000);
    }
    const finalScore = Math.round((totalScore / 30) * 100);
    onGameComplete(finalScore);
  };

  const handleLevelEnd = () => {
    setShowLevelComplete(true);
    setLevelScores(prev => ({
      ...prev,
      [currentLevel.name.toUpperCase()]: score
    }));
    
    if (sounds.effects?.success) {
      const sound = sounds.effects.success;
      sound.play();
      setTimeout(() => {
        sound.stop();
      }, 2000);
    }

    if (currentLevel === LEVELS.HARD) {
      finishGame();
    }
  };

  const generateNewScenario = () => {
    if (sounds.effects?.click) {
      sounds.effects.click.play();
    }
    const availableEmotions = emotions.filter(emotion => 
      currentLevel.emotions.includes(emotion.name)
    );
    const emotion = availableEmotions[Math.floor(Math.random() * availableEmotions.length)];
    const scenario = emotion.scenarios[Math.floor(Math.random() * emotion.scenarios.length)];
    setCurrentScenario(scenario);
    setCorrectEmotion(emotion);
    setFeedback(null);
    setIsAnswering(false);
    setTimeLeft(currentLevel.timeLimit);
  };

  const handleEmotionSelect = (selectedEmotion) => {
    if (isAnswering) return;
    setIsAnswering(true);

    // Stop any playing sounds first
    if (sounds.effects) {
      Object.values(sounds.effects).forEach(sound => {
        if (sound && sound.stop) sound.stop();
      });
    }
    
    const isCorrect = selectedEmotion.name === correctEmotion.name;
    
    if (isCorrect) {
      setFeedback({
        message: `Yes! This situation might make you feel ${selectedEmotion.name.toLowerCase()}!`,
        isCorrect: true,
        color: selectedEmotion.color
      });
      setScore(prev => prev + 1);
      setTotalScore(prev => prev + 1);
      
      if (sounds.effects?.complete) {
        const sound = sounds.effects.complete;
        sound.play();
        setTimeout(() => {
          sound.stop();
        }, 2000);
      }
    } else {
      setFeedback({
        message: `This situation might make you feel ${correctEmotion.name.toLowerCase()}. It's okay to feel different emotions!`,
        isCorrect: false,
        color: correctEmotion.color
      });
      
      if (sounds.effects?.error) {
        sounds.effects.error.play();
      }
    }

    // Wait for sound and feedback before moving to next round
    setTimeout(() => {
      const nextLevelRounds = currentLevelRounds + 1;
      setCurrentLevelRounds(nextLevelRounds);

      if (nextLevelRounds >= 10) {
        handleLevelEnd();
      } else {
        setRound(prev => prev + 1);
        setIsAnswering(false);
        setTimeLeft(currentLevel.timeLimit);
        generateNewScenario();
      }
    }, 2500);
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

      {!gameOver && !showLevelComplete && (
        <>
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ color: currentLevel.color, mb: 1 }}>
              Level: {currentLevel.name}
            </Typography>
            <Typography variant="body1" sx={{ color: '#666' }}>
              {currentLevel.description}
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Time Left: {timeLeft}s | Round: {currentLevelRounds + 1}/10 | Level Score: {score}
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
                      disabled={!!feedback || isAnswering}
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

      {showLevelComplete && !gameOver && (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Level {currentLevel.name} Complete! 🎉
          </Typography>
          <Typography variant="h4" sx={{ mb: 4 }}>
            Level Score: {score}/10
          </Typography>
          <Button
            variant="contained"
            onClick={startNextLevel}
            sx={{
              backgroundColor: '#FFB7EB',
              color: '#444',
              '&:hover': {
                backgroundColor: '#FF9AA2',
              },
              padding: '12px 24px',
              fontSize: '1.2rem'
            }}
          >
            {currentLevel === LEVELS.HARD ? 'See Final Score' : `Start ${currentLevel === LEVELS.EASY ? 'Medium' : 'Hard'} Level`}
          </Button>
        </Box>
      )}

      {gameOver && (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Game Complete! 🎉
          </Typography>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Easy Level Score: {levelScores.EASY}/10
          </Typography>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Medium Level Score: {levelScores.MEDIUM}/10
          </Typography>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Hard Level Score: {levelScores.HARD}/10
          </Typography>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Total Score: {totalScore}/30
          </Typography>
          <Typography variant="h4" sx={{ mb: 4 }}>
            Final Score: {Math.round((totalScore / 30) * 100)}%
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default EmotionExplorer; 