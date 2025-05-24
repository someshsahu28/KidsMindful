import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Import Roboto font
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// Import responsive styles
import './styles/responsive.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF9AA2',
    },
    secondary: {
      main: '#FFDAC1',
    },
    background: {
      default: '#FFF5F5',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Comic Sans MS',
      'Comic Sans',
      'cursive',
    ].join(','),
    h1: {
      fontSize: {
        xs: '2rem',
        sm: '2.5rem',
        md: '3rem',
        lg: '3.5rem',
      },
      fontWeight: 700,
      color: '#444',
      lineHeight: 1.2,
    },
    h2: {
      fontSize: {
        xs: '1.6rem',
        sm: '1.8rem',
        md: '2rem',
        lg: '2.2rem',
      },
      fontWeight: 600,
      color: '#555',
      lineHeight: 1.3,
    },
    h5: {
      fontSize: {
        xs: '1.1rem',
        sm: '1.2rem',
        md: '1.3rem',
        lg: '1.4rem',
      },
      fontWeight: 500,
      color: '#666',
      lineHeight: 1.4,
    },
    body1: {
      fontSize: {
        xs: '0.9rem',
        sm: '1rem',
        md: '1.1rem',
        lg: '1.2rem',
      },
      color: '#666',
      lineHeight: 1.6,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          textTransform: 'none',
          fontSize: {
            xs: '0.9rem',
            sm: '1rem',
            md: '1.1rem',
          },
          padding: {
            xs: '6px 16px',
            sm: '8px 20px',
            md: '8px 24px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: {
            xs: 12,
            sm: 16,
          },
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          padding: {
            xs: '16px',
            sm: '24px',
            md: '32px',
          },
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
    <App />
    </ThemeProvider>
  </React.StrictMode>
);
