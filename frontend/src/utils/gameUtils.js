import sounds from './sounds';

export const playGameSounds = {
  click: () => {
    try {
      sounds.effects.click.play();
    } catch (error) {
      console.warn('Error playing click sound:', error);
    }
  },

  success: () => {
    try {
      sounds.effects.success.play();
    } catch (error) {
      console.warn('Error playing success sound:', error);
    }
  },

  error: () => {
    try {
      sounds.effects.error.play();
    } catch (error) {
      console.warn('Error playing error sound:', error);
    }
  },

  complete: () => {
    try {
      sounds.effects.complete.play();
    } catch (error) {
      console.warn('Error playing complete sound:', error);
    }
  },

  match: () => {
    try {
      sounds.match.play();
    } catch (error) {
      console.warn('Error playing match sound:', error);
    }
  }
};

export const GAME_LEVELS = {
  EASY: {
    name: 'Easy',
    color: '#98FB98',
    requiredScore: 70, // Percentage required to advance
    speedMultiplier: 1
  },
  MEDIUM: {
    name: 'Medium',
    color: '#FFD700',
    requiredScore: 75,
    speedMultiplier: 0.8
  },
  HARD: {
    name: 'Hard',
    color: '#FF6B6B',
    requiredScore: 80,
    speedMultiplier: 0.6
  }
};

export const calculateLevelProgress = (score, maxScore, currentLevel) => {
  const percentage = Math.floor((score / maxScore) * 100);
  const passed = percentage >= currentLevel.requiredScore;
  return { percentage, passed };
};

export const getNextLevel = (currentLevel) => {
  switch (currentLevel) {
    case GAME_LEVELS.EASY:
      return GAME_LEVELS.MEDIUM;
    case GAME_LEVELS.MEDIUM:
      return GAME_LEVELS.HARD;
    default:
      return null;
  }
};

export const GameStatus = {
  PLAYING: 'playing',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  GAME_OVER: 'game_over'
}; 