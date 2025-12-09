import { createTheme } from '@mui/material/styles';

/**
 * Custom theme configuration for Material-UI
 * Consistent with mobile app's plant-themed design
 */
export const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50', // Green for plant theme
      light: '#81C784',
      dark: '#388E3C',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#8BC34A',
      light: '#AED581',
      dark: '#689F38',
      contrastText: '#000000',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F5F5F5',
    },
    text: {
      primary: '#000000',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 400,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});
