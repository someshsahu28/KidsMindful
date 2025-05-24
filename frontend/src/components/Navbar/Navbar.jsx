import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem, Avatar } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import MoodIcon from '@mui/icons-material/Mood';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const StyledAppBar = styled(AppBar)`
  background: linear-gradient(90deg, #FF9AA2 0%, #FFB7B2 50%, #FFDAC1 100%);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const StyledButton = styled(Button)`
  margin: 0 8px;
  border-radius: 20px;
  text-transform: none;
  font-size: 1.1rem;
  padding: 6px 16px;
  color: #444;
  background-color: rgba(255, 255, 255, 0.9);
  &:hover {
    background-color: rgba(255, 255, 255, 1);
    transform: scale(1.05);
  }
`;

const Logo = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  text-decoration: none !important;
`;

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const getAvatarContent = () => {
    if (user?.gender === 'boy') {
      return '👦';
    } else if (user?.gender === 'girl') {
      return '👧';
    }
    return '😊';
  };

  const getAvatarBackground = () => {
    if (user?.gender === 'boy') {
      return 'linear-gradient(135deg, #64B5F6 0%, #1976D2 100%)';
    } else if (user?.gender === 'girl') {
      return 'linear-gradient(135deg, #F06292 0%, #D81B60 100%)';
    }
    return 'linear-gradient(135deg, #81C784 0%, #43A047 100%)';
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  return (
    <StyledAppBar position="static">
      <Toolbar>
        <Logo component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Box
              component="img"
              src="/logo.png"
              alt="KidsMindful Logo"
              onError={(e) => {
                e.target.style.display = 'none';
                const moodIcon = document.createElement('span');
                moodIcon.innerHTML = '🌈';
                moodIcon.style.fontSize = '2rem';
                e.target.parentNode.appendChild(moodIcon);
              }}
              sx={{
                height: 40,
                width: 'auto',
              }}
            />
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 'bold', 
                color: '#444',
                textShadow: '1px 1px 2px rgba(255,255,255,0.5)',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              KidsMindful
            </Typography>
          </Box>
        </Logo>

        {user ? (
          <>
            <StyledButton component={Link} to="/">
              Home 🏠
            </StyledButton>
            <StyledButton component={Link} to="/activities">
              Fun Activities 🎨
            </StyledButton>
            <StyledButton component={Link} to="/mood-tracker">
              Mood Tracker 😊
            </StyledButton>
            <StyledButton component={Link} to="/games">
              Games 🎮
            </StyledButton>
            <StyledButton component={Link} to="/stories">
              Stories 📖
            </StyledButton>
            <StyledButton component={Link} to="/rewards">
              Rewards 🏆
            </StyledButton>
            <StyledButton component={Link} to="/help">
              Need Help? 💭
            </StyledButton>
            <Button
              onClick={handleMenuOpen}
              sx={{
                ml: 2,
                color: '#444',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                backgroundColor: 'rgba(255,255,255,0.9)',
                px: 2,
                py: 1,
                borderRadius: '20px',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,1)',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              <Avatar
                sx={{
                  width: 35,
                  height: 35,
                  background: getAvatarBackground(),
                  fontSize: '1.2rem',
                  border: '2px solid white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                {getAvatarContent()}
              </Avatar>
              <Typography sx={{ fontWeight: 500 }}>{user.name}</Typography>
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              PaperProps={{
                sx: {
                  mt: 1,
                  borderRadius: '15px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }
              }}
            >
              <MenuItem 
                onClick={handleLogout}
                sx={{
                  borderRadius: '8px',
                  m: 0.5,
                  px: 2,
                  py: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(255,0,0,0.1)',
                  }
                }}
              >
                <Typography sx={{ color: '#d32f2f' }}>Logout</Typography>
              </MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <StyledButton component={Link} to="/login">
              Login
            </StyledButton>
            <StyledButton
              component={Link}
              to="/register"
              sx={{
                backgroundColor: '#FF9AA2',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#FFB7B2',
                }
              }}
            >
              Sign Up
            </StyledButton>
          </>
        )}
      </Toolbar>
    </StyledAppBar>
  );
}

export default Navbar; 