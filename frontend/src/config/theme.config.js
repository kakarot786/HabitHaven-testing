import { createTheme } from '@mui/material/styles';
import { colors, shadows } from '../styles';

const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary.main,
      light: colors.primary.light,
      dark: colors.primary.dark,
      contrastText: colors.primary.contrast,
    },
    secondary: {
      main: colors.secondary.main,
      light: colors.secondary.light,
      dark: colors.secondary.dark,
    },
    background: {
      default: colors.background.default, // sky-100
      paper: colors.background.paper, // white/75
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.accent,
    },
    info: {
      main: colors.status.info.main,
      light: colors.status.info.light,
      dark: colors.status.info.dark,
    },
    success: {
      main: colors.status.success.main,
      light: colors.status.success.light,
      dark: colors.status.success.dark,
    },
    warning: {
      main: colors.status.warning.main,
      light: colors.status.warning.light,
      dark: colors.status.warning.dark,
    },
    error: {
      main: colors.status.error.main,
      light: colors.status.error.light,
      dark: colors.status.error.dark,
    },
    divider: colors.border.main,
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h1: {
      color: colors.text.primary,
      fontWeight: 700,
    },
    h2: {
      color: colors.text.primary,
      fontWeight: 700,
    },
    h3: {
      color: colors.text.primary,
      fontWeight: 600,
    },
    h4: {
      color: colors.text.primary,
      fontWeight: 600,
    },
    h5: {
      color: colors.text.primary,
      fontWeight: 600,
    },
    h6: {
      color: colors.text.primary,
      fontWeight: 600,
    },
    body1: {
      color: colors.text.primary,
    },
    body2: {
      color: colors.text.primary,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
        },
        contained: {
          backgroundColor: colors.primary.main,
          color: colors.white,
          boxShadow: shadows.button.default,
          '&:hover': {
            backgroundColor: colors.primary.dark,
            boxShadow: shadows.button.hover,
          },
        },
        outlined: {
          borderColor: colors.primary.main,
          color: colors.primary.main,
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
            backgroundColor: 'rgba(2, 132, 199, 0.05)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: colors.background.paper,
          backdropFilter: 'blur(10px)',
          borderRadius: 12,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: colors.background.paper,
          backdropFilter: 'blur(10px)',
          borderRadius: 12,
          border: `1px solid ${colors.border.main}`,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.primary.main,
          boxShadow: shadows.md,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: colors.border.main,
              borderWidth: 2,
            },
            '&:hover fieldset': {
              borderColor: colors.border.hover,
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.primary.main,
            },
          },
          '& .MuiInputLabel-root': {
            color: colors.text.secondary,
            '&.Mui-focused': {
              color: colors.primary.main,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: colors.secondary.lighter,
          color: colors.primary.main,
          fontWeight: 500,
        },
      },
    },
  },
});

export default theme;
