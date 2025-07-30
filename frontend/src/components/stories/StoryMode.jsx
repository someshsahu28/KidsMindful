import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Box, 
  IconButton, 
  Paper, 
  TextField, 
  Button 
} from '@mui/material';
import { 
  ArrowBack, 
  Send, 
  VolumeUp 
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import sounds from '../../utils/sounds';

const stories = [
  {
    id: 1,
    title: "The Brave Little Cloud",
    emoji: "☁️",
    background: "linear-gradient(135deg, #B2EBF2 0%, #80DEEA 100%)",
    scenes: [
      {
        text: "Once there was a little cloud who was afraid of making rain...",
        animation: "float",
        character: "☁️",
        voice: "cloud_voice",
        effects: ["✨", "💫"]
      },
      {
        text: "The sun encouraged the cloud, 'You can do it!'",
        animation: "shine",
        character: "☀️",
        voice: "sun_voice",
        effects: ["🌟", "⚡"]
      },
      {
        text: "With courage, the little cloud made a beautiful rainbow!",
        animation: "rainbow",
        character: "🌈",
        voice: "cloud_voice",
        effects: ["🌈", "💫", "✨"]
      }
    ]
  },
  {
    id: 2,
    title: "The Dancing Tree",
    emoji: "🌳",
    background: "linear-gradient(135deg, #A5D6A7 0%, #81C784 100%)",
    scenes: [
      {
        text: "In a magical forest, there was a tree that loved to dance...",
        animation: "sway",
        character: "🌳",
        voice: "tree_voice",
        effects: ["🍃", "🌿"]
      },
      {
        text: "The wind whispered, 'Let's dance together!'",
        animation: "wind",
        character: "🌬️",
        voice: "wind_voice",
        effects: ["💨", "🍃"]
      },
      {
        text: "And together they created the most beautiful dance!",
        animation: "dance",
        character: "🌳",
        voice: "tree_voice",
        effects: ["✨", "🎵", "🎶"]
      }
    ]
  },
  {
    id: 3,
    title: "The Friendly Stars",
    emoji: "⭐",
    background: "linear-gradient(135deg, #9575CD 0%, #7E57C2 100%)",
    scenes: [
      {
        text: "High in the night sky, a lonely star twinkled by itself...",
        animation: "twinkle",
        character: "⭐",
        voice: "star_voice",
        effects: ["✨", "💫"]
      },
      {
        text: "The moon noticed and called other stars to join...",
        animation: "rise",
        character: "🌙",
        voice: "moon_voice",
        effects: ["⭐", "🌟"]
      },
      {
        text: "Soon the whole sky was filled with dancing stars!",
        animation: "sparkle",
        character: "🌠",
        voice: "star_voice",
        effects: ["⭐", "🌟", "✨", "💫"]
      }
    ]
  },
  {
    id: 4,
    title: "The Magic Garden",
    emoji: "🌺",
    background: "linear-gradient(135deg, #FF9AA2 0%, #FF8A80 100%)",
    scenes: [
      {
        text: "In a tiny garden, a magical seed began to grow...",
        animation: "grow",
        character: "🌱",
        voice: "garden_voice",
        effects: ["✨", "💫"]
      },
      {
        text: "The butterflies came to sprinkle their magic dust...",
        animation: "flutter",
        character: "🦋",
        voice: "butterfly_voice",
        effects: ["✨", "🌸"]
      },
      {
        text: "And suddenly, the whole garden burst into colorful blooms!",
        animation: "bloom",
        character: "🌺",
        voice: "garden_voice",
        effects: ["🌸", "🌺", "🌹", "🌷"]
      }
    ]
  },
  {
    id: 5,
    title: "Create Your Own Story",
    emoji: "🤖",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    isAI: true,
    description: "Tell me what story you'd like!"
  }
];

function StoryMode() {
  const [currentStory, setCurrentStory] = useState(null);
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showEffects, setShowEffects] = useState(true);
  const [showAIChat, setShowAIChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (showAIChat && messages.length === 0) {
      setMessages([{
        id: 1,
        type: 'bot',
        content: "Hi! I'm your story assistant. Tell me what kind of story you'd like me to create for you!",
        timestamp: new Date()
      }]);
    }
  }, [showAIChat]);

  const handleStorySelect = (story) => {
    if (story.isAI) {
      setShowAIChat(true);
      return;
    }
    setCurrentStory(story);
    setCurrentScene(0);
    setIsPlaying(true);
    if (sounds.effects?.click) {
      sounds.effects.click.play();
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage(''); // Clear input immediately
    setIsLoading(true);

    try {
      const response = await fetch('https://kidsmindful.onrender.com/api/ai/generate-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: userMessage.content, // Use the saved content
          ageGroup: 'children aged 5-12',
          storyLength: 'medium (300-500 words)',
          theme: 'adventure and friendship'
        })
      });

      const data = await response.json();

      if (data.success) {
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: data.data.story,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error generating story:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "Sorry, I couldn't generate a story right now. Please try again!",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleBackToStories = () => {
    setShowAIChat(false);
    setMessages([]);
    setCurrentStory(null);
    setIsPlaying(false);
    setCurrentScene(0);
  };

  const handleNextScene = () => {
    if (currentScene < currentStory.scenes.length - 1) {
      setCurrentScene(currentScene + 1);
      if (sounds.effects?.page) {
        sounds.effects.page.play();
      }
    } else {
      setIsPlaying(false);
      setCurrentStory(null);
      setCurrentScene(0);
    }
  };

  // AI Chat Interface
  if (showAIChat) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <IconButton onClick={handleBackToStories} sx={{ mr: 2 }}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h4" sx={{ color: '#4A4A4A', fontWeight: 'bold' }}>
              Create Your Story 🤖
            </Typography>
          </Box>

          <Paper
            elevation={3}
            sx={{
              height: '70vh',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '15px',
              overflow: 'hidden'
            }}
          >
            <Box
              sx={{
                flex: 1,
                overflowY: 'auto',
                p: 3,
                background: '#f8f9fa'
              }}
            >
              {messages.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    display: 'flex',
                    justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                    mb: 2
                  }}
                >
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      maxWidth: '70%',
                      backgroundColor: message.type === 'user' ? '#f5f5f5' : 'white',
                      color: message.type === 'user' ? '#000' : '#333',
                      borderRadius: '18px',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {message.type === 'bot' ? (
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => (
                            <Typography variant="body1" sx={{ mb: 1 }}>
                              {children}
                            </Typography>
                          ),
                          strong: ({ children }) => (
                            <Typography component="span" sx={{ fontWeight: 'bold', color: '#000' }}>
                              {children}
                            </Typography>
                          ),
                          em: ({ children }) => (
                            <Typography component="span" sx={{ fontStyle: 'italic' }}>
                              {children}
                            </Typography>
                          )
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    ) : (
                      <Typography variant="body1" sx={{ fontWeight: 'normal' }}>
                        {message.content}
                      </Typography>
                    )}
                  </Paper>
                </Box>
              ))}
              {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      backgroundColor: 'white',
                      borderRadius: '18px'
                    }}
                  >
                    <Typography variant="body1" sx={{ fontStyle: 'italic', color: '#666' }}>
                      Creating your story...
                    </Typography>
                  </Paper>
                </Box>
              )}
            </Box>

            <Box
              sx={{
                p: 3,
                backgroundColor: 'white',
                borderTop: '1px solid #ddd',
                display: 'flex',
                gap: 2
              }}
            >
              <TextField
                fullWidth
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Tell me what story you'd like..."
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '25px'
                  }
                }}
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading}
                variant="contained"
                sx={{
                  borderRadius: '25px',
                  px: 4,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              >
                Send
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    );
  }

  const playVoice = () => {
    const currentVoice = currentStory.scenes[currentScene].voice;
    if (sounds.voices && sounds.voices[currentVoice]) {
      sounds.voices[currentVoice].play();
    }
  };

  const getAnimationVariants = (type) => {
    switch (type) {
      case 'float':
        return {
          animate: {
            y: [0, -20, 0],
            transition: { duration: 2, repeat: Infinity }
          }
        };
      case 'shine':
        return {
          animate: {
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            transition: { duration: 3, repeat: Infinity }
          }
        };
      case 'rainbow':
        return {
          animate: {
            scale: [0, 1],
            opacity: [0, 1],
            transition: { duration: 1 }
          }
        };
      case 'sway':
        return {
          animate: {
            rotate: [-5, 5],
            transition: { duration: 2, repeat: Infinity, repeatType: "reverse" }
          }
        };
      case 'wind':
        return {
          animate: {
            x: [-20, 20],
            opacity: [0.5, 1],
            transition: { duration: 1.5, repeat: Infinity, repeatType: "reverse" }
          }
        };
      case 'dance':
        return {
          animate: {
            rotate: [-10, 10],
            scale: [0.9, 1.1],
            transition: { duration: 1, repeat: Infinity, repeatType: "reverse" }
          }
        };
      case 'twinkle':
        return {
          animate: {
            scale: [0.8, 1.2, 0.8],
            opacity: [0.5, 1, 0.5],
            transition: { duration: 1.5, repeat: Infinity }
          }
        };
      case 'rise':
        return {
          animate: {
            y: [20, -20],
            scale: [0.9, 1.1],
            transition: { duration: 2, repeat: Infinity, repeatType: "reverse" }
          }
        };
      case 'sparkle':
        return {
          animate: {
            rotate: [0, 360],
            scale: [0.8, 1.2],
            transition: { duration: 2, repeat: Infinity }
          }
        };
      case 'grow':
        return {
          animate: {
            scale: [0.5, 1.2],
            y: [20, -10],
            transition: { duration: 2, repeat: Infinity, repeatType: "reverse" }
          }
        };
      case 'flutter':
        return {
          animate: {
            x: [-20, 20],
            y: [-10, 10],
            rotate: [-20, 20],
            transition: { duration: 2, repeat: Infinity, repeatType: "reverse" }
          }
        };
      case 'bloom':
        return {
          animate: {
            scale: [0.8, 1.3],
            rotate: [0, 360],
            transition: { duration: 3, repeat: Infinity }
          }
        };
      default:
        return {};
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography 
          variant="h2" 
          align="center" 
          gutterBottom
          sx={{ 
            color: '#4A4A4A',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          Interactive Stories 📚
        </Typography>

        <AnimatePresence mode="wait">
          {!currentStory ? (
            <Grid container spacing={3} justifyContent="center">
              {stories.map((story) => (
                <Grid item xs={12} sm={6} md={story.id === 5 ? 12 : 6} key={story.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    whileHover={{ scale: 1.05 }}
                    style={{ 
                      display: 'flex', 
                      justifyContent: story.id === 5 ? 'center' : 'stretch' 
                    }}
                  >
                    <Paper
                      elevation={3}
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: story.background,
                        borderRadius: '15px',
                        position: 'relative',
                        overflow: 'hidden',
                        width: story.id === 5 ? '400px' : '100%',
                        maxWidth: story.id === 5 ? '400px' : 'none'
                      }}
                      onClick={() => handleStorySelect(story)}
                    >
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <Typography variant="h1" sx={{ fontSize: '4rem', mb: 2 }}>
                          {story.emoji}
                        </Typography>
                      </motion.div>
                      <Typography variant="h5" gutterBottom sx={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
                        {story.title}
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                        {story.isAI ? story.description : 'Click to start the story!'}
                      </Typography>
                      {story.isAI && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            borderRadius: '15px',
                            px: 2,
                            py: 0.5
                          }}
                        >
                          <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
                            AI Powered
                          </Typography>
                        </Box>
                      )}
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  minHeight: '400px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  background: currentStory.background,
                  borderRadius: '20px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Typography variant="h4" gutterBottom sx={{ color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
                  {currentStory.title}
                </Typography>
                
                <Box sx={{ my: 4, textAlign: 'center', position: 'relative' }}>
                  <motion.div
                    {...getAnimationVariants(currentStory.scenes[currentScene].animation)}
                  >
                    <Typography variant="h1" sx={{ fontSize: '5rem', mb: 3 }}>
                      {currentStory.scenes[currentScene].character}
                    </Typography>
                  </motion.div>

                  {/* Floating Effects */}
                  {showEffects && currentStory.scenes[currentScene].effects.map((effect, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: 1, 
                        scale: 1,
                        x: Math.random() * 200 - 100,
                        y: Math.random() * 200 - 100
                      }}
                      transition={{ duration: 2 }}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        fontSize: '2rem'
                      }}
                    >
                      {effect}
                    </motion.div>
                  ))}
                  
                  <Box sx={{ position: 'relative', mb: 4, maxWidth: '600px', mx: 'auto' }}>
                    <Typography variant="h5" sx={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
                      {currentStory.scenes[currentScene].text}
                    </Typography>
                    <IconButton 
                      onClick={playVoice}
                      sx={{ 
                        position: 'absolute',
                        right: -40,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'white'
                      }}
                    >
                      <VolumeUp />
                    </IconButton>
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  onClick={handleNextScene}
                  sx={{
                    mt: 'auto',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    color: '#444',
                    borderRadius: '25px',
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,1)'
                    }
                  }}
                >
                  {currentScene < currentStory.scenes.length - 1 ? 'Next Page 📖' : 'Finish Story ⭐'}
                </Button>
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Container>
  );
}

export default StoryMode; 
