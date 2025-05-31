import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Button, 
  Box, 
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
  Container,
  Alert
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const menuItems = [
    { text: 'Fun Activities 🎨', path: '/activities', requiresAuth: true },
    { text: 'Mood Tracker 😊', path: '/mood-tracker', requiresAuth: true },
    { text: 'Games 🎮', path: '/games', requiresAuth: true },
    { text: 'Stories 📚', path: '/stories', requiresAuth: true },
    { text: 'Rewards 🏆', path: '/rewards', requiresAuth: true },
    { text: 'Need Help? 💭', path: '/help', requiresAuth: false }
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path, requiresAuth) => {
    if (requiresAuth && !user) {
      alert('Please login or sign up to access this feature! 🔒');
      return;
    }
    navigate(path);
    if (mobileOpen) {
      handleDrawerToggle();
    }
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(0,0,0,0.1)'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar 
          sx={{ 
            justifyContent: 'space-between',
            py: { xs: 1, md: 2 },
            px: { xs: 1, sm: 2, md: 3 }
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography 
              variant="h6" 
              component={Link} 
              to="/" 
              sx={{ 
                textDecoration: 'none', 
                color: '#444',
                fontWeight: 900,
                fontSize: { xs: '2.2rem', sm: '2.5rem', md: '2.8rem' },
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                letterSpacing: '1px',
                textTransform: 'none',
                fontFamily: "'Comic Sans MS', 'Comic Sans', cursive",
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                '&:hover': {
                  color: '#FF9AA2',
                  transform: 'scale(1.02)',
                  transition: 'all 0.3s ease'
                }
              }}
            >
              KidsMindful
              <Box
                component="img"
                src="/images/rainbow.svg"
                alt="Rainbow"
                sx={{
                  width: { xs: '40px', sm: '45px', md: '50px' },
                  height: 'auto',
                  marginLeft: { xs: 1, sm: 1.5 }
                }}
              />
            </Typography>
          </motion.div>

          {isMobile ? (
            <IconButton
              onClick={handleDrawerToggle}
              sx={{ 
                color: '#444',
                '&:hover': {
                  backgroundColor: 'rgba(255,154,162,0.1)'
                }
              }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box 
              sx={{ 
                display: 'flex', 
                gap: { sm: 1, md: 2 },
                alignItems: 'center'
              }}
            >
              <Button
                onClick={() => handleNavigation('/', false)}
                sx={{ 
                  color: '#444',
                  backgroundColor: 'white',
                  borderRadius: '50px',
                  padding: '8px 20px',
                  fontSize: '1rem',
                  fontWeight: 500,
                  textTransform: 'none',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  '&:hover': {
                    backgroundColor: '#f8f8f8',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }
                }}
              >
                Home 🏠
              </Button>
              {menuItems.map((item) => (
                <motion.div 
                  key={item.path} 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => handleNavigation(item.path, item.requiresAuth)}
                    sx={{ 
                      color: '#444',
                      backgroundColor: 'white',
                      borderRadius: '50px',
                      padding: '8px 20px',
                      fontSize: '1rem',
                      fontWeight: 500,
                      textTransform: 'none',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                      '&:hover': {
                        backgroundColor: '#f8f8f8',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    {item.text}
                  </Button>
                </motion.div>
              ))}
            </Box>
          )}

          <Drawer
            anchor={isMobile ? 'right' : 'top'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            variant="temporary"
            PaperProps={{
              sx: {
                width: isMobile ? '100%' : 'auto',
                height: isMobile ? '100%' : 'auto',
                backgroundColor: 'transparent',
                boxShadow: 'none'
              }
            }}
            ModalProps={{
              keepMounted: true,
            }}
          >
            <Box 
              sx={{ 
                width: '100%', 
                height: '100%',
                backgroundColor: '#FFF5F5',
                display: 'flex',
                flexDirection: 'column',
                pt: 2
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, mb: 2 }}>
                <IconButton onClick={handleDrawerToggle}>
                  <CloseIcon />
                </IconButton>
              </Box>
              {!user && (
                <Alert 
                  severity="info" 
                  sx={{ 
                    mx: 2, 
                    mb: 2,
                    borderRadius: '12px',
                    backgroundColor: 'rgba(229, 246, 253, 0.9)'
                  }}
                >
                  Please sign in to access all features! 🎯
                </Alert>
              )}
              <List sx={{ flex: 1 }}>
                <ListItem 
                  onClick={() => handleNavigation('/', false)}
                  sx={{ 
                    py: 2,
                    color: 'inherit',
                    textDecoration: 'none',
                    backgroundColor: location.pathname === '/' ? 'rgba(255,154,162,0.1)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255,154,162,0.1)',
                    },
                    borderRadius: 2,
                    mx: 1,
                    mb: 1,
                    cursor: 'pointer'
                  }}
                >
                  <ListItemText 
                    primary="Home 🏠"
                    primaryTypographyProps={{
                      sx: { 
                        fontWeight: location.pathname === '/' ? 'bold' : 'normal',
                        fontSize: '1.2rem'
                      }
                    }}
                  />
                </ListItem>
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ListItem 
                      onClick={() => handleNavigation(item.path, item.requiresAuth)}
                      sx={{ 
                        py: 2,
                        color: 'inherit',
                        textDecoration: 'none',
                        backgroundColor: location.pathname === item.path ? 'rgba(255,154,162,0.1)' : 'transparent',
                        '&:hover': {
                          backgroundColor: 'rgba(255,154,162,0.1)',
                        },
                        borderRadius: 2,
                        mx: 1,
                        mb: 1,
                        cursor: 'pointer'
                      }}
                    >
                      <ListItemText 
                        primary={item.text}
                        primaryTypographyProps={{
                          sx: { 
                            fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                            fontSize: '1.2rem'
                          }
                        }}
                      />
                    </ListItem>
                  </motion.div>
                ))}
              </List>
            </Box>
          </Drawer>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navigation; 