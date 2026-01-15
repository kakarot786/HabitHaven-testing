

import { colors } from './colors';
import { gradients } from './gradients';
import { shadows } from './shadows';

export const commonStyles = {
  pageBackground: {
    background: gradients.background.primary,
    minHeight: '100vh',
  },
  frostedGlassCard: {
    background: 'rgba(255, 255, 255, 0.75)', // white/75
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    border: `1px solid ${colors.border.main}`, // sky-300
    borderRadius: 4,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    borderRadius: 3,
    border: `1px solid ${colors.border.main}`, // sky-300
    boxShadow: shadows.card.default,
    '&:hover': {
      boxShadow: shadows.card.hover,
    },
  },
  primaryButton: {
    backgroundColor: '#0284c7', // sky-600
    color: colors.white,
    fontWeight: 600,
    borderRadius: 2,
    textTransform: 'none',
    boxShadow: shadows.button.default,
    '&:hover': {
      backgroundColor: '#0c4a6e', // sky-900
      boxShadow: shadows.button.hover,
      transform: 'translateY(-2px)',
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: shadows.button.active,
    },
    '&:disabled': {
      backgroundColor: colors.text.disabled,
      transform: 'none',
    },
    transition: 'all 0.3s ease',
  },
  outlinedButton: {
    borderColor: colors.primary.main,
    color: colors.primary.main,
    fontWeight: 600,
    borderRadius: 2,
    textTransform: 'none',
    borderWidth: 2,
    '&:hover': {
      borderWidth: 2,
      borderColor: colors.primary.dark,
      backgroundColor: 'rgba(2, 132, 199, 0.05)',
    },
  },
  textField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
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
  avatarGradient: {
    background: gradients.primary.main,
    boxShadow: shadows.avatar,
  },
  loadingScreen: {
    minHeight: '100vh',
    background: gradients.background.main,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    color: colors.primary.main,
    '&:hover': {
      backgroundColor: 'rgba(2, 132, 199, 0.08)',
    },
  },
  chip: {
    backgroundColor: colors.secondary.lighter,
    color: colors.primary.main,
    fontWeight: 500,
    borderRadius: 2,
  },
  divider: {
    borderColor: colors.border.main,
    my: 3,
  },
  paperContainer: {
    background: colors.background.paper,
    border: `2px solid ${colors.border.main}`,
    borderRadius: 4,
    backdropFilter: 'blur(10px)',
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: colors.text.primary,
    mb: 2,
  },
  accentText: {
    color: colors.text.accent,
    fontWeight: 500,
  },
  appBar: {
    background: gradients.primary.main,
    boxShadow: `0 4px 20px rgba(2, 132, 199, 0.2)`,
  },
  centeredContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  flexRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  hoverCard: {
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: shadows.lg,
    },
  },
  successBadge: {
    backgroundColor: colors.status.success.light,
    color: colors.status.success.dark,
    padding: '4px 12px',
    borderRadius: 2,
    fontWeight: 600,
  },
  errorBadge: {
    backgroundColor: colors.status.error.light,
    color: colors.status.error.dark,
    padding: '4px 12px',
    borderRadius: 2,
    fontWeight: 600,
  },
  inputAdornmentIcon: {
    color: colors.primary.main,
  },
  alertMessage: {
    borderRadius: 2,
    '& .MuiAlert-icon': {
      color: colors.status.error.main,
    },
  },
};

export default commonStyles;
