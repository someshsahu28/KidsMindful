import { useState, useEffect } from 'react';
import { Grid, Card, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { soundManager } from '../../utils/soundManager';

function MemoryGame({ onGameComplete }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [moves, setMoves] = useState(0);

  const emojis = ['🌈', '🌞', '🌺', '🦋', '🐱', '🐶', '🦁', '🐼'];
  const cardPairs = [...emojis, ...emojis];

  useEffect(() => {
    initializeGame();
    // Cleanup sounds when component unmounts
    return () => {
      soundManager.stopAllSounds();
    };
  }, []);

  const initializeGame = () => {
    const shuffledCards = cardPairs
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isSolved: false,
      }));
    setCards(shuffledCards);
    setFlipped([]);
    setSolved([]);
    setMoves(0);
  };

  const handleCardClick = (index) => {
    if (
      flipped.length === 2 ||
      disabled ||
      flipped.includes(index) ||
      solved.includes(index)
    ) {
      return;
    }

    soundManager.playClickSound();
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setDisabled(true);
      setMoves(moves + 1);

      const [first, second] = newFlipped;
      if (cards[first].emoji === cards[second].emoji) {
        soundManager.playMatchSound();
        setSolved([...solved, first, second]);
        setFlipped([]);
        setDisabled(false);

        if (solved.length + 2 === cards.length) {
          onGameComplete(moves + 1);
        }
      } else {
        soundManager.playErrorSound();
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  return (
    <Grid container spacing={3} sx={{ p: 2 }}>
      {cards.map((card, index) => (
        <Grid item xs={3} sm={3} key={card.id}>
          <motion.div 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.95 }}
            animate={{
              rotateY: solved.includes(index) || flipped.includes(index) ? 180 : 0,
            }}
            transition={{ duration: 0.6 }}
          >
            <Card
              onClick={() => handleCardClick(index)}
              sx={{
                height: 150,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                backgroundColor: solved.includes(index) ? '#98FB98' : 
                               flipped.includes(index) ? '#FFB7B2' : '#FF9AA2',
                transition: 'all 0.3s ease',
                borderRadius: '16px',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                perspective: '1000px',
              }}
            >
              <Typography variant="h1" sx={{ fontSize: '80px' }}>
                {solved.includes(index) || flipped.includes(index)
                  ? card.emoji
                  : '❓'}
              </Typography>
            </Card>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );
}

export default MemoryGame; 