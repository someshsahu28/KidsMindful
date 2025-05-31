import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, Container, useTheme, useMediaQuery } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home';
import Activities from './pages/Activities';
import MoodTracker from './pages/MoodTracker';
import Games from './pages/Games';
import Help from './pages/Help';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import StoryMode from './components/stories/StoryMode';
import Rewards from './pages/Rewards';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/animations.css';

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Router>
      <AuthProvider>
        <Box 
          sx={{ 
            flexGrow: 1,
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: theme.palette.background.default
          }}
        >
          <Navbar />
          <Container 
            maxWidth="lg" 
            sx={{ 
              mt: { xs: 2, sm: 3, md: 4 },
              mb: { xs: 2, sm: 3, md: 4 },
              px: { xs: 2, sm: 3, md: 4 },
              flex: 1,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/activities" element={
                <ProtectedRoute>
                  <Activities />
                </ProtectedRoute>
              } />
              <Route path="/mood-tracker" element={
                <ProtectedRoute>
                  <MoodTracker />
                </ProtectedRoute>
              } />
              <Route path="/games" element={
                <ProtectedRoute>
                  <Games />
                </ProtectedRoute>
              } />
              <Route path="/help" element={<Help />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } />
              <Route path="/stories" element={
                <ProtectedRoute>
                  <StoryMode />
                </ProtectedRoute>
              } />
              <Route path="/rewards" element={
                <ProtectedRoute>
                  <Rewards />
                </ProtectedRoute>
              } />
            </Routes>
          </Container>
        </Box>
      </AuthProvider>
    </Router>
  );
}

export default App;
